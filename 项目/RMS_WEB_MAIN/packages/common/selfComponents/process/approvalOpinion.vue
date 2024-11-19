<!--审批意见组件-->
<template>
  <div class="approvalOpinion">
    <project-panel title="审批意见" :show-expand="showExpand">
      <div class="approvalOpinion_body">
        <el-table
          :row-class-name="tableRowClass"
          :data="businessOpinionsList"
          :span-method="arraySpanMethod">
          <el-table-column
            prop="segment"
            label="审批环节"
            width="180"
            class-name="segment">
          </el-table-column>
          <el-table-column
            v-if="leaderShow"
            prop="leaderFlag"
            label="领导标识">
          </el-table-column>
          <el-table-column
            prop="approvalOpinion"
            label="审批意见">
          </el-table-column>
          <el-table-column
            prop="activityNodeName"
            overflow=true
            label="处理节点">
          </el-table-column>
          <el-table-column
            prop="approverName"
            label="审批人"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createdDate"
            label="时间"
            class-name="createdDate"
            width="180">
            <template slot-scope="scope">{{ scope.row.createdDate | formatDate }}</template>
          </el-table-column>
        </el-table>
      </div>
    </project-panel>
  </div>
</template>
<script>
import { formatDate } from '@lib/common/util/common'
export default {
  name: 'approvalOpinion',
  props: {
    businessOpinionsArray: { type: Array, default: () => [] },
    showExpand: { type: Boolean, default: true }
  },
  data () {
    return {
      businessOpinionsList: [],
      loading: false,
      arr: [],
      leaderShow: false
    }
  },
  watch: {
    businessOpinionsArray: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.businessOpinionsList = val
          this.getIndex()
        }
      }
    }
  },
  mounted () {
    // this.getIndex()
  },
  methods: {
    tableRowClass (val) {
      if (val.row.leaderFlag === '1') {
        return 'showBold'
      } else {
        return ''
      }
    },
    // 处理后台返回的数据为最终展示的数据
    getIndex () {
      let arr = []
      let s = 0
      let table = this.businessOpinionsList
      let getTable = []
      table.forEach((item, i, data) => {
        // 第一次从第0行开始合并，第二次合并的开始位置是第一次的位置加上合并数
        if (arr.length) {
          s = arr[arr.length - 1].row + data[i - 1].approvalRecordList.length
        }
        arr.push({
          row: s, // 保存表格合并的起始行（从哪一行开始）
          index: item.approvalRecordList.length //每次需要合并几行
        })
        if (item.approvalRecordList) {
          item.approvalRecordList.forEach(subItem => {
            // 把原始数据里的子数据提取出来，生成新的表格数据
            getTable.push({
              segment: item.segment,
              leaderFlag: subItem.leaderFlag,
              approverName: subItem.approverName,
              activityNodeName: subItem.activityNodeName,
              approvalOpinion: subItem.approvalOpinion,
              createdDate: parseInt(subItem.createdDate)
            })
          })
        }
      })
      this.arr = arr
      this.businessOpinionsList = getTable
    },
    // 合并表格方法
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let obj = [0, 0]
        this.arr.some(v => {
          if (rowIndex === v.row) {
            obj = [v.index, 1]
          }
        })
        return obj
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.approvalOpinion {
  // box-shadow: 0 4px 4px 0 rgba(220,223,230,0.50);
  border-radius: 2px;
  margin: 20px 0;
  /deep/ .project-panel {
    .panel-body {
      .el-table .showBold{
        font-weight: bold;
        color: #333;
      }
      .el-table {
        .el-table__header-wrapper {
          .el-table__header {
            tr {
              th {
                border-top: 1px solid #E8E8E8;
              }
              th.segment {
                border-left: 1px solid #E8E8E8;
              }
              th.createdDate {
                border-right: 1px solid #E8E8E8;
              }
            }
          }
        }
        .el-table__body-wrapper {
          tr.el-table__row {
            td.createdDate {
              border-right: 1px solid #E8E8E8;
            }
            td.segment {
              background-color: #F4F4F4;
              border-left: 1px solid #E8E8E8;
              border-right: 1px solid #E8E8E8;
              font-weight: bold;
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>
