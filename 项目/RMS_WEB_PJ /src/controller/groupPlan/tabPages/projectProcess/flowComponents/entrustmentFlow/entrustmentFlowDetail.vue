<template>
  <!-- 查看 -->
  <div class="entrustment-flow-reject1 entrustment-flow con1">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowEdit"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-back" v-if="createdBy && userId === createdBy"  @click="rollBackProcessInstance"><span class="global-family">撤回流程</span></i>
          <i class="approve-icon svgfont-btn-detail" @click="createProject" v-if="execute"><span class="global-family">创建本单位项目</span></i>
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
        <!-- 基本信息 -->
        <div id="basic-info">
          <base-info
            v-if="docVisible"
            id="basic-info"
            :data="entrustLetterInfo"
            view-type="preview"></base-info>
        </div>
        <!-- 预期成果 -->
        <achievement id="task-ach" type="detail" :receive-data="projectAchievementList"></achievement>
        <!-- 项目预算 -->
        <budget-info :budget-data="entrustLetterInfo" id="project-budget"></budget-info>
        <!-- 审批意见 -->
        <div id="approved-con" v-if="isShowApprove&&projectApprove.historyFlag === '0'">
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
  </div>
</template>

<script>
import API from '@/serve/API_businessFlow'
import { getStore } from '@/store'
import flowAPI from '@/serve/API_flow'
import baseInfo from './component/baseInfo'
import budgetInfo from './component/budgetInfo'
import achievement from '@/controller/groupPlan/components/subproject/achievement/entrustmentAchievementDetail'
import projectDocumentDetail from '@/controller/groupPlan/components/attachments/detail'
import { flowRollback } from '@/common/flowRollbackMixins'

