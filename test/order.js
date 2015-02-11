// Load the testing module
var should = require('chai').should();

// Load the class to test
var drive = require('../index').load();

// Overload the data with a known set
drive.data = require('./data.js');

// Retrieve the data
var data = drive.find();



// Actual test

// Attempt to update the cache
describe('data.order(field)', function(){

  // Retrieve the spreadsheet
  it('should sort by firstname', function(){

    var people = data.order("firstname");

    if (people[0].firstname > people[1].firstname
     || people[1].firstname > people[2].firstname
     || people[2].firstname > people[3].firstname
     || people[3].firstname > people[4].firstname)
      throw "Should be ordered ascendent";
    });
  });

// Attempt to update the cache
describe('data.order(field, 1)', function(){

  // Retrieve the spreadsheet
  it('should sort by age desc', function(){

    var people = data.order("age", 1);

    if (people[0].age < people[1].age
     || people[1].age < people[2].age
     || people[2].age < people[3].age
     || people[3].age < people[4].age)
      throw "Should be ordered descendent";
    });
  });