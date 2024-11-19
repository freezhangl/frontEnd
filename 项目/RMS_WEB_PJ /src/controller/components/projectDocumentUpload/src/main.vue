<template>
  <div class="projectDocumentUpload" id="projectDocumentUpload">
    <project-panel class="upload-info" title="项目文档">
      <el-table
        :cell-class-name="firstColumnStyle"
        :header-cell-style="tableHeadStyle"
        :data="projectDocList"
        :span-method="objectSpanMethod"
        :max-height="300">
        <el-table-column
          prop="attachmentTypeName"
          label="文档类型"
          align="center"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:red;" v-if="scope.row.requiredFlag=='1'">* </span>{{scope.row.attachmentTypeName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="文档名称"
          align="left"
          show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="uploadBy"
          label="上传人"
          align="left"
          show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="uploadDate"
          label="上传时间"
          align="left"
          show-overflow-tooltip></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="150"
          fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.fileName !== ''">
              <el-button type="text" @click="download(scope.row)">下载</el-button>
              <el-button type="text" @click="preview(scope.row)">预览</el-button>
              <el-button
                type="text"
                style="color:red"
                @click="deleteAttachment(scope.row,scope.$index)"
                @keydown.native="listenKeyDown($event)">删除</el-button>
            </div>
            <div v-else>
              <el-upload
                class="project-upload"
                name="file"
                :show-file-list="false"
                :headers="uploadHeaders"
                :action="uploadUrl"
                :data="uploadAttachParams"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeUpload"
                accept=".pdf,.jpg,.jpeg,.png,.bmp,.tga,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rp,.html,.htm,.mht,.zip,.tz,.rar,.PDF,.JPG,.JPEG,.PNG,.BMP,.TGA,.DOC,.DOCX,.XLS,.XLSX,.PPT,.PPTX,.TXT,.RP,.HTML,.HTM,.MHT,.ZIP,.TZ,.RAR"
                style="margin-right: 10px">
                <el-button type="text" @click="uploadCheck(scope.row,scope.$index)">上传</el-button>
              </el-upload>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'

