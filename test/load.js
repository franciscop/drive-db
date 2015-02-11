// Load the testing module
var should = require('chai').should();

// Load the class to test
var drive = require('../index');



// Actual tests

// Check if the passed object is a drive instance or not
function checkDrive(obj) {

  // There's something
  if (!obj)
    throw "No database given";

  // It's an object
  if (typeof obj !== "object")
    throw "drive should be an object";

  // It's the right object
  if (!(obj instanceof drive.constructor))
    throw "drive should be an instance of drive";

  if (!(drive.hasOwnProperty("data")))
    throw "drive should have a data parameter";
  }


// Load the DB from drive (local)
describe('drive.load(filename)', function(){

  // Make sure there's DB
  it('load db without filename', function(){
    
    // Load the data
    drive.load();

    // Check if drive is right
    checkDrive(drive);
    });

  // Make sure there's DB
  it('load database default filename', function(){
    
    // Load the data
    drive.load('db.json');

    checkDrive(drive);
    });

  // Make sure there's DB
  it('load database non-default filename', function(){
    
    // Load the data
    drive.load('database.json');

    checkDrive(drive);
    });
  });