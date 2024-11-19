<template>
  <!-- 新增/编辑 -->
  <div class="entrustment-flow-edit entrustment-flow">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn" v-if="isEditable">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowEdit"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveChangeFlow(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" @click="submitChangeFlow"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" v-if="this.$route.query.addEntrust==='false'" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="this.$route.query.addEntrust==='false'" @click="abandonFlow"><span class="global-family">作废</span></i>
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
        <div id="project-doc">
          <project-document-upload
            v-if="docVisible"
            :doc-params="docParams"
            :file-list="attachmentFileList"
            @existAttachmentIds="getDelIds"></project-document-upload>
        </div>
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
import merge from 'webpack-merge'
import { getStore } from '@/store'
import projectAPI from '@/serve/API_groupPlanProject'
import API from '@/serve/API_businessFlow'
import flowAPI from '@/serve/API_flow'
import baseInfo from './component/baseInfo'
import budgetInfo from './component/budgetInfo'
import achievementEdit from '@/controller/groupPlan/components/subproject/achievement/entrustmentAchievementEdit'
import projectDocumentUpload from '@/controller/groupPlan/components/attachments/index'
import BigNumber from 'bignumber.js'
export default {
  components: { baseInfo, achievementEdit, projectDocumentUpload, budgetInfo },
  data () {
    return {
      addvisable: false,
      backUrl: '/groupPlan/projectDetail/' + this.$route.query.projectCode,
      navIdx: 0,
      showBackTop: false,
      navMenus: [
        { name: '基本信息', id: 'basic-info' },
        { name: '预期成果', id: 'task-ach' },
        { name: '项目预算', id: 'project-budget' },
        { name: '文档资料', id: 'project-doc' }
      ],
      projectCode: this.$route.query.projectCode,
      businessType: this.$route.query.businessType,
      docParams: { //文档资料相关参数
        businessType: this.$route.query.businessType,
        projectCode: this.$route.query.projectCode
      },
      ruleForm: {
        projectName: '', //项目名称
        projectManager: '', //项目经理
        projectAchievementList: [] //成果列表
      },
      list: [],
      projectInfo: {},
      projectBudget: [], // 项目预算
      projectAchievementList: [], // 预期成果
      attachmentIds: [], //文档资料编辑后的文档ids
      attachmentFileList: [], //文档资料编辑后的文档
      clearFlag: true, //true 触发滚动
      docVisible: false,
      isEditable: false, //用户是否具有编辑权限
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      entrustLetterInfo: {}, // 委托函详细信息
      projectCompanyList: {},
      projectApprove: {},
      businessFormUrl: '/groupPlan/entrustmentFlow/entrustmentFlowEdit', //首页我的草稿跳转URL
      nextHandleVis: false, //提交下一处理组件
      processInstId: '',
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      approveNo: this.$route.query.approveNo || '', //业务流水号，新增页面进入时为空，编辑页面从url中取
      processTemplateCode: null // 流程模板编码接口返回
    }
  },
  computed: {},
  watch: {},
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
          API.deleteApprove({ approveNo: this.approveNo })
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
    // 取消下一处理
    closeNextHandle () {
      this.nextHandleVis = false
    },
    // 流程跟踪
    processTrace () {
      // 判断新增/编辑、新增--展示流程跟踪按钮并根据业务流水号获取流程实例ID
      if (this.$route.query.addEntrust === 'false' && this.approveNo) {
        // 流程跟踪查询需要从流程接口查询processInstId
        flowAPI.getBusinessProcessInst(this.approveNo)
          .then(res => {
            this.processInstId = res.processInstId
            this.$router.push({
              path: '/processTrace',
              query: {
                businessSerialNumber: this.approveNo,
                processInstId: this.processInstId,
                userId: this.userId
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
      }
    },
    //提交下一处理 - 确认
    confirmNextHandle (obj) {
      let submitNextHandleInfo = {
        approveNo: this.approveNo,
        nextActivityDefId: obj.nextLinkShow,
        participantList: obj.participants
      }
      API.submitApprove(submitNextHandleInfo)
        .then(res => {
          this.$message({
            message: '委托函申请创建成功。',
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
    // 获取保存接口的参数：附件的ids，附件、流程id
    getDelIds (ids, attachs) {
      this.attachmentIds = ids
      this.attachmentFileList = attachs
    },
    //查询表单详情--编辑
    async queryChangeApprove () {
      let params = {
        approveNo: this.approveNo
      }
      API.queryChangeApprove(params)
        .then(res => {
          this.entrustLetterInfo = res.entrustLetterInfo
          this.projectBudget = res.projectInfo.costBudgetList
          this.projectAchievementList = res.projectInfo.projectAchievementList
          this.projectMileStones = res.projectInfo.projectMileStones
          this.attachmentFileList = res.attachmentFileList
          this.projectInfo = res.projectInfo
          if (res.entrustLetterInfo) {
            this.projectAchievementList = res.entrustLetterInfo.entrustLetterAchievementList
          }
          this.docVisible = true
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取委托函详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 根据项目编码查询最新的委托函详情--新增
    getDetailByProjectCode () {
      let params = {
        projectCode: this.projectCode,
        businessType: this.$route.query.businessType,
        whetherQueryAttachment: false
      }
      API.queryApprovePre(params)
        .then(res => {
          this.projectApprove.versionNo = res.versionNo
          this.entrustLetterInfo = res.entrustLetterInfo
          this.projectBudget = res.projectInfo.costBudgetList
          this.projectAchievementList = res.projectInfo.projectAchievementList
          this.projectMileStones = res.projectInfo.projectMileStones
          this.projectCompanyList = res.projectInfo.projectCompanyList
          this.attachmentFileList = res.attachmentFileList
          this.projectInfo = res.projectInfo
          if (res.entrustLetterInfo) {
            this.projectAchievementList = res.entrustLetterInfo.entrustLetterAchievementList
          }
          this.docVisible = true
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
    // 校验文档必填项
    verifyDocument () {
      let needUplodTypes = []
      let haveFileTypes = [] // 保存必填项中有文件的类型
      let attachments = this.attachmentFileList.filter(item => {
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
    //提交下一处理
    submitChangeFlow (value = true) {
      if (this.verifyDocument() && this.$refs.baseInfo.submitForm()) {
        this.saveChangeFlow(true, value)
      }
    },
    // 判断预算是否大于100
    async entrustLetterBudget (confirm, value) {
      if (!confirm || value) {
        // if (confirm) return Promise.resolve(confirm)
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
    //保存
    async saveChangeFlow (confirm = false, value) {
      if (!confirm && !this.verifyDocument()) { return }
      let baseInfo = await this.$refs['baseInfo'].submitForm()
      if (!baseInfo) return
      if (!this.projectAchievementList.length) return this.$message.warning('请选择至少一个成果')

      let urlString = '?addEntrust=false&businessType=' + this.businessType + '&projectCode=' + this.$route.query.projectCode + '&developPackage=' + this.$route.query.developPackage + '&projectCategory=' + this.$route.query.projectCategory
      this.entrustLetterInfo.achievementCodeList = this.projectAchievementList.map(item => { return item.achievementCode })
      let params = {
        businessType: this.businessType, // 业务类型
        projectCode: this.projectCode, // 项目编码
        attachmentIdList: this.attachmentIds, // 附件id集合
        entrustLetterInfo: this.entrustLetterInfo,
        businessFormUrl: this.businessFormUrl + urlString
      }
      if (this.$route.query.addEntrust !== 'true') {
        params.approveNo = this.$route.query.approveNo
      }
      // console.log(params)
      this.entrustLetterBudget(confirm, value)
        .then(r => {
          API.saveApprove(params)
            .then(res => {
              this.approveNo = res.approveNo
              this.processTemplateCode = res.processTemplateCode
              if (this.$route.query.addEntrust === 'true') {
                // 新建流程保存后，变成编辑
                this.$router.push({
                  query: merge(this.$route.query, { 'addEntrust': 'false', 'approveNo': this.approveNo })
                })
              }
              if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                this.nextHandleVis = true
              } else {
                //提示保存成功是否提交申请
                this.$confirm(' ', '委托函申请保存成功，是否提交申请?', {
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
                // 保存清空校验
                this.$refs['baseInfo'].submitForm()
              }
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '委托函信息保存失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
    },
    //关闭
    closeFlowEdit () {
      this.$router.push({
        path: this.backUrl,
        query: {
          activeTab: 'projectProgress',
          flowPoint: '委托函',
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
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
    },
    // 判断顶部编辑按钮是否展示
    isShowEditBtn () {
      const params = {
        projectCode: this.$route.query.projectCode,
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
    // 根据业务流水号获取流程单据详情--编辑
    getDetailByApproveNo () {
      let params = {
        approveNo: this.approveNo
      }
      API.queryApprove(params)
        .then(res => {
          this.projectInfo = res.projectInfo
          this.entrustLetterInfo = res.entrustLetterInfo
          this.projectBudget = res.projectInfo.costBudgetList
          this.attachmentFileList = res.attachmentFileList
          if (res.entrustLetterInfo) {
            this.projectAchievementList = res.entrustLetterInfo.entrustLetterAchievementList
          }
          this.docVisible = true
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
    }
  },
  created () {
    if (this.$route.query.addEntrust === 'true') {
      // 新增委托函单据时项目信息查询通过projectCode和versionNo查询获取
      this.getDetailByProjectCode()
    } else {
      // 除新增以外的通过业务流水号查询获取项目信息
      this.getDetailByApproveNo()
    }
    this.isShowEditBtn()

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
  mounted () {},
  beforeCreate () {},
  beforeMount () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {},
  activated () {}
}
</script>
<style lang='scss' scoped src="./scss/layout.scss">
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
</style>
