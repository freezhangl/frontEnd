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

            <teamInfo
              id="team-info-left"
              ref="team-left"
              :show-expand="false"
              :receive-data="leftProjectInfo.projectTeamList"
              @changeExpand="changeExpand(arguments,'team','Left')"></teamInfo>

            <projectBudget
              id="project-budget-left"
              ref="budget-left"
              :show-expand="false"
              :receive-data="leftProjectInfo.costBudgetList"
              @changeExpand="changeExpand(arguments,'budget','Left')"></projectBudget>

            <achievement
              id="task-ach-left"
              ref="task-left"
              type="detail"
              :show-expand="false"
              :receive-data="leftProjectInfo.projectAchievementList"
              @changeExpand="changeExpand(arguments,'task','Left')"></achievement>

            <milestoneInfo
              id="mile-stone-left"
              ref="milestone-left"
              :show-expand="false"
              :receive-data="leftProjectInfo.projectMileStones"
              @changeExpand="changeExpand(arguments,'milestone','Left')"></milestoneInfo>
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

            <!-- <div id="property-info-right" ref="property-right" style="background:#fff;height:50px;margin-bottom: 20px;">属性信息迭代二</div> -->
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

            <teamInfo
              id="team-info-right"
              ref="team-right"
              :show-expand="false"
              :receive-data="rightProjectInfo.projectTeamList"
              @changeExpand="changeExpand(arguments,'team','Right')"></teamInfo>

            <projectBudget
              id="project-budget-right"
              ref="budget-right"
              :show-expand="false"
              :receive-data="rightProjectInfo.costBudgetList"
              @changeExpand="changeExpand(arguments,'budget','Right')"></projectBudget>

            <achievement
              id="task-ach-right"
              ref="task-right"
              type="detail"
              :show-expand="false"
              :receive-data="rightProjectInfo.projectAchievementList"
              @changeExpand="changeExpand(arguments,'task','Right')"></achievement>

            <milestoneInfo
              v-if="isShowMilestone"
              id="mile-stone-right"
              ref="milestone-right"
              :show-expand="false"
              :receive-data="rightProjectInfo.projectMileStones"
              @changeExpand="changeExpand(arguments,'milestone','Right')"
              @detailTableMilestoneShowOrHide="setMilestoneVisible"></milestoneInfo>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import milestoneInfo from '@/controller/extraProject/components/basic/milestone/detailListMilestone'
