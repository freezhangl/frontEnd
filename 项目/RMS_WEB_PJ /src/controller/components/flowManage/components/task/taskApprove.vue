<template>
  <div class="launch-edit">
    <!-- 审批页面 -->
    <div class="top-head" id="top-head">
      <div class="head-con">
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
        <!-- <i class="approve-icon svgfont-btn-cancellation" v-if="hasAbandonBtn" @click="abandonFlow"><span class="global-family">作废</span></i> -->
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">自立研发包项目任务申请及完成流程</div>

      <div class="main-content">
        <div class="approval-form">
          <!-- 基本信息 -->
          <div class="basic-info">
            <project-panel
              class="project-panel"
              title="基本信息"
            >
              <el-form
                :model="basicForm"
                label-position='right'
                ref="basicForm"
                label-width="150px">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="项目名称:" prop="projectName" style="word-wrap:break-word">
                      {{basicForm.projectName}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="任务名称:" prop="taskName" style="word-wrap:break-word">
                      {{basicForm.taskName}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="任务申请日期:" prop="initiatedDate" style="word-wrap:break-word">
                      {{basicForm.initiatedDate}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="计划开始时间:" prop="planStartTime" style="word-wrap:break-word">
                      {{basicForm.planStartTime}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="计划完成时间:" prop="planFinishTime" style="word-wrap:break-word">
                      {{basicForm.planFinishTime}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="需求部门:" prop="demandDepartment" style="word-wrap:break-word">
                      {{basicForm.demandDepartment}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="需求负责人:" prop="demandPerson" style="word-wrap:break-word">
                      {{basicForm.demandPerson}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="联系方式:" prop="demandPhone" style="word-wrap:break-word">
                      {{basicForm.demandPhone}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="承担单位:" prop="undertakeUnit" style="word-wrap:break-word">
                      {{basicForm.undertakeUnit}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="承担单位联系人:" prop="undertakeUnitPerson" style="word-wrap:break-word">
                      {{basicForm.undertakeUnitPerson}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="承担单位联系方式:" prop="undertakeUnitPhone" style="word-wrap:break-word">
                      {{basicForm.undertakeUnitPhone}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </project-panel>
          </div>
          <!-- 预算信息 -->
          <div id="project-budget">
            <project-panel title="预算信息(单位:万元)">
              <el-form
                :model="budgetFrom"
                label-position='right'
                ref="budgetFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      label="本次申请预算:"
                      prop="applicationBudget"
                      style="word-wrap:break-word"
                      label-width="140px">
                      {{budgetFrom.applicationBudget | numTransition}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="项目总预算:" prop="totalBudget" style="word-wrap:break-word">
                      {{budgetFrom.totalBudget | numTransition}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      style="word-wrap:break-word"
                      :inline="false"
                      label-width="140px"
                      label="任务描述及要求:"
                      :rules="[
                        { required: true }
                      ]"
                    >
                      {{budgetFrom.descriptionRequirement}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      style="word-wrap:break-word"
                      :inline="false"
                      label-width="140px"
                      label="需求风险提示:"
                      :rules="[
                        { required: true }
                      ]"
                    >
                      {{budgetFrom.demandRiskTip}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      style="word-wrap:break-word"
                      :inline="false"
                      label-width="140px"
                      label="预期完成效果:"
                      :rules="[
                        { required: true }
                      ]"
                    >
                      {{budgetFrom.expectedEffect}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      style="word-wrap:break-word"
                      :inline="false"
                      label-width="140px"
                      label="备注:"
                    >
                      {{budgetFrom.remark}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </project-panel>
          </div>
          <!-- 审批意见 -->
          <div id="approved-con" v-if="isShowApprove">
            <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
          </div>
          <!-- 项目文档下载 -->
          <!-- <project-document-detail id="attach-doc" v-if="componentParams.businessSerialNumber" :doc-params="docParams"></project-document-detail> -->
          <project-document-detail id="attach-doc" v-if="componentParams.businessSerialNumber" :doc-params="docParams"></project-document-detail>
        </div>
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
import { getStore } from '@/store'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import singleAPI from '@/serve/API_single'
import param from '@/const/param'
import projectPanel from '@/controller/components/projectPanel'
import projectDocumentDetail from '../../../projectDocumentDetail'
export default {
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
            next('/task/taskDetail?' + urlString)
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
      next('/task/taskDetail?' + urlString)
    }
  },
  components: {
    projectPanel,
    projectDocumentDetail
  },
  data () {
    return {
      tableHeadStyle: { // 项目文档表头样式
        background: '#F4F4F4',
        color: 'rgba(0,0,0,0.85)'
      },
      isShowToRead: false, // 送阅知
      isShowApprove: true,
      approvalOpinionList: [], //审批意见数据
      docParams: {
        type: 'BT-PACKAGE-TASK',
        approveNo: '' //this.$route.query.businessSerialNumber
      },
      basicForm: { //基本信息表单
        projectName: null, //项目名称
        taskName: null, //任务名称
        initiatedDate: null, // 任务申请日期
        planStartTime: null, //计划开始时间
        planFinishTime: null, //计划完成时间
        demandDepartment: null, // 需求部门
        demandPerson: null, //需求负责人
        demandPhone: null, //联系方式
        undertakeUnit: null, //承担单位
        undertakeUnitPerson: null, //承担单位联系人
        undertakeUnitPhone: null, // 承担单位联系方式
        completion: null //任务完成情况
      },
      budgetFrom: { //预算信息表单
        applicationBudget: null, // 本次申请预算
        totalBudget: null, // 项目总预算
        descriptionRequirement: null, // 任务描述及要求
        demandRiskTip: null, // 需求风险提示
        expectedEffect: null, // 预期完成效果
        remark: null // 备注
      },
      showBackTop: false, //滚动图片是否显示
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      clearFlag: true, //true 触发滚动
      projectCode: '',

      componentParams: { // 所有流程组件需要的参数--工作台拼接过来的
        // test
        // workItemId: 1532,
        // businessSerialNumber: null,
        // processInstId: 992,
        // activityInstId: 2671,
        // processTemplateCode: 131,
        // activityDefId: 'manualActivity1',
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
      multProForm: {},
      isShowNextHandle: false,
      nextHandleForm: {},
      hasTurnBtn: false, // 转办按钮
      isShowTransfer: false,
      transferForm: {},
      hasSendReadBtn: false, // 待阅按钮
      hasAbandonBtn: false, // 作废按钮
      projectApprove: {} //表单信息
    }
  },
  created () {
    document.title = '任务申请流程审批'
    this.projectCode = this.$route.query.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    // this.getWorkItemDetail()
    this.getFlowBtnList()
    this.getProcessInstDetailById()
  },
  filters: {
    // 过滤小数位后0
    numTransition (val) {
      if (val) {
        if (val.indexOf('.') !== -1) {
          let splitArr = val.split('.')
          let reverseArr = splitArr[1].split('')
            .reverse()
          let reverseArr2 = []
          reverseArr.forEach(item => {
            reverseArr2.push(item)
          })
          reverseArr.some((item, index) => {
            if (!parseInt(item)) {
              reverseArr2.shift()
            } else {
              return true
            }
          })
          reverseArr2 = reverseArr2.reverse()
            .join('')
          if (reverseArr2 && reverseArr2.length > 0) {
            return splitArr[0] + '.' + reverseArr2
          } else {
            return splitArr[0]
          }
        } else {
          return val
        }
      } else {
        return val
      }
    }
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 获取当前工作项详情--是否显示审批操作按钮
    getWorkItemDetail () {
      flowAPI.getWorkItemDetail(this.componentParams.workItemId)
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            this.getFlowBtnList()
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
        processTemplateCode: this.componentParams.processTemplateCode,
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
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.componentParams.processInstId)
        .then(res => {
          this.componentParams.title = res.processInstName
          this.componentParams.businessSerialNumber = res.businessSerialNumber
          this.docParams.approveNo = this.componentParams.businessSerialNumber
          this.getTaskInfo()
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

    // 获取任务申请详情信息
    getTaskInfo () {
      let param = {
        approveNo: this.docParams.approveNo
      }
      API.queryTaskDetail(param)
        .then(res => {
          // res.initiatedDate = res.initiatedDate === null ? null : this.formatDate(res.initiatedDate)
          // res.planStartTime = res.planStartTime === null ? null : this.formatDate(res.planStartTime)
          // res.planFinishTime = res.planFinishTime === null ? null : this.formatDate(res.planFinishTime)
          // this.basicForm = res
          // this.budgetFrom = res.projectTaskBudget
          // this.taskFileList = res.applicationFileList.concat(res.finishFileList)
          if (res === null || res.approveRecord === null || res.approveRecord.total === 0) {
            this.isShowApprove = false
          }
          this.basicForm.projectName = res.projectName // 项目名称
          this.basicForm.initiatedDate = this.formatDate(res.initiatedDate) // 申请时间
          this.basicForm.demandDepartment = res.demandDepartment // 需求部门
          this.basicForm.demandPerson = res.demandPerson // 需求负责人
          this.basicForm.demandPhone = res.demandPhone // 联系方式
          this.basicForm.taskName = res.name // 任务名称
          this.basicForm.planStartTime = this.formatDate(res.planStartTime) // 计划开始时间
          this.basicForm.planFinishTime = this.formatDate(res.planFinishTime) // 计划完成时间
          this.basicForm.undertakeUnit = res.undertakeUnit // 承担单位
          this.basicForm.undertakeUnitPerson = res.undertakeUnitPerson // 承担单位联系人
          this.basicForm.undertakeUnitPhone = res.undertakeUnitPhone // 承担单位联系人
          this.budgetFrom.descriptionRequirement = res.projectTaskBudgetDto.descriptionRequirement // 任务描述
          this.budgetFrom.demandRiskTip = res.projectTaskBudgetDto.demandRiskTip // 风险提示
          this.budgetFrom.expectedEffect = res.projectTaskBudgetDto.expectedEffect // 预期完成效果
          this.budgetFrom.remark = res.projectTaskBudgetDto.remark // 备注
          this.budgetFrom.applicationBudget = res.projectTaskBudgetDto.applicationBudget //本次申请预算
          this.budgetFrom.totalBudget = res.projectTaskBudgetDto.totalBudget //项目总预算
          this.approvalOpinionList = res.approveRecord ? res.approveRecord.approvals : null
          this.projectApprove.historyFlag = res.historyFlag
          this.projectApprove.historyApproveFileId = res.historyApproveFileId
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取任务申请详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 填写审批意见
    submitOpinion () {
      this.isShowSubOpinion = true
    },
    // 获取审批意见信息并提交
    getProSubmitInfo (info) {
      this.processSubmitForm = info
      this.processSubmitForm.businessType = 'BT-PACKAGE-TASK'
      this.processSubmitForm.workItemId = this.componentParams.workItemId
      this.processSubmitForm.businessSerialNumber = this.componentParams.businessSerialNumber
      this.processSubmitForm.approveNo = this.componentParams.businessSerialNumber
      this.processSubmitForm.activityInstId = this.componentParams.activityInstId
      API.submitTaskApprove(this.processSubmitForm)
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
      // TODO 转办接口
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
    // 待阅
    pendingApprove () {
      this.isShowToRead = true
    },
    closeToRead (val) {
      this.isShowToRead = val
    },
    // 作废
    abandonFlow () {
      this.$confirm(' ', '是否确认作废?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          singleAPI.deletePackageTask(this.docParams.approveNo)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功!'
              })
              this.$router.push({
                path: this.backUrl,
                query: {
                  activeTab: 'projectProgress',
                  flowPoint: '任务申请'
                }
              })
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
        businessType: 'BT-PACKAGE-TASK',
        workItemId: this.componentParams.workItemId,
        processInstId: this.componentParams.processInstId,
        activityInstId: this.componentParams.activityInstId
      }
      API.submitTaskApprove(multTaskForm)
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
        participants: val.participants,
        approvalOpinion: val.approvalOpinion,
        businessType: 'BT-PACKAGE-TASK',
        workItemId: this.componentParams.workItemId,
        processInstId: this.componentParams.processInstId,
        activityInstId: this.componentParams.activityInstId
      }
      API.submitTaskApprove(multProForm)
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

    firstColumnStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (column.span !== 0) {
          return 'first-column-style'
        }
      }
    },
    scrollWindow () {
      if (!this.clearFlag) {
        return
      }
      let doc = document.documentElement || document.body
      let sTop = doc.scrollTop
      let cHei = doc.clientHeight
      let sHei = doc.scrollHeight
      if (sTop > 200) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    },
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
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
        window.close()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.launch-edit{
 /deep/ .el-form-item__content:hover{
  .el-form-item__error{
    display: inline-block;
  }
}
/deep/ .el-form-item__error{
  display: none;
  background: #fff;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: -32px;
  border: 1px solid #f56c6c;
  right: 1px;
  z-index: 999999999;
  padding: 4px !important;
  left: auto;
  white-space: nowrap;
}

/deep/ .el-form-item__error:before{
content: ”;
position: absolute;
top: 18px;
left: 12px;
width: 4px;
height: 4px;
border: 1px solid #f56c6c;
background: #fff;
border-top-color: transparent;
border-left-color: transparent;
content: " ";
transform: rotate(
45deg
);
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

    }
    .main-content{
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      .approval-form{
        // background:#fff;
        // height: 70px;
        // line-height: 70px;
        .el-table{
          font-size: 14px;
          color: #333333;
          /deep/ .el-table__header th{
            &:nth-child(1){
              border-right: 1px solid #E8E8E8;
            }
          }
          /deep/ .el-table__body{
            .first-column-style{
              border-right: 1px solid #E8E8E8;
              background: #F4F4F4 !important;
            }
          }
        }
        margin-top: 30px;
         .el-form-item .el-input__inner{
          width : 100%;
        }
        .project-panel {
          margin-bottom: 20px;
          .panel-body{
            &.is-expand{
              padding: 20px 30px;
            }
          margin-bottom: 0px;
          }
        }
      }
    }
  }
</style>
