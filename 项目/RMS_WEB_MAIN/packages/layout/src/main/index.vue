<template>
  <div class="layout-wrapper" @click="clickLayout">
    <el-container>
      <el-header height="50px">
        <top-header
          ref="topHeader"
          :top-menu="topMenuList"
          :organizations="organizations"
          :org-code="orgCode"
          @refreshAuth="getUserAuth">
        </top-header>
      </el-header>
      <el-container class="main-wrapper">
        <el-aside :style="isLeftMenuUnfold ? isWidth200 : isWidth60">
          <div class="fold-con">
            <!-- <img
              v-if="isLeftMenuUnfold"
              class="menu-fold"
              src="../../assets/image/icon-fold.svg"
              title="折叠菜单"
              @click="changeLeftMenuStatus">
            <img
              v-else
              class="menu-fold"
              src="../../assets/image/icon-unfold.svg"
              title="展开菜单"
              @click="changeLeftMenuStatus"> -->
            <span
              v-if="isLeftMenuUnfold"
              class="menu-fold svgfont-icon-fold"
              title="折叠菜单"
              @click="changeLeftMenuStatus"></span>
            <span
              v-else
              class="menu-fold svgfont-icon-unfold"
              title="折叠菜单"
              @click="changeLeftMenuStatus"></span>
          </div>
          <div class="menu-content">
            <el-scrollbar>
              <left-menu
                ref="leftMenu"
                :menu="menuList"
                :unfold="isLeftMenuUnfold"
                :openeds="openeds"
              ></left-menu>
            </el-scrollbar>
          </div>
          <div class="copyright" v-if="isLeftMenuUnfold">
            <img src="../../assets/image/foot-logo.svg">
            <!-- <div class="word">
              <span class="part">集中化研发管理系统</span>
              <span class="tel">4001381860 - 7</span>
            </div> -->
          </div>
          <!-- <span class="copyright" v-if="isLeftMenuUnfold">© 2020 中国移动集中化管理系统</span> -->
        </el-aside>
        <el-container>
          <el-header height="41px" v-show="isShowBreadcrumb">
            <div class="tabs">
              <tabs-view></tabs-view>
            </div>
          </el-header>
          <el-main>
            <el-scrollbar>
              <div class="main">
                <router-view></router-view>
              </div>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import API from '../../serve'
import TopHeader from '../components/topHeader'
import LeftMenu from '../components/leftMenu'
// import menuConfig from './localMenuConfig.js'
import store from '@/store'
import { mapGetters, mapMutations } from 'vuex'
import TabsView from '../components/tabsView'

