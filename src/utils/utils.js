//All the helper and utils function goes here

/**
 * Helper function to update every data in a collection.
 * @param {object} Schema Database Schema need to be updated.
 * @param {string} key key name to update on database.
 * @param {any} value value for the key to update.
 */
async function updateEverything(Schema, key, value = 0) {
	if (!key) {
		return 'Please provide a valid key';
	}

	if (!Schema) {
		return 'Database Schema is required';
	}

	try {
		const res = await Schema.updateMany({}, { key: value });
		return res;
	} catch (e) {
		console.error(e);
	}
}

export function errorHandlingMiddleware(err, req, res, next) {
	if (err instanceof ValidationError) {
		res.status(400).json({ message: err.message });
	} else if (err instanceof DuplicateError) {
		res.status(409).json({ message: err.message });
	} else {
		res.status(500).json({ message: 'Internal server error' });
	}
}
