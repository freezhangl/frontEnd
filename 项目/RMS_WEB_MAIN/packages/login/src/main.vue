<template>
  <div class="login-wrapper">
    <div class="login-wrap">
      <div class="login-container" :class="{'special-blue':themeColor==='blue'}">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账户静态密码" name="staticLogin">
            <el-form :model="loginParam" :rules="rules" ref="loginEntity">
              <el-form-item prop="username">
                <el-input
                  name="username"
                  type="text"
                  placeholder="用户账号"
                  v-model="loginParam.username"
                  @keyup.enter.native="login"
                  @input.native="loginParam.username=$event.target.value.trim()">
                  <i
                    v-if="loginParam.username"
                    slot="suffix"
                    class="el-input__icon el-icon-close"
                    @click="clearInput('username')"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  name="password"
                  v-model="loginParam.password"
                  placeholder="请输入静态密码"
                  :type="showPassword ? 'text' : 'password'"
                  @keyup.enter.native="login">
                  <img
                    class="icon"
                    v-if="showPassword && loginParam.password"
                    slot="suffix"
                    src="../assets/image/eye-open.svg"
                    @click="showPassword = !showPassword">
                  <img
                    class="icon"
                    v-if="!showPassword && loginParam.password"
                    slot="suffix"
                    src="../assets/image/eye-close.svg"
                    @click="showPassword = !showPassword">
                  <i
                    v-if="loginParam.password"
                    slot="suffix"
                    class="el-input__icon el-icon-close"
                    @click="clearInput('password')"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="code" class="code-form">
                <div class="code-wrapper">
                  <el-input
                    name="code"
                    class="code-input"
                    v-model="loginParam.code"
                    placeholder="请输入验证码"
                    @keyup.enter.native="login">
                  </el-input>
                  <span class="codeImg-wrapper">
                    <img
                      class="code-img"
                      v-if="imgData.length>0"
                      @click="refreshImg"
                      :src="'data:image/png;base64,'+imgData" />
                    <i class="el-icon-refresh-left code-refresh" @click="refreshImg"></i>
                  </span>
                </div>
              </el-form-item>
              <el-button class="login-btn" :class="{'none-click' : !loginParam.username || !loginParam.password || !loginParam.code}" @click="login">登 录</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机动态密码" name="dynamicLogin">
            <el-form :model="loginParam1" :rules="rules1" ref="loginEntity1">
              <el-form-item prop="username">
                <el-input
                  name="username"
                  v-model="loginParam1.username"
                  type="text"
                  placeholder="用户账号"
                  @keyup.enter.native="login">
                  <i
                    v-if="loginParam1.username"
                    slot="suffix"
                    class="el-input__icon el-icon-close"
                    @click="clearInput('username',true)"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="code" class="code-form">
                <div class="code-wrapper">
                  <el-input
                    name="code"
                    class="code-input"
                    v-model="loginParam1.code"
                    placeholder="请输入验证码"
                    @keyup.enter.native="login">
                  </el-input>
                  <span class="codeImg-wrapper dynamic-codeImg">
                    <img
                      class="code-img"
                      v-if="imgData.length>0"
                      @click="refreshImg"
                      :src="'data:image/png;base64,'+imgData" />
                    <i class="el-icon-refresh-left code-refresh" @click="refreshImg"></i>
                  </span>
                </div>
              </el-form-item>
              <el-form-item prop="phonecode" class="code-form">
                <div class="dycode-wrapper">
                  <el-input
                    name="phonecode"
                    class="dycode-input"
                    v-model="loginParam1.phonecode"
                    placeholder="请输入动态密码"
                    type="'assword"
                    @keyup.enter.native="login">
                  </el-input>
                  <el-button v-if="!dyCodeDisabled" class="dycode" @click="getDynamicCode">获取动态密码</el-button>
                  <el-button v-else plain class="dycode timeout">{{timeTxt}}s</el-button>
                </div>
              </el-form-item>
              <el-button class="login-btn" :class="{'none-click' : !loginParam1.username || !loginParam1.phonecode || !loginParam1.code}" @click="login">登 录</el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
