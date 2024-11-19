# 附件预览页面
## 点击预览按钮处理方法：
```js
preview (row) {
    let canPreview = ['jpg', 'jpeg', 'png', 'bmp', 'pdf', 'xlsx', 'xls', 'docx', 'doc', 'ppt', 'pptx']
    let arr = row.fileName.split('.')
    let type = arr[arr.length - 1]
    if (canPreview.indexOf(type.toLowerCase()) === -1) {
        this.$message({
            message: '该文件类型不支持在线预览',
            type: 'warning',
            showClose: true
        })
        return
    }
    let { href } = this.$router.resolve({
        path: '/previewDoc',
        query: {
            fileName: row.fileName,
            fileCode: row.fileCode,
            nonce: row.nonce,
            sign: row.sign,
            timeStamp: row.timeStamp
        }
    })
    // 打开新的窗口
    let $window = window.open(href, '_blank')
}
```