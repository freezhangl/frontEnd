<template>
  <!-- 预期成果详情 -->
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
      <taskCard
        @handleClick='handleClick'
        v-if="isListOrCard === 2"
        :table-data="tableDataOut.list"
        :meber-edit-flag='true'></taskCard>
    </projectPanel>
    <!-- 详情弹框 -->
    <aDialogDetail ref="aDialogDetail"></aDialogDetail>
  </div>
</template>
<script>
import selfTable from '../../../../../components/table/index'
import projectPanel from '../../../../components/projectPanel/index'
import aDialogDetail from './aDialogDetail'
import taskCard from './taskCard'
export default {
  components: { projectPanel, selfTable, aDialogDetail, taskCard },
  props: {
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
          label: '需求单位',
          prop: 'demandUnit',
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
          label: '承担单位',
          prop: 'undertakeUnit',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '成果负责人',
          prop: 'responsiblePerson',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '状态',
          prop: 'linkFlag',
          align: 'left',
          overflow: true,
          minwidth: '70px',
          resizable: false,
          formatter: this.statusFormatter
        }, {
          label: '合作开发费(万元)',
          prop: 'togetherDevelopCost',
          minwidth: '120px',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.numTransition
        }, {
          label: '自有人工(人月)',
          prop: 'staffTime',
          minwidth: '120px',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.numTransition
        }
      ],
      rowClass: [],
      planRangeTime: [],
      planYearRange: []
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.tableDataOut.list = val || []
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
  methods: {
    cutCardOrList (val) {
      this.isListOrCard = val
    },
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
        return val
      }
    },
    // 状态过滤
    statusFormatter (val) {
      if (val === '1') {
        return '已关联'
      } else if (val === '0') {
        return '未关联'
      } else {
        return ''
      }
    },
    itemClass (row) {
      return 'hover'
    },
    handleClick (row) { //点击任务名称进入研究任务及预期详情弹框
      this.$refs.aDialogDetail.acceptData(row, 'd', 'detail', this.planYearRange)
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
       (columnIndex === 2 && row.highlightProps.demandUnit) ||
       (columnIndex === 3 && row.highlightProps.demandUnitResponsibleName) ||
       (columnIndex === 4 && row.highlightProps.undertakeUnit) ||
       (columnIndex === 5 && row.highlightProps.responsiblePerson) ||
       (columnIndex === 6 && row.highlightProps.linkFlag) ||
       (columnIndex === 7 && row.highlightProps.togetherDevelopCost) ||
       (columnIndex === 8 && row.highlightProps.staffTime)
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
  .addcon{
    // margin-bottom: 20px;
    border: 1px solid #E9E9E9;
  }
  .expectTime{
    .el-form-item__label{
      line-height: 20px;
    }
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
      margin-bottom: 0;
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
        &:hover{
          @include color();
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
