	// Required modules
var fs = require('fs');
var request = require('request');


/**
 * Drive Model
 * Use a Google Drive sheet as a database for a web
 * TODO: cache the calls
 */
var drive = function (){};



/**
 * Url
 * Location of the original spreadsheet
 */
drive.prototype.url = "";



/**
 * Cache Path
 * Path where a local copy will be stored
 */
drive.prototype.cachePath = "db.json";



/**
 * Load external drive sheet
 * @param String url the google drive sheet url
 * @param function callback the function to call when the data is loaded
 */
drive.prototype.load = function(callback){

	// If there's no local DB
	if(!fs.existsSync(this.cachePath)) {
		
		// Initialize the DB
		this.initDB();
		}
	
	// Read the raw db into a variable
	var rawJson = fs.readFileSync(this.cachePath).toString();

	// Store it in a decent way
	var db = JSON.parse(rawJson);
	this.data = db.data;
	this.info = db.info;

	// Load the callback
	callback.call(this, this);
	};



/**
 * Create and load the db
 */
drive.prototype.initDB = function(){

	fs.writeFileSync(this.cachePath, JSON.stringify({
		information: "",
		data: []
		}));
	};



/**
 * Update the cached data
 */
drive.prototype.updateCache = function(callback){

	// Store the variable locally
	var drive = this;

	// Attempt to load Google Drive data
	request(drive.url, function(error, code, sheet){

		// If google drive could be loaded
		// File was loaded successfully
		if (!error) {

			// Parse the data loaded
			drive.data = drive.parse(sheet);
			
			// Modify it before saving it
			if (callback)
				callback.call(drive, drive.data);

			drive.saveCache();
			}
		});
	};



/**
 * Save cache
 * Actually save it into cache
 */
drive.prototype.saveCache = function(){

	var save = JSON.stringify({
		info: {
			name: "Database",
			updated: new Date().getTime()
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

		// Return only if there's an id to return
		if (entry.id)
			return entry;
		});

	// Clean the data
	data = data.filter(function(n){
		return n !== undefined;
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
// Filter: { id: "bla" } | "bla" | null
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
	return passed.filter(function(row){
		return (row !== undefined && row !== null && row !== false);
		});
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



drive.prototype.limit = function(){};





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