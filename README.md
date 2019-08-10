[![Build Status](https://travis-ci.org/franciscop/drive-db.svg)](https://travis-ci.org/franciscop/drive-db)
[![Coverage Status](https://coveralls.io/repos/franciscop/drive-db/badge.svg?branch=master)](https://coveralls.io/github/franciscop/drive-db?branch=master)

# drive-db

A Google Drive spreadsheet as a simple database. Perfect for collaboration with multiple people editing the same spreadsheet:

| id | firstname | lastname | age | city          |
|----|-----------|----------|-----|---------------|
| 1  | John      | Smith    | 34  | San Francisco |
| 2  | Merry     | Johnson  | 19  | Tokyo         |
| 3  | Peter     | Williams | 45  | London        |

> Heads up! Since 5.0.0, the API has been simplified quite a lot! Also you can now use it in the front-end! 🎉

Becomes a JSON file and an array of objects in your code:

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
  {
    "id": "3",
    "firstname": "Peter",
    "lastname": "Williams",
    "age": "45",
    "city": "London"
  }
]
```


## Usage

To access it with the default configuration you just need to provide the Google Drive's sheet id. Read more in [**the full documentation**](https://github.com/franciscop/drive-db/blob/master/documentation.md), but here's a basic example:

```js
// Include the module and tell it which spreadsheet to use
const drive = require("drive-db");

// Load the spreadsheet
drive("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc").then(db => {

  // Find all people from San Francisco
  const sf = db.filter(entry => /San Francisco/i.test(entry.city));

  console.log(sf);
});
```



## Installation

```bash
npm install drive-db
```

To get the right Google Drive spreadsheet:

- Create [a Google Spreadsheet](https://www.google.com/sheets/about/)
- File > Publish to the Web > Publish
- Copy the id between `/spreadsheets/` and `/edit` in the url:

    > [https://docs.google.com/spreadsheets/d/<strong>1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k</strong>/edit#gid=0](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0)

- Use this with the module in any of the following ways:

```js
// Single argument can be passed as that
const db = await drive("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");

// If you want to add more options
const db = await drive ({
  sheet: "1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k"
});
```

The table has to have a structure similar to this, where the first row are the alphanumeric field names:

| id | firstname | lastname | age | city          |
|----|-----------|----------|-----|---------------|
| 1  | John      | Smith    | 34  | San Francisco |
| 2  | Merry     | Johnson  | 19  | Tokyo         |
| 3  | Peter     | Williams | 45  | London        |

See [this document](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0) as an example. **Please do not request access to edit it**.


## Test

To run the tests, simply call:

```bash
npm test
```



## Thanks to

- [Creating and publishing a node.js module](https://quickleft.com/blog/creating-and-publishing-a-node-js-module/)
