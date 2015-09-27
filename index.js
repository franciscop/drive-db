// Required modules
var fs = require('fs');
var request = require('request');



module.exports = function(options){

  // Make sure we have some options
  options = options || {};

  // As recommended in http://stackoverflow.com/a/9436948/938236
  if (typeof options === 'string' || options instanceof String)
    options = { sheet: options };

  var drive = {
    sheet: options.sheet || false,     // the sheet id
    local: options.local || 'db.json', // where the local copy is stored
    timeout: options.timeout || 3600,  // maximum time until next reload in secs
    onload: options.onload || function(d){ return d; },  // Function to call on each row
    data: []
  };

  drive.load = function(sheet, callback){

    if (typeof(sheet) === "function") {
      callback = sheet || function(){};
    }
    else {
      // Make sure we're working with the intended spreadsheet
      this.sheet = sheet || this.sheet;
      callback = callback || function(){};
    }

    // Make sure we're not extending the maximum timeout
    function diff(file) {
      var filetime = new Date(fs.statSync(file).mtime).getTime();
      return (new Date().getTime() - filetime) / 1000;
    }
    if (!fs.existsSync(this.local) || diff(this.local) > this.timeout) {
      return this.update(this.sheet, this.local, callback);
    }

    // It was updated recently, just load it
    return this.readDB(this.local, callback);
  };



  drive.readDB = function(local, callback){

    // Set the cachePath
    this.local = local || this.local;

    var self = this;

    // Read the raw db into a variable
    fs.readFile(process.cwd() + '/' + this.local, 'utf-8', function(err, rawJson){

      if (err)
        return callback(err);

      // Store it in a decent way
      try {
        self.data = JSON.parse(rawJson);
        return callback(false, self);
        }
      catch(error) {
        return callback(error);
        }
    });
  };

  drive.update = function(sheet, local, callback){

    this.sheet = sheet || this.sheet;
    this.local = local || this.local;

    // To update the data we need to make sure we're working with an id
    if (!this.sheet.length) {
      return callback(new Error('Need a google drive url to update file'));
    }

    // http://stackoverflow.com/questions/962033/what-underlies-this-javascript-idiom-var-self-this
    var self = this;

    // Build the url
    var url = 'https://spreadsheets.google.com/feeds/list/' + this.sheet + '/od6/public/values?alt=json';

    // Call request() but keep this as `drive`
    request(url, function(err, response, sheet){

      // There's a explicit error
      if (err) {
        return callback(err);
      }

      // The server returned an error (but nothing failed)
      if (!response || response.statusCode >= 400) {
        return callback(new Error(response.statusMessage));
        }

      // So that you can access this within self.after
      self.data = self.parse(sheet).filter(function(el){
        return el !== undefined;
      });

      // Call the function that should be called after retrieving the data
      self.data = self.onload.call(self, self.data);

      // Actually save the data into the file
      self.store();

      callback(false, self);
    });
  };


  drive.store = function(){

    // The data to store
    var save = JSON.stringify(this.data, null, 2);

    // Write the cache
    fs.writeFile(this.local, save);
  };

  drive.parse = function(raw) {

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


  // The different mongodb conditions
  // http://docs.mongodb.org/manual/reference/operator/query-comparison/
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



  // Find elements
  // Filter: { id: 'bla' } | 'bla' | null
  drive.find = function(filter) {

    // Allow for simplification when calling it
    filter = (typeof filter == 'string') ? { id: filter } : filter;

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
    };

    // Define .limit() as .slice()
    passed.limit = passed.slice;

    return passed;
    };

  return drive;
};
