 const path = require('path');
 const webpack = require('webpack');
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

 module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 3000
    },
     module: {
         rules: [
             {
                 test: /\.jsx?$/,                 
                 exclude: /(node_modules)/,
                 use: 'babel-loader'
             }
         ]
     },
     plugins: [
            new UglifyJsPlugin()
    ]
 };