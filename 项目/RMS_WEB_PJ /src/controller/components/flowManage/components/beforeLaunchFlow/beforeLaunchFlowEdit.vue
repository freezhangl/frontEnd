<template>
  <div class="launch-edit">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn" v-if="isEditable">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveLaunchInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" @click="submitLauchInfo"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="this.$route.query.addBeforeLaunch==='false'" @click="cancellation"><span class="global-family">作废</span></i>
        </span>
        <span class="group-btn" v-else><i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i></span>
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
          v-if="docParams.approveNo"
          :doc-params="docParams"
          @existAttachmentIds="getDelIds"></project-document-upload>
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
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import singleAPI from '@/serve/API_single'
import projectDocumentUpload from '../../../projectDocumentUpload'
import detailTableMilestone from '../../../../extraProject/components/basic/milestone/detailTableMilestone'
import basicInfo from '../../../../extraProject/components/basic/detail'
import teamInfo from '../../../../extraProject/components/teamInfo/detail'
import projectBudget from '../../../../extraProject/components/budget/detail'
import subproject from '../../../../extraProject/components/subproject/detail'
import attributeInfoApprove from '../../../../extraProject/components/attributeInfo/detail'
import ProductInfoDetail from '../../../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../../../extraProject/components/resource/resInfoDetail.vue'
export default {
  data () {
    return {
      submitNextHandleInfo: {}, //提交下一审批表单数据
      nextHandleVis: false, //提交下一处理人组件默认不展示
      docParams: { //获取项目文档参数
        type: this.$route.query.type,
        approveNo: null
      },
      instructionsForm: {
        instructions: null
      },
      rules: {
        instructions: [{ required: true, message: '请输入理由', trigger: ['change', 'blur'] }]
      },
      versionCode: '', // 项目版本号
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 子项目
      projectMileStones: [], // 里程碑信息
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      approveNo: null,
      processTemplateCode: null, // 流程模板编码接口返回
      processInstId: null, // 流程实例ID
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true, //资源信息中有产品信息
      projectCode: '',
      projectName: '',
      attachmentTypeCode: '', //当前上传附件类型
      attachmentIds: [], //项目文档编辑后的文档ids
      attachments: [], //项目文档编辑后的文档
      isNewLaunch: this.$route.query.addBeforeLaunch,
      isEditable: false, //用户是否具有编辑权限
      clearFlag: true, //true 触发滚动
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
        }
      ],
      isShowMilestone: true,
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
    if (this.$route.query.addBeforeLaunch !== 'true') {
      this.docParams.approveNo = this.$route.query.approveNo
      this.approveNo = this.$route.query.approveNo
      this.getProjectBeforInfo()
      this.getTemplateCode()
    } else {
      this.getApproveNo()
    }
  },
  methods: {
    // 获取立项流程详细信息-第一次新增调用
    async queryDocumentDetail () {
      let param = {
        projectCode: this.$route.query.projectCode
      }
      API.queryDocumentDetail(param)
        .then(res => {
          this.projectName = res.projectBaseInfo.projectName
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          this.costBudgetList = res.costBudgetList
          this.projectTeamList = res.projectTeamList
          this.subProjectInfoList = res.subProjectInfoList
          this.projectMileStones = res.projectMileStones
          this.isShowMilestone = this.projectMileStones && this.projectMileStones.length > 0
          if (!this.isShowMilestone) {
            this.deleteNavItem('milestone')
          }
          if (res.projectApprove) {
            this.instructionsForm.instructions = res.projectApprove.remarks
          }
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
          this.loading = false
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
    // 编辑的时候调用的详情接口
    async getProjectBeforInfo () {
      let param = {
        approveNo: this.approveNo
      }
      API.getProjectBeforInfo(param)
        .then(res => {
          this.projectName = res.projectBaseInfo.projectName
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          this.costBudgetList = res.costBudgetList
          this.projectTeamList = res.projectTeamList
          this.subProjectInfoList = res.subProjectInfoList
          this.projectMileStones = res.projectMileStones
          if (res.projectApprove) {
            this.instructionsForm.instructions = res.projectApprove.remarks
          }
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
          this.loading = false
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
    // 用户权限校验--编辑按钮是否展示
    verificationPermission () {
      const param = {
        projectCode: this.$route.query.projectCode //TODO 需要替换this.$route.params.projectCode
      }
      API.verificationPermission(param)
        .then(res => {
          if (res.indexOf('00') > -1 || res.indexOf('02') > -1) {
            this.isEditable = true
          } else {
            this.isEditable = false
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '用户权限校验失败，请稍后重试！',
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
    updateProjectCode (code) {
      this.projectCode = code
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
    getDelIds (ids, attachs, approveNo) {
      this.attachmentIds = ids
      this.attachments = attachs
      // this.approveNo = approveNo
    },
    // 确认提交下一处理
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      let params = {
        approveNo: this.approveNo,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participants: this.submitNextHandleInfo.participants
      }
      API.submitProjectBeforApprove(params)
        .then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '预立项申请创建成功。'
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
    // 获取流程模板编码
    getTemplateCode () {
      if (this.approveNo) {
      // 根据业务流水号查询业务流程实例信息
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
      }
    },

    // 保存流程立项编辑信息
    saveLaunchInfo (confirm = false) {
      // 附件校验
      if (!this.verifyDocument()) { return }
      let urlString = 'approveNo=' + this.approveNo + '&projectCode=' + this.$route.query.projectCode
      let params = {
        remarks: this.instructionsForm.instructions,
        approveNo: this.approveNo,
        projectCode: this.$route.query.projectCode,
        projectName: this.projectName,
        businessType: 'BT-PRE-APPROVE',
        processInstName: this.projectName + '预立项申请',
        attachmentIds: this.attachmentIds,
        businessFormUrl: '/beforeLaunchFlow/beforeLaunchFlowEdit?addBeforeLaunch=false&type=BT-PRE-APPROVE&' + urlString
      }
      if (this.$route.query.addBeforeLaunch !== 'true') {
        params.approveNo = this.approveNo
        params.processInstId = this.processInstId
      }
      this.$refs['instructionsForm'].validate(valid => {
        if (valid) {
          API.saveProjectBeforApprove(params)
            .then(res => {
              this.approveNo = res.approveNo
              this.processTemplateCode = res.processTemplateCode
              this.$router.push({
                query: merge(this.$route.query, { 'addBeforeLaunch': 'false', 'approveNo': this.approveNo })
              })
              this.getTemplateCode()
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
                // 保存清空校验
                this.$refs['instructionsForm'].clearValidate()
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
        } else {
          return false
        }
      })
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
    // 提交下一处理
    submitLauchInfo () {
      if (this.verifyDocument()) { this.saveLaunchInfo(true) }
    },
    // 作废流程编辑
    cancellation () {
      let params = {
        approveNo: this.approveNo,
        projectCode: this.$route.query.projectCode
      }
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
          API.delProjectBeforApprove(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功。'
              })
              this.$router.push({
                path: this.backUrl,
                query: {
                  activeTab: 'projectProgress'
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
    },
    deleteAttachment () { // 带出作废附件的清库下，不保存单据直接关闭表单时删除带出的附件
      singleAPI.deleteBusinessAttachment(this.approveNo)
        .then(res => {
          // console.log(res)
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '删除附件失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 关闭流程信息页面
    closeProcessInfo () {
      if (this.$route.query.addBeforeLaunch === 'true') { // 带出作废附件的情况下，不保存单据直接关闭表单时删除带出的附件
        this.deleteAttachment()
      }
      this.$router.push({
        path: this.backUrl,
        query: {
          activeTab: 'projectProgress',
          flowPoint: '预立项流程'
        }
      })
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
    },
    // 当页面为新增页面的时候先查询approveNo
    async getApproveNo () {
      await this.queryDocumentDetail()
      API.getApproveId()
        .then(res => {
          this.docParams.approveNo = res
          this.approveNo = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '用户权限校验失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  },
  created () {
    this.isNewLaunch = this.$route.query.addBeforeLaunch
    this.projectCode = this.$route.params.projectCode || ''
    if (this.$route.query.isCarry === '1') {
      this.docParams.flag = '1'
      this.docParams.projectCode = this.$route.query.projectCode
    }

    // if (this.$route.query.addBeforeLaunch === 'true') {
    //   this.getApproveNo()
    // } else {
    //   this.docParams.approveNo = this.$route.query.approveNo
    //   this.approveNo = this.$route.query.approveNo
    // }

    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })

    this.verificationPermission()
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
.instructions{
  background: #fff;
  margin-bottom: 20px;
  padding-top: 20px;
  padding-right: 30px;
}
</style>
