/******************************************************************************
* helper functions not exported, but used by the application
******************************************************************************/
function typeOf (obj) {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1];
}

const fs = require('file-system');
// fs.writeFile() // ==> function (filename, data, options, callback)


/******************************************************************************
*
******************************************************************************/
function lwDataBase (path, name, isNew) {
  this.name = name;
  this.path = `${path}/${name}.json`;
  if (isNew) {
    this.data = {
      tables: {
      }
    };
  } else {
    this.data = require(this.path);
  }

  // assign table properties
  var self = this;
  Object.keys(this.data.tables).forEach((table) => {
    self.data.tables[table].insert = self.insert;
    self.data.tables[table].query  = self.query;
    self.data.tables[table]._testRow  = self._testRow;
    self.data.tables[table].update  = self.update;
    self.data.tables[table].delete  = self.delete;
  });
}

/******************************************************************************
*
******************************************************************************/
lwDataBase.prototype = {
  constructor: lwDataBase,

  /****************************************************************************
  * DB SCOPE
  ****************************************************************************/
  getTable: function (table) {
    var tableObj = this.data.tables[table];
    if (!tableObj) {
      tableObj = {
        rows: [],
        details: {
          nextIndex: 1
        }
      }
      tableObj.insert = this.insert;
      tableObj.query  = this.query;
      tableObj._testRow  = this._testRow;
      tableObj.update  = this.update;
      tableObj.delete  = this.delete;
      this.data.tables[table] = tableObj;
    }

    return this.data.tables[table];
  },

  createTable: this.getTable,


  /****************************************************************************
  * TABLE SCOPE
  ****************************************************************************/
  insert: function (row) {
    row.index = this.details.nextIndex++;
    this.rows.push(row);
    return row;
  },


  /****************************************************************************
  * TABLE SCOPE
  ****************************************************************************/
  delete: function (testSet) {
    var deletions = [];
    var self = this;

    switch (typeOf(testSet)) {
      case "Object":
        for (var i = 0; i < this.rows.length; i++) {
          if (self._testRow(this.rows[i], testSet)) {
            deletions.push(this.rows[i]);
            this.rows.splice(i, 1);
          }
        }
        break;

      case "Array":
        for (var i = 0; i < this.rows.length; i++) {
          var match = true;

          testSet.forEach((test) => {
            match = match && self._testRow(self.rows[i], test);
          });

          if (match) {
            deletions.push(this.rows[i]);
            this.rows.splice(i, 1);
          }
        }
        break;

      default:
        deletions = this.rows;
        this.rows = [];
    }
    this.lastDeletion = deletions;
    return deletions;
  },



  /****************************************************************************
  * TABLE SCOPE
  ****************************************************************************/
  update: function (testSet, set) {
    var updates = [];
    var self = this;

    switch (typeOf(testSet)) {
      case "Object":
        this.rows.forEach((row) => {
          if (self._testRow(row, testSet)) {
            Object.keys(set).forEach((col) => {
              if (col !== "index") {
                row[col] = set[col];
              }
            });
            updates.push(row);
          }
        });
        break;

      case "Array":
        this.rows.forEach((row) => {
          var match = true;

          testSet.forEach((test) => {
            match = match && self._testRow(row, test);
          });

          if (match) {
            Object.keys(set).forEach((col) => {
              if (col !== "index") {
                row[col] = set[col];
              }
            });
            updates.push(row);
          }
        });
        break;

      default:
        this.rows.forEach((row) => {
          Object.keys(set).forEach((col) => {
            if (col !== "index") {
              row[col] = set[col];
            }
          });
          updates.push(row);
        });
    }
    return updates;
  },



  /****************************************************************************
  * TABLE SCOPE
  ****************************************************************************/
  query: function (testSet) {
    var matches = [];
    var tableData = this;

    var self = this;
    switch (typeOf(testSet)) {
      case "Object":
        tableData.rows.forEach((row) => {
          if (self._testRow(row, testSet)) matches.push(row);
        });
        return matches;
        break;

      case "Array":
        tableData.rows.forEach((row) => {
          var match = true;

          testSet.forEach((test) => {
            match = match && self._testRow(row, test);
          });

          if (match) matches.push(row);
        });
        return matches;
        break;

      default:
        if (tableData) {
          return tableData.rows;
        }
    }
  },

  /****************************************************************************
  * TABLE SCOPE
  ****************************************************************************/
  _testRow: function (row, test) {
    if (!test || !row) {
      return false;
    }

    if (test.is) {
      if (!test.key) {
        throw "IS Tests are required to have a key to compare";
      } else {
        if (test.not) {
          return row[test.key] !== test.is;
        } else {
          return row[test.key] === test.is;
        }
      }
    } else if (test.includes && typeOf(test.includes) === "Array") {
      if (!test.key) {
        throw "INCLUDES Tests are required to have a key to compare";
      } else {
        if (test.not) {
          return !test.includes.includes(row[test.key]);
        } else {
          return test.includes.includes(row[test.key]);
        }
      }
    } else if (test.predicate && typeOf(test.predicate) === "Function") {
      if (!test.key) {
        throw "PREDICATE Tests are required to have a key to compare";
      } else {
        if (test.not) {
          return !test.predicate(row[test.key]);
        } else {
          return test.predicate(row[test.key]);
        }
      }
    } else {
      return true;
    }
  }
};


module.exports = {

  /****************************************************************************
  * Meta Data
  ****************************************************************************/
  dbs: [],
  STORAGE_PATH: "./DB_DATA",


  /****************************************************************************
  *
  ****************************************************************************/
  startup: function (name) {
    var db = new lwDataBase(this.STORAGE_PATH, name, !fs.fs.existsSync(name));
    this.dbs.push(db);
    return db;
  }
}
