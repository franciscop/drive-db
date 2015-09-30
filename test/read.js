/* jshint expr:true */
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var fs = require('fs');


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



  it('is possible for non-default path', function(done){

    var drive = require('../index')();
    drive.readDB('test/alt.json', function(err, db){
      expect(db).to.be.an.array;
      expect(db).to.be.not.empty;
      done();
    });
  });



  it("has error when the file doesn't exist", function(done){

    var drive = require('../index')({ local: 'test/NOdb.json' });
    drive.readDB(null, function(err, db){
      expect(err).to.be.not.null;
      done();
    });
  });



  it("has error when the file is malformed json", function(done){

    var drive = require('../index')({ local: 'test/wrongdb.json' });
    drive.readDB(null, function(err, db){
      expect(err).to.be.not.null;
      done();
    });
  });
});
