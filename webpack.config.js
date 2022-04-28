// Library
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Extention list
const scriptExtensions = /\.(js|jsx)$/;
const styleExtensions = /\.css$/i;
const imageExtensions = /\.(bmp|gif|jpg|jpeg|png)$/i;

module.exports = {
    entry: {
        index: "./src/index.js",
        helper: "./src/helpers/index.js",
        component: "./src/components/index.js"
    },
    output: {
        publicPath: '/',
        filename: '[name].[chunkhash].chunk.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: scriptExtensions,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: styleExtensions,
                use: ["css-loader"],
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: imageExtensions,
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name: 'assets/[name].[ext]'
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin()
    ],
    optimization: {
        minimize: true,
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            new CssMinimizerPlugin(), // minify css
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false, // It will drop all the console.log statements from the final production build
                    },
                }
            })
        ],
    },
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devServer: {
        historyApiFallback: true,
    }
};