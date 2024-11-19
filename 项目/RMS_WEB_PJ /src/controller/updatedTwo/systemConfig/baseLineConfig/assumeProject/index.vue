<template>
  <!-- 集团统筹-承担方项目 -->
  <div class="wrapper">
    <!-- 按钮 -->
    <div class="top-button-wrapper">
      <div class="top-button-wrapper-outer">
        <el-button
          class="editor"
          icon="el-icon-edit"
          v-if="!isEdit"
          @click="isEdit = true">
          编辑
        </el-button>
        <el-button class="save iconfont icon-baocun" v-if="isEdit" @click="save">
          保存
        </el-button>
      </div>
    </div>
    <!-- 信息内容 -->
    <div class="module-wrapper">
      <div class="module-outer">
        <div class="module-title"> <!-- optionList -->
          <span class="module-title-text">基本信息</span>
        </div>
        <div class="module-option">
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectBaseInfo.projectName">项目名称</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectBaseInfo.projectLevel">集团项目级别</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectBaseInfo.planApprovalTime">计划立项时间</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectBaseInfo.planFinishTime">计划结项时间</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectBaseInfo.projectExpenditureType">费用类别</el-checkbox>
        </div>
      </div>
      <div class="module-outer">
        <div class="module-title">
          <span class="module-title-text">属性信息</span>
          <span>{{ '（此处不配置，动态表单模块配置）'}}</span>
        </div>
      </div>
      <div class="module-outer">
        <div class="module-title">
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectProduct">产品信息</el-checkbox>
        </div>
      </div>
      <div class="module-outer">
        <div class="module-title">
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectResource">资源信息</el-checkbox>
        </div>
      </div>
      <div class="module-outer">
        <div class="module-title"> <!-- optionList -->
          <span class="module-title-text">团队信息</span>
        </div>
        <div class="module-option">
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectTeam.leaderUndertakeManager">项目经理</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectTeam.projectMember">项目成员</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectTeam.projectExpert">专家</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectTeam.projectInspector">项目观察员</el-checkbox>
        </div>
      </div>
      <div class="module-outer">
        <div class="module-title">
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectBudget">项目预算</el-checkbox>
        </div>
      </div>
      <div class="module-outer">
        <div class="module-title"> <!-- optionList -->
          <span class="module-title-text">子项目信息</span>
        </div>
        <div class="module-option">
          <el-checkbox :disabled="!isEdit" v-model="checkData.subProjectInfo.projectName">子项目名称</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.subProjectInfo.projectManager">项目经理</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.subProjectInfo.subProjectAchievementList">任务及预期成果</el-checkbox>
        </div>
      </div>
      <div class="module-outer">
        <div class="module-title"> <!-- optionList -->
          <span class="module-title-text">里程碑信息</span>
        </div>
        <div class="module-option">
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectMileStone.milestoneName">里程碑名称</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectMileStone.milestoneDescription">里程碑描述</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectMileStone.planFinishTime">计划完成时间</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectMileStone.milestoneLeader">里程碑责任人</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectMileStone.resultInformationList">任务及预期成果</el-checkbox>
          <el-checkbox :disabled="!isEdit" v-model="checkData.projectMileStone.linkResultFlag">是否关联任务及预期成果</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import data from './data.js'
import API from '@/serve/API_groupPlan'
export default {
  data () {
    return {
      isEdit: false,
      checkData: data,
      dataId: null
    }
  },
  created () {
    this.getCheckboxMsg()
  },
  methods: {
    // 选择框值改变时触发
    changeOption (checkObj) {
    },
    // 获取多选框选择信息
    getCheckboxMsg () {
      // 初始化获取 如果数据库没有，默认使用data.js数据
      API.baseLineGetOption({ projectType: 'PC-UNDERTAKE-UNIT' })
        .then(res => {
          // 加个判断 有无数据
          if (res && res.content && res.content.length) {
            this.checkData = JSON.parse(res.content)
            this.dataId = res.id
          }
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 保存
    save () {
      if (!this.isEdit) return
      this.$confirm('基线信息变更影响全集团所有在途项目，请确认是否变更', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'self-build-project'
      })
        .then(response => {
          // 保存接口 projectType为后端提供的固定值
          API.baseLineSaveOption({ content: JSON.stringify(this.checkData), projectType: 'PC-UNDERTAKE-UNIT' })
            .then(res => {
              this.isEdit = false
              this.getCheckboxMsg()
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '...失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch(() => {
        })
    }
  }
}
</script>
<style lang="scss">
.self-build-project{
  .el-button.el-button--primary:hover{
    @include background-color();
  }
}
</style>
<style lang='scss' scoped src="../scss/style.scss">
</style>
