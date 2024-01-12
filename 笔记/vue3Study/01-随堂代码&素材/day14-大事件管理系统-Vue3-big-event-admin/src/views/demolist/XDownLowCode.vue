<template>
  <div class="exclbtn__list">
    <a-button
      style="marginRight:16px"
      type="primary"
      v-if="hasPerm(exportBtn.permission)"
      @click="batchExport(exportBtn, index)"
      :loading="batchExportLoading[index]"
      v-for="(exportBtn, index) in exportList"
      :key="index + 'export'"><a-icon type="export" />{{
        exportBtn.text
      }}</a-button>
    <a-upload
      :action="`/api${importBtn.url}`"
      :multiple="true"
      :file-list="fileList"
      @change="handleChange"
      style="marginRight:16px;"
      v-if="hasPerm(importBtn.permission)"
      :headers="requestHeaders"
      :customRequest="(file) => { customRequest(file, importBtn) }"
      :accept="fileTypes"
      v-for="(importBtn, index) in importList"
      :key="index + 'import'">
      <!-- <a-button type="primary"> <a-icon type="upload" /> {{ importBtn.text }} </a-button> -->
      <a-button :disabled="isUploading || (importBtn.showProgress && parseProgress < 100 && parseProgress > 0)" type="primary"> <a-icon type="upload" /> {{ importBtn.text }} </a-button>
      <div v-if="importBtn.showProgress && parseProgress > 0 && parseProgress < 100" class="progress__box" @click.stop="">
        <div class="progress__outer">
          <p class="progress__inner" :style="{ width: `${parseProgress}%` }"></p>
        </div>
        <p class="progress__text">{{ parseProgress }}%</p>
      </div>
      <!-- <a-button type="primary" @click.stop="downLoadByRequestNo" v-if="downLoadRequestNo">下载文件</a-button> -->
    </a-upload>
    <a-modal v-model="visible" title="提示信息">
      <template slot="footer">
        <a-button type="primary" @click="handleDownErrorData" :disabled="!errorDataId">
          下载错误数据
        </a-button>
        <a-button type="primary" @click="handleOk">
          确定
        </a-button>
      </template>
      <div class="model__con">
        <p>上传结束！成功数量：{{ successNum }},失败数量：{{ errorNum }}</p>
        <p v-html="errorMessage"></p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { UploadComp } from '@/components'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { exportListData, getListData } from '@/api/spare/index'
