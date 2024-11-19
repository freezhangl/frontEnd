<template>
  <div class="miles-edit2">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn" v-if="isEditable">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveMilesInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" @click="submitMilesInfo"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="this.$route.query.operate==='02'" @click="cancellation"><span class="global-family">作废</span></i>
        </span>
        <span class="group-btn" v-else><i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i></span>
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
            style="border:1px solid #E9E9E9"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              label-position='right'
              ref="ruleForm"
              label-width="140px">
              <el-row>
                <el-col :span="15">
                  <el-form-item label="里程碑名称:" prop="milestoneName">
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
                  <el-form-item label="关联项目名称:" prop="projectName">
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
                  >
                    <el-input
                      style="width: 100%"
                      :rows="2"
                      show-word-limit
                      maxlength="300"
                      type="textarea"
                      placeholder="请输入"
                      v-model="ruleForm.essentialAffair">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="成果完成情况:"
                    prop="resultFinishStatus"
                  >
                    <el-input
                      style="width: 100%"
                      :rows="2"
                      show-word-limit
                      maxlength="300"
                      type="textarea"
                      placeholder="请输入"
                      v-model.trim="ruleForm.resultFinishStatus">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="备注:"
                    prop="remark"
                  >
                    <el-input
                      style="width: 100%"
                      :rows="2"
                      show-word-limit
                      maxlength="300"
                      type="textarea"
                      placeholder="请输入"
                      v-model.trim="ruleForm.remark">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </project-panel>
          <!-- <project-document-upload
            id="project-doc"
            ref="projectdoc"
            :doc-params="docParams"
            @existAttachmentIds="getDelIds"></project-document-upload> -->
          <project-document-upload
            id="project-doc"
            v-if="docVisible"
            :file-list="attachmentFileList"
            :doc-params="docParams"
            @existAttachmentIds="getAttachmentInfo"></project-document-upload>
          <approval-opinion v-if="approvalOpinionList.length && isShowApproval" :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
      </div>
    </div>

    <!-- 提交下一处理组件弹窗 -->
    <nextHandle
      :show="nextHandleVis"
      :business-serial-number="approveNo"
      :process-template-code="processTemplateCode"
      @confirmNextHandle="confirmNextHandle"
      @changeNextHandle="setNextHandleDia"></nextHandle>
  </div>
