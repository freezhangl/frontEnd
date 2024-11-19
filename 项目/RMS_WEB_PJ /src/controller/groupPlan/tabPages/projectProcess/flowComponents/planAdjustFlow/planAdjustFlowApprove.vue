<template>
  <div class="change-flow-approve">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowApprove"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-detail" @click="viewChangeDetail"><span class="global-family">变更详情</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasOpinionBtn" @click="submitOpinion"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasOpinionBtn1" @click="submitOpinion1"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasSubmitBtn" @click="submitOpinion"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasSubmitBtn1" @click="submitOpinion1"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultTaskBtn1" @click="multTaskSign"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultTaskBtn2" @click="multTaskSign"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultProBtn1" @click="multProcessSign"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultProBtn2" @click="multProcessSign"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-turntodo" v-if="hasTurnBtn" @click="turnTo"><span class="global-family">转办</span></i>
          <i class="approve-icon svgfont-btn-read" v-if="hasSendReadBtn" @click="pendingApprove"><span class="global-family">送阅知</span></i>
        </span>
        <img
          class="logo-img"
          src="@/assets/icons/集中化研发管理系统组合logo.svg"
          alt=""
        />
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="" />
    </div>
    <div class="main-container">
      <div class="project-title">集团统筹项目-需求单位项目计划调整申请</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu, idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu, idx)"
          :class="{ 'item-active': navIdx == idx }"
        >
          {{ menu.name }}
        </a>
      </section>

      <div class="main-content">
        <change-reason :info="changeReason">
        </change-reason>

        <div id="basic-info">
          <basicInfo :receive-data="projectBaseInfo">
          </basicInfo>
        </div>

        <div id="property-info">
          <!-- 属性信息 -->
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
          <DSTeamInfoDetail
            v-if="(projectCP !== '') & (projectCP === 'ds')"
            :project-company-list="projectCompanyList"
            :project-class="projectBaseInfo.projectClass"
          >
          </DSTeamInfoDetail>
          <!-- 需求单位 研发包 -->
          <DGTeamInfoDetail
            v-if="(projectCP !== '') & (projectCP === 'dg')"
            :project-company-list="projectCompanyList"
          >
          </DGTeamInfoDetail>
          <!-- 承担单位 非研发包 -->
          <USTeamInfoDetail
            v-if="(projectCP !== '') & (projectCP === 'us')"
            :project-company-list="projectCompanyList"
            :project-team-list="projectTeamList"
          >
          </USTeamInfoDetail>
          <!-- 承担单位 研发包 -->
          <UGTeamInfoDetail
            v-if="(projectCP !== '') & (projectCP === 'ug')"
            :project-company-list="projectCompanyList"
            :project-team-list="projectTeamList"
          >
          </UGTeamInfoDetail>
        </div>

        <div id="project-budget" ref="projectBudget">
          <!-- 需求单位 非研发包 -->
          <DSProjectBudget v-if="projectCP !=='' && projectCP === 'ds'" :version-no="projectApprove.versionNo" :project-code="projectCode">
          </DSProjectBudget>
          <!-- 需求单位 研发包 -->
          <DGProjectBudget v-if="projectCP !=='' && projectCP === 'dg'" :budget-info="costBudgetList">
          </DGProjectBudget>
          <!-- 承担单位 非研发包、研发包 -->
          <UProjectBudget v-if="projectCode && projectCP !=='' && projectCategory==='u'" :budget-info="budgetData">
          </UProjectBudget>
        </div>

        <div id="subproject-info" ref="subproject">
          <!-- 需求单位 -->
          <DSubprojectInfo
            v-if="(projectCategory !== '') & (projectCategory === 'd')"
            :receive-data="subProjectInfoList"
            :project-base-info="projectBaseInfo"
            :version-no="projectApprove.versionNo"
          >
          </DSubprojectInfo>
          <!-- 承担单位 -->
          <USubprojectInfo
            v-if="(projectCategory !== '') & (projectCategory === 'u')"
            :receive-data="subProjectInfoList"
            :project-base-info="projectBaseInfo"
            :version-no="projectApprove.versionNo"
          >
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
        <div id="approved-con" v-if="isShowApproval">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
        <project-document-detail
          v-if="docVisible"
          id="project-doc"
          :file-list="attachmentFileList"
        >
        </project-document-detail>
      </div>
    </div>

    <!-- 流程组件 -->
    <!-- 填写审批意见 -->
    <process-submit
      :show="isShowSubOpinion"
      :title="processParams.title"
      :work-item-id="processParams.workItemId"
      :business-serial-number="processParams.approveNo"
      :process-template-code="processParams.processTemplateCode"
      :process-inst-id="processParams.processInstId"
      :activity-inst-id="processParams.activityInstId"
      :activity-def-id="processParams.activityDefId"
      @confirmSubmit="getProSubmitInfo"
      @changeShow="setProcessSubmitDia"
    >
    </process-submit>
    <processGroupPlan
      :show="isShowSubOpinion1"
      :title="processParams.title"
      :work-item-id="processParams.workItemId"
      :business-serial-number="processParams.approveNo"
      :process-template-code="processParams.processTemplateCode"
      :process-inst-id="processParams.processInstId"
      :activity-inst-id="processParams.activityInstId"
      :activity-def-id="processParams.activityDefId"
      @confirmSubmit="getProSubmitInfo"
      @changeShow="setProcessSubmitDia1">
    </processGroupPlan>
    <!-- 转办 -->
    <process-transfer
      :show="isShowTransfer"
      :business-serial-number="processParams.approveNo"
      :process-template-code="processParams.processTemplateCode"
      :activity-def-id="processParams.activityDefId"
      @confirmTransfer="getTransferInfo"
      @changeShowTransfer="setTransferDia"
    >
    </process-transfer>
    <!-- 处理会签 （多任务项）-->
    <countersign
      :show="isShowMultTask"
      :business-serial-number="processParams.approveNo"
      :process-inst-id="processParams.processInstId"
      :activity-inst-id="processParams.activityInstId"
      @confirmSign="getMultTaskInfo"
      @changeSign="closeMultTask"
    >
    </countersign>
    <!-- 处理会签 （子流程）-->
    <countersign-child
      :show="isShowMultPro"
      :business-serial-number="processParams.approveNo"
      :process-template-code="processParams.processTemplateCode"
      :process-inst-id="processParams.processInstId"
      :activity-inst-id="processParams.activityInstId"
      @confirmSignChild="getMultProInfo"
      @changeSignChild="closeMultPro"
    >
    </countersign-child>
    <processToRead
      :show="isShowToRead"
      :title="processParams.title"
      :work-item-id="processParams.workItemId"
      :process-inst-id="processParams.processInstId"
      @changeShowRead="closeToRead"
    >
    </processToRead>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import param from '@/const/param'
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

