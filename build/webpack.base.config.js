const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    //entry为入口，webpack从这里开始编译
    entry: [
        'babel-polyfill',
        path.resolve(__dirname,'../src/main.js')
    ], 
    //output为输出 path代表路径 filename代表文件名称
    output: {
        path: path.resolve(__dirname, './dist'),
        filename:'js/bundle.[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    // watch: true,
    // watchOptions: {
    //     ignored: /node_modules/, //忽略不用监听变更的目录
    //     aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
    //     poll:1000 //每秒询问的文件变更的次数
    // },
    resolve: {
        extensions: ['.js', '.vue', '.json' ,'.less'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    plugins: [
        new ExtractTextPlugin({filename: 'css/[name].[hash:8].css',allChunks: true}),
        new VueLoaderPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
          })
        // lessExtract
        // new ModuleConcatenationPlugin(),
        // new BundleAnalyzerPlugin()
        // new UglifyJsPlugin()
    ],
    module:{
        rules: [
            {
                test: /\.vue$/, 
                loader: 'vue-loader'
            },
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                  formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader:'css-loader',
                        options:{
                            minimize: true //css压缩
                        }
                    }] // 不再需要style-loader放到html文件内
                }),
                exclude:  path.resolve(__dirname, "src"),
            },
            {
                test:/\.less$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'less-loader']
                }),
                include: path.resolve(__dirname, "../src")
            },
            {
                test: /\.js/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ["env", "stage-0"]
                    }
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192, //8k一下的转义为base64
                        outputPath: 'images/'
                    }
                }]
            },
            { 
                test: /.(eot|woff|ttf)$/, 
                loader: 'url-loader' 
            }
        ]
    }
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             //提取公共代码
    //             commons: {
    //                 chunks: "initial",
    //                 minChunks: 2,
    //                 maxInitialRequests: 5,
    //                 minSize: 0
    //             },
    //             vendor: {
    //                 test: /node_modules/,
    //                 chunks: "initial",
    //                 name: "vendor",
    //                 priority: 10,
    //                 enforce: true
    //             }
    //         }
    //     }
    // }
}