</template>
<script>
import merge from 'webpack-merge'
import API from './API_milestoneManagement'
import flowAPI from '@/serve/API_flow'
import projectPanel from '@/controller/components/projectPanel'
// import projectDocumentUpload from './components/projectDocumentUpload'
import projectDocumentUpload from './components/index'
export default {
  components: {
    projectPanel,
    projectDocumentUpload
  },
  data () {
    return {
      docVisible: false,
      docParams: {
        type: 'BT-MILESTONE-FINISH', // 单据类型,BT-APPROVE-项目立项，BT-CHANGE-项目变更，BT-STOP-项目终止，BT-FINISH-项目结项，BT-MILESTONE-FINISH-里程碑，BT-PACKAGE-TASK-研发包任务申请
        approveNo: this.$route.query.id // 业务流水号
      },
      ruleForm: {
        // essentialAffair: '',
        resultFinishStatus: '',
        remark: ''
      },
      projectName: '', // 项目名称
      rules: {
        // essentialAffair: [{ required: true, message: '请输入支撑公司或部门关键事件', trigger: ['change', 'blur'] }],
        resultFinishStatus: [{ required: true, message: '请输入成果完成情况', trigger: ['change', 'blur'] }]
      },
      isEditable: true, //用户是否具有编辑权限
      showBackTop: false, //滚动图片是否显示
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      clearFlag: true, //true 触发滚动
      // approveId: '',
      projectCode: '',
      attachmentTypeCode: '', //当前上传附件类型
      attachmentIds: [], //项目文档编辑后的文档ids
      attachmentFileList: [],
      milestoneFinishForm: {}, //保存刚进页面获取到的信息
      approvalOpinionList: [], // 审批意见
      nextHandleVis: false, //提交下一处理人组件默认不展示
      approveNo: null, // 业务流水号
      processTemplateCode: null, //流程模板编码
      processInstId: null, // 流程实例ID
      submitNextHandleInfo: {}, //提交下一审批表单数据
      attachments: [], //项目文档要传送的数据 fileName 和fileCode
      milestoneFinishApplicationId: '', //任务申请 ID
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
    this.projectCode = this.projectCode ? this.projectCode : this.$route.query.projectCode || ''
    this.approveNo = this.approveNo ? this.approveNo : this.$route.query.businessSerialNumber || ''
    this.milestoneFinishApplicationId = this.milestoneFinishApplicationId ? this.milestoneFinishApplicationId : this.$route.query.milestoneFinishApplicationId || ''
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  mounted () {
    this.$router.afterEach((to, from, next) => {
      window.scrollTo(0, 0)
    })
    if (this.$route.query.operate === '01') { //发起流程进入
      this.getMilestoneCodeGet()
    }
    if (this.$route.query.operate === '02') { //编辑流程进入
      this.getUnionSearch()
      this.getTemplateCode()
    }
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
      // .format('YYYY-MM-DD HH:mm:ss')
    },
    // 日期格式化
    formatDate1 (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 发起流程进入获取流程信息
    getMilestoneCodeGet () {
      let params = {
        milestoneCode: this.$route.query.milestoneCode
      }
      API.getMilestoneCodeGet(params)
        .then(res => {
          this.projectName = res.milestoneInfoBase.projectName
          res.milestoneInfoBase.resultList = res.resultList ? res.resultList.reverse() : []
          this.milestoneFinishForm = res.milestoneInfoBase
          this.attachmentFileList = res.files
          this.docVisible = true
          // let list = []
          // res.files.forEach(item => {
          //   item.uploadBy = item.createUser
          //   item.uploadDate = this.formatDate1(item.createTime)
          //   list.push({ fileCode: item.fileCode, fileName: item.fileName })
          // })
          // this.attachments = list
          // this.$refs.projectdoc.savefiles(res.files)
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
    // 编辑进入获取流程信息
    getUnionSearch () {
      let params = {
        milestoneFinishApplicationId: this.$route.query.milestoneFinishApplicationId
      }
      API.getUnionSearch(params)
        .then(res => {
          this.projectName = res.projectName
          this.milestoneFinishForm.milestoneName = res.milestoneName
          this.milestoneFinishForm.planFinishTime = res.planFinishTime
          this.milestoneFinishForm.projectName = res.projectName
          this.milestoneFinishForm.projectCode = res.projectCode
          this.milestoneFinishForm.linkResultFlag = res.linkResultFlag
          this.milestoneFinishForm.resultInformation = res.resultInformation
          this.milestoneFinishForm.resultList = res.resultList
          // this.ruleForm.essentialAffair = res.essentialAffair
          this.ruleForm.resultFinishStatus = res.resultFinishStatus
          this.ruleForm.remark = res.remark
          this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          if (res.approveRecord === null || res.approveRecord.total === 0) {
            this.isShowApproval = false
          }
          this.attachmentFileList = res.files
          this.docVisible = true
          // let list = []
          // res.files.forEach(item => {
          //   item.uploadBy = item.createUser
          //   item.uploadDate = this.formatDate1(item.createTime)
          //   list.push({ fileCode: item.fileCode, fileName: item.fileName })
          // })
          // this.attachments = list
          // this.$refs.projectdoc.savefiles(res.files)
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
    isEmpty (obj) {
      for (let i in Object.keys(obj)) {
        return false // 进入循环即不为空
      }
      return true
    },
    // 获取附件上传的附件ids
    getAttachmentInfo (ids, fileList) {
      this.attachmentIds = ids
      this.attachments = fileList
    },
    // // 获取保存接口的参数：附件的ids，附件、流程id
    // getDelIds (ids, attachs, approveId) {
    //   // this.attachmentIds = ids
    //   // this.attachments = attachs
    //   let list = []
    //   attachs.forEach((item, index) => {
    //     if (index !== attachs.length - 1) {
    //       list.push({ fileCode: item.fileCode, fileName: item.fileName, creatorName: item.creatorName, createTime: item.createTime })
    //     }
    //   })
    //   // this.approveId = approveId
    //   this.attachments = list
    // },
    // 校验附件上传的文档必填项是否上传
    verifyDocument () {
      let needUplodTypes = []
      let haveFileTypes = [] // 保存必填项中有文件的类型
      let fileList = this.attachments.filter(item => {
        return item.requiredFlag === '1'
      }) // 过滤必填项
      fileList.forEach(item => {
        if (item.fileName) {
          haveFileTypes.push(item.attachmentTypeName)
        }
      }) // 将有文件的必填项push进haveFileTypes
      fileList.forEach(item => {
        if (!haveFileTypes.some(i => i === item.attachmentTypeName)) {
          needUplodTypes.push(item.attachmentTypeName)
        }
      }) // 判断哪一项中没有文件
      if (needUplodTypes.length === 0) {
        return true
      } else {
        this.$message({
          type: 'error',
          message: '请上传' + needUplodTypes.toString() + '附件!'
        })
        return false
      }
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
    // 提交下一处理
    submitMilesInfo () {
      this.saveMilesInfo(true)
    },
    // 获取流程模板编码
    getTemplateCode () {
      flowAPI.getBusinessProcessInst(this.approveNo)
        .then(res => {
          this.processTemplateCode = res.processTemplateCode
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
    // 保存
    saveMilesInfo (confirm = false) {
      // let urlString = 'projectCode=' + this.projectCode + '&milestoneFinishApplicationId=' + this.$route.query.milestoneFinishApplicationId
      // let params = {
      //   businessFormUrl: '/milestone/milestoneProcessEdit?operate=02&' + urlString
      //   projectCode: this.projectCode,
      //   milestoneCode: this.projectCode,
      //   resultFinishStatus: this.projectCode,
      //   essentialAffair: this.projectCode,
      //   remark: this.projectCode，
      //   file:[]
      // }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.verifyDocument()) { return }
          // 判断为新增页面保存还是编辑保存 ,新增第一次进来
          let attachmentFileList = []
          this.attachmentFileList.forEach(item => {
            if (item.fileCode) {
              attachmentFileList.push({ createTime: item.createTime, attachmentTypeCode: item.attachmentTypeCode, attachmentTypeName: item.attachmentTypeName, businessType: item.businessType, creatorName: item.creatorName || item.uploadBy, fileCode: item.fileCode, fileName: item.fileName, fileType: item.fileType })
            }
          })
          if (this.$route.query.operate === '01') {
            let params = {
              milestoneName: this.milestoneFinishForm.milestoneName,
              projectCode: this.projectCode,
              projectName: this.milestoneFinishForm.projectName,
              milestoneCode: this.$route.query.milestoneCode,
              resultFinishStatus: this.ruleForm.resultFinishStatus,
              // essentialAffair: this.ruleForm.essentialAffair,
              remark: this.ruleForm.remark,
              files: attachmentFileList
            }
            API.tempSaveMilestone(params)
              .then(res => {
                this.milestoneFinishApplicationId = res.milestoneFinishApplicationId
                this.approveNo = res.businessSerialNumber
                this.getTemplateCode()
                this.processTemplateCode = res.processTemplateCode
                this.$router.push({
                  query: merge(this.$route.query, { 'operate': '02', milestoneFinishApplicationId: res.milestoneFinishApplicationId, businessSerialNumber: res.businessSerialNumber })
                })
                if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                  this.nextHandleVis = true
                } else {
                  // 提示保存成功是否提交申请
                  this.$confirm(' ', '里程碑申请保存成功，是否提交申请?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    showClose: false,
                    customClass: 'self-message-box-delete',
                    cancelButtonClass: 'self-message-box-delete-cancel',
                    confirmButtonClass: 'self-message-box-delete-confirm'
                  })
                    .then(() => {
                      this.submitMilesInfo()
                    })
                    .catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消提交申请'
                      })
                    })
                  // 保存清空校验
                  this.$refs['ruleForm'].clearValidate()
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
          } else { //编辑进入点击保存
            // let urlString = 'projectCode=' + this.projectCode + '&milestoneFinishApplicationId=' + this.$route.query.milestoneFinishApplicationId
            if (!this.verifyDocument()) { return }
            let attachmentFileList = []
            this.attachmentFileList.forEach(item => {
              if (item.fileCode) {
                attachmentFileList.push({ createTime: item.createTime, attachmentTypeCode: item.attachmentTypeCode, attachmentTypeName: item.attachmentTypeName, businessType: item.businessType, creatorName: item.creatorName || item.uploadBy, fileCode: item.fileCode, fileName: item.fileName, fileType: item.fileType })
              }
            })
            let params = {
              // businessFormUrl: '/milestone/milestoneProcessEdit?operate=02&' + urlString,
              id: this.milestoneFinishApplicationId,
              projectCode: this.projectCode,
              projectName: this.milestoneFinishForm.projectName,
              milestoneCode: this.$route.query.milestoneCode,
              resultFinishStatus: this.ruleForm.resultFinishStatus,
              // essentialAffair: this.ruleForm.essentialAffair,
              remark: this.ruleForm.remark,
              files: attachmentFileList,
              businessSerialNumber: this.approveNo,
              processInstId: this.processInstId
            }
            API.tempUpdateMilestone(params)
              .then(res => {
                this.getTemplateCode()
                // this.approveNo = res.businessSerialNumber
                this.processTemplateCode = res.processTemplateCode
                if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                  this.nextHandleVis = true
                } else {
                  // 提示保存成功是否提交申请
                  this.$confirm(' ', '里程碑申请保存成功，是否提交申请?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    showClose: false,
                    customClass: 'self-message-box-delete',
                    cancelButtonClass: 'self-message-box-delete-cancel',
                    confirmButtonClass: 'self-message-box-delete-confirm'
                  })
                    .then(() => {
                      this.submitMilesInfo()
                    })
                    .catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消提交申请'
                      })
                    })
                  // 保存清空校验
                  this.$refs['ruleForm'].clearValidate()
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
          }
        } else {
          return false
        }
      })
    },
    // 确认提交下一处理
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      let params = {
        milestoneFinishApplicationId: this.$route.query.milestoneFinishApplicationId,
        id: this.$route.query.milestoneFinishApplicationId,
        milestoneCode: this.$route.query.milestoneCode,
        projectCode: this.projectCode,
        businessSerialNumber: this.approveNo,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participants: this.submitNextHandleInfo.participants
      }
      API.updateMilestone(params)
        .then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '里程碑申请创建成功。'
          })
          this.closeProcessInfo()
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
    // 关闭提交下一处理弹窗
    setNextHandleDia (val) {
      this.nextHandleVis = val
    },
    // 关闭流程信息页面
    closeProcessInfo () {
      this.$router.push({
        path: this.backUrl,
        query: {
          activeTab: 'projectProgress',
          flowPoint: '里程碑流程'
        }
      })
    },
    // 作废流程编辑
    cancellation () {
      this.$confirm(' ', '是否要作废?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          API.withdrawMilestoneProgress({ businessSerialNumber: this.approveNo })
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功!'
              })
              this.$router.push({
                path: this.backUrl,
                query: {
                  activeTab: 'projectProgress',
                  flowPoint: '里程碑流程'
                }
              })
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '作废失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
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
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-con{
    width: 1000px !important;
  }
  /deep/ .main-container{
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px){
  /deep/ .head-con{
    width: 960px !important;
  }
  /deep/ .main-container{
    width: 960px !important;
  }
}
.miles-edit2{
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

  .el-input__count {
    background: none !important;
    right: 24px !important;
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
