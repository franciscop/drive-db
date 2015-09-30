/* jshint expr:true */
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;


// Testing that we are able to load the library
describe("including the library", function(){



  it('is possible without initializing', function(){

    var drive = require('../index');

    expect(drive).to.be.an.object;
  });



  it('can be loaded without options', function(){

    var drive = require('../index')();

    expect(drive).to.be.an.object;

    expect(drive).to.have.property('data');
  });



  it('can load a single option as the sheet', function(){

    // Load the data
    var drive = require('../index')('abc');


    console.log(drive);
    expect(drive.sheet).to.equal('abc');
  });



  // Make sure there's DB
  it('can set all options', function(){

    var options = {
      sheet: 'abc',
      local: 'db.json',
      timeout: 10000
    };

    var drive = require('../index')(options);

    for (var name in options) {
      expect(drive[name]).to.equal(options[name]);
    }
  });



  // Make sure there's DB
  it("can load a sheet provided in options", function(done){

    var drive = require('../index')();
    drive.load(function(err){
      expect(err).to.be.not.null;
      done();
    });
  });



  // Make sure there's DB
  it("can load a sheet provided in the middle", function(done){

    var drive = require('../index')();
    drive.load(function(err){
      expect(err).to.be.not.null;
      done();
    });
  });



  // Make sure there's DB
  it("gives an error if we don't provide a sheet", function(done){

    var drive = require('../index')();
    drive.load(function(err){
      expect(err).to.be.not.null;
      done();
    });
  });
});
