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

const createUpdateCartSchema = {
	cartItems: {
		isArray: {
			errorMessage: 'Cart items must be an array of strings',
			options: { min: 1 }, // Optional: Enforce a minimum length
		},
		custom: {
			options: (value) => value.every((item) => typeof item === 'string'),
			errorMessage: 'Cart items must contain only strings',
		},
	},
};

const createAddProductSchema = {
	title: {
		isLength: {
			options: {
				min: 10,
				max: 100,
			},
			errorMessage: 'Title name has to be between 10 to 100 letters',
		},
	},
	description: {
		isLength: {
			options: {
				min: 10,
				max: 100,
			},
			errorMessage: 'Description has to be between 10 to 100 letters',
		},
	},
	image: {
		isLength: {
			options: {
				min: 10,
			},
			errorMessage: 'Image link has to be more than 10 letters',
		},
	},
	price: {
		isNumeric: {
			errorMessage: 'Price should be a number',
		},
	},
	category: {
		isLength: {
			options: {
				min: 5,
			},
			errorMessage: 'Category has to be more than 5 letters',
		},
	},
	stock: {
		isNumeric: {
			errorMessage: 'Product id should be a number',
		},
		optional: true,
	},
};

module.exports = { createUpdateProductSchema, createGetProductSchema, createUpdateCartSchema, createAddProductSchema };
