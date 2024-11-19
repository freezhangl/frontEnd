<template>
  <div class="launch-edit">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-edit" @click="editLaunch"><span class="global-family">项目编辑</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveLaunchInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="submitBtnVisible" @click="submitLauchInfo"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="cancelBtnVisible" @click="cancellation"><span class="global-family">作废</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">本单位自立研发项目预立项申请</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <div class="instructions">
          <el-form
            :model="instructionsForm"
            label-position='right'
            :rules="rules"
            ref="instructionsForm"
            label-width="150px">
            <el-row>
              <el-col :span="24">
                <el-form-item
                  :inline="false"
                  label-width="140px"
                  label="预立项说明:"
                  prop="instructions"
                >
                  <el-input
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入理由"
                    v-model.trim="instructionsForm.instructions"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <project-document-upload
          id="project-doc"
          :doc-params="docParams"
          @existAttachmentIds="getDelIds"
          v-if="processParams.businessSerialNumber"></project-document-upload>
        <div id="basic-info">
          <basicInfo :receive-data="projectBaseInfo" info-type="simple"></basicInfo>
        </div>
        <div id="property-info">
          <attributeInfoApprove
            :receive-data="projectBaseInfo"
            :project-attribute="projectAttribute"></attributeInfoApprove>
        </div>
        <div id="product-info" v-if="hasProductInfo">
          <product-info-detail
            ref="productInfo"
            :receive-data="productInfoList"></product-info-detail>
        </div>

        <div id="resource-info" v-if="hasResourceInfo">
          <res-info-detail
            ref="resourceInfo"
            :receive-data="resourceInfo"></res-info-detail>
        </div>
        <div id="team-info">
          <teamInfo :receive-data="projectTeamList"></teamInfo>
        </div>
        <div id="project-budget">
          <projectBudget :receive-data="costBudgetList"></projectBudget>
        </div>
        <div id="task-ach">
          <subproject :receive-data="subProjectInfoList"></subproject>
        </div>
        <div id="milestone" v-if="isShowMilestone">
          <detailTableMilestone :receive-data="projectMileStones" @detailTableMilestoneShowOrHide="setMilestoneVisible"></detailTableMilestone>
        </div>
        <div id="approved-con">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>
      </div>
    </div>

    <!-- 提交下一处理组件 -->
    <next-handle
      :show="nextHandleVis"
      :business-serial-number="processParams.businessSerialNumber"
      :process-template-code="processParams.processTemplateCode"
      @confirmNextHandle="confirmNextHandle"
      @changeNextHandle="closeNextHandle">
    </next-handle>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import projectDocumentUpload from '../../../projectDocumentUpload'
