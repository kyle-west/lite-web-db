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
const search0 = {};
const search1 = { key: "index", is: 1 };
const search2 = { key: "index", includes: [1,4] };
const search3 = { key: "index", predicate: function (val) {
  return (val % 2 == 0);
}};
const search4 = [
  { key: "spiritAnimal", is: "bear" },
  { key: "password",     is: "bearsR0ck" }
];
console.log(`
TESTING SEARCH DATABASE for "${JSON.stringify(search1)}"
---------------------------------------------
WHERE index = 1
${JSON.stringify(db1.getData(search0))}

WHERE index IN (1,4)
${JSON.stringify(db1.getData(search1))}

WHERE isEven(index)
${JSON.stringify(db1.getData(search2))}

WHERE spiritAnimal = "bear" AND password = "bearsR0ck"
${JSON.stringify(db2.getData(search3))}
---------------------------------------------
`);