export default {
  components: { baseInfo, achievement, projectDocumentDetail, budgetInfo },
  mixins: [flowRollback],
  data () {
    return {
      approveNo: this.$route.query.approveNo,
      backUrl: '/groupPlan/projectDetail/' + this.$route.query.projectCode,
      navIdx: 0,
      showBackTop: false,
      execute: false, // 执行状态 显示 <创建本单位项目> 按钮
      navMenus: [
        { name: '基本信息', id: 'basic-info' },
        { name: '预期成果', id: 'task-ach' },
        { name: '项目预算', id: 'project-budget' },
        { name: '审批意见', id: 'approved-con' },
        { name: '文档资料', id: 'project-doc' }
      ],
      docParams: { //文档资料相关参数
        type: this.$route.query.type,
        approveNo: this.$route.query.approveNo || ''
      },
      businessType: 'BT-DEMAND-ENTRUST-LETTER',
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectBudget: [], // 项目预算
      projectAchievementList: [], // 预期成果
      attachmentIds: [], //文档资料编辑后的文档ids
      attachmentFileList: [], //文档资料编辑后的文档
      clearFlag: true, //true 触发滚动
      docVisible: false, // 获取到数据在进行渲染
      approvalOpinionList: [], // 审批意见
      isShowApprove: true, //是否显示审批组件
      projectApprove: {}, //表单信息
      entrustLetterInfo: {},
      projectBaseInfo: { // 基本信息
        projectName: '', // 项目名称
        approvelName: '', // 任务名称
        demandSide: '', // 需求部门
        demandPrincipal: '', // 需求负责人
        contactWay: '', // 联系方式
        planStartTime: '', // 计划开始时间
        planFinishTime: '', // 计划结束时间
        assumeSide: '', // 建议承担部门
        assumePrincipal: '', // 承担方项目经理
        taskDescription: '', // 任务描述及要求
        demandRisk: '', // 需求风险提示
        completionEffect: '', // 预期完成效果
        remark: '' // 备注
      },
      processParams: {
        businessSerialNumber: this.$route.query.approveNo, //业务流水号
        processInstId: this.$route.query.processInstID, //流程实例ID
        userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid
      }
    }
  },
  // 离开页面删除事件
  beforeRouteLeave (to, from, next) {
    window.onscroll = null
    next()
  },
  computed: {},
  watch: {},
  methods: {
    // 判断入口参数
    getPageUrl () {
      if (this.$route.query.approveNo) {
        this.getDetailByApproveNo()
      } else {
        this.getProcessInstDetailById()
      }
    },
    //查询委托函流程详情
    async getDetailByApproveNo () {
      let param = {
        approveNo: this.approveNo
      }
      API.queryApprove(param)
        .then(res => {
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
          this.attachmentFileList = res.attachmentFileList
          if (res.entrustLetterAttachmentFileList) {
            this.attachmentFileList = this.attachmentFileList.concat(res.entrustLetterAttachmentFileList)
          }
          this.docVisible = true
          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            let extendsObj = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.changeReason = extendsObj.changeDescription
          }
          this.projectApprove.historyApproveFileId = res.projectApproveInfo.historyApproveFileId
          this.projectApprove.historyFlag = res.projectApproveInfo.historyFlag
          this.createdBy = res.projectApproveInfo ? res.projectApproveInfo.createdBy : ''
          this.entrustLetterInfo = res.entrustLetterInfo
          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            let json = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.entrustLetterInfo.completion = json.completion
          }
          if (res.projectInfo) {
            this.projectInfo = res.projectInfo
            this.developPackage = res.projectInfo.projectBaseInfo.developPackage
            this.projectCategory = res.projectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
            this.projectCode = res.entrustLetterInfo.projectCode
            this.projectName = res.entrustLetterInfo.projectName
            this.projectBaseInfo = res.entrustLetterInfo
            this.projectBudget = res.projectInfo.costBudgetList
          }
          if (res.createProjectButton === true) {
            this.execute = true
          }
          if (res.entrustLetterInfo) {
            this.projectAchievementList = res.entrustLetterInfo.entrustLetterAchievementList
          }
          this.approvalOpinionList = res.approveRecord ? res.approveRecord.approvals : []
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
    // 根据流程实例ID-processInstId获取业务流水号，从而获取单据详情
    getProcessInstDetailById () {
      flowAPI.getProcessInstDetailById(Number(this.$route.query.processInstID))
        .then(res => {
          this.approveNo = res.businessSerialNumber
          this.processParams.businessSerialNumber = res.businessSerialNumber
          this.getDetailByApproveNo()
        })
        .catch(e => {
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
    //关闭
    closeProcessInfo () {
      if (this.$route.query.projectCode) {
        this.$router.push({
          path: this.backUrl,
          query: {
            activeTab: 'projectProgress',
            flowPoint: '委托函',
            developPackage: this.developPackage,
            projectCategory: this.projectCategory
          }
        })
      } else {
        window.close()
      }
    },
    //流程跟踪
    processTrace () {
      // 判断是否有历史数据
      if (this.projectApprove.historyFlag === '0' && this.approveNo) {
        // 存在历史数据，则预览PDF，需要从流程接口查询processInstId
        flowAPI.getBusinessProcessInst(this.approveNo)
          .then(res => {
            this.processParams.processInstId = res.processInstId
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
            businessSerialNumber: this.processParams.businessSerialNumber,
            processInstId: this.processParams.processInstId,
            userId: this.processParams.userId,
            fileCode: this.projectApprove.historyApproveFileId,
            historyFlag: this.projectApprove.historyFlag
          }
        })
      }
    },
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs) {
      this.attachmentIds = ids
      this.attachments = attachs
    },
    //创建本单位项目
    createProject () {
      let { href } = this.$router.resolve({
        path: '/groupPlan/projectEdit',
        query: {
          developPackage: 'IS_RD_1',
          projectCategory: 'u',
          demandProjectCode: this.projectInfo.projectBaseInfo.projectCode,
          needAch: '1',
          letterCode: this.entrustLetterInfo.letterCode
        }
      })
      // 打开新的窗口
      window.open(href, '_blank')
    },
    //关闭
    closeFlowEdit () {
      if (this.$route.query.projectCode) {
        this.$router.push({
          path: this.backUrl,
          query: {
            activeTab: 'projectProgress',
            flowPoint: '委托函',
            developPackage: this.developPackage,
            projectCategory: this.projectCategory
          }
        })
      } else {
        window.close()
      }
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
    //回到顶部
    backToTop () {
      document.getElementById('top-head')
        .scrollIntoView({
          behavior: 'smooth'
        })
      this.showBackTop = false
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
  beforeCreate () {},
  beforeMount () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {},
  activated () {}
}
</script>
<style lang='scss' src="./scss/layout.scss" scoped>
.con1{
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
</style>