import axios from 'axios'
import { getStore } from '@/store'
import API from '@/serve/API_project'
export default {
  name: 'projectDocumentUpload',
  components: { projectPanel },
  props: {
    docParams: {},
    fileList: { type: Array, default: () => null }
  },
  data () {
    return {
      tableHeadStyle: { // 项目文档表头样式
        background: '#F4F4F4',
        color: 'rgba(0,0,0,0.85)'
      },
      projectDocList: [], //项目文档列表数据
      baseUrl: getStore().getters['CONFIG/baseUrl'], //下载请求url前缀
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      uploadLoading: null, //导入文件时出现的loading状态组件
      approveNo: this.$route.query.approveNo,
      uploadAttachParams: {
      },
      uploadHeaders: { Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization }, // 上传项目文件authentication
      uploadUrl: getStore().getters['CONFIG/baseUrl'] + '/zuul/rms/project/use/file/v1/4/uploadFile',
      uploadRestrictions: '',
      attachmentTypeCode: '',
      size: 0,
      index: 0,
      currentUploadInfo: {}, //存储上传当前行信息
      currentUpIndex: 0,
      currentUserName: getStore().getters['USERENTITY/userInfo'].userAuth.chineseName,
      existAttachmentIds: [],
      acceptSuffix: ['pdf', 'jpg', 'jpeg', 'png', 'bmp', 'tga', 'doc', 'docx',
        'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rp', 'html', 'htm', 'mht', 'zip', 'tz', 'rar',
        'PDF', 'JPG', 'JPEG', 'PNG', 'BMP', 'TGA', 'DOC', 'DOCX', 'XLS', 'XLSX',
        'PPT', 'PPTX', 'TXT', 'RP', 'HTML', 'HTM', 'MHT', 'ZIP', 'TZ', 'RAR'], //可上传的文件类型
      signInfo: {} // 文件sign信息
    }
  },
  watch: {
  },
  mounted () {
    this.getApproveId()
    // this.getAttachmentList()
  },
  methods: {
    // 新增时需要先获取getApproveId，作为保存id
    getApproveId () {
      //编辑页面false 或者 驳回页面undefined，不需要获取流水号
      if (this.$route.query.addLaunch === 'false' || typeof (this.$route.query.addLaunch) === 'undefined') {
        this.approveNo = this.$route.query.approveNo
        this.getAttachmentList()
      } else {
        API.getApproveId()
          .then(res => {
            this.approveNo = res
            this.getAttachmentList()
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '获取业务流程ID失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
      }
    },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    dataChange (val) {
      return val === '' ? null : val
    },
    firstColumnStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (column.span !== 0) {
          return 'first-column-style'
        }
      }
    },
    // 合并表格--同类型单元格合并
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (column.span !== 0) {
          return {
            rowspan: row.span,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 获取项目文件列表
    getAttachmentList () {
      if (this.fileList) {
        let ids = []
        this.fileList.forEach(item => {
          if (item.fileCode) {
            ids.push(item.id)
          }
          item.uploadDate = item.uploadDate === null ? null : this.formatDate(item.uploadDate)
        })
        this.existAttachmentIds = ids
        this.projectDocList = this.fileList
        this.$emit('existAttachmentIds', ids, this.fileList, this.approveNo)
      } else {
        // 使用组件props传递请求参数
        let params = this.docParams
        API.queryAttachmentType(params)
          .then(res => {
            this.loading = false
            res.forEach(item => {
              item.uploadDate = item.uploadDate === null ? null : this.formatDate(item.uploadDate)
            })
            this.projectDocList = res
            let existIds = []
            this.projectDocList.forEach(exItem => {
              if (exItem.fileCode) {
                existIds.push(exItem.id)
              }
            })
            this.existAttachmentIds = existIds
            this.$emit('existAttachmentIds', this.existAttachmentIds, this.projectDocList, this.approveNo)
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '获取项目文档失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
      }
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
    // 删除项目文档
    deleteAttachment (row, index) {
      this.$confirm(' ', '此操作将删除项目相关信息，是否进行此操作?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let param = {
            'fileCode': row.fileCode
          }
          let sameAtt = []
          this.projectDocList.forEach(item => {
            if (item.attachmentTypeCode === row.attachmentTypeCode) {
              sameAtt.push(item)
            }
          })
          this.projectDocList.map((item, index) => {
            if (item.fileCode === row.fileCode && item.fileCode) {
              if (sameAtt.length === 1) {
                item.fileCode = null
                item.fileName = ''
                item.size = 0
                item.uploadBy = null
                item.uploadDate = null
              } else {
                if (item.span > 1) {
                  this.projectDocList[index + 1].span = item.span - 1
                  this.projectDocList.splice(index, 1)
                  this.projectDocList.forEach(newItem => {
                    if (newItem.attachmentTypeCode === row.attachmentTypeCode) {
                      newItem.size = row.size - 1
                    }
                  })
                } else {
                  this.projectDocList.splice(index, 1)
                  // span、size需要对应的减少
                  this.projectDocList.forEach(newItem => {
                    if (newItem.attachmentTypeCode === row.attachmentTypeCode) {
                      newItem.span = newItem.span > 1 ? newItem.span - 1 : newItem.span
                      newItem.size = row.size - 1
                    }
                  })
                }
              }
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          let existIds = []
          this.projectDocList.forEach(exItem => {
            if (exItem.fileCode) {
              existIds.push(exItem.id)
            }
          })
          this.existAttachmentIds = existIds
          this.$emit('existAttachmentIds', this.existAttachmentIds, this.projectDocList, this.approveNo)
        })
    },
    // 文档个数限制--超出文件最大上传数
    handleExceed (files, fileList) {
      if (files.length + this.size > 15) {
        this.$message({
          message: '当前限制选择 15 个文件！',
          showClose: true,
          type: 'warning'
        })
      } else {
        this.$message({
          message: '附件上传数量已达上限！',
          showClose: true,
          type: 'warning'
        })
      }
    },
    // 项目文档上传成功
    handleSuccess (response, file) {
      if (this.currentUploadInfo.size + 1 > 15) {
        this.$message({
          message: '项目文档上传失败,当前限制不能超过15个!',
          type: 'error',
          showClose: true
        })
        this.uploadLoading.close()
      } else {
        if (response.code === '000000') {
          this.$message({
            message: '附件上传成功。',
            type: 'success',
            showClose: true
          })
          // TODO 前端处理展示，接口不刷新
          // 将新增的file存入 this.projectDocList，并处理同类型的span和size
          let addFile = {
            id: response.body.id,
            attachmentTypeCode: this.currentUploadInfo.attachmentTypeCode,
            attachmentTypeName: this.currentUploadInfo.attachmentTypeName,
            fileCode: response.body.fileCode,
            fileName: response.body.fileName,
            requiredFlag: this.currentUploadInfo.requiredFlag,
            uploadBy: response.body.uploadBy,
            uploadDate: this.formatDate(response.body.updatedDate),
            span: 0,
            size: this.currentUploadInfo.size + 1,
            uploadRestrictions: this.currentUploadInfo.uploadRestrictions,
            nonce: response.body.nonce,
            sign: response.body.sign,
            timeStamp: response.body.timeStamp
          }
          // 是否只能上传一个
          if (this.currentUploadInfo.uploadRestrictions === '01') {
            addFile.span = 1
            // this.projectDocList[this.currentUpIndex] = addFile
            this.projectDocList.splice(this.currentUpIndex, 1, addFile)
          } else {
            this.projectDocList.forEach(item => {
              if (item.attachmentTypeCode === addFile.attachmentTypeCode) {
                item.size = addFile.size
              }
            })
            let firstFlag = this.projectDocList.some(item => {
              if (item.attachmentTypeCode === addFile.attachmentTypeCode && item.fileCode !== null) {
                item.span = item.size + 1
                return true
              } else {
                return false
              }
            })
            if (firstFlag) {
              this.projectDocList.splice(this.currentUpIndex, 0, addFile)
            } else {
              addFile.span = 2
              this.projectDocList.some(item => {
                if (item.attachmentTypeCode === addFile.attachmentTypeCode && item.fileCode === null) {
                  item.span = 0
                  return true
                }
              })
              this.projectDocList.splice(this.currentUpIndex, 0, addFile)
            }
          }
          this.uploadLoading.close()
          let existIds = []
          this.projectDocList.forEach(exItem => {
            if (exItem.fileCode) {
              existIds.push(exItem.id)
            }
          })
          this.existAttachmentIds = existIds
          this.$emit('existAttachmentIds', this.existAttachmentIds, this.projectDocList, this.approveNo)
        } else {
          this.$message({
            message: response.message || '项目文档上传失败!',
            type: 'error',
            showClose: true
          })
          this.uploadLoading.close()
        }
      }
    },
    // 项目文档上传失败回调
    handleError (err, file) {
      this.uploadLoading.close()
      this.$message({
        message: '项目文档上传失败!',
        type: 'error',
        showClose: true
      })
      throw err
    },
    // TODO--校验上传参数
    uploadCheck (row, index) {
      this.uploadRestrictions = row.uploadRestrictions
      this.size = row.size
      this.attachmentTypeCode = row.attachmentTypeCode
      this.index = index
      this.currentUploadInfo = row
      this.uploadAttachParams = {
        businessType: this.docParams.type, // type
        approveNo: this.docParams.approveNo || this.approveNo, // 业务单据流水号
        attachmentTypeCode: this.currentUploadInfo.attachmentTypeCode,
        projectCode: this.$route.query.projectCode || this.docParams.projectCode
      }
      this.currentUpIndex = index
    },
    // 上传文件控制处理
    beforeUpload (file) {
      // 限制文档上传名称的长度
      let FileNameLength = this.checkFileNameLength(file)
      if (FileNameLength) return false
      // 判断文件是否都是可以上传的文件类型
      let index = file.name.lastIndexOf('.')
      let suffixType = file.name.substring(index + 1, file.name.length)
      let isAllowSuffix = this.acceptSuffix.some(item => {
        if (suffixType === item) {
          return true
        } else {
          return false
        }
      })
      if (isAllowSuffix) {
        // TODO 判断文件大小
        if (file.size / 1024 / 1024 > 100) {
          this.$message({
            message: '单个文件大小不能超过100M！',
            type: 'error',
            showClose: true
          })
          return false
        } else {
          this.uploadLoading = this.$loading({
            lock: true,
            text: '校验中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          return file
        }
      } else {
        this.$message({
          message: `不支持上传 ${suffixType}文件！`,
          type: 'error',
          showClose: true
        })
        return false
      }
    },
    //判断文件名长度，中文两个字符
    checkFileNameLength (file) {
      let tooLength = false
      // 判断文件名长度超长
      let fileArr = file.name.split('.')
      let suffix = fileArr[fileArr.length - 1]// 当前文件后缀名
      let fileName = file.name.substr(0, file.name.length - suffix.length - 1)// 当前文件名
      let temp = 0
      for (let i = 0; i < fileName.length; i++) {
        if (/[\u4e00-\u9fa5]/.test(fileName[i])) {
          temp += 2
        } else {
          temp++
        }
      }
      if (temp > 128) {
        this.$message({
          message: '文件名长度不可超过128个字符',
          type: 'warning',
          showClose: true
        })
        tooLength = true
      }
      return tooLength
    },
    listenKeyDown (event) {
      if (event.keyCode === 13) {
        event.preventDefault()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.projectDocumentUpload{
  width: 100%;
  background: white;
  .upload-info{
    .el-table{
      font-size: 14px;
      color: #333333;
      border: 1px solid #E8E8E8;
      /deep/ .el-table__header th{
        &:nth-child(1){
          border-right: 1px solid #E8E8E8;
        }
      }
      /deep/ .el-table__body{
        .first-column-style{
          border-right: 1px solid #E8E8E8;
          background: #F4F4F4 !important;
        }
      }
    }
  }
}
</style>
