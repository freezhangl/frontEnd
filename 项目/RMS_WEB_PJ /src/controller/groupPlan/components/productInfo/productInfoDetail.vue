<template>
  <div class="productInfo-detail">
    <projectPanel title="产品信息">
      <template v-slot:header>
        <section class="radio-box">
          <img
            v-if="isListOrCard === 1"
            class="small-img"
            src="@/assets/icons/listChecked.svg"
          />
          <img
            v-else
            class="small-img"
            src="@/assets/icons/listNoChecked.svg"
            @click="cutCardOrList(1)"
          />
          <img
            v-if="isListOrCard === 2"
            class="small-img"
            src="@/assets/icons/cardChecked.svg"
          />
          <img
            v-else
            class="small-img"
            src="@/assets/icons/cardNoChecked.svg"
            @click="cutCardOrList(2)"
          />
        </section>
      </template>
      <self-table
        v-if="isListOrCard === 1"
        index-title='序号'
        :is-index='true'
        :table-data="tableData"
        :table-cols="tableCols"
        max-height="276px"
        :is-pagination="false"
        :index-method="setIndexMethod"
        :row-class-name="setRowClassName"
        :cell-class-name="setCellClassName"
      ></self-table>
      <product-info-card
        v-if="isListOrCard === 2"
        :table-data="tableData"
        :meber-edit-flag='true'>
      </product-info-card>
    </projectPanel>
  </div>
</template>

<script>
import selfTable from '@/components/table/index'
import projectPanel from '@/controller/components/projectPanel'
import ProductInfoCard from './productInfoCard.vue'
export default {
  data () {
    return {
      isListOrCard: 1,
      tableData: [],
      tableCols: [
        {
          label: '产品树年份',
          prop: 'timeYear',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '产品线名称',
          prop: 'productLineName',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '产品名称',
          prop: 'productName',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false
        },
        {
          label: '子产品名称',
          prop: 'subProductName',
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
    }
  },
  components: { selfTable, projectPanel, ProductInfoCard },
  methods: {
    //切换卡片和列表
    cutCardOrList (val) {
      this.isListOrCard = val
    },
    //设置表格序号
    setIndexMethod (index) {
      return index < 9 ? ('0' + (index + 1)) : index + 1
    },
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
      if (
        (columnIndex === 0 && row.highlightProp) ||
       (columnIndex === 1 && row.highlightProps.timeYear) ||
       (columnIndex === 2 && row.highlightProps.productLineName) ||
       (columnIndex === 3 && row.highlightProps.productName) ||
       (columnIndex === 4 && row.highlightProps.subProductName)
      ) {
        className = 'highlightStyle'
      }
      return className
    }
  }
}
</script>

<style lang="scss" scoped>
.productInfo-detail /deep/{
  .radio-box {
    height: 30px;
    margin-left: 10px;
    .small-img {
      width: 30px;
      height: 30px;
    }
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
