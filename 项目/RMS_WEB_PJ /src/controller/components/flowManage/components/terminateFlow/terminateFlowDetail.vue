<template>
  <div class="wrapper">
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
      <h3>本单位自立研发项目终止申请</h3>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>
      <div style="background:#fff;" class="doc-accessory">
        <el-form
          :model="terminateInfo"
          ref="ruleForm"
          :label-width="'auto'"
          class="demo-ruleForm">
          <el-form-item label="实际终止时间：" prop="stopTime"><p>{{terminateInfo.stopTime}}</p></el-form-item>
          <el-form-item label="取消或终止原因：" prop="reason"><p>{{terminateInfo.reason}}</p></el-form-item>
          <el-form-item label="项目已产生成果：" prop="achievement"><p>{{terminateInfo.achievement}}</p></el-form-item>
          <el-form-item label="潜在风险分析：" prop="existRisk">
            <p>
              {{terminateInfo.existRisk}}
              <!-- <span>
                <el-tooltip :content="'对于部分技术支撑、运维支撑、产品支撑、系统优化、功能迭代等日常工作中大任务下包含较多规模较小、任务不易细化明确的研发活动，按照研发包方式管理（简称：研发包项目）。项目执行中，按照实际研发任务需求，在该研发包下发起若干任务申请。每一项任务申请应完成需求审批、结果确认等闭环管理。'" placement="top">
                  <i class="el-icon-info accountingNo"></i>
                </el-tooltip>
              </span> -->
            </p>
          </el-form-item>
          <el-form-item label="资源执行结果：" prop="executeResult">
            <p>
              {{terminateInfo.executeResult}}
              <!-- <span>
                <el-tooltip :content="'对于部分技术支撑、运维支撑、产品支撑、系统优化、功能迭代等日常工作中大任务下包含较多规模较小、任务不易细化明确的研发活动，按照研发包方式管理（简称：研发包项目）。项目执行中，按照实际研发任务需求，在该研发包下发起若干任务申请。每一项任务申请应完成需求审批、结果确认等闭环管理。'" placement="top">
                  <i class="el-icon-info accountingNo"></i>
                </el-tooltip>
              </span> -->
            </p>
          </el-form-item>
          <el-form-item label="其他：" prop="other"><p>{{terminateInfo.other}}</p></el-form-item>
        </el-form>
      </div>
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
        <projectBudget :info="infoTitle" :receive-data="costBudgetList"></projectBudget>
      </div>
      <div id="task-ach">
        <subproject :receive-data="subProjectInfoList"></subproject>
      </div>
      <div id="milestone" v-if="isShowMilestone">
        <detailTableMilestone :receive-data="projectMileStones" @detailTableMilestoneShowOrHide="setMilestoneVisible"></detailTableMilestone>
      </div>
      <div id="approved-con" v-if="isShowApprove && projectApprove.historyFlag === '0'">
        <approval-opinion :business-opinions-array="approvalOpinionList"></approval-opinion>
      </div>
      <project-document-detail id="attach-doc" v-if="approveNo" :doc-params="docParams"></project-document-detail>
    </div>
  </div>
