<template>
  <!-- 父项目-预算组件-一般支撑包 -->
  <div class="project-budget">
    <project-panel
      title="预算信息"
      :show-expand="showExpand"
      :tips="tips"
      :tip-language="language">
      <div class="budget-body">
        <table
          class="budget-con"
          border="1"
          cellpadding="0"
          cellspacing="0">
          <tr>
            <th class="col-title" colspan="2"></th>
            <th colspan="2">合作开发费（万元）</th>
            <th rowspan="2">自有人工(人月)</th>
            <th rowspan="2">
              合计（万元）
              <el-tooltip content="注:年度合计=合作开发费-委内+合作开发费-委外 + 自有人工（人月）* 单位人力成本" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </th>
          </tr>
          <tr>
            <th>需求单位</th>
            <th>承担单位</th>
            <th>合作开发费-委外（万元）</th>
            <th>合作开发费-委内（万元）</th>
          </tr>
          <tbody>
            <tr v-for="(item, i) in costBudgetList" :key="i">
              <td class="data-cell" :class="{'highlightStyle':item.highlightProps && item.highlightProps.demandUnit}">{{item.demandUnit | numTransition}}</td>
              <td class="data-cell" :class="{'highlightStyle':item.highlightProps && item.highlightProps.undertakeUnit}">{{item.undertakeUnit | numTransition}}</td>
              <td class="data-cell" :class="{'highlightStyle':item.highlightProps && item.highlightProps.budgetOutsourcing}">{{item.budgetOutsourcing | numTransition}}</td>
              <td class="data-cell" :class="{'highlightStyle':item.highlightProps && item.highlightProps.budgetInsourcing}">{{item.budgetInsourcing | numTransition}}</td>
              <td class="data-cell" :class="{'highlightStyle':item.highlightProps && item.highlightProps.staffTime}">{{item.staffTime | numTransition}}</td>
              <td class="data-cell sub-bule" :class="{'highlightStyle':item.highlightProps && item.highlightProps.totalAmount}">{{item.totalAmount | numTransition}}</td>
            </tr>
          </tbody>
        </table>
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
      costBudgetList: [],
      language: '预算信息中没有基线字段；'
    }
  },
  props: {
    budgetInfo: {},
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
    budgetInfo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.costBudgetList = newValue
        }
      }
    }
  },
  methods: {
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
    // 计算合计并将合计追加到当前对象
    getColTotal () {
      this.costBudgetList.forEach(item => {
        let sum = '0'
        for (var key in item) {
          if (key !== 'undertakeUnit' && key !== 'demandUnit') { sum = this.sumFloat(sum, item[key]) }
        }
        item.total = sum
      })
    }
  },
  mounted () {
  },
  created () {
    // this.getColTotal()
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
    border-collapse: collapse;
    border: 1px solid #E8E8E8;
    .el-icon-info{
      @include color();
    }
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
        text-align: center;
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
    @include color();
  }

  .highlightStyle{
    color: #FF3F3B !important;
  }
}
</style>
