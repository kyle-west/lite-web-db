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
* Test the data insertion
****************************************************************************/
const table2 = db2.getTable('test1');
const insert1 = { col1: "one",   col2: "123", col3: "blue",   col4:"MON" };
const insert2 = { col1: "two",   col2: "456", col3: "red",    col4:"TUE" };
const insert3 = { col1: "three", col2: "789", col3: "green",  col4:"WED" };
const insert4 = { col1: "four",  col2: "012", col3: "black",  col4:"THU" };
const insert5 = { col1: "five",  col2: "983", col3: "orange", col4:"FRI" };
console.log(`
TESTING INSERTING INTO A EMPTY DATABASE "${db2.name}"
---------------------------------------------

INSERT INTO "test1" VALUES (
  ${JSON.stringify(table2.insert(insert1))},
  ${JSON.stringify(table2.insert(insert2))},
  ${JSON.stringify(table2.insert([insert3,insert4,insert5]))}
);

SHOW "test1"
${JSON.stringify(table2,null,2)}
---------------------------------------------
`);


/****************************************************************************
* Test the data update
****************************************************************************/
const updateTestA = {key: "index", is: 2};
const updateSetA  = {col2: "INDEX IS 2"};
const updateTestB = {key: "index", includes: [1,3]};
const updateSetB  = {col2: "ODD INDEX"};
const updateTestC = [
  {key: "index", includes: [1,2,3], not: true},
  {key: "col4",  includes: ["THU","FRI"]}
];
const updateSetC  = {col2: "LAST"};

console.log(`
TESTING UPDATING DATA IN "${db2.name}"
---------------------------------------------

UPDATE "test1" SET col2 = "INDEX IS 2" WHERE index = 2;
${JSON.stringify(table2.update(updateTestA, updateSetA))}

UPDATE "test1" SET col2 = "ODD INDEX" WHERE index IN (1,3);
${JSON.stringify(table2.update(updateTestB, updateSetB))}

UPDATE "test1" SET col2 = "LAST" WHERE NOT index IN (1,2,3) AND col4 IN ('THU','FRI');
${JSON.stringify(table2.update(updateTestC, updateSetC))}

SHOW "test1"
${JSON.stringify(table2,null,2)}
`);

table2.update({}, {col3:"THIRD COLUMN"});
console.log(`
UPDATE "test1" SET col3 = "THIRD COLUMN"; SHOW "test1"
${JSON.stringify(table2,null,2)}
`);

table2.update(null, {index:2});
console.log(`
UPDATE "test1" SET index = 2; SHOW "test1"
${JSON.stringify(table2,null,2)}

---------------------------------------------
`);


/****************************************************************************
* Test the delete feature
****************************************************************************/
console.log(`
TESTING DELETING DATA IN "${db2.name}"
---------------------------------------------

DELETE "test1" WHERE index IN (1,3);
${JSON.stringify(table2.delete(updateTestB))}

DELETE "test1" WHERE NOT index IN (1,2,3) AND col4 IN ('THU','FRI');
${JSON.stringify(table2.delete(updateTestC))}

SHOW "test1"
${JSON.stringify(table2,null,2)}
`);

table2.delete();
console.log(`
DELETE "test1"
${JSON.stringify(table2,null,2)}
`);

table2.restoreLastDeletion();
console.log(`
ROLLBACK "test1"
${JSON.stringify(table2,null,2)}

---------------------------------------------
`);





/****************************************************************************
* Test the data retieval
****************************************************************************/
const table1 = db1.getTable("test1");
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
${JSON.stringify(table1.query(search0a))}

(EMPTY TEST)
${JSON.stringify(table1.query(search0b))}

WHERE index = 1
${JSON.stringify(table1.query(search1a))}

WHERE NOT index = 1
${JSON.stringify(table1.query(search1b))}

WHERE index IN (1,4)
${JSON.stringify(table1.query(search2a))}

WHERE NOT index IN (1,4)
${JSON.stringify(table1.query(search2b))}

WHERE isEven(index) <== {predicate function}
${JSON.stringify(table1.query(search3a))}

WHERE NOT isEven(index) <== {predicate function}
${JSON.stringify(table1.query(search3b))}

WHERE spiritAnimal = "bear" AND NOT password = "bearsR0ck"
${JSON.stringify(table1.query(search4))}
---------------------------------------------
`);


/****************************************************************************
* Test the save to disk feature
****************************************************************************/
console.log(`
TESTING SAVING DATABASE TO DISK "${db2.name}"
---------------------------------------------

---------------------------------------------
`);
