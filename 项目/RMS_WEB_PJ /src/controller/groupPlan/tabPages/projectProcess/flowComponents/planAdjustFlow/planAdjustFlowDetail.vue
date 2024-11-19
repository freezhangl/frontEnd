<template>
  <div class="change-flow-edit">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowApprove"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-back" v-if="createdBy && userId === createdBy"  @click="rollBackProcessInstance"><span class="global-family">撤回流程</span></i>
          <i class="approve-icon svgfont-btn-detail" @click="viewChangeDetail"><span class="global-family">变更详情</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">{{changeTitle}}</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">

        <change-reason :info="changeReason">
        </change-reason>

        <div id="basic-info">
          <basicInfo :receive-data="projectBaseInfo">
          </basicInfo>
        </div>

        <div id="property-info">
          <attributeInfoPreview
            v-if="JSON.stringify(projectAttribute) !== '{}'"
            :receive-data="projectBaseInfo"
            :project-attribute="projectAttribute">
          </attributeInfoPreview>
          <attributeInfoPreviewDefault
            :receive-data="projectBaseInfo"
            v-else>
          </attributeInfoPreviewDefault>
        </div>

        <div id="team-info">
          <!-- 需求单位 非研发包 -->
          <DSTeamInfoDetail v-if="projectCP !=='' & projectCP === 'ds'" :project-company-list="projectCompanyList" :project-class="projectBaseInfo.projectClass">
          </DSTeamInfoDetail>
          <!-- 需求单位 研发包 -->
          <DGTeamInfoDetail v-if="projectCP !=='' & projectCP === 'dg'" :project-company-list="projectCompanyList">
          </DGTeamInfoDetail>
          <!-- 承担单位 非研发包 -->
          <USTeamInfoDetail v-if="projectCP !=='' & projectCP === 'us'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList">
          </USTeamInfoDetail>
          <!-- 承担单位 研发包 -->
          <UGTeamInfoDetail v-if="projectCP !=='' & projectCP === 'ug'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList">
          </UGTeamInfoDetail>
        </div>

        <div id="project-budget" ref="projectBudget">
          <!-- 需求单位 非研发包 -->
          <DSProjectBudget v-if="projectCP !=='' && projectCP === 'ds'" :project-code="projectCode" :version-no="projectApprove.versionNo">
          </DSProjectBudget>
          <!-- 需求单位 研发包 -->
          <DGProjectBudget v-if="projectCP !=='' && projectCP === 'dg'" :budget-info="costBudgetList">
          </DGProjectBudget>
          <!-- 承担单位 非研发包、研发包 -->
          <UProjectBudget v-if="projectCode && projectCP !=='' && projectCategory==='u'" :budget-info="budgetData">
          </UProjectBudget>
        </div>

        <div id="subproject-info"  ref="subproject">
          <!-- 需求单位 -->
          <DSubprojectInfo
            v-if="projectCategory !=='' & projectCategory==='d'"
            :receive-data='subProjectInfoList'
            :project-base-info="projectBaseInfo"
            :version-no="projectApprove.versionNo">
          </DSubprojectInfo>
          <!-- 承担单位 -->
          <USubprojectInfo
            v-if="projectCategory !=='' & projectCategory==='u'"
            :receive-data='subProjectInfoList'
            :project-base-info="projectBaseInfo"
            :version-no="projectApprove.versionNo">
          </USubprojectInfo>
        </div>

        <div id="milestone" v-if="isShowMilestone && projectCP!=='dg'">
          <!-- 需求单位 非研发包 -->
          <DSMilestoneInfo v-if="projectCP !=='' & projectCP === 'ds'" :receive-data="projectMileStoneList">
          </DSMilestoneInfo>
          <!-- 承担单位 非研发包、研发包 -->
          <UMilestoneInfo v-if="projectCategory !=='' & projectCategory==='u'" :receive-data="projectMileStoneList">
          </UMilestoneInfo>
        </div>
        <div id="approved-con" v-if="isShowApprove&&projectApprove.historyFlag === '0'">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
        <project-document-detail
          v-if="docVisible"
          id="project-doc"
          :file-list="attachmentFileList">
        </project-document-detail>
      </div>
    </div>
  </div>
</template>
<script>
import { getStore } from '@/store'
import API from '@/serve/API_businessFlow'
import flowAPI from '@/serve/API_flow'
import projectDocumentDetail from '@/controller/groupPlan/components/attachments/detail'
import basicInfo from '@/controller/groupPlan/components/basic/detail'
import attributeInfoPreview from '@/controller/groupPlan/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '@/controller/groupPlan/components/attributeInfo/detailDefault'
import DSTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DSTeamInfo/DSTeamInfoDetail'
import DGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DGTeamInfo/DGTeamInfoDetail'
import USTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/USTeamInfo/USTeamInfoDetail'
import UGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/UGTeamInfo/UGTeamInfoDetail'
import DSProjectBudget from '@/controller/groupPlan/components/budget/DSBudget'
import DGProjectBudget from '@/controller/groupPlan/components/budget/DGBudget'
import UProjectBudget from '@/controller/groupPlan/components/budget/UBudget'
import DSubprojectInfo from '@/controller/groupPlan/components/subproject/DSubprojectDetail'
import USubprojectInfo from '@/controller/groupPlan/components/subproject/USubprojectDetail'
import DSMilestoneInfo from '@/controller/groupPlan/components/milestone/DSMilestoneDetail'
import UMilestoneInfo from '@/controller/groupPlan/components/milestone/UMilestoneDetail'
import changeReason from './planAdjustReason/detail'
import { setApprovals } from '@/common/common'
import { flowRollback } from '@/common/flowRollbackMixins'

