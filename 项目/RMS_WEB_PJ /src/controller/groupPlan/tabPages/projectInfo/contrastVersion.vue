<template>
  <div class="contrast-version">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <div class="head-title">
          {{leftVersionInfo.numVersionName}}
        </div>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="main-btn-con">
        <div class="left-btn">
          <i class="font-icon svgfont-back" @click="clickBack">返回</i>
        </div>
        <div class="version-info">
          <el-dropdown placement="bottom-start" @command="contrastVersion" trigger="click">
            <span class="el-dropdown-link">
              对比其他版本
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="version-info-menu">
              <el-dropdown-item
                v-for="(item,index) in versionList"
                :key="item.versionNo"
                icon="el-icon-document"
                :command="item"
                :disabled="item.versionNo === rightVersionInfo.versionNo || item.versionNo === leftVersionInfo.versionNo"
                :class="{'version-disable':item.versionNo === leftVersionInfo.versionNo}">
                <span class="pop-vname" v-if="index!=0">{{item.numVersionName}}</span>
                <span class="pop-vname" v-if="index==0">{{item.numVersionName}}</span>
                <span class="pop-bottom">{{item.createdBy}} {{formatDate(item.versionCreatedDate)}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <contrast-details
        v-if="leftProjectInfo && rightProjectInfo"
        :is-change="false"
        :left-info="leftProjectInfo"
        :right-info="rightProjectInfo"></contrast-details>

    </div>

  </div>
</template>
<script>
import API from '@/serve/API_groupPlanProject'
import contrastDetails from '../projectProcess/flowComponents/changeFlow/contrastDetails'

export default {
  name: 'groupContrastVersion',
  data () {
    return {
      showBackTop: false,
      versionList: [], //版本列表
      leftVersionInfo: {
        versionName: '',
        versionNo: this.$route.query.leftVersionNo
      }, //左侧当前版本
      rightVersionInfo: {
        versionName: '',
        versionNo: this.$route.query.rightVersionNo
      }, //右侧对比版本
      projectCode: this.$route.query.projectCode,
      leftProjectInfo: null,
      rightProjectInfo: null,
      typeOptions: [],
      levelList: []
    }
  },
  components: {
    contrastDetails
  },
  mounted () {
    this.getProjectVersion()
    this.getProjectDetail(this.leftVersionInfo.versionNo, 'left')
    this.getProjectDetail(this.rightVersionInfo.versionNo, 'right')
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm')
    },
    //返回
    clickBack () {
      history.go(-1)
    },
    // 查询项目版本列表
    getProjectVersion () {
      API.getProjectVersionList(this.projectCode)
        .then(res => {
          if (res) {
            res.forEach((item, index) => {
              item.numVersionName = `#${res.length - index} ${item.versionName}`
            })
            this.versionList = res
            this.versionList.forEach(ver => {
              if (ver.versionNo === this.rightVersionInfo.versionNo) {
                this.rightVersionInfo = ver
              }
              if (ver.versionNo === this.leftVersionInfo.versionNo) {
                this.leftVersionInfo = ver
              }
            })
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //切换版本
    contrastVersion (item) {
      if (item.versionNo === this.leftVersionInfo.versionNo) {
        return
      }
      this.rightVersionInfo = item
      this.leftProjectInfo = null
      this.rightProjectInfo = null
      this.getProjectDetail(this.leftVersionInfo.versionNo, 'left')
      this.getProjectDetail(item.versionNo, 'right')
    },
    //获取对应版本的项目详情
    getProjectDetail (versionNo, ver = 'right') {
      let params = {
        projectCode: this.projectCode,
        versionNo: versionNo,
        containBudget: 1,
        allSubProjectInfo: false
      }
      let interFaceName = ''
      if (this.$route.query.projectCategory === 'd') {
        interFaceName = 'queryProjectInfoByVersionD'
      } else {
        interFaceName = 'queryProjectInfoByVersionU'
      }
      // if (!interFaceName) return
      API[interFaceName](params)
        .then(res => {
          if (ver === 'left') {
            this.leftProjectInfo = res
            document.title = res.projectBaseInfo.projectName || '未定义'
          } else {
            this.rightProjectInfo = res
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
.contrast-version{
    /deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
  background : #f6f6f6;
  min-height: 800px;
  padding-bottom: 10px;

  .back-top{
    position: fixed;
    bottom: 20px;
    right : 10px;
    cursor: pointer;

    img{
      width: 50px;
      height: 50px;
    }
  }

  .top-head{
    height: 50px;
    background : #fff;

    .head-con{
      width: 1057px;
      margin: 0 auto;

      .head-title{
        height: 50px;
        line-height: 50px;
        float: left;
      }

      .logo-img{
        float: right;
        margin-top: 15px;
      }
    }
  }

  .main-container{
    width: 1057px;
    margin: 0 auto;
    .main-btn-con{
      margin: 20px 0;
      display: flex;
      .left-btn{
        width: 50%;
        .font-icon{
          font-size: 14px;
          margin-right: 20px;
          cursor: pointer;
          &:before {
            margin-right: 5px;
          }
        }
      }
      .version-info{
        width: 50%;
        margin-left: 50px;
        font-size: 14px;
        color: #333333;
        display: inline-block;
        .el-dropdown-link{
          cursor: pointer;
        }
        .vicon-btn{
          margin-left: 25px;
          cursor: pointer;
          i{
            margin-right: 8px;
          }
        }
      }
    }
  }

}
.version-info-menu /deep/{
  .pop-vname{
  }
  .pop-bottom{
    display: block;
    font-size: 12px;
    margin-left: 19px;
    line-height: 15px;
    position: relative;
    top: -5px;
    color: #999;
  }
  .el-dropdown-menu__item.is-disabled{
    @include color($color-blue,0.8);
    .pop-bottom{
      @include color($color-blue,0.8);
    }
    &.version-disable{
      color: #999;
      .pop-bottom{
        color: #999;
      }
    }
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    .pop-bottom{
      @include color($color-blue,0.8);
    }
  }
}
</style>
