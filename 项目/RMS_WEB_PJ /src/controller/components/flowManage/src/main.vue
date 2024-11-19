<template>
  <div class="flow-container">
    <div class="head-content">
      <el-radio-group v-model="flowPoint" @change="changeRadio" class="group-btn">
        <el-radio-button label="预立项流程" v-if="isShowBoforeLaunchTab"></el-radio-button>
        <el-radio-button label="立项流程"></el-radio-button>
        <el-radio-button v-if="hasTaskApply" label="任务申请"></el-radio-button>
        <el-radio-button label="变更流程"></el-radio-button>
        <el-radio-button label="里程碑流程" v-if="showMilestone"></el-radio-button>
        <el-radio-button label="终止流程"></el-radio-button>
        <el-radio-button label="结项流程"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="flow-content">
      <!-- 卡片展示区域：包括立项流程、变更流程、里程碑流程、终止流程、结项流程等多卡片信息展示 -->
      <div class="flow-point-info" v-if="flowPoint==='预立项流程'">
        <div class="main-content">
          <div class="head-btn" v-if="isShowBoforeLaunch">
            <span style="float: right;">
              <el-button class="normal-btn"  @click="addBeforeLaunchFlow">发起预立项流程</el-button>
            </span>
          </div>
          <div style="margin-top:30px;">
            <beforeLaunchFlow :project-info="projectInfo"></beforeLaunchFlow>
          </div>
        </div>
      </div>
      <!-- 卡片展示区域：包括立项流程、变更流程、里程碑流程、终止流程、结项流程等多卡片信息展示 -->
      <div class="flow-point-info" v-if="flowPoint==='立项流程'">
        <div class="main-content">
          <div class="head-btn" v-if="showLaunchBtn">
            <span style="float: right;">
              <el-button class="normal-btn" @click="addLaunchFlow">发起立项流程</el-button>
            </span>
          </div>
          <div style="margin-top:30px;">
            <launch-flow :project-info="projectInfo" @showFlag="showLaunchFlag"></launch-flow>
          </div>
        </div>
      </div>
      <!-- TODO 迭代已只设计立项流程发起、其余迭代二实现 -->
      <!-- 任务申请是研发包项目的特有流程 -->
      <div class="flow-point-info" v-if="flowPoint==='任务申请'">
        <div style="margin-top:30px;">
          <taskList></taskList>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='变更流程'">
        <div class="main-content">
          <div class="head-btn" v-if="showChangeBtn">
            <span style="float: right;">
              <el-button class="normal-btn" @click="addChangeFlow">发起变更流程</el-button>
            </span>
          </div>
          <change-flow style="margin-top:30px;" :project-info="projectInfo" @showChange="showChangeFlag"></change-flow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='里程碑流程'">
        <!-- <div class="main-content"> -->
        <!-- <div class="head-btn">
            <span style="float: right;">
              <el-button class="normal-btn">发起里程碑流程</el-button>
            </span>
          </div> -->
        <div style="margin-top:30px;">
          <milestoneProcessList></milestoneProcessList>
        </div>
        <!-- </div> -->
      </div>
      <div class="flow-point-info" v-if="flowPoint==='终止流程'">
        <div class="main-content">
          <div class="head-btn" v-if="showTerminateBtn">
            <span style="float: right;">
              <el-button class="normal-btn" @click="addTerminateFlow">发起终止流程</el-button>
            </span>
          </div>
          <div style="margin-top:30px;">
            <terminate-flow @showFlag="showTerminateFlag"></terminate-flow>
          </div>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='结项流程'">
        <div class="main-content">
          <!-- v-if="showFinalBtn" -->
          <div class="head-btn" v-if="showFinalBtn">
            <span style="float: right;">
              <el-button class="normal-btn" @click="addFinalFlow">发起结项流程</el-button>
            </span>
          </div>
          <div style="margin-top:30px;">
            <finalFlow :project-info="projectInfo" @showFinal="showFinalFlag"></finalFlow>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import merge from 'webpack-merge'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import termAPI from '../components/terminateFlow/API_terminate'
import milesAPI from '../components/milestone/API_milestoneManagement'
import beforeLaunchFlow from '../components/beforeLaunchFlow/beforeLaunchList'
import launchFlow from '../components/launchFlow'
import changeFlow from '../components/changeFlow'
import milestoneProcessList from '../components/milestone/milestoneProcessList'
import taskList from '../components/task/taskList'
import terminateFlow from '../components/terminateFlow/terminateFlow'
import finalFlow from '../components/finalFlow'
import { getStore } from '@/store'

