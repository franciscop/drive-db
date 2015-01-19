# drive-db
A Google Drive spreadsheet simple database. Stop wasting your time when a simple table is enough. Perfect for collaboration with multiple people editing the same table.

## Installation

    npm install drive-db --save

## Usage

The database is stored locally and updated when you want from the spreadsheet. Easy to use:

    // Include the module
    // We can .load() it if we're using the default cachePath
    var drive = require("drive-db").load();

    // Retrieve all the Johns
    var Johns = drive.find({ firstname: "John" });


To update the data async, you should call this. Update it whenever you want, after the .load() or once each X seconds/minutes:

    var drive = require("drive-db").load();

    // The spreadsheet to retrieve. Set it before updateCache()
    drive.url = "https://spreadsheets.google.com/feeds/list/1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc/od6/public/values?alt=json";
    
    // Update the local data (async)
    drive.updateCache();

Also perform `find()` queries like mongoDB's [comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/). They are compatible:

    var drive = require("drive-db").load();

    // Return a list with one element with the id 3
    drive.find({ id: 3 });  

    // Return a list where the firstnames are "John" or "Jack"
    drive.find({ firstname: { $in: ["John", "Jack"]] } });

    // Return a list with everyone but "John"
    drive.find({ firstname: { $ne: "John" } });


## Options

The different configurations that can be loaded for drive:

    // The remote spreadsheet to load. No default
    drive.url = "";

    // Where to cache the data. Defaults to "db.json"
    drive.cachePath = "db.json";


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

- 1.0.0 First release


npm module created following this guide: https://quickleft.com/blog/creating-and-publishing-a-node-js-module/
