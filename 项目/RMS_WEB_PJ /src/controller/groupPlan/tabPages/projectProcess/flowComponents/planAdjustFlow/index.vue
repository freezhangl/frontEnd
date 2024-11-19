<template>
  <div class="main-content">
    <div class="head-btn" v-if="showPlanAdjustBtn">
      <span style="float: right;">
        <el-button class="normal-btn" @click="addPlanAdjustFlow">发起计划调整流程</el-button>
      </span>
    </div>
    <div class="change-flow" v-if="processList.length">
      <project-panel :title="'计划调整流程('+(index+1)+')'" v-for="(process,index) in processList" :key="index">
        <template v-slot:header>
          <el-button class="normal-btn" @click="viewPlanAdjustFlow(process)">查看流程</el-button>
          <el-button class="normal-btn" v-if="process.approveState==='1'" @click="editPlanAdjustFlow(process)">编辑</el-button>
        </template>
        <div class="flow-body">
          <el-form
            :model="process"
            :ref="'processForm'+index"
            label-width="130px" >
            <el-row>
              <el-col :span="8">
                <el-form-item label="流程名称:" prop="progressName">
                  <span>{{ process.progressName }}</span>
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
    <div v-else style="margin-top:30px;text-align:center;color:#333333;">暂无计划调整流程信息</div>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_businessFlow'
import projectAPI from '@/serve/API_groupPlanProject'

export default {
  name: 'planAdjustFlow',
  components: { projectPanel },
  data () {
    return {
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '',
      showPlanAdjustBtn: false, //是否显示发起计划调整流程
      urlParam: '/groupPlan/planAdjustFlow/', // 计划调整流程单据新增/编辑/详情对应的url前缀
      businessType: 'BT-DEMAND-PLAN-CHANGE', // 业务单据类型值编码
      isEditable: true, // 用户权限校验--是否具有编辑权限 todo 实际是false
      processList: []
    }
  },
  props: {
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
    this.projectCategory = this.$route.query.projectCategory || ''
    let isPackage = this.$route.query.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.projectCategory + isPackage

    this.isShowEditBtn()
    this.getPlanAdjustApproveList()
    this.showPlanAdjust()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 判断编辑按钮是否展示
    isShowEditBtn () {
      const params = {
        projectCode: this.$route.params.projectCode,
        permissionCode: '03' // 权限编码-根据字典表设置
      }
      projectAPI.checkUserProjectPermission(params)
        .then(res => {
          this.isEditable = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '变更编辑按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 是否显示发起计划调整流程按钮
    showPlanAdjust () {
      const params = {
        projectCode: this.$route.params.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.isShowApproveButton(params)
        .then(res => {
          this.showPlanAdjustBtn = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起计划调整按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取计划调整流程单据列表
    getPlanAdjustApproveList () {
      let params = {
        projectCode: this.$route.params.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.getApproveList(params)
        .then(res => {
          if (res) {
            res.forEach(element => {
              element.projectApproveInfo.initiatedDate = element.projectApproveInfo.initiatedDate ? this.formatDate(element.projectApproveInfo.initiatedDate) : ''
              element.projectApproveInfo.endTime = element.projectApproveInfo.endTime ? this.formatDate(element.projectApproveInfo.endTime) : ''
              this.processList.push(element.projectApproveInfo)
            })
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
    // 新增计划调整流程
    addPlanAdjustFlow () {
      let params = {
        businessType: this.businessType, // 立项单据业务类型编码
        projectCode: this.$route.params.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res) {
            // 新增计划调整流程需要校验是否有权限
            this.$router.push({
              path: this.urlParam + 'planAdjustFlowEdit',
              query: {
                newChange: 'true', //新增变更流程
                businessType: this.businessType,
                projectCode: this.$route.params.projectCode,
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
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
        })
    },
    //查看计划调整流程
    viewPlanAdjustFlow (process) {
      this.$router.push({
        path: this.urlParam + 'planAdjustFlowDetail',
        query: {
          businessType: this.businessType,
          projectCode: process.projectCode,
          approveNo: process.approveNo, // 业务流水号
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
    },
    //编辑计划调整流程
    editPlanAdjustFlow (process) {
      let params = {
        approveNo: process.approveNo, // 修改单据时必填业务流水号
        businessType: this.businessType,
        projectCode: this.$route.params.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res) {
            this.$router.push({
              path: this.urlParam + 'planAdjustFlowEdit',
              query: {
                newChange: 'false',
                businessType: this.businessType,
                projectCode: process.projectCode,
                approveNo: process.approveNo, //业务流水号（供编辑页面-文档资料组件拿流水号）
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
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
        })
    }
  }
}
</script>
<style lang="scss" scoped>
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
    .change-flow{
      margin-top: 30px;
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
      .el-form-item{
        color: #333;
        /deep/.el-form-item__label{
          color: #333;
        }
      }
    }
  }
</style>
