<template>
  <div style="margin-bottom: 20px">
    <div v-for="(item, index) in resultFileListData" :key="index" class="results">
      <div class="results-header" style="margin-bottom: 20px">
        <el-tooltip :content="item.achievementName" :disabled="item.achievementName.length < 30">
          <span>{{item.achievementName}}</span>
        </el-tooltip>
        <div style="float:right">
          <el-button size="medium" class="openCollapse" @click="changeStatus(index)">
            {{item.showStatus ? '收起' : '展开'}}
            <i
              :class="item.showStatus ? 'el-icon-arrow-left' : 'el-icon-arrow-down'"
              style="color:#909399;margin-left:5px;"
            ></i>
          </el-button>
        </div>
      </div>
      <div class="result-content" v-if="item.showStatus">
        <el-form :inline="true" class="result-form">
          <el-form-item label="成果类型:">
            <span>{{item.achievementType}}</span>
          </el-form-item>
          <el-form-item label="成果负责人:">
            <span>{{item.responsiblePerson}}</span>
          </el-form-item>
          <el-form-item label="预期交付时间:">
            <span>{{item.expectedDeliveryTime?item.expectedDeliveryTime:''}}</span>
          </el-form-item>
        </el-form>
        <div class="result-table">
          <el-table :data="item.attachmentList" style="width: 100%">
            <el-table-column
              prop="fileName"
              label="文档名称"
              min-width="320"
              show-overflow-tooltip></el-table-column>
            <el-table-column
              prop="uploadDate"
              label="上传时间"
              width="160"
              show-overflow-tooltip></el-table-column>
            <el-table-column label="上传人" prop="uploadBy" show-overflow-tooltip></el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              min-width="150"
              align="center">
              <template slot-scope="scope">
                <div class="operation-box">
                  <div v-if="scope.row.fileName">
                    <el-button type="text" @click="downloadFile(scope.row)">下载</el-button>
                    <el-button type="text" @click="preview(scope.row)">预览</el-button>
                    <el-button
                      type="text"
                      style="color:red"
                      @click="deleteFile(item, scope.row)"
                      v-if="!isCloseVisible && (addFileStatus || userInfo.userAuth.uid === item.responsiblePersonUid)">删除</el-button>
                  </div>
                  <!-- :action="baseUrl + '/zuul/rms/project/use/file/v1/4/fileUpload'" -->
                  <div v-else>
                    <el-upload
                      class="upload-demo"
                      :action="baseUrl + '/zuul/rms/project/document/v1/4/fileUpload'"
                      accept=".pdf,.jpg,.jpeg,.png,.bmp,.tga,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rp,.html,.htm,.mht,.zip,.tz,.rar,.PDF,.JPG,.JPEG,.PNG,.BMP,.TGA,.DOC,.DOCX,.XLS,.XLSX,.PPT,.PPTX,.TXT,.RP,.HTML,.ZIP,.TZ,.RAR"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-upload="beforeUpload"
                      :on-exceed="handleExceed"
                      :show-file-list="false"
                      :on-error="uploadFailed"
                      :headers="uploadHeaders"
                      :on-success="(response, file, fileList) => {uploadSuccess (response, file, fileList, item)}"
                      :data="{projectCode,relatedAchievementCode: item.achievementCode}"
                      :file-list="fileList">
                      <!-- :on-success="handleAvatarSuccess" -->
                      <el-button type="text" v-if="!isCloseVisible && (addFileStatus || userInfo.userAuth.uid === item.responsiblePersonUid)">上传</el-button>
                    </el-upload>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div v-if="resultFileListData.length === 0" class="noFileData">
      暂无数据
    </div>
  </div>
</template>

<script>
import API from '@/serve/API_groupPlan.js'
import APIgroupPlan from '@/serve/API_groupPlanProject'
import fileAPI from '@/serve/API_project'
import Vue from 'vue'
import axios from 'axios'

import { getStore } from '@/store'

