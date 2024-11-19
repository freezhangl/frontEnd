const path = require('path')
// const childProcess = require('child_process')
const CopyPlugin = require('copy-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  // 修改默认的入口
  publicPath: '/rms/pc/',
  productionSourceMap: false,
  css: {
    // 是否开启 CSS source maps
    sourceMap: false
  },
  /* configureWebpack: {
    plugins: [
      // 这里需要配置一下静态的路径，目标路径和各个业务模块的配置的部署地址（__webpack_public_path__）相同
      new CopyPlugin([
      ]),
      new CaseSensitivePathsPlugin()
    ]
  }, */
  configureWebpack: config => {
    let plugins = [new CopyPlugin([]), new CaseSensitivePathsPlugin()]
    plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: false,
            drop_debugger: true
            // pure_funcs: ['console.log'] //移除console
          },
          mangle: false,
          output: {
            beautify: true //压缩注释
          }
        },
        sourceMap: false,
        parallel: true
      })
    )
    config.plugins = [...config.plugins, ...plugins]
  },
  chainWebpack: config => {
    //热更新
    config.resolve.symlinks(true)
    // vue默认@指向src目录，另外新增一个~指向packages
    config.resolve.alias
      .set('@', path.resolve('src'))
      .set('@theme', path.resolve('src/assets/theme'))
    // lib目录是组件库最终打包好存放的地方，不需要eslint检查
    // src/docs是存放md文档的地方，也不需要eslint检查
    config.module
      .rule('eslint')
      .exclude.add(path.resolve('lib'))
      .end()
    // packages和src目录需要加入编译
    config.module
      .rule('js')
      .include.add(/src/)
      .end()
      .include.add(/packages/)
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => options)
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        // path.resolve(__dirname, './src/assets/scss/base.scss')
        path.resolve(__dirname, './src/assets/scss/variable.scss')
      ]
    }
  }
  // devServer: {
  //   publicPath: '/rms/pc/',
  //   proxy: {
  //     '/api': {
  //       target: 'http://10.154.2.101',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // }
}
