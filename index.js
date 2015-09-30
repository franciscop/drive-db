// Required modules
var fs = require('fs');
var request = require('request');
var defaults = require('defaults');


module.exports = function(options){

  // Also accepts a single argument as sheet id
  options = typeof options === "string" ? { sheet: options } : options;

  // Load the correct defaults
  var drive = defaults(options, {
    sheet: "",
    local: "db.json",
    timeout: 3600,
    onload: function(d){ return d; },
    data: []
  });

  drive.load = function(callback){

    callback = callback || function(){};

    // Make sure we're not extending the maximum timeout
    function diff(file) {
      var filetime = new Date(fs.statSync(file).mtime).getTime();
      return (new Date().getTime() - filetime) / 1000;
    }

    // If the timeout has expired or there's no local copy
    if (!fs.existsSync(this.local) || diff(this.local) > this.timeout) {
      return this.update(this.sheet, this.local, callback);
    }

    // It was updated recently, just load it
    return this.readDB(this.local, callback);
  };



  drive.readDB = function(file, callback){

    var self = this;
    callback = callback || function(){};

    // Read the raw db into a variable
    fs.readFile(process.cwd() + '/' + file, 'utf-8', function(err, rawJson){

      if (err) {
        return callback(err);
      }

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

  drive.update = function(sheet, file, callback){

    // http://stackoverflow.com/questions/962033/what-underlies-this-javascript-idiom-var-self-this
    var self = this;
    callback = callback || function(){};

    // To update the data we need to make sure we're working with an id
    if (!sheet || !sheet.length) {
      return callback(new Error('Need a google drive url to update file'));
    }

    // Build the url
    var url = 'https://spreadsheets.google.com/feeds/list/' + sheet + '/od6/public/values?alt=json';

    // Call request() but keep this as `drive`
    request(url, function(err, response, sheet){

      // There's a explicit error
      if (err) {
        return callback(err);
      }

      // The server returned an error (but nothing failed)
      if (response.statusCode >= 400) {
        return callback(new Error(response.statusMessage));
        }

      // So that you can access this within self.after
      self.data = self.parse(sheet).filter(function(el){
        return el !== undefined;
      });

      // Call the function that should be called after retrieving the data
      self.data = self.onload.call(self, self.data);

      callback(false, self);

      // Actually save the data into the file
      fs.writeFile(file, JSON.stringify(self.data, null, 2));
    });
  };

  // Parse the JSON from drive
  drive.parse = function(raw) {

    // Get the json from google drive and loop it
    return JSON.parse(raw).feed.entry.map(function(row){

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
       // Loose type search: http://stackoverflow.com/a/20206734
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
       if (name in conditions && name in test &&
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

    // Loop through all of the rows. Store the good ones here
    var passed = this.data.filter(function(row){

      // Loop through all of the tests
      for (var field in filter) {

        // Make sure we're dealing with a filter field
        if (field in row && !good(row[field], filter[field])) {

          // The whole row fails
          return false;
        }
      }

      // Everything okay: this row passed all the tests!
      return true;
    });

    // This has been called `order` since Array already has a function called `sort`
    passed.order = function(field, desc){

      // Inverse the order of the sort
      var inv = (desc) ? -1 : 1;

      // Actually sort the data
      this.sort(function(a, b) {

        return (a[field] == b[field]) ? 0 : (a[field] > b[field]) ? inv : - inv;
      });

      return this;
    };

    // Define .limit() as .slice()
    passed.limit = passed.slice;

    return passed;
  };

  return drive;
};
