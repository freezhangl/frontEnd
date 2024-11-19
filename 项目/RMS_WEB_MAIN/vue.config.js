const path = require('path')
const childProcess = require('child_process')
const CopyPlugin = require('copy-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const builtTime = new Date()
  .toLocaleString()
const env = process.env.BABEL_ENV
let gitInfo = ''
try {
  const revStdout = childProcess.execSync('git rev-parse HEAD')
    .toString()
    .trim()
  const hasUnCommitFiles = childProcess.execSync('git status')
    .toString()
    .indexOf('Changes not staged for commit') >= 0
  if (hasUnCommitFiles) {
    gitInfo = '使用git rev号:' + revStdout + '构建,本地有未提交代码。' + '构建环境变量:' + env
  } else {
    gitInfo = '使用git rev号:' + revStdout + '构建。' + '构建环境变量:' + env
  }
} catch (e) {
  gitInfo = 'get git info failed.' + 'node env:' + env
  // console.log('failed to get git info')
}

module.exports = {
  // transpileDependencies: [
  //   // 'vue-echarts',
  //   'resize-detector',
  //   'vue-pdf'
  // ],
  // 修改默认的入口
  pages: {
    index: {
      entry: 'src/pages/entry/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      builtTime,
      gitInfo,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }
  },
  publicPath: '/rms/pc/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  configureWebpack: {
    plugins: [
      // 这里需要配置一下静态的路径，目标路径和各个业务模块的配置的部署地址（__webpack_public_path__）相同 -- 配置模块
      new CopyPlugin([
        { from: './node_modules/@rms/rms-systemclient/dist', to: './systemFunction' },
        { from: './node_modules/@rms/rms-pjclient/dist', to: './projectLife' },
        { from: './node_modules/@rms/rms-plan/dist', to: './plan' },
        { from: './node_modules/@rms/rms-bsconfig/dist', to: './basicConfig' },
        { from: './node_modules/@rms/rms-wktime/dist', to: './workTime' },
        { from: './node_modules/@rms/rms-homeclient/dist', to: './home' },
        { from: './node_modules/@rms/rms-formclient/dist', to: './formManage' }
      ]),
      new CaseSensitivePathsPlugin()
    ]
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
    // 是否开启 CSS source maps
    sourceMap: false
    // loaderOptions: {
    //   sass: {
    //     data: `@import "./src/assets/scss/variable.scss";`
    //   }
    // }
  },
  devServer: {
    publicPath: '/rms/pc/',
    proxy: {
      '/api': {
        // target: 'http://10.154.2.107/',
        // target: 'http://10.154.2.101/',
        // target: 'http://10.154.7.53:80',
        // target: 'http://10.154.4.13/',
        // logLevel: 'debug',
        target: 'https://test.e-grids.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
