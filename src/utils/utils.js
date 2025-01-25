//All the helper and utils function goes here

/**
 * Helper function to update every data in a collection.
 * @param {object} modalInstance Modal instance need to be updated.
 * @param {string} key key name to update on database.
 * @param {any} value value for the key to update.
 */
async function updateEverything(modalInstance, key, value = 0) {
	if (!key) {
		return 'Please provide a valid key';
	}

	if (!modalInstance) {
		return 'Database modal instance is required';
	}

	try {
		const res = await modalInstance.updateMany({}, { key: value });
		return res;
	} catch (e) {
		console.error(e);
	}
}
