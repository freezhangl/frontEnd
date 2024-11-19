  <!-- 全集团-父项目里程碑查询 -->
<template>
  <div class="">
    <div class="content">
      <div class="search-content">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="委托项目-单位父项目里程碑" name="entrustParentMilestone">
          </el-tab-pane>
        </el-tabs>
      </div>
      <entrustParentMilestone v-if="activeName === 'entrustParentMilestone'"></entrustParentMilestone>
    </div>
  </div>
</template>
<script>
import entrustParentMilestone from './component/milestoneSearch/group/entrustParentMilestone'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeName: 'entrustParentMilestone'
    }
  },
  components: { entrustParentMilestone },
  computed: {
    ...mapGetters({
      hasAuthTag: 'USERENTITY/hasAuthTag'
    })
  },
  mounted () {
    this.showGroupMilestoneDemand = this.hasAuthTag('projectManage:groupMilestone:demand')
    // this.showGroupMilestonUndertake = this.hasAuthTag('projectManage:groupMilestone:undertake')
    // this.showGroupMilestonSelf = this.hasAuthTag('projectManage:groupMilestone:self')
    if (this.showGroupMilestoneDemand) {
      this.activeName = 'entrustParentMilestone'
    }/*  else if (this.showGroupMilestonUndertake) {
      this.activeName = 'entrustChildMilestone'
    } else if (this.showGroupMilestonSelf) {
      this.activeName = 'selfIndependentMilestone'
    } */
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName
    }
  },
  methods: {
    handleTabClick () {}
  }
}
</script>
<style lang="scss" scoped>
.search-content {
  background: #fff;
  font-size: 14px;
  .form-button {
    float: right;
    padding-top: 5px;

    .primary-button {
      height: 30px;
    }

    .reset-button {
      height: 30px;
      color: #0B82FF;
      border: 1px solid rgba(11, 130, 255, 0.50);
    }
  }

  /deep/ .el-tabs__nav {
    margin-left: 25px;
  }
}
</style>
