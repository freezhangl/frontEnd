<template>
  <div class="u-budget-detail">
    <project-panel :title="isStopProcess ? '成本信息' : '预算信息'" :show-expand="showExpand">
      <div class="table-wrapper">
        <div class="budget-table" @scroll="scroll">
          <table
            v-if="costBudgetList.length"
            class="budget-con"
            border="1"
            cellpadding="0"
            cellspacing="0">
            <tr>
              <th colspan="2" class="col-title"></th>
              <th
                class="col-title"
                :colspan="item!=='全项目' ? 2 : 1"
                :rowspan="item!=='全项目' ? 1 : 2"
                v-for="(item,index) in yearList"
                :key="index"
                :class="item === '年度合计' ? 'year-amount' : ''">
                <span v-if="item !== '年度合计' && item !== '全项目'">{{item}}年度</span>
                <span v-else>{{item}}</span>
              </th>
            </tr>

            <tr>
              <th colspan="2">项目预算及执行信息</th>
              <th v-for="(item,index) in colNum" :key="index" :class="{'year-cell-right':index%2 !== 0}">
                <span v-if="index%2 === 0">计划成本</span>
                <span v-else>{{isStopProcess ? '实际成本' : '集团批复'}}</span>
              </th>
            </tr>

            <tr>
              <td rowspan="2" class="col-title">合作开发费</td>
              <td class="col-title-child"><span>委外(万元)</span></td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.budgetOutsourcing}">
                  {{costBudgetList[Math.floor(index/2)].budgetOutsourcing | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.budgetOutsourcing}">
                  {{secondCostBudgetList[Math.floor(index/2)].budgetOutsourcing | numTransition}}
                </span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell year-all" rowspan="2">
                <span :class="{'highlightStyle':costBudgetList[yearList.length-1].highlightProps && costBudgetList[yearList.length-1].highlightProps.budgetOutsourcing}">
                  {{costBudgetList[yearList.length-1].budgetOutsourcing | numTransition}}
                </span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child"><span>委内(万元)</span></td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.budgetInsourcing}">
                  {{costBudgetList[Math.floor(index/2)].budgetInsourcing | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.budgetInsourcing}">
                  {{secondCostBudgetList[Math.floor(index/2)].budgetInsourcing | numTransition}}
                </span>
              </td>
              <!-- <td class="data-cell">
                <span>{{costBudgetList[yearList.length-1].budgetInsourcing | numTransition}}</span>
              </td> -->
            </tr>

            <tr>
              <td rowspan="2" class="col-title">自有人工</td>
              <td class="col-title-child"><span>自有人工(人月)</span></td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.staffTime}">
                  {{costBudgetList[Math.floor(index/2)].staffTime | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.staffTime}">
                  {{secondCostBudgetList[Math.floor(index/2)].staffTime | numTransition}}
                </span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell year-all">
                <span :class="{'highlightStyle':costBudgetList[yearList.length-1].highlightProps && costBudgetList[yearList.length-1].highlightProps.staffTime}">
                  {{costBudgetList[yearList.length-1].staffTime | numTransition}}
                </span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">自有人工(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.laborCosts}">
                  {{costBudgetList[Math.floor(index/2)].laborCosts | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.laborCosts}">
                  {{secondCostBudgetList[Math.floor(index/2)].laborCosts | numTransition}}
                </span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell year-all">
                <span :class="{'highlightStyle':costBudgetList[yearList.length-1].highlightProps && costBudgetList[yearList.length-1].highlightProps.laborCosts}">
                  {{costBudgetList[yearList.length-1].laborCosts | numTransition}}
                </span>
              </td>
            </tr>

            <tr>
              <td rowspan="4" class="col-title">其他</td>
              <td class="col-title-child">差旅费(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.travelExpenses}">
                  {{costBudgetList[Math.floor(index/2)].travelExpenses | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.travelExpenses}">
                  {{secondCostBudgetList[Math.floor(index/2)].travelExpenses | numTransition}}
                </span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell year-all">
                <span :class="{'highlightStyle':costBudgetList[yearList.length-1].highlightProps && costBudgetList[yearList.length-1].highlightProps.travelExpenses}">
                  {{costBudgetList[yearList.length-1].travelExpenses | numTransition}}
                </span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">会议费(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.conferenceExpenses}">
                  {{costBudgetList[Math.floor(index/2)].conferenceExpenses | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.conferenceExpenses}">
                  {{secondCostBudgetList[Math.floor(index/2)].conferenceExpenses | numTransition}}
                </span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell year-all">
                <span :class="{'highlightStyle':costBudgetList[yearList.length-1].highlightProps && costBudgetList[yearList.length-1].highlightProps.conferenceExpenses}">
                  {{costBudgetList[yearList.length-1].conferenceExpenses | numTransition}}
                </span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">资产折旧/摊销(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.assetDepreciation}">
                  {{costBudgetList[Math.floor(index/2)].assetDepreciation | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.assetDepreciation}">
                  {{secondCostBudgetList[Math.floor(index/2)].assetDepreciation | numTransition}}
                </span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell year-all">
                <span :class="{'highlightStyle':costBudgetList[yearList.length-1].highlightProps && costBudgetList[yearList.length-1].highlightProps.assetDepreciation}">
                  {{costBudgetList[yearList.length-1].assetDepreciation | numTransition}}
                </span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">其他成本(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.otherCosts}">
                  {{costBudgetList[Math.floor(index/2)].otherCosts | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.otherCosts}">
                  {{secondCostBudgetList[Math.floor(index/2)].otherCosts | numTransition}}
                </span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell year-all">
                <span :class="{'highlightStyle':costBudgetList[yearList.length-1].highlightProps && costBudgetList[yearList.length-1].highlightProps.otherCosts}">
                  {{costBudgetList[yearList.length-1].otherCosts | numTransition}}
                </span>
              </td>
            </tr>

            <tr>
              <td
                colspan="2"
                align="center"
                class="col-title"
                style="color:#000">
                合计(万元)
                <el-tooltip
                  content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工（万元）”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”"
                  placement="top">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0,'year-amount-data':index >= colNum-2}">
                <span
                  v-if="index%2 === 0"
                  :class="{'highlightStyle':costBudgetList[Math.floor(index/2)].highlightProps && costBudgetList[Math.floor(index/2)].highlightProps.totalAmount}">
                  {{costBudgetList[Math.floor(index/2)].totalAmount | numTransition}}
                </span>
                <span
                  v-else
                  :class="{'highlightStyle':secondCostBudgetList[Math.floor(index/2)].highlightProps && secondCostBudgetList[Math.floor(index/2)].highlightProps.totalAmount}">
                  {{secondCostBudgetList[Math.floor(index/2)].totalAmount | numTransition}}
                </span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell year-all">
                <span :class="{'highlightStyle':costBudgetList[yearList.length-1].highlightProps && costBudgetList[yearList.length-1].highlightProps.totalAmount}">
                  {{costBudgetList[yearList.length-1].totalAmount | numTransition}}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div class="fixed-table" :class="{'hideShadow':hideShadow}">
          <table
            v-if="costBudgetList.length"
            class="budget-con"
            border="1"
            cellpadding="0"
            cellspacing="0">
            <tr>
              <th colspan="2" class="col-title"></th>
              <th
                class="col-title"
                :colspan="item!=='全项目' ? 2 : 1"
                :rowspan="item!=='全项目' ? 1 : 2"
                v-for="(item,index) in yearList"
                :key="index"
                :class="item === '年度合计' ? 'year-amount' : ''">
                <span v-if="item !== '年度合计' && item !== '全项目'">{{item}}年度</span>
                <span v-else>{{item}}</span>
              </th>
            </tr>

            <tr>
              <th colspan="2">项目预算及执行信息</th>
              <th v-for="(item,index) in colNum" :key="index" :class="{'year-cell-right':index%2 !== 0}">
                <span v-if="index%2 === 0">计划成本</span>
                <span v-else>{{isStopProcess ? '实际成本' : '集团批复'}}</span>
              </th>
            </tr>

            <tr>
              <td rowspan="2" class="col-title">合作开发费</td>
              <td class="col-title-child"><span>委外(万元)</span></td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell" rowspan="2">
                <span>-</span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child"><span>委内(万元)</span></td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
            </tr>

            <tr>
              <td rowspan="2" class="col-title">自有人工</td>
              <td class="col-title-child"><span>自有人工(人月)</span></td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell">
                <span>-</span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">自有人工(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell">
                <span>-</span>
              </td>
            </tr>

            <tr>
              <td rowspan="4" class="col-title">其他</td>
              <td class="col-title-child">差旅费(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell">
                <span>-</span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">会议费(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell">
                <span>-</span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">资产折旧/摊销(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell">
                <span>-</span>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">其他成本(万元)</td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell">
                <span>-</span>
              </td>
            </tr>

            <tr>
              <td
                colspan="2"
                align="center"
                class="col-title"
                style="color:#000">
                合计(万元)
                <el-tooltip
                  content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工（万元）”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”"
                  placement="top">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </td>
              <td
                class="data-cell"
                v-for="(item,index) in colNum"
                :key="index"
                :class="{'year-cell-right':index%2 !== 0}">
                <span>-</span>
              </td>
              <td v-if="modeType === 'total'" class="data-cell">
                <span>-</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div style="border:1px solid #E8E8E8;padding:24px" v-if="costBudgetList.length == 0">暂无数据</div>
    </project-panel>

  </div>
</template>

<script>
import API from '@/serve/API_groupPlanProject'
export default {
  name: 'UBudgetDetail',
  data () {
    return {
      projectCode: '',
      versionNo: '',
      costBudgetList: [], //计划成本
      groupCostBudgetList: [], //集团批复
      projectCostList: [], //实际成本
      secondCostBudgetList: [], //第二列预算（集团批复或者实际成本）
      yearList: [],
      colNum: 0, //数据总列数（除去全项目列）
      modeType: '', //总分模式BUDGET_TOTAL_MODE-total，分总模式null-other
      isStopProcess: false, // 是否是终止流程或者结项流程
      hideShadow: true //是否显示阴影
    }
  },
  props: {
    budgetInfo: { type: Object, default: () => {} },
    showExpand: { type: Boolean, default: true },
    undertakeBudgetInfo: { type: Object, default: () => {} }
  },
  watch: {
    budgetInfo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.projectCode = newValue.projectCode
          this.versionNo = newValue.versionNo
          this.isStopProcess = newValue.isStopProcess
          this.getBudgetAllYear() //获取所有年份的预算信息
        }
      }
    },
    undertakeBudgetInfo: {
      deep: true,
      immediate: true,
      handler: async function (newValue, oldValue) {
        if (newValue) {
          let resource = JSON.parse(JSON.stringify(newValue))
          this.costBudgetList = resource.costBudgetList || []
          this.secondCostBudgetList = resource.groupCostBudgetList || []
          this.yearList = resource.yearList || []
          this.yearList.push('年度合计')
          await this.costBudgetType()
          if (this.modeType === 'total') { //总分模式-显示全项目
            this.yearList.push('全项目') //年度合计是null,全项目是ALL
          }
          this.analyzeData()
        }
      }
    }
  },
  created () {

  },
  methods: {
    //监听滚动
    scroll (el) {
      if (el.target.scrollLeft === 0) {
        this.hideShadow = true
      } else if (this.hideShadow) {
        this.hideShadow = false
      }
    },
    // 获取所有年度预算
    async getBudgetAllYear () {
      await this.costBudgetType()
      if (!this.projectCode) return
      let params = {
        projectCode: this.projectCode,
        versionNo: this.versionNo // 查询指定版本的时候需要传的参数
      }
      let interFaceName = 'queryUProjectBudget2'
      if (this.isStopProcess) {
        interFaceName = 'queryFinalProjectBudgetInfo'
        params = { projectCode: this.projectCode }
      }
      API[interFaceName](params)
        .then(res => {
          this.costBudgetList = res.costBudgetList || []
          if (this.isStopProcess) {
            this.secondCostBudgetList = res.projectCostList || []
          } else {
            this.secondCostBudgetList = res.groupCostBudgetList || []
          }
          this.yearList = res.yearList || []
          this.yearList.push('年度合计')
          if (this.modeType === 'total') { //总分模式-显示全项目
            this.yearList.push('全项目') //年度合计是null,全项目是ALL
          }
          this.analyzeData()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '项目预算获取失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //解析预算数据
    analyzeData () {
      this.yearList.forEach((year, index) => {
        this.analyzeBudgetList(this.costBudgetList, year, index)
        this.analyzeBudgetList(this.secondCostBudgetList, year, index)
      })
      this.colNum = this.modeType === 'total' ? (this.yearList.length - 1) * 2 : this.yearList.length * 2
    },
    //成本预算和集团批复预算数据处理，返回为空时需按年份加入该年度的预算对象
    analyzeBudgetList (budgetList, year, index) {
      let hasBudget = budgetList.some(yearBudget => {
        if (year === '年度合计' && !yearBudget.timeYear) {
          yearBudget.timeYear = '年度合计'
          return true
        } else if (year === '全项目' && yearBudget.timeYear === 'ALL') {
          yearBudget.timeYear = '全项目'
          return true
        } else if (parseInt(yearBudget.timeYear) === parseInt(year)) {
          return true
        }
      })
      if (!hasBudget) {
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
          totalAmount: null
        }
        budgetList.splice(index, 0, budgetObj)
      }
    },
    //分总模式还是总分模式
    async costBudgetType () {
      let param = {
        projectCode: this.projectCode || this.$route.query.projectCode
      }
      await API.queryCostBudgetType(param)
        .then(res => {
          this.modeType = res === 'BUDGET_TOTAL_MODE' ? 'total' : 'other'
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '预算填报模式获取失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  },
  filters: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.u-budget-detail{
  table {
    border-collapse: collapse;
    border-spacing: 0;

    td, th {
      border-bottom: 1px solid #E8E8E8;
      border-right: 1px solid #E8E8E8;
    }

    tr > td:first-child, tr > td:first-child {
      border-left: 1px solid #E8E8E8;
    }

    tr:first-child td, tr:first-child td {
      border-top: 1px solid #E8E8E8;
    }
  }

  .budget-con {
    min-width: 100%;
    border-collapse: collapse;
    border: 1px solid #E8E8E8;

    .el-icon-info {
      @include color();
    }

    tr {
      th, td {
        min-width: 70px;
        height: 45px;
        padding: 0 20px;
        border-left: none;
        border-right: none;
        border-color: #E8E8E8 !important;
      }

      th, .col-title {
        background: #F4F4F4;
        font-weight: bold;
      }

      .col-title {
        border-right: 1px solid #E8E8E8;
        width: 72px;
        min-width: 72px;
      }

      .col-title-child {
        color: #000 !important;
        border-right: 1px solid #E8E8E8;
        width: 126px;
        min-width: 126px;
        background: #F4F4F4;
      }

      th:nth-child(1) {
        border-right: 1px solid #E8E8E8;
        padding: 0 !important;
      }

      .year-cell-right{
        border-right: 1px solid #E8E8E8;
      }

      .data-cell {
        text-align: center;
      }

      /* td:nth-last-child(2) {
        @include color($color-blue);
      } */

      &:nth-last-child(1) {
        @include color($color-blue);
        font-weight: bold;
      }

      .year-amount{
        width: 100px;
        min-width: 100px;
      }
      .year-all,.year-amount-data{
        @include color($color-blue);
      }
    }

    .required span {
      position: relative;

      &::before {
        color: red;
        content: '*';
        position: absolute;
        left: -10px;
        top: 0px;
      }
    }
  }

  .table-wrapper{
    position: relative;
    overflow: hidden;
    .budget-table{
      width: calc(100% - 1px);
      overflow-x: auto;
    }
    .fixed-table{
      position: absolute;
      top: 0;
      left: 0;
      width: 280px; /** (72+20*2)+(126+20*2)+2 */
      overflow-x: hidden;
      overflow-y: hidden;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.12);
      &.hideShadow{
        box-shadow: none;
      }
    }
  }

  .highlightStyle {
    color: #FF3F3B;
  }
}
</style>
