"use strict";

let config = require("./webpack.config.js");
config.entry.app = "./standalone/bootstrap.js";
module.exports = config;
