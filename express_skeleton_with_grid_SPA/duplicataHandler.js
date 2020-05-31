const fs     = require("fs");
const crypto = require('crypto')
const db     = require('./server/dbConnection/connector');
const xxx    = {insertDb, storeDisk} = require('./docToLibHandler');
console.log(xxx);

const loc = 'C:/Users/wdklotz/workingmean/express_skeleton_with_grid_SPA/public/UIGrid/store/data/';

const checkForDuplicates = function(files) {
    for (let i in files) {
        md5(loc,files[i]).then(hashQuery,(err)=> console.error(err));
    }
};

function hashQuery(hex_obj) {
    let hexkey = hex_obj.hexkey;
    let loc    = hex_obj.loc;
    let file   = hex_obj.file;
    const sql  = `SELECT d.* FROM doc As d WHERE d.Hex = "${hexkey}"`;
    console.log(sql);
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        } else {
            if (rows.length === 0) is_not_in_store(hex_obj);
            else                   is_in_store(hex_obj);
        }
    });  
}

function is_in_store(hex_obj) { console.log(hex_obj); }

function is_not_in_store(hex_obj) { 
    console.log("====> NOTHING like ",hex_obj);
    storeDisk();
    insertDb(hex_obj.file,hex_obj.hexkey);
    }

function md5(loc,file) {
    return new Promise((resolve, reject) => {
        const output = crypto.createHash('md5');
        const input  = fs.createReadStream(loc+file);

        input.on('error', (err) => {
            reject(err)
            })
        output.once('readable', () => {
            let hex_obj = {
                hexkey: output.read().toString('hex'), 
                loc: loc, 
                file: file };
            resolve(hex_obj)
            })
        input.pipe(output)
        });
    }

module.exports = checkForDuplicates;

const mock_file_names = [
    'A.Dragt_Lie_Methods_for_Nonlinerar_Dynamics...pdf',
    'A.J.Dragt-thbji3.pdf',
    'A.Shishlo_2014_07_18_TraceWin_PyORBIT_Benchmark_for_SNS_STS.pdf',
    'A.Shishlo_bartosik20150326sc2015.pdf',
    '0000.pdf', '0001.pdf','0002.pdf'
];
let files = mock_file_names;

// checkForDuplicates(files);