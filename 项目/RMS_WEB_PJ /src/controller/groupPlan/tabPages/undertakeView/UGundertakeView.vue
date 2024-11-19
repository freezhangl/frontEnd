<template>
  <!-- UG是一般支撑包 -->
  <div class="wrapper">
    <div class="wrapper-inner">
      <project-panel :title="'项目预算及执行信息'" :show-expand="false" class="border_wrapper">
        <div class="table-wrapper">
          <final-detail :receive-data="projectBudgetData"></final-detail>
        </div>

      </project-panel>
      <project-panel :title="'承担单位项目列表'" :show-expand="false" class="border_wrap">
        <project-info-list :receive-data="projectBaseInfo"></project-info-list>
      </project-panel>
    </div>
  </div>
</template>

<script>
import finalDetail from '@/controller/groupPlan/components/undertakeView/UGView/finalDetail.vue'
import projectInfoList from '@/controller/groupPlan/components/undertakeView/projectInfoList.vue'
import API from '@/serve/API_undertakeView'
import projectPanel from '@/controller/components/projectPanel'
import { mapGetters } from 'vuex'
export default {
  components: { finalDetail, projectPanel, projectInfoList },
  data () {
    return {
      projectCode: this.$route.params.projectCode,
      companyCode: this.$route.params.companyCode,
      projectBudgetData: [{
        year: new Date()
          .getFullYear(),
        projectBudget: [
          {
            costType: '1',
            budgetOutsourcing: null,
            budgetInsourcing: null,
            staffTime: null,
            laborCosts: null,
            travelExpenses: null,
            conferenceExpenses: null,
            assetDepreciation: null,
            otherCosts: null,
            totalAmount: null
          },
          {
            costType: '2',
            budgetOutsourcing: null,
            budgetInsourcing: null,
            staffTime: null,
            laborCosts: null,
            travelExpenses: null,
            conferenceExpenses: null,
            assetDepreciation: null,
            otherCosts: null,
            totalAmount: null
          },
          {
            costType: '3',
            budgetOutsourcing: null,
            budgetInsourcing: null,
            staffTime: null,
            laborCosts: null,
            travelExpenses: null,
            conferenceExpenses: null,
            assetDepreciation: null,
            otherCosts: null,
            totalAmount: null
          }

        ]
      }],
      projectBaseInfo: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    }) },
  watch: {},
  methods: {
    //查询项目预算及执行信息
    getProjectBudget (companyCode) {
      let params = {
        userCode: this.userInfo.loginName, //用户账号
        projectCode: this.projectCode // 项目编码
      }
      API.gProjectBudgetExecutionInforList(params)
        .then(res => {
          this.projectBudgetData = res
          this.undertakeList(this.companyCode)
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: !e.message ? '服务器异常，请稍后再试！' : e.message === '当前用户没有该项目的业务流程权限！' ? '当前用户没有该项目的承担单位视图查看权限！' : e.message,
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //承担单位项目列表
    undertakeList (companyCode) {
      let params = {
        userCode: this.userInfo.loginName, //用户账号
        projectCode: this.projectCode // 项目编码
      }
      API.gUndertakeList(params)
        .then(res => {
          this.projectBaseInfo = res
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: !e.message ? '服务器异常，请稍后再试！' : e.message === '当前用户没有该项目的业务流程权限！' ? '当前用户没有该项目的承担单位视图查看权限！' : e.message,
              type: 'error',
              showClose: true
            })
          }
        })
    }
    //查询所有数据
    // queryAllData (companyCode) {
    //   this.getProjectBudget(companyCode)
    //   this.undertakeList(companyCode)
    // }
  },
  created () {
    this.getProjectBudget(this.companyCode)
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
  .add-progress{
      .content{
        .write-text{
          display: flex;
          span{
            white-space: nowrap;
          }
          /deep/{
            .el-textarea__inner{
              height: 62px;
            }
            .el-form-item__content{
              margin-left:100px;
            }
          }
        }
        /deep/.el-input__count {
          right: 35px !important;
          width: 20px;
          height: 4px;
        }
      }
      .zhu{
        margin-top: 10px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 21px;
      }
      .add-btn{
        text-align: right;
        padding: 20px 0 10px 0;
        .el-button{
          width: 89px;
          height: 30px;
          border-radius: 2px;
        }
      }
    }
}
.border_wrapper{
  border:1px solid #e9e9e9;
}
.border_wrap{
  border:1px solid #e9e9e9;
  margin-top:20px;
}
</style>
