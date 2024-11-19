<template>
  <div class="header-wrapper" :class="{'special-blue':themeColor==='blue'}">
    <div class="top-content">
      <div class="top-logoTitle" @click="gotoHome">
        <img class="rms-logo" src="../../assets/image/logo.png" alt="logo">
      </div>
      <!-- <div class="fold-con">
        <img
          class="menu-fold"
          @click="leftMenuHandle"
          src="../../assets/image/icon-fold.svg"
          title="折叠菜单">
      </div> -->
      <div class="topMenu">
        <span
          v-for="channel in topMenu"
          :key="channel.resCode"
          class="menu-btn"
          :class="{'actived':channel.isActived}"
          @click="gotoChannel(channel)">{{channel.resName}}
        </span>
      </div>
    </div>
    <div class="top-userInfo">
      <el-autocomplete
        class="inline-input filter"
        v-model="checkedMenu"
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        placeholder="搜索..."
        :trigger-on-focus="false"
        height="28px"
        v-if="false"
      ></el-autocomplete>
      <img
        src="../../assets/image/bell.svg"
        alt=""
        class="bell"
        v-if="noticeNum === 0"
        @click="clickBell">
      <img
        :src="require('../../assets/image/bell-' + themeColor + '-red.svg')"
        alt=""
        class="bell"
        v-if="noticeNum !== 0"
        @click="clickBell">
      <div class="help-center" :class="{'is-active':showHelpCenter}"  @click="showHelpCenter=!showHelpCenter">
        <!-- @click="settingHelpEvent($event)" -->
        <!-- <img
          :src="require('../../assets/image/help-center.svg')"
          alt="帮助中心"
          class="help-img"
        > -->
        <span class="svgfont-help-center"></span>
        <div class="help-center-bar" v-if="showHelpCenter" @click="jumpHelpCenter">
          <span>帮助中心</span>
        </div>
      </div>
      <div class="top-userInfo-content" @click="settingEvent($event)">
        <!-- <img
          class="people"
          id="top-head-img"
          src="../../assets/image/tophead.svg"
          @click="loginInfoVis = !loginInfoVis"> -->
        <span class="people svgfont-tophead" @click="loginInfoVis = !loginInfoVis"></span>
        <!-- <span class="login-name">{{ '' }}</span> -->
        <!-- <i class="el-icon-caret-bottom bottom-icon"></i> -->
        <!-- <i class="el-icon-caret-top top-icon"></i> -->
        <div class="login-hover" id="login-hover" v-if="loginInfoVis">
          <div class="theme-wrapper">
            <div class="switch-theme">
              <!-- <img class="switch-icon" src="../../assets/image/icon-theme.svg" alt=""> -->
              <i class="switch-icon svgfont-theme"></i>
              <span class="title">切换主题</span>
            </div>
            <div class="theme-btn">
              <el-checkbox-group v-model="themeColorBind" @change="changeTheme">
                <el-checkbox class="blue" label="blue"></el-checkbox>
                <el-checkbox class="red" label="red"></el-checkbox>
                <el-checkbox class="green" label="green"></el-checkbox>
                <el-checkbox class="purple" label="purple"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="org-wrapper">
            <div class="switch-title">
              <!-- <img class="switch-icon" src="../../assets/image/icon-org.svg" alt=""> -->
              <i class="switch-icon svgfont-org"></i>
              <span class="title">切换组织</span>
            </div>
            <el-scrollbar>
              <el-radio-group v-model="curOrgCode" @change="changeOrg" @click="tolggleInfo">
                <el-radio
                  v-for="item in orgList"
                  :key="item.id"
                  :value="item.orgCode"
                  :label="item.orgCode">
                  <el-tooltip
                    v-if="item.nameTooltip"
                    :content="item.isMainOrg==='1' ? item.orgName+'(主)' : item.orgName"
                    placement="top"
                    effect="dark">
                    <span class="radio-txt">{{ item.orgName }}<span v-if="item.isMainOrg==='1'">(主)</span></span>
                  </el-tooltip>
                  <span v-else class="radio-txt">{{ item.orgName }}<span v-if="item.isMainOrg==='1'">(主)</span></span>
                  <el-tooltip
                    v-if="item.posTooltip"
                    :content="item.position"
                    placement="top"
                    effect="dark">
                    <span class="radio-txt">{{ item.position }}</span>
                  </el-tooltip>
                  <span v-else class="radio-txt">{{ item.position }}</span>
                </el-radio>
              </el-radio-group>
            </el-scrollbar>
          </div>
          <div class="logout-btn" @click="editPassword" v-if="loginUserType !== '1'">
            <i class="switch-icon svgfont-password"></i>
            <span class="title">修改密码</span>
          </div>
          <div class="logout-btn" id="logout-btn" @click="loginOut">
            <!-- <img class="switch-icon" src="../../assets/image/icon-logout.svg" alt=""> -->
            <i class="switch-icon svgfont-logout"></i>
            <span class="title">退出登录</span>
          </div>
        </div>
        <!-- <span class = "loginName" v-if="userInfo.userAuth">{{userInfo.userAuth.chineseName}}</span> -->
        <el-tooltip
          v-if="userInfo.userAuth"
          :content="userInfo.userAuth.chineseName"
          effect="dark"
          :disabled="showTooltip(userInfo.userAuth.chineseName, 400, true, 'loginName')"
          placement="top">
          <span class = "loginName">{{userInfo.userAuth.chineseName}}</span>
        </el-tooltip>
      </div>
    </div>
    <div class="edit-password">
      <change-password :visible.sync="visible" :edit-mode="editMode" :user-type="loginUserType"></change-password>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import API from '../../serve/index'
