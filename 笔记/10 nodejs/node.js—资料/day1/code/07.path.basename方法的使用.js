const path = require('path')

// 定义文件的存放路径
// const fpath = '/a/b/c/index.html'
console.log(path.join(__dirname,'./06.path.join方法的使用.js'),'afdf放大')
const fullName = path.basename(path.join(__dirname,'./06.path.join方法的使用.js'))
console.log(fullName)

const nameWithoutExt = path.basename(path.join(__dirname,'./06.path.join方法的使用.js'), '.js')
console.log(nameWithoutExt)