export default {
  name: 'flowManage',
  components: {
    beforeLaunchFlow,
    launchFlow,
    taskList,
    changeFlow,
    milestoneProcessList,
    terminateFlow,
    finalFlow
  },
  props: {
    projectCodeVersion: { type: Object, default: () => [] }
  },
  data () {
    return {
      hasTaskApply: true, //任务申请是研发包项目的特有流程，判断是为研发包项目
      showLaunchBtn: false, //立项流程发起按钮是否展示
      showTerminateBtn: false, //终止流程发起按钮是否展示
      showFinalBtn: false, //结项流程发起按钮是否展示
      showChangeBtn: false, //是否显示发起变更流程---有权限且项目明细状态为已立项
      flowPoint: this.$route.query.flowPoint || '预立项流程',
      projectInfo: { // 需要使用launchFlow组件时传的参数
        projectCode: this.projectCodeVersion.projectCode, // 项目编号
        documentType: 'BT-APPROVE', // 单据类型,BT-APPROVE-项目立项，BT-CHANGE-项目变更，BT-STOP-项目终止， BT-FINISH-项目结项，BT-MILESTONE-FINISH-里程碑，BT-PACKAGE-TASK-研发包任务申请
        permissionCode: '04', //权限编码
        projectType: '03'
      },
      showMilestone: true, //是否展示里程碑
      currentUserName: getStore().getters['USERENTITY/userInfo'].userAuth.chineseName, // 当前登录用户姓名
      versionNo: null,
      isShowBoforeLaunch: true,
      isShowBoforeLaunchTab: true
    }
  },
  watch: {
  },
  mounted () {
    this.isShowMilestone()
    // console.log(this.projectCodeVersion, 'projectCodeVersion')
  },
  methods: {
    // 判断里程碑tab是否展示：根据当前里程碑是否返回或返回列表长度为0
    isShowMilestone () {
      let searchParams = { projectCode: this.projectCodeVersion.projectCode }
      milesAPI.getMilestoneList(searchParams)
        .then(res => {
          // let showMilestoneFlag = res !== null || res.length === 0
          if (res === null) {
            this.showMilestone = false
          } else if (res.length === 0) {
            this.showMilestone = false
          } else {
            this.showMilestone = true
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '里程碑完成流程列表获取失败',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    selectFlow (value) {
      if (value === '终止流程') {
        this.projectInfo.documentType = 'BT-STOP'
      } else if (value === '立项流程') {
        this.projectInfo.documentType = 'BT-APPROVE'
      }
    },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    showLaunchFlag (flag) {
      this.showLaunchBtn = flag
    },
    showFinalFlag (flag) {
      this.showFinalBtn = flag
    },
    showTerminateFlag (flag) {
      this.showTerminateBtn = flag
    },
    showChangeFlag (flag) {
      this.showChangeBtn = flag
    },
    // 新增预立项流程
    async addBeforeLaunchFlow () {
      let isBeforeLaunch = await this.judgeIsBeforeLaunch()
      if (!isBeforeLaunch) {
        return
      }
      let isCarry = await this.judgeIsCarryAttachment('BT-PRE-APPROVE')
      if (isCarry) {
        this.$confirm('是否自动带入之前上传的附件?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            this.$router.push({
              path: '/beforeLaunchFlow/beforeLaunchFlowEdit',
              query: {
                addBeforeLaunch: 'true',
                type: 'BT-PRE-APPROVE',
                projectCode: this.projectCodeVersion.projectCode,
                isCarry: '1'
              }
            })
          })
          .catch((action) => {
            if (action === 'cancel') {
              this.$router.push({
                path: '/beforeLaunchFlow/beforeLaunchFlowEdit',
                query: {
                  addBeforeLaunch: 'true',
                  type: 'BT-PRE-APPROVE',
                  projectCode: this.projectCodeVersion.projectCode
                }
              })
            }
          })
      } else {
        this.$router.push({
          path: '/beforeLaunchFlow/beforeLaunchFlowEdit',
          query: {
            addBeforeLaunch: 'true',
            type: 'BT-PRE-APPROVE',
            projectCode: this.projectCodeVersion.projectCode
          }
        })
      }
    },
    // 判断是否可以发起预立项-如果可以跳转到流程页面
    judgeIsBeforeLaunch () {
      let param = {
        projectCode: this.projectCodeVersion.projectCode
      }
      return API.judgeBeforeLaunchApproval(param)
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '请求失败，请稍后再试！',
              type: 'error',
              showClose: true
            })
            if (e.code === '120044' || e.code === '120106') {
              setTimeout(() => {
                this.guideProject()
              }, 600)
            }
          }
        })
    },
    // 新增立项流程
    async addLaunchFlow () {
      let isLaunch = await this.judgeIsLaunch()
      if (!isLaunch) {
        return
      }
      let isCarry = await this.judgeIsCarryAttachment('BT-APPROVE')
      if (isCarry) {
        this.$confirm('是否自动带入之前上传的附件?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            this.$router.push({
              path: '/launchFlow/launchFlowEdit',
              query: {
                addLaunch: 'true',
                type: 'BT-APPROVE', //类型(项目立项、项目变更)
                projectCode: this.projectCodeVersion.projectCode,
                isCarry: '1'
              }
            })
          })
          .catch((action) => {
            if (action === 'cancel') {
              this.$router.push({
                path: '/launchFlow/launchFlowEdit',
                query: {
                  addLaunch: 'true',
                  type: 'BT-APPROVE', //类型(项目立项、项目变更)
                  projectCode: this.projectCodeVersion.projectCode
                }
              })
            }
          })
      } else {
        this.$router.push({
          path: '/launchFlow/launchFlowEdit',
          query: {
            addLaunch: 'true',
            type: 'BT-APPROVE', //类型(项目立项、项目变更)
            projectCode: this.projectCodeVersion.projectCode
          }
        })
      }
    },
    // 判断是否可以发起流程-如果可以跳转到流程页面
    judgeIsLaunch () {
      let param = {
        projectCode: this.projectCodeVersion.projectCode
      }
      return API.judgeLaunchApproval(param)
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '请求失败，请稍后再试！',
              type: 'error',
              showClose: true
            })
            if (e.code === '120044' || e.code === '120106') {
              setTimeout(() => {
                this.guideProject()
              }, 600)
            }
          }
        })
    },
    // 跳转项目编辑页面的弹框引导
    async guideProject () {
      await this.getProjectInfo()
      this.$confirm(' ', '是否跳转至项目编辑页面?', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          // 选择是不做任何操作继续执行下面的逻辑
          let params = {
            projectCode: this.projectCodeVersion.projectCode,
            userAccount: getStore().getters['USERENTITY/userInfo'].userAuth.uid
          }
          API.getProjectVersion(params)
            .then(res => {
              if (res) {
                this.$router.push({
                  path: '/projectInfo/projectInfo-edit/' + this.projectCodeVersion.projectCode,
                  query: {
                    versionNo: res[0].versionNo //获取版本列表中最新的版本
                  }
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
            })
        })
        .catch(() => {
          // 选择否打断发起结项流程的操作
          return false
        })
    },
    // 获取详情信息(全部)
    async getProjectInfo () {
      return API.getRightVersionByProCode({ projectCode: this.projectCodeVersion.projectCode })
        .then(res => {
          if (res) {
            this.versionNo = res.versionNo
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
    },
    // 判断是否可以携带附件
    judgeIsCarryAttachment (type) {
      let param = {
        projectCode: this.projectCodeVersion.projectCode,
        businessType: type
      }
      return API.carryHistoryFile(param)
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '请求失败，请稍后再试！',
              type: 'error',
              showClose: true
            })
            if (e.message === '当前项目信息未填写完整，请检查！') {
              setTimeout(() => {
                this.guideProject()
              }, 600)
            }
          }
        })
    },
    // 新增变更流程
    addChangeFlow () {
      API.isCanChange({ projectCode: this.projectInfo.projectCode })
        .then(res => {
          if (res) {
            this.$router.push({
              name: 'changeFlowEdit',
              path: '/changeFlow/changeFlowEdit',
              query: {
                addLaunch: 'true', //新增变更流程
                type: 'BT-CHANGE', //类型(项目变更)
                projectCode: this.projectCodeVersion.projectCode
              }
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
          if (e.code === '120055' || e.code === '120056') {
            setTimeout(() => {
              this.guideProject()
            }, 600)
          }
        })
    },
    // 新增结项流程
    async addFinalFlow () {
      let isFinalFlow = await this.judgeIsFinalFlow()
      if (!isFinalFlow) {
        return
      }
      let isResult = await this.judeIsResult()
      if (!isResult) {
        this.$confirm(' ', '存在成果未上传附件，请确认是否要发起结项?', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            // 选择是不做任何操作继续执行下面的逻辑
            this.lanchFlow()
          })
          .catch(() => {
            // 选择否打断发起结项流程的操作
            return false
          })
      } else {
        this.lanchFlow()
      }
    },
    async lanchFlow () {
      let isCarry = await this.judgeIsCarryAttachment('BT-FINISH')
      if (isCarry) {
        this.$confirm('是否自动带入之前上传的附件?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            this.$router.push({
              path: '/finalFlow/FinalFlowEdit',
              query: {
                addFinal: 'true',
                type: 'BT-FINISH', //类型(结项流程)
                projectCode: this.projectInfo.projectCode,
                isCarry: '1'
              }
            })
          })
          .catch((action) => {
            if (action === 'cancel') {
              this.$router.push({
                path: '/finalFlow/FinalFlowEdit',
                query: {
                  addFinal: 'true',
                  type: 'BT-FINISH', //类型(结项流程)
                  projectCode: this.projectInfo.projectCode
                }
              })
            }
          })
      } else {
        this.$router.push({
          path: '/finalFlow/FinalFlowEdit',
          query: {
            addFinal: 'true',
            type: 'BT-FINISH', //类型(结项流程)
            projectCode: this.projectInfo.projectCode
          }
        })
      }
    },
    // 判断是否存在成果未上传附件
    judeIsResult () {
      return API.queryIsResultInfo({ projectCode: this.projectInfo.projectCode })
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起结项流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    judgeIsFinalFlow () {
      return API.whetherStartFin({ projectCode: this.projectInfo.projectCode })
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起结项流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 发起终止流程
    async addTerminateFlow () {
      let isFinalFlow = await this.judgeIsTerminateFlow()
      if (!isFinalFlow) {
        return
      }
      let isCarry = await this.judgeIsCarryAttachment('BT-STOP')
      if (isCarry) {
        this.$confirm('是否自动带入之前上传的附件?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            this.$router.push({
              path: '/terminateFlow/terminateFlowEdit',
              query: {
                addTerminate: 'true',
                type: 'BT-STOP',
                projectCode: this.projectCodeVersion.projectCode,
                isCarry: '1'
              }
            })
          })
          .catch((action) => {
            if (action === 'cancel') {
              this.$router.push({
                path: '/terminateFlow/terminateFlowEdit',
                query: {
                  addTerminate: 'true',
                  type: 'BT-STOP',
                  projectCode: this.projectCodeVersion.projectCode
                }
              })
            }
          })
      } else {
        this.$router.push({
          path: '/terminateFlow/terminateFlowEdit',
          query: {
            addTerminate: 'true',
            type: 'BT-STOP',
            projectCode: this.projectCodeVersion.projectCode
          }
        })
      }
    },
    judgeIsTerminateFlow () {
      return termAPI.whetherStartable({ projectCode: this.projectInfo.projectCode })
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起终止流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 切换按钮组是url变化
    changeRadio (label) {
      this.$router.push({
        query: merge(this.$route.query, { 'flowPoint': label })
      })
    },
    // 检查是否支持预立项
    getCheckEstablish () {
      let param = {
        projectCode: this.projectCodeVersion.projectCode
      }
      API.checkEstablish(param)
        .then(res => {
          this.isShowBoforeLaunch = res
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 检查时候存在预立项的项目
    getLaunchInfo () {
      let params = {
        projectCode: this.projectCodeVersion.projectCode,
        businessType: 'BT-PRE-APPROVE' //预立项类型:枚举值
      }
      return API.queryProjectApprove(params)
        .then(res => {
          this.loading = false
          if (res && res.approveNo) {
            return true
          } else {
            return false
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取预立项流程信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 检查是否支持预立项
    checkEstablishShow () {
      let param = {
        projectCode: this.projectCodeVersion.projectCode
      }
      API.checkEstablishShow(param)
        .then(res => {
          this.isShowBoforeLaunchTab = res
          if (res) {
            this.flowPoint = this.$route.query.flowPoint || '预立项流程'
          } else {
            this.flowPoint = this.$route.query.flowPoint || '立项流程'
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    async judeIsShow () {
      let res = await this.getLaunchInfo()
      if (res) {
        this.isShowBoforeLaunchTab = res
        return false
      } else {
        this.checkEstablishShow()
      }
    }
  },
  created () {
    this.judeIsShow()
    this.getCheckEstablish()
    if (this.projectCodeVersion.projectCode) {
      API.isProjectDevelopPackage({ projectCode: this.projectCodeVersion.projectCode })
        .then(data => {
          this.hasTaskApply = data === 1
        })
        .catch(err => {
          this.$message.error(err.message || '获取研发包详情失败，请稍后再试！')
        })
    } else {
      this.hasTaskApply = false
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-content{
    width: 1000px !important;
  }
  /deep/ .flow-content{
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px){
  /deep/ .head-content{
    width: 960px !important;
  }
  /deep/ .flow-content{
    width: 960px !important;
  }
}

.flow-container{
  background: #f6f6f6;
  .head-content{
    margin:auto;
    width: 1180px;
    .group-btn{
      margin-top: 15px;
    }
  }
  .flow-content{
    margin:auto;
    width: 1180px;
    .main-content{
      margin-top: 15px;
      background-color: #fff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 2px;
      padding: 10px 25px 20px;
      z-index: -100;
      button{
        font-size: 14px;
        border-radius: 2px;
        height: 30px;
      }
      .head-btn {
        padding: 15px 0px;
        line-height: 40px;
        margin-bottom: 30px;
        .el-button {
          height: 30px;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
