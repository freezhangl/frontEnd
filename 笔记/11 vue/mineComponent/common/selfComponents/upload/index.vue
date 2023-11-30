<template>
  <div class="sp-upload">
    <el-upload
      ref='spUpload'
      :action="uploadUrl"
      :headers="uploadHeaders"
      :file-list='fileList'
      :accept='accept'
      :limit='limit'
      name='file'
      :disabled="disabled"
      :on-exceed="handleExceed"
      :data="attachData"
      :show-file-list="false"
      :before-upload='beforeUpload'
      :on-success="successUpload"
      :on-progress="handleProcess"
      :on-error="handleError"
      :auto-upload='autoUpload'
      :on-change='changeFileList'>
      <el-button :disabled="disabled" class="normal-btn">{{btntext}}</el-button>
      <div  slot="tip" class="tip">{{tiptext}}</div>
    </el-upload>
    <div class="file-list">
      <ul>
        <li v-for="(file,index) in fileList" :key="index">
          <div>
            <span class="file-name">
              <img src="@/controller/assets/image/paperClip.png" alt="" />
              <el-tooltip
                v-if="file.isShowToolTip"
                :content="file.name"
                placement="top-start"
                effect="dark">
                <span>{{file.name}}</span>
              </el-tooltip>
              <span v-else>{{file.name}}</span>
              <img class="previewimg" :src="file.previewUrl" alt="">
            </span>
            <span class="opt-button" v-if="!disabled">
              <img class="colse" src="@/controller/assets/image/close.png" :disabled="file.status==='uploading' || file.status==='ready'" alt=""  @click="deleteFile(file)"/>
            </span>
          </div>
          <el-progress
            v-if="file.status!=='success'"
            :percentage="file.percent"
            :show-text="false"
            :stroke-width="2"
            :status="file.status === 'fail' ? 'exception' : null"></el-progress>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { isShowToolTip } from '@lib/common/util/common'
