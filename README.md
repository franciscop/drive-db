# drive-db
A Google Drive spreadsheet simple database

## Install it

To install it within your node.js application, simply do:

    npm install drive-db --save

## Retrieving the data

The database is stored locally and updated when you want from google drive spreadsheet. To load some data, just do:

    var drive = require("drive-db");
    drive.url = "https://spreadsheets.google.com/feeds/list/1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc/od6/public/values?alt=json";

    // Load the local data
    drive.load(function(db){
      var Johns = db.find({ firstname: "John" });
      });

    // Update the local data (async)
    drive.updateCache();



npm module created following this guide: https://quickleft.com/blog/creating-and-publishing-a-node-js-module/
