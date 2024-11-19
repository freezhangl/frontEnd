<template>
  <div class="groupProjectSearch-container">
    <div class="content">
      <div class="search-content">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="集团统筹需求单位项目" name="groupDemandUnitProject" v-if="showGroupProjectDemand">
          </el-tab-pane>
          <el-tab-pane label="集团统筹承担单位项目" name="groupUndertakingUnitProject" v-if="showGroupProjectUndertake">
          </el-tab-pane>
          <el-tab-pane label="承担单位自立项目" name="selfUnitIndependentProject" v-if="showGroupProjectSelf">
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
import groupDemandUnitProject from '../groupPlan/tabPages/groupProject/groupDemandUnitProject/groupDemandUnitProject'
import groupUndertakingUnitProject from '../groupPlan/tabPages/groupProject/groupUndertakingUnitProject/groupUndertakingUnitProject'
import selfUnitIndependentProject from '../groupPlan/tabPages/groupProject/selfUnitIndependentProject/selfUnitIndependentProject'
import { mapGetters } from 'vuex'

export default {
  components: { groupDemandUnitProject, groupUndertakingUnitProject, selfUnitIndependentProject },
  data () {
    return {
      showGroupProjectDemand: false,
      showGroupProjectUndertake: false,
      showGroupProjectSelf: false,
      activeName: 'groupDemandUnitProject' // tab标签
    }
  },
  computed: {
    ...mapGetters({
      hasAuthTag: 'USERENTITY/hasAuthTag'
    })
  },
  created () {
    this.getsessionStorage()
  },
  mounted () {
    this.showGroupProjectDemand = this.hasAuthTag('projectManage:groupProject:demand')
    this.showGroupProjectUndertake = this.hasAuthTag('projectManage:groupProject:undertake')
    this.showGroupProjectSelf = this.hasAuthTag('projectManage:groupProject:self')
    if (this.showGroupProjectDemand) {
      this.activeName = 'groupDemandUnitProject'
    } else if (this.showGroupProjectUndertake) {
      this.activeName = 'groupUndertakingUnitProject'
    } else if (this.showGroupProjectSelf) {
      this.activeName = 'selfUnitIndependentProject'
    }
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName
    }
  },
  methods: {
    getsessionStorage () {
      if (sessionStorage.getItem('groupProject_activeName')) {
        this.activeName = sessionStorage.getItem('groupProject_activeName')
      } else {
        this.activeName = ''
      }
    },
    handleTabClick (tab) {
      sessionStorage.setItem('groupProject_activeName', tab.name)
    }
  }
}
</script>
<style lang="scss" scoped>
.groupProjectSearch-container {
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
