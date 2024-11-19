<template>
  <div class="project-info">
    <div class="top-head" id="top-head">
      <div class="head-con">
        <div >
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="项目信息" name="projectInfo">
            </el-tab-pane>
            <el-tab-pane label="任务进展" name="taskProgress"></el-tab-pane>
            <el-tab-pane label="成本信息" name="costInfo"></el-tab-pane>
            <el-tab-pane label="项目流程" name="projectProgress"></el-tab-pane>
            <el-tab-pane label="工时信息" name="timeInfo"></el-tab-pane>
            <el-tab-pane label="文档资料" name="projectDoc"></el-tab-pane>
            <!-- <el-tab-pane label="采购信息" name="purchaseInfo"></el-tab-pane> -->
            <el-tab-pane label="承担单位视图" name="undertakeView" v-if="projectCP === 'ds' || projectCP === 'dg' "></el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <img class="logo-img" src="@/assets/icons/集中化研发管理系统组合logo.svg" alt="">
        </div>
      </div>

      <project-detail v-if="activeName==='projectInfo'"></project-detail>
      <flow-manage
        v-if="activeName==='projectProgress'"
        :project-code="projectCode">
      </flow-manage>

      <task-progress v-if="activeName==='taskProgress'"></task-progress>
      <template v-if="activeName === 'costInfo'">
        <DGcostInfo v-if="projectCP === 'dg'"></DGcostInfo>
        <DScostInfo v-if="projectCP === 'ds'"></DScostInfo>
        <UGcostInfo v-if="projectCP === 'ug'"></UGcostInfo>
        <UScostInfo v-if="projectCP === 'us'"></UScostInfo>
      </template>
      <project-doc v-if="activeName === 'projectDoc'"></project-doc>
      <div id="time-info" >
        <!-- <div class="timeSheet1" v-if="activeName === 'timeInfo'&&projectCategory ==='u'&&timeInfoBtnShow!='0'"> -->
        <el-button
          type="primary"
          class="btn timeSheet1"
          @click="goTimeInfo"
          v-if="activeName === 'timeInfo'&&projectCategory ==='u'&&timeInfoBtnShow!='0'">工时填报</el-button>
        <!-- </div> -->
        <!--需求单位 非一般支撑 -->
        <SNonSupGeneral v-if="activeName === 'timeInfo'&&projectCP === 'ds'"></SNonSupGeneral>
        <!-- 承担单位 非研发包、研发包 -->
        <USubWorkInfo v-if="activeName === 'timeInfo'&&projectCategory ==='u'"></USubWorkInfo>
        <!-- 需求单位 研发包 -->
        <GProGeneral v-if="activeName ==='timeInfo'&&projectCP === 'dg'"></GProGeneral>
      </div>
      <div id="undertake-view">
        <UGundertakeView v-if="activeName === 'undertakeView'&&projectCP === 'dg'"></UGundertakeView>
        <USundertakeView v-if="activeName === 'undertakeView'&&projectCP === 'ds'"></USundertakeView>
      </div>

    </div>
  </div>
</template>
<script>
import merge from 'webpack-merge'
import projectDetail from '../tabPages/projectInfo/projectInfo'
import flowManage from '../tabPages/projectProcess/flowManage.vue'
import taskProgress from '../tabPages/taskProgress/taskProgress.vue'
import DGcostInfo from '../tabPages/costInfo/DGcost/index.vue'
import DScostInfo from '../tabPages/costInfo/DScost/index.vue'
import UGcostInfo from '../tabPages/costInfo/UGcost/index.vue'
import UScostInfo from '../tabPages/costInfo/UScost/index.vue'
import projectDoc from '../tabPages/projectDoc/projectDoc'
import USubWorkInfo from '../tabPages/timeInfo/USubWorkInfo'
import SNonSupGeneral from '../tabPages/timeInfo/SNonSupGeneral'
import GProGeneral from '../tabPages/timeInfo/GProGeneral'
import UGundertakeView from '../tabPages/undertakeView/UGundertakeView'
import USundertakeView from '../tabPages/undertakeView/USundertakeView'
import API from '@/serve/API_groupPlanProject.js'

