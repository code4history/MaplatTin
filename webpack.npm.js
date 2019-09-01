module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: ['@babel/polyfill', './web-bridge.js'],
    output: {
        path: `${__dirname}/www`,
        filename: 'maplat_tin.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
