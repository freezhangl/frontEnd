<template>
  <div class="change-flow-edit2">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <span class="group-btn" v-if="isEditable">
          <i class="approve-icon svgfont-btn-close" @click="closeFlowEdit"><span class="global-family">关闭</span></i>
          <i class="approve-icon svgfont-btn-detail" @click="viewChangeDetail"><span class="global-family">变更详情</span></i>
          <i class="approve-icon svgfont-btn-save" @click="saveChangeFlow(false)"><span class="global-family">保存</span></i>
          <i class="approve-icon svgfont-btn-submit" @click="submitChangeFlow"><span class="global-family">提交下一处理</span></i>
          <i class="approve-icon svgfont-btn-trace" v-if="this.$route.query.newChange==='false'" @click="processTrace"><span class="global-family">流程跟踪</span></i>
          <i class="approve-icon svgfont-btn-cancellation" v-if="this.$route.query.newChange==='false'" @click="abandonFlow"><span class="global-family">作废</span></i>
        </span>
        <span class="group-btn" v-else><i class="approve-icon svgfont-btn-close" @click="closeFlowEdit"><span class="global-family">关闭</span></i></span>
        <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="project-title">{{changeTitle}}</div>
      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">

        <change-reason ref="change-reason" :receive-data="changeReason">
        </change-reason>

        <project-document-upload
          id="project-doc"
          v-if="docVisible"
          :doc-params="docParams"
          :file-list="attachmentFileList"
          @existAttachmentIds="getDelIds">
        </project-document-upload>

        <div id="basic-info">
          <basicInfo :receive-data="projectBaseInfo">
          </basicInfo>
        </div>

        <div id="property-info">
          <attributeInfoPreview
            v-if="JSON.stringify(projectAttribute) !== '{}'"
            :receive-data="projectBaseInfo"
            :project-attribute="projectAttribute">
          </attributeInfoPreview>
          <attributeInfoPreviewDefault
            :receive-data="projectBaseInfo"
            v-else>
          </attributeInfoPreviewDefault>
        </div>

        <div id="team-info">
          <!-- 需求单位 非研发包 -->
          <DSTeamInfoDetail v-if="projectCP !=='' & projectCP === 'ds'" :project-company-list="projectCompanyList" :project-class="projectBaseInfo.projectClass">
          </DSTeamInfoDetail>
          <!-- 需求单位 研发包 -->
          <DGTeamInfoDetail v-if="projectCP !=='' & projectCP === 'dg'" :project-company-list="projectCompanyList">
          </DGTeamInfoDetail>
          <!-- 承担单位 非研发包 -->
          <USTeamInfoDetail v-if="projectCP !=='' & projectCP === 'us'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList">
          </USTeamInfoDetail>
          <!-- 承担单位 研发包 -->
          <UGTeamInfoDetail v-if="projectCP !=='' & projectCP === 'ug'" :project-company-list="projectCompanyList" :project-team-list="projectTeamList">
          </UGTeamInfoDetail>
        </div>

        <div id="project-budget" ref="projectBudget">
          <!-- 需求单位 非研发包 -->
          <DSProjectBudget v-if="projectCP !=='' && projectCP === 'ds'" :project-code="projectCode" :version-no="projectApprove.versionNo">
          </DSProjectBudget>
          <!-- 需求单位 研发包 -->
          <DGProjectBudget v-if="projectCP !=='' && projectCP === 'dg'" :budget-info="costBudgetList">
          </DGProjectBudget>
          <!-- 承担单位 非研发包、研发包 -->
          <UProjectBudget v-if="projectCode && projectCP !=='' && projectCategory==='u'" :budget-info="budgetData">
          </UProjectBudget>
        </div>

        <div id="subproject-info"  ref="subproject">
          <!-- 需求单位 -->
          <DSubprojectInfo
            v-if="projectCategory==='d'"
            :receive-data='subProjectInfoList'
            :project-base-info="projectBaseInfo"
            :version-no="budgetData.versionNo">
          </DSubprojectInfo>
          <!-- 承担单位 -->
          <USubprojectInfo
            v-if="projectCategory==='u'"
            :receive-data='subProjectInfoList'
            :project-base-info="projectBaseInfo"
            :version-no="budgetData.versionNo">
          </USubprojectInfo>
        </div>

        <div id="milestone" v-if="isShowMilestone && projectCP!=='dg'">
          <!-- 需求单位 非研发包 -->
          <DSMilestoneInfo v-if="projectCP === 'ds'" :receive-data="projectMileStoneList">
          </DSMilestoneInfo>
          <!-- 承担单位 非研发包、研发包 -->
          <UMilestoneInfo v-if="projectCategory==='u'" :receive-data="projectMileStoneList">
          </UMilestoneInfo>
        </div>

      </div>
    </div>
    <!-- 提交下一处理组件弹窗 -->
    <next-handle
      :show="nextHandleVis"
      :business-serial-number="approveNo"
      :process-template-code="processTemplateCode"
      @confirmNextHandle="confirmNextHandle"
      @changeNextHandle="closeNextHandle">
    </next-handle>
  </div>
