/* jshint expr:true */
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var fs = require('fs');
var drive = require('../index')();

// Testing that we are able to load the library
describe("drive.find()", function(){


  before(function(done){
    // Overload the data with a known set
    drive.data = require('./data.js');
    done();
  });



  // Retrieve the spreadsheet
  it('should load all records', function(){
    if (drive.find().length !== 6)
      throw "Not all records were retrieved";
    });
  });



// Attempt to update the cache
describe('drive.find(filter)', function(){

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
  it('should load records with id > 4', function(){
    var records = drive.find({ id: {$gt: 4} });
    var none = records.filter(function(row){ return row.id <= 4; });
    if (none.length > 0)
      throw "There's some record smaller than 4";
    });
  });
