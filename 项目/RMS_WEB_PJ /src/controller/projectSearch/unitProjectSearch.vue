<template>
  <div class="unitProjectSearch-container">
    <div class="content">
      <div class="search-content">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="集团统筹需求单位项目" name="groupDemandUnitProject" v-if="showUnitProjectDemand">
          </el-tab-pane>
          <el-tab-pane label="集团统筹承担单位项目" name="groupUndertakingUnitProject" v-if="showUnitProjectUndertake">
          </el-tab-pane>
          <el-tab-pane label="本单位自立项目" name="selfUnitIndependentProject" v-if="showUnitProjectSelf">
          </el-tab-pane>
        </el-tabs>
      </div>
      <group-demand-unit-project v-if="activeName==='groupDemandUnitProject'">
      </group-demand-unit-project>
      <group-undertaking-unit-project
        v-if="activeName==='groupUndertakingUnitProject'">
      </group-undertaking-unit-project>
      <self-unit-independent-project
        v-if="activeName==='selfUnitIndependentProject'">
      </self-unit-independent-project>
    </div>
  </div>
</template>
<script>
import groupDemandUnitProject from '../groupPlan/tabPages/independentProject/groupDemandUnitProject/groupDemandUnitProject'
import groupUndertakingUnitProject from '../groupPlan/tabPages/independentProject/groupUndertakingUnitProject/groupUndertakingUnitProject'
import selfUnitIndependentProject from '../groupPlan/tabPages/independentProject/selfUnitIndependentProject/selfUnitIndependentProject'
import { mapGetters } from 'vuex'

export default {
  components: { groupDemandUnitProject, groupUndertakingUnitProject, selfUnitIndependentProject },
  data () {
    return {
      showUnitProjectDemand: false,
      showUnitProjectUndertake: false,
      showUnitProjectSelf: false,
      activeName: 'groupDemandUnitProject' // tab标签
    }
  },
  computed: {
    ...mapGetters({
      hasAuthTag: 'USERENTITY/hasAuthTag'
    })
  },
  mounted () {
    this.showUnitProjectDemand = this.hasAuthTag('projectManage:unitProject:demand')
    this.showUnitProjectUndertake = this.hasAuthTag('projectManage:unitProject:undertake')
    this.showUnitProjectSelf = this.hasAuthTag('projectManage:unitProject:self')
    if (this.showUnitProjectDemand) {
      this.activeName = 'groupDemandUnitProject'
    } else if (this.showUnitProjectUndertake) {
      this.activeName = 'groupUndertakingUnitProject'
    } else if (this.showUnitProjectSelf) {
      this.activeName = 'selfUnitIndependentProject'
    }
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName
    }
  },
  created () {
    this.activeName = 'groupDemandUnitProject'
    this.getsessionStorage()
  },
  methods: {
    getsessionStorage () {
      if (sessionStorage.getItem('unitProject_activeName')) {
        this.activeName = sessionStorage.getItem('unitProject_activeName')
      } else {
        this.activeName = ''
      }
    },
    handleTabClick (tab) {
      sessionStorage.setItem('unitProject_activeName', tab.name)
    }
  }
}
</script>
<style lang="scss" scoped>
.unitProjectSearch-container {
  .content {
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
  }
}
</style>
