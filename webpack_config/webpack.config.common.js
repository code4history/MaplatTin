/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";

const path = require("path");
const { BannerPlugin } = require("webpack");
const pjson = require('../package.json');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const port = process.env.PORT || 8888;

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  entry: {
    "index": path.resolve(__dirname, "../src/index.ts")
  },

  resolve: {
    extensions: [".js", ".ts"],
  },

  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ]
  },

  plugins: [
    new BannerPlugin({
      banner: `${pjson.name} v${pjson.version} | ${pjson.author} | license: ${pjson.license}`
    }),
    new CleanWebpackPlugin(),
  ],

  devServer: {
    host: "localhost",
    port,
    allowedHosts: "all",
    static: {
      directory: path.resolve(__dirname, '../'),
      watch: true
    },
    hot: true,
    open: {
      target: ["index.html"]
    },
    historyApiFallback: true,
    client: {
      overlay: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    },
    onBeforeSetupMiddleware(devServer) {
      console.log(`Server running at http://localhost:${port}`);
    }
  }
};
