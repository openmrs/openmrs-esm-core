const { readFileSync } = require("fs");

module.exports = JSON.parse(readFileSync("./.babelrc", "utf8"));
