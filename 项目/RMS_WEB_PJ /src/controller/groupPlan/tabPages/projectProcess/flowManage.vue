<template>
  <div class="flow-container">
    <div class="head-content">
      <el-radio-group
        v-if="showDemandGeneralTab"
        v-model="flowPoint"
        @change="changeRadio"
        class="group-btn">
        <el-radio-button label="委托函"></el-radio-button>
        <el-radio-button label="变更流程"></el-radio-button>
      </el-radio-group>
      <el-radio-group
        v-if="showDemandSpecialTab"
        v-model="flowPoint"
        @change="changeRadio"
        class="group-btn">
        <el-radio-button label="计划调整流程"></el-radio-button>
        <el-radio-button label="立项流程"></el-radio-button>
        <el-radio-button label="变更流程"></el-radio-button>
        <el-radio-button label="里程碑流程" v-if="showMilestone"></el-radio-button>
        <el-radio-button label="终止流程"></el-radio-button>
        <el-radio-button label="结项流程"></el-radio-button>
      </el-radio-group>
      <el-radio-group
        v-if="showUndertakeTab"
        v-model="flowPoint"
        @change="changeRadio"
        class="group-btn">
        <el-radio-button label="预立项流程" v-if="showBeforeLaunchFlow"></el-radio-button>
        <el-radio-button label="立项流程"></el-radio-button>
        <el-radio-button label="变更流程"></el-radio-button>
        <el-radio-button label="里程碑流程" v-if="showMilestone"></el-radio-button>
        <el-radio-button label="终止流程"></el-radio-button>
        <el-radio-button label="结项流程"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="flow-content">
      <!-- 卡片展示区域：包括委托函、计划调整流程、立项流程、变更流程、里程碑流程、终止流程、结项流程等多卡片信息展示 -->
      <div class="flow-point-info" v-if="flowPoint==='委托函'">
        <div>
          <entrustment-flow></entrustment-flow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='计划调整流程'">
        <div>
          <plan-adjust-flow></plan-adjust-flow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='预立项流程'&&showBeforeLaunchFlow">
        <div>
          <beforeLaunchFlow></beforeLaunchFlow>
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
import { getStore } from '@/store'

import entrustmentFlow from './flowComponents/entrustmentFlow/index'
import planAdjustFlow from './flowComponents/planAdjustFlow/index'
import launchFlow from './flowComponents/launchFlow/index'
import beforeLaunchFlow from './flowComponents/beforeLaunchFlow/index'
import changeFlow from './flowComponents/changeFlow/index'
import milestoneFlow from './flowComponents/milestoneFlow/index'
import terminateFlow from './flowComponents/terminateFlow/index'
import finishFlow from './flowComponents/finishFlow/index'
import milesAPI from '@/serve/API_milestoneManagement'
import groupAPI from '@/serve/API_groupPlanProject'
import API from '@/serve/API_businessFlow'

export default {
  name: 'flowManage',
  components: {
    entrustmentFlow,
    planAdjustFlow,
    beforeLaunchFlow,
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
      showDemandGeneralTab: this.$route.query.developPackage === 'IS_RD_1' && this.$route.query.projectCategory === 'd', // 集团统筹需求单位一般支撑包项目流程tab页签
      showDemandSpecialTab: this.$route.query.developPackage === 'IS_RD_0' && this.$route.query.projectCategory === 'd', // 集团统筹需求单位非一般支撑包项目流程tab页签
      showUndertakeTab: this.$route.query.projectCategory === 'u', // 集团统筹承担单位一般/非一般支撑包项目流程tab页签
      flowPoint: '', // 默认tab页签显示的流程（委托函、计划调整流程、立项流程）
      showMilestone: true, //是否展示里程碑
      showBeforeLaunchFlow: true //是否展示预立项
    }
  },
  watch: {
  },
  mounted () {
    this.isShowMilestone()
    this.isShowBeforeLaunchFlow()
  },
  methods: {
    isShowBeforeLaunchFlow () {
      groupAPI.supportProjectPreApprove({ projectCode: this.projectCode })
        .then(res => {
          // this.flowPoint = this.$route.query.flowPoint || res ? '预立项流程' : '立项流程'
          if (res) {
            this.showBeforeLaunchFlow = res
            this.flowPoint = '预立项流程'
            if (this.showDemandGeneralTab) {
              this.flowPoint = '委托函'
            }
            if (this.$route.query.flowPoint) {
              this.flowPoint = this.$route.query.flowPoint
            }
          } else {
            let params = {
              projectCode: this.projectCode,
              businessType: 'BT-UNDERTAKER-PRE-APPROVE' // 预立项单据业务类型编码
            }
            API.getApproveList(params)
              .then(res => {
                if (res && res.length !== 0) {
                  this.showBeforeLaunchFlow = true
                  // this.flowPoint = this.$route.query.flowPoint || res ? '预立项流程' : '立项流程'
                  res = true
                  if (res) {
                    this.flowPoint = '预立项流程'
                  }
                  if (this.showDemandGeneralTab) {
                    this.flowPoint = '委托函'
                  }
                  if (this.$route.query.flowPoint) {
                    this.flowPoint = this.$route.query.flowPoint
                  }
                } else {
                  this.showBeforeLaunchFlow = false
                  if (this.showUndertakeTab) {
                    this.flowPoint = '立项流程'
                  }
                }
              })
              .catch(e => {
                this.loading = false
                if (e.selfError) return
                if (e.message) {
                  this.$message({
                    message: e.message || '获取预立项流程信息失败，请稍后重试！',
                    type: 'error',
                    showClose: true
                  })
                }
              })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '是否支持项目预立项获取失败',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 判断里程碑tab是否展示：根据当前里程碑是否返回或返回列表长度为0
    isShowMilestone () {
      let searchParams = { projectCode: this.$route.params.projectCode }
      milesAPI.getMilestoneList(searchParams)
        .then(res => {
          if (res === null) {
            this.showMilestone = false
          } else if (res.length === 0) {
            this.showMilestone = false
          } else {
            this.showMilestone = true
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '里程碑完成流程列表获取失败',
              type: 'error',
              showClose: true
            })
          }
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
    if (this.$route.query.projectCategory === 'u') { //todo 后面加接口看公司是否配置预立项
      // this.flowPoint = this.$route.query.flowPoint || '立项流程'
      // this.flowPoint = this.$route.query.flowPoint || '预立项流程'
    } else if (this.$route.query.developPackage === 'IS_RD_1') {
      this.flowPoint = this.$route.query.flowPoint || '委托函'
    } else {
      this.flowPoint = this.$route.query.flowPoint || '计划调整流程'
    }
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
