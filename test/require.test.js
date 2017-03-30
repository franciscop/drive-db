/* jshint expr:true */
const throws = require('./throws');

// Testing that we are able to load the library
describe("including the library", () => {

  it('is possible without initializing', () => {
    const drive = require('../index');
    expect(drive).toBeDefined();
  });

  it('can be loaded without options', () => {
    const drive = require('../index')();
    expect(drive.data).toBeDefined();
  });

  it('can load a single option as the sheet', () => {
    const drive = require('../index')('abc');
    expect(drive.sheet).toBe('abc');
  });

  // Make sure there's DB
  it('can set all options', () => {

    const options = {
      sheet: 'abc',
      local: 'db.json',
      cache: 10000
    };

    const drive = require('../index')(options);
  });

  it("gives an error without sheet", throws(async () => {
    const drive = require('../index')();
    const db = await drive.load();
  }));
});