const fileTypes = 'application/vnd.ms-excel,application/msexcel,application/x-msexcel,application/x-ms-excel,application/x-excel,application/x-dos_ms_excel,application/xls,application/x-xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
export default {
  name: 'XDownLowCode',
  components: {
    UploadComp
  },
  props: {
    exportList: {
      type: Array,
      default: () => {
        return []
      }
    },
    importList: {
      type: Array,
      default: () => {
        return []
      }
    },
    idList: {
      type: Array,
      default: () => {
        return []
      }
    },
    queryForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    getProgressUrl: {
      type: String,
      default: '/spare/spareExcel/import/queryProcess'
    }
  },
  created () {
    this.batchExportLoading = this.exportList.map(res => {
      return false
    })
  },
  data () {
    return {
      downLoadRequestNo: '',
      parseProgress: 0,
      isUploading: false,
      batchExportLoading: [],
      fileList: [],
      requestHeaders: {
        Authorization: 'Bearer ' + this.$ls.get(ACCESS_TOKEN) // 页面token
      },
      fileTypes: fileTypes,
      successNum: 0,
      errorNum: 0,
      errorMessage: '',
      visible: false,
      errorDataId: ''
    }
  },
  methods: {
    handleChange () { },
    handleDownErrorData () {
      exportListData(`/admin/sysFileInfo/download`, 'GET', { params: { id: this.errorDataId } }).then(res => {
        if (res.status === 200) {
          this.visible = false
          this.downloadfile(res)
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.visible = false
      })
    },
    getProgress (progressurl, requestNo) {
      getListData(progressurl, 'GET', { params: { requestNo: requestNo } }).then(res => {
        if (res.code === 200) {
          this.parseProgress = res.data.progress
          if (!res.data.complete) {
            setTimeout(() => {
              this.getProgress(progressurl, requestNo)
            }, 1000)
          } else {
            this.$emit('importSuccess', true)
            this.parseProgress = 100
            this.visible = true
            this.successNum = res.data.successRow
            this.errorNum = res.data.errorRow
            this.errorMessage = res.data.message
            this.errorDataId = res.data.errorDataUrl || ''
            this.downLoadRequestNo = requestNo
          }
        } else {
            this.parseProgress = 0
            this.visible = false
            this.$message.error(res.message)
        }
      })
    },
    downLoadByRequestNo () {
      exportListData(`/admin/sysFileInfo/download`, 'GET', { params: { id: this.downLoadRequestNo } }).then(response => {
        if (response.status === 200) {
          this.downLoadRequestNo = ''
          this.downloadfile(response)
          this.$message.success('操作成功')
        } else {
          this.$message.error(response.message)
        }
      })
    },
    customRequest (data, importBtn) {
      this.isUploading = true
      this.errorDataId = ''
      this.$emit('importStart')
      const formData = new FormData()
      formData.append('excel', data.file)
      let url = ''
      if (importBtn?.selfUrl) {
        url = importBtn.url
      } else {
        url = `${importBtn.url}`
      }
      // 这里的token根据自身情况修改
      getListData(url, 'POST', { data: formData }).then(res => {
      // getListData(`${importBtn.url}`, 'POST', { data: formData }).then(res => {
        if (res.code === 200) {
          this.isUploading = false
          if (importBtn?.selfUrl) {
            this.$emit('importSuccess', true)
            this.parseProgress = 100
            this.visible = true
            this.successNum = res.data.successRow
            this.errorNum = res.data.errorRow
            this.errorMessage = res.data.message
            this.errorDataId = res.data.errorDataUrl || ''
          } else {
            this.getProgress(this.getProgressUrl, res.data.requestNo)
          }
        } else {
          this.$message.error(res.message)
          this.$emit('importSuccess', false)
        }
      }).catch(() => {
        this.$emit('importSuccess', false)
      })
    },
    handleOk () {
      this.visible = false
    },
    /**
     * 本控件中点击按钮事件
     */
    batchExport (exportBtn, index) {
      this.$set(this.batchExportLoading, index, true)
      let targetObj = {}
      if (exportBtn.needQuery) {
        targetObj = JSON.parse(JSON.stringify(this.queryForm))
      }
      if (exportBtn.needIdlist && this.idList.length) {
        targetObj.idList = this.idList.map(item => {
          return item.id
        })
      }
      exportListData(exportBtn.url, exportBtn.methods, exportBtn.methods === 'POST' ? { data: targetObj } : { params: targetObj }).then(res => {
        console.log(res)
        this.$set(this.batchExportLoading, index, false)
        if (res.status === 200) {
          this.downloadfile(res)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    /**
     * 通过返回的元素通过浏览器下载
     * 也就是接受使用这个组件的地方吧下载的内容传过来，
     * 但是这个组件本公子编写的时候只想的适用于导出excel来使用，下载文件呀图片方面的重新整个组件即可
     */
    downloadfile (res) {
      var blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      var filename = result[1]
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      var reg = /^["](.*)["]$/g
      downloadElement.style.display = 'none'
      downloadElement.href = href
      downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href)
    }
  }
}
</script>
<style lang="less" scoped>
.exclbtn__list {
  display: flex;
  /deep/ .ant-upload {
        display: flex;
        align-items: center;

        .progress__box {
          display: flex;
          align-items: center;
          margin-left: 16px;

          .progress__outer {
            width: 200px;
            height: 6px;
            border-radius: 3px;
            background-color: rgba(150, 150, 150, 1);

            .progress__inner {
              height: 100%;
              background: #ffcb2b;
              border-radius: 3px;
            }
          }

          .progress__text {
            margin-left: 10px;
          }
        }
      }
}
/deep/ .ant-btn-primary-disabled, .ant-btn-primary.disabled, .ant-btn-primary[disabled], .ant-btn-primary-disabled:hover, .ant-btn-primary.disabled:hover, .ant-btn-primary[disabled]:hover, .ant-btn-primary-disabled:focus, .ant-btn-primary.disabled:focus, .ant-btn-primary[disabled]:focus, .ant-btn-primary-disabled:active, .ant-btn-primary.disabled:active, .ant-btn-primary[disabled]:active, .ant-btn-primary-disabled.active, .ant-btn-primary.disabled.active, .ant-btn-primary[disabled].active{
    background-color: #ccc;
  }
.model__con {
  max-height: 450px;
  overflow-y: auto;
}
</style>
