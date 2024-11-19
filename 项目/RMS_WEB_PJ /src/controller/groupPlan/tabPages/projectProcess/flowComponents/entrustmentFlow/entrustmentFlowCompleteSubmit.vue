<template>
  <!-- 新增/编辑 -->
  <div class="entrustment-flow-edit">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveCompletion(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" @click="submitDataInfo"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">集团统筹一般支撑包委托函</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>
      <div class="main-content">
        <el-form
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <!-- 完成情况 -->
          <div class="wrapper_fin">
            <el-form-item label="完成情况：" style="display:block;white-space: nowrap;" prop="completion">
              <el-input
                type="textarea"
                style="display:block;
                       box-sizing: border-box;
                       white-space: normal;"
                :maxlength="2000"
                :autosize="{ minRows: 4, maxRows: 10}"
                show-word-limit
                v-model="ruleForm.completion"
                placeholder="请输入"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <!-- 上传文档资料 -->
        <div id="project-doc-upload">
          <project-document-upload
            v-if="docVisible"
            :doc-params="docParams"
            :file-list="entrustLetterAttachmentFileList"
            @existAttachmentIds="getDelIds">
          </project-document-upload>
        </div>
        <!-- 基本信息 -->
        <div id="basic-info">
          <base-info :data="projectBaseInfo" :view-type="'preview'" :show-finish="false"></base-info>
        </div>
        <!-- 预期成果 -->
        <achievement id="task-ach" :receive-data="projectAchievementList"></achievement>
        <!-- 项目预算 -->
        <budget-info :budget-data="entrustLetterInfo" id="project-budget"></budget-info>
        <!-- 审批意见 -->
        <div id="approved-con">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
        <!-- 文档资料 -->
        <div id="project-doc">
          <project-document-detail
            v-if="docVisible"
            :file-list="attachmentFileList"></project-document-detail>
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

    <!-- 填写审批意见 -->
    <process-submit
      :show="isShowSubOpinion"
      :title="processParams.title"
      :work-item-id="processParams.workItemId"
      :business-serial-number="processParams.approveNo"
      :process-template-code="processParams.processTemplateCode"
      :process-inst-id="processParams.processInstId"
      :activity-inst-id="processParams.activityInstId"
      :activity-def-id="processParams.activityDefId"
      @confirmSubmit="getProSubmitInfo"
      @changeShow="setProcessSubmitDia">
    </process-submit>
  </div>
</template>

<script>
import { getStore } from '@/store'
import flowAPI from '@/serve/API_flow'
import projectAPI from '@/serve/API_groupPlanProject'
import baseInfo from './component/baseInfo'
import budgetInfo from './component/budgetInfo'
import achievement from '@/controller/groupPlan/components/subproject/achievement/entrustmentAchievementDetail'
import projectDocumentUpload from '@/controller/groupPlan/components/attachments/index'
import projectDocumentDetail from '@/controller/groupPlan/components/attachments/detail'
import API from '@/serve/API_businessFlow'
import merge from 'webpack-merge'
import { Message } from 'element-ui'
export default {
  components: { baseInfo, achievement, projectDocumentUpload, budgetInfo, projectDocumentDetail },
  beforeRouteEnter (to, from, next) {
    // 根据view=1判断审批/待办url
    let isDetail = to.fullPath.indexOf('view=1')
    if (isDetail === -1 && !to.query.processDefName) {
      flowAPI.getWorkItemDetail(parseInt(to.query.workItemID))
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            next({
              path: to.fullPath,
              query: {
                processDefName: res.processDefName
              }
            })
          } else {
            let urlString = 'processInstID=' + to.query.processInstID
            next('/groupPlan/entrustmentFlow/entrustmentFlowDetail?' + urlString)
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            Message({
              message: e.message || '获取当前工作项详情失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    } else if (to.query.processDefName) {
      next()
    } else {
      // view=1则跳转详情页面url，已办跳转到详情页面
      let urlString = 'processInstID=' + to.query.processInstID
      next('/groupPlan/entrustmentFlow/entrustmentFlowDetail?' + urlString)
    }
  },
  data () {
    return {
      navMenus: [
        { name: '文档资料', id: 'project-doc-upload' },
        { name: '基本信息', id: 'basic-info' },
        { name: '预期成果', id: 'task-ach' },
        { name: '项目预算', id: 'project-budget' },
        { name: '审批意见', id: 'approved-con' },
        { name: '文档资料', id: 'project-doc' }
      ],
      clearFlag: true, //true 触发滚动
      isEditable: false, //用户是否具有编辑权限
      isShowSubOpinion: false,
      nextHandleVis: false, // 提交下一处理人组件默认不展示
      projectCode: '',
      projectApprove: {}, //表单信息
      attachmentFileList: [],
      entrustLetterAttachmentFileList: [],
      completion: '',
      evaluate: '',
      score: '',
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      navIdx: 0,
      showBackTop: false,
      approvalOpinionList: [], // 审批意见
      docParams: { //文档资料相关参数
        businessType: 'BT-DEMAND-ENTRUST-LETTER',
        projectCode: ''
      },
      entrustLetterInfo: {},
      projectAchievementList: [], // 预期成果
      attachmentIds: [], //文档资料编辑后的文档ids
      attachments: [], //文档资料编辑后的文档
      docVisible: false,
      projectBaseInfo: {
      },
      approveNo: this.$route.query.approveNo,
      rules: {
        completion: [
          { required: true, message: '请输入完成情况', trigger: 'blur' }
        ]
      },
      ruleForm: {
        completion: ''
      },
      processParams: { // 所有流程组件需要的参数--工作台拼接过来的
        title: '', //流程实例名称
        workItemId: parseInt(this.$route.query.workItemID),
        businessSerialNumber: null,
        processInstId: parseInt(this.$route.query.processInstID),
        activityInstId: parseInt(this.$route.query.activityInstID),
        processTemplateCode: this.$route.query.processDefName,
        activityDefId: this.$route.query.activityDefID,
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      processTemplateCode: '',
      submitNextHandleInfo: {} //提交下一审批表单数据
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 判断顶部编辑按钮是否展示
    isShowEditBtn () {
      const params = {
        projectCode: this.docParams.projectCode,
        permissionCode: '08' // 权限编码-根据字典表设置
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
    //获取处理意见信息并确定提交
    getProSubmitInfo (info) {
      let processSubmitForm = info
      processSubmitForm.businessType = this.businessType
      processSubmitForm.workItemId = this.processParams.workItemId
      processSubmitForm.approveNo = this.processParams.approveNo
      processSubmitForm.processInstId = this.processParams.processInstId
      processSubmitForm.activityInstId = this.processParams.activityInstId
      processSubmitForm.participantList = info.participants
      API.approve(processSubmitForm)
        .then(res => {
          this.$message({
            message: '提交审批成功。',
            type: 'success',
            showClose: true
          })
          setTimeout(() => {
            this.closeFlowApprove()
          }, 500)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '提交审批意见失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //填写处理意见
    submitOpinion () {
      this.isShowSubOpinion = true
    },
    setProcessSubmitDia (val) {
      this.isShowSubOpinion = val
    },
    //关闭
    closeFlowApprove () {
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.processParams.flushPortalUrl) {
        let paramsString = '?itemId=' + this.$route.query.itemId + '&appId=' + decodeURIComponent(this.$route.query.appID) + '&uniqueId=' + this.$route.query.uniqueId
        window.location.href = decodeURIComponent(this.processParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.close()
      }
    },
    // 根据流程实例ID-processInstId获取业务流水号，从而获取单据详情
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.processParams.processInstId)
        .then(res => {
          this.processParams.title = res.processInstName
          this.approveNo = res.businessSerialNumber
          this.processParams.approveNo = this.approveNo
          this.queryChangeApprove()
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
    // 关闭提交下一处理弹窗
    setNextHandleDia (val) {
      this.nextHandleVis = val
    },
    // 关闭流程信息页面
    closeProcessInfo () {
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.processParams.flushPortalUrl) {
        let paramsString = '?itemId=' + this.$route.query.itemId + '&appId=' + decodeURIComponent(this.$route.query.appID) + '&uniqueId=' + this.$route.query.uniqueId
        window.location.href = decodeURIComponent(this.processParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.opener = null
        window.open('', '_self')
        window.close()
      }
    },
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs) {
      this.attachmentIds = ids
      this.attachments = attachs
    },
    //查询表单详情--编辑
    async queryChangeApprove () {
      let params = {
        approveNo: this.approveNo
      }
      API.queryApprove(params)
        .then(res => {
          this.entrustLetterInfo = res.entrustLetterInfo
          // this.costBudgetList = res.projectInfo.costBudgetList
          this.projectBaseInfo = res.entrustLetterInfo
          this.docParams.projectCode = res.entrustLetterInfo.projectCode
          this.attachmentFileList = res.attachmentFileList
          this.entrustLetterAttachmentFileList = res.entrustLetterAttachmentFileList
          if (res.approveRecord) {
            this.approvalOpinionList = res.approveRecord.approvals
          }
          if (res.entrustLetterInfo) {
            this.projectAchievementList = res.entrustLetterInfo.entrustLetterAchievementList
          }
          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            let json = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.ruleForm.completion = json.completion
            this.projectBaseInfo.completion = json.completion
          }
          this.docVisible = true
          this.isShowEditBtn()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取委托函流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //提交下一处理
    submitChangeFlow () {
      if (this.verifyDocument()) {
        this.saveCompletion(true)
      }
    },
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
          message: '请上传' + needUplodTypes.toString()
            .replace('附件', '') + '附件!'
        })
        return false
      }
    }, //点击右侧导航
    slideNav (menu, idx) {
      if (this.timer) {
        window.clearTimeout(this.timer)
      }

      this.navIdx = idx
      this.clearFlag = false
      document.getElementById(menu.id)
        .scrollIntoView({
          behavior: 'smooth'
        })

      this.timer = setTimeout(() => {
        this.clearFlag = true
      }, 1000)
    },
    scrollWindow () {
      if (!this.clearFlag) {
        return
      }

      let doc = document.documentElement || document.body
      let sTop = doc.scrollTop
      let cHei = doc.clientHeight
      let sHei = doc.scrollHeight

      if (sTop > 500) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }

      if (sTop + cHei + 5 >= sHei) {
        this.navIdx = this.navMenus.length - 1
        return false
      }

      let posArr = []

      this.navMenus.forEach(menu => {
        posArr.push(document.getElementById(menu.id).offsetTop)
      })

      let _idx = 0

      if (posArr[posArr.length - 1] <= sTop) {
        this.navIdx = posArr.length - 1
      } else {
        for (let i = 0; i < posArr.length - 1; i++) {
          if (sTop >= posArr[i] && sTop < posArr[i + 1]) {
            _idx = i
            break
          }
        }
        this.navIdx = _idx
      }
    },
    //回到顶部
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    // 流程跟踪
    processTrace () {
      this.$router.push({
        path: '/processTrace',
        query: {
          businessSerialNumber: this.approveNo,
          processInstId: this.processParams.processInstId,
          userId: this.processParams.userId,
          fileCode: this.projectApprove.historyApproveFileId,
          historyFlag: this.projectApprove.historyFlag
        }
      })
    },
    // 确认提交下一处理
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      let params = {
        approveNo: this.approveNo,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participantList: this.submitNextHandleInfo.participants
      }
      API.submitApprove(params)
        .then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '提交成功。'
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
    // 提交下一处理
    submitDataInfo () {
      if (this.verifyDocument()) { this.saveCompletion(true) }
    },
    //保存完成情况
    saveCompletion (confirm = false) {
      if (!this.verifyDocument()) { return }
      let params = {
        projectCode: this.projectCode,
        letterCode: this.entrustLetterInfo.letterCode
      }
      API.checkRelatedEntrustmentLetter(params) //系统对该委托函是否关联项目以及其关联项目是否已结项进行校验'1'该委托函尚未关联项目,'2'该委托函所关联的项目尚未结项
        .then(res => {
          if (res === '1') {
            setTimeout(() => {
              this.$message({
                message: '该委托函尚未关联项目！',
                type: 'warning',
                showClose: true
              })
            }, 2000)
          }
          if (res === '2') {
            setTimeout(() => {
              this.$message({
                message: '该委托函所关联的项目尚未结项！',
                type: 'warning',
                showClose: true
              })
            }, 2000)
          }
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              let params = {
                attachmentIdList: this.attachmentIds, // 附件id集合
                approveNo: this.approveNo,
                completion: this.ruleForm.completion
              }
              API.saveEntrustLetterCompletion(params)
                .then(res => {
                  this.processTemplateCode = res.processTemplateCode
                  this.$router.push({
                    query: merge(this.$route.query, { 'newLaunch': 'false', 'approveNo': this.approveNo })
                  })
                  if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                    this.submitOpinion()
                  } else {
                    // 提示保存成功是否提交申请
                    this.$confirm(' ', '完成情况保存成功，是否提交下一处理?', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      showClose: false,
                      customClass: 'self-message-box-delete',
                      cancelButtonClass: 'self-message-box-delete-cancel',
                      confirmButtonClass: 'self-message-box-delete-confirm'
                    })
                      .then(() => {
                        this.submitOpinion()
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
                  if (e.selfError) return
                  if (e.message) {
                    this.$message({
                      message: e.message || '保存失败，请稍后重试！',
                      type: 'error',
                      showClose: true
                    })
                  }
                })
            } else {
              return false
            }
          })
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '查询失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  },
  created () {
    this.getProcessInstDetailById()
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
  },
  // 离开页面删除事件
  beforeRouteLeave (to, from, next) {
    window.onscroll = null
    next()
  },
  mounted () {
  },
  beforeCreate () {},
  beforeMount () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {},
  activated () {}
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-con{
    width: 1000px !important;
  }
  /deep/ .main-container{
    width: 1000px !important;
  }
  /deep/ .nav-menu{
    left: calc(50% + 520px) !important;
  }
}

@media screen and (max-width: 1364px){
  /deep/ .head-con{
    width: 960px !important;
  }
  /deep/ .main-container{
    width: 960px !important;
  }
  /deep/ .nav-menu{
    left: calc(50% + 500px) !important;
  }
}
.entrustment-flow-edit{
  /deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
  background : #f6f6f6;
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
      margin-right: 20px;
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
      font-family: inherit;
      font-size: 26px;
      font-weight: 600;
      color: #333333;
      text-align: center;
      line-height: 26px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .nav-menu{
      position: fixed;
      left: calc(50% + 630px);
      top : 100px;
      border-left: 1px solid #e5e5e5;
      padding : 20px 10px;
      z-index: 9;
      .nav-menu-item{
        display: block;
        position: relative;
        margin: 12px 0;
        &:hover{
          @include color();
        }
        &.item-active{
          @include color();
          &::after{
            display: inline-block;
            position: absolute;
            content :'';
            left : -17px;
            top : 3px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            @include border();
            border-width: 4px !important;
            background: #fff;
          }
        }
      }
    }
  }
  .main-content{
    margin-bottom: 20px;
      .wrapper_fin{
        display: inline-block;
        width: 100%;
        border:1px solid #eee;
        padding-top:20px;
        padding-bottom: 20px;
        background:#fff;
        margin-top:20px;
        margin-bottom: 20px;
        padding: 30px;
        box-sizing: border-box;
      /deep/ .el-form-item__content{
        width: 90% !important;
      }
        .wrapper_pin{
          font-weight: bold;
          margin-bottom:10px;
        }
      }
    /* &:last-child{
      margin-bottom: 0;
    } */
  }

  .budget-con{
    min-width: 100%;
    border-collapse: collapse;
    border: 1px solid #E8E8E8;
    // position: relative;
    tr {
      th,td{
        height: 45px;
        padding: 0 20px;
        border-left: none;
        border-right: none;
        // &:last-child{
          // border-collapse:collapse;
        // }
      }
      th,.col-title{
        background: #F4F4F4;
        font-weight: bold;
        text-align: left;
      }
      .col-title{
        border-right: 1px solid #E8E8E8;
        width: 126px;
        min-width: 126px;
        max-width: 126px;
      }
      .year-title {
        width: 220px;
        min-width: 220px;
        max-width: 220px;
      }
      .bg-title {
        font-weight: bold;
        text-align: left;
        .eva-rule{
          /deep/ input{
            width:600px;
          }
        }
      }
      th:nth-child(1){
        border-right: 1px solid #E8E8E8;
      }
      // .data-cell{
      //   text-align: center;
      // }

      th.first{
        position: relative;
        span:nth-child(1){
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-100%, -150%);
        }
        span:nth-child(2){
          position: absolute;
          top: 0%;
          left: 50%;
          transform: translate(0%, 50%);
        }
      }
    }
    .none-border {
      border-right: none !important;
    }
    .sum-color {
      color: #20A0FF;
    }
    // .el-form-item{
    //   margin-bottom: 0;
    //   margin-right: 0;
    //   /deep/ .el-form-item__content{
    //     width: 220px;
    //   }
    // }
  }
}

</style>
