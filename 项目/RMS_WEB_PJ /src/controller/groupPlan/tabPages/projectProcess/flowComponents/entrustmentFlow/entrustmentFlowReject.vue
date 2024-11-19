<template>
  <!-- 驳回 -->
  <div class="entrustment-flow-reject entrustment-flow">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowApprove"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-detail" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveChangeFlow(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" v-if="submitBtnVisible" @click="submitChangeFlow"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="cancelBtnVisible" @click="abandonFlow"><span class="global-family">作废</span></i>
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
            ref="baseInfo"
            :data="entrustLetterInfo"
            :project-info="projectInfo"
            view-type="write"></base-info>
        </div>
        <!-- 预期成果 -->
        <achievementEdit
          id="task-ach"
          :rule-form='ruleForm'
          :list='list'
          :addvisable='addvisable'
          :parent-code='projectCode'
          :receive-data='projectAchievementList'
          type='list'></achievementEdit>
        <!-- 项目预算 -->
        <budget-info :budget-data="entrustLetterInfo" :receive-data='projectAchievementList' id="project-budget"></budget-info>
        <!-- 文档资料 -->
        <project-document-upload
          v-if="docVisible"
          id="project-doc"
          :doc-params="docParams"
          :file-list="attachments"
          @existAttachmentIds="getDelIds"></project-document-upload>
        <!-- 审批意见 -->
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
import API from '@/serve/API_businessFlow'
import param from '@/const/param'
import { getStore } from '@/store'
import flowAPI from '@/serve/API_flow'
import merge from 'webpack-merge'
import baseInfo from './component/baseInfo'
import budgetInfo from './component/budgetInfo'
import achievementEdit from '@/controller/groupPlan/components/subproject/achievement/entrustmentAchievementEdit'
import projectDocumentUpload from '@/controller/groupPlan/components/attachments/index'
import { Message } from 'element-ui'
import BigNumber from 'bignumber.js'
export default {
  components: { baseInfo, achievementEdit, projectDocumentUpload, budgetInfo },
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
    } else {
      next()
    }
  },
  data () {
    return {
      addvisable: false,
      backUrl: '/projectInfo/projectInfo-detail/' + this.$route.query.projectCode,
      navIdx: 0,
      showBackTop: false,
      navMenus: [
        { name: '基本信息', id: 'basic-info' },
        { name: '预期成果', id: 'task-ach' },
        { name: '项目预算', id: 'project-budget' },
        { name: '文档资料', id: 'project-doc' },
        { name: '审批意见', id: 'approved-con' }
      ],
      docParams: { //文档资料相关参数
        businessType: 'BT-DEMAND-ENTRUST-LETTER',
        approveNo: this.$route.query.approveNo || ''
      },
      ruleForm: {
        projectName: '', //项目名称
        projectManager: '', //项目经理
        projectAchievementList: [] //成果列表
      },
      list: [],
      businessType: 'BT-DEMAND-ENTRUST-LETTER',
      costBudgetList: [], // 项目预算
      projectAchievementList: [], // 预期成果
      attachmentIds: [], //文档资料编辑后的文档ids
      attachments: [], //文档资料编辑后的文档
      docVisible: false, // 获取到数据在进行渲染
      approvalOpinionList: [], // 审批意见
      isShowApprove: true, //是否显示审批组件
      projectApprove: {}, //表单信息
      projectCode: '', //项目编码，通过详情-基本信息拿到
      projectName: '', // 项目名称
      projectInfo: {},
      entrustLetterInfo: { // 基本信息
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
      clearFlag: true, //true 触发滚动
      submitBtnVisible: true, // 提交处理按钮显示与否
      cancelBtnVisible: true, // 作废按钮显示与否
      nextHandleVis: false, //提交下一处理组件
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      approveNo: this.$route.query.approveNo || '' //业务流水号，新增页面进入时为空，编辑页面从url中取
    }
  },
  computed: {},
  watch: {
    projectCode: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.projectCode = val
        this.docParams.projectCode = val
      }
    },
    projectName: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        document.title = val + '委托函申请'
      }
    },
    developPackage: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.developPackage = val
      }
    },
    projectCategory: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        // 各个区块组件的引入判断
        let isPackage = this.developPackage === 'IS_RD_0' ? 's' : 'g'
        this.projectCP = val + isPackage
      }
    }
  },
  created () {
    document.title = '委托函流程驳回'

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
  methods: {
    getAvgLaborCostAndStaffTime (staffTime, avgLaborCost) { //计算自有人工乘上单位人力成本
      let x = new BigNumber(staffTime)
      let y = new BigNumber(avgLaborCost)
      //   .toFormat(8), '自有人工乘上单位人力成本')
      let res = x.times(y)
        .toFormat(6)
      res = this.delcommafy(res)
      return res
    },
    delcommafy (num) {
      num = num.replace(/,/gi, '')
      return num
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
    //查询表单详情
    getDetailByApproveNo () {
      let params = {
        approveNo: this.processParams.businessSerialNumber
      }
      API.queryApprove(params)
        .then(res => {
          this.attachments = res.attachmentFileList
          this.docVisible = true
          this.projectApprove.historyApproveFileId = res.projectApproveInfo.historyApproveFileId
          this.projectApprove.historyFlag = res.projectApproveInfo.historyFlag
          if (res.projectInfo) {
            this.entrustLetterInfo = res.entrustLetterInfo
            this.developPackage = res.projectInfo.projectBaseInfo.developPackage
            this.projectCategory = res.projectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
            this.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.projectName = res.entrustLetterInfo.projectName
            this.costBudgetList = res.projectInfo.costBudgetList
            this.projectInfo = res.projectInfo
          }
          if (res.entrustLetterInfo && res.entrustLetterInfo.entrustLetterAchievementList) {
            this.projectAchievementList = res.entrustLetterInfo.entrustLetterAchievementList
          }
          this.approvalOpinionList = res.approveRecord ? res.approveRecord.approvals : []
          this.$router.push({
            query: merge(this.$route.query, { 'projectCode': this.projectCode })
          })
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
      flowAPI.getProcessInstDetailById(this.processParams.processInstId)
        .then(res => {
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
          API.deleteApprove({ approveNo: this.processParams.businessSerialNumber })
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功!'
              })
              setTimeout(() => {
                this.closeFlowApprove()
              }, 500)
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
    //流程跟踪
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
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs) {
      this.attachmentIds = ids
      this.attachments = attachs
    },
    // 判断预算是否大于100
    async entrustLetterBudget (confirm, value) {
      if (!confirm || value) {
        if (this.entrustLetterInfo.entrustLetterBudget.subtotal > 100) {
          return this.$confirm('委托函预算金额超过100万，请先经过部门内部决策后再下达', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning',
            customClass: 'self-message-box-delete',
            cancelButtonClass: 'self-message-box-delete-cancel',
            confirmButtonClass: 'self-message-box-delete-confirm'
          })
            .then(() => {
              return Promise.resolve(true)
            })
            .catch(() => {
              return Promise.resolve(true)
            // return Promise.resolve(true)
            })
        } else {
          return Promise.resolve(true)
        }
      }
    },
    // 保存流程立项编辑信息
    async saveChangeFlow (confirm = false, value) {
      if (!confirm && !this.verifyDocument()) { return }
      let baseInfo = await this.$refs['baseInfo'].submitForm()
      if (!baseInfo) return
      if (!this.projectAchievementList.length) return this.$message.warning('请选择至少一个成果')
      let urlString = '?newChange=false&businessType=' + this.businessType + '&projectCode=' + this.projectCode + '&developPackage=' + this.developPackage + '&projectCategory=' + this.projectCategory
      this.entrustLetterInfo.achievementCodeList = this.projectAchievementList.map(item => { return item.achievementCode })
      let params = {
        approveNo: this.processParams.businessSerialNumber,
        businessType: this.businessType, // 业务类型
        projectCode: this.projectCode, // 项目编码
        processInstId: this.processParams.processInstId, // 流程实例ID
        attachmentIdList: this.attachmentIds, // 附件id集合
        entrustLetterInfo: this.entrustLetterInfo,
        businessFormUrl: '/entrustmentFlow/entrustmentFlowEdit' + urlString
      }
      this.entrustLetterBudget(confirm, value)
        .then(r => {
          API.saveApprove(params)
            .then(res => {
              this.processParams.businessSerialNumber = res.approveNo
              if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                this.nextHandleVis = true
              } else {
                // 提示保存成功是否提交申请
                this.$confirm(' ', '委托函申请保存成功，是否提交申请?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  showClose: false,
                  customClass: 'self-message-box-delete',
                  cancelButtonClass: 'self-message-box-delete-cancel',
                  confirmButtonClass: 'self-message-box-delete-confirm'
                })
                  .then(() => {
                    this.submitChangeFlow(false)
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消提交申请'
                    })
                  })
              }
              // 保存清空校验
              this.$refs['baseInfo'].submitForm()
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
        })
    },
    // 提交下一处理
    submitChangeFlow (value = true) {
      if (this.verifyDocument()) {
        this.saveChangeFlow(true, value)
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
          message: '请上传' + needUplodTypes.toString()
            .replace('附件', '') + '附件!'
        })
        return false
      }
    },
    // 获取下一步处理数据并确定提交
    confirmNextHandle (val) {
      this.submitNextHandleInfo = val
      this.submitProjectApprove()
    },
    // 驳回后再次提交审批
    submitProjectApprove () {
      let params = {
        workItemId: this.processParams.workItemId,
        nextActivityDefId: this.submitNextHandleInfo.nextLinkShow,
        participantList: this.submitNextHandleInfo.participants,
        approveNo: this.processParams.businessSerialNumber
      }
      API.resubmitApprove(params)
        .then(res => {
          this.$message({
            message: '委托函申请创建成功。',
            type: 'success',
            showClose: true
          })
          this.nextHandleVis = false
          this.$refs['baseInfo'].submitForm()
          setTimeout(() => {
            this.closeFlowApprove()
          }, 500)
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
    // 取消下一处理，关闭组件
    closeNextHandle () {
      this.nextHandleVis = false
    },
    //查看委托函详情
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
    // 关闭页面
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
  mounted () {
    this.getFlowBtnList()
    this.getProcessInstDetailById()
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
<style  lang="scss" scoped src="./scss/layout.scss">
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
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
</style>
