<template>
  <el-table
    :data="data"
    :span-method="arraySpanMethod">
    <el-table-column
      fixed
      prop="underTakeName"
      min-width="110"
      label="承担单位"></el-table-column>
    <el-table-column
      fixed
      prop="demandName"
      min-width="110"
      label="需求单位"></el-table-column>
    <div v-if="data.length">
      <el-table-column
        :label="(yearScope.min+item-1).toString()"
        :key="item"
        align="center"
        prop="costDtos"
        min-width="307"
        v-for="item of (yearScope.max - yearScope.min) + 1">
        <el-table-column prop="blocReplyCost" label="集团批复" min-width="102">
          <template slot-scope="scope"><span :class="{blue:scope.row.demandName === '小计' || scope.row.demandName === '合计'}">{{conView(scope,yearScope.min+item-1,'blocReplyCost')}}</span></template>
        </el-table-column>
        <el-table-column prop="planCost" label="计划成本" min-width="102">
          <template slot-scope="scope"><span :class="{blue:scope.row.demandName === '小计' || scope.row.demandName === '合计'}">{{conView(scope,yearScope.min+item-1,'planCost')}}</span></template>
        </el-table-column>
        <el-table-column prop="actualCost" label="实际成本" min-width="102">
          <template slot-scope="scope"><span :class="{blue:scope.row.demandName === '小计' || scope.row.demandName === '合计'}">{{conView(scope,yearScope.min+item-1,'actualCost')}}</span></template>
        </el-table-column>
      </el-table-column>
    </div>
    <el-table-column
      label="合计"
      align="center"
      prop="costDtos"
      min-width="307">
      <el-table-column prop="jituan_total" label="集团批复"  min-width="102">
        <template slot-scope="scope"><span class="blue">{{conView(scope,'total','blocReplyCost')}}</span></template>
      </el-table-column>
      <el-table-column prop="jihua_total" label="计划成本"  min-width="102">
        <template slot-scope="scope"><span class="blue">{{conView(scope,'total','planCost')}}</span></template>
      </el-table-column>
      <el-table-column prop="shiji_total" label="实际成本"  min-width="102">
        <template slot-scope="scope"><span class="blue">{{conView(scope,'total','actualCost')}}</span></template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import API from '@/serve/API_groupPlan'
import { addNum, deleteZero } from '@/utils/numberAdd'
export default {
  components: {},
  data () {
    return {
      projectCode: this.$route.params.projectCode,
      data: [],
      yearScope: { min: null, max: null }
    }
  },
  computed: {},
  watch: {},
  methods: {
    setData (data) {
      let len = data.length
      if (len) {
        this.yearScope.min = parseInt(data[0].costDtos[0].timeYear)
        this.yearScope.max = parseInt(data[0].costDtos[data[0].costDtos.length - 1].timeYear)
      }
      this.data = data
    },
    // 单元格合并
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      // [列，行]
      if (columnIndex === 0) {
        return [row.span, 1]
      }
      if (columnIndex === 1 && row.underTakeName === '' && row.demandName === '合计') {
        return [1, 2]
      }
    },
    // 数值自定义渲染
    conView (scope, timeYear, type) {
      let len = scope.row.costDtos.length
      if (timeYear === 'total') { // 行合计
        let sum = null
        for (let i = 0; i < len; i++) {
          sum = addNum(sum, scope.row.costDtos[i][type])
        }
        return sum || '-'
      }
      for (let i = 0; i < len; i++) {
        if (scope.row.costDtos[i].timeYear.toString() === timeYear.toString()) {
          if (scope.row.costDtos[i][type] === null) {
            return '-'
          } else {
            return addNum(scope.row.costDtos[i][type], 0)
          }
        }
      }
      return '-'
    },
    //查询数据
    getProjectCostInfo () {
      let params = {
        projectCode: this.projectCode // 项目编码
      }
      API.getSProjectCostInfo(params)
        .then(res => {
          if (res && res.length) {
            this.setData(this.formatter(res))
          } else {
            this.setData([])
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: !e.message ? '服务器异常，请稍后再试！' : e.message === '当前用户没有该项目的业务流程权限！' ? '当前用户没有该项目的成本信息查看权限！' : e.message,
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 格式化数据结构
    formatter (data) {
      data.forEach(item => {
        let subtotal = []
        if (item.sdemandCostDtos.length !== 1) {
          item.sdemandCostDtos.forEach(ite => {
            if (ite.demandName !== '小计') {
              ite.costDtos.forEach((it, index) => {
                if (subtotal[index]) {
                  subtotal[index].blocReplyCost = addNum(subtotal[index].blocReplyCost, it.blocReplyCost)
                } else {
                  subtotal.push({ timeYear: it.timeYear })
                  subtotal[index].blocReplyCost = it.blocReplyCost
                }
              })
            } else if (ite.demandName === '小计') {
              ite.costDtos.forEach((it, index) => {
                it.blocReplyCost = subtotal[index].blocReplyCost
              })
            }
          })
        }
      })
      let formatterData = []
      for (let i = 0; i < data.length; i++) { // 承担部门
        for (let j = 0; j < data[i].sdemandCostDtos.length; j++) { // 需求部门
          formatterData.push({
            underTakeName: data[i].underTakeName,
            span: j === 0 ? data[i].sdemandCostDtos.length : 0,
            ...data[i].sdemandCostDtos[j]
          })
        }
      }
      //最后一行合计行
      let rowSum = {
        underTakeName: '',
        demandName: '合计',
        costDtos: []
      }
      formatterData.forEach(rowData => {
        if (rowData.demandName === '小计') {
          rowData.costDtos.forEach(cost => {
            let index = -1
            let hasThisYear = rowSum.costDtos.some((v, i) => {
              if (v.timeYear === cost.timeYear) {
                index = i
                return true
              }
            })
            if (hasThisYear) {
              rowSum.costDtos[index].blocReplyCost = addNum(rowSum.costDtos[index].blocReplyCost, cost.blocReplyCost)
              rowSum.costDtos[index].planCost = addNum(rowSum.costDtos[index].planCost, cost.planCost)
              rowSum.costDtos[index].actualCost = addNum(rowSum.costDtos[index].actualCost, cost.actualCost)
            } else {
              rowSum.costDtos.push(
                { blocReplyCost: cost.blocReplyCost, planCost: cost.planCost, actualCost: cost.actualCost, timeYear: cost.timeYear }
              )
            }
          })
        }
      })
      formatterData.push(rowSum)
      return formatterData
    }
  },
  created () {},
  mounted () {
    this.getProjectCostInfo()
  },
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
span.blue{
  @include color()
}
/deep/ .el-table__body tr:nth-last-child(1) td:nth-child(1){
  background: #f4f4f4;
}
</style>
