<template>
  <!-- 基线配置 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="集团统筹-需求方项目" name="demandProject" />
    <el-tab-pane label="集团统筹-承担方项目" name="assumeProject" />
    <el-tab-pane label="自立项目" name="selfBuildProject" />
    <component :is="activeName" ></component>
  </el-tabs>
</template>
<script>
import merge from 'webpack-merge'
import selfBuildProject from './selfBuildProject/index.vue'
import demandProject from './demandProject/index.vue'
import assumeProject from './assumeProject/index.vue'
export default {
  components: {
    selfBuildProject, demandProject, assumeProject
  },
  data () {
    return {
      activeName: this.$route.query.activeTab || 'demandProject' // 默认展示的tab页
    }
  },
  methods: {
    // 存sessionStoreage变量 用于刷新保持tab切换
    handleClick (tab) {
      this.activeName = tab.name
      sessionStorage.setItem('systemConfig_baseLineConfig_activeTab', tab.name)
      // console.log(this.$route.query.activeTab)
      this.$router.push({
        path: '',
        query: { 'activeTab': tab.name }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.el-tabs{
  height: 100%;
  background-color: #fff;
  border-radius: 0%;
  width: 100%;
}
.el-tabs.el-tabs--card /deep/ .el-tabs__header{
  border-bottom: 1.5px solid #E5E5E5;
  margin:0;
  .el-tabs__nav{
    border:none;
    padding-left:9px;
    .el-tabs__item{
      border:none;
      padding: 0px;
      margin-left: 20px;
      height: 49.5px;
      line-height: 49.5px;
      &.is-active{
        @include color();
        border-bottom: 1.5px solid #0B82FF;
        @include border-bottom-color();
      }
    }
  }
}
</style>
