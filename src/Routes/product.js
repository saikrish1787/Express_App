const express = require('express');
const Product = require('../Database/Schema/product');
const router = express.Router();

/**
 * Find's the product by it's product id and return's the product
 * @param {Number} productId
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

router.get('/get/:id', async (req, res) => {
	const products = await Product.find();
	const productId = req.params.id;
	if (productId) {
		const prod = products.find((product) => product.productId === Number(productId));
		res.send(prod);
	}
});

router.get('/get', async (req, res) => {
	try {
		const products = await Product.find();
		res.send(products);
	} catch (e) {
		res.status(400).send('Something went wrong');
	}
});

router.post('/update/:id', async (req, res) => {
	const productId = req.params.id;
	const body = req.body;
	const keys = Object.keys(body);
	const product = await findProduct(productId);
	keys.forEach((key) => {
		if (!(key in product)) {
			res.status(401).send('There is no key such as ' + key);
		} else {
			res.send('Updated Successfully');
		}
	});
});

module.exports = router;
