<template>
  <div class="project-budget">
    <div class="budget-body">
      <el-form
        ref="budgetForm"
        :model="budgetForm"
        :inline="true">
        <div class="table-wrapper">
          <div class="orginal-table" @scroll="scroll">
            <table
              class="budget-con"
              border="1"
              cellpadding="0"
              cellspacing="0">
              <tr>
                <th colspan="2" rowspan="2" class="col-title first">
                  <span>费用科目</span>
                  <span>年度</span>
                </th>
                <th
                  colspan="3"
                  class="year-title border-right"
                  v-for="(item, i) in yearRange"
                  :key="i">{{item.year}}年度</th>
                <th class="border-right" colspan="3">年度合计</th>
                <th v-if="modeType === 'total'" class="data-cell bg-title" rowspan="2">全项目</th>
              </tr>
              <tr>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell bg-title">集团批复</td>
                  <td :key="index+'-2-1'" class="data-cell bg-title none-border">计划成本</td>
                  <td :key="index+'-3-1'" class="data-cell bg-title border-right">实际支出</td>
                </template>
                <td  class="data-cell bg-title">集团批复</td>
                <td  class="data-cell bg-title none-border">计划成本</td>
                <td  class="data-cell bg-title">实际支出</td>
              </tr>
              <tr>
                <td rowspan="2" class="col-title">合作开发费</td>
                <td class="required col-title"><span>委外(万元)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].budgetOutsourcing | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].budgetOutsourcing | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell border-right">{{item.projectBudget[2].budgetOutsourcing | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.budgetOutsourcingSum | formatNoData}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.budgetOutsourcingPlanSum | formatNoData}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.budgetOutsourcingActualSum | formatNoData}}</td>
                <td v-if="modeType === 'total'" rowspan="2" class="data-cell sub-bule">{{allProBudget.budgetOutsourcing | formatNoData}}</td>
              </tr>
              <tr>
                <td class="required col-title"><span>委内(万元)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].budgetInsourcing | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].budgetInsourcing | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell border-right">{{item.projectBudget[2].budgetInsourcing | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.budgetInsourcingSum | formatNoData}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.budgetInsourcingPlanSum | formatNoData}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.budgetInsourcingActualSum | formatNoData}}</td>
              </tr>
              <tr>
                <td rowspan="2" class="col-title">人工预算</td>
                <td class="required col-title"><span>自有人工(人月)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].staffTime | formatPersonMonth}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].staffTime | formatPersonMonth}}</td>
                  <td :key="index+'-3-1'" class="data-cell border-right">{{item.projectBudget[2].staffTime | formatPersonMonth}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.staffTimeSum | formatPersonMonth}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.staffTimePlanSum | formatPersonMonth}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.staffTimeActualSum | formatPersonMonth}}</td>
                <td v-if="modeType === 'total'" class="data-cell sub-bule">{{allProBudget.staffTime | formatNoData}}</td>
              </tr>
              <tr>
                <td class="col-title">自有人工成本(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].avgLaborCost | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].laborCosts | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell border-right">{{item.projectBudget[2].laborCosts | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.avgLaborCostSum | formatNoData}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.laborCostsPlanSum | formatNoData}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.laborCostsActualSum | formatNoData}}</td>
                <td v-if="modeType === 'total'" class="data-cell sub-bule">{{allProBudget.laborCosts | formatNoData}}</td>
              </tr>

              <tr>
                <td rowspan="4" class="col-title">其他</td>
                <td class="col-title">差旅费(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].travelExpenses | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].travelExpenses | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell border-right">{{item.projectBudget[2].travelExpenses | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.travelExpensesSum | formatNoData}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.travelExpensesPlanSum | formatNoData}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.travelExpensesActualSum | formatNoData}}</td>
                <td v-if="modeType === 'total'" class="data-cell sub-bule">{{allProBudget.travelExpenses | formatNoData}}</td>
              </tr>
              <tr>
                <td class="col-title">会议费(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].conferenceExpenses | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].conferenceExpenses | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell border-right">{{item.projectBudget[2].conferenceExpenses | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.conferenceExpensesSum | formatNoData}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.conferenceExpensesPlanSum | formatNoData}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.conferenceExpensesActualSum | formatNoData}}</td>
                <td v-if="modeType === 'total'" class="data-cell sub-bule">{{allProBudget.conferenceExpenses | formatNoData}}</td>
              </tr>
              <tr>
                <td class="col-title">资产折旧/摊销(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].assetDepreciation | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].assetDepreciation | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell border-right">{{item.projectBudget[2].assetDepreciation | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.assetDepreciationSum | formatNoData}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.assetDepreciationPlanSum | formatNoData}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.assetDepreciationActualSum | formatNoData}}</td>
                <td v-if="modeType === 'total'" class="data-cell sub-bule">{{allProBudget.assetDepreciation | formatNoData}}</td>
              </tr>
              <tr>
                <td class="col-title">其他成本(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].otherCosts | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].otherCosts | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell border-right">{{item.projectBudget[2].otherCosts | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.otherCostsSum | formatNoData}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.otherCostsPlanSum | formatNoData}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.otherCostsActualSum | formatNoData}}</td>
                <td v-if="modeType === 'total'" class="data-cell sub-bule">{{allProBudget.otherCosts | formatNoData}}</td>
              </tr>

              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计(万元)
                  <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                    <i class="el-icon-info sub-bule"></i>
                  </el-tooltip>
                </td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell sub-bule">{{item.projectBudget[0].totalAmount | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell sub-bule">{{item.projectBudget[1].totalAmount | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell sub-bule border-right">{{item.projectBudget[2].totalAmount | formatNoData}}</td>
                </template>
                <td class="data-cell sub-bule">{{allTotal.totalAmountSum | formatNoData}}</td>
                <td class="data-cell none-border sub-bule">{{allTotal.totalAmountPlanSum | formatNoData}}</td>
                <td class="data-cell sub-bule border-right">{{allTotal.totalAmountActualSum | formatNoData}}</td>
                <td v-if="modeType === 'total'" class="data-cell sub-bule">{{allProBudget.totalAmount | formatNoData}}</td>
              </tr>
            </table>
          </div>

          <div class="fixed-table" :class="{'hideShadow':hideShadow}">
            <table
              class="budget-con"
              border="1"
              cellpadding="0"
              cellspacing="0">
              <tr>
                <th colspan="2" rowspan="2" class="col-title first">
                  <span>费用科目</span>
                  <span>年度</span>
                </th>
                <th
                  colspan="3"
                  class="year-title border-right"
                  v-for="(item, i) in yearRange"
                  :key="i">{{item.year}}年度</th>
                <th colspan="3">合计</th>
              </tr>
              <tr>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell bg-title">集团批复</td>
                  <td :key="index+'-2-1'" class="data-cell bg-title none-border">计划成本</td>
                  <td :key="index+'-3-1'" class="data-cell bg-title border-right">实际支出</td>
                </template>
                <td  class="data-cell bg-title">集团批复</td>
                <td  class="data-cell bg-title none-border">计划成本</td>
                <td  class="data-cell bg-title">实际支出</td>
              </tr>
              <tr>
                <td rowspan="2" class="col-title">合作开发费</td>
                <td class="required col-title"><span>委外(万元)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>
              <tr>
                <td class="required col-title"><span>委内(万元)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>
              <tr>
                <td rowspan="2" class="col-title">人工预算</td>
                <td class="required col-title"><span>自有人工(人月)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>
              <tr>
                <td class="col-title">自有人工成本(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>

              <tr>
                <td rowspan="4" class="col-title">其他</td>
                <td class="col-title">差旅费(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>
              <tr>
                <td class="col-title">会议费(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>
              <tr>
                <td class="col-title">资产折旧/摊销(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>
              <tr>
                <td class="col-title">其他成本(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>

              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计(万元)
                  <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                    <i class="el-icon-info sub-bule"></i>
                  </el-tooltip>
                </td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell sub-bule"></td>
                  <td :key="index+'-2-1'" class="data-cell sub-bule"></td>
                  <td :key="index+'-3-1'" class="data-cell sub-bule border-right"></td>
                </template>
                <td class="data-cell sub-bule"></td>
                <td class="data-cell none-border sub-bule"></td>
                <td class="data-cell sub-bule"></td>
              </tr>
            </table>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addNum, deleteZero } from '@/utils/numberAdd'
import API from '@/serve/API_groupPlanProject'
export default {
  data () {
    return {
      budgetForm: {
        projectCode: '', //项目编码
        costBudgetList: []
      },
      templateList: [], // 用来展示信息的数组
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts', 'totalAmount', 'avgLaborCost'],
      yearRange: [],
      dataMap: {},
      allTotal: {},
      hideShadow: true,
      allProBudget: {},
      modeType: ''//总分模式BUDGET_TOTAL_MODE-total，分总模式null-other
    }
  },
  props: {
    receiveData: {
      type: Array,
      default: () => []
    },
    info: {}
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    })
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: async function (val, oldVal) {
        if (val && val.length > 0) {
          await this.costBudgetType()
          this.analyzeData()
        }
      }
    }
  },
  methods: {
    handleTotal () {
      // this.allTotal.allSum = 0
      // this.allTotal.allPlanSum = 0
      // this.allTotal.allActualSum = 0
      this.allTotal = {}
      this.allKeys.forEach(key => {
        this[`${key}Sum`] = 0
        // this.allTotal[`${key}Sum`] = 0
        // this.allTotal[`${key}PlanSum`] = 0
        // this.allTotal[`${key}ActualSum`] = 0
        this.yearRange.forEach(year => {
          year.projectBudget.forEach(budget => {
            if (budget.costType === '1') {
              this.allTotal[`${key}Sum`] = addNum(budget[key], this.allTotal[`${key}Sum`])
            } else if (budget.costType === '2') {
              this.allTotal[`${key}PlanSum`] = addNum(budget[key], this.allTotal[`${key}PlanSum`])
            } else if (budget.costType === '3') {
              this.allTotal[`${key}ActualSum`] = addNum(budget[key], this.allTotal[`${key}ActualSum`])
            }
          })
        })
        // if (key !== 'staffTime') {
        //   this.allTotal.allSum = addNum(this.allTotal.allSum, this.allTotal[`${key}Sum`])
        //   this.allTotal.allPlanSum = addNum(this.allTotal.allPlanSum, this.allTotal[`${key}PlanSum`])
        //   this.allTotal.allActualSum = addNum(this.allTotal.allActualSum, this.allTotal[`${key}ActualSum`])
        // }
      })
    },
    analyzeData () {
      this.dataMap = new Map()
      //初始化清空默认数据
      this.yearRange = []
      let hasAll = false
      this.budgetForm.costBudgetList = JSON.parse(JSON.stringify(this.receiveData))
      this.budgetForm.costBudgetList.forEach(item => {
        if (item.year === 'ALL') {
          this.allProBudget = item.projectBudget[0] || {}
          hasAll = true
          return
        }
        this.yearRange.push(item)
        let tmpMap = new Map()
        item.projectBudget.forEach(tmp => {
          tmpMap.set(tmp.costType, tmp)
        })
        this.dataMap.set(item.year, tmpMap)
      })
      if (this.modeType === 'total' && !hasAll) {
        this.allProBudget = {}
      }
      this.handleTotal()
    },
    //分总模式还是总分模式
    async costBudgetType () {
      let param = {
        projectCode: this.$route.params.projectCode
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
    },
    //监听滚动
    scroll (el) {
      if (el.target.scrollLeft === 0) {
        this.hideShadow = true
      } else if (this.hideShadow) {
        this.hideShadow = false
      }
    }
  },
  mounted () {
  },
  filters: {
    formatPersonMonth (val) {
      if (val !== null && val !== undefined && val !== '' && val !== 'undefined' && val !== 'null') {
        return deleteZero(val)
      } else {
        return '-'
      }
    },
    formatNoData (val) {
      if (val !== null && val !== undefined && val !== '' && val !== 'undefined' && val !== 'null') {
        return deleteZero(val)
      } else {
        return '-'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.project-budget{

  .budget-body{
    overflow-x: auto;
    // overflow-y:visible;
    width: 100%;
  }
  // th:first-child{position: fixed;left: 5px}
  .budget-con{
    min-width: 100%;
    border-collapse: collapse;
    border: 1px solid #E8E8E8;
    // position: relative;
    tr {
      th,td{
        height: 45px;
        padding: 0 20px;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #e8e8e8;
        // &:last-child{
          // border-collapse:collapse;
        // }
      }
      th,.col-title{
        background: #F4F4F4;
        font-weight: bold;
      }
      .col-title{
        border-right: 1px solid #E8E8E8;
        width: 126px;
        min-width: 126px;
        max-width: 126px;
      }
      .year-title {
        width: 220px;
        min-width: 220px;
        max-width: 220px;
      }
      .sub-bule {
        @include color();
      }
      .border-right {
        border-right: 1px solid #E8E8E8;
      }
      .bg-title {
        background: #F4F4F4;
        font-weight: bold;
            white-space: nowrap;
      }
      th:nth-child(1){
        border-right: 1px solid #E8E8E8;
      }
      .data-cell{
        text-align: center;
      }
      th.first{
        position: relative;
        span:nth-child(1){
          position: absolute;
          top: 85px;
          left: 50%;
          transform: translate(-100%, -150%);
        }
        span:nth-child(2){
          position: absolute;
          top: 0%;
          left: 50%;
          transform: translate(0%, 50%);
        }
        &::before{
          content: "";
          position: absolute;
          width: 1px;
          height:350px;/*这里需要自己调整，根据td的宽度和高度*/
          top:0;
          left:0;
          background-color: #E9E9E9;
          display: block;
          transform: rotate(-75deg);/*这里需要自己调整，根据线的位置*/
          transform-origin: top;
        }
      }
    }
    .none-border {
      border-right: none !important;
    }
    .sum-color {
      color: #20A0FF;
    }
  }
  margin-top: 20px;

  .table-wrapper{
    position: relative;
    overflow: hidden;
    .orginal-table{
      width: calc(100% - 1px);
      overflow-x: auto;
    }
    .fixed-table{
      position: absolute;
      top: 0;
      left: 0;
      width: 334px; /** (126+20*2)*2+2 */
      overflow-x: hidden;
      overflow-y: hidden;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.12);
      &.hideShadow{
        box-shadow: none;
      }
    }
  }
}
</style>
