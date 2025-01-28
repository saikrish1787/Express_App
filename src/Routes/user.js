const User = require('../Database/Schema/user.js');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const { Strategy } = require('passport-local');
const { validationResult, checkSchema } = require('express-validator');
const { createUpdateCartSchema } = require('../utils/validationSchemas.js');
const Product = require('../Database/Schema/product.js');

//?Passport authenticate config

passport.use(
	new Strategy(async (name, password, done) => {
		try {
			const user = await getUser(name, password);
			if (user.length) {
				done(null, user[0]);
			} else {
				throw new Error('User not found');
			}
		} catch (err) {
			done(err, null);
		}
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await getUserById(id);
		if (!user) throw new Error('User not found');
		done(null, user);
	} catch (e) {
		done(err, null);
	}
});

//? Helper functions goes here

/**
 * Get the user by ID
 * @param {number} id
 * @returns {object} user
 */
async function getUserById(id) {
	if (!id) {
		return;
	}
	let user = User.findById(id, (err, docs) => {
		if (err) {
			console.error(err);
		}
		if (docs) {
			return docs;
		}
	})
		.clone()
		.catch((errs) => console.error(errs));
	return user;
}

/**
 *This function will return the all available user.
 * @returns {[object]} user
 */
async function getAllUsers() {
	try {
		const user = await User.find();
		return user;
	} catch (e) {
		return e.message;
	}
}
/**
 * This function will delete the user.
 * @param {number} userId  ID of the user to be Deleted.
 */
async function deleteUser(userId) {
	try {
		const result = await User.deleteOne({ _id: userId + '' });
		return result;
	} catch (e) {
		console.error(e);
		return e;
	}
}

/**
 * Creates a new user
 * @param {object} data
 */
async function createUser(data) {
	try {
		const user = await User.create({
			name: data.name,
			age: data.age,
			email: data.email,
			password: data.password,
		});
		const obj = {
			id: user._id,
			message: 'User created successfully',
		};
		return obj;
	} catch (e) {
		console.error(e.message);
	}
}

/**
 * Get's the user using name and password
 * @param {string} name
 * @param {string} password
 * @returns {object} user
 */
async function getUser(name, password) {
	try {
		//Converting name and password to String
		let user = await User.find({ name: name + '', password: password + '' }, (err, docs) => {
			if (docs.length) {
				return docs;
			} else {
				console.error(err);
			}
		})
			.clone()
			.catch(function (e) {
				console.error(e);
			});
		if (user.length) {
			return user;
		} else {
			return [];
		}
	} catch (e) {
		console.error(e);
	}
}

//? User Routes goes here

router.get('/get', async (req, res) => {
	const body = req.body;
	if (body && body.id) {
		const user = await User.findById(body.id);
		res.send(user);
	} else {
		getAllUsers().then((_res) => res.send(_res));
	}
});

router.post('/create', async (req, res) => {
	try {
		const body = req.body;
		//Checking for the name, if it is already exist.
		const existingUser = await User.findOne({ name: body.name });
		if (existingUser) {
			res.status(400).send('Username already exists...');
		} else {
			if (body.name && body.password && typeof body.age === 'number') {
				createUser(body).then((_res) => res.send(_res));
			} else {
				res.send('Something went wrong');
			}
		}
	} catch (e) {
		console.error(e);
	}
});

router.delete('/delete', async (req, res) => {
	if (req.body && req.body.id) {
		try {
			const deleted = await deleteUser(req.body.id);
			if (deleted.acknowledged) {
				res.send(deleted.deletedCount + ' User deleted successfully');
			} else {
				res.status(500).send('Something went wrong');
			}
		} catch (e) {
			res.status(400).send(e.message);
			console.error(e);
		}
	} else {
		res.status(500).send('Something went wrong');
	}
});

router.post('/update', async (req, res) => {
	try {
		if (req.body && req.body.id) {
			const user = await User.findById(req.body.id);
			user.name = req.body.data.name || user.name;
			user.age = req.body.data.age || user.age;
			user.email = req.body.data.email || user.email;
			await user.save();
			res.send('Updated successfully');
		} else {
			res.status(404).send('UserId is missing');
		}
	} catch (e) {
		console.error(e);
	}
});

//Route to update cart items
router.post('/updateCart', checkSchema(createUpdateCartSchema), async (req, res) => {
	if (req.user) {
		const result = validationResult(req);
		const errors = result.array();
		if (errors.length) {
			res.status(400).send(errors[0].msg);
		} else {
			try {
				//! Reference:https://stackoverflow.com/questions/25589113/how-to-select-a-single-field-for-all-documents-in-a-mongodb-collection
				const productArrOfObj = await Product.find({}, { productId: 1, _id: 0 }); //All the product ids with the mongo db key
				let productIds = [];
				productArrOfObj.forEach((obj) => {
					productIds.push(obj.productId + ''); //Getting id values and converting it to string for the comparison
				});
				const userId = req.user.id;
				const user = await User.findById(userId);
				const cartItems = req.body.cartItems;
				//Getting the unmatched ids from the request body
				//! Reference:https://stackoverflow.com/questions/40537972/compare-2-arrays-and-show-unmatched-elements-from-array-1
				const unMatched = cartItems.filter(function (n) {
					return !this.has(n);
				}, new Set(productIds));
				if (unMatched.length > 0) {
					res.status(400).send({ INVALID_IDS: unMatched });
				} else {
					user.cartItems = cartItems;
					user.save();
					res.status(200).send({ msg: 'Cart has been updated.' });
				}
			} catch (e) {
				console.error(e);
			}
		}
	} else {
		res.sendStatus(401);
	}
});

//Router to authenticate the user
router.post('/auth', passport.authenticate('local'), async (req, res) => {
	res.sendStatus(200);
});

//Router to check the authentication status
router.get('/auth/status', (req, res) => {
	req.user ? res.send({ status: 'User logged in', ...req.user }) : res.sendStatus(401);
});

//Router to logout the authenticated user
router.get('/auth/logout', (req, res) => {
	if (!req.user) {
		res.sendStatus(401);
	} else {
		req.logOut((err) => {
			if (err) res.sendStatus(400);
			res.send({ status: 'Logged out successfully' });
		});
	}
});

module.exports = router;
