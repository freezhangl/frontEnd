<template>
  <div class="wrapper">
    <project-panel title="预算信息（万元）" tip="提示：委托函预算通过预期成果自动汇总得出">
      <table v-if="budgetData == !budgetData?false:true">
        <tr class="bgcolor">
          <th colspan="2">科目</th>
          <th>项目总预算</th>
          <th>本委托函预算</th>
        </tr>
        <tr>
          <td rowspan="2" class="bgcolor" style="width:222px;">合作开发费</td>
          <td class="bgcolor" style="width:222px;">委外(万元)</td>
          <td>{{budgetData&&budgetData.projectBudget&&budgetData.projectBudget.budgetOutsourcing | formatterNum}}</td>
          <td>{{budgetData&&budgetData.entrustLetterBudget&&budgetData.entrustLetterBudget.budgetOutsourcing | formatterNum}}</td>
        </tr>
        <tr>
          <td class="bgcolor">委内(万元)</td>
          <td>{{budgetData&&budgetData.projectBudget&&budgetData.projectBudget.budgetInsourcing | formatterNum}}</td>
          <td>{{budgetData&&budgetData.entrustLetterBudget&&budgetData.entrustLetterBudget.budgetInsourcing | formatterNum}}</td>
        </tr>
        <tr>
          <td class="bgcolor">人工成本</td>
          <td class="bgcolor">自有人工预算(人月)</td>
          <td>{{budgetData&&budgetData.projectBudget&&budgetData.projectBudget.staffTime | formatterNum}}</td>
          <td>{{budgetData&&budgetData.entrustLetterBudget&&budgetData.entrustLetterBudget.staffTime | formatterNum}}</td>
        </tr>
        <tr>
          <td class="bgcolor" colspan="2">
            合计：
            <el-tooltip content="注：合计=合作开发费-委外+合作开发费-委内 + 自有人工（人月）*  单位人力成本" placement="top">
              <i class="el-icon-info blue"></i>
            </el-tooltip>
          </td>
          <td class="blue">{{budgetData&&budgetData.projectBudget&&budgetData.projectBudget.subtotal | formatterNum}}</td>
          <td class="blue">{{budgetData&&budgetData.entrustLetterBudget&&budgetData.entrustLetterBudget.subtotal | formatterNum}}</td>
        </tr>
      </table>
    </project-panel>
  </div>
</template>

<script>
import { addNum } from '@/utils/numberAdd'
export default {
  props: {
    'budgetData': { type: Object, default: () => { return {} } }, //传入的外层列表数据
    'receiveData': { type: Array, default: () => [] }
  },
  components: {},
  filters: {
    formatterNum (num) {
      if (typeof num === 'string' && num) {
        return addNum(num, 0)
      } else if (typeof num === 'number') {
        return num
      } else {
        return '-'
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {},
  watch: {
    budgetData: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal) {
          if (!newVal.projectBudget) {
            newVal.projectBudget = {}
          }
          if (!newVal.entrustLetterBudget) {
            newVal.entrustLetterBudget = {}
          }
        }
      }
    },
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length) {
          this.setBudget(val)
        } else {
          this.budgetData.entrustLetterBudget.budgetOutsourcing = null
          this.budgetData.entrustLetterBudget.budgetInsourcing = null
          this.budgetData.entrustLetterBudget.staffTime = null
          this.budgetData.entrustLetterBudget.subtotal = null
        }
      }
    }
  },
  methods: {
    setBudget (val) {
      if (this.budgetData && this.budgetData.entrustLetterBudget) {
        let budget = this.computeBudget(val)
        let entrustBudget = {}
        for (let i = 0; i < val.length; i++) {
          if (val[i].achievementBudgetList) {
            entrustBudget.budgetOutsourcing = addNum(entrustBudget.budgetOutsourcing, val[i].achievementBudgetList[0].budgetList[0].budgetOutsourcing)
            entrustBudget.budgetInsourcing = addNum(entrustBudget.budgetInsourcing, val[i].achievementBudgetList[0].budgetList[0].budgetInsourcing)
          } else {
            entrustBudget.budgetOutsourcing = addNum(entrustBudget.budgetOutsourcing, val[i].budgetOutsourcing)
            entrustBudget.budgetInsourcing = addNum(entrustBudget.budgetInsourcing, val[i].budgetInsourcing)
          }
          entrustBudget.staffTime = addNum(entrustBudget.staffTime, val[i].staffTime)
          entrustBudget.staffTimeVal = addNum(entrustBudget.staffTimeVal, val[i].staffTimeVal)
        }
        entrustBudget.subtotal = addNum(entrustBudget.budgetOutsourcing, entrustBudget.budgetInsourcing)
        entrustBudget.subtotal = addNum(entrustBudget.subtotal, entrustBudget.staffTimeVal)
        this.budgetData.entrustLetterBudget = entrustBudget
      }
    },
    // 自有人工 * 单位人力成本
    computeBudget (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].staffTime && arr[i].achievementDetail) {
          let avgLaborCost = arr[i].achievementDetail.achievementBudgetList[0].budgetList[0].avgLaborCost
          // arr[i].staffTimeVal = arr[i].staffTime * avgLaborCost
          arr[i].staffTimeVal = this.$parent.getAvgLaborCostAndStaffTime(arr[i].staffTime, avgLaborCost)
        } else if (arr[i].staffTime && arr[i].achievementBudgetList) {
          let avgLaborCost = arr[i].achievementBudgetList[0].budgetList[0].avgLaborCost
          arr[i].staffTimeVal = this.$parent.getAvgLaborCostAndStaffTime(arr[i].staffTime, avgLaborCost)
        }
      }
      return arr
    }
  },
  created () {},
  mounted () {},
  beforeCreate () {},
  beforeMount () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {},
  activated () {}
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
table{
  border-collapse: collapse;
  width:100%;
  text-align: center;
  .bgcolor{
    background-color: #F4F4F4;
    font-weight: bold;
  }
  tr{
    height:47px;
    th,td{
      border-bottom:1px solid #E8E8E8;
      border-left: none;
      border-right: 1px solid #E8E8E8;
    }

  }
  .blue{
    @include color()
  }
}
</style>
