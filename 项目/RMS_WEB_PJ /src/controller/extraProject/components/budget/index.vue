<template>
  <div class="project-budget">
    <project-panel title="项目预算" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" @click="tempSave">保存本区块信息</el-button>
      </template>
      <div>
        <el-form
          ref="budgetForm"
          :model="budgetForm"
          :rules="rules"
          :inline="true"
          :show-message="false">
          <div class="table-wrapper">
            <div class="budget-body" @scroll="scroll">
              <table
                class="budget-con"
                border="1"
                cellpadding="0"
                cellspacing="0">
                <tr>
                  <th colspan="2" class="col-title"></th>
                  <th v-for="(item,index) in yearRange" :key="index">
                    {{item}}年度
                  </th>
                  <th class="sum-w">年度预算合计</th>
                  <th class="all-w" v-if="isShowProjectCol">全项目</th>
                </tr>

                <tr>
                  <td rowspan="2" class="col-title">合作开发费</td>
                  <td class="required col-title"><span>委外(万元)</span></td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item :rules="setRules('budgetOutsourcing',index)" prop="budgetOutsourcing">
                      <el-input
                        v-model="budgetForm.costBudgetList[index].budgetOutsourcing"
                        placeholder="0.000000"
                        @input="inputHandler('budgetOutsourcing',index)"
                        @change="computeSum('budgetOutsourcing',index)"
                        @focus="focusHandler('budgetOutsourcing',index)"
                        @blur="blurHandler('budgetOutsourcing',index)"
                        :disabled="parseInt(item) < curYear"></el-input>
                    </el-form-item>
                  </td>
                  <td class="data-cell">{{budgetOutsourcingSum}}</td>
                  <td rowspan="2" class="left-b data-cell" v-if="isShowProjectCol">
                    <el-form-item :rules="setRules('budgetOutsourcing', 'all')" prop="budgetOutsourcing">
                      <el-input
                        :class="{'valid-error': !validResultObj.budgetOutsourcing}"
                        v-model="allProject.budgetOutsourcing"
                        placeholder="0.000000"
                        @input="inputHandler('budgetOutsourcing','all')"
                        @change="computeAllSum('budgetOutsourcing')"
                        @focus="focusHandler('budgetOutsourcing', 'all')"
                        @blur="blurHandler('budgetOutsourcing', 'all')"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="required col-title"><span>委内(万元)</span></td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item :rules="setRules('budgetInsourcing',index)" prop="budgetInsourcing">
                      <el-input
                        v-model="budgetForm.costBudgetList[index].budgetInsourcing"
                        placeholder="0.000000"
                        @input="inputHandler('budgetInsourcing',index)"
                        @change="computeSum('budgetInsourcing',index)"
                        @focus="focusHandler('budgetInsourcing',index)"
                        @blur="blurHandler('budgetInsourcing',index)"
                        :disabled="parseInt(item) < curYear"></el-input>
                    </el-form-item>
                  </td>
                  <td class="data-cell">{{budgetInsourcingSum}}</td>
                </tr>

                <tr>
                  <td rowspan="2" class="col-title">人工预算</td>
                  <td class="required col-title"><span>自有人工(人月)</span></td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item :rules="setRules('staffTime',index)" prop="staffTime">
                      <el-input
                        v-model="budgetForm.costBudgetList[index].staffTime"
                        placeholder="0.00"
                        @input="inputHandler('staffTime',index)"
                        @change="computeSum('staffTime',index)"
                        @focus="focusHandler('staffTime',index)"
                        @blur="blurHandler('staffTime',index)"
                        :disabled="parseInt(item) < curYear"></el-input>
                    </el-form-item>
                  </td>
                  <td class="data-cell">{{staffTimeSum}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">
                    <el-form-item :rules="setRules('staffTime', 'all')" prop="staffTime">
                      <el-input
                        :class="{'valid-error': !validResultObj.staffTime}"
                        v-model="allProject.staffTime"
                        placeholder="0.000000"
                        @input="inputHandler('staffTime','all')"
                        @change="computeAllSum('staffTime')"
                        @focus="focusHandler('staffTime', 'all')"
                        @blur="blurHandler('staffTime', 'all')"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="col-title">自有人工成本(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item>
                      <el-input
                        v-model="budgetForm.costBudgetList[index].laborCosts"
                        placeholder="0.000000"
                        @input="inputHandler('laborCosts',index)"
                        @change="computeSum('laborCosts',index)"
                        @focus="focusHandler('laborCosts',index)"
                        @blur="blurHandler('laborCosts',index)"
                        :disabled="parseInt(item) < curYear"></el-input>
                    </el-form-item>
                  </td>
                  <td class="data-cell">{{laborCostsSum}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">
                    <el-form-item  prop="laborCosts">
                      <el-input
                        :class="{'valid-error': !validResultObj.laborCosts}"
                        v-model="allProject.laborCosts"
                        placeholder="0.000000"
                        @input="inputHandler('laborCosts','all')"
                        @change="computeAllSum('laborCosts')"
                        @focus="focusHandler('laborCosts', 'all')"
                        @blur="blurHandler('laborCosts', 'all')"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>

                <tr>
                  <td rowspan="4" class="col-title">其他</td>
                  <td class="col-title">差旅费(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item>
                      <el-input
                        v-model="budgetForm.costBudgetList[index].travelExpenses"
                        placeholder="0.000000"
                        @input="inputHandler('travelExpenses',index)"
                        @change="computeSum('travelExpenses',index)"
                        @focus="focusHandler('travelExpenses',index)"
                        @blur="blurHandler('travelExpenses',index)"
                        :disabled="parseInt(item) < curYear"></el-input>
                    </el-form-item>
                  </td>
                  <td class="data-cell">{{travelExpensesSum}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">
                    <el-form-item  prop="travelExpenses">
                      <el-input
                        :class="{'valid-error': !validResultObj.travelExpenses}"
                        v-model="allProject.travelExpenses"
                        placeholder="0.000000"
                        @input="inputHandler('travelExpenses','all')"
                        @change="computeAllSum('travelExpenses')"
                        @focus="focusHandler('travelExpenses', 'all')"
                        @blur="blurHandler('travelExpenses', 'all')"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="col-title">会议费(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item>
                      <el-input
                        v-model="budgetForm.costBudgetList[index].conferenceExpenses"
                        placeholder="0.000000"
                        @input="inputHandler('conferenceExpenses',index)"
                        @change="computeSum('conferenceExpenses',index)"
                        @focus="focusHandler('conferenceExpenses',index)"
                        @blur="blurHandler('conferenceExpenses',index)"
                        :disabled="parseInt(item) < curYear"></el-input>
                    </el-form-item>
                  </td>
                  <td class="data-cell">{{conferenceExpensesSum}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">
                    <el-form-item  prop="conferenceExpenses">
                      <el-input
                        :class="{'valid-error': !validResultObj.conferenceExpenses}"
                        v-model="allProject.conferenceExpenses"
                        placeholder="0.000000"
                        @input="inputHandler('conferenceExpenses','all')"
                        @change="computeAllSum('conferenceExpenses')"
                        @focus="focusHandler('conferenceExpenses','all')"
                        @blur="blurHandler('conferenceExpenses','all')"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="col-title">资产折旧/摊销(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item>
                      <el-input
                        v-model="budgetForm.costBudgetList[index].assetDepreciation"
                        placeholder="0.000000"
                        @input="inputHandler('assetDepreciation',index)"
                        @change="computeSum('assetDepreciation',index)"
                        @focus="focusHandler('assetDepreciation',index)"
                        @blur="blurHandler('assetDepreciation',index)"
                        :disabled="parseInt(item) < curYear"></el-input>
                    </el-form-item>
                  </td>
                  <td class="data-cell">{{assetDepreciationSum}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">
                    <el-form-item  prop="assetDepreciation">
                      <el-input
                        :class="{'valid-error': !validResultObj.assetDepreciation}"
                        v-model="allProject.assetDepreciation"
                        placeholder="0.000000"
                        @input="inputHandler('assetDepreciation','all')"
                        @change="computeAllSum('assetDepreciation')"
                        @focus="focusHandler('assetDepreciation','all')"
                        @blur="blurHandler('assetDepreciation','all')"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="col-title">其他成本(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item>
                      <el-input
                        v-model="budgetForm.costBudgetList[index].otherCosts"
                        placeholder="0.000000"
                        @input="inputHandler('otherCosts',index)"
                        @change="computeSum('otherCosts',index)"
                        @focus="focusHandler('otherCosts',index)"
                        @blur="blurHandler('otherCosts',index)"
                        :disabled="parseInt(item) < curYear"></el-input>
                    </el-form-item>
                  </td>
                  <td class="data-cell">{{otherCostsSum}}</td>
                  <td v-if="isShowProjectCol" class="data-cell">
                    <el-form-item  prop="otherCosts">
                      <el-input
                        :class="{'valid-error': !validResultObj.otherCosts}"
                        v-model="allProject.otherCosts"
                        placeholder="0.000000"
                        @input="inputHandler('otherCosts','all')"
                        @change="computeAllSum('otherCosts')"
                        @focus="focusHandler('otherCosts','all')"
                        @blur="blurHandler('otherCosts','all')"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>

                <tr>
                  <td colspan="2" align="center" class="col-title">
                    合计(万元)
                    <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </td>
                  <td class="data-cell" v-for="(item,index) in budgetForm.costBudgetList" :key="index">
                    {{item.totalAmount}}
                  </td>
                  <td class="data-cell">{{allSum}}</td>
                  <td v-if="isShowProjectCol" class="data-cell" >{{allProject.totalAmount}}</td>
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
                  <td rowspan="2" class="col-title">合作开发费</td>
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
                  <td colspan="2" align="center" class="col-title">
                    合计(万元)
                    <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                      <i class="el-icon-info title-color-blue"></i>
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
      rules: {},
      countKeys: ['budgetOutsourcing', 'budgetInsourcing', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'],
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'],
      requiredKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime'],
      budgetOutsourcingSum: '',
      budgetInsourcingSum: '',
      staffTimeSum: '',
      laborCostsSum: '',
      travelExpensesSum: '',
      conferenceExpensesSum: '',
      assetDepreciationSum: '',
      otherCostsSum: '',
      allSum: '', //总合计
      yearRange: [],
      curYear: new Date()
        .getFullYear(), //当年年份
      language: '暂无基线信息',
      hideShadow: true,
      isShowProjectCol: false,
      validResultObj: { //全项目列的校验结果
        budgetOutsourcing: true,
        // budgetInsourcing: true,
        staffTime: true,
        laborCosts: true,
        travelExpenses: true,
        conferenceExpenses: true,
        assetDepreciation: true,
        otherCosts: true
      },
      isBaseLine: false // 是否配置了基线
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
    tipLanguage: {
      type: Boolean,
      default: false
    }
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
            let hasYear = tempList.some(ele => parseInt(ele.timeYear) === parseInt(element))
            if (tempList && tempList.length && hasYear) {
              let obj = null
              tempList.some(ele => {
                if (parseInt(ele.timeYear) === parseInt(element)) {
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
    },
    tipLanguage: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.isBaseLine = val
        if (val) {
          this.language = '预算信息中所有可编辑字段都是基线字段；'
        } else {
          this.language = '预算信息中没有基线字段；'
        }
      }
    }
  },
  methods: {
    // 获取预算填报模式
    getQueryCostBudgetType () {
      let param = {
        projectCode: this.projectCode
      }
      API.queryCostBudgetType(param)
        .then(res => {
          if (res === 'BUDGET_TOTAL_MODE') {
            this.isShowProjectCol = true
            if (this.isBaseLine) {
              this.language = '预算信息可编辑字段中，除全项目列为基线字段外，其余均为非基线字段；'
            }
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
    computeSum (prop, index, isChangeValue = true) {
      if (isChangeValue) {
        this.changeInfo()
      }
      this.setNumber(prop, index)
      let sum = ''
      let nullCount = 0
      this.allSum = ''
      let nullTotalCount = 0
      this.budgetForm.costBudgetList.forEach(item => {
        // let parseTemp = parseFloat(item[prop])
        // let parse = isNaN(parseTemp) ? 0 : parseTemp
        if (!item[prop]) nullCount++ //计算行为空或null的情况
        sum = this.sumFloat(sum, item[prop], prop)
        item.totalAmount = ''
        let colNullCount = 0
        this.countKeys.forEach(key => {
          if (!item[key]) colNullCount++ //计算列为空或null的情况
          // let num = item[key] || 0
          // item.totalAmount += parseFloat(num)
          item.totalAmount = this.sumFloat(item.totalAmount, item[key], '')
        })
        //列全部为空或null，则合计为空不展示
        if (colNullCount === this.countKeys.length) {
          item.totalAmount = ''
          nullTotalCount++ //计算年合计为空或null的情况
        } else {
          // item.totalAmount = this.getFixedNum(item.totalAmount, 6)
        }
        if (item.timeYear !== 'ALL' && item.totalAmount !== '') {
          // this.allSum += parseFloat(item.totalAmount)
          this.allSum = this.sumFloat(this.allSum, item.totalAmount, '')
        }
      })
      //如果年合计全部为空或null，则右下角的总合计不展示
      if (nullTotalCount === this.budgetForm.costBudgetList.length) {
        this.allSum = ''
      } else {
        // this.allSum = this.getFixedNum(this.allSum, 6)
      }
      //如果行合计全部为空或null，则行合计为空不展示
      if (nullCount === this.budgetForm.costBudgetList.length) {
        this[`${prop}Sum`] = ''
      } else {
        let rowsum = sum//prop === 'staffTime' ? this.getFixedNum(sum, 2) : this.getFixedNum(sum, 6)
        this[`${prop}Sum`] = rowsum //当项合计（行）
      }
    },
    //输入框获得焦点时，去除补位的0
    focusHandler (prop, index) {
      let temp = null
      if (index === 'all') {
        temp = this.allProject[prop]
      } else {
        temp = this.budgetForm.costBudgetList[index][prop]
      }
      if (temp === '') return
      let numNew = this.numTransition(temp)
      if (index === 'all') {
        this.allProject[prop] = numNew === '0' ? '' : numNew
      } else {
        this.budgetForm.costBudgetList[index][prop] = numNew === '0' ? '' : numNew
      }
    },
    blurHandler (prop, index) {
      let temp = null
      if (index === 'all') {
        temp = this.allProject[prop]
      } else {
        temp = this.budgetForm.costBudgetList[index][prop]
      }
      if (temp === '') return
      if (index === 'all') {
        this.allProject[prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)
      } else {
        this.budgetForm.costBudgetList[index][prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)
      }
    },
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
          return ''
        } else {
          return val
        }
      }
    },
    computeAllSum (prop) {
      this.changeInfo()
      if (this.allProject[prop] === '.') {
        this.allProject[prop] = ''
        return
      }
      if (this.allProject[prop] === '') return
      let temp = this.allProject[prop]
      this.allProject[prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)

      let sum = ''
      this.countKeys.forEach(key => {
        if (key !== 'budgetInsourcing') {
          sum = this.sumFloat(sum, this.allProject[key], '')
        }
      })
      this.allProject.totalAmount = sum
    },
    //两位字符表示的浮点数相加求和，使用字符串是为了防止精度丢失，js大于15位的数使用parseFloat会丢失精度
    sumFloat (num1, num2, prop) {
      let int1 = num1 ? num1.split('.')[0] || 0 : 0
      let int2 = num2 ? num2.split('.')[0] || 0 : 0
      let decimal1 = num1 ? num1.split('.')[1] || 0 : 0
      let decimal2 = num2 ? num2.split('.')[1] || 0 : 0
      //如2.991000+5.999000
      //整数与整数相加，2+5=7
      let int = parseInt(int1) + parseInt(int2)
      let decimalLen = prop === 'staffTime' ? 2 : 6
      //小数位相加，再除以倍数，991+999=1990 1990/1000000=0.001990
      // let decimal = (parseInt(decimal1) + parseInt(decimal2)) / Math.pow(10, decimalLen)
      // let decimal = (parseFloat('0.' + decimal1) + parseFloat('0.' + decimal2))
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
      let temp = this.budgetForm.costBudgetList[index][prop]
      this.budgetForm.costBudgetList[index][prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)
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
    parse2Num (str, flag = true) {
      if (!str) return flag ? 0 : str
      let num = String(str)
        .replace(/,/gi, '')
      return parseFloat(num)
    },
    //输入时限制只能输入固定的小数位，超出位数则无法输入，直接删除掉多余的位数
    inputHandler (prop, index) {
      let temp = null
      if (index === 'all') {
        temp = this.allProject[prop]
        this.validResultObj[prop] = true //清空全项目校验结果
      } else {
        temp = this.budgetForm.costBudgetList[index][prop]
      }
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
      if (index === 'all') {
        this.allProject[prop] = temp
      } else {
        this.budgetForm.costBudgetList[index][prop] = temp
      }
    },
    focusInput (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop]
      this.budgetForm.costBudgetList[index][prop] = temp || ''
    },
    // 设置表单必填校验
    setRules (prop, index) {
      let temp = null
      if (index === 'all') {
        temp = this.allProject[prop]
      } else {
        temp = this.budgetForm.costBudgetList[index][prop]
      }
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
        let obj = item
        obj.projectCode = this.projectCode
        costBudgetList.push(obj)
      })
      if (this.isShowProjectCol) {
        costBudgetList.push(this.allProject)
      }
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
          if (this.isShowProjectCol) {
            let result = this.judgeAllProjectBudget()
            if (!result) {
              this.$message({
                message: '全项目预算不可小于年度预算合计！',
                type: 'error',
                showClose: true
              })
              return
            }
          }
          let params = this.getSubmitData()
          API.saveCostBudget(params)
            .then(res => {
              if (res === 0) {
                this.$message({
                  type: 'success',
                  message: '项目预算保存成功',
                  showClose: true
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '项目预算保存成功',
                  showClose: true
                })
              }
              this.$emit('saveBlock') //保存区块成功
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '项目成本预算信息保存失败！',
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
        /* this.allKeys.forEach(key => {
          if (item[key]) {
          }
        }) */
      })
      this.allKeys.forEach(key => {
        this[`${key}Sum`] = ''
        let nullCount = 0
        this.yearRange.forEach(y => {
          this.budgetForm.costBudgetList.some(item => {
            if (item.timeYear === y && item.timeYear !== 'ALL') { //年度预算合计不包含全项目列
              if (item[key] === null) {
                nullCount++
                item[key] = ''
              } else {
                let len = key === 'staffTime' ? 2 : 6
                item[key] = this.getFixedNumNew(item[key] + '', len)
              }
              // this[`${key}Sum`] += item[key] //行合计
              this[`${key}Sum`] = this.sumFloat(this[`${key}Sum`], item[key], key) //行合计
              return true
            }
          })
        })
        if (nullCount === this.yearRange.length) {
          this[`${key}Sum`] = ''
        } else {
          // let sum = key === 'staffTime' ? this.getFixedNum(this[`${key}Sum`], 2) : this.getFixedNum(this[`${key}Sum`], 6)
          // this[`${key}Sum`] = sum
        }
      })
      this.allSum = ''
      this.budgetForm.costBudgetList.forEach(item => {
        // this.allSum += parseFloat(item.totalAmount)
        item.totalAmount = this.getFixedNumNew(item.totalAmount + '', 6)
        if (item.timeYear !== 'ALL') {
          this.allSum = this.sumFloat(this.allSum, item.totalAmount, '')
        }
        // item.totalAmount = this.getFixedNum(item.totalAmount, 6)
        this.allKeys.forEach(key => {
          if (item[key] !== null) {
            // item[key] = key === 'staffTime' ? this.getFixedNum(item[key], 2) : this.getFixedNum(item[key], 6)
          } else {
            // item[key] = ''
          }
        })
        if (item.timeYear === 'ALL') {
          this.allProject = item
        }
      })
      this.allSum = this.getFixedNumNew(this.allSum + '', 6)
      // this.allSum = this.parse2Thousand(this.allSum)
    },
    async validate () {
      return new Promise((resolve, reject) => {
        this.$refs['budgetForm'].validate(valid => {
          if (valid) {
            if (this.isShowProjectCol) {
              let result = this.judgeAllProjectBudget()
              if (!result) {
                this.$message({
                  message: '全项目预算不可小于年度预算合计！',
                  type: 'error',
                  showClose: true
                })
                resolve('hasTip')
                return false
              }
            }
            let params = this.getSubmitData().costBudgetList
            resolve(params)
          } else {
            resolve(false)
            return false
          }
        })
      })
    },
    computedAll () {
      this.allKeys.forEach(key => {
        this.yearRange.forEach((y, index) => {
          this.computeSum(key, index, false)
        })
      })
    },
    //校验年度预算合计和全项目预算
    judgeAllProjectBudget () {
      let result = true
      this.allKeys.forEach(key => {
        if (key === 'budgetInsourcing') return
        let allKeyBudget = this.allProject[key] ? this.allProject[key] : '0.0'
        let keySum = this[key + 'Sum'] ? this[key + 'Sum'] : '0.0'
        if (key === 'budgetOutsourcing') {
          //全项目的合作开发费存储字段是委外， 对比 即为 委内+委外 <-> 委外
          let comDevCost = this.sumFloat(keySum, this.budgetInsourcingSum, 'budgetInsourcing')
          this.validResultObj[key] = this.compareFloat(comDevCost, allKeyBudget)
        } else {
          this.validResultObj[key] = this.compareFloat(keySum, allKeyBudget)
        }
        if (!this.validResultObj[key]) {
          result = false
        }
      })
      return result
    },
    //比较浮点数
    compareFloat (val1, val2) {
      let val1Arr = val1.split('.')
      let val2Arr = val2.split('.')
      if (parseInt(val1Arr[0]) < parseInt(val2Arr[0])) return true
      if (parseInt(val1Arr[0]) > parseInt(val2Arr[0])) return false
      if (parseInt(val1Arr[0]) === parseInt(val2Arr[0])) {
        return parseInt(val1Arr[1]) <= parseInt(val2Arr[1] || 0)
      }
    },
    //有信息发生修改
    changeInfo () {
      this.$emit('changeValue')
    },
    //准备修改某字段
    focusIn () {
      this.$emit('focusFormItem')
    }
  },
  mounted () {
    this.getQueryCostBudgetType()
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
      th:nth-child(1){
        border-right: 1px solid #E8E8E8;
      }
      .data-cell{
        text-align: center;
      }
      .left-b {
        border-left: 1px solid #E8E8E8;
      }
      // td:nth-last-child(1){
      //   min-width: 140px;
      //   @include color($color-blue);
      // }
      .sum-w {
        min-width: 180px;
      }
      .all-w {
        min-width: 140px;
      }
      .blue-color {
        @include color($color-blue);
      }
      &:nth-last-child(1){
        @include color($color-blue);
        font-weight: bold;
      }
    }
    .el-form-item{
      margin-bottom: 0;
      margin-right: 0;
      /deep/ .el-input__inner{
        width: 220px;
      }
      /deep/ .el-form-item__content .valid-error .el-input__inner{
        border-color: #FF3F3B;
      }
    }
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
           color: #000;
          }
          .title-color-blue {
            @include color($color-blue);
          }
        }
      }
    }
  }
</style>
