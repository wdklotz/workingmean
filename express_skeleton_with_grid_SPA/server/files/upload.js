const fs            = require("fs");
const md5           = require('./md5File');
const { promisify } = require("util");
const db            = require('../dbConnection/connector');
const {app_log, tbl_log, i_was_here} = require('../../svr_helper');

const writeFile = promisify(fs.writeFile);

async function main() {
    await writeFile("test3.js",
        "console.log('Hello world with promisify and async/await!');");
    console.info("file created successfully with promisify and async/await!");
}
// main().catch(error => console.error(error));

const path = 'C:/Users/wdklotz/workingmean/express_skeleton_with_grid_SPA/public/UIGrid/store/data/';
const file_names = [
    'A.Dragt_Lie_Methods_for_Nonlinerar_Dynamics...pdf',
    'A.J.Dragt-thbji3.pdf',
    'A.Shishlo_2014_07_18_TraceWin_PyORBIT_Benchmark_for_SNS_STS.pdf',
    'A.Shishlo_bartosik20150326sc2015.pdf', '0000.pdf'
    ];

for (let i in file_names) {
    md5(path,file_names[i]).then(hex_resolved,(err)=> console.error(err));
    }

function hex_resolved(hex_obj) {
    let hex   = hex_obj.hex;
    let path  = hex_obj.path;
    let file  = hex_obj.file;
    const sql =`SELECT d.* FROM doc As d WHERE d.Hex = "${hex}"`;
    console.log(sql);
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        } else {
            if (rows.length === 0) not_in_store(hex_obj);
            else console.log(rows);
        }
        });  
}

const not_in_store = function(hex_obj) {
    console.log("=============================================")
    console.log("====> NOTHING like "+hex_obj.file);
    console.log("=============================================")
}
