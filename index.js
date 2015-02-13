// Required modules
var fs = require('fs');
var request = require('request');



/**
 * Drive Model
 * Use a Google Drive sheet as a database with strong cache
 */
var drive = function (){};



/**
 * Cache Path
 * Path where a local copy will be stored
 */
drive.prototype.cachePath = 'db.json';



/**
 * id
 * The id of the Spreadsheet
 */
drive.prototype.id = '';



/**
 * Info
 * Variable that contains the database information
 */
drive.prototype.info = {};



/**
 * Data
 * This variable will contain the database data
 */
drive.prototype.data = [];


/**
 * Loaded
 * Variable set to true if the database is loaded
 */
drive.prototype.loaded = false;


/**
 * Error
 * Variable to store the database errors
 */
drive.prototype.error = false;


/**
 * Loaded
 * Variable with the response code
 */
drive.prototype.code = 0;



/**
 * Load
 * Retrieve the data from the local copy
 * @param String cachePath the place where the local copy is stored
 */
drive.prototype.load = function(cachePath){

	// Set the cachePath
	this.cachePath = cachePath ? cachePath : this.cachePath;

	// If there's no local DB
	if(!fs.existsSync(this.cachePath)) {
		return this;
		}
	
	// Read the raw db into a variable
	var rawJson = fs.readFileSync(this.cachePath, 'utf-8');

	// Store it in a decent way
	try {
		var db = JSON.parse(rawJson);
		this.data = db.data;
		for (var key in db.info) {
			this[key] = db.info[key];
			}
		this.loaded = true;
		}
	catch(error) {
		console.log('Error reading from local db.');
		}

	return this;
	};



/**
 * Update
 * Refresh the Google Spreadsheet data into local database
 * @param id Google Drive Spreadsheet id
 * @param callback the function to call after the data is retrieved
 */
drive.prototype.update = function(id, callback){

	// The function to be called after the data is loaded
	this.after = callback || this.after;

	// Store the id from google drive spreadsheet
	this.id = id || this.id;

	if (!this.id.length)
		throw 'Need a google drive url to update file';

	var url = 'https://spreadsheets.google.com/feeds/list/' + id + '/od6/public/values?alt=json';

	var self = this;

	// Call request() but keep this as `drive`
	request(url, function(error, response, sheet){

		// Store the response code
		// 400 if there's no response at all (client error)
		self.code = (response) ? response.statusCode : 400;

		// If it's an error code
		if (self.code >= 400) {
			self.error = (response) ? response.body : "No internet connection";
			self.store();
			return false;
			}

		self.error = "";
		
		// So that you can access this within self.after
		self.data = self.parse(sheet);

		// Call the function that should be called after retrieving the data
		self.data = self.after.call(self, self.data);

		// Actually save the data into the file
		self.store();
		});
	};



/**
 * After
 * The function to call to process the data
 */
drive.prototype.after = function(data){
	return data;
	}



/**
 * Store
 * Save the current data into the db
 */
drive.prototype.store = function(){

	// Store when it is last updated
	this.updated = new Date().getTime();

	// The data to store
	var save = JSON.stringify({
		info: {
			id: this.id,
			updated: this.updated,
			error: this.error,
			code: this.code
		},
		data: this.data
		}, null, 2);

	// Write the cache
	fs.writeFile(this.cachePath, save);
	};



/**
 * Parse method
 * Transforms Google Drive raw data into something usable
 */
drive.prototype.parse = function(raw) {

	// Get the json from google drive
	var rawrows = JSON.parse(raw).feed.entry;

	// Loop through each row
	var data = rawrows.map(function(row){

		var entry = {};

		// Loop through all of the fields (only some are valid)
		for (var field in row) {

			// Match only those field names that are valid
			if (field.match(/gsx\$[0-9a-zA-Z]+/)) {

				// Get the field real name
				var name = field.match(/gsx\$([0-9a-zA-Z]+)/)[1];

				// Store it and its value
				entry[name] = row[field].$t;
				}
			}

		// Return it anyway
		return entry;
		});
	
	return data;
	};



