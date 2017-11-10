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
    this.data = {};
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
  getData: function () {
    return {};
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
