# drive-db
A Google Drive spreadsheet simple database. Stop wasting your time when a simple table is enough. Perfect for collaboration with multiple people editing the same table.

## Install it

To install it within your node.js application, simply do:

    npm install drive-db --save

## Retrieving the data

The database is stored locally and updated when you want from the spreadsheet. Easy to use:

    // Include the module
    // We can .load() it since we're using the default cacheFile
    var drive = require("drive-db").load();

    var Johns = drive.find({ firstname: "John" });

    // The spreadsheet to retrieve. Set it before updateCache()
    drive.url = "https://spreadsheets.google.com/feeds/list/1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc/od6/public/values?alt=json";
    
    // Update the local data (async)
    drive.updateCache();



## Options

The different configurations that can be loaded for drive:

    // The remote spreadsheet to load. No default
    drive.url = "";

    // Where to cache the data. Defaults to "db.json"
    drive.cachePath = "db.json";




npm module created following this guide: https://quickleft.com/blog/creating-and-publishing-a-node-js-module/
