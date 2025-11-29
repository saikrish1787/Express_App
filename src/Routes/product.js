const express = require('express');
const Product = require('../Database/Schema/product'); // Product Schema
const { validationResult, checkSchema, matchedData } = require('express-validator');
const { createUpdateProductSchema, createGetProductSchema, createAddProductSchema } = require('../utils/validationSchemas');
const router = express.Router();

/**
 * Find's the product by it's product id and return's the product
 * @param {number} productId ID of the Product
 * @returns {Promise} returns Promise for the product
 */
async function findProduct(productId) {
	if (!productId) {
		return {};
	}
	try {
		const product = Product.findOne({
			productId: productId,
		});
		return product;
	} catch (e) {
		return e;
	}
}

//? Product routes goes here

router.get('/get', checkSchema(createGetProductSchema), async (req, res) => {
	const result = validationResult(req); //Returns the validation result.
	const errors = result.array(); //Getting the errors as an array.
	if (errors.length) {
		res.status(400).send(errors[0].msg);
	} else {
		const productId = req.body.productId; //Getting the product ID
		if (productId) {
			const prod = await findProduct(productId); //Finding the product
			console.log(prod);
			if (prod) {
				res.send({ data: prod, status: 1 });
			} else {
				res.send({ status: 0, reason: 'There is no product found on given ID' });
			}
		} else {
			//If no product ID is passed returning all the users
			const products = await Product.find();
			res.send({ data: products, status: 1 });
		}
	}
});

//! On 'price' column "500" and 500 are same and no errors will be returned by the express validator.
router.post('/addProduct', checkSchema(createAddProductSchema), async (req, res) => {
	if (req.user) {
		const result = validationResult(req); //Returns the validation result.
		const errors = result.array(); //Getting the errors as an array.
		if (errors.length) {
			res.status(400).send(errors[0].msg);
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
	} else {
		res.status(401).send({ msg: 'Please login to access' });
	}
});

router.post('/updateStock/:id', async (req, res) => {
	if (req.user) {
		const productId = Number(req.params.id);
		const product = await findProduct(productId);
		product.stock = req.body.stock;
		product.save();
		res.status(200).send({ msg: 'Stock has been updated successfully' });
		console.log(product);
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
		if (isFavorite) product.isFavorite = isFavorite;
		if (price) product.price = price;
		if (title) product.title = title;
		await product.save();
		res.send('Updated Successfully');
	}
});

module.exports = router;
