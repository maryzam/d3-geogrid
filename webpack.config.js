 const path = require('path');
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

 module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'd3-geogrid.js',          
        publicPath: '/build/', 
        library: "d3g",   
        libraryTarget: 'umd',         
        umdNamedDefine: true  
    },
    externals: {
        "d3": "d3",
        "d3-geo": "d3-geo",
        "topojson": "topojson"
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
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