import store from '@/store'
export default {
  props: {
    fileListData: { type: Array, default: () => [] },
    tiptext: { type: String, default: '支持 jpg png 图片,大小 10M 以内' },
    btntext: { type: String, default: '上传文件' },
    limit: { type: [Number, String], default: 1 },
    uploadUrlp: { type: String, default: '/file/upload' },
    autoUpload: { type: Boolean, default: true },
    attachData: { default: () => {} },
    accept: { type: String, default: '.png,.jpg,jpeg,.JPG,.JPEG,.PNG' },
    disabled: { type: Boolean, default: false }
  },
  name: 'SelfUpload',
  data() {
    return {
      fileList: [],
      uploadUrl: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API + this.uploadUrlp : '/api' + process.env.VUE_APP_BASE_API + this.uploadUrlp,
      canUpload: true,
      totalFileSize: 0,
      uploadLoading: null, //导入文件时出现的loading状态组件
      uploadHeaders: { 'token': store.getters.getToken }
    }
  },
  watch: {
    fileListData: {
      immediate: true,
      handler (newValue, oldValue) {
        if (newValue) {
          this.fileList = [...this.fileListData]
          this.fileList.forEach(file => {
            file.status = 'success'
            file.isShowToolTip = isShowToolTip(file.fileName, 380)
            if (!file.entry) {
              file.previewUrl = this.creatUrl(file)
            } else {
              file.previewUrl = file.url
            }
          })
        }
      }
    }
  },
  methods: {
    //上传失败
    handleError (errInfo, file, fileList) {
      this.fileList.forEach(item => {
        if (item.uid === file.uid) {
          this.uploadLoading.close()
          // console.log(errInfo)
          this.fileList.some((item, index) => {
            if (item.uid === file.uid) {
              this.fileList.splice(index, 1)
            }
          })
          this.msgError('文件上传失败!')
        }
      })
    },
    //上传中
    handleProcess (event, file, fileList) {
      this.fileList.forEach(item => {
        if (item.uid === file.uid) {
          this.$set(item, 'percent', event.percent)
        }
      })
    },
    //上传成功
    successUpload (response, file, fileList) {
      if (response && response.code === '200') {
        this.uploadLoading.close()
        fileList.forEach(item => {
          if (item.uid === file.uid) {
            this.$set(item, 'fileId', response.data.id)
            this.$set(item, 'fileUrl', response.data.fileUrl)
          }
        })
        this.$emit('change', fileList)
      } else {
        this.uploadLoading.close()
        this.fileList.some((item, index) => {
          if (item.uid === file.uid) {
            this.fileList.splice(index, 1)
          }
        })
        this.msgError(response.message || '上传失败，请稍后重试！')
      }
    },
    //超出文件最大上传数
    handleExceed (files, fileList) {
      if (files.length > this.limit) {
        this.msgWarn(`当前限制选择${this.limit}个文件！`)
      } else {
        if (this.judgeMessage(['附件上传数量已达上限！']) === 0) {
          this.msgWarn('附件上传数量已达上限！')
        }
      }
    },
    //判断页面中的message个数
    judgeMessage (mesArr = []) {
      let mesList = document.getElementsByClassName('el-message')
      let num = 0
      mesList.forEach(element => {
        let msg = element.innerText
        if (mesArr.indexOf(msg) > -1) {
          num++
        }
      })
      return num
    },
    deleteFile(file) {
      this.$confirm(' ', '确定要删除此附件吗？', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.updateFileList(file)
        })
        .catch(() => {})
    },
    //删除文件
    updateFileList (file) {
      let num = -1
      this.fileList.forEach((item, index) => {
        if (file.uid === item.uid) {
          num = index
        }
      })
      if (num > -1) {
        this.fileList.splice(num, 1)
      }
      this.$emit('change', this.fileList)
    },
    beforeUpload () {
      if (!this.canUpload) {
        return false
      }
    },
    changeFileList (file, fileList) {
      // 校检文件大小
      const isLt = file.size / 1024 / 1024 <= 10
      if (!isLt) {
        this.msgWarn(`单个文件大小不能超过10MB!`)
        this.canUpload = false
        return
      }
      if (file.status === 'fail') { //fail 上传失败，不改变文件列表，只更新状态
        this.fileList.forEach(ele => {
          if (file.uid === ele.uid) {
            this.totalFileSize = this.totalFileSize - file.size
            ele = Object.assign({}, file)
          }
        })
      } else {
        if (file.status === 'ready' && this.fileList.length === this.limit) {
          if (this.judgeMessage(['附件上传数量已达上限！']) === 0) {
            this.msgWarn('附件上传数量已达上限！')
          }
          this.canUpload = false
          return
        }
        if (file.status === 'ready') { //选取文件，进度默认0，新增到list
          this.$set(file, 'percent', 0)
          file.isShowToolTip = isShowToolTip(file.fileName, 380)
          this.fileList.push(file)
          this.canUpload = !this.checkFileSize(file) && !this.checkFileNameLength(file)
          if (!this.canUpload) { return }
          this.uploadLoading = this.$loading({
            body: true,
            fullscreen: true,
            lock: true,
            text: 'loading……',
            spinner: 'dots-loader',
            background: 'rgba(0, 0, 0, 0.5)'
          })
        }
        this.fileList.forEach(_file => {
          if (file.status === 'success' && file.uid === _file.uid) { //上传成功更新list中的数据
            _file = file
          }
        })
      }
    },
    //判断文件名长度，中文两个字符
    checkFileNameLength (file) {
      let tooLength = false
      let fileName = file.name.split('.')[0]
      if (fileName.length > 10) {
        let temp = [...this.fileList]
        temp.forEach((ele, index) => {
          if (file.uid === ele.uid) {
            this.fileList.splice(index, 1)
          }
        })
        this.msgWarn('附件名长度不能超过10个字符串！')
        tooLength = true
      }
      return tooLength
    },
    //检查文件总大小是否超出100M
    checkFileSize (file) {
      let warning = false
      let temp = [...this.fileList]
      this.totalFileSize = 0
      temp.forEach((element, index) => {
        let totalSize = parseInt(element.size) + this.totalFileSize
        let isTotalExceed = totalSize / 1024 / 1024 > 100
        if (isTotalExceed) {
          warning = true
          this.fileList.splice(index, 1)//从文件列表移除
        } else {
          this.totalFileSize = totalSize //增加文件总大小
        }
      })
      if (warning && this.judgeMessage(['附件总大小不能超过100M！']) === 0) {
        this.msgWarn('附件总大小不能超过100M！')
      }
      return warning
    },
    creatUrl(file) {
      let url = ''
      if (window.createObjcectURL !== undefined) {
        url = window.createObjcectURL(file.raw)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file.raw)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file.raw)
      }
      return url
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-upload{
  .file-list{
        ul{
          margin: 0;
          padding: 0;
        }
        li{
          >div{
            display: flex;
            align-items: center;
          }
          i{
            margin-right: 6px;
          }
          width: 100%;
          line-height: 22px;
          margin-top: 6px;
          color: #666666;
          .file-name{
            height: 30px;
            background: rgba(0,0,0,0.04);
            display: flex;
            align-items: center;
            flex: 1;
            vertical-align: middle;
            // overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            cursor: pointer;
            position: relative;
            cursor:default;
            &:hover{
              .previewimg{
                display: inline-block;
              }
            }
            .previewimg{
              z-index: 10000;
              max-width: 400px;
              height: auto;
              position: absolute;
              left: 1px;
              top: 40px;
              display: none;
            }
            &:focus{
              outline:0;
            }
          }
          .opt-button{
            display: inline-block;
            margin-left: 10px;
            .colse{
              cursor: pointer;
              display: block;
              width: 24px;
              height: 24px;
            }
          }
          .el-progress {
             width: calc(100% - 34px);
            .el-progress__text{
              margin-left:0px;
            }
          }
        }
      }
  .tip{
    color: rgba(0,0,0,0.45);
    margin-left: 5px;
    font-size: 14px;
    line-height: 14px;
  }
}
</style>
