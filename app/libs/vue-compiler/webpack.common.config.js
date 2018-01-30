const webpack = require("webpack");
const path = require('path');
const utils = require('./utils')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '../../..', dir)
}

exports.config = function (customConfig) {
    return {
        entry: customConfig.entry,
        output: {
            path: resolve(customConfig.comDistPath),
            filename: '[name].[hash:7].js',
        },
        devtool: false,
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        },
        externals: {
            vue: 'vue'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        esModule: !!customConfig.esModule, // vue-loader v13 更新 默认值为 true v12及之前版本为 false, 此项配置影响 vue 自身异步组件写法以及 webpack 打包结果
                        loaders: utils.cssLoaders({
                            sourceMap: false,
                            extract: false,          // css 不做提取
                            processCssUrls: false,
                            scss: customConfig.scss
                        }),
                        transformToRequire: {
                            video: 'src',
                            source: 'src',
                            img: 'src',
                            image: 'xlink:href'
                        }
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [resolve('src'), resolve('test')]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: utils.assetsPath(customConfig.comDistPath, 'img/[name].[hash:7].[ext]')
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: utils.assetsPath(customConfig.comDistPath, 'media/[name].[hash:7].[ext]')
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: utils.assetsPath(customConfig.comDistPath, 'fonts/[name].[hash:7].[ext]')
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
            new webpack.optimize.UglifyJsPlugin({
                warnings: false,
                sourceMap: false,
                compress: {
                    // important set expression: true
                    expression: true,
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句
                    // 还可以兼容ie浏览器
                    drop_console: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                },
                extractComments: false,
                exclude: [/\.min\.js$/gi] // skip pre-minified libs
            }),
            // Compress extracted CSS. We are using this plugin so that possible
            // duplicated CSS from different components can be deduped.
            new OptimizeCSSPlugin({
                cssProcessorOptions: {
                    safe: true,
                    canPrint: false,
                    discardComments: { removeAll: true }
                }
            })
        ]
    }
}