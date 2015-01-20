# Documentation



## Installation

Go to your project folder and install it with:

    npm install drive-db --save

With the `--save` flag you add it to the dependencies so you can uncheck `node_modules` from git.



## Include the module

    var drive = require('drive-db');

With this command you can include it straight away. All other methods below require you to include the module properly. Of course, you can call the module `drive` or `db`. The module name, `drive-db`, comes from the fact that I kept mixing both of the names in the code.

However we recommend you to do this. Read the rationale in the following point:

    var drive = require('drive-db').load();


## .load([filename])

With this command you load the local database from its default location, `db.json`:

    drive.load();

This is the same as doing:

    drive.load('db.json');

However, if you have more than one table or you just want to put it in a different place or with a different name, you can do so easily:

    drive.load('db/drive.json');

Note that, if you call `.load(filename)` and the file doesn't exist yet, it will be created.



## .update(id[, callback])

Retrieves the google drive spreadsheet asynchronously, process it and store it locally. It needs at least the google drive id as first parameter, and it accepts a callback that will be processed afterwards. An example:

    drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc");

Another example:

    drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", function(data){
      console.log("There are " + data.length + " rows");
      });

Yet another one:

    drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", function(data){
      data.forEach(function(row){
        row.fullname = row.firstname + " " + row.lastname;
        });
      this.data = data;
      });



## .find([filter])

Retrieve data from the database. If there's no filter, the whole spreadsheet will be retrieved. It behaves in the same way as mongoDB's [comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/), so you can read the documentation there. The only difference is that it returns a normal array, so any sort or limit must happen beforehand.



## .sort(field[, desc])

> This is tested only informally, but no formal test have been written yet. It does seem to work, but further testing is required. This might change soon (see note in `.limit()`)

Sort the data by the given field. It sorts it in an ascendant order. Pass a second parameter as true and it will sor it in a descendant order. It should be called **before** `.find()`. Examples:

    var people = drive.sort('firstname').find();

    var inversepeople = drive.sort('firstname', desc).find();

    var smiths = drive.sort('firstname').find({ lastname: "Smith" });



## .limit(begin, end)

> Not yet developed

Limit the data that can be retrieved. The reason it's not developed yet is that we need a strong concept to avoid clipping the data for future queries in the db. This would give some trouble currently:

    // Correctly finds from 0 to 10
    drive.limit(0, 10).find();

    // Incorrectly only finds from 0 to 10
    drive.find();

Possible solution: to create an object that extends array so that the result returned by `find()` can be processed as does mongoDB with `collection`. It would work the other way around:

    drive.find().limit(0, 10);
    drive.find().limit(0, 10).sort("firstname");
    drive.find().sort("firstname", true);

