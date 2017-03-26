// Load the class to test
var drive = require('../index')({ local: './test/db.json' });

// Overload the data with a known set
drive.data = require('./data.js');


// Attempt to update the cache
describe('data.limit(begin)', function(){

  it('retrieves everything from 2', function(){
    var people = drive.find().limit(3);
    expect(people.length).toBe(3);
  });

  it('retrieves the last 2 elements', function(){
    var people = drive.find().limit(-2);
    expect(people.length).toBe(2);
  });
});


// Attempt to update the cache
describe('data.limit(begin, end)', function(){

  // Retrieve the spreadsheet
  var collection = drive.find();

  // Retrieve the spreadsheet
  it('retrieves the first 2 elements', function(){
    var people = collection.limit(0, 2);
    expect(people.length).toBe(2);
  });

  // Retrieve the spreadsheet
  it('retrieves the from 4 to 6', function(){
    var people = collection.limit(2, 6);
    expect(people.length).toBe(4);
  });
});
