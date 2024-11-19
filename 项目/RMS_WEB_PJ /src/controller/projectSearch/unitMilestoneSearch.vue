  <!-- 本单位-里程碑查询 -->
<template>
  <div class="">
    <div class="content">
      <div class="search-content">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="委托项目-单位父项目里程碑" name="entrustParentMilestone">
          </el-tab-pane>
          <el-tab-pane label="委托项目-单位子项目里程碑" name="entrustChildMilestone">
          </el-tab-pane>
          <el-tab-pane label="自立项目里程碑" name="selfIndependentMilestone">
          </el-tab-pane>
        </el-tabs>
      </div>
      <entrustParentMilestone v-if="activeName === 'entrustParentMilestone'"></entrustParentMilestone>
      <entrustChildMilestone v-if="activeName === 'entrustChildMilestone'"></entrustChildMilestone>
      <selfIndependentMilestone v-if="activeName === 'selfIndependentMilestone'"></selfIndependentMilestone>
    </div>
  </div>
</template>
<script>
import entrustParentMilestone from './component/milestoneSearch/unit/entrustParentMilestone'
import entrustChildMilestone from './component/milestoneSearch/unit/entrustChildMilestone'
import selfIndependentMilestone from './component/milestoneSearch/unit/selfIndependentMilestone'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeName: 'entrustParentMilestone'
    }
  },
  components: { entrustParentMilestone, entrustChildMilestone, selfIndependentMilestone },
  computed: {
    ...mapGetters({
      hasAuthTag: 'USERENTITY/hasAuthTag'
    })
  },
  mounted () {
    this.showUnitMilestoneDemand = this.hasAuthTag('projectManage:unitMilestone:demand')
    this.showUnitMilestonUndertake = this.hasAuthTag('projectManage:unitMilestone:undertake')
    this.showUnitMilestonSelf = this.hasAuthTag('projectManage:unitMilestone:self')
    if (this.showUnitMilestoneDemand) {
      this.activeName = 'entrustParentMilestone'
    } else if (this.showUnitMilestonUndertake) {
      this.activeName = 'entrustChildMilestone'
    } else if (this.showUnitMilestonSelf) {
      this.activeName = 'selfIndependentMilestone'
    }
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
