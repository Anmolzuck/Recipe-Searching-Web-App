const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer:{
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({ // data gets stored from source to destination automatically
            filename: 'index.html', // destination in dist
            template: './src/index.html' //source
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, // this regex checks the file is js and then add bable laoder to it
                exclude: /node.modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
    
};