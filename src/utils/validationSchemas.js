const createUpdateProductSchema = {
	isFavorite: {
		isBoolean: {
			errorMessage: 'Favorite value has to be boolean',
		},
		optional: true,
	},
	price: {
		isNumeric: {
			errorMessage: 'Price has to be number',
		},
		isFloat: {
			options: {
				min: 20,
				max: 300,
			},
			errorMessage: 'Price has to be between 20 to 300',
		},
		optional: true,
	},
	title: {
		isLength: {
			options: {
				min: 10,
				max: 100,
			},
			errorMessage: 'Title name has to be between 10 to 100 letters',
		},
		optional: true,
	},
};

const createGetProductSchema = {
	productId: {
		isNumeric: {
			errorMessage: 'Product ID should be a number',
		},
		optional: true,
	},
};

module.exports = { createUpdateProductSchema, createGetProductSchema };
