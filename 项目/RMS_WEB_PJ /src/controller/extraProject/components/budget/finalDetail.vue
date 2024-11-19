<template>
  <div class="project-budget">
    <project-panel :title="info.title">
      <div class="budget-body">
        <el-form ref="budgetForm" :model="budgetForm" :inline="true">
          <div class="table-wrapper">
            <div class="budget-body" @scroll="scroll">
              <table
                class="budget-con"
                border="1"
                cellpadding="0"
                cellspacing="0">
                <tr>
                  <th colspan="2" class="col-title"></th>
                  <th
                    colspan="2"
                    class="year-title"
                    v-for="(item,index) in yearRange"
                    :key="index"
                  >{{item}}年度</th>
                  <th colspan="2" class="year-title">年度预算合计</th>
                  <th rowspan="2" class="all-w" v-if="isShowProjectCol">全项目</th>
                </tr>
                <tr>
                  <td rowspan="3" class="col-title">合作开发费</td>
                  <td class="required col-title">
                    <span>项目预算及执行信息</span>
                  </td>
                  <td
                    class="data-cell bg-title"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span v-if="i % 2 ==0">计划成本</span>
                    <span v-else>实际成本</span>
                  </td>
                  <td class="data-cell bg-title none-border">计划成本</td>
                  <td class="data-cell bg-title">实际成本</td>
                </tr>
                <tr>
                  <td class="required col-title">
                    <span>委外(万元)</span>
                  </td>
                  <td
                    class="data-cell"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span
                      v-if="i % 2 ==0"
                    >{{templateList[i].budgetOutsourcing | numTransition}}</span>
                    <span
                      v-else
                    >{{templateList[i].actualBudgetOutsourcing | numTransition}}</span>
                  </td>
                  <td
                    class="data-cell none-border sum-color"
                  >{{budgetOutsourcingSum | numTransition}}</td>
                  <td
                    class="data-cell sum-color"
                  >{{actualBudgetOutsourcingSum | numTransition}}</td>
                  <td rowspan="2" class="left-b data-cell" v-if="isShowProjectCol">{{allProject.budgetOutsourcing | numTransition}}</td>
                </tr>
                <tr>
                  <td class="required col-title">
                    <span>委内(万元)</span>
                  </td>
                  <td
                    class="data-cell"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span
                      v-if="i % 2 ==0"
                    >{{templateList[i].budgetInsourcing | numTransition}}</span>
                    <span
                      v-else
                    >{{templateList[i].actualBudgetInsourcing | numTransition}}</span>
                  </td>
                  <td
                    class="data-cell none-border sum-color"
                  >{{budgetInsourcingSum | numTransition}}</td>
                  <td
                    class="data-cell sum-color"
                  >{{actualBudgetInsourcingSum | numTransition}}</td>
                </tr>

                <tr>
                  <td rowspan="2" class="col-title">人工预算</td>
                  <td class="required col-title">
                    <span>自有人工(人月)</span>
                  </td>
                  <td
                    class="data-cell"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span v-if="i % 2 ==0">{{templateList[i].staffTime | numTransition}}</span>
                    <span v-else>{{templateList[i].actualStaffTime | numTransition}}</span>
                  </td>
                  <td
                    class="data-cell none-border sum-color"
                  >{{staffTimeSum | numTransition}}</td>
                  <td class="data-cell sum-color">{{actualStaffTimeSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">{{allProject.staffTime | numTransition}}</td>
                </tr>
                <tr>
                  <td class="col-title">自有人工成本(万元)</td>
                  <td
                    class="data-cell"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span
                      v-if="i % 2 ==0"
                    >{{templateList[i].laborCosts | numTransition}}</span>
                    <span v-else>{{templateList[i].actualLaborCosts | numTransition}}</span>
                  </td>
                  <td
                    class="data-cell none-border sum-color"
                  >{{laborCostsSum | numTransition}}</td>
                  <td class="data-cell sum-color">{{actualLaborCostsSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">{{allProject.laborCosts | numTransition}}</td>
                </tr>

                <tr>
                  <td rowspan="4" class="col-title">其他</td>
                  <td class="col-title">差旅费(万元)</td>
                  <td
                    class="data-cell"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span
                      v-if="i % 2 ==0"
                    >{{templateList[i].travelExpenses | numTransition}}</span>
                    <span
                      v-else
                    >{{templateList[i].actualTravelExpenses | numTransition}}</span>
                  </td>
                  <td
                    class="data-cell none-border sum-color"
                  >{{travelExpensesSum | numTransition}}</td>
                  <td
                    class="data-cell sum-color"
                  >{{actualTravelExpensesSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">{{allProject.travelExpenses | numTransition}}</td>
                </tr>
                <tr>
                  <td class="col-title">会议费(万元)</td>
                  <td
                    class="data-cell"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span
                      v-if="i % 2 ==0"
                    >{{templateList[i].conferenceExpenses | numTransition}}</span>
                    <span
                      v-else
                    >{{templateList[i].actualConferenceExpenses | numTransition}}</span>
                  </td>
                  <td
                    class="data-cell none-border sum-color"
                  >{{conferenceExpensesSum | numTransition}}</td>
                  <td
                    class="data-cell sum-color"
                  >{{actualConferenceExpensesSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">{{allProject.conferenceExpenses | numTransition}}</td>
                </tr>
                <tr>
                  <td class="col-title">资产折旧/摊销(万元)</td>
                  <td
                    class="data-cell"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span
                      v-if="i % 2 ==0"
                    >{{templateList[i].assetDepreciation | numTransition}}</span>
                    <span
                      v-else
                    >{{templateList[i].actualAssetDepreciation | numTransition}}</span>
                  </td>
                  <td
                    class="data-cell none-border sum-color"
                  >{{assetDepreciationSum | numTransition}}</td>
                  <td
                    class="data-cell sum-color"
                  >{{actualAssetDepreciationSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">{{allProject.assetDepreciation | numTransition}}</td>
                </tr>
                <tr>
                  <td class="col-title">其他成本(万元)</td>
                  <td
                    class="data-cell"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span
                      v-if="i % 2 ==0"
                    >{{templateList[i].otherCosts | numTransition}}</span>
                    <span v-else>{{templateList[i].actualOtherCosts | numTransition}}</span>
                  </td>
                  <td
                    class="data-cell none-border sum-color"
                  >{{otherCostsSum | numTransition}}</td>
                  <td class="data-cell sum-color">{{actualOtherCostsSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">{{allProject.otherCosts | numTransition}}</td>
                </tr>

                <tr>
                  <td colspan="2" align="center" class="col-title sum-color">
                    合计(万元)
                    <el-tooltip
                      content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”"
                      placement="top"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </td>
                  <td
                    class="data-cell sum-color"
                    v-for="(item, i) in yearRange.length * 2"
                    :key="i"
                    :class="i % 2 ==0? 'none-border': ''"
                  >
                    <span
                      v-if="i % 2 ==0"
                    >{{templateList[i].totalAmount | numTransition}}</span>
                    <span v-else>{{templateList[i].actualTotalAmount | numTransition}}</span>
                  </td>
                  <td class="data-cell none-border sum-color">{{allSum | numTransition}}</td>
                  <td class="data-cell sum-color">{{actualAllSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">{{allProject.totalAmount | numTransition}}</td>
                </tr>
              </table>
            </div>
            <div class="fixed-table" :class="{'hideShadow':hideShadow}">
              <table
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
                  <td colspan="2" align="center" class="col-title">
                    合计(万元)
                    <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                      <i class="el-icon-info title-color"></i>
                    </el-tooltip>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </el-form>
      </div>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
import { mapGetters } from 'vuex'
export default {
  components: { projectPanel },
  data () {
    return {
      budgetForm: {
        projectCode: '', //项目编码
        costBudgetList: []
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
      templateList: [], // 用来展示信息的数组
      allKeys: [
        'budgetOutsourcing',
        'budgetInsourcing',
        'staffTime',
        'laborCosts',
        'travelExpenses',
        'conferenceExpenses',
        'assetDepreciation',
        'otherCosts'
      ],
      actualAllKeys: [
        'actualBudgetOutsourcing',
        'actualBudgetInsourcing',
        'actualStaffTime',
        'actualLaborCosts',
        'actualTravelExpenses',
        'actualConferenceExpenses',
        'actualAssetDepreciation',
        'actualOtherCosts'
      ],
      budgetOutsourcingSum: '0', // 计划成本-委外总和
      actualBudgetOutsourcingSum: '0', // 实际成本-委外总和
      budgetInsourcingSum: '0', // 计划成本-委内总和
      actualBudgetInsourcingSum: '0', // 实际成本-委内总和
      staffTimeSum: '0', // 计划成本-自有人工总和
      actualStaffTimeSum: '0', // 实际成本-自有人工总和
      laborCostsSum: '0', // 计划成本-自有人工成本总和
      actualLaborCostsSum: '0', // 实际成本-自有人工成本总和
      travelExpensesSum: '0', // 计划成本-差旅费总和
      actualTravelExpensesSum: '0', // 实际成本-差旅费总和
      conferenceExpensesSum: '0', // 计划成本-会议费总和
      actualConferenceExpensesSum: '0', // 实际成本-会议费总和
      assetDepreciationSum: '0', // 计划成本-资产折旧总和
      actualAssetDepreciationSum: '0', // 实际成本-资产折旧总和
      otherCostsSum: '0', // 计划成本-其他成本总和
      actualOtherCostsSum: '0', // 实际成本-其他成本总和
      allSum: '0', //计划成本-总合计
      actualAllSum: '0', //实际成本-总合计
      yearRange: [],
      hideShadow: true,
      isShowProjectCol: true
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
    // 获取预算填报模式
    getQueryCostBudgetType () {
      let param = {
        projectCode: this.$route.query.projectCode || this.$route.params.projectCode
      }
      API.queryCostBudgetType(param)
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
    sumFloat (num1, num2, prop) {
      num1 = num1 || '0'
      num2 = num2 || '0'
      let int1 = num1.split('.')[0] || 0
      let int2 = num2.split('.')[0] || 0
      let decimal1 = num1.split('.')[1] || 0
      let decimal2 = num2.split('.')[1] || 0
      //整数与整数相加，2+5=7
      let int = parseInt(int1) + parseInt(int2)
      let decimalLen = prop === 'actualCost' ? 2 : 6
      //小数位相加，再除以倍数，991+999=1990 1990/1000000=0.001990
      // let decimal = (parseInt(decimal1) + parseInt(decimal2)) / Math.pow(10, decimalLen)
      let decimal =
                (parseFloat('0.' + decimal1) * Math.pow(10, decimalLen) +
                    parseFloat('0.' + decimal2) * Math.pow(10, decimalLen)) /
                Math.pow(10, decimalLen)
      //获取小数位相加之和补全位数，0.00199 --> 0.001990
      let newDecimal = this.getFixedNumNew(decimal + '', decimalLen)
      //整数位相加的结果再与小数位相加结果的整数位相加，小数与小数相加,7.001990，如：1+1.25 --> 2+0.25
      let sum =
                int +
                parseInt(newDecimal.split('.')[0]) +
                '.' +
                newDecimal.split('.')[1]
      return sum
    },
    //补齐小数位,val --> string
    getFixedNumNew (val, len = 6) {
      let str = ''
      let splitArr = val.split('.')
      if (splitArr.length > 1 && splitArr[1] !== '') {
        str = parseInt(splitArr[0]) + '.'
        if (splitArr[1].length < len) {
          str =
                        str +
                        splitArr[1] +
                        this.getDecimal(len - splitArr[1].length)
        } else {
          str += splitArr[1]
        }
      } else {
        //无小数位，补全
        str = parseInt(splitArr[0]) + '.' + this.getDecimal(len)
      }
      return str
    },
    //补位0
    getDecimal (len) {
      let decimal = ''
      for (let i = 0; i < len; i++) {
        decimal += '0'
      }
      return decimal
    },
    //转成固定小数位
    getFixedNum (val, num = 6) {
      if (isNaN(val)) return ''
      return (Math.round(val * 1000000) / 1000000).toFixed(num)
    },
    //数字转化为千分符形式
    parse2Thousand (num, point = 6) {
      if (isNaN(num)) return ''
      let [sInt, sFloat] = parseFloat(num)
        .toFixed(point)
        .split('.')
      sInt = sInt.replace(/\d(?=(\d{3})+$)/g, '$&,')
      return sFloat ? `${sInt}.${sFloat}` : `${sInt}`
    },
    //千分符转化为数字形式
    // parse2Num (str) {
    //   if (!str) return 0
    //   let [sInt, sFloat] = str.split('.')
    //   sInt = sInt.replace(',', '')
    //   return sFloat ? parseFloat(`${sInt}.${sFloat}`) : parseFloat(`${sInt}`)
    // },
    // parse2Num (str, flag = true) {
    //   if (!str) return flag ? 0 : str
    //   let num = String(str)
    //     .replace(/,/gi, '')
    //   return String(num)
    //     .indexOf('.') !== -1 ? parseFloat(num)
    //       .toFixed(2) : parseFloat(num)
    // },
    parse2Num (str = 0, flag = true, len = 6) {
      if (!str && str !== 0) return flag ? 0.0 : str
      let num = String(str)
        .replace(/,/gi, '')
      if (len === 2) {
        return String(num)
          .indexOf('.') !== -1
          ? parseFloat(num)
            .toFixed(len)
          : num + '.00'
      } else {
        return String(num)
          .indexOf('.') !== -1
          ? parseFloat(num)
            .toFixed(len)
          : num + '.000000'
      }
    },
    analyzeData () {
      //初始化清空默认数据
      this.yearRange = []
      this.budgetForm.costBudgetList = JSON.parse(
        JSON.stringify(this.receiveData)
      )
      this.budgetForm.costBudgetList.forEach((item) => {
        if (item.timeYear !== 'ALL') {
          this.yearRange.push(item.timeYear)
        } else {
          this.allProject = item
        }
      })
      this.budgetForm.costBudgetList.forEach(item => {
        if (item.timeYear !== 'ALL') {
          this.budgetOutsourcingSum = this.sumFloat(this.budgetOutsourcingSum, item.budgetOutsourcing) // 行委外合计-计划
          this.actualBudgetOutsourcingSum = this.sumFloat(this.actualBudgetOutsourcingSum, item.actualBudgetOutsourcing) // 实际成本-委外总和
          this.budgetInsourcingSum = this.sumFloat(this.budgetInsourcingSum, item.budgetInsourcing)
          this.actualBudgetInsourcingSum = this.sumFloat(this.actualBudgetInsourcingSum, item.actualBudgetInsourcing)
          this.staffTimeSum = this.sumFloat(this.staffTimeSum, item.staffTime)
          this.actualStaffTimeSum = this.sumFloat(this.actualStaffTimeSum, item.actualStaffTime)
          this.laborCostsSum = this.sumFloat(this.laborCostsSum, item.laborCosts)
          this.actualLaborCostsSum = this.sumFloat(this.actualLaborCostsSum, item.actualLaborCosts)
          this.travelExpensesSum = this.sumFloat(this.travelExpensesSum, item.travelExpenses)
          this.actualTravelExpensesSum = this.sumFloat(this.actualTravelExpensesSum, item.actualTravelExpenses)
          this.conferenceExpensesSum = this.sumFloat(this.conferenceExpensesSum, item.conferenceExpenses)
          this.actualConferenceExpensesSum = this.sumFloat(this.actualConferenceExpensesSum, item.actualConferenceExpenses)
          this.assetDepreciationSum = this.sumFloat(this.assetDepreciationSum, item.assetDepreciation)
          this.actualAssetDepreciationSum = this.sumFloat(this.actualAssetDepreciationSum, item.actualAssetDepreciation)
          this.otherCostsSum = this.sumFloat(this.otherCostsSum, item.otherCosts)
          this.actualOtherCostsSum = this.sumFloat(this.actualOtherCostsSum, item.actualOtherCosts)
          this.allSum = this.sumFloat(this.allSum, item.totalAmount)
          this.actualAllSum = this.sumFloat(this.actualAllSum, item.actualTotalAmount)
        }
      })
      // this.allKeys.forEach((key) => {
      //   let nullCount = 0
      //   this.yearRange.forEach((y) => {
      //     let sums = '0'
      //     this.budgetForm.costBudgetList.some((item) => {
      //       if (item.timeYear === y) {
      //         if (item[key] === null) nullCount++
      //         // this[`${key}Sum`] += item[key] //行合计
      //         let num = item[key]
      //         sums = this.sumFloat(sums, num)
      //         this[`${key}Sum`] = sums
      //         return true
      //       }
      //     })
      //   })
      //   if (nullCount === this.yearRange.length / 2) {
      //     this[`${key}Sum`] = ''
      //   } else {
      //     let sum =
      //                   key === 'staffTime'
      //                     ? this.getFixedNum(this[`${key}Sum`], 2)
      //                     : this[`${key}Sum`]
      //     this[`${key}Sum`] = sum
      //   }
      // })
      // let sums = '0'
      // this.budgetForm.costBudgetList.forEach((item) => {
      //   sums = this.sumFloat(sums, item.totalAmount)
      //   this.allKeys.forEach((key) => {
      //     if (item[key] !== null) {
      //       item[key] =
      //                       key === 'staffTime'
      //                         ? this.parse2Num(item[key], false, 2)
      //                         : item[key]
      //     } else {
      //       item[key] = ''
      //     }
      //   })
      // })
      // this.allSum = sums
      // this.actualAllKeys.forEach((key) => {
      //   let nullCount = 0
      //   this.yearRange.forEach((y) => {
      //     let sums = '0'
      //     this.budgetForm.costBudgetList.some((item) => {
      //       if (item.timeYear === y) {
      //         if (item[key] === null) nullCount++
      //         item[key] = item[key] ? item[key] : 0
      //         // this[`${key}Sum`] += item[key] //行合计
      //         let num = item[key]
      //         sums = this.sumFloat(sums, num)
      //         this[`${key}Sum`] = sums !== 0 ? sums : 0.0
      //         return true
      //       }
      //     })
      //   })
      //   if (nullCount === this.yearRange.length / 2) {
      //     this[`${key}Sum`] = ''
      //   } else {
      //     let sum =
      //                   key === 'staffTime'
      //                     ? this.getFixedNum(this[`${key}Sum`], 2)
      //                     : this[`${key}Sum`]
      //     this[`${key}Sum`] = sum
      //   }
      // })
      // let actSums = '0'
      // this.budgetForm.costBudgetList.forEach((item) => {
      //   item.actualTotalAmount = item.actualTotalAmount
      //     ? item.actualTotalAmount
      //     : 0
      //   actSums = this.sumFloat(actSums, item.actualTotalAmount)
      //   this.actualAllKeys.forEach((key) => {
      //     if (item[key] !== null) {
      //       item[key] =
      //                       key === 'staffTime'
      //                         ? this.parse2Num(item[key], false, 2)
      //                         : item[key]
      //     } else {
      //       item[key] = ''
      //     }
      //   })
      // })
      // this.actualAllSum = actSums
      // 在当前index下的index+1行复制一行数据方便模板展示信息
      this.budgetForm.costBudgetList.forEach((item, index) => {
        for (let i = 1; i <= 2; i++) {
          this.templateList.push(item)
        }
      })
    }
  },
  mounted () {
    this.getQueryCostBudgetType()
  },
  filters: {
    //过滤小数位后0
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
        return '-'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.project-budget {
    .budget-body {
        overflow-x: auto;
        // overflow-y:visible;
        width: 100%;
    }
    // th:first-child{position: fixed;left: 5px}
    .budget-con {
        min-width: 100%;
        border-collapse: collapse;
        border: 1px solid #e8e8e8;
        // position: relative;
        tr {
            th,
            td {
                height: 45px;
                padding: 0 20px;
                border-left: none;
                // border-right: none;
                border-top: 1px solid #e8e8e8;
                border-bottom: 1px solid #e8e8e8;
                border-right: 1px solid #e8e8e8;
            }
            th,
            .col-title {
                background: #f4f4f4;
                font-weight: bold;
            }
            .col-title {
                border-right: 1px solid #e8e8e8;
                width: 126px;
                min-width: 126px;
                max-width: 126px;
            }
            .year-title {
                width: 220px;
                min-width: 220px;
                max-width: 220px;
            }
            .all-w {
              min-width: 140px;
            }
             .left-b {
              border-left: 1px solid #E8E8E8;
            }
            .bg-title {
                background: #f4f4f4;
                font-weight: bold;
            }
            th:nth-child(1) {
                border-right: 1px solid #e8e8e8;
            }
            .data-cell {
                text-align: center;
            }
        }
        .none-border {
            border-right: none !important;
        }
        .sum-color {
            // color: #20A0FF;
            @include color();
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
}
.table-wrapper{
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
