app_log = function() {
    if(false) {
        for(let i=0; i<arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
};

i_was_here = function(name) {
    if(false) console.log("============================< "+name+" >");
};

module.exports = {app_log, i_was_here};