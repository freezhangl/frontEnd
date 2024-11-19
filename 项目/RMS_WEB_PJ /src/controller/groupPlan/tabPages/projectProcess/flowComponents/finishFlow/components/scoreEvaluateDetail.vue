<!-- 结项流程-打分和评价组件 -->
<template>
  <div class="wrapper">
    <div v-if="data.unitType !== 'UNITE_ASSAULTS' && data.groupFinishScoreUndertakeList">
      <p v-if="data.unitType === 'UNDERTAKE_UNIT'">项目评价</p>
      <p v-else>承担单位打分评价：</p>
      <el-table :data="data.groupFinishScoreUndertakeList" :show-overflow-tooltip="true">
        <el-table-column
          prop="demandOrganizationName"
          label="需求单位"
          width="180"
          align="center"
          header-align="center"
          v-if="data.unitType !== 'DEMAND_UNIT'">
        </el-table-column>
        <el-table-column
          prop="undertakeOrganizationName"
          label="承担单位"
          width="180"
          align="center"
          header-align="center"
          v-if="data.unitType === 'DEMAND_UNIT' || data.unitType === 'DEPARTMENT-ADMIN'">
        </el-table-column>
        <el-table-column
          prop="score"
          width="180"
          align="center"
          header-align="center"
          v-if="data.unitType === 'DEMAND_UNIT' || data.unitType === 'DEPARTMENT-ADMIN'"
          label="分数">
        </el-table-column>
        <el-table-column
          prop="content"
          label="评价"
          min-width="180">
        </el-table-column>
      </el-table>
    </div>
    <div v-if="data.unitType !== 'UNDERTAKE_UNIT' && data.groupFinishScoreUniteAssaultList">
      <p v-if="data.unitType === 'UNITE_ASSAULTS'">项目评价</p>
      <p v-else>联合攻关单位打分评价：</p>
      <el-table :data="data.groupFinishScoreUniteAssaultList" :show-overflow-tooltip="true">
        <el-table-column
          prop="demandOrganizationName"
          label="需求单位"
          width="180"
          align="center"
          header-align="center"
          v-if="data.unitType !== 'DEMAND_UNIT'">
        </el-table-column>
        <el-table-column
          prop="uniteAssaultOrganizationName"
          label="联合攻关单位"
          width="180"
          align="center"
          header-align="center"
          v-if="data.unitType === 'DEMAND_UNIT' || data.unitType === 'DEPARTMENT-ADMIN'">
        </el-table-column>
        <el-table-column
          prop="score"
          width="180"
          align="center"
          header-align="center"
          v-if="data.unitType === 'DEMAND_UNIT' || data.unitType === 'DEPARTMENT-ADMIN'"
          label="分数">
        </el-table-column>
        <el-table-column
          prop="content"
          label="评价"
          min-width="180">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },
  data () {
    return {
      rules: {
      }
    }
  },

  components: {},

  computed: {},

  mounted () {
    // console.log(this.data.unitType)
  },

  methods: {}
}

</script>
<style lang='scss' scoped>
.wrapper{
  padding: 20px 30px;
  background:#fff;
  margin-top: 30px;
}
.el-table{
  border:1px solid #e5e5e5;
  border-bottom:none;
}
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
