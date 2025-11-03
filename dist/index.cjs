"use strict";
const pkg = require("./maplat_tin.cjs");
const Tin = pkg && pkg.default ? pkg.default : pkg;
module.exports = Tin;
Object.assign(module.exports, pkg);
module.exports.default = Tin;