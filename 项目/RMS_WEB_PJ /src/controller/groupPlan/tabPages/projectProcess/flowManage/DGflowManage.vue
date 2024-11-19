<template>
  <div class="flow-container">
    <div class="head-content">
      <el-radio-group v-model="flowPoint" @change="changeRadio" class="group-btn">
        <el-radio-button label="委托函"></el-radio-button>
        <el-radio-button label="变更流程"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="flow-content">
      <!-- 卡片展示区域：包括委托函、变更流程卡片信息展示 -->
      <div class="flow-point-info" v-if="flowPoint==='委托函'">
        <div>
          <entrustment-flow></entrustment-flow>
        </div>
      </div>
      <div class="flow-point-info" v-if="flowPoint==='变更流程'">
        <div>
          <change-flow></change-flow>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import merge from 'webpack-merge'
import API from '@/serve/API_project'
import entrustmentFlow from '../flowComponents/entrustmentFlow/index'
import changeFlow from '../flowComponents/changeFlow/index'

export default {
  name: 'flowManage',
  components: {
    entrustmentFlow,
    changeFlow
  },
  props: {
    projectCode: { type: String, default: '' }
  },
  data () {
    return {
      flowPoint: '委托函' // 默认tab页签展示
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    // 切换按钮组是url变化
    changeRadio (label) {
      this.$router.push({
        query: merge(this.$route.query, { 'flowPoint': label })
      })
    }
  },
  created () {
    this.flowPoint = this.$route.query.flowPoint || '委托函'
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
  }
}
</style>
