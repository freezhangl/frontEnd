<template>
  <div class="launch-edit">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveLaunchInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="submitBtnVisible" @click="submitLauchInfo"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-cancellation"  v-if="cancelBtnVisible" @click="cancellation"><span class="global-family">作废</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">批量预立项申请</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <prelaunch-info ref="change-reason" :receive-data="changeReason"></prelaunch-info>
        <project-import-list
          id="project-list"
          :project-params="projectParams"
          :pre-project-list="projectApprovePreApprovalImportList">
        </project-import-list>
        <project-document-upload
          v-if="docVisible"
          id="project-doc"
          :doc-params="docParams"
          :file-list="attachmentFileList"
          @existAttachmentIds="getAttachmentInfo">
        </project-document-upload>
        <div id="approved-con">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
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
import { Message } from 'element-ui'
import merge from 'webpack-merge'
import API from '@/serve/API_businessFlow'
import flowAPI from '@/serve/API_flow'
import singleAPI from '@/serve/API_single'
import projectDocumentUpload from '@/controller/groupPlan/components/attachments/index'
import prelaunchInfo from './preLunchFlowInfo/index'
import projectImportList from './preProjectList'
import param from '@/const/param'
import { getStore } from '@/store'
import preAPI from '@/serve/API_projectImport'
export default {
  beforeRouteEnter (to, from, next) {
    if (!to.query.processDefName) {
      flowAPI.getWorkItemDetail(parseInt(to.query.workItemID))
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            // next()
            next({
              path: to.fullPath,
              query: {
                processDefName: res.processDefName
              }
            })
          } else {
            let urlString = 'processInstID=' + to.query.processInstID
            next('/groupPreLaunchFlow/groupPreProjectDetail?' + urlString)
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
    } else {
      next()
    }
  },
  data () {
    return {
      changeReason: '', //预立项说明（编辑页面）
      docVisible: false,
      approveNo: '',
      processTemplateCode: null,
      projectApprovePreApprovalImportList: [],
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      approveId: '',
      projectCode: '', //项目编码，通过详情-基本信息拿到
      docParams: { //获取项目文档参数
        businessType: 'BT-PRE-APPROVE-IMPORT',
        projectCode: this.$route.query.projectCode
      },
      projectParams: {
        nonce: '',
        sign: '',
        timeStamp: '',
        fileCode: ''
      },
      attachmentFileList: [], // 单据附件列表
      attachmentIds: [], //项目文档编辑后的文档ids
      attachments: [], //项目文档编辑后的文档
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      navMenus: [
        {
          name: '项目列表信息',
          id: 'project-list'
        },
        {
          name: '项目文档',
          id: 'project-doc'
        },
        {
          name: '审批意见',
          id: 'approved-con'
        }
      ],
      processParams: {
        workItemId: parseInt(this.$route.query.workItemID), //工作项ID
        businessSerialNumber: '', //业务流水号
        processInstId: parseInt(this.$route.query.processInstID), //流程实例ID
        activityInstId: parseInt(this.$route.query.activityInstID),
        processTemplateCode: this.$route.query.processDefName, //流程模板编码
        activityDefId: this.$route.query.activityDefID, //活动节点定义ID
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
        flushPortalUrl: this.$route.query.flushPortalUrl // OA跳转回刷
      },
      buttonList: [],
      submitBtnVisible: true, //
      cancelBtnVisible: true, //
      nextHandleVis: false, //提交下一处理组件
      processTraceVis: false, //流程跟踪组件
      submitNextHandleInfo: null, //提交下一处理表单数据
      typeOptions: null,
      levelList: null
    }
  },
  components: {
    projectImportList,
    projectDocumentUpload,
    prelaunchInfo
  },
  computed: {
  },
  mounted () {
    this.getFlowBtnList()
    this.getProcessInstDetailById()
    this.docParams.businessType = 'BT-PRE-APPROVE-IMPORT'
  },
  methods: {
    //项目类型
    getProjectType () {
      API.dictValByCode('PROJECT-TYPE')
        .then(res => {
          this.typeOptions = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 关闭提交下一处理弹窗
    setNextHandleDia () {
      this.nextHandleVis = false
    },
    //项目级别
    getProjectLevel () {
      API.dictValByCode('PROJECT-LEVEL')
        .then(res => {
          this.levelList = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 获取当前工作项详情--是否显示审批操作按钮
    getWorkItemDetail () {
      flowAPI.getWorkItemDetail(this.processParams.workItemId)
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            this.getFlowBtnList()
          } else {
            this.$router.push({
              path: '/groupPreLaunchFlow/groupPreProjectDetail',
              query: {
                processInstId: this.processParams.processInstId
              }
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取当前工作项详情失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //根据流程实例ID获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(this.processParams.processInstId)
        .then(res => {
          this.processParams.businessSerialNumber = res.businessSerialNumber
          this.docParams.approveNo = this.processParams.businessSerialNumber
          this.queryTemporaryInfo()
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
    // 获取流程指定节点按钮配置
    getFlowBtnList () {
      let params = {
        processTemplateCode: this.processParams.processTemplateCode, //131
        activityDefId: this.processParams.activityDefId//'manualActivity1'
      }
      flowAPI.getButtonList(params)
        .then(res => {
          this.buttonList = res
          /* this.buttonList = []
          res.forEach(item => {
            this.buttonList.push(param.approvalButtonsObj[item.buttonCode])
          }) */
          this.judgeBtnVisible()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取按钮失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 判断按钮是否展示
    judgeBtnVisible () {
      this.submitBtnVisible = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.nextProcessing)
      this.cancelBtnVisible = this.buttonList.some(ele => ele.buttonCode === param.approvalButtons.cancellation)
    },
    // 获取立项流程详细信息
    async queryTemporaryInfo () {
      preAPI.queryProjectPreApproveImportDetails({ approveNo: this.processParams.businessSerialNumber })
        .then(res => {
          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            let extendedAttributes = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.changeReason = extendedAttributes.remarks || ''
            this.projectParams = {
              nonce: res.nonce,
              sign: res.sign,
              timeStamp: res.timeStamp,
              fileCode: extendedAttributes.fileCode,
              fileName: extendedAttributes.fileName
            }
          }
          this.projectApprove = res.projectApproveInfo
          this.projectCode = res.projectApproveInfo.projectCode
          this.attachmentFileList = res.attachmentDtoList || []
          this.docVisible = true
          this.projectApprovePreApprovalImportList = res.projectApprovePreApprovalImportList || []
          this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取批量立项流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
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
    // 获取保存接口的参数：附件的ids，附件
    getAttachmentInfo (ids, attachs) {
      this.attachmentIds = ids
      this.attachments = attachs
    },
    // 校验文档必填项
    verifyDocument () {
      let needUplodTypes = []
      let haveFileTypes = [] // 保存必填项中有文件的类型
      let attachments = this.attachments.filter(item => {
        return item.requiredFlag === '1'
      }) // 过滤必填项
      attachments.forEach(item => {
        if (item.fileName) {
          haveFileTypes.push(item.attachmentTypeName)
        }
      }) // 将有文件的必填项push进haveFileTypes
      attachments.forEach(item => {
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
    // 保存流程批量预立项申请保
    async saveLaunchInfo (confirm = false) {
      if (!this.verifyDocument()) { return }
      let changeReason = await this.$refs['change-reason'].validate()
      if (!changeReason) return
      let urlString = '?addLaunch=false&businessType=BT-PRE-APPROVE-IMPORT&' + '&projectCode=' + this.$route.query.projectCode
      let params = {
        approveNo: this.processParams.businessSerialNumber,
        //processInstName: this.projectName + '批量预立项申请',
        projectCode: this.$route.query.projectCode,
        attachmentIdList: this.attachmentIds,
        businessType: 'BT-PRE-APPROVE-IMPORT',
        extendedAttributes: JSON.stringify({
          remarks: this.$refs['change-reason'].getChangeReason()
        }),
        processInstId: this.processParams.processInstId,
        businessFormUrl: '/groupPreLaunchFlow/groupPreProjectEdit' + urlString
      }
      preAPI.savePreProjectApprove(params)
        .then(res => {
          this.approveNo = res.approveNo
          this.processTemplateCode = res.processTemplateCode || this.processParams.processTemplateCode
          this.$router.push({
            query: merge(this.$route.query, { 'addLaunch': 'false', 'approveNo': this.approveNo })
          })
          if (confirm) { //提交下一处理：保存成功后弹出下一步组件
            this.nextHandleVis = true
          } else {
            // 提示保存成功是否提交申请
            this.$confirm(' ', '批量预立项申请保存成功，是否提交申请?', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
              customClass: 'self-message-box-delete',
              cancelButtonClass: 'self-message-box-delete-cancel',
              confirmButtonClass: 'self-message-box-delete-confirm'
            })
              .then(() => {
                this.submitLauchInfo()
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消提交申请'
                })
              })
            // 保存清空校验
            this.$refs['change-reason'].clearValidate()
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
    // 提交下一处理
    submitLauchInfo () {
      if (this.verifyDocument()) { this.saveLaunchInfo(true) }
    },
    // 作废立项流程退回单据
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
          let params = {
            approveNo: this.processParams.businessSerialNumber
          }
          API.deleteApprove(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功。'
              })
              this.closeProcessInfo()
            })
            .catch(e => {
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
    },
    // 关闭页面
    closeProcessInfo () {
      // 关闭窗口--需要判断是否OA跳转有回刷地址flushPortalUrl
      if (this.processParams.flushPortalUrl) {
        // window.location.href = 'https://www.baidu.com/'
        let paramsString = '?itemId=' + this.$route.query.itemId + '&appId=' + decodeURIComponent(this.$route.query.appID) + '&uniqueId=' + this.$route.query.uniqueId
        window.location.href = decodeURIComponent(this.processParams.flushPortalUrl) + paramsString
      } else {
        if (this.$route.query.isFromRMS === '1' && window.opener) {
          window.opener.refreshBacklogList()
        }
        window.close()
      }
    },
    // 流程跟踪
    processTrace () {
      this.$router.push({
        path: '/processTrace',
        query: {
          businessSerialNumber: this.processParams.businessSerialNumber,
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
      this.submitProjectApprove()
    },
    // 提交审批
    submitProjectApprove () {
      let params = {
        workItemId: this.processParams.workItemId,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participantList: this.submitNextHandleInfo.participants,
        approveNo: this.processParams.businessSerialNumber
      }
      API.resubmitPreApprove(params)
        .then(res => {
          this.$message({
            message: '批量预立项申请创建成功。',
            type: 'success',
            showClose: true
          })
          this.nextHandleVis = false
          this.closeProcessInfo()
          this.$refs['approveTimeForm'].clearValidate()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '提交失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 取消下一处理
    closeNextHandle () {
      this.nextHandleVis = false
    }
  },
  watch: {
  }
}
</script>
<style  lang="scss" scoped>
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
    z-index: 100;
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

    .nav-menu{
      position: fixed;
      left: calc(50% + 630px);
      top : 120px;
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
    &:last-child{
      margin-bottom: 0;
    }
    .approval-form{
      background:#fff;
      height: 70px;
      line-height: 70px;
      margin-top: 30px;
      margin-bottom: 20px;
      padding: 0px 20px;
      /deep/ .el-form-item__content{
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
