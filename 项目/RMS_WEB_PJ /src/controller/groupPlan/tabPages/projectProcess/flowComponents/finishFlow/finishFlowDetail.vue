<template>
  <div class="finish-detail">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span>
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-back" v-if="createdBy && userId === createdBy"  @click="rollBackProcessInstance"><span class="global-family">撤回流程</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">{{finishTitle}}</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <div v-if="scoreBody && Object.keys(scoreBody).length">
          <scoreEvaluateDetail
            :data="scoreBody"
            v-if="scoreBody.groupFinishScoreUndertakeList.length ||
              scoreBody.groupFinishScoreUniteAssaultList.length"></scoreEvaluateDetail>
        </div>
        <div class="approval-form">
          <!-- 结项评审通过时间：{{planFinishTime || '暂未设置'}} -->
          <el-form :label-position="right" label-width="130px" :model="extendedAttributes">
            <el-form-item label="结项评审通过时间:">
              {{extendedAttributes.planFinishTime || '暂未设置'}}
            </el-form-item>
            <el-form-item label="备注:">
              {{extendedAttributes.remark}}
            </el-form-item>
          </el-form>
        </div>

        <!--  TODO 引入对应组件即可 -->
        <div id="basic-info">
          <basicInfo :receive-data="projectBaseInfo"></basicInfo>
        </div>

        <div id="property-info">
          <!-- 属性信息 -->
          <attributeInfoPreview
            v-if="JSON.stringify(projectAttribute) !== '{}'"
            :receive-data="projectBaseInfo"
            :project-attribute="projectAttribute"></attributeInfoPreview>
          <attributeInfoPreviewDefault
            :receive-data="projectBaseInfo"
            v-else></attributeInfoPreviewDefault>
        </div>

        <div id="product-info" v-if="projectCategory!==''&&projectCategory==='u'&&hasProductInfo">
          <product-info-detail
            ref="productInfo"
            :receive-data="projectProductInfoList"></product-info-detail>
        </div>

        <div id="resource-info" v-if="projectCategory!==''&&projectCategory==='u'&&hasResourceInfo">
          <res-info-detail
            ref="resourceInfo"
            :receive-data="projectResourceInfo"></res-info-detail>
        </div>

        <div id="team-info">
          <!-- 需求单位 非研发包 -->
          <DSTeamInfoDetail v-if="projectCP !=='' && projectCP === 'ds'" :project-company-list="projectCompanyList" :project-class="projectBaseInfo.projectClass"></DSTeamInfoDetail>
          <!-- 需求单位 研发包 -->
          <DGTeamInfoDetail v-if="projectCP !=='' && projectCP === 'dg'" :project-company-list="projectCompanyList"></DGTeamInfoDetail>
          <!-- 承担单位 非研发包 -->
          <USTeamInfoDetail v-if="projectCP !=='' && projectCP === 'us'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList"></USTeamInfoDetail>
          <!-- 承担单位 研发包 -->
          <UGTeamInfoDetail v-if="projectCP !=='' && projectCP === 'ug'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList"></UGTeamInfoDetail>
        </div>

        <div id="project-budget" ref="projectBudget">
          <!-- 需求单位 非研发包 -->
          <DSProjectBudgetStop v-if="projectCode && projectCP !=='' && projectCP === 'ds'" :budget-info="budgetData"></DSProjectBudgetStop>
          <!-- 需求单位 研发包 -->
          <DGProjectBudget v-if="projectCP !=='' && projectCP === 'dg'" :budget-info="costBudgetList"></DGProjectBudget>
          <!-- 承担单位 非研发包、研发包 -->
          <!-- <UProjectBudget v-if="projectCode && projectCP !=='' && projectCategory==='u'" :budget-info="budgetData"></UProjectBudget> -->
          <!-- 承担单位 总分、分总模式 -->
          <UBudgetDetail v-if="projectCode && projectCP !=='' && projectCategory==='u'" :budget-info="budgetData"></UBudgetDetail>
        </div>

        <div id="subproject-info"  ref="subproject">
          <!-- 需求单位 -->
          <DSubprojectInfo
            v-if="projectCategory==='d'"
            :receive-data='subProjectInfoList'
            :project-base-info="projectBaseInfo"
            :version-no="budgetData.versionNo"></DSubprojectInfo>
          <!-- 承担单位 -->
          <USubprojectInfo
            v-if="projectCategory==='u'"
            :receive-data='subProjectInfoList'
            :project-base-info="projectBaseInfo"
            :version-no="budgetData.versionNo"></USubprojectInfo>
        </div>

        <div id="milestone" v-if="isShowMilestone && projectCP!=='dg'">
          <!-- 需求单位 非研发包 -->
          <DSMilestoneInfo v-if="projectCP === 'ds'" :receive-data="projectMileStoneList"></DSMilestoneInfo>
          <!-- 承担单位 非研发包、研发包 -->
          <UMilestoneInfo v-if="projectCategory==='u'" :receive-data="projectMileStoneList"></UMilestoneInfo>
        </div>
        <div id="approved-con" v-if="isShowApprove&&projectApprove.historyFlag === '0'">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
        <project-document-detail id="project-doc" v-if="docVisible" :file-list="attachmentFileList"></project-document-detail>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_businessFlow'
