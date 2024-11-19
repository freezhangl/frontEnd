<template>
  <!-- 审批 -->
  <div class="entrustment-flow-reject entrustment-flow">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowApprove"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasOpinionBtn" @click="submitOpinion"><span class="global-family">填写处理意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasSubmitBtn" @click="submitOpinion"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-turntodo" v-if="hasTurnBtn" @click="turnTo"><span class="global-family">转办</span></i>
          <i class="approve-icon svgfont-btn-read" v-if="hasSendReadBtn" @click="pendingApprove"><span class="global-family">送阅知</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">集团统筹一般支撑包委托函</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <!-- 基本信息 -->
        <div id="basic-info">
          <base-info
            v-if="docVisible"
            id="basic-info"
            :data="entrustLetterInfo"
            view-type="preview"></base-info>
        </div>
        <!-- 预期成果 -->
        <achievement id="task-ach" type="detail" :receive-data="projectAchievementList"></achievement>
        <!-- 项目预算 -->
        <budget-info :budget-data="entrustLetterInfo" id="project-budget"></budget-info>
        <!-- 审批意见 -->
        <div id="approved-con">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
        <!-- 文档资料 -->
        <project-document-detail
          v-if="docVisible"
          id="project-doc"
          :file-list="attachmentFileList"></project-document-detail>
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
      @changeShow="setProcessSubmitDia">
    </process-submit>
    <!-- 转办 -->
    <process-transfer
      :show="isShowTransfer"
      :business-serial-number="processParams.approveNo"
      :process-template-code="processParams.processTemplateCode"
      :activity-def-id="processParams.activityDefId"
      @confirmTransfer="getTransferInfo"
      @changeShowTransfer="setTransferDia"></process-transfer>
  </div>
</template>

