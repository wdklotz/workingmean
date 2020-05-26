
const greet = function(name) {
    console.log(`Hi ${name}!`);
}
/* so ...*/
// exports.alias = greet;
// exports.a = 'A';
// exports.b = 99;
// exports.c = {key:'value'};

/* oder so.... */
// module.exports = {alias:greet,a:'A',b:99,c:{key:'value'}};

// am besten so...
module.exports.alias = greet;
module.exports.greet = greet;
module.exports.a = 'A';
module.exports.b = 99;
module.exports.c = {key:'value'};

// aber nicht so....
// exports = {alias:greet,a:'A',b:99,c:{key:'value'}};

console.log(module);
