var app_log = function() {
    if(true) {
        for(let i=0; i<arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
};
var tbl_log = function(o){
    if(true) {
        console.table(o);
    }
};
var i_was_here = function(name) {
    if(true) console.log("============================< "+name+" >");
};

module.exports.app_log    = app_log;
module.exports.tbl_log    = tbl_log;
module.exports.i_was_here = i_was_here;