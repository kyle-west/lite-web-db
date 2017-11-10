const lwdb = require('../lite-web-db.js');
const db1  = 'main';
const db   = lwdb.startup(db1);

console.log(`
LOADED DB from ${db1}
---------------------------------------------
${JSON.stringify(db,null,2)}
---------------------------------------------
`);
