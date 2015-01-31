# drive-db

A Google Drive spreadsheet simple database. Stop wasting your time when a simple table is enough. Perfect for collaboration with multiple people editing the same table.



## Usage

The database is stored locally and updated whenever you want from the spreadsheet. For detailed documentation read documentation.md, but it's really easy to use:

    // Include the module and load the data from the default local cache
    var drive = require("drive-db").load();

    // Retrieve all the people named `John`
    var Johns = drive.find({ firstname: "John" });


To update the data asynchronously, call next code. Update it whenever you want, after the `.load()` or each X seconds/minutes/hours:
    
    // Update the local data (async)
    drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc");

You can perform `find()` queries like mongoDB's [comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/) after you have called `.load()` (otherwise you have nothing to find):

    // Return an array with one element that has the id 3
    drive.find({ id: 3 });  

    // Return an array of people called "John" or "Jack"
    drive.find({ firstname: { $in: ["John", "Jack"]] } });

    // Return an array with everyone but "John"
    drive.find({ firstname: { $ne: "John" } });


## Installation

    npm install drive-db --save

To get the right google drive spreadsheet:

- Create the spreadsheet
- File > Publish to the Web > Publish
- Copy the id between `/spreadsheets/` and `/edit` in the url:
    
    > [https://docs.google.com/spreadsheets/d/<strong>1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k</strong>/edit#gid=0](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0)

- Use this inside `update()`
    
        drive.update("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");



## Test

    npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

Areas where I'm seeking for help:

- Coverage of tests
- Documentation
- Testing it


## Release history

- 1.5 Gave the `info` to the global object instead of a sub-object. Stored the error and code from the update in the db. Added the method `order()` for the array from `find()`.
- 1.4 Changed the way it works internally from url to spreadsheet id.
- 1.3  Stopped `require('drive-db')` from calling `.load()` automatically. The DB might me elsewhere. There's always an `.after` function.
- 1.2 Changed several things. Created `documentation.md`, which should be up to date to keep up with the changes.
- 1.1 Changed the parameter inside `load()`. Now it's the file where the cache is stored.
- 1.0.0 First release

Thanks

- [Creating and publishing a node.js module](https://quickleft.com/blog/creating-and-publishing-a-node-js-module/)