// import JSEncrypt from 'jsencrypt'
import API from '../serve'
import { aes } from '../../common/util/encrypt'
import APILayout from '@lib/layout/serve'
import userInfo1 from './userInfo'
export default {
  name: 'login',
  data () {
    return {
      activeName: 'staticLogin', // staticLogin,dynamicLogin
      loginParam: {
        username: '',
        password: '',
        code: '',
        uuid: '',
        type: 'PASSWORD' //PASSWORD-静态密码，PHONE-手机动态码
      },
      loginParam1: {
        username: '',
        phonecode: '',
        code: '',
        uuid: '',
        type: 'PHONE' //PASSWORD-静态密码，PHONE-手机动态码
      },
      imgData: '', //图片验证码
      isImgGet: false, // 用于请求验证码接口有返回之后，才能再次请求验证码
      rules: {
        username: [{ required: true, message: '请输入用户账号' }],
        password: [{ required: true, message: '请输入密码' }],
        code: [{ required: true, message: '请输入验证码' }]
      },
      rules1: {
        username: [{ required: true, message: '请输入用户账号' }],
        password: [{ required: true, message: '请输入密码' }],
        code: [{ required: true, message: '请输入验证码' }],
        phonecode: [{ required: true, message: '请输入动态密码' }]
      },
      showPassword: false,
      dyCodeDisabled: false,
      timeTxt: 180,
      timer: null,
      themeColor: 'blue'
    }
  },
  computed: {
    ...mapGetters({
    })
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'USERENTITY/setUserInfo',
      setUserAuth: 'USERENTITY/setUserAuth',
      setMenus: 'MENU/setMenus'
    }),
    /**
    * 切换登录方式
    */
    handleClick () {
      /*  this.loginParam = {
        username: '',
        password: '',
        code: '',
        uuid: '',
        type: 'PASSWORD'
      }
      this.loginParam1 = {
        username: '',
        phonecode: '1234',
        code: '',
        uuid: '',
        type: 'PHONE'
      }
      this.$refs.loginEntity.resetFields()
      this.$refs.loginEntity1.resetFields() */
      this.refreshImg()
      this.dyCodeDisabled = false
      clearInterval(this.timer)
    },
    /**
     * 清空输入框内容
     */
    clearInput (prop, isDynamic) {
      if (isDynamic) {
        this.loginParam1[prop] = ''
      } else {
        this.loginParam[prop] = ''
      }
    },
    /**
     * 获取动态密码
     */
    getDynamicCode () {
      let valid = true
      this.$refs.loginEntity1.validateField('username', msg => {
        if (msg) {
          this.$message({
            showClose: true,
            message: '请输入用户账号',
            type: 'error'
          })
          valid = false
        }
      })
      if (!valid) return
      this.$refs.loginEntity1.validateField('code', msg => {
        if (msg) {
          this.$message({
            showClose: true,
            message: '请输入验证码',
            type: 'error'
          })
          valid = false
        }
      })
      if (!valid) return
      let endStringRegex = /@outside.cmcc/
      // if (endStringRegex.test(this.loginParam1.username)) {
      //   this.$message({
      //     showClose: true,
      //     message: '外部用户无法使用动态验证码',
      //     type: 'error'
      //   })
      //   valid = false
      // }
      // if (!valid) return
      let params = {
        uid: this.loginParam1.username,
        uuid: this.loginParam1.uuid,
        verifyCode: this.loginParam1.code
      }
      API.getPhoneCode(params)
        .then(res => {
          // console.log('getPhoneCode', res)
          this.dyCodeDisabled = true
          this.timeTxt = 180
          this.timer = setInterval(() => {
            this.timeTxt--
            if (this.timeTxt === 0) {
              this.dyCodeDisabled = false
              // this.refreshImg()
              clearInterval(this.timer)
            }
          }, 1000)
          this.$message({
            showClose: true,
            message: res,
            type: 'success'
          })
        })
        .catch(e => {
          // console.log(e)
          if (e.selfError) return
          if (e.message) {
            this.$message({
              showClose: true,
              message: e.message,
              type: 'error'
            })
          } else {
            // console.log(e)
          }
          this.refreshImg()
        })
    },
    /**
     * 点击登录时触发
     * @click
     */
    login () {
      let entity = this.activeName === 'staticLogin' ? 'loginEntity' : 'loginEntity1'
      this.$refs[entity].validate(async valid => {
        if (valid) {
          let accountInfo = {}
          // console.log('loginParam', this.loginParam)
          // console.log('loginParam1', this.loginParam1)
          if (this.activeName === 'staticLogin') {
            accountInfo = {
              username: this.loginParam.username,
              code: this.loginParam.code,
              uuid: this.loginParam.uuid,
              password: aes.en(this.loginParam.password), //this.codeEncrypt(this.loginParam.password),
              type: 'PASSWORD'
            }
          } else {
            accountInfo = {
              username: this.loginParam1.username,
              // code: this.loginParam1.code,
              uuid: this.loginParam1.uuid,
              phonecode: this.loginParam1.phonecode,
              // phonecode: aes.en(this.loginParam1.phonecode), //this.codeEncrypt(this.loginParam1.phonecode),
              type: 'PHONE'
            }
          }
          let res = { access_token: '1', refresh_token: '2', token_type: '3', loginName: '4' }
          // API.login(accountInfo)
          //   .then(res => {
          let userInfo = {
            token: res.access_token,
            refreshToken: res.refresh_token,
            tokenType: res.token_type,
            loginName: res.loginName
            // organizations: res.organizations
          }
          this.setUserInfo(userInfo)
          this.getUserAuth() // 登录成功后获取用户信息
          // })
          // .catch(e => {
          //   if (e.selfError) return
          //   if (e.message) {
          //     this.$message({
          //       showClose: true,
          //       message: '登录失败，' + e.message,
          //       type: 'error'
          //     })
          //     // if (e.message === '验证码失效') {
          //     //   this.refreshImg()
          //     //   // console.log('验证码失效，自动刷新')
          //     // }
          //   } else {
          //     // console.log(e)
          //   }
          //   this.refreshImg()
          // })
        }
      })
    },
    getUserAuth () {
      // APILayout.getUserAuth()
      //   .then(res => {
      let res = userInfo1.body
      this.setUserAuth(res)
      this.getPCMenus(res.menus)
      this.$router.push({
        path: '/home'
      })
      // })
      // .catch((e) => {
      //   if (e.selfError) return
      //   this.$message({
      //     showClose: true,
      //     message: e.message || '获取用户信息失败，请重新尝试',
      //     type: 'error'
      //   })
      //   this.refreshImg()
      // })
    },
    getPCMenus (menuData) {
      let PCMenus = []
      if (menuData && menuData.length > 0) {
        let pcMenuRoot = menuData.filter(ele => ele.resScope === '1') //PC端资源根节点
        if (pcMenuRoot && pcMenuRoot.length > 0 && pcMenuRoot[0].child && pcMenuRoot[0].child.length > 0) {
          PCMenus = pcMenuRoot[0].child
        }
      }
      this.setMenus(PCMenus)
      // console.log('登录页面存储菜单', PCMenus)
    },
    /**
     * 获取图片验证码
     * @function
     */
    getImageData () {
      API.getImageCode({ type: 1 })
        .then(res => {
          if (res) {
            if (this.activeName === 'staticLogin') {
              this.loginParam.uuid = res.uuid
            } else {
              this.loginParam1.uuid = res.uuid
            }
            this.imgData = res.img
            this.isImgGet = true
          }
        })
        .catch(err => {
          if (err.selfError) return
          this.isImgGet = true
          if (err.message) {
            this.$message({
              showClose: true,
              message: '验证码获取失败，' + err.message,
              type: 'error'
            })
          } else {
            // console.log(err)
          }
        })
    },
    /**
     * 刷新验证码
     * @click
     */
    refreshImg () {
      if (this.isImgGet) {
        this.getImageData()
      }
    },
    /**
     * 加密
     */
    // codeEncrypt (str) {
    //   let key = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKs9fdUI4WJm9O2yQsTKOFKU4HsS0n4ZY1HAf+QQ+zy+X/0Wq7SGi1blW+cs71BnnWLKHKFOhH/GxZsv4A1kXwMCAwEAAQ=='
    //   let pubKey = `-----BEGIN PUBLIC KEY-----${key}-----END PUBLIC KEY-----`// ES6 模板字符串 引用 rsa 公钥
    //   let encryptStr = new JSEncrypt()
    //   encryptStr.setPublicKey(pubKey) // 设置 加密公钥
    //   let data = encryptStr.encrypt(str) // 进行加密
    //   return data
    // },
    /**
     * 账户校验
     * @function
     * @param accountInfo 用户名、密码
     */
    userCheck (accountInfo = {}) {
    },
    /**
     * 点击忘记密码时触发
     * @click
     */
    forgetPsw () {
    }
  },
  mounted () {
    this.getImageData()
    this.themeColor = localStorage.getItem('themeColor') || 'blue'
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  overflow: hidden;
  position: relative;
  min-width: 1100px;
  height: 100%;
  background: url("../assets/image/login_bg.png") no-repeat fixed;
  background-size: 100% 100%;
  .login-wrap {
    margin: auto;
    position: absolute;
    right: 19.5%;
    top: 0;
    bottom: 0;
    width: 340px;
    height: 407px;
    background: #FFFFFF;
    box-shadow: 6px 16px 10px 0 rgba(0,0,0,0.14);
    border-radius: 10px;
    .login-container {
      // background: #f4f4f4;
      // padding: 15px 30px 30px 30px;
      padding-top: 24px;
      // width: 280px;
      height: 362px;
      margin: auto;

      /deep/ .el-tabs__header{
        padding: 0 30px;
      }
      /deep/ .el-form-item__content{
        padding: 0 30px;
      }
      /deep/ .el-tabs__nav-scroll{
        width: 100%;
        margin: auto;
        .el-tabs__nav{
          margin: 0 24px;
        }
        .el-tabs__item{
          color: #9B9B9B;
          font-size: 16px;
          font-weight: bold;
          &.is-active{
            @include color();
          }
        }
        .el-tabs__active-bar{
          @include background-color();
        }
      }
      /deep/ .el-tabs__nav-wrap::after{
        background: none;
      }

      /deep/ .el-tabs__content{
        text-align: center;
        height: calc(407px - 15px - 55px);
        padding-top: 26px;
      }

      .el-form-item{
        margin-bottom: 14px;
        /deep/ .el-input__inner{
          border: none;
          border-bottom: 1px solid #CECECE;
          border-radius: 0;
          box-shadow: inset 0 0 0 1000px #ffffff !important;
          padding: 0;
          width: 100%;
          &:focus{
            // border-bottom-color: #0085D0;
            @include border-bottom-color()
          }
        }
        /deep/ .el-form-item__error{
          padding: 2px 30px;
        }
        .el-icon-close{
          font-size: 14px;
          color: #CECECE;
          cursor: pointer;
          &:hover{
            // color: #0085D0;
          }
        }
        .icon{
          width: 14px;
          height: 14px;
          cursor: pointer;
          margin-right: 5px;
          vertical-align: middle;
          display: inline-block;
        }

        &.code-form /deep/ .el-form-item__error{
          padding-top: 5px !important;
        }
        .code-wrapper{
          display: flex;
          margin-top: 3px;
          position: relative;
          i{
            font-size: 14px;
            color: #606266;
          }
          .code-input{
            width: 130px;
            /deep/.el-input__inner{
              position: absolute;
              bottom: 0;
              left: 0;
            }
          }
          .codeImg-wrapper{
            // width: calc(115px + 12px + 14px);
            width: calc(100% - 130px);
            height: 40px;
            border-bottom: 1px solid #CECECE;
            box-sizing: border-box;
            .code-img{
              width: 114px;
              height: 36px;
              padding-left: 12px;
              box-sizing: content-box;
              // margin-bottom: 4px;
              border-left: 1px solid #CECECE;
              cursor: pointer;
              // margin-left: 22px;
            }
            &.dynamic-codeImg{
              height: 40px;
            }
            .code-refresh{
              font-size: 14px;
              bottom: 13px;
              position: relative;
              cursor: pointer;
            }
          }
        }

        .dycode-wrapper{
          display: flex;
          justify-content: space-between;
          .dycode-input{
            width: 160px;
            /deep/.el-input__inner{
              // border: none;
              position: relative;
              top: 5px;
            }
          }
          .dycode{
            width: 99px;
            height: 36px;
            @include border();
            border-radius: 5px !important;
            font-size: 14px;
            @include color();
            padding: 0 !important;
            margin-top: 4px;
            &.timeout{
              border: 1px solid #CECECE !important;
              color: #CECECE;
              cursor: not-allowed;
              box-shadow: none;
              &:hover,&:active{
                background: none;
              }
            }
          }
        }
      }
      .login-btn{
        margin-top: 46px;
        width: 280px;
        height: 39px;
        border-radius: 5px !important;
        font-weight: bold;
        font-size: 18px;
        color: #FFFFFF !important;
        letter-spacing: 0.48px;
        border: none;
        padding: 0;
        @include background-color();
        @include box-shadow($color-blue, 0.53);
        // box-shadow: 5px 10px 20px 0 rgba(67,119,239,0.53);
        &.none-click{
          opacity: 0.3;
          @include background-color();
        }
      }

      &.special-blue{
        /deep/ .el-tabs__nav-scroll .el-tabs__item.is-active{
          color: $color-blue1;
        }
        /deep/ .el-tabs__nav-scroll .el-tabs__active-bar{
          background-color: $color-blue1;
        }
        .el-form-item /deep/ .el-input__inner:focus{
          border-bottom-color: $color-blue1;
        }
        .el-form-item .dycode-wrapper .dycode{
          border: 1px solid $color-blue1;
          color: $color-blue1;
        }
        .login-btn{
          background-color: $color-blue1;
          box-shadow: 5px 10px 20px 0 rgba(67,119,239,0.53);
          &.none-click{
            background-color: $color-blue1;
          }
        }
      }
    }
  }
}
</style>
