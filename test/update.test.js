/* jshint expr:true */
var fs = require('fs');
var drive = require('../index')({ local: "test/db.json" });
var throws = require('./throws.js');


describe('updating the local cache', function(){

  it('should update the db', function(done){
    // Retrieve the spreadsheet
    require('../index')().update('1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc', 'test/db2.json', function(err, db){
      if (err) throw err;
      expect(db.data).toBeDefined();
      expect(db.data.length).toBeGreaterThan(0);

      var edited = new Date(fs.statSync('./test/db2.json').mtime).getTime();
      expect(edited).toBeLessThan(new Date().getTime());
      expect(edited + 2000).toBeGreaterThan(new Date().getTime());
      done();
    });
  });

  it('[async] should update the db', async () => {
    // Retrieve the spreadsheet
    const drive = require('../index')();
    const db = await drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", "test/db.json");
    expect(db.data).toBeDefined();

    var edited = new Date(fs.statSync('./test/db.json').mtime).getTime();
    expect(edited).toBeLessThan(new Date().getTime());
    expect(edited + 2000).toBeGreaterThan(new Date().getTime());
    return;
  });

  it('gives error for wrong google id', function(done){
    require('../index')().update("wrong-id", null, function(err, db){
      expect(err).toBeInstanceOf(Error);
      done();
    });
  });

  it('[async] gives error for wrong google id', throws(async () => {
    const db = await require('../index')().update("wrong-id", null);
  }));

  it('requires a google id', function(done){
    require('../index')().update(null, null, function(err, db){
      expect(err).toBeDefined();
      done();
    });
  });


  it('[async] requires a google id', throws(async () => {
    const db = await require('../index')().update(null, null);
  }));

});
