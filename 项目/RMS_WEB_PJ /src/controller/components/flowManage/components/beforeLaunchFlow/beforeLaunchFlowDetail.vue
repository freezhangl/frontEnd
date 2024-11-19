<template>
  <div class="launch-detail">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span>
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
        <div class="approval-form">
          预立项说明：{{instructions || '暂未设置'}}
        </div>
        <div id="approved-con" v-if="isShowApprove && projectApprove.historyFlag === '0'">
          <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
        </div>

        <!--  TODO 引入对应组件即可 -->
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

        <project-document-detail id="attach-doc" v-if="approveNo" :doc-params="docParams"></project-document-detail>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import flowAPI from '@/serve/API_flow'
import { getStore } from '@/store'
import projectDocumentDetail from '../../../projectDocumentDetail'
import detailTableMilestone from '../../../../extraProject/components/basic/milestone/detailTableMilestone'
import basicInfo from '../../../../extraProject/components/basic/detail'
import teamInfo from '../../../../extraProject/components/teamInfo/detail'
import projectBudget from '../../../../extraProject/components/budget/detail'
import subproject from '../../../../extraProject/components/subproject/detail'
import attributeInfoApprove from '../../../../extraProject/components/attributeInfo/detail'
import ProductInfoDetail from '../../../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../../../extraProject/components/resource/resInfoDetail.vue'
import { flowRollback } from '@/common/flowRollbackMixins'
export default {
  data () {
    return {
      typeOptions: null,
      levelList: null,
      instructions: null, // 预立项审批时间-TODO需要替换
      versionCode: '', // 项目版本号
      processInstId: this.$route.query.processInstID, // 流程实例ID
      approveNo: this.$route.query.approveNo, // 业务流水号
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 子项目
      projectMileStones: [], // 里程碑信息
      approvalOpinionList: [], // 审批意见
      projectApprove: {}, //表单信息
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true, //资源信息中有产品信息
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      docParams: {
        type: 'BT-PRE-APPROVE',
        approveNo: this.$route.query.approveNo
      },
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      navMenus: [
        {
          name: '审批意见',
          id: 'approved-con'
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
          name: '项目文档',
          id: 'attach-doc'
        }
      ],
      isShowMilestone: true,
      isShowApprove: true
    }
  },
  mixins: [flowRollback],
  components: {
    projectDocumentDetail,
    detailTableMilestone,
    basicInfo,
    teamInfo,
    projectBudget,
    subproject,
    attributeInfoApprove,
    ResInfoDetail,
    ProductInfoDetail
  },
  computed: {},
  mounted () {
    this.getPageUrl()
  },
  methods: {
    // 判断入口参数
    getPageUrl () {
      if (this.$route.query.approveNo) {
        this.getApproveTemInfo()
      } else {
        this.getProcessInstDetailById()
      }
    },
    // 审批-获取业务流水号
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(Number(this.$route.query.processInstID))
        .then(res => {
          this.approveNo = res.businessSerialNumber
          this.docParams.approveNo = res.businessSerialNumber
          this.getApproveTemInfo()
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
      this.getApproveTemInfo()
      flowAPI.getBusinessProcessInst(this.approveNo)
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
    // 获取预立项流程详细信息
    queryTemporaryInfo () {
      let param = {
        approveNo: this.$route.query.approveNo
      }
      API.getProjectBeforInfo(param)
        .then(res => {
          if (res) {
            if (res.projectApprove) {
              this.instructions = res.projectApprove.remarks
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
            if (res.approveRecord === null || res.approveRecord.total === 0) {
              this.isShowApprove = false
              let index = -1
              this.navMenus.some((ele, i) => {
                if (ele.id === 'approved-con') {
                  index = i
                  return true
                }
              })
              if (index > -1) {
                this.navMenus.splice(index, 1)
              }
            }
            this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
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
    // 获取预立项流程详细信息
    async getApproveTemInfo () {
      let param = {
        approveNo: this.approveNo
      }
      API.getProjectBeforInfo(param)
        .then(res => {
          if (res) {
            this.projectApprove = res.projectApprove
            this.createdBy = this.projectApprove ? this.projectApprove.createdBy : ''
            this.projectCode = res.projectBaseInfo.projectCode
            if (res.projectApprove) {
              this.instructions = res.projectApprove.remarks
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
            if (res.approveRecord === null || res.approveRecord.total === 0) {
              this.isShowApprove = false
              let index = -1
              this.navMenus.some((ele, i) => {
                if (ele.id === 'approved-con') {
                  index = i
                  return true
                }
              })
              if (index > -1) {
                this.navMenus.splice(index, 1)
              }
            }
            this.approvalOpinionList = res.approveRecord === null ? [] : res.approveRecord.approvals
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
    // 流程跟踪
    processTrace () {
      if (this.projectApprove.historyFlag === '0' && this.$route.query.approveNo) {
        flowAPI.getBusinessProcessInst(this.approveNo)
          .then(res => {
            this.processInstId = res.processInstId
            this.$router.push({
              path: '/processTrace',
              query: {
                businessSerialNumber: this.approveNo,
                processInstId: res.processInstId,
                userId: this.userId,
                fileCode: this.projectApprove.historyApproveFileId,
                historyFlag: this.projectApprove.historyFlag
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
            fileCode: this.projectApprove.historyApproveFileId,
            historyFlag: this.projectApprove.historyFlag
          }
        })
      }
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
    // 关闭流程信息页面
    closeProcessInfo () {
      if (this.$route.query.projectCode) {
        this.$router.push({
          path: this.backUrl,
          query: {
            activeTab: 'projectProgress'
          }
        })
      } else {
        window.close()
      }
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
    this.projectCode = this.$route.params.projectCode || ''

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

.launch-detail{
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
        // height: 70px;
        line-height: 22px;
        margin-top: 30px;
        margin-bottom: 20px;
        padding: 30px;
        font-family: inherit;
        font-size: 14px;
        color: #333333;
      }
    }
  }
</style>
