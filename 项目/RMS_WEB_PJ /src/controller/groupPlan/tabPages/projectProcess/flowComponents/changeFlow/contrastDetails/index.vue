<template>
  <div class="contrast-detail">
    <el-row>
      <el-col :span="12">
        <el-scrollbar ref="leftScroll" :class="{'change-height':isChange}">
          <div class="detail-wrapper">
            <basicInfo
              id="basic-info-left"
              ref="basic-left"
              :show-expand="false"
              :receive-data="leftProjectInfo.projectBaseInfo"
              :diff-props="baseInfoDiff"
              @changeExpand="changeExpand(arguments,'basic','Left')"></basicInfo>

            <!-- <div id="property-info-left" ref="property-left" style="background:#fff;height:50px;margin-bottom: 20px;">属性信息迭代二</div> -->
            <attributeInfoPreview
              v-if="leftProjectInfo.projectAttribute"
              id="property-info-left"
              ref="property-left"
              :show-expand="false"
              :receive-data="leftProjectInfo.projectBaseInfo"
              :project-attribute="leftProjectInfo.projectAttribute"
              @formPreviewHasRendered="attriHasRendered"></attributeInfoPreview>
            <attributeInfoPreviewDefault
              id="property-info-left"
              ref="property-left"
              :show-expand="false"
              :receive-data="leftProjectInfo.projectBaseInfo"
              v-if="!leftProjectInfo.projectAttribute"
              @formPreviewHasRendered="attriHasRendered"></attributeInfoPreviewDefault>

            <product-info-detail
              v-if="projectCategory!==''&&projectCategory==='u'&&hasProductInfoLeft"
              ref="productInfo-left"
              :receive-data="leftProjectInfo.projectProductInfoList"></product-info-detail>

            <res-info-detail
              v-if="projectCategory!==''&&projectCategory==='u'&&hasResourceInfoLeft"
              ref="resourceInfo-left"
              :receive-data="leftProjectInfo.projectResourceInfo"></res-info-detail>

            <!-- 需求单位 非研发包 -->
            <DSTeamInfoDetail
              id="team-info-left"
              ref="team-left"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'ds'"
              :project-company-list="leftProjectInfo.projectCompanyList"
              :project-class="leftProjectInfo.projectBaseInfo.projectClass"
              @changeExpand="changeExpand(arguments,'team','Left')"></DSTeamInfoDetail>
            <!-- 需求单位 研发包 -->
            <DGTeamInfoDetail
              id="team-info-left"
              ref="team-left"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'dg'"
              :project-company-list="leftProjectInfo.projectCompanyList"
              @changeExpand="changeExpand(arguments,'team','Left')"></DGTeamInfoDetail>
            <!-- 承担单位 非研发包 -->
            <USTeamInfoDetail
              id="team-info-left"
              ref="team-left"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'us'"
              :project-company-list="leftProjectInfo.projectCompanyList"
              :project-team-list="leftProjectInfo.projectTeamList"
              :team-undertake-highlight="teamUndertakeHighlight"
              @changeExpand="changeExpand(arguments,'team','Left')"></USTeamInfoDetail>
            <!-- 承担单位 研发包 -->
            <UGTeamInfoDetail
              id="team-info-left"
              ref="team-left"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'ug'"
              :project-company-list="leftProjectInfo.projectCompanyList"
              :project-team-list="leftProjectInfo.projectTeamList"
              :team-undertake-highlight="teamUndertakeHighlight"
              @changeExpand="changeExpand(arguments,'team','Left')"></UGTeamInfoDetail>

            <!-- 需求单位 非研发包 -->
            <DSProjectBudget
              id="project-budget-left"
              ref="budget-left"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'ds'"
              :demand-budget-info="leftProjectInfo.demandProjectBudgetOfDemandView"
              :undertake-budget-info="leftProjectInfo.demandProjectBudgetOfUndertakeView"
              @changeExpand="changeExpand(arguments,'budget','Left')"
              @rendered="bugetRendered"></DSProjectBudget>
            <!-- 需求单位 研发包 -->
            <DGProjectBudget
              id="project-budget-left"
              ref="budget-left"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'dg'"
              :budget-info="leftProjectInfo.costBudgetList"
              @changeExpand="changeExpand(arguments,'budget','Left')"></DGProjectBudget>
            <!-- 承担单位 非研发包、研发包 -->
            <!-- <UProjectBudget
              id="project-budget-left"
              ref="budget-left"
              :show-expand="false"
              v-if="projectCategory !=='' && projectCategory==='u'"
              :budget-info="leftProjectInfo.budgetData"
              @changeExpand="changeExpand(arguments,'budget','Left')"
              :undertake-budget-info="leftProjectInfo.undertakeProjectBudget"></UProjectBudget> -->
            <!-- 承担单位 总分、分总模式 -->
            <UBudgetDetail
              id="project-budget-left"
              ref="budget-left"
              :show-expand="false"
              v-if="projectCategory !=='' && projectCategory==='u'"
              @changeExpand="changeExpand(arguments,'budget','Left')"
              :undertake-budget-info="leftProjectInfo.undertakeProjectBudget"></UBudgetDetail>

            <!-- 需求单位 -->
            <DSubprojectInfo
              id="suproject-left"
              ref="suproject-left"
              :show-expand="false"
              v-if="projectCategory !=='' && projectCategory==='d'"
              :receive-data="leftProjectInfo.subProjectInfoList"
              @changeExpand="changeExpand(arguments,'subproject','Left')"
              :project-base-info="leftProjectInfo.projectBaseInfo"
              :expand-default="false"
              @expandSubPro="expandSubPro"
              :version-no="leftVersionNo"></DSubprojectInfo>
            <!-- 承担单位 -->
            <USubprojectInfo
              id="suproject-left"
              ref="suproject-left"
              :show-expand="false"
              v-if="projectCategory !=='' && projectCategory==='u'"
              :receive-data="leftProjectInfo.subProjectInfoList"
              @changeExpand="changeExpand(arguments,'subproject','Left')"
              :project-base-info="leftProjectInfo.projectBaseInfo"
              :expand-default="false"
              @expandSubPro="expandSubPro"
              :version-no="leftVersionNo"></USubprojectInfo>

            <!-- 需求单位 非研发包 -->
            <DSMilestoneInfo
              id="mile-stone-left"
              ref="milestone-left"
              :show-expand="false"
              v-if="isShowMilestoneLeft && projectCP !=='' && projectCP === 'ds'"
              :receive-data="leftProjectInfo.projectMileStoneList"
              @changeExpand="changeExpand(arguments,'milestone','Left')"
              @detailTableMilestoneShowOrHide="setMilestoneVisibleLeft"></DSMilestoneInfo>
            <!-- 承担单位 非研发包、研发包 -->
            <UMilestoneInfo
              id="mile-stone-left"
              ref="milestone-left"
              :show-expand="false"
              v-if="isShowMilestoneLeft && projectCategory !=='' && projectCategory==='u'"
              :receive-data="leftProjectInfo.projectMileStoneList"
              @changeExpand="changeExpand(arguments,'milestone','Left')"
              @detailTableMilestoneShowOrHide="setMilestoneVisibleLeft"></UMilestoneInfo>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="12">
        <el-scrollbar ref="rightScroll" :class="{'change-height':isChange}">
          <div class="detail-wrapper">
            <basicInfo
              id="basic-info-right"
              ref="basic-right"
              :show-expand="false"
              :receive-data="rightProjectInfo.projectBaseInfo"
              @changeExpand="changeExpand(arguments,'basic','Right')"></basicInfo>

            <attributeInfoPreview
              v-if="rightProjectInfo.projectAttribute"
              id="property-info-right"
              ref="property-right"
              :show-expand="false"
              :receive-data="rightProjectInfo.projectBaseInfo"
              :project-attribute="rightProjectInfo.projectAttribute"
              @formPreviewHasRendered="attriHasRendered"></attributeInfoPreview>
            <attributeInfoPreviewDefault
              id="property-info-right"
              ref="property-right"
              :show-expand="false"
              :receive-data="rightProjectInfo.projectBaseInfo"
              v-if="!rightProjectInfo.projectAttribute"
              @formPreviewHasRendered="attriHasRendered"></attributeInfoPreviewDefault>

            <product-info-detail
              v-if="projectCategory !=='' && projectCategory==='u' && hasProductInfoRight"
              ref="productInfo-right"
              :receive-data="rightProjectInfo.projectProductInfoList"></product-info-detail>

            <res-info-detail
              v-if="projectCategory !=='' && projectCategory==='u' && hasResourceInfoRight"
              ref="resourceInfo-right"
              :receive-data="rightProjectInfo.projectResourceInfo"></res-info-detail>

            <!-- 需求单位 非研发包 -->
            <DSTeamInfoDetail
              iid="team-info-right"
              ref="team-right"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'ds'"
              :project-company-list="rightProjectInfo.projectCompanyList"
              :project-class="rightProjectInfo.projectBaseInfo.projectClass"
              @changeExpand="changeExpand(arguments,'team','Right')"></DSTeamInfoDetail>
            <!-- 需求单位 研发包 -->
            <DGTeamInfoDetail
              id="team-info-right"
              ref="team-right"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'dg'"
              :project-company-list="rightProjectInfo.projectCompanyList"
              @changeExpand="changeExpand(arguments,'team','Right')"></DGTeamInfoDetail>
            <!-- 承担单位 非研发包 -->
            <USTeamInfoDetail
              id="team-info-right"
              ref="team-right"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'us'"
              :project-company-list="rightProjectInfo.projectCompanyList"
              :project-team-list="rightProjectInfo.projectTeamList"
              @changeExpand="changeExpand(arguments,'team','Right')"></USTeamInfoDetail>
            <!-- 承担单位 研发包 -->
            <UGTeamInfoDetail
              id="team-info-right"
              ref="team-right"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'ug'"
              :project-company-list="rightProjectInfo.projectCompanyList"
              :project-team-list="rightProjectInfo.projectTeamList"
              @changeExpand="changeExpand(arguments,'team','Right')"></UGTeamInfoDetail>

            <!-- 需求单位 非研发包 -->
            <DSProjectBudget
              id="project-budget-right"
              ref="budget-right"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'ds'"
              :demand-budget-info="rightProjectInfo.demandProjectBudgetOfDemandView"
              :undertake-budget-info="rightProjectInfo.demandProjectBudgetOfUndertakeView"
              @changeExpand="changeExpand(arguments,'budget','Right')"
              @rendered="bugetRendered"></DSProjectBudget>
            <!-- 需求单位 研发包 -->
            <DGProjectBudget
              id="project-budget-right"
              ref="budget-right"
              :show-expand="false"
              v-if="projectCP !=='' && projectCP === 'dg'"
              :budget-info="rightProjectInfo.costBudgetList"
              @changeExpand="changeExpand(arguments,'budget','Right')"></DGProjectBudget>
            <!-- 承担单位 非研发包、研发包 -->
            <!-- <UProjectBudget
              id="project-budget-right"
              ref="budget-right"
              :show-expand="false"
              v-if="projectCategory !=='' && projectCategory==='u'"
              :budget-info="rightProjectInfo.budgetData"
              @changeExpand="changeExpand(arguments,'budget','Right')"
              :undertake-budget-info="rightProjectInfo.undertakeProjectBudget"></UProjectBudget> -->
            <!-- 承担单位 总分、分总模式 -->
            <UBudgetDetail
              id="project-budget-right"
              ref="budget-right"
              :show-expand="false"
              v-if="projectCategory !=='' && projectCategory==='u'"
              @changeExpand="changeExpand(arguments,'budget','Right')"
              :undertake-budget-info="rightProjectInfo.undertakeProjectBudget"></UBudgetDetail>

            <!-- 需求单位 -->
            <DSubprojectInfo
              id="suproject-right"
              ref="suproject-right"
              :show-expand="false"
              v-if="projectCategory !=='' && projectCategory==='d'"
              :receive-data="rightProjectInfo.subProjectInfoList"
              @changeExpand="changeExpand(arguments,'subproject','Right')"
              :project-base-info="rightProjectInfo.projectBaseInfo"
              :expand-default="false"
              :version-no="rightVersionNo"></DSubprojectInfo>
            <!-- 承担单位 -->
            <USubprojectInfo
              id="suproject-right"
              ref="suproject-right"
              :show-expand="false"
              v-if="projectCategory !=='' && projectCategory==='u'"
              :receive-data="rightProjectInfo.subProjectInfoList"
              @changeExpand="changeExpand(arguments,'subproject','Right')"
              :project-base-info="rightProjectInfo.projectBaseInfo"
              :expand-default="false"
              :version-no="rightVersionNo"></USubprojectInfo>

            <!-- 需求单位 非研发包 -->
            <DSMilestoneInfo
              id="mile-stone-right"
              ref="milestone-right"
              :show-expand="false"
              v-if="isShowMilestoneRight && projectCP !=='' && projectCP === 'ds'"
              :receive-data="rightProjectInfo.projectMileStoneList"
              @changeExpand="changeExpand(arguments,'milestone','Right')"
              @detailTableMilestoneShowOrHide="setMilestoneVisibleRight"></DSMilestoneInfo>
            <!-- 承担单位 非研发包、研发包 -->
            <UMilestoneInfo
              id="mile-stone-right"
              ref="milestone-right"
              :show-expand="false"
              v-if="isShowMilestoneRight && projectCategory !=='' && projectCategory==='u'"
              :receive-data="rightProjectInfo.projectMileStoneList"
              @changeExpand="changeExpand(arguments,'milestone','Right')"
              @detailTableMilestoneShowOrHide="setMilestoneVisibleRight"></UMilestoneInfo>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import basicInfo from '@/controller/groupPlan/components/basic/detail'