export default {
  data () {
    return {
      activeName: 'projectInfo', // 默认为项目信息tab
      projectCode: this.$route.params.projectCode, // 项目编号: 项目详情页面传递给项目流程组件的信息，用于流程单据查询
      projectCP: '', //需求方研发包项目dg，需求方非研发包项目ds，承担方研发包项目ug，承担方非研发包项目us
      developPackage: '', //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: '', //需求方项目d还是承担方项目u
      // undertakeUnit: false
      timeInfoBtnShow: '0'
    }
  },
  components: {
    projectDetail,
    flowManage,
    taskProgress,
    DGcostInfo,
    DScostInfo,
    UGcostInfo,
    UScostInfo,
    projectDoc,
    USubWorkInfo, //承担
    SNonSupGeneral, //非一般
    GProGeneral, //一般
    UGundertakeView,
    USundertakeView
  },
  computed: {},
  methods: {
    queryWorkTimeSubmitType () {
      if (this.activeName === 'timeInfo') {
        API.queryWorkTimeSubmitType({ projectCode: this.projectCode })
          .then(res => {
            this.timeInfoBtnShow = res.toString()
          })
          .catch(err => {
            if (err.selfError) return
            this.$message({
              message: err.message || '服务器异常,请稍后再试!',
              type: 'error',
              showClose: true
            })
          })
      }
    },
    goTimeInfo () {
      let path = ''
      let text = ''
      switch (this.timeInfoBtnShow) {
        case '1':
          path = '/timeSheet/timeCalendarSubmit'
          text = '是否跳转到工时填报页面?'
          break
        case '2':
          path = '/timeSheet/monthTimeSubmit'
          text = '是否跳转到工时填报页面?'
          break
        case '3':
          path = '/timeSheet/timeConfirm'
          text = '是否跳转到工时导入页面?'
          break
        case '4':
          path = '/timeSheet/timeConfirm'
          text = '是否跳转到工时导入页面?'
          break
      }
      this.$confirm(' ', text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.$router.push({
            path: path
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // tab切换
    handleClick (tab, event) {
      window.onscroll = null
      // 修改对应的url，防止刷新时tab默认问题
      this.$router.push({
        query: merge({}, { 'activeTab': this.activeName, 'developPackage': this.developPackage, 'projectCategory': this.projectCategory })
      })
      if (this.activeName === 'timeInfo' && this.projectCategory === 'u') {
        this.queryWorkTimeSubmitType()
      }
    }
  },
  created () {
    this.activeName = this.$route.query.activeTab || 'projectInfo'
    this.developPackage = this.$route.query.developPackage || ''
    this.projectCategory = this.$route.query.projectCategory || ''
    let isPackage = this.developPackage === 'IS_RD_0' ? 's' : 'g'
    this.projectCP = this.projectCategory + isPackage
    if (this.activeName === 'timeInfo' && this.projectCategory === 'u') {
      this.queryWorkTimeSubmitType()
    }
    //承担单位试图权限
    // if (this.projectCP === 'ds' || this.projectCP === 'dg') {
    //   let params = {
    //     permissionCode: 12,
    //     projectCode: this.$route.params.projectCode
    //   }
    //   API.checkUserFullDataPermission(params)
    //     .then(res => {
    //       this.undertakeUnit = res === false ? true : res
    //     })
    // }
  }
}
</script>
<style  lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  /deep/ .head-con{
    width: 1000px !important;
  }
  #time-info{
  width: 1000px !important;
}
}

@media screen and (max-width: 1364px){
  /deep/ .head-con{
    width: 960px !important;
  }
#time-info{
  width: 960px !important;
}
}
@media screen and (min-width: 1365px) and (max-width: 1450px) {
  .timeSheet {
    width: 1000px !important;
  }
  .sum_footer{
     width: 1000px !important;
  }
  #time-info{
  width: 1000px !important;
}
}

@media screen and (max-width: 1364px) {
  .timeSheet {
    width: 960px !important;
  }
  .sum_footer{
     width: 960px !important;
  }
}
@media screen and (min-width: 1450px) {
  #time-info{
  width: 1180px !important;
}
}
#time-info{
  position: relative;
  margin: auto;
}
.timeSheet1 {
  // .btn{
    position: absolute;
    right: 0px;
    top: -3px;
  // }
  // padding-left: 980px;
  // padding-right: 30px;
  // padding-bottom: 20px;
  // width: 1180px;
  // padding-top: 30px;
  // margin: 0 auto;
  // box-sizing: border-box;
  //    .back-top{
  //     position: fixed;
  //     bottom: 20px;
  //     right : 10px;
  //     cursor: pointer;
  //     img{
  //       width: 50px;
  //       height: 50px;
  //     }
  //   }
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
