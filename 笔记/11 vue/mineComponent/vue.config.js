const path = require('path')
const builtTime = new Date()
  .toLocaleString()
module.exports = {
  // 修改默认的入口
  pages: {
    index: {
      entry: 'src/pages/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      builtTime,
      minify: {
        // removeComments: true,
        // collapseWhitespace: true,
        // removeAttributeQuotes: true
      }
    }
  },
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  configureWebpack: {
  },
  chainWebpack: config => {
    //热更新
    config.resolve.symlinks(true)
    // vue默认@指向src目录，另外新增一个~指向packages
    config.resolve.alias
      .set('@', path.resolve('src'))
      .set('@lib', path.resolve('packages'))
      .set('@theme', path.resolve('src/assets/theme'))
    // lib目录是组件库最终打包好存放的地方，不需要eslint检查
    config.module
      .rule('eslint')
      .exclude.add(path.resolve('lib'))
      .add(path.resolve('node_modules'))
      .end()
    // packages和src目录需要加入编译
    config.module
      .rule('js')
      .include.add(/packages/)
      .end()
      .include.add(/src/)
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => options)
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/assets/scss/variable.scss')]
    }
  },
  css: {
    // loaderOptions: {
    //   postcss: {
    //     plugins: [
    //       require('postcss-px2rem-exclude')({
    //         remUnit: 192,
    //         exclude: /element-ui/
    //       })
    //     ]
    //   }
    // }
  },
  devServer: {
    publicPath: '/',
    port: 8000, // 自定义修改8080端口
    proxy: {
      '/api': {
        target: 'http://172.16.34.54:80/',
        changeOrigin: true,
        secure: false,
        // logLevel: 'debug',
        pathRewrite: {
          '/api': ''
        }
      },
      '/abc': {
        target: 'http://22.188.14.123:8061/',
        changeOrigin: true,
        secure: false,
        // logLevel: 'debug',
        pathRewrite: {
          '^/abc': ''
        }
      }
    }
  }
}
