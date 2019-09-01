module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: ['./tmpl/web-bridge.js'],
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
                    loader: 'babel-loader',
                    query: {
                        "presets": [
                            [
                                "@babel/preset-env",
                                {
                                    "useBuiltIns": "usage",
                                    "corejs": 3
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    }
};
