<template>
  <div class="main-content">
    <div class="head-btn" v-if="showChangeBtn">
      <span style="float: right;">
        <el-button class="normal-btn" @click="addChangeFlow">发起变更流程</el-button>
      </span>
    </div>
    <div class="change-flow" v-if="processList.length">
      <project-panel :title="'变更流程('+(index+1)+')'" v-for="(process,index) in processList" :key="index">
        <template v-slot:header>
          <el-button class="normal-btn" @click="viewProcess(process.projectApproveInfo)">查看流程</el-button>
          <el-button class="normal-btn" v-if="isEditable&&process.projectApproveInfo.approveState==='1'" @click="editProcess(process.projectApproveInfo)">编辑</el-button>
        </template>
        <div class="flow-body">
          <el-form
            :model="process"
            :ref="'processForm'+index"
            label-width="130px" >
            <el-row>
              <el-col :span="8">
                <el-form-item label="流程名称:" prop="progressName">
                  <span>{{ process.projectApproveInfo.progressName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="流程发起时间:" prop="initiatedDate">
                  <span>{{ process.projectApproveInfo.initiatedDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态:" prop="approveState">
                  <span>{{ process.projectApproveInfo.approveState | state }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="发起人:" prop="creatorName">
                  <span>{{ process.projectApproveInfo.creatorName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="流程结束时间:" prop="endTime">
                  <span>{{ process.projectApproveInfo.endTime }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </project-panel>
    </div>
    <div v-else style="margin-top:30px;text-align:center;color:#333333;">暂无变更流程信息</div>
  </div>
</template>
<script>

import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_businessFlow'
import projectAPI from '@/serve/API_groupPlanProject'
import bus from '@/common/bus'

export default {
  name: 'changeFlow',
  components: { projectPanel },
  data () {
    return {
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '',
      projectCode: this.$route.params.projectCode,
      showChangeBtn: false, //是否显示发起变更流程---有权限且项目明细状态为已立项
      urlParam: '/groupPlan/changeFlow/', // 变更流程单据新增/编辑/详情对应的url前缀
      businessType: '', // 业务单据类型值编码
      isEditable: false, // 用户权限校验--是否具有编辑权限
      processList: [],
      meberEditFlag: 'false',
      versionList: [] //版本列表
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

    // 业务单据类型判断
    switch (this.projectCategory) {
      case 'd':
        this.businessType = 'BT-DEMAND-CHANGE'
        break
      case 'u':
        this.businessType = 'BT-UNDERTAKER-CHANGE'
        break
    }

    this.isShowChangeBtn()
    this.isShowEditBtn()
    this.getChangeApproveList()
    this.getProjectVersion()
    this.verificationPermission('02')
  },
  methods: {
    //查询权限
    verificationPermission (authCode) {
      const param = {
        permissionCode: authCode,
        projectCode: this.$route.params.projectCode
      }
      projectAPI.checkUserProjectPermission(param)
        .then(res => {
          switch (authCode) {
            case '02':
              if (!res) {
                this.verificationPermission('14')
              }
              break
            case '03':
              this.closePermission = res
              this.approvePermission = res
              break
            case '14':
              this.meberEditFlag = res.toString()
              break
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '权限获取失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查询项目版本列表
    getProjectVersion () {
      projectAPI.getProjectVersionList(this.projectCode)
        .then(res => {
          if (res) {
            res.forEach((item, index) => {
              item.numVersionName = `#${res.length - index} ${item.versionName}`
              if (item.effective) {
                this.curVersion = item
                this.budgetData = {
                  isEdit: false,
                  projectCode: this.projectCode,
                  versionNo: item.versionNo
                }
              }
            })
            this.versionList = res
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
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 是否显示发起变更流程按钮
    isShowChangeBtn () {
      const params = {
        projectCode: this.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.isShowApproveButton(params)
        .then(res => {
          this.showChangeBtn = res
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
    // 判断编辑按钮是否展示
    isShowEditBtn () {
      const params = {
        projectCode: this.projectCode,
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
    // 获取变更流程单据列表
    getChangeApproveList () {
      let params = {
        projectCode: this.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.getApproveList(params)
        .then(res => {
          if (res && res.length !== 0) {
            res.forEach(element => {
              element.projectApproveInfo.initiatedDate = element.projectApproveInfo.initiatedDate ? this.formatDate(element.projectApproveInfo.initiatedDate) : ''
              element.projectApproveInfo.endTime = element.projectApproveInfo.endTime ? this.formatDate(element.projectApproveInfo.endTime) : ''
            })
            this.processList = res
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
    // 新增变更流程
    addChangeFlow () {
      // 新增变更流程需要校验是否有权限
      let params = {
        businessType: this.businessType, // 变更单据业务类型编码
        projectCode: this.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res) {
            this.$router.push({
              path: this.urlParam + 'changeFlowEdit',
              query: {
                newChange: 'true', //新增变更流程
                businessType: this.businessType, // 变更单据业务类型编码
                projectCode: this.projectCode,
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
          if (e.code === '120044' || e.code === '120122') {
            setTimeout(() => {
              this.$confirm(' ', '是否跳转至项目编辑页面？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                customClass: 'self-message-box-delete',
                cancelButtonClass: 'self-message-box-delete-cancel',
                confirmButtonClass: 'self-message-box-delete-confirm'
              })
                .then(() => {
                  if (this.projectCategory === 'd') {
                    projectAPI.checkProjectEdit({ projectCode: this.$route.params.projectCode || this.projectCode })
                      .then(res => {
                        this.$router.push({
                          path: '/groupPlan/projectEdit/' + this.$route.params.projectCode,
                          query: {
                            meberEditFlag: this.meberEditFlag,
                            developPackage: this.developPackage,
                            projectCategory: this.projectCategory,
                            versionNo: this.versionList[0].versionNo //获取版本列表中最新的版本
                          }
                        })
                      })
                      .catch(e => {
                        if (e.selfError) return
                        if (e.message) {
                          this.$message({
                            message: e.message || '无法编辑项目！',
                            type: 'error',
                            showClose: true
                          })
                        }
                      })
                  } else {
                    this.$router.push({
                      path: '/groupPlan/projectEdit/' + this.$route.params.projectCode,
                      query: {
                        meberEditFlag: this.meberEditFlag,
                        developPackage: this.developPackage,
                        projectCategory: this.projectCategory
                      }
                    })
                  }
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消跳转'
                  })
                })
            }, 1000)
          }
        })
    },
    //查看流程
    viewProcess (process) {
      this.$router.push({
        path: this.urlParam + 'changeFlowDetail',
        query: {
          businessType: this.businessType, // 变更单据业务类型编码
          projectCode: process.projectCode,
          approveNo: process.approveNo, // 业务流水号
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
    },
    // 编辑流程
    editProcess (process) {
      //  编辑变更流程需要校验是否有权限
      let params = {
        approveNo: process.approveNo, // 修改单据时必填业务流水号
        businessType: this.businessType,
        projectCode: this.$route.params.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res) {
            this.$router.push({
              path: this.urlParam + 'changeFlowEdit',
              query: {
                newChange: 'false',
                businessType: this.businessType, // 变更单据业务类型编码
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
