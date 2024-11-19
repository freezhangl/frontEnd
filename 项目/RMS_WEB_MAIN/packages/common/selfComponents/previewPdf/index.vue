<template>
  <div class="previewPdf">
    <p class="top-header">
      <!-- 上一页 -->
      <el-button
        class="btn"
        :class="{'disabled':currentPage===1}"
        type="text"
        @click="changePdfPage(0)">上一页</el-button>
      <span class="btn">{{ currentPage }} / {{ pageCount }}</span>
      <!-- 下一页 -->
      <el-button
        class="btn"
        :class="{'disabled':currentPage===pageCount}"
        type="text"
        @click="changePdfPage(1)">下一页</el-button>
      <!-- <el-button class="btn" type="text" @click="download">下载</el-button> -->
    </p>
    <pdf
      class="pdf-content"
      :src="src"
      :page="currentPage"
      @num-pages="pageCount = $event"
      @page-loaded="currentPage = $event"
      @loaded="loadPdfHandler"
    ></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import axios from 'axios'
export default {
  name: 'previewPdf',
  data () {
    return {
      baseUrl: this.$store.getters['CONFIG/baseUrl'], //下载请求url前缀
      Authorization: this.$store.getters['USERENTITY/authHeaher'].Authorization,
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      src: '',
      loading: null,
      nonce: this.$route.query.nonce,
      sign: this.$route.query.sign,
      timeStamp: this.$route.query.timeStamp
    }
  },
  components: { pdf },
  props: {
    fileCode: { type: String, default: '' },
    isOfficeDoc: { type: Boolean, default: false }
  },
  mounted () {
    this.getPdfSrc()
  },
  methods: {
    getPdfSrc () {
      this.loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let fileUrl = this.$route.query.inside ? '/rms/file/file/v1/5/file' : '/rms/file/ext/file/v1/5/v1/file'
      let filePreviewUrl = this.$route.query.inside ? '/rms/file/file/v1/5/filePreview' : '/rms/file/ext/file/v1/5/v1/filePreview'
      let params = '?nonce=' + this.nonce + '&sign=' + this.sign + '&timeStamp=' + this.timeStamp + '&fileCode=' + this.fileCode
      let url = ''
      if (this.isOfficeDoc) {
        url = filePreviewUrl + params
      } else if (this.nonce) {
        url = fileUrl + params
      } else {
        url = fileUrl + '/' + this.fileCode
      }
      axios.request({
        url: this.baseUrl + url,
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        responseType: 'blob'
      })
        .then(res => {
          // console.log('pdf/doc', res)
          if (res.data.type === 'application/json') {
            this.$message({
              message: '预览文件正在生成，请稍后重试！',
              type: 'error',
              showClose: true
            })
            this.loading.close()
          } else {
            let blob = new Blob([res.data])
            this.src = URL.createObjectURL(blob)
            this.handleOpen()
          }
        })
        .catch(e => {
          // console.log('pdf/doc error', e)
          this.loading.close()
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '文件查看失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage (val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    // pdf加载时
    loadPdfHandler () {
      this.currentPage = 1 // 加载的时候先加载第一页
    },
    handleOpen () {
      this.loading.close()
      this.pdfDialog = true
    },
    //关闭弹框
    close () {
      this.pdfDialog = false
    },
    //附件下载
    download () {
      axios.request({
        url: this.baseUrl + '/zuul/rms/file/ext/file/v1/5/v1/file/' + this.fileCode,
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        responseType: 'blob'
      })
        .then((res) => {
          let blob = new Blob([res.data])
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
          // console.log('filenameHeader', filenameHeader)
          // 非IE下载
          if ('download' in document.createElement('a')) {
            let elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '下载文件失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.previewPdf{
  background:#f6f6f6;
  .top-header{
    text-align: center;
    margin: 0;
    padding: 10px 0;
  }
  .btn{
    margin: 0 10px;
    &.disabled{
      color: #999;
      cursor: not-allowed;
    }
  }
  .pdf-content{
    margin: auto;
    min-width: 500px;
    max-width: 1000px;
  }

}
</style>
