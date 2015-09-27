/* jshint expr:true */
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var fs = require('fs');
var drive = require('../index')({ local: "test/db.json" });



describe('updating the local cache', function(){

  it('should update the db', function(done){

    // Retrieve the spreadsheet
    require('../index')().update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", "test/db.json", function(err, db){
      expect(db.data).to.be.not.empty;

      var edited = new Date(fs.statSync('./test/db.json').mtime).getTime();
      expect(edited).below(new Date().getTime());
      expect(edited + 100).to.be.above(new Date().getTime());
      done();
      });
    });

  it('gives error for wrong google id', function(done){

    require('../index')().update("wrong-id", null, function(err, db){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  it('requires a google id', function(done){

    require('../index')().update(null, null, function(err, db){
      expect(err).to.be.not.null;
      done();
    });
  });

});