import detailTableMilestone from '../../../../extraProject/components/basic/milestone/detailTableMilestone'
import basicInfo from '../../../../extraProject/components/basic/detail'
import teamInfo from '../../../../extraProject/components/teamInfo/detail'
import projectBudget from '../../../../extraProject/components/budget/detail'
import subproject from '../../../../extraProject/components/subproject/detail'
import attributeInfoApprove from '../../../../extraProject/components/attributeInfo/detail'
import ProductInfoDetail from '../../../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../../../extraProject/components/resource/resInfoDetail.vue'
import param from '@/const/param'
import { getStore } from '@/store'
export default {
  beforeRouteEnter (to, from, next) {
    if (!to.query.processDefName) {
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
            next('/beforeLaunchFlow/beforeLaunchFlowDetail?' + urlString)
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
      docParams: { //获取项目文档参数
        type: 'BT-PRE-APPROVE',
        projectCode: this.projectCode,
        approveNo: this.$route.query.businessSerialNumber
      },
      instructionsForm: {
        instructions: null
      },
      rules: {
        instructions: [{ required: true, message: '请输入理由', trigger: ['change', 'blur'] }]
      },
      versionNo: '', // 项目版本号
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 预期成果
      projectMileStones: [], // 里程碑信息
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      approveId: '',
      projectCode: '', //项目编码，通过详情-基本信息拿到
      attachmentTypeCode: '', //当前上传附件类型
      attachmentIds: [], //项目文档编辑后的文档ids
      attachments: [], //项目文档编辑后的文档
      clearFlag: true, //true 触发滚动
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true, //资源信息中有产品信息
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      navMenus: [
        {
          name: '项目文档',
          id: 'project-doc'
        },
        {
          name: '基本信息',
          id: 'basic-info'
        },
        {
          name: '属性信息',
          id: 'property-info'
        },
        {
          name: '产品信息',
          id: 'product-info'
        },
        {
          name: '资源信息',
          id: 'resource-info'
        },
        {
          name: '团队信息',
          id: 'team-info'
        },
        {
          name: '项目预算',
          id: 'project-budget'
        },
        {
          name: '子项目',
          id: 'task-ach'
        },
        {
          name: '里程碑',
          id: 'milestone'
        },
        {
          name: '审批意见',
          id: 'approved-con'
        }
      ],
      isShowMilestone: true,
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
      submitBtnVisible: true, //TODO
      cancelBtnVisible: true, //TODO
      nextHandleVis: false, //提交下一处理组件
      processTraceVis: false, //流程跟踪组件
      submitNextHandleInfo: null, //提交下一处理表单数据
      typeOptions: null,
      levelList: null
    }
  },
  components: {
    projectDocumentUpload,
    detailTableMilestone,
    basicInfo,
    teamInfo,
    projectBudget,
    subproject,
    attributeInfoApprove,
    ResInfoDetail,
    ProductInfoDetail
  },
  computed: {
  },
  mounted () {
    this.getFlowBtnList()
    this.getProcessInstDetailById()
  },
  methods: {
    // 获取当前工作项详情--是否显示审批操作按钮
    getWorkItemDetail () {
      flowAPI.getWorkItemDetail(this.processParams.workItemId)
        .then(res => {
          if (res.currentState === 4 || res.currentState === 10) {
            this.getFlowBtnList()
          } else {
            this.$router.push({
              path: '/beforeLaunchFlow/beforeLaunchFlowDetail',
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
        processTemplateCode: this.processParams.processTemplateCode,
        activityDefId: this.processParams.activityDefId
      }
      flowAPI.getButtonList(params)
        .then(res => {
          this.buttonList = res
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
    // 获取预立项流程详细信息
    async queryTemporaryInfo () {
      API.getProjectBeforInfo({ approveNo: this.processParams.businessSerialNumber })
        .then(res => {
          this.versionNo = res.projectApprove.versionNo
          this.projectApprove = res.projectApprove
          if (res.projectApprove) {
            this.instructionsForm.instructions = res.projectApprove.remarks
          }
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          this.costBudgetList = res.costBudgetList
          this.projectTeamList = res.projectTeamList
          this.subProjectInfoList = res.subProjectInfoList || []
          this.subProjectInfoList.forEach(item => {
            item.versionNo = res.projectApprove.versionNo
            item.isUpdate = false
          })
          this.projectMileStones = res.projectMileStones
          this.isShowMilestone = this.projectMileStones && this.projectMileStones.length > 0
          if (!this.isShowMilestone) {
            this.deleteNavItem('milestone')
          }
          this.projectCode = res.projectBaseInfo.projectCode
          this.docParams.projectCode = this.projectCode //同步附件projectCode
          this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
          //产品信息
          this.productInfoList = res.projectProductInfoList || []
          this.hasProductInfo = this.productInfoList && this.productInfoList.length > 0
          if (!this.hasProductInfo) {
            this.deleteNavItem('product-info')
          }
          //资源信息
          this.resourceInfo = res.projectResourceInfoDto || {}
          this.hasResourceInfo = !!((this.resourceInfo && JSON.stringify(this.resourceInfo) !== '{}'))
          if (!this.hasResourceInfo) {
            this.deleteNavItem('resource-info')
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取预立项流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //删除菜单项
    deleteNavItem (id) {
      let index = -1
      this.navMenus.some((ele, i) => {
        if (ele.id === id) {
          index = i
          return true
        }
      })
      if (index > -1) {
        this.navMenus.splice(index, 1)
      }
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
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs, approveId) {
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
    // 保存流程预立项编辑信息
    saveLaunchInfo (confirm = false) {
      // if (!this.verifyDocument()) { return }
      let urlString = 'approveNo=' + this.docParams.approveNo + '&projectCode=' + this.projectCode
      let params = {
        approveNo: this.processParams.businessSerialNumber,
        projectCode: this.projectCode,
        attachmentIds: this.attachmentIds,
        remarks: this.instructionsForm.instructions,
        businessFormUrl: '/beforeLaunchFlow/beforeLaunchFlowEdit?addBeforeLaunch=false&type=BT-PRE-APPROVE&' + urlString,
        processInstId: this.processParams.processInstId
      }
      this.$refs['instructionsForm'].validate(valid => {
        if (valid) {
          API.saveProjectBeforApprove(params)
            .then(res => {
              this.processParams.businessSerialNumber = res.approveNo
              if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                this.nextHandleVis = true
              } else {
                // 提示保存成功是否提交申请
                this.$confirm(' ', '预立项申请保存成功，是否提交申请?', {
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
              }
              // 保存清空校验
              this.$refs['instructionsForm'].clearValidate()
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
      })
    },
    // 提交下一处理
    submitLauchInfo () {
      if (this.verifyDocument()) { this.saveLaunchInfo(true) }
    },
    // 作废预立项流程退回单据
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
            projectCode: this.projectCode,
            approveNo: this.processParams.businessSerialNumber
          }
          API.delProjectBeforApprove(params)
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
    // 项目编辑
    editLaunch () {
      this.$router.push({
        path: `/projectInfo/projectInfo-edit/${this.projectCode}`,
        query: {
          versionNo: this.versionNo,
          from: 'reject'
        }
      })
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
        participants: this.submitNextHandleInfo.participants,
        approveNo: this.processParams.businessSerialNumber
      }
      API.resubmitProjectBeforApprove(params)
        .then(res => {
          this.$message({
            message: '预立项申请创建成功。',
            type: 'success',
            showClose: true
          })
          this.nextHandleVis = false
          this.closeProcessInfo()
          this.$refs['instructionsForm'].clearValidate()
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
    },
    setMilestoneVisible (show) {
      this.isShowMilestone = show
      if (!show) {
        let index = -1
        this.navMenus.some((ele, i) => {
          if (ele.id === 'milestone') {
            index = i
            return true
          }
        })
        if (index > -1) {
          this.navMenus.splice(index, 1)
        }
      }
    }
  },
  created () {
    document.title = '预立项流程驳回'
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
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
.instructions{
  background: #fff;
  margin-bottom: 20px;
  padding-top: 20px;
  padding-right: 30px;
}
</style>
