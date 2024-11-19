<template>
  <div class="detailListMilestone" v-if="isShow">
    <div class="body-con">
      <projectPanel
        title="里程碑"
        class="addcon">
        <self-table
          :is-index='true'
          index-title='序号'
          :table-data="receiveData"
          :table-cols="tableCols"
          :is-pagination="false"
        ></self-table>
      </projectPanel>
    </div>
  </div>
</template>
<script>
import selfTable from '../../../../../components/table/index'
import projectPanel from '../../../../components/projectPanel/index'
import API from '../../../../../serve/API_project'
export default {
  props: ['receiveData'],
  components: {
    projectPanel,
    selfTable
  },
  data () {
    return {
      maxAndMin: { MAX: 0, MIN: 0 },
      milestoneLeaderOptions: [],
      tableCols: [
        { label: '里程碑名称', prop: 'milestoneName', align: 'center', overflow: true, resizable: false, width: '200px' },
        { label: '里程碑描述', prop: 'milestoneDescription', align: 'center', overflow: true, resizable: false, minwidth: '160px' },
        { label: '计划完成时间', prop: 'planFinishTime', align: 'center', overflow: true, resizable: false, width: '200px' },
        // { label: '里程碑责任人', prop: 'milestoneLeader', align: 'center', overflow: true, resizable: false, formatter: this.milestoneLeaderFormatter }
        { label: '里程碑责任人', prop: 'milestoneLeader', align: 'center', overflow: true, resizable: false, width: '200px' }
      ],
      isShow: true
    }
  },
  mounted () {
    // this.isShowMilestone()
  },
  watch: {
    receiveData (newValue, oldValue) {
      if (newValue) {
        this.$emit('detailTableMilestoneShowOrHide', newValue.length > 0)
      }
    }
  },
  methods: {
    isShowMilestone () { //查询当前用户所在公司里程碑数量配置 如果最大值为 0 则不展示
      API.isShowMilestones()
        .then(res => {
          // res = { MAX: 2, MIN: 1 }
          this.maxAndMin = res
          this.$emit('detailTableMilestoneShowOrHide', res.MAX > 0)
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询当前用户所在公司里程碑数量配置失败',
            type: 'error',
            showClose: true
          })
        })
    },
    milestoneLeaderFormatter (val) {
      // 里程碑责任人过滤
      let status = ''
      this.milestoneLeaderOptions.some(item => {
        if (val === item.value) {
          status = item.label
        }
      })
      return status
    }
  }
}
</script>
<style lang="scss" scoped>
.body-con /deep/{
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
    .el-date-editor{
      width:100%;
    }
    .project-panel .panel-body.is-expand {
      padding: 20px 30px 20px 30px;
      height: auto;
    }
    .addcon{
       border: none;
       margin-bottom: 20px;
       &:last-child{
         margin-bottom: 0;
       }
    }
  }
</style>
