const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');

module.exports = merge(common,
    {
        mode: "development",
        devtool: 'source-map',
        devServer: {
            historyApiFallback: true,
            disableHostCheck: true
        },
        output: {
            path: path.resolve( __dirname, 'dist' ),
            filename: 'main.js',
            publicPath: '/',
        },
        plugins: [
            new Dotenv({
                path: `./config/development/.env`,
            }),
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                filename: 'index.html',
                // favicon: "./src/spark.ico",
                inject: false,
            }),
        ],
    }
)