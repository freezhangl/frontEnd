<template>
  <div class="extra-project">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <div class="head-img">
          <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
        </div>
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="@/assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="top-opt-con" >
        <div class="btn-opt btn-del" @click="delProject" v-if="isEditable && projectCode"> <i class="el-icon-delete-solid"></i>删除 </div>
        <div class="btn-opt btn-del" @click="saveProject(true)" v-if="isEditable"> <i class="icon-opt svgfont-save"></i>保存 </div>
        <div class="btn-opt btn-del" @click="saveProject(false)" v-if="isEditable&&$route.query.from !== 'reject'"> <i class="icon-opt svgfont-Shape"></i>发起审批 </div>
        <!-- <div class="btn-opt btn-del" @click="saveProject" v-if="isEditable ||meberEditFlag"> <i class="icon-opt svgfont-save"></i>保存 </div> -->
        <div class="btn-opt btn-del" @click="cancelEdit" > 退出编辑 </div>
      </div>

      <section class="nav-menu">
        <a
          class="nav-menu-item"
          v-for="(menu,idx) in navMenus"
          :key="menu.id"
          @click="slideNav(menu,idx)"
          :class="{'item-active' : navIdx == idx}"> {{menu.name}} </a>
      </section>

      <div class="main-content">
        <!--  TODO : 将下面内容 替换成对应组件即可 -->
        <basic-info
          :plan-range-time='planRangeTime'
          :achievement-limit-min-time='achievementLimitMinTime'
          :achievement-limit-max-time='achievementLimitMaxTime'
          :mile-stone-limit-min-time='mileStoneLimitMinTime'
          :mile-stone-limit-max-time='mileStoneLimitMaxTime'
          :project-code="projectCode"
          :receive-data="projectBaseInfo"
          :tip-language="checkData.projectBaseInfo"
          id="basic-info"
          ref="baseInfo"
          @update="updateProjectCode"
          @changeTime="changePlanTime">
        </basic-info>

        <div id="attribute-info">
          <attributeInfoEdit
            v-show="JSON.stringify(projectAttribute) !== '{}'"
            ref="attributeEdit"
            :receive-data="projectBaseInfo"
            :project-attribute="projectAttribute"
            :project-company-list="projectCompanyList"
            @saveAttribute="saveAttribute"
            @changeAttribute="changeAttribute"></attributeInfoEdit>

          <attributeInfo
            v-if="JSON.stringify(projectAttribute) == '{}' && !$route.params.projectCode"
            ref="attribute"
            :receive-data="projectBaseInfo"
            :project-code="projectCode"
            @saveAttribute="saveAttribute"
            @changeAttribute="changeAttribute"></attributeInfo>

          <attributeInfoEditDefault
            v-if="JSON.stringify(projectAttribute) == '{}' && $route.params.projectCode"
            ref="attributeEditDefault"
            :receive-data="projectBaseInfo"
            :project-code="projectCode"
            :project-company-list="projectCompanyList"
            @saveAttribute="saveAttribute"
            @changeAttribute="changeAttribute"></attributeInfoEditDefault>
        </div>

        <div id="product-info" v-if="isShowProductInfo">
          <product-info-edit
            ref="productInfo"
            :tip-language="checkData.projectProduct"
            :receive-data="projectProductInfoList"
            :project-code="projectCode">
          </product-info-edit>
        </div>

        <div id="resource-info" v-if="isShowResourceInfo">
          <res-info-edit
            ref="resourceInfo"
            :tip-language="checkData.projectResource"
            :receive-data="projectResourceInfo"
            :project-code="projectCode">
          </res-info-edit>
        </div>

        <div id="team-info" style="border:1px solid #e4e4e4; margin-bottom:30px;">
          <!-- 需求单位 非研发包 -->
          <DSTeamInfoEditNew
            ref="teamInfo"
            v-if="projectCP === 'ds'"
            :tip-language="checkData.projectTeam"
            :project-company-list="projectCompanyList"
            :project-class="projectBaseInfo.projectClass"
            @saveTeamInfo="saveTeamFlag"></DSTeamInfoEditNew>
          <!-- 需求单位 研发包 -->
          <DGTeamInfoEdit
            ref="teamInfo"
            v-if="projectCP === 'dg'"
            :tip-language="checkData.projectTeam"
            :project-company-list="projectCompanyList"
            @saveTeamInfo="saveTeamFlag"></DGTeamInfoEdit>
          <!-- 承担单位 非研发包、研发包共用 -->
          <USTeamInfoEdit
            ref="teamInfo"
            v-if="projectCP === 'us' || projectCP === 'ug'"
            :tip-language="checkData.projectTeam"
            :project-company-list="projectCompanyList"
            :project-team-list="projectTeamList"
            :project-code="projectCode"
            @saveTeamInfo="saveTeamFlag"
            :lead-department-code="leadDepartmentCode"
            :cooperate-department-code="cooperateDepartmentCode"
          ></USTeamInfoEdit>
          <!-- 承担单位 研发包 -->
          <!-- <UGTeamInfoEdit ref="teamInfo" v-if="projectCP === 'ug'" :project-company-list="projectCompanyList"></UGTeamInfoEdit> -->
        </div>

        <div id="project-budget">
          <!-- 需求单位 非研发包 -->
          <DSProjectBudget
            ref="projectBudget"
            v-if="projectCP === 'ds'"
            :version-no="this.$route.query.versionNo"
            :tips="tisp"></DSProjectBudget>
          <!-- 需求单位 研发包 -->
          <DGProjectBudget
            ref="projectBudget"
            v-if="projectCP === 'dg'"
            :budget-info="costBudgetList"
            :tips="tisp"></DGProjectBudget>
          <!-- 承担单位 非研发包、研发包 -->
          <!-- <UProjectBudget
            ref="projectBudget"
            v-if="projectCategory==='u'"
            :budget-info="budgetData"
            :tip-language="checkData.projectBudget"
            :tips="tisp"
            @saveBudget="saveBudget"></UProjectBudget> -->
          <!-- 承担单位 总分、分总模式 -->
          <u-budget-new
            ref="projectBudgetNew"
            v-if="projectCategory==='u'"
            :budget-info="budgetData"
            :tip-language="checkData.projectBudget"
            :tips="tisp"
            @saveBudget="saveBudget"></u-budget-new>
        </div>

        <div id="subproject-info" style="border:1px solid #e4e4e4;margin-bottom:30px;">
          <!-- 需求单位 -->
          <DSubprojectEdit
            :plan-range-time='planRangeTime'
            ref="subproject"
            :tip-language="checkData.subProjectInfo"
            :project-achievement="checkData.projectAchievement"
            :save-flag='saveFlag'
            v-if="projectCategory==='d' && projectCompanyList.length>0"
            :parent-code='projectCode'
            :receive-data="subProjectInfoList"
            :year-range-prop="planYearRange"
            @saveSubProject="saveSubProject('d')"></DSubprojectEdit>
          <!-- 承担单位 -->
          <USubprojectEdit
            :receive-data="subProjectInfoList"
            :save-flag='saveFlag'
            ref="subproject"
            v-if="projectCategory==='u'"
            :tip-language="checkData.subProjectInfo"
            :project-code='projectCode'
            :parent-code='demandProjectCode'
            :year-range-prop="planYearRange"
            @saveSubProject="saveSubProject('u')"></USubprojectEdit>
        </div>

        <div id='milestone-info' style="border:1px solid #e4e4e4" v-if="milestoneVisible">
          <!-- 需求单位 非研发包 -->
          <DSMilestoneEdit
            ref="milestone"
            :tip-language="checkData.projectMileStone"
            :project-code="projectCode"
            :receive-data="projectBaseInfo"
            v-if="projectCP === 'ds'"
            :save-flag='saveFlag'
            @detailTableMilestoneShowOrHide="isShowMilestone"
            @saveMilestone="saveMilestone"></DSMilestoneEdit>
          <!-- 承担单位 非研发包、研发包 -->
          <UMilestoneEdit
            ref="milestone"
            :tip-language="checkData.projectMileStone"
            :project-code="projectCode"
            :receive-data="projectBaseInfo"
            :parent-code='demandProjectCode'
            v-if="projectCategory==='u'"
            :save-flag='saveFlag'
            @detailTableMilestoneShowOrHide="isShowMilestone"
            @saveMilestone="saveMilestone"></UMilestoneEdit>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_groupPlanProject'
