<template>
  <div>
    <div class="tablebox">
      <template>
        <el-table :data="projectFileData" style="width: 100%">
          <el-table-column
            prop="businessType"
            label="业务类型"
            width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="attachmentTypeName" label="文档类型" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="fileName"
            label="文档名称"
            width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="uploadBy" label="上传人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="uploadDate" label="上传时间" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row)">下载</el-button>
              <el-button type="text" @click="preview(scope.row)">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
import API from '@/serve/API_projectInfo.js'
import APIProject from '@/serve/API_project.js'

import axios from 'axios'
import { getStore } from '@/store'
export default {
  name: 'projectFile',
  data () {
    return {
      projectFileData: [],
      typeOptions: [{ valueCode: '01', name: '自立项目' }],
      baseUrl: getStore().getters['CONFIG/baseUrl'], //下载请求url前缀
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      signInfo: {} // 文件sign信息
    }
  },
  methods: {
    //项目文档
    projectFileList () {
      let params = {
        projectCode: this.$route.params.projectCode
      }
      API.projectFileList(params)
        .then(res => {
          res.forEach(item => {
            item.uploadDate = this.$formatDate(item.createdDate, 'YYYY-MM-DD HH:mm:ss')

            this.typeOptions.forEach(typeOption => {
              if (item.businessType === typeOption.valueCode) {
                item.businessType = typeOption.name
              }
            })
          })
          this.projectFileData = res
        })
        .catch(() => {
        })
    },
    showDict (item) {
      this.typeOptions.forEach(typeOption => {
        if (item === typeOption.valueCode) {
          return typeOption.name
        }
      })
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
    async downloadFile (row) {
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
        .catch((err) => {
          this.$message({
            message: err,
            type: 'error',
            showClose: true
          })
        })
    }
  },
  created () {
    //项目类型
    API.dictValByCode('BUSINESS-TYPE')
      .then(res => {
        this.typeOptions = res
        this.projectFileList()
      })
      .catch(err => {
        this.$message.error(err.message || '数据字典失败')
      })
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.tablebox {
    background: #fff;
    // width: 1180px;
    margin: 0 auto;
    padding: 30px;
    .el-table {
      width: 1118px;
      border-left: 1px solid #E8E8E8;
      border-right: 1px solid #E8E8E8;
      .el-table__body {
        tbody {
          tr {
            border-left: 1px solid #f6f6f6;
          }
        }
      }
    }
  }
</style>
