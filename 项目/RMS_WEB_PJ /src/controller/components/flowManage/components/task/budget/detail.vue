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
                <el-form-item :rules="setRules('budgetOutsourcing',index)" prop="budgetOutsourcing">
                  <span>{{budgetForm.costBudgetList[index].budgetOutsourcing | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{budgetOutsourcingSum}}</td> -->
            </tr>
            <tr>
              <td class="required col-title"><span>委内(万元)</span></td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :rules="setRules('budgetInsourcing',index)" prop="budgetInsourcing">
                  <span>{{budgetForm.costBudgetList[index].budgetInsourcing | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{budgetInsourcingSum}}</td> -->
            </tr>

            <tr>
              <td rowspan="2" class="col-title">人工预算</td>
              <td class="required col-title"><span>自有人工预算(人月)</span></td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item :rules="setRules('staffTime',index)" prop="staffTime">
                  <span>{{budgetForm.costBudgetList[index].staffTime | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{staffTimeSum}}</td> -->
            </tr>
            <tr>
              <td class="col-title">自有人工成本(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item>
                  <span>{{budgetForm.costBudgetList[index].laborCosts | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{laborCostsSum}}</td> -->
            </tr>

            <tr>
              <td rowspan="4" class="col-title">其他</td>
              <td class="col-title">差旅费(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item>
                  <span>{{budgetForm.costBudgetList[index].travelExpenses | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{travelExpensesSum}}</td> -->
            </tr>
            <tr>
              <td class="col-title">会议费(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item>
                  <span>{{budgetForm.costBudgetList[index].conferenceExpenses | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{conferenceExpensesSum}}</td> -->
            </tr>
            <tr>
              <td class="col-title">资产折旧/摊销(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item>
                  <span>{{budgetForm.costBudgetList[index].assetDepreciation | numTransition}}</span>
                </el-form-item>
              </td>
              <!-- <td>{{assetDepreciationSum}}</td> -->
            </tr>
            <tr>
              <td class="col-title">其他成本(万元)</td>
              <td class="data-cell" v-for="(item,index) in yearRange" :key="index">
                <el-form-item>
                  <span>{{budgetForm.costBudgetList[index].otherCosts | numTransition}}</span>
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
                {{item.totalAmount | numTransition}}
              </td>
              <!-- <td>{{allSum}}</td> -->
            </tr>
          </table>
        </el-form>
        <div class="con" style="margin-top:20px">
          <el-form
            :model="ruleForm"
            :inline="false"
            label-position='right'
            ref="ruleForm"
            label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item
                  :inline="false"
                  label-width="140px"
                  label="任务描述及要求:"
                  prop="taskDesAndRequire"
                  :rules="[
                    { required: true}
                  ]"
                >
                  {{info.taskDesAndRequire}}
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
                  :rules="[
                    { required: true}
                  ]"
                >
                  {{info.demandRisk}}
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
                  :rules="[
                    { required: true}
                  ]"
                >
                  {{info.resultInformation}}
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
                  {{info.remark}}
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
      ruleForm: {
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
      yearRange: []
      // receiveData: []
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
        this.analyzeData()
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
    initInfo () {
      this.ruleForm.taskDesAndRequire = this.info.taskDesAndRequire
      this.ruleForm.demandRisk = this.info.demandRisk
      this.ruleForm.resultInformation = this.info.resultInformation
      this.ruleForm.remark = this.info.remark
    },
    sumFloat (num1, num2, prop) {
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
    // 设置表单必填校验
    setRules (prop, index) {
      let temp = this.budgetForm.costBudgetList[index][prop]
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
    analyzeData () {
      //初始化清空默认数据
      this.yearRange = []
      this.budgetForm.costBudgetList = JSON.parse(JSON.stringify(this.receiveData))
      this.budgetForm.costBudgetList.forEach(item => {
        this.yearRange.push(item.timeYear)
      })
      this.budgetForm.costBudgetList.forEach(item => {
        let total = ''
        for (let key in item) {
          if (key !== 'staffTime' && key !== 'timeYear') {
            total = this.sumFloat(total, item[key])
          }
        }
        item.totalAmount = total
      })
    }
  },
  mounted () {
    this.initInfo()
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
      th:nth-child(1){
        border-right: 1px solid #E8E8E8;
      }
      .data-cell{
        text-align: center;
      }
      .title-color-blue {
        @include color($color-blue);
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
    // .el-form-item .el-input__inner{
    //       width : 100%;
    // }
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
}
</style>