</template>
<script>
import API from '@/serve/API_businessFlow'
import flowAPI from '@/serve/API_flow'
import projectAPI from '@/serve/API_groupPlanProject'
import merge from 'webpack-merge'
import { getStore } from '@/store'
import changeReason from './planAdjustReason'
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
import UProjectBudget from '@/controller/groupPlan/components/budget/UBudget'
import DSubprojectInfo from '@/controller/groupPlan/components/subproject/DSubprojectDetail'
import USubprojectInfo from '@/controller/groupPlan/components/subproject/USubprojectDetail'
import DSMilestoneInfo from '@/controller/groupPlan/components/milestone/DSMilestoneDetail'
import UMilestoneInfo from '@/controller/groupPlan/components/milestone/UMilestoneDetail'

export default {
  name: 'planAdjustFlowEdit',
  data () {
    return {
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
      projectName: '', // 项目名称
      changeTitle: '', //项目流程的标题
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      backUrl: '/groupPlan/projectDetail/' + this.$route.query.projectCode, //关闭后页面跳转地址
      processInstId: null, // 流程实例ID
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      businessType: this.$route.query.businessType,
      businessFormUrl: '/groupPlan/planAdjustFlow/planAdjustFlowEdit', //首页我的草稿跳转URL
      projectCode: this.$route.query.projectCode,
      approveNo: this.$route.query.approveNo || '', //业务流水号，新增页面进入时为空，编辑页面从url中取
      isEditable: false, //用户是否具有编辑权限
      changeReason: '', //变更理由（编辑页面）
      docVisible: false, //附件组件是否显示，等待数据获取到再渲染
      docParams: { //文档资料相关参数
        businessType: this.$route.query.businessType,
        projectCode: this.$route.query.projectCode
      },
      attachmentIds: [], //文档资料编辑后的文档ids
      attachmentFileList: [], //文档资料编辑后的文档
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
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      projectApprove: {},
      showBackTop: false,
      nextHandleVis: false, //提交下一处理组件
      processTemplateCode: null // 流程模板编码接口返回
    }
  },
  components: {
    projectDocumentUpload,
    basicInfo,
    attributeInfoPreview,
    DSTeamInfoDetail,
    DGTeamInfoDetail,
    USTeamInfoDetail,
    UGTeamInfoDetail,
    DSProjectBudget,
    DGProjectBudget,
    UProjectBudget,
    DSubprojectInfo,
    USubprojectInfo,
    DSMilestoneInfo,
    UMilestoneInfo,
    attributeInfoPreviewDefault,
    changeReason
  },
  computed: {
  },
  watch: {
    projectName: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        document.title = val + '计划调整申请'
      }
    }
  },
  created () {
    // 各个区块组件的引入判断
    let isPackage = this.$route.query.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.$route.query.projectCategory + isPackage
    this.changeTitle = '集团统筹项目-需求单位项目计划调整申请'
    if (this.$route.query.newChange === 'true') {
      // 新增计划调整单据时项目信息查询通过projectCode和versionNo查询获取
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
    // 根据项目编码查询最新的流程单据详情--新增
    getDetailByProjectCode () {
      let params = {
        projectCode: this.projectCode,
        businessType: this.$route.query.businessType,
        whetherQueryAttachment: false
      }
      API.queryApprovePre(params)
        .then(res => {
          if (res.projectInfo) {
            this.budgetData.versionNo = res.versionNo
            this.projectApprove.versionNo = res.versionNo
            this.developPackage = res.projectInfo.projectBaseInfo.developPackage
            this.projectCategory = res.projectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
            this.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.projectName = res.projectInfo.projectBaseInfo.projectName
            this.attachmentFileList = res.attachmentFileList
            this.projectBaseInfo = res.projectInfo.projectBaseInfo
            this.projectAttribute = res.projectInfo.projectAttribute
            this.costBudgetList = res.projectInfo.costBudgetList
            this.projectTeamList = res.projectInfo.projectTeamList
            this.projectCompanyList = res.projectInfo.projectCompanyList
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
    // 根据业务流水号获取流程单据详情--编辑
    getDetailByApproveNo () {
      let params = {
        approveNo: this.approveNo
      }
      API.queryApprove(params)
        .then(res => {
          this.attachmentFileList = res.attachmentFileList
          this.docVisible = true
          if (res.projectApproveInfo && res.projectApproveInfo.extendedAttributes) {
            this.projectApprove = res.projectApproveInfo
            let extendsObj = JSON.parse(res.projectApproveInfo.extendedAttributes)
            this.changeReason = extendsObj.changeDescription
            this.projectApprove.historyApproveFileId = res.projectApproveInfo.historyApproveFileId
            this.projectApprove.historyFlag = res.projectApproveInfo.historyFlag
          }
          if (res.projectInfo) {
            this.budgetData.versionNo = res.versionNo
            this.developPackage = res.projectInfo.projectBaseInfo.developPackage
            this.projectCategory = res.projectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
            this.projectCode = res.projectInfo.projectBaseInfo.projectCode
            this.projectName = res.projectInfo.projectBaseInfo.projectName
            this.projectBaseInfo = res.projectInfo.projectBaseInfo
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
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取计划调整流程详细信息失败，请稍后重试！',
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
              message: e.message || '计划调整编辑按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取保存接口的参数：附件的ids，附件
    getDelIds (ids, attachs) {
      this.attachmentIds = ids
      this.attachmentFileList = attachs
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
    //保存
    async saveChangeFlow (confirm = false) {
      if (!confirm && !this.verifyDocument()) { return }
      let changeReason = await this.$refs['change-reason'].validate()
      if (!changeReason) return
      let urlString = '?newChange=false&businessType=' + this.businessType + '&projectCode=' + this.$route.query.projectCode + '&developPackage=' + this.$route.query.developPackage + '&projectCategory=' + this.$route.query.projectCategory
      let params = {
        businessType: this.businessType, // 业务类型
        projectCode: this.projectCode, // 项目编码
        attachmentIdList: this.attachmentIds, // 附件id集合
        extendedAttributes: JSON.stringify({ changeDescription: this.$refs['change-reason'].getChangeReason() }),
        businessFormUrl: this.businessFormUrl + urlString
      }
      if (this.$route.query.newChange !== 'true') {
        params.approveNo = this.$route.query.approveNo
      }
      API.saveApprove(params)
        .then(res => {
          this.approveNo = res.approveNo
          this.processTemplateCode = res.processTemplateCode
          if (this.$route.query.newChange === 'true') {
            // 新建流程保存后，变成编辑
            this.$router.push({
              query: merge(this.$route.query, { 'newChange': 'false', 'approveNo': this.approveNo })
            })
          }
          if (confirm) { //提交下一处理：保存成功后弹出下一步组件
            this.nextHandleVis = true
          } else {
            //提示保存成功是否提交申请
            this.$confirm(' ', '计划调整申请保存成功，是否提交申请?', {
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
              message: e.message || '计划调整流程信息保存失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //提交下一处理
    submitChangeFlow () {
      if (this.verifyDocument()) {
        this.saveChangeFlow(true)
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
            message: '计划调整申请创建成功。',
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
    // 取消下一处理
    closeNextHandle () {
      this.nextHandleVis = false
    },
    //关闭流程信息页面
    closeFlowEdit () {
      this.$router.push({
        path: this.backUrl,
        query: {
          activeTab: 'projectProgress',
          flowPoint: '计划调整流程',
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
    },
    //查看计划调整详情
    viewChangeDetail () {
      let { href } = this.$router.resolve({
        path: '/groupPlan/changeFlow/changeFlowContrastDetails',
        query: {
          approveNo: this.approveNo,
          projectCode: this.projectCode
        }
      })
      // 打开新的窗口
      window.open(href, '_blank')
    },
    // 流程跟踪
    processTrace () {
      // 判断新增/编辑、新增--展示流程跟踪按钮并根据业务流水号获取流程实例ID
      if (this.$route.query.newChange === 'false' && this.approveNo) {
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

  .change-flow-edit2{
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
      overflow: auto;
      min-height: 100vh;
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
