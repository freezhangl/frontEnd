<template>
  <div class="project-container">
    <div class="content">
      <div class="search-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="集团统筹项目6521" name="groupPlan">
          </el-tab-pane>
          <el-tab-pane label="本单位自立项目2" name="independentProject">
          </el-tab-pane>
        </el-tabs>
      </div>
      <showIndependentProject v-if="activeName==='independentProject'"></showIndependentProject>
      <showGroupPlan v-if="activeName==='groupPlan'"></showGroupPlan>
    </div>
  </div>
</template>

<script>
import API from '@/serve/API_project'

import { mapGetters } from 'vuex'
import merge from 'webpack-merge'
import showGroupPlan from './showGroupPlan'
import showIndependentProject from './showIndependentProject'
export default {
  name: 'projectList',
  components: {
    showGroupPlan,
    showIndependentProject
  },
  data () {
    return {
      activeName: 'independentProject'
    }
  },
  filters: {
  },
  computed: {
    // ...mapGetters({
    //   menuResCode: 'USERENTITY/menuResCode'
    // })
  },
  mounted () {
  },
  created () {
    // this.getProjectType()
    // this.myProjectList() //获取项目列表数据
    // this.groupPlanProjectList()//获取集团统筹列表
    // this.intercept()
    // this.activeName = this.$route.query.activeTab || 'independentProject'
    this.getsessionStorage()
  },
  beforeRouteLeave (to, from, next) {
    if (sessionStorage.getItem('activeTab')) {
      sessionStorage.removeItem('activeTab')
    }
    next()
  },
  methods: {
    //获取localStorage本地缓存
    getsessionStorage () {
      if (sessionStorage.getItem('activeTab')) {
        this.activeName = sessionStorage.getItem('activeTab')
      } else {
        this.activeName = 'independentProject'
      }
    },
    // 搜索
    // searchProject (e) {
    //   if (e === 'groupPlan') { //统筹项目
    //     this.groupPlanProjectList()
    //   }
    //   if (e === 'independentProject') { //自立项目
    //     this.myProjectList()
    //   }
    // },
    // 重置查询栏表单
    // resetProjectList (e) {
    //   this.$refs.searchForm.resetFields()
    //   this.searchForm.projectDetailsStatus = null
    //   this.projectStatusContent = ''
    //   if (e === 'groupPlan') { //统筹项目
    //     this.groupPlanProjectList()
    //   }
    //   if (e === 'independentProject') { //自立项目
    //     this.myProjectList()
    //   }
    // },
    // 调整时间传参格式
    dateTransfer (date) {
      let y = date.getFullYear()
      return y
    },
    handleClick (tab, event) {
      sessionStorage.setItem('activeTab', tab.name)
      // this.$router.push({
      //   query: { 'activeTab': tab.name }
      // })
      // this.$router.push({
      //   query: merge({}, { 'activeTab': this.activeName })
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.project-container{
  .content{
    .search-content{
      background: white;
      // margin-bottom: 10px;
      // button{
      //   font-size: 12px;
      //   border-radius: 2px;
      //   width: 80px;
      //   height: 30px;
      // }
      /deep/.el-tabs__header{
        margin-bottom: 10px;
      }
      /deep/ .el-tabs__nav{
        margin-left: 25px;
      }
    }
  }
}
</style>
