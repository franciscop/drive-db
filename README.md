[![Build Status](https://travis-ci.org/franciscop/drive-db.svg)](https://travis-ci.org/franciscop/drive-db)
[![Coverage Status](https://coveralls.io/repos/franciscop/drive-db/badge.svg?branch=master)](https://coveralls.io/github/franciscop/drive-db?branch=master)

# drive-db

Use Google Drive spreadsheets as a simple database for Node.js and the browser. Perfect for collaboration with multiple people editing the same spreadsheet. Works on the browser, Node.js and Functions:

| id | firstname | lastname | age | city          |
|----|-----------|----------|-----|---------------|
| 1  | John      | Smith    | 34  | San Francisco |
| 2  | Merry     | Johnson  | 19  | Tokyo         |
| 3  | Peter     | Williams | 45  | London        |

> Heads up! Since 5.0.0, the API has been simplified quite a lot! Also you can now use it in the front-end! 🎉

Becomes an array of objects with the corresponding keys:

```json
[
  {
    "id": "1",
    "firstname": "John",
    "lastname": "Smith",
    "age": "34",
    "city": "San Francisco"
  },
  {
    "id": "2",
    "firstname": "Merry",
    "lastname": "Johnson",
    "age": "19",
    "city": "Tokyo"
  },
  ...
]
```



## Getting Started

Install `drive-db` in your project:

```bash
npm install drive-db
```

To get the right Google Drive spreadsheet:

- Create [a Google Spreadsheet](https://www.google.com/sheets/about/)
- File > Publish to the Web > Publish
- Copy the id between `/spreadsheets/` and `/edit` in the url:

    > [https://docs.google.com/spreadsheets/d/<strong>1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k</strong>/edit#gid=0](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0)

Load the spreadsheet into your project:

```js
// Include the module and tell it which spreadsheet to use
const drive = require("drive-db");

(async () => {
  const db = await drive("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc");

  // Find all people from San Francisco
  const sf = db.filter(entry => /San Francisco/i.test(entry.city));

  console.log(sf);
})();
```

The table has to have a structure similar to this, where the first row are the alphanumeric field names:

| id | firstname | lastname | age | city          |
|----|-----------|----------|-----|---------------|
| 1  | John      | Smith    | 34  | San Francisco |
| 2  | Merry     | Johnson  | 19  | Tokyo         |
| 3  | Peter     | Williams | 45  | London        |

See [this document](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0) as an example. **Please do not request access to edit it**.



## Include the module

```js
// For ES7 modules
import drive from "drive-db";

// For common.js imports
const drive = require("drive-db");
```

To initialize it, call it and await for the promise it returns:

```js
// With async/await:
const db = await drive(SHEET_ID);
const db = await drive(options);

// Use the callback syntax:
drive(SHEET_ID).then(db => { ... });
drive(options).then(db => { ... });
```

**SHEET_ID**: this is the only option that is required. When editing a google spreadsheet, it's the part between `/spreadsheets/` and `/edit` in the url. Please make sure to also publish the spreadsheet before copying it (File > Publish to the Web > Publish):

```js
const db = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
console.log(db);
```

**options**: a simple object containing some options. Example with all the defaults:

```js
const db = await drive({
  sheet: "",
  tab: "default",
  cache: 3600,
  onload: data => data
});
```

- `sheet`: set the spreadsheet id. Read the previous point
- `cache`: set the maximum time (in **seconds**) that the current cache is valid. After this, the data will be loaded again when the function is called. This is really useful when combined with development env constant. Set to 0 to refresh in each request.
- `onload`: a function that sets a transformation between the data of the spreadsheet and the local db. It accepts the whole array and must return the whole modified array and it's useful to avoid doing the operations on each request. You can return a promise here and it will be waited. It will be called ON EACH CALL, even if the underlying data was cached.

It returns a plain Javascript array. With ES6+, operations on arrays are great, but feel free to use Lodash or similar if you want some more advanced queries.

If you are using [server for Node.js](https://serverjs.io/) with ES6+:

```js
const drive = require("drive-db");
const server = require("server");
const { get } = server.router;
const sheet = "1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k"; // Or from .env

// Pro-tip: warm the cache as soon as the Node.js project is launched
drive(sheet);

const home = get("/", async ctx => {
  const records = await drive(sheet);
  ctx.res.render("index", { records });
});

server(home);
```

## Advanced

There are some more advanced things that you might consider. While I recommend you to read the code for this, here are a couple of examples.

### Refresh the cache

To clear and refresh the cache, call `drive()` with a cache time of 0:

```js
drive({ sheet, cache: 0 });
```

### Load locally

This is not available anymore. Since `drive-db` returns a plain array, so you could just load the data locally:

```js
const data = require("./data.json");
```



## Thanks to

- [Creating and publishing a node.js module](https://quickleft.com/blog/creating-and-publishing-a-node-js-module/)
