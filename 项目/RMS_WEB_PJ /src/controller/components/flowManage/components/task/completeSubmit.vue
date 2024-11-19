<template>
  <div class="launch-edit">
    <!-- 完成提交页面 -->
    <div class="top-head" id="top-head">
      <div class="head-con">
        <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
        <i class="approve-icon svgfont-btn-save" @click="saveFinishInfo(false)"><span class="global-family">保存</span></i>
        <i class="approve-icon svgfont-btn-submit" @click="submitOpinion"><span class="global-family">提交下一处理</span></i>
        <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
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
          <!-- 完成情况 -->
          <div class="completion">
            <el-form
              :model="completionForm"
              label-position='right'
              :rules="rules"
              ref="completionForm"
              label-width="150px">
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    :inline="false"
                    label-width="140px"
                    label="完成情况:"
                    prop="completion"
                  >
                    <el-input
                      style="width: 100%"
                      :rows="2"
                      show-word-limit
                      maxlength="512"
                      type="textarea"
                      placeholder="请输入"
                      v-model.trim="completionForm.completion"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- 项目文档上传 -->
          <project-document-upload
            id="project-doc"
            v-if="finishFileList && finishFileList.length > 0"
            :doc-params="docParams"
            :file-list="finishFileList"
            @existAttachmentIds="getDelIds"></project-document-upload>
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
                    <el-form-item label="任务审请日期:" prop="initiatedDate" style="word-wrap:break-word">
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
          <!-- 申请意见 -->
          <div id="approved-con">
            <approval-opinion v-if="isShowApprove" :business-opinions-array="opinionList"></approval-opinion>
          </div>
          <!-- 项目文档下载 -->
          <!-- <project-document-detail id="attach-doc" v-if="componentParams.businessSerialNumber" :doc-params="docParams"></project-document-detail> -->
          <project-document-detail
            id="attach-doc"
            v-if="applicationFileList && applicationFileList.length > 0 && docParams.projectCode"
            :doc-params="docParams"
            :file-list="applicationFileList"></project-document-detail>
        </div>
      </div>
    </div>
    <!-- 提交下一处理组件弹窗 -->
    <nextHandle
      :show="nextHandleVis"
      :business-serial-number="approveNo"
      :process-template-code="processTemplateCode"
      @confirmNextHandle="confirmNextHandle"
      @changeNextHandle="setNextHandleDia"></nextHandle>
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
  </div>