<script>
import API from '@/serve/API_businessFlow'
import param from '@/const/param'
import { getStore } from '@/store'
import flowAPI from '@/serve/API_flow'
import baseInfo from './component/baseInfo'
import budgetInfo from './component/budgetInfo'
import achievement from '@/controller/groupPlan/components/subproject/achievement/entrustmentAchievementDetail'
import projectDocumentDetail from '@/controller/groupPlan/components/attachments/detail'
import { Message } from 'element-ui'
export default {
  components: { baseInfo, achievement, projectDocumentDetail, budgetInfo },
  beforeRouteEnter (to, from, next) {
    // 根据view=1判断审批/待办url
    let isDetail = to.fullPath.indexOf('view=1')
    if (isDetail === -1 && !to.query.processDefName) {
      flowAPI.getWorkItemDetail(parseInt(to.query.workItemID))
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
            next('/groupPlan/entrustmentFlow/entrustmentFlowDetail?' + urlString)
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
      next('/groupPlan/entrustmentFlow/entrustmentFlowDetail?' + urlString)
    }
  },
  data () {
    return {
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      navIdx: 0,
      entrustTitle: '',
      showBackTop: false,
      navMenus: [
        { name: '基本信息', id: 'basic-info' },
        { name: '预期成果', id: 'task-ach' },
        { name: '项目预算', id: 'project-budget' },
        { name: '审批意见', id: 'approved-con' },
        { name: '文档资料', id: 'project-doc' }
      ],
      docParams: { //文档资料相关参数
        type: this.$route.query.type,
        approveNo: this.$route.query.approveNo || ''
      },
      projectName: '', // 项目名称
      costBudgetList: [], // 项目预算
      projectAchievementList: [], // 预期成果
      attachmentIds: [], //文档资料编辑后的文档ids
      attachments: [], //文档资料编辑后的文档
      docVisible: false, // 获取到数据在进行渲染
      clearFlag: true, //true 触发滚动
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      attachmentFileList: [],
      processParams: {
        title: '', //流程实例名称
        workItemId: parseInt(this.$route.query.workItemID), //工作项ID
        approveNo: '', //业务流水号，根据流程实例ID获取
        processInstId: parseInt(this.$route.query.processInstID), //流程实例ID
        processTemplateCode: this.$route.query.processDefName, //流程模板编码
        activityDefId: this.$route.query.activityDefID, //活动节点定义ID
        activityInstId: parseInt(this.$route.query.activityInstID), //活动节点实例ID
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      buttonList: [], //流程按钮列表
      hasSubmitBtn: false, // 提交下一处理按钮--提交下一处理人
      hasOpinionBtn: false, // 填写审批意见
      isShowTransfer: false,
      isShowSubOpinion: false,
      hasTurnBtn: false, // 转办按钮
      hasSendReadBtn: false, // 待阅按钮
      entrustLetterInfo: '',
      projectBaseInfo: { // 基本信息
        projectName: '', // 项目名称
        approvelName: '', // 任务名称
        demandSide: '', // 需求部门
        demandPrincipal: '', // 需求负责人
        contactWay: '', // 联系方式
        planStartTime: '', // 计划开始时间
        planFinishTime: '', // 计划结束时间
        assumeSide: '', // 建议承担部门
        assumePrincipal: '', // 承担方项目经理
        taskDescription: '', // 任务描述及要求
        demandRisk: '', // 需求风险提示
        completionEffect: '', // 预期完成效果
        remark: '' // 备注
      },
      businessType: 'BT-DEMAND-ENTRUST-LETTER'
    }
  },
  computed: {},
  watch: {
    projectName: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        document.title = val + '委托函申请'
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
      flowAPI.getProcessInstDetailById(this.processParams.processInstId)
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
    //查询委托函流程详情
    async getDetailByApproveNo () {
      let param = {
        approveNo: this.processParams.approveNo
      }
      API.queryApprove(param)
        .then(res => {
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
          this.attachmentFileList = res.attachmentFileList
          if (res.entrustLetterAttachmentFileList) {
            this.attachmentFileList = this.attachmentFileList.concat(res.entrustLetterAttachmentFileList)
          }
          this.docVisible = true
          this.projectApprove.historyApproveFileId = res.projectApproveInfo.historyApproveFileId
          this.projectApprove.historyFlag = res.projectApproveInfo.historyFlag
          this.entrustLetterInfo = res.entrustLetterInfo
          if (res.projectInfo) {
            this.projectBaseInfo = res.entrustLetterInfo
            this.projectCompanyList = res.projectInfo.projectCompanyList
            this.developPackage = res.projectInfo.projectBaseInfo.developPackage
            this.projectCategory = res.projectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
            this.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.projectName = res.entrustLetterInfo.projectName
            this.projectAttribute = res.projectInfo.projectAttribute
            this.projectBudget = res.projectInfo.costBudgetList
            this.projectTeamList = res.projectInfo.projectTeamList
            this.projectMileStones = res.projectInfo.projectMileStones
          }
          if (res.entrustLetterInfo) {
            this.projectAchievementList = res.entrustLetterInfo.entrustLetterAchievementList
          }

          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            let json = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.entrustLetterInfo.completion = json.completion
          }
          this.approvalOpinionList = res.approveRecord ? res.approveRecord.approvals : []
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取委托函流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //获取处理意见信息并确定提交
    getProSubmitInfo (info) {
      let processSubmitForm = info
      processSubmitForm.businessType = this.businessType
      processSubmitForm.workItemId = this.processParams.workItemId
      processSubmitForm.approveNo = this.processParams.approveNo
      processSubmitForm.processInstId = this.processParams.processInstId
      processSubmitForm.activityInstId = this.processParams.activityInstId
      processSubmitForm.participantList = info.participants
      API.approve(processSubmitForm)
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
    //填写处理意见
    submitOpinion () {
      this.isShowSubOpinion = true
    },
    setProcessSubmitDia (val) {
      this.isShowSubOpinion = val
    },
    // 获取流程指定节点按钮配置
    getFlowBtnList () {
      let params = {
        processTemplateCode: this.processParams.processTemplateCode, //131
        activityDefId: this.processParams.activityDefId//'manualActivity1'
      }
      flowAPI.getButtonList(params)
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
      this.hasOpinionBtn = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.writeOpinions)
      this.hasSubmitBtn = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.nextProcessing)
      this.hasTurnBtn = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.turnTo)
      this.hasSendReadBtn = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.sendRead)
      this.hasMultTaskBtn1 = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.multTaskMeet1)
      this.hasMultTaskBtn2 = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.multTaskMeet2)
      this.hasMultProBtn1 = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.multProMeet1)
      this.hasMultProBtn2 = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.multProMeet2)
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
    // 获取转办信息并确定提交
    getTransferInfo (info) {
      let transferForm = {
        workItemId: this.processParams.workItemId,
        participantCode: info.participants[0].id,
        participantName: info.participants[0].name,
        approvalOpinion: info.approvalOpinion
      }
      flowAPI.reassignWorkItem(transferForm)
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
    //关闭
    closeFlowApprove () {
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.processParams.flushPortalUrl) {
        let paramsString = '?itemId=' + this.$route.query.itemId + '&appId=' + decodeURIComponent(this.$route.query.appID) + '&uniqueId=' + this.$route.query.uniqueId
        window.location.href = decodeURIComponent(this.processParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.close()
      }
    },
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs, approveId) {
      this.attachmentIds = ids
      this.attachments = attachs
      this.approveNo = approveId
      this.docParams.approveNo = approveId
    },
    //提交下一处理
    submitChangeFlow () {
      if (this.verifyDocument()) {
        this.saveChangeFlow(true)
      }
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
    //送阅知
    pendingApprove () {
      this.isShowToRead = true
    },
    //转办
    turnTo () {
      this.isShowTransfer = true
    },
    setTransferDia (val) {
      this.isShowTransfer = val
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
    //回到顶部
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    }
  },
  created () {
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  // 离开页面删除事件
  beforeRouteLeave (to, from, next) {
    window.onscroll = null
    next()
  },
  beforeCreate () {},
  beforeMount () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {},
  activated () {}
}
</script>
<style lang='scss' scoped src="./scss/layout.scss">
/deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
</style>
