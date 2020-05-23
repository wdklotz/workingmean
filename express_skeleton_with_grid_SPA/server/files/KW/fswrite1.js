const fs = require("fs");

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, error => {
            if (error) reject(error);
            resolve("file created successfully with handcrafted Promise!");
        });
    });
};

writeFilePromise(
        "test1.js",
        "console.log('Hello world with handcrafted promise!');"
    )
    .then(result => console.log(result))

    .catch(error => console.log(error));