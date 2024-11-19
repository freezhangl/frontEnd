<template>
  <div class="final-info" v-if="showFinalFlag">
    <project-panel
      title="结项流程"
      v-for="item in finalList"
      :key="item.id"
      style="margin-bottom: 10px">
      <template v-slot:header>
        <el-button class="normal-btn" @click="openDetailPage(item.projectCode, item.approveNo, item.versionCode)">查看流程</el-button>
        <!-- v-if="isEditable&&item.approveState==='1'" -->
        <el-button class="normal-btn" v-if="isEditable&&item.approveState==='1'"  @click="openEditPage(item.projectCode, item.approveNo, item.versionCode)">编辑</el-button>
      </template>
      <div class="final-body">
        <el-form ref="finalInfoForm" label-width="130px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="流程名称:" prop="processInstName">
                <span>{{ item.processInstName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程发起时间:" prop="initiatedDate">
                <span>{{ item.initiatedDate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态:" prop="approveState">
                <span v-show="item.approveState == 1">草稿</span>
                <span v-show="item.approveState == 2">审批中</span>
                <span v-show="item.approveState == 3">审批驳回</span>
                <span v-show="item.approveState == 4">已完成</span>
                <span v-show="item.approveState == 5">已作废</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="发起人:" prop="creatorName">
                <span>{{ item.creatorName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程结束时间:" prop="endTime">
                <span>{{ item.endTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </project-panel>
  </div>
  <div v-else style="text-align:center;color:#333333;">暂无结项流程信息</div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
export default {
  name: 'final-info',
  components: {
    projectPanel
  },
  props: {
    projectInfo: {}
  },
  data () {
    return {
      processInstName: '',
      versionCode: '',
      editId: '',
      documentId: '',
      showFinalFlag: false, // 无结项流程时不展示改组件
      isEditable: false, // 用户权限校验--是否具有编辑权限
      temVersionAuth: false, // 项目当前版本是否可以发起结项流程
      finalList: []
    }
  },
  computed: {},
  mounted () {
    this.isShowBtn()
    this.getFinalInfo()
    // this.verificationPermission()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 发起终止按钮展示
    isShowBtn () {
      API.isFinAvailable({ projectCode: this.$route.params.projectCode })
        .then(res => {
          this.isEditable = res
          this.$emit('showFinal', this.isEditable)
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起结项按钮校验失败，请稍后重试！',
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
    // 是否可以发起结项流程
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
    // 打开结项流程编辑页面
    openEditPage (code, approveNo, version) {
      // this.$router.push('/finalFlow/FinalFlowEdit')
      this.$router.push({
        path: '/finalFlow/FinalFlowEdit',
        query: {
          addFinal: 'false',
          type: 'BT-FINISH', //类型
          projectCode: code,
          approveNo: approveNo, // 业务流水号
          versionCode: version // 项目版本号
        }
      })
    },
    // 打开结项流程详情页面
    openDetailPage (code, id, version) {
      // 需要携带参数
      this.$router.push({
        path: '/finalFlow/finalFlowDetail',
        query: {
          type: 'BT-FINISH',
          projectCode: code,
          approveNo: id, //业务流水号,
          versionCode: version // 项目版本号
        }
      })
    },
    // 获取结项流程信息
    getFinalInfo () {
      // 使用组件props传递请求参数
      let params = {
        projectCode: this.projectInfo.projectCode
      }
      API.queryFinalFlowList(params)
        .then(res => {
          this.showFinalFlag = res !== null
          this.loading = false
          if (res && res.length > 0) {
            let historyFlag = res[0].historyFlag
            this.versionCode = res[0].versionNo
            this.approveNo = res[0].approveNo
            if (historyFlag === '1') {
              res[0].processInstName = res[0].progressName
              if (res[0].approveState === '1') {
                res[0].processInstName = res.processInstName
              }
              res[0].initiatedDate = res[0].initiatedDate === null ? null : this.formatDate(res[0].initiatedDate)
              res[0].endTime = res[0].endTime === null ? null : this.formatDate(res[0].endTime)
              this.finalList = res
            } else {
              flowAPI.getBusinessProcessInst(res[0].approveNo)
                .then(data => {
                  this.processInstName = data.processInstName
                  res[0].processInstName = data.processInstName
                  if (res[0].approveState === '1') {
                    res[0].processInstName = data.processInstName
                  }
                  res[0].initiatedDate = res[0].initiatedDate === null ? null : this.formatDate(res[0].initiatedDate)
                  res[0].endTime = res[0].endTime === null ? null : this.formatDate(res[0].endTime)
                  this.finalList = res
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
          }
          // if (this.finalList && this.finalList.length > 0) {
          //   this.showFinalFlag = true
          // }
          // 判断发起结项流程的按钮是否显示:先判断用户是否具有权限-->是否存在草稿
          let falg = true
          // this.isEditable && this.temVersionAuth
          if (this.isEditable) {
            falg = this.finalList === null
          } else {
            falg = false
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取结项流程信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  },
  filters: {
    time (val) {
      let date = ''
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        date = new Date(val)
          .toLocaleString()
      } else {
        date = new Date(val)
          .toLocaleString('chinese', { hour12: false })
          .replace(/(\/)/g, '-')
      }

      return date
    }
  },
  created () {}
}
</script>
<style  lang="scss" scoped>
.final-info {
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
  .final-body /deep/ {
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
      .el-form-item .el-input__inner {
          width: 100%;
      }
  }
}
</style>
