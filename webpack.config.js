const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require('path');

module.exports = {
    entry: {
        app:'./src/App.js'
    },
    devServer: {
        clientLogLevel: 'none',
        headers: { "Access-Control-Allow-Origin": "*" }
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'app.bundle.js'
    },
    plugins: [
        // new MinifyPlugin()
    ],
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ["@babel/preset-env"]
            }
        }]
    },

};
