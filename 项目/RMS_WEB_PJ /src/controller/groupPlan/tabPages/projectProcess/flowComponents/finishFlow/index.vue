<template>
  <div class="main-content">
    <div class="head-btn" v-if="showFinalBtn">
      <span style="float: right;">
        <el-button class="normal-btn" @click="addFinalFlow">发起结项流程</el-button>
      </span>
    </div>
    <div class="final-info" v-if="showFinalFlag">
      <project-panel
        title="结项流程"
        style="border:1px solid #E5E5E5;">
        <template v-slot:header>
          <el-button class="normal-btn" @click="openDetailPage">查看流程</el-button>
          <el-button class="normal-btn" v-if="isEditable&&finishForm.approveState==='1'" @click="openEditPage">编辑</el-button>
        </template>
        <div class="final-body">
          <el-form
            :model="finishForm"
            ref="finalInfoForm"
            label-width="130px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="流程名称:" prop="progressName">
                  <span>{{ finishForm.progressName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="流程发起时间:" prop="initiatedDate">
                  <span>{{ finishForm.initiatedDate }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态:" prop="approveState">
                  <span v-show="finishForm.approveState == '1'">草稿</span>
                  <span v-show="finishForm.approveState == '2'">审批中</span>
                  <span v-show="finishForm.approveState == '3'">审批驳回</span>
                  <span v-show="finishForm.approveState == '4'">已完成</span>
                  <span v-show="finishForm.approveState == '5'">已作废</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="发起人:" prop="creatorName">
                  <span>{{ finishForm.creatorName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="流程结束时间:" prop="endTime">
                  <span>{{ finishForm.endTime }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </project-panel>
    </div>
    <div v-else style="margin-top:30px;text-align:center;color:#333333;">暂无结项流程信息</div>
  </div>
</template>
<script>

import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_businessFlow'
import projectAPI from '@/serve/API_groupPlanProject'

export default {
  name: 'final-info',
  components: {
    projectPanel
  },
  props: {
  },
  data () {
    return {
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '',
      showFinalBtn: false, // 结项流程发起按钮是否展示
      urlParam: '/groupPlan/finishFlow/', // 结项流程单据新增/编辑/详情对应的url前缀
      businessType: '', // 业务单据类型值编码
      projectCode: this.$route.params.projectCode, // 项目编码
      showFinalFlag: false, // 无结项流程时不展示改组件
      isEditable: false, // 用户权限校验--是否具有编辑权限
      temVersionAuth: false, // 项目当前版本是否可以发起结项流程
      finishForm: []
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
        this.businessType = 'BT-DEMAND-FINISH'
        break
      case 'u':
        this.businessType = 'BT-UNDERTAKER-FINISH'
        break
    }
  },
  mounted () {
    this.isShowFinishBtn()
    this.isShowEditBtn()
    this.getFinalInfo()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 发起终止按钮展示
    isShowFinishBtn () {
      const params = {
        projectCode: this.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.isShowApproveButton(params)
        .then(res => {
          this.showFinalBtn = res
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
              message: e.message || '结项编辑按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取结项流程信息
    getFinalInfo () {
      let params = {
        projectCode: this.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.getApproveList(params)
        .then(res => {
          if (res && res.length !== 0) {
            this.showFinalFlag = true
            this.loading = false
            this.finishForm = res[0].projectApproveInfo
            this.finishForm.initiatedDate = this.finishForm.initiatedDate === null ? null : this.formatDate(this.finishForm.initiatedDate)
            this.finishForm.endTime = this.finishForm.endTime === null ? null : this.formatDate(this.finishForm.endTime)
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
    },
    //发起结项流程
    validateApprove () {
      let params = {
        businessType: this.businessType, // 立项单据业务类型编码
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
                        path: this.urlParam + 'finishFlowEdit',
                        query: {
                          newFinish: 'true',
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
                        path: this.urlParam + 'finishFlowEdit',
                        query: {
                          newFinish: 'true',
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
                    path: this.urlParam + 'finishFlowEdit',
                    query: {
                      newFinish: 'true',
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
              message: '不能重复结项申请或当前项目信息未填写完整，请检查！',
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
              message: e.message || '发起结项流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 新增结项流程
    addFinalFlow () {
      const params = {
        status: this.projectCategory === 'u' ? 1 : 2, // 1承担项目，2需求项目
        projectCode: this.projectCode
      }
      //判断当前项目是否有未上传附件的成果
      API.isAchievementHaveFile(params)
        .then(res => {
          if (res) {
            this.$confirm(' ', res, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
              customClass: 'self-message-box-delete',
              cancelButtonClass: 'self-message-box-delete-cancel',
              confirmButtonClass: 'self-message-box-delete-confirm'
            })
              .then(() => {
                this.validateApprove()
              })
          } else {
            this.validateApprove()
          }
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
    // 打开结项流程编辑页面
    openEditPage () {
      let params = {
        approveNo: this.finishForm.approveNo,
        businessType: this.businessType, // 立项单据业务类型编码
        projectCode: this.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res === true) {
            this.$router.push({
              path: this.urlParam + 'finishFlowEdit',
              query: {
                newFinish: 'false',
                businessType: this.businessType,
                projectCode: this.projectCode,
                approveNo: this.finishForm.approveNo, // 业务流水号
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          } else {
            this.$message({
              message: '不能重复结项申请或当前项目信息未填写完整，请检查！',
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
              message: e.message || '发起结项流程失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 打开结项流程详情页面
    openDetailPage () {
      this.$router.push({
        path: this.urlParam + 'finishFlowDetail',
        query: {
          businessType: this.businessType,
          projectCode: this.projectCode,
          approveNo: this.finishForm.approveNo, //业务流水号,
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
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
  .final-info {
    margin-top: 30px;
    .final-body /deep/ {
      .el-form-item .el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>
