# `lite-web-db`

This is a lite weight JSON Data Base System for storing simple data.

Underneath it manages a series of JSON files that store information for your application. **In order to provide a lite weight system, we removed many common security features found in other Data Base Systems.** What it lacks in native security, however, `lite-web-db` makes up for in simplicity and efficiency.


# Setup

```js
const manager = require('lite-web-db');
manager.STORAGE_PATH = "/path/to/files";
```

```js
const db = manager.startup('database-name');
```
### Saving data
```js
manager.saveToDisk(db);
```

```js
manager.shutdown(db);        // shutdown with AutoSave
manager.shutdown(db, false); // shutdown and do not save
```


# Usage

```js
const table = db.getTable('table-name');
```

### Querying

##### Test against a value
```js
const search = { key: "index", is: 1 };
var matchingRows = table.query(search);
```


##### Test against a set of values
```js
const search = { key: "index", includes: [1,4] };
var matchingRows = table.query(search);
```

##### Test against a predicate function
```js
const search = { key: "index", predicate: function (value) {
  return (val % 2 == 0); // Returns true if value is odd
}};
var matchingRows = table.query(search);
```

##### Negating a test
```js
const search = { key: "index", is: 1, not: true };
var matchingRows = table.query(search);
```
```js
var allRows = table.query();
```


### Inserting
```js
// insert one row
const newRow = { number: 1, english: "one", spanish: "uno" };
table.insert(newRow);

// insert multiple rows
const moreRows = [
  { number: 2, english: "two",   spanish: "dos"    },
  { number: 3, english: "three", spanish: "tres"   },
  { number: 4, english: "four",  spanish: "quatro" }
];
table.insert(moreRows);
```

```js
table.query(); /* RETURNS ===> [
  { index: 1, number: 1, english: "one",   spanish: "uno"    },
  { index: 2, number: 2, english: "two",   spanish: "dos"    },
  { index: 3, number: 3, english: "three", spanish: "tres"   },
  { index: 4, number: 4, english: "four",  spanish: "quatro" }
] */
```

### Updating
```js
const test = { key: "index", is: 4 };
const newData = { english: "FOUR" };
table.update(newData, test);
```

```js
var toUpper = function (value) {
  return value.toUpperCase();
};
table.update({ english: toUpper, french: toUpper });
```

### Deleting
```js
// delete matching rows
const removeSearch = { key: "index", is: 4 };
table.delete(removeSearch);

// delete all the data in the table
table.delete();  
```

```js
table.restoreLastDeletion();
```
