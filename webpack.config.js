 const path = require('path');
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

 module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'd3-geogrid.js',
        library: 'd3',      
        libraryTarget: 'umd',      
        publicPath: '/build/',      
        umdNamedDefine: true  
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devtool: 'inline-source-map',
    devServer: {
        inline: true,
        contentBase: './build',
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