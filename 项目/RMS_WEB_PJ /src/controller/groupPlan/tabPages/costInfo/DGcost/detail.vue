<template>
  <el-table :data="data.entrustLetterDtos" :span-method="arraySpanMethod">
    <el-table-column
      prop="taskName"
      class-name="is-leaf"
      label="任务名称">
    </el-table-column>
    <el-table-column
      prop="letterState"
      class-name="is-leaf"
      label="状态">
      <template slot-scope="scope">
        <span>{{scope.row.letterState | status}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="initiatedDate"
      class-name="is-leaf"
      label="下达日期">
      <template slot-scope="scope">
        <span>{{timestampToDate(scope.row.initiatedDate)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="blocReplyCost"
      align="center"
      label="集团批复">
      <el-table-column
        prop="blocReplyCost"
        :label="data.budget"
        align="center">
        <template slot="header" :class="scope" slot-scope="scope">
          <span>{{data.budget | deleteZero}}
          </span>
          <el-tooltip content="项目总预算" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span>{{scope.row.blocReplyCost | deleteZero}}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column
      prop="planCost"
      align="center"
      label="计划成本">
      <el-table-column
        prop="planCost"
        :label="''"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.planCost | deleteZero}}</span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column
      prop="actualCost"
      align="center"
      label="实际成本">
      <el-table-column
        prop="actualCost"
        :label="''"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.actualCost | deleteZero}}</span>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import timeFun from '@/utils/DateTimeUtils.js'
import API from '@/serve/API_groupPlan'
import { addNum, deleteZero } from '@/utils/numberAdd'
export default {
  components: {},
  data () {
    return {
      projectCode: this.$route.params.projectCode,
      data: {},
      footerData: [ {
        taskName: '剩余预算',
        letterState: '',
        initiatedDate: '',
        blocReplyCost: '',
        planCost: '-',
        actualCost: '-'
      } ]
    }
  },
  filters: {
    status (code) {
      switch (code) {
        case '1':
          return '草稿'
        case '2':
          return '申请审批中'
        case '3':
          return '执行中'
        case '4':
          return '验收审批中'
        case '5':
          return '已完成'
      }
    },
    deleteZero (n) {
      return deleteZero(n)
    }
  },
  computed: {},
  watch: {},
  methods: {
    timestampToDate (param) {
      return timeFun.timestampToDate(param)
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row.taskName === '小计' || row.taskName === '剩余预算') {
        if (columnIndex === 0) {
          return [1, 3]
        } else if (columnIndex === 1 || columnIndex === 2) {
          return [0, 0]
        }
      }
    },
    //查询数据
    getDGProjectCostInfo () {
      let params = {
        projectCode: this.projectCode // 项目编码
      }
      API.getDGProjectCostInfo(params)
        .then(res => {
          if (res && res.entrustLetterDtos && res.entrustLetterDtos.length) {
            for (let i = 0; i < res.entrustLetterDtos.length; i++) {
              res.entrustLetterDtos[i] = { ...res.entrustLetterDtos[i].costDto, ...res.entrustLetterDtos[i] }
            }
            this.footerData[0].blocReplyCost = res.restBudget
            res.entrustLetterDtos = res.entrustLetterDtos.concat(this.footerData)
            this.data = res
          } else {
            this.data = {}
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
    }
  },
  created () { this.getDGProjectCostInfo() },
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
.el-table /deep/{
  .el-table__header-wrapper th{
    background-color:#f4f4f4 !important;
  }
  .el-table__body tr{
    td.is-leaf{
      background-color:#f4f4f4;
    }
    &:hover > td{
      background-color:transparent !important;
      &.is-leaf{
        background-color:#f4f4f4 !important;
      }
    }
    &:nth-last-child(2),&:nth-last-child(1){
      div{
        text-align: center;
        @include color();
      }
      td.is-leaf div{
        color: rgba(0,0,0,0.85);
        font-weight: bold;
      }
    }

  }
}
.el-icon-info{
  @include color();
}
</style>