import ChangePassword from './changePassword'
// import BLUE from '@theme/index.css'
// import BLUE1 from '@theme/index2.css'
import { isShowToolTip } from '@lib/common/util/common'
export default {
  name: 'topHeader',
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo',
      themeColor: 'CONFIG/themeColor', //配置
      noticeNum: 'HOME/noticeNum'
    }),
    bellSrc () {
      return '../../assets/image/bell-' + this.themeColor + '-red.svg'
    }
  },
  props: {
    organizations: { type: Array, default: () => [] },
    orgCode: { type: String, default: '' },
    topMenu: { ype: Array, default: () => [] }
  },
  data () {
    return {
      checkedMenu: '',
      filterMenu: [],
      curOrgCode: '', //当前登录组织
      orgList: [],
      themeColorBind: [],
      curTheme: 'blue',
      loginInfoVis: false,
      publicPath: process.env.BASE_URL,
      visible: false, // 是否显示修改密码弹窗
      loginUserType: '1', // 用户类型：内部用户1/生态用户2/外部用户3
      editMode: 'active', // 密码修改方式：主动发起active，被动校验passive
      needChangePassword: null, // 是否需要修改密码
      changePasswordDate: null, // 密码修改时间
      showHelpCenter: false
    }
  },
  components: { ChangePassword },
  // watch: {
  //   organizations: {
  //     handler (newValue, oldValue) {
  //       if (newValue) {
  //         this.setOrgList()
  //       }
  //     },
  //     deep: true
  //   },
  //   orgCode (newValue, oldValue) {
  //     this.curOrgCode = newValue
  //   }
  // },
  methods: {
    ...mapMutations({
      setNoticeNum: 'HOME/setNoticeNum'
    }),
    // 隐藏弹出框
    tolggleInfo () {
      this.loginInfoVis = false
    },
    // 全局区域点击时，loginInfoVis设置为false
    clickedDom (event) {
      // let flag = event.path.some(ele => ele.id === 'login-hover')
      // if (event.target.id !== 'login-hover' && event.target.id !== 'top-head-img' && !flag) {
      //   this.loginInfoVis = false
      // }
      this.$set(this, 'loginInfoVis', false)
      //this.$set(this, 'showHelpCenter', false)
    },
    // 此区域不受上面方法的影响
    settingEvent (event) {
      event.stopPropagation()
      this.showHelpCenter = false
    },
    // settingHelpEvent (event) {
    //   event.stopPropagation()
    // },
    /**
     * 登出
     * @click
     */
    loginOut () {
      this.tolggleInfo()
      this.$confirm(' ', '确定要退出当前账号吗？', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(res => {
          API.logout({ refreshToken: this.userInfo.refreshToken })
            .then(res => {
              this.$store.commit('TABSVIEW/DEL_ALL_VISITED_VIEW')
              this.$router.push({
                name: 'login'
              })
            })
            .catch(e => {
              if (e.selfError) return
              this.$message({
                type: 'error',
                message: '退出登录失败！',
                duration: 0,
                showClose: true
              })
            })
        })
        .catch(e => {})
    },
    /**
     * 搜索
     * @click
     */
    querySearch (queryString, cb) {
      var restaurants = this.filterMenu
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return restaurant => restaurant.value.indexOf(queryString) > -1
    },
    /**
     * 点击图标，控制左边栏菜单的显示与隐藏
     * @click
     */
    leftMenuHandle () {
      // let tempToggle = !this.toggleStatus
      // let leftMenuStatus = tempToggle ? 'open' : 'close'
      // this.$store.commit('MENU/setLeftMenuVisible', tempToggle)
      // this.$store.commit('MENU/setLeftMenuStatus', leftMenuStatus)
      // this.$emit('handleChangeMenu', tempToggle)
    },
    // 设置初始左侧菜单状态
    setDefaultMenuStatus () {
      // let toggleStatus = this.leftMenuStatus === 'open'
      // this.$store.commit('MENU/setLeftMenuVisible', toggleStatus)
      // this.$store.commit('MENU/setLeftMenuStatus', this.leftMenuStatus)
      // this.$emit('handleChangeMenu', toggleStatus)
    },
    //设置组织列表
    setOrgList () {
      let temp = [...this.userInfo.userAuth.organizations]
      let mainOrg = null
      this.userInfo.userAuth.organizations.forEach((ele, index) => {
        if (ele.isMainOrg === '1') {
          mainOrg = ele
          // this.curOrgCode = ele.orgCode
          temp.splice(index, 1)
        }
      })
      if (mainOrg) {
        temp.unshift(mainOrg)
      }
      temp.forEach(ele => {
        if (ele.isMainOrg === '1') {
          ele.nameTooltip = isShowToolTip(ele.orgName, 100)
        } else {
          ele.nameTooltip = isShowToolTip(ele.orgName, 129)
        }
        ele.posTooltip = isShowToolTip(ele.position, 129)
      })
      this.orgList = temp
    },
    // 跳到首页
    gotoHome () {
      if (this.$route.path !== '/home') {
        this.$router.push({ path: '/home' })
      }
    },
    //跳转频道
    gotoChannel (channel) {
      if (channel.accessPath !== this.$route.path) {
        this.$store.commit('TABSVIEW/DEL_ALL_VISITED_VIEW')
        this.$router.push({ path: channel.accessPath })
      }
    },
    //组织切换
    changeOrg (val) {
      this.tolggleInfo()
      const loading = this.$loading({
        lock: true,
        text: '正在切换组织',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.8)'
      })
      API.setSecUserAuth(val)
        .then(res => {
          // if (this.$route.path === '/home') {
          //   this.$router.go(0)
          //   loading.close()
          //   return
          // }
          this.$emit('refreshAuth', true)
          loading.close()
          // if (this.$route.path !== '/home') {
          //   this.$router.push({ path: '/home' })
          // }
          // location.reload()
          /* this.$router.replace({
            path: '/refresh',
            query: {
              t: Date.now()
            }
          }) */
        })
        .catch(e => {
          loading.close()
          if (e.selfError) return
          this.curOrgCode = this.orgCode
          if (e.message) {
            this.$message({
              message: e.message || '组织切换失败',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 切换主题
    changeTheme (val) {
      this.tolggleInfo()
      if (val.length === 0) {
        this.themeColorBind = [this.curTheme]
      } else {
        this.themeColorBind = []
        this.curTheme = val.pop()
        this.themeColorBind.push(this.curTheme)
      }
      document.body.className = 'custom-' + this.curTheme
      document.documentElement.setAttribute('data-theme', this.curTheme)
      this.$store.commit('CONFIG/setThemeColor', this.curTheme)
    },

    //获取系统通知数量
    getNoticeNum () {
      API.getNoticeNum()
        .then(res => {
          if (!res) {
            this.setNoticeNum(0)
          } else {
            this.setNoticeNum(res)
          }
        })
        .catch(err => {
          this.$message({
            message: err.message || '服务器异常，获取系统通知数量失败，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    // 点击铃铛跳转至系统通知列表
    clickBell () {
      if (this.$route.path !== '/home/importantNotice') {
        this.$router.push({ path: '/home/importantNotice' })
      }
    },
    //点击帮助中心跳转至帮助中心
    // jumpHelpCenter () {
    //   if (this.$route.path !== '/home/helpCenter') {
    //     this.$router.push({ path: '/home/helpCenter' })
    //   }
    // },
    jumpHelpCenter () {
      if (this.$route.path !== '/home/helpCenter') {
        this.$router.push({ path: '/home/helpCenter' })
      }
      this.showHelpCenter = false
    },
    // 校验是否需要修改密码
    checkPassword () {
      // 如果是外部用户或者生态用户，需要校验密码
      let message = ''
      if (this.needChangePassword === '1') {
        message = '初次登陆或重置密码后请修改密码'
      } else {
        let timestamp = (new Date())
          .getTime()
        let days = (timestamp - this.changePasswordDate) / 1000 / 60 / 60 / 24
        if (Math.ceil(days) > 90) {
          message = '你的密码已使用超过90天，请修改密码后重新登录'
        }
      }
      if (message) {
        this.$alert(message, ' ', {
          confirmButtonText: '确定',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-alert',
          confirmButtonClass: 'self-message-box-alert-confirm'
        })
          .then(() => {
            this.editMode = 'passive'
            this.visible = true
          })
          .catch((e) => {
            // console.log(e)
          })
      }
    },
    // 点击修改密码按钮
    editPassword () {
      this.editMode = 'active'
      this.visible = true
    },
    // 获取登陆用户类型
    getLoginUserMoreInfo () {
      API.loginUserMoreInfo()
        .then(res => {
          this.loginUserType = res.loginUserType
          this.needChangePassword = res.needChangePassword
          this.changePasswordDate = res.changePasswordDate
          if (res.loginUserType !== '1') {
            this.checkPassword()
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '服务器异常，获取登录用户类型失败',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    /**
     * 是否显示Tooltip
     * @param val 需要显示的内容
     * @param len 文本框长度
     * @param isUse 是否使用Tooltip
     * @param id 文本框id
     * @returns {boolean}
     */
    showTooltip (val, len, isUse, id) {
      if (isUse) {
        let con = document.getElementsByTagName('body')[0]
        let span = document.createElement('span')
        span.id = id
        span.style.position = 'absolute'
        span.style.left = '30px'
        span.style.visibility = 'hidden'
        con.appendChild(span)
        span.innerText = val
        let showTip = document.getElementById(id).offsetWidth > len
        con.removeChild(span)
        return !showTip
      } else {
        return true
      }
    }
  },
  mounted () {
    this.curOrgCode = this.orgCode
    this.setOrgList()
    // console.log(this.userInfo)
    this.setDefaultMenuStatus()
    if (!localStorage.getItem('themeColor')) {
      localStorage.setItem('themeColor', this.themeColor)
    }
    document.body.className = 'custom-' + this.themeColor
    document.documentElement.setAttribute('data-theme', this.themeColor)
    this.themeColorBind = [this.themeColor]
    this.getNoticeNum()
    this.getLoginUserMoreInfo()
    //全局点击事件，点击帮助中心以外的地方，则隐藏
    document.addEventListener('click', (e) => {
      //console.log('e', e)
      let thisClassName = e.target.className
      if (thisClassName !== 'help-center-bar' && thisClassName !== 'help-center' && thisClassName !== 'help-img' && thisClassName !== 'svgfont-help-center') {
        this.showHelpCenter = false
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.header-wrapper {
  /*width: 100%;*/
  /*background: url("../../assets/image/navBg.png") center no-repeat;*/
  /*background-size: 100% 100%;*/
  display: flex;
  justify-content: space-between;
  @include background-color($color-blue);
  &.special-blue{
    background-color: $color-blue1;
  }
  height: 50px;

  .top-content {
    display: flex;

    .top-logoTitle {
      width: 200px;
      text-align: right;
      cursor: pointer;
      .rms-logo{
        width: 164px;
        height: 22px;
        margin: 14px 17px 14px 0;
      }
    }

    .fold-con{
      .menu-fold{
        cursor: pointer;
        width: 13px;
        height: 13px;
        margin: 18.5px 0;
      }
      &.folded{
        width: 60px;
        text-align: center;
      }
    }
    .topMenu{
      margin-left: 60px;
      .menu-btn{
        display: inline-block;
        color: #fff;
        padding: 0 15px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        cursor: pointer;
        opacity: 0.8;
        &.actived{
          background: rgba(0,0,0,0.10);
          opacity: 1;
        }
      }
    }

  }

  .top-userInfo {
    ///position: absolute;
    //top: 11px;
    //right: 20px;
    order: 1;
    padding-right: 20px;
    display: flex;
    align-items: center;
    //padding-top: 10px;
   //.top-userInfo-content {
     //max-width: 400px;
     //white-space: nowrap;
     //text-overflow: ellipsis;
     //overflow: hidden;
    .inline-input {
      display: inline-block;
      /deep/ .el-input__inner {
        height: 28px;
        line-height: 28px;
        background: rgba(0,0,0,0.10);
        border: none;
        color: #fff;
        &::placeholder {
            color: rgba(245, 246, 250,0.5) !important;
        }
        &::-webkit-input-placeholder {
            /* WebKit browsers 适配谷歌 */
            color: rgba(245, 246, 250,0.5) !important;
        }
        &:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 适配火狐 */
            color: rgba(245, 246, 250,0.5) !important;
        }
        &::-moz-placeholder {
            /* Mozilla Firefox 19+ 适配火狐 */
            color: rgba(245, 246, 250,0.5) !important;
        }
        &:-ms-input-placeholder {
            /* Internet Explorer 10+  适配ie*/
            color: rgba(245, 246, 250,0.5) !important;
        }
      }
      /deep/ .el-input__icon {
        height: 28px;
        line-height: 28px;
      }
    }
    .filter {
      margin-right: 20px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(160, 166, 179, 1);
      vertical-align: middle;
    }

    .bell {
      //margin-right: 20px;
      vertical-align: middle;
      cursor: pointer;
    }

    .people {
      padding-right: 5px;
      display: inline-block;
      vertical-align: middle;
      width: 24px;
      height: 24px;
      cursor: pointer;
      margin-bottom: 5px;
    }
    .svgfont-tophead{
      font-size: 24px;
      margin-right: 8px;
    }
     .help-center {
      height: 50px;
      width: 40px;
      margin-left: 10px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.is-active{
        background: rgba(0,0,0,0.10);
        opacity: 1;
      }
      .help-img {
        width: 20px;
        height: 20px;
        //margin-right: 20px;
        vertical-align: middle;
        cursor: pointer;
      }
      .svgfont-help-center{
        display: inline-block;
        font-size: 20px;
        color: #fff;
        margin-top: 3px;
      }
      .help-center-bar {
        display: flex;
        align-items: center;
        z-index: 999;
        background-color: #fff;
        position: absolute;
        top: 52px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        //color: #0B82FF;
        line-height: 22px;
        width: 200px;
        height: 48px;
        right: 95px;
        //padding-left: 5px;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        //background: $color-background-normal;
        //color: $color-text-normal;
        @include color();
        //cursor: pointer;
        span {
          display: inline-block;
          height: 38px;
          width: 200px;
          line-height: 38px;
          box-sizing: border-box;
          padding-left: 5px;
          @include background-color($color-blue,0.1);
          cursor: pointer;
        }
      }
    }
    /deep/ .top-userInfo-content {
      max-width: 400px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      height: 28px;
      line-height: 28px;
      vertical-align: middle;
      font-weight: 400;
      color: #fff;
      cursor: default;
      .login-name {
        //padding-right: 5px;
      }
      img {
        padding-right: 13px;
      }
      .top-icon {
        display: none;
      }
      .login-hover {
        // display: none;
        width: 185px;
        // height: 40px;
        position: absolute;
        right: 10px;
        top: 50px;
        background: #ffffff;
        text-align: center;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        z-index: 1000;
        text-align: left;
        @include color();
        padding-bottom: 10px;

        .org-wrapper{ ///deep/
          .el-scrollbar__wrap{
            margin-bottom: 0 !important;
          }
          .el-radio-group{
            max-height: 200px;
            .el-radio{
              width: 185px;
              line-height: 32px;
              padding-left: 30px;
              margin: 0;
              box-sizing: border-box;
              display: flex;///deep/
               .el-radio__inner{
                width: 16px;
                height: 16px;
                top: 8px;
              }///deep/
               .el-radio__label{
                color: #666666;
                padding-left: 8px;
                display: flex;
                flex-direction: column;
                span.radio-txt{
                  width: 129px;
                  display: inline-block;
                  line-height: 32px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
              }
              .radio-txt{
                display: block !important;
                // padding-left: 24px;
                line-height: 32px;
              }
              &.is-checked{
                background: rgba(11,130,255,0.10);
              }
            }
          }
        }
        .switch-title,.logout-btn,.switch-theme{
          font-size: 12px;
          height: 30px;
          line-height: 30px;
          padding-left: 15px;
          position: relative;
          display: inline-block;
          .switch-icon{
            font-size: 14px;
            width: 14px;
            /*height: 14px;*/
            line-height: 30px;
            /*position: absolute;*/
            /*top: 0;*/
            display: inline-block;
            vertical-align: middle;
          }
          .title{
            display: inline-block;
            font-size: 12px;
            height: 30px;
            line-height: 30px;
            /*margin-left: 18px;*/
            margin-left: 5px;
            vertical-align: middle;
          }
        }
        .logout-btn{
          /*height: 40px;*/
          /*line-height: 40px;*/
          display: block;
          cursor: pointer;
          .switch-icon{
            top: 0;
          }
        }

        .theme-wrapper{
          ///deep/
           .el-checkbox-group{
            padding-left: 34px;
          }  ///deep/
          .el-checkbox{
            margin-right: 20px;
            .el-checkbox__label{
              display: none;
            }
            .el-checkbox__inner{
              border-width: 2px;
              &:hover{
                /*border-color: none;*/
              }
            }
          }
          .blue{
            //deep/
            .el-checkbox__inner{
              //deep/
            .el-checkbox__input.is-checked .el-checkbox__inner{
              background-color: #0B82FF;
            }
              border-color: #0B82FF;
              &:hover{
                border-color: #0B82FF;
              }
            }
          }
          .red{
            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
              background-color: #FF3657;
            }///deep/
             .el-checkbox__inner{
              border-color: #FF3657;
              &:hover{
                border-color: #FF3657;
              }
            }
          }
          .green{
            /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
              background-color: #56BB97;
            }///deep/
             .el-checkbox__inner{
              border-color: #56BB97;
              &:hover{
                border-color: #56BB97;
              }
            }
          }
        }
      }
    }
    .top-userInfo-content:hover {
      .bottom-icon {
        display: none;
      }
      .top-icon {
        display: inline-block;
      }
      .login-hover {
        display: block;
      }
    }
   }
  //}
}
</style>
