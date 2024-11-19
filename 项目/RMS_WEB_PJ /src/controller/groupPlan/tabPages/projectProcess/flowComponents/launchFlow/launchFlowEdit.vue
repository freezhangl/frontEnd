<template>
  <div class="launch-edit1">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn" v-if="isEditable">
          <i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveLaunchInfo(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" @click="submitLauchInfo"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" v-if="this.$route.query.newLaunch==='false'" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="this.$route.query.newLaunch==='false'" @click="cancellation"><span class="global-family">作废</span></i>
        </span>
        <span class="group-btn" v-else><i class="approve-icon svgfont-btn-close" @click="closeProcessInfo"><span class="global-family">关闭</span></i></span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">{{launchTitle}}</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <div style="background:#fff;" class="write-msg">
          <el-form
            :model="approveTimeForm"
            :rules="approveTimeRule"
            ref="approveTimeForm"
            :label-width="'auto'"
          >
            <el-form-item label="立项评审通过时间：" prop="outLinePassTime">
              <el-date-picker
                v-model="approveTimeForm.outLinePassTime"
                type="date"
                :picker-options="outLinePassTimeOptions"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注：" prop="reason">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model.trim="approveTimeForm.reason"
                maxlength="300"
                show-word-limit></el-input>
            </el-form-item>
          </el-form>
        </div>
        <project-document-upload
          id="project-doc"
          v-if="docVisible"
          :doc-params="docParams"
          :file-list="attachmentFileList"
          @existAttachmentIds="getAttachmentInfo">
        </project-document-upload>

        <div id="basic-info">
          <basicInfo :receive-data="projectBaseInfo"></basicInfo>
        </div>

        <div id="property-info">
          <!-- 属性信息 -->
          <attributeInfoPreview
            v-if="JSON.stringify(projectAttribute) !== '{}'"
            :receive-data="projectBaseInfo"
            :project-attribute="projectAttribute"></attributeInfoPreview>
          <attributeInfoPreviewDefault
            :receive-data="projectBaseInfo"
            v-else></attributeInfoPreviewDefault>
        </div>

        <div id="product-info" v-if="projectCategory!==''&&projectCategory==='u'&&hasProductInfo">
          <product-info-detail
            ref="productInfo"
            :receive-data="projectProductInfoList"></product-info-detail>
        </div>

        <div id="resource-info" v-if="projectCategory!==''&&projectCategory==='u'&&hasResourceInfo">
          <res-info-detail
            ref="resourceInfo"
            :receive-data="projectResourceInfo"></res-info-detail>
        </div>

        <div id="team-info">
          <!-- 需求单位 非研发包 -->
          <DSTeamInfoDetail v-if="projectCP !=='' && projectCP === 'ds'" :project-company-list="projectCompanyList" :project-class="projectBaseInfo.projectClass"></DSTeamInfoDetail>
          <!-- 需求单位 研发包 -->
          <DGTeamInfoDetail v-if="projectCP !=='' && projectCP === 'dg'" :project-company-list="projectCompanyList"></DGTeamInfoDetail>
          <!-- 承担单位 非研发包 -->
          <USTeamInfoDetail v-if="projectCP !=='' && projectCP === 'us'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList"></USTeamInfoDetail>
          <!-- 承担单位 研发包 -->
          <UGTeamInfoDetail v-if="projectCP !=='' && projectCP === 'ug'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList"></UGTeamInfoDetail>
        </div>

        <div id="project-budget" ref="projectBudget">
          <!-- 需求单位 非研发包 -->
          <DSProjectBudget v-if="projectCP !=='' && projectCP === 'ds'" :project-code="projectCode" :version-no="projectApprove.versionNo"></DSProjectBudget>
          <!-- 需求单位 研发包 -->
          <DGProjectBudget v-if="projectCP !=='' && projectCP === 'dg'" :budget-info="costBudgetList"></DGProjectBudget>
          <!-- 承担单位 非研发包、研发包 -->
          <!-- <UProjectBudget v-if="projectCode && projectCP !=='' && projectCategory==='u'" :budget-info="budgetData"></UProjectBudget> -->
          <!-- 承担单位 总分、分总模式 -->
          <UBudgetDetail v-if="projectCode && projectCP !=='' && projectCategory==='u'" :budget-info="budgetData"></UBudgetDetail>
        </div>

        <div id="subproject-info"  ref="subproject">
          <!-- 需求单位 -->
          <DSubprojectInfo
            v-if="projectCategory==='d'"
            :receive-data='subProjectInfoList'
            :project-base-info="projectBaseInfo"
            :version-no="budgetData.versionNo"></DSubprojectInfo>
          <!-- 承担单位 -->
          <USubprojectInfo
            v-if="projectCategory==='u'"
            :receive-data='subProjectInfoList'
            :project-base-info="projectBaseInfo"
            :version-no="budgetData.versionNo"></USubprojectInfo>
        </div>

        <div id="milestone" v-if="isShowMilestone && projectCP!=='dg'">
          <!-- 需求单位 非研发包 -->
          <DSMilestoneInfo v-if="projectCP === 'ds'" :receive-data="projectMileStoneList"></DSMilestoneInfo>
          <!-- 承担单位 非研发包、研发包 -->
          <UMilestoneInfo v-if="projectCategory==='u'" :receive-data="projectMileStoneList"></UMilestoneInfo>
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
import { getStore } from '@/store'
import API from '@/serve/API_businessFlow'
import flowAPI from '@/serve/API_flow'
import projectAPI from '@/serve/API_groupPlanProject'
import projectDocumentUpload from '@/controller/groupPlan/components/attachments/index'
import basicInfo from '@/controller/groupPlan/components/basic/detail'
import attributeInfoPreview from '@/controller/groupPlan/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '@/controller/groupPlan/components/attributeInfo/detailDefault'
import DSTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DSTeamInfo/DSTeamInfoDetail'
import DGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/DGTeamInfo/DGTeamInfoDetail'
import USTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/USTeamInfo/USTeamInfoDetail'
import UGTeamInfoDetail from '@/controller/groupPlan/components/teamInfo/UGTeamInfo/UGTeamInfoDetail'
import DSProjectBudget from '@/controller/groupPlan/components/budget/DSBudget'
import DGProjectBudget from '@/controller/groupPlan/components/budget/DGBudget'
import UBudgetDetail from '@/controller/groupPlan/components/budget/UBudgetDetail'
import DSubprojectInfo from '@/controller/groupPlan/components/subproject/DSubprojectDetail'
import USubprojectInfo from '@/controller/groupPlan/components/subproject/USubprojectDetail'
import DSMilestoneInfo from '@/controller/groupPlan/components/milestone/DSMilestoneDetail'
import UMilestoneInfo from '@/controller/groupPlan/components/milestone/UMilestoneDetail'
import ProductInfoDetail from '@/controller/groupPlan/components/productInfo/productInfoDetail.vue'
import ResInfoDetail from '@/controller/groupPlan/components/resourceInfo/resInfoDetail.vue'
import { AddProductAndResource } from '@/common/flowCommonMixins'

export default {
  mixins: [AddProductAndResource],
  data () {
    var validOutLinePassTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择立项评审通过时间'))
      }
      // 获取零点时间戳
      let timestamp = new Date(new Date(value)
        .toLocaleDateString())
        .getTime()
      if (timestamp > Date.now()) {
        callback(new Error('不能选择当天之后的日期'))
      }
      if (this.projectBaseInfo.planFinishTime && timestamp > this.projectBaseInfo.planFinishTime) {
        callback(new Error('立项评审通过时间不能晚于计划结项时间'))
      }
      callback()
    }
    return {
      launchTitle: '', //项目流程的标题
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      businessFormUrl: '/groupPlan/launchFlow/launchFlowEdit', //首页我的草稿跳转URL
      backUrl: '/groupPlan/projectDetail/' + this.$route.query.projectCode, //关闭后页面跳转地址
      processInstId: null, // 流程实例ID
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      navMenus: [
        {
          name: '文档资料',
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
        { name: '产品信息', id: 'product-info' },
        { name: '资源信息', id: 'resource-info' },
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
          id: 'subproject-info'
        },
        {
          name: '里程碑',
          id: 'milestone'
        }
      ],
      approveNo: this.$route.query.approveNo,
      projectCode: this.$route.query.projectCode,
      projectName: '', // 项目名称
      businessType: this.$route.query.businessType,
      isNewLaunch: this.$route.query.newLaunch,
      isEditable: false, //用户是否具有编辑权限
      projectApprove: {}, //表单信息
      loading: false,
      approveTimeForm: { // 立项评审通过时间
        outLinePassTime: null,
        reason: ''
      },
      outLinePassTimeOptions: {
        disabledDate: time => {
          if (this.projectBaseInfo.planFinishTime) {
            return (
              time.getTime() > this.projectBaseInfo.planFinishTime || time.getTime() > Date.now()
            )
          }
          return (
            time.getTime() > Date.now()
          )
        }
      },
      approveTimeRule: {
        outLinePassTime: [
          { required: true, validator: validOutLinePassTime, trigger: ['change', 'blur'] }
        ]
      },
      docParams: { // 附件上传携带参数
        businessType: this.$route.query.businessType,
        projectCode: this.$route.query.projectCode
      },
      docVisible: false, //附件组件是否显示，等待数据获取到再渲染
      attachmentFileList: [], // 单据附件列表
      attachmentIds: [], //文档资料编辑后的文档ids
      attachments: [], //文档资料编辑后的文档
      projectBaseInfo: {}, // 项目基本信息
      projectAttribute: {}, // 属性信息
      projectCompanyList: [], // 团队信息 - 公司列表
      projectTeamList: [], // 团队信息-承担单位项目观察员和专家
      costBudgetList: [], // 项目预算
      budgetData: {
        isEdit: false,
        projectCode: this.$route.query.projectCode,
        versionNo: ''
      },
      subProjectInfoList: [], //子项目信息
      isShowMilestone: true,
      projectMileStoneList: [], // 里程碑信息
      processTemplateCode: null, // 流程模板编码接口返回
      submitNextHandleInfo: {}, //提交下一审批表单数据
      nextHandleVis: false, // 提交下一处理人组件默认不展示
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      whetherQueryAttachment: false
    }
  },
  components: {
    projectDocumentUpload,
    basicInfo,
    DSTeamInfoDetail,
    DGTeamInfoDetail,
    USTeamInfoDetail,
    UGTeamInfoDetail,
    DSProjectBudget,
    DGProjectBudget,
    UBudgetDetail,
    DSubprojectInfo,
    USubprojectInfo,
    DSMilestoneInfo,
    UMilestoneInfo,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    ProductInfoDetail,
    ResInfoDetail
  },
  computed: {
  },
  watch: {
    projectName: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        document.title = val + '立项申请'
      }
    }
  },
  created () {
    // 各个区块组件的引入判断，根据this.$route.query
    let isPackage = this.$route.query.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.$route.query.projectCategory + isPackage
    switch (this.projectCP) {
      case 'dg':
        this.launchTitle = ''
        break
      case 'ds':
        this.launchTitle = '集团统筹项目-需求单位项目立项申请'
        break
      case 'ug':
        this.launchTitle = '集团统筹项目-承担单位项目立项申请（一般支撑）'
        break
      case 'us':
        this.launchTitle = '集团统筹项目-承担单位项目立项申请（重大重点）'
        break
    }
    // 业务单据类型判断
    switch (this.$route.query.projectCategory) {
      case 'd':
        this.businessType = 'BT-DEMAND-APPROVE'
        this.deleteNavItem('product-info')
        this.deleteNavItem('resource-info')
        break
      case 'u':
        this.businessType = 'BT-UNDERTAKER-APPROVE'
        break
    }

    if (this.$route.query.newLaunch === 'true') {
      // 新增立项单据时项目信息查询通过projectCode和versionNo查询获取
      if (this.$route.query.bringFiles === '1') {
        this.whetherQueryAttachment = true
      } else {
        this.whetherQueryAttachment = false
      }
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
  mounted () {
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
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
    // 根据项目编码查询最新的流程单据详情
    getDetailByProjectCode () {
      let params = {
        projectCode: this.$route.query.projectCode,
        businessType: this.$route.query.businessType,
        whetherQueryAttachment: this.whetherQueryAttachment
      }
      API.queryApprovePre(params)
        .then(res => {
          this.budgetData.versionNo = res.versionNo
          this.projectApprove.versionNo = res.versionNo
          this.attachmentFileList = res.attachmentFileList
          this.projectBaseInfo = res.projectInfo.projectBaseInfo
          this.projectName = res.projectInfo.projectBaseInfo.projectName
          this.projectAttribute = res.projectInfo.projectAttribute
          this.costBudgetList = res.projectInfo.costBudgetList
          this.projectCompanyList = res.projectInfo.projectCompanyList
          this.projectTeamList = res.projectInfo.projectTeamList
          this.subProjectInfoList = res.projectInfo.subProjectInfoList
          this.projectMileStoneList = res.projectInfo.projectMileStoneList
          if (res.projectInfo.projectMileStoneList === null || res.projectInfo.projectMileStoneList.length === 0) {
            this.isShowMilestone = false
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
          this.docVisible = true

          if (this.projectCategory === 'u') {
            //产品信息
            this.projectProductInfoList = res.projectInfo.projectProductInfoList || []
            this.hasProductInfo = this.projectProductInfoList && this.projectProductInfoList.length > 0
            if (!this.hasProductInfo) {
              this.deleteNavItem('product-info')
            }
            //资源信息
            this.projectResourceInfo = res.projectInfo.projectResourceInfo || {}
            this.hasResourceInfo = !!((this.projectResourceInfo && JSON.stringify(this.projectResourceInfo) !== '{}'))
            if (!this.hasResourceInfo) {
              this.deleteNavItem('resource-info')
            }
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取立项流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 根据业务流水号获取流程单据详情
    getDetailByApproveNo () {
      let params = {
        approveNo: this.$route.query.approveNo
      }
      API.queryApprove(params)
        .then(res => {
          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            let extendsObj = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.approveTimeForm.outLinePassTime = this.formatDate(extendsObj.outLinePassTime)
            this.approveTimeForm.reason = extendsObj.reason
          }
          this.budgetData.versionNo = res.versionNo
          this.projectApprove = res.projectApproveInfo
          this.attachmentFileList = res.attachmentFileList
          this.projectBaseInfo = res.projectInfo.projectBaseInfo
          this.projectName = res.projectInfo.projectBaseInfo.projectName
          this.projectAttribute = res.projectInfo.projectAttribute
          this.costBudgetList = res.projectInfo.costBudgetList
          this.projectCompanyList = res.projectInfo.projectCompanyList
          this.projectTeamList = res.projectInfo.projectTeamList
          this.subProjectInfoList = res.projectInfo.subProjectInfoList
          this.projectMileStoneList = res.projectInfo.projectMileStoneList
          if (res.projectInfo.projectMileStoneList === null || res.projectInfo.projectMileStoneList.length === 0) {
            this.isShowMilestone = false
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
          this.docVisible = true

          if (this.projectCategory === 'u') {
            //产品信息
            this.projectProductInfoList = res.projectInfo.projectProductInfoList || []
            this.hasProductInfo = this.projectProductInfoList && this.projectProductInfoList.length > 0
            if (!this.hasProductInfo) {
              this.deleteNavItem('product-info')
            }
            //资源信息
            this.projectResourceInfo = res.projectInfo.projectResourceInfo || {}
            this.hasResourceInfo = !!((this.projectResourceInfo && JSON.stringify(this.projectResourceInfo) !== '{}'))
            if (!this.hasResourceInfo) {
              this.deleteNavItem('resource-info')
            }
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取立项流程详细信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 判断顶部编辑按钮是否展示
    isShowEditBtn () {
      const params = {
        projectCode: this.$route.query.projectCode,
        permissionCode: '03' // 权限编码-根据字典表设置
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
    // 获取附件上传的附件ids
    getAttachmentInfo (ids, fileList) {
      this.attachmentIds = ids
      this.attachments = fileList
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
          message: '请上传' + needUplodTypes.toString() + '附件!'
        })
        return false
      }
    },
    // 保存流程立项编辑信息
    saveLaunchInfo (confirm = false) {
      if (!this.verifyDocument()) { return }
      if (this.approveTimeForm.outLinePassTime !== null) {
        this.approveTimeForm.outLinePassTime = new Date(this.approveTimeForm.outLinePassTime)
          .getTime()
      }
      let urlString = '?newLaunch=false&businessType=' + this.businessType + '&projectCode=' + this.$route.query.projectCode + '&developPackage=' + this.$route.query.developPackage + '&projectCategory=' + this.$route.query.projectCategory
      let params = {
        businessType: this.businessType, // 业务类型
        projectCode: this.projectCode, // 项目编码
        attachmentIdList: this.attachmentIds, // 附件id集合
        extendedAttributes: JSON.stringify(this.approveTimeForm), // 单据表单立项时间通过时间
        businessFormUrl: this.businessFormUrl + urlString
      }
      if (this.$route.query.newLaunch !== 'true') {
        params.approveNo = this.$route.query.approveNo
      }
      this.$refs['approveTimeForm'].validate(valid => {
        if (valid) {
          API.saveApprove(params)
            .then(res => {
              this.approveNo = res.approveNo
              this.processTemplateCode = res.processTemplateCode
              this.$router.push({
                query: merge(this.$route.query, { 'newLaunch': 'false', 'approveNo': this.approveNo })
              })
              if (confirm) { //提交下一处理：保存成功后弹出下一步组件
                this.nextHandleVis = true
              } else {
                // 提示保存成功是否提交申请
                this.$confirm(' ', '立项申请保存成功，是否提交申请?', {
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
                this.$refs['approveTimeForm'].clearValidate()
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
    // 提交下一处理
    submitLauchInfo () {
      if (this.verifyDocument()) { this.saveLaunchInfo(true) }
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
            message: '立项申请创建成功。'
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
    // 流程跟踪
    processTrace () {
      // 判断新增/编辑、新增--展示流程跟踪按钮并根据业务流水号获取流程实例ID
      if (this.$route.query.newLaunch === 'false' && this.approveNo) {
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
    // 作废流程编辑
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
          API.deleteApprove({ approveNo: this.approveNo })
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '作废成功。'
              })
              this.closeProcessInfo()
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
    // 关闭流程信息页面
    closeProcessInfo () {
      this.$router.push({
        path: this.backUrl,
        query: {
          activeTab: 'projectProgress',
          flowPoint: '立项流程',
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
    }
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

.launch-edit1{
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
      font-family: inherit;
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
        font-family: inherit;
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
      .write-msg{
        padding: 20px 30px 30px;
        margin-bottom: 30px;
        /deep/{
          .el-textarea {
            textarea{
              border: 1px solid #E5E5E5;
              border-radius: 2px;
            }
            .el-input__count{
              line-height: 12px;
              right: 18px;
            }
          }
        }
      }
    }
  }
</style>
