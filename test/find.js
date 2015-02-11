// Load the testing module
var should = require('chai').should();

// Load the class to test
var drive = require('../index').load();

// Overload the data with a known set
drive.data = require('./data.js');



// Actual tests

// Find all data
describe('drive.find()', function(){

  // Retrieve the spreadsheet
  it('should load all records', function(){
    if (drive.find().length !== 6)
      throw "Not all records were retrieved";
    });
  });



// Attempt to update the cache
describe('drive.find(filter)', function(){

  // Retrieve the spreadsheet
  drive.load();

  // Retrieve the spreadsheet
  it('should load first record', function(){
    if (drive.find({ id: 1 }).length !== 1)
      throw "Only one record should be found";
    });

  // Retrieve the spreadsheet
  it('should load John record', function(){
    if (drive.find({ firstname: "John" }).length !== 1)
      throw "Only one record should be found";
    });

  // Retrieve the spreadsheet
  it('should load Miller record', function(){
    if (drive.find({ lastname: "Miller" }).length !== 1)
      throw "Only one record should be found";
    });
  });



// Attempt to update the cache
describe('drive.find(complexfilter)', function(){

  // Retrieve the spreadsheet
  drive.load();

  // Retrieve the spreadsheet
  it('should load records with id > 4', function(){
    var records = drive.find({ id: {$gt: 4} });
    var none = records.filter(function(row){ return row.id <= 4; });
    if (none.length > 0)
      throw "There's some record smaller than 4";
    });
  });