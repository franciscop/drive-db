/**
 * Testing
 * This is the generic file for calling all of the tests.
 * It makes sure that everything is tested and explains each test.
 */



/**
 * .load(callback)
 * Makes sure that the data can be loaded
 */
require("./load");

/**
 * data.update(id)
 * Updates the local data with the external spreadsheet
 */
require("./update");

/**
 * .find(filter)
 * Attempts to filter the database with different parameters
 */
require("./find");

/**
 * data.order(field, desc)
 * Orders the data based on one field
 */
require("./order");

/**
 * data.limit(begin, end)
 * Limits the data retrieved
 */
require("./limit");