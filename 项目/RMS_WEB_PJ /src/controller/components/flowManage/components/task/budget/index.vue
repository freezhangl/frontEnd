<template>
  <div class="project-budget">
    <project-panel title="预算信息(单位:万元)" tip='提示:任务申请汇总金额不得超过研发包总金额'>
      <!-- <template v-slot:header>
        <el-button class="normal-btn" @click="tempSave">暂存</el-button>
      </template> -->
      <div class="budget-body">
        <el-form
          ref="budgetForm"
          :model="budgetForm"
          :rules="rules"
          :inline="true"
          :show-message="false">
          <table
            class="budget-con"
            border="1"
            cellpadding="0"
            cellspacing="0">
            <tr>
              <th colspan="2" class="col-title"></th>
              <th v-for="(item,index) in yearRange" :key="index">
                {{item}}
              </th>
              <!-- <th>合计</th> -->
            </tr>

            <tr>
              <td rowspan="2" class="col-title">合作开发费</td>
              <td class="required col-title"><span>委外(万元)</span></td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :rules="setRules('budgetOutsourcing',index)" prop="budgetOutsourcing" :class="isRowError.budgetOutsourcing ? 'is-error' : ''">
                  <el-input
                    v-if="item=='本次申请预算'"
                    v-model="budgetForm.costBudgetList[index].budgetOutsourcing"
                    placeholder="请输入金额"
                    @input="inputHandler('budgetOutsourcing',index)"
                    @change="computeSum('budgetOutsourcing',index)"></el-input>
                  <span v-else :class="{'red-text':getRowHighlightStyle('budgetOutsourcing', index)}">{{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{budgetOutsourcingSum}}</td> -->
            </tr>
            <tr>
              <td class="required col-title"><span>委内(万元)</span></td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :rules="setRules('budgetInsourcing',index)" prop="budgetInsourcing" :class="isRowError.budgetInsourcing ? 'is-error' : ''">
                  <el-input
                    v-if="item=='本次申请预算'"
                    v-model="budgetForm.costBudgetList[index].budgetInsourcing"
                    placeholder="请输入金额"
                    @input="inputHandler('budgetInsourcing',index)"
                    @change="computeSum('budgetInsourcing',index)"></el-input>
                  <span v-else :class="{'red-text':getRowHighlightStyle('budgetInsourcing', index)}">{{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{budgetInsourcingSum}}</td> -->
            </tr>

            <tr>
              <td rowspan="2" class="col-title">人工预算</td>
              <td class="required col-title"><span>自有人工预算(人月)</span></td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :rules="setRules('staffTime',index)" prop="staffTime" :class="isRowError.staffTime ? 'is-error' : ''">
                  <el-input
                    v-if="item=='本次申请预算'"
                    v-model="budgetForm.costBudgetList[index].staffTime"
                    placeholder="请输入工时"
                    @input="inputHandler('staffTime',index)"
                    @change="computeSum('staffTime',index)"></el-input>
                  <span v-else :class="{'red-text':getRowHighlightStyle('staffTime', index)}">{{budgetForm.costBudgetList[index].staffTime | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{staffTimeSum}}</td> -->
            </tr>
            <tr>
              <td class="col-title">自有人工成本(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :class="isRowError.laborCosts ? 'is-error' : ''">
                  <el-input
                    v-if="item=='本次申请预算'"
                    v-model="budgetForm.costBudgetList[index].laborCosts"
                    placeholder="请输入金额"
                    @input="inputHandler('laborCosts',index)"
                    @change="computeSum('laborCosts',index)"></el-input>
                  <span v-else :class="{'red-text':getRowHighlightStyle('laborCosts', index)}">{{budgetForm.costBudgetList[index].laborCosts | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{laborCostsSum}}</td> -->
            </tr>

            <tr>
              <td rowspan="4" class="col-title">其他</td>
              <td class="col-title">差旅费(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :class="isRowError.travelExpenses ? 'is-error' : ''">
                  <el-input
                    v-if="item=='本次申请预算'"
                    v-model="budgetForm.costBudgetList[index].travelExpenses"
                    placeholder="请输入金额"
                    @input="inputHandler('travelExpenses',index)"
                    @change="computeSum('travelExpenses',index)"></el-input>
                  <span v-else :class="{'red-text':getRowHighlightStyle('travelExpenses', index)}">{{budgetForm.costBudgetList[index].travelExpenses | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{travelExpensesSum}}</td> -->
            </tr>
            <tr>
              <td class="col-title">会议费(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :class="isRowError.conferenceExpenses ? 'is-error' : ''">
                  <el-input
                    v-if="item=='本次申请预算'"
                    v-model="budgetForm.costBudgetList[index].conferenceExpenses"
                    placeholder="请输入金额"
                    @input="inputHandler('conferenceExpenses',index)"
                    @change="computeSum('conferenceExpenses',index)"></el-input>
                  <span v-else :class="{'red-text':getRowHighlightStyle('conferenceExpenses', index)}">{{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{conferenceExpensesSum}}</td> -->
            </tr>
            <tr>
              <td class="col-title">资产折旧/摊销(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :class="isRowError.assetDepreciation ? 'is-error' : ''">
                  <el-input
                    v-if="item=='本次申请预算'"
                    v-model="budgetForm.costBudgetList[index].assetDepreciation"
                    placeholder="请输入金额"
                    @input="inputHandler('assetDepreciation',index)"
                    @change="computeSum('assetDepreciation',index)"></el-input>
                  <span v-else :class="{'red-text':getRowHighlightStyle('assetDepreciation', index)}">{{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{assetDepreciationSum}}</td> -->
            </tr>
            <tr>
              <td class="col-title">其他成本(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :class="isRowError.otherCosts ? 'is-error' : ''">
                  <el-input
                    v-if="item=='本次申请预算'"
                    v-model="budgetForm.costBudgetList[index].otherCosts"
                    placeholder="请输入金额"
                    @input="inputHandler('otherCosts',index)"
                    @change="computeSum('otherCosts',index)"></el-input>
                  <span v-else :class="{'red-text':getRowHighlightStyle('otherCosts', index)}">{{budgetForm.costBudgetList[index].otherCosts | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{otherCostsSum}}</td> -->
            </tr>

            <tr>
              <td
                colspan="2"
                align="center"
                class="col-title"
                style="color: #000;">
                合计(万元)
                <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                  <i class="el-icon-info title-color-blue"></i>
                </el-tooltip>
              </td>
              <td class="data-cell" v-for="(item,index) in budgetForm.costBudgetList" :key="index">
                <el-form-item :class="isRowError.otherCosts ? 'is-error' : ''">
                  <span v-if="item.timeYear=='本次申请预算'" :class="item.timeYear === '本次申请预算' && isBeyond? 'red-text': ''">{{item.totalAmount}}</span>
                  <span v-else :class="{'red-text':getRowHighlightStyle('totalAmount', index)}">{{item.totalAmount | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td
                class="data-cell"
                v-for="(item,index) in budgetForm.costBudgetList"
                :key="index"
                :class="item.timeYear === '本次申请预算' && isBeyond? 'red-text': ''">
                {{item.totalAmount}}
              </td> -->
              <!-- <td>{{allSum}}</td> -->
            </tr>
          </table>
        </el-form>
        <div class="con">
          <el-form
            :model="budgeInfo"
            :rules="rules"
            :inline="false"
            label-position='right'
            ref="budgeInfo"
            label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item
                  :inline="false"
                  label-width="140px"
                  label="任务描述及要求:"
                  prop="taskDesAndRequire"
                >
                  <el-input
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    @input="changeInput"
                    v-model.trim="budgeInfo.taskDesAndRequire"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  :inline="false"
                  label-width="140px"
                  label="需求风险提示:"
                  prop="demandRisk"
                >
                  <el-input
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    @input="changeInput"
                    v-model.trim="budgeInfo.demandRisk"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  :inline="false"
                  label-width="140px"
                  label="预期完成效果:"
                  prop="resultInformation"
                >
                  <el-input
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    @input="changeInput"
                    v-model.trim="budgeInfo.resultInformation"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  :inline="false"
                  label-width="140px"
                  label="备注:"
                  prop="remark"
                >
                  <el-input
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    @input="changeInput"
                    v-model.trim="budgeInfo.remark"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
export default {
  components: { projectPanel },
  data () {
    return {
      budgeInfo: {
        taskDesAndRequire: '',
        demandRisk: '',
        resultInformation: '',
        remark: ''
      },
      budgetForm: {
        projectCode: '', //项目编码
        costBudgetList: []
      },
      rules: {
        taskDesAndRequire: [{ required: true, message: '请输入任务描述及要求', trigger: ['change', 'blur'] }],
        demandRisk: [{ required: true, message: '请输入需求风险提示', trigger: ['change', 'blur'] }],
        resultInformation: [{ required: true, message: '请输入预期完成效果', trigger: ['change', 'blur'] }]
      },
      countKeys: ['budgetOutsourcing', 'budgetInsourcing', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'],
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'],
      requiredKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime'], //委外 委内 自有人工(人月)合计
      budgetOutsourcingSum: '', //委外合计
      budgetInsourcingSum: '', //委内合计
      staffTimeSum: '', //自有人工(人月)合计
      laborCostsSum: '', //自有人工成本(万元)合计
      travelExpensesSum: '', //差旅费(万元)合计
      conferenceExpensesSum: '', //会议费(万元)合计
      assetDepreciationSum: '', //资产折旧/摊销(万元)合计
      otherCostsSum: '', // 其他成本(万元)合计
      allSum: '', //总合计
      yearRange: [],
      isBeyond: false, // 申请预算是否超出总金额
      isBeyondList: [], // 申请预算超出key的集合
      isRowError: { // 控制行输入框的error样式
        'budgetOutsourcing': false,
        'budgetInsourcing': false,
        'staffTime': false,
        'laborCosts': false,
        'travelExpenses': false,
        'conferenceExpenses': false,
        'assetDepreciation': false,
        'otherCosts': false
      },
      rowInfo: false, // 行校验提示语
      totalInfo: false // 总金额校验提示语
    }
  },
  props: {
    yearRangeProp: {
      type: Array,
      default: () => []
    },
    projectCode: {
      type: String,
      default: ''
    },
    //编辑 已有数据
    receiveData: {
      type: Array,
      default: () => []
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.initInfo()
      }
    },
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.analyzeData()
        }
      }
    },
    yearRangeProp: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          let tempList = JSON.parse(JSON.stringify(this.budgetForm.costBudgetList))
          this.budgetForm.costBudgetList = []
          this.yearRange = val
          val.forEach(element => {
            // let hasYear = tempList.some(ele => parseInt(ele.timeYear) === parseInt(element))
            let hasYear = tempList.some(ele => ele.timeYear === element)
            if (tempList && tempList.length && hasYear) {
              let obj = null
              tempList.some(ele => {
                // if (parseInt(ele.timeYear) === parseInt(element)) {
                //   obj = Object.assign({}, ele)
                //   return true
                // }
                if (ele.timeYear === element) {
                  obj = Object.assign({}, ele)
                  return true
                }
              })
              if (obj) {
                this.budgetForm.costBudgetList.push(obj)
              }
            } else {
              this.budgetForm.costBudgetList.push({
                budgetOutsourcing: '',
                budgetInsourcing: '',
                staffTime: '',
                laborCosts: '',
                travelExpenses: '',
                conferenceExpenses: '',
                assetDepreciation: '',
                otherCosts: '',
                totalAmount: '',
                timeYear: element
              })
            }
          })
        }
      }
    }
  },
  methods: {
    getRowHighlightStyle (prop, index) {
      let flag = false
      if (this.budgetForm.costBudgetList[index].highlightProps && this.budgetForm.costBudgetList[index].highlightProps[prop]) {
        flag = true
      }
      if (prop === 'totalAmount' && this.budgetForm.costBudgetList[index].highlightProps) {
        for (var key in this.budgetForm.costBudgetList[index].highlightProps) {
          if (key !== 'staffTime' && this.budgetForm.costBudgetList[index].highlightProps[key]) {
            flag = true
          }
        }
      }
      return flag
    },
    initInfo () {
      this.budgeInfo.taskDesAndRequire = this.info.taskDesAndRequire
      this.budgeInfo.demandRisk = this.info.demandRisk
      this.budgeInfo.resultInformation = this.info.resultInformation
      this.budgeInfo.remark = this.info.remark
    },
    computeSum (prop, index) {
      this.setNumber(prop, index)
      let sum = 0
      let nullCount = 0
      this.allSum = 0
      let nullTotalCount = 0
      this.budgetForm.costBudgetList.forEach(item => {
        let parseTemp = prop === 'staffTime' ? this.parse2Num(item[prop], false, 2) : this.parse2Num(item[prop])
        let parse = isNaN(parseTemp) ? 0 : parseTemp
        if (!item[prop]) nullCount++ //计算行为空或null的情况
        sum += parse
        item.totalAmount = 0
        let colNullCount = 0
        let budgeSum = '0'
        this.countKeys.forEach(key => {
          if (!item[key]) colNullCount++ //计算列为空或null的情况
          // let num = (this.parse2Num(item[key]) || 0) * 1000000
          // budgeSum += num
          let num = item[key] || '0'
          budgeSum = this.sumFloat(budgeSum, num)
        })
        // item.totalAmount = this.parse2Num(budgeSum / 1000000)
        item.totalAmount = budgeSum
      })
      this.judgeBudget() // 校验总预算
      this.judgeRowBudget(prop, index) // 校验行预算
      this.judeRow(prop) // 校验行预算的显示控制
    },
    // 申请预算的总金额不能超过可用预算
    judgeBudget () {
      let useable = null // 项目总预算
      let apply = null // 申请预算金额
      this.budgetForm.costBudgetList.forEach((item, index) => {
        if (item.timeYear === '可用预算') {
          useable = parseFloat(String(item.totalAmount)
            .replace(/,/g, ''))
        }
        if (item.timeYear === '本次申请预算') {
          apply = parseFloat(String(item.totalAmount)
            .replace(/,/g, ''))
        }
      })
      if (apply > useable) {
        this.isBeyond = true
        this.$emit('IsBeyond', this.isBeyond)
        // 保证只提示一次
        if (!this.rowInfo) {
          this.$message({
            message: '申请金额已超过项目总预算',
            type: 'warning',
            showClose: true
          })
          this.rowInfo = true
        }
      } else {
        this.isBeyond = false
        this.$emit('IsBeyond', this.isBeyond)
      }
    },
    // 申请预算的各列金额不能超过可用预算的各列金额
    judgeRowBudget (prop, index) {
      if (index !== 3) return
      let useable = parseFloat(this.budgetForm.costBudgetList[index - 1][prop]) // 项目可用预算
      let apply = parseFloat(this.budgetForm.costBudgetList[index][prop]) // 申请预算金额
      if (apply > useable) {
        this.isBeyondList.push(prop)
        this.isBeyondList = Array.from(new Set(this.isBeyondList))
        // 当总金额已超出时打断行预算超出提醒
        if (this.isBeyond) {
          return
        }
        // 保证只提示一次
        if (!this.totalInfo) {
          this.$message({
            message: '当前行的申请预算已超过可用预算',
            type: 'warning',
            showClose: true
          })
          this.totalInfo = true
        }
      } else {
        this.isBeyondList.forEach((item, i) => {
          if (item === prop) {
            this.isBeyondList.splice(i, 1)
          }
        })
        this.isRowError[prop] = false
      }
    },
    // 根据当前超出金额的集合判断当前行是否超出
    judeRow (prop) {
      this.isBeyondList.forEach(item => {
        if (item === prop) {
          this.isRowError[prop] = true
        }
      })
    },
    sumFloat (num1, num2, prop) {
      let int1 = num1.split('.')[0] || 0
      let int2 = num2.split('.')[0] || 0
      let decimal1 = num1.split('.')[1] || 0
      let decimal2 = num2.split('.')[1] || 0
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
    //转成固定小数位
    getFixedNum (val, num = 6) {
      if (isNaN(val)) return ''
      return (Math.round(val * 1000000) / 1000000).toFixed(num)
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
    setNumber (prop, index) {
      if (this.budgetForm.costBudgetList[index][prop] === '.') {
        this.budgetForm.costBudgetList[index][prop] = ''
        return
      }
      if (this.budgetForm.costBudgetList[index][prop] === '') return
      let len = prop === 'staffTime' ? 2 : 6
      let temp = this.parse2Num(this.budgetForm.costBudgetList[index][prop], false, len)
      this.budgetForm.costBudgetList[index][prop] = temp
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
    //千分符转化为数字形式，flag-为空时是否需要转为0
    parse2Num (val, flag = true, len = 6) {
      // if (!str && str !== 0) return flag ? 0 : str
      // if (len === 2) {
      //   return num
      //     .indexOf('.') !== -1 ? parseFloat(num)
      //       .toFixed(len) : num + '.00'
      // } else {val
      //   return num
      //     .indexOf('.') !== -1 ? parseFloat(num)
      //       .toFixed(len) : num + '.000000'
      // }
      let str = ''
      let splitArr = val ? val.split('.') : '0'
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
    //输入时限制只能输入固定的小数位，超出位数则无法输入，直接删除掉多余的位数
    inputHandler (prop, index) {
      this.rowInfo = false
      this.totalInfo = false
      let temp = this.budgetForm.costBudgetList[index][prop]
      if (!temp) return
      if (temp.indexOf('.') > -1) {
        let arr = temp.split('.')
        let integer = arr[0] || '0'
        // let integer = arr[0].replace(/,/g, '')
        let decimals = arr[arr.length - 1]
        let integerLen = prop === 'staffTime' ? 6 : 11
        integer = integer.length > integerLen ? integer.slice(0, integerLen) : integer
        let len = prop === 'staffTime' ? 2 : 6
        decimals = decimals.length > len ? decimals.slice(0, len) : decimals
        temp = `${integer}.${decimals}`
      } else {
        temp = temp.length > 11 ? temp.slice(0, 11) : temp
        if (prop === 'staffTime') {
          temp = temp.length > 6 ? temp.slice(0, 6) : temp
        }
      }
      temp = temp.replace(/[^\d.]/g, '')
      this.budgetForm.costBudgetList[index][prop] = temp
    },
    focusInput (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop]
      this.budgetForm.costBudgetList[index][prop] = temp || ''
    },
    // 设置表单必填校验
    setRules (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop] // 当前行的本次申请预算信息
      let checkEmpty = (rule, value, callback) => {
        if (temp === '') {
          callback(new Error('该项不能为空'))
        } else {
          callback()
        }
      }
      let rules = [
        { validator: checkEmpty, required: true, message: '该项不能为空', trigger: 'blur' }
      ]
      return rules
    },
    getSubmitData () {
      let costBudgetList = []
      this.budgetForm.costBudgetList.forEach(item => {
        let obj = {}
        obj.budgetOutsourcing = this.parse2Num(item.budgetOutsourcing, false)
        obj.budgetInsourcing = this.parse2Num(item.budgetInsourcing, false)
        obj.staffTime = item.staffTime//this.parse2Num(item.staffTime)
        obj.laborCosts = this.parse2Num(item.laborCosts, false)
        obj.travelExpenses = this.parse2Num(item.travelExpenses, false)
        obj.conferenceExpenses = this.parse2Num(item.conferenceExpenses, false)
        obj.assetDepreciation = this.parse2Num(item.assetDepreciation, false)
        obj.otherCosts = this.parse2Num(item.otherCosts, false)
        obj.totalAmount = this.parse2Num(item.totalAmount, false)
        obj.timeYear = item.timeYear
        obj.projectCode = this.projectCode
        costBudgetList.push(obj)
      })
      let params = {
        projectCode: this.projectCode,
        costBudgetList: costBudgetList
      }
      return params
    },
    tempSave () {
      if (!this.projectCode) {
        this.$message({
          message: '请先保存基本信息！',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.$refs['budgetForm'].validate(valid => {
        if (valid) {
          let params = this.getSubmitData()
          API.saveCostBudget(params)
            .then(res => {
              this.$message({
                message: '暂存成功',
                type: 'success',
                showClose: true
              })
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '项目成本预算信息暂存失败！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        } else {
          this.$message({
            message: '请检查是否已填写所有的必填项！',
            type: 'warning',
            showClose: true
          })
        }
      })
    },
    //判断页面中的message个数
    judgeMessage (mesArr = []) {
      let mesList = Array.from(document.getElementsByClassName('el-message'))
      let num = 0
      mesList.forEach(element => {
        let msg = element.innerText
        if (mesArr.indexOf(msg) > -1) {
          num++
        }
      })
      return num
    },
    analyzeData () {
      //初始化清空默认数据
      this.yearRange = []
      this.budgetForm.costBudgetList = JSON.parse(JSON.stringify(this.receiveData))
      this.budgetForm.costBudgetList.forEach(item => {
        this.yearRange.push(item.timeYear)
      })
      this.allKeys.forEach(key => {
        this[`${key}Sum`] = 0
        let nullCount = 0
        this.yearRange.forEach(y => {
          this.budgetForm.costBudgetList.some(item => {
            if (item.timeYear === y) {
              if (item[key] === null) nullCount++
              this[`${key}Sum`] += item[key] //行合计
              return true
            }
          })
        })
        if (nullCount === this.yearRange.length) {
          this[`${key}Sum`] = ''
        } else {
          let sum = key === 'staffTime' ? this.parse2Num(this[`${key}Sum`], 2) : this.parse2Num(this[`${key}Sum`])
          this[`${key}Sum`] = sum
        }
      })
      this.allSum = 0
      this.budgetForm.costBudgetList.forEach(item => {
        this.allSum += parseFloat(item.totalAmount)
        item.totalAmount = this.parse2Num(item.totalAmount)
        // this.allKeys.forEach(key => {
        //   if (item[key] !== null) {
        //     item[key] = key === 'staffTime' ? this.parse2Num(item[key], false, 2) : this.parse2Num(item[key])
        //   } else {
        //     item[key] = ''
        //   }
        // })
      })
      this.allSum = this.parse2Num(this.allSum)
      this.computedAll()
    },
    async validate () {
      return new Promise((resolve, reject) => {
        let flag = true //默认可以提交
        this.$refs['budgetForm'].validate(valid => {
          if (!valid) {
            flag = false
          }
        })
        this.$refs['budgeInfo'].validate(valid1 => {
          if (!valid1) {
            flag = false
          }
        })
        if (flag) {
          let params = { costBudgetList: this.getSubmitData().costBudgetList }
          params.taskDesAndRequire = this.budgeInfo.taskDesAndRequire
          params.demandRisk = this.budgeInfo.demandRisk
          params.resultInformation = this.budgeInfo.resultInformation
          params.remark = this.budgeInfo.remark
          resolve(params)
        } else {
          resolve(false)
          return false
        }
      })
    },
    computedAll () {
      this.allKeys.forEach(key => {
        this.yearRange.forEach((y, index) => {
          this.computeSum(key, index)
        })
      })
    },
    // 将备注信息传给父组件
    changeInput () {
      this.$emit('budgetInfo', this.budgeInfo)
    }
  },
  mounted () {
    this.initInfo()
    this.computeSum('otherCosts', 1)
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
        return val
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
    .con{
      margin-top:20px
    }
  }
  // th:first-child{position: fixed;left: 5px}
  .budget-con{
    // .el-form-item .el-input__inner{
    //   width : 100%;
    // }
    // .el-select{
    //   width:100%;
    // }
    // .el-date-editor{
    //   width:100%;
    // }
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
      .title-color-blue {
        @include color($color-blue);
      }
      th:nth-child(1){
        border-right: 1px solid #E8E8E8;
      }
      .data-cell{
        text-align: center;
      }
      td:nth-last-child(2){
        min-width: 140px;
        @include color($color-blue);
      }
      &:nth-last-child(1){
        @include color($color-blue);
        font-weight: bold;
      }
    }
    // .el-form-item{
    //   margin-bottom: 0;
    //   margin-right: 0;
    //   /deep/ .el-input__inner{
    //     width: 220px;
    //   }
    // }
    .required span{
      position: relative;
        &::before{
          // font-size: 20px;
          color: red;
          content: '*';
          position: absolute;
          left: -10px;
          top: 0px;
      }
    }
  }
  margin-top: 20px;

  .red-text {
    color: red !important;
  }
}
</style>
