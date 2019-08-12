/* jshint expr:true */
import drive from "./index.js";

// Testing that we are able to load the library
describe("drive-db", function() {
  it("returns a table", async () => {
    const db = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
    expect(Array.isArray(db)).toBe(true);
    expect(db.length).toBe(6);
    expect(db[0]).toEqual({
      id: "1",
      firstname: "John",
      lastname: "Smith",
      age: "34",
      city: "San Francisco",
      country: "USA",
      timestamp: "12/10/2010"
    });
  });

  it("requires a sheet", async () => {
    await expect(drive()).rejects.toEqual(
      new Error("Need a Google Drive sheet id to load")
    );
  });

  it("throws with a wrong sheet id", async () => {
    await expect(drive("abc")).rejects.toEqual(
      new Error(
        "Error 400 retrieving https://spreadsheets.google.com/feeds/list/abc/default/public/values?alt=json"
      )
    );
  });

  it("can work with old cache", async () => {
    const db = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
    expect(Array.isArray(db)).toBe(true);
    expect(db.length).toBe(6);
    const db2 = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
  });

  it("can work with expired cache", async () => {
    const db = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k", 100);
    expect(Array.isArray(db)).toBe(true);
    expect(db.length).toBe(6);
    await new Promise(done => setTimeout(done, 1000));
    const db2 = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
  });
});
