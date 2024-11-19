<template>
  <!-- 承担方·非一般支撑包 -->
  <div class="wrapper">
    <div class="wrapper-inner">
      <div class="top-button-wrapper">
        <!-- <el-button class="sync-btn" @click="syncCost" v-if="isEditable && !notProjectApproval">立即同步实际成本</el-button> -->
        <el-button class="sync-btn" @click="syncCost" v-if="isEditable">立即同步实际成本</el-button>
      </div>
      <div class="table-wrapper">
        <table-module v-if="isShow" :receive-data="projectBudgetData"></table-module>
        <cost-split-detail
          :edit="isEditable?true:false"
          :sum-data="yearTotal"
          :receive-data="splitData"
          @save="setSplitData"></cost-split-detail>
        <!-- <detail v-if="isShow"></detail> -->
      </div>
      <!-- <div class="notes">
        <div class="left-title"><p>备注：</p></div>
        <div class="right-content">
          <p>集团批复：集团计划批复时的预算金额</p>
          <p>计划成本：本单位项目立项的预算金额</p>
          <p>实际成本：从ERP获取该项目的实际成本信息</p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import APIUndertakeView from '@/serve/API_undertakeView'
import API from '@/serve/API_groupPlan'
import tableModule from './finalDetail.vue'
import costSplitDetail from './split.vue'
import { mapGetters } from 'vuex'
export default {
  components: { tableModule, costSplitDetail },
  data () {
    return {
      isShow: true,
      projectCode: this.$route.params.projectCode,
      projectBudgetData: [],
      costSplitData: [],
      isEditable: false,
      splitData: [],
      sProjectCostDiviVos: [],
      yearTotal: {} // 年份合计
    }
  },
  computed: { ...mapGetters({ userInfo: 'USERENTITY/userInfo' }) },
  watch: {},
  methods: {
    syncCost () {
      this.isShow = false
      let params = {
        projectCode: this.$route.params.projectCode
      }
      API.syncCost(params)
        .then(res => {
          this.$message({
            message: '同步成功！',
            type: 'success',
            showClose: true
          })
          this.isShow = true
          this.getProjectCostInfo()
        })
        .catch(e => {
          this.loading = false
          this.$message({
            message: e.message || '同步失败，请稍后重试！',
            type: 'error',
            showClose: true
          })
        })
    },
    // 权限校验
    verificationPermission () {
      const param = {
        projectCode: this.$route.params.projectCode
      }
      API.canSyncProjectCost(param)
        .then(res => {
          this.isEditable = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '校验权限失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //查询数据
    getProjectCostInfo () {
      let params = {
        projectCode: this.projectCode // 项目编码
      }
      API.getUSProjectCostInfo(params)
        .then(res => {
          if (res && res.length) {
            for (let i = 0; i < res.length; i++) {
              for (let j = 0; j < res[i].projectBudget.length; j++) {
                if (res[i].projectBudget[j]) {
                  res[i].projectBudget[j].costType = j + 1 + ''
                } else {
                  res[i].projectBudget[j] = { costType: j + 1 + '' }
                }
              }
            }
            this.projectBudgetData = res
            this.setTotal(this.projectBudgetData)
            this.getSplitData()
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取拆分数据
    getSplitData () {
      let params = {
        projectCode: this.projectCode, // 需求单位项目编码（必填）
        // companyCode: this.userInfo.userAuth.orgCode // 公司编码（必填）【承担单位的公司编码】
        companyCode: '00220000000000000000'
      }
      API.getSplitData(params)
        .then(res => {
          this.splitData = res
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 设置合计
    setTotal (allData) {
      for (let i = 0; i < allData.length; i++) {
        for (let j = 0; j < allData[i].projectBudget.length; j++) {
          if (allData[i].projectBudget[j].costType.toString() === '3') {
            this.yearTotal[allData[i].year] = allData[i].projectBudget[j].totalAmount
          }
        }
      }
    },
    // 保存拆分数据
    setSplitData (data) {
      this.sProjectCostDiviVos = []
      data.forEach((item) => {
        item.costDtos.forEach((costDto) => {
          if (costDto.actualCost) {
            this.sProjectCostDiviVos.push({
              actualCost: costDto.actualCost,
              demandUnitOrganization: item.demandName,
              demandUnitOrganizationCode: item.demandCode,
              timeYear: costDto.timeYear,
              undertakeUnitProjectCode: this.projectCode
            })
          }
        })
      })
      API.setSplitData(this.sProjectCostDiviVos)
        .then(res => {
          if (res) {
            this.$message({
              message: '保存成功',
              type: 'success',
              showClose: true
            })
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    formatter () {}
  },
  created () {
    this.getProjectCostInfo()
    this.verificationPermission()
  },
  mounted () {
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
@media screen and (min-width: 1365px) and (max-width: 1450px){
  .wrapper-inner{
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px){
  .wrapper-inner{
    width: 960px !important;
  }
}
.wrapper{
  background: #f6f6f6;
  padding: 20px 0;
}
.wrapper-inner{
  width:1180px;
  padding: 20px;
  margin: 0px auto;
  background: white;
  box-sizing: border-box;
  .sync-btn{
    padding:0;
    width: 141px;
    height: 30px;
    @include border($color-blue);
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    @include color($color-blue);
    margin-bottom:20px;
  }
  .row-total{
    @include color($color-blue);
  }
  .notes{
    display: flex;
    margin-top:25px;
    p{
      margin: 0;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 22px;
    }
    .left-title p{
      text-align: right;
      padding-right: 8.5px;
    }
  }
}
</style>
