module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        main: ['@babel/polyfill', './src/index.js'], // polyfill はIE11などで必要
        worker1: './src/worker1',
        worker2: './src/worker2',
    },
    output: {
        path: `${__dirname}/dist`,
        filename: '[name].js'
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
