<template>
  <div class="milestone-approve">
    <!-- 审批页面 -->
    <div class="top-head" id="top-head">
      <div class="head-con">
        <!-- 根据当前流程节点获取处理的按钮操作 -->
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasOpinionBtn" @click="submitOpinion"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="hasSubmitBtn" @click="submitOpinion"><span class="global-family">提交下一处理</span></i>
          <!-- <i class="approve-icon svgfont-btn-submit" v-if="hasMultTaskBtn" @click="multTaskSign"><span class="global-family">提交下一处理</span></i> -->
          <!-- <i class="approve-icon svgfont-btn-submit" v-if="hasMultProBtn" @click="multProcessSign"><span class="global-family">提交下一处理</span></i> -->
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <!-- <i class="approve-icon svgfont-btn-submit"  @click="submitOpinion"><span class="global-family">填写审批意见</span></i>
          <i class="approve-icon svgfont-btn-submit"  @click="submitOpinion"><span class="global-family">提交下一处理</span></i> -->
          <!-- <i class="approve-icon svgfont-btn-submit"  @click="multTaskSign"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-submit"  @click="multProcessSign"><span class="global-family">提交下一处理</span></i> -->
          <!-- <i class="approve-icon svgfont-btn-trace"  @click="processTrace"><span class="global-family">流程跟踪</span></i> -->
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
      <div class="project-title">{{milestoneTitle}}</div>

      <div class="main-content">
        <div class="approval1" v-if="judgmentFormShowFlag=='1'">
          <el-form
            :model="judgmentForm"
            :rules="judgmentRules"
            label-position='right'
            ref="judgmentForm"
            label-width="120px">
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="审核评价:"
                  prop="judgment"
                >
                  <el-input
                    style="width: 100%"
                    :rows="3"
                    show-word-limit
                    maxlength="300"
                    type="textarea"
                    placeholder="请输入"
                    v-model="judgmentForm.judgment">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="approval1" v-if="judgmentFormShowFlag === '2' && milestoneFinishForm.judgment">
          <el-form
            label-position='right'
            ref="judgmentForm"
            label-width="120px">
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="审核评价:"
                  prop="judgment">
                  {{milestoneFinishForm.judgment}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="approval-form">
          <project-panel
            class="project-panel"
            title="里程碑完成情况"
            style="border:1px solid #E9E9E9"
          >
            <el-form
              :model="milestoneFinishForm"
              label-position='right'
              ref="ruleForm"
              label-width="180px">
              <el-row>
                <el-col :span="15">
                  <el-form-item label="里程碑名称:" prop="milestoneName" style="word-wrap:break-word">
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
                  <el-form-item label="关联项目名称:" prop="projectName" style="word-wrap:break-word">
                    {{milestoneFinishForm.projectName}}
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="关联项目编码:" prop="projectCode">
                    {{milestoneFinishForm.projectCode}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="projectCategory!==''&&projectCategory==='d'">
                <el-col :span="15">
                  <el-form-item label="需求单位:" prop="demandUnit">
                    <span v-for="(item,i) in milestoneFinishForm.demandUnit" :key="item.id">
                      {{item.demandUnitName}} <span v-if="i+1!=milestoneFinishForm.demandUnit.length">;</span>
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
                      {{item.commitmentUnitName}} <span v-if="i+1!=milestoneFinishForm.commitmentUnit.length">;</span>
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
                  <el-form-item label="预期成果:" prop="resultInformation" style="word-wrap:break-word">
                    <span  v-show="milestoneFinishForm.linkResultFlag=='0'">
                      {{milestoneFinishForm.resultInformation}}
                    </span>
                    <span v-show="milestoneFinishForm.linkResultFlag=='1'">
                      {{milestoneFinishForm.resultList?milestoneFinishForm.resultList.map(item => {return item.achievementName}).join('丶'):''}}
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" v-if="projectCategory==='d'">
                  <el-form-item
                    label="支撑公司或部门关键事件:"
                    prop="essentialAffair"
                    style="word-wrap:break-word">
                    {{milestoneFinishForm.essentialAffair}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="成果完成情况:"
                    prop="resultFinishStatus"
                    style="word-wrap:break-word"
                  >
                    {{milestoneFinishForm.resultFinishStatus}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="备注:"
                    prop="remark"
                    style="word-wrap:break-word"
                  >
                    {{milestoneFinishForm.remark}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </project-panel>
          <approval-opinion v-if="approvalOpinionList.length" :business-opinions-array="approvalOpinionList"></approval-opinion>
          <project-document-detail id="project-doc" :file-list="projectDocList" v-if="docVisible"></project-document-detail>
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
import mileAPI from '@/serve/API_milestoneManagement'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import projectAPI from '@/serve/API_groupPlanProject'

import param from '@/const/param'
import { getStore } from '@/store'
import projectPanel from '@/controller/components/projectPanel'
import projectDocumentDetail from './components/detail'
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
    } else if (to.query.processDefName) {
      next()
    } else {
      // view=1则跳转详情页面url
      let urlString = 'processInstID=' + to.query.processInstID
      next('/groupPlan/milestoneFlow/milestoneFlowDetail?' + urlString)
    }
  },
  components: {
    projectPanel,
    projectDocumentDetail
  },
  data () {
    return {
      judgmentFormShowFlag: '',
      judgmentForm: {
        judgment: ''
      },
      judgmentRules: {
        judgment: [{ required: true, message: '请输入审核评价', trigger: ['change', 'blur'] }]
      },
      milestoneTitle: '', //项目流程的标题
      projectName: '', // 项目名称
      developPackage: '', //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: '', //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      isShowApproval: true,
      approveNo: null,
      componentParams: { // 所有流程组件需要的参数
        title: '', //流程实例名称
        workItemId: parseInt(this.$route.query.workItemID), //工作项ID
        activityDefId: this.$route.query.activityDefID, //活动节点定义ID
        activityInstId: parseInt(this.$route.query.activityInstID), //活动实例 ID
        processTemplateCode: this.$route.query.processDefName, //流程实例ID
        processInstId: parseInt(this.$route.query.processInstID), //流程实例ID
        businessSerialNumber: null,
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      showBackTop: false, //滚动图片是否显示
      // projectInfo: {
      //   type: '11',
      //   documentNo: this.$route.query.id
      // },
      clearFlag: true, //true 触发滚动
      projectCode: '',
      milestoneFinishForm: {},
      approvalOpinionList: [],
      buttonList: [],
      hasOpinionBtn: false, // 填写审批意见
      isShowSubOpinion: false,
      processSubmitForm: {},
      hasSubmitBtn: false, // 提交下一处理按钮--提交下一处理人
      hasMultTaskBtn: false, // 提交下一处理按钮--会签（多任务项）
      isShowMultTask: false,
      multTaskForm: {},
      hasMultProBtn: false, // 提交下一处理按钮--会签（多子流程）
      isShowMultPro: false,
      isShowToRead: false, // 送阅知
      multProForm: {},
      nextHandleForm: {},
      hasTurnBtn: false, // 转办按钮
      isShowTransfer: false,
      transferForm: {},
      hasSendReadBtn: false, // 待阅按钮
      hasAbandonBtn: false, // 作废按钮
      projectDocList: [], //文档资料数据
      historyFlag: 0, //是否有历史数据
      docVisible: false
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
    document.title = '里程碑流程审批'

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
    if (this.$route.path === '/groupPlan/milestoneFlow/milestoneFlowApproveJudgment') {
      this.judgmentFormShowFlag = '1'
    } else {
      this.judgmentFormShowFlag = '2'
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
      this.hasMultTaskBtn = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.multTaskMeet)
      this.hasMultProBtn = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.multProMeet)
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
    // 填写审批意见
    submitOpinion () {
      if (this.judgmentFormShowFlag === '1') {
        this.$refs.judgmentForm.validate(valid => {
          if (valid) {
            this.isShowSubOpinion = true
          }
        })
      } else {
        this.isShowSubOpinion = true
      }
    },
    // 获取审批意见信息并提交
    getProSubmitInfo (info) {
      this.processSubmitForm = info
      this.processSubmitForm.workItemId = this.componentParams.workItemId
      this.processSubmitForm.businessSerialNumber = this.componentParams.businessSerialNumber
      this.processSubmitForm.approveNo = this.componentParams.businessSerialNumber
      this.processSubmitForm.activityInstId = this.$route.query.activityInstID
      if (this.judgmentFormShowFlag === '1') {
        this.processSubmitForm.judgment = this.judgmentForm.judgment
      }
      mileAPI.submitApprove(this.processSubmitForm)
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
      if (this.historyFlag === 1) {
        let params = {
          businessSerialNumber: this.componentParams.businessSerialNumber,
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
            businessSerialNumber: this.componentParams.businessSerialNumber,
            processInstId: this.componentParams.processInstId,
            userId: this.componentParams.userId
          }
        })
      }
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
      flowAPI.reassignWorkItem(params)
        .then(res => {
          this.$message({
            message: '转办成功！',
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
      // this.$confirm(' ', '是否确认作废?', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   showClose: false,
      //   customClass: 'self-message-box-delete',
      //   cancelButtonClass: 'self-message-box-delete-cancel',
      //   confirmButtonClass: 'self-message-box-delete-confirm'
      // })
      //   .then(() => {
      //     let params = {
      //       projectCode: this.projectCode,
      //       approveNo: this.componentParams.businessSerialNumber
      //     }
      //     API.disapproveProject(params)
      //       .then(res => {
      //         this.$message({
      //           type: 'success',
      //           center: true,
      //           message: '作废成功!'
      //         })
      //         // 界面不可见
      //         window.close()
      //       })
      //       .catch(e => {
      //         this.loading = false
      //         if (e.selfError) return
      //         if (e.message) {
      //           this.$message({
      //             message: e.message || '作废失败，请稍后重试！',
      //             type: 'error',
      //             showClose: true
      //           })
      //         }
      //       })
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消作废'
      //     })
      //   })
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
      // this.multTaskForm = val
      // API.submitApprove(this.multTaskForm)
      //   .then(res => {
      //     this.$message({
      //       message: '提交成功！',
      //       type: 'success',
      //       showClose: true
      //     })
      //   })
      //   .catch(e => {
      //     this.loading = false
      //     if (e.selfError) return
      //     if (e.message) {
      //       this.$message({
      //         message: e.message || '提交失败，请稍后重试！',
      //         type: 'error',
      //         showClose: true
      //       })
      //     }
      //   })
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
      // this.multProForm = val
      // API.submitApprove(this.multProForm)
      //   .then(res => {
      //     this.$message({
      //       message: '提交成功！',
      //       type: 'success',
      //       showClose: true
      //     })
      //   })
      //   .catch(e => {
      //     this.loading = false
      //     if (e.selfError) return
      //     if (e.message) {
      //       this.$message({
      //         message: e.message || '提交失败，请稍后重试！',
      //         type: 'error',
      //         showClose: true
      //       })
      //     }
      //   })
    },
    // 审批-获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.componentParams.processInstId)
        .then(res => {
          this.componentParams.title = res.processInstName
          this.componentParams.businessSerialNumber = res.businessSerialNumber
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
    // 根据业务流水号获取里程碑详情
    getMilesTemInfo () {
      mileAPI.getMilesDetailByApprove(this.approveNo)
        .then(res => {
          this.projectName = res.projectName
          this.milestoneFinishForm = res
          this.milestoneFinishForm.demandUnit = res.demandUnitList
          this.milestoneFinishForm.commitmentUnit = res.commitmentUnitList
          if (this.milestoneFinishForm.judgment) {
            this.judgmentForm.judgment = this.milestoneFinishForm.judgment
          }
          this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          this.projectDocList = res.files
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
.milestone-approve{
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
      .approval1{
        background: #fff;
        padding-top: 22px;
        padding-right: 30px;
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
