# drive-db [![npm install drive-db](https://img.shields.io/badge/npm%20install-drive--db-blue.svg)](https://www.npmjs.com/package/drive-db) [![test badge](https://github.com/franciscop/drive-db/workflows/tests/badge.svg)](https://github.com/franciscop/drive-db/blob/master/index.test.js) [![demo](https://img.shields.io/badge/demo-blue.svg)](https://jsfiddle.net/franciscop/1w4t7mc5/)

Use Google Drive spreadsheets as a simple database for Node.js and the browser. Perfect for collaboration with multiple people editing the same spreadsheet:

```js
import drive from 'drive-db';

// Load the data from the Drive Spreadsheet
(async () => {
  const db = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
  console.log(db);
})();
```

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

Create the Google Drive spreadsheet and **publish it**:

- Create [a Google Spreadsheet](https://www.google.com/sheets/about/)
- File > Publish to the Web > Publish
- Copy the id between `/spreadsheets/` and `/edit` in the url:

    > [https://docs.google.com/spreadsheets/d/<strong>1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k</strong>/edit](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit)

Now you can either add the CDN <script> or use a bundler. For the CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/drive-db"></script>
```

Otherwise install `drive-db` in your project:

```bash
npm install drive-db
```

And then load the spreadsheet into your project:

```js
// Include the module and tell it which spreadsheet to use
const drive = require("drive-db");

// Create an async context to be able to call `await`
(async () => {
  // Load the data from the Drive Spreadsheet
  const db = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");

  console.log(db);
})();
```

The table has to have a structure similar to this, where the first row are the alphanumeric field names:

| id | firstname | lastname | age | city          |
|----|-----------|----------|-----|---------------|
| 1  | John      | Smith    | 34  | San Francisco |
| 2  | Merry     | Johnson  | 19  | Tokyo         |
| 3  | Peter     | Williams | 45  | London        |

See [this document](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0) as an example. **Please do not request access to edit it**.



## API

You import a single default export depending on your configuration:

```js
// For ES7 modules
import drive from "drive-db";

// For common.js imports
const drive = require("drive-db");
```

To retrieve the data call it and await for the promise it returns:

```js
// With async/await:
const db = await drive(SHEET_ID);
const db = await drive(options);
console.log(db);

// Use the callback syntax:
drive(SHEET_ID).then(db => console.log(db));
drive(options).then(db => console.log(db));
```

**SHEET_ID**: alias of `options = { sheet: SHEET_ID }`:

```js
const db = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
console.log(db);
```

**options**: a simple object containing some options:

```js
const db = await drive({
  sheet: "1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k",
  tab: "1",
  cache: 3600
});
```

- `sheet` (required): when editing a google spreadsheet, it's the part between `/spreadsheets/` and `/edit` in the url. Please make sure to also publish the spreadsheet before copying it (File > Publish to the Web > Publish)
- `tab` (`"1"`): the tab to use in the spreadsheet, which defaults to the first tab. It's the number *as a string* of the tab. See [this demo](https://jsfiddle.net/franciscop/oj0fg9n6/) as an example of how to load the second tab.
- `cache` (`3600`): set the maximum time (in **seconds**) that the current cache is valid. After this, the data will be loaded again when the function is called. This is really useful when combined with development env constant. Set to 0 to refresh in each request.

It returns a plain Javascript array. With ES6+, operations on arrays are great, but feel free to use Lodash or similar if you want some more advanced queries.

If you are using [server for Node.js](https://serverjs.io/) with ES6+:

```js
const drive = require("drive-db");
const sheet = "1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k"; // Or from .env

const server = require("server");
const { get } = server.router;
const { render } = server.reply;

const home = get("/", async ctx => {
  const records = await drive(sheet);
  return render("index", { records });
});

server(home);
```

## Advanced

There are some more advanced things that you might consider. While I recommend you to read the code for this, here are a couple of examples.


### Warm the cache

To warm the cache on project launch before the first request comes in, call the promise without awaiting or doing anything with it:

```js
const drive = require("drive-db");
const sheet = "1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k";
// Warms the cache as soon as the Node.js project is launched
drive(sheet);

const server = require("server");
const { get } = server.router;
const { render } = server.reply;

const home = get("/", async ctx => {
  // Cache is already warm when this request happens
  const records = await drive(sheet);
  return render("index", { records });
});

server(home);
```


### Refresh the cache

To force-refresh the cache at any point you can call `drive()` with a cache time of 0:

```js
drive({ sheet, cache: 0 });
```

### Load locally

This is not available anymore. Since `drive-db` returns a plain array, you can just load the data locally:

```js
const data = require("./data.json");
```



## Thanks to

- [Creating and publishing a node.js module](https://quickleft.com/blog/creating-and-publishing-a-node-js-module/)
