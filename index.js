// Required modules
const fs = require('fs-promise');
const request = require('request-promises');


module.exports = function(options){

  // Also accepts a single argument as sheet id
  options = typeof options === 'string' ? { sheet: options } : options;

  // Load the correct defaults
  const drive = Object.assign({}, {
    sheet: '',
    local: 'db.json',
    cache: 3600,
    onload: d => d,
    tab: 'default',  // od6
    data: []
  }, options);



  // Make sure we're not extending the maximum timeout
  const diff = file => {
    const filetime = new Date(fs.statSync(file).mtime).getTime();
    return (new Date().getTime() - filetime) / 1000;
  }



  // The server returned an error (but nothing failed)
  const statusCode = res => {
    if (res.statusCode < 400) return res;
    throw new Error(`
Status code ${res.statusCode} received with the message "${res.statusMessage}" for the url ${res.request.href}
    `);
  };


  drive.load = function(){

    // If the timeout has expired or there's no local copy
    if (!fs.existsSync(this.local) || diff(this.local) > this.cache) {
      return this.update(this.sheet, this.local, this.tab);
    }

    // Fetch it from the filesystem
    return this.readDB(this.local);
  };



  // Load the database from a file
  drive.readDB = function(file){
    return fs.readFile(`${process.cwd()}/${file}`, 'utf-8').then(raw => {
      this.data = JSON.parse(raw);
      return this;
    });
  };



  // Update the database from a remote url
  drive.update = function(sheet, file, tab = drive.tab){

    // To update the data we need to make sure we're working with an id
    if (!sheet || !sheet.length) {
      return Promise.reject(new Error('Need a google drive url to update file'));
    }

    // Build the url
    const url = `https://spreadsheets.google.com/feeds/list/${sheet}/${tab}/public/values?alt=json`;

    // Call request() but keep this as `drive`
    return request(url).then(statusCode).then(response => {

      // Parse the data from Drive and with the dev-specified parser
      this.data = this.onload(this.parse(response.body));

      // Actually save the data into the file
      return fs.writeFile(file, JSON.stringify(this.data, null, 2));
    }).then(() => this);
  };



  // Parse the JSON from drive
  drive.parse = raw => {

    // Get only the valid keys
    const getKeys = row => Object.keys(row).filter(key => /^gsx\$/.test(key));

    // Create an entry for each row
    const parseRow = row => getKeys(row).reduce((obj, key) => {
      obj[key.slice(4)] = row[key].$t;
      return obj;
    }, {});

    // Get the json from google drive and loop it
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      throw new Error(`
Could not parse JSON response, we received this instead of proper JSON:
${raw}
      `);
    }
    return data.feed.entry.map(parseRow);
  };


  // The different mongodb conditions
  // http://docs.mongodb.org/manual/reference/operator/query-comparison/
  const conditions = {
    // This one is not actually in mongodb, but it's nice
    $eq : (value, test) => value == test,
    $gt : (value, test) => value >  test,
    $gte: (value, test) => value >= test,
    $lt : (value, test) => value <  test,
    $lte: (value, test) => value <= test,
    $ne : (value, test) => value != test,

    // Loose type search: http://stackoverflow.com/a/20206734
    $in : (value, test) => test.map(String).indexOf(value) > -1,
    $nin: (value, test) => !conditions.$in(value, test)
  };



   // From http://docs.mongodb.org/manual/reference/operator/query/
   function good(value, test){

     // Comparing two primitive types
     if (typeof test !== 'object') {
       return (test == value);
     }

     // Loop each possible condition
     for (let name in conditions) {

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
    const passed = this.data.filter(function(row){

      // Loop through all of the tests
      for (let field in filter) {

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
      const inv = (desc) ? -1 : 1;

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
