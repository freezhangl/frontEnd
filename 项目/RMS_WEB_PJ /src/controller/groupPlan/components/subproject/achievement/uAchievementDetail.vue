<template>
  <!-- 预期成果需求单位非一般支撑包编辑 -->
  <div class="achievement">
    <projectPanel title="预期成果"  class="addcon" :show-expand='false'>
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
        :table-data="tableDataOut.list"
        :table-cols="tableColsOut"
        max-height="276px"
        :is-pagination="false"
        :row-class-name="setRowClassName"
        :cell-class-name="setCellClassName"
      ></self-table>
      <taskCardu
        @handleClick='handleClick'
        v-if="isListOrCard === 2"
        :table-data="tableDataOut.list"
        :meber-edit-flag='true'></taskCardu>
    </projectPanel>
    <!-- 详情弹框 -->
    <aDialogDetail ref="aDialogDetail"></aDialogDetail>
  </div>
</template>
<script>

import selfTable from '../../../../../components/table/index'
import projectPanel from '../../../../components/projectPanel/index'
import aDialogDetail from './aDialogDetail'
import taskCardu from './taskCardu'
export default {
  components: { projectPanel, selfTable, aDialogDetail, taskCardu },
  props: {
    //传入的外层列表数据
    receiveData: {
      type: Array,
      default: () => []
    },
    projectBaseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isListOrCard: 1,
      tableDataOut: { //外层详情表格数据
        list: []
      },
      tableColsOut: [
        {
          label: '任务名称',
          prop: 'achievementName',
          type: 'link',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false,
          handleClick: this.handleClick,
          itemClass: this.itemClass
        }, {
          label: '成果类型',
          prop: 'achievementTypeValue',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '需求单位',
          prop: 'demandUnit',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '需求部门',
          prop: 'demandUnitDept',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '成果需求人',
          prop: 'demandUnitResponsibleName',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '承担部门',
          prop: 'undertakeUnitDept',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '成果负责人',
          prop: 'responsiblePerson',
          align: 'left',
          overflow: true,
          resizable: false
        }
      ],
      planRangeTime: [],
      planYearRange: [],
      rowClass: []
    }
  },
  watch: {
    receiveData: { //成果列表
      deep: true,
      immediate: true,
      handler: function (val, oldVal) { //有数据接收后初始化数据
        this.tableDataOut.list = val
      }
    },
    projectBaseInfo: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.planRangeTime = [val.planApprovalTime, val.planFinishTime]
        let tempYear = []
        let parseYear = [new Date(this.planRangeTime[0])
          .getFullYear(), new Date(this.planRangeTime[1])
          .getFullYear()]
        for (let i = parseYear[0]; i <= parseYear[1]; i++) {
          tempYear.push(i.toString())
        }
        this.planYearRange = tempYear
      }
    }
  },
  mounted () {
  },
  methods: {
    cutCardOrList (val) {
      this.isListOrCard = val
    },
    itemClass (row) {
      return 'hover'
    },
    handleClick (row) { //点击任务名称弹出研究任务及预期详情弹框
      this.$refs.aDialogDetail.acceptData(row, 'u', 'detail', this.planYearRange)
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
       (columnIndex === 1 && row.highlightProps.achievementName) ||
       (columnIndex === 2 && row.highlightProps.achievementTypeValue) ||
       (columnIndex === 3 && row.highlightProps.demandUnit) ||
       (columnIndex === 4 && row.highlightProps.demandUnitDept) ||
       (columnIndex === 5 && row.highlightProps.demandUnitResponsibleName) ||
       (columnIndex === 6 && row.highlightProps.undertakeUnitDept) ||
       (columnIndex === 7 && row.highlightProps.responsiblePerson)
      ) {
        className = 'highlightStyle'
      }
      return className
    }
  }
}
</script>
<style lang="scss">
.achievement{
    /deep/ .el-table--border{
    border-top: 0;
    td {
      border: none;
    }
  }
  .expectTime{
    .el-form-item__label{
      line-height: 20px;
    }
  }
  .addcon{
    // margin-bottom: 20px;
    border: 1px solid #E9E9E9;
  }
  .project-panel .panel-body{
      margin-bottom: 0 !important;
    }
  .addcon /deep/{
    .project-panel .panel-body.is-expand {
      padding: 10px 20px 10px 20px!important;
      height: auto;
    }
    .project-panel .panel-body{
      margin-bottom: 0px !important;
    }
  }
  .budget-body{
    overflow-x: auto;
    width: 100%;
    .tabIndex {
      font-size: 18px;
      text-align: center;
      padding-bottom: 16px;
      font-weight: bold;
    }
  }
   /deep/ .hover{
     @include color();
        // color: #0b82ff;
        &:hover{
          @include color();
          // color: #0b82ff,
        }
        cursor: pointer
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
