<template>
  <div class="commonFuction">
    <div class="header">
      <span class="title">常用功能</span>
      <span class="more" @click="viewMore">更多<i class="el-icon-arrow-right"></i></span>
    </div>
    <div class="content">
      <div
        class="funcItem"
        :class="{pointer:func.resName==='添加功能'}"
        v-for="(func,index) in funcData"
        :key="index"
        @click="func.resName==='添加功能' ? clickItem(func.resName) : gotoView(func) ">
        <!-- <img :src="getImgUrl(func.functionIcon)" alt=""> -->
        <span class="funcIcon" :class="getImgUrl(func.icon)" v-if="func.icon !== 'addfunction.svg'"></span>
        <span v-else class="funcIcon add-function"><i class="el-icon-plus add-function-plus"></i></span>
        <el-tooltip
          v-if="func.showTooltip"
          :content="func.resName"
          placement="top"
          effect="dark">
          <p>{{func.resName}}</p>
        </el-tooltip>
        <p v-else>{{func.resName}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import images from '@lib/home/assets/imgPath'
// import { commomFunction } from '../../serve/mockData'
import API from '../../serve'
import { isShowToolTip } from '@lib/common/util/common'
import { mapGetters } from 'vuex'
export default {
  name: 'commonFunction',
  data () {
    return {
      funcData: []
    }
  },
  computed: {
    ...mapGetters({
      menus: 'MENU/menus'
    })
  },
  methods: {
    getImgUrl (icon) {
      if (icon) {
        let arr = icon.split('/')
        let img = images[arr[arr.length - 1]] || ''
        let imgName = icon.split('.svg')[0] || ''
        // console.log('svgfont-' + imgName)
        return 'svgfont-' + imgName
      }
    },
    viewMore () {
      this.$router.push({
        path: '/home/allCommonFunc'
      })
    },
    clickItem (resName) {
      if (resName === '添加功能') {
        this.editMyFunc()
      }
    },
    editMyFunc () {
      this.$emit('editMyFunc')
    },
    getMyFuncList () {
      // this.funcData = commomFunction.commomFuncList.slice(0, 9)
      // this.funcData.push({ functionIcon: 'addfunction.svg', resName: '添加功能' })
      this.funcData = []
      API.getCommonFunction()
        .then(res => {
          if (!res || res.length === 0) {
            /* this.$message({
              message: '我的常用功能配置不存在！',
              showClose: true,
              type: 'error'
            }) */
            this.funcData.push({ icon: 'addfunction.svg', resName: '添加功能' })
            return
          }
          res.forEach(ele => {
            ele.showTooltip = isShowToolTip(ele.resName, 95)
          })
          this.funcData = res.slice(0, 9)
          this.funcData.push({ icon: 'addfunction.svg', resName: '添加功能' })
        })
        .catch(e => {
          if (e.selfError) return
          this.funcData.push({ icon: 'addfunction.svg', resName: '添加功能' })
          this.$message({
            message: e.message || '服务器异常，请稍后再试！',
            showClose: true,
            type: 'error'
          })
        })
    },
    gotoView (item) {
      let path = ''
      let curMenu = []
      let leafMenu = []
      this.findItem(item, curMenu, this.menus)
      if (curMenu.length) {
        this.findFirstLeaf(curMenu[0], leafMenu)
      }
      if (leafMenu) {
        path = leafMenu[0].accessPath
        this.$router.push({
          path: path
        })
      }
    },
    //在树中查找某个节点
    findItem (node, saveNode, tree) {
      return tree.some(item => {
        if (item.resCode === node.resCode) {
          saveNode.push(item)
          return true
        }
        if (item.child && item.child.length > 0) {
          return this.findItem(node, saveNode, item.child)
        }
      })
    },
    //在树中查找某个父节点的第一个子节点的第一个叶子节点
    findFirstLeaf (node, leafNode) {
      if (!node.child || node.child.length === 0) {
        leafNode.push(node)
        return true
      }
      if (node.child && node.child.length > 0) {
        return node.child.some(item => {
          return this.findFirstLeaf(item, leafNode)
        })
      }
    }
  },
  mounted () {
    this.getMyFuncList()
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
    .title{
      color: #333333;
      font-weight: bold;
      font-size: 16px;
    }
    .more{
      float: right;
      cursor: pointer;
      font-weight: normal;
      font-size: 14px;
      color: #979797;
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
      cursor: pointer;
      img{
        width: 44px;
        height: 44px;
      }
      .funcIcon{
        display: inline-block;
        min-width: 44px;
        height: 44px;
        font-size: 44px;
        @include color();
      }
      .add-function {
        border: 4px solid #F4F4F4;
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        //margin-bottom: 4px;
        margin: 3px 0;
        .add-function-plus {
          font-size: 28px;
          font-weight: bold;
          position: absolute;
          left: 4px;
          top: 4px;
        }
      }
      p{
        color: $color-text-normal;
        height: 33px;
        line-height: 33px;
        padding: 0;
        margin: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 700;
      }
    }
  }
}
</style>