export default {
  name: 'planAdjustFlowApprove',
  beforeRouteEnter (to, from, next) {
    // 根据view=1判断审批/待办url
    let isDetail = to.fullPath.indexOf('view=1')
    if (isDetail === -1 && !to.query.processDefName) {
      flowAPI
        .getWorkItemDetail(parseInt(to.query.workItemID))
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            next({
              path: to.fullPath,
              query: {
                processDefName: res.processDefName
              }
            })
          } else {
            let urlString = 'processInstID=' + to.query.processInstID
            next('/groupPlan/planAdjustFlow/planAdjustFlowDetail?' + urlString)
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            Message({
              message: e.message || '获取当前工作项详情失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    } else if (to.query.processDefName) {
      next()
    } else {
      // view=1则跳转详情页面url，已办跳转到详情页面
      let urlString = 'processInstID=' + to.query.processInstID
      next('/groupPlan/planAdjustFlow/planAdjustFlowDetail?' + urlString)
    }
  },
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
      projectName: '', // 项目名称
      developPackage: '', //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: '', //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      businessType: 'BT-DEMAND-PLAN-CHANGE', // 单据类型
      projectCode: '', //项目编码
      changeReason: '', //变更理由
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
      processSubmitForm: {},
      isShowMilestone: true,
      projectMileStoneList: [], // 里程碑信息
      isShowApproval: true,
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      buttonList: [], //流程按钮列表
      hasOpinionBtn: false, // 填写审批意见
      hasOpinionBtn1: false, // 填写审批意见
      isShowSubOpinion: false,
      isShowSubOpinion1: false,
      hasSubmitBtn: false, // 提交下一处理按钮--提交下一处理人
      hasSubmitBtn1: false, // 提交下一处理按钮--提交下一处理人
      hasMultTaskBtn1: false, // 填写审批意见--会签（多任务项）
      hasMultTaskBtn2: false, // 提交下一处理按钮--会签（多任务项）
      isShowMultTask: false,
      hasMultProBtn1: false, // 填写审批意见--会签（多子流程）
      hasMultProBtn2: false, // 提交下一处理按钮--会签（多子流程）
      isShowMultPro: false,
      hasTurnBtn: false, // 转办按钮
      isShowTransfer: false,
      hasSendReadBtn: false, // 待阅按钮
      isShowToRead: false,
      hasAbandonBtn: false, // 作废按钮
      processParams: {
        // 所有流程组件需要的参数--工作台拼接过来的
        title: '', //流程实例名称
        workItemId: parseInt(this.$route.query.workItemID),
        approveNo: '', //业务流水号，根据流程实例ID获取
        processInstId: parseInt(this.$route.query.processInstID),
        activityInstId: parseInt(this.$route.query.activityInstID),
        processTemplateCode: this.$route.query.processDefName,
        activityDefId: this.$route.query.activityDefID,
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      }
    }
  },
  components: {
    projectDocumentDetail,
    basicInfo,
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
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    changeReason
  },
  computed: {},
  created () {
    document.title = '变更流程审批'

    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
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
      }
    }
  },
  mounted () {
    this.getFlowBtnList()
    this.getProcessInstDetailById()
  },
  methods: {
    // 根据流程实例ID-processInstId获取业务流水号，从而获取单据详情
    getProcessInstDetailById () {
      flowAPI
        .getProcessInstDetailById(this.processParams.processInstId)
        .then(res => {
          this.processParams.title = res.processInstName
          this.processParams.approveNo = res.businessSerialNumber
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
    //查询变更流程详情
    async getDetailByApproveNo () {
      let param = {
        approveNo: this.processParams.approveNo
      }
      API.queryApprove(param)
        .then(res => {
          this.attachmentFileList = res.attachmentFileList
          this.docVisible = true
          this.versionNo = res.projectApproveInfo.versionNo
          this.projectApprove = res.projectApproveInfo
          if (
            res.projectApproveInfo &&
            res.projectApproveInfo.extendedAttributes
          ) {
            let extendsObj = JSON.parse(
              res.projectApproveInfo.extendedAttributes
            )
            this.changeReason = extendsObj.changeDescription
          }
          if (res.projectInfo) {
            this.projectCompanyList = res.projectInfo.projectCompanyList
            this.developPackage =
              res.projectInfo.projectBaseInfo.developPackage
            this.projectCategory =
              res.projectInfo.projectBaseInfo.projectCategory ===
              'PC-DEMAND-UNIT'
                ? 'd'
                : 'u'
            this.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.budgetData.projectCode =
              res.projectInfo.projectBaseInfo.projectCode
            this.budgetData.versionNo = res.versionNo
            this.projectName = res.projectInfo.projectBaseInfo.projectName
            this.projectBaseInfo = res.projectInfo.projectBaseInfo
            this.projectAttribute = res.projectInfo.projectAttribute
            this.costBudgetList = res.projectInfo.costBudgetList
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
          }
          if (res.approveRecord && res.approveRecord.approvals && this.projectCategory === 'd' && this.developPackage === 'IS_RD_0') {
            setApprovals(res.approveRecord.approvals, this.projectCompanyList)
          }
          this.approvalOpinionList = res.approveRecord
            ? res.approveRecord.approvals
            : []
          if (res === null || res.approveRecord === null || res.approveRecord.total === 0) {
            this.isShowApproval = false
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
    // 获取流程指定节点按钮配置
    getFlowBtnList () {
      let params = {
        processTemplateCode: this.processParams.processTemplateCode, //131
        activityDefId: this.processParams.activityDefId //'manualActivity1'
      }
      flowAPI
        .getButtonList(params)
        .then(res => {
          this.buttonList = res
          this.judgeBtnVisible()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取按钮失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 判断按钮是否展示
    judgeBtnVisible () {
      this.hasOpinionBtn = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.writeOpinions
      )
      this.hasSubmitBtn = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.nextProcessing
      )
      this.hasOpinionBtn1 = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.writeOpinions1
      )
      this.hasSubmitBtn1 = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.nextProcessing1
      )
      this.hasTurnBtn = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.turnTo
      )
      this.hasSendReadBtn = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.sendRead
      )
      this.hasMultTaskBtn1 = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.multTaskMeet1
      )
      this.hasMultTaskBtn2 = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.multTaskMeet2
      )
      this.hasMultProBtn1 = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.multProMeet1
      )
      this.hasMultProBtn2 = this.buttonList.some(
        ele => ele.buttonCode === param.approvalButtons.multProMeet2
      )
      // this.hasAbandonBtn = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.cancellation)
    },
    //关闭
    closeFlowApprove () {
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.processParams.flushPortalUrl) {
        let paramsString =
          '?itemId=' +
          this.$route.query.itemId +
          '&appId=' +
          decodeURIComponent(this.$route.query.appID) +
          '&uniqueId=' +
          this.$route.query.uniqueId
        window.location.href =
          decodeURIComponent(this.processParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.close()
      }
    },
    //填写处理意见
    submitOpinion () {
      this.isShowSubOpinion = true
    },
    //填写处理意见
    submitOpinion1 () {
      this.isShowSubOpinion1 = true
    },
    setProcessSubmitDia (val) {
      this.isShowSubOpinion = val
    },
    setProcessSubmitDia1 (val) {
      this.isShowSubOpinion1 = val
    },
    //获取处理意见信息并确定提交
    getProSubmitInfo (info) {
      this.processSubmitForm = info
      this.processSubmitForm.businessType = this.businessType
      this.processSubmitForm.workItemId = this.processParams.workItemId
      this.processSubmitForm.businessSerialNumber = this.processParams.approveNo
      this.processSubmitForm.approveNo = this.processParams.approveNo
      this.processSubmitForm.activityInstId = this.processParams.activityInstId
      this.processSubmitForm.participantList = info.participants
      API.approve(this.processSubmitForm)
        .then(res => {
          this.$message({
            message: '提交审批成功。',
            type: 'success',
            showClose: true
          })
          setTimeout(() => {
            this.closeFlowApprove()
          }, 500)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '提交审批意见失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //变更详情
    viewChangeDetail () {
      let { href } = this.$router.resolve({
        path: '/groupPlan/changeFlow/changeFlowContrastDetails',
        query: {
          approveNo: this.processParams.approveNo,
          projectCode: this.projectCode
        }
      })
      // 打开新的窗口
      window.open(href, '_blank')
    },
    //会签（多任务项）
    multTaskSign () {
      this.isShowMultTask = true
    },
    closeMultTask (val) {
      this.isShowMultTask = false
    },
    // 多任务项会签信息获取并确定提交
    getMultTaskInfo (info) {
      let multTaskForm = {
        approvalState: info.approvalState,
        approveNo: this.processParams.approveNo,
        nextActivityDefId: info.nextLink,
        approvalOpinion: info.approvalOpinion,
        businessType: this.businessType,
        workItemId: this.processParams.workItemId,
        processInstId: this.processParams.processInstId,
        activityInstId: this.processParams.activityInstId
      }
      API.approve(multTaskForm)
        .then(res => {
          this.$message({
            message: '提交审批成功。',
            type: 'success',
            showClose: true
          })
          setTimeout(() => {
            this.closeFlowApprove()
          }, 500)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '提交失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //会签（子流程）
    multProcessSign () {
      this.isShowMultPro = true
    },
    closeMultPro (val) {
      this.isShowMultPro = false
    },
    // 多子流程会签信息获取并确定提交
    getMultProInfo (info) {
      let multProForm = {
        approvalState: info.approvalState,
        approveNo: this.processParams.approveNo,
        nextActivityDefId: info.nextActivityDefId,
        participantList: info.participants,
        approvalOpinion: info.approvalOpinion,
        businessType: this.businessType,
        workItemId: this.processParams.workItemId,
        processInstId: this.processParams.processInstId,
        activityInstId: this.processParams.activityInstId
      }
      API.approve(multProForm)
        .then(res => {
          this.$message({
            message: '提交审批成功。',
            type: 'success',
            showClose: true
          })
          setTimeout(() => {
            this.closeFlowApprove()
          }, 500)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '提交失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //流程跟踪
    processTrace () {
      this.$router.push({
        path: '/processTrace',
        query: {
          businessSerialNumber: this.processParams.approveNo,
          processInstId: this.processParams.processInstId,
          userId: this.processParams.userId,
          fileCode: this.projectApprove.historyApproveFileId,
          historyFlag: this.projectApprove.historyFlag
        }
      })
    },
    //转办
    turnTo () {
      this.isShowTransfer = true
    },
    setTransferDia (val) {
      this.isShowTransfer = val
    },
    // 获取转办信息并确定提交
    getTransferInfo (info) {
      let transferForm = {
        workItemId: this.processParams.workItemId,
        participantCode: info.participants[0].id,
        participantName: info.participants[0].name,
        approvalOpinion: info.approvalOpinion
      }
      flowAPI
        .reassignWorkItem(transferForm)
        .then(res => {
          this.$message({
            message: '转办成功！',
            type: 'success',
            showClose: true
          })
          setTimeout(() => {
            this.closeFlowApprove()
          }, 500)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '转办失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //送阅知
    pendingApprove () {
      this.isShowToRead = true
    },
    closeToRead () {
      this.isShowToRead = false
    },
    //作废
    abandonFlow () {
      this.$confirm(' ', '是否要作废?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          API.deleteApprove(this.processParams.approveNo)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功。'
              })
              setTimeout(() => {
                this.closeFlowApprove()
              }, 500)
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '作废失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废'
          })
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
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px) {
  /deep/ .head-con {
    width: 1000px !important;
  }
  /deep/ .main-container {
    width: 1000px !important;
  }
  /deep/ .nav-menu {
    left: calc(50% + 520px) !important;
  }
}

@media screen and (max-width: 1364px) {
  /deep/ .head-con {
    width: 960px !important;
  }
  /deep/ .main-container {
    width: 960px !important;
  }
  /deep/ .nav-menu {
    left: calc(50% + 500px) !important;
  }
}

.change-flow-approve {
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
  background: #f6f6f6;
  .back-top {
    position: fixed;
    bottom: 20px;
    right: 10px;
    cursor: pointer;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .top-head {
    height: 50px;
    background: #fff;
    i {
      margin-right: 20px;
      cursor: pointer;
      &:before {
        margin-right: 5px;
      }
    }
    .head-con {
      height: 50px;
      line-height: 50px;
      width: 1180px;
      margin: 0 auto;

      .logo-img {
        float: right;
        margin-top: 15px;
      }
      .approve-icon {
        font-size: 14px;
        &:before {
          vertical-align: -2px;
        }
      }
    }
  }

  .main-container {
    width: 1180px;
    margin: 0 auto;
    overflow: auto;
    min-height: 100vh;
    .project-title {
      font-family: inherit;
      font-size: 26px;
      font-weight: 600;
      color: #333333;
      text-align: center;
      line-height: 26px;
      margin-top: 15px;
      margin-bottom: 15px;
    }

    .nav-menu {
      position: fixed;
      left: calc(50% + 630px);
      top: 100px;
      border-left: 1px solid #e5e5e5;
      padding: 20px 10px;
      z-index: 9;

      .nav-menu-item {
        display: block;
        position: relative;
        margin: 12px 0;

        &:hover {
          @include color();
        }

        &.item-active {
          @include color();

          &::after {
            display: inline-block;
            position: absolute;
            content: "";
            left: -17px;
            top: 3px;
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
  .main-content {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
