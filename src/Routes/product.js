const express = require('express');
const Product = require('../Database/Schema/product');
const { validationResult, checkSchema, matchedData } = require('express-validator');
const { createUpdateProductSchema, createGetProductSchema, createAddProductSchema } = require('../utils/validationSchemas');
const router = express.Router();

/**
 * Find's the product by it's product id and return's the product
 * @param {number} productId
 * @returns {Object} product
 */
async function findProduct(productId) {
	try {
		const product = await Product.findOne({
			productId: productId,
		});
		return product;
	} catch (e) {
		return e;
	}
}

/**
 * Helper function to update every data in a collection.
 */
async function updateEverything() {
	const res = await Product.updateMany({}, { stock: 50 });
	console.log(res);
}

//? Product routes goes here

router.get('/get', checkSchema(createGetProductSchema), async (req, res) => {
	const result = validationResult(req); //Returns the validation result.
	const errors = result.array(); //Getting the errors as an array.
	if (errors.length) {
		res.status(401).send(errors[0].msg);
	} else {
		const products = await Product.find();
		const productId = req.body.productId; //Getting the product ID
		if (productId) {
			const prod = products.find((product) => product.productId === Number(productId)); //Finding the product
			res.send(prod);
		} else {
			try {
				//If no product ID is passed returning all the users
				const products = await Product.find();
				res.send(products);
			} catch (e) {
				res.status(400).send('Something went wrong');
			}
		}
	}
});

//!Have to test this route
router.post('/addProduct', checkSchema(createAddProductSchema), async (req, res) => {
	const result = validationResult(req); //Returns the validation result.
	const errors = result.array(); //Getting the errors as an array.
	if (errors.length) {
		res.status(401).send(errors[0].msg);
	} else {
		try {
			const productCount = await Product.count();
			const prod = await Product.create({
				isFavorite: false,
				productId: productCount + 1,
				isFavorite: false,
				stock: req.body.stock ? req.body.stock : 50,
				rating: {
					rate: '5.0',
					count: 0,
				},
				...req.body,
			});
			res.status(200).send(prod);
		} catch (e) {
			console.error(e);
		}
	}
});

router.post('/updateStock/:id', async (req, res) => {
	if (req.user) {
		try {
			const productId = Number(req.params.id);
			const product = await findProduct(productId);
			product.stock = req.body.stock;
			product.save();
			res.status(200).send({ msg: 'Stock has been updated successfully' });
			console.log(product);
		} catch (e) {
			console.log(e);
		}
	} else {
		res.status(401).send({ msg: 'Please login to access' });
	}
});

router.post('/update/:id', checkSchema(createUpdateProductSchema), async (req, res) => {
	const result = validationResult(req); // Getting the validated result.
	const errors = result.array(); // Getting the error as an array,If exist.
	if (errors.length) {
		res.status(400).send(errors);
	} else {
		const productId = req.params.id;
		const matchedBodyData = matchedData(req); //Getting the matched request body data.
		const { isFavorite, price, title } = matchedBodyData;
		const product = await findProduct(productId);
		try {
			if (isFavorite) product.isFavorite = isFavorite;
			if (price) product.price = price;
			if (title) product.title = title;
			await product.save();
			res.send('Updated Successfully');
		} catch (e) {
			res.status(400).send('Something went wrong');
		}
	}
});

module.exports = router;
