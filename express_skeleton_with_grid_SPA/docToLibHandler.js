const fs            = require("fs");
/*
// const {promisify}   = require("util");
// const db = require('./server/dbConnection/connector');
// const writeFile = promisify(fs.writeFile);
// async function fileWrite(name,data) {
    // await writeFile("test3.js",
        // "console.log('Hello world with promisify and async/await!');");
    // console.info("file created successfully with promisify and async/await!");
// }
*/
function writeToStore(file,data) {
    fs.writeFile(file,data,function(err) {
        if(err) return console.log(err);
        console.log('data > '+`${file}`);
    });
}
function dbInsert(file,hexkey) {
    const sql  = `INSERT INTO doc 
(Favorite, author, type , shelf, Keywords, Trash, Hex                               , Document)
VALUES 
(  "F"   ,  "1"  , "1"  ,  "1" ,   "?"   ,  "F" , "${hexkey}", "${file}")`;
    console.log(sql);

    // const params = [];
    // db.run(sql, params, function(err) {
        // if (err) {
            // return console.error(err.message);
        // }
        // console.log(`A row has been inserted with rowid ${this.lastID}`);    
    // });
}

var mock = function() {
    writeToStore('./xxxxx.txt','data,data,data,dadaaaaaaaaaa');
    };

module.exports = {insertDb:dbInsert, storeDisk:mock};
