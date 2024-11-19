<template>
  <div class="project-budget">
    <project-panel title="项目预算" @changeExpand="changeExpand" :show-expand="showExpand">
      <div class="budget-body">
        <el-form
          ref="budgetForm"
          :model="budgetForm"
          :inline="true">
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
                    <el-form-item
                      prop="budgetOutsourcing"
                      :class="{'highlightStyle':getHighlightStyle(index,'budgetOutsourcing')}">
                      {{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}
                    </el-form-item>
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('budgetOutsourcing')}">{{budgetOutsourcingSum | numTransition}}</td>
                  <td
                    rowspan="2"
                    class="left-b data-cell"
                    :class="{'highlightStyle':getRowHighlightStyleAll('budgetOutsourcing')}"
                    v-if="isShowProjectCol">{{allProject.budgetOutsourcing | numTransition}}</td>
                </tr>
                <tr>
                  <td class="required col-title"><span>委内(万元)</span></td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item
                      prop="budgetInsourcing"
                      :class="{'highlightStyle':getHighlightStyle(index,'budgetInsourcing')}">
                      {{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}
                    </el-form-item>
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('budgetInsourcing')}">{{budgetInsourcingSum | numTransition}}</td>
                </tr>

                <tr>
                  <td rowspan="2" class="col-title">人工预算</td>
                  <td class="required col-title"><span>自有人工(人月)</span></td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item
                      prop="staffTime"
                      :class="{'highlightStyle':getHighlightStyle(index,'staffTime')}">
                      {{budgetForm.costBudgetList[index].staffTime | numTransition}}
                    </el-form-item>
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('staffTime')}">{{staffTimeSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell" :class="{'highlightStyle':getRowHighlightStyleAll('staffTime')}">{{allProject.staffTime | numTransition}}</td>
                </tr>
                <tr>
                  <td class="col-title">自有人工成本(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item :class="{'highlightStyle':getHighlightStyle(index,'laborCosts')}">
                      {{budgetForm.costBudgetList[index].laborCosts | numTransition}}
                    </el-form-item>
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('laborCosts')}">{{laborCostsSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell" :class="{'highlightStyle':getRowHighlightStyleAll('laborCosts')}">{{allProject.laborCosts | numTransition}}</td>
                </tr>

                <tr>
                  <td rowspan="4" class="col-title">其他</td>
                  <td class="col-title">差旅费(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item :class="{'highlightStyle':getHighlightStyle(index,'travelExpenses')}">
                      {{budgetForm.costBudgetList[index].travelExpenses | numTransition}}
                    </el-form-item>
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('travelExpenses')}">{{travelExpensesSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell" :class="{'highlightStyle':getRowHighlightStyleAll('travelExpenses')}">{{allProject.travelExpenses | numTransition}}</td>
                </tr>
                <tr>
                  <td class="col-title">会议费(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item :class="{'highlightStyle':getHighlightStyle(index,'conferenceExpenses')}">
                      {{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}
                    </el-form-item>
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('conferenceExpenses')}">{{conferenceExpensesSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell" :class="{'highlightStyle':getRowHighlightStyleAll('conferenceExpenses')}">{{allProject.conferenceExpenses | numTransition}}</td>
                </tr>
                <tr>
                  <td class="col-title">资产折旧/摊销(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item :class="{'highlightStyle':getHighlightStyle(index,'assetDepreciation')}">
                      {{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}
                    </el-form-item>
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('assetDepreciation')}">{{assetDepreciationSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell" :class="{'highlightStyle':getRowHighlightStyleAll('assetDepreciation')}">{{allProject.assetDepreciation | numTransition}}</td>
                </tr>
                <tr>
                  <td class="col-title">其他成本(万元)</td>
                  <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                    <el-form-item :class="{'highlightStyle':getHighlightStyle(index,'otherCosts')}">
                      {{budgetForm.costBudgetList[index].otherCosts | numTransition}}
                    </el-form-item>
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('otherCosts')}">{{otherCostsSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell" :class="{'highlightStyle':getRowHighlightStyleAll('otherCosts')}">{{allProject.otherCosts | numTransition}}</td>
                </tr>

                <tr>
                  <td colspan="2" align="center" class="col-title">
                    合计(万元)
                    <el-tooltip content="合计=“合作开发费-委内”+“合作开发费-委外”+“自有人工成本”+“差旅费”+“会议费”+“资产折旧/摊销”+“其他成本”" placement="top">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </td>
                  <td
                    class="data-cell"
                    v-for="(item,index) in yearRange"
                    :key="index"
                    :class="{'highlightStyle':item&&item.highlightProps&&item.highlightProps.totalAmount}">
                    {{budgetForm.costBudgetList[index].totalAmount | numTransition}}
                  </td>
                  <td class="data-cell" :class="{'highlightStyle':getRowHighlightStyle('totalAmount')}">{{allSum | numTransition}}</td>
                  <td v-if="isShowProjectCol" class="data-cell" :class="{'highlightStyle':getRowHighlightStyleAll('totalAmount')}">{{allProject.totalAmount | numTransition}}</td>
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
      allSum: '0', //总合计
      yearRange: [],
      hideShadow: true,
      isShowProjectCol: true
      // receiveData: []
    }
  },
  props: {
    receiveData: {
      type: Array,
      default: () => []
    },
    showExpand: {
      type: Boolean,
      default: true
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
        return '-'
      }
    }
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
    analyzeData () {
      //初始化清空默认数据
      this.yearRange = []
      this.budgetForm.costBudgetList = this.receiveData
      this.budgetForm.costBudgetList.forEach(item => {
        if (item && item.timeYear !== 'ALL') {
          this.yearRange.push(item.timeYear)
        } else {
          this.allProject = item
        }
      })
      this.allKeys.forEach(key => {
        this[`${key}Sum`] = ''
        let nullCount = 0
        this.yearRange.forEach(y => {
          this.budgetForm.costBudgetList.some(item => {
            if (item && item.timeYear === y) {
              this[`${key}Sum`] = this.sumFloat(this[`${key}Sum`], item[key], key) //行合计
              return true
            }
          })
        })
      })
      this.allSum = '0'
      this.budgetForm.costBudgetList.forEach(item => {
        if (item && item.timeYear !== 'ALL') {
          this.allSum = this.sumFloat(this.allSum, item.totalAmount)
        }
      })
    },
    changeExpand (isExpand) {
      this.$emit('changeExpand', isExpand)
    },
    getHighlightStyle (index, prop) {
      if (this.budgetForm.costBudgetList[index].highlightProps && this.budgetForm.costBudgetList[index].highlightProps[prop]) {
        return true
      } else {
        return false
      }
    },
    getRowHighlightStyle (prop) {
      let flag = false
      this.budgetForm.costBudgetList.forEach(item => {
        if (item && item.highlightProps && item.highlightProps[prop] && item.timeYear !== 'ALL') {
          flag = true
          return false
        }
      })
      return flag
    },
    getRowHighlightStyleAll (prop) {
      let flag = false
      this.budgetForm.costBudgetList.forEach(item => {
        if (item && item.timeYear === 'ALL') {
          if (item.highlightProps && item.highlightProps[prop]) {
            flag = true
            return false
          }
        }
      })
      return flag
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
      .sum-w {
        min-width: 180px;
      }
      .all-w {
        min-width: 140px;
      }
      .left-b {
        border-left: 1px solid #E8E8E8;
      }
      // td:nth-last-child(1){
      //   min-width: 140px;
      //   @include color($color-blue);
      // }
      &:nth-last-child(1){
        @include color($color-blue);
        font-weight: bold;
      }
    }
    .el-form-item{
      margin-bottom: 0;
      margin-right: 0;
      /deep/ .el-form-item__content{
        width: 220px;
      }
      &.highlightStyle /deep/ .el-form-item__content{
        color: #FF3F3B;
      }
    }
    .highlightStyle{
      color: #FF3F3B !important;
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
