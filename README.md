# drive-db

A Google Drive spreadsheet simple database. Stop wasting your time when a simple table is enough. Perfect for collaboration with multiple people editing the same spreadsheet.


## Usage

To access it with the default configuration you just need to provide the Google Drive's sheet id. Read more in [**the full documentation**](https://github.com/franciscop/drive-db/blob/master/documentation.md), but here's an example:

```js
// Include the module and tell it which spreadsheet to use
var drive = require("drive-db")("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc");

// Load the spreadsheet
drive.load(function(err, db){

  // Find all Johns by their last name
  var Johns = db.find({ firstname: "John" }).order('lastname');
});
```

The `db.find()` queries are the same as in mongoDB's [comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/):

```js
// Return an array with one element that has the id 3
db.find({ id: 3 });

// Return an array of people called "John" or "Jack"
db.find({ firstname: { $in: ["John", "Jack"]] } });
```


## Installation

```bash
npm install drive-db --save
```

To get the right google drive spreadsheet:

- Create a spreadsheet
- File > Publish to the Web > Publish
- Copy the id between `/spreadsheets/` and `/edit` in the url:

    > [https://docs.google.com/spreadsheets/d/<strong>1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k</strong>/edit#gid=0](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0)

- Use this with the module in any of the following ways:

```js
// Single argument can be passed as that
require('drive-db')("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");

// If you want to add more options
require('drive-db')({ sheet: "1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k", db: 'db.json' });

// Load it later on
var drive = require('drive-db')();
drive.sheet = "1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc";
```

Note: the table has to have a structure similar to this, where the first row are the alphanumeric field names:

| id | firstname | lastname | age | city          |
|----|-----------|----------|-----|---------------|
| 1  | John      | Smith    | 34  | San Francisco |
| 2  | Mery      | Johnson  | 19  | Tokyo         |
| 3  | Peter     | Williams | 45  | London        |

See [this document](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0) as an example


## Test

To run the tests, simply call:

```bash
npm test
```


## Contributing

Please take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

Areas where I'm seeking for help:

- Testing. Adding coverage or improving existing ones.
- Documentation. Make everything clear.


## Thanks to

- [Creating and publishing a node.js module](https://quickleft.com/blog/creating-and-publishing-a-node-js-module/)
