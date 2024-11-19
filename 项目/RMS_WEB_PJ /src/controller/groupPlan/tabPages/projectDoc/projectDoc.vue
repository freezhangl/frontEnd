<template>
  <div class="projectContent">
    <div class="tabSwitch">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="项目文档资料" name="projectFile"/>
        <el-tab-pane label="成果文档资料" name="resultFile" />
      </el-tabs>
      <component :is="currentProjectName"></component>
    </div>
  </div>
</template>

<script>
import projectFile from './projectDocComponent.vue'
import resultFile from './resultDocComponent.vue'
export default {
  components: {
    projectFile, resultFile
  },
  data () {
    return {
      activeName: 'projectFile',
      currentProjectName: 'projectFile'
    }
  },
  methods: {
    handleClick (tab) {
      this.currentProjectName = tab.name
    }
  },
  created () {
    window.onscroll = null
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  .tabSwitch{
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px){
  .tabSwitch{
    width: 960px !important;
  }
}
.projectContent {
  background: #f6f6f6;
  padding-bottom: 10px;
  // height: 100%;
  // min-height: 100vh;
  .header {
    height: 50px;
    background: #fff;
    text-align: center;
    line-height: 50px;
  }
  .tabSwitch {
    width: 1180px;
    margin: 0 auto;
    margin-top: 18px;
    font-size: 14px !important;
    line-height: 21px;
    /deep/.el-tabs {
    .el-tabs__header {
      margin-bottom: 20px;
      border-bottom: 0px;
      .el-tabs__nav {
        border-radius: 0;
        border-bottom:1px solid #E4E7ED;
        .el-tabs__item {
          width: 78px;
          height: 32px;
          font-size: 14px;
          color: #333333;
          background: #fff;
          letter-spacing: 0;
          text-align: center;
          line-height: 22px;
          padding: 5px 8px !important;
          border-radius: 2px;
          &:hover{
            @include color();
          }
          &.is-active{
            color:#fff !important;
            border-bottom: 1.5px solid #0B82FF;
            @include background-color();
            @include border-bottom-color();
          }
        }
      }
     }
    }
  }
}

</style>
