<template>
  <div class="launch-detail">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <!-- 根据当前流程节点获取处理的按钮操作 -->
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasOpinionBtn" @click="submitOpinion"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasSubmitBtn" @click="submitOpinion"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultTaskBtn1" @click="multTaskSign"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultTaskBtn2" @click="multTaskSign"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultProBtn1" @click="multProcessSign"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasMultProBtn2" @click="multProcessSign"><span class="global-family">提交下一处理</span></i>
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
      <div class="project-title">批量预立项申请</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <prelaunch-info ref="change-reason" :info="changeReason"></prelaunch-info>
        <project-import-list
          id="project-list"
          :project-params="projectParams"
          :pre-project-list="projectApprovePreApprovalImportList"></project-import-list>
        <div id="approved-con" v-if="isShowApproval">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
        <project-document-detail
          v-if="docVisible"
          id="project-doc"
          :file-list="attachmentFileList"></project-document-detail>
      </div>
    </div>
    <!-- 流程组件 -->
    <process-submit
      :show="isShowSubOpinion"
      :title="componentParams.title"
      :work-item-id="componentParams.workItemId"
      :business-serial-number="componentParams.businessSerialNumber"
      :process-template-code="componentParams.processTemplateCode"
      :process-inst-id="componentParams.processInstId"
      :activity-inst-id="componentParams.activityInstId"
      :activity-def-id="componentParams.activityDefId"
      @confirmSubmit="getProSubmitInfo"
      @changeShow="setProcessSubmitDia"></process-submit>
    <process-transfer
      :show="isShowTransfer"
      :business-serial-number="componentParams.businessSerialNumber"
      :process-template-code="componentParams.processTemplateCode"
      :activity-def-id="componentParams.activityDefId"
      @confirmTransfer="getTransferInfo"
      @changeShowTransfer="setTransferDia"></process-transfer>
    <countersign
      :show="isShowMultTask"
      :business-serial-number="componentParams.businessSerialNumber"
      :process-inst-id="componentParams.processInstId"
      :activity-inst-id="componentParams.activityInstId"
      @confirmSign="getMultTaskInfo"
      @changeSign="closeMultTask"></countersign>
    <countersignChild
      :show="isShowMultPro"
      :business-serial-number="componentParams.businessSerialNumber"
      :process-template-code="componentParams.processTemplateCode"
      :process-inst-id="componentParams.processInstId"
      :activity-inst-id="componentParams.activityInstId"
      @confirmSignChild="getMultProInfo"
      @changeSignChild="closeMultPro"></countersignChild>
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
import API from '@/serve/API_businessFlow'
import preAPI from '@/serve/API_projectImport'
import flowAPI from '@/serve/API_flow'
import { getStore } from '@/store'
import param from '@/const/param'
import projectDocumentDetail from '@/controller/groupPlan/components/attachments/detail'
import prelaunchInfo from './preLunchFlowInfo/detail'
import projectImportList from './preProjectList'
export default {
  name: 'groupPreprojectApproval',
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
            next('/groupPreLaunchFlow/groupPreProjectDetail?' + urlString)
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
      // view=1则跳转详情页面url
      let urlString = 'processInstID=' + to.query.processInstID
      next('/groupPreLaunchFlow/groupPreProjectDetail?' + urlString)
    }
  },
  data () {
    return {
      isShowApproval: true,
      changeReason: '',
      typeOptions: null,
      levelList: null,
      componentParams: { // 所有流程组件需要的参数--工作台拼接过来的
        title: '', //流程实例名称
        workItemId: parseInt(this.$route.query.workItemID),
        businessSerialNumber: null,
        processInstId: parseInt(this.$route.query.processInstID),
        activityInstId: parseInt(this.$route.query.activityInstID),
        processTemplateCode: this.$route.query.processDefName,
        activityDefId: this.$route.query.activityDefID,
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      buttonList: [],
      docVisible: false,
      hasOpinionBtn: false, // 填写审批意见
      hasSubmitBtn: false,
      isShowSubOpinion: false,
      processSubmitForm: {},
      hasMultTaskBtn1: false, // 填写审批意见--会签（多任务项）
      hasMultTaskBtn2: false, // 提交下一处理按钮--会签（多任务项）
      isShowMultTask: false,
      multTaskForm: {},
      hasMultProBtn1: false, // 填写审批意见--会签（多子流程）
      hasMultProBtn2: false, // 提交下一处理按钮--会签（多子流程）
      isShowMultPro: false,
      isShowToRead: false, // 送阅知
      multProForm: {},
      isShowNextHandle: false,
      nextHandleForm: {},
      hasTurnBtn: false, // 转办按钮
      isShowTransfer: false,
      transferForm: {},
      hasSendReadBtn: false, // 待阅按钮
      projectCode: '',
      attachmentFileList: [], // 单据附件列表
      approvalOpinionList: [], // 审批意见
      projectApprovePreApprovalImportList: [], //项目信息列表
      projectApprove: {}, //表单信息
      docParams: {
        type: 'BT-PRE-APPROVE-IMPORT ',
        approveNo: '' //this.$route.query.businessSerialNumber
      },
      projectParams: {
        nonce: '',
        sign: '',
        timeStamp: '',
        fileCode: ''
      },
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      navMenus: [
        {
          name: '项目列表信息',
          id: 'project-list'
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
      isShowMilestone: true
    }
  },
  components: {
    projectDocumentDetail,
    projectImportList,
    prelaunchInfo
  },
  computed: {},
  mounted () {
    this.getFlowBtnList()
    this.getProcessInstDetailById()
  },
  methods: {
    // 获取当前工作项详情--是否跳转详情页
    getWorkItemDetail () {
      flowAPI.getWorkItemDetail(this.componentParams.workItemId)
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            this.getFlowBtnList()
          } else {
            this.$router.push({
              path: '/groupPreLaunchFlow/groupPreProjectDetail',
              query: {
                processInstId: this.componentParams.processInstId
              }
            })
          }
        })
        .catch(e => {
          this.loading = false
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
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.componentParams.processInstId)
        .then(res => {
          this.componentParams.title = res.processInstName
          this.componentParams.businessSerialNumber = res.businessSerialNumber
          this.docParams.approveNo = this.componentParams.businessSerialNumber
          this.getApproveTemInfo()
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
    // 获取流程指定节点按钮配置
    getFlowBtnList () {
      let params = {
        processTemplateCode: this.componentParams.processTemplateCode, // processDefName
        activityDefId: this.componentParams.activityDefId
      }
      flowAPI.getButtonList(params)
        .then(res => {
          this.buttonList = res
          this.judgeBtnVisible()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取按钮配置失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取立项流程详细信息
    async getApproveTemInfo () {
      let param = {
        approveNo: this.componentParams.businessSerialNumber // 获取'1273899909065478147'
      }
      preAPI.queryProjectPreApproveImportDetails(param)
        .then(res => {
          if (res) {
            if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
              let extendedAttributes = JSON.parse(res.projectApproveInfo.extendedAttributes)
              this.changeReason = extendedAttributes.remarks || ''
              this.projectParams = {
                nonce: res.nonce,
                sign: res.sign,
                timeStamp: res.timeStamp,
                fileCode: extendedAttributes.fileCode,
                fileName: extendedAttributes.fileName
              }
            }
            this.projectApprove = res.projectApproveInfo
            this.attachmentFileList = res.attachmentDtoList || []
            this.docVisible = true
            this.projectApprovePreApprovalImportList = res.projectApprovePreApprovalImportList || []
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
            this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取立项流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
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
    // 关闭流程信息页面
    closeProcessInfo () {
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.componentParams.flushPortalUrl) {
        let paramsString = '?itemId=' + this.$route.query.itemId + '&appId=' + decodeURIComponent(this.$route.query.appID) + '&uniqueId=' + this.$route.query.uniqueId
        window.location.href = decodeURIComponent(this.componentParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.opener = null
        window.open('', '_self')
        window.close()
      }
    },
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
    },
    // 填写审批意见
    submitOpinion () {
      this.isShowSubOpinion = true
    },
    //获取审批意见信息并提交
    getProSubmitInfo (info) {
      this.processSubmitForm = info
      this.processSubmitForm.businessType = 'BT-PRE-APPROVE-IMPORT'
      this.processSubmitForm.workItemId = this.componentParams.workItemId
      this.processSubmitForm.businessSerialNumber = this.componentParams.businessSerialNumber
      this.processSubmitForm.approveNo = this.componentParams.businessSerialNumber
      this.processSubmitForm.activityInstId = this.componentParams.activityInstId
      this.processSubmitForm.participantList = info.participants
      // console.log(this.processSubmitForm)
      API.approve(this.processSubmitForm)
        .then(res => {
          this.$message({
            message: '提交审批成功。',
            type: 'success',
            showClose: true
          })
          this.closeProcessInfo()
        })
        .catch(e => {
          this.loading = false
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
    setProcessSubmitDia (val) {
      this.isShowSubOpinion = val
    },
    // 流程跟踪
    processTrace () {
      this.$router.push({
        path: '/processTrace',
        query: {
          businessSerialNumber: this.componentParams.businessSerialNumber,
          processInstId: this.componentParams.processInstId,
          userId: this.componentParams.userId,
          fileCode: this.projectApprove.historyApproveFileId,
          historyFlag: this.projectApprove.historyFlag
        }
      })
    },
    // 转办
    turnTo () {
      this.isShowTransfer = true
    },
    // 获取转办信息
    getTransferInfo (info) {
      this.transferForm = info
      let params = {
        workItemId: this.componentParams.workItemId,
        participantCode: this.transferForm.participants[0].id,
        participantName: this.transferForm.participants[0].name,
        approvalOpinion: this.transferForm.approvalOpinion
      }
      // 转办接口
      flowAPI.reassignWorkItem(params)
        .then(res => {
          this.$message({
            message: '转办成功！',
            type: 'success',
            showClose: true
          })
          setTimeout(() => {
            this.closeProcessInfo()
          }, 500)
        })
        .catch(e => {
          this.loading = false
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
    setTransferDia (val) {
      this.isShowTransfer = val
    },
    // 送阅知
    pendingApprove () {
      this.isShowToRead = true
    },
    closeToRead (val) {
      this.isShowToRead = val
    },
    // 作废
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
          let params = {
            approveNo: this.componentParams.businessSerialNumber
          }
          API.deleteApprove(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功。'
              })
              // 界面不可见
              this.closeProcessInfo()
            })
            .catch(e => {
              this.loading = false
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
    // 多任务项会签弹窗
    multTaskSign () {
      this.isShowMultTask = true
    },
    closeMultTask (val) {
      this.isShowMultTask = false
    },
    // 多任务项会签信息获取
    getMultTaskInfo (val) {
      let multTaskForm = {
        approvalState: val.approvalState,
        approveNo: this.componentParams.businessSerialNumber,
        nextActivityDefId: val.nextLink,
        approvalOpinion: val.approvalOpinion,
        businessType: 'BT-PRE-APPROVE-IMPORT',
        workItemId: this.componentParams.workItemId,
        processInstId: this.componentParams.processInstId,
        activityInstId: this.componentParams.activityInstId
      }
      API.approve(multTaskForm)
        .then(res => {
          this.$message({
            message: '提交审批成功。',
            type: 'success',
            showClose: true
          })
          this.closeProcessInfo()
        })
        .catch(e => {
          this.loading = false
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
    // 多子流程会签弹窗
    multProcessSign () {
      this.isShowMultPro = true
    },
    closeMultPro (val) {
      this.isShowMultPro = false
    },
    // 多子流程会签信息获取
    getMultProInfo (val) {
      let multProForm = {
        approvalState: val.approvalState,
        approveNo: this.componentParams.businessSerialNumber,
        nextActivityDefId: val.nextActivityDefId,
        participantList: val.participants,
        approvalOpinion: val.approvalOpinion,
        businessType: 'BT-PRE-APPROVE-IMPORT ',
        workItemId: this.componentParams.workItemId,
        processInstId: this.componentParams.processInstId,
        activityInstId: this.componentParams.activityInstId
      }
      API.approve(multProForm)
        .then(res => {
          this.$message({
            message: '提交审批成功。',
            type: 'success',
            showClose: true
          })
          this.closeProcessInfo()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '提交失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  },
  created () {
    document.title = '批量预立项流程审批'
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

.launch-detail{
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
        height: 70px;
        line-height: 70px;
        margin-top: 30px;
        margin-bottom: 20px;
        padding: 0px 30px;

        font-size: 14px;
        color: #333333;
      }
    }
  }
</style>
