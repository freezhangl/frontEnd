<template>
  <!-- 父项目-预算组件-非一般支撑包 -->
  <div class="project-budget">
    <project-panel
      title="预算信息"
      :show-expand="showExpand"
      :tips="tips"
      :tip-language="language">
      <div class="switch">
        <div
          v-for="item in tableList"
          :key="item.key"
          @click="checkTh(item)"
          :class="item === tabIndex ? 'tab-checked': ''">
          <span v-if="item === 0">需求单位视角</span>
          <span v-if="item === 1">承担单位视角</span>
        </div>
      </div>
      <div class="table-wrapper">
        <div class="budget-body" @scroll="scroll">
          <table
            class="budget-con"
            border="1"
            cellpadding="0"
            cellspacing="0">
            <tr id="thead">
              <th rowspan="3" class="col-title" v-if="tabIndex === 0">需求单位</th>
              <th rowspan="3" class="col-title" v-if="tabIndex === 0">承担单位</th>
              <th rowspan="3" class="col-title" v-if="tabIndex === 1">承担单位</th>
              <th rowspan="3" class="col-title" v-if="tabIndex === 1">需求单位</th>
              <th colspan="4" v-for="(item, i) in yearRange" :key="i">{{item}}年度</th>
              <th rowspan="3" class="summation">合计(万元)</th>
            </tr>
            <tr>
              <th
                v-for="(item,index) in newHead1"
                :key="index"
                :style="`height:45px;padding: 0 20px;background: #F4F4F4;width:${item.width}px;min-width: ${item.width}px;`"
                :colspan="item.colspan"
                :rowspan="item.rowspan">
                {{item.text}}
                <el-tooltip v-if="item.showTooltip" content="注:年度小计=合作开发费-委内+合作开发费-委外 + 自有人工（人月）* 单位人力成本" placement="top">
                  <i class="sub-bule el-icon-info">
                  </i>
                </el-tooltip>
              </th>
            </tr>
            <tr>
              <th v-for="(item,index) in newHead2" :key="index" style="min-width:30px;height:45px;padding: 0 20px;background: #F4F4F4;">
                {{item.text}}
              </th>
            </tr>
            <!-- 补全表头 -->
            <!-- <tr>
                <th colspan="2">合作开发费(万元)</th>
                <th class="own" rowspan="2">自有人工(人月)</th>
                <th class="colSubtotal" rowspan="2">小计(万元)</th>
                <th colspan="2">合作开发费(万元)</th>
                <th class="own" rowspan="2">自有人工(人月)</th>
                <th class="colSubtotal" rowspan="2">小计(万元)</th>
              </tr> -->
            <!-- <tr>
                <th class="col-title-th">委内</th>
                <th class="col-title-th">委外</th>
                <th class="col-title-th">委内</th>
                <th class="col-title-th">委外</th>
              </tr> -->
            <tbody>
              <tr v-for="(item, i) in colList" :key="i">
                <td :class="{'highlightStyle':item.highlightProps && item.highlightProps.fatherUnit}" v-if="item.span" :rowspan="item.span">{{item.fatherUnit}}</td>
                <td :class="{'highlightStyle':item.highlightProps && item.highlightProps.childUnit}">{{item.childUnit}}</td>
                <td
                  :class="item.childUnit === '小计' ? 'data-cell sub-bule': 'data-cell'"
                  v-for="(ite,index) in tdList"
                  :key="index">
                  <div v-for="(tem, idx) in item.info" :key="idx">
                    <span :class="{'highlightStyle':item.info[idx].highlightProps && item.info[idx].highlightProps.budgetInsourcing}" v-if="ite.budgetInsourcing === '委内' && ite.year == tem.timeYear">{{item.info[idx].budgetInsourcing | numTransition}}</span>
                    <span :class="{'highlightStyle':item.info[idx].highlightProps && item.info[idx].highlightProps.budgetOutsourcing}" v-if="ite.budgetOutsourcing === '委外' && ite.year == tem.timeYear">{{item.info[idx].budgetOutsourcing | numTransition}}</span>
                    <span :class="{'highlightStyle':item.info[idx].highlightProps && item.info[idx].highlightProps.staffTime}" v-if="ite.staffTime === '自有人工' && ite.year == tem.timeYear">{{item.info[idx].staffTime | numTransition}}</span>
                    <span :class="{'highlightStyle':item.info[idx].highlightProps && item.info[idx].highlightProps.subtotal}" class="sub-bule" v-if="ite.subtotal === '小计' && ite.year == tem.timeYear">{{item.info[idx].subtotal | numTransition}}</span>
                  </div>
                </td>
                <td class="data-cell sub-bule"><span :class="{'highlightStyle':item.highlightProps && item.highlightProps.colTotal}">{{item.colTotal | numTransition}}</span></td>
              </tr>
              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                <!-- <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                    <i class="el-icon-info"></i>
                  </el-tooltip> -->
                </td>
                <td class="data-cell sub-bule" v-for="(item, i) in tdList" :key="i">
                  <span :class="{'highlightStyle':item.highlightProps && item.highlightProps.sumBudgetInsourcing}" v-if="item.budgetInsourcing === '委内'">{{item.sumBudgetInsourcing | numTransition}}</span>
                  <span :class="{'highlightStyle':item.highlightProps && item.highlightProps.sumBudgetOutsourcing}" v-if="item.budgetOutsourcing === '委外'">{{item.sumBudgetOutsourcing | numTransition}}</span>
                  <span :class="{'highlightStyle':item.highlightProps && item.highlightProps.sumStaffTime}" v-if="item.staffTime === '自有人工'">{{item.sumStaffTime | numTransition}}</span>
                  <span :class="{'highlightStyle':item.highlightProps && item.highlightProps.sumSubtotal}" v-if="item.subtotal === '小计'">{{item.sumSubtotal | numTransition}}</span>
                </td>
                <td class="data-cell sub-bule"><span :class="{'highlightStyle':allSumHighlight}">{{allSum | numTransition}}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="fixed-table" :class="{'hideShadow':hideShadow}">
          <table
            class="budget-con"
            border="1"
            cellpadding="0"
            cellspacing="0">
            <tr id="thead">
              <th rowspan="3" class="col-title" v-if="tabIndex === 0">需求单位</th>
              <th rowspan="3" class="col-title" v-if="tabIndex === 0">承担单位</th>
              <th rowspan="3" class="col-title" v-if="tabIndex === 1">承担单位</th>
              <th rowspan="3" class="col-title" v-if="tabIndex === 1">需求单位</th>
              <th colspan="4" v-for="(item, i) in yearRange" :key="i">{{item}}年度</th>
              <th rowspan="3" class="summation">合计(万元)</th>
            </tr>
            <tr>
              <th
                v-for="(item,index) in newHead1"
                :key="index"
                :style="`height:45px;padding: 0 20px;background: #F4F4F4;width:${item.width}px;min-width: ${item.width}px;`"
                :colspan="item.colspan"
                :rowspan="item.rowspan">
                {{item.text}}
                <el-tooltip v-if="item.showTooltip" content="注:年度小计=合作开发费-委内+合作开发费-委外 + 自有人工（人月）* 单位人力成本" placement="top">
                  <i class="sub-bule el-icon-info">
                  </i>
                </el-tooltip>
              </th>
            </tr>
            <tr>
              <th v-for="(item,index) in newHead2" :key="index" style="min-width:30px;height:45px;padding: 0 20px;background: #F4F4F4;">
                {{item.text}}
              </th>
            </tr>
            <tbody>
              <tr v-for="(item, i) in colList" :key="i">
                <td :class="{'highlightStyle':item.highlightProps && item.highlightProps.fatherUnit}" v-if="item.span" :rowspan="item.span">{{item.fatherUnit}}</td>
                <td :class="{'highlightStyle':item.highlightProps && item.highlightProps.childUnit}">{{item.childUnit}}</td>
              </tr>
              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计(万元)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_groupPlanProject'