export default {
  mixins: [flowRollback],
  name: 'planAdjustFlowDetail',
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
        {
          name: '团队信息',
          id: 'team-info'
        },
        {
          name: '项目预算',
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
      changeTitle: '', //项目流程的标题
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      businessType: 'BT-DEMAND-PLAN-CHANGE', // 单据类型
      backUrl: '/groupPlan/projectDetail/' + this.$route.query.projectCode, //关闭后页面跳转地址
      projectCode: this.$route.query.projectCode,
      approveNo: this.$route.query.approveNo,
      processInstId: this.$route.query.processInstID, // 流程实例ID
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      changeReason: '', //变更理由
      projectName: '', // 项目名称
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
        versionNo: ''
      },
      subProjectInfoList: [], //子项目信息
      isShowMilestone: true,
      projectMileStoneList: [], // 里程碑信息
      isShowApprove: true, //是否显示审批组件
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      processParams: {
        businessSerialNumber: this.$route.query.approveNo, //业务流水号
        processInstId: this.$route.query.processInstID, //流程实例ID
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid
      }
    }
  },
  components: {
    projectDocumentDetail,
    basicInfo,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    DSTeamInfoDetail,
    DGTeamInfoDetail,
    USTeamInfoDetail,
    UGTeamInfoDetail,
    DSProjectBudget,
    DGProjectBudget,
    UProjectBudget,
    DSubprojectInfo,
    USubprojectInfo,
    DSMilestoneInfo,
    UMilestoneInfo,
    changeReason
  },
  computed: {
  },
  created () {
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getPageUrl()
  },
  watch: {
    projectName: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        document.title = val + '计划调整申请'
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
        this.changeTitle = '集团统筹项目-需求单位项目计划调整申请'
      }
    }
  },
  methods: {
    // 判断入口参数
    getPageUrl () {
      if (this.$route.query.approveNo) {
        this.getDetailByApproveNo()
      } else {
        this.getProcessInstDetailById()
      }
    },
    //查询变更流程详情
    async getDetailByApproveNo () {
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
          this.attachmentFileList = res.attachmentFileList
          this.docVisible = true
          this.projectApprove = res.projectApproveInfo
          this.createdBy = this.projectApprove ? this.projectApprove.createdBy : ''
          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            let extendsObj = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.changeReason = extendsObj.changeDescription
          }
          if (res.projectInfo) {
            this.developPackage = res.projectInfo.projectBaseInfo.developPackage
            this.projectCategory = res.projectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
            this.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.projectName = res.projectInfo.projectBaseInfo.projectName
            this.projectBaseInfo = res.projectInfo.projectBaseInfo
            this.projectAttribute = res.projectInfo.projectAttribute
            this.costBudgetList = res.projectInfo.costBudgetList
            this.projectTeamList = res.projectInfo.projectTeamList
            this.projectCompanyList = res.projectInfo.projectCompanyList
            this.subProjectInfoList = res.projectInfo.subProjectInfoList
            this.costBudgetList = res.projectInfo.costBudgetList
            this.budgetData.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.budgetData.versionNo = res.versionNo
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
          }
          if (res.approveRecord && res.approveRecord.approvals && this.projectCategory === 'd' && this.developPackage === 'IS_RD_0') {
            setApprovals(res.approveRecord.approvals, this.projectCompanyList)
          }
          this.approvalOpinionList = res.approveRecord ? res.approveRecord.approvals : []
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取变更流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 根据流程实例ID-processInstId获取业务流水号，从而获取单据详情
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(Number(this.$route.query.processInstID))
        .then(res => {
          this.approveNo = res.businessSerialNumber
          this.processParams.businessSerialNumber = res.businessSerialNumber
          this.getDetailByApproveNo()
        })
        .catch(e => {
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
    //关闭
    closeFlowApprove () {
      if (this.$route.query.projectCode) {
        this.$router.push({
          path: this.backUrl,
          query: {
            activeTab: 'projectProgress',
            flowPoint: '计划调整流程',
            developPackage: this.developPackage,
            projectCategory: this.projectCategory
          }
        })
      } else {
        window.close()
      }
    },
    //变更详情
    viewChangeDetail () {
      let { href } = this.$router.resolve({
        path: '/groupPlan/changeFlow/changeFlowContrastDetails',
        query: {
          approveNo: this.approveNo,
          projectCode: this.projectCode
        }
      })
      // 打开新的窗口
      window.open(href, '_blank')
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
    //回到顶部
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    //点击右侧导航
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
    //设置里程碑是否展示
    setMilestoneVisible (show) {
      this.isShowMilestone = show
      if (!show) {
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

  .change-flow-edit{
    /deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
    padding-top: 0;
  }
    background : #f6f6f6;
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
      overflow: auto;
      min-height: 100vh;
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

      .nav-menu{
        position: fixed;
        left: calc(50% + 630px);
        top : 100px;
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
    }
  }
</style>
