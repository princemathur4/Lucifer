const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require( 'path' );
const common = require('./webpack.common');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common,
    {
        mode: "production",
        output: {
            path: path.resolve(__dirname, 'dist'), // bundle is compiled into this folder
            filename: 'main.[contentHash].js',
            publicPath: '/',
        },
        optimization: {
            minimizer: [
                new TerserPlugin(),
                new HtmlWebpackPlugin({
                    template: "./public/index.html",
                    favicon: "./public/favicon.ico",
                    filename: 'index.html',
                    inject: true,
                    minify: {
                        removeAttributeQuotes: true,
                        collapseWhitespace: true,
                        removeComments: true
                    }
                })
            ],
        },
        plugins: [
            new Dotenv({
                path: `./config/production/.env`,
            }),
            new MiniCssExtractPlugin({ filename: "[name].[contentHash].css" }),
            new CleanWebpackPlugin(),
            new CompressionPlugin
        ],
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader, //3. Extract css into files
                        "css-loader", //2. Turns css into commonjs
                        "sass-loader" //1. Turns sass into css
                    ]
                },
                {
                    test: /\.css?$/,
                    use: [
                        MiniCssExtractPlugin.loader, //3. Extract css into files
                        "css-loader", //2. Turns css into commonjs
                    ]
                }
            ]
        }
    }
)