<!--
 * @FileDescription: 父项目非一般支撑
 * @Author: 前端 许硕
 * @Author: 后端 吴武刚
 -->
<template>
  <div class="workInformation">
    <div class="timeSheet" style=" margin-top: 20px;">
      <span style="float:right;margin-top: 20px;" class="renyue">(单位:人月)</span>
      <el-table
        :data="tableData"
        border
        :cell-class-name="setCellClassName"
        style="width: 100%"
        align="center"
      >
        <el-table-column
          fixed
          prop="undertakeName"
          label="承担单位"
          min-width="220"
          align="center"
        ></el-table-column>
        <template  v-for="item in totalProjectTimeList">
          <el-table-column
            v-if="item.year"
            :key="item.year"
            :label="item.year + '年度'"
            align="center"
            min-width="307"
            :formatter="formatter"
          >
            <el-table-column
              :prop="'group_' + item.year"
              label="集团批复"
              align="center"
            ></el-table-column>
            <el-table-column
              :prop="'plan_' + item.year"
              label="计划工时"
              align="center"
            ></el-table-column>
            <el-table-column
              :prop="'confirm_' + item.year"
              label="已确认工时"

              align="center"
            ></el-table-column>
          </el-table-column>
        </template>
        <el-table-column
          label="合计"
          min-width="307"
          align="center" >
          <el-table-column
            prop="group_total"
            label="集团批复"
            align="center"
          >
            <template slot-scope="scope">
              <span class="tableRowClassName">{{scope.row.group_total}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="plan_total"
            label="计划工时"
            align="center"
          >
            <template slot-scope="scope">
              <span class="tableRowClassName">{{scope.row.plan_total}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="confirm_total"
            label="已确认工时"
            align="center"
          >
            <template slot-scope="scope">
              <span class="tableRowClassName">{{scope.row.confirm_total}}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_projectSearch'
import { getStore } from '@/store'
import { addNum, deleteZero } from '@/utils/numberAdd'
// import non from './non'
export default {
  name: 'nonSupGeneral',
  data () {
    return {
      tableData: [],
      projectCode: this.$route.params.projectCode || '',
      userInfo: getStore().getters['USERENTITY/userInfo'],
      undertakeList: [],
      projectCodeList: this.$route.params.projectCodeList || '',
      timeYear: this.$route.params.timeYear,
      totalProjectTimeList: {}
    }
  },
  created () {
    this.getProjectInfo()
  },
  methods: {
    formatter (row, column) {
      const { columnKey, property } = column
      const yearData =
        row.projectTimeList.find(item => item.year === columnKey) || {}
      return yearData[property]
    },
    getProjectInfo () {
      let params = {
        projectCode: this.projectCode,
        orgCode: this.$store.getters['USERENTITY/userInfo'].userAuth.orgCode,
        userAccount: this.userInfo.userAuth.uid
      }
      API.getWorkInfo(params)
        .then(res => {
          //最后一行合计
          let rowSum = {
            group_total: 0,
            plan_total: 0,
            confirm_total: 0,
            undertakeName: '合计',
            projectTimeList: []
          }
          res.totalProjectTimeList.forEach(team => {
            rowSum.projectTimeList.push({ group: 0, plan: 0, confirm: 0, year: team.year })
          })
          this.totalProjectTimeList = res.totalProjectTimeList
          this.undertakeList = res.undertakeList
          const { undertakeList, totalProjectTimeList } = res
          const data = undertakeList.map(item => {
            const obj = {
              // 右边的合计数
              group_total: 0,
              plan_total: 0,
              confirm_total: 0
            }
            const { projectTimeList } = item
            if (projectTimeList) {
              projectTimeList.forEach(d => {
                const { year, group, plan, confirm } = d
                // 加个判断 防止totalProjectTimeList和undertakeList里的年份对不上
                if (
                  year &&
                  this.totalProjectTimeList.some(v => v.year === year)
                ) {
                  obj['group_' + year] = group
                  obj['plan_' + year] = plan
                  obj['confirm_' + year] = confirm
                  obj.group_total = addNum(obj.group_total, group)
                  obj.plan_total = addNum(obj.plan_total, plan)
                  obj.confirm_total = addNum(obj.confirm_total, confirm)
                  rowSum.projectTimeList.some(ele => {
                    if (ele.year === year) {
                      ele.group = addNum(ele.group, group)
                      ele.plan = addNum(ele.plan, plan)
                      ele.confirm = addNum(ele.confirm, confirm)
                      return true
                    }
                  })
                  rowSum['group_' + year] = addNum(rowSum['group_' + year], group)
                  rowSum['plan_' + year] = addNum(rowSum['plan_' + year], plan)
                  rowSum['confirm_' + year] = addNum(rowSum['confirm_' + year], confirm)
                }
              })
            }
            return {
              ...item,
              ...obj
            }
          })
          data.forEach(ele => {
            rowSum.group_total = addNum(rowSum.group_total, ele.group_total)
            rowSum.plan_total = addNum(rowSum.plan_total, ele.plan_total)
            rowSum.confirm_total = addNum(rowSum.confirm_total, ele.confirm_total)
          })
          this.tableData = data.concat(rowSum)
          this.totalProjectTimeList = totalProjectTimeList
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: !e.message ? '列表获取失败！' : e.message === '当前用户没有该项目的业务流程权限！' ? '当前用户没有该项目的工时信息查看权限！' : e.message,
            type: 'error',
            showClose: true
          })
        })
    },
    //  获取背景色
    columnStyle ({ row, column, rowIndex, columnIndex }) {
      let lang = this.totalProjectTimeList.length
      if (columnIndex === 0) {
        //第一是列数的下标0
        return 'background: #f4f4f4'
      }
      if (
        columnIndex === lang * 3 + 1 ||
        columnIndex === lang * 3 + 2 ||
        columnIndex === lang * 3 + 3
      ) {
        return 'this.tableRowClassName'
      }
    },
    setCellClassName (row) {
      if (row.columnIndex === 0) {
        return 'firstColumn'
      }
      if (row.rowIndex === this.tableData.length - 1) {
        return 'tableRowClassName'
      }
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return true
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              let num = addNum(prev, curr)
              // let num = (prev * 10) + (curr * 10)
              return num
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px) {
  .timeSheet {
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px) {
  .timeSheet {
    width: 960px !important;
  }
}
.workInformation {
  background: #f6f6f6;
  height: 100%;
  width: 100%;
  .head-navigation {
    height: 50px;
    line-height: 50px;
    width: 100%;
    background: #fff;
    text-align: center;
  }
  .timeSheet {
    padding-left: 30px;
    padding-right: 29px;
    padding-bottom: 40px;
    background: #fff;
    width: 1180px;
    margin: 0 auto;
    box-sizing: border-box;
    // /deep/.el-table {
    //   &::after {
    //     width: 0px !important;
    //   }
    // }
    .renyue {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #595959;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 10px;
    }
    .form {
      padding-top: 34px;
      padding-bottom: 10px;
      height: 22px;
      /deep/.el-form-item {
        line-height: 40px;
        width: 33.3%;
        margin-right: 0px;
        &:first-child {
          .el-form-item__label {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
            text-align: right;
            line-height: 32px;
            height: 32px;
          }
          .el-form-item__content {
            margin-left: 8px;
            span {
              // width: 204px;
              height: 22px;
              display: inline-block;
            }
          }
        }
        &:nth-child(2) {
          // margin-left: 30px;
          .el-form-item__label {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
            text-align: right;
            line-height: 22px;
            width: 108px;
            height: 22px;
          }
          .el-form-item__content {
            margin-left: 8px;
            span {
              // width: 204px;
              height: 22px;
              display: inline-block;
            }
          }
        }
        &:nth-child(3) {
          // margin-left: 28px;
          .el-form-item__label {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
            text-align: right;
            line-height: 22px;
            width: 52px;
            height: 22px;
          }
          // .el-form-item__content {
          // margin-left: 8px;
          // }
        }
      }
    }
  }
}

.el-table /deep/ {
  .firstColumn{
    background: #f4f4f4;
  }
  .tableRowClassName{
    @include color();
  }
}
</style>
