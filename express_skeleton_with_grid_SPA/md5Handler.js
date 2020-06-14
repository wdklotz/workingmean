'use strict';
const fs        = require("fs");
const crypto    = require('crypto')
const db        = require('./server/dbConnection/connector');
const locations = require('./locations');
const path      = require('path');

const loc   = locations.upload;
const store = locations.store;

function _md5(fname) {
    return new Promise((resolve, reject) => {
        const output = crypto.createHash('md5');
        const input  = fs.createReadStream(path.join(loc,fname));
        input.on('error', (err) => {
            reject(err)
            })
        input.pipe(output)
        output.once('readable', () => {
            let hex_obj = {
                hexkey: output.read().toString('hex'),
                path  : loc,
                fname : fname };
            resolve(hex_obj)
            })
        });
}
function _hashQuery(hex_obj) {
    return new Promise((resolve, reject) => {
        let hexkey  = hex_obj.hexkey;
//         let path    = hex_obj.path;
//         let fname   = hex_obj.fname;
        const sql   = `SELECT d.* FROM doc As d WHERE d.Hex = "${hexkey}"`;
//         console.log(sql);
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length === 0) resolve(hex_obj); else reject(hex_obj);
                }
            });
        });
}
function _in_store(hex_obj) {
//     console.log(`====> REPLACE ${hex_obj.hexkey} in store?`);
    _deleteFromUploads(hex_obj);
    }
function _not_in_store(hex_obj) {
//     console.log(`====> NOTHIƒNG like ${hex_obj.hexkey} in store`);
    _copyToStore(hex_obj);
    _dbInsert(hex_obj);
    }
function _copyToStore(hex_obj) {
    const fname = hex_obj.fname;
    const spath = hex_obj.path;
    const src   = path.join(spath,fname);
    const dest  = path.join(store,fname);
    fs.copyFile(src, dest, (err) => {
        if (err) throw err;
        else {
//             console.log(`success copy ${src} ==> ${dest}`);
            _deleteFromUploads(hex_obj);
             }
        })
    }
function _deleteFromUploads(hex_obj) {
    const fname = hex_obj.fname;
    const spath = hex_obj.path;
    const src   = path.join(spath,fname);
    fs.unlink(src, (err) => {
        if (err) throw err;
        else {
//             console.log(`success delete ${src}`);
             };
    })
}
function _dbInsert(hex_obj) {
    const fname  = hex_obj.fname;
    const hexkey = hex_obj.hexkey;
    const sql = `INSERT INTO doc (Favorite, author, type , shelf, Keywords, Trash, Hex, Document) VALUES("F","1","1","1","?","F","${hexkey}","${fname}")`;
//     console.log(sql);
    db.run(sql, [], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}
function docToStore(file) {
    const fname = file.originalname;
    _md5(fname).then(_hashQuery).then(_not_in_store,_in_store).catch((err)=>console.log(err));
}

module.exports.docToStore = docToStore;
