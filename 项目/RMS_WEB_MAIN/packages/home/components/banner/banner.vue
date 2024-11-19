<template>
  <el-carousel
    trigger="click"
    width="1180px"
    height="140px"
    arrow="never">
    <el-carousel-item v-for="(item, index) in imgList" :key="index">
      <img
        @click="jump(item.url, item.jumpType)"
        :src="item.imageSrc"
        alt="">
    </el-carousel-item>
  </el-carousel>
</template>
<script>
//import { getStore } from '@/store'
import store from '@/store'
import axios from 'axios'
import API from '../../serve/index'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'banner',
  data () {
    return {
      baseUrl: store.getters['CONFIG/baseUrl'],
      Authorization: store.getters['USERENTITY/authHeaher'].Authorization,
      imgList: [
        // {
        //   imgUrl: require('../../assets/image/home1.png'),
        //   url: '/systemFunction/userAuth/roleManageList',
        //   jumpType: 'inside'
        // },
        // {
        //   imgUrl: require('../../assets/image/home1.png'),
        //   url: 'http://www.baidu.com',
        //   jumpType: 'exterior'
        // },
        // {
        //   imgUrl: require('../../assets/image/home1.png'),
        //   url: '/systemFunction/userAuth/roleManageList',
        //   jumpType: 'inside'
        // }
      ],
      defaultImg: require('../../assets/image/home1.png')
    }
  },
  computed: {
    ...mapGetters({
      bannerImageFile: 'HOME/bannerImageFile'
    })
  },
  mounted () {
    this.getBannerList()
  },
  methods: {
    ...mapMutations({
      setBannerImageFile: 'HOME/setBannerImageFile'
    }),
    //跳转方法
    jump (url, type) {
      //return false
      if (type === 'exterior') {
        window.open(url, '_blank')
      } else if (type === 'inside') {
        this.$router.push({ path: url })
      } else {
        return false
      }
    },
    getBannerList () {
      const params = {}
      const rule = /(^http:\/\/|^https:\/\/)/
      let reLoadImageFlag = false
      params.enable = 1
      //如果没有缓存到vuex中，则需要重新加载
      if (this.bannerImageFile.length === 0) {
        reLoadImageFlag = true
      } else { //数据缓存到vuex中，但是存在加载失败的情况，也需要重新加载
        reLoadImageFlag = this.bannerImageFile.some((banneritem) => {
          return banneritem.imageSrc === ''
        })
      }
      // debugger
      if (reLoadImageFlag) {
        //调用查询接口
        API.getBannerList(params)
          .then(res => {
            if (res) {
              if (res && res.length > 0) {
                this.imgList = res
                this.imgList.forEach(element => {
                  if (element.url !== null && element.url !== '') {
                    if (rule.test(element.url)) {
                      this.$set(element, 'jumpType', 'exterior')
                    } else {
                      this.$set(element, 'jumpType', 'inside')
                    }
                  } else {
                    this.$set(element, 'jumpType', '')
                  }
                  this.$set(element, 'imageSrc', '')
                  this.downloadFile(element)
                })
              }
              this.setBannerImageFile(this.imgList)
            }
          })
      } else {
        this.imgList = this.bannerImageFile
      }
    },
    // 下载文件
    downloadFile (bannerImage) {
    //this.downLoading = true
      axios.request({
      //url: this.baseUrl + '/rms/file/file/v1/5/file/' + (bannerImage.bannerCode),
        url: this.baseUrl + '/rms/file/ext/file/v1/5/v1/file',
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        method: 'get',
        responseType: 'blob',
        params: { fileCode: bannerImage.bannerCode,
          nonce: bannerImage.nonce,
          sign: bannerImage.sign,
          timeStamp: bannerImage.timeStamp }
      })
        .then((res) => {
        //debugger
          if (res && res.data && res.data.size) {
            let blob = new Blob([res.data])
            bannerImage.imageSrc = URL.createObjectURL(blob)
            //console.log(this.imgList)
            //bannerImage.downLoading = false
          }
        })
        .catch(err => {
          this.downLoading = false
          if (!err.selfError) {
            this.$message({
              message: err.message || '获取图片失败!',
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
  .el-carousel__item img {
    width: 100%;
    height: 100%;
  }
  /deep/ .el-carousel__indicator--horizontal {
    padding: 0 18px 5px;
    &:hover button {
      opacity: 1;
    }
  }
  /deep/ .el-carousel__button {
    width: 6px;
    height: 6px;
    background: #606266;
    border-radius: 3px;
    opacity: 1;
  }
  /deep/ .el-carousel__indicator.is-active button {
    background: #D8D8D8;
  }
</style>
