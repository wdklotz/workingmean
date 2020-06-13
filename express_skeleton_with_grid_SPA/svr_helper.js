'use strict';

function app_log() {
    if(true) {
        for(let i=0; i<arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
};
function tbl_log(o){
    if(true) {
        console.table(o);
    }
};
function i_am_here(name) {
    if(true) console.log("============================================= <I am here: "+name+" >");
};

module.exports.app_log    = app_log;
module.exports.tbl_log    = tbl_log;
module.exports.i_am_here  = i_am_here;
