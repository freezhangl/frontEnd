<template>
  <div class="uBudget-table">
    <el-form
      ref="budgetForm"
      :model="budgetForm"
      :inline="true"
      :show-message="false">
      <div class="table-wrapper">
        <div class="budget-table" @scroll="scroll">
          <table
            class="budget-con"
            border="1"
            cellpadding="0"
            cellspacing="0">
            <tr>
              <th colspan="2" class="col-title">
                <div class="diagonal">
                  <span class="course">费用科目</span>
                  <span class="department">承担部门</span>
                </div>
              </th>
              <th v-for="(item,index) in undertakeUnitDeptList" :key="index" class="head">
                {{item}}
              </th>
            </tr>

            <tr>
              <td rowspan="2" class="col-title">合作开发费</td>
              <td class="col-title-child" :class="isEdit && isYear ? 'required' : ''"><span>委外(万元)</span></td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item :rules="setRules('budgetOutsourcing', index)" prop="budgetOutsourcing">
                  <span v-if="isEdit">
                    <el-input
                      :disabled='meberEditFlag'
                      v-if="isEdit && isYear && item !== '合计' && item !== '集团批复预算'"
                      v-model="budgetForm.costBudgetList[index].budgetOutsourcing"
                      @input="inputHandler('budgetOutsourcing', index)"
                      @change="computeSum('budgetOutsourcing', index)"
                      @focus="focusHandler('budgetOutsourcing',index)"
                      @blur="blurHandler('budgetOutsourcing',index)"
                      placeholder="0.000000"
                    ></el-input>
                    <span v-else>{{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}</span>
                  </span>
                  <span v-else>
                    <span
                      v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.budgetOutsourcing"
                      :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.budgetOutsourcing }">
                      {{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}</span>
                    <span v-else>{{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}</span>
                  </span>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child" :class="isEdit && isYear ? 'required' : ''"><span>委内(万元)</span></td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item :rules="setRules('budgetInsourcing', index)" prop="budgetInsourcing">
                  <span v-if="isEdit">
                    <el-input
                      :disabled='meberEditFlag'
                      v-if="isEdit && isYear && item !== '合计' && item !== '集团批复预算'"
                      v-model="budgetForm.costBudgetList[index].budgetInsourcing"
                      @input="inputHandler('budgetInsourcing', index)"
                      @change="computeSum('budgetInsourcing', index)"
                      @focus="focusHandler('budgetInsourcing',index)"
                      @blur="blurHandler('budgetInsourcing',index)"
                      placeholder="0.000000"
                    ></el-input>
                    <span v-else>{{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}</span>
                  </span>
                  <span v-else>
                    <span
                      v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.budgetInsourcing"
                      :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.budgetInsourcing }">
                      {{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}</span>
                    <span v-else>{{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}</span>
                  </span>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <td rowspan="2" class="col-title">自有人工</td>
              <td class="col-title-child" :class="isEdit && isYear ? 'required' : ''"><span>自有人工(人月)</span></td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item :rules="setRules('staffTime', index)" prop="staffTime">
                  <span v-if="isEdit">
                    <el-input
                      :disabled='meberEditFlag'
                      v-if="isEdit && isYear && item !== '合计' && item !== '集团批复预算'"
                      v-model="budgetForm.costBudgetList[index].staffTime"
                      @input="inputHandler('staffTime', index)"
                      @change="computeSum('staffTime', index)"
                      @focus="focusHandler('staffTime',index)"
                      @blur="blurHandler('staffTime',index)"
                      placeholder="0.00"
                    ></el-input>
                    <span v-else>{{budgetForm.costBudgetList[index].staffTime | numTransition}}</span>
                  </span>
                  <span v-else>
                    <span
                      v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.staffTime"
                      :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.staffTime }">
                      {{budgetForm.costBudgetList[index].staffTime | numTransition}}</span>
                    <span v-else>{{budgetForm.costBudgetList[index].staffTime | numTransition}}</span>
                  </span>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">自有人工(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item>
                  <span v-if="isEdit">
                    <el-input
                      :disabled='meberEditFlag'
                      v-if="isEdit && isYear && item !== '合计' && item !== '集团批复预算'"
                      v-model="budgetForm.costBudgetList[index].laborCosts"
                      @input="inputHandler('laborCosts', index)"
                      @change="computeSum('laborCosts', index)"
                      @focus="focusHandler('laborCosts',index)"
                      @blur="blurHandler('laborCosts',index)"
                      placeholder="0.000000"
                    ></el-input>
                    <span v-else>{{budgetForm.costBudgetList[index].laborCosts | numTransition}}</span>
                  </span>
                  <span v-else>
                    <span
                      v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.laborCosts"
                      :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.laborCosts }">
                      {{budgetForm.costBudgetList[index].laborCosts | numTransition}}</span>
                    <span v-else>{{budgetForm.costBudgetList[index].laborCosts | numTransition}}</span>
                  </span>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <td rowspan="4" class="col-title">其他</td>
              <td class="col-title-child">差旅费(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item>
                  <span v-if="isEdit">
                    <el-input
                      :disabled='meberEditFlag'
                      v-if="isEdit && isYear && item !== '合计' && item !== '集团批复预算'"
                      v-model="budgetForm.costBudgetList[index].travelExpenses"
                      @input="inputHandler('travelExpenses', index)"
                      @change="computeSum('travelExpenses', index)"
                      @focus="focusHandler('travelExpenses',index)"
                      @blur="blurHandler('travelExpenses',index)"
                      placeholder="0.000000"
                    ></el-input>
                    <span v-else>{{budgetForm.costBudgetList[index].travelExpenses | numTransition}}</span>
                  </span>
                  <span v-else>
                    <span
                      v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.travelExpenses"
                      :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.travelExpenses }">
                      {{budgetForm.costBudgetList[index].travelExpenses | numTransition}}</span>
                    <span v-else>{{budgetForm.costBudgetList[index].travelExpenses | numTransition}}</span>
                  </span>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">会议费(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item>
                  <span v-if="isEdit">
                    <el-input
                      :disabled='meberEditFlag'
                      v-if="isEdit && isYear && item !== '合计' && item !== '集团批复预算'"
                      v-model="budgetForm.costBudgetList[index].conferenceExpenses"
                      @input="inputHandler('conferenceExpenses', index)"
                      @change="computeSum('conferenceExpenses', index)"
                      @focus="focusHandler('conferenceExpenses',index)"
                      @blur="blurHandler('conferenceExpenses',index)"
                      placeholder="0.000000"
                    ></el-input>
                    <span v-else>{{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}</span>
                  </span>
                  <span v-else>
                    <span
                      v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.conferenceExpenses"
                      :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.conferenceExpenses }">
                      {{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}</span>
                    <span v-else>{{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}</span>
                  </span>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">资产折旧/摊销(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item>
                  <span v-if="isEdit">
                    <el-input
                      :disabled='meberEditFlag'
                      v-if="isEdit && isYear && item !== '合计' && item !== '集团批复预算'"
                      v-model="budgetForm.costBudgetList[index].assetDepreciation"
                      @input="inputHandler('assetDepreciation', index)"
                      @change="computeSum('assetDepreciation', index)"
                      @focus="focusHandler('assetDepreciation',index)"
                      @blur="blurHandler('assetDepreciation',index)"
                      placeholder="0.000000"
                    ></el-input>
                    <span v-else>{{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}</span>
                  </span>
                  <span v-else>
                    <span
                      v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.assetDepreciation"
                      :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.assetDepreciation }">
                      {{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}</span>
                    <span v-else>{{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}</span>
                  </span>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">其他成本(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item>
                  <span v-if="isEdit">
                    <el-input
                      :disabled='meberEditFlag'
                      v-if="isEdit && isYear && item !== '合计' && item !== '集团批复预算'"
                      v-model="budgetForm.costBudgetList[index].otherCosts"
                      @input="inputHandler('otherCosts', index)"
                      @change="computeSum('otherCosts', index)"
                      @focus="focusHandler('otherCosts',index)"
                      @blur="blurHandler('otherCosts',index)"
                      placeholder="0.000000"
                    ></el-input>
                    <span v-else>{{budgetForm.costBudgetList[index].otherCosts | numTransition}}</span></span>
                  <span v-else>
                    <span
                      v-if="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.otherCosts"
                      :class="{'highlightStyle':budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.otherCosts }">
                      {{budgetForm.costBudgetList[index].otherCosts | numTransition}}</span>
                    <span v-else>{{budgetForm.costBudgetList[index].otherCosts | numTransition}}</span>
                  </span>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <td colspan="2" align="center" class="col-title">
                合计(万元)
                <el-tooltip
                  content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工（万元）”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”"
                  placement="top">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </td>
              <td class="data-cell" v-for="(item,index) in budgetForm.costBudgetList" :key="index">
                <el-form-item>
                  <span
                    v-if="budgetForm.costBudgetList[index].undertakeUnitDept !== '集团批复预算'"
                    :class="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.totalAmount ? 'highlightStyle': ''">
                    {{budgetForm.costBudgetList[index].totalAmount | numTransition}}
                  </span>
                  <span v-else :class="budgetForm.costBudgetList[index].highlightProps && budgetForm.costBudgetList[index].highlightProps.totalAmount? 'highlightStyle': ''">{{pfTotalAmount | formatNoData}}</span>
                </el-form-item>
              </td>
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
              <th colspan="2" class="col-title">
                <div class="diagonal">
                  <span class="course">费用科目</span>
                  <span class="department">承担部门</span>
                </div>
              </th>
              <th v-for="(item,index) in undertakeUnitDeptList" :key="index" class="head">
                {{item}}
              </th>
            </tr>

            <tr>
              <td rowspan="2" class="col-title">合作开发费</td>
              <td class="col-title-child" :class="isEdit && isYear ? 'required' : ''"><span>委外(万元)</span></td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child" :class="isEdit && isYear ? 'required' : ''"><span>委内(万元)</span></td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>

            <tr>
              <td rowspan="2" class="col-title">自有人工</td>
              <td class="col-title-child" :class="isEdit && isYear ? 'required' : ''"><span>自有人工(人月)</span></td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">自有人工(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>

            <tr>
              <td rowspan="4" class="col-title">其他</td>
              <td class="col-title-child">差旅费(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">会议费(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">资产折旧/摊销(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>
            <tr>
              <td class="col-title-child">其他成本(万元)</td>
              <td class="data-cell" v-for="(item,index) in undertakeUnitDeptList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>

            <tr>
              <td colspan="2" align="center" class="col-title">
                合计(万元)
                <el-tooltip
                  content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工（万元）”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”"
                  placement="top">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </td>
              <td class="data-cell" v-for="(item,index) in budgetForm.costBudgetList" :key="index">
                <el-form-item><span>-</span></el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import bus from '@/common/bus'
import { addNum } from '@/utils/numberAdd'
export default {
  data () {
    return {
      meberEditFlag: false, //是否团队成员编辑页面
      budgetForm: {
        caption: '1', //TODO
        costBudgetList: []
      },
      pfTotalAmount: '', //集团批复合计
      countKeys: ['budgetOutsourcing', 'budgetInsourcing', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'], // 用来计算列合计
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'], //所有展示的类目
      hideShadow: true
    }
  },
  props: {
    //承担部门
    undertakeUnitDeptList: { type: Array, default: () => [] },
    //该项目是否可编辑，详情还是编辑页面
    isEdit: { type: Boolean, default: false },
    //此年份是否可编辑
    isYear: { type: Boolean, default: true },
    //预算数据
    data: { type: Array, default: () => [] }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.budgetForm.costBudgetList = JSON.parse(JSON.stringify(val))
          this.budgetForm.costBudgetList.forEach(item => {
            if (item.undertakeUnitDept === '集团批复预算') {
              this.pfTotalAmount = item.totalAmount
            }
          })
          this.computedAll()
        }
      }
    }
  },
  methods: {
    // 设置表单必填校验
    setRules (prop, index) {
      if (this.budgetForm.costBudgetList.length > 0) {
        let temp = this.budgetForm.costBudgetList[index][prop]
        let checkEmpty = (rule, value, callback) => {
          if (temp === '' || temp === null || temp === undefined) {
            callback(new Error('该项不能为空'))
          } else {
            callback()
          }
        }
        let rules = [
          { validator: checkEmpty, required: true, message: '该项不能为空', trigger: 'blur' }
        ]
        return rules
      }
    },
    // 补全小数位&计算合计
    computedAll () {
      this.allKeys.forEach(key => {
        this.undertakeUnitDeptList.forEach((y, index) => {
          this.computeSum(key, index, false)
        })
      })
    },
    //输入时限制只能输入固定的小数位，超出位数则无法输入，直接删除掉多余的位数
    inputHandler (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop] + ''
      if (!temp) return
      if (temp.indexOf('.') > -1) {
        let arr = temp.split('.')
        let integer = arr[0] || '0'
        let decimals = arr[arr.length - 1]
        let len = 6
        if (prop === 'staffTime') {
          len = 2
          integer = integer.length > 6 ? integer.slice(0, 6) : integer
        } else {
          integer = integer.length > 11 ? integer.slice(0, 11) : integer
        }
        decimals = decimals.length > len ? decimals.slice(0, len) : decimals
        temp = `${integer}.${decimals}`
      } else {
        if (prop === 'staffTime') {
          temp = temp.length > 6 ? temp.slice(0, 6) : temp
        } else {
          temp = temp.length > 11 ? temp.slice(0, 11) : temp
        }
      }
      temp = temp.replace(/[^\d.]/g, '')
      this.budgetForm.costBudgetList[index][prop] = temp
    },
    //计算合计
    computeSum (prop, index, isChangeValue = true) {
      if (isChangeValue) {
        this.changeInfo()
      }
      this.setNumber(prop, index)
      this.computeColSum() // 计算行合计
      // 计算列合计
      this.budgetForm.costBudgetList.forEach(item => {
        item.totalAmount = '0'
        let budgeSum = '0'
        let rowCount = 0
        this.countKeys.forEach(key => {
          if (item[key] === null || item[key] === undefined) rowCount++
          let num = item[key] || '0'
          budgeSum = this.sumFloat(budgeSum, num)
        })
        item.totalAmount = rowCount === this.countKeys.length ? null : budgeSum
      })
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
    //补齐小数位,val --> string
    getFixedNumNew (val, len = 6) {
      let str = ''
      if (val === null) return
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
    // 计算行合计并追加到undertakeUnitDept=合计的对象中
    computeColSum () {
      if (this.budgetForm.costBudgetList.length === 0) {
        return false
      }
      this.allKeys.forEach(key => {
        this[`${key}Sum`] = '0'
        let colCount = 0
        this.budgetForm.costBudgetList.forEach(item => {
          if (item.undertakeUnitDept !== '合计' && item.undertakeUnitDept !== '集团批复预算') {
            if (item[key] === null || item[key] === undefined) colCount++
            this[`${key}Sum`] = this.sumFloat(this[`${key}Sum`], item[key])
          }
        })
        this.budgetForm.costBudgetList.forEach(item => {
          if (item.undertakeUnitDept === '合计') {
            item[key] = colCount === (this.budgetForm.costBudgetList.length - 2) ? null : this[`${key}Sum`]
          }
        })
      })
    },
    //计算浮点数相加
    sumFloat (num1, num2, prop) {
      let int1 = num1 ? (num1.split('.')[0] || 0) : 0
      let int2 = num2 ? (num2.split('.')[0] || 0) : 0
      let decimal1 = num1 ? (num1.split('.')[1] || 0) : 0
      let decimal2 = num2 ? (num2.split('.')[1] || 0) : 0
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
    //有信息发生修改
    changeInfo (edited = true) {
      let params = {
        curBlock: 'projectBudget',
        hasEdited: edited
      }
      bus.$emit('groupPlanProjectEdit', params)
    },
    async validate () {
      return new Promise((resolve, reject) => {
        if (!this.$refs['budgetForm']) {
          resolve(false)
          return false
        }
        this.$refs['budgetForm'].validate(valid => {
          if (valid) {
            let params = []
            this.budgetForm.costBudgetList.forEach(ele => {
              if (ele.undertakeUnitDept !== '合计' && ele.undertakeUnitDept !== '集团批复预算') {
                params.push(ele)
              }
            })
            resolve(params)
          } else {
            resolve(false)
            return false
          }
        })
      })
    },
    //不检验，直接获取数据
    getAllData () {
      let params = []
      this.budgetForm.costBudgetList.forEach(ele => {
        if (ele.undertakeUnitDept !== '合计' && ele.undertakeUnitDept !== '集团批复预算') {
          params.push(ele)
        }
      })
      return params
    },
    //监听滚动
    scroll (el) {
      if (el.target.scrollLeft === 0) {
        this.hideShadow = true
      } else if (this.hideShadow) {
        this.hideShadow = false
      }
    },
    //输入框获得焦点时，去除补位的0
    focusHandler (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop]
      if (temp === '') return
      this.budgetForm.costBudgetList[index][prop] = this.numTransition(temp)
    },
    //输入框失去焦点时，补位0
    blurHandler (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop]
      if (temp === '') return
      this.budgetForm.costBudgetList[index][prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)
      // console.log(this.budgetForm.costBudgetList[index][prop])
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
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
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
    formatNoData (val) {
      if (val !== null && val !== undefined && val !== '' && val !== 'undefined' && val !== 'null') {
        return addNum(val, 0)
      } else {
        return '-'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.uBudget-table{
  table {
    border-collapse: collapse;
    border-spacing: 0;

    td, th {
      border-bottom: 1px solid #E8E8E8;;
      border-right: 1px solid #E8E8E8;;
    }

    tr > td:first-child, tr > td:first-child {
      border-left: 1px solid #E8E8E8;;
    }

    tr:first-child td, tr:first-child td {
      border-top: 1px solid #E8E8E8;;
    }

    // 对角线
    .diagonal {
      width: 100%;
      height: 100%;
      position: relative;
      box-sizing: border-box;
      background: linear-gradient(9deg, transparent 49.5%, #ddd 49.5%, #ddd 50.5%, transparent 50.5%);

      .course {
        position: absolute;
        bottom: 5px;
        left: 20px;
      }

      .department {
        position: absolute;
        top: 5px;
        right: 20px;
      }
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
        border-right: 1px solid #E8E8E8;
        width: 126px;
        min-width: 126px;
        background: #F4F4F4;
      }

      th:nth-child(1) {
        border-right: 1px solid #E8E8E8;
        padding: 0 !important;
      }

      .data-cell {
        text-align: center;
      }

      td:nth-last-child(2) {
        // min-width: 140px;
        @include color($color-blue);
      }

      &:nth-last-child(1) {
        @include color($color-blue);
        font-weight: bold;
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

  .head {
    min-width: 100px;
  }

  .el-form-item {
    margin: 8px 0 !important;
  }

  .highlightStyle {
    color: #FF3F3B !important;
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
}
</style>
