const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	title: String,
	price: Number,
	productId: Number,
	description: String,
	category: String,
	isFavorite: Boolean,
	stock: Number,
});

module.exports = mongoose.model('Products', productSchema);
