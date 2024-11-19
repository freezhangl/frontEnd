<template>
  <div class="commonFuction">
    <div class="header">
      <span class="title">常用功能</span>
      <span class="more" @click="viewMore">更多<i class="el-icon-arrow-right"></i></span>
    </div>
    <div class="content">
      <div
        class="funcItem"
        v-for="(func,index) in funcData"
        :key="index"
        @click="editMyFunc">
        <img :src="getImgUrl(func.icon)" alt="">
        <p>{{func.name}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import images from '@lib/home/assets/imgPath'
export default {
  name: 'commonFunction',
  data () {
    return {
      funcData: [
        { icon: '../../assets/image/func1.png', name: '计划申请' },
        { icon: '../../assets/image/func1.png', name: '项目查询' },
        { icon: '../../assets/image/func1.png', name: '工时填报' },
        { icon: '../../assets/image/func1.png', name: '数据字典' },
        { icon: '../../assets/image/func1.png', name: '项目结算' },
        { icon: '../../assets/image/func1.png', name: '系统配置' },
        { icon: '../../assets/image/func1.png', name: '项目变更' },
        { icon: '../../assets/image/func1.png', name: '里程碑管理' },
        { icon: '../../assets/image/func1.png', name: '角色赋权' },
        { icon: '../../assets/image/func1.png', name: '添加功能' }
      ]
    }
  },
  methods: {
    getImgUrl (icon) {
      if (icon) {
        let arr = icon.split('/')
        let img = images[arr[arr.length - 1]] || ''
        return img
      }
    },
    viewMore () {
      this.$router.push({
        path: '/home/allCommonFunc'
      })
    },
    editMyFunc () {
      this.$emit('editMyFunc')
    }
  }
}
</script>
<style lang="scss" scoped>
.commonFuction{
  .header{
    height: 45px;
    line-height: 45px;
    background: $color-background-normal;
    padding: 0 20px;
    font-size: 16px;
    color: $color-text-normal;
    font-weight: bold;
    .more{
      float: right;
      cursor: pointer;
      font-weight: normal;
      font-size: 14px;
      color: #9D9D9D;
    }
    /deep/ .el-icon-arrow-right::before{
      font-size: 10px;
      padding-left: 3px
    }
    &::after{
      content: "";
      display: block;
      height: 0;
      clear:both;
      visibility: hidden;
    }
  }
  .content{
    display: flex;
    flex-wrap: wrap;
    margin: 27px 40px;
    height: 175px;
    align-content: space-between;
    .funcItem{
      width: 20%;
      height: 77px;
      text-align: center;
      font-weight: 700;
      &:nth-child(5),&:nth-child(9){
        margin-right: 0;
      }
      img{
        height: 44px;
      }
      /deep/ p{
        height: 33px;
        line-height: 33px;
        padding: 0;
        margin: 0;
        font-weight: 700;
      }
    }
  }
}
</style>