// import attributeInfoPreview from '@/controller/extraProject/components/attributeInfo/detail'
// import attributeInfoPreviewDefault from '@/controller/extraProject/components/attributeInfo/detailDefault'
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
import axios from 'axios'
import { getStore } from '@/store'
import { addNum } from '@/utils/numberAdd'
import ProductInfoDetail from '@/controller/groupPlan/components/productInfo/productInfoDetail'
import ResInfoDetail from '@/controller/groupPlan/components/resourceInfo/resInfoDetail'
import API from '@/serve/API_groupPlanProject'

export default {
  data () {
    return {
      developPackage: '', //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: '', //需求方项目d还是承担方项目u
      projectCP: '',
      rightProjectInfo: {},
      leftProjectInfo: {},
      rightVersionNo: '',
      leftVersionNo: '',
      // componentIDs: ['basic-info', 'property-info', 'team-info', 'project-budget', 'subproject', 'milestone']
      componentIDs: ['basic', 'team', 'budget', 'subproject', 'milestone', 'property', 'productInfo', 'resourceInfo'],
      basicLeftExpand: true,
      teamLeftExpand: true,
      budgetLeftExpand: true,
      taskLeftExpand: true,
      milestoneLeftExpand: true,
      basicRightExpand: true,
      teamRightExpand: true,
      budgetRightExpand: true,
      taskRightExpand: true,
      milestoneRightExpand: true,
      basicHeight: 0,
      teamHeight: 0,
      budgetHeight: 0,
      taskHeight: 0,
      milestoneHeight: 0,
      blockKeys: ['projectBaseInfo', 'projectCompanyList', 'demandProjectBudgetOfDemandView', 'demandProjectBudgetOfUndertakeView', 'undertakeProjectBudget', 'subProjectInfoList', 'projectMileStoneList', 'projectAttribute', 'projectProductInfoList', 'projectResourceInfo'],
      baseInfoKeys: ['projectCode', 'projectName', 'projectSource', 'projectClass', 'developProperty', 'projectType',
        'projectLevel', 'projectExpenditureType', 'periodOwnership', 'projectYear', 'developPackage', 'planApprovalTime',
        'planFinishTime', 'actualApprovalTime', 'actualFinishTime', 'projectDetailsStatus', 'accountingNo'],
      baseInfoDiff: {},
      roleList: ['PR-MANAGER', 'PR-MEMBER', 'PR-PROJECT-OBSERVER', 'PR-EXPERT'],
      budgetKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts', 'totalAmount'],
      attributeKeys: [], //需要高亮的属性key值
      scrollLeft: true, //滚动左侧
      scrollRight: true, //滚动右侧
      isShowMilestoneLeft: true,
      isShowMilestoneRight: true,
      teamUndertakeHighlight: {
        managerHighlight: false,
        memberHighlight: false,
        expertHighlight: false,
        observerHighlight: false
      },
      isFlag: false,
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      baseUrl: getStore().getters['CONFIG/baseUrl'],
      contrastAchKeys: ['achievementName', 'demandUnit', 'demandUnitResponsibleName', 'undertakeUnit', 'responsiblePerson', 'undertakeProjectCode', 'togetherDevelopCost', 'staffTime'],
      hasProductInfoLeft: true, //项目信息中有产品信息
      hasResourceInfoLeft: true, //项目信息中有资源信息
      hasProductInfoRight: true, //项目信息中有产品信息
      hasResourceInfoRight: true //项目信息中有资源信息
    }
  },
  components: {
    basicInfo,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
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
    ProductInfoDetail,
    ResInfoDetail
  },
  props: {
    leftInfo: {
      type: Object,
      default: () => {
      }
    },
    rightInfo: {
      type: Object,
      default: () => {
      }
    },
    leftVersion: { type: String, default: '' },
    rightVersion: { type: String, default: '' },
    isChange: { type: Boolean, default: false } //是否为变更对比页
  },
  created () {
    this.projectCategory = this.leftProjectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'd' : 'u'
    let isPackage = this.leftProjectInfo.projectBaseInfo.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.projectCategory + isPackage
    this.leftVersionNo = this.$route.query.leftVersionNo || this.leftVersionNo
    this.rightVersionNo = this.$route.query.rightVersionNo || this.rightVersionNo
  },
  watch: {
    leftInfo: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          this.leftProjectInfo = JSON.parse(JSON.stringify(val))
          if (this.leftProjectInfo.projectBaseInfo.projectCategory === 'PC-UNDERTAKE-UNIT') {
            //产品信息
            this.hasProductInfoLeft = this.leftProjectInfo.projectProductInfoList && this.leftProjectInfo.projectProductInfoList.length > 0
            //资源信息
            this.hasResourceInfoLeft = !!((this.leftProjectInfo.projectResourceInfo && JSON.stringify(this.leftProjectInfo.projectResourceInfo) !== '{}'))
          }
        }
        if (val && this.rightProjectInfo && JSON.stringify(this.leftProjectInfo) !== '{}' && JSON.stringify(this.rightProjectInfo) !== '{}') {
          this.contrastInfo()
        }
      }
    },
    rightInfo: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          this.rightProjectInfo = JSON.parse(JSON.stringify(val))
          if (this.rightProjectInfo.projectBaseInfo.projectCategory === 'PC-UNDERTAKE-UNIT') {
            //产品信息
            this.hasProductInfoRight = this.rightProjectInfo.projectProductInfoList && this.rightProjectInfo.projectProductInfoList.length > 0
            //资源信息
            this.hasResourceInfoRight = !!((this.rightProjectInfo.projectResourceInfo && JSON.stringify(this.rightProjectInfo.projectResourceInfo) !== '{}'))
          }
        }
        if (val && this.leftProjectInfo && JSON.stringify(this.leftProjectInfo) !== '{}' && JSON.stringify(this.rightProjectInfo) !== '{}') {
          this.contrastInfo()
        }
      }
    },
    leftVersion: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.leftVersionNo = val || this.$route.query.leftVersionNo
      }
    },
    rightVersion: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.rightVersionNo = val || this.$route.query.rightVersionNo
      }
    },
    attributeKeys: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val !== null) {
          this.attriHasRendered()
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.resetHeight()
      this.handleScroll()
    })
  },
  methods: {
    //监听滚动，设置左右两块同步滚动
    handleScroll () {
      let leftScrollEle = this.$refs.leftScroll.wrap
      let rightScrollEle = this.$refs.rightScroll.wrap
      leftScrollEle.onscroll = function (evt) {
        if (leftScrollEle.scrollTop === rightScrollEle.scrollTop) {
          return
        }
        rightScrollEle.scrollTop = leftScrollEle.scrollTop
        rightScrollEle.scrollLeft = leftScrollEle.scrollLeft
      }
      rightScrollEle.onscroll = function (evt) {
        /* if (leftScrollEle.scrollTop === rightScrollEle.scrollTop) {
          return
        }
        leftScrollEle.scrollTop = rightScrollEle.scrollTop
        leftScrollEle.scrollLeft = rightScrollEle.scrollLeft */
      }
    },
    //同一组件保持左右高度一致
    resetHeight () {
      this.componentIDs.forEach(id => {
        let leftCom = this.$refs[`${id}-left`]
        let rightCom = this.$refs[`${id}-right`]
        if (id === 'property') return
        if (!leftCom) return
        if (!rightCom) return
        let maxHeght = Math.max(leftCom.$el.offsetHeight, rightCom.$el.offsetHeight)
        this.$refs[`${id}Height`] = maxHeght
        this.$nextTick(() => {
          if (leftCom.$el.style && rightCom.$el.style) {
            leftCom.$el.style.minHeight = rightCom.$el.style.minHeight = maxHeght + 30 + 'px'
          }
        })
      })
    },
    //切换收起/展开
    changeExpand (args, id, state) {
      this[`${id}${state}Expand`] = args[0]
      let leftCom = this.$refs[id + '-left']
      let rightCom = this.$refs[id + '-right']
      //左右两侧均被折叠，则高度变为auto
      if (!this[`${id}LeftExpand`] && !this[`${id}RightExpand`]) {
        leftCom.$el.style.height = rightCom.$el.style.height = 'auto'
      }
      //左右两侧只要有一个被折叠，则设定初始高度
      if (this[`${id}LeftExpand`] || this[`${id}RightExpand`]) {
        leftCom.$el.style.height = rightCom.$el.style.height = this.$refs[`${id}Height`] + 30 + 'px'
      }
    },
    //对比左右两边的数据
    contrastInfo () {
      this.blockKeys.forEach(key => {
        if (!this.leftProjectInfo[key]) return
        // let keys = Object.keys(this.leftProjectInfo[key])
        switch (key) {
          case 'projectBaseInfo':
            //遍历需对比的字段
            this.baseInfoKeys.forEach(infoKey => {
              if (this.leftProjectInfo[key][infoKey] !== this.rightProjectInfo[key][infoKey]) {
                //字段值不一致则高亮，使用一个对象存储所有的高亮key
                this.baseInfoDiff[infoKey] = true
              }
            })
            //基本信息对比字段
            break
          case 'projectAttribute':
            //属性信息
            this.analyseAttribute(key)
            break
          case 'projectCompanyList':
            //团队信息对比具体的人员
            if (this.leftProjectInfo.projectBaseInfo.projectCategory === 'PC-UNDERTAKE-UNIT') {
              this.analyseTeamInfoU()
            } else {
              this.analyseTeamInfo()
            }
            break
          case 'demandProjectBudgetOfDemandView':
            //项目预算对比
            this.analyseBuget(key)
            break
          case 'demandProjectBudgetOfUndertakeView':
            //项目预算对比
            this.analyseBuget(key)
            break
          case 'undertakeProjectBudget':
            //承担单位 预算信息
            this.analyseBuget(key)
            break
          case 'subProjectInfoList':
            //子项目
            this.analyseSubProjectInfo(key)
            break
          case 'projectMileStoneList':
            //里程碑对比
            this.analyseMileStone(key)
            break
          case 'projectProductInfoList':
            //产品信息
            this.analyseProductInfo(key)
            break
          case 'projectResourceInfo':
            //资源信息
            this.analyseResourceInfo(key)
            break
        }
      })
    },
    //承担单位项目团队信息对比
    analyseTeamInfoU () {
      let roleList = {
        manager: ['PR-LEADER-UNDERTAKER-MANAGER'],
        member: ['PR-LEADER-UNDERTAKER-MEMBER', 'PR-PARTNER-UNDERTAKER-MEMBER'],
        observer: ['PR-PROJECT-OBSERVER'],
        expert: ['PR-EXPERT']
      }
      let roleKeys = ['manager', 'member', 'observer', 'expert']
      roleKeys.forEach(key => {
        let role = roleList[key]
        //左侧某角色人员合集
        let leftUser = this.leftProjectInfo.projectTeamList ? this.leftProjectInfo.projectTeamList.filter(p => role.indexOf(p.projectRoleCode) > -1) : []
        //右侧某角色人员合集
        let rightUser = this.rightProjectInfo.projectTeamList ? this.rightProjectInfo.projectTeamList.filter(p => role.indexOf(p.projectRoleCode) > -1) : []
        //遍历左侧人员与右侧进行对比
        if (leftUser.length !== rightUser.length) { //人员数量不一致，高亮
          this.teamUndertakeHighlight[`${key}Highlight`] = true
        } else {
          let needHighLight = leftUser.some(manage => {
            let flag = rightUser.some(ele => ele.userAccount === manage.userAccount)
            if (!flag) return true //不存在右侧，高亮
          })
          this.teamUndertakeHighlight[`${key}Highlight`] = needHighLight
        }
      })
    },
    //处理团队信息
    analyseTeamInfo () {
      let left = this.leftProjectInfo.projectCompanyList
      let right = this.rightProjectInfo.projectCompanyList
      let types = ['1', '2']
      left.forEach(leftComp => {
        if (!leftComp) return
        if (leftComp.leaderFlag === '1') { //牵头
          types.forEach(type => {
            if (leftComp.type !== type) return
            let rightLead = null
            right.some(comp => {
              if (comp.leaderFlag === '1' && comp.type === type) { //右侧对比牵头承担单位
                rightLead = comp
                return true
              }
            })
            if (rightLead) {
              if (leftComp.organizationCode !== rightLead.organizationCode) {
                leftComp.highlightProp = true
              }
              let typeCode = type === '1' ? 'DEMAND' : 'UNDERTAKER'
              this.analyseTeamUser(leftComp, rightLead, 'manager', typeCode, '1')
              this.analyseTeamUser(leftComp, rightLead, 'member', typeCode, '1')
            } else {
              leftComp.highlightProp = true
              leftComp.managerHighlightProp = true
              leftComp.memberHighlightProp = true
            }
          })
        } else if (leftComp.leaderFlag === '0') { //配合、攻关
          types = ['1', '2', '3']
          types.forEach(type => {
            if (leftComp.type !== type) return
            let rightDemandCoop = right.filter(ele => {
              if (ele.organizationCode === leftComp.organizationCode && ele.leaderFlag === '0' && ele.type === type) {
                return true
              }
            })
            if (rightDemandCoop.length > 0) {
              let inRightSame = null
              rightDemandCoop.some(ele => {
                if (ele.organizationCode === leftComp.organizationCode) {
                  inRightSame = ele
                  return true
                }
              })
              if (inRightSame) {
                let typeCode = ''
                switch (type) {
                  case '1':
                    typeCode = 'DEMAND'
                    break
                  case '2':
                    typeCode = 'UNDERTAKER'
                    break
                  case '3':
                    typeCode = 'PR-UNITE-ASSAULT-MANAGER'
                    break
                }
                if (type === '3') { //联合攻关单位
                  this.analyseTeamUser(leftComp, inRightSame, 'manager', typeCode)
                } else {
                  this.analyseTeamUser(leftComp, inRightSame, 'manager', typeCode, '0')
                  this.analyseTeamUser(leftComp, inRightSame, 'member', typeCode, '0')
                }
              }
            } else { //右侧不存在此条table数据
              leftComp.highlightProp = true
              leftComp.managerHighlightProp = true
              leftComp.memberHighlightProp = true
            }
          })
        }
      })
      //PC-DEMAND-UNIT PC-UNDERTAKE-UNIT
      if (this.leftProjectInfo.projectBaseInfo.projectCategory === 'PC-UNDERTAKE-UNIT' && this.leftProjectInfo.projectBaseInfo.developPackage === 'IS_RD_0') {
        let leftInfo = {
          projectTeamList: this.leftProjectInfo.projectTeamList
        }
        let rightInfo = {
          projectTeamList: this.rightProjectInfo.projectTeamList
        }
        this.analyseTeamUser(leftInfo, rightInfo, 'expert', 'PR-EXPERT')
        this.analyseTeamUser(leftInfo, rightInfo, 'observer', 'PR-PROJECT-OBSERVER')
      }
    },
    analyseTeamUser (left, right, role, typeCode, isLeader) {
      //role - manager/member
      let roleUpper = role.toUpperCase()
      let leftUser = []
      let rightUser = []
      let leaderCode = isLeader === '1' ? 'LEADER' : 'PARTNER'
      switch (typeCode) {
        case 'PR-UNITE-ASSAULT-MANAGER': //联合攻关单位 -- 项目经理
        case 'PR-EXPERT': //专家
        case 'PR-PROJECT-OBSERVER': //观察员
          leftUser = left.projectTeamList.filter(ele => ele.projectRoleCode === typeCode)
          rightUser = right.projectTeamList.filter(ele => ele.projectRoleCode === typeCode)
          break
        default: //牵头需求、牵头承担、配合需求、配合承担 -- 项目经理、项目成员
          leftUser = left.projectTeamList.filter(ele => ele.projectRoleCode === `PR-${leaderCode}-${typeCode}-${roleUpper}`)
          rightUser = right.projectTeamList.filter(ele => ele.projectRoleCode === `PR-${leaderCode}-${typeCode}-${roleUpper}`)
          break
      }
      if (leftUser.length !== rightUser.length) { //人员数量不一致，高亮
        if (role === 'expert' || role === 'observer') {
          this[`${role}Highlight`] = true
        } else {
          left[`${role}HighlightProp`] = true
        }
      } else {
        let needHighLight = leftUser.some(manage => {
          let flag = rightUser.some(ele => ele.userAccount === manage.userAccount)
          if (!flag) return true //不存在右侧，高亮
        })
        if (role === 'expert' || role === 'observer') {
          this[`${role}Highlight`] = needHighLight
        } else {
          left[`${role}HighlightProp`] = needHighLight
        }
      }
    },
    //处理子项目
    analyseSubProjectInfo (key) {
      this.leftProjectInfo[key].forEach((item, index) => {
        item.highlightProps = {}
        let rightItem = this.rightProjectInfo[key] ? this.rightProjectInfo[key].filter(right => right.subProjectCode === item.subProjectCode) : []
        if (rightItem.length === 0) {
          this.$set(item, 'newSubProjectInfo', true) //整个子项目为新增
        }
        this.compareSubInfo(item, rightItem)
      })
    },
    /**
     * 对比子项目详情
     */
    compareSubInfo (orignItem, rightItem) {
      let item = JSON.parse(JSON.stringify(orignItem))
      let subKeys = Object.keys(item) //子项目所有键值
      subKeys.forEach(subKey => {
        if (subKey !== 'highlightProps' && (rightItem.length === 0 || rightItem[0][subKey] === null)) { //右侧不存在
          this.$set(item.highlightProps, subKey, true) //左侧高亮
          if (subKey === 'projectAchievementList' && item.projectAchievementList) { //右侧不存在此子项目，左侧的成果的每个字段都要高亮
            let achievementKeys = []
            item.projectAchievementList.forEach(ach => {
              if (achievementKeys.length === 0) {
                achievementKeys = Object.keys(ach) //成果的所有key
              }
              ach.highlightProp = true //行高亮字段
              ach.highlightProps = {}
              achievementKeys.forEach(key => {
                this.$set(ach.highlightProps, key, true) //所有key都高亮
              })
            })
          }
          return
        } else {
          if (item[subKey] && subKey !== 'highlightProps') {
            this.$set(item.highlightProps, subKey, item[subKey] !== rightItem[0][subKey]) //左侧高亮
          }
        }
        switch (subKey) {
          case 'leadDemandManager':
          case 'leadUndertakeManager':
            if (item[subKey]) {
              this.$set(item.highlightProps, subKey, item[subKey].userAccount !== rightItem[0][subKey].userAccount)
            }
            break
          case 'leadDemandUnit':
          case 'leadUndertakeUnit':
            if (item[subKey]) {
              this.$set(item.highlightProps, subKey, item[subKey].organizationCode !== rightItem[0][subKey].organizationCode)
            }
            break
          case 'projectAchievementList':
            if (!item[subKey]) return
            item[subKey].forEach(ach => {
              let rightAch = null //存储右侧同个编码的成果进行对比
              rightItem[0][subKey].some(ele => {
                if (ele.achievementCode === ach.achievementCode) {
                  rightAch = ele
                  return true
                }
              })
              ach.highlightProps = {}
              let achievementKeys = Object.keys(ach) //成果的所有key
              if (rightAch) {
                achievementKeys.forEach(key => {
                  if (key === 'togetherDevelopCost') {
                    ach[key] = this.numTransition(ach[key])
                    rightAch[key] = this.numTransition(rightAch[key])
                  }
                  if (key === 'staffTime') {
                    ach[key] = this.numTransition(ach[key])
                    rightAch[key] = this.numTransition(rightAch[key])
                  }
                  this.$set(ach.highlightProps, key, ach[key] !== rightAch[key])
                })
              } else { //右侧不存在此编码的成果，则左侧高亮
                ach.highlightProp = true //行高亮字段
                achievementKeys.forEach(key => {
                  this.$set(ach.highlightProps, key, true) //所有key都高亮
                })
              }
            })
            break
          default:
            if (subKey !== 'highlightProps' && item[subKey] !== rightItem[0][subKey]) {
              this.$set(item.highlightProps, subKey, true)
            }
            break
        }
      })

      orignItem = Object.assign(orignItem, item)
      this.$forceUpdate()
    },
    /**
     * 展开左侧子项目
     * @param {Object} item 左侧子项目的详情
     */
    expandSubPro (item) {
      let subProList = this.rightProjectInfo['subProjectInfoList']
      if (subProList.some(pro => pro.subProjectCode === item.subProjectCode)) { //右侧存在相同的子项目
        let rightList = this.$refs['suproject-right'].list.filter(item1 => item1.subProjectCode === item.subProjectCode)
        let rightSubPro = rightList[0]
        if (!rightSubPro.isExpand && !rightSubPro.isCached) { //右侧未展开且未缓存数据时调接口
          let params = {
            projectCode: this.rightProjectInfo.projectBaseInfo.projectCode,
            subProjectCode: rightSubPro.subProjectCode,
            versionNo: this.rightVersionNo
          }
          let interfaceName = this.rightProjectInfo.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' ? 'querySubProjectDetailD' : 'querySubProjectDetailU'
          API[interfaceName](params)
            .then(async res => {
              if (res) {
                rightSubPro.isCached = true
                rightSubPro.isExpand = true
                Object.assign(rightSubPro, res)
                this.compareSubInfo(item, rightList)
              }
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '子项目详情获取失败',
                  type: 'error',
                  showClose: true
                })
              }
            })
        } else { //右侧已缓存过数据
          this.compareSubInfo(item, rightList)
        }
      } else { //右侧不存在，左侧全部高亮
        this.compareSubInfo(item, [])
      }
    },
    analyseAttribute (key) {
      this.attributeKeys = []
      if (!this.leftProjectInfo[key]) {
        return
      }
      if (!this.rightProjectInfo[key]) {
        let extendedAttributes = JSON.parse(this.leftProjectInfo[key].extendedAttributes)
        let fieldList = extendedAttributes[0].fieldList
        fieldList.forEach(item => {
          this.attributeKeys.push(item.key)
        })
        return
      }
      let leftFieldList
      let rightFieldList
      let param = JSON.stringify(this.leftProjectInfo.projectBaseInfo)
        .replace(/"/g, '')
        .replace(/:/g, '=')
        .replace(/\{/g, '')
        .replace(/\}/g, '')
      axios({
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        method: 'post',
        url: this.baseUrl + '/rms/form/ext/provide/v1/3/v1/getCheckForm',
        data: {
          parameters: param,
          companyCode: getStore().getters['USERENTITY/userInfo'].userAuth.companyCode,
          businessObject: 'BO-OVERALL',
          schemeId: this.leftProjectInfo.projectAttribute.schemeId,
          schemeJson: this.leftProjectInfo.projectAttribute.extendedAttributes
        }
      })
        .then((res) => {
          leftFieldList = res.data.body.blockDtos[0].fieldList
          let params = JSON.stringify(this.rightProjectInfo.projectBaseInfo)
            .replace(/"/g, '')
            .replace(/:/g, '=')
            .replace(/\{/g, '')
            .replace(/\}/g, '')
          axios({
            headers: {
              'Authorization': this.Authorization,
              'pragma': 'no-cache',
              'cache-control': 'no-cache'
            },
            method: 'post',
            url: this.baseUrl + '/rms/form/ext/provide/v1/3/v1/getCheckForm',
            data: {
              parameters: params,
              companyCode: getStore().getters['USERENTITY/userInfo'].userAuth.companyCode,
              businessObject: 'BO-OVERALL',
              schemeId: this.rightProjectInfo.projectAttribute.schemeId,
              schemeJson: this.rightProjectInfo.projectAttribute.extendedAttributes
            }
          })
            .then((res) => {
              rightFieldList = res.data.body.blockDtos[0].fieldList
              let leftAttri = JSON.parse(this.leftProjectInfo.projectAttribute.extendedAttributes)[0].fieldList
              let rightAttri = JSON.parse(this.rightProjectInfo.projectAttribute.extendedAttributes)[0].fieldList
              let allAttriKeys = []
              // let rightAttriKeys = []
              leftFieldList.forEach(item => {
                allAttriKeys.push(item.fieldKey)
              })
              // rightAttri.forEach(item => {
              //   rightAttriKeys.push(item.key)
              // })
              /* let leftResearchKey = 'keyResearchField'
              let rightResearchKey = ''
              let researchKeys = ['keyResearchField_A', 'keyResearchField_B', 'keyResearchField_C', 'keyResearchField']
              if (allAttriKeys.indexOf('keyResearchField') > -1) {
                leftResearchKey = 'keyResearchField'
                researchKeys.some(key => {
                  if (rightAttriKeys.indexOf(key) > -1) {
                    rightResearchKey = key
                    return true
                  }
                })
              } else {
                rightResearchKey = 'keyResearchField'
                researchKeys.some(key => {
                  if (rightAttriKeys.indexOf(key) > -1) {
                    leftResearchKey = key
                    return true
                  }
                })
              } */
              allAttriKeys.forEach(key => {
                let leftKey = key
                let rightKey = key
                // if (key === leftResearchKey) {
                //   rightKey = rightResearchKey
                // }
                let left = leftFieldList.filter(ele => ele.fieldKey === leftKey) //动态表单获取
                let right = rightFieldList.filter(ele => ele.fieldKey === rightKey) //动态表单获取
                let leftField = leftAttri.filter(ele => ele.key === leftKey) //项目信息获取
                let rightField = rightAttri.filter(ele => ele.key === rightKey) //项目信息获取
                let leftValue = ''
                let rightValue = ''
                if (left[0]) {
                  leftValue = left[0].previewName || left[0].defaultValue || '' //先从动态表单获取值
                } else if (leftField[0]) {
                  leftValue = leftField[0].previewName || ''
                }
                if (right[0]) {
                  rightValue = right[0].previewName || right[0].defaultValue || ''
                } else if (rightField[0]) {
                  rightValue = rightField[0].previewName || ''
                }
                if (left[0].isVisible === '0' && right[0].isVisible === '1') {
                  this.attributeKeys.push(key)
                } else if (leftValue !== rightValue) {
                  this.attributeKeys.push(key)
                }
              })
              this.isFlag = true
            })
        })
    },
    analyseMileStone (key) {
      this.leftProjectInfo[key].forEach(item => {
        item.highlightProps = {}
        let rightItem = this.rightProjectInfo[key] ? this.rightProjectInfo[key].filter(right => right.milestoneCode === item.milestoneCode) : []
        let achKeys = Object.keys(item)
        let propAllSame = true //是否所有的属性都是一样的
        this.$set(item, 'isExpanded', false)
        achKeys.forEach(achKey => {
          if (rightItem.length === 0) {
            //左侧有，右侧没有里程碑
            propAllSame = false
            this.$set(item.highlightProps, achKey, true)
            if (item.linkResultFlag === '1' && item.resultList && item.resultList.length) {
              item.resultList.forEach(left => {
                this.$set(left, 'highlightProp', true)
              })
            }
            if (item.commitmentUnit && item.commitmentUnit.length) {
              item.commitmentUnit.forEach(left => {
                this.$set(left, 'highlightProp', true)
              })
            }
            if (item.demandUnit && item.demandUnit.length) {
              item.demandUnit.forEach(left => {
                this.$set(left, 'highlightProp', true)
              })
            }
            this.$set(item, 'newMileStones', true) //整个里程碑为新增
          } else if (rightItem.length > 0) {
            //左右两侧都有，并且左侧有成果列表,对比数据
            if (achKey === 'resultList' && item.resultList) {
              item.resultList.forEach(left => {
                let right = []
                if (rightItem[0].resultList) {
                  right = rightItem[0].resultList.filter(r => r.achievementCode === left.achievementCode)
                }
                //不存在于右侧或者存在且名称不一致
                if (right.length === 0 || right[0].achievementName !== left.achievementName) {
                  propAllSame = false
                  this.$set(left, 'highlightProp', true)
                }
              })
            } else if (achKey === 'commitmentUnit' && item.commitmentUnit) {
              item.commitmentUnit.forEach(left => {
                let right = []
                if (rightItem[0].commitmentUnit) {
                  right = rightItem[0].commitmentUnit.filter(r => r.commitmentUnitCode === left.commitmentUnitCode)
                }
                //不存在于右侧或者存在且名称不一致
                if (right.length === 0 || right[0].commitmentUnitName !== left.commitmentUnitName) {
                  propAllSame = false
                  this.$set(left, 'highlightProp', true)
                }
              })
            } else if (achKey === 'demandUnit' && item.demandUnit) {
              item.demandUnit.forEach(left => {
                let right = []
                if (rightItem[0].demandUnit) {
                  right = rightItem[0].demandUnit.filter(r => r.demandUnitCode === left.demandUnitCode)
                }
                //不存在于右侧或者存在且名称不一致
                if (right.length === 0 || right[0].demandUnitName !== left.demandUnitName) {
                  propAllSame = false
                  this.$set(left, 'highlightProp', true)
                }
              })
            } else if (achKey !== 'highlightProps') {
              propAllSame = false
              this.$set(item.highlightProps, achKey, item[achKey] !== rightItem[0][achKey])
            }
          }
        })
        if (propAllSame) {
          this.$set(item, 'sameMileStones', true)
          this.$set(rightItem[0], 'sameMileStones', true)
        }
      })
    },
    // 过滤小数位后0
    numTransition (val) {
      if (val) {
        if (val.indexOf('.') !== -1) {
          let splitArr = val.split('.')
          let reverseArr = splitArr[1].split('')
            .reverse()
          let reverseArr2 = []
          reverseArr.forEach(item => {
            reverseArr2.push(item)
          })
          reverseArr.some((item, index) => {
            if (!parseInt(item)) {
              reverseArr2.shift()
            } else {
              return true
            }
          })
          reverseArr2 = reverseArr2.reverse()
            .join('')
          if (reverseArr2 && reverseArr2.length > 0) {
            return splitArr[0] + '.' + reverseArr2
          } else {
            return splitArr[0]
          }
        } else {
          return val
        }
      } else {
        if (val === null || val === undefined) {
          return '-'
        } else {
          return val
        }
      }
    },
    analyseBuget (key) {
      let projectCategory = this.leftProjectInfo.projectBaseInfo.projectCategory
      let developPackage = this.leftProjectInfo.projectBaseInfo.developPackage
      let left
      let right
      if (projectCategory === 'PC-DEMAND-UNIT' && developPackage === 'IS_RD_1') {
        key = 'costBudgetList'
        //需求单位一般支撑包
        left = (this.leftProjectInfo[key] && this.leftProjectInfo[key].length) ? this.leftProjectInfo[key][0] : null
        right = (this.rightProjectInfo[key] && this.rightProjectInfo[key].length) ? this.rightProjectInfo[key][0] : null
        if (left) {
          left.highlightProps = {}
          let keys = Object.keys(left)
          if (right) { //右侧存在，值不同则高亮
            keys.forEach(key => {
              if (left[key] !== null && left[key] !== undefined) {
                if (right[key] === null || right[key] === undefined) {
                  this.$set(left.highlightProps, key, true)
                } else if (right[key] !== null && right[key] !== undefined) {
                  if (this.numTransition(left[key]) !== this.numTransition(right[key])) {
                    this.$set(left.highlightProps, key, true)
                  }
                }
              }
            })
          } else { //右侧不存在，全部字段高亮
            keys.forEach(key => {
              this.$set(left.highlightProps, key, true)
            })
          }
        }
      } else if (projectCategory === 'PC-DEMAND-UNIT' && developPackage === 'IS_RD_0') {
        //需求单位非一般支撑包
        if (this.leftProjectInfo[key]) {
          left = this.leftProjectInfo[key].coatBudget
        }
        if (this.rightProjectInfo[key]) {
          right = this.rightProjectInfo[key].coatBudget
        }
        let allKeys = ['avgLaborCost', 'budgetInsourcing', 'budgetOutsourcing', 'staffTime', 'subtotal']
        if (left && left.length > 0) {
          if (right) {
            left.forEach(budget => {
              budget.highlightProps = {}
              let rightBudget = right.filter(ele => ele.fatherUnit === budget.fatherUnit)
              if (rightBudget && rightBudget.length > 0) {
                budget.unitInfo.forEach(leftUnitItem => {
                  let rightUnitItem = rightBudget[0].unitInfo.filter(ele => ele.childUnit === leftUnitItem.childUnit)
                  //同一个第一列需求单位，是否存在相同的第二类承担单位
                  if (rightUnitItem && rightUnitItem.length > 0) {
                    leftUnitItem.info.forEach(leftInfoItem => {
                      leftInfoItem.highlightProps = {}
                      let rightInfoItem = rightUnitItem[0].info.filter(ele => ele.timeYear === leftInfoItem.timeYear)
                      if (rightInfoItem && rightInfoItem.length > 0) {
                        allKeys.forEach(key => {
                          this.$set(leftInfoItem.highlightProps, key, this.numTransition(leftInfoItem[key]) !== this.numTransition(rightInfoItem[0][key]))
                        })
                      } else { //右侧不存在相同年份的预算数据
                        allKeys.forEach(key => {
                          this.$set(leftInfoItem.highlightProps, key, true)
                        })
                      }
                      leftUnitItem.colTotal = addNum(leftUnitItem.colTotal, leftInfoItem.subtotal)
                    })
                    let leftColNum = 0
                    let rightColNum = 0
                    leftUnitItem.info.forEach(item => { leftColNum = addNum(leftColNum, item.subtotal) })
                    rightUnitItem[0].info.forEach(item => { rightColNum = addNum(rightColNum, item.subtotal) })
                    leftUnitItem.highlightProps = {}
                    this.$set(leftUnitItem.highlightProps, 'colTotal', leftColNum !== rightColNum)
                  } else { //右侧不存在相同的承担单位
                    leftUnitItem.highlightProps = {}
                    leftUnitItem.highlightProps.childUnit = true
                    leftUnitItem.highlightProps.colTotal = true
                    leftUnitItem.info.forEach(ele1 => {
                      ele1.highlightProps = {}
                      allKeys.forEach(key => {
                        this.$set(ele1.highlightProps, key, true)
                      })
                    })
                  }
                })
              } else { //右侧不存在相同的第一列单位
                budget.highlightProps.fatherUnit = true
                budget.unitInfo.forEach(ele => {
                  ele.highlightProps = {}
                  ele.highlightProps.childUnit = true
                  ele.highlightProps.colTotal = true
                  ele.info.forEach(ele1 => {
                    ele1.highlightProps = {}
                    allKeys.forEach(key => {
                      this.$set(ele1.highlightProps, key, true)
                    })
                  })
                })
              }
            })
            let yearList = this.leftProjectInfo[key].yearList
            let leftRowTotal = {}//sumBudgetInsourcing,sumBudgetOutsourcing,sumStaffTime,sumSubtotal
            let rightRowTotal = {}
            yearList.forEach(year => {
              leftRowTotal[`${year}`] = {
                sumBudgetInsourcing: 0, sumBudgetOutsourcing: 0, sumStaffTime: 0, sumSubtotal: 0
              }
              rightRowTotal[`${year}`] = {
                sumBudgetInsourcing: 0, sumBudgetOutsourcing: 0, sumStaffTime: 0, sumSubtotal: 0
              }
            })
            this.computeRowTotal(left, leftRowTotal)
            this.computeRowTotal(right, rightRowTotal)
            this.leftProjectInfo[key].highlightProps = {}
            let tempKeys = ['sumBudgetInsourcing', 'sumBudgetOutsourcing', 'sumStaffTime', 'sumSubtotal']
            yearList.forEach(year => {
              this.leftProjectInfo[key].highlightProps[`${year}`] = {}
              tempKeys.forEach(tempKey => {
                this.$set(this.leftProjectInfo[key].highlightProps[`${year}`], tempKey, leftRowTotal[year][tempKey] !== rightRowTotal[year][tempKey])
              })
            })
          } else { //右侧不存在，左侧所有都高亮
            left.forEach(ele => {
              left.unitInfo.forEach(ele => {
                ele.info.forEach(ele1 => {
                  ele1.highlightProps = {}
                  allKeys.forEach(key => {
                    this.$set(ele1.highlightProps, key, true)
                  })
                })
              })
            })
          }
        }
      } else if (projectCategory === 'PC-UNDERTAKE-UNIT') {
        this.analyseUnderTakeBudget(key)
        //承担单位
        /* if (this.leftProjectInfo[key]) {
          left = this.leftProjectInfo[key].projectYearBudgetList
        }
        if (this.rightProjectInfo[key]) {
          right = this.rightProjectInfo[key].projectYearBudgetList
        }
        if (left) {
          let leftYearKeys = Object.keys(left)//2020,2021...,全项目
          left.highlightProps = {}
          if (right) {
            leftYearKeys.forEach(year => {
              if (year !== 'highlightProps' && (!right[year] || right[year].length === 0)) {
                this.$set(left.highlightProps, year, true) //右侧不存在的年份，则整体高亮
                return
              }
              if (left[year].length > 0) { //某年份的所有数据
                left[year].forEach(item => {
                  item.highlightProps = {}
                  //获取同一个承担部门的数据进行对比
                  let rightItem = right[year].filter(ele => ele.undertakeUnitDept === item.undertakeUnitDept)
                  let keys = Object.keys(item)
                  keys.forEach(key => {
                    if (!rightItem || rightItem.length === 0) {
                      //右侧无此承担部门，则左侧此列数据全部高亮
                      this.$set(item.highlightProps, key, true)
                    } else if (key !== 'highlightProps') {
                      this.$set(item.highlightProps, key, this.numTransition(item[key]) !== this.numTransition(rightItem[0][key]))
                    }
                  })
                })
              }
            })
          } else {
            leftYearKeys.forEach(key => {
              this.$set(left.highlightProps, key, true)
            })
          }
        } */
      }
    },
    //需求非一般计算最后一行
    computeRowTotal (list, rowTotal) {
      list.forEach(budget => {
        budget.unitInfo.forEach(ele => {
          if (ele.childUnit === '小计') {
            ele.info.forEach(ele1 => {
              if (!rowTotal[`${ele1.timeYear}`]) return
              rowTotal[`${ele1.timeYear}`].sumBudgetInsourcing = addNum(rowTotal[`${ele1.timeYear}`].sumBudgetInsourcing, ele1.budgetInsourcing || 0)
              rowTotal[`${ele1.timeYear}`].sumBudgetOutsourcing = addNum(rowTotal[`${ele1.timeYear}`].sumBudgetOutsourcing, ele1.budgetOutsourcing || 0)
              rowTotal[`${ele1.timeYear}`].sumStaffTime = addNum(rowTotal[`${ele1.timeYear}`].sumStaffTime, ele1.staffTime || 0)
              rowTotal[`${ele1.timeYear}`].sumSubtotal = addNum(rowTotal[`${ele1.timeYear}`].sumSubtotal, ele1.subtotal || 0)
            })
          }
        })
      })
    },
    //总分/分总模式的承担单位预算对比
    analyseUnderTakeBudget (key) {
      this.contrastBudget(key, 'costBudgetList')
      this.contrastBudget(key, 'groupCostBudgetList')
    },
    contrastBudget (key, budgetKey) {
      let left
      let right
      if (this.leftProjectInfo[key]) {
        left = this.leftProjectInfo[key][budgetKey]
      }
      if (this.rightProjectInfo[key]) {
        right = this.rightProjectInfo[key][budgetKey]
      }
      if (left) {
        left.forEach(leftItem => {
          leftItem.highlightProps = {}
          let rightItem = right.filter(ele => leftItem.timeYear === ele.timeYear)
          this.budgetKeys.forEach(key => {
            if (rightItem.length === 0) {
              this.$set(leftItem.highlightProps, key, true) //右侧无相同年份的数据，则左侧全部高亮
            } else {
              this.$set(leftItem.highlightProps, key, this.numTransition(leftItem[key]) !== this.numTransition(rightItem[0][key]))
            }
          })
        })
        this.leftProjectInfo[key].yearList.forEach((year, index) => {
          let leftHasYearBudget = left.some(l => parseInt(l.timeYear) === year)
          let rightYearList = this.rightProjectInfo[key].yearList
          let rightHasYear = rightYearList.some(r => r === year)
          if (!leftHasYearBudget) {
            let budgetObj = {
              timeYear: year,
              budgetOutsourcing: null,
              budgetInsourcing: null,
              staffTime: null,
              laborCosts: null,
              travelExpenses: null,
              conferenceExpenses: null,
              assetDepreciation: null,
              otherCosts: null,
              totalAmount: null,
              highlightProps: {
                budgetOutsourcing: !rightHasYear,
                budgetInsourcing: !rightHasYear,
                staffTime: !rightHasYear,
                laborCosts: !rightHasYear,
                travelExpenses: !rightHasYear,
                conferenceExpenses: !rightHasYear,
                assetDepreciation: !rightHasYear,
                otherCosts: !rightHasYear,
                totalAmount: !rightHasYear
              }
            }
            left.splice(index, 0, budgetObj)
          }
        })
      }
    },
    //设置里程碑是否展示
    setMilestoneVisibleLeft (show) {
      this.isShowMilestoneLeft = show
    },
    //设置里程碑是否展示
    setMilestoneVisibleRight (show) {
      this.isShowMilestoneRight = show
    },
    attriHasRendered () {
      //组件已渲染，可获取高度
      let id = 'property'
      let leftCom = this.$refs[`${id}-left`]
      let rightCom = this.$refs[`${id}-right`]
      if (!leftCom) return
      if (!rightCom) return
      if (this.isFlag) {
        leftCom.changeClass('red', this.attributeKeys)
        if (leftCom.$el.offsetHeight && rightCom.$el.offsetHeight) {
          let maxHeght = Math.max(leftCom.$el.offsetHeight, rightCom.$el.offsetHeight)
          this.$refs[`${id}Height`] = maxHeght
          if (leftCom.$el.style && rightCom.$el.style) {
            leftCom.$el.style.minHeight = rightCom.$el.style.minHeight = maxHeght + 10 + 'px'
          }
        }
      }
    },
    bugetRendered (isFirst = false) {
      let id = 'budget'
      let leftCom = this.$refs[`${id}-left`]
      let rightCom = this.$refs[`${id}-right`]
      if (!leftCom) return
      if (!rightCom) return
      if (this.attributeKeys.length > 0) {
        // leftCom.changeClass('red', this.attributeKeys)
      }
      let maxHeght = Math.max(leftCom.$el.offsetHeight, rightCom.$el.offsetHeight)
      this.$refs[`${id}Height`] = maxHeght
      // this.$nextTick(() => {
      //   if (leftCom.$el.style && rightCom.$el.style) {
      //     let h = isFirst ? 30 : 0
      //     leftCom.$el.style.minHeight = rightCom.$el.style.minHeight = maxHeght + h + 'px'
      //   }
      // })
    },
    //处理产品信息
    analyseProductInfo (key) {
      if (!this.leftProjectInfo[key]) return
      this.contrastList(this.leftProjectInfo[key], this.rightProjectInfo[key], 'productInfoCode')
    },
    //处理资源信息
    analyseResourceInfo (key) {
      let leftItem = this.leftProjectInfo[key]
      let rightItem = this.rightProjectInfo[key]
      if (!leftItem) return
      if (rightItem) {
        //右侧有数据
        leftItem.highlightProps = {}
        let keys = Object.keys(leftItem)
        keys.forEach(key => {
          if (key === 'highlightProps') return
          if (key !== 'resourceDetailInfoList') {
            this.$set(leftItem.highlightProps, key, leftItem[key] !== rightItem[key])
          } else {
            let types = ['RT_VIRTUAL', 'RT_PHYSICAL', 'RT_STORAGE']
            types.forEach(type => {
              let leftList = leftItem[key].filter(ele => ele.resourceType === type)
              let rightList = rightItem[key].filter(ele => ele.resourceType === type)
              this.contrastList(leftList, rightList, 'resourceInfoCode')
            })
          }
        })
      }
    },
    /**
     * 对比列表类型的数据
     * @param {Array} left 需要对比的左侧数据
     * @param {Array} right 需要对比的右侧数据
     * @param {String} primaryKey 基于哪个属性的对比
     */
    contrastList (left, right, primaryKey) {
      left.forEach(leftItem => {
        leftItem.highlightProps = {}
        let allKeys = Object.keys(leftItem) //对比的所有键值
        let rightItem = (right && right.length > 0) ? right.filter(right => right[primaryKey] === leftItem[primaryKey]) : []
        if (rightItem.length === 0) {
          this.$set(leftItem, 'highlightProp', true) //整行为新增
          allKeys.forEach(key => {
            if (key === 'highlightProps') return
            this.$set(leftItem.highlightProps, key, true) //所有key都高亮
          })
        } else {
          allKeys.forEach(key => {
            if (key === 'highlightProps') return
            this.$set(leftItem.highlightProps, key, leftItem[key] !== rightItem[0][key])
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .contrast-detail {
    .el-row .el-col:nth-child(1) {
      border-right: 1px solid #E9E9E9;
    }

    .detail-wrapper {
      width: 960px;
    }

    .el-scrollbar {
      height: calc(100vh - 120px - 20px);

      &.change-height {
        height: calc(100vh - 70px - 20px);
      }

      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
  }
</style>
