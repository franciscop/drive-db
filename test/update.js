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
      if (err) throw err;
      expect(db.data).to.be.not.empty;

      var edited = new Date(fs.statSync('./test/db.json').mtime).getTime();
      expect(edited).below(new Date().getTime());
      expect(edited + 2000).to.be.above(new Date().getTime());
      done();
    });
  });

  it('[async] should update the db', async () => {
    // Retrieve the spreadsheet
    const drive = require('../index')();
    const db = await drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", "test/db.json");
    expect(db.data).to.be.not.empty;

    var edited = new Date(fs.statSync('./test/db.json').mtime).getTime();
    expect(edited).below(new Date().getTime());
    expect(edited + 2000).to.be.above(new Date().getTime());
    return;
  });

  it('gives error for wrong google id', function(done){
    require('../index')().update("wrong-id", null, function(err, db){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  it('[async] gives error for wrong google id', async () => {
    try {
      const db = await require('../index')().update("wrong-id", null);
    } catch(err) {
      return;
    }
    throw new Error('Should not get here');
  });

  it('requires a google id', function(done){
    require('../index')().update(null, null, function(err, db){
      expect(err).to.be.not.null;
      done();
    });
  });


  it('[async] requires a google id', async () => {
    try {
      const db = await require('../index')().update(null, null);
    } catch(err) {
      return;
    }
    throw new Error('Should not get here');
  });

});
