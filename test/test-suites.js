const lwdb = require('../lite-web-db.js');
console.log(`
LOADED DATABASE SYSTEM
---------------------------------------------
${JSON.stringify(lwdb,null,2)}
---------------------------------------------
`);


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
