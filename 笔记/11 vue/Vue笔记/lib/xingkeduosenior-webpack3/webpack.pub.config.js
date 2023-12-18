// 由于 webpack 是基于Node进行构建的，所有，webpack的配置文件中，任何合法的Node代码都是支持的
var path = require("path");
// 如果要配置插件，需要在导出的对象中，挂载一个 plugins 节点
var htmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
// 导入抽取CSS的插件
const ExtractTextPlugin = require("extract-text-webpack-plugin")
// 导入压缩CSS的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 当以命令行形式运行 webpack 或 webpack-dev-server 的时候，工具会发现，我们并没有提供 要打包 的文件的 入口 和 出口文件，此时，他会检查项目根目录中的配置文件，并读取这个文件，就拿到了导出的这个 配置对象，然后根据这个对象，进行打包构建
module.exports = {
  entry: {
    // 入口文件
    app: path.join(__dirname, "./src/main.js"),
    vendors1: ["jquery"],
  },
  output: {
    // 指定输出选项
    path: path.join(__dirname, "./dist"), // 输出路径
    filename: "js/bundle.js", // 指定输出文件的名称
  },
  plugins: [
    // 所有webpack  插件的配置节点
    new htmlWebpackPlugin({
      template: path.join(__dirname, "./src/index.html"), // 指定模板文件路径
      filename: "index.html", // 设置生成的内存页面的名称
       minify: {
        collapseWhitespace: true, // 合并多余的空格
        removeComments: true, // 移除注释
        removeAttributeQuotes: true // 移除 属性上的双引号
      }
    }),
    new CleanWebpackPlugin(["dist"]),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors1", // 指定要抽离的入口名称
      filename: "js/vendors.js", // 将来再发布的时候，除了会有一个 bundle.js ，还会多一个 vendors.js 的文件，里面存放了所有的第三方包
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { // 配置压缩选项
        warnings: false // 移除警告
      }
    }),
    new ExtractTextPlugin("css/styles.css"), // 抽取CSS文件
    new OptimizeCssAssetsPlugin({// 压缩CSS的插件
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ],
  module: {
    // 配置所有第三方loader 模块的
    rules: [
      // 第三方模块的匹配规则
      { test: /\.css$/, use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader",
          publicPath: '../' // 指定抽取的时候，自动为我们的路径加上 ../ 前缀
        })}, // 处理 CSS 文件的 loader
      { test: /\.less$/, use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
          publicPath: '../' 
        }) },  // 处理 less 文件的 loader
      { test: /\.scss$/, use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
          publicPath: '../' 
        }) }, // 处理 scss 文件的 loader
      {
        test: /\.(jpg|png|gif|bmp|jpeg)$/,
        use: "url-loader?limit=7631&name=images/[hash:8]-[name].[ext]",
      }, // 处理 图片路径的 loader
      // limit 给定的值，是图片的大小，单位是 byte， 如果我们引用的 图片，大于或等于给定的 limit值，则不会被转为base64格式的字符串， 如果 图片小于给定的 limit 值，则会被转为 base64的字符串
      { test: /\.(ttf|eot|svg|woff|woff2)$/, use: "url-loader" }, // 处理 字体文件的 loader
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ }, // 配置 Babel 来转换高级的ES语法
      { test: /\.vue$/, use: "vue-loader" }, // 处理 .vue 文件的 loader
    ],
  },
};
