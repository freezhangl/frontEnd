<template>
  <!-- 父项目-结项终止流程-预算组件-非一般支撑包 -->
  <div class="project-budget">
    <project-panel title="预算信息">
      <div class="table-wrapper">
        <div class="budget-body" @scroll="scroll">
          <table
            class="budget-con"
            border="1"
            cellpadding="0"
            cellspacing="0">
            <tr>
              <th class="col-title"></th>
              <th class="col-title"></th>
              <th colspan="3" v-for="(item, i) in yearRange" :key="i">
                <span v-if="item=== '合计'">{{item}}</span>
                <span v-else>{{item}}年度</span>
              </th>
            </tr>
            <tbody>
              <!-- <tr>
                <td class="col-title">需求单位</td>
                <td class="col-title" >科目</td>
                <td class="col-title">集团批复</td>
                <td class="col-title">计划成本</td>
                <td class="col-title">实际成本</td>
                <td class="col-title">集团批复</td>
                <td class="col-title">计划成本</td>
                <td class="col-title">实际成本</td>
                <td class="col-title">集团批复</td>
                <td class="col-title">计划成本</td>
                <td class="col-title">实际成本</td>
              </tr> -->
              <tr id="tdCol" class="col-tr"></tr>
              <tr v-for="(item, i) in colList" :key="i">
                <td class="col-title-td" v-if="item.span" :rowspan="item.span">{{item.fatherUnit}}</td>
                <td class="data-cell childUnit">
                  <div v-if="item.childUnit !== '小计'">{{item.childUnit | filterSubject}}</div>
                  <div v-if="item.childUnit === '小计'">
                    {{item.childUnit | filterSubject}}
                    <el-tooltip content="合计=“合作开发费-计划成本”+“合作开发费-集团批复”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </div>
                </td>
                <td
                  class="data-cell"
                  :style="item.childUnit === '小计' ? 'color: #0b82ff': ''"
                  v-for="(ite,index) in tdList"
                  :key="index">
                  <div v-for="(tem, idx) in item.info" :key="idx">
                    <span v-if="ite.plannedCost === '计划成本' && ite.year == tem.timeYear">{{item.info[idx].plannedCost | numTransition}}</span>
                    <span v-if="ite.groupReply === '集团批复' && ite.year == tem.timeYear">{{item.info[idx].groupReply | numTransition}}</span>
                    <span v-if="ite.actualCost === '实际成本' && ite.year == tem.timeYear">{{item.info[idx].actualCost | numTransition}}</span>
                  </div>
                </td>
              <!-- <td class="data-cell">{{item.colTotal | numTransition}}</td> -->
              </tr>
              <!-- <tr>
                <td class="data-cell">合作开发费-计划成本(万元)</td>
                <td class="data-cell">1</td>
                <td class="data-cell">2</td>
                <td class="data-cell">3</td>
                <td class="data-cell">4</td>
                <td class="data-cell">5</td>
                <td class="data-cell">6</td>
                <td class="data-cell">7</td>
                <td class="data-cell">8</td>
                <td class="data-cell">9</td>
              </tr>-->
              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                  <el-tooltip content="合计=“合作开发费-计划成本”+“合作开发费-集团批复”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </td>
                <td class="data-cell sub-bule" v-for="(item, i) in tdList" :key="i">
                  <span v-if="item.plannedCost === '计划成本'">{{item.sumplannedCost | numTransition}}</span>
                  <span v-if="item.groupReply === '集团批复'">{{item.sumgroupReply | numTransition}}</span>
                  <span v-if="item.actualCost === '实际成本'">{{item.sumactualCost | numTransition}}</span>
                </td>
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
            <tr>
              <th class="col-title"></th>
              <th class="col-title"></th>
              <th colspan="3" v-for="(item, i) in yearRange" :key="i">
                <span v-if="item=== '合计'">{{item}}</span>
                <span v-else>{{item}}年度</span>
              </th>
            </tr>
            <tbody>
              <tr id="tdCol-fixed" class="col-tr"></tr>
              <tr v-for="(item, i) in colList" :key="i">
                <td class="col-title-td" v-if="item.span" :rowspan="item.span">{{item.fatherUnit}}</td>
                <td class="data-cell childUnit">
                  <div v-if="item.childUnit !== '小计'">{{item.childUnit | filterSubject}}</div>
                  <div v-if="item.childUnit === '小计'">
                    {{item.childUnit | filterSubject}}
                    <el-tooltip content="合计=“合作开发费-计划成本”+“合作开发费-集团批复”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </div>
                </td>
                <td
                  class="data-cell"
                  :style="item.childUnit === '小计' ? 'color: #0b82ff': ''"
                  v-for="(ite,index) in tdList"
                  :key="index">
                </td>
              </tr>
              <tr>
                <td colspan="2" align="center" class="col-title">
                  合计
                  <el-tooltip content="合计=“合作开发费-计划成本”+“合作开发费-集团批复”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </td>
                <td class="data-cell sub-bule" v-for="(item, i) in tdList" :key="i">
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
export default {
  components: { projectPanel },
  data () {
    return {
      loding: false,
      yearRange: [], // 年份-遍历th
      tdList: [], // 用来进行tbody中的td遍历以及列合计
      costBudgetList: [
        // {
        //   fatherUnit: '技术部',
        //   unitInfo: [
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '合作开发费-委外(万元)', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '合作开发费-委内(万元)', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '自有人工（人月）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '自有人工成本（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '差旅费（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '会议费（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '资产折旧/摊销（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '其他成本（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '技术部', // 父单位
        //       childUnit: '小计', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   fatherUnit: '网络部',
        //   unitInfo: [
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '合作开发费-委外(万元)', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '32.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '32.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '合作开发费-委内(万元)', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '32.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '自有人工（人月）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '自有人工成本（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '差旅费（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '会议费（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '资产折旧/摊销（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '其他成本（万元）', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     },
        //     {
        //       fatherUnit: '网络部', // 父单位
        //       childUnit: '小计', // 子单位
        //       info: [
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2020'
        //         },
        //         {
        //           groupReply: '123.00', // 集团批复
        //           plannedCost: '321.00', // 计划成本
        //           actualCost: '321.00', // 实际成本
        //           timeYear: '2021'
        //         }
        //       ]
        //     }
        //   ]
        // }
      ],
      colList: [], // 用来进行tab行遍历
      fatherUnitList: [], // 用来控制tbody列的rowspan以及显示
      allSum: null, // 总合计
      projectCode: null,
      versionNo: null,
      hideShadow: true //滚动到最左边时不显示阴影
    }
  },
  props: {
    budgetInfo: {}
  },
  watch: {
    budgetInfo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.projectCode = this.budgetInfo.projectCode
          this.versionNo = this.budgetInfo.versionNo
          this.tdList = []
          this.costBudgetList = []
          this.colList = []
          this.fatherUnitList = []
          this.getCostBudgetList()
        }
      }
    }
  },
  methods: {
    // 获取项目预算信息
    getCostBudgetList () {
      let params = {
        projectCode: this.projectCode,
        versionNo: this.versionNo // 查询指定版本的时候需要传的参数
      }
      API.queryProjectCostByVersion(params)
        .then(res => {
          if (res && res.yearList && res.yearList.length > 0) {
            this.yearRange = res.yearList
            this.yearRange.push('合计')
          }
          if (res && res.projectCostList && res.projectCostList.length > 0) {
            this.costBudgetList = res.projectCostList
            this.addEmptyYearData(this.costBudgetList)
            setTimeout(() => {
              this.createHead()
              this.getcolList()
              this.getTdList()
            }, 100)
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
    },
    //从计划同步的数据可能缺少某些年份的数据
    addEmptyYearData (coatBudget = []) {
      coatBudget.forEach(item => {
        item.unitInfo = item.unitInfo || []
        item.unitInfo.forEach(item1 => {
          item1.info = item1.info || []
          this.yearRange.forEach(y => {
            if (y === '合计') return
            let hasThisYear = item1.info.some(i => parseInt(i.timeYear) === y)
            if (!hasThisYear) {
              item1.info.push({ timeYear: String(y) }) //若返回的预算中没有某年度的预算信息，则需要添加此年
            }
          })
        })
      })
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
    // 创建表头
    createHead () {
      // 获取表头dom
      let dom = document.getElementById('tdCol')
      let domFixed = document.getElementById('tdCol-fixed')
      let strHead = '<td style="background: #F4F4F4;text-align: center;border: 1px solid #E8E8E8;">需求单位</td><td style="background: #F4F4F4;text-align: center;border: 1px solid #E8E8E8;">科目</td>'
      let str = ''
      this.yearRange.forEach(item => {
        str = str + '<td style="background: #F4F4F4;text-align: center;border: 1px solid #E8E8E8;min-width: 70px;">集团批复</td><td style="background: #F4F4F4;text-align: center;border: 1px solid #E8E8E8;min-width: 70px;">计划成本</td><td style="background: #F4F4F4;text-align: center;border: 1px solid #E8E8E8;min-width: 70px;">实际成本</td>'
      })
      str = strHead + str
      dom.innerHTML = str
      domFixed.innerHTML = str
    },
    // 提取colList
    getcolList () {
      this.costBudgetList.forEach(item => {
        item.unitInfo.forEach(item => {
          this.colList.push(item)
        })
      })
      this.getFatherUnitList()
      this.additional()
      this.getColTotal()
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
        let groupReply = {
          groupReply: '集团批复',
          year: item
        }
        this.tdList.push(groupReply)
        let plannedCost = {
          plannedCost: '计划成本',
          year: item
        }
        this.tdList.push(plannedCost)
        let actualCost = {
          actualCost: '实际成本',
          year: item
        }
        this.tdList.push(actualCost)
      })
      this.getRowTotal()
    },
    // 计算行合计并将合计信息追加到colList的info对象中
    getColTotal () {
      this.colList.forEach(item => {
        let obj = {
          plannedCost: '0',
          groupReply: '0',
          actualCost: '0',
          timeYear: '合计'
        }
        let plannedCostNullNum = 0
        let groupReplyNullNum = 0
        let actualCostNullNum = 0
        item.info.forEach(ite => {
          plannedCostNullNum = (ite.plannedCost === undefined || ite.plannedCost === null) ? ++plannedCostNullNum : plannedCostNullNum
          groupReplyNullNum = (ite.groupReply === undefined || ite.groupReply === null) ? ++groupReplyNullNum : groupReplyNullNum
          actualCostNullNum = (ite.actualCost === undefined || ite.actualCost === null) ? ++actualCostNullNum : actualCostNullNum
          obj.plannedCost = this.sumFloat(obj.plannedCost, ite.plannedCost)
          obj.groupReply = this.sumFloat(obj.groupReply, ite.groupReply)
          obj.actualCost = this.sumFloat(obj.actualCost, ite.actualCost)
        })
        if (plannedCostNullNum === item.info.length) obj.plannedCost = undefined
        if (groupReplyNullNum === item.info.length) obj.groupReply = undefined
        if (actualCostNullNum === item.info.length) obj.actualCost = undefined
        item.info.push(obj)
      })
    },
    // 计算列合计并将结果追加到rowList数组中
    getRowTotal () {
      this.tdList.forEach(item => {
        let sumplannedCost = '0'
        let sumgroupReply = '0'
        let sumactualCost = '0'
        let plannedCostNum = { nullNum: 0, allNum: 0 }
        let groupReplyNum = { nullNum: 0, allNum: 0 }
        let actualCostNum = { nullNum: 0, allNum: 0 }
        this.colList.forEach(ite => {
          if (ite.childUnit === '小计') {
            ite.info.forEach(ele => {
              if (String(item.year) === ele.timeYear) {
                plannedCostNum.allNum++
                if (ele.plannedCost === undefined || ele.plannedCost === null) {
                  plannedCostNum.nullNum++
                }
                sumplannedCost = this.sumFloat(sumplannedCost, ele.plannedCost)
              }
              if (String(item.year) === ele.timeYear) {
                groupReplyNum.allNum++
                if (ele.groupReply === undefined || ele.groupReply === null) {
                  groupReplyNum.nullNum++
                }
                sumgroupReply = this.sumFloat(sumgroupReply, ele.groupReply)
              }
              if (String(item.year) === ele.timeYear) {
                actualCostNum.allNum++
                if (ele.actualCost === undefined || ele.actualCost === null) {
                  actualCostNum.nullNum++
                }
                sumactualCost = this.sumFloat(sumactualCost, ele.actualCost)
              }
            })
          }
        })
        if (item.plannedCost === '计划成本') {
          item.sumplannedCost = plannedCostNum.nullNum === plannedCostNum.allNum ? undefined : sumplannedCost
        }
        if (item.groupReply === '集团批复') {
          item.sumgroupReply = groupReplyNum.nullNum === groupReplyNum.allNum ? undefined : sumgroupReply
        }
        if (item.actualCost === '实际成本') {
          item.sumactualCost = actualCostNum.nullNum === actualCostNum.allNum ? undefined : sumactualCost
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
    // this.createHead()
    // this.getcolList()
    // this.getTdList()
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
    },
    // 过滤科目
    filterSubject (val) {
      switch (val) {
        case 'BUDGET_OUTSOURCING':
          return '合作开发费-委外（万元）'
        case 'BUDGET_INSOURCING':
          return '合作开发费-委内（万元）'
        case 'BUDGET_STAFF_TIME':
          return '自有人工（人月）'
        case 'BUDGET_LABOR_COSTS':
          return '自有人工成本（万元）'
        case 'BUDGET_TRAVEL_EXPENSES':
          return '差旅费（万元）'
        case 'BUDGET_CONFERENCE_EXPENSES':
          return '会议费（万元）'
        case 'BUDGET_ASSET_DEPRECIATION':
          return '资产折旧/摊销（万元）'
        case 'BUDGET_OTHER_COSTS':
          return '其他成本（万元）'
        case '小计':
          return '小计'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.project-budget{
    .budget-body{
        overflow-x: auto;

    .tabIndex {
      font-size: 18px;
      text-align: center;
      padding-bottom: 16px;
      font-weight: bold;
    }

    .col-tr {
      height: 45px;
      padding: 0 20px;
      font-weight: bold;
    }
  }
  .budget-con{
    min-width: 100%;
    border-collapse: collapse;
    border: 1px solid #E8E8E8;
    .el-icon-info{
      @include color();
    }
    tr {
      th,td{
        height: 45px;
        padding: 0 20px;
        border: 1px solid #E8E8E8;
        border-color: #E8E8E8 !important;
      }
      th,.col-title{
        background: #F4F4F4;
        font-weight: bold;
        text-align: center;
      }
      .col-title{
        // border-right: 1px solid #E8E8E8;
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
      // th:nth-child(1){
      //   // border-right: 1px solid #E8E8E8;
      // }
      .data-cell{
        text-align: center;
      }
      .childUnit {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        width: 160px !important;
        min-width: 160px !important;
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
    color: #0b82ff !important;
  }

  .table-wrapper{
    position: relative;
    overflow: hidden;
    .fixed-table{
      position: absolute;
      top: 0;
      left: 0;
      width: 318px; /** (76+20*2)+(160+20*2)+2 */
      overflow-x: hidden;
      overflow-y: hidden;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.12);
      &.hideShadow{
        box-shadow: none;
      }
      .col-tr {
        height: 45px;
        padding: 0 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
