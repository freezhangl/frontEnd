<template>
  <div class="flow-container">
    <div class="head-content">
      <el-radio-group v-model="flowPoint" @change="changeRadio" class="group-btn">
        <el-radio-button label="计划调整流程"></el-radio-button>
        <el-radio-button label="立项流程"></el-radio-button>
        <el-radio-button label="变更流程"></el-radio-button>
        <el-radio-button label="里程碑流程" v-if="showMilestone"></el-radio-button>
        <el-radio-button label="终止流程"></el-radio-button>
        <el-radio-button label="结项流程"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="flow-content">
      <!-- 卡片展示区域：包括计划调整流程、立项流程、变更流程、里程碑流程、终止流程、结项流程等多卡片信息展示 -->
      <div class="flow-point-info" v-if="flowPoint==='计划调整流程'">
        <div>
          <plan-adjust-flow></plan-adjust-flow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='立项流程'">
        <div>
          <launch-flow></launch-flow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='变更流程'">
        <div>
          <change-flow></change-flow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='里程碑流程'">
        <div style="margin-top:30px;">
          <milestoneFlow></milestoneFlow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='终止流程'">
        <div>
          <terminate-flow></terminate-flow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='结项流程'">
        <div>
          <finish-flow></finish-flow>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import merge from 'webpack-merge'
import API from '@/serve/API_project'
import { getStore } from '@/store'

import planAdjustFlow from '../flowComponents/planAdjustFlow/index'
import launchFlow from '../flowComponents/launchFlow/index'
import changeFlow from '../flowComponents/changeFlow/index'
import milestoneFlow from '../flowComponents/milestoneFlow/index'
import terminateFlow from '../flowComponents/terminateFlow/index'
import finishFlow from '../flowComponents/finishFlow/index'

export default {
  name: 'flowManage',
  components: {
    planAdjustFlow,
    launchFlow,
    changeFlow,
    milestoneFlow,
    terminateFlow,
    finishFlow
  },
  props: {
    projectCode: { type: String, default: '' }
  },
  data () {
    return {
      flowPoint: '计划调整流程',
      projectInfo: { // 需要使用launchFlow组件时传的参数
        projectCode: this.projectCode, // 项目编号
        documentType: '01', // 单据类型,01-项目立项，02-项目变更，03-项目终止， 04-项目结项，05-里程碑，06-研发包任务申请
        permissionCode: '04', //权限编码
        projectType: '03'
      },
      showMilestone: true, //是否展示里程碑
      currentUserName: getStore().getters['USERENTITY/userInfo'].userAuth.chineseName // 当前登录用户姓名
    }
  },
  watch: {
  },
  mounted () {
    this.isShowMilestone()
  },
  methods: {
    isShowMilestone () { //查询当前用户所在公司里程碑数量配置 如果最大值为 0 则不展示
      API.isShowMilestones()
        .then(res => {
          if (res.MAX > 0) {
            this.showMilestone = true
          } else {
            this.showMilestone = false
          }
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
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 切换按钮组是url变化
    changeRadio (label) {
      this.$router.push({
        query: merge(this.$route.query, { 'flowPoint': label })
      })
    }
  },
  created () {
    this.flowPoint = this.$route.query.flowPoint || '计划调整流程'
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-content{
    width: 1000px !important;
  }
  /deep/ .flow-content{
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px){
  /deep/ .head-content{
    width: 960px !important;
  }
  /deep/ .flow-content{
    width: 960px !important;
  }
}

.flow-container{
  background: #f6f6f6;
  .head-content{
    margin:auto;
    width: 1180px;
    .group-btn{
      margin-top: 15px;
    }
  }
  .flow-content{
    margin:auto;
    width: 1180px;
    .main-content{
      margin-top: 15px;
      background-color: #fff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 2px;
      padding: 10px 25px 20px;
      z-index: -100;
      button{
        font-size: 14px;
        border-radius: 2px;
        height: 30px;
      }
      .head-btn {
        padding: 15px 0px;
        line-height: 40px;
        margin-bottom: 30px;
        .el-button {
          height: 30px;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
