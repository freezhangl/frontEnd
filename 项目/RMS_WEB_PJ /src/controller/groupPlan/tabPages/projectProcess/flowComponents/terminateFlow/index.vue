<template>
  <div class="main-content">
    <div class="head-btn" v-if="showTerminateBtn">
      <span style="float: right;">
        <el-button class="normal-btn" @click="addTerminateFlow">发起终止流程</el-button>
      </span>
    </div>
    <div class="terminate-info" v-if="showTerminateFlag">
      <project-panel title="终止流程" style="border:1px solid #E5E5E5;">
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
                <el-form-item label="流程名称:" prop="progressName">
                  <span>{{ terminateInfoForm.progressName }}</span>
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
    <div v-else style="margin-top:30px;text-align:center;color:#333333;">暂无终止流程信息</div>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_businessFlow'
import projectAPI from '@/serve/API_groupPlanProject'

export default {
  name: 'terminate-info',
  components: { projectPanel },
  props: {
  },
  data () {
    return {
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '',
      showTerminateBtn: false, // 终止流程发起按钮是否展示
      urlParam: '/groupPlan/terminateFlow/', // 终止流程单据新增/编辑/详情对应的url前缀
      businessType: '', // 业务单据类型值编码
      projectCode: this.$route.params.projectCode, // 项目编码
      approveNo: '',
      showTerminateFlag: false, // 无终止流程时不展示改组件
      isEditable: false, // 用户权限校验--是否具有编辑权限
      temVersionAuth: false, // 项目当前版本是否可以发起终止流程
      terminateInfoForm: {
        progressName: null,
        initiatedDate: null,
        approveState: null,
        creatorName: null,
        endTime: null
      }
    }
  },
  computed: {},
  created () {
    this.projectCategory = this.$route.query.projectCategory || ''
    let isPackage = this.$route.query.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.projectCategory + isPackage

    // 业务单据类型判断
    switch (this.projectCategory) {
      case 'd':
        this.businessType = 'BT-DEMAND-STOP'
        break
      case 'u':
        this.businessType = 'BT-UNDERTAKER-STOP'
        break
    }
  },
  mounted () {
    this.isShowBtn()
    this.isShowEditBtn()
    this.getTerminateInfo()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 发起终止按钮展示
    isShowBtn () {
      const params = {
        projectCode: this.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.isShowApproveButton(params)
        .then(res => {
          this.showTerminateBtn = res
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
              message: e.message || '终止编辑按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取终止流程单据
    getTerminateInfo () {
      // 使用组件props传递请求参数
      let params = {
        projectCode: this.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.getApproveList(params)
        .then(res => {
          this.loading = false
          if (res && res.length !== 0) {
            this.approveNo = res[0].projectApproveInfo.approveNo
            this.showTerminateFlag = true
            this.terminateInfoForm = res[0].projectApproveInfo
            this.terminateInfoForm.initiatedDate = this.terminateInfoForm.initiatedDate === null ? null : this.formatDate(this.terminateInfoForm.initiatedDate)
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
            this.showTerminateFlag = false
            this.terminateInfoForm = null
          }
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
    },
    // 发起终止流程
    addTerminateFlow () {
      let params = {
        businessType: this.businessType, // 单据业务类型编码
        projectCode: this.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res === true) {
            let params = {
              type: this.businessType, // 单据业务类型编码
              projectCode: this.projectCode
            }
            API.checkVoidAttachment(params)
              .then(res => {
                if (res === true) {
                  this.$confirm(' ', '是否自动带入之前上传的附件？', {
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
                        path: this.urlParam + 'terminateFlowEdit',
                        query: {
                          newTerminate: 'true',
                          businessType: this.businessType,
                          projectCode: this.projectCode,
                          developPackage: this.developPackage,
                          projectCategory: this.projectCategory,
                          bringFiles: '1'
                        }
                      })
                    })
                    .catch(() => {
                      this.$router.push({
                        path: this.urlParam + 'terminateFlowEdit',
                        query: {
                          newTerminate: 'true',
                          businessType: this.businessType,
                          projectCode: this.projectCode,
                          developPackage: this.developPackage,
                          projectCategory: this.projectCategory,
                          bringFiles: '2'
                        }
                      })
                    })
                } else {
                  this.$router.push({
                    path: this.urlParam + 'terminateFlowEdit',
                    query: {
                      newTerminate: 'true',
                      businessType: this.businessType,
                      projectCode: this.projectCode,
                      developPackage: this.developPackage,
                      projectCategory: this.projectCategory,
                      bringFiles: '2'
                    }
                  })
                }
              })
              .catch(e => {
                this.loading = false
                if (e.selfError) return
                if (e.message) {
                  this.$message({
                    message: e.message || '获取作废流程附件失败，请稍后重试！',
                    type: 'error',
                    showClose: true
                  })
                }
              })
          } else {
            this.$message({
              message: '不能重复发起终止申请或当前项目信息未填写完整，请检查！',
              type: 'warning',
              showClose: true
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起立项流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 打开终止流程编辑页面
    openEditPage () {
      let params = {
        approveNo: this.approveNo,
        businessType: this.businessType, // 单据业务类型编码
        projectCode: this.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res === true) {
            this.$router.push({
              path: this.urlParam + 'terminateFlowEdit',
              query: {
                newTerminate: 'false',
                businessType: this.businessType,
                approveNo: this.approveNo, //业务流水号
                projectCode: this.projectCode, //项目编码
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          } else {
            this.$message({
              message: '不能重复发起终止申请或当前项目信息未填写完整，请检查！',
              type: 'warning',
              showClose: true
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起立项流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查看流程
    openDetailPage () {
      this.$router.push({
        path: this.urlParam + 'terminateFlowDetail',
        query: {
          businessType: this.businessType,
          projectCode: this.projectCode,
          approveNo: this.approveNo, //业务流水号,
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
    }
  }

}
</script>
<style  lang="scss" scoped>
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
  .terminate-info{
    margin-top:30px;
    .terminate-body /deep/{
      .el-form-item .el-input__inner{
        width : 100%
      }
    }
  }
}
</style>
