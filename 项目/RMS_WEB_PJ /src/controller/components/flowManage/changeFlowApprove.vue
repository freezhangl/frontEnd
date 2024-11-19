<template>
  <div class="change-flow-approve">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowApprove"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-detail" @click="viewChangeDetail"><span class="global-family">变更详情</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasOpinionBtn" @click="submitOpinion"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasSubmitBtn" @click="submitOpinion"><span class="global-family">提交下一处理</span></i>
          <!-- <i class="approve-icon svgfont-btn-submit" v-if="hasSubmitBtn" @click="nextHandle"><span class="global-family">提交下一处理</span></i> -->
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultTaskBtn1" @click="multTaskSign"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultTaskBtn2" @click="multTaskSign"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultProBtn1" @click="multProcessSign"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultProBtn2" @click="multProcessSign"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-turntodo" v-if="hasTurnBtn" @click="turnTo"><span class="global-family">转办</span></i>
          <i class="approve-icon svgfont-btn-read" v-if="hasSendReadBtn" @click="pendingApprove"><span class="global-family">送阅知</span></i>
          <!-- <i class="approve-icon svgfont-btn-cancellation" v-if="hasAbandonBtn" @click="abandonFlow"><span class="global-family">作废</span></i> -->
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">本单位自立研发项目变更申请</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">

        <change-reason :info="changeReason"></change-reason>

        <basicInfo id="basic-info" :receive-data="projectBaseInfo" info-type="simple"></basicInfo>

        <attributeInfoApprove id="property-info" :receive-data="projectBaseInfo" :project-attribute="projectAttribute"></attributeInfoApprove>

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

        <teamInfo id="team-info" :receive-data="projectTeamList"></teamInfo>

        <projectBudget id="project-budget" :receive-data="costBudgetList"></projectBudget>

        <subproject id="task-ach" :receive-data="subProjectInfoList"></subproject>

        <detailTableMilestone
          id="milestone"
          v-if="isShowMilestone"
          :receive-data="projectMileStones"
          @detailTableMilestoneShowOrHide="setMilestoneVisible"></detailTableMilestone>

        <div id="approved-con" v-if="isShowApproval">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
        <project-document-detail id="project-doc" v-if="componentParams.approveNo" :doc-params="docParams"></project-document-detail>
      </div>
    </div>

    <!-- 流程组件 -->
    <!-- 填写审批意见 -->
    <process-submit
      :show="isShowSubOpinion"
      :title="componentParams.title"
      :work-item-id="componentParams.workItemId"
      :business-serial-number="componentParams.approveNo"
      :process-template-code="componentParams.processTemplateCode"
      :process-inst-id="componentParams.processInstId"
      :activity-inst-id="componentParams.activityInstId"
      :activity-def-id="componentParams.activityDefId"
      @confirmSubmit="getProSubmitInfo"
      @changeShow="setProcessSubmitDia"></process-submit>
    <!-- 提交下一处理 -->
    <next-handle
      :show="isShowNextHandle"
      :business-serial-number="componentParams.approveNo"
      :process-template-code="componentParams.processTemplateCode"
      @confirmNextHandle="getNextHandleInfo"
      @changeNextHandle="setNextHandleDia"></next-handle>
    <!-- 转办 -->
    <process-transfer
      :show="isShowTransfer"
      :business-serial-number="componentParams.approveNo"
      :process-template-code="componentParams.processTemplateCode"
      :activity-def-id="componentParams.activityDefId"
      @confirmTransfer="getTransferInfo"
      @changeShowTransfer="setTransferDia"></process-transfer>
    <!-- 处理会签 （多子项目项）-->
    <countersign
      :show="isShowMultTask"
      :business-serial-number="componentParams.approveNo"
      :process-inst-id="componentParams.processInstId"
      :activity-inst-id="componentParams.activityInstId"
      @confirmSign="getMultTaskInfo"
      @changeSign="closeMultTask"></countersign>
    <!-- 处理会签 （子流程）-->
    <countersign-child
      :show="isShowMultPro"
      :business-serial-number="componentParams.approveNo"
      :process-template-code="componentParams.processTemplateCode"
      :process-inst-id="componentParams.processInstId"
      :activity-inst-id="componentParams.activityInstId"
      @confirmSignChild="getMultProInfo"
      @changeSignChild="closeMultPro"></countersign-child>
    <processToRead
      :show="isShowToRead"
      :title="componentParams.title"
      :work-item-id="componentParams.workItemId"
      :process-inst-id="componentParams.processInstId"
      @changeShowRead="closeToRead"></processToRead>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import singleAPI from '@/serve/API_single'
