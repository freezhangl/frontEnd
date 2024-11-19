<template>
  <div class="extra-project">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <div class="head-img">
          <img class="logo-img" src="../../assets/icons/集中化研发管理系统组合logo.svg" alt="">
        </div>
      </div>
    </div>
    <div class="back-top" v-if="showBackTop" @click="backToTop">
      <img src="../../assets/icons/backtop.png" alt="">
    </div>
    <div class="main-container">
      <div class="top-opt-con" >
        <div class="btn-opt btn-del" @click="delProject" v-if="isEditable && projectCode"> <i class="el-icon-delete-solid"></i>删除 </div>
        <div class="btn-opt btn-del" @click="saveProject" v-if="isEditable"> <i class="icon-opt svgfont-save"></i>保存 </div>
        <div class="btn-opt btn-del" @click="launchApproval"> <i class="icon-opt el-icon-document"></i>发起审批 </div>
        <div class="btn-opt btn-del" @click="cancelEdit" v-if="isEditable" > 退出编辑 </div>
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
        <basic-info
          :tip-language="checkData.projectBaseInfo"
          :project-code="projectCode"
          @update="updateProjectCode"
          id="basic-info"
          ref="baseInfo"
          :receive-data="projectBaseInfo"
          @changeTime="changePlanTime"
          @changeValue="changeValue(arguments,'baseInfo')"
          @saveBlock="changeSaveStatus('baseInfo')"></basic-info>

        <!--  TODO : 将下面内容 替换成对应组件即可 -->
        <!-- 属性信息 -->
        <div id="attribute-info">
          <attributeInfoEdit
            v-show="JSON.stringify(projectAttribute) !== '{}'"
            ref="attributeEdit"
            :receive-data="projectBaseInfo"
            :project-attribute="projectAttribute"
            :scheme-dto-id="schemeDtoId"
            @blurAllInput="blurAllInput"
            @saveAttribute="saveAttribute"
            @changeAttribute="changeAttribute"></attributeInfoEdit>

          <attributeInfo
            v-if="JSON.stringify(projectAttribute) == '{}' && !$route.params.projectCode"
            ref="attribute"
            :receive-data="projectBaseInfo"
            :project-code="projectCode"
            :scheme-dto-id="schemeDtoId"
            @blurAllInput="blurAllInput"
            @saveAttribute="saveAttribute"
            @changeAttribute="changeAttribute"></attributeInfo>

          <attributeInfoEditDefault
            v-if="JSON.stringify(projectAttribute) == '{}' && $route.params.projectCode"
            ref="attributeEditDefault"
            :receive-data="projectBaseInfo"
            :project-code="projectCode"
            :scheme-dto-id="schemeDtoId"
            @blurAllInput="blurAllInput"
            @saveAttribute="saveAttribute"
            @changeAttribute="changeAttribute"></attributeInfoEditDefault>
        </div>

        <div id="product-info" v-if="isShowProductInfo">
          <product-info-edit
            ref="productInfo"
            :tip-language="checkData.productInfo"
            :receive-data="productInfoList"
            :project-code="projectCode">
          </product-info-edit>
        </div>

        <div id="resource-info" v-if="isShowResourceInfo">
          <res-info-edit
            ref="resourceInfo"
            :tip-language="checkData.resourceInfo"
            :receive-data="resourceInfo"
            :project-code="projectCode"
            @saveBlock="changeSaveStatus('resourceInfo')"
            @changeValue="changeValue(arguments,'resourceInfo')">
          </res-info-edit>
        </div>

        <team-info
          id="team-info"
          ref="teamInfo"
          @saveTeamInfo="saveTeamFlag"
          :tip-language="checkData.projectTeam"
          :project-code="projectCode"
          :receive-data="teamInfo"
          :lead-responsible-dept="leadResponsibleDept"
          :cooperate-responsible-dept="cooperateResponsibleDept"
          @changeValue="changeValue(arguments,'teamInfo')"
          @focusFormItem="checkBlockSave(arguments,'teamInfo')"
          :can-edit="canEditBlock"
          :is-save="isSaveBlock"></team-info>

        <project-budget
          id="project-budget"
          ref="projectBudget"
          :tip-language="checkData.projectBudget"
          :project-code="projectCode"
          :year-range-prop="planYearRange"
          :receive-data="costBudgetList"
          @changeValue="changeValue(arguments,'projectBudget')"
          @saveBlock="changeSaveStatus('projectBudget')"></project-budget>

        <subproject
          id="sub-project"
          ref="subProject"
          :tip-language="checkData.subProject"
          :project-code="projectCode"
          :receive-date="projectBaseInfo"
          :subproject-info="subProjectInfoList"
          :save-flag='saveFlag'
          :save-project="isSaveNum"
          :results-type-option="resultsTypeOption"
          @saveBlock="changeSaveStatus('subProject')"
          @changeValue="changeValue(arguments,'subProject')"
        ></subproject>

        <addAndEditMilestone
          ref="milestone"
          id="milestone"
          :tip-language="checkData.projectMileStone"
          :project-name='projectName'
          :project-code="projectCode"
          :save-flag='saveFlag'
          :receive-data="projectBaseInfo"
          :results-type-option="resultsTypeOption"
          :save-project="isSaveNum"
          @detailTableMilestoneShowOrHide='detailTableMilestoneShowOrHide'
          @changeValue="changeValue(arguments,'milestone')"
          @saveBlock="changeSaveStatus('milestone')"
          @focusFormItem="checkBlockSave(arguments,'milestone')"
          :can-edit="canEditBlock"
          :is-save="isSaveBlock"></addAndEditMilestone>

      </div>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import groupPlanAPI from '@/serve/API_groupPlan'
