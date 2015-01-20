var should = require('chai').should(),
    drive = require('../index');


// Check if the passed object is a drive instance or not
function checkDrive(obj) {

  // There's something
  if (!drive)
    throw "No database given";

  // It's an object
  if (typeof drive !== "object")
    throw "DB should be an object";

  // It's the right object
  if (!(drive instanceof drive.constructor))
    throw "DB should be an instance of drive";
  }


// Load the DB from drive (local)
describe('drive.load(callback)', function(){

  // Make sure there's DB
  it('load db without location', function(){
    
    // Load the data
    drive.load();

    checkDrive(drive);
    });

  // Make sure there's DB
  it('load database default location', function(){
    
    // Load the data
    drive.load('db.json');

    checkDrive(drive);
    });

  // Make sure there's DB
  it('load database non-default location', function(){
    
    // Load the data
    drive.load('database.json');

    checkDrive(drive);
    });
  });


// Attempt to update the cache
describe('drive.update(id, callback)', function(){

  // Retrieve the spreadsheet
  it('should update the db', function(done){

    // Retrieve the spreadsheet
    drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", function(data){
      done();
      if (this. data.length === 0)
        throw "No data loaded";
      return data;
      });
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



// Attempt to update the cache
describe('drive.find()', function(){

  // Retrieve the spreadsheet
  drive.load();

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