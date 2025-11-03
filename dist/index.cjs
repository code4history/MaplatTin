"use strict";
const pkg = require("./maplat_tin.cjs");
const Tin = pkg && pkg.default ? pkg.default : pkg;
module.exports = Tin;
Object.assign(module.exports, pkg);
Object.defineProperty(module.exports, "__esModule", { value: true });
module.exports.default = Tin;