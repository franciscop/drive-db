/* jshint expr:true */
const fs = require('fs-promise');
const drive = require('../index')();
const throws = require('./throws');


// Testing that we are able to load the library
describe("reading a local db", function(){

  beforeAll(() => {
    return fs.writeFile('./test/db.json', fs.readFileSync('./test/data.json'));
  });

  it('can be performed', async () => {
    const db = await drive.readDB('test/db.json');
    expect(db.data).toEqual(jasmine.any(Array));
    expect(db.data.length).toBeGreaterThan(0);
  });

  it('is possible for non-default path', async () => {
    const db = await drive.readDB('test/alt.json');
    expect(db.data.data instanceof Array).toBe(true);
    expect(db.data.data.length).not.toBe(0);
  });

  it("has error when the file doesn't exist", throws(async () => {
    const drive = require('../index')({ local: 'test/NOdb.json' });
    const db = await drive.readDB(null);
  }));

  it("has error when the file is malformed json", throws(async () => {
    const drive = require('../index')({ local: 'test/wrongdb.json' });
    const db = await drive.readDB(null);
  }));
});
