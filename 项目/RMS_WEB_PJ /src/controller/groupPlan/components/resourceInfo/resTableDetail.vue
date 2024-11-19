<template>
  <div class="res-table-detail">
    <project-panel :title="title" :show-expand='false'>
      <self-table
        :table-data="tableData"
        :table-cols="tableCols"
        :is-pagination="false"
        :row-class-name="setRowClassName"
        :cell-class-name="setCellClassName"
      ></self-table>
    </project-panel>
  </div>
</template>

<script>
import selfTable from '@/components/table/index'
import projectPanel from '@/controller/components/projectPanel'
export default {
  components: { selfTable, projectPanel },
  data () {
    return {
      tableData: [],
      tableCols: [
        {
          label: '环境',
          prop: 'resourceEnvironmentValue',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false,
          padding: true
        }
      ],
      machineCols: [
        {
          label: 'CPU(核)',
          prop: 'cpuCoreNumber',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '内存(G)',
          prop: 'ramSize',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '硬盘(G)',
          prop: 'hardDiskSize',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        }
      ],
      storageCols: [
        {
          label: 'NSA存储容量(T)',
          prop: 'nsaCapacity',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '对象存储容量(T)',
          prop: 'objectStorageCapacity',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        }
      ],
      rowClass: []
    }
  },
  props: {
    title: { type: String, default: '' },
    resourceType: { type: String, default: '' },
    receiveData: { type: Array, default: () => [] }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.tableData = JSON.parse(JSON.stringify(val))
        }
      }
    },
    resourceType: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val === 'storage') {
          this.tableCols = this.tableCols.concat(this.storageCols)
        } else {
          this.tableCols = this.tableCols.concat(this.machineCols)
        }
      }
    }
  },
  methods: {
    setRowClassName ({ row, rowIndex }) {
      let className = ''
      if (row.highlightProp) {
        if (rowIndex > 0 && this.rowClass[rowIndex - 1]) {
          className = 'highlight-border highlight-border-none-top'
        } else {
          className = 'highlight-border'
        }
      }
      this.rowClass[rowIndex] = className
      return className
    },
    setCellClassName ({ row, column, rowIndex, columnIndex }) {
      let className = ''
      if (!row.highlightProps) return className
      if (row.resourceType !== 'RT_STORAGE') {
        if (
          (columnIndex === 0 && row.highlightProps.resourceEnvironment) ||
          (columnIndex === 1 && row.highlightProps.cpuCoreNumber) ||
          (columnIndex === 2 && row.highlightProps.ramSize) ||
          (columnIndex === 3 && row.highlightProps.hardDiskSize)
        ) {
          className = 'highlightStyle'
        }
      } else {
        if (
          (columnIndex === 0 && row.highlightProps.resourceEnvironment) ||
          (columnIndex === 1 && row.highlightProps.nsaCapacity) ||
          (columnIndex === 2 && row.highlightProps.objectStorageCapacity)
        ) {
          className = 'highlightStyle'
        }
      }
      return className
    }
  }
}
</script>

<style lang="scss" scoped>
.res-table-detail /deep/ {
  border: 1px solid #E9E9E9;
  margin-bottom: 20px;
  .panel-body{
    margin-bottom: 10px;
  }
  .panel-header{
    border-bottom-color: #E9E9E9;
  }

  .highlightStyle{
    color: #FF3F3B;
    .hover{
      color: #FF3F3B !important;
    }
    span{
      color: #FF3F3B;
    }
  }

  .el-table .el-table__row.highlight-border{
    td{
      position: relative;
      z-index: 1000;
      border-top: 1px solid #ff3f3b;
      border-bottom: 1px solid #FF3F3B !important;
      &:nth-child(1){
        border-left: 1px solid #FF3F3B;
      }
      &:nth-last-child(1){
        border-right: 1px solid #FF3F3B;
      }
    }
    &.highlight-border-none-top td{
      border-top: 1px solid #EBEEF5;
    }
  }
}
</style>