import projectDocumentDetail from '../projectDocumentDetail'
import detailTableMilestone from '../../extraProject/components/basic/milestone/detailTableMilestone'
import basicInfo from '../../extraProject/components/basic/detail'
import teamInfo from '../../extraProject/components/teamInfo/detail'
import projectBudget from '../../extraProject/components/budget/detail'
import subproject from '../../extraProject/components/subproject/detail'
import attributeInfoApprove from '../../extraProject/components/attributeInfo/detail'
import ProductInfoDetail from '../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../extraProject/components/resource/resInfoDetail.vue'
import changeReason from '../changeReason/detail'
import param from '@/const/param'
import { getStore } from '@/store'
export default {
  name: 'changeFlowApprove',
  data () {
    return {
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true, //资源信息中有产品信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 预期成果
      projectMileStones: [], // 里程碑信息
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      attachmentTypeCode: '', //当前上传附件类型
      attachmentIds: [], //项目文档编辑后的文档ids
      attachments: [], //项目文档编辑后的文档
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
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
          name: '产品信息',
          id: 'product-info'
        },
        {
          name: '资源信息',
          id: 'resource-info'
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
          id: 'task-ach'
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
          name: '项目文档',
          id: 'project-doc'
        }
      ],
      isShowMilestone: true,
      isShowApproval: true,
      buttonList: [], //流程按钮列表
      hasOpinionBtn: false, // 填写审批意见
      isShowSubOpinion: false,
      hasSubmitBtn: false, // 提交下一处理按钮--提交下一处理人
      hasMultTaskBtn1: false, // 填写审批意见--会签（多子项目项）
      hasMultTaskBtn2: false, // 提交下一处理按钮--会签（多子项目项）
      isShowMultTask: false,
      hasMultProBtn1: false, // 填写审批意见--会签（多子流程）
      hasMultProBtn2: false, // 提交下一处理按钮--会签（多子流程）
      isShowMultPro: false,
      isShowNextHandle: false,
      hasTurnBtn: false, // 转办按钮
      isShowTransfer: false,
      hasSendReadBtn: false, // 待阅按钮
      isShowToRead: false,
      hasAbandonBtn: false, // 作废按钮
      componentParams: {
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
      projectCode: '', //项目编码
      docParams: {
        type: 'BT-CHANGE',
        approveNo: ''
      },
      changeReason: '', //变更理由
      typeOptions: [],
      levelList: [],
      historyApproveFileId: '',
      historyFlag: ''
    }
  },
  components: {
    projectDocumentDetail,
    detailTableMilestone,
    basicInfo,
    teamInfo,
    projectBudget,
    subproject,
    changeReason,
    attributeInfoApprove,
    ResInfoDetail,
    ProductInfoDetail
  },
  computed: {
  },
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
            next('/changeFlow/changeFlowViewDetail?' + urlString)
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
      next('/changeFlow/changeFlowViewDetail?' + urlString)
    }
  },
  mounted () {
    // this.getWorkItemDetail()
    this.getFlowBtnList()
    this.getProcessInstDetailById()
  },
  methods: {
    // 获取当前工作项详情--是否显示审批操作按钮
    getWorkItemDetail () {
      flowAPI.getWorkItemDetail(this.componentParams.workItemId)
        .then(res => {
          //待领取（4）、运行（10）、完成（12）、终止（13）、挂起（8）
          if (res.currentState === 4 || res.currentState === 10) {
            this.getFlowBtnList()
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取当前工作项详情失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.componentParams.processInstId)
        .then(res => {
          this.componentParams.title = res.processInstName
          this.componentParams.approveNo = res.businessSerialNumber
          this.docParams.approveNo = res.businessSerialNumber
          this.queryChangeApprove()
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
    async queryChangeApprove () {
      // await this.getProjectType()
      // await this.getProjectLevel()
      let param = {
        approveNo: this.componentParams.approveNo
      }
      API.queryChangeApprove(param)
        .then(res => {
          if (res) {
            this.historyApproveFileId = res.historyApproveFileId || ''
            this.historyFlag = res.historyFlag
            this.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.changeReason = res.changeReason
            this.projectBaseInfo = res.projectInfo.projectBaseInfo
            this.projectAttribute = res.projectInfo.projectAttribute
            this.costBudgetList = res.projectInfo.costBudgetList
            this.projectTeamList = res.projectInfo.projectTeamList
            this.subProjectInfoList = res.projectInfo.subProjectInfoList || []
            this.subProjectInfoList.forEach(item => {
              item.versionNo = res.versionNo
              item.isUpdate = false
            })
            this.projectMileStones = res.projectInfo.projectMileStones
            this.isShowMilestone = this.projectMileStones && this.projectMileStones.length > 0
            if (!this.isShowMilestone) {
              this.deleteNavItem('milestone')
            }
            if (res.approveRecord === null || res.approveRecord.total === 0) {
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
            this.approvalOpinionList = res.approveRecord ? res.approveRecord.approvals : []
            //产品信息
            this.productInfoList = res.projectInfo.projectProductInfoList || []
            this.hasProductInfo = this.productInfoList && this.productInfoList.length > 0
            if (!this.hasProductInfo) {
              this.deleteNavItem('product-info')
            }
            //资源信息
            this.resourceInfo = res.projectInfo.projectResourceInfoDto || {}
            this.hasResourceInfo = !!((this.resourceInfo && JSON.stringify(this.resourceInfo) !== '{}'))
            if (!this.hasResourceInfo) {
              this.deleteNavItem('resource-info')
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
    //删除菜单项
    deleteNavItem (id) {
      let index = -1
      this.navMenus.some((ele, i) => {
        if (ele.id === id) {
          index = i
          return true
        }
      })
      if (index > -1) {
        this.navMenus.splice(index, 1)
      }
    },
    // 获取流程指定节点按钮配置
    getFlowBtnList () {
      let params = {
        processTemplateCode: this.componentParams.processTemplateCode, //131
        activityDefId: this.componentParams.activityDefId//'manualActivity1'
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
      // this.hasAbandonBtn = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.cancellation)
    },
    //关闭
    closeFlowApprove () {
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.componentParams.flushPortalUrl) {
        let paramsString = '?itemId=' + this.$route.query.itemId + '&appId=' + decodeURIComponent(this.$route.query.appID) + '&uniqueId=' + this.$route.query.uniqueId
        window.location.href = decodeURIComponent(this.componentParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.close()
      }
    },
    //变更详情
    viewChangeDetail () {
      let { href } = this.$router.resolve({
        path: '/changeFlow/changeFlowContrastDetails',
        query: {
          approveNo: this.componentParams.approveNo,
          projectCode: this.projectCode
        }
      })
      // 打开新的窗口
      window.open(href, '_blank')
    },
    //填写处理意见
    submitOpinion () {
      this.isShowSubOpinion = true
    },
    setProcessSubmitDia (val) {
      this.isShowSubOpinion = val
    },
    //获取处理意见信息并确定提交
    getProSubmitInfo (info) {
      let processSubmitForm = info
      processSubmitForm.businessType = 'BT-CHANGE'
      processSubmitForm.workItemId = this.componentParams.workItemId
      processSubmitForm.approveNo = this.componentParams.approveNo
      processSubmitForm.processInstId = this.componentParams.processInstId
      processSubmitForm.activityInstId = this.componentParams.activityInstId
      API.submitApprove(processSubmitForm)
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
    //提交下一处理组件
    nextHandle () {
      this.isShowNextHandle = true
    },
    setNextHandleDia (val) {
      this.isShowNextHandle = val
    },
    // 获取下一审批处理环节与人员信息并确定提交
    getNextHandleInfo (info) {
      let nextHandleForm = {
        approveNo: this.componentParams.approveNo,
        nextActivityDefId: info.nextLinkShow,
        participants: info.participants
      }
      API.submitApprove(nextHandleForm)
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
    //会签（多子项目项）
    multTaskSign () {
      this.isShowMultTask = true
    },
    closeMultTask (val) {
      this.isShowMultTask = false
    },
    // 多子项目项会签信息获取并确定提交
    getMultTaskInfo (info) {
      let multTaskForm = {
        approvalState: info.approvalState,
        approveNo: this.componentParams.approveNo,
        nextActivityDefId: info.nextLink,
        approvalOpinion: info.approvalOpinion,
        businessType: 'BT-CHANGE',
        workItemId: this.componentParams.workItemId,
        processInstId: this.componentParams.processInstId,
        activityInstId: this.componentParams.activityInstId
      }
      API.submitApprove(multTaskForm)
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
        approveNo: this.componentParams.approveNo,
        nextActivityDefId: info.nextActivityDefId,
        participants: info.participants,
        approvalOpinion: info.approvalOpinion,
        businessType: 'BT-CHANGE',
        workItemId: this.componentParams.workItemId,
        processInstId: this.componentParams.processInstId,
        activityInstId: this.componentParams.activityInstId
      }
      API.submitApprove(multProForm)
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
          businessSerialNumber: this.componentParams.approveNo,
          processInstId: this.componentParams.processInstId,
          userId: this.componentParams.userId,
          fileCode: this.historyApproveFileId,
          historyFlag: this.historyFlag
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
        workItemId: this.componentParams.workItemId,
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
          singleAPI.deleteChangeApprove(this.componentParams.approveNo)
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
  },
  created () {
    document.title = '变更流程审批'
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
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

.change-flow-approve{
  overflow: auto;
  background : #f6f6f6;
  min-height: 100vh;
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
  /deep/ .el-form-item{
    margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
  .top-head{
    height: 50px;
    background : #fff;
    i{
      margin-right: 20px;
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
