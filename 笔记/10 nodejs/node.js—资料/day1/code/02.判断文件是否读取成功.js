const fs = require('fs')
fs.readFile('./files/11.txt', 'utf8', function(err, dataStr) {
  if (err) {
    console.log('读取文件失败！' + err.message)
    return
  }
  console.log('读取文件成功！' + dataStr)
})