export default {
  name: 'resultFile',
  props: {
    showStatus: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      signInfo: {}, // 文件sign信息
      achievementTypes: [],
      newBase: getStore().getters['CONFIG/baseUrl'] + '/rms/pttmp',
      baseUrl: getStore().getters['CONFIG/baseUrl'], //下载请求url前缀
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      uploadHeaders: { Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization },
      userInfo: this.$store.getters['USERENTITY/userInfo'],
      resultFileListData: [],
      projectCode: this.$route.params.projectCode,
      fileList: [],
      addFileStatus: false,
      isCloseVisible: true,
      uploadLoading: null, //导入文件时出现的loading状态组件
      acceptSuffix: ['pdf', 'jpg', 'jpeg', 'png', 'bmp', 'tga', 'doc', 'docx',
        'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rp', 'html', 'htm', 'mht', 'zip', 'tz', 'rar',
        'PDF', 'JPG', 'JPEG', 'PNG', 'BMP', 'TGA', 'DOC', 'DOCX', 'XLS', 'XLSX',
        'PPT', 'PPTX', 'TXT', 'RP', 'HTML', 'ZIP', 'TZ', 'RAR' ] //可上传的文件类型
    }
  },
  methods: {
    // 获取详情信息(全部)
    getProjectInfo () {
      let interFaceName = ''
      if (this.$route.query.projectCategory === 'd') {
        interFaceName = 'queryEffectiveProjectInfoD'
      } else {
        interFaceName = 'queryEffectiveProjectInfoU'
      }
      // if (!interFaceName) return
      APIgroupPlan[interFaceName]({ projectCode: this.$route.params.projectCode })
        .then(res => {
          let status = res.projectBaseInfo.projectDetailsStatus
          this.isCloseVisible = status === '6' || status === '7' || status === '8'
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    handleAvatarSuccess (response, file, fileList) {
      this.resultFileList()//刷新成果列表
    },
    uploadFailed (e) {
      this.isEdit = false
      this.loading = false
      if (e.selfError) return
      if (e.message) {
        this.$message({
          message: e.message || '上传失败，请稍后重试！',
          type: 'error',
          showClose: true
        })
      }
    },
    uploadSuccess (response, file, fileList, item) { //{response, item}或者用解构赋值接受传过来的参数
      this.uploadLoading.close()
      if (response.code && response.code === '000000') {
        this.$message({
          message: '成果附件上传成功！',
          type: 'success',
          showClose: true
        })
        let params = {
          fileName: response.body.fileName,
          relatedAchievementCode: response.body.relatedAchievementCode,
          fileCode: response.body.fileCode,
          uploadBy: response.body.uploadBy,
          uploadDate: this.$formatDate(response.body.uploadDate, 'YYYY-MM-DD HH:mm:ss'),
          sign: response.body.sign,
          nonce: response.body.nonce,
          timeStamp: response.body.timeStamp
        }
        // item.attachmentList.splice(item.attachmentList.length - 1, 0, params) //上传成功之后把当前的文件名称-上传时间传到attachmentList中嫌憎回显新增的数据
        item.attachmentList.unshift(params) //上传成功之后把当前的文件名称-上传时间传到attachmentList中嫌憎回显新增的数据
        // this.resultFileList()//刷新成果列表
      } else {
        this.uploadFailed(response)
      }
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 上传文件控制处理
    beforeUpload (file, fileList) {
      if (file && file.name && file.name.length > 128) {
        this.$message({
          message: '文件名长度不可超过128个字符!',
          type: 'warning',
          showClose: true
        })
        return false
      }
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
    //成果附件列表
    resultFileList () {
      let params = {
        projectCode: this.$route.params.projectCode
      }
      API.resultFileList(params)
        .then(res => {
          this.addFileStatus = res.canAddProgress
          this.resultFileListData = res.achievementAttachmentlist
          this.resultFileListData.forEach((element, index) => {
            this.achievementTypes.forEach(typeOption => {
              if (element.achievementType === typeOption.valueCode) {
                element.achievementType = typeOption.name
              }
            })
            element.showStatus = true
            if (element.expectedDeliveryTime) {
              element.expectedDeliveryTime = this.$formatDate(element.expectedDeliveryTime, 'YYYY-MM-DD')
            }
            element.attachmentList.forEach(item => {
              // element.achievementsCode = item.achievementsCode
              item.uploadDate = this.$formatDate(item.uploadDate, 'YYYY-MM-DD HH:mm:ss')
            })
            // this.resultFileListData.forEach(item => {
            if (element.responsiblePersonUid === this.userInfo.userAuth.uid || this.addFileStatus) {
              element.attachmentList.push({ span: 1 })// 在attachmentList后边一直有一个空对象
            }
            // })
          })
        })
        .catch(() => {
        })
    },
    //删除成果附件 row是当行的对象
    deleteFile (item, row) {
      this.$confirm(' ', '此操作将永久删除该数据, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let params = {
            fileCode: row.fileCode,
            achievementCode: row.relatedAchievementCode
          }
          API.deleteFile(params)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              item.attachmentList.splice(item.attachmentList.indexOf(row), 1)
              // this.taskTableData.splice(this.taskTableData.indexOf(row), 1)
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.message
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // // 根据fileCode来查询sign信息
    // getFileDetail (code) {
    //   return fileAPI.fileDetail(code)
    //     .then(res => {
    //       this.signInfo = res
    //     })
    //     .catch(e => {
    //       this.loading = false
    //       if (e.selfError) return
    //       if (e.message) {
    //         this.$message({
    //           message: e.message || '获取文件sign信息失败，请稍后重试！',
    //           type: 'error',
    //           showClose: true
    //         })
    //       }
    //     })
    // },
    //下载文件
    async downloadFile (row) {
      // await this.getFileDetail(row.fileCode)
      // if (this.signInfo && this.signInfo.sign) {
      // let url = '?nonce=' + this.signInfo.nonce + '&sign=' + this.signInfo.sign + '&timeStamp=' + this.signInfo.timeStamp + '&fileCode=' + row.fileCode
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
      // } else {
      //   this.$message({
      //     message: '获取文件sign信息失败，请稍后重试！',
      //     type: 'error',
      //     showClose: true
      //   })
      // }
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
    changeStatus (index) {
      this.resultFileListData[index].showStatus = !this.resultFileListData[index].showStatus
      Vue.set(this.resultFileListData, index, this.resultFileListData[index])
    }
  },
  actived () {
    this.resultFileList() //成果附件列表
  },
  created () {
    this.getProjectInfo()
    API.dictValByCode('EXPECTED-RESULT-TYPE')
      .then(res => {
        this.achievementTypes = res
        this.resultFileList() //成果附件列表
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
.results {
    line-height: 22px;
    background: #fff;
    // width: 1180px;
    .results-header {
      height: 50px;
      border-bottom: 1px solid #d8d8d8;
      .el-button {
        border: 1px solid rgba(11,130,255,0.50);
        color: #0B82FF;
        border-radius: 2px;
        &.openCollapse {
          width: 84px;
          height: 30px;
          margin-right: 20px;
          font-size: 14px;
          margin-top: 11px;
          @include border();
          @include color();
        }
      }
      span {
        font-size: 16px;
        line-height: 22px;
        font-weight: 600;
        line-height: 50px;
        color: #333333;
        width:calc(100% - 165px);
        margin-left: 30px !important;
        display: inline-block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .result-content {
      margin-bottom: 20px;
      .result-form {
        // margin-left: 44px;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 70px;
        height: 70px;
        display: flex;
        justify-content: space-around;
        /deep/.el-form-item__label {
          vertical-align: baseline !important;
        }
        /deep/.el-form-item {
          margin-bottom: 0px !important;
          .el-form-item__content {
            line-height: 70px !important;
              // width: 220px;
          }
          &:nth-child(2) {
            margin-left: 90px;
          }
          &:nth-child(3) {
            margin-left: 90px;
          }
        }
      }
      .result-table {
        margin: 0 30px;
        padding-bottom: 30px;
        /deep/.el-table {
          width: 1118px;
          border-left: 1px solid #E8E8E8;
          border-right: 1px solid #E8E8E8;
          // -ms-flex: none !important;
          // flex: none !important;
          // height: max-content;
          .el-table__header {
              width: 100% !important;
              background: #f4f4f4
          }
          .el-table__body {
              width: 100% !important;
          }
        }
        .operation-box {
          text-align: center;
          // text-align: right;
          // padding-right: 28px;
          .el-buttomn {
          font-size: 14px;
          color: #20A0FF;
          letter-spacing: 0;
          line-height: 14px;
          }
          .upload-demo {
            margin-right: 5px
          }
        }
      }
    }
  }
  .noFileData {
    background: white;
    color: #999;
    height: 168px;
    line-height: 168px;
    text-align: center;
  }
</style>
