<template>
  <div class="upload__wrap" :class="`upload__wrap--${size}`" style="margin-left: 10px;padding-top: 10px;">
    <div
      class="files"
      v-for="img in existsImgs"
      :key="img.id"
      :style="`width:${thumbWidth}px;height: ${thumbHeight}px;line-height: 1;margin-left:10px; word-wrap: break-word !important;
        word-break: normal !important;
        white-space: pre-wrap !important;`"
    >
      <template
      >
        {{ img.filename }}
        <div class="btn__wraps">
          <div class="btn__innerwraps">
            <a-icon
              class="icon__btn"
              type="eye"
              @click="show3dModal(img)"
            />
            <a-popconfirm v-if="!disabled" placement="topRight" title="确认删除？" @confirm="() => deleteImg(img.id, img.type)">
              <a-icon class="icon__btn" type="delete" />
            </a-popconfirm>
          </div>
        </div>
      </template>
    </div>
    <a-upload
      id="uploadEle"
      name="upload"
      :list-type="listType"
      :file-list="fileList"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :customRequest="customRequest"
      :class="uiSlot.class"
      v-if="!disabled"
    >
      <div v-if="existsImgs.length < maxPicsLength">
        <template v-if="Object.keys(uiSlot).length < 1">
          <div class="uploadcon">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              上传附件
            </div>
          </div>
        </template>
        <slot v-else name="uiSlot"></slot>
      </div>
    </a-upload>
    <previewFormUrl ref="previewFormUrl"></previewFormUrl>
  </div>
</template>
<script>
// import { sysFileInfoPage, sysFileInfoDelete, sysFileInfoPartUpload, sysFileInfoDownload } from '@/api/modular/system/fileManage'
import { sysFileInfoPartUpload } from '@/api/modular/system/fileManage'
import previewFormUrl from '@/views/system/file/previewFormUrl.vue'
import Preview3dModel from '@/views/system/file/preview3dmodel.vue'
import { handleImg } from '@/utils/util'
// import SparkMD5 from 'spark-md5'
import { SUCCESS, SERVICE_ERROR, UPLOADING } from '@/assets/js/responseCode'
import { getListData1 } from '@/api/cwApi/index'
import {
  ThreeModelType,
  VideoType,
  VideoFormatType,
  handlefileTypeClassifyByType,
  handlefileTypeClassifyBySuffix,
  pictureFormatType
} from '@/assets/js/const'
const SIZEUNIT = 1 * 1024 * 1024
export default {
  components: {
    previewFormUrl,
    Preview3dModel
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isCloseUpload: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    format: {
      type: String,
      default: 'image/gif, image/jpeg, image/png, image/jpg'
    },
    listType: {
      type: String,
      default: 'text'
    },
    maxPicsLength: {
      type: Number,
      default: 9
    },
    uploadText: {
      type: String,
      default: '上传'
    },
    existsImgs: {
      type: Array,
      default() {
        return []
      }
    },
    maxSize: {
      type: Number,
      default: 20
    },
    multiple: {
      type: Boolean,
      default: false
    },
    mixedConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    uiSlot: {
      type: Object,
      default() {
        return {}
      }
    },
    fileSize: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      pictureType: ['.jpeg', '.jpg', '.png', '.gif'],
      threedType: ThreeModelType,
      VideoType,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      // loading: false,
      is3dModelShow: false,
      preview3dModel: [],
      // 上传中的文件列表，主要用于判断文件上传数量限制
      tempImgArr: [],
      isStopUpload: false
    }
  },
  computed: {
    thumbWidth() {
      return Object.keys(this.fileSize).length > 0 ? this.fileSize?.width : 104
    },
    thumbHeight() {
      return Object.keys(this.fileSize).length > 0 ? this.fileSize?.height : 104
    }
  },
  create() {
    this.timer = null
    console.log('this', this)
  },
  watch: {
    isCloseUpload: {
      handler(newval) {
        if (newval) {
          this.$set(this, 'tempImgArr', [])
          this.$emit('imgUploadingStatus', 0)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleImg,
    closeModal() {
      this.is3dModelShow = false
    },
    handleType(filetType) {
      return filetType.indexOf('.') > -1 ? filetType.toLowerCase() : '.' + filetType.toLowerCase()
    },
    beforeUpload(file, fileList) {
      return new Promise((resolve, reject) => {
        console.log('file', file)
        let type = file.type
        if (!type) {
          type = '.' + file.name.split('.').pop()
        }
        // const isFormatFiles = this.format
        //   .replace(/\s*/g, '')
        //   .split(',')
        //   .includes(type)
        // console.log('isFormatFiles', this.format.replace(/\s*/g, '').split(','), type)
        // if (!isFormatFiles) {
        //   this.$message.error(`只支持以下${this.format}格式！`)
        //   return reject(new Error(`只支持以下${this.format}格式！`))
        // }
        if (Object.keys(this.mixedConfig).length < 1) {
          const maxSizeLimit = this.threedType.includes(type) ? 100 : 20
          const isLtMaxSize = file.size / SIZEUNIT < maxSizeLimit
          if (!isLtMaxSize) {
            this.$message.error(`文件须小于${maxSizeLimit}MB!`)
            return reject(new Error(`文件须小于${maxSizeLimit}MB!`))
          }
        } else {
          let maxSizeLimit
          let maxLength = 0
          let toastTips = ''
          if (pictureFormatType.includes(type)) {
            maxSizeLimit = this.mixedConfig.img.maxSizeLimit || this.maxPicsLength
            maxLength = this.mixedConfig.img.maxLength || this.maxLength
            toastTips = '图片'
          } else if (VideoFormatType.includes(type)) {
            maxSizeLimit = this.mixedConfig.video.maxSizeLimit || 50
            maxLength = this.mixedConfig.video.maxLength || this.maxPicsLength
            toastTips = '视频'
          } else if (this.threedType.includes(type)) {
            maxSizeLimit = this.mixedConfig.threedType.maxSizeLimit || 100
            maxLength = this.mixedConfig.threedType.maxLength || this.maxPicsLength
            toastTips = '3D文件'
          } else {
            toastTips = '文件'
            maxSizeLimit = this.maxSize
            maxLength = this.maxPicsLength
          }
          const isLtMaxSize = file.size / SIZEUNIT < maxSizeLimit
          if (!isLtMaxSize) {
            this.$message.error(`${toastTips}须小于${maxSizeLimit}MB!`)
            return reject(new Error(`${toastTips}须小于${maxSizeLimit}MB!`))
          }
          // 不同类型数量限制校验
          // handleType(img.fileSuffix)
          // VideoType.includes(handleType(img.fileSuffix))
          const currenTypeFilesTypes = handlefileTypeClassifyByType(type)
          const existFileCount = this.existsImgs
            .map(item => {
              return handlefileTypeClassifyBySuffix(item.fileSuffix)
            })
            .filter(item => item === currenTypeFilesTypes).length
          const tempFileCount = this.tempImgArr
            .map(item => {
              return handlefileTypeClassifyByType(item.type)
            })
            .filter(item => item === currenTypeFilesTypes).length

          console.log('currenTypeFilesTypes:', this.existsImgs, this.tempImgArr, currenTypeFilesTypes, type, maxLength)
          if (existFileCount + tempFileCount >= maxLength) {
            if (this.timer) {
              clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
              this.$message.error(`最多只能上传${maxLength}份${toastTips}！`)
            }, 300)
            return reject(new Error(`最多只能上传${maxLength}份${toastTips}！`))
          }
        }

        // 是否上传图片超过最大限度
        if (this.existsImgs.length + this.tempImgArr.length >= this.maxPicsLength) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.$message.error(`最多只能上传${this.maxPicsLength}张！`)
          }, 300)
          return reject(new Error(`最多只能上传${this.maxPicsLength}张！`))
        }
        this.isStopUpload = false
        this.$set(this, 'tempImgArr', [...this.tempImgArr, { uid: file.uid, type: file.type }])
        this.$emit('imgUploadingStatus', this.tempImgArr.length)
        this.$emit('resetUploadStatus')
        resolve(true)
      })
      // return isFormatFiles && isLt2M
    },
    show3dModal(obj) {
      // this.preview3dModel = [obj]
      // this.is3dModelShow = true
      console.log(obj, '啊啊换行符')
      if (obj.fileSuffix === '.jpg' || obj.fileSuffix === '.jpeg' || obj.fileSuffix === '.png' || obj.fileSuffix === '.gif') {
        this.preview(obj)
      } else {
        this.$message.error(`该格式暂不支持预览！`)
      }
    },
    preview(obj) {
      this.$refs.previewFormUrl.preview(obj)
    },
    deleteImg(id, type) {
      this.$emit('deletePic', id, type)
    },
    /**
     * 上传文件
     */
    customRequest(data) {
      console.log('customRequest1', data)
      const fileType = '.' + data.file.name.split('.').pop()
      const newFormData = new FormData()
      newFormData.append('files', data.file)
      newFormData.append('uid', data.file.uid)
      newFormData.append('download', true)
      newFormData.append('filename', data.file.name)
      this.finalUploadFn(newFormData, fileType, data)
    },
    finalUploadFn(formData, fileType, data, wholeFileMd5) {
      console.log(formData, 'fd辅导费刚刚')
      // newFormData.set('file', data.file)
        // sysFileInfoPartUpload(newFormData)
        getListData1('/admin/erp/files/upload', 'POST', formData)
          .then(res => {
            // this.loading = false
            if (res.code === '0000') {
              console.log('finalUploadFn', formData, fileType, data, wholeFileMd5)
              this.$emit('getNewPics', {
                id: res.data[0].fileId,
                fileSuffix: fileType,
                filename: res.data[0].filename,
                fileurl: res.data[0].url
              })
              const newTempImgArr = this.tempImgArr.filter(item => item.uid !== data.file.uid)
              this.$set(this, 'tempImgArr', newTempImgArr)
              this.$emit('imgUploadingStatus', newTempImgArr.length)
              // this.$refs.table.refresh()
            } else if (res.code !== '0000') {
              // 上传失败，从占位图中移除一个
              const newTempImgArr = this.tempImgArr
              newTempImgArr.pop()
              this.$set(this, 'tempImgArr', newTempImgArr)
              this.$emit('imgUploadingStatus', newTempImgArr.length)
              if (this.timer) {
                clearTimeout(this.timer)
              }
              this.timer = setTimeout(() => {
                this.$message.error('上传失败！' + res.message)
              }, 300)
            }
          })
          .catch(e => {
            const newTempImgArr = this.tempImgArr
            newTempImgArr.pop()
            this.$set(this, 'tempImgArr', newTempImgArr)
            this.$emit('imgUploadingStatus', newTempImgArr.length)
            console.log('error', e)
            // this.loading = false
            // this.tempImgArr.length && this.$message.error('上传失败，请重新上传')
          })
          .finally(p => {
            console.log('sysFileInfoPartUpload', p)
            // this.loading = false
          })
    },
    clearTimer() {
      clearTimeout(this.timer)
      this.$set(this, 'tempImgArr', [])
      this.$emit('imgUploadingStatus', 0)
      this.isStopUpload = true
    }
  },
  beforeDestoryed() {
    this.clearTimer()
  }
}
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  margin-left: 8px;
  color: #666;
}
</style>
<style lang="less" scoped>
.upload__wrap {
.uploadcon{
    display: flex;
    width: 104px;
    height: 104px;
    margin-right: 8px;
    margin-bottom: 8px;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    flex-direction: column;
}
  display: -webkit-inline-box;
  display: -moz-inline-box;
  display: inline-box;
  flex-wrap: wrap;
  .ant-upload-picture-card-wrapper {
    width: auto;
  }
  .files {
    position: relative;
    width: 104px;
    height: 104px;
    margin-right: 10px;
    margin-bottom: 10px;
    .btn__wraps {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s linear;
      z-index: -1;
      .btn__innerwraps {
        display: flex;
        .icon__btn {
          margin-right: 10px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0);
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    &:hover {
      .btn__wraps {
        background: rgba(0, 0, 0, 0.5);
        transition: all 0.3s linear;
        z-index: 1;
        .btn__innerwraps {
          .icon__btn {
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
    }
  }
  .tempimg__placeholder {
    width: 104px;
    height: 104px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #dadada;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
