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
                  class="year-title"
                  v-for="(item, i) in yearRange"
                  :key="i">{{item.year}}年度</th>
              </tr>
              <tr>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell bg-title">集团批复</td>
                  <td :key="index+'-2-1'" class="data-cell bg-title none-border">计划成本</td>
                  <td :key="index+'-3-1'" class="data-cell bg-title">实际支出</td>
                </template>
              </tr>
              <tr>
                <td rowspan="2" class="col-title">合作开发费</td>
                <td class="required col-title"><span>委外(万元)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].budgetOutsourcing | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].budgetOutsourcing | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell">{{item.projectBudget[2].budgetOutsourcing | formatNoData}}</td>
                </template>
              </tr>
              <tr>
                <td class="required col-title"><span>委内(万元)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].budgetInsourcing | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].budgetInsourcing | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell">{{item.projectBudget[2].budgetInsourcing | formatNoData}}</td>
                </template>
              </tr>
              <tr>
                <td rowspan="2" class="col-title">人工预算</td>
                <td class="required col-title"><span>自有人工(人月)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].staffTime | formatPersonMonth}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].staffTime | formatPersonMonth}}</td>
                  <td :key="index+'-3-1'" class="data-cell">{{item.projectBudget[2].staffTime | formatPersonMonth}}</td>
                </template>
              </tr>
              <tr>
                <td class="col-title">自有人工成本(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].laborCosts | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].laborCosts | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell">{{item.projectBudget[2].laborCosts | formatNoData}}</td>
                </template>
              </tr>

              <tr>
                <td rowspan="4" class="col-title">其他</td>
                <td class="col-title">差旅费(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].travelExpenses | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].travelExpenses | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell">{{item.projectBudget[2].travelExpenses | formatNoData}}</td>
                </template>
              </tr>
              <tr>
                <td class="col-title">会议费(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].conferenceExpenses | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].conferenceExpenses | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell">{{item.projectBudget[2].conferenceExpenses | formatNoData}}</td>
                </template>
              </tr>
              <tr>
                <td class="col-title">资产折旧/摊销(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].assetDepreciation | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].assetDepreciation | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell">{{item.projectBudget[2].assetDepreciation | formatNoData}}</td>
                </template>
              </tr>
              <tr>
                <td class="col-title">其他成本(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell">{{item.projectBudget[0].otherCosts | formatNoData}}</td>
                  <td :key="index+'-2-1'" class="data-cell">{{item.projectBudget[1].otherCosts | formatNoData}}</td>
                  <td :key="index+'-3-1'" class="data-cell">{{item.projectBudget[2].otherCosts | formatNoData}}</td>
                </template>
              </tr>

              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                </td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell total_cell">{{item.projectBudget[0].totalAmount | formatNoData}}
                    <el-tooltip content="注：集团批复合计=合作开发费-委外+合作开发费-委内 + 自有人工（人月）*  单位人力成本" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </td>
                  <td :key="index+'-2-1'" class="data-cell total_cell">{{item.projectBudget[1].totalAmount | formatNoData}}
                    <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </td>
                  <td :key="index+'-3-1'" class="data-cell total_cell">{{item.projectBudget[2].totalAmount | formatNoData}}
                    <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </td>
                </template>
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
                  class="year-title"
                  v-for="(item, i) in yearRange"
                  :key="i">{{item.year}}年度</th>
              </tr>
              <tr>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell bg-title">集团批复</td>
                  <td :key="index+'-2-1'" class="data-cell bg-title none-border">计划成本</td>
                  <td :key="index+'-3-1'" class="data-cell bg-title">实际支出</td>
                </template>
              </tr>
              <tr>
                <td rowspan="2" class="col-title">合作开发费</td>
                <td class="required col-title"><span>委外(万元)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell"></td>
                </template>
              </tr>
              <tr>
                <td class="required col-title"><span>委内(万元)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell"></td>
                </template>
              </tr>
              <tr>
                <td rowspan="2" class="col-title">人工预算</td>
                <td class="required col-title"><span>自有人工(人月)</span></td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell"></td>
                </template>
              </tr>
              <tr>
                <td class="col-title">自有人工成本(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell"></td>
                </template>
              </tr>

              <tr>
                <td rowspan="4" class="col-title">其他</td>
                <td class="col-title">差旅费(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell"></td>
                </template>
              </tr>
              <tr>
                <td class="col-title">会议费(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell"></td>
                </template>
              </tr>
              <tr>
                <td class="col-title">资产折旧/摊销(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell"></td>
                </template>
              </tr>
              <tr>
                <td class="col-title">其他成本(万元)</td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell"></td>
                  <td :key="index+'-2-1'" class="data-cell"></td>
                  <td :key="index+'-3-1'" class="data-cell"></td>
                </template>
              </tr>

              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                </td>
                <template v-for="(item,index) in yearRange">
                  <td :key="index+'-1-1'" class="data-cell total_cell"></td>
                  <td :key="index+'-2-1'" class="data-cell total_cell"></td>
                  <td :key="index+'-3-1'" class="data-cell total_cell"></td>
                </template>
              </tr>
            </table>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_projectInfo'
import { mapGetters } from 'vuex'
import { addNum } from '@/utils/numberAdd'
export default {
  data () {
    return {
      budgetForm: {
        projectCode: '', //项目编码
        costBudgetList: []
      },
      templateList: [], // 用来展示信息的数组
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'],
      yearRange: [],
      dataMap: {},
      allTotal: {},
      hideShadow: true
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
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.analyzeData()
        }
      }
    }
  },
  methods: {
    handleTotal () {
      this.allTotal.allSum = 0
      this.allTotal.allPlanSum = 0
      this.allTotal.allActualSum = 0
      this.allKeys.forEach(key => {
        this[`${key}Sum`] = 0
        this.allTotal[`${key}Sum`] = 0
        this.allTotal[`${key}PlanSum`] = 0
        this.allTotal[`${key}ActualSum`] = 0
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
        this.allTotal.allSum = addNum(this.allTotal.allSum, this.allTotal[`${key}Sum`])
        this.allTotal.allPlanSum = addNum(this.allTotal.allPlanSum, this.allTotal[`${key}PlanSum`])
        this.allTotal.allActualSum = addNum(this.allTotal.allActualSum, this.allTotal[`${key}ActualSum`])
      })
    },
    analyzeData () {
      this.dataMap = new Map()
      //初始化清空默认数据
      this.yearRange = []
      this.budgetForm.costBudgetList = JSON.parse(JSON.stringify(this.receiveData))
      this.budgetForm.costBudgetList.forEach(item => {
        this.yearRange.push(item)
        let tmpMap = new Map()
        item.projectBudget.forEach(tmp => {
          tmpMap.set(tmp.costType, tmp)
        })
        this.dataMap.set(item.year, tmpMap)
      })
      this.handleTotal()
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
      if (val) {
        return addNum(val, 0)
      } else {
        return '-'
      }
    },
    formatNoData (val) {
      if (val) {
        return addNum(val, 0)
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
        //  .el-icon-info{
        //    @include color();
        //  }
      }
      .year-title {
        width: 220px;
        min-width: 220px;
        max-width: 220px;
      }
      .bg-title {
        background: #F4F4F4;
        font-weight: bold;
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
          top: 100%;
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
          height:345px;/*这里需要自己调整，根据td的宽度和高度*/
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
    // .el-form-item{
    //   margin-bottom: 0;
    //   margin-right: 0;
    //   /deep/ .el-form-item__content{
    //     width: 220px;
    //   }
    // }
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
.el-icon-info{
  @include color()
}
.total_cell{
  @include color()
}
</style>
