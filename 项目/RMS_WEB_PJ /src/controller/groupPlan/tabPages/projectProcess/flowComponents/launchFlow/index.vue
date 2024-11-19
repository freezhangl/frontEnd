<template>
  <div class="main-content">
    <div class="head-btn" v-if="showLaunchBtn">
      <span style="float: right;">
        <el-button class="normal-btn" @click="addLaunchFlow">发起立项流程</el-button>
      </span>
    </div>

    <div class="launch-info" v-if="showLaunchFlag">
      <project-panel title="立项流程" style="border:1px solid #E5E5E5;">
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
                <el-form-item label="流程名称:" prop="progressName">
                  <span>{{ launchInfoForm.progressName }}</span>
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
    <div v-else style="margin-top:30px;text-align:center;color:#333333;">暂无立项流程信息</div>
  </div>
</template>
<script>
import API from '@/serve/API_businessFlow'
import projectAPI from '@/serve/API_groupPlanProject'
import bus from '@/common/bus'
export default {
  name: 'launch-info',
  components: {
  },
  props: {
  },
  data () {
    return {
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '',
      showLaunchBtn: false, //立项流程发起按钮是否展示
      urlParam: '/groupPlan/launchFlow/', // 计立项流程单据新增/编辑/详情对应的url前缀
      businessType: '', // 业务单据类型值编码
      approveNo: '',
      projectCode: this.$route.params.projectCode, // 项目编码
      showLaunchFlag: false, // 无立项流程时不展示改组件
      isEditable: false, // 用户权限校验--是否具有编辑权限
      temVersionAuth: false, // 项目当前版本是否可以发起立项流程
      launchInfoForm: {
        progressName: null,
        initiatedDate: null,
        approveState: null,
        creatorName: null,
        endTime: null
      },
      meberEditFlag: 'false',
      versionList: [] //版本列表
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
        this.businessType = 'BT-DEMAND-APPROVE'
        break
      case 'u':
        this.businessType = 'BT-UNDERTAKER-APPROVE'
        break
    }
  },
  mounted () {
    this.isShowLaunchBtn()
    this.isShowEditBtn()
    this.getLaunchInfo()
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
    // 判断发起立项流程按钮是否展示
    isShowLaunchBtn () {
      const params = {
        projectCode: this.projectCode,
        businessType: this.businessType // 立项单据业务类型编码
      }
      API.isShowApproveButton(params)
        .then(res => {
          this.showLaunchBtn = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起立项按钮权限判断失败，请稍后重试！',
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
              message: e.message || '立项编辑按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取立项流程业务表单列表
    getLaunchInfo () {
      let params = {
        projectCode: this.projectCode,
        businessType: this.businessType // 立项单据业务类型编码
      }
      API.getApproveList(params)
        .then(res => {
          this.loading = false
          if (res && res.length !== 0) {
            this.showLaunchFlag = true
            this.approveNo = res[0].projectApproveInfo.approveNo
            this.launchInfoForm = res[0].projectApproveInfo
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
          } else {
            this.showLaunchFlag = false
            this.launchInfoForm = null
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取立项流程信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 新增立项流程
    addLaunchFlow () {
      let param = {
        businessType: this.businessType, // 立项单据业务类型编码
        projectCode: this.projectCode
      }
      API.validateApprove(param)
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
                        path: this.urlParam + 'launchFlowEdit',
                        query: {
                          newLaunch: 'true',
                          businessType: this.businessType, // 立项单据业务类型编码
                          projectCode: this.projectCode,
                          developPackage: this.developPackage,
                          projectCategory: this.projectCategory,
                          bringFiles: '1'
                        }
                      })
                    })
                    .catch(() => {
                      this.$router.push({
                        path: this.urlParam + 'launchFlowEdit',
                        query: {
                          newLaunch: 'true',
                          businessType: this.businessType, // 立项单据业务类型编码
                          projectCode: this.projectCode,
                          developPackage: this.developPackage,
                          projectCategory: this.projectCategory,
                          bringFiles: '2'
                        }
                      })
                    })
                } else {
                  this.$router.push({
                    path: this.urlParam + 'launchFlowEdit',
                    query: {
                      newLaunch: 'true',
                      businessType: this.businessType, // 立项单据业务类型编码
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
              message: '不能重复发起立项申请或当前项目信息未填写完整，请检查！',
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
    // 打开立项流程编辑页面
    openEditPage () {
      let param = {
        approveNo: this.approveNo, // 修改单据时必填业务流水号
        businessType: this.businessType, // 立项单据业务类型编码
        projectCode: this.projectCode
      }
      API.validateApprove(param)
        .then(res => {
          if (res === true) {
            this.$router.push({
              path: this.urlParam + 'launchFlowEdit',
              query: {
                newLaunch: 'false',
                businessType: this.businessType, // 立项单据业务类型编码
                approveNo: this.approveNo, //业务流水号
                projectCode: this.projectCode, //项目编码
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          } else {
            this.$message({
              message: '不能编辑立项申请或当前项目信息未填写完整，请检查！',
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
              message: e.message || '编辑立项流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 打开立项流程详情页面
    openDetailPage () {
      // 需要携带参数
      this.$router.push({
        path: this.urlParam + 'launchFlowDetail',
        query: {
          businessType: this.businessType, // 立项单据业务类型编码
          projectCode: this.projectCode,
          approveNo: this.approveNo, //业务流水号
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
  .launch-info{
    margin-top: 30px;
    .launch-body /deep/{
      .el-form-item .el-input__inner{
        width : 100%
      }
    }
  }
}
</style>
