import downloadFile from './src/main'

downloadFile.install = function (Vue) {
  Vue.component(downloadFile.name, downloadFile)
}

export default downloadFile