import basicInfo from '@/controller/extraProject/components/basic/detail'
import teamInfo from '@/controller/extraProject/components/teamInfo/detail'
import projectBudget from '@/controller/extraProject/components/budget/detail'
import achievement from '@/controller/extraProject/components/achievement'
import attributeInfoPreview from '@/controller/extraProject/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '@/controller/extraProject/components/attributeInfo/detailDefault'
export default {
  data () {
    return {
      currentUnitProjectType: '', // 当前单位类型及项目类型
      rightProjectInfo: {},
      leftProjectInfo: {},
      // componentIDs: ['basic-info', 'property-info', 'team-info', 'project-budget', 'task-ach', 'milestone']
      componentIDs: ['basic', 'team', 'budget', 'task', 'milestone', 'property'],
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
      blockKeys: ['projectBaseInfo', 'projectTeamList', 'costBudgetList', 'projectAchievementList', 'projectMileStones', 'projectAttribute'],
      baseInfoKeys: ['projectCode', 'projectName', 'projectSource', 'projectSourceValue', 'projectClass', 'developProperty', 'developPropertyValue', 'projectType', 'projectTypeValue',
        'projectLevel', 'projectLevelValue', 'projectExpenditureType', 'projectExpenditureTypeValue', 'projectApprovalTime', 'plannedClosingTime',
        'periodOwnership', 'actualProjectTime', 'projectFinishTime', 'projectYear', 'developPackage', 'projectStatus', 'planApprovalTime', 'planFinishTime'],
      baseInfoDiff: {},
      roleList: ['PR-MANAGER', 'PR-MEMBER', 'PR-PROJECT-OBSERVER', 'PR-EXPERT'],
      budgetKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts', 'totalAmount'],
      attributeKeys: [], //需要高亮的属性key值
      hasContrasted: false, //是否已对比过数据
      scrollLeft: true, //滚动左侧
      scrollRight: true, //滚动右侧
      isShowMilestone: true
    }
  },
  components: {
    milestoneInfo,
    basicInfo,
    teamInfo,
    projectBudget,
    achievement,
    attributeInfoPreview,
    attributeInfoPreviewDefault
  },
  props: {
    leftInfo: { type: Object, default: () => {} },
    rightInfo: { type: Object, default: () => {} },
    isChange: { type: Boolean, default: false } //是否为变更对比页
  },
  created () {
    // this.leftProjectInfo = leftProjectInfo
    // this.rightProjectInfo = rightProjectInfo
    // this.contrastInfo()
    // 各个区块组件的引入判断，根据this.$route.name判断，对currentUnitProjectType进行处理
    this.judgeUnitProjectType()
  },
  watch: {
    leftInfo: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          this.leftProjectInfo = Object.assign({}, val)
          // this.contrastInfo()
        }
        if (val && this.rightProjectInfo && JSON.stringify(this.leftProjectInfo) !== '{}' && JSON.stringify(this.rightProjectInfo) !== '{}' && !this.hasContrasted) {
          this.contrastInfo()
          this.hasContrasted = true
        }
      }
    },
    rightInfo: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          this.rightProjectInfo = Object.assign({}, val)
          // this.contrastInfo()
        }
        if (val && this.leftProjectInfo && JSON.stringify(this.leftProjectInfo) !== '{}' && JSON.stringify(this.rightProjectInfo) !== '{}' && !this.hasContrasted) {
          this.contrastInfo()
          this.hasContrasted = true
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
    // 各个区块组件的引入判断，根据this.$route.name判断
    judgeUnitProjectType () {
      switch (this.$route.name) {
        case 'DGchangeFlowContrastDetails': // 集团统筹需求单位一般支撑包项目--变更流程
          this.currentUnitProjectType = 'demandGeneral'
          break
        case 'DSchangeFlowContrastDetails': // 集团统筹需求单位非一般支撑包项目--变更流程
          this.currentUnitProjectType = 'demandSpecial'
          break
        case 'UchangeFlowContrastDetails': // 集团统筹承担单位一般/非一般支撑包项目--变更流程
          this.currentUnitProjectType = 'undertake'
          break
      }
    },
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
        let maxHeght = Math.max(leftCom.$el.offsetHeight, rightCom.$el.offsetHeight)
        this.$refs[`${id}Height`] = maxHeght
        this.$nextTick(() => {
          if (leftCom.$el.style && rightCom.$el.style) {
            leftCom.$el.style.height = rightCom.$el.style.height = maxHeght + 30 + 'px'
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
        //基本信息对比字段
        if (key === 'projectBaseInfo') {
          //遍历需对比的字段
          this.baseInfoKeys.forEach(infoKey => {
            if (this.leftProjectInfo[key][infoKey] !== this.rightProjectInfo[key][infoKey]) {
              //字段值不一致则高亮，使用一个对象存储所有的高亮key
              this.baseInfoDiff[infoKey] = true
            }
          })
        }
        //团队信息对比具体的人员
        if (key === 'projectTeamList') {
          this.roleList.forEach(role => {
            //左侧某角色人员合集
            let left = this.leftProjectInfo[key] ? this.leftProjectInfo[key].filter(p => p.projectRoleCode === role) : []
            //右侧某角色人员合集
            let right = this.rightProjectInfo[key] ? this.rightProjectInfo[key].filter(p => p.projectRoleCode === role) : []
            //遍历左侧人员与右侧进行对比
            left.forEach(l => {
              let hasSome = right.some(r => r.userAccount === l.userAccount)
              if (!hasSome) {
                //左侧人员在右侧未出现则高亮
                this.$set(l, 'highlightProp', true)
                // l.highlightProp = true
              }
            })
          })
        }
        if (key === 'costBudgetList') { //项目预算对比
          this.leftProjectInfo[key].forEach(item => {
            //定义存储不同字段的对象
            item.highlightProps = {}
            //右侧对应年份的对象，TODO：右侧为空
            let rightItem = this.rightProjectInfo[key] ? this.rightProjectInfo[key].filter(right => right.timeYear === item.timeYear) : []
            //遍历需对比的字段
            this.budgetKeys.forEach(budgetKey => {
              if (rightItem.length === 0 || item[budgetKey] !== rightItem[0][budgetKey]) {
                //字段值不一致则高亮
                this.$set(item.highlightProps, budgetKey, true)
                // item.budgetDiff[budgetKey] = true
              }
            })
          })
        }
        if (key === 'projectAchievementList') { //任务预期成果对比
          this.leftProjectInfo[key].forEach(item => {
            item.highlightProps = {}
            let rightItem = this.rightProjectInfo[key] ? this.rightProjectInfo[key].filter(right => right.achievementCode === item.achievementCode) : []
            let achKeys = Object.keys(item)
            achKeys.forEach(achKey => {
              if (achKey !== 'highlightProps' && (rightItem.length === 0 || item[achKey] !== rightItem[0][achKey])) {
                this.$set(item.highlightProps, achKey, true)
              }
            })
          })
        }
        if (key === 'projectMileStones') { //里程碑对比
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
                this.$set(item, 'newMileStones', true) //整个里程碑为新增
              } else if (rightItem.length > 0 && achKey === 'resultList' && item.resultList) {
                //左右两侧都有，并且左侧有成果列表,对比数据
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
              } else if (achKey !== 'highlightProps' && item[achKey] !== rightItem[0][achKey]) {
                propAllSame = false
                this.$set(item.highlightProps, achKey, true)
              }
            })
            if (propAllSame) {
              this.$set(item, 'sameMileStones', true)
              this.$set(rightItem[0], 'sameMileStones', true)
            }
          })
        }
        //属性信息
        if (key === 'projectAttribute') {
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
          let leftFieldList = JSON.parse(this.leftProjectInfo[key].extendedAttributes)[0].fieldList
          let rightFieldList = JSON.parse(this.rightProjectInfo[key].extendedAttributes)[0].fieldList
          // let rightFieldList = JSON.parse(JSON.stringify(leftFieldList))
          let allAttriKeys = []
          leftFieldList.forEach(item => {
            allAttriKeys.push(item.key)
          })
          allAttriKeys.forEach(key => {
            /* rightFieldList.forEach((ele, index) => {
              if (ele.key === key && index / 2 === 0) {
                ele.value = ele.value + '0'
              }
            }) */
            let left = leftFieldList.filter(ele => ele.key === key)
            let right = rightFieldList.filter(ele => ele.key === key)
            if (left[0].value !== right[0].value) {
              this.attributeKeys.push(key)
            }
          })
        }
      })
    },
    //设置里程碑是否展示
    setMilestoneVisible (show) {
      this.isShowMilestone = show
    },
    attriHasRendered () {
      //组件已渲染，可获取高度
      let id = 'property'
      let leftCom = this.$refs[`${id}-left`]
      let rightCom = this.$refs[`${id}-right`]
      leftCom.changeClass('red', this.attributeKeys)
      if (leftCom.$el.offsetHeight && rightCom.$el.offsetHeight) {
        let maxHeght = Math.max(leftCom.$el.offsetHeight, rightCom.$el.offsetHeight)
        this.$refs[`${id}Height`] = maxHeght
        if (leftCom.$el.style && rightCom.$el.style) {
          leftCom.$el.style.height = rightCom.$el.style.height = maxHeght + 10 + 'px'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.contrast-detail{
  .el-row .el-col:nth-child(1){
    border-right: 1px solid #E9E9E9;
  }
  .detail-wrapper{
    width: 960px;
  }
  .el-scrollbar{
    height: calc(100vh - 120px - 20px);
    &.change-height{
      height: calc(100vh - 70px - 20px);
    }
    /deep/ .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>
