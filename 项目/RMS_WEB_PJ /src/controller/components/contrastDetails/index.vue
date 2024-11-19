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

            <div id="product-info-left" v-if="leftProjectInfo.projectProductInfoList && leftProjectInfo.projectProductInfoList.length > 0">
              <product-info-detail
                ref="productInfo-left"
                :receive-data="leftProjectInfo.projectProductInfoList"
              ></product-info-detail>
            </div>

            <div id="resource-info-left" v-if="leftProjectInfo.projectResourceInfoDto">
              <res-info-detail
                ref="resourceInfo-left"
                :receive-data="leftProjectInfo.projectResourceInfoDto"
              ></res-info-detail>
            </div>

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

            <subproject
              id="task-ach-left"
              ref="task-left"
              :show-expand="false"
              :receive-data="leftProjectInfo.subProjectInfoList"
              @changeExpand="changeExpand(arguments,'task','Left')"></subproject>

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

            <div id="product-info-left" v-if="rightProjectInfo.projectProductInfoList && rightProjectInfo.projectProductInfoList.length > 0">
              <product-info-detail
                ref="productInfo-left"
                :receive-data="rightProjectInfo.projectProductInfoList"
              ></product-info-detail>
            </div>

            <div id="resource-info-left" v-if="rightProjectInfo.projectResourceInfoDto">
              <res-info-detail
                ref="resourceInfo-left"
                :receive-data="rightProjectInfo.projectResourceInfoDto"
              ></res-info-detail>
            </div>

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

            <subproject
              id="task-ach-right"
              ref="task-right"
              :show-expand="false"
              :receive-data="rightProjectInfo.subProjectInfoList"
              @changeExpand="changeExpand(arguments,'task','Right')"></subproject>

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
import milestoneInfo from '../../extraProject/components/basic/milestone/detailListMilestone'
import basicInfo from '../../extraProject/components/basic/detail'
import teamInfo from '../../extraProject/components/teamInfo/detail'
import projectBudget from '../../extraProject/components/budget/detail'
import subproject from '../../extraProject/components/subproject/detail'
import attributeInfoPreview from '../../extraProject/components/attributeInfo/detail'
import attributeInfoPreviewDefault from '../../extraProject/components/attributeInfo/detailDefault'
import ProductInfoDetail from '../../extraProject/components/product/productInfoDetail.vue'
import ResInfoDetail from '../../extraProject/components/resource/resInfoDetail.vue'
export default {
  data () {
    return {
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
      blockKeys: ['projectBaseInfo', 'projectTeamList', 'costBudgetList', 'subProjectInfoList', 'projectMileStones', 'projectAttribute', 'projectProductInfoList', 'projectResourceInfoDto'],
      baseInfoKeys: ['projectCode', 'projectName', 'projectSource', 'projectSourceValue', 'projectClass', 'developProperty', 'developPropertyValue', 'projectType', 'projectTypeValue',
        'projectLevel', 'projectLevelValue', 'projectExpenditureType', 'projectExpenditureTypeValue', 'projectApprovalTime', 'plannedClosingTime',
        'periodOwnership', 'actualProjectTime', 'projectFinishTime', 'projectYear', 'developPackage', 'projectStatus', 'planApprovalTime', 'planFinishTime', 'actualApprovalTime', 'actualFinishTime', 'projectDetailsStatus'],
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
    subproject,
    attributeInfoPreview,
    attributeInfoPreviewDefault,
    ResInfoDetail,
    ProductInfoDetail
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
        // console.log('执行了')
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
        // this.$nextTick(() => {
        //   if (leftCom.$el.style && rightCom.$el.style) {
        // leftCom.$el.style.height = rightCom.$el.style.height = maxHeght + 30 + 'px'
        // leftCom.$el.style.minHeight = rightCom.$el.style.minheight = maxHeght + 30 + 'px'
        //   }
        // })
      })
    },
    //切换收起/展开
    changeExpand (args, id, state) {
      this[`${id}${state}Expand`] = args[0]
      let leftCom = this.$refs[id + '-left']
      let rightCom = this.$refs[id + '-right']
      //左右两侧均被折叠，则高度变为auto
      // if (!this[`${id}LeftExpand`] && !this[`${id}RightExpand`]) {
      //   leftCom.$el.style.height = rightCom.$el.style.height = 'auto'
      // }
      //左右两侧只要有一个被折叠，则设定初始高度
      // if (this[`${id}LeftExpand`] || this[`${id}RightExpand`]) {
      // leftCom.$el.style.height = rightCom.$el.style.height = this.$refs[`${id}Height`] + 30 + 'px'
      // }
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
            // console.log(item.timeYear)
            // console.log(this.rightProjectInfo[key])
            let rightItem = this.rightProjectInfo[key] ? this.rightProjectInfo[key].filter(right => right && right.timeYear === item.timeYear) : []
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
        if (key === 'subProjectInfoList') { //任务预期成果对比
          this.leftProjectInfo[key].forEach((item, index) => {
            item.highlightProps = {}
            let rightItemInfoProject = this.rightProjectInfo[key] ? this.rightProjectInfo[key].filter(right => right.subProjectCode === item.subProjectCode) : []
            this.rightProjectInfo[key].forEach((rightItem, rightIndex) => {
              if (item.subProjectCode === rightItem.subProjectCode) {
                let achKeys = Object.keys(item)
                achKeys.forEach(achKey => {
                  if (achKey !== 'highlightProps' && (rightItemInfoProject.length === 0 || item[achKey] !== rightItemInfoProject[0][achKey])) {
                    this.$set(item.highlightProps, achKey, true)
                  }
                })
                if (item.projectAchievementList && item.projectAchievementList.length > 0) {
                  item.projectAchievementList.forEach(ele => {
                    ele.highlightProps = {}
                    let rightItemInfo = this.rightProjectInfo[key][index].projectAchievementList ? this.rightProjectInfo[key][index].projectAchievementList.filter(right => right.achievementCode === ele.achievementCode) : []
                    this.rightProjectInfo[key][index].projectAchievementList.forEach(resultItem => {
                      if (ele.achievementCode === resultItem.achievementCode) {
                        let keys = Object.keys(ele)
                        keys.forEach(key => {
                          if (key !== 'highlightProps' && (rightItemInfo.length === 0 || ele[key] !== rightItemInfo[0][key])) {
                            this.$set(ele.highlightProps, key, true)
                          }
                        })
                      }
                    })
                  })
                }
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
            if (left[0].value !== (right[0] ? right[0].value : null)) {
              this.attributeKeys.push(key)
            }
          })
        }
        // 产品信息
        if (key === 'projectProductInfoList') {
          this.analyseProductInfo(key)
        }
        // 资源信息
        if (key === 'projectResourceInfoDto') {
          this.analyseResourceInfo(key)
        }
      })
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
        // if (leftCom.$el.style && rightCom.$el.style) {
        // leftCom.$el.style.height = rightCom.$el.style.height = maxHeght + 10 + 'px'
        // leftCom.$el.style.minHeight = rightCom.$el.style.minheight = maxHeght + 30 + 'px'
        // }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.contrast-detail{
  /deep/ .el-form-item{
    margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
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