import flowAPI from '@/serve/API_flow'
import { getStore } from '@/store'
import projectDocumentDetail from '@/controller/groupPlan/components/attachments/detail'
import basicInfo from '@/controller/groupPlan/components/basic/detail'
import attributeInfoPreview from '@/controller/groupPlan/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '@/controller/groupPlan/components/attributeInfo/detailDefault'
import DSTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DSTeamInfo/DSTeamInfoDetail'
import DGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DGTeamInfo/DGTeamInfoDetail'
import USTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/USTeamInfo/USTeamInfoDetail'
import UGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/UGTeamInfo/UGTeamInfoDetail'
import DSProjectBudgetStop from '@/controller/groupPlan/components/budget/DSBudgetStop'
import DGProjectBudget from '@/controller/groupPlan/components/budget/DGBudget'
import UBudgetDetail from '@/controller/groupPlan/components/budget/UBudgetDetail'
import DSubprojectInfo from '@/controller/groupPlan/components/subproject/DSubprojectDetail'
import USubprojectInfo from '@/controller/groupPlan/components/subproject/USubprojectDetail'
import DSMilestoneInfo from '@/controller/groupPlan/components/milestone/DSMilestoneDetail'
import UMilestoneInfo from '@/controller/groupPlan/components/milestone/UMilestoneDetail'
import scoreEvaluateDetail from './components/scoreEvaluateDetail'
import { setApprovals } from '@/common/common'
import ProductInfoDetail from '@/controller/groupPlan/components/productInfo/productInfoDetail.vue'
import ResInfoDetail from '@/controller/groupPlan/components/resourceInfo/resInfoDetail.vue'
import { AddProductAndResource } from '@/common/flowCommonMixins'
import { flowRollback } from '@/common/flowRollbackMixins'

