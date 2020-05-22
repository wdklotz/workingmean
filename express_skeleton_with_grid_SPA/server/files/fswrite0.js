const fs = require("fs");

fs.writeFile("test0.js", "console.log('Hello World');", error =>{
    if(error) console.log(error);
    else console.log("file created");
    })