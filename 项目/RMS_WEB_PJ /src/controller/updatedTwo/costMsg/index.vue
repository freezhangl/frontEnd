<template>
  <!-- 成本信息 -->
  <div class="wrapper">
    <div class="wrapper-inner">
      <div class="top-button-wrapper">
        <el-button class="sync-btn" @click="syncCost" v-if="isEditable && !notProjectApproval">立即同步实际成本</el-button>
      </div>
      <div class="table-wrapper">
        <detail v-if="isShow"></detail>
      </div>
      <div class="notes">
        <div class="left-title"><p>备注：</p></div>
        <div class="right-content">
          <p>集团批复：集团计划批复时的预算金额</p>
          <p>计划成本：本单位项目立项的预算金额</p>
          <p>实际成本：从ERP获取该项目的实际成本信息</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { arr, rowArr } from './data'
import API from '@/serve/API_projectInfo'
import APIProject from '@/serve/API_project'
import detail from './detail'
export default {
  components: { detail },
  data () {
    return {
      isShow: true,
      isEditable: false,
      notProjectApproval: true,
      projectCode: this.$route.params.projectCode
    }
  },

  mounted () {
  },
  created () {
    // 权限校验
    this.verificationPermission()
    // 获取项目信息 判断项目状态
    this.getProjectInfo()
  },
  methods: {
    // 同步实际成本
    syncCost () {
      this.isShow = false
      let params = {
        projectCode: this.$route.params.projectCode
      }
      API.syncCost(params)
        .then(res => {
          this.$message({
            message: '同步成功！',
            type: 'success',
            showClose: true
          })
          this.isShow = true
        })
        .catch(e => {
          this.isShow = true
          this.$message({
            message: e.message || '同步失败，请稍后重试！',
            type: 'error',
            showClose: true
          })
        })
    },
    // 获取项目信息
    getProjectInfo () {
      APIProject.queryEffectiveProjectInfo(this.projectCode)
        .then(res => {
          let status = res.projectBaseInfo.projectDetailsStatus
          if (status && (status.toString() === '0' || status.toString() === '1')) {
          // 项目状态 -> 未立项时
            this.notProjectApproval = true
          } else {
            this.notProjectApproval = false
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 权限校验 -> 是否有同步成本权限
    verificationPermission () {
      const param = {
        projectCode: this.$route.params.projectCode
      }
      APIProject.verificationPermission(param)
        .then(res => {
          if (res.includes('00') || res.includes('02')) {
            this.isEditable = true
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '校验权限失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
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
}
</style>
