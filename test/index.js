var should = require('chai').should(),
    drive = require('../index');

// Load the right file
drive.url = "https://spreadsheets.google.com/feeds/list/1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc/od6/public/values?alt=json";



// Load the DB from drive (local)
describe('drive.load(callback)', function(){

  // Make sure there's DB
  it('should load the db', function(done){
    drive.load(function(DB){
      // There's something
      if (!DB)
        throw "No database given";

      // It's an object
      if (typeof DB !== "object")
        throw "DB should be an object";

      // It's the right object
      if (!(DB instanceof drive.constructor))
        throw "DB should be an instance of drive";
      done();
      });
    });
  });



// Attempt to update the cache
describe('drive.updateCache(callback)', function(){

  // Retrieve the spreadsheet
  it('should update the db', function(done){

    // Retrieve the spreadsheet
    drive.updateCache(function(){
      if (this.data.length === 0)
        throw "No data loaded";
      done();
      });
    });

  // Check on the retrieved data
  after(function(done){

    // Retrieve the spreadsheet
    drive.load(function(DB){

      // Make sure we have some info
      if (DB.info.length === 0)
        throw "No info stored";

      // Make sure there's something returned
      if (DB.data.length === 0)
        throw "No data loaded";

      done();
      });
    });
  });



// Attempt to update the cache
describe('drive.find(filter)', function(){

  // Retrieve the spreadsheet
  it('should load filtered records', function(){

    // Retrieve the spreadsheet
    drive.load(function(drive){
      if (drive.find().length !== 6)
        throw "Not all records were retrieved";

      if (drive.find({ id: 1 }).length !== 1)
        throw "Only one record should be found";
      });
    });
  
  // Check on the retrieved data
  after(function(done){

    // Retrieve the spreadsheet
    drive.load(function(DB){

      // Make sure we have some info
      if (DB.info.length === 0)
        throw "No info stored";

      // Make sure there's something returned
      if (DB.data.length === 0)
        throw "No data loaded";

      done();
      });
    });
  });







// describe('drive', function() {
//   it('converts & into &amp;', function() {
//     escape('&').should.equal('&amp;');
//   });

//   it('converts " into &quot;', function() {
//     escape('"').should.equal('&quot;');
//   });

//   it("converts ' into &#39;", function() {
//     escape("'").should.equal('&#39;');
//   });

//   it('converts < into &lt;', function() {
//     escape('<').should.equal('&lt;');
//   });

//   it('converts > into &gt;', function() {
//     escape('>').should.equal('&gt;');
//   });
// });

// describe('#unescape', function() {
//   it('converts &amp; into &', function() {
//     unescape('&amp;').should.equal('&');
//   });

//   it('converts &quot; into "', function() {
//     unescape('&quot;').should.equal('"');
//   });

//   it('converts &#39; into '', function() {
//     unescape('&#39;').should.equal(''');
//   });

//   it('converts &lt; into <', function() {
//     unescape('&lt;').should.equal('<');
//   });

//   it('converts &gt; into >', function() {
//     unescape('&gt;').should.equal('>');
//   });
// });
