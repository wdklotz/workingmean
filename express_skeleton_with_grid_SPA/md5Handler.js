'use strict';

const fs        = require("fs");
const crypto    = require('crypto')
const db        = require('./server/dbConnection/connector');
const locations = require('./locations');
const path      = require('path');

const loc = locations.upload;

function _md5(fname) {
    return new Promise((resolve, reject) => {
        const output = crypto.createHash('md5');
        const input  = fs.createReadStream(path.join(loc,fname));

        input.on('error', (err) => {
            reject(err)
            })
        output.once('readable', () => {
            let hex_obj = {
                hexkey: output.read().toString('hex'),
                upload: loc,
                fname : fname };
            resolve(hex_obj)
            })
        input.pipe(output)
        });
}
function fileToHex(file) {
    const fname = file.originalname;
    _md5(fname).then((hex,err) => {
        if (err) console.log(err);
        else {
//             console.log(hex);
            _hashQuery(hex);
            }
    });
}
function _hashQuery(hex_obj) {
    let hexkey = hex_obj.hexkey;
    let path    = hex_obj.upload;
    let fname   = hex_obj.fname;
    const sql  = `SELECT d.* FROM doc As d WHERE d.Hex = "${hexkey}"`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        } else {
            if (rows.length === 0) _not_in_store(hex_obj);
            else                   _in_store(hex_obj);
        }
    });
}
function _in_store(hex_obj) {
    console.log("====> SAME as ",hex_obj);
    }
function _not_in_store(hex_obj) {
    console.log("====> NOTHING like ",hex_obj);
//     storeDisk();
//     insertDb(hex_obj.file,hex_obj.hexkey);
    }

module.exports.fileToHex = fileToHex;
