<template>
  <div class="launch-edit">
    <!-- 详情页面 -->
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-back" v-if="createdBy && userId === createdBy"  @click="rollBackProcessInstance"><span class="global-family">撤回流程</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">本单位自立项目里程碑完成申请</div>

      <div class="main-content">
        <div class="approval-form">
          <project-panel
            class="project-panel"
            title="里程碑完成情况"
            style="border:1px solid #E9E9E9">
            <el-form
              :model="milestoneFinishForm"
              label-position='right'
              ref="finishForm"
              label-width="180px">
              <el-row>
                <el-col :span="15">
                  <el-form-item label="里程碑名称:" prop="milestoneName" style="word-wrap:break-word">
                    {{milestoneFinishForm.milestoneName}}
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="计划完成时间:" prop="planFinishTime">
                    {{milestoneFinishForm.planFinishTime?formatDate(milestoneFinishForm.planFinishTime):''}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="15">
                  <el-form-item label="关联项目名称:" prop="projectName" style="word-wrap:break-word">
                    {{milestoneFinishForm.projectName}}
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="关联项目编码:" prop="projectCode">
                    {{milestoneFinishForm.projectCode}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="任务及预期成果:" prop="resultInformation">
                    <span  v-show="milestoneFinishForm.linkResultFlag=='0'">
                      {{milestoneFinishForm.resultInformation}}
                    </span>
                    <span v-show="milestoneFinishForm.linkResultFlag=='1'" v-for="item in milestoneFinishForm.resultList" :key="item.id">
                      {{item.achievementName}};&nbsp;
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="支撑公司或部门关键事件:"
                    prop="essentialAffair"
                    style="word-wrap:break-word"
                  >
                    {{milestoneFinishForm.essentialAffair}}
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="成果完成情况:"
                    prop="resultFinishStatus"
                    style="word-wrap:break-word"
                  >
                    {{milestoneFinishForm.resultFinishStatus}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="备注:"
                    prop="remark"
                    style="word-wrap:break-word">
                    {{milestoneFinishForm.remark}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </project-panel>
          <approval-opinion v-if="approvalOpinionList.length && isShowApproval" :business-opinions-array="approvalOpinionList"></approval-opinion>
          <project-document-detail id="project-doc" :file-list="projectDocList" v-if="docVisible"></project-document-detail>
          <!-- <project-document-detail id="attach-doc" :project-doc-list="projectDocList"></project-document-detail> -->
          <!-- <approval-opinion v-if="historyFlag===1&&approvalOpinionList.length" :business-opinions-array="approvalOpinionList"></approval-opinion> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from './API_milestoneManagement'
import flowAPI from '@/serve/API_flow'
import projectPanel from '@/controller/components/projectPanel'
import projectDocumentDetail from './components/detail'
import { getStore } from '@/store'
export default {
  components: {
    projectPanel,
    projectDocumentDetail
  },
  data () {
    return {
      createdBy: '',
      docVisible: false,
      finishForm: {
        resultInformation: '',
        isShowTrace: false // 是否显示流程跟踪按钮
      },
      isShowTrace: false,
      projectName: '', // 项目名称
      isEditable: false, //用户是否具有编辑权限
      showBackTop: false, //滚动图片是否显示
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      projectInfo: {
        type: '11',
        documentNo: this.$route.query.id
      },
      clearFlag: true, //true 触发滚动
      projectCode: this.$route.query.projectCode,
      milestoneFinishForm: {},
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      approveNo: this.$route.query.approveNo, //业务流水号
      processInstId: this.$route.query.processInstID,
      approvalOpinionList: [], //审批意见数据
      projectDocList: [], //项目文档数据
      historyFlag: null, //历史版本标识
      isShowApproval: true
    }
  },
  watch: {
    projectName: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        document.title = val + '里程碑完成申请'
      }
    }
  },
  created () {
    this.projectCode = this.$route.query.projectCode || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.getPageUrl()
  },
  methods: {
    // 日期格式化
    formatDate1 (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 判断入口参数--首页入口还是自立项入口
    getPageUrl () {
      if (this.$route.query.processInstID) { //首页入口
        this.getProcessInstDetailById()
      } else { //自立项入口
        // this.getBusinessProcessInst()
        this.getMilestoneDetail()
      }
    },
    // 审批-获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(Number(this.$route.query.processInstID))
        .then(res => {
          this.approveNo = res.businessSerialNumber
          this.getMilesTemInfo()
        })
        .catch(e => {
          this.loading = false
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
    // 根据业务流水号查询业务流程实例信息
    getBusinessProcessInst () {
      this.getMilestoneDetail()
      flowAPI.getBusinessProcessInst(this.$route.query.approveNo)
        .then(res => {
          this.processInstId = res.processInstId
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
    },
    // 根据业务流水号获取里程碑详情
    getMilesTemInfo () {
      API.getMilesDetailByApprove(this.approveNo)
        .then(res => {
          this.projectName = res.projectName
          this.historyFlag = res.historyFlag
          if (res.resultList && res.resultList.length > 0) {
            res.resultList = res.resultList.reverse()
          }
          this.milestoneFinishForm = res
          this.createdBy = res.milestoneLeaderUid ? res.milestoneLeaderUid : ''
          this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          if (res.approveRecord === null || res.approveRecord.total === 0) {
            this.isShowApproval = false
          }
          // console.log(this.isShowApproval)
          // this.isShowTrace = res.approveRecord === null
          // res.files.forEach(item => {
          //   item.uploadBy = item.createUser
          //   item.uploadDate = this.formatDate1(item.createTime)
          // })
          // this.projectDocList = res.files
          this.projectDocList = res.files
          this.docVisible = true
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '里程碑完成流程信息获取失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //流程撤回
    rollBackProcessInstance () {
      this.$confirm(' ', '是否撤回流程?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let params = {
            projectCode: this.projectCode || this.$route.query.projectCode,
            approveNo: this.approveNo || this.$route.query.approveNo,
            milestoneCode: this.milestoneFinishForm.milestoneCode
          }
          API.rollBackProcessInstance(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '撤回流程成功。'
              })
              setTimeout(() => { this.closeProcessInfo ? this.closeProcessInfo() : this.closeFlowApprove() }, 500)
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '撤销流程失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销流程'
          })
        })
    },
    // 根据里程碑完成申请表id获取流程信息
    getMilestoneDetail () {
      let params = {
        milestoneFinishApplicationId: this.$route.query.milestoneFinishApplicationId
      }
      API.getMilestoneDetail(params)
        .then(res => {
          this.historyFlag = res.historyFlag
          if (res.resultList && res.resultList.length > 0) {
            res.resultList = res.resultList.reverse()
          }
          this.milestoneFinishForm = res
          this.createdBy = res.milestoneLeaderUid ? res.milestoneLeaderUid : ''
          this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          if (res.approveRecord === null || res.approveRecord.total === 0) {
            this.isShowApproval = false
          }
          // this.isShowTrace = res.approveRecord === null
          // res.files.forEach(item => {
          //   item.uploadBy = item.createUser
          //   item.uploadDate = this.formatDate1(item.createTime)
          // })
          // this.projectDocList = res.files
          this.projectDocList = res.files
          this.docVisible = true
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '里程碑完成流程信息获取失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    scrollWindow () {
      if (!this.clearFlag) {
        return
      }
      let doc = document.documentElement || document.body
      let sTop = doc.scrollTop
      let cHei = doc.clientHeight
      let sHei = doc.scrollHeight
      if (sTop > 200) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
    },
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    // 流程跟踪
    processTrace () {
      // 判断是否是历史版本
      if (this.historyFlag === 1) {
        let params = {
          businessSerialNumber: this.approveNo,
          milestoneCode: this.milestoneFinishForm.milestoneCode
        }
        API.flowFile(params)
          .then(res => {
            if (res && res[0].fileCode) {
              this.$router.push({
                path: '/processTrace',
                query: {
                  historyFlag: this.historyFlag,
                  fileCode: res[0].fileCode
                }
              })
            } else {
              this.$message({
                message: '此里程碑暂无历史附件！',
                type: 'error',
                showClose: true
              })
            }
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '里程碑历史附件获取失败！',
                type: 'error',
                showClose: true
              })
            }
          })
      } else if (this.historyFlag === 0 && this.$route.query.approveNo) {
        flowAPI.getBusinessProcessInst(this.approveNo)
          .then(res => {
            this.processInstId = res.processInstId
            this.$router.push({
              path: '/processTrace',
              query: {
                businessSerialNumber: this.approveNo,
                processInstId: res.processInstId,
                userId: this.userId,
                historyFlag: this.historyFlag
              }
            })
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
        this.$router.push({
          path: '/processTrace',
          query: {
            businessSerialNumber: this.approveNo,
            processInstId: this.processInstId,
            userId: this.userId,
            historyFlag: this.historyFlag
          }
        })
      }
    },
    // 关闭流程信息页面
    closeProcessInfo () {
      if (this.$route.query.processInstID) { //首页入口
        window.close()
      } else { //自立项入口
        this.$router.push({
          path: this.backUrl,
          query: {
            activeTab: 'projectProgress',
            flowPoint: '里程碑流程'
          }
        })
      }
    },
    // 作废流程编辑
    cancellation () {
      this.$confirm(' ', '是否确认作废?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          // API.deleteProjectApprove(this.flowId)
          //   .then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '作废成功。'
          })
          this.$router.push({
            path: this.backUrl,
            query: {
              activeTab: 'projectProgress',
              flowPoint: '里程碑流程'
            }
          })
          // })
          // .catch(e => {
          //   this.loading = false
          //   if (e.selfError) return
          //   if (e.message) {
          //     this.$message({
          //       message: e.message || '作废失败，请稍后重试！',
          //       type: 'error',
          //       showClose: true
          //     })
          //   }
          // })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.launch-edit{
   /deep/ .el-form-item__content:hover{
  .el-form-item__error{
    display: inline-block;
  }
}
/deep/ .el-form-item__error{
  display: none;
  background: #fff;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: -32px;
  border: 1px solid #f56c6c;
  right: 1px;
  z-index: 999999999;
  padding: 4px !important;
  left: auto;
  white-space: nowrap;
}

/deep/ .el-form-item__error:before{
content: ”;
position: absolute;
top: 18px;
left: 12px;
width: 4px;
height: 4px;
border: 1px solid #f56c6c;
background: #fff;
border-top-color: transparent;
border-left-color: transparent;
content: " ";
transform: rotate(
45deg
);
}
  /deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
  overflow: auto;
  background : #f6f6f6;
  min-height: 100vh;
  .back-top{
    position: fixed;
    bottom: 20px;
    right : 10px;
    cursor: pointer;
    img{
      width: 50px;
      height: 50px;
    }
  }
  .top-head{
    height: 50px;
    background : #fff;
    i{
      margin-right: 10px;
      cursor: pointer;
      &:before {
        margin-right: 5px;
      }
    }
    .head-con{
      height: 50px;
      line-height: 50px;
      width: 1180px;
      margin: 0 auto;

      .logo-img{
        float: right;
        margin-top: 15px;
      }
      .approve-icon{
        font-size: 14px;
        &:before{
          vertical-align: -2px;
        }
      }
    }
  }

  .main-container{
    width: 1180px;
    margin: 0 auto;
    .project-title{

      font-size: 26px;
      font-weight: 600;
      color: #333333;
      text-align: center;
      line-height: 26px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .top-opt-con{
      display: flex;
      align-items: center;
      background: #f6f6f6;
      height: 70px;

      .btn-opt{

        font-size: 14px;
        color: #333;
        text-align: center;
        line-height: 18px;
        margin-right: 20px;
        font-weight: bold;
        cursor: pointer;

        i{
          margin-right: 5px;
        }
      }

    }

    }
    .main-content{
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      .approval-form{
        // background:#fff;
        // height: 70px;
        // line-height: 70px;
        margin-top: 30px;
         .el-form-item .el-input__inner{
          width : 100%;
        }
        .project-panel {
          margin-bottom: 20px;
          .panel-body{
            &.is-expand{
              padding: 20px 30px;
            }
          margin-bottom: 0px;
          }
        }
      }
    }
  }
</style>
