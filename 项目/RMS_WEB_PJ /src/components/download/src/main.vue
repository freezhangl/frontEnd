<script>
import { getHttp } from '@/serve'

const Http = getHttp()
let loadingServices = []
export default {
  name: 'DownloadFile',
  props: ['url', 'method', 'data', 'message'],
  httpService: {},
  data () {
    return {
      childRef: null,
      downFileState: false
    }
  },
  render: function (h) {
    this.childRef = this.$slots.default ? this.$slots.default : [<span/>]
    if (this.downFileState && loadingServices.length === 0) {
      this.childRef.forEach(vnode => {
        // console.log(this.childRef, vnode.elm, 'download file')
        // 防止在created的时候进入
        if (vnode.elm) {
          const loadingIns = this.$loading({
            target: vnode.elm,
            spinner: 'el-icon-loading',
            customClass: 'downloading-btn',
            background: 'rgba(0, 0, 0, 0.4)'
          })
          loadingServices.push(loadingIns)
        }
      })
    }
    if (!this.downFileState && loadingServices.length > 0) {
      loadingServices.forEach(loading => {
        if (loading) {
          loading.close()
        }
      })
      loadingServices = []
    }
    return (
      <span class='downloadfilebtn'>
        {this.childRef}
      </span>
    )
  },
  mounted () {
    this.childRef.forEach(vnode => {
      if (vnode.elm) {
        // console.log('add listener ', vnode.elm)
        vnode.elm.addEventListener('click', this.download)
      }
    })
    this.httpService = Http.createHttpServe([{
      name: 'downloadFile',
      url: this.url,
      method: this.method,
      config: { responseProp: ['data', 'headers'], responseType: 'blob', loading: false }
    }])
    // console.log('heheda', this.httpService)
  },
  methods: {
    transformStreamToFile (blob, fileName) {
      if ('download' in document.createElement('a') && !window.navigator.msSaveOrOpenBlob) { // 非IE下载
        const link = document.createElement('a')
        link.download = fileName
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href) // 释放URL 对象
        document.body.removeChild(link)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    },
    download () {
      if (this.url.indexOf('fileType=0000') > -1) {
        this.$message.error('请选择导入模板')
        return
      }
      this.downFileState = true
      this.httpService = Http.createHttpServe([{
        name: 'downloadFile',
        url: this.url,
        method: this.method,
        config: { responseProp: ['data', 'headers'], responseType: 'blob', loading: false }
      }])
      this.httpService.downloadFile(this.data)
        .then(res => {
          // debugger
          // console.log('res', res)
          const blob = new Blob([res.data])
          this.downFileState = false
          // console.log('downloaded file name is ', res.headers['content-disposition'])
          const filenameHeader = res.headers['content-disposition']
          let groups = null
          // 因为文件名不同，但filename出现两次，匹配后面一个，否组取第一个
          if (filenameHeader.indexOf('filename') === filenameHeader.lastIndexOf('filename')) {
            groups = /attachment;\sfilename(=|\*=utf-8'|\*=UTF-8')['"]([\d\D]+\.[\w]+)$/g.exec(filenameHeader)
          } else {
            groups = /attachment;\sfilename(=|\*=utf-8'|\*=UTF-8')['"]([\d\D]+\.[\w]+)['"];/g.exec(filenameHeader)
          }
          if (!groups) {
            groups = /attachment;filename(=|\*=utf-8'|\*=UTF-8')([\d\D]+\.[\w]+)/g.exec(filenameHeader)
          }
          // 这里做过滤，去除了捕获不到group
          // const name = lodash(groups)
          //   .compact()
          //   .last()
          const nameCompact = this.$lodash.compact(groups)
          const nameLast = this.$lodash.last(nameCompact)
          const fileName = decodeURIComponent(nameLast)
          // console.log('download file ', fileName)
          this.transformStreamToFile(blob, fileName)
          this.$message({
            message: this.message || '数据导出成功！',
            type: 'success',
            showClose: true
          })
          this.$emit('sucsess')
        })
        .catch(err => {
          // console.log(err, '=down error')
          this.$message.error('下载失败')
          this.$emit('sucsess')
          this.downFileState = false
          if (err.selfError) return
          this.$message.error('下载失败')
        })
    }
  },
  beforeDestroy () {
    this.childRef.forEach(vnode => {
      if (vnode.elm) {
        // console.log('remove listener ', vnode.elm)
        vnode.elm.removeEventListener('click', this.download)
      }
    })
  }
}
</script>

<style scoped lang="scss">
 .downloadfilebtn{
  cursor: pointer;
  display:inline-block;
 }
</style>
