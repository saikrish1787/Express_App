const express = require('express');
const Product = require('../Database/Schema/product');
const { query, validationResult, checkSchema, matchedData } = require('express-validator');
const { createUpdateProductSchema, createGetProductSchema } = require('../utils/validationSchemas');
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

//? Product routes goes here

router.get('/get', checkSchema(createGetProductSchema), async (req, res) => {
	const result = validationResult(req); //Returns the validation result
	const errors = result.array(); //Getting the errors as an array
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
