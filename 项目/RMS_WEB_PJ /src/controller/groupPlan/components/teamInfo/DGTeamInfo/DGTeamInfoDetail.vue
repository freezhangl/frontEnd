<template>
  <div class="DGTeamInfoDetail">
    <project-panel title="团队信息" :show-expand="showExpand">
      <div class="content">
        <el-row>
          <el-col :span="7">需求单位：<span :class="{'highlightStyle':demandInfo.highlightProp}">{{demandInfo.organizationName}}</span></el-col>
          <el-col :span="8">
            项目经理：
            <span v-for="(manager,index) in demandInfo.managers" :key="manager.userAccount" :class="{'highlightStyle':demandInfo.managerHighlightProp}">
              {{manager.userName}}
              <span v-if="index<demandInfo.managers.length-1">，</span>
            </span>
          </el-col>
          <el-col :span="9">
            项目成员：
            <span v-for="(member,index) in demandInfo.members" :key="member.userAccount" :class="{'highlightStyle':demandInfo.memberHighlightProp}">
              {{member.userName}}
              <span v-if="index<demandInfo.members.length-1">，</span>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">承担单位：<span :class="{'highlightStyle':undertakeInfo.highlightProp}">{{undertakeInfo.organizationName}}</span></el-col>
          <el-col :span="8">
            项目经理：
            <span v-for="(manager,index) in undertakeInfo.managers" :key="manager.userAccount" :class="{'highlightStyle':undertakeInfo.managerHighlightProp}">
              {{manager.userName}}
              <span v-if="index<undertakeInfo.managers.length-1">，</span>
            </span>
          </el-col>
          <el-col :span="9">
            项目成员：
            <span v-for="(member,index) in undertakeInfo.members" :key="member.userAccount" :class="{'highlightStyle':undertakeInfo.memberHighlightProp}">
              {{member.userName}}
              <span v-if="index<undertakeInfo.members.length-1">，</span>
            </span>
          </el-col>
        </el-row>
      </div>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
export default {
  components: { projectPanel },
  data () {
    return {
      demandInfo: {}, //需求单位相关信息
      undertakeInfo: {} //承担单位相关信息
    }
  },
  props: {
    projectCompanyList: {
      type: Array,
      default: () => []
    },
    showExpand: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    projectCompanyList: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue && newValue.length) {
          let tempList = JSON.parse(JSON.stringify(newValue))
          tempList.forEach(element => {
          // element.type 需求方1，承担方2，联合攻关单位3
            this.$set(element, 'managers', [])
            this.$set(element, 'members', [])
            if (element.type === '1') { //需求单位
              element.projectTeamList.forEach(item => {
                if (item.projectRoleCode === 'PR-LEADER-DEMAND-MANAGER') { //牵头-需求-项目经理
                  element.managers.push(item)
                } else if (item.projectRoleCode === 'PR-LEADER-DEMAND-MEMBER') { //牵头-需求-项目成员
                  element.members.push(item)
                }
              })
              this.demandInfo = element
            } else if (element.type === '2') { //承担单位
              element.projectTeamList.forEach(item => {
                if (item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MANAGER') { //牵头-承担-项目经理
                  element.managers.push(item)
                } else if (item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MEMBER') { //牵头-承担-项目成员
                  element.members.push(item)
                }
              })
              this.undertakeInfo = element
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.DGTeamInfoDetail /deep/{
  .project-panel .panel-body{
    margin-bottom: 0;
  }

  .content{
    margin: 0 10px;
    .el-row{
    margin-bottom: 2px;
    &:last-child{
      margin-bottom: 0px;
    }
    span{
      // margin-left: 10px;
    }
  }
  }

  .highlightStyle{
    color: #FF3F3B;
  }
}
</style>
