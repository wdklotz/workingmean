'use strict';

const fs            = require("fs");
const db            = require('./server/dbConnection/connector');
// const {promisify}   = require("util");
// const writeFile     = promisify(fs.writeFile);

// async function fileToDiskAsy(name,data) {
//     await writeFile("test3.js",
//         "console.log('Hello world with promisify and async/await!');");
//     console.info("file created successfully with promisify and async/await!");
// }

function _fileToDisk(file,data) {
    fs.writeFile(file,data,function(err) {
        if(err) return console.log(err);
        console.log('data > '+`${file}`);
    });
}
function libInsert(file,hexkey) {
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

module.exports.libInsert = libInsert;