import { addNum, deleteZero } from '@/utils/numberAdd'
import bus from '@/common/bus'
export default {
  components: { projectPanel },
  data () {
    return {
      yearRange: [], // 年份-遍历th
      tabIndex: 0, // 当前选中的tab
      tableList: [0, 1], // 用来判断当前选中的tab
      tdList: [], // 用来进行tbody中的td遍历以及列合计
      costBudgetList: [],
      colList: [], // 用来进行tab行遍历
      fatherUnitList: [], // 用来控制tbody列的rowspan以及显示
      allSum: null, // 总合计
      allSumHighlight: false, // 总合计
      newHead1: [],
      newHead2: [],
      sumHighlight: null, //对比页面的最后一行高亮对象
      language: '预算信息中没有基线字段；',
      hideShadow: true //滚动到最左边时不显示阴影
    }
  },
  props: {
    budgetInfo: {},
    demandBudgetInfo: {},
    undertakeBudgetInfo: {},
    versionNo: { type: String, default: '' },
    projectCode: { type: String, default: '' },
    showExpand: {
      type: Boolean,
      default: true
    },
    tips: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    versionNo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.checkTh(0, false)
          this.getBugetInfo('1', true)
        }
      }
    },
    demandBudgetInfo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.getBugetInfo('1', true)
        }
      }
    },
    undertakeBudgetInfo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          // this.undertakeBudgetInfo = newValue
        }
      }
    }
  },
  methods: {
    getBugetInfo (viewType = '1', createdHead = false) {
      if ((viewType === '1' || viewType === 1) && this.demandBudgetInfo) { // 需求单位
        this.colList = []
        this.fatherUnitList = []
        this.tdList = []
        this.yearRange = this.demandBudgetInfo.yearList || []
        this.costBudgetList = this.demandBudgetInfo.coatBudget || []
        this.sumHighlight = this.demandBudgetInfo.highlightProps || []
        this.addEmptyYearData(this.costBudgetList)
        if (createdHead) {
          this.createHead() //初始化时调用
        }
        this.getcolList()
        this.getTdList()
        this.$emit('rendered', createdHead)
      } else if ((viewType === '2' || viewType === 2) && this.undertakeBudgetInfo) { // 承担单位
        this.colList = []
        this.fatherUnitList = []
        this.tdList = []
        this.yearRange = this.undertakeBudgetInfo.yearList || []
        this.costBudgetList = this.undertakeBudgetInfo.coatBudget || []
        this.addEmptyYearData(this.costBudgetList)
        if (createdHead) {
          this.createHead() //初始化时调用
        }
        this.getcolList()
        this.getTdList()
        this.$emit('rendered', createdHead)
      } else {
        let params = {
          projectCode: this.$route.params.projectCode || this.$route.query.projectCode || this.projectCode, //'R20201EX'
          versionNo: this.versionNo, //'0000003542135431437534534'
          type: viewType //1：需求单位视角，2承担单位视角
        }
        if (!this.versionNo) {
          return
        }
        API.queryProjectBudgetByVersionD(params)
          .then(res => {
            if (res) {
              this.colList = []
              this.fatherUnitList = []
              this.tdList = []
              this.yearRange = res.yearList || []
              this.costBudgetList = res.coatBudget || []
              if (this.costBudgetList.length) {
                this.costBudgetList.forEach(item => {
                  let subtotal = []
                  item.unitInfo.forEach(ite => {
                    if (ite.childUnit !== '小计') {
                      ite.info.forEach((it, index) => {
                        if (subtotal[index] && subtotal[index].timeYear === it.timeYear) {
                          subtotal[index].budgetInsourcing = addNum(subtotal[index].budgetInsourcing, it.budgetInsourcing)
                          subtotal[index].staffTime = addNum(subtotal[index].staffTime, it.staffTime)
                          subtotal[index].subtotal = addNum(subtotal[index].subtotal, it.subtotal)
                          subtotal[index].budgetOutsourcing = addNum(subtotal[index].budgetOutsourcing, it.budgetOutsourcing)
                        } else {
                          if (subtotal[index]) {
                            subtotal.forEach(i => {
                              if (it.timeYear === i.timeYear) {
                                i.budgetInsourcing = addNum(i.budgetInsourcing, it.budgetInsourcing)
                                i.staffTime = addNum(i.staffTime, it.staffTime)
                                i.subtotal = addNum(i.subtotal, it.subtotal)
                                i.budgetOutsourcing = addNum(i.budgetOutsourcing, it.budgetOutsourcing)
                              }
                            })
                          } else {
                            subtotal.push({ timeYear: it.timeYear })
                            subtotal[index].budgetInsourcing = it.budgetInsourcing
                            subtotal[index].staffTime = it.staffTime
                            subtotal[index].subtotal = it.subtotal
                            subtotal[index].budgetOutsourcing = it.budgetOutsourcing
                          }
                        }
                      })
                    } else if (ite.childUnit === '小计') {
                      ite.info = subtotal
                    }
                  })
                })
              }
              this.addEmptyYearData(this.costBudgetList)
              if (createdHead) {
                this.createHead() //初始化时调用
              }
              this.getcolList()
              this.getTdList()
              this.$emit('rendered', createdHead)
            }
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
      }
    },
    //从计划同步的数据可能缺少某些年份的数据
    addEmptyYearData (coatBudget = []) {
      coatBudget.forEach(item => {
        item.unitInfo = item.unitInfo || []
        item.unitInfo.forEach(item1 => {
          item1.info = item1.info || []
          this.yearRange.forEach(y => {
            let hasThisYear = item1.info.some(i => parseInt(i.timeYear) === y)
            if (!hasThisYear) {
              item1.info.push({ timeYear: String(y) }) //若返回的预算中没有某年度的预算信息，则需要添加此年
            }
          })
        })
      })
    },
    sumFloat (num1, num2, prop) {
      let int1 = num1 ? num1.split('.')[0] || 0 : 0
      let int2 = num2 ? num2.split('.')[0] || 0 : 0
      let decimal1 = num1 ? num1.split('.')[1] || 0 : 0
      let decimal2 = num2 ? num2.split('.')[1] || 0 : 0
      //整数与整数相加，2+5=7
      let int = parseInt(int1) + parseInt(int2)
      let decimalLen = prop === 'staffTime' ? 2 : 6
      //小数位相加，再除以倍数，991+999=1990 1990/1000000=0.001990
      // let decimal = (parseInt(decimal1) + parseInt(decimal2)) / Math.pow(10, decimalLen)
      let decimal = (parseFloat('0.' + decimal1) * Math.pow(10, decimalLen) + parseFloat('0.' + decimal2) * Math.pow(10, decimalLen)) / Math.pow(10, decimalLen)
      //获取小数位相加之和补全位数，0.00199 --> 0.001990
      let newDecimal = this.getFixedNumNew(decimal + '', decimalLen)
      //整数位相加的结果再与小数位相加结果的整数位相加，小数与小数相加,7.001990，如：1+1.25 --> 2+0.25
      let sum = (int + parseInt(newDecimal.split('.')[0])) + '.' + newDecimal.split('.')[1]
      return sum
    },
    //补齐小数位,val --> string
    getFixedNumNew (val, len = 6) {
      let str = ''
      let splitArr = val.split('.')
      if (splitArr.length > 1 && splitArr[1] !== '') {
        str = parseInt(splitArr[0]) + '.'
        if (splitArr[1].length < len) {
          str = str + splitArr[1] + this.getDecimal(len - splitArr[1].length)
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
    // 选择当前年度
    checkTh (val, flag = true) {
      this.tabIndex = val
      if (flag) {
        this.getBugetInfo(this.tabIndex + 1, true)
      }
    },
    // 创建表头
    createHead () {
      this.newHead1 = []
      this.newHead2 = []
      this.yearRange.forEach(item => {
        let col1 = {
          colspan: 2,
          text: '合作开发费(万元)'
        }
        let col2 = {
          rowspan: 2,
          text: '自有人工(人月)',
          width: 75
        }
        let col3 = {
          rowspan: 2,
          text: '小计(万元)',
          width: 45,
          showTooltip: true
        }
        this.newHead1.push(col1)
        this.newHead1.push(col2)
        this.newHead1.push(col3)
      })
      this.yearRange.forEach(item => {
        let col1 = { text: '委内' }
        let col2 = { text: '委外' }
        this.newHead2.push(col1)
        this.newHead2.push(col2)
      })
    },
    // 提取colList
    getcolList () {
      this.costBudgetList.forEach(item => {
        item.unitInfo.forEach(item1 => {
          item1.highlightProps = item1.highlightProps || {}
          if (item.highlightProps) {
            Object.assign(item1.highlightProps, item.highlightProps)
          }
          this.colList.push(item1)
        })
      })
      this.getFatherUnitList()
      this.additional()
      this.getColTotal()
      this.getAllSum()
    },
    // 提取fatherUnitList用来控制列的rowspan以及显示
    getFatherUnitList () {
      this.costBudgetList.forEach(item => {
        let span = item.unitInfo.length
        let obj = {
          rowSpan: span,
          unit: item.fatherUnit
        }
        this.fatherUnitList.push(obj)
      })
    },
    // 向colList追加标识
    additional () {
      this.fatherUnitList.forEach((item, index) => {
        let arr = []
        this.colList.forEach((ite, idx) => {
          if (item.unit === ite.fatherUnit) {
            arr.push(ite)
          }
        })
        arr[0].span = item.rowSpan
      })
    },
    // 生成tdList-用来tbody遍历生成行td
    getTdList () {
      this.yearRange.forEach(item => {
        let budgetInsourcing = {
          budgetInsourcing: '委内',
          year: item
        }
        this.tdList.push(budgetInsourcing)
        let budgetOutsourcing = {
          budgetOutsourcing: '委外',
          year: item
        }
        this.tdList.push(budgetOutsourcing)
        let staffTime = {
          staffTime: '自有人工',
          year: item
        }
        this.tdList.push(staffTime)
        let subtotal = {
          subtotal: '小计',
          year: item
        }
        this.tdList.push(subtotal)
      })
      this.getRowTotal()
    },
    // 计算行合计并将合计信息追加到colList中
    getColTotal () {
      this.colList.forEach(item => {
        let sum = '0'
        let nullNum = 0
        item.info.forEach(ite => {
          if (ite.subtotal === undefined || ite.subtotal === null) nullNum++
          sum = this.sumFloat(sum, ite.subtotal)
        })
        item.colTotal = nullNum === item.info.length ? undefined : sum
      })
    },
    // 计算列合计并将结果追加到rowList数组中
    getRowTotal () {
      this.tdList.forEach(item => {
        let sumBudgetInsourcing = '0'
        let sumBudgetOutsourcing = '0'
        let sumStaffTime = '0'
        let sumSubtotal = '0'
        let budgetInsourcingNum = { nullNum: 0, allNum: 0 }
        let budgetOutsourcingNum = { nullNum: 0, allNum: 0 }
        let staffTimeNum = { nullNum: 0, allNum: 0 }
        let subtotalNum = { nullNum: 0, allNum: 0 }
        item.highlightProps = {}
        this.colList.forEach(ite => {
          ite.info.forEach(ele => {
            if (String(item.year) === ele.timeYear && ite.childUnit === '小计') {
              budgetInsourcingNum.allNum++
              if (ele.budgetInsourcing === undefined || ele.budgetInsourcing === null) {
                budgetInsourcingNum.nullNum++
              }
              sumBudgetInsourcing = this.sumFloat(sumBudgetInsourcing, ele.budgetInsourcing)
            }
            if (String(item.year) === ele.timeYear && ite.childUnit === '小计') {
              budgetOutsourcingNum.allNum++
              if (ele.budgetOutsourcing === undefined || ele.budgetOutsourcing === null) {
                budgetOutsourcingNum.nullNum++
              }
              sumBudgetOutsourcing = this.sumFloat(sumBudgetOutsourcing, ele.budgetOutsourcing)
            }
            if (String(item.year) === ele.timeYear && ite.childUnit === '小计') {
              staffTimeNum.allNum++
              if (ele.staffTime === undefined || ele.staffTime === null) {
                staffTimeNum.nullNum++
              }
              sumStaffTime = this.sumFloat(sumStaffTime, ele.staffTime)
            }
            if (String(item.year) === ele.timeYear && ite.childUnit === '小计') {
              subtotalNum.allNum++
              if (ele.subtotal === undefined || ele.subtotal === null) {
                subtotalNum.nullNum++
              }
              sumSubtotal = this.sumFloat(sumSubtotal, ele.subtotal)
            }
          })
        })
        if (item.budgetInsourcing === '委内') {
          item.sumBudgetInsourcing = budgetInsourcingNum.nullNum === budgetInsourcingNum.allNum ? undefined : sumBudgetInsourcing
          if (this.sumHighlight && this.sumHighlight[`${item.year}`]) {
            item.highlightProps['sumBudgetInsourcing'] = this.sumHighlight[`${item.year}`].sumBudgetInsourcing
          }
        }
        if (item.budgetOutsourcing === '委外') {
          item.sumBudgetOutsourcing = budgetOutsourcingNum.nullNum === budgetOutsourcingNum.allNum ? undefined : sumBudgetOutsourcing
          if (this.sumHighlight && this.sumHighlight[`${item.year}`]) {
            item.highlightProps['sumBudgetOutsourcing'] = this.sumHighlight[`${item.year}`].sumBudgetOutsourcing
          }
        }
        if (item.staffTime === '自有人工') {
          item.sumStaffTime = staffTimeNum.nullNum === staffTimeNum.allNum ? undefined : sumStaffTime
          if (this.sumHighlight && this.sumHighlight[`${item.year}`]) {
            item.highlightProps['sumStaffTime'] = this.sumHighlight[`${item.year}`].sumStaffTime
          }
          // item.sumStaffTime = '0'
        }
        if (item.subtotal === '小计') {
          item.sumSubtotal = subtotalNum.nullNum === subtotalNum.allNum ? undefined : sumSubtotal
          if (this.sumHighlight && this.sumHighlight[`${item.year}`]) {
            item.highlightProps['sumSubtotal'] = this.sumHighlight[`${item.year}`].sumSubtotal
          }
        }
      })
    },
    // 计算总合计
    getAllSum () {
      let sum = '0'
      let nullNum = 0
      let allNum = 0
      this.colList.forEach(item => {
        if (item.childUnit === '小计') {
          allNum++
          if (item.colTotal === undefined || item.colTotal === null) nullNum++
          sum = this.sumFloat(sum, item.colTotal)
        }
        if (item.highlightProps !== null && item.highlightProps !== undefined && item.highlightProps.colTotal !== null && item.highlightProps.colTotal !== undefined) {
          if (item.highlightProps.colTotal) {
            this.allSumHighlight = true
          }
        }
      })
      this.allSum = nullNum === allNum ? undefined : sum
    },
    acceptPlanTimeChange () {
      bus.$off('planTimeChange')
      bus.$on('planTimeChange', (e) => {
        this.getBugetInfo(this.tabIndex, true)
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
    this.checkTh(0, false)
    this.acceptPlanTimeChange()
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
  .project-budget{
    .switch {
      display: flex;
      user-select: none;
      padding: 8px 0;
      margin-bottom: 12px;
      div {
        width: 98px;
        padding: 6px 0;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        border: 1px solid #E8E8E8;
        cursor: pointer;
      }
      div:nth-child(1) {
        border-right: none;
      }
      .tab-checked {
        @include background-color();
        color: #fff;
      }
    }
    .budget-body{
      overflow-x: auto;

      .tabIndex {
        font-size: 18px;
        text-align: center;
        padding-bottom: 16px;
        font-weight: bold;
      }
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
      td,th {
        border-bottom:1px solid #E8E8E8;;
        border-right:1px solid #E8E8E8;;
      }
      tr > td:first-child, tr > td:first-child {
        border-left: 1px solid #E8E8E8;;
      }
      tr:first-child td, tr:first-child td {
        border-top: 1px solid #E8E8E8;;
      }
    }
    .budget-con{
      min-width: 100%;
      border-spacing: 0;
      border-collapse: collapse;
      border: 1px solid #E8E8E8;
      tr {
        th,td{
          height: 45px;
          padding: 0 20px;
          border-left: none;
          border-color: #E8E8E8 !important;
        }
        th,.col-title{
          background: #F4F4F4;
          font-weight: bold;
        }
        .col-title{
          border-right: 1px solid #E8E8E8;
          width: 72px;
          min-width: 72px;
        }
        .col-title-th {
          width: 80px;
        }
        .col-title-td {
          width: 76px;
          min-width: 76px;
        }
        th:nth-child(1){
          border-right: 1px solid #E8E8E8;
        }
        .data-cell{
          text-align: center;
        }
        .summation{
          min-width: 40px;
        }
        // td:nth-last-child(2){
        //   @include color($color-blue);
        // }
        // &:nth-last-child(1){
        //   @include color($color-blue);
        //   font-weight: bold;
        // }
      }
      .required span{
        position: relative;
        &::before{
          color: red;
          content: '*';
          position: absolute;
          left: -10px;
          top: 0px;
        }
      }
    }

    .head {
      min-width: 100px;
    }

    margin-top: 20px;

    .red-text {
      color: red !important;
    }

    .el-form-item {
      margin: 8px 0 !important;
    }

    .sub-bule {
      @include color();
    }

    .highlightStyle{
      color: #FF3F3B !important;
    }

    .table-wrapper{
      position: relative;
      overflow: hidden;
      .fixed-table{
        position: absolute;
        top: 0;
        left: 0;
        width: 226px; /** (72+20*2)*2+2 */
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
