const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
    mode: 'development',
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "assets/images/[name].[contenthash:8].js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', {
                        loader: 'css-loader'
                    }

                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            name: "static/media/[name].[hash:8].[ext]"
                        }
                    },
                    {
                        loader: 'file-loader'
                    },
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "static/media/[name].[hash:8].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|svg|gif)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        name: "static/media/[name].[hash:8].[ext]",
                        limit: 1024000
                    }
                }
            },
            {
                test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
                loader: require.resolve("file-loader"),
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                use: ['file-loader?name=/src/assets/images/[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                use: ['file-loader?name=/public/[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.json']
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            favicon: './public/favicon.ico'
        })
    ],
    devtool: 'eval-source-map',
    devServer: {
        historyApiFallback: true
    }
}