</template>
<script>
import merge from 'webpack-merge'
import API from '@/serve/API_project'
import termAPI from './API_terminate'
import flowAPI from '@/serve/API_flow'
import { getStore } from '@/store'
import projectPanel from '@/controller/components/projectPanel'
import projectDocumentDetail from '../../../projectDocumentDetail'
import detailTableMilestone from '@/controller/extraProject/components/basic/milestone/detailTableMilestone'
import basicInfo from '@/controller/extraProject/components/basic/detail'
import teamInfo from '@/controller/extraProject/components/teamInfo/detail'
import projectBudget from '@/controller/extraProject/components/budget/finalDetail'
import subproject from '@/controller/extraProject/components/subproject/detail'
import attributeInfoApprove from '@/controller/extraProject/components/attributeInfo/detail'
import ProductInfoDetail from '../../../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../../../extraProject/components/resource/resInfoDetail.vue'
import { flowRollback } from '@/common/flowRollbackMixins'
export default {
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
  mixins: [flowRollback],
  data () {
    return {
      infoTitle: {
        title: '成本信息'
      },
      typeOptions: null,
      levelList: null,
      terminateInfo: {
        stopTime: '', // 终止时间
        reason: '', // 取消或终止原因
        achievement: '', // 项目已产生成果
        existRisk: '', // 潜在风险分析
        executeResult: '', // 资源执行结果
        other: '' // 资源执行结果
      },
      processInstId: this.$route.query.processInstID, // 流程实例ID
      approveNo: this.$route.query.approveNo, // 业务流水号
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      costBudgetList: [], // 项目预算
      projectTeamList: [], // 团队信息
      subProjectInfoList: [], // 预期成果
      projectMileStones: [], // 里程碑信息
      approvalOpinionList: [], // 审批意见
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      hasProductInfo: true, //项目信息中有产品信息
      hasResourceInfo: true, //资源信息中有产品信息
      projectApprove: {}, //表单信息
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      docParams: {
        type: 'BT-STOP',
        approveNo: this.$route.query.approveNo,
        check: true
      },
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      navMenus: [
        { name: '基本信息', id: 'basic-info' },
        { name: '属性信息', id: 'property-info' },
        { name: '产品信息', id: 'product-info' },
        { name: '资源信息', id: 'resource-info' },
        { name: '团队信息', id: 'team-info' },
        { name: '成本信息', id: 'project-budget' },
        { name: '子项目', id: 'task-ach' },
        { name: '里程碑', id: 'milestone' },
        { name: '审批意见', id: 'approved-con' },
        { name: '项目文档', id: 'attach-doc' }
      ],
      isShowMilestone: true,
      isShowApprove: true
    }
  },
  created () {
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
    formatDate (val) {
      if (!val) {
        return ''
      }
      return this.$formatDate(val, 'YYYY-MM-DD')
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
    // 判断入口参数
    getPageUrl () {
      if (this.$route.query.approveNo) {
        // this.getBusinessProcessInst()
        this.queryTermDetail()
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
          this.queryTermDetail()
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
      this.queryTermDetail()
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
    // 获取结项流程详细信息
    async queryTermDetail () {
      // await this.getProjectType()
      // await this.getProjectLevel()
      let param = {
        approveNo: this.approveNo
      }
      termAPI.queryTermDetail(param)
        .then(res => {
          if (res.projectApprove || res.projectBaseInfo) {
            let extendedAttributes = JSON.parse(res.projectApprove.extendedAttributes) || this.formatDate(res.projectBaseInfo.actualFinishTime)
            this.terminateInfo = extendedAttributes
          }
          this.projectApprove = res.projectApprove
          this.createdBy = this.projectApprove ? this.projectApprove.createdBy : ''
          this.projectBaseInfo = res.projectBaseInfo
          this.projectAttribute = res.projectAttribute
          // this.costBudgetList = res.projectCost
          this.costBudgetList = this.transformList(res.projectCost, res.costBudgetList)
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
          if (res === null || res.approveRecord === null || res.approveRecord.total === 0) {
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
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取结项流程详细信息失败，请稍后重试！',
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
    // 转换数组
    transformList (actualArr, planArr) {
      actualArr.forEach((item, index) => {
        planArr.forEach((iter, i) => {
          if (item.timeYear === iter.timeYear) {
            iter.actualBudgetOutsourcing = actualArr[index].budgetOutsourcing // 实际委外
            iter.actualBudgetInsourcing = actualArr[index].budgetInsourcing // 实际委内
            iter.actualStaffTime = actualArr[index].staffTime // 实际人员工时（人月）
            iter.actualLaborCosts = actualArr[index].laborCosts // 实际人工成本
            iter.actualTravelExpenses = actualArr[index].travelExpenses // 实际差旅费
            iter.actualConferenceExpenses = actualArr[index].conferenceExpenses // 实际会议费
            iter.actualAssetDepreciation = actualArr[index].assetDepreciation // 实际资产折旧/摊销
            iter.actualOtherCosts = actualArr[index].otherCosts // 实际其他成本
            iter.actualTotalAmount = actualArr[index].totalAmount // 实际totalAmount
          }
        })
      })
      return planArr
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
    // 关闭
    closeProcessInfo () {
      window.onscroll = null
      if (this.$route.query.projectCode) {
        this.$router.push({
          path: this.backUrl,
          query: {
            activeTab: 'projectProgress',
            flowPoint: '终止流程'
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
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  background-color: #F6F6F6;
  padding-bottom: 28px;
  overflow: auto;
  min-height: 100vh;
  /deep/ .el-form-item{
    margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
}
.main-container{
  width: 1180px;
  margin:0 auto;
  h3{

    font-size: 26px;
    color: #333333;
    text-align: center;
    line-height: 26px;
    margin: 27px 0;
  }
  .doc-accessory{
    padding: 20px 30px 30px;
    margin-bottom: 30px;
    p{

      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      text-align: left;
      line-height: 25px;
      margin:0;
    }
  }
  & > *:last-child{
    /deep/ .panel-body{
      margin-bottom: 0;
    }
  }
}
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

.accountingNo{
  margin-left: 5px;
  @include color();
}
</style>
