app_log = function() {
    if(true) {
        for(let i=0; i<arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
};

i_was_here = function(name) {
    if(true) console.log("============================< "+name+" >");
};

module.exports = {app_log, i_was_here};