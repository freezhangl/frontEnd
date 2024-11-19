<template>
  <div class="launch-edit">
    <!-- 详情页面 -->
    <div class="top-head" id="top-head">
      <div class="head-con">
        <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
        <i class="approve-icon svgfont-btn-back"   @click="rollBackProcessInstance"><span class="global-family">撤回流程</span></i>
        <i class="approve-icon svgfont-btn-trace" v-if="taskState && taskState!== 1" @click="processTrace"><span class="global-family">流程跟踪</span></i>
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
              label-position='right'
              ref="ruleForm"
              label-width="180px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="项目名称:" prop="projectName" style="word-wrap:break-word">
                    {{ruleForm.projectName}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="任务名称:" prop="taskName" style="word-wrap:break-word">
                    {{ruleForm.taskName}}
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
                  <el-form-item label="计划开始时间:" prop="planStartTime" style="word-wrap:break-word">
                    {{ruleForm.planStartTime}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划完成时间:" prop="planFinishTime" style="word-wrap:break-word">
                    {{ruleForm.planFinishTime}}
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
                    {{ruleForm.undertakeUnit}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="承担单位联系人:" prop="undertakeUnitPerson" style="word-wrap:break-word">
                    {{ruleForm.undertakeUnitPerson}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="承担单位联系方式:" prop="undertakeUnitPhone" style="word-wrap:break-word">
                    {{ruleForm.undertakeUnitPhone}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="ruleForm.completion && approveState !== 3">
                <el-col :span="24">
                  <el-form-item label="完成情况:" prop="completion" style="word-wrap:break-word">
                    {{ruleForm.completion}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </project-panel>
          <div id="project-budget">
            <!-- <projectBudget :receive-data="costBudgetList"></projectBudget> -->
            <projectBudget :receive-data="costBudgetList" :info="ruleForm"></projectBudget>
          </div>
          <div id="approved-con" v-if="isShowApprove">
            <approval-opinion :business-opinions-array="opinionList"></approval-opinion>
          </div>
          <project-document-detail
            id="attach-doc"
            v-if="approveNo"
            :doc-params="docParams"></project-document-detail>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getStore } from '@/store'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import projectPanel from '@/controller/components/projectPanel'
import projectDocumentDetail from '../../../projectDocumentDetail'
import projectBudget from './budget/detail'
import { flowRollback } from '@/common/flowRollbackMixins'
export default {
  components: {
    projectPanel,
    projectDocumentDetail,
    projectBudget
  },
  data () {
    return {
      creatorName: '',
      tableHeadStyle: { // 项目文档表头样式
        background: '#F4F4F4',
        color: 'rgba(0,0,0,0.85)'
      },
      approvalOpinionList: [ //审批意见数据
        {
          attachmentTypeName: '会签',
          fileName: '文件名称 1',
          uploadBy: '处理人1',
          uploadDate: '2020-10-20'
        }
      ],
      docParams: {
        type: 'BT-PACKAGE-TASK',
        approveNo: null
      },
      approveNo: null,
      businessType: 'BT-PACKAGE-TASK',
      processInstId: this.$route.query.processInstID,
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      costBudgetList: [],
      taskFileList: [], //任务申请附件+任务完成附件
      ruleForm: {
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
      isEditable: true, //用户是否具有编辑权限
      showBackTop: false, //滚动图片是否显示
      backUrl: '',
      clearFlag: true, //true 触发滚动
      projectCode: this.$route.query.projectCode,
      isShowApprove: true,
      opinionList: [], // 审批意见
      taskState: null, // 当前任务的状态
      approveState: null,
      projectApprove: {} //表单信息
    }
  },
  mixins: [flowRollback],
  created () {
    this.projectCode = this.$route.query.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getPageUrl()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 判断入口参数
    getPageUrl () {
      if (this.$route.query.approveNo) {
        this.approveNo = this.$route.query.approveNo
        this.docParams.approveNo = this.$route.query.approveNo
        this.getTaskInfo()
        // this.getBusinessProcessInst()
        this.backUrl = '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode
      } else {
        this.getProcessInstDetailById()
        this.backUrl = '/projectInfo/projectInfo-detail/' + this.projectCode
      }
    },
    // 审批-获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(Number(this.$route.query.processInstID))
        .then(res => {
          this.approveNo = res.businessSerialNumber
          this.docParams.approveNo = res.businessSerialNumber
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
    // 根据业务流水号查询业务流程实例信息
    getBusinessProcessInst () {
      flowAPI.getBusinessProcessInst(this.$route.query.approveNo)
        .then(res => {
          this.processInstId = res.processInstId
          this.getTaskInfo()
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
    getTaskInfo () { //获取任务申请详情信息
      let param = {
        approveNo: this.approveNo
      }
      API.queryTaskDetail(param)
        .then(res => {
          // res.initiatedDate = res.initiatedDate === null ? null : this.formatDate(res.initiatedDate)
          // res.planStartTime = res.planStartTime === null ? null : this.formatDate(res.planStartTime)
          // res.planFinishTime = res.planFinishTime === null ? null : this.formatDate(res.planFinishTime)
          // this.ruleForm = res
          // this.costBudgetList = res.ProjectTaskBudget
          // this.taskFileList = res.applicationFileList.concat(res.finishFileList)
          if (res === null || res.approveRecord === null || res.approveRecord.total === 0) {
            this.isShowApprove = false
          }
          if (res) {
            this.taskState = Number(res.taskState)
            this.approveState = Number(res.approveState)
            this.creatorName = res.creatorName || ''
            this.projectCode = res.projectCode // 项目编码
            this.ruleForm.projectName = res.projectName // 项目名称
            this.ruleForm.applicationDate = this.formatDate(res.applicationDate) // 申请时间
            this.ruleForm.demandDepartment = res.demandDepartment // 需求部门
            this.ruleForm.demandPerson = res.demandPerson // 需求负责人
            this.ruleForm.demandPhone = res.demandPhone // 联系方式
            this.ruleForm.taskName = res.name // 任务名称
            this.ruleForm.completion = res.completion // 完成情况
            this.ruleForm.planStartTime = this.formatDate(res.planStartTime) // 计划开始时间
            this.ruleForm.planFinishTime = this.formatDate(res.planFinishTime) // 计划完成时间
            this.ruleForm.undertakeUnit = res.undertakeUnit // 承担单位
            this.ruleForm.undertakeUnitPerson = res.undertakeUnitPerson // 承担单位联系人
            this.ruleForm.undertakeUnitPhone = res.undertakeUnitPhone // 承担单位联系人
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
            this.opinionList = res.approveRecord ? res.approveRecord.approvals : null
            if (res.approveRecord) {
              this.isShowApprove = !(res.approveRecord.total === 0)
            }
            this.projectApprove.historyFlag = res.historyFlag
            this.projectApprove.historyApproveFileId = res.historyApproveFileId
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
    // 关闭流程信息页面
    closeProcessInfo () {
      // this.$router.push(this.backUrl)
      if (this.$route.query.approveNo) {
        this.$router.push({
          path: this.backUrl,
          query: {
            activeTab: 'projectProgress',
            flowPoint: '任务申请'
          }
        })
      } else {
        window.close()
      }
    },
    // 流程跟踪
    processTrace () {
      if (this.projectApprove.historyFlag === '0' && this.$route.query.approveNo) {
        flowAPI.getBusinessProcessInst(this.approveNo)
          .then(res => {
            this.processInstId = res.processInstId
            this.$router.push({
              path: '/processTrace',
              query: {
                businessSerialNumber: this.approveNo,
                processInstId: res.processInstId,
                userId: this.userId,
                fileCode: this.projectApprove.historyApproveFileId,
                historyFlag: this.projectApprove.historyFlag
              }
            })
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
      } else {
        this.$router.push({
          path: '/processTrace',
          query: {
            businessSerialNumber: this.approveNo,
            processInstId: this.processInstId,
            userId: this.userId,
            fileCode: this.projectApprove.historyApproveFileId,
            historyFlag: this.projectApprove.historyFlag
          }
        })
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
