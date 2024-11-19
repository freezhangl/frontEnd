<template>
  <div class="allCommonFunc">
    <div class="moduleFunc" v-for="item in allFuncList" :key="item.resCode">
      <div class="header">{{item.resName}}</div>
      <div class="content">
        <div class="nodata" v-if="item.funcList && item.funcList.length===0">暂无数据！</div>
        <div
          v-else
          class="funcItem"
          v-for="func in item.funcList"
          :key="func.resCode"
          @click="gotoView(func)">
          <span class="funcIcon" :class="getImgUrl(func.functionIcon)"></span>
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
  </div>
</template>
<script>
import API from '../serve'
import images from '@lib/home/assets/imgPath'
// import { commomFunction } from '../serve/mockData'
import { mapGetters } from 'vuex'
import { isShowToolTip } from '@lib/common/util/common'
export default {
  name: 'allCommonFunc',
  data () {
    return {
      allFuncList: []
    }
  },
  computed: {
    ...mapGetters({
      menus: 'MENU/menus',
      curUserOrg: 'USERENTITY/curUserOrg'
    })
  },
  methods: {
    getData () {
      this.allFuncList = []
      this.menus.forEach(menu => {
        this.allFuncList.push(menu)
        this.getAllFunc(menu.resCode)
      })
    },
    getAllFunc (resCode) {
      let params = {
        parentResCode: resCode,
        recursion: true,
        resScope: '1',
        resType: '1',
        orgCode: this.curUserOrg.orgCode
      }
      API.getAllFunctionList(params)
        .then(res => {
          let funcList = res || []
          funcList.forEach(ele => {
            ele.showTooltip = isShowToolTip(ele.resName, 95)
          })
          this.allFuncList.some(ele => {
            if (ele.resCode === resCode) {
              this.$set(ele, 'funcList', funcList)
              return true
            }
          })
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '服务器异常，请稍后再试！',
            showClose: true,
            type: 'error'
          })
        })
    },
    getImgUrl (icon) {
      if (icon) {
        let arr = icon.split('/')
        let img = images[arr[arr.length - 1]] || ''
        let imgName = icon.split('.svg')[0] || ''
        return 'svgfont-' + imgName
      }
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
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.allCommonFunc{
  .moduleFunc{
    border: $color-border-normal;
    border-radius: 4px;
    margin-bottom: 10px;
    .header{
      height: 45px;
      line-height: 45px;
      padding: 0 25px;
      background: $color-background-normal;
      font-size: 16px;
      color: $color-text-normal;
      font-weight: bold;
    }
    .content{
      display: flex;
      flex-wrap: wrap;
      padding: 0 30px 30px;
      align-content: space-between;
      background: #fff;
      min-height: 107px;
      .nodata{
        width: 100%;
        text-align: left;
        height: 107px;
        line-height: 107px;
      }
      .funcItem{
        width: 95px;
        height: 77px;
        text-align: center;
        margin-top: 30px;
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
        p{
          height: 33px;
          line-height: 33px;
          padding: 0;
          margin: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
