function lwDataBase (name) {
  this.name = name;
}

lwDataBase.prototype = {
  constructor: lwDataBase
};


module.exports = {

  /****************************************************************************
  * Meta Data
  ****************************************************************************/
  dbs: [],



  /****************************************************************************
  *
  ****************************************************************************/
  startup: function (path) {
    var db = new lwDataBase(path);
    this.dbs.push(db);
    return db;
  }
}
