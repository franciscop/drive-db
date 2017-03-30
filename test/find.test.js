/* jshint expr:true */
const drive = require('../index')();
const data = require('./data.json');

// Testing that we are able to find records
describe("drive.find()", () => {

  // Overload the data with a known set
  beforeAll(() => { drive.data = data; });

  it('should load all records', () => {
    expect(drive.find().length).toBe(6);
  });
});



describe('drive.find(filter)', () => {

  it('should load first record', () => {
    expect(drive.find({ id: 1 }).length).toBe(1);
  });

  it('should load John record', () => {
    expect(drive.find({ firstname: "John" }).length).toBe(1);
  });

  it('can find more than one person', () => {
    expect(drive.find({ lastname: "Johnson" }).length).toBe(2);
  });

  it('no records', () => {
    expect(drive.find({ lastname: "dgwse" }).length).toBe(0);
  });
});



describe('drive.find(complexfilter)', () => {

  // Retrieve the spreadsheet
  it('should load records with id > 4', () => {
    const records = drive.find({ id: { $gt: 4 } });
    expect(records.length).toBe(2);
    const none = records.filter(row => row.id <= 4);
    expect(none.length).toBe(0);
  });
});