import basicInfo from './components/basic'
import attributeInfo from './components/attributeInfo/attributeInfo'
import attributeInfoEditDefault from './components/attributeInfo/editDefault'
import attributeInfoEdit from './components/attributeInfo/edit'
import teamInfo from './components/newTeam/index'
import projectBudget from './components/budget'
import addAndEditMilestone from './components/basic/milestone/addAndEditMilestone'
import subproject from './components/subproject'
import param from '@/const/param'
import { getStore } from '@/store'
import ProductInfoEdit from './components/product/productInfoEdit.vue'
import ResInfoEdit from './components/resource/resInfoEdit.vue'
export default {
  data () {
    return {
      schemeDtoId: '', //属性信息方案ID
      projectName: '',
      saveFlag: false, // 暂存团队信息标志
      isEditable: false,
      projectCode: '', //项目编号
      clearFlag: true, //true 触发滚动
      navIdx: 0,
      timer: 0,
      showBackTop: false,
      projectBaseInfo: {}, //基本信息
      projectAttribute: {}, //属性信息
      subProjectInfoList: [], //子项目信息
      teamInfo: [], //团队信息
      costBudgetList: [], //项目预算
      productInfoList: [], //产品信息
      resourceInfo: {}, //资源信息
      navMenus: [
        {
          name: '基本信息',
          id: 'basic-info'
        },
        {
          name: '属性信息',
          id: 'attribute-info'
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
          id: 'sub-project'
        }
      ],
      productInfoConfig: true, //是否展示产品信息 - 基础配置信息
      hasProductInfo: true, //项目信息中有产品信息
      resourceInfoConfig: true, //是否展示资源信息 - 基础配置信息
      hasResourceInfo: true, //资源信息中有产品信息
      planYearRange: [], //计划立项结项跨年范围
      planRangeTime: [], //计划立项结项跨年范围，具体到月份时间戳
      leadResponsibleDept: '', //牵头承担部门
      cooperateResponsibleDept: [], //配合承担部门
      baseInfoIsSave: true, //是否已暂存
      attributeIsSave: true,
      resourceInfoIsSave: true,
      teamInfoIsSave: true,
      projectBudgetIsSave: true,
      subProjectIsSave: true,
      milestoneIsSave: true,
      isSaveBlock: {
        baseInfo: true,
        attribute: true,
        resourceInfo: true,
        teamInfo: true,
        projectBudget: true,
        subProject: true,
        milestone: true
      }, //未暂存的区块
      projectAttributeTemp: '', //属性信息暂存时临时保存的数据
      isCansaveGuide: false,
      projectIsSave: false,
      checkData: {},
      isSaveNum: 0, // 保存的次数
      isShowBoforeLaunch: false,
      resultsTypeOption: []
      // canEditBlock: true //可以编辑任一区块
    }
  },
  components: {
    basicInfo,
    attributeInfo,
    attributeInfoEditDefault,
    attributeInfoEdit,
    teamInfo,
    projectBudget,
    addAndEditMilestone,
    subproject,
    ProductInfoEdit,
    ResInfoEdit

  },
  computed: {
    canEditBlock () {
      //只要有一个未保存---true。当前状态无法编辑
      let can = !this.baseInfoIsSave || !this.attributeIsSave || !this.teamInfoIsSave ||
      !this.projectBudgetIsSave || !this.subProjectIsSave || !this.milestoneIsSave || !this.resourceInfoIsSave
      return !can
    },
    isShowProductInfo () {
      let show = this.productInfoConfig || this.hasProductInfo
      return show
    },
    isShowResourceInfo () {
      let show = this.resourceInfoConfig || this.hasResourceInfo
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
    getResultsType () { //查询子项目/成果类型
      return API.dictValByCode('EXPECTED-RESULT-TYPE')
        .then(res => {
          if (res && res.length > 0) {
            this.resultsTypeOption = res
          } else {
            this.resultsTypeOption = []
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询成果类型失败',
            type: 'error',
            showClose: true
          })
        })
    },
    // 检查是否支持预立项
    async getCheckEstablish () {
      let param = {
        projectCode: this.projectCode
      }
      return API.checkEstablish(param)
        .then(res => {
          this.isShowBoforeLaunch = res
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
    getCheckboxMsg (data) {
      groupPlanAPI.baseLineGetOption({ projectType: data })
        .then(res => {
          if (res && res.content && res.content.length) {
            let arr = JSON.parse(res.content)
            arr.forEach(item => {
              if (item.name === 'projectBaseInfo') {
                if (item.type === 'optionList') {
                  let obj = {}
                  item.checkList.forEach(ite => {
                    obj[ite] = true
                  })
                  this.checkData.projectBaseInfo = obj
                }
                if (item.type === 'optionTitle') {
                  let obj = {
                    all: true
                  }
                  this.checkData.projectBaseInfo = obj
                }
              }
              if (item.name === 'projectProduct') {
                if (item.type === 'optionList') {
                  let obj = {}
                  item.checkList.forEach(ite => {
                    obj[ite] = true
                  })
                  this.checkData.productInfo = obj
                }
                if (item.type === 'optionTitle') {
                  this.checkData.productInfo = item.value
                }
              }
              if (item.name === 'projectResource') {
                if (item.type === 'optionList') {
                  let obj = {}
                  item.checkList.forEach(ite => {
                    obj[ite] = true
                  })
                  this.checkData.resourceInfo = obj
                }
                if (item.type === 'optionTitle') {
                  this.checkData.resourceInfo = item.value
                }
              }
              if (item.name === 'projectTeamList') {
                if (item.type === 'optionList') {
                  let obj = {}
                  item.checkList.forEach(ite => {
                    obj[ite] = true
                  })
                  this.checkData.projectTeam = obj
                }
                if (item.type === 'optionTitle') {
                  let obj = {
                    all: true
                  }
                  this.checkData.projectTeam = obj
                }
              }
              if (item.name === 'costBudgetList') {
                if (item.type === 'optionList') {
                  let obj = {}
                  item.checkList.forEach(ite => {
                    obj[ite] = true
                  })
                  this.checkData.projectBudget = obj
                }
                if (item.type === 'optionTitle') {
                  this.checkData.projectBudget = item.value
                }
              }
              if (item.name === 'projectAchievementList') {
                if (item.type === 'optionList') {
                  let obj = {}
                  item.checkList.forEach(ite => {
                    obj[ite] = true
                  })
                  this.checkData.subProject = obj
                }
                if (item.type === 'optionTitle') {
                  let obj = {}
                  item.value ? obj.all = true : obj.no = false
                  this.checkData.subProject = obj
                }
              }
              if (item.name === 'projectMileStones') {
                if (item.type === 'optionList') {
                  let obj = {}
                  item.checkList.forEach(ite => {
                    obj[ite] = true
                  })
                  this.checkData.projectMileStone = obj
                }
                if (item.type === 'optionTitle') {
                  let obj = {}
                  item.value ? obj.all = true : obj.no = false
                  this.checkData.projectMileStone = obj
                }
              }
            })
            // console.log(arr, '基线信息')
            // console.log(this.checkData, '处理后的基线信息')
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
    saveTeamFlag (flag) { //判断团队信息是否暂存
      this.saveFlag = flag
      this.changeSaveStatus('teamInfo')
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
    //属性信息暂存成功
    saveAttribute (obj) {
      if (obj) {
        this.projectAttributeTemp = obj
      }
      this.setTeamInfoComp()
      this.changeSaveStatus('attribute')
    },
    //根据牵头和配合去判断项目经理和专家的组件
    setTeamInfoComp () {
      this.$refs['teamInfo'].getManagerList()
      this.$refs['teamInfo'].getExpertList()
    },
    detailTableMilestoneShowOrHide (show) {
      if (show) {
        this.navMenus.push({
          name: '里程碑',
          id: 'milestone'
        })
      }
    },
    verificationPermission () {
      const param = {
        // permissionCode: '03',
        projectCode: this.$route.params.projectCode
        // projectType: '03'
      }
      API.verificationPermission(param)
        .then(res => {
          if (res.indexOf('00') > -1 || res.indexOf('02') > -1) {
            this.isEditable = true
          } else {
            this.isEditable = false
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
      this.projectCode = projectBaseInfo.projectCode
      this.projectName = projectBaseInfo.projectName
      this.projectBaseInfo = projectBaseInfo
      // 如果属性信息有暂存，则用getEditForm
      if (this.projectAttributeTemp) {
        this.projectAttribute = this.projectAttributeTemp
        this.schemeDtoId = ''
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
    //编辑计划结项时间不能早于里程碑计划完成时间，子项目申请完成时间，成果计划交付时间，实际立项时间
    checkPlanFinishTime (projectCode, time) {
      let params = {
        projectCode: projectCode,
        planFinishTime: time
      }
      API.checkPlanFinishTime(param)
        .then((res) => {
          return ''
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
    //更改计划立项和结项时间
    changePlanTime (arr, type) {
      this.changeValue(false, 'baseInfo')
      let tempYear = []
      let parseYear = [arr[0].getFullYear(), arr[1].getFullYear()]
      for (let i = parseYear[0]; i <= parseYear[1]; i++) {
        tempYear.push(i)
      }
      let costBudgetList = this.$refs.projectBudget.getSubmitData().costBudgetList
      let effectYears = [] //会有影响的年份
      costBudgetList.forEach(item => {
        if (item.totalAmount !== '') {
          effectYears.push(item.timeYear)
        }
      })
      //是否有某个被影响的年份已不在更新的年份范围内
      let flag = effectYears.some(year => {
        let inRange = tempYear.some(y => parseInt(y) === parseInt(year))
        if (!inRange) {
          return true
        }
      })
      if (flag) { //有影响给提示
        this.$confirm(' ', '此操作将影响到项目预算数据，是否继续？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            this.planYearRange = tempYear
            this.planRangeTime = arr
            this.$nextTick(() => {
              this.$refs.projectBudget.computedAll()
            })
          })
          .catch(() => {
            let param = ''
            if (type === 'start') {
              param = this.projectBaseInfo.projectApprovalTime || this.planRangeTime[0]
            } else if (type === 'end') {
              param = this.projectBaseInfo.plannedClosingTime || this.planRangeTime[1]
            }
            this.$refs.baseInfo.setPlanTime(param, type)
          })
      } else { //无影响更新年份
        this.planYearRange = tempYear
        this.planRangeTime = arr
      }
    },
    cancelEdit () {
      let isSave = false
      for (var key in this.isSaveBlock) {
        if (this.isSaveBlock[key] === false) {
          isSave = true
        }
      }
      // 当前项目已经保存不再提示未暂存
      if (this.projectIsSave) {
        isSave = false
      }
      let info = isSave ? '存在未保存的信息，是否确认退出编辑？' : '是否确认退出编辑？'
      this.$confirm(' ', info, {
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
          API.deleteProject(this.projectCode)
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
    async launchApproval () {
      if (!this.projectCode) {
        this.$message({
          message: '请先保存基本信息！',
          type: 'warning',
          showClose: true
        })
        return
      }
      await this.getCheckEstablish()
      let baseInfo = await this.$refs.baseInfo.validate()
      let projectProductInfoVoList = null
      if (this.isShowProductInfo) {
        projectProductInfoVoList = await this.$refs.productInfo.validate()
      }
      let projectResourceInfoVo = null
      if (this.isShowResourceInfo) {
        projectResourceInfoVo = await this.$refs.resourceInfo.validate()
      }
      let teamInfo = await this.$refs.teamInfo.validate()
      let projectBudget = await this.$refs.projectBudget.validate()
      if (projectBudget === 'hasTip') {
        return false
      }
      let subProject = await this.$refs.subProject.validate()
      let isCarry = await this.judgeIsCarryAttachment('BT-APPROVE')
      let isCarryBefore = await this.judgeIsCarryAttachment('BT-PRE-APPROVE')

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

      if (!baseInfo || !teamInfo || !projectBudget || !attribute || (!projectResourceInfoVo && this.isShowResourceInfo)) {
        this.$message.error('请填写完整页面信息')
        return false
      }

      if (projectProductInfoVoList === false) {
        this.$message.error('请添加产品信息')
        return false
      }

      if (!subProject) {
        return false
      }

      let milestone = await this.$refs.milestone.validate()
      if (milestone !== 'MAX0') {
        if (!milestone) {
          this.$message.error('请填写里程碑信息')
          return false
        } else if (milestone === 'false') {
          return false
        }
      }

      let params = {}
      let isClose = false
      // 单据被驳回重新编辑生成新的草稿，当前场景编辑后保存直接将项目关闭
      if (this.$route.query.isFromRMS) {
        await this.saveCanGuide()
        isClose = !this.isCansaveGuide
      }
      params.projectBaseInfo = baseInfo
      params.projectTeamList = teamInfo
      params.costBudgetList = projectBudget
      params.subProjectInfoList = subProject
      params.projectMileStones = milestone === 'MAX0' ? [] : milestone
      params.projectAttribute = attribute
      params.projectResourceInfoVo = projectResourceInfoVo
      params.projectProductInfoVoList = projectProductInfoVoList
      params.businessFormUrl = '/projectInfo/projectInfo-edit/' + this.projectCode
      // params.resultInformations = subProject
      API.saveProject(params)
        .then(data => {
          // 单据被驳回重新编辑生成新的草稿，当前场景编辑后保存直接将项目关闭
          if (isClose) {
            // 回刷首页的方法暂时不能使用
            // if (this.$route.query.isFromRMS === '1' && window.opener) {
            //   window.opener.refreshBacklogList()
            // }
            // window.opener = null
            // window.open('', '_self')
            window.close()
            return
          }
          let fromReject = this.$route.query.from === 'reject'
          //this.$message.success('保存项目信息成功');
          // 0-发起立项，1-未修改，2-修改未涉及基线，3-发起变更流程
          let msg = ''
          let flowPoint = ''
          if (data === 0) {
            msg = fromReject ? '保存成功' : '是否发起立项审批？'
            flowPoint = '立项流程'
          } else if (data === 1) {
            msg = '保存成功'
            this.$message({
              message: msg,
              type: 'success',
              showClose: true
            })
            return
          } else if (data === 2) {
            msg = '保存成功'
            this.$message({
              message: msg,
              type: 'success',
              showClose: true
            })
            return
          } else if (data === 3) {
            msg = fromReject ? '保存成功' : '是否发起项目变更审批？'
            flowPoint = '变更流程'
          }
          this.projectIsSave = true
          this.isSaveNum += 1
          if (fromReject && msg === '保存成功') {
            this.$message({
              message: msg,
              type: 'success',
              showClose: true
            })
            history.go(-1)
            return
          }
          let cancelButtonClass = 'self-message-box-delete-cancel adjust-btn'
          let confirmButtonClass = 'self-message-box-delete-confirm adjust-btn'
          if (this.isShowBoforeLaunch) {
            cancelButtonClass = confirmButtonClass + ' adjust-left-btn'
          }
          this.$confirm(' ', this.isShowBoforeLaunch ? '请选择需要发起的审批流程' : msg, {
            confirmButtonText: this.isShowBoforeLaunch ? '发起立项审批' : '确认',
            cancelButtonText: this.isShowBoforeLaunch ? '发起预立项审批' : '取消',
            type: 'warning',
            showClose: true,
            customClass: 'self-message-box-delete',
            cancelButtonClass: cancelButtonClass,
            confirmButtonClass: confirmButtonClass,
            distinguishCancelAndClose: true,
            beforeClose: (action, instance, done) => {
              if (instance.cancelButtonText === '发起预立项审批' && action === 'cancel') {
                setTimeout(() => {
                  this.goBeforeLaunch(isCarryBefore)
                }, 300)
              }
              if (instance.cancelButtonText === '取消' && action === 'cancel') {
                this.$message({
                  type: 'info',
                  message: '已取消发起'
                })
              }
              done()
            }
          })
            .then(() => {
              /* if (data === 0 || data === 3) {
                this.$router.push({
                  path: '/projectInfo/projectInfo-detail/' + this.projectCode,
                  query: { activeTab: 'projectProgress', flowPoint: flowPoint }
                })
              } */
              if (data === 0 && isCarry === false) {
                this.getLaunchInfo()
              } else if (data === 3) {
                this.getChangeApproveList()
              } else if (isCarry) {
                this.$confirm('是否自动带入之前上传的附件?', '提示', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  type: 'warning',
                  showClose: false,
                  customClass: 'self-message-box-delete',
                  cancelButtonClass: 'self-message-box-delete-cancel',
                  confirmButtonClass: 'self-message-box-delete-confirm'
                })
                  .then(() => {
                    this.$router.push({
                      path: '/launchFlow/launchFlowEdit',
                      query: {
                        addLaunch: 'true',
                        type: 'BT-APPROVE', //类型(项目立项、项目变更)
                        projectCode: this.projectCode,
                        isCarry: '1'
                      }
                    })
                  })
                  .catch((action) => {
                    if (action === 'cancel') {
                      this.$router.push({
                        path: '/launchFlow/launchFlowEdit',
                        query: {
                          addLaunch: 'true',
                          type: 'BT-APPROVE', //类型(项目立项、项目变更)
                          projectCode: this.projectCode
                        }
                      })
                    }
                  })
              }
            })
            .catch(() => {
              this.projectName = baseInfo.projectName
              this.projectIsSave = true
              this.isSaveNum += 1
              this.baseInfoIsSave = true
              this.attributeIsSave = true
              this.resourceInfoIsSave = true
              this.teamInfoIsSave = true
              this.projectBudgetIsSave = true
              this.subProjectIsSave = true
              this.milestoneIsSave = true
              this.isSaveBlock = {
                baseInfo: true,
                attribute: true,
                resourceInfo: true,
                teamInfo: true,
                projectBudget: true,
                subProject: true,
                milestone: true
              }
              this.$refs.milestone.upDataList()//更新里程碑列表
            })
        })
        .catch(err => {
          this.$message.error(err.message || '保存项目信息失败')
        })
    },
    // 预立项逻辑
    async goBeforeLaunch (isCarryBefore) {
      let isBeforeLaunch = await this.judgeIsBeforeLaunch()
      if (!isBeforeLaunch) {
        return
      }
      if (isCarryBefore) {
        this.$confirm('是否自动带入之前上传的附件?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          showClose: false,
          customClass: 'self-message-box-delete',
          cancelButtonClass: 'self-message-box-delete-cancel',
          confirmButtonClass: 'self-message-box-delete-confirm'
        })
          .then(() => {
            this.getBeforeLaunchInfo(1)
          })
          .catch((action) => {
            if (action === 'cancel') {
              this.getBeforeLaunchInfo(0)
            }
          })
      } else {
        this.getBeforeLaunchInfo(0)
      }
    },
    async saveProject () {
      if (!this.projectCode) {
        this.$message({
          message: '请先保存基本信息！',
          type: 'warning',
          showClose: true
        })
        return
      }
      await this.getCheckEstablish()
      let baseInfo = await this.$refs.baseInfo.validate()
      let projectProductInfoVoList = null
      if (this.isShowProductInfo) {
        projectProductInfoVoList = await this.$refs.productInfo.validate()
      }
      let projectResourceInfoVo = null
      if (this.isShowResourceInfo) {
        projectResourceInfoVo = await this.$refs.resourceInfo.validate()
      }
      let teamInfo = await this.$refs.teamInfo.validate()
      let projectBudget = await this.$refs.projectBudget.validate()
      if (projectBudget === 'hasTip') {
        return false
      }
      let subProject = await this.$refs.subProject.validate()

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

      if (!baseInfo || !teamInfo || !projectBudget || !attribute || (!projectResourceInfoVo && this.isShowResourceInfo)) {
        this.$message.error('请填写完整页面信息')
        return false
      }

      if (projectProductInfoVoList === false) {
        this.$message.error('请添加产品信息')
        return false
      }

      if (projectBudget === 'hasTip') { //项目预算校验提示
        return false
      }

      if (!subProject) {
        return false
      }

      let milestone = await this.$refs.milestone.validate()
      if (milestone !== 'MAX0') {
        if (!milestone) {
          this.$message.error('请填写里程碑信息')
          return false
        } else if (milestone === 'false') {
          return false
        }
      }

      let params = {}
      params.projectBaseInfo = baseInfo
      params.projectTeamList = teamInfo
      params.costBudgetList = projectBudget
      params.subProjectInfoList = subProject
      params.projectMileStones = milestone === 'MAX0' ? [] : milestone
      params.projectAttribute = attribute
      params.projectResourceInfoVo = projectResourceInfoVo
      params.projectProductInfoVoList = projectProductInfoVoList
      params.businessFormUrl = '/projectInfo/projectInfo-edit/' + this.projectCode
      // 保存
      API.saveProject(params)
        .then(data => {
          if (data === 0 || data) {
            this.$message({
              message: '保存成功！',
              type: 'success',
              showClose: true
            })
            this.projectIsSave = true
            this.isSaveNum += 1
            this.baseInfoIsSave = true
            this.attributeIsSave = true
            this.resourceInfoIsSave = true
            this.teamInfoIsSave = true
            this.projectBudgetIsSave = true
            this.subProjectIsSave = true
            this.milestoneIsSave = true
            this.isSaveBlock = {
              baseInfo: true,
              attribute: true,
              resourceInfo: true,
              teamInfo: true,
              projectBudget: true,
              subProject: true,
              milestone: true
            }
          }
        })
        .catch(err => {
          this.$message.error(err.message || '保存项目信息失败')
        })
    },
    // 判断是否可以携带附件
    judgeIsCarryAttachment (type) {
      let param = {
        projectCode: this.projectCode,
        businessType: type
      }
      if (!this.projectCode) {
        return false
      }
      return API.carryHistoryFile(param)
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '请求失败，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 判断是否可以发起流程-如果可以跳转到流程页面
    judgeIsLaunch () {
      let param = {
        projectCode: this.projectCode
      }
      return API.judgeLaunchApproval(param)
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message === '不能重复发起立项申请') {
            return true
          }
          if (e.message) {
            this.$message({
              message: e.message || '请求失败，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 判断是否可以发起预立项-如果可以跳转到流程页面
    judgeIsBeforeLaunch () {
      let param = {
        projectCode: this.projectCode
      }
      return API.judgeBeforeLaunchApproval(param)
        .then(res => {
          return res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message === '不能重复发起预立项申请') {
            return true
          }
          if (e.message) {
            this.$message({
              message: e.message || '请求失败，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 保存时判断当前场景
    saveCanGuide () {
      this.isCansaveGuide = false// 是否关闭项目
      let params = {
        projectCode: this.projectCode
      }
      return API.saveCanGuide(params)
        .then(res => {
          this.isCansaveGuide = res
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
    // 获取立项流程信息
    async getLaunchInfo () {
      let isLaunch = await this.judgeIsLaunch()
      if (!isLaunch) {
        return
      }
      let params = {
        projectCode: this.projectCode,
        businessType: 'BT-APPROVE' //立项类型:枚举值
      }
      API.queryProjectApprove(params)
        .then(res => {
          if (res && res.approveState === '1') {
            //有立项单据草稿，进入编辑页面
            this.$router.push({
              path: '/launchFlow/launchFlowEdit',
              query: {
                addLaunch: 'false',
                type: 'BT-APPROVE', //类型(项目立项、项目变更)
                approveNo: res.approveNo, //业务流水号
                projectCode: this.projectCode, //项目编码
                versionCode: res.versionNo // 项目版本号
              }
            })
          } else {
            //无草稿，发起立项
            this.$router.push({
              path: '/launchFlow/launchFlowEdit',
              query: {
                addLaunch: 'true',
                type: 'BT-APPROVE', //类型(项目立项、项目变更)
                projectCode: this.projectCode
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
    // 获取预立项详情
    getBeforeLaunchInfo (isCarry) {
      let params = {
        projectCode: this.projectCode,
        businessType: 'BT-PRE-APPROVE' //预立项类型:枚举值
      }
      API.queryProjectApprove(params)
        .then(res => {
          if (res && res.approveState === '1') {
            //有立项单据草稿，进入编辑页面
            this.$router.push({
              path: '/beforeLaunchFlow/beforeLaunchFlowEdit',
              query: {
                addBeforeLaunch: 'false',
                type: 'BT-PRE-APPROVE', //类型(项目立项、项目变更)
                projectCode: this.projectCode,
                approveNo: res.approveNo,
                versionCode: res.versionNo
              }
            })
          } else {
            //无草稿，发起立项
            if (isCarry) {
              this.$router.push({
                path: '/beforeLaunchFlow/beforeLaunchFlowEdit',
                query: {
                  addBeforeLaunch: 'true',
                  type: 'BT-PRE-APPROVE', //类型(项目立项、项目变更)
                  projectCode: this.projectCode,
                  isCarry: '1'
                }
              })
            } else {
              this.$router.push({
                path: '/beforeLaunchFlow/beforeLaunchFlowEdit',
                query: {
                  addBeforeLaunch: 'true',
                  type: 'BT-PRE-APPROVE', //类型(项目立项、项目变更)
                  projectCode: this.projectCode
                }
              })
            }
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
      let params = {
        projectCode: this.projectCode
      }
      API.getChangeApproveList(params)
        .then(res => {
          if (res && res.length > 0 && res[0].approveState === '1') {
            //变更流程列表第一个为草稿，进入此草稿的编辑页面
            let process = res[0]
            this.$router.push({
              name: 'changeFlowEdit',
              query: {
                addLaunch: 'false',
                type: 'BT-CHANGE', //类型(项目变更)
                projectCode: process.projectCode,
                approveNo: process.approveNo //业务流水号（供编辑页面-项目文档组件拿流水号）
              }
            })
          } else {
            //无草稿，发起变更
            this.$router.push({
              name: 'changeFlowEdit',
              path: '/changeFlow/changeFlowEdit',
              query: {
                addLaunch: 'true', //新增变更流程
                type: 'BT-CHANGE', //类型(项目变更)
                projectCode: this.projectCode
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
      // this.planRangeTime = [basicInfo.projectApprovalTime, basicInfo.plannedClosingTime]
      this.planRangeTime = [basicInfo.planApprovalTime, basicInfo.planFinishTime]
      let startYear = new Date(basicInfo.planApprovalTime)
        .getFullYear()
      let endYear = new Date(basicInfo.planFinishTime)
        .getFullYear()

      for (let i = startYear; i <= endYear; i++) {
        this.planYearRange.push(i)
      }
    },
    //属性信息中修改了 牵头承担部门 leadResponsibleDept 或 配合承担部门 cooperateResponsibleDept
    changeAttribute (obj) {
      let { key, value } = obj
      // 接受方案ID
      if (key === 'schemeDtoId') {
        this.schemeDtoId = value
        return
      }
      if (key === 'leadResponsibleDept') {
        this[key] = value
        // this.$refs.teamInfo.clearSelected(key)
      } else if (key === 'cooperateResponsibleDept') {
        this[key] = JSON.parse(value)
        // this.$refs.teamInfo.clearSelected(key)
      }
      this.changeValue([false], 'attribute')
      // this.$refs.teamInfo.clearSelected(key)
    },
    //通过版本号获取最新项目信息
    getProjectInfoByVersion (projectCode, versionNo) {
      let params = {
        projectCode,
        versionNo,
        allSubProjectInfo: false
      }
      if (versionNo && projectCode) {
        API.projectInfoByVersion(params)
          .then(data => {
            //基本信息
            this.projectBaseInfo = data.projectBaseInfo
            this.projectName = data.projectBaseInfo.projectName
            // 属性信息
            this.projectAttribute = data.projectAttribute ? data.projectAttribute : {}
            // 产品信息
            this.productInfoList = data.projectProductInfoList ? data.projectProductInfoList : []
            this.hasProductInfo = this.productInfoList && this.productInfoList.length > 0
            // 资源信息
            this.resourceInfo = data.projectResourceInfoDto ? data.projectResourceInfoDto : {}
            this.hasResourceInfo = !!((this.resourceInfo && JSON.stringify(this.resourceInfo) !== '{}'))
            //团队信息
            if (data.projectTeamList) {
              this.teamInfo = data.projectTeamList
            } else {
              this.$nextTick(() => {
                // this.$refs['teamInfo'].setDefaultManage()
                if (data.projectAttribute) {
                  this.setTeamInfoComp()
                }
              })
            }
            //项目预算
            if (!data.costBudgetList || data.costBudgetList.length === 0) {
              // this.calcPlanYear(this.projectBaseInfo)
            }
            this.calcPlanYear(this.projectBaseInfo)
            this.costBudgetList = data.costBudgetList
            //子项目信息
            this.subProjectInfoList = data.subProjectInfoList || []
            this.subProjectInfoList.forEach(item => {
              item.versionNo = versionNo
              item.isUpdate = false
            })
            // 属性信息
            if (data.projectAttribute) {
              this.projectAttribute = data.projectAttribute
              let extend = JSON.parse(this.projectAttribute.extendedAttributes)
              let fieldList = extend[0].fieldList
              let lead = fieldList.filter(item => item.key === 'leadResponsibleDept')
              let cooper = fieldList.filter(item => item.key === 'cooperateResponsibleDept')
              this.leadResponsibleDept = lead[0] ? lead[0].value : ''
              let deptValue = cooper[0] && cooper[0].value ? cooper[0].value : null
              this.cooperateResponsibleDept = deptValue ? JSON.parse(deptValue) : []
              this.$nextTick(() => {
                // this.setTeamInfoComp()
              })
            }
          })
          .catch(err => {
            this.$message.error(err.message || '获取详情失败')
          })
      } else {
        this.isEditable = true
      }
    },
    //某区块内容做了修改
    changeValue (args, ref) {
      this.checkBlockSave(null, ref) //未暂存区域提示
      if (ref === 'baseInfo' && args && args.length === 2) { //修改了时间
        this[`${ref}IsSave`] = false
        this.isSaveBlock[ref] = false
        return
      }
      if (args && args.length) {
        this[`${ref}IsSave`] = args[0]
        this.isSaveBlock[ref] = args[0]
      } else {
        this[`${ref}IsSave`] = false
        this.isSaveBlock[ref] = false
      }
    },
    //更新区块的暂存状态
    changeSaveStatus (ref) {
      this[`${ref}IsSave`] = true
      this.isSaveBlock[ref] = true
    },
    //检查是否有区块未暂存
    checkBlockSave (args, ref) {
      let msg = '请先保存'
      let tempMsgArr = []
      if (!this.baseInfoIsSave && ref !== 'baseInfo') {
        tempMsgArr.push('基本信息')
      }
      if (!this.attributeIsSave && ref !== 'attribute') {
        tempMsgArr.push('属性信息')
      }
      if (!this.resourceInfoIsSave && ref !== 'resourceInfo') {
        tempMsgArr.push('资源信息')
      }
      if (!this.teamInfoIsSave && ref !== 'teamInfo') {
        tempMsgArr.push('团队信息')
      }
      if (!this.projectBudgetIsSave && ref !== 'projectBudget') {
        tempMsgArr.push('项目预算')
      }
      if (!this.subProjectIsSave && ref !== 'subProject') {
        tempMsgArr.push('子项目')
      }
      if (!this.milestoneIsSave && ref !== 'milestone') {
        tempMsgArr.push('里程碑')
      }
      if (args && args.length) {
        this.isSaveBlock[ref] = args[0]
      } else {
        this.isSaveBlock[ref] = false
      }
      if (tempMsgArr.length > 0) {
        tempMsgArr.forEach((ele, index) => {
          msg = msg + ele
          if (index !== tempMsgArr.length - 1) {
            msg += '、'
          }
        })
        setTimeout(() => {
          this.$message({
            type: 'warning',
            message: msg + '！',
            showClose: true
          })
        }, 1000)
      }
    },
    //获取产品信息配置
    getProductInfoShow () {
      // this.productInfoConfig = false
      API.showProduct({ projectCode: this.projectCode })
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
      // this.resourceInfoConfig = false
      API.showResource({ projectCode: this.projectCode })
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
    this.projectCode = this.$route.params.projectCode || ''
    this.versionNo = this.$route.query.versionNo || ''
    this.getCheckboxMsg('PC-SELF-UNIT')
    this.getResultsType()
    if (!this.projectCode) { //新增项目
      this.hasProductInfo = false
      this.hasResourceInfo = false
    }
    this.getProductInfoShow()
    this.getResourceInfoShow()
    if (this.projectCode) {
      this.verificationPermission()
    }
    if (!this.versionNo && this.projectCode) {
      let params = {
        projectCode: this.projectCode,
        userAccount: getStore().getters['USERENTITY/userInfo'].userAuth.uid
      }
      API.getProjectVersion(params)
        .then(res => {
          if (res) {
            this.getProjectInfoByVersion(this.projectCode, res[0].versionNo)
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
      this.getProjectInfoByVersion(this.projectCode, this.versionNo)
    }

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
  min-height: 800px;
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
