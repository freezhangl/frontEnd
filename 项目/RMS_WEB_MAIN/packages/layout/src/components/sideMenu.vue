<template>
  <div class="unfold-menu-wrapper">
    <el-scrollbar class="scroll">
      <!-- 一级菜单 start -->
      <div class="side-menu" v-for="(item,index) in menu" :key="index">
        <div
          class="menu-title"
          :class="{isHide: !isShow && item.menuName!='首页',isActive:item.isActive}"
          @click="clickModule(item)">
          {{ item.menuName }}
        </div>

        <!-- 一级菜单 有子菜单 -->
        <el-menu
          v-if="item.child.length>0"
          background-color="#343B55"
          text-color="#ffffff"
          :collapse='!isShow'
          :collapse-transition="false"
          :default-openeds="defaultOpeneds"
          active-text-color="#FFFFFF">
          <!-- 二级菜单 start -->
          <div v-for="(secItem, secIndex) in item.child" :key="secIndex">
            <menu-button
              :menu="secItem"
              :root-menu="menu"
              :level="index+'-'+secIndex"
              @setRootMenu="setRootMenu"
              @activeMenuIndex="getOpened">
            </menu-button>
          </div>
        <!-- 二级菜单 end -->
        </el-menu>

      </div>
    <!-- 一级菜单 end -->
    </el-scrollbar>
  </div>
</template>

<script>
import MenuButton from './menuButton'
export default {
  name: 'sideMenu',
  components: { MenuButton },
  props: {
    menu: { type: Array, default: () => [] }, //左侧菜单列表
    isShow: { type: Boolean, default: true } //左侧菜单是否展开
  },
  data () {
    return {
      defaultOpeneds: [] // 当前打开的 sub-menu 的 index 的数组
    }
  },
  computed: {

  },
  methods: {
    // 点击 一级菜单
    clickModule (item) {
      // console.log('clickModule', item.menuName)
      if (item.child.length > 0) return
      let currentRoutePath = this.$route.fullPath
      if (currentRoutePath.indexOf(item.menuLink) === -1) {
        // this.traverseMenu(this.menu, item.menuLink)
        this.$router.push({
          path: item.menuLink
        })
      }
    },
    // 遍历所有菜单项（包括各级子菜单），设置状态的激活状态
    traverseMenu (obj, toPath) {
      obj.forEach(item => {
        if (item.child.length > 0) {
          this.traverseMenu(item.child, toPath)
        } else {
          if (toPath.indexOf(item.menuLink) !== -1) {
            this.$set(item, 'isActive', true)
          } else {
            this.$set(item, 'isActive', false)
          }
        }
      })
    },
    // 设置全局根目录
    setRootMenu (rootMenu) {
      this.menu = rootMenu
      // console.log('setRootMenu', this.menu)
    },
    getOpened (menuIndex) {
      if (!menuIndex) return
      let indexs = menuIndex.split('-')
      this.defaultOpeneds = []
      if (indexs.length === 2) {
        this.defaultOpeneds.push(indexs.join('-'))
      } else {
        this.getParentIndex(indexs)
      }
    },
    // 计算当前激活项所有需展开的上级菜单
    getParentIndex (arr) {
      if (arr.length > 2) {
        let newIndexs = arr.slice(0, arr.length - 1)
        this.defaultOpeneds.push(newIndexs.join('-'))
        this.getParentIndex(newIndexs)
      }
    }
  },
  mounted () {
    // console.log('$route', this.$route)
  }
}
</script>
<style lang="scss" scoped>
.unfold-menu-wrapper {
  /* 解决自定义滚动条 x 轴显示问题 */
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
    .scroll{
    height: 100%;
  }
  .side-menu{
    // padding-left: 20px;
    padding-top: 1px;
    .menu-title{
      height: 40px;
      line-height: 40px;
      text-align: left;
      color: #B2D6FF;
      font-size: 14px;
      padding-left: 20px;
      cursor: pointer;
      &.isHide{
        visibility: hidden;
      }
      &:hover,&.isActive{
        color: #ffffff;
        background: #0085D0 !important;
      }
    }
    .el-menu{
      border-right: solid 1px #343B55;
      &.el-menu--collapse{
        /deep/ .el-submenu__title{
          span,.el-submenu__icon-arrow{
            display: none;
          }
        }
      }
    }
  }
}
</style>
