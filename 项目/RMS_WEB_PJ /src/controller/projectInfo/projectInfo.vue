<template>
  <div class="project-info">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <div >
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="项目信息" name="projectInfo">
            </el-tab-pane>
            <el-tab-pane label="任务进展" name="taskProgress"></el-tab-pane>
            <el-tab-pane label="项目流程" name="projectProgress"></el-tab-pane>
            <el-tab-pane label="成本信息" name="costInfo"></el-tab-pane>
            <el-tab-pane label="工时信息" name="timeInfo"></el-tab-pane>
            <el-tab-pane label="文档资料" name="projectDoc"></el-tab-pane>
            <!-- <el-tab-pane label="采购信息" name="purchaseInfo"></el-tab-pane> -->
          </el-tabs>
        </div>
        <div>
          <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
        </div>
      </div>
      <project-detail v-if="activeName==='projectInfo'"></project-detail>
      <flow-manage
        v-if="activeName==='projectProgress'"
        :project-code-version="flowQueryParams"></flow-manage>
      <cost-info v-if="activeName==='costInfo'"></cost-info>
      <task-progress v-if="activeName==='taskProgress'"></task-progress>
      <time-info v-if="activeName==='timeInfo'"></time-info>
      <project-doc v-if="activeName==='projectDoc'"></project-doc>
    </div>
  </div>
</template>
<script>
import merge from 'webpack-merge'
import projectDetail from './components/projectDetail'
import flowManage from '../components/flowManage'
import costMsg from '@/controller/updatedTwo/costMsg'
import taskProgress from '@/controller/updatedTwo/taskProgress'
import workInformation from '@/controller/updatedTwo/workInformation/workInformation.vue'
import projectFile from '@/controller/updatedTwo/projectFile/projectFile.vue'
export default {
  data () {
    return {
      activeName: 'projectInfo', // tab标签
      flowQueryParams: {
        projectCode: this.$route.params.projectCode
      } // 项目流程组件传递参数
    }
  },
  components: {
    projectDetail,
    flowManage,
    costInfo: costMsg,
    taskProgress,
    timeInfo: workInformation,
    projectDoc: projectFile
  },
  computed: {},
  methods: {
    // tab切换
    handleClick (tab, event) {
      // 修改对应的url，防止刷新时tab默认问题
      this.$router.push({
        query: merge({}, { 'activeTab': this.activeName })
      })
    }
  },
  created () {
    this.activeName = this.$route.query.activeTab || 'projectInfo'
  }
}
</script>
<style  lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-con{
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px){
  /deep/ .head-con{
    width: 960px !important;
  }
}

.project-info{
  /deep/ .el-form-item__content:hover{
  .el-form-item__error{
    display: inline-block;
  }
}
/deep/ .el-form-item__error{
  display: none;
  background: #fff;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: -32px;
  border: 1px solid #f56c6c;
  right: 1px;
  z-index: 999999999;
  padding: 4px !important;
  left: auto;
  white-space: nowrap;
}

/deep/ .el-form-item__error:before{
content: ”;
position: absolute;
top: 18px;
left: 12px;
width: 4px;
height: 4px;
border: 1px solid #f56c6c;
background: #fff;
border-top-color: transparent;
border-left-color: transparent;
content: " ";
transform: rotate(
45deg
);
}
  /deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
  background : #f6f6f6;
  height: 100vh;
  .back-top{
    position: fixed;
    bottom: 20px;
    right : 10px;
    cursor: pointer;
    img{
      width: 50px;
      height: 50px;
    }
  }
  .top-head{
    height: 50px;
    background : #fff;
    i{
      margin-right: 10px;
      cursor: pointer;
      &:before {
        margin-right: 5px;
      }
    }
    .head-con{
      height: 50px;
      line-height: 50px;
      width: 1180px;
      margin: 0 auto;
      display:flex;
      flex:1;
      justify-content:space-between;
      .logo-img{
        float: right;
        margin-top: 15px;
      }
    }
  }
}
</style>
