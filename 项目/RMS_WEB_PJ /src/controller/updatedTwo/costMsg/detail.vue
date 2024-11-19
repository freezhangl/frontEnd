<template>
  <div class="table-wrapper-scroll">
    <div class="table-wrapper" @scroll="scroll">
      <table
        class="table-con"
        border="1"
        cellpadding="0"
        cellspacing="0">
        <tr>
          <th colspan="2" class="col-title"></th>
          <th colspan="3" v-for="(item,index) in yearRange" :key="index">
            {{item.timeYear}}年度
          </th>
          <th colspan="3">年度预算合计</th>
          <th rowspan="2" class="all-w" v-if="isShowProjectCol">全项目</th>
        </tr>
        <tr>
          <td rowspan="3" class="col-title">合作开发费</td>
          <td class="col-title">项目预算及执行信息</td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-1'" class="bg-title">集团批复</td>
            <td :key="index+'-2-1'" class="bg-title">计划成本</td>
            <td :key="index+'-3-1'" class="bg-title">实际支出</td>
          </template>
          <td class="bg-title">集团批复</td>
          <td class="bg-title">计划成本</td>
          <td class="bg-title">实际支出</td>
        </tr>
        <tr>
          <td class="required col-title"><span>委外(万元)</span></td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-2'">{{item.blocReplyCostDto.budgetOutsourcing | toFixed}}</td>
            <td :key="index+'-2-2'">{{item.costBudget.budgetOutsourcing | toFixed}}</td>
            <td :key="index+'-3-2'">{{item.actualOutlayCostDto.budgetOutsourcing | toFixed}}</td>
          </template>
          <td class="total">{{allTotal.blocReplyCostDto.budgetOutsourcing | toFixed}}</td>
          <td class="total">{{allTotal.costBudget.budgetOutsourcing | toFixed}}</td>
          <td class="total">{{allTotal.actualOutlayCostDto.budgetOutsourcing | toFixed}}</td>
          <td rowspan="2" class="left-b data-cell" v-if="isShowProjectCol">{{allProject.budgetOutsourcing | toFixed}}</td>
        </tr>
        <tr>
          <td class="required col-title"><span>委内(万元)</span></td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-3'">{{item.blocReplyCostDto.budgetInsourcing | toFixed}}</td>
            <td :key="index+'-2-3'">{{item.costBudget.budgetInsourcing | toFixed}}</td>
            <td :key="index+'-3-3'">{{item.actualOutlayCostDto.budgetInsourcing | toFixed}}</td>
          </template>
          <td class="total">{{allTotal.blocReplyCostDto.budgetInsourcing | toFixed}}</td>
          <td class="total">{{allTotal.costBudget.budgetInsourcing | toFixed}}</td>
          <td class="total">{{allTotal.actualOutlayCostDto.budgetInsourcing | toFixed}}</td>
        </tr>

        <tr>
          <td rowspan="2" class="col-title">人工预算</td>
          <td class="required col-title"><span>自有人工(人月)</span></td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-4'">{{item.blocReplyCostDto.staffTime | toFixed('staffTime')}}</td>
            <td :key="index+'-2-4'">{{item.costBudget.staffTime | toFixed('staffTime')}}</td>
            <td :key="index+'-3-4'">{{item.actualOutlayCostDto.staffTime | toFixed('staffTime')}}</td>
          </template>
          <td class="total">{{allTotal.blocReplyCostDto.staffTime | toFixed('staffTime')}}</td>
          <td class="total">{{allTotal.costBudget.staffTime | toFixed('staffTime')}}</td>
          <td class="total">{{allTotal.actualOutlayCostDto.staffTime | toFixed('staffTime')}}</td>
          <td class="data-cell" v-if="isShowProjectCol">{{allProject.staffTime | toFixed}}</td>
        </tr>
        <tr>
          <td class="col-title">自有人工成本(万元)</td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-5'">{{item.blocReplyCostDto.laborCosts | toFixed}}</td>
            <td :key="index+'-2-5'">{{item.costBudget.laborCosts | toFixed}}</td>
            <td :key="index+'-3-5'">{{item.actualOutlayCostDto.laborCosts | toFixed}}</td>
          </template>
          <td class="total">{{allTotal.blocReplyCostDto.laborCosts | toFixed}}</td>
          <td class="total">{{allTotal.costBudget.laborCosts | toFixed}}</td>
          <td class="total">{{allTotal.actualOutlayCostDto.laborCosts | toFixed}}</td>
          <td class="data-cell" v-if="isShowProjectCol">{{allProject.laborCosts | toFixed}}</td>
        </tr>

        <tr>
          <td rowspan="4" class="col-title">其他</td>
          <td class="col-title">差旅费(万元)</td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-6'">{{item.blocReplyCostDto.travelExpenses | toFixed}}</td>
            <td :key="index+'-2-6'">{{item.costBudget.travelExpenses | toFixed}}</td>
            <td :key="index+'-3-6'">{{item.actualOutlayCostDto.travelExpenses | toFixed}}</td>
          </template>
          <td class="total">{{allTotal.blocReplyCostDto.travelExpenses | toFixed}}</td>
          <td class="total">{{allTotal.costBudget.travelExpenses | toFixed}}</td>
          <td class="total">{{allTotal.actualOutlayCostDto.travelExpenses | toFixed}}</td>
          <td class="data-cell" v-if="isShowProjectCol">{{allProject.travelExpenses | toFixed}}</td>
        </tr>
        <tr>
          <td class="col-title">会议费(万元)</td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-7'">{{item.blocReplyCostDto.conferenceExpenses | toFixed}}</td>
            <td :key="index+'-2-7'">{{item.costBudget.conferenceExpenses | toFixed}}</td>
            <td :key="index+'-3-7'">{{item.actualOutlayCostDto.conferenceExpenses | toFixed}}</td>
          </template>
          <td class="total">{{allTotal.blocReplyCostDto.conferenceExpenses | toFixed}}</td>
          <td class="total">{{allTotal.costBudget.conferenceExpenses | toFixed}}</td>
          <td class="total">{{allTotal.actualOutlayCostDto.conferenceExpenses | toFixed}}</td>
          <td class="data-cell" v-if="isShowProjectCol">{{allProject.conferenceExpenses | toFixed}}</td>
        </tr>
        <tr>
          <td class="col-title">资产折旧/摊销(万元)</td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-8'">{{item.blocReplyCostDto.assetDepreciation | toFixed}}</td>
            <td :key="index+'-2-8'">{{item.costBudget.assetDepreciation | toFixed}}</td>
            <td :key="index+'-3-8'">{{item.actualOutlayCostDto.assetDepreciation | toFixed}}</td>
          </template>
          <td class="total">{{allTotal.blocReplyCostDto.assetDepreciation | toFixed}}</td>
          <td class="total">{{allTotal.costBudget.assetDepreciation | toFixed}}</td>
          <td class="total">{{allTotal.actualOutlayCostDto.assetDepreciation | toFixed}}</td>
          <td class="data-cell" v-if="isShowProjectCol">{{allProject.assetDepreciation | toFixed}}</td>
        </tr>
        <tr>
          <td class="col-title">其他成本(万元)</td>
          <template v-for="(item,index) in yearRange">
            <td :key="index+'-1-9'">{{item.blocReplyCostDto.otherCosts | toFixed}}</td>
            <td :key="index+'-2-9'">{{item.costBudget.otherCosts | toFixed}}</td>
            <td :key="index+'-3-9'">{{item.actualOutlayCostDto.otherCosts | toFixed}}</td>
          </template>
          <td class="total">{{allTotal.blocReplyCostDto.otherCosts | toFixed}}</td>
          <td class="total">{{allTotal.costBudget.otherCosts | toFixed}}</td>
          <td class="total">{{allTotal.actualOutlayCostDto.otherCosts | toFixed}}</td>
          <td class="data-cell" v-if="isShowProjectCol">{{allProject.otherCosts | toFixed}}</td>
        </tr>

        <tr>
          <td
            colspan="2"
            align="center"
            class="col-title"
            style="color: #000;">
            合计(万元)
          </td>
          <template v-for="(item,index) in yearRange">
            <td class="total" :key="index+'-1'">{{item.blocReplyCostDto.total | toFixed}}</td>
            <!-- <td class="total" :key="index+'-1'"></td> -->
            <td class="total" :key="index+'-2'">{{item.costBudget.total | toFixed}}</td>
            <td class="total" :key="index+'-3'">{{item.actualOutlayCostDto.total | toFixed}}</td>
          </template>
          <td class="total">{{allTotal.total.blocReplyCostDto | toFixed}}</td>
          <!-- <td class="total"></td> -->
          <td class="total">{{allTotal.total.costBudget | toFixed}}</td>
          <td class="total">{{allTotal.total.actualOutlayCostDto | toFixed}}</td>
          <td class="data-cell" v-if="isShowProjectCol">{{allProject.totalAmount | toFixed}}</td>
        </tr>
      </table>
    </div>
    <div class="fixed-table" :class="{'hideShadow':hideShadow}">
      <!-- <table
        class="fixed-table-budget"
        border="1"
        cellpadding="0"
        cellspacing="0">
        <tr>
          <th colspan="2" class="col-title"></th>
        </tr>
        <tr>
          <td rowspan="3" class="col-title">合作开发费</td>
          <td class="col-title">
            <span>项目预算及执行信息</span>
          </td>
        </tr>
        <tr>
          <td class="col-title"><span>委外(万元)</span></td>
        </tr>
        <tr>
          <td class="col-title"><span>委内(万元)</span></td>
        </tr>
        <tr>
          <td rowspan="2" class="col-title">人工预算</td>
          <td class="col-title"><span>自有人工(人月)</span></td>
        </tr>
        <tr>
          <td class="col-title">自有人工成本(万元)</td>
        </tr>
        <tr>
          <td rowspan="4" class="col-title">其他</td>
          <td class="col-title">差旅费(万元)</td>
        </tr>
        <tr>
          <td class="col-title">会议费(万元)</td>
        </tr>
        <tr>
          <td class="col-title">资产折旧/摊销(万元)</td>
        </tr>
        <tr>
          <td class="col-title">其他成本(万元)</td>
        </tr>
        <tr>
          <td colspan="2" align="center" class="col-title title-color">
            合计(万元)
            <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </td>
        </tr>
      </table> -->
      <table
        class="table-con"
        border="1"
        cellpadding="0"
        cellspacing="0">
        <tr>
          <th colspan="2" class="col-title"></th>
        </tr>
        <tr>
          <td rowspan="3" class="col-title">合作开发费</td>
          <td class="col-title">项目预算及执行信息</td>
        </tr>
        <tr>
          <td class="required col-title"><span>委外(万元)</span></td>
        </tr>
        <tr>
          <td class="required col-title"><span>委内(万元)</span></td>
        </tr>

        <tr>
          <td rowspan="2" class="col-title">人工预算</td>
          <td class="required col-title"><span>自有人工(人月)</span></td>
        </tr>
        <tr>
          <td class="col-title">自有人工成本(万元)</td>
        </tr>

        <tr>
          <td rowspan="4" class="col-title">其他</td>
          <td class="col-title">差旅费(万元)</td>
        </tr>
        <tr>
          <td class="col-title">会议费(万元)</td>
        </tr>
        <tr>
          <td class="col-title">资产折旧/摊销(万元)</td>
        </tr>
        <tr>
          <td class="col-title">其他成本(万元)</td>
        </tr>

        <tr>
          <td
            colspan="2"
            align="center"
            class="col-title"
            style="color: #000;">
            合计(万元)
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_projectInfo'
import APIG from '@/serve/API_project'
import { addNum } from '@/utils/numberAdd'
export default {
  props: {
    // yearRange: { type: Object }
  },
  data () {
    return {
      yearRange: [], // 年份
      allTotal: {
        blocReplyCostDto: {}, // 集团批复
        costBudget: {}, // 计划成本
        actualOutlayCostDto: {}, // 实际支出
        total: { // 行合计&列合计 总和
          blocReplyCostDto: 0,
          costBudget: 0,
          actualOutlayCostDto: 0
        }
      },
      allProject: {
        budgetOutsourcing: '',
        budgetInsourcing: '',
        staffTime: '',
        laborCosts: '',
        travelExpenses: '',
        conferenceExpenses: '',
        assetDepreciation: '',
        otherCosts: '',
        totalAmount: '',
        timeYear: 'ALL'
      },
      columnTypeList: [
        'budgetInsourcing',
        'staffTime',
        'budgetOutsourcing',
        'laborCosts',
        'travelExpenses',
        'conferenceExpenses',
        'assetDepreciation',
        'otherCosts',
        'total'
      ],
      hideShadow: true,
      isShowProjectCol: true
    }
  },
  filters: {
    toFixed (param, type) {
      if (param === null || param === undefined) {
        return '-'
      } else if (param.toString() === '0.') {
        return 0
      }
      if (param && param.charAt(param.length - 1) === '.') {
        return param.substr(0, param.length - 1)
      }
      return addNum(param, 0)
    }
  },
  created () {
    this.getQueryCostBudgetType()
    this.getCostMsg()
  },
  methods: {
    // 获取预算填报模式
    getQueryCostBudgetType () {
      let param = {
        projectCode: this.$route.params.projectCode
      }
      APIG.queryCostBudgetType(param)
        .then(res => {
          if (res === 'BUDGET_TOTAL_MODE') {
            this.isShowProjectCol = true
          } else {
            this.isShowProjectCol = false
          }
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
    //监听滚动
    scroll (el) {
      if (el.target.scrollLeft === 0) {
        this.hideShadow = true
      } else if (this.hideShadow) {
        this.hideShadow = false
      }
    },
    // 获取数据
    getCostMsg () {
      API.getCostMsg({ projectCode: this.$route.params.projectCode })
        .then(res => {
          let initObj = {
            budgetInsourcing: null,
            budgetOutsourcing: null,
            staffTime: null,
            laborCosts: null,
            travelExpenses: null,
            conferenceExpenses: null,
            assetDepreciation: null,
            otherCosts: null
          }
          res.map(item => {
            if (item.actualOutlayCostDto === null) {
              item.actualOutlayCostDto = initObj
            }
            if (item.blocReplyCostDto === null) {
              item.blocReplyCostDto = initObj
            }
            if (item.costBudget === null) {
              item.costBudget = initObj
            }
            if (item.costBudget.timeYear) {
              item.projectCode = item.costBudget.projectCode
              item.timeYear = item.costBudget.timeYear
            }
          })
          res.forEach(item => {
            if (item.costBudget.timeYear !== 'ALL') {
              this.yearRange.push(item)
            } else {
              this.allProject = item.costBudget
            }
          })
          this.columnTotal(this.yearRange)
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
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
    // 列合计
    columnTotal (yearRange) {
      // debugger
      yearRange.forEach(item => {
        for (const key in item) {
          if (typeof item[key] === 'object') {
            item[key].total = null
            for (const key1 in item[key]) {
              if (this.columnTypeList.indexOf(key1) !== -1) {
                if (item[key][key1] === null) {
                  item[key][key1] = null
                } else {
                  // item[key][key1] = item[key][key1] * 1
                }
                if ((item[key].hasOwnProperty(key1) && item[key]) || item[key].toString() === '0') {
                  if (key1 !== 'total') {
                    if ((item[key].total || item[key].total === null || item[key].total === 0) && key1 !== 'staffTime') {
                      if (item[key].total === null) item[key].total = 0
                      item[key].total = addNum(item[key].total, item[key][key1])
                    }
                  }
                  this.rowTotal(key, key1, item[key][key1])
                }
              }
            }
          }
        }
      })
    },
    rowTotal (columnType, rowType, number) {
      if (rowType === 'total') {
        this.allTotal[rowType][columnType] = addNum(this.allTotal[rowType][columnType], number)
      } else {
        if (this.allTotal[columnType][rowType]) {
          if (typeof this.allTotal[columnType][rowType] !== 'number') {
            this.allTotal[columnType][rowType] = parseFloat(this.allTotal[columnType][rowType])
          }
        } else {
          this.allTotal[columnType][rowType] = 0
        }
        this.allTotal[columnType][rowType] = addNum(this.allTotal[columnType][rowType], number)
      }
    }
  }
}
// js 数字相加 精度问题 (0.1 + 0.2 !== 0.3)
// function addNum (num1, num2) {
//   if (num1 === null || num1 === undefined) return num2
//   if (num2 === null || num2 === undefined) return num1
//   var numArr1 = num1.toString()
//     .split('.')
//   var numArr2 = num2.toString()
//     .split('.')
//   if (!(numArr1[1] && numArr1[1].length)) {
//     numArr1[1] = ''
//   }
//   if (!(numArr2[1] && numArr2[1].length)) {
//     numArr2[1] = ''
//   }
//   var longFloat = numArr1[1].length > numArr2[1].length ? numArr1[1].length : numArr2[1].length
//   var longInt = numArr1[0].length > numArr2[0].length ? numArr1[0].length : numArr2[0].length
//   var differenceFloat = Math.abs(numArr1[1].length - numArr2[1].length)
//   for (let i = 0; i < differenceFloat; i++) {
//     if (numArr1[1].length > numArr2[1].length) {
//       numArr2.push('0')
//     } else {
//       numArr1.push('0')
//     }
//   }
//   var total = add(numArr1.join(''), numArr2.join(''))
//     .toString()
//   if (total.length < (longFloat + longInt)) {
//     for (let i = total.length; i < (longFloat + longInt); i++) {
//       total = '0' + total
//     }
//   }
//   var totalNumArr = total.split('')
//   totalNumArr.splice(total.length - longFloat, 0, '.')
//   return totalNumArr.join('')
// }

function add (A, B) {
  let result = []
  const l = -15
  while (A !== '' && B !== '') {
    result.unshift(parseInt(A.substr(l)) + parseInt(B.substr(l)))
    A = A.slice(0, l)
    B = B.slice(0, l)
  }
  A += B
  for (let i = result.length - 1; i > 0; i--) {
    result[i] += ''
    if (result[i].length > -l) {
      result[i - 1] += 1
      result[i] = result[i].substr(1)
    } else {
      while (result[i].length < -l) {
        result[i] = '0' + result[i]
      }
    }
  }
  while (A && (result[0] + '').length > -l) {
    result[0] = (result[0] + '').substr(1)
    result.unshift(parseInt(A.substr(l)) + 1)
    A = A.slice(0, l)
  }
  if (A) {
    while ((result[0] + '').length < -l) {
      result[0] = '0' + result[0]
    }
    result.unshift(A)
  }
  if (result[0]) {
    result = result.join('')
  } else {
    result = '0'
  }
  return result
}

</script>
<style lang="scss" scoped>
.table-wrapper{
  overflow-x: auto;
  // overflow-y:visible;
  width: 100%;
}
// th:first-child{position: fixed;left: 5px}
.table-con{
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
      border-color: #E8E8E8;
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
    .left-b {
      border-left: 1px solid #E8E8E8;
    }
    .bg-title {
      min-width: 100px;
      background: #f4f4f4;
      font-weight: bold;
    }
    th{
      border-right: 1px solid #E8E8E8;
      &:last-child{
        border: none;
      }
    }
    .data-cell{
      text-align: center;
    }
    td:nth-last-child(1){
      min-width: 140px;
      // @include color($color-blue);
    }
    &:nth-last-child(1){
      @include color($color-blue);
      // font-weight: bold;
    }
  }
  .total{
    @include color($color-blue);
  }
  .el-form-item{
    margin-bottom: 0;
    margin-right: 0;
    /deep/ .el-form-item__content{
      width: 220px;
    }
  }
}
.table-wrapper-scroll {
    position: relative;
    overflow: hidden;
    .fixed-table{
      position: absolute;
      top: 0;
      left: 0;
      width: 335px; /** (76+20*2)+(160+20*2)+2 */
      overflow-x: hidden;
      overflow-y: hidden;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.12);
      &.hideShadow{
        box-shadow: none;
      }
      .fixed-table-budget {
        border-collapse: collapse;
        border: 1px solid #E8E8E8;
        tr {
          th,td{
            height: 45px;
            padding: 0 20px;
            border-left: none;
            border-right: none;
            border-top: 1px solid #E8E8E8;
            border-bottom: 1px solid #E8E8E8;
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
          .title-color {
            @include color($color-blue);
          }
        }
      }
    }
  }
</style>
