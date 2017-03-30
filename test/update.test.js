/* jshint expr:true */
const fs = require('fs');
const drive = require('../index')({ local: "test/db.json" });
const throws = require('./throws.js');

describe('updating the local cache', function(){

  it('should update the db', async () => {
    // Retrieve the spreadsheet
    const drive = require('../index')();
    const db = await drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", "test/db.json");
    expect(db.data).toBeDefined();

    const edited = new Date(fs.statSync('./test/db.json').mtime).getTime();
    expect(edited).toBeLessThan(new Date().getTime());
    expect(edited + 2000).toBeGreaterThan(new Date().getTime());
    return;
  });

  it('gives error for wrong google id', throws(async () => {
    const db = await require('../index')().update("wrong-id", null);
  }));

  it('requires a google id', throws(async () => {
    const db = await require('../index')().update(null, null);
  }));
});
