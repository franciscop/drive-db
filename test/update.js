// Load the testing module
var should = require('chai').should();

// Load the class to test
var drive = require('../index').load();

// Overload the data with a known set
drive.data = require('./data.js');



// Actual tests

// Attempt to update the cache
describe('drive.update(id, callback)', function(){

  it('should update the db', function(done){

    drive.load("test/db.json");

    // Retrieve the spreadsheet
    drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", function(data){
      done();
      return data;
      });
    });

  it('should store an error', function(done){

    drive.load("test/error.json");

    // Retrieve the spreadsheet
    drive.update("wrong-id");

    setTimeout(function(){
      if(!drive.error)
        throw "Error not stored";
      done();
      }, 1500);
    });
  
  // Check on the retrieved data
  after(function(){

    // Retrieve the spreadsheet
    drive.load();

    // Make sure we have some info
    if (drive.info.length === 0)
      throw "No info stored";

    // Make sure there's something returned
    if (drive.data.length === 0)
      throw "No data loaded";
    });
  });