export default {
  name: 'layout',
  components: { TopHeader, LeftMenu, TabsView },
  data () {
    return {
      topMenuList: [], //顶部频道栏渲染数据
      leftMenuList: [], //左部菜单栏显示数据
      isShowLeftContainer: false, //是否显示左边栏容器 true:显示，false不显示
      isLeftMenuUnfold: true, //是否距离左边栏220px的距离。菜单展开
      menuList: [], //左侧菜单列表（当前频道下的所有级别菜单）
      isWidth200: {
        'width': '200px'
      },
      isWidth60: {
        'width': '60px'
      },
      overflowHidden: {
        'overflow-y': 'hidden'
      },
      height: {
        'height': '100%'
      },
      organizations: [],
      orgCode: '',
      openeds: [] //默认左侧菜单展开的 index 的数组
    }
  },
  computed: {
    //是否显示path面包屑
    isShowBreadcrumb: function () {
      if (this.$route.meta.hasOwnProperty('breadTitle') && this.$route.meta.breadTitle) {
        return true
      }
      return false
    },
    hasRole: function () {
      return store.getters['USERENTITY/hasRole']
    },
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo',
      menus: 'MENU/menus'
    })
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'USERENTITY/setUserInfo',
      setUserAuth: 'USERENTITY/setUserAuth'
    }),
    /**
     * 改变左边栏状态样式
     */
    changeLeftMenuStatus () {
      this.isLeftMenuUnfold = !this.isLeftMenuUnfold
      // console.log('changeLeftMenuStatus', this.isLeftMenuUnfold)
    },
    // 获取用户的权限信息
    getUserAuth (changeOrg = false) {
      // API.getUserAuth(this.userInfo.loginName)
      API.getUserAuth()
        .then(res => {
          store.commit('USERENTITY/setUserAuth', res)
          // console.log('setUserAuth')
          this.organizations = res.organizations
          this.orgCode = res.orgCode
          // 设置当前菜单
          let rootMenu = [] // 服务器
          // res.menus = menuConfig //本地DEBUG
          if (res.menus && res.menus.length > 0) {
            rootMenu = this.getPCMenus(res.menus)
          }
          // let rootMenu = menuConfig[0].child //本地
          this.topMenuList = rootMenu
          // this.menuList = rootMenu
          if (changeOrg) {
            // location.reload()
            // console.log('changeOrg')
            if (this.$route.path !== '/home') {
              this.$router.push({ path: '/home' })
            } else {
              this.$router.go(0)
            }
          }
          // this.setCurChannel()
          // this.setRouteData()
        })
        .catch((e) => {
          // console.log(e)
          /* if (e.selfError) return
          if (this.menus) {
            let rootMenu = [] // 服务器缓存在本地的菜单
            if (this.menus.length > 0) {
              rootMenu = this.menus[0].child
            }
            // let rootMenu = menuConfig[0].child //本地
            this.topMenuList = []
            this.menuList = rootMenu
          } */
        })
    },
    /**
     * 获取PC菜单树
     */
    getPCMenus (menuData) {
      let pcMenuRoot = menuData.filter(ele => ele.resScope === '1') //PC端资源根节点
      let PCMenus = []
      if (pcMenuRoot && pcMenuRoot.length > 0 && pcMenuRoot[0].child && pcMenuRoot[0].child.length > 0) {
        PCMenus = pcMenuRoot[0].child
      }
      store.commit('MENU/setMenus', PCMenus)
      return PCMenus
    },
    /**
     * 设置当前菜单的资源编码
     */
    setRouteData () {
      if (this.menuList && this.menuList.length > 0) {
        this.menuList.forEach(element => {
          this.setResCode(element)
        })
      }
    },
    setResCode (menu) {
      let curPath = this.$route.path
      if (menu.accessPath === curPath) {
        this.$route.meta.resCode = menu.resCode
        store.commit('USERENTITY/setMenuResCode', menu.resCode)
      } else if (menu.child && menu.child.length > 0) {
        menu.child.forEach(element => {
          this.setResCode(element)
        })
      }
    },
    /**
     * 设置当前打开频道
     */
    setCurChannel () {
      let curPath = this.$route.path
      // console.log('setCurChannel', curPath)
      let curTopMenu = null
      if (this.$route.meta.hasPermission) {
        //未在资源管理页面里配置的菜单（即未在菜单列表里展示的菜单）
        this.topMenuList.some(topMenu => {
          if (curPath.indexOf(topMenu.accessPath) > -1) {
            curTopMenu = topMenu
            return true
          }
        })
      } else {
        this.topMenuList.some(topMenu => {
          let flag = this.getRouteChannel(topMenu, curPath)
          if (flag) {
            curTopMenu = topMenu
            return true
          }
        })
      }
      //设置频道的激活状态
      this.topMenuList.forEach(ele => {
        if (curTopMenu && curTopMenu.resCode === ele.resCode) {
          this.$set(ele, 'isActived', true)
          this.menuList = ele.child || []
        } else {
          this.$set(ele, 'isActived', false)
        }
      })
      //当前菜单展开节点
      this.setOpendMenu()
    },
    //遍历查询当前频道
    getRouteChannel (menu, path) {
      if (menu.accessPath === path) {
        return true
      } else if (menu.child && menu.child.length > 0) {
        let outFlag = menu.child.some(ele => {
          return this.getRouteChannel(ele, path)
        })
        if (outFlag) return true
      }
    },
    /**
     * 设置当前应展开的菜单
     */
    setOpendMenu () {
      if (this.$route.meta.isChannelHome) {
        //频道首页的页面，将收起左侧菜单所有的节点
        this.openeds = []
      }
      if (this.$route.meta.replaceTab) {
        //覆盖父标签页的子页面，展开其所有的父级
        this.openeds = []
        let parentPath = this.$route.meta.parentPath
        this.menuList.some(ele => {
          if (this.getParentPath(ele, parentPath)) {
            return true
          }
        })
      } else {
        //覆盖父标签页的子页面，展开当前路由所有的父级
        this.openeds = []
        this.menuList.some(ele => {
          if (this.getParentPath(ele, this.$route.path)) {
            return true
          }
        })
      }
    },
    //遍历左侧菜单，查找当前应展开的节点
    getParentPath (menu, parentPath) {
      if (menu.accessPath === parentPath) {
        this.openeds.push(menu.accessPath)
        return true
      } else if (menu.child && menu.child.length > 0) {
        let outFlag = menu.child.some(ele1 => {
          let flag = this.getParentPath(ele1, parentPath)
          if (flag) {
            this.openeds.push(ele1.accessPath)
            return true
          }
        })
        if (outFlag) {
          this.openeds.push(menu.accessPath)
          return true
        }
      }
      return false
    },
    clickLayout (event) {
      if (this.$refs.topHeader) {
        this.$refs['topHeader'].clickedDom(event)
      }
    }
  },
  watch: {
    $route (route) {
      this.setCurChannel()
      this.setRouteData()
    }
  },
  beforeMount () {
    /* let LeftMenuStatus = sessionStorage.getItem('LeftMenuStatus')
    if (LeftMenuStatus === null) {
      sessionStorage.setItem('LeftMenuStatus', 'open')
    } */
  },
  created () {
    this.organizations = this.userInfo.userAuth.organizations
    this.orgCode = this.userInfo.userAuth.orgCode
    this.topMenuList = this.menus
    this.setCurChannel()
    this.setRouteData()
    // console.log('页面created')
    // this.getUserAuth()
  },
  mounted () {
    // console.log('页面mounted')
  }
}
</script>
<style lang="scss" scoped>
.layout-wrapper {
  background: #f6f6f6;
  height: 100%;
  min-width: 1180px;
  /deep/.el-container {
    height: 100%;
    &.main-wrapper{
      height: calc(100vh - 50px);
      .menu-fold{
        font-size: 13px;
      }
    }
    overflow-y: hidden;
    aside{
      position: relative;
      background: #f6f6f6;
      box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      .fold-con{
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
      }
      .copyright{
        width: 200px;
        color: #0085D0;
        text-align: center;
        left: 0;
        // bottom: 20px;
        position: absolute;
        display: flex;
        img{
          width: 170px;
          height: 58px;
          margin-left: 8px;
        }
        .word{
          width: 110px;
          margin-left: 2px;
          position: relative;
        }
        span{
          display: inline-block;
          position: absolute;
          width: 120px;
          font-size: 12px;
          line-height: 13px;
          -webkit-transform-origin-x: 0;
          transform: scale(0.88);
          -moz-transform: scale(0.88);
          -webkit-transform: scale(0.88);
          text-align: left;
          left: 0;
          &.part{
            top: 0;
          }
          &.tel{
            top: 14px;
          }
        }
      }
      /*/deep/ .el-scrollbar {*/
      /*  height: calc(100% - 100px);*/
      /*}*/
      .menu-content {
        height: calc(100% - 100px);
        /deep/ .el-scrollbar {
          /*height: calc(100% - 100px);*/
          height: 100%;
        }
      }
    }
  }
  /deep/ .el-main {
    overflow: hidden;
    padding: 0;
    height: 100%;
  }
  /deep/ .el-scrollbar {
    /*overflow-y: auto;*/
    /*height: calc(100% - 30px);*/
    height: calc(100%);
    /*height: 100%;*/
  }
  /deep/ .el-header {
    padding: 0;
  }
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .tabs {
    width: 100%;
    height: 40px;
    background: #fff;
    border-bottom: 1px solid #e5e5e5;
  }
  /deep/ .el-menu--collapse.el-menu{
    width: 60px;
  }
  .main {
    margin: 20px 30px;
    /*padding: 20px 30px;*/
    /*width: calc(100% - 24px);*/
    /*height: calc(100% - 40px);*/
    .breadcrumb-container {
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      font-weight: 400;

      .breadcrumb-header {
        color: #c2c6ce;
      }
      .breadcrumb-title {
        color: #12171f;
      }
    }
  }
}
</style>
