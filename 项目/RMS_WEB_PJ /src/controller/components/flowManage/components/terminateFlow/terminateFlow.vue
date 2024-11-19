<template>
  <div class="terminate-info" v-if="showTerminateFlag">
    <project-panel title="终止流程">
      <template v-slot:header>
        <el-button class="normal-btn" @click="openDetailPage">查看流程</el-button>
        <el-button v-if="isEditable&&terminateInfoForm.approveState==='草稿'" class="normal-btn" @click="openEditPage">编辑</el-button>
      </template>
      <div class="terminate-body">
        <el-form
          :model="terminateInfoForm"
          ref="terminateInfoForm"
          label-width="130px" >
          <el-row>
            <el-col :span="8">
              <el-form-item label="流程名称:" prop="flowName">
                <span>{{ terminateInfoForm.flowName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程发起时间:" prop="initiatedDate">
                <span>{{ terminateInfoForm.initiatedDate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态:" prop="approveState">
                <span>{{ terminateInfoForm.approveState }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="发起人:" prop="creatorName">
                <span>{{ terminateInfoForm.creatorName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程结束时间:" prop="endTime">
                <span>{{ terminateInfoForm.endTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </project-panel>
  </div>
  <div v-else style="text-align:center;color:#333333;">暂无终止流程信息</div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
import termAPI from './API_terminate'
import flowAPI from '@/serve/API_flow'
export default {
  name: 'terminate-info',
  components: { projectPanel },
  props: {
    projectInfo: {
    }
  },
  data () {
    return {
      processInstName: '',
      versionCode: '',
      approveNo: '',
      showTerminateFlag: false, // 无终止流程时不展示改组件
      isEditable: false, // 用户权限校验--是否具有编辑权限
      temVersionAuth: false, // 项目当前版本是否可以发起终止流程
      terminateInfoForm: {
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
    this.isShowBtn()
    // this.whetherStartStop()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 发起终止按钮展示
    isShowBtn () {
      termAPI.isAvailable({ projectCode: this.$route.params.projectCode })
        .then(res => {
          this.isEditable = res
          this.getTerminateInfo()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起终止按钮校验失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 打开终止流程编辑页面
    openEditPage () {
      this.$router.push({
        path: '/terminateFlow/terminateFlowEdit',
        query: {
          addTerminate: 'false',
          type: 'BT-STOP', //类型(项目立项、项目变更)
          approveNo: this.approveNo, //业务流水号
          projectCode: this.$route.params.projectCode, //项目编码
          versionCode: this.versionCode // 项目版本号
        }
      })
    },
    // 查看流程
    openDetailPage () {
      this.$router.push({
        path: '/terminateFlow/terminateFlowDetail',
        query: {
          type: 'BT-STOP', //类型(项目立项、项目变更)
          projectCode: this.$route.params.projectCode,
          approveNo: this.approveNo, //业务流水号,
          versionCode: this.versionCode // 项目版本号
        }
      })
    },
    // 获取终止流程单据
    getTerminateInfo () {
      // 使用组件props传递请求参数
      let params = {
        projectCode: this.$route.params.projectCode
      }
      termAPI.queryTermList(params)
        .then(res => {
          this.loading = false
          if (res && res.length > 0) {
            this.showTerminateFlag = true
            let historyFlag = res[0].historyFlag
            this.versionCode = res[0].versionNo
            this.approveNo = res[0].approveNo
            if (historyFlag === '1') {
              this.showTerminateFlag = true
              this.terminateInfoForm = res[0]
              this.terminateInfoForm.flowName = res[0].progressName
              this.terminateInfoForm.initiatedDate = this.formatDate(this.terminateInfoForm.createdDate)
              this.terminateInfoForm.endTime = this.terminateInfoForm.endTime === null ? null : this.formatDate(this.terminateInfoForm.endTime)
              switch (this.terminateInfoForm.approveState) {
                case '1':
                  this.terminateInfoForm.approveState = '草稿'
                  break
                case '2':
                  this.terminateInfoForm.approveState = '审批中'
                  break
                case '3':
                  this.terminateInfoForm.approveState = '审批驳回'
                  break
                case '4':
                  this.terminateInfoForm.approveState = '已完成'
                  break
                case '5':
                  this.terminateInfoForm.approveState = '已作废'
                  break
              }
            } else {
              flowAPI.getBusinessProcessInst(this.approveNo)
                .then(data => {
                  this.processInstName = data.processInstName
                  this.showTerminateFlag = true
                  this.terminateInfoForm = res[0]
                  this.terminateInfoForm.flowName = this.processInstName
                  this.terminateInfoForm.initiatedDate = this.formatDate(this.terminateInfoForm.createdDate)
                  this.terminateInfoForm.endTime = this.terminateInfoForm.endTime === null ? null : this.formatDate(this.terminateInfoForm.endTime)
                  switch (this.terminateInfoForm.approveState) {
                    case '1':
                      this.terminateInfoForm.approveState = '草稿'
                      break
                    case '2':
                      this.terminateInfoForm.approveState = '审批中'
                      break
                    case '3':
                      this.terminateInfoForm.approveState = '审批驳回'
                      break
                    case '4':
                      this.terminateInfoForm.approveState = '已完成'
                      break
                    case '5':
                      this.terminateInfoForm.approveState = '已作废'
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
            }
          } else {
            this.showTerminateFlag = false
            this.terminateInfoForm = null
          }
          // 判断发起终止流程的按钮是否显示:先判断用户是否具有权限-->是否存在草稿
          this.$emit('showFlag', this.isEditable)
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取终止流程信息失败，请稍后重试！',
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
.terminate-info{
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
  .terminate-body /deep/{
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
