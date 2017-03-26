/* jshint expr:true */
var fs = require('fs');
const drive = require('../index')();
const throws = require('./throws');


// Testing that we are able to load the library
describe("reading a local db", function(){

  beforeAll(function(done){
    fs.writeFileSync('./test/db.json', fs.readFileSync('./test/data.json'));
    done();
  });

  it('is possible', function(done){
    drive.readDB("test/db.json", function(err, db){
      expect(db.data).toEqual(jasmine.any(Array));
      expect(db.data.length).not.toBe(0);
      // expect(db.data).to.be.instanceof(Array);
      // expect(db.data).to.be.not.empty;
      done();
    });
  });

  it('[async] is possible', async () => {
    const db = await drive.readDB('test/db.json');
    expect(db.data).toEqual(jasmine.any(Array));
    expect(db.data.length).not.toBe(0);
    // expect(db.data).to.be.instanceof(Array);
    // expect(db.data).to.be.not.empty;
  });



  it('is possible for non-default path', function(done){
    var drive = require('../index')();
    drive.readDB('test/alt.json', function(err, db){
      // console.log(err, db.data.data);
      expect(db.data.data instanceof Array).toBe(true);
      expect(db.data.data.length).not.toBe(0);
      done();
    });
  });

  it('[async] is possible for non-default path', async () => {
    const db = await drive.readDB('test/alt.json');
    expect(db.data.data instanceof Array).toBe(true);
    expect(db.data.data.length).not.toBe(0);
  });



  it("has error when the file doesn't exist", function(done){
    var drive = require('../index')({ local: 'test/NOdb.json' });
    drive.readDB(null, function(err, db){
      expect(err).toBeDefined();
      done();
    });
  });

  it("[async] has error when the file doesn't exist", throws(async () => {
    const drive = require('../index')({ local: 'test/NOdb.json' });
    const db = await drive.readDB(null);
  }));



  it("has error when the file is malformed json", function(done){
    var drive = require('../index')({ local: 'test/wrongdb.json' });
    drive.readDB(null, function(err, db){
      expect(err).toBeDefined();
      done();
    });
  });

  it("[async] has error when the file is malformed json", throws(async () => {
    const drive = require('../index')({ local: 'test/wrongdb.json' });
    const db = await drive.readDB(null);
  }));
});
