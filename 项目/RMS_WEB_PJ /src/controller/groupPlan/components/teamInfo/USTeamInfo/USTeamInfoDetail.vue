<template>
  <div class="USTeamInfoDetail">
    <project-panel title="团队信息" :show-expand="showExpand">
      <div class="LeadDemandUnit">
        <el-form label-width="130px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目经理：">
                <span v-for="(projectObserver,index) in manageList" :key="projectObserver.userAccount" :class="{'highlightStyle':temamHighlight && temamHighlight.managerHighlight}">
                  {{projectObserver.userName}}
                  <span v-if="index<manageList.length-1">，</span>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目成员：">
                <span v-for="(projectObserver,index) in memberList" :key="projectObserver.userAccount" :class="{'highlightStyle':temamHighlight && temamHighlight.memberHighlight}">
                  {{projectObserver.userName}}
                  <span v-if="index<memberList.length-1">，</span>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目观察员：">
                <span v-for="(projectObserver,index) in projectObservers" :key="projectObserver.userAccount" :class="{'highlightStyle':temamHighlight && temamHighlight.observerHighlight}">
                  {{projectObserver.userName}}
                  <span v-if="index<projectObservers.length-1">，</span>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="专家：">
                <span v-for="(expert,index) in experts" :key="expert.userAccount" :class="{'highlightStyle':temamHighlight && temamHighlight.expertHighlight}">
                  {{expert.userName}}
                  <span v-if="index<experts.length-1">，</span>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
      manageList: [], // 项目经理
      memberList: [], // 项目成员
      projectObservers: [], // 项目观察员
      experts: [], // 专家
      undertakeInfo: { coopList: [], leader: {} }, //承担部门信息
      temamHighlight: null,
      rowClass: []
    }
  },
  props: {
    projectCompanyList: {
      type: Array,
      default: () => []
    },
    projectTeamList: {
      type: Array,
      default: () => []
    },
    teamUndertakeHighlight: {
      type: Object,
      default: () => {}
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
          this.undertakeInfo = { coopList: [], leader: {} }
          let tempList = JSON.parse(JSON.stringify(newValue))
          tempList.forEach(element => {
          // element.type 需求方1，承担方2，联合攻关单位3
            if (element.type === '2') {
              this.$set(element, 'managers', [])
              this.$set(element, 'members', [])
              if (element.leaderFlag === '1') { //牵头
                element.projectTeamList.forEach(item => {
                  //牵头-承担-项目经理
                  if (item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MANAGER') {
                    element.managers.push(item)
                  } else if (item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MEMBER') {
                    element.members.push(item)
                  }
                })
                this.undertakeInfo.leader = element
              } else if (element.leaderFlag === '0') { //配合
                element.projectTeamList.forEach(item => {
                  //配合-承担-项目经理
                  if (item.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MANAGER') {
                    element.managers.push(item)
                  } else if (item.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER') {
                    element.members.push(item)
                  }
                })
                this.undertakeInfo.coopList.push(element)
              }
            }
          })
        }
      }
    },
    projectTeamList: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue && newValue.length) {
          this.manageList = []
          this.memberList = []
          this.projectObservers = []
          this.experts = []
          let tempList = JSON.parse(JSON.stringify(newValue))
          tempList.forEach(item => {
            if (item.projectRoleCode === 'PR-MANAGER' || item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MANAGER') {
              this.manageList.push(item)
            }
            if (item.projectRoleCode === 'PR-MEMBER' || item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MEMBER' || item.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER') {
              this.memberList.push(item)
            }
            if (item.projectRoleCode === 'PR-PROJECT-OBSERVER') {
              this.projectObservers.push(item)
            }
            if (item.projectRoleCode === 'PR-EXPERT') {
              this.experts.push(item)
            }
          })
        }
      }
    },
    teamUndertakeHighlight: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.temamHighlight = newValue
        }
      }
    }
  },
  methods: {
    //设置表格索引
    setIndexMethod (index) {
      if (index < 9) {
        return '0' + (index + 1)
      }
      return index + 1
    },
    setRowClassName ({ row, rowIndex }) {
      let className = ''
      if (row.highlightProp) {
        if (rowIndex > 0 && this.rowClass[rowIndex - 1]) {
          className = 'highlight-border highlight-border-none-top'
        } else {
          className = 'highlight-border'
        }
      }
      this.rowClass[rowIndex] = className
      return className
    },
    setCellClassName ({ row, column, rowIndex, columnIndex }) {
      let className = ''
      if ((columnIndex === 0 && row.highlightProp && row.managerHighlightProp && row.memberHighlightProp) ||
       (columnIndex === 1 && row.highlightProp) ||
       (columnIndex === 2 && row.managerHighlightProp) ||
       (columnIndex === 3 && row.memberHighlightProp)) {
        className = 'highlightStyle'
      }
      return className
    }
  }
}
</script>
<style lang="scss" scoped>
.USTeamInfoDetail /deep/{
  .project-panel .panel-body{
    // margin-bottom: 0;
  }
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
    .el-table{
      border: 1px solid #E9E9E9;
      border-bottom-style: hidden;
      margin-bottom: 20px;
    }

    .highlightStyle{
      color: #FF3F3B;
    }
    .el-table .el-table__row.highlight-border{
      td{
        position: relative;
        z-index: 1000;
        border-top: 1px solid #ff3f3b;
        border-bottom: 1px solid #FF3F3B !important;
        &:nth-child(1){
          border-left: 1px solid #FF3F3B;
        }
        &:nth-last-child(1){
          border-right: 1px solid #FF3F3B;
        }
      }
      &.highlight-border-none-top td{
        border-top: 1px solid #EBEEF5;
      }
    }
}
</style>
