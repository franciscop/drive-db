/* jshint expr:true */

// Testing that we are able to load the library
describe("including the library", function(){

  it('is possible without initializing', function(){
    var drive = require('../index');
    expect(drive).toBeDefined();
  });

  it('can be loaded without options', function(){
    var drive = require('../index')();
    expect(drive.data).toBeDefined();
  });

  it('can load a single option as the sheet', function(){
    var drive = require('../index')('abc');
    expect(drive.sheet).toBe('abc');
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
      expect(drive[name]).toEqual(options[name]);
    }
  });

  // Make sure there's DB
  it("gives an error without sheet", function(done){
    var drive = require('../index')();
    drive.load(function(err){
      expect(err).toBeDefined();
      done();
    });
  });

  it("[async] gives an error without sheet", async () => {
    const drive = require('../index')();
    try {
      const db = await drive.load();
    } catch (err) {
      return;
    }
    throw new Error('Should not get here');
  });
});
