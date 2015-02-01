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



## .update(id[, afterupdate])

Retrieves the google drive spreadsheet asynchronously, process it and store it locally. It needs at least the google drive id as first parameter, and it accepts a callback that will be processed afterwards. An example:

    drive.update("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");

Another example:

    drive.update("1BfDC-ryuqahvAVKFpu21KytkBWsFDSV4clNex4F1AXc", function(data){
      console.log("There are " + data.length + " rows");
      return data;
      });

Yet another one:

    drive.update("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k", function(data){
      data.forEach(function(row){
        row.fullname = row.firstname + " " + row.lastname;
        });
      return data;
      });

Note that, if you call `.update(id)` and the file doesn't exist yet, it will be created.


## .find([filter])

Retrieve data from the database. If there's no filter, the whole spreadsheet will be retrieved. It behaves in the same way as mongoDB's [comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/), so you can read the documentation there. Returns a javascript Array with the extra methods `.order()` and (not yet) `.limit(begin, end)`. So, the documentation is here:

> **[mongoDB comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/)**


## .order(field[, desc])

> This has been called `order()` instead of `sort()` as a javascript Array already has a native method called `sort()` which works quite diferent.

Sort the data by the given field. It sorts it in an ascendant order. Pass a second parameter as true and it will sort it in a descendant order. It should be called **after** `.find()`. Examples:

    // Ascendant order
    var people = drive.sort('firstname').find();

    // Descedant order
    var inversepeople = drive.sort('firstname', true).find();

    var smiths = drive.sort('firstname').find({ lastname: "Smith" });



## .limit(begin, end)

> An alternative name to the native `.slice()`. The [Mozilla documentation](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) is pretty neat. I created this to make it consistent to database manipulation names.

Limit the data that can be retrieved. It should be applied to the returning array from `.find()`, and not before:

    // Limit the set to the first 10 elements
    drive.find().limit(0, 10);

    // Retrieve the next 10 elements (pagination, infinite scroll, etc)
    drive.find().limit(10, 20);

    // Retrieves the last 2 elements
    drive.find().limit(-2);

    // Order the query and limit it
    drive.find().sort("firstname").limit(0, 10);