</template>
<script>
import { Message } from 'element-ui'
// import API from './API_milestoneManagement'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import { getStore } from '@/store'
import projectPanel from '@/controller/components/projectPanel'
import projectDocumentDetail from '../../../projectDocumentDetail'
import projectDocumentUpload from '../../../projectDocumentUpload'
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
    projectDocumentDetail,
    projectDocumentUpload
  },
  data () {
    return {
      isShowSubOpinion: false,
      opinionList: [], //审批意见数据
      docParams: {
        type: 'BT-PACKAGE-TASK',
        approveNo: this.approveNo,
        projectCode: null
      },
      attachments: [], // 附件id
      componentParams: { // 所有流程组件需要的参数--工作台拼接过来的
        workItemId: parseInt(this.$route.query.workItemID),
        businessSerialNumber: null,
        processInstId: parseInt(this.$route.query.processInstID),
        activityInstId: parseInt(this.$route.query.activityInstID),
        processTemplateCode: this.$route.query.processDefName,
        activityDefId: this.$route.query.activityDefID,
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      completionForm: { //完成情况表单
        completion: null
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
      processTemplateCode: null, // 流程模板id
      rules: {
        completion: [{ required: true, message: '请输入完成情况', trigger: ['change', 'blur'] }]
      },
      isEditable: true, //用户是否具有编辑权限
      showBackTop: false, //滚动图片是否显示
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      projectInfo: {
        type: '11',
        documentNo: this.$route.query.id
      },
      clearFlag: true, //true 触发滚动
      projectCode: '',
      nextHandleVis: false,
      approveNo: null,
      isShowApprove: true,
      applicationFileList: [], // 申请文档
      finishFileList: [], // 完成文档
      projectApprove: {} //表单信息
    }
  },
  created () {
    document.title = '任务申请流程完成提交'
    this.getProcessInstDetailById()
    this.projectCode = this.$route.query.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    // this.getProcessInstDetailById()
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
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.componentParams.processInstId)
        .then(res => {
          this.componentParams.businessSerialNumber = res.businessSerialNumber
          this.processTemplateCode = res.processTemplateCode
          this.docParams.approveNo = res.businessSerialNumber
          this.approveNo = res.businessSerialNumber
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

    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs, approveId) {
      this.attachmentIds = ids
      this.attachments = attachs
      this.approveId = approveId
    },
    //校验必传附件类型
    judgeAttachType () {
      let needUplodTypes = []
      let haveFileTypes = [] // 保存必填项中有文件的类型
      let attachments = this.attachments.filter(item => {
        return item.requiredFlag === '1'
      }) // 过滤必填项
      attachments.forEach(item => {
        if (item.fileName) {
          haveFileTypes.push(item.attachmentTypeName)
        }
      }) // 将有文件的必填项push进haveFileTypes
      attachments.forEach(item => {
        if (!haveFileTypes.some(i => i === item.attachmentTypeName)) {
          needUplodTypes.push(item.attachmentTypeName)
        }
      }) // 判断哪一项中没有文件
      if (needUplodTypes.length === 0) {
        return true
      } else {
        this.$message({
          type: 'error',
          message: '请上传' + needUplodTypes.toString() + '附件!'
        })
        return false
      }
    },
    saveFinishInfo (confirm = false) {
      let validType = this.judgeAttachType()
      this.completionForm.approveNo = this.approveNo
      this.completionForm.finishFileIdList = this.attachmentIds
      this.$refs.completionForm.validate(valid => {
        if (valid && validType) {
          API.saveTaskCompletion(this.completionForm)
            .then(res => {
              if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                // this.nextHandleVis = true
                this.isShowSubOpinion = true
              } else {
                // 提示保存成功是否提交申请
                this.$confirm(' ', '任务申请保存成功，是否提交申请?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  showClose: false,
                  customClass: 'self-message-box-delete',
                  cancelButtonClass: 'self-message-box-delete-cancel',
                  confirmButtonClass: 'self-message-box-delete-confirm'
                })
                  .then(() => {
                    this.saveFinishInfo(true)
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消提交申请'
                    })
                  })
                // 保存清空校验
                this.$refs['completionForm'].clearValidate()
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
        } else {
          return false
        }
      })
    },
    submitNext () { //提交下一处理
      this.saveFinishInfo(true)
    },
    // 确认提交下一处理
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      let params = {
        approveNo: this.approveNo,
        workItemId: parseInt(this.$route.query.workItemID),
        approvalOpinion: '同意',
        processInstId: '', // 流程实列id
        approvalState: 0,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participants: this.submitNextHandleInfo.participants
      }
      API.submitTaskApprove(params)
        .then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '提交审批成功。'
          })
          this.closeProcessInfo()
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
    // 关闭提交下一处理弹窗
    setNextHandleDia (val) {
      this.nextHandleVis = val
    },
    submitOpinion () {
      this.saveFinishInfo(true)
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
    // 获取任务申请详情信息
    getTaskInfo () {
      let param = {
        approveNo: this.approveNo
      }
      API.queryTaskDetail(param)
        .then(res => {
          if (res === null || res.approveRecord === null || res.approveRecord.total === 0) {
            this.isShowApprove = false
          }
          this.docParams.projectCode = res.projectCode
          this.applicationFileList = res.applicationFileList
          this.finishFileList = res.finishFileList
          this.completionForm.completion = res.completion
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
          this.opinionList = res.approveRecord ? res.approveRecord.approvals : null
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
  .completion{
    background: #fff;
    margin-bottom: 20px;
    padding-top: 20px;
    padding-right: 30px;
  }
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