export default {
  mixins: [AddProductAndResource, flowRollback],
  data () {
    return {
      navMenus: [
        {
          name: '基本信息',
          id: 'basic-info'
        },
        {
          name: '属性信息',
          id: 'property-info'
        },
        { name: '产品信息', id: 'product-info' },
        { name: '资源信息', id: 'resource-info' },
        {
          name: '团队信息',
          id: 'team-info'
        },
        {
          name: '实际成本',
          id: 'project-budget'
        },
        {
          name: '子项目',
          id: 'subproject-info'
        },
        {
          name: '里程碑',
          id: 'milestone'
        },
        {
          name: '审批意见',
          id: 'approved-con'
        },
        {
          name: '文档资料',
          id: 'project-doc'
        }
      ],
      finishTitle: '', //项目流程名称
      projectName: '', // 项目名称
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      businessType: '', // 业务单据类型值编码
      projectCode: '',
      backUrl: '/groupPlan/projectDetail/' + this.$route.query.projectCode, //关闭后页面跳转地址
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      approveNo: this.$route.query.approveNo, // 业务流水号
      processInstId: this.$route.query.processInstID, // 流程实例ID
      // planFinishTime: null, // 结项审批时间
      extendedAttributes: {
        remark: '', //备注信息
        planFinishTime: null // 结项审批时间-TODO需要替换
      },
      docVisible: false, //附件组件是否显示，等待数据获取到再渲染
      attachmentFileList: [], // 单据附件列表
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      projectCompanyList: [], // 团队信息 - 公司列表
      projectTeamList: [], // 团队信息-承担单位项目观察员和专家
      costBudgetList: [], // 项目预算
      budgetData: {
        isEdit: false,
        projectCode: '',
        versionNo: '',
        isStopProcess: true
      },
      subProjectInfoList: [], //子项目信息
      isShowMilestone: true,
      projectMileStoneList: [], // 里程碑信息
      isShowApprove: true,
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      scoreBody: {},
      queryScore: false,
      showBackTop: false
    }
  },
  components: {
    projectDocumentDetail,
    basicInfo,
    DSTeamInfoDetail,
    DGTeamInfoDetail,
    USTeamInfoDetail,
    UGTeamInfoDetail,
    DSProjectBudgetStop,
    DGProjectBudget,
    UBudgetDetail,
    DSubprojectInfo,
    USubprojectInfo,
    DSMilestoneInfo,
    UMilestoneInfo,
    scoreEvaluateDetail,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    ProductInfoDetail,
    ResInfoDetail
  },
  computed: {},
  watch: {
    projectName: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        document.title = val + '结项申请'
      }
    },
    developPackage: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.developPackage = val
      }
    },
    projectCategory: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        // 各个区块组件的引入判断
        let isPackage = this.developPackage === 'IS_RD_0' ? 's' : 'g'
        this.projectCP = val + isPackage
        switch (this.projectCP) {
          case 'dg':
            this.finishTitle = ''
            break
          case 'ds':
            this.finishTitle = '集团统筹项目-需求单位项目结项申请'
            break
          case 'ug':
            this.finishTitle = '集团统筹项目-承担单位项目结项申请'
            break
          case 'us':
            this.finishTitle = '集团统筹项目-承担单位项目结项申请'
            break
        }
        // 业务单据类型判断
        switch (val) {
          case 'd':
            this.businessType = 'BT-DEMAND-FINISH'
            this.deleteNavItem('product-info')
            this.deleteNavItem('resource-info')
            break
          case 'u':
            this.businessType = 'BT-UNDERTAKER-FINISH'
            break
        }
      }
    }
  },
  created () {
    this.projectCode = this.$route.params.projectCode || ''

    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getPageUrl()
    this.queryFinishScore()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    slideNav (menu, idx) {
      if (this.timer) {
        window.clearTimeout(this.timer)
      }

      this.navIdx = idx
      this.clearFlag = false
      document.getElementById(menu.id)
        .scrollIntoView({
          behavior: 'smooth'
        })

      this.timer = setTimeout(() => {
        this.clearFlag = true
      }, 1000)
    },
    scrollWindow () {
      if (!this.clearFlag) {
        return
      }

      let doc = document.documentElement || document.body
      let sTop = doc.scrollTop
      let cHei = doc.clientHeight
      let sHei = doc.scrollHeight

      if (sTop > 500) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }

      if (sTop + cHei + 5 >= sHei) {
        this.navIdx = this.navMenus.length - 1
        return false
      }

      let posArr = []

      this.navMenus.forEach(menu => {
        posArr.push(document.getElementById(menu.id).offsetTop)
      })

      let _idx = 0

      if (posArr[posArr.length - 1] <= sTop) {
        this.navIdx = posArr.length - 1
      } else {
        for (let i = 0; i < posArr.length - 1; i++) {
          if (sTop >= posArr[i] && sTop < posArr[i + 1]) {
            _idx = i
            break
          }
        }
        this.navIdx = _idx
      }
    },
    // 判断入口参数
    getPageUrl () {
      if (this.$route.query.approveNo) {
        this.getDetailByApproveNo()
      } else {
        this.getProcessInstDetailById()
      }
    },
    // 根据流程实例ID-processInstId获取业务流水号，从而获取单据详情
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(Number(this.$route.query.processInstID))
        .then(res => {
          this.approveNo = res.businessSerialNumber
          this.getDetailByApproveNo()
          if (!this.scoreBody.unitType) {
            this.queryFinishScore()
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取结项流程详细信息
    getDetailByApproveNo () {
      let param = {
        approveNo: this.approveNo
      }
      API.queryApprove(param)
        .then(res => {
          if (res === null || res.approveRecord === null || res.approveRecord.total === 0) {
            this.isShowApprove = false
            let index = -1
            this.navMenus.some((ele, i) => {
              if (ele.id === 'approved-con') {
                index = i
                return true
              }
            })
            if (index > -1) {
              this.navMenus.splice(index, 1)
            }
          }
          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            let extendsObj = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.extendedAttributes.planFinishTime = this.formatDate(extendsObj.planFinishTime)
            this.extendedAttributes.remark = extendsObj.remark || ''
          }
          this.projectApprove = res.projectApproveInfo
          this.createdBy = this.projectApprove ? this.projectApprove.createdBy : ''
          this.attachmentFileList = res.attachmentFileList
          if (res.projectInfo) {
            this.projectBaseInfo = res.projectInfo.projectBaseInfo
            this.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.budgetData.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.budgetData.versionNo = res.versionNo
            this.projectName = res.projectInfo.projectBaseInfo.projectName
            this.developPackage = res.projectInfo.projectBaseInfo.developPackage
            this.projectCategory = res.projectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
            this.projectAttribute = res.projectInfo.projectAttribute
            this.costBudgetList = res.projectInfo.costBudgetList
            this.projectCompanyList = res.projectInfo.projectCompanyList
            this.projectTeamList = res.projectInfo.projectTeamList
            this.subProjectInfoList = res.projectInfo.subProjectInfoList
            this.projectMileStoneList = res.projectInfo.projectMileStoneList
            if (res.projectInfo.projectMileStoneList === null || res.projectInfo.projectMileStoneList.length === 0) {
              this.isShowMilestone = false
              let index = -1
              this.navMenus.some((ele, i) => {
                if (ele.id === 'milestone') {
                  index = i
                  return true
                }
              })
              if (index > -1) {
                this.navMenus.splice(index, 1)
              }
            }
            if (res.approveRecord && res.approveRecord.approvals && this.projectCategory === 'd' && this.developPackage === 'IS_RD_0') {
              setApprovals(res.approveRecord.approvals, this.projectCompanyList)
            }
            this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals

            if (this.projectCategory === 'u') {
              //产品信息
              this.projectProductInfoList = res.projectInfo.projectProductInfoList || []
              this.hasProductInfo = this.projectProductInfoList && this.projectProductInfoList.length > 0
              if (!this.hasProductInfo) {
                this.deleteNavItem('product-info')
              }
              //资源信息
              this.projectResourceInfo = res.projectInfo.projectResourceInfo || {}
              this.hasResourceInfo = !!((this.projectResourceInfo && JSON.stringify(this.projectResourceInfo) !== '{}'))
              if (!this.hasResourceInfo) {
                this.deleteNavItem('resource-info')
              }
            }
          }
          this.docVisible = true
          if (!this.scoreBody.unitType) {
            this.queryFinishScore()
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取结项流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 流程跟踪
    processTrace () {
      // 判断是否有历史数据
      if (this.projectApprove.historyFlag === '0' && this.approveNo) {
        // 存在历史数据，则预览PDF，需要从流程接口查询processInstId
        flowAPI.getBusinessProcessInst(this.approveNo)
          .then(res => {
            this.processInstId = res.processInstId
            this.$router.push({
              path: '/processTrace',
              query: {
                businessSerialNumber: this.approveNo,
                processInstId: this.processInstId,
                userId: this.userId,
                fileCode: this.projectApprove.historyApproveFileId,
                historyFlag: this.projectApprove.historyFlag
              }
            })
          })
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '获取业务流程实例信息失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.$router.push({
          path: '/processTrace',
          query: {
            businessSerialNumber: this.approveNo,
            processInstId: this.processInstId,
            userId: this.userId,
            fileCode: this.projectApprove.historyApproveFileId,
            historyFlag: this.projectApprove.historyFlag
          }
        })
      }
    },
    // 关闭流程信息页面
    closeProcessInfo () {
      if (this.$route.query.projectCode) {
        this.$router.push({
          path: this.backUrl,
          query: {
            activeTab: 'projectProgress',
            flowPoint: '结项流程',
            developPackage: this.developPackage,
            projectCategory: this.projectCategory
          }
        })
      } else {
        window.close()
      }
    },
    // 获取打分列表
    queryFinishScore () {
      if (this.projectCategory === 'u') return // 承担单位-直接退出
      let param = {
        projectCode: this.projectCode || this.budgetData.projectCode || this.$route.query.projectCode,
        approveNo: this.approveNo || this.$route.query.approveNo
      }
      if (!param.approveNo) return // 参数不全-直接退出
      if (!param.projectCode) return
      if (this.queryScore) return // 阻止重复请求
      this.queryScore = true
      API.queryFinishScore(param)
        .then(res => {
          if (res) {
            if (!res.groupFinishScoreUniteAssaultList) {
              res.groupFinishScoreUniteAssaultList = []
            }
            if (!res.groupFinishScoreUndertakeList) {
              res.groupFinishScoreUndertakeList = []
            }
            this.scoreBody = res
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  }
}
</script>
<style  lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-con{
    width: 1000px !important;
  }
  /deep/ .main-container{
    width: 1000px !important;
  }
  /deep/ .nav-menu{
    left: calc(50% + 520px) !important;
  }
}

@media screen and (max-width: 1364px){
  /deep/ .head-con{
    width: 960px !important;
  }
  /deep/ .main-container{
    width: 960px !important;
  }
  /deep/ .nav-menu{
    left: calc(50% + 500px) !important;
  }
}

.finish-detail{
  /deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
  overflow: auto;
  background : #f6f6f6;
  min-height: 100vh;
  .back-top{
    z-index: 100;
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
    i{
      margin-right: 10px;
      cursor: pointer;
      &:before {
        margin-right: 5px;
      }
    }
    .head-con{
      height: 50px;
      line-height: 50px;
      width: 1180px;
      margin: 0 auto;

      .logo-img{
        float: right;
        margin-top: 15px;
      }
      .approve-icon{
        font-size: 14px;
        &:before{
          vertical-align: -2px;
        }
      }
    }
  }

  .main-container{
    width: 1180px;
    margin: 0 auto;
    .project-title{
      font-family: inherit;
      font-size: 26px;
      font-weight: 600;
      color: #333333;
      text-align: center;
      line-height: 26px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .top-opt-con{
      display: flex;
      align-items: center;
      background: #f6f6f6;
      height: 70px;

      .btn-opt{
        font-family: inherit;
        font-size: 14px;
        color: #333;
        text-align: center;
        line-height: 18px;
        margin-right: 20px;
        font-weight: bold;
        cursor: pointer;

        i{
          margin-right: 5px;
        }
      }

    }

    .nav-menu{
      position: fixed;
      left: calc(50% + 630px);
      top : 120px;
      border-left: 1px solid #e5e5e5;
      padding : 20px 10px;
      z-index: 9;

      .nav-menu-item{
        display: block;
        position: relative;
        margin: 12px 0;

        &:hover{
          @include color();
        }

        &.item-active{
          @include color();

          &::after{
            display: inline-block;
            position: absolute;
            content :'';
            left : -17px;
            top : 3px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            @include border();
            border-width: 4px !important;
            background: #fff;
          }
        }

      }
    }

    }
    .main-content{
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      .approval-form{
        background:#fff;
        // height: 70px;
        line-height: 35px;
        margin-top: 30px;
        margin-bottom: 20px;
        padding: 20px 30px;
        font-family: inherit;
        font-size: 14px;
        color: #333333;
      }
    }
  }
</style>
