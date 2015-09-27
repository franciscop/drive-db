/**
 * Testing
 * This is the generic file for calling all of the tests.
 * It makes sure that everything is tested and explains each test.
 */

// Simply to cache and not making the first test take forever
var justToCache = require('../index');


// Make sure that the module can be loaded
require("./require");

// Make sure that the local database can be read
require("./read");

// Update the local data with the external spreadsheet
require('./update');

// Find some records
require('./find');

// Find some records
require('./limit');

// Find some records
require('./order');
