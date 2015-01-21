var fs = require("fs");
var counter = require("./counter")

var code = fs.readFileSync("./code.js", {encoding: "UTF8"});

console.log("Code:\n");
console.log(code);
console.log("Lines count: " + counter(code));
