const fsp = require("fs/promises");

async function main() {
try {
    await fsp.writeFile("/tmp/test4.js", "console.log('Hello world with Node.js v10 fs/promises!'");
    console.info("File created successfully with Node.js v10 fs/promises!");
} catch (error){
    console.error(error);
}
}

main();