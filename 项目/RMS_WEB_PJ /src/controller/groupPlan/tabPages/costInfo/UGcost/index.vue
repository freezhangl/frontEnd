<template>
  <!-- 承担方·一般支撑包 -->
  <div class="wrapper">
    <div class="wrapper-inner">
      <div class="top-button-wrapper">
        <!-- <el-button class="sync-btn" @click="syncCost" v-if="isEditable && !notProjectApproval">立即同步实际成本</el-button> -->
        <el-button class="sync-btn" @click="syncCost" v-if="isEditable">立即同步实际成本</el-button>
      </div>
      <div class="table-wrapper">
        <final-detail v-if="data && data.length && isShow" :receive-data="data"></final-detail>
        <!-- <detail v-if="isShow"></detail> -->
      </div>
      <div class="notes">
        <div class="left-title"><p>备注：</p></div>
        <div class="right-content">
          <p>集团批复：集团计划批复时的预算金额</p>
          <p>计划成本：本单位项目立项的预算金额</p>
          <p>实际成本：从ERP获取该项目的实际成本信息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import finalDetail from '../UScost/finalDetail.vue'
import API from '@/serve/API_groupPlan'
export default {
  components: { finalDetail },
  data () {
    return {
      isShow: true,
      isEditable: false,
      notProjectApproval: true,
      projectCode: this.$route.params.projectCode,
      data: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    getData () {
      let params = {
        projectCode: this.$route.params.projectCode
      }
      API.getUGProjectCostInfo(params)
        .then(res => {
          // if (res) {
          //   if (res[0].projectBudget[0] === null) {
          //     res[0].projectBudget[0] = {}
          //   }
          //   if (res[0].projectBudget[1] === null) {
          //     res[0].projectBudget[1] = {}
          //   }
          //   if (res[0].projectBudget[2] === null) {
          //     res[0].projectBudget[2] = {}
          //   }
          //   this.data = res
          // }
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
            this.data = res
            // this.setTotal(this.projectBudgetData)
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
          this.getData()
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
    }
  },
  created () {
    this.getData()
    this.verificationPermission()
  },
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
