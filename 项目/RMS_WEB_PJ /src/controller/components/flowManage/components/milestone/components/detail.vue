<template>
  <div class="projectDocumentDetail" id="projectDocumentDetail">
    <project-panel title="项目文档">
      <self-table
        :table-data="projectDocList"
        :table-cols="projectDocCols"
        :border="isBorder"
        :loading="loading"
        :is-pagination="false"
      ></self-table>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import selfTable from '@/components/table'
import axios from 'axios'
import API from '@/serve/API_project'
import { getStore } from '@/store'

export default {
  name: 'projectDocumentDetail',
  components: { projectPanel, selfTable },
  props: {
    fileList: { type: Array, default: () => null }
  },
  data () {
    return {
      projectDocList: [], //项目文档列表数据
      projectDocCols: [
        {
          label: '文档类型',
          prop: 'attachmentTypeName',
          align: 'left',
          overflow: true,
          padding: true,
          resizable: false
        },
        {
          label: '文档名称',
          prop: 'fileName',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '上传人',
          prop: 'uploadBy',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '上传时间',
          prop: 'uploadDate',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatDate
        },
        {
          label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          width: '100',
          btnList: [
            { id: 1, type: 'text', label: '下载', handle: this.download },
            { id: 2, type: 'text', label: '预览', handle: this.preview }
          ]
        }
      ], // 项目文档列表表头字段
      isBorder: false, // 是否展示边框
      loading: false, // 是否需要加载效果
      baseUrl: getStore().getters['CONFIG/baseUrl'], // 下载请求url前缀
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      signInfo: {} // 文件sign信息
    }
  },
  watch: {
  },
  created () {
    if (this.fileList) {
      for (var i = this.fileList.length - 1; i > -1; i--) {
        if (this.fileList[i].fileName === '' || this.fileList[i].fileCode === null) {
          this.fileList.splice(i, 1)
        }
      }
      this.projectDocList = this.fileList
    }
  },
  mounted () {
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    dataChange (val) {
      return val === '' ? null : val
    },
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
    },
    //下载文件
    async download (row) {
      let url = '?nonce=' + row.nonce + '&sign=' + row.sign + '&timeStamp=' + row.timeStamp + '&fileCode=' + row.fileCode
      axios.request({
        url: this.baseUrl + '/rms/file/ext/file/v1/5/v1/file/' + url,
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        responseType: 'blob'
      })
        .then((res) => {
          let blob = new Blob([res.data])
          let fileName = row.fileName
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
        .catch(err => {
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
.projectDocumentDetail{
  width: 100%;
  background: white;
}
</style>
