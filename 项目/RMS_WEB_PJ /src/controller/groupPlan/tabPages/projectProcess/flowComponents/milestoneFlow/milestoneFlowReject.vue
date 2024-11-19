<template>
  <div class="milestone-reject">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn" v-if="isEditable">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveMilesInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="submitBtnVisible" @click="nextHandle"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="cancelBtnVisible" @click="cancellation"><span class="global-family">作废</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">{{milestoneTitle}}</div>
      <div class="main-content">
        <div class="approval-form">
          <project-panel
            class="project-panel"
            title="里程碑完成情况"
            style="border:1px solid #E9E9E9"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              label-position='right'
              ref="ruleForm"
              label-width="180px">
              <el-row>
                <el-col :span="15">
                  <el-form-item label="里程碑名称:" prop="milestoneName">
                    {{milestoneFinishForm.milestoneName}}
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="计划完成时间:" prop="planFinishTime">
                    {{milestoneFinishForm.planFinishTime?formatDate(milestoneFinishForm.planFinishTime):''}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="15">
                  <el-form-item label="关联项目名称:" prop="projectCode">
                    {{milestoneFinishForm.projectName}}
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="关联项目编码:" prop="projectName">
                    {{milestoneFinishForm.projectCode}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="projectCategory!==''&&projectCategory==='d'">
                <el-col :span="15">
                  <el-form-item label="需求单位:" prop="demandUnit">
                    <span v-for="(item,i) in milestoneFinishForm.demandUnit" :key="item.id">
                      {{item.demandUnitName}}<span v-if="i+1!=milestoneFinishForm.demandUnit.length">;</span>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="里程碑评审人:" prop="milestoneReviewer">
                    {{milestoneFinishForm.milestoneReviewer}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="projectCategory!==''&&projectCategory==='d'">
                <el-col :span="15">
                  <el-form-item label="承担单位:" prop="commitmentUnit">
                    <span v-for="(item,i) in milestoneFinishForm.commitmentUnit" :key="item.id">
                      {{item.commitmentUnitName}}<span v-if="i+1!=milestoneFinishForm.commitmentUnit.length">;</span>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="里程碑负责人:" prop="milestoneLeader">
                    {{milestoneFinishForm.milestoneLeader}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预期成果:" prop="projectCode">
                    <span  v-show="milestoneFinishForm.linkResultFlag=='0'">
                      {{milestoneFinishForm.resultInformation}}
                    </span>
                    <span v-show="milestoneFinishForm.linkResultFlag=='1'">
                      {{milestoneFinishForm.resultList?milestoneFinishForm.resultList.map(item => {return item.achievementName}).join('丶'):""}}
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" v-if="projectCategory==='d'">
                  <el-form-item
                    label="支撑公司或部门关键事件:"
                    prop="essentialAffair">
                    <el-input
                      style="width: 100%"
                      :rows="2"
                      show-word-limit
                      maxlength="300"
                      type="textarea"
                      placeholder="请输入"
                      v-model="ruleForm.essentialAffair">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="成果完成情况:"
                    prop="resultFinishStatus"
                  >
                    <el-input
                      style="width: 100%"
                      :rows="2"
                      show-word-limit
                      maxlength="300"
                      type="textarea"
                      placeholder="请输入"
                      v-model.trim="ruleForm.resultFinishStatus">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="备注:"
                    prop="remark"
                  >
                    <el-input
                      style="width: 100%"
                      :rows="2"
                      show-word-limit
                      maxlength="300"
                      type="textarea"
                      placeholder="请输入"
                      v-model.trim="ruleForm.remark">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </project-panel>
          <project-document-upload
            id="project-doc"
            v-if="docVisible"
            :file-list="attachmentFileList"
            :doc-params="docParams"
            @existAttachmentIds="getAttachmentInfo"></project-document-upload>
          <approval-opinion v-if="approvalOpinionList.length" :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
      </div>
    </div>
    <!-- 提交下一处理组件 -->
    <next-handle
      :show="nextHandleVis"
      :business-serial-number="processParams.businessSerialNumber"
      :process-template-code="processParams.processTemplateCode"
      @confirmNextHandle="confirmNextHandle"
      @changeNextHandle="closeNextHandle"></next-handle>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getStore } from '@/store'
import mileAPI from '@/serve/API_milestoneManagement'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import projectAPI from '@/serve/API_groupPlanProject'
import param from '@/const/param'

import projectPanel from '@/controller/components/projectPanel'
import projectDocumentUpload from './components/index'
export default {
  beforeRouteEnter (to, from, next) {
    if (!to.query.processDefName) {
      flowAPI.getWorkItemDetail(parseInt(to.query.workItemID))
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            // next()
            next({
              path: to.fullPath,
              query: {
                processDefName: res.processDefName
              }
            })
          } else {
            let urlString = 'processInstID=' + to.query.processInstID
            next('/groupPlan/milestoneFlow/milestoneFlowDetail?' + urlString)
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
    } else {
      next()
    }
  },
  components: {
    projectPanel,
    projectDocumentUpload
  },
  data () {
    return {
      docVisible: false,
      milestoneTitle: '', //项目流程的标题
      projectName: '', // 项目名称
      developPackage: '', //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: '', //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      docParams: {
        businessType: '',
        approveNo: this.$route.query.id // 业务流水号
      },
      approveNo: '', //业务流水号
      ruleForm: {
        essentialAffair: '',
        resultFinishStatus: '',
        remark: ''
      },
      rules: {
        essentialAffair: [{ required: true, message: '请输入支撑公司或部门关键事件', trigger: ['change', 'blur'] }],
        resultFinishStatus: [{ required: true, message: '请输入成果完成情况', trigger: ['change', 'blur'] }]
      },
      attachmentFileList: [], // 单据附件列表
      isEditable: true, //用户是否具有编辑权限
      showBackTop: false, //滚动图片是否显示
      clearFlag: true, //true 触发滚动
      // approveId: '',
      projectCode: '',
      // attachmentTypeCode: '', //当前上传附件类型
      attachmentIds: [], //文档资料编辑后的文档ids
      milestoneFinishForm: {}, //保存刚进页面获取到的信息
      processParams: {
        workItemId: parseInt(this.$route.query.workItemID), //工作项ID
        activityDefId: this.$route.query.activityDefID, //活动节点定义ID
        activityInstId: parseInt(this.$route.query.activityInstID), //活动实例 ID
        processTemplateCode: this.$route.query.processDefName, //流程模板编码
        processInstId: parseInt(this.$route.query.processInstID), //流程实例ID
        businessSerialNumber: '', //业务流水号
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      buttonList: [],
      submitBtnVisible: true,
      cancelBtnVisible: false,
      nextHandleVis: false, //提交下一处理组件
      processTraceVis: false, //流程跟踪组件
      submitNextHandleInfo: null, //提交下一处理表单数据
      approvalOpinionList: [], //审批意见数据
      attachments: [], //文档资料要传送的数据 fileName 和fileCode
      historyFlag: 0//是否有历史数据
    }
  },
  watch: {
    projectName: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        document.title = val + '里程碑完成申请'
      }
    },
    projectCategory: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.projectCategory = val
      }
    }
  },
  created () {
    document.title = '里程碑流程驳回'
    this.projectCode = this.$route.params.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.$router.afterEach((to, from, next) => {
      window.scrollTo(0, 0)
    })
    // this.getWorkItemDetail()
    this.getFlowBtnList()
    this.getProcessInstDetailById()
  },
  methods: {
    // 获取当前工作项详情--是否显示审批操作按钮
    getWorkItemDetail () {
      flowAPI.getWorkItemDetail(this.processParams.workItemId)
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
    // 审批-获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.processParams.processInstId)
        .then(res => {
          this.processParams.businessSerialNumber = res.businessSerialNumber
          this.approveNo = res.businessSerialNumber
          this.getMilesTemInfo()
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
    // 日期格式化
    formatDate1 (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 根据业务流水号获取里程碑详情
    getMilesTemInfo () {
      mileAPI.getMilesDetailByApprove(this.approveNo)
        .then(res => {
          this.projectName = res.projectName
          this.milestoneFinishForm = res || {}
          this.milestoneFinishForm.demandUnit = res.demandUnitList
          this.milestoneFinishForm.commitmentUnit = res.commitmentUnitList
          this.ruleForm.essentialAffair = res.essentialAffair
          this.ruleForm.resultFinishStatus = res.resultFinishStatus
          this.ruleForm.remark = res.remark
          this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          this.attachmentFileList = res.files
          this.docVisible = true
          this.historyFlag = res.historyFlag
          this.projectCategory = res.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
          this.setTitle(res.projectCategory)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '里程碑完成流程信息获取失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    setTitle (e) {
      if (e === 'PC-DEMAND-UNIT') {
        this.milestoneTitle = '集团统筹项目-需求单位项目里程碑完成申请'
      }
      if (e === 'PC-UNDERTAKE-UNIT') {
        this.milestoneTitle = '集团统筹项目-承担单位项目里程碑完成申请'
      }
    },
    // 校验附件上传的文档必填项是否上传
    verifyDocument () {
      let needUplodTypes = []
      let haveFileTypes = [] // 保存必填项中有文件的类型
      let fileList = this.attachments.filter(item => {
        return item.requiredFlag === '1'
      }) // 过滤必填项
      fileList.forEach(item => {
        if (item.fileName) {
          haveFileTypes.push(item.attachmentTypeName)
        }
      }) // 将有文件的必填项push进haveFileTypes
      fileList.forEach(item => {
        if (!haveFileTypes.some(i => i === item.attachmentTypeName)) {
          needUplodTypes.push(item.attachmentTypeName)
        }
      }) // 判断哪一项中没有文件
      if (needUplodTypes.length === 0) {
        return true
      } else {
        this.$message({
          type: 'error',
          message: '请上传' + needUplodTypes.toString()
            .replace('附件', '') + '附件!'
        })
        return false
      }
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
          // this.buttonList = []
          // res.forEach(item => {
          //   this.buttonList.push(param.approvalButtonsObj[item.buttonCode])
          // })
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
      this.submitBtnVisible = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.nextProcessing)
      this.cancelBtnVisible = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.cancellation)
    },
    // 取消下一处理
    closeNextHandle () {
      this.nextHandleVis = false
    },
    // 确认提交下一处理
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      let params = {
        // milestoneFinishApplicationId: this.$route.query.milestoneFinishApplicationId,
        // id: this.$route.query.milestoneFinishApplicationId,
        // milestoneCode: this.$route.query.milestoneCode,
        // projectCode: this.projectCode,
        // businessSerialNumber: this.approveNo,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participants: this.submitNextHandleInfo.participants,
        workItemId: this.$route.query.workItemID,
        businessSerialNumber: this.processParams.businessSerialNumber
      }
      mileAPI.resubmitWithParticipant(params)
        .then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '里程碑申请创建成功。'
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
    // 流程跟踪
    processTrace () {
      if (this.historyFlag === 1) {
        let params = {
          businessSerialNumber: this.processParams.businessSerialNumber,
          milestoneCode: this.milestoneFinishForm.milestoneCode
        }
        mileAPI.flowFile(params)
          .then(res => {
            if (res && res.fileCode) {
              this.$router.push({
                path: '/processTrace',
                query: {
                  historyFlag: this.historyFlag,
                  fileCode: res.fileCode
                }
              })
            } else {
              this.$message({
                message: '此里程碑暂无历史附件！',
                type: 'error',
                showClose: true
              })
            }
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '里程碑历史附件获取失败！',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        this.$router.push({
          path: '/processTrace',
          query: {
            businessSerialNumber: this.processParams.businessSerialNumber,
            processInstId: this.processParams.processInstId,
            userId: this.processParams.userId
          }
        })
      }
    },
    // 提交下一处理
    nextHandle () {
      this.saveMilesInfo(true)
    },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
      // .format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取附件上传的附件ids
    getAttachmentInfo (ids, fileList) {
      this.attachmentIds = ids
      this.attachments = fileList
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
    // 保存里程碑编辑信息
    saveMilesInfo (confirm = false) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!this.verifyDocument()) { return }
          let attachmentFileList = []
          this.attachmentFileList.forEach(item => {
            if (item.fileCode) {
              attachmentFileList.push({ createTime: item.createTime, attachmentTypeCode: item.attachmentTypeCode, attachmentTypeName: item.attachmentTypeName, businessType: item.businessType, creatorName: item.creatorName || item.uploadBy, fileCode: item.fileCode, fileName: item.fileName, fileType: item.fileType })
            }
          })
          let params = {
            id: this.milestoneFinishForm.milestoneFinishApplicationId,
            projectCode: this.milestoneFinishForm.projectCode,
            projectName: this.milestoneFinishForm.projectName,
            milestoneCode: this.milestoneFinishForm.milestoneCode,
            resultFinishStatus: this.ruleForm.resultFinishStatus,
            essentialAffair: this.ruleForm.essentialAffair,
            remark: this.ruleForm.remark,
            files: attachmentFileList,
            businessSerialNumber: this.approveNo,
            processInstId: this.processParams.processInstId
          }
          mileAPI.tempUpdateMilestone(params)
            .then(res => {
              this.processParams.processTemplateCode = res.processTemplateCode
              if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                this.nextHandleVis = true
              } else {
                // 提示保存成功是否提交申请
                this.$confirm(' ', '里程碑申请保存成功，是否提交申请?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  showClose: false,
                  customClass: 'self-message-box-delete',
                  cancelButtonClass: 'self-message-box-delete-cancel',
                  confirmButtonClass: 'self-message-box-delete-confirm'
                })
                  .then(() => {
                    this.nextHandle()
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消提交申请'
                    })
                  })
                // 保存清空校验
                this.$refs['ruleForm'].clearValidate()
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
        }
      })
    },
    // 关闭流程信息页面
    closeProcessInfo () {
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.processParams.flushPortalUrl) {
        // window.location.href = 'https://www.baidu.com/' //test
        let paramsString = '?itemId=' + this.$route.query.itemId + '&appId=' + decodeURIComponent(this.$route.query.appID) + '&uniqueId=' + this.$route.query.uniqueId
        window.location.href = decodeURIComponent(this.processParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.close()
      }
    },
    // 作废流程编辑
    cancellation () {
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
            businessSerialNumber: this.processParams.businessSerialNumber
          }
          mileAPI.withdrawMilestoneProgress(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功。'
              })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.milestone-reject{
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
