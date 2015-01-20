# drive-db

A Google Drive spreadsheet simple database. Stop wasting your time when a simple table is enough. Perfect for collaboration with multiple people editing the same table.



## Usage

The database is stored locally and updated when you want from the spreadsheet. For more information read documentation.md, but it's really easy to use:

    // Include the module and load the data from the default local cache
    var drive = require("drive-db").load();

    // Retrieve all the people named `John`
    var Johns = drive.find({ firstname: "John" });


To update the data async, you should call this. Update it whenever you want, after the .load() or once each X seconds/minutes:

    var drive = require("drive-db").load();
    
    // Update the local data (async)
    drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc");

Then you can perform `find()` queries like mongoDB's [comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/). They are compatible:

    var drive = require("drive-db").load();

    // Return a list with one element with the id 3
    drive.find({ id: 3 });  

    // Return a list where the firstnames are "John" or "Jack"
    drive.find({ firstname: { $in: ["John", "Jack"]] } });

    // Return a list with everyone but "John"
    drive.find({ firstname: { $ne: "John" } });



## Installation

    npm install drive-db --save

To get the right google drive spreadsheet:

- Create it
- File > Publish to the Web > Publish
- Copy the id between `/spreadsheets/` and `/edit` in the url:
    
    > [https://docs.google.com/spreadsheets/d/<strong>1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k</strong>/edit#gid=0](https://docs.google.com/spreadsheets/d/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/edit#gid=0)

- Use this inside `update()`
    
    drive.update("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");



## Options

The different configurations that can be loaded for drive:

    // The full, remote spreadsheet to load. Use the one obtained previously
    drive.url = "https://spreadsheets.google.com/feeds/list/1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k/od6/public/values?alt=json";

    // The path where the local cache is stored
    drive.cachePath = "db.json";

    // Function to call just after `update()` is called. Nice for formatting data
    drive.after = function(){
      this.data.forEach(function(value, index)){
        this.data[index].img = "img/" + value.img;
        }
      this.saveCache();
      };



## Discuss

On **[Hacker News](https://news.ycombinator.com/item?id=8914508)** or in *issues* if you have any.



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

- 1.2.0 Changed several things. Created `documentation.md`, which should be up to date to keep up with the changes.
- 1.1.0 Changed the parameter inside `load()`. Now it's the file where the cache is stored.
- 1.0.0 First release


npm module created following this guide: https://quickleft.com/blog/creating-and-publishing-a-node-js-module/
