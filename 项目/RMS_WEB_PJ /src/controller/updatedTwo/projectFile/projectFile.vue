<template>
  <div class="projectContent">
    <div class="tabSwitch">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="项目文档资料" name="projectFile"/>
        <el-tab-pane label="成果文档资料" name="resultFile" />
      </el-tabs>
      <keep-alive> <component :is="currentProjectName"></component></keep-alive>
    </div>
  </div>
</template>

<script>
import projectFile from './projectFileComponent.vue'
import resultFile from './resultFileComponent.vue'
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
  // height: 100%;
  min-height: 100vh;
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
          width: 100px;
          height: 32px;

          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          line-height: 32px;
          padding: 0px !important;
          &.is-active{
            color:#fff;
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
