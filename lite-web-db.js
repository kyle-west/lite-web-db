/******************************************************************************
* helper functions not exported, but used by the application
******************************************************************************/
function typeOf (obj) {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1];
}

const fs = require('file-system');
// fs.writeFile() // ==> function (filename, data, options, callback)


/******************************************************************************
* Meta Data
******************************************************************************/
function lwDataBase (path, name, isNew) {
  this.name = name;
  this.path = `${path}/${name}.json`;
  if (isNew) {
    this.data = {
      tables: {
        test1: {
          rows: []
        }
      }
    };
  } else {
    this.data = require(this.path);
  }
}

/******************************************************************************
* Meta Data
******************************************************************************/
lwDataBase.prototype = {
  constructor: lwDataBase,

  /****************************************************************************
  * Meta Data
  ****************************************************************************/
  getTableData: function (table, testSet) {
    var matches = [];
    var tableData = this.data.tables[table];

    if (!table || !tableData) {
      throw `Table "${table}" is not found in the ${this.name} Database`;
    }

    var self = this;
    switch (typeOf(testSet)) {
      case "Object":
        tableData.rows.forEach((row) => {
          if (self.testRow(row, testSet)) matches.push(row);
        });
        return matches;
        break;

      case "Array":
        tableData.rows.forEach((row) => {
          var match = true;

          testSet.forEach((test) => {
            match = match && self.testRow(row, test);
          });

          if (match) matches.push(row);
        });
        return matches;
        break;

      default:
        if (tableData) {
          return this.data.tables[table].rows;
        }
    }
  },

  testRow: function (row, test) {
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
