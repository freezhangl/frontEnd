<template>
  <div class="history-detail">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <div class="head-title">
          {{curVersion.numVersionName}}
        </div>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="main-btn-con">
        <i class="font-icon svgfont-back" @click="clickBack">返回</i>
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
                :disabled="item.versionNo === curVersion.versionNo">
                <span class="pop-vname" v-if="index!=0">{{item.numVersionName}}</span>
                <span class="pop-vname" v-if="index==0">{{item.numVersionName}}(最新)</span>
                <span class="pop-bottom">{{item.createdBy}} {{formatDate(item.versionCreatedDate)}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="main-content">
        <div class="left-con">
          <div id="basic-info">
            <basicInfo :receive-data="projectBaseInfo"></basicInfo>
          </div>

          <div id="property-info">
            <attributeInfoPreview
              v-if="projectAttribute"
              :receive-data="projectBaseInfo"
              :project-attribute="projectAttribute"></attributeInfoPreview>
            <attributeInfoPreviewDefault
              :receive-data="projectBaseInfo"
              v-if="!projectAttribute"></attributeInfoPreviewDefault>
          </div>

          <div id="product-info" v-if="hasProductInfo">
            <product-info-detail
              ref="productInfo"
              :receive-data="productInfoList"></product-info-detail>
          </div>

          <div id="resource-info" v-if="hasResourceInfo">
            <res-info-detail
              ref="resourceInfo"
              :receive-data="resourceInfo"></res-info-detail>
          </div>

          <div id="team-info">
            <teamInfo :receive-data="projectTeamList"></teamInfo>
          </div>

          <div id="project-budget">
            <projectBudget :receive-data="costBudgetList"></projectBudget>
          </div>

          <div id="task-ach">
            <subproject type="detail" :receive-data="subProjectInfoList"></subproject>
          </div>

          <div id="milestone" v-if="isShowMilestone">
            <milestoneInfo :receive-data="projectMileStones"></milestoneInfo>
          </div>
        </div>
        <div class="right-con">
          <span class="history-title">历史版本</span>
          <ul>
            <li
              v-for="(item,index) in versionList"
              :key="item.versionNo"
              :class="{'active-version':item.versionNo === curVersion.versionNo}"
              @click="viewHistoryVersion(item)">
              <span class="right-vname" v-if="index!=0"><i class="el-icon-document"></i>{{item.numVersionName}}</span>
              <span class="right-vname" v-if="index==0"><i class="el-icon-document"></i>{{item.numVersionName}}(最新)</span>
              <span class="right-vbottom">{{item.createdBy}} {{formatDate(item.versionCreatedDate)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import merge from 'webpack-merge'
import API from '@/serve/API_project'
import { getStore } from '@/store'
import basicInfo from '../../extraProject/components/basic/detail'
import teamInfo from '../../extraProject/components/teamInfo/detail'
import projectBudget from '../../extraProject/components/budget/detail'
import milestoneInfo from '../../extraProject/components/basic/milestone/detailListMilestone'
import subproject from '../../extraProject/components/subproject/detail'
import attributeInfoPreview from '../../extraProject/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '../../extraProject/components/attributeInfo/detailDefault'
import ProductInfoDetail from '../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../extraProject/components/resource/resInfoDetail.vue'
export default {
  name: 'historyVersionDetail',
  data () {
    return {
      showBackTop: false,
      versionList: [], //版本列表
      curVersion: {
        versionName: '',
        versionNo: ''
      }, //当前版本
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 预期成果
      projectMileStones: [], // 里程碑信息
      isShowMilestone: true, //是否显示里程碑
      projectCode: this.$route.query.projectCode,
      typeOptions: [],
      levelList: [],
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true //资源信息中有产品信息
    }
  },
  components: {
    basicInfo,
    teamInfo,
    projectBudget,
    milestoneInfo,
    subproject,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    ResInfoDetail,
    ProductInfoDetail
  },
  mounted () {
    this.getProjectVersion()
    this.getProjectDetail(this.$route.query.versionNo)
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
      let params = {
        projectCode: this.projectCode,
        userAccount: getStore().getters['USERENTITY/userInfo'].userAuth.uid
      }
      API.getProjectVersion(params)
        .then(res => {
          if (res) {
            res.forEach((item, index) => {
              item.numVersionName = `#${res.length - index} ${item.versionName}`
            })
            this.versionList = res
            this.versionList.some(version => {
              if (version.versionNo === this.$route.query.versionNo) {
                this.curVersion = version
                return true
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
    //对比其他版本
    contrastVersion (item) {
      this.$router.push({
        path: '/projectInfo/contrastVersion',
        query: {
          leftVersionNo: this.curVersion.versionNo,
          projectCode: this.projectCode,
          rightVersionNo: item.versionNo
        }
      })
      // this.curVersion = item
    },
    //设置里程碑是否可见
    setMilestoneVisible (show) {
      this.isShowMilestone = show
    },
    //查看历史版本
    viewHistoryVersion (item) {
      if (item.versionNo === this.curVersion.versionNo) {
        return
      }
      // this.curVersion = item
      // this.getProjectDetail(item.versionNo)
      this.$router.push({
        query: merge(this.$route.query, { 'versionNo': item.versionNo })
      })
      location.reload()
    },
    //获取对应版本的项目详情
    async getProjectDetail (versionNo) {
      // await this.getProjectType()
      // await this.getProjectLevel()
      let params = {
        projectCode: this.projectCode,
        versionNo: versionNo
      }
      API.projectInfoByVersion(params)
        .then(res => {
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          //产品信息
          this.productInfoList = res.projectProductInfoList || []
          this.hasProductInfo = this.productInfoList && this.productInfoList.length > 0
          //资源信息
          this.resourceInfo = res.projectResourceInfoDto || {}
          this.hasResourceInfo = !!((this.resourceInfo && JSON.stringify(this.resourceInfo) !== '{}'))
          this.costBudgetList = res.costBudgetList
          this.projectTeamList = res.projectTeamList
          this.subProjectInfoList = res.subProjectInfoList || []
          this.subProjectInfoList.forEach(item => {
            item.versionNo = versionNo
            item.isUpdate = false
          })
          this.projectMileStones = res.projectMileStones
          document.title = res.projectBaseInfo.projectName || '未定义'
        })
        .catch(e => {
          this.projectBaseInfo = []
          this.projectAttribute = {}
          this.costBudgetList = []
          this.projectTeamList = []
          this.subProjectInfoList = []
          this.projectMileStones = []
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //项目类型
    getProjectType () {
      API.dictValByCode('PROJECT-TYPE')
        .then(res => {
          this.typeOptions = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    //项目级别
    getProjectLevel () {
      API.dictValByCode('PROJECT-LEVEL')
        .then(res => {
          this.levelList = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    //回到顶部
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    scrollWindow () {
      let doc = document.documentElement || document.body
      let sTop = doc.scrollTop
      if (sTop > 0) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    }
  },
  created () {
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  }
}
</script>
<style lang="scss" scoped>
.history-detail{
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
      .font-icon{
        font-size: 14px;
        margin-right: 20px;
        cursor: pointer;
        &:before {
          margin-right: 5px;
        }
      }
      .version-info{
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

    .main-content{
      display: flex;
      .left-con{
        width: 847px;
      }
      .right-con{
        width: 190px;
        margin-left: 20px;
        background: #fff;
        flex-shrink: 0;
        .history-title{
          width: 100%;
          display: inline-block;
          height: 50px;
          line-height: 50px;
          padding-left: 10px;
          border-bottom: 1px solid #E5E5E5;
        }
        ul{
          padding: 0;
          li{
            padding: 10px;
            cursor: pointer;
            &:not(.active-version):hover{
              @include color($color-blue,0.8);
              @include background-color($color-blue,0.1);
              .right-vbottom{
                @include color($color-blue,0.8);
              }
            }
            &.active-version{
              @include color($color-blue,0.8);
              .right-vbottom{
                @include color($color-blue,0.8);
              }
            }
          }
          .right-vname{
            i{
              margin-right: 8px;
            }
          }
          .right-vbottom{
            display: block;
            font-size: 12px;
            margin-left: 19px;
            margin-top: 5px;
            line-height: 15px;
            color: #999;
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
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    .pop-bottom{
      @include color($color-blue,0.8);
    }
  }
}
</style>
