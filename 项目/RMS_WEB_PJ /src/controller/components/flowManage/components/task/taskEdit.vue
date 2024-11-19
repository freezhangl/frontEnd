<template>
  <div class="launch-edit">
    <!-- 编辑页面 -->
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveTaskInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" @click="submitNext"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="this.$route.query.operate==='02'" @click="cancellation"><span class="global-family">作废</span></i>
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
                      v-model.trim="ruleForm.taskName">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务申请日期:" prop="applicationDate" style="word-wrap:break-word">
                    {{ruleForm.applicationDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划开始时间:" prop="planStartTime">
                    <el-date-picker
                      v-model="ruleForm.planStartTime"
                      :picker-options="startTimeOptions"
                      type="date"
                      placeholder="选择日期"
                    >
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
                      v-model.trim="ruleForm.undertakeUnit">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="承担单位联系人:" prop="undertakeUnitPerson" style="word-wrap:break-word">
                    <el-input
                      style="width: 100%"
                      placeholder="请输入"
                      v-model.trim="ruleForm.undertakeUnitPerson">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="承担单位联系方式:" prop="undertakeUnitPhone" style="word-wrap:break-word">
                    <el-input
                      style="width: 100%;"
                      placeholder="请输入"
                      @mousewheel.native.prevent
                      @input="allowNum"
                      v-model.trim="ruleForm.undertakeUnitPhone">
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
              v-if="costBudgetList && costBudgetList.length > 0"
              :year-range-prop="planYearRange"
              :project-code="projectCode"
              :info='budgetInfo'
              :receive-data="costBudgetList"
              @IsBeyond="judeIsBeyond"
              @budgetInfo="getBudgetInfo"></project-budget>
          </div>
          <project-document-upload
            v-if="docVisible"
            id="project-doc"
            :doc-params="docParams"
            :file-list="fileListItem"
            @existAttachmentIds="getDelIds"></project-document-upload>
          <!-- <project-document-upload
            id="project-doc"
            v-if="fileListItem"
            :file-list="fileListItem"
            @existAttachmentIds="getDelIds"></project-document-upload> -->
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
  </div>
</template>
<script>
import merge from 'webpack-merge'
// import API from './API_milestoneManagement'
import singleAPI from '@/serve/API_single'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import projectPanel from '@/controller/components/projectPanel'
import projectDocumentUpload from '../../../projectDocumentUpload'
import projectBudget from './budget/index'
export default {
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

      if (this.ruleForm.planStartTime && value < this.ruleForm.planStartTime) {
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
            if (this.planApprovalTime) {
              return (
                time.getTime() >
                new Date(this.ruleForm.planFinishTime)
                  .getTime() || time.getTime() <
                new Date(this.planApprovalTime)
                  .getTime()
              )
            }
          } else {
            if (this.planApprovalTime && this.planFinishTime) {
              return (
                time.getTime() >
                new Date(this.planFinishTime)
                  .getTime() || time.getTime() <
                new Date(this.planApprovalTime)
                  .getTime()
              )
            }
          }
        }
      },
      endTimeOptions: {
        disabledDate: time => {
          if (this.ruleForm.planStartTime) {
            if (this.planFinishTime) {
              return (
                time.getTime() <
                new Date(this.ruleForm.planStartTime)
                  .getTime() || time.getTime() >
                new Date(this.planFinishTime)
                  .getTime()
              )
            }
          } else {
            if (this.planApprovalTime && this.planFinishTime) {
              return (
                time.getTime() >
                new Date(this.planFinishTime)
                  .getTime() || time.getTime() <
                new Date(this.planApprovalTime)
                  .getTime()
              )
            }
          }
        }
      },
      planApprovalTime: '', //计划立项时间
      planFinishTime: '', //计划结项时间
      planYearRange: ['项目总预算', '已占用预算', '可用预算', '本次申请预算'],
      tableHeadStyle: { // 项目文档表头样式
        background: '#F4F4F4',
        color: 'rgba(0,0,0,0.85)'
      },
      docParams: { //项目文档相关参数
        type: 'BT-PACKAGE-TASK',
        approveNo: this.$route.query.approveNo || ''
      },
      docVisible: false, //附件组件是否显示，等待数据获取到再渲染
      fileListItem: [], // 文件上传数组
      attachmentIds: [], // 附件id
      attachments: [], // 附件列表
      //项目预算数据
      costBudgetList: [],
      ruleForm: {
        projectName: '', //项目名称
        projectCode: this.$route.query.projectCode, //项目编码
        applicationDate: '', //任务申请日期
        demandDepartment: '', // 需求部门
        demandPerson: '', // 需求负责人
        demandPhone: '', // 联系方式
        taskName: '', //任务名称
        planStartTime: '', //计划开始时间
        planFinishTime: '', //计划完成时间
        undertakeUnit: '', //承担单位
        undertakeUnitPerson: '', //承担单位联系人
        undertakeUnitPhone: '' //承担单位联系方式
      },
      budgetInfo: {},
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
      clearFlag: true, //true 触发滚动
      projectCode: '',
      approveNo: this.$route.query.approveNo,
      processTemplateCode: null, //流程模板编码
      nextHandleVis: false, //提交下一处理人组件默认不展示
      isBeyond: false, // 是否超出总金额
      budgetIsChange: false, // 预算金额是否发生变更
      oldCostBudgetList: [], // 当项目预算的数据发生变更后用来对比数据
      budgetKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts', 'totalAmount']
    }
  },
  created () {
    this.projectCode = this.$route.query.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getProjectInfo()
    if (this.$route.query.operate === '01') {
      this.getProjectTaskInfo()
    } else {
      this.getTaskInfo()
    }
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 输入框只允许输入数字
    allowNum () {
      this.ruleForm.undertakeUnitPhone = this.ruleForm.undertakeUnitPhone.replace(/[^\d]/g, '')
    },
    changeTime (type) {
      if (
        this.ruleForm.planStartTime &&
        this.ruleForm.planFinishTime
      ) {
        let startYear = new Date(this.ruleForm.planStartTime)
        let endYear = new Date(this.ruleForm.planFinishTime)
        this.$emit('changeTime', [startYear, endYear], type)
      }
    },
    getBudgetInfo (val) {
      this.budgetInfo.taskDesAndRequire = val.descriptionRequirement // 任务描述projectTaskBudgetDto.
      this.budgetInfo.demandRisk = val.demandRiskTip // 风险提示
      this.budgetInfo.resultInformation = val.expectedEffect // 预期完成效果
      this.budgetInfo.remark = val.remark // 备注
    },
    // 流程跟踪
    processTrace () {
      this.$router.push({
        path: '/processTrace',
        query: {
          businessSerialNumber: this.processParams.businessSerialNumber,
          processInstId: this.processParams.processInstId,
          userId: this.processParams.userId
        }
      })
    },
    // 获取任务申请详情信息-编辑调用
    getTaskInfo () {
      let param = {
        approveNo: this.$route.query.approveNo //'1278508437747011587'
      }
      API.queryTaskDetail(param)
        .then(res => {
          this.ruleForm.versionNo = res.versionNo
          this.ruleForm.versionCreatedDate = res.versionCreatedDate
          this.ruleForm.projectName = res.projectName // 项目名称
          this.ruleForm.applicationDate = this.formatDate(res.applicationDate) // 申请时间
          this.ruleForm.demandDepartment = res.demandDepartment // 需求部门
          this.ruleForm.demandPerson = res.demandPerson // 需求负责人
          this.ruleForm.demandPhone = res.demandPhone // 联系方式
          this.ruleForm.taskName = res.name // 任务名称
          this.ruleForm.planStartTime = new Date(res.planStartTime) // 计划开始时间
          this.ruleForm.planFinishTime = new Date(res.planFinishTime) // 计划完成时间
          this.ruleForm.undertakeUnit = res.undertakeUnit // 承担单位
          this.ruleForm.undertakeUnitPerson = res.undertakeUnitPerson // 承担单位联系人
          this.ruleForm.undertakeUnitPhone = res.undertakeUnitPhone // 承担单位联系人
          this.budgetInfo.taskDesAndRequire = res.projectTaskBudgetDto.descriptionRequirement // 任务描述projectTaskBudgetDto.
          this.budgetInfo.demandRisk = res.projectTaskBudgetDto.demandRiskTip // 风险提示
          this.budgetInfo.resultInformation = res.projectTaskBudgetDto.expectedEffect // 预期完成效果
          this.budgetInfo.remark = res.projectTaskBudgetDto.remark // 备注
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
          this.fileListItem = res.applicationFileList
          this.docVisible = true
          // .concat(res.finishFileList)
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
    // 获取详情信息(全部)
    getProjectInfo () {
      API.queryEffectiveProjectInfo(this.projectCode)
        .then(res => {
          this.planApprovalTime = res.projectBaseInfo.planApprovalTime
          this.planFinishTime = res.projectBaseInfo.planFinishTime
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
    // 获取预算信息的信息-新增调用
    getProjectTaskInfo () {
      let param = {
        projectCode: this.$route.query.projectCode
      }
      if (this.budgetIsChange) {
        param.approveNo = this.approveNo
      }
      API.queryProjectInfoPre(param)
        .then(res => {
          if (!this.budgetIsChange) {
            this.approveNo = res.approveNo
            this.ruleForm.versionNo = res.versionNo //关联版本
            this.ruleForm.versionCreatedDate = res.versionCreatedDate //版本创建时间
            this.ruleForm.approveNo = res.approveNo
            this.docParams.approveNo = res.approveNo
            this.ruleForm.projectName = res.projectName
            this.ruleForm.applicationDate = this.formatDate(res.applicationDate)
            this.ruleForm.demandDepartment = res.demandDepartment
            this.ruleForm.demandPerson = res.demandPerson
            this.ruleForm.demandPhone = res.demandPhone
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
            let applicationBudget = {
              budgetOutsourcing: '',
              budgetInsourcing: '',
              staffTime: '',
              laborCosts: '',
              travelExpenses: '',
              conferenceExpenses: '',
              assetDepreciation: '',
              otherCosts: '',
              totalAmount: '',
              timeYear: '本次申请预算'
            } // 本次申请预算
            this.costBudgetList.push(applicationBudget)
            this.oldCostBudgetList = JSON.parse(JSON.stringify(this.costBudgetList))
            this.fileListItem = res.applicationFileList
            this.docVisible = true
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
            // console.log(this.oldCostBudgetList, 'old预算数据')
            // console.log(this.costBudgetList, '替换后的预算金额')
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
                    // item.budgetDiff[budgetKey] = true
                  }
                })
              })
              // console.log(this.costBudgetList, '对比后的预算数据')
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
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs, approveId) {
      this.attachmentIds = ids
      this.attachments = attachs
      // this.approveId = approveId
    },
    // 获取流程模板编码
    getTemplateCode () {
      // 根据业务流水号查询业务流程实例信息
      flowAPI.getBusinessProcessInst(this.approveNo)
        .then(res => {
          this.processTemplateCode = res.processTemplateCode
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
    },
    //校验必传附件类型
    judgeAttachType () {
      let needUplodTypes = []
      let haveFileTypes = [] // 保存必填项中有文件的类型
      let attachments = this.fileListItem.filter(item => {
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
    // 接受子组件的传参
    judeIsBeyond (val) {
      this.isBeyond = val
    },
    // 保存流程编辑信息
    async saveTaskInfo (confirm = false) {
      let validType = this.judgeAttachType()
      let projectBudget = await this.$refs.projectBudget.validate()
      let urlString = 'approveNo=' + this.approveNo + '&projectCode=' + this.$route.query.projectCode
      this.$refs.ruleForm.validate(valid => {
        if (valid && validType && projectBudget) {
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
            if (this.$route.query.operate === '02') {
              this.ruleForm.approveNo = this.$route.query.approveNo
            } else {
              this.ruleForm.approveNo = this.approveNo
            }
            this.ruleForm.projectCode = this.projectCode // 项目编号
            this.ruleForm.businessFormUrl = '/task/taskEdit?operate=02&' + urlString
            obj.descriptionRequirement = projectBudget.taskDesAndRequire // 任务描述及要求
            obj.demandRiskTip = projectBudget.demandRisk // 需求风险提示
            obj.expectedEffect = projectBudget.resultInformation // 预期完成效果
            obj.remark = projectBudget.remark // 备注
            obj.budgetOutsourcing = projectBudget.costBudgetList[index].budgetOutsourcing || 0 // 委外
            obj.budgetInsourcing = projectBudget.costBudgetList[index].budgetInsourcing || 0 // 委内
            obj.staffTime = projectBudget.costBudgetList[index].staffTime || 0 // 自有人工
            obj.laborCosts = projectBudget.costBudgetList[index].laborCosts || 0 // 自有人工成本
            obj.travelExpenses = projectBudget.costBudgetList[index].travelExpenses || 0 // 差路费
            obj.conferenceExpenses = projectBudget.costBudgetList[index].conferenceExpenses || 0 // 会议费
            obj.assetDepreciation = projectBudget.costBudgetList[index].assetDepreciation || 0 // 资产折旧
            obj.otherCosts = projectBudget.costBudgetList[index].otherCosts || 0 // 其他成本
            this.ruleForm.usedBudgetDetail = usedBudgetDetailObj
            this.ruleForm.applicationBudget = obj
            this.ruleForm.planStartTime = this.formatDate(this.ruleForm.planStartTime)
            this.ruleForm.planFinishTime = this.formatDate(this.ruleForm.planFinishTime)
            if (this.attachmentIds.length === 0 && this.attachments.length > 0) {
              this.attachments.forEach(item => {
                if (item.id) this.attachmentIds.push(item.id)
              })
            }
            this.ruleForm.applicationFileIdList = this.attachmentIds
          }
          if (this.isBeyond) {
            this.$message({
              type: 'error',
              message: '请重新修改申请预算金额！'
            })
            return
          }
          API.saveTask(this.ruleForm)
            .then(res => {
              // console.log(res, '研发包响应成功返回的参数')
              this.processTemplateCode = res.processTemplateCode
              this.getTemplateCode()
              if (this.$route.query.operate === '01') {
                this.$router.push({
                  query: merge(this.$route.query, { 'operate': '02', 'approveNo': this.approveNo, 'projectCode': this.$route.query.projectCode })
                })
              }
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
                this.costBudgetList = []
                this.getTaskInfo()
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
          this.$message({
            type: 'error',
            message: '请填写完整信息'
          })
          return false
        }
      })
    },
    // 确认提交下一处理
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      let params = {
        approveNo: this.approveNo,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participants: this.submitNextHandleInfo.participants
      }
      API.submitTaskApply(params)
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
    // 关闭流程信息页面
    closeProcessInfo () {
      // this.$router.push(this.backUrl)
      this.$router.push({
        path: this.backUrl,
        query: {
          activeTab: 'projectProgress',
          flowPoint: '任务申请'
        }
      })
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

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  /deep/ .el-form-item .el-input__inner {
    -moz-appearance: textfield !important;
  }

</style>
