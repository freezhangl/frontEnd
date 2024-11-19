<template>
  <div class="launch-info" v-if="showLaunchFlag">
    <project-panel title="预立项流程">
      <template v-slot:header>
        <el-button class="normal-btn" @click="openDetailPage">查看流程</el-button>
        <el-button v-if="isEditable&&launchInfoForm.approveState==='草稿'" class="normal-btn" @click="openEditPage">编辑</el-button>
      </template>
      <div class="launch-body">
        <el-form
          :model="launchInfoForm"
          ref="launchInfoForm"
          label-width="130px" >
          <el-row>
            <el-col :span="8">
              <el-form-item label="流程名称:" prop="flowName">
                <span>{{ launchInfoForm.flowName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程发起时间:" prop="initiatedDate">
                <span>{{ launchInfoForm.initiatedDate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态:" prop="approveState">
                <span>{{ launchInfoForm.approveState }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="发起人:" prop="creatorName">
                <span>{{ launchInfoForm.creatorName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程结束时间:" prop="endTime">
                <span>{{ launchInfoForm.endTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </project-panel>
  </div>
  <div v-else style="text-align:center;color:#333333;">暂无预立项流程信息</div>
</template>
<script>
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
export default {
  name: 'launch-info',
  components: {
  },
  props: {
    projectInfo: {
    }
  },
  data () {
    return {
      processInstName: '',
      versionCode: '',
      approveNo: '',
      showLaunchFlag: false, // 无预立项流程时不展示改组件
      isEditable: false, // 用户权限校验--是否具有编辑权限
      temVersionAuth: false, // 项目当前版本是否可以发起预立项流程
      launchInfoForm: {
        flowName: null,
        initiatedDate: null,
        approveState: null,
        creatorName: null,
        endTime: null
      }
    }
  },
  computed: {},
  mounted () {
    this.isLaunchAvailable()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 判断发起预立项流程按钮是否展示--项目经理且项目明细为草稿
    isLaunchAvailable () {
      const param = {
        projectCode: this.projectInfo.projectCode
      }
      API.isLaunchAvailable(param)
        .then(res => {
          this.isEditable = res
          this.getLaunchInfo()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起预立项按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 用户权限校验--编辑按钮是否展示
    verificationPermission () {
      const param = {
        projectCode: this.projectInfo.projectCode
      }
      API.verificationPermission(param)
        .then(res => {
          if (res.indexOf('00') > -1 || res.indexOf('02') > -1) {
            this.isEditable = true
          } else {
            this.isEditable = false
          }
          this.getLaunchInfo()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '校验权限失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 是否可以发起预立项流程
    whetherStartable () {
      const param = {
        projectCode: this.projectInfo.projectCode
      }
      API.whetherStartable(param)
        .then(res => {
          this.temVersionAuth = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '项目版本信息获取失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 打开预立项流程编辑页面
    openEditPage () {
      this.$router.push({
        path: '/beforeLaunchFlow/beforeLaunchFlowEdit',
        query: {
          addBeforeLaunch: 'false',
          type: 'BT-PRE-APPROVE', //类型(项目预立项、项目变更)
          approveNo: this.approveNo, //业务流水号
          projectCode: this.projectInfo.projectCode, //项目编码
          versionCode: this.versionCode // 项目版本号
        }
      })
    },
    // 打开预立项流程详情页面
    openDetailPage () {
      // 需要携带参数
      this.$router.push({
        path: '/beforeLaunchFlow/beforeLaunchFlowDetail',
        query: {
          type: 'BT-PRE-APPROVE', //类型(项目预立项、项目变更)
          projectCode: this.projectInfo.projectCode,
          approveNo: this.approveNo, //业务流水号,
          versionCode: this.versionCode // 项目版本号
        }
      })
    },
    // 获取预立项流程信息
    getLaunchInfo () {
      // 使用组件props传递请求参数
      let params = {
        projectCode: this.projectInfo.projectCode,
        businessType: 'BT-PRE-APPROVE' //预立项类型:枚举值
      }
      API.queryProjectApprove(params)
        .then(res => {
          this.loading = false
          if (res) {
            this.versionCode = res.versionNo
            this.approveNo = res.approveNo
            if (this.approveNo && res.historyFlag === '0') {
              flowAPI.getBusinessProcessInst(this.approveNo)
                .then(data => {
                  this.processInstName = data.processInstName
                  this.showLaunchFlag = true
                  this.launchInfoForm = res
                  let tempString = res
                  this.launchInfoForm.flowName = this.processInstName
                  this.launchInfoForm.initiatedDate = this.launchInfoForm.initiatedDate === null ? null : this.formatDate(this.launchInfoForm.initiatedDate)
                  this.launchInfoForm.endTime = this.launchInfoForm.endTime === null ? null : this.formatDate(this.launchInfoForm.endTime)
                  switch (this.launchInfoForm.approveState) {
                    case '1':
                      this.launchInfoForm.approveState = '草稿'
                      this.launchInfoForm.flowName = this.processInstName
                      break
                    case '2':
                      this.launchInfoForm.approveState = '审批中'
                      break
                    case '3':
                      this.launchInfoForm.approveState = '审批驳回'
                      break
                    case '4':
                      this.launchInfoForm.approveState = '已完成'
                      break
                    case '5':
                      this.launchInfoForm.approveState = '已作废'
                      break
                  }
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
              this.showLaunchFlag = true
              this.launchInfoForm = res
              let tempString = res
              this.launchInfoForm.flowName = res.progressName
              this.launchInfoForm.initiatedDate = this.launchInfoForm.initiatedDate === null ? null : this.formatDate(this.launchInfoForm.initiatedDate)
              this.launchInfoForm.endTime = this.launchInfoForm.endTime === null ? null : this.formatDate(this.launchInfoForm.endTime)
              switch (this.launchInfoForm.approveState) {
                case '1':
                  this.launchInfoForm.approveState = '草稿'
                  break
                case '2':
                  this.launchInfoForm.approveState = '审批中'
                  break
                case '3':
                  this.launchInfoForm.approveState = '审批驳回'
                  break
                case '4':
                  this.launchInfoForm.approveState = '已完成'
                  break
                case '5':
                  this.launchInfoForm.approveState = '已作废'
                  break
              }
            }
          } else {
            this.showLaunchFlag = false
            this.launchInfoForm = null
          }
          // 判断发起预立项流程的按钮是否显示:先判断用户是否具有权限-->是否存在草稿
          let falg = true
          if (this.isEditable && this.temVersionAuth) {
            falg = this.launchInfoForm === null
          } else {
            falg = false
          }
          this.$emit('showFlag', this.isEditable)
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
    }
  },
  created () {
  }
}
</script>
<style  lang="scss" scoped>
.launch-info{
  .project-panel{
    border: 1px solid #D8D8D8;
    &.is-expand{
      border-bottom: 1px solid #D8D8D8;
    }
    /deep/ .panel-header{
      border-bottom-color: #D8D8D8;
    }
    /deep/ .panel-body{
      margin-bottom: 0;
    }
  }
  .launch-body /deep/{
    .el-row:not(:nth-child(1)){
      margin-top: 5px;
    }
    .el-form-item{
      margin-bottom: 0;
      color: #333;
      .el-form-item__label{
        color: #333;
      }
    }
    .el-form-item .el-input__inner{
      width : 100%
    }
  }
}
</style>
