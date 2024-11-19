<template>
  <div ref="previewDoc" class="previewDoc" :class="{'imgStyle':isImg}">
    <preview-pdf v-if="isPdf" :file-code="fileCode" :is-office-doc="isOfficeDoc"></preview-pdf>
    <img v-if="isImg" :src="src"/>
    <div v-if="isTxt" ref="txt" class="txt-con"></div>
    <div v-if="isHtml" ref="html"></div>
  </div>
</template>

<script>
import axios from 'axios'
import PreviewPdf from '../../common/selfComponents/previewPdf/index'
export default {
  data () {
    return {
      baseUrl: this.$store.getters['CONFIG/baseUrl'], // 下载请求url前缀
      Authorization: this.$store.getters['USERENTITY/authHeaher'].Authorization,
      fileType: '',
      fileCode: this.$route.query.fileCode,
      nonce: this.$route.query.nonce,
      sign: this.$route.query.sign,
      timeStamp: this.$route.query.timeStamp,
      src: '',
      isPdf: false,
      isImg: false,
      isTxt: false,
      isHtml: false,
      isOfficeDoc: false,
      officeDoc: ['docx', 'doc', 'ppt', 'pptx'],
      loading: null
    }
  },
  components: { PreviewPdf },
  created () {
    let arr = this.$route.query.fileName.split('.')
    let type = arr[arr.length - 1]
    this.fileType = type.toLowerCase()
    //.pdf,.jpg,.jpeg,.png,.bmp,.tga,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rp,.html,.htm,.mht,.zip,.tz,.rar,.PDF,.JPG,.JPEG,.PNG,.BMP,.TGA,.DOC,.DOCX,.XLS,.XLSX,.PPT,.PPTX,.TXT,.RP,.HTML,.HTM,.MHT,.ZIP,.TZ,.RAR
    this.isOfficeDoc = this.officeDoc.indexOf(this.fileType) > -1
    if (this.fileType === 'pdf' || this.isOfficeDoc) {
      this.isPdf = true
    } else if (this.fileType === 'jpg' || this.fileType === 'jpeg' || this.fileType === 'png' || this.fileType === 'bmp') {
      this.isImg = true
      this.getFile('img')
    } else if (this.fileType === 'xlsx' || this.fileType === 'xls') {
      this.isHtml = true
      this.getFile('html')
    }
    /*  else if (this.fileType === 'txt') {
      this.isTxt = true
      this.getFile()
    } */
  },
  methods: {
    getFile (type) {
      let url = this.$route.query.inside ? '/rms/file/file/v1/5/file' : '/rms/file/ext/file/v1/5/v1/file'
      let params = '?nonce=' + this.nonce + '&sign=' + this.sign + '&timeStamp=' + this.timeStamp + '&fileCode=' + this.fileCode
      this.loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (type === 'html') {
        url = this.$route.query.inside ? '/rms/file/file/v1/5/filePreview' : '/rms/file/ext/file/v1/5/v1/filePreview'
      }
      axios.request({
        url: this.baseUrl + url + params,
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        responseType: 'blob'
      })
        .then((res) => {
          // console.log(res, '=======')
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
            if (this.isTxt || this.isHtml) {
              var reader = new FileReader()
              reader.readAsText(blob)
              reader.onload = evt => {
                var data = evt.target.result
                if (this.isTxt) {
                  this.$refs.txt.innerHTML = data
                } else if (this.isHtml) {
                  this.$refs.html.innerHTML = data
                }
                this.loading.close()
              }
            } else {
              this.loading.close()
            }
          }
        })
        .catch(err => {
          // console.log(err, '+++++')
          this.loading.close()
          this.$message({
            message: err,
            type: 'error',
            showClose: true
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.previewDoc{
  background:#f6f6f6;
  height: 100%;
  &.imgStyle{
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .txt-con{
    margin: auto;
    height: 100vh;
    min-width: 500px;
    max-width: 1000px;
    background-color: #fff;
  }
}
</style>
