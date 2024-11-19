<template>
  <div class="change-flow" v-if="processList.length">
    <project-panel :title="'变更流程('+(index+1)+')'" v-for="(process,index) in processList" :key="index">
      <template v-slot:header>
        <el-button class="normal-btn" @click="viewProcess(process)">查看流程</el-button>
        <el-button class="normal-btn" v-if="process.approveState==='1'" @click="editProcess(process)">编辑</el-button>
      </template>
      <div class="flow-body">
        <el-form
          :model="process"
          :ref="'processForm'+index"
          label-width="130px" >
          <el-row>
            <el-col :span="8">
              <el-form-item label="流程名称:" prop="flowName">
                <span>{{ process.flowName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程发起时间:" prop="initiatedDate">
                <span>{{ process.initiatedDate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态:" prop="approveState">
                <span>{{ process.approveState | state }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="发起人:" prop="creatorName">
                <span>{{ process.creatorName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流程结束时间:" prop="endTime">
                <span>{{ process.endTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </project-panel>
  </div>
  <div v-else style="text-align:center;color:#333333;">暂无变更流程信息</div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
export default {
  name: 'changeFlow',
  components: { projectPanel },
  data () {
    return {
      processList: []
    }
  },
  props: {
    projectInfo: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    state: function (val) {
      let str = ''
      switch (val) {
        case '1':
          str = '草稿'
          break
        case '2':
          str = '审批中'
          break
        case '3':
          str = '审批驳回'
          break
        case '4':
          str = '已完成'
          break
        case '5':
          str = '已作废'
          break
      }
      return str
    }
  },
  created () {
    this.getList()
    this.showChange()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 是否显示发起变更流程按钮
    showChange () {
      API.checkProjectState({ projectCode: this.projectInfo.projectCode })
        .then(res => {
          this.$emit('showChange', res)
        })
        .catch(e => {
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
    //获取列表
    getList () {
      let params = {
        projectCode: this.projectInfo.projectCode
      }
      API.getChangeApproveList(params)
        .then(res => {
          if (res && res.length > 0) {
            let historyFlag = res[0].historyFlag
            if (historyFlag === '1') {
              res.forEach(element => {
                element.initiatedDate = element.initiatedDate ? this.formatDate(element.initiatedDate) : ''
                element.endTime = element.endTime ? this.formatDate(element.endTime) : ''
                element.flowName = element.progressName
              })
              this.processList = res
            } else {
              res.forEach(element => {
                element.initiatedDate = element.initiatedDate ? this.formatDate(element.initiatedDate) : ''
                element.endTime = element.endTime ? this.formatDate(element.endTime) : ''
                // element.flowName = '变更审批'
                if (element.approveNo) {
                  flowAPI.getBusinessProcessInst(element.approveNo)
                    .then(data => {
                    // element.flowName = data.processInstName
                      this.$set(element, 'flowName', data.processInstName)
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
              })
              this.processList = res
            }
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取列表失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //查看流程
    viewProcess (process) {
      this.$router.push({
        name: 'changeFlowViewDetail',
        path: '/changeFlow/changeFlowViewDetail',
        query: {
          type: 'BT-CHANGE', //类型(项目变更)
          projectCode: this.projectInfo.projectCode,
          approveNo: process.approveNo //业务流水号,
          // id: process.approveNo //业务流水号,TODO:文档详情页面获取接口是id还是approveNo？
        // versionCode: this.versionCode // 项目版本号
        }
      })
    },
    //编辑流程
    editProcess (process) {
      this.$router.push({
        name: 'changeFlowEdit',
        query: {
          addLaunch: 'false',
          type: 'BT-CHANGE', //类型(项目变更)
          // approveNo: process.approveNo, //业务流水号
          projectCode: process.projectCode,
          approveNo: process.approveNo //业务流水号（供编辑页面-项目文档组件拿流水号）
          // documentNo: this.documentId, //业务流水号
          // projectCode: this.projectInfo.projectCode,
          // id: this.editId,
          // versionCode: this.versionCode // 项目版本号
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.change-flow{
  .project-panel{
    border: 1px solid #D8D8D8;
    border-bottom: none;
    margin-top: 20px;
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
  .flow-body /deep/{
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
  }
}
</style>
