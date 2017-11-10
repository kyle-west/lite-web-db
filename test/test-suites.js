const lwdb = require('../lite-web-db.js');
lwdb.STORAGE_PATH = "./test";
console.log(`
LOADED DATABASE SYSTEM
---------------------------------------------
${JSON.stringify(lwdb,null,2)}
---------------------------------------------
`);


/****************************************************************************
* Test the startup feature
****************************************************************************/
const db1n = 'test';
const db1  = lwdb.startup(db1n);
console.log(`
TESTING LOADING AN EXISITING DATABASE "${db1n}"
---------------------------------------------
${JSON.stringify(db1,null,2)}
---------------------------------------------
`);


const db2n = 'main';
const db2  = lwdb.startup(db2n);
console.log(`
TESTING CREATING A NEW DATABASE "${db2n}"
---------------------------------------------
${JSON.stringify(db2,null,2)}
---------------------------------------------
`);


/****************************************************************************
* Test the data retieval
****************************************************************************/
const search0a = null;
const search0b = {};
const search1a = { key: "index", is: 1 };
const search1b = { key: "index", is: 1, not: true };
const search2a = { key: "index", includes: [1,4] };
const search2b = { key: "index", includes: [1,4], not: true };
const search3a = { key: "index", predicate: function (val) {
  return (val % 2 == 0);
}};
const search3b = { key: "index", predicate: function (val) {
  return (val % 2 == 0);
}, not: true};
const search4 = [
  { key: "spiritAnimal", is: "bear" },
  { key: "password",     is: "bearsR0ck", not: true }
];
console.log(`
TESTING SEARCH DATABASE
---------------------------------------------
(NULL TEST)
${JSON.stringify(db1.getTableData("test1",search0a))}

(EMPTY TEST)
${JSON.stringify(db1.getTableData("test1",search0b))}

WHERE index = 1
${JSON.stringify(db1.getTableData("test1",search1a))}

WHERE NOT index = 1
${JSON.stringify(db1.getTableData("test1",search1b))}

WHERE index IN (1,4)
${JSON.stringify(db1.getTableData("test1",search2a))}

WHERE NOT index IN (1,4)
${JSON.stringify(db1.getTableData("test1",search2b))}

WHERE isEven(index) <== {predicate function}
${JSON.stringify(db1.getTableData("test1",search3a))}

WHERE NOT isEven(index) <== {predicate function}
${JSON.stringify(db1.getTableData("test1",search3b))}

WHERE spiritAnimal = "bear" AND NOT password = "bearsR0ck"
${JSON.stringify(db1.getTableData("test1",search4))}
---------------------------------------------
`);
