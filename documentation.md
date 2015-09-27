# Documentation



## Installation

Go to your project folder and install it with:

    npm install drive-db --save

With the `--save` flag you add it to the dependencies so [you can uncheck `node_modules` from git](http://stackoverflow.com/a/19416403/938236).



## Include the module

```js
var drive = require('drive-db')();
var drive = require('drive-db')(SHEET_ID);
var drive = require('drive-db')(options);
```

With any of these commands you can include it straight away. All other methods below require you to include the module like this. Of course, you can call the module `drive` or `db`. The module name, `drive-db`, comes from the fact that I kept mixing both of the names in the code.

**No parameters**: you can just load it with no parameters (provide the `sheet` id later)

```js
var drive = require('drive-db')();
```

**SHEET_ID**: this is the only option that really needs to be set when calling `.load()`. When editing a google spreadsheet, it's the part between `/spreadsheets/` and `/edit` in the url. Please make sure to also publish the spreadsheet before copying it (File > Publish to the Web > Publish):

```js
require('drive-db')("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
```

**options**: a simple object containing some options. Example with all the defaults:

```js
var drive = require('drive-db')({
  sheet: "",
  db: "db.json",
  timeout: 3600,
  onload: function(data){ return data; }
});
```

- `sheet`: set the spreadsheet id. Read the previous point
- `db`: set the local db name relative to the root
- `timeout`: set the maximum time (in seconds) that the current cache is valid. After this, the data will be loaded again
- `onload`: a function that sets a transformation between the data of the spreadsheet and the local db. It accepts the whole array and must return the whole modified array and it's useful to avoid doing the operations on each request

These options can also be loaded at any point after loading the module. Here with the defaults again:

```js
var drive = require('drive-db')();
drive.sheet = "";
drive.db = "db.json";
drive.timeout = 3600;
drive.onload = function(data){ return data; };
```


## .load(callback)

```js
drive.load(callback);
```

Loads the data prepared to use it in an async manner. The callback gets first an error object and second a database instance, following Node's convention. The database instance is the same object as drive, we only change its name to note that the data is already loaded.

You can only call it if you have previously included `sheet` variable in some way:

```js
var drive = require('drive-db')("1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k");
drive.load(function(err, db){
  if (err) return next(err);
  console.log("Database loaded correctly");
});
```



## .find([filter])

Retrieve data from the database. If there's no filter, the whole spreadsheet will be retrieved. It behaves in the same way as mongoDB's [comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/), so you can read the documentation there. Returns a javascript Array with the extra methods `.order()` and (not yet) `.limit(begin, end)`. So, the documentation is here:

> **[mongoDB comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/)**


## .order(field[, desc])

> This has been called `order()` instead of `sort()` as a javascript Array already has a native method called `sort()` which works quite diferent.

Sort the data by the given field. It sorts it in an ascendant order. Pass a second parameter as true and it will sort it in a descendant order. It should be called **after** `.find()`. Examples:

// Ascendant order
var people = drive.find().order('firstname');

// Descedant order
var inversepeople = drive.find().order('firstname', true);

var smiths = drive.find({ lastname: "Smith" }).order('firstname');



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
