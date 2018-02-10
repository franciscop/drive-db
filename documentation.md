# Documentation

> This package has been updated to use only ES6 promises. The version 1.0 is callback-only and the 2.0 has both.


## Installation

Go to your project folder and install it with:

```bash
npm install drive-db --save
```

With the `--save` flag you add it to the dependencies so [you can uncheck `node_modules` from git](http://stackoverflow.com/a/19416403/938236).



## Include the module

```js
const drive = require('drive-db')();
const drive = require('drive-db')(SHEET_ID);
const drive = require('drive-db')(options);
```

With any of these commands you can include it straight away. All other methods below require you to include the module like this. Of course, you can call the module `drive` or `db`. The module name, `drive-db`, comes from the fact that I kept mixing both of the names in the code.

**No parameters**: you can just load it with no parameters and provide the `sheet` id later.

```js
const drive = require('drive-db')();
```

**SHEET_ID**: this is the only option that really needs to be set when calling `.load()`. When editing a google spreadsheet, it's the part between `/spreadsheets/` and `/edit` in the url. Please make sure to also publish the spreadsheet before copying it (File > Publish to the Web > Publish):

```js
require('drive-db')('1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k');
```

**options**: a simple object containing some options. Example with all the defaults:

```js
const drive = require('drive-db')({
  sheet: '',
  local: 'db.json',
  cache: 3600,
  onload: data => data
});
```

- `sheet`: set the spreadsheet id. Read the previous point
- `local`: set the local db name relative to the root
- `cache`: set the maximum time (in **seconds**) that the current cache is valid. After this, the data will be loaded again when the function is called. This is really useful when combined with development env constant. Set to 0 to refresh in each request.
- `onload`: a function that sets a transformation between the data of the spreadsheet and the local db. It accepts the whole array and must return the whole modified array and it's useful to avoid doing the operations on each request

These options can also be loaded at any point after loading the module. Here with the defaults again:

```js
const drive = require('drive-db')();
drive.sheet = '';
drive.db = 'db.json';
drive.cache = 3600;
drive.onload = data => data;
```


## .load()

```js
// With promises:
drive.load().then(success).catch(error);

// With await (must be inside an "async" function):
const db = await drive.load();
```

Loads the data prepared to use it in an async way. The database instance is the same object as drive, we only change its name to note that the data is already loaded.

You can only call it if you have previously included `sheet` variable in some way:

```js
const drive = require('drive-db')('1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k');
drive.load().then(db => {
  console.log('Database loaded correctly');
}).catch(err => console.log);
```

If you are using [server for Node.js](https://serverjs.io/) with ES6+:

```js
const drive = require('drive-db')('1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k');
const server = require('server');
const { get } = server.router;

const home = get('/', async ctx => {
  const db = await drive.load();
  const records = db.find();
  ctx.res.render('index', { records });
});

server(home);
```



## .find([filter])

Retrieve data from the database. If there's no filter, the whole spreadsheet will be retrieved. It behaves in the same way as mongoDB's [comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/), so you can read the documentation there. Returns a javascript Array with the extra methods `.order()` and `.limit(begin, end)`. So, the documentation is here:

> **[mongoDB comparison query operators](http://docs.mongodb.org/manual/reference/operator/query-comparison/)**


## .order(field[, desc])

> This has been called `order()` instead of `sort()` as a javascript Array already has a native method called `sort()` which works quite diferent.

Sort the data by the given field. It sorts it in an ascendant order. Pass a second parameter as true and it will sort it in a descendant order. It should be called **after** `.find()`. Examples:

```js
// Ascendant order
const people = db.find().order('firstname');

// Descedant order
const inversepeople = db.find().order('firstname', true);

const smiths = db.find({ lastname: 'Smith' }).order('firstname');
```


## .limit(begin, end)

> An alternative name to the native `.slice()`. The [Mozilla documentation](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) is pretty neat. I created this to make it consistent to database manipulation names.

Limit the data that can be retrieved. It should be applied to the returning array from `.find()`, and not before:

```js
// Limit the set to the first 10 elements
db.find().limit(0, 10);

// Retrieve the next 10 elements (pagination, infinite scroll, etc)
db.find().limit(10, 20);

// Retrieves the last 2 elements
db.find().limit(-2);

// Order the query and limit it
db.find().sort('firstname').limit(0, 10);
```


## Advanced

There are some more advanced things that you might consider. While I recommend you to read the code for this, here are a couple of examples.

### Refresh the cache

While the default method `.load()` only retrieves the remote data if the cache has expired, you can force a data refresh with the `.update()` command. It accepts two:

```js
const prom = drive.update(SHEET_ID, LOCAL_DB_NAME);

// Example
drive.update('1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k', 'db.json').then(db => {
  console.log('Local copy updated and data loaded in db');
}).catch(err => {
  console.log('Error updating the local copy');
});
```

All of the arguments of this function are optional, but if you want to avoid some you should pass a `false` value:

```js
const drive = require('drive-db')('1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k');
drive.update(false, 'data.json');
```

### Load locally

If you just want to load a local json with search capabilities, you might also do so with `readDB()`. It accepts a the local file as an argument and will return a promise that resolves with the data:

```js
drive.readDB('db.json').then(db => {
  console.log('Local file loaded properly');
}).catch(err => {
  console.log('Error reading local json:', err);
});
```