import businessAPI from '@/serve/API_businessFlow'
import groupPlanAPI from '@/serve/API_groupPlan'
import param from '@/const/param'
import { getStore } from '@/store'
import basicInfo from '../components/basic'
import attributeInfo from '../components/attributeInfo/attributeInfo'
import attributeInfoEditDefault from '../components/attributeInfo/editDefault'
import attributeInfoEdit from '../components/attributeInfo/edit'
import DSProjectBudget from '../components/budget/DSBudget'
import DGProjectBudget from '../components/budget/DGBudget'
import DSubprojectEdit from '../components/subproject/DSubprojectEdit'
import USubprojectEdit from '../components/subproject/USubprojectEdit'
import DSMilestoneEdit from '../components/milestone/DSMilestoneEdit'
import UMilestoneEdit from '../components/milestone/UMilestoneEdit'
import DSTeamInfoEditNew from '../components/teamInfo/DSTeamInfo/DSTeamInfoEditNew'
import DGTeamInfoEdit from '../components/teamInfo/DGTeamInfo/DGTeamInfoEdit'
import USTeamInfoEdit from '../components/teamInfo/USTeamInfo/USTeamInfoEdit'
import bus from '@/common/bus'
import ProductInfoEdit from '../components/productInfo/productInfoEdit.vue'
import ResInfoEdit from '../components/resourceInfo/resInfoEdit.vue'
import UBudgetNew from '../components/budget/UBudgetNew.vue'
import { uniqueObjArr } from '@/utils/common'
export default {
  data () {
    return {
      tisp: true,
      checkData: {}, //区块提示内容
      meberEditFlag: false,
      budgetData: {
        isEdit: true,
        projectCode: this.$route.params.projectCode,
        versionNo: this.$route.query.versionNo
      },
      projectName: '',
      saveFlag: false, // 暂存团队信息标志
      // isEditable: false,
      editPermission: false, //编辑权限
      projectCode: '', //项目编号
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      projectBaseInfo: {}, //基本信息
      projectAttribute: {}, //属性信息
      teamInfo: [], //团队信息-承担单位项目观察员和专家
      projectCompanyList: [], // 团队信息 - 公司列表
      projectTeamList: [], // 团队信息-承担单位项目观察员和专家
      costBudgetList: [], //项目预算
      subProjectInfoList: [], // 子项目信息，子项目优化：从项目信息里取子项目的名称
      projectProductInfoList: [], //产品信息
      projectResourceInfo: {}, //资源信息
      exsitSubroject: this.$route.query.needSubprojectFlag, //是否存在承担单位为当前登录人所属公司的所有成果
      navMenus: [
        { name: '基本信息', id: 'basic-info' },
        { name: '属性信息', id: 'attribute-info' },
        { name: '产品信息', id: 'product-info' },
        { name: '资源信息', id: 'resource-info' },
        { name: '团队信息', id: 'team-info' },
        { name: '项目预算', id: 'project-budget' },
        { name: '子项目列表', id: 'subproject-info' },
        { name: '里程碑', id: 'milestone-info' }
      ],
      planYearRange: [], //计划立项结项跨年范围
      planRangeTime: [], //计划立项结项跨年范围，具体到月份时间戳
      leadResponsibleDept: '', //牵头承担部门
      cooperateResponsibleDept: [], //配合承担部门
      baseInfoIsSave: true, //是否已暂存
      attributeIsSave: true,
      teamInfoIsSave: true,
      projectBudgetIsSave: true,
      taskAchIsSave: true,
      milestoneIsSave: true,
      developPackage: '', //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: '', //需求方项目d还是承担方项目u
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      achievementLimitMinTime: null, //预期成果最小限制时间
      achievementLimitMaxTime: null, //预期成果最大限制时间
      mileStoneLimitMinTime: null, //里程碑最小限制时间
      mileStoneLimitMaxTime: null, //里程碑最大限制时间
      demandProjectCode: this.$route.query.demandProjectCode || '', //承担单位项目关联的需求单位项目编码
      blockEditStatus: {
        'baseInfo': { edited: false, label: '基本信息' },
        'attributeEdit': { edited: false, label: '属性信息' },
        'attribute': { edited: false, label: '属性信息' },
        'attributeEditDefault': { edited: false, label: '属性信息' },
        'teamInfo': { edited: false, label: '团队信息' },
        'projectBudget': { edited: false, label: '项目预算' },
        'subproject': { edited: false, label: '子项目' },
        'milestone': { edited: false, label: '里程碑' },
        'productInfo': { edited: false, label: '产品信息' },
        'resourceInfo': { edited: false, label: '资源信息' }
      },
      milestoneVisible: true,
      leadDepartmentCode: '', // 牵头承担部门
      cooperateDepartmentCode: '', // 配合承担部门
      isComplete: true,
      productInfoConfig: true, //是否展示产品信息 - 基础配置信息
      hasProductInfo: true, //项目信息中有产品信息
      resourceInfoConfig: true, //是否展示资源信息 - 基础配置信息
      hasResourceInfo: true //项目信息中有资源信息
    }
  },
  components: {
    basicInfo,
    attributeInfo,
    attributeInfoEditDefault,
    attributeInfoEdit,
    DSProjectBudget,
    DGProjectBudget,
    DSubprojectEdit,
    USubprojectEdit,
    DSMilestoneEdit,
    UMilestoneEdit,
    DGTeamInfoEdit,
    USTeamInfoEdit,
    DSTeamInfoEditNew,
    ProductInfoEdit,
    ResInfoEdit,
    UBudgetNew
  },
  computed: {
    isEditable () {
      return this.editPermission
    },
    isShowProductInfo () {
      let show = this.projectCategory === 'u' && (this.productInfoConfig || this.hasProductInfo)
      return show
    },
    isShowResourceInfo () {
      let show = this.projectCategory === 'u' && (this.resourceInfoConfig || this.hasResourceInfo)
      return show
    }
  },
  watch: {
    isShowProductInfo (newVal, oldVal) {
      if (!newVal) {
        this.deleteNavItem('product-info')
      }
    },
    isShowResourceInfo (newVal, oldVal) {
      if (!newVal) {
        this.deleteNavItem('resource-info')
      }
    }
  },
  methods: {
    acceptAchievementAndMilestoneTime () {
      bus.$off('acceptAchievementTime')
      bus.$off('acceptMilestoneTime')
      bus.$on('acceptAchievementTime', data => {
        this.achievementLimitMaxTime = data[0]
        this.achievementLimitMinTime = data[1]
      })
      bus.$on('acceptMilestoneTime', data => {
        this.mileStoneLimitMaxTime = data[0]
        this.mileStoneLimitMinTime = data[1]
      })
    },
    changeDepartment (val, type) { // 属性信息-部门改变 监听改变值
      if (type === 'lead') {
        this.leadDepartmentCode = val
      } else if (type === 'cooperate') {
        this.cooperateDepartmentCode = val
      }
    },
    saveTeamFlag (flag) { //判断团队信息是否暂存
      this.saveFlag = flag
      if (flag) {
        this.blurAllInput()
      }
      if (this.projectCategory === 'u') {
        // this.$refs.projectBudget.getCostBudgetList()
      }
    },
    saveSubProject (type) {
      this.blurAllInput()
      if (type === 'u') {
        // this.$refs.projectBudget.getCostBudgetList() //承担单位项目子项目暂存后更新预算信息
      }
    },
    //属性信息暂存成功
    saveAttribute (obj) {
      let params = {
        curBlock: 'attribute',
        hasEdited: false
      }
      this.blurAllInput()
      bus.$emit('groupPlanProjectEdit', params)
      // 获取牵头承担部门和配合承担部门的值
      let extendedAttributes = JSON.parse(obj.extendedAttributes)
      extendedAttributes.forEach((item, index) => {
        item.fieldList.forEach((item1, index1) => {
          if (item1.key === 'leadResponsibleDept') {
            if (item1.defaultValue && item1.defaultValue.substring(0, 1) === '{') {
              this.leadDepartmentCode = JSON.parse(item1.defaultValue).orgName
            } else {
              this.leadDepartmentCode = item1.defaultValue
            }
          }
          if (item1.key === 'cooperateResponsibleDept') {
            this.cooperateDepartmentCode = item1.defaultValue
          }
        })
      })
      if (this.projectCategory === 'u') {
        // this.$refs.projectBudget.getCostBudgetList()
      }
    },
    //属性信息中修改了
    changeAttribute (obj) {
      let { key, value } = obj
      let params = {
        curBlock: 'attribute',
        hasEdited: true
      }
      if (key !== 'schemeDtoId') {
        bus.$emit('groupPlanProjectEdit', params)
      }
      if (this.projectCategory === 'u' && (key === 'leadResponsibleDept' || key === 'cooperateResponsibleDept')) {
        // setTimeout(() => {
        //   this.$message({
        //     message: '请及时修改团队信息中项目经理和项目成员！',
        //     type: 'warning',
        //     showClose: true
        //   })
        // }, 0)
      }
    },
    //获取项目的编辑权限
    getPermission () {
      this.verificationPermission('02')
    },
    //查询权限
    verificationPermission (authCode) {
      const param = {
        permissionCode: authCode,
        projectCode: this.$route.params.projectCode
      }
      API.checkUserProjectPermission(param)
        .then(res => {
          if (authCode === '02') {
            this.editPermission = res
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '权限获取失败！',
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
    updateProjectCode (projectBaseInfo) {
      this.blurAllInput()
      this.projectCode = projectBaseInfo.projectCode
      this.projectName = projectBaseInfo.projectName
      this.projectBaseInfo = projectBaseInfo
      this.planRangeTime = [projectBaseInfo.planApprovalTime, projectBaseInfo.planFinishTime]
      this.budgetData.projectCode = projectBaseInfo.projectCode
      if (this.projectCategory === 'u') {
        // this.$refs.projectBudget.getCostBudgetList()
        this.$refs.projectBudgetNew.getCostBudgetList()
      }
    },
    updateProjectName (name) {
      this.projectName = name
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

      if (sTop + cHei + 1 >= sHei) {
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
    //更改计划立项和结项时间
    changePlanTime (arr, type) {
      let msg = ''
      let msgArr = []
      /* if (type === 'start') {
        let startTime = arr[0] ? new Date(new Date(arr[0])
          .toLocaleDateString())
          .getTime() : ''
        let achMinTime = this.achievementLimitMinTime ? new Date(new Date(this.achievementLimitMinTime)
          .toLocaleDateString())
          .getTime() : ''
        let mileMinTime = this.mileStoneLimitMinTime ? new Date(new Date(this.mileStoneLimitMinTime)
          .toLocaleDateString())
          .getTime() : ''
        if (achMinTime && startTime > achMinTime) {
          msgArr.push('计划立项时间不可大于任何成果的预期交付时间！')
        }
        if (mileMinTime && startTime > mileMinTime) {
          msgArr.push('计划立项时间不可大于任何里程碑的计划完成时间！')
        }
      } else if (type === 'end') {
        let endTime = arr[1] ? new Date(new Date(arr[1])
          .toLocaleDateString())
          .getTime() : ''
        let achMaxTime = this.achievementLimitMaxTime ? new Date(new Date(this.achievementLimitMaxTime)
          .toLocaleDateString())
          .getTime() : ''
        let mileMaxTime = this.mileStoneLimitMaxTime ? new Date(new Date(this.mileStoneLimitMaxTime)
          .toLocaleDateString())
          .getTime() : ''
        if (achMaxTime && endTime < achMaxTime) {
          msgArr.push('计划结项时间不可小于任何成果的预期交付时间！')
        }
        if (mileMaxTime && endTime < mileMaxTime) {
          msgArr.push('计划结项时间不可小于任何里程碑的计划完成时间！')
        }
      }
      msgArr.forEach((ele, index) => {
        if (index === 0) {
          msg += ele
        } else {
          msg = msg + '<br/>' + ele
        }
      })
      if (msg) {
        let param = ''
        if (type === 'start') {
          param = this.planRangeTime[0]
        } else if (type === 'end') {
          param = this.planRangeTime[1]
        }
        this.$refs.baseInfo.setPlanTime(param, type)
        this.$message({
          dangerouslyUseHTMLString: true,
          message: msg,
          type: 'warning',
          showClose: true
        })
        return
      } */
      this.planRangeTime = arr
      let tempYear = []
      let parseYear = [new Date(arr[0])
        .getFullYear(), new Date(arr[1])
        .getFullYear()]
      for (let i = parseYear[0]; i <= parseYear[1]; i++) {
        tempYear.push(i)
      }
      this.planYearRange = tempYear
    },
    cancelEdit () {
      if (this.isComplete) {
        this.$confirm(' ', '是否确认退出编辑?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            if (this.$route.params.projectCode && history.length > 1) {
              history.go(-1)
            } else {
              window.close()
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出编辑'
            })
          })
      } else {
        this.$confirm(' ', '存在未保存的消息，是否确认退出编辑?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            if (this.$route.params.projectCode && history.length > 1) {
              history.go(-1)
            } else {
              window.close()
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出编辑'
            })
          })
      }
    },
    delProject () {
      this.$confirm(' ', '请确认是否删除项目?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let interFaceName = ''
          if (this.projectCategory === 'd') {
            interFaceName = 'removeProjectTemporaryVersionD'
          } else {
            interFaceName = 'removeProjectTemporaryVersionU'
          }
          // if (!interFaceName) return
          API[interFaceName]({ projectCode: this.projectCode })
            .then(data => {
              let projectName = this.$refs.baseInfo.getProjectName()
              this.$message.success(projectName + '项目已删除')
              window.setTimeout(() => {
                window.close()
              }, 1000)
            })
            .catch(err => {
              this.$message.error(err.message || '删除项目信息失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async saveProject (isOnlySave) {
      this.isComplete = true
      let baseInfo = await this.$refs.baseInfo.validate()
      if (!baseInfo.projectCode) {
        this.$message.warning('请先保存基本信息')
        return false
      }
      let teamInfo = await this.$refs.teamInfo.validate()
      let milestone = this.$refs.milestone ? await this.$refs.milestone.validate() : true
      let projectBudget = this.projectCategory === 'u' ? await this.$refs.projectBudgetNew.validate() : true
      let attribute = ''
      if (JSON.stringify(this.projectAttribute) === '{}' && !this.$route.params.projectCode) {
        //新增
        attribute = await this.$refs.attribute.validate()
      } else if (JSON.stringify(this.projectAttribute) === '{}' && this.$route.params.projectCode) {
        //编辑默认
        attribute = await this.$refs.attributeEditDefault.validate()
      } else {
        //编辑
        attribute = await this.$refs.attributeEdit.validate()
      }
      //资源信息
      let resourceInfo = this.isShowResourceInfo ? await this.$refs.resourceInfo.validate() : {}

      if (projectBudget === 'hasTip') { //项目预算校验提示
        return false
      }

      if (!baseInfo || !teamInfo || !attribute || !projectBudget || !resourceInfo) {
        this.$message.error('请填写完整页面信息')
        return false
      }

      //产品信息
      let productInfo = null
      if (this.isShowProductInfo) {
        productInfo = await this.$refs.productInfo.validate()
        if (!productInfo) {
          this.$message.error('请填写产品信息')
          return false
        }
      }

      let subproject = await this.$refs.subproject.validate()
      if (!subproject) {
        return false
      }
      if (milestone === 'hasTip') { //组件内提示
        return false
      }
      if (!milestone) {
        this.$message.error('请填写里程碑信息')
        return false
      }
      let params = {}

      params.projectBaseInfo = baseInfo
      if (this.projectCategory === 'u') {
        params.projectTeamList = teamInfo
      } else if (this.projectCategory === 'd') {
        params.projectCompanyList = teamInfo.projectCompanyList
      }
      if (this.milestoneVisible) { //需求单位一般支撑包无里程碑
        params.projectMileStones = milestone
      }
      params.projectAttribute = attribute
      params.subProjectInfoList = subproject
      if (this.projectCategory === 'u') {
        params.costBudgetList = projectBudget
      }
      if (this.isShowProductInfo) {
        params.projectProductInfoList = productInfo
      }
      if (this.isShowResourceInfo) {
        params.projectResourceInfo = resourceInfo
      }
      params.businessFormUrl = `/groupPlan/projectEdit/${this.projectCode}?developPackage=${this.developPackage}&projectCategory=${this.projectCategory}`
      // params.resultInformations = taskAch

      let interFaceName = ''
      if (this.projectCategory === 'd') {
        interFaceName = 'saveProjectInfoD'
      } else {
        interFaceName = 'saveProjectInfoU'
      }
      // if (!interFaceName) return
      API[interFaceName](params)
        .then(data => {
          let fromReject = this.$route.query.from === 'reject'
          /**
           * 需求单位项目：
           * 0、无内容发生变动
           * 1、草稿/立项状态： 有信息发生变动未涉及基线信息  提示保存成功
           * 2、草稿状态： 保存无单据， 提示 “是否发起计划调整或立项审批流程” -> 请选择需要发起的审批流程
           * 3、草稿状态： 保存有状态为草稿立项单据  提示 “是否发起立项流程” -> 是否发起立项审批
           * 4、草稿状态： 保存有状态为草稿计划调整单据 提示 “是否发起计划调整流程”
           * 5、立项状态： 保存无变更单据，提示“是否发起变更流程” -> 是否发起项目变更审批
           * 6、立项状态： 保存有状态为草稿变更单据，提示“是否发起变更流程” -> 是否发起项目变更审批
           * 7、审批单据被驳回编辑，提示保存成功
           */
          /**
           * 承担单位项目：
           * 0、无内容发生变动
           * 1、草稿/立项状态： 有信息发生变动未涉及基线信息  提示保存成功
           * 2、草稿状态： 保存无单据 提示立项流程 -> 是否发起立项审批
           * 3、草稿状态： 保存有立项单据，提示 “是否发起立项流程” -> 是否发起立项审批
           * 4、立项状态： 保存无变更单据，提示“是否发起变更流程” -> 是否发起项目变更审批
           * 5、立项状态： 保存有变更单据，提示“是否发起变更流程” -> 是否发起项目变更审批
           * 6、审批单据被驳回编辑，提示保存成功
           */
          let isJumpt = true //是否需要跳转流程页面
          let isReject = false //驳回编辑页面
          let msg = '' // 弹框提示内容
          let flowPoint = '' //跳转项目流程的页签
          if (this.projectCategory === 'd') {
            switch (data.state) {
              case 0:
                msg = '保存成功'
                isJumpt = false
                break
              case 1:
                msg = '保存成功'
                isJumpt = false
                break
              case 2:
                msg = '请选择需要发起的审批流程'
                isJumpt = true
                flowPoint = '计划调整流程'
                break
              case 3:
                msg = '是否发起立项审批？'
                isJumpt = true
                flowPoint = '立项流程'
                break
              case 4:
                msg = '是否发起计划调整审批？'
                isJumpt = true
                flowPoint = '计划调整流程'
                break
              case 5:
                msg = '是否发起项目变更审批？'
                isJumpt = true
                flowPoint = '变更流程'
                break
              case 6:
                msg = '是否发起项目变更审批？'
                isJumpt = true
                flowPoint = '变更流程'
                break
              case 7:
                msg = '保存成功'
                isJumpt = false
                isReject = true
                break
              case 8:
                msg = '是否发起立项审批？'
                isJumpt = true
                flowPoint = '立项流程'
                break
            }
          } else {
            switch (data.state) {
              case 0:
                msg = '保存成功。'
                isJumpt = false
                break
              case 1:
                msg = '保存成功'
                isJumpt = false
                break
              case 2:
                msg = '是否发起立项审批？'
                isJumpt = true
                flowPoint = '立项流程'
                break
              case 3:
                msg = '是否发起立项审批？'
                isJumpt = true
                flowPoint = '立项流程'
                break
              case 4:
                msg = '是否发起项目变更审批？'
                isJumpt = true
                flowPoint = '变更流程'
                break
              case 5:
                msg = '是否发起项目变更审批？'
                isJumpt = true
                flowPoint = '变更流程'
                break
              case 6:
                msg = '保存成功'
                isJumpt = false
                isReject = true
                break
              case 7:
                msg = '请选择需要发起的审批流程'
                isJumpt = true
                flowPoint = '预立项流程'
                break
              case 8:
                msg = '是否发起预立项?'
                isJumpt = true
                flowPoint = '预立项流程'
                break
            }
          }
          // 提示保存成功并关闭页面 -> 驳回页面
          if (isReject) {
            this.$message({
              message: msg,
              type: 'success',
              showClose: true
            })
            history.go(-1)
            return
          }
          // 只提示 -> 1、单独点击保存按钮，只保存不跳转；2、未涉及基线或无任何内容变更（非驳回且不跳转的情况），如何处理？
          if (isOnlySave || (!isJumpt && !isReject)) {
            let type = 'success'
            if (isOnlySave) {
              msg = '保存成功'
            } else {
              msg = '无法发起审批'
              type = 'warning'
            }
            this.$message({
              message: msg,
              type: type,
              showClose: true
            })
            setTimeout(() => {
              if (this.$route.params.projectCode) {
                window.location.reload()
              } else {
                let urlArr = window.location.href.split('?')
                urlArr[0] = urlArr[0] + '/' + this.projectCode
                window.location.replace(urlArr.join('?'))
                window.location.reload()
              }
            }, 1000)
            return
          }
          let confirmTxt = '确定'
          let cancleTxt = '取消'
          let hasTwoFlow = false
          if (this.projectCategory === 'd' && data.state === 2) {
            cancleTxt = '发起计划调整审批'
            confirmTxt = '发起立项审批'
            hasTwoFlow = true
          }
          if (this.projectCategory === 'u' && data.state === 7) {
            cancleTxt = '发起预立项审批'
            confirmTxt = '发起立项审批'
            hasTwoFlow = true
          }
          let isClose = false
          let cancelButtonClass = 'self-message-box-delete-cancel adjust-btn'
          let confirmButtonClass = 'self-message-box-delete-confirm adjust-btn'
          if (hasTwoFlow) {
            cancelButtonClass = confirmButtonClass + ' adjust-left-btn'
          }
          // 保存之后提示是否跳转
          this.$confirm(' ', msg, {
            confirmButtonText: confirmTxt,
            cancelButtonText: cancleTxt,
            type: 'warning',
            showClose: true,
            customClass: 'self-message-box-delete',
            cancelButtonClass: cancelButtonClass,
            confirmButtonClass: confirmButtonClass,
            distinguishCancelAndClose: true,
            beforeClose: (action, instance, done) => {
              if (this.projectCategory === 'd' && data.state === 2) {
                if (action === 'cancel') {
                  flowPoint = '计划调整流程'
                  this.$router.push({
                    path: '/groupPlan/planAdjustFlow/planAdjustFlowEdit',
                    query: {
                      newChange: data.approveNo ? 'false' : 'true',
                      businessType: 'BT-DEMAND-PLAN-CHANGE',
                      projectCode: this.projectCode,
                      approveNo: data.approveNo || '', //业务流水号
                      developPackage: this.developPackage,
                      projectCategory: this.projectCategory
                    }
                  })
                } else if (action === 'close') {
                  isClose = true
                }
              }
              if (this.projectCategory === 'u' && data.state === 7) {
                if (action === 'cancel') {
                  let beforeLaunchType = 'BT-UNDERTAKER-PRE-APPROVE'
                  let isNew = data.approveNo === null ? 'true' : 'false'
                  this.gobeforeLaunchFlowEdit('BT-UNDERTAKER-PRE-APPROVE', isNew, data.approveNo)
                } else if (action === 'close') {
                  isClose = true
                }
              }
              done()
            }
          })
            .then(() => {
              if ((this.projectCategory === 'd' && data.state === 2) || (this.projectCategory === 'u' && data.state === 7)) {
                flowPoint = '立项流程'
              }
              if (flowPoint === '计划调整流程') {
                this.$router.push({
                  path: '/groupPlan/planAdjustFlow/planAdjustFlowEdit',
                  query: {
                    newChange: 'false',
                    businessType: 'BT-DEMAND-PLAN-CHANGE',
                    projectCode: this.projectCode,
                    approveNo: data.approveNo, //业务流水号
                    developPackage: this.developPackage,
                    projectCategory: this.projectCategory
                  }
                })
              } else if (flowPoint === '立项流程') {
                let launchType = this.projectCategory === 'd' ? 'BT-DEMAND-APPROVE' : 'BT-UNDERTAKER-APPROVE'
                let isNew = data.approveNo === null ? 'true' : 'false'
                let params = {
                  type: launchType, // 单据业务类型编码
                  projectCode: this.projectCode
                }
                businessAPI.checkVoidAttachment(params)
                  .then(res => {
                    if (res === true) {
                      this.$confirm(' ', '是否自动带入之前上传的附件？', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        showClose: false,
                        customClass: 'self-message-box-delete',
                        cancelButtonClass: 'self-message-box-delete-cancel',
                        confirmButtonClass: 'self-message-box-delete-confirm'
                      })
                        .then(() => {
                          this.$router.push({
                            path: '/groupPlan/launchFlow/launchFlowEdit',
                            query: {
                              newLaunch: isNew,
                              businessType: launchType, // 立项单据业务类型编码
                              approveNo: data.approveNo, //业务流水号
                              projectCode: this.projectCode, //项目编码
                              developPackage: this.developPackage,
                              projectCategory: this.projectCategory,
                              bringFiles: '1'
                            }
                          })
                        })
                        .catch(() => {
                          this.$router.push({
                            path: '/groupPlan/launchFlow/launchFlowEdit',
                            query: {
                              newLaunch: isNew,
                              businessType: launchType, // 立项单据业务类型编码
                              approveNo: data.approveNo, //业务流水号
                              projectCode: this.projectCode, //项目编码
                              developPackage: this.developPackage,
                              projectCategory: this.projectCategory,
                              bringFiles: '2'
                            }
                          })
                        })
                    } else {
                      this.$router.push({
                        path: '/groupPlan/launchFlow/launchFlowEdit',
                        query: {
                          newLaunch: isNew,
                          businessType: launchType, // 立项单据业务类型编码
                          approveNo: data.approveNo, //业务流水号
                          projectCode: this.projectCode, //项目编码
                          developPackage: this.developPackage,
                          projectCategory: this.projectCategory,
                          bringFiles: '2'
                        }
                      })
                    }
                  })
                  .catch(e => {
                    this.loading = false
                    if (e.selfError) return
                    if (e.message) {
                      this.$message({
                        message: e.message || '获取作废流程附件失败，请稍后重试！',
                        type: 'error',
                        showClose: true
                      })
                    }
                  })
              } else if (flowPoint === '预立项流程') {
                let beforeLaunchType = 'BT-UNDERTAKER-PRE-APPROVE'
                let isNew = data.approveNo === null ? 'true' : 'false'
                this.gobeforeLaunchFlowEdit('BT-UNDERTAKER-PRE-APPROVE', isNew, data.approveNo)
              } else if (flowPoint === '变更流程') {
                let changeType = this.projectCategory === 'd' ? 'BT-DEMAND-CHANGE' : 'BT-UNDERTAKER-CHANGE'
                let isNew = data.approveNo === null ? 'true' : 'false'
                this.$router.push({
                  path: '/groupPlan/changeFlow/changeFlowEdit',
                  query: {
                    newChange: isNew,
                    businessType: changeType, // 变更单据业务类型编码
                    projectCode: this.projectCode,
                    approveNo: data.approveNo, //业务流水号
                    developPackage: this.developPackage,
                    projectCategory: this.projectCategory
                  }
                })
              }
            })
            .catch(() => {
              if (this.projectCategory === 'd' && data.state === 2 && !isClose) return
              if (this.projectCategory === 'u' && data.state === 7 && !isClose) return
              this.projectName = baseInfo.projectName
              this.$message({
                type: 'info',
                message: '已取消发起'
              })
              this.$refs.milestone.upDataList()//更新里程碑列表
              this.$refs.subproject.upDataList()//更新里程碑列表
              setTimeout(() => {
                if (this.$route.params.projectCode) {
                  window.location.reload()
                } else {
                  let urlArr = window.location.href.split('?')
                  urlArr[0] = urlArr[0] + '/' + this.projectCode
                  window.location.replace(urlArr.join('?'))
                  window.location.reload()
                }
              }, 1000)
            })
        })
        .catch(err => {
          this.$message.error(err.message || '保存项目信息失败')
        })
    },
    gobeforeLaunchFlowEdit (beforeLaunchType, isNew, approveNo) { //跳转预立项
      let params = {
        type: beforeLaunchType, // 单据业务类型编码
        projectCode: this.projectCode
      }
      businessAPI.checkVoidAttachment(params)
        .then(res => {
          if (res === true) {
            this.$confirm(' ', '是否自动带入之前上传的附件？', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
              customClass: 'self-message-box-delete',
              cancelButtonClass: 'self-message-box-delete-cancel',
              confirmButtonClass: 'self-message-box-delete-confirm'
            })
              .then(() => {
                this.$router.push({
                  path: '/groupPlan/beforeLaunchFlow/beforeLaunchFlowEdit',
                  query: {
                    newBeforeLaunch: isNew,
                    businessType: beforeLaunchType, // 立项单据业务类型编码
                    approveNo: approveNo, //业务流水号
                    projectCode: this.projectCode, //项目编码
                    developPackage: this.developPackage,
                    projectCategory: this.projectCategory,
                    bringFiles: '1'
                  }
                })
              })
              .catch(() => {
                this.$router.push({
                  path: '/groupPlan/beforeLaunchFlow/beforeLaunchFlowEdit',
                  query: {
                    newBeforeLaunch: isNew,
                    businessType: beforeLaunchType, // 立项单据业务类型编码
                    approveNo: approveNo, //业务流水号
                    projectCode: this.projectCode, //项目编码
                    developPackage: this.developPackage,
                    projectCategory: this.projectCategory,
                    bringFiles: '2'
                  }
                })
              })
          } else {
            this.$router.push({
              path: '/groupPlan/beforeLaunchFlow/beforeLaunchFlowEdit',
              query: {
                newBeforeLaunch: isNew,
                businessType: beforeLaunchType, // 立项单据业务类型编码
                approveNo: approveNo, //业务流水号
                projectCode: this.projectCode, //项目编码
                developPackage: this.developPackage,
                projectCategory: this.projectCategory,
                bringFiles: '2'
              }
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取作废流程附件失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取立项流程信息
    getLaunchInfo () {
      let launchType = this.projectCategory === 'd' ? 'BT-DEMAND-APPROVE' : 'BT-UNDERTAKER-APPROVE'
      let params = {
        projectCode: this.projectCode,
        businessType: launchType //立项类型:枚举值
      }
      businessAPI.getApproveList(params)
        .then(res => {
          if (res && res.length !== 0 && res[0].projectApproveInfo.approveState === '1') {
            //有立项单据草稿，进入编辑页面
            this.$router.push({
              path: '/groupPlan/launchFlow/launchFlowEdit',
              query: {
                newLaunch: 'false',
                businessType: launchType, // 立项单据业务类型编码
                approveNo: res.approveNo, //业务流水号
                projectCode: this.projectCode, //项目编码
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          } else {
            //无草稿，发起立项
            this.$router.push({
              path: '/groupPlan/launchFlow/launchFlowEdit',
              query: {
                newLaunch: 'true',
                businessType: launchType, // 立项单据业务类型编码
                projectCode: this.projectCode, //项目编码
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取立项流程信息失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //获取变更流程列表
    getChangeApproveList () {
      let type = this.projectCategory === 'd' ? 'BT-DEMAND-CHANGE' : 'BT-UNDERTAKER-CHANGE'
      let params = {
        projectCode: this.projectCode,
        businessType: type
      }
      businessAPI.getApproveList(params)
        .then(res => {
          if (res && res.length > 0 && res[0].projectApproveInfo.approveState === '1') {
            //变更流程列表第一个为草稿，进入此草稿的编辑页面
            let process = res[0].projectApproveInfo
            this.$router.push({
              path: '/groupPlan/changeFlow/changeFlowEdit',
              query: {
                newChange: 'false',
                businessType: type, // 变更单据业务类型编码
                projectCode: process.projectCode,
                approveNo: process.approveNo, //业务流水号
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          } else {
            //无草稿，发起变更
            this.$router.push({
              path: '/groupPlan/changeFlow/changeFlowEdit',
              query: {
                newChange: 'true',
                businessType: type, // 变更单据业务类型编码
                projectCode: this.projectCode,
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取变更流程列表失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    calcPlanYear (basicInfo) {
      this.planRangeTime = [basicInfo.planApprovalTime, basicInfo.planFinishTime]
      let startYear = new Date(basicInfo.planApprovalTime)
        .getFullYear()
      let endYear = new Date(basicInfo.planFinishTime)
        .getFullYear()

      for (let i = startYear; i <= endYear; i++) {
        this.planYearRange.push(i)
      }
    },
    //获取最新项目信息
    getLatestProjectInfo (projectCode) {
      let interFaceName = ''
      if (this.projectCategory === 'd') {
        interFaceName = 'queryLatestProjectInfoD'
      } else {
        interFaceName = 'queryLatestProjectInfoU'
      }
      // if (!interFaceName) return
      let params = {
        projectCode: projectCode,
        allSubProjectInfo: false
      }
      API[interFaceName](params)
        .then(data => {
          //需求单位非一般支撑包项目，承担单位项目
          //不能大于计划结项时间、任何成果的预期交付时间和任何里程碑的计划完成时间
          if (this.projectCP === 'ds' || this.projectCategory === 'u') {
            if (data.subProjectInfoList) {
              data.subProjectInfoList.forEach(subPj => {
                if (subPj.projectAchievementList) {
                  subPj.projectAchievementList.forEach(ach => {
                    if (!this.achievementLimitMinTime) this.achievementLimitMinTime = ach.deliveryTime
                    if (!this.achievementLimitMaxTime) this.achievementLimitMaxTime = ach.deliveryTime
                    this.achievementLimitMinTime = ach.deliveryTime < this.achievementLimitMinTime ? ach.deliveryTime : this.achievementLimitMinTime
                    this.achievementLimitMaxTime = ach.deliveryTime > this.achievementLimitMaxTime ? ach.deliveryTime : this.achievementLimitMaxTime
                  })
                }
              })
            }
            //TODO:成果和里程碑时间获取
            if (data.projectMileStoneList) {
              data.projectMileStoneList.forEach(stone => {
                // if (!this.mileStoneLimitMinTime) this.mileStoneLimitMinTime = stone.planFinishTime
                // if (!this.mileStoneLimitMaxTime) this.mileStoneLimitMaxTime = stone.planFinishTime
                if (!this.mileStoneLimitMinTime) {
                  this.mileStoneLimitMinTime = new Date(stone.planFinishTime + ' 00:00:00')
                    .getTime()
                }
                if (!this.mileStoneLimitMaxTime) {
                  this.mileStoneLimitMaxTime = new Date(stone.planFinishTime + ' 00:00:00')
                    .getTime()
                }
                this.mileStoneLimitMinTime = stone.planFinishTime < this.mileStoneLimitMinTime ? stone.planFinishTime : this.mileStoneLimitMinTime
                this.mileStoneLimitMaxTime = stone.planFinishTime > this.mileStoneLimitMaxTime ? stone.planFinishTime : this.mileStoneLimitMaxTime
              })
            }
          }
          //基本信息
          this.projectBaseInfo = data.projectBaseInfo
          if (this.projectCategory === 'u') {
            this.demandProjectCode = data.projectBaseInfo.parentCode
          }
          this.projectName = data.projectBaseInfo.projectName
          // 属性信息
          if (data.projectAttribute) {
            this.projectAttribute = data.projectAttribute.extendedAttributes === '[]' || !data.projectAttribute.extendedAttributes ? {} : data.projectAttribute
            // 获取牵头承担部门和配合承担部门的值
            let extendedAttributes = data.projectAttribute.extendedAttributes === '[]' || !data.projectAttribute.extendedAttributes ? [] : JSON.parse(data.projectAttribute.extendedAttributes)
            extendedAttributes.forEach((item, index) => {
              item.fieldList.forEach((item1, index1) => {
                if (item1.key === 'leadResponsibleDept') {
                  if (item1.defaultValue && item1.defaultValue.substring(0, 1) === '{') {
                    this.leadDepartmentCode = JSON.parse(item1.defaultValue).orgName
                  } else {
                    this.leadDepartmentCode = item1.defaultValue
                  }
                }
                if (item1.key === 'cooperateResponsibleDept') {
                  this.cooperateDepartmentCode = item1.defaultValue
                }
              })
            })
          }
          //团队信息
          if (this.projectCategory === 'u') { //承担单位
            this.projectTeamList = data.projectTeamList //项目观察员和专家
            let teamRoleCode = ['PR-MANAGER', 'PR-LEADER-UNDERTAKER-MANAGER', 'PR-MEMBER', 'PR-LEADER-UNDERTAKER-MEMBER', 'PR-PARTNER-UNDERTAKER-MEMBER'] // 子项目可选项目经理范围 roleCode
            let subManageOptions = data.projectTeamList.filter(item => {
              if (teamRoleCode.indexOf(item.projectRoleCode) !== -1) {
                return item
              }
            })
            subManageOptions = uniqueObjArr(subManageOptions, 'userAccount')
            this.$refs['subproject'].setManageOptions(subManageOptions)
          }
          if (data.projectCompanyList) {
            this.projectCompanyList = data.projectCompanyList
          } else {
            this.getLoginInfo() //团队信息不存在，则取默认值
          }
          //项目预算
          if (!data.costBudgetList || data.costBudgetList.length === 0) {
            // this.calcPlanYear(this.projectBaseInfo)
          }
          this.calcPlanYear(this.projectBaseInfo)
          this.costBudgetList = data.costBudgetList

          //子项目
          this.subProjectInfoList = data.subProjectInfoList || []

          if (this.projectCategory === 'u') {
            //产品信息
            this.projectProductInfoList = data.projectProductInfoList || []
            this.hasProductInfo = this.projectProductInfoList && this.projectProductInfoList.length > 0
            //资源信息
            this.projectResourceInfo = data.projectResourceInfo || {}
            this.hasResourceInfo = !!((this.projectResourceInfo && JSON.stringify(this.projectResourceInfo) !== '{}'))
          }
          // 属性信息
          /* if (data.projectAttribute) {
              this.projectAttribute = data.projectAttribute
              let extend = JSON.parse(this.projectAttribute.extendedAttributes)
              let fieldList = extend[0].fieldList
              let lead = fieldList.filter(item => item.key === 'leadResponsibleDept')
              let cooper = fieldList.filter(item => item.key === 'cooperateResponsibleDept')
              this.leadResponsibleDept = lead[0].value
              this.cooperateResponsibleDept = JSON.parse(cooper[0].value)
            } */
        })
        .catch(err => {
          this.$message.error(err.message || '获取详情失败')
        })
    },
    //查询对应的项目信息 - 承担单位新建查关联需求单位
    getDemandProjectInfo () {
      API.queryProjectBaseInfo(this.demandProjectCode)
        .then(res => {
          //基本信息
          // this.$set(this.projectBaseInfo, 'projectClass', res.projectClass)
          // this.$set(this.projectBaseInfo, 'projectLevel', res.projectLevel)
          // this.projectBaseInfo.projectClass = res.projectClass
          this.projectBaseInfo = {
            id: '', //主键
            projectCode: '', //项目编码
            projectName: '', //项目名称
            projectClass: res.projectClass, //项目类别
            projectLevel: res.projectLevel, //项目级别
            planApprovalTime: res.planApprovalTime, //计划立项时间
            planFinishTime: res.planFinishTime, //计划结项时间
            projectExpenditureType: '', //费用类别
            projectDetailsStatus: '0', //项目状态
            projectType: '', //项目分类
            parentCode: this.demandProjectCode
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
    //承担单位项目将当前创建人作为牵头项目经理，部门作为牵头承担部门
    getLoginInfo () {
      let curOrg = this.$store.getters['USERENTITY/userInfo'].userAuth.curUserOrg
      let user = this.$store.getters['USERENTITY/userInfo'].userAuth
      let company = {
        organizationCode: curOrg.orgCode,
        organizationName: curOrg.orgName,
        companyCode: curOrg.companyCode,
        companyName: curOrg.companyName,
        type: '2',
        leaderFlag: '1',
        projectTeamList: [{
          organizationCode: curOrg.orgCode,
          companyCode: curOrg.companyCode,
          userName: user.chineseName,
          employeeNum: user.employeeNum,
          userAccount: user.uid,
          projectRoleCode: 'PR-LEADER-UNDERTAKER-MANAGER'
        }]
      }
      this.projectCompanyList = [company]
    },
    //添加监听器
    addEventListener () {
      bus.$off('groupPlanProjectEdit')
      bus.$on('groupPlanProjectEdit', data => {
        let { curBlock, hasEdited, onlyShowMsg } = data
        let keys = Object.keys(this.blockEditStatus)
        let msgArr = []
        let msg = '请先保存'
        keys.forEach(key => {
          if (key !== curBlock && this.blockEditStatus[key].edited) {
            //不是当前被编辑的区块 且 已被编辑但未暂存，需要提示
            msgArr.push(this.blockEditStatus[key].label)
          }
        })
        if (hasEdited || msgArr.length) {
          this.isComplete = false
        } else {
          this.isComplete = true
        }
        if (msgArr.length > 0 && hasEdited) {
          //有已编辑未暂存的区块，给予提示 --- hasEdited=false 暂存，不需提示
          msgArr.forEach((ele, index) => {
            msg = msg + ele
            if (index !== msgArr.length - 1) {
              msg += '、'
            }
          })
          setTimeout(() => { //新的宏任务队列，防止message显示重叠
            this.$message({
              type: 'warning',
              message: msg + '！',
              showClose: true
            })
          }, 0)
        }
        if (!onlyShowMsg) {
        //更改当前区块编辑状态
          this.blockEditStatus[curBlock].edited = hasEdited
          this.$store.commit('GROUPPLAN/setBlockEditStatus', this.blockEditStatus)
        }
      })
    },
    isShowMilestone (show) {
      this.milestoneVisible = show
      if (show) return
      let index = -1
      this.navMenus.some((ele, i) => {
        if (ele.id === 'milestone-info') {
          index = i
          return true
        }
      })
      if (index > -1) {
        this.navMenus.splice(index, 1)
      }
    },
    getCheckboxMsg (data) {
      groupPlanAPI.baseLineGetOption({ projectType: data })
        .then(res => {
          if (res && res.content && res.content.length) {
            this.checkData = JSON.parse(res.content)
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    saveBudget () {
      this.blurAllInput()
    },
    saveMilestone () {
      this.blurAllInput()
    },
    //获取页面上的输入框并移除焦点
    blurAllInput () {
      let inputDoms = Array.from(document.querySelectorAll('.el-input__inner'))
      let textAreaDoms = Array.from(document.querySelectorAll('.el-textarea__inner'))
      inputDoms.forEach(ele => {
        ele.blur()
      })
      textAreaDoms.forEach(ele => {
        ele.blur()
      })
    },
    //获取产品信息配置
    getProductInfoShow () {
      API.showProjectProductInfo({ projectCode: this.projectCode })
        .then(res => {
          this.productInfoConfig = res
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message,
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //获取资源信息配置
    getResourceInfoShow () {
      API.showProjectResourceInfo({ projectCode: this.projectCode })
        .then(res => {
          this.resourceInfoConfig = res
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message,
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
    }
  },
  created () {
    this.addEventListener()
    this.projectCode = this.$route.params.projectCode || ''
    // this.versionNo = this.$route.query.versionNo || ''
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
    this.developPackage = this.$route.query.developPackage || ''
    this.projectCategory = this.$route.query.projectCategory || ''
    let isPackage = this.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.projectCategory + isPackage
    this.demandProjectCode = this.$route.query.demandProjectCode || '' //承担单位项目关联的需求单位项目编码

    if (this.projectCP === 'dg') { //不展示里程碑
      this.isShowMilestone(false)
    }
    if (this.projectCategory === 'u') {
      if (!this.projectCode) { //新增项目
        this.hasProductInfo = false
        this.hasResourceInfo = false
      }
      this.getProductInfoShow()
      this.getResourceInfoShow()
    } else {
      this.deleteNavItem('product-info')
      this.deleteNavItem('resource-info')
    }

    if (this.projectCode) { //编辑项目
      this.getPermission()
      this.getLatestProjectInfo(this.projectCode)
    } else if (this.demandProjectCode && this.projectCategory === 'u') { //新建承担单位项目 - 非一般支撑包、一般支撑包
      this.editPermission = true //可以新增项目
      this.getDemandProjectInfo() //带入需求单位项目某些字段
      this.getLoginInfo() //当前创建人作为牵头项目经理，部门作为牵头承担部门
    }
    if (this.projectCategory === 'd') {
      this.getCheckboxMsg('PC-DEMAND-UNIT')
    } else {
      this.getCheckboxMsg('PC-UNDERTAKE-UNIT')
    }
    this.$nextTick(() => {
      window.onscroll = this.$lodash.throttle(() => {
        this.scrollWindow()
      }, 50)
    })
    this.acceptAchievementAndMilestoneTime()
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

.extra-project{
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
    line-height: 35px;
  }
  /deep/ .el-form-item__content{
    line-height: 35px;
  }
  background : #f6f6f6;
  // min-height: 800px;
  min-height: 100vh;
  padding-bottom: 10px;

  .icon-opt{
    font-size: 12px;
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

  .top-head{
    height: 50px;
    background : #fff;

    .head-con{
      width: 1180px;
      margin: 0 auto;

      .logo-img{
        float: right;
        margin-top: 15px;
      }
    }
  }

  .main-container{
    width: 1180px;
    margin: 0 auto;

    .top-opt-con{
      display: flex;
      align-items: center;
      background: #f6f6f6;
      height: 70px;

      .btn-opt{
        font-family: PingFangSC-Medium;
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

<style lang="scss">
.adjust-btn{
  width: auto !important;
  &.adjust-left-btn{
    color: #fff !important;
    &:hover{
      @include background-color($color-blue,0.8)
    }
  }
}
</style>
