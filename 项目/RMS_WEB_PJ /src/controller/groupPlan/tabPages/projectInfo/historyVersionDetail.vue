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
                v-for="item in versionList"
                :key="item.versionNo"
                icon="el-icon-document"
                :command="item"
                :disabled="item.versionNo === curVersion.versionNo">
                <span class="pop-vname">{{item.numVersionName}}</span>
                <span class="pop-bottom">{{item.createdBy}} {{formatDate(item.versionCreatedDate)}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="main-content">
        <div class="left-con">

          <!--  TODO : 将下面内容 替换成对应组件即可 -->
          <div id="basic-info">
            <basicInfo :receive-data="projectBaseInfo"></basicInfo>
          </div>

          <div id="attribute-info">
            <!-- 属性信息 -->
            <attributeInfoPreview
              v-if="JSON.stringify(projectAttribute) !== '{}'"
              :receive-data="projectBaseInfo"
              :project-attribute="projectAttribute"></attributeInfoPreview>
            <attributeInfoPreviewDefault
              :receive-data="projectBaseInfo"
              v-else></attributeInfoPreviewDefault>
          </div>

          <div id="product-info" v-if="projectCategory==='u'&&hasProductInfo">
            <product-info-detail
              ref="productInfo"
              :receive-data="projectProductInfoList"></product-info-detail>
          </div>

          <div id="resource-info" v-if="projectCategory==='u'&&hasResourceInfo">
            <res-info-detail
              ref="resourceInfo"
              :receive-data="projectResourceInfo"></res-info-detail>
          </div>

          <div id="team-info">
            <!-- 需求单位 非研发包 -->
            <DSTeamInfoDetail v-if="projectCP === 'ds'" :project-company-list="projectCompanyList" :project-class="projectBaseInfo.projectClass"></DSTeamInfoDetail>
            <!-- 需求单位 研发包 -->
            <DGTeamInfoDetail v-if="projectCP === 'dg'" :project-company-list="projectCompanyList"></DGTeamInfoDetail>
            <!-- 承担单位 非研发包 -->
            <USTeamInfoDetail v-if="projectCP === 'us'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList"></USTeamInfoDetail>
            <!-- 承担单位 研发包 -->
            <UGTeamInfoDetail v-if="projectCP === 'ug'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList"></UGTeamInfoDetail>
          </div>

          <div id="project-budget" ref="projectBudget">
            <!-- 需求单位 非研发包 -->
            <DSProjectBudget v-if="projectCP === 'ds'" :version-no="curVersion.versionNo"></DSProjectBudget>
            <!-- 需求单位 研发包 -->
            <DGProjectBudget v-if="projectCP === 'dg'" :budget-info="costBudgetList"></DGProjectBudget>
            <!-- 承担单位 非研发包、研发包 -->
            <!-- <UProjectBudget v-if="projectCategory==='u'" :budget-info="budgetData"></UProjectBudget> -->
            <!-- 承担单位 总分、分总模式 -->
            <UBudgetDetail v-if="projectCategory==='u'&&budgetData" :budget-info="budgetData"></UBudgetDetail>
          </div>

          <div id="subproject-info"  ref="subproject">
            <!-- 需求单位 -->
            <DSubprojectInfo
              v-if="projectCategory==='d'"
              :receive-data='subProjectInfoList'
              :project-base-info="projectBaseInfo"
              :version-no="curVersion.versionNo"></DSubprojectInfo>
            <!-- 承担单位 -->
            <USubprojectInfo
              v-if="projectCategory==='u'"
              :receive-data='subProjectInfoList'
              :project-base-info="projectBaseInfo"
              :version-no="curVersion.versionNo"></USubprojectInfo>
          </div>

          <div id="milestone" v-if="isShowMilestone && projectCP!=='dg'">
            <!-- 需求单位 非研发包 -->
            <DSMilestoneInfo v-if="projectCP === 'ds'" :receive-data="projectMileStones"></DSMilestoneInfo>
            <!-- 承担单位 非研发包、研发包 -->
            <UMilestoneInfo v-if="projectCategory==='u'" :receive-data="projectMileStones"></UMilestoneInfo>
          </div>
        </div>
        <div class="right-con">
          <span class="history-title">历史版本</span>
          <ul>
            <li
              v-for="item in versionList"
              :key="item.versionNo"
              :class="{'active-version':item.versionNo === curVersion.versionNo}"
              @click="viewHistoryVersion(item)">
              <span class="right-vname"><i class="el-icon-document"></i>{{item.numVersionName}}</span>
              <span class="right-vbottom">{{item.createdBy}} {{formatDate(item.versionCreatedDate)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_groupPlanProject'
import { getStore } from '@/store'

import basicInfo from '@/controller/groupPlan/components/basic/detail'
import DSProjectBudget from '@/controller/groupPlan/components/budget/DSBudget'
import DGProjectBudget from '@/controller/groupPlan/components/budget/DGBudget'
import UBudgetDetail from '@/controller/groupPlan/components/budget/UBudgetDetail'
import DSubprojectInfo from '@/controller/groupPlan/components/subproject/DSubprojectDetail'
import USubprojectInfo from '@/controller/groupPlan/components/subproject/USubprojectDetail'
import DSMilestoneInfo from '@/controller/groupPlan/components/milestone/DSMilestoneDetail'
import UMilestoneInfo from '@/controller/groupPlan/components/milestone/UMilestoneDetail'
import DSTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DSTeamInfo/DSTeamInfoDetail'
import DGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DGTeamInfo/DGTeamInfoDetail'
import USTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/USTeamInfo/USTeamInfoDetail'
import UGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/UGTeamInfo/UGTeamInfoDetail'
import attributeInfoPreview from '@/controller/groupPlan/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '@/controller/groupPlan/components/attributeInfo/detailDefault'
import ProductInfoDetail from '@/controller/groupPlan/components/productInfo/productInfoDetail.vue'
import ResInfoDetail from '@/controller/groupPlan/components/resourceInfo/resInfoDetail.vue'
export default {
  name: 'groupProjectHistory',
  data () {
    return {
      budgetData: {
        isEdit: false,
        projectCode: this.$route.query.projectCode,
        versionNo: this.$route.query.versionNo
      },
      showBackTop: false,
      versionList: [], //版本列表
      curVersion: {
        versionName: '',
        versionNo: ''
      }, //当前版本
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectCompanyList: [], // 团队信息 - 公司列表
      projectTeamList: [], // 团队信息-承担单位项目观察员和专家
      projectAchievementList: [], // 预期成果
      projectMileStones: [], // 里程碑信息
      subProjectInfoList: [], //子项目信息
      isShowMilestone: true, //是否显示里程碑
      projectCode: this.$route.query.projectCode || '',
      typeOptions: [],
      levelList: [],
      developPackage: this.$route.query.developPackage || '',
      projectCategory: this.$route.query.projectCategory || '',
      projectCP: '',
      projectProductInfoList: [], //产品信息
      projectResourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true //项目信息中有资源信息
    }
  },
  components: {
    basicInfo,
    DSProjectBudget,
    DGProjectBudget,
    UBudgetDetail,
    DSubprojectInfo,
    USubprojectInfo,
    DSMilestoneInfo,
    UMilestoneInfo,
    DSTeamInfoDetail,
    DGTeamInfoDetail,
    USTeamInfoDetail,
    UGTeamInfoDetail,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    ProductInfoDetail,
    ResInfoDetail
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
      API.getProjectVersionList(this.projectCode)
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
        path: '/groupPlan/projectContrastVersion',
        query: {
          leftVersionNo: this.curVersion.versionNo,
          projectCode: this.projectCode,
          rightVersionNo: item.versionNo,
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
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
      this.curVersion = item
      this.projectBaseInfo = {}
      this.projectAttribute = {}
      this.costBudgetList = []
      this.projectTeamList = []
      this.projectAchievementList = []
      this.projectMileStones = []
      this.subProjectInfoList = []
      this.projectCompanyList = []
      this.budgetData.versionNo = item.versionNo
      this.getProjectDetail(item.versionNo)
    },
    //获取对应版本的项目详情
    getProjectDetail (versionNo) {
      let params = {
        projectCode: this.projectCode,
        versionNo: versionNo,
        allSubProjectInfo: false
      }
      let interFaceName = ''
      if (this.projectCategory === 'd') {
        interFaceName = 'queryProjectInfoByVersionD'
      } else {
        interFaceName = 'queryProjectInfoByVersionU'
      }
      // if (!interFaceName) return
      API[interFaceName](params)
        .then(res => {
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          this.costBudgetList = res.costBudgetList
          this.projectTeamList = res.projectTeamList
          this.projectCompanyList = res.projectCompanyList
          this.projectAchievementList = res.projectAchievementList
          this.projectMileStones = res.projectMileStoneList
          if (res.projectMileStoneList === null || res.projectMileStoneList.length === 0) {
            this.isShowMilestone = false
          }
          this.subProjectInfoList = res.subProjectInfoList
          document.title = res.projectBaseInfo.projectName || '未定义'

          if (this.projectCategory === 'u') {
            //产品信息
            this.projectProductInfoList = res.projectProductInfoList || []
            this.hasProductInfo = this.projectProductInfoList && this.projectProductInfoList.length > 0
            //资源信息
            this.projectResourceInfo = res.projectResourceInfo || {}
            this.hasResourceInfo = !!((this.projectResourceInfo && JSON.stringify(this.projectResourceInfo) !== '{}'))
          }
        })
        .catch(e => {
          this.projectBaseInfo = {}
          this.projectAttribute = {}
          this.costBudgetList = []
          this.projectTeamList = []
          this.projectAchievementList = []
          this.projectMileStones = []
          this.subProjectInfoList = []
          this.projectCompanyList = []
          this.projectProductInfoList = []
          this.projectResourceInfo = {}
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
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
    this.projectCode = this.$route.query.projectCode || ''
    this.developPackage = this.$route.query.developPackage || ''
    this.projectCategory = this.$route.query.projectCategory || ''
    let isPackage = this.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.projectCategory + isPackage

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