/**
 * Each
 * Loop through all of the elements and execute an action
 * You can call `this` from the callback and it'll be nice
 */
drive.prototype.each = function(fn){
	this.data.forEach(fn, this);
	return this;
	};



/**
 * Clean
 * Sanitize the data by deleting empty stuff
 * If we need to clean it means we mess up. Fix it somehow
 */
drive.prototype.clean = function(){

	if (!this.data || this.data.constructor !== Array)
		this.data = [];

	this.data = this.data.filter(function(n){
		return n !== undefined;
		});
	};



/**
 * Conditions
 * The different mongodb conditions
 * @src http://docs.mongodb.org/manual/reference/operator/query-comparison/
 */
var conditions = {
	// This one is not actually in mongodb, but it's nice
	"$eq" : function(value, test){ return value == test; },
	"$gt" : function(value, test){ return value >  test; },
	"$gte": function(value, test){ return value >= test; },
	"$lt" : function(value, test){ return value <  test; },
	"$lte": function(value, test){ return value <= test; },
	"$ne" : function(value, test){ return value != test; },
		// http://stackoverflow.com/a/20206734
	"$in" : function(value, test){
		return test.map(String).indexOf(value) > -1;
		},
	"$nin": function(value, test){
		return !conditions.$in(value, test);
		},
	};



// From http://docs.mongodb.org/manual/reference/operator/query/
function good(value, test){

	// Comparing two primitive types
	if (typeof test !== 'object') {
		return (test == value);
		}

	// Loop each possible condition
	for (var name in conditions) {

		// If the filter has this test and it's not passed
		if (conditions.hasOwnProperty(name) &&
				test.hasOwnProperty(name) &&
				!conditions[name](value, test[name])) {
			return false;
			}
		}

	// All the tests for the complex filter have passed
	return true;
	}



// Find one instance
// Filter: { id: 'bla' } | 'bla' | null
drive.prototype.find = function(filter) {

	// Allow for simplification when calling it
	filter = (typeof filter == 'string') ? { id: filter } : filter;

	// Make sure we're working with a clean array
	this.clean();

	// Loop through all of the rows
	// Store the good ones here
	var passed = this.data.map(function(row){

		// Loop through all of the tests
		for (var field in filter) {

			// Make sure we're dealing with a filter field
			if (filter.hasOwnProperty(field)) {

				// If one of the tests fails
				if (!good(row[field], filter[field])) {

					// The whole row fails
					return false;
					}
				}
			}

		// Everything okay: this row passed all the tests!
		return row;
		});

	// http://stackoverflow.com/a/2843625
	passed = passed.filter(function(row){
		return (row !== undefined && row !== null && row !== false);
		});

	// This has been called `order` since Array already has a function called `sort`
	passed.order = function(field, desc){

		// Inverse the order of the sort
		var inv = (desc) ? -1 : 1;

		// Compare two fields
		function compare(a, b) {

			return (a[field] == b[field]) ? 0 :
				(a[field] > b[field]) ? inv : - inv;
			}

		// Actually sort the data
		this.sort(compare);

		return this;
		}

	// Define .limit() as .slice()
	passed.limit = passed.slice;

	return passed;
	};



// Sort the data by a field
// src: http://stackoverflow.com/a/1129270/938236
drive.prototype.sort = function(field, desc){

	// Inverse the order of the sort
	var inv = (desc) ? -1 : 1;

	// Compare two fields
	function compare(a, b) {

		return (a[field] == b[field]) ? 0 :
			(a[field] > b[field]) ? inv : - inv;
		}

	// Actually sort the data
	this.data.sort(compare);

	return this;
	};








// Get the next element
drive.prototype.next = function(id){

	// Store the good ones
	var passed = this.data;

	var matched = false;
	var good;

	// Loop through all of the rows
	passed.forEach(function(row){
		if (matched) {
			good = row;
			matched = false;
			}
		if (row && row.id == id)
			matched = true;
		});
	
	return good;
	};


module.exports = new drive();