const User = require('../Database/Schema/user.js');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const { Strategy } = require('passport-local');

//Passport authenticate config
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
 *
 * @param {string} name
 * @param {string} password
 * @returns {object} user
 */
async function getUser(name, password) {
	try {
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

//User Routes goes here

router.get('/get', async (req, res) => {
	const body = req.body;
	if (body && body.id) {
		const user = await User.findById(body.id);
		res.send(user);
	} else {
		getAllUsers().then((_res) => res.send(_res));
	}
});

router.post('/create', (req, res) => {
	try {
		const body = req.body;
		if (body.name && body.password && typeof body.age === 'number') {
			createUser(body).then((_res) => res.send(_res));
		} else {
			res.send('Something went wrong');
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

router.post('/auth', passport.authenticate('local'), async (req, res) => {
	res.sendStatus(200);
});

router.get('/auth/status', (req, res) => {
	req.user ? res.send({ status: 'User logged in', ...req.user }) : res.sendStatus(401);
});

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
