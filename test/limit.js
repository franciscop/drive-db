// Load the testing module
var should = require('chai').should();

// Load the class to test
var drive = require('../index')({ local: './test/db.json' });

// Overload the data with a known set
drive.data = require('./data.js');



// Actual test

// Attempt to update the cache
describe('data.limit(begin)', function(){

  // Retrieve the spreadsheet
  it('retrieves everything from 2', function(){

    var people = drive.find().limit(3);

    if (people.length !== 3)
      throw "Should retrieve only 4 people";
    });

  // Retrieve the spreadsheet
  it('retrieves the last 2 elements', function(){

    var people = drive.find().limit(-2);
    
    if (people.length !== 2)
      throw "Should retrieve only 2 people";
    });
  });



// Attempt to update the cache
describe('data.limit(begin, end)', function(){

  // Retrieve the spreadsheet
  var collection = drive.find();

  // Retrieve the spreadsheet
  it('retrieves the first 2 elements', function(){

    var people = collection.limit(0, 2);

    if (people.length !== 2)
      throw "Should retrieve only 2 people";
    });

  // Retrieve the spreadsheet
  it('retrieves the from 4 to 6', function(){

    var people = collection.limit(2, 6);

    if (people.length !== 4)
      throw "Should retrieve only 4 people";
    });
  });
