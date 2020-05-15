// ES module
export function app_log() {
    if(true) {
        for(let i=0; i<arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
};
export function tbl_log(o){
    if(true) {
        console.table(o);
    }
};
export function i_was_here(name) {
    if(true) console.log("============================< "+name+" >");
};
