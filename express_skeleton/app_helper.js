function n_log(name,content) {
    console.log("=======< "+name+" >=======");
    console.log(content);
    console.log("=======< "+name+" >=======");
}

function i_was_here(name) {
    n_log(name,"I was here");
}

module.exports = {n_log, i_was_here};