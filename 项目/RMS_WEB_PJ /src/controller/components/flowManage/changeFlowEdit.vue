<template>
  <div class="change-flow-edit">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowEdit"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-detail" @click="viewChangeDetail"><span class="global-family">变更详情</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveChangeFlow(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" @click="submitChangeFlow"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="this.$route.query.addLaunch==='false'" @click="abandonFlow"><span class="global-family">作废</span></i>
        </span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">本单位自立研发项目变更申请</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">

        <change-reason ref="change-reason" :receive-data="changeReason"></change-reason>

        <project-document-upload
          v-if="docVisible"
          id="project-doc"
          :doc-params="docParams"
          :file-list="attachments"
          @existAttachmentIds="getDelIds"></project-document-upload>

        <basicInfo id="basic-info" :receive-data="projectBaseInfo" info-type="simple"></basicInfo>

        <attributeInfoApprove id="property-info" :receive-data="projectBaseInfo" :project-attribute="projectAttribute"></attributeInfoApprove>

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

        <teamInfo id="team-info" :receive-data="projectTeamList"></teamInfo>

        <projectBudget id="project-budget" :receive-data="costBudgetList"></projectBudget>

        <subproject id="task-ach" :receive-data="subProjectInfoList"></subproject>

        <detailTableMilestone
          id="milestone"
          v-if="isShowMilestone"
          :receive-data="projectMileStones"
          @detailTableMilestoneShowOrHide="setMilestoneVisible"></detailTableMilestone>

      </div>
    </div>
    <!-- 提交下一处理组件弹窗 -->
    <next-handle
      :show="nextHandleVis"
      :business-serial-number="approveNo"
      :process-template-code="processTemplateCode"
      @confirmNextHandle="confirmNextHandle"
      @changeNextHandle="closeNextHandle"></next-handle>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import singleAPI from '@/serve/API_single'
import projectDocumentUpload from '../projectDocumentUpload'
import detailTableMilestone from '../../extraProject/components/basic/milestone/detailTableMilestone'
import basicInfo from '../../extraProject/components/basic/detail'
import teamInfo from '../../extraProject/components/teamInfo/detail'
import projectBudget from '../../extraProject/components/budget/detail'
import subproject from '../../extraProject/components/subproject/detail'
import attributeInfoApprove from '../../extraProject/components/attributeInfo/detail'
import ProductInfoDetail from '../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../extraProject/components/resource/resInfoDetail.vue'
import changeReason from '../changeReason'
import merge from 'webpack-merge'
export default {
  name: 'changeFlowEdit',
  data () {
    return {
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true, //资源信息中有产品信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 预期成果
      projectMileStones: [], // 里程碑信息
      attachmentTypeCode: '', //当前上传附件类型
      attachmentIds: [], //项目文档编辑后的文档ids
      attachments: [], //项目文档编辑后的文档
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
      docParams: { //项目文档相关参数
        type: this.$route.query.type,
        approveNo: this.$route.query.approveNo || ''
      },
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      projectCode: this.$route.query.projectCode,
      approveNo: this.$route.query.approveNo || '', //业务流水号，新增页面进入时为空，编辑页面从url中取
      changeReason: '', //变更理由（编辑页面）
      nextHandleVis: false, //提交下一处理组件
      processTemplateCode: null, // 流程模板编码接口返回
      processInstId: null, // 流程实例ID
      docVisible: false, //附件组件是否显示，等待数据获取到再渲染
      typeOptions: [],
      levelList: []
    }
  },
  components: {
    projectDocumentUpload,
    detailTableMilestone,
    basicInfo,
    teamInfo,
    projectBudget,
    subproject,
    changeReason,
    attributeInfoApprove,
    ResInfoDetail,
    ProductInfoDetail
  },
  computed: {
  },
  mounted () {
    //编辑页面获取详情，新增页面无
    if (this.$route.query.addLaunch === 'false') {
      this.getTemplateCode()
      this.queryChangeApprove()
    } else { //新增
      this.getProjectTempLatestInfo()
    }
  },
  methods: {
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
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs, approveId) {
      this.attachmentIds = ids
      this.attachments = attachs
      this.approveNo = approveId
      this.docParams.approveNo = approveId
    },
    //关闭
    closeFlowEdit () {
      this.$router.push({
        path: this.backUrl,
        query: {
          activeTab: 'projectProgress',
          flowPoint: '变更流程'
        }
      })
    },
    //查看变更详情
    viewChangeDetail () {
      let { href } = this.$router.resolve({
        path: '/changeFlow/changeFlowContrastDetails',
        query: {
          approveNo: this.approveNo,
          projectCode: this.projectCode
        }
      })
      // 打开新的窗口
      window.open(href, '_blank')
    },
    //保存
    async saveChangeFlow (confirm = false) {
      if (!confirm && !this.verifyDocument()) { return }
      let changeReason = await this.$refs['change-reason'].validate()
      if (!changeReason) return
      let urlString = 'approveNo=' + this.approveNo + '&projectCode=' + this.projectCode
      let params = {
        approveNo: this.approveNo,
        projectCode: this.projectCode,
        changeReason: this.$refs['change-reason'].getChangeReason(),
        attachmentIdList: this.attachmentIds,
        businessFormUrl: '/changeFlow/changeFlowEdit?addLaunch=false&type=BT-CHANGE&' + urlString,
        processInstId: this.processInstId
      }
      API.saveChangeApprove(params)
        .then(res => {
          this.approveNo = res.approveNo
          this.getTemplateCode()
          this.processTemplateCode = res.processTemplateCode
          if (this.$route.query.addLaunch === 'true') {
            //新建流程保存后，变成编辑
            this.$router.push({
              query: merge(this.$route.query, { 'addLaunch': 'false', 'approveNo': res.approveNo })
            })
          }
          if (confirm) { //提交下一处理：保存成功后弹出下一步组件
            this.nextHandleVis = true
          } else {
            //提示保存成功是否提交申请
            this.$confirm(' ', '变更申请保存成功，是否提交申请?', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
              customClass: 'self-message-box-delete',
              cancelButtonClass: 'self-message-box-delete-cancel',
              confirmButtonClass: 'self-message-box-delete-confirm'
            })
              .then(() => {
                this.submitChangeFlow()
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
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '变更流程信息保存失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //查询项目详情--新增
    async getProjectTempLatestInfo () {
      // await this.getProjectType()
      // await this.getProjectLevel()
      let params = {
        projectCode: this.projectCode,
        versionStatus: 1,
        businessType: 'BT-CHANGE'
      }
      API.getProjectTempLatestInfo(params)
        .then(res => {
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
          this.attachments = res.attachmentFileList
          this.docVisible = true
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
              message: e.message || '获取项目信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //查询表单详情--编辑
    async queryChangeApprove () {
      // await this.getProjectType()
      // await this.getProjectLevel()
      let params = {
        approveNo: this.approveNo
      }
      API.queryChangeApprove(params)
        .then(res => {
          this.changeReason = res.changeReason
          this.projectBaseInfo = res.projectInfo.projectBaseInfo
          this.projectAttribute = res.projectInfo.projectAttribute
          this.costBudgetList = res.projectInfo.costBudgetList
          this.projectTeamList = res.projectInfo.projectTeamList
          this.subProjectInfoList = res.projectInfo.subProjectInfoList
          this.projectMileStones = res.projectInfo.projectMileStones
          this.attachments = res.attachmentFileList
          this.docVisible = true
          //产品信息
          this.productInfoList = res.projectInfo.projectProductInfoList || []
          this.hasProductInfo = this.productInfoList && this.productInfoList.length > 0
          if (!this.hasProductInfo) {
            this.deleteNavItem('product-info')
          }
          //资源信息
          this.resourceInfo = res.projectInfo.projectResourceInfoDto || {}
          this.hasResourceInfo = !!((this.resourceInfo && JSON.stringify(this.resourceInfo) !== '{}'))
          if (!this.hasResourceInfo) {
            this.deleteNavItem('resource-info')
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取变更流程详细信息失败，请稍后重试！',
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
    //提交下一处理
    submitChangeFlow () {
      if (this.verifyDocument()) {
        this.saveChangeFlow(true)
      }
    },
    // 取消下一处理
    closeNextHandle () {
      this.nextHandleVis = false
    },
    //提交下一处理 - 确认
    confirmNextHandle (obj) {
      let submitNextHandleInfo = {
        approveNo: this.approveNo,
        nextActivityDefId: obj.nextLinkShow,
        participants: obj.participants
      }
      API.submitChangeApprove(submitNextHandleInfo)
        .then(res => {
          this.$message({
            message: '变更申请创建成功。',
            type: 'success',
            showClose: true
          })
          this.nextHandleVis = false
          setTimeout(() => {
            this.closeFlowEdit()
          }, 500)
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
    },
    //作废
    abandonFlow () {
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
          singleAPI.deleteChangeApprove(this.approveNo)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功!'
              })
              this.closeFlowEdit()
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
    //回到顶部
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
    },
    //点击右侧导航
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
    //设置里程碑是否展示
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

.change-flow-edit{
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
.time {
  /deep/ .el-form-item__error{
  right: inherit;
  left: 124px;
}}
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
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
</style>
