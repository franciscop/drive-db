/* jshint expr:true */
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var fs = require('fs');

const drive = require('../index')();


// Testing that we are able to load the library
describe("reading a local db", function(){



  before(function(done){
    fs.writeFileSync('./test/db.json', fs.readFileSync('./test/data.json'));
    done();
  });



  it('is possible', function(done){
    var drive = require('../index')({ local: 'test/db.json' });
    expect(drive.data).to.be.empty;
    drive.readDB("test/db.json", function(err, db){
      expect(db.data).to.be.instanceof(Array);
      expect(db.data).to.be.not.empty;
      done();
    });
  });

  it('[async] is possible', async () => {
    const db = await drive.readDB('test/db.json');
    expect(db.data).to.be.instanceof(Array);
    expect(db.data).to.be.not.empty;
  });



  it('is possible for non-default path', function(done){
    var drive = require('../index')();
    drive.readDB('test/alt.json', function(err, db){
      expect(db).to.be.an.array;
      expect(db).to.be.not.empty;
      done();
    });
  });

  it('[async] is possible for non-default path', async () => {
    const db = await drive.readDB('test/alt.json');
    expect(db).to.be.an.array;
    expect(db).to.be.not.empty;
  });



  it("has error when the file doesn't exist", function(done){
    var drive = require('../index')({ local: 'test/NOdb.json' });
    drive.readDB(null, function(err, db){
      expect(err).to.be.not.null;
      done();
    });
  });

  it("[async] has error when the file doesn't exist", async () => {
    const drive = require('../index')({ local: 'test/NOdb.json' });
    try {
      const db = await drive.readDB(null);
    } catch (err) {
      return;
    }
    throw new Error('Should not get here');
  });



  it("has error when the file is malformed json", function(done){
    var drive = require('../index')({ local: 'test/wrongdb.json' });
    drive.readDB(null, function(err, db){
      expect(err).to.be.not.null;
      done();
    });
  });

  it("[async] has error when the file is malformed json", async () => {
    const drive = require('../index')({ local: 'test/wrongdb.json' });
    try {
      const drive = await drive.readDB(null);
    } catch(err) {
      return;
    }
    throw new Error('Should not get here');
  });
});
