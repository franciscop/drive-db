# drive-db
A Google Drive spreadsheet simple database

## Install it

To install it within your node.js application, simply do:

    npm install drive-db --save

## Retrieving the data

The database is stored locally and updated when you want from the spreadsheet. Easy to use:

    var drive = require("drive-db");
    drive.url = "https://spreadsheets.google.com/feeds/list/1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc/od6/public/values?alt=json";

    // Load the local data
    drive.load(function(db){

      // Retrieve everyone called "John"
      var Johns = db.find({ firstname: "John" });

      });

    // Update the local data (async)
    drive.updateCache();



## Options

The different configurations that can be loaded for drive:

    // The remote spreadsheet to load. Defaults to none
    drive.url = "";

    // Where to cache the data. Defaults to "db.json"
    drive.cachePath = "db.json";




npm module created following this guide: https://quickleft.com/blog/creating-and-publishing-a-node-js-module/
