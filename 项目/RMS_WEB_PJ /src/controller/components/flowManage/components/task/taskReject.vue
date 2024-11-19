<template>
  <div class="launch-edit">
    <!-- 驳回页面 -->
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveTaskInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="submitBtnVisible" @click="submitNext"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-cancellation" @click="cancellation"><span class="global-family">作废</span></i>
        </span>
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
          <project-panel
            class="project-panel"
            title="基本信息"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              label-position='right'
              ref="ruleForm"
              label-width="150px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="项目名称:" prop="projectName" style="word-wrap:break-word">
                    {{ruleForm.projectName}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="任务名称:" prop="taskName" style="word-wrap:break-word;padding-right:6px">
                    <el-input
                      style="width: 100%"
                      placeholder="请输入"
                      v-model="ruleForm.taskName">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务申请日期:" prop="initiatedDate" style="word-wrap:break-word">
                    {{ruleForm.applicationDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划开始时间:" prop="planStartTime">
                    <el-date-picker
                      v-model="ruleForm.planStartTime"
                      :picker-options="startTimeOptions"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划完成时间:" prop="planFinishTime" style="word-wrap:break-word">
                    <el-date-picker
                      v-model="ruleForm.planFinishTime"
                      :picker-options="endTimeOptions"
                      type="date"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="需求部门:" prop="demandDepartment" style="word-wrap:break-word">
                    {{ruleForm.demandDepartment}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="需求负责人:" prop="demandPerson" style="word-wrap:break-word">
                    {{ruleForm.demandPerson}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系方式:" prop="demandPhone" style="word-wrap:break-word">
                    {{ruleForm.demandPhone}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="承担单位:" prop="undertakeUnit" style="word-wrap:break-word">
                    <el-input
                      style="width: 100%"
                      placeholder="请输入"
                      v-model="ruleForm.undertakeUnit">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="承担单位联系人:" prop="undertakeUnitPerson" style="word-wrap:break-word">
                    <el-input
                      style="width: 100%"
                      placeholder="请输入"
                      v-model="ruleForm.undertakeUnitPerson">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="承担单位联系方式:" prop="undertakeUnitPhone" style="word-wrap:break-word">
                    <el-input
                      style="width: 100%"
                      placeholder="请输入"
                      v-model="ruleForm.undertakeUnitPhone">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </project-panel>
          <div id="project-budget">
            <!-- 成本预算 -->
            <project-budget
              id="project-budget"
              ref="projectBudget"
              :year-range-prop="planYearRange"
              :project-code="projectCode"
              :info='ruleForm'
              :receive-data="costBudgetList"></project-budget>
          </div>
          <!-- 项目文档上传 -->
          <project-document-upload
            id="project-doc"
            v-if="applicationFileList && applicationFileList.length > 0 && docParams.projectCode"
            :file-list="applicationFileList"
            :doc-params="docParams"
            @existAttachmentIds="getDelIds"></project-document-upload>
          <div id="approved-con" v-if="isShowApprove">
            <approval-opinion :business-opinions-array="opinionList"></approval-opinion>
          </div>
        </div>
      </div>
    </div>

    <next-handle
      :show="nextHandleVis"
      :business-serial-number="processParams.businessSerialNumber"
      :process-template-code="processParams.processTemplateCode"
      @confirmNextHandle="confirmNextHandle"
      @changeNextHandle="setNextHandleDia">
    </next-handle>
  </div>
</template>
<script>
import { Message } from 'element-ui'
// import API from './API_milestoneManagement'
import API from '@/serve/API_project'
import singleAPI from '@/serve/API_single'
import flowAPI from '@/serve/API_flow'
import projectPanel from '@/controller/components/projectPanel'
import projectDocumentUpload from '../../../projectDocumentUpload'
import projectBudget from './budget/index'
import { getStore } from '@/store'
import param from '@/const/param'
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
    } else {
      next()
    }
  },
  components: {
    projectPanel,
    projectBudget,
    projectDocumentUpload
  },
  data () {
    var validateDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择计划完成时间'))
      }

      if (this.ruleForm.planApprovalTime && value < this.ruleForm.planApprovalTime) {
        callback(new Error('计划完成时间不能早于计划开始时间'))
      }
      callback()
    }
    // 校验手机格式
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      const reg = /^1[3-9]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('请输入正确手机号'))
      }
      callback()
    }
    return {
      startTimeOptions: {
        disabledDate: time => {
          if (this.ruleForm.planFinishTime) {
            return (
              time.getTime() >
              new Date(this.ruleForm.planFinishTime)
                .getTime()
            )
          }
        }
      },
      endTimeOptions: {
        disabledDate: time => {
          if (this.ruleForm.planApprovalTime) {
            return (
              time.getTime() <
              new Date(this.ruleForm.planApprovalTime)
                .getTime()
            )
          }
        }
      },
      planYearRange: ['项目总预算', '已占用预算', '可用预算', '本次申请预算'],
      tableHeadStyle: { // 项目文档表头样式
        background: '#F4F4F4',
        color: 'rgba(0,0,0,0.85)'
      },
      docParams: {
        type: 'BT-PACKAGE-TASK',
        approveNo: '', //this.$route.query.businessSerialNumber
        projectCode: null
      },
      attachments: [],
      attachmentIds: [], // 附件id
      approveNo: '', // 业务流水号
      //项目预算数据
      costBudgetList: [], // 项目预算
      ruleForm: { //基本信息表单
        projectName: null, //项目名称
        taskName: null, //任务名称
        applicationDate: null, // 任务申请日期
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
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 1, max: 256, message: '长度在 1 到 256 个字符', trigger: ['change', 'blur'] }
        ],
        planStartTime: [{ required: true, message: '请选择计划开始时间', trigger: 'blur' }],
        planFinishTime: [{ required: true, validator: validateDate, trigger: 'change' }],
        undertakeUnit: [
          { required: true, message: '请输入承担单位', trigger: 'blur' },
          { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: ['change', 'blur'] }
        ],
        undertakeUnitPerson: [
          { required: true, message: '请输入承担单位联系人', trigger: 'blur' },
          { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: ['change', 'blur'] }
        ],
        undertakeUnitPhone: [
          { required: true, validator: checkMobile, trigger: ['change', 'blur'] }
        ]
      },
      showBackTop: false, //滚动图片是否显示
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      projectInfo: {
        type: '11',
        documentNo: this.$route.query.id
      },
      clearFlag: true, //true 触发滚动
      projectCode: '',
      versionNo: '',
      versionCreatedDate: '',
      processParams: {
        workItemId: parseInt(this.$route.query.workItemID), //工作项ID
        businessSerialNumber: '', //业务流水号
        processInstId: parseInt(this.$route.query.processInstID), //流程实例ID
        activityInstId: parseInt(this.$route.query.activityInstID),
        processTemplateCode: this.$route.query.processDefName, //流程模板编码
        activityDefId: this.$route.query.activityDefID, //活动节点定义ID
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      isShowApprove: false,
      opinionList: [],
      buttonList: [],
      submitBtnVisible: true,
      traceBtnVisible: true,
      cancelBtnVisible: true,
      nextHandleVis: false, //提交下一处理组件
      submitNextHandleInfo: null, //提交下一处理表单数据
      applicationFileList: [], // 申请文档
      finishFileList: [], // 完成文档
      projectApprove: {}, //表单信息
      budgetIsChange: false, // 预算金额是否发生变更
      oldCostBudgetList: [], // 当项目预算的数据发生变更后用来对比数据
      budgetKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts', 'totalAmount']
    }
  },
  created () {
    document.title = '任务申请流程驳回页面'
    this.projectCode = this.$route.query.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getProcessInstDetailById()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    //根据流程实例ID获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.processParams.processInstId)
        .then(res => {
          this.processParams.businessSerialNumber = res.businessSerialNumber
          this.docParams.approveNo = this.processParams.businessSerialNumber
          this.approveNo = this.processParams.businessSerialNumber
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
    // 获取流程指定节点按钮配置
    getFlowBtnList () {
      let params = {
        processTemplateCode: this.processParams.processTemplateCode,
        activityDefId: this.processParams.activityDefId
      }
      flowAPI.getButtonList(params)
        .then(res => {
          this.buttonList = res
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
      this.traceBtnVisible = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.processTrace)
      this.cancelBtnVisible = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.cancellation)
    },
    // 获取任务申请详情信息
    getTaskInfo () {
      let param = {
        approveNo: this.docParams.approveNo
      }
      API.queryTaskDetail(param)
        .then(res => {
          if (res === null || res.approveRecord === null) {
            this.isShowApprove = false
          } else {
            this.isShowApprove = true
          }
          if (!this.budgetIsChange) {
            this.projectCode = res.projectCode
            this.versionCreatedDate = res.versionCreatedDate
            this.versionNo = res.versionNo
            this.ruleForm.versionNo = res.versionNo
            this.ruleForm.versionCreatedDate = res.versionCreatedDate
            this.docParams.projectCode = res.projectCode
            this.applicationFileList = res.applicationFileList
            this.finishFileList = res.finishFileList
            this.approveNo = res.approveNo
            this.ruleForm.projectName = res.projectName // 项目名称
            this.ruleForm.applicationDate = this.formatDate(res.initiatedDate)// 申请时间
            this.ruleForm.demandDepartment = res.demandDepartment // 需求部门
            this.ruleForm.demandPerson = res.demandPerson // 需求负责人
            this.ruleForm.demandPhone = res.demandPhone // 联系方式
            this.ruleForm.taskName = res.name // 任务名称
            this.ruleForm.planStartTime = new Date(res.planStartTime) // 计划开始时间
            this.ruleForm.planFinishTime = new Date(res.planFinishTime) // 计划完成时间
            this.ruleForm.undertakeUnit = res.undertakeUnit // 承担单位
            this.ruleForm.undertakeUnitPerson = res.undertakeUnitPerson // 承担单位联系人
            this.ruleForm.undertakeUnitPhone = res.undertakeUnitPhone // 承担单位联系方式
            this.ruleForm.taskDesAndRequire = res.projectTaskBudgetDto.descriptionRequirement // 任务描述projectTaskBudgetDto.
            this.ruleForm.demandRisk = res.projectTaskBudgetDto.demandRiskTip // 风险提示
            this.ruleForm.resultInformation = res.projectTaskBudgetDto.expectedEffect // 预期完成效果
            this.ruleForm.remark = res.projectTaskBudgetDto.remark // 备注
            let totalBudget = {}
            totalBudget = res.projectTaskBudgetDto.totalBudgetDetail // 项目总预算
            totalBudget.timeYear = '项目总预算'
            this.costBudgetList.push(totalBudget)
            let usedBudget = {}
            usedBudget = res.projectTaskBudgetDto.usedBudgetDetail // 已占用预算
            usedBudget.timeYear = '已占用预算'
            this.costBudgetList.push(usedBudget)
            let availableBudget = {}
            availableBudget = res.projectTaskBudgetDto.availableBudgetDetail // 可用预算
            availableBudget.timeYear = '可用预算'
            this.costBudgetList.push(availableBudget)
            let applicationBudget = {} // 本次申请预算
            applicationBudget = res.projectTaskBudgetDto.applicationBudgetDetail // 可用预算
            applicationBudget.timeYear = '本次申请预算'
            this.costBudgetList.push(applicationBudget)
            this.oldCostBudgetList = JSON.parse(JSON.stringify(this.costBudgetList))
            // this.fileListItem = res.applicationFileList
            this.opinionList = res.approveRecord ? res.approveRecord.approvals : null
            this.projectApprove.historyFlag = res.historyFlag
            this.projectApprove.historyApproveFileId = res.historyApproveFileId
          } else {
            this.costBudgetList.forEach(item => {
              if (item.timeYear === '项目总预算') {
                item.budgetOutsourcing = res.projectTaskBudgetDto.totalBudgetDetail.budgetOutsourcing // 项目总预算
                item.budgetInsourcing = res.projectTaskBudgetDto.totalBudgetDetail.budgetInsourcing // 项目总预算
                item.staffTime = res.projectTaskBudgetDto.totalBudgetDetail.staffTime // 项目总预算
                item.laborCosts = res.projectTaskBudgetDto.totalBudgetDetail.laborCosts // 项目总预算
                item.travelExpenses = res.projectTaskBudgetDto.totalBudgetDetail.travelExpenses // 项目总预算
                item.conferenceExpenses = res.projectTaskBudgetDto.totalBudgetDetail.conferenceExpenses // 项目总预算
                item.assetDepreciation = res.projectTaskBudgetDto.totalBudgetDetail.assetDepreciation // 项目总预算
                item.otherCosts = res.projectTaskBudgetDto.totalBudgetDetail.otherCosts // 项目总预算
              } else if (item.timeYear === '已占用预算') {
                item.budgetOutsourcing = res.projectTaskBudgetDto.usedBudgetDetail.budgetOutsourcing // 已占用预算
                item.budgetInsourcing = res.projectTaskBudgetDto.usedBudgetDetail.budgetInsourcing // 已占用预算
                item.staffTime = res.projectTaskBudgetDto.usedBudgetDetail.staffTime // 已占用预算
                item.laborCosts = res.projectTaskBudgetDto.usedBudgetDetail.laborCosts // 已占用预算
                item.travelExpenses = res.projectTaskBudgetDto.usedBudgetDetail.travelExpenses // 已占用预算
                item.conferenceExpenses = res.projectTaskBudgetDto.usedBudgetDetail.conferenceExpenses // 已占用预算
                item.assetDepreciation = res.projectTaskBudgetDto.usedBudgetDetail.assetDepreciation // 已占用预算
                item.otherCosts = res.projectTaskBudgetDto.usedBudgetDetail.otherCosts // 已占用预算
              } else if (item.timeYear === '可用预算') {
                item.budgetOutsourcing = res.projectTaskBudgetDto.availableBudgetDetail.budgetOutsourcing // 可用预算
                item.budgetInsourcing = res.projectTaskBudgetDto.availableBudgetDetail.budgetInsourcing // 可用预算
                item.staffTime = res.projectTaskBudgetDto.availableBudgetDetail.staffTime // 可用预算
                item.laborCosts = res.projectTaskBudgetDto.availableBudgetDetail.laborCosts // 可用预算
                item.travelExpenses = res.projectTaskBudgetDto.availableBudgetDetail.travelExpenses // 可用预算
                item.conferenceExpenses = res.projectTaskBudgetDto.availableBudgetDetail.conferenceExpenses // 可用预算
                item.assetDepreciation = res.projectTaskBudgetDto.availableBudgetDetail.assetDepreciation // 可用预算
                item.otherCosts = res.projectTaskBudgetDto.availableBudgetDetail.otherCosts // 可用预算
              }
            })
            if (this.costBudgetList && this.costBudgetList.length > 0) {
              this.costBudgetList.forEach(item => {
                //定义存储不同字段的对象
                item.highlightProps = {}
                //右侧对应年份的对象，TODO：右侧为空
                let rightItem = this.oldCostBudgetList ? this.oldCostBudgetList.filter(right => right.timeYear === item.timeYear) : []
                //遍历需对比的字段
                this.budgetKeys.forEach(budgetKey => {
                  if (rightItem.length === 0 || this.numTransition(item[budgetKey]) !== this.numTransition(rightItem[0][budgetKey])) {
                    //字段值不一致则高亮
                    this.$set(item.highlightProps, budgetKey, true)
                  }
                })
              })
            }
            this.ruleForm.versionNo = res.versionNo
            this.ruleForm.versionCreatedDate = res.versionCreatedDate
          }
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
    // 对比old预算数据和new预算数据的时候统一格式，去掉没用的0
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
    },
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs, approveId) {
      this.attachmentIds = ids
      this.attachments = attachs
      // this.approveId = approveId
    },
    changeTime (type) {
      if (
        this.ruleForm.planApprovalTime &&
        this.ruleForm.planFinishTime
      ) {
        let startYear = new Date(this.ruleForm.planApprovalTime)
        let endYear = new Date(this.ruleForm.planFinishTime)
        this.$emit('changeTime', [startYear, endYear], type)
      }
    },
    // 流程跟踪
    processTrace () {
      this.$router.push({
        path: '/processTrace',
        query: {
          businessSerialNumber: this.processParams.businessSerialNumber,
          processInstId: this.processParams.processInstId,
          userId: this.processParams.userId,
          fileCode: this.projectApprove.historyApproveFileId,
          historyFlag: this.projectApprove.historyFlag
        }
      })
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
      }
    },
    // 获取预算信息的信息-新增调用
    getProjectTaskInfo () {
      let param = {
        projectCode: this.projectCode
      }
      if (this.budgetIsChange) {
        param.approveNo = this.approveNo
      }
      API.queryProjectInfoPre(param)
        .then(res => {
          if (res === null || res.approveRecord === null) {
            this.isShowApprove = false
          } else {
            this.isShowApprove = true
          }
          if (!this.budgetIsChange) {
            this.projectCode = res.projectCode
            this.docParams.projectCode = res.projectCode
            this.applicationFileList = res.applicationFileList
            this.finishFileList = res.finishFileList
            this.approveNo = res.approveNo
            this.ruleForm.projectName = res.projectName // 项目名称
            this.ruleForm.applicationDate = this.formatDate(res.initiatedDate)// 申请时间
            this.ruleForm.demandDepartment = res.demandDepartment // 需求部门
            this.ruleForm.demandPerson = res.demandPerson // 需求负责人
            this.ruleForm.demandPhone = res.demandPhone // 联系方式
            this.ruleForm.taskName = res.name // 任务名称
            this.ruleForm.planStartTime = new Date(res.planStartTime) // 计划开始时间
            this.ruleForm.planFinishTime = new Date(res.planFinishTime) // 计划完成时间
            this.ruleForm.undertakeUnit = res.undertakeUnit // 承担单位
            this.ruleForm.undertakeUnitPerson = res.undertakeUnitPerson // 承担单位联系人
            this.ruleForm.undertakeUnitPhone = res.undertakeUnitPhone // 承担单位联系方式
            this.ruleForm.taskDesAndRequire = res.projectTaskBudgetDto.descriptionRequirement // 任务描述projectTaskBudgetDto.
            this.ruleForm.demandRisk = res.projectTaskBudgetDto.demandRiskTip // 风险提示
            this.ruleForm.resultInformation = res.projectTaskBudgetDto.expectedEffect // 预期完成效果
            this.ruleForm.remark = res.projectTaskBudgetDto.remark // 备注
            let totalBudget = {}
            totalBudget = res.projectTaskBudgetDto.totalBudgetDetail // 项目总预算
            totalBudget.timeYear = '项目总预算'
            this.costBudgetList.push(totalBudget)
            let usedBudget = {}
            usedBudget = res.projectTaskBudgetDto.usedBudgetDetail // 已占用预算
            usedBudget.timeYear = '已占用预算'
            this.costBudgetList.push(usedBudget)
            let availableBudget = {}
            availableBudget = res.projectTaskBudgetDto.availableBudgetDetail // 可用预算
            availableBudget.timeYear = '可用预算'
            this.costBudgetList.push(availableBudget)
            let applicationBudget = {} // 本次申请预算
            applicationBudget = res.projectTaskBudgetDto.applicationBudgetDetail // 可用预算
            applicationBudget.timeYear = '本次申请预算'
            this.costBudgetList.push(applicationBudget)
            this.oldCostBudgetList = JSON.parse(JSON.stringify(this.costBudgetList))
            // this.fileListItem = res.applicationFileList
            this.opinionList = res.approveRecord ? res.approveRecord.approvals : null
            this.projectApprove.historyFlag = res.historyFlag
            this.projectApprove.historyApproveFileId = res.historyApproveFileId
          } else {
            this.costBudgetList.forEach(item => {
              if (item.timeYear === '项目总预算') {
                item.budgetOutsourcing = res.projectTaskBudgetDto.totalBudgetDetail.budgetOutsourcing // 项目总预算
                item.budgetInsourcing = res.projectTaskBudgetDto.totalBudgetDetail.budgetInsourcing // 项目总预算
                item.staffTime = res.projectTaskBudgetDto.totalBudgetDetail.staffTime // 项目总预算
                item.laborCosts = res.projectTaskBudgetDto.totalBudgetDetail.laborCosts // 项目总预算
                item.travelExpenses = res.projectTaskBudgetDto.totalBudgetDetail.travelExpenses // 项目总预算
                item.conferenceExpenses = res.projectTaskBudgetDto.totalBudgetDetail.conferenceExpenses // 项目总预算
                item.assetDepreciation = res.projectTaskBudgetDto.totalBudgetDetail.assetDepreciation // 项目总预算
                item.otherCosts = res.projectTaskBudgetDto.totalBudgetDetail.otherCosts // 项目总预算
              } else if (item.timeYear === '已占用预算') {
                item.budgetOutsourcing = res.projectTaskBudgetDto.usedBudgetDetail.budgetOutsourcing // 已占用预算
                item.budgetInsourcing = res.projectTaskBudgetDto.usedBudgetDetail.budgetInsourcing // 已占用预算
                item.staffTime = res.projectTaskBudgetDto.usedBudgetDetail.staffTime // 已占用预算
                item.laborCosts = res.projectTaskBudgetDto.usedBudgetDetail.laborCosts // 已占用预算
                item.travelExpenses = res.projectTaskBudgetDto.usedBudgetDetail.travelExpenses // 已占用预算
                item.conferenceExpenses = res.projectTaskBudgetDto.usedBudgetDetail.conferenceExpenses // 已占用预算
                item.assetDepreciation = res.projectTaskBudgetDto.usedBudgetDetail.assetDepreciation // 已占用预算
                item.otherCosts = res.projectTaskBudgetDto.usedBudgetDetail.otherCosts // 已占用预算
              } else if (item.timeYear === '可用预算') {
                item.budgetOutsourcing = res.projectTaskBudgetDto.availableBudgetDetail.budgetOutsourcing // 可用预算
                item.budgetInsourcing = res.projectTaskBudgetDto.availableBudgetDetail.budgetInsourcing // 可用预算
                item.staffTime = res.projectTaskBudgetDto.availableBudgetDetail.staffTime // 可用预算
                item.laborCosts = res.projectTaskBudgetDto.availableBudgetDetail.laborCosts // 可用预算
                item.travelExpenses = res.projectTaskBudgetDto.availableBudgetDetail.travelExpenses // 可用预算
                item.conferenceExpenses = res.projectTaskBudgetDto.availableBudgetDetail.conferenceExpenses // 可用预算
                item.assetDepreciation = res.projectTaskBudgetDto.availableBudgetDetail.assetDepreciation // 可用预算
                item.otherCosts = res.projectTaskBudgetDto.availableBudgetDetail.otherCosts // 可用预算
              }
            })
            if (this.costBudgetList && this.costBudgetList.length > 0) {
              this.costBudgetList.forEach(item => {
                //定义存储不同字段的对象
                item.highlightProps = {}
                //右侧对应年份的对象，TODO：右侧为空
                let rightItem = this.oldCostBudgetList ? this.oldCostBudgetList.filter(right => right.timeYear === item.timeYear) : []
                //遍历需对比的字段
                this.budgetKeys.forEach(budgetKey => {
                  if (rightItem.length === 0 || this.numTransition(item[budgetKey]) !== this.numTransition(rightItem[0][budgetKey])) {
                    //字段值不一致则高亮
                    this.$set(item.highlightProps, budgetKey, true)
                  }
                })
              })
              this.ruleForm.versionNo = res.versionNo
              this.ruleForm.versionCreatedDate = res.versionCreatedDate
            }
          }
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
    // 保存流程立项编辑信息
    async saveTaskInfo (confirm = false) {
      let validType = this.judgeAttachType()
      let projectBudget = await this.$refs.projectBudget.validate()
      let urlString = 'approveNo=' + this.approveNo + '&projectCode=' + this.projectCode
      this.$refs.ruleForm.validate(valid => {
        if (valid && validType) {
          if (projectBudget) {
            let obj = {} // 预算信息
            let usedBudgetDetailObj = null // 已占用的预算金额
            let index = '' //本次申请预算信息的索引
            projectBudget.costBudgetList.forEach((item, i) => {
              if (item.timeYear === '本次申请预算') {
                index = i
              }
              if (item.timeYear === '已占用预算') {
                usedBudgetDetailObj = item
              }
            })
            this.ruleForm.approveNo = this.approveNo
            this.ruleForm.projectCode = this.projectCode // 项目编号
            this.ruleForm.businessFormUrl = '/task/taskEdit?operate=02&' + urlString
            obj.descriptionRequirement = projectBudget.taskDesAndRequire // 任务描述及要求
            obj.demandRiskTip = projectBudget.demandRisk // 需求风险提示
            obj.expectedEffect = projectBudget.resultInformation // 预期完成效果
            obj.remark = projectBudget.remark // 备注
            obj.budgetOutsourcing = projectBudget.costBudgetList[index].budgetOutsourcing // 委外
            obj.budgetInsourcing = projectBudget.costBudgetList[index].budgetInsourcing // 委内
            obj.staffTime = projectBudget.costBudgetList[index].staffTime // 自有人工
            obj.laborCosts = projectBudget.costBudgetList[index].laborCosts // 自有人工成本
            obj.travelExpenses = projectBudget.costBudgetList[index].travelExpenses // 差路费
            obj.conferenceExpenses = projectBudget.costBudgetList[index].conferenceExpenses // 会议费
            obj.assetDepreciation = projectBudget.costBudgetList[index].assetDepreciation // 资产折旧
            obj.otherCosts = projectBudget.costBudgetList[index].otherCosts // 其他成本
            this.ruleForm.usedBudgetDetail = usedBudgetDetailObj
            this.ruleForm.applicationBudget = obj
            this.ruleForm.planStartTime = this.formatDate(this.ruleForm.planStartTime)
            this.ruleForm.planFinishTime = this.formatDate(this.ruleForm.planFinishTime)
            this.ruleForm.applicationFileIdList = this.attachmentIds
            // this.ruleForm.completion = '完成信息'
            this.ruleForm.processInstId = this.processParams.processInstId
          }
          API.saveTask(this.ruleForm)
            .then(res => {
              this.processTemplateCode = res.processTemplateCode
              if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                this.nextHandleVis = true
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
                    this.saveTaskInfo(true)
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消提交申请'
                    })
                  })
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
              if (e.message === '当前项目预算信息发生变更，请重新确认填报！') {
                // 如果预算金额发生变更，则重新获取金额并局部刷新数据
                this.budgetIsChange = true
                this.getProjectTaskInfo()
              }
            })
        } else {
          return false
        }
      })
    },
    // 确认提交下一处理
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      let params = {
        approveNo: this.approveNo,
        resubmitType: '1',
        workItemId: parseInt(this.$route.query.workItemID),
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participants: this.submitNextHandleInfo.participants
      }
      API.resubmitTaskApprove(params)
        .then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '任务申请创建成功。'
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
    async submitNext () { //提交下一处理
      this.saveTaskInfo(true)
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
    async save () { //保存
      let projectBudget = await this.$refs.projectBudget.validate()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (projectBudget) {
          }
        }
      })
    },
    async submit () { //提交下一处理
      let projectBudget = await this.$refs.projectBudget.validate()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (projectBudget) {
          }
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
          singleAPI.deletePackageTask(this.approveNo)
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
