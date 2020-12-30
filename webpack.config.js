/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const pjson = require('./package.json');

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  entry: {
    "maplat_tin": "./src/index.ts"
  },

  output: {
    path: `${__dirname}/www`,
    filename: '[name].js',
    library: 'Tin',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
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
    new webpack.BannerPlugin({
      banner: `${pjson.name} v${pjson.version} | ${pjson.author} | license: ${pjson.license}`
    })
  ]
};
