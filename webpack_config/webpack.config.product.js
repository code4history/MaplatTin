/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");

module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, "../es5"),
    filename: '[name].js',
    library: 'Tin',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
  },
});