<template>
  <div class="DSTeamInfoDetail">
    <project-panel title="团队信息" :show-expand="showExpand">
      <div class="body-con" v-for="org in orgTypeList" :key="org.type">
        <project-panel
          v-if="org.show"
          :title="org.title+'单位'"
          :show-expand='false'
          class="addcon">
          <div class="LeadDemandUnit" v-if="org.type !== 'joint' && JSON.stringify(org.leader) !== '{}'">
            <el-row>
              <el-col :span="7">牵头{{org.title}}单位：<span :class="{'highlightStyle':org.leader.highlightProp}">{{org.leader.organizationName}}</span></el-col>
              <el-col :span="8">
                {{org.title === '承担' && (projectClass === 'IC_E' || projectClass === 'IC_F' || projectClass === 'IC_G') ? '项目执行经理：' : '项目经理：'}}
                <span :class="{'highlightStyle':org.leader.managerHighlightProp}" v-for="(manager,index) in org.leader.managers" :key="manager.userAccount">
                  {{manager.userName}}
                  <span v-if="index<org.leader.managers.length-1">，</span>
                </span>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="24">
                项目成员：
                <span :class="{'highlightStyle':org.leader.memberHighlightProp}" v-for="(member,index) in org.leader.members" :key="member.userAccount">
                  {{member.userName}}
                  <span v-if="index<org.leader.members.length-1">，</span>
                </span>
              </el-col>
            </el-row>
          </div>
          <el-table
            :data="org.coopList"
            style="width:100%"
            :border="false"
            :row-class-name="setRowClassName"
            :cell-class-name="setCellClassName">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="60px"
              :index="setIndexMethod">
            </el-table-column>
            <el-table-column
              align="left"
              prop="organizationName"
              :label="org.type === 'joint' ? '单位名称' : `配合${org.title}单位`"
              minwidth="150">
            </el-table-column>
            <el-table-column
              align="left"
              prop="managers"
              label="项目经理"
              minwidth="150">
              <template slot-scope="scope">
                <span v-for="(manager,index) in scope.row.managers" :key="manager.userAccount">{{manager.userName}}<span v-if="index<scope.row.managers.length-1">，</span></span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="org.type !== 'joint'"
              align="left"
              prop="members"
              label="项目成员"
              min-width="200">
              <template slot-scope="scope">
                <span v-for="(member,index) in scope.row.members" :key="member.userAccount">{{member.userName}}<span v-if="index<scope.row.members.length-1">，</span></span>
              </template>
            </el-table-column>
          </el-table>
        </project-panel>
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
      orgTypeList: [ //单位类型 0-需求方demand 1-承担方undertake 2-联合攻关单位joint
        { type: 'demand', title: '需求', coopList: [], leader: {}, show: true },
        { type: 'undertake', title: '承担', coopList: [], leader: {}, show: true },
        { type: 'joint', title: '联合攻关', coopList: [], leader: {}, show: true }
      ],
      rowClass: []
    }
  },
  props: {
    projectCompanyList: {
      type: Array,
      default: () => []
    },
    //需求非一般支撑包 - 项目类别=关键核心技术攻关IC_B时显示为“项目执行经理”
    projectClass: { type: String, default: '' },
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
          this.orgTypeList = [ //单位类型 0-需求方demand 1-承担方undertake 2-联合攻关单位joint
            { type: 'demand', title: '需求', coopList: [], leader: {}, show: true },
            { type: 'undertake', title: '承担', coopList: [], leader: {}, show: true },
            { type: 'joint', title: '联合攻关', coopList: [], leader: {}, show: true }
          ]
          let tempList = JSON.parse(JSON.stringify(newValue))
          tempList.forEach(element => {
          // element.type 需求方1，承担方2，联合攻关单位3
            this.$set(element, 'managers', [])
            this.$set(element, 'members', [])
            if (element.leaderFlag === '1') { //牵头
              let leadManageCode = ''; let leadMemberCode = ''
              switch (element.type) {
                case '1':
                  leadManageCode = 'PR-LEADER-DEMAND-MANAGER' //牵头-需求-项目经理
                  leadMemberCode = 'PR-LEADER-DEMAND-MEMBER' //牵头-需求-项目成员
                  break
                case '2':
                  leadManageCode = 'PR-LEADER-UNDERTAKER-MANAGER' //牵头-承担-项目经理
                  leadMemberCode = 'PR-LEADER-UNDERTAKER-MEMBER' //牵头-承担-项目成员
                  break
              }
              element.projectTeamList.forEach(item => {
                if (item.projectRoleCode === leadManageCode) {
                //牵头-需求-项目经理，牵头-承担-项目经理
                  element.managers.push(item)
                } else if (item.projectRoleCode === leadMemberCode) {
                //牵头-需求-项目成员，牵头-承担-项目成员
                  element.members.push(item)
                }
              })
              this.orgTypeList[parseInt(element.type) - 1].leader = element
            } else if (element.leaderFlag === '0') { //配合
              if (element.type === '3') { //联合攻关
                element.projectTeamList.forEach(item => {
                //联合攻关项目经理
                  if (item.projectRoleCode === 'PR-UNITE-ASSAULT-MANAGER') {
                    element.managers.push(item)
                  }
                })
                this.orgTypeList[2].coopList.push(element)
              } else { //需求、承担
                let coopManageCode = ''; let coopMemberCode = ''
                switch (element.type) {
                  case '1':
                    coopManageCode = 'PR-PARTNER-DEMAND-MANAGER' //配合-需求-项目经理
                    coopMemberCode = 'PR-PARTNER-DEMAND-MEMBER' //配合-需求-项目成员
                    break
                  case '2':
                    coopManageCode = 'PR-PARTNER-UNDERTAKER-MANAGER' //配合-承担-项目经理
                    coopMemberCode = 'PR-PARTNER-UNDERTAKER-MEMBER' //配合-承担-项目成员
                    break
                }
                element.projectTeamList.forEach(item => {
                  if (item.projectRoleCode === coopManageCode) {
                  //配合-需求-项目经理，配合-承担-项目经理
                    element.managers.push(item)
                  } else if (item.projectRoleCode === coopMemberCode) {
                  //配合-需求-项目成员，配合-承担-项目成员
                    element.members.push(item)
                  }
                })
                this.orgTypeList[parseInt(element.type) - 1].coopList.push(element)
              }
            }
          })
          this.orgTypeList.forEach(item => {
            if (JSON.stringify(item.leader) === '{}' && item.coopList.length === 0) {
              item.show = false
            }
          })
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
.DSTeamInfoDetail /deep/{
  .project-panel .panel-body{
    margin-bottom: 0;
  }
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
     .addcon{
      border: 1px solid #E9E9E9;
      margin-bottom: 20px;
      .panel-body{
        padding-bottom: 20px;
        padding-left: 30px;
      }
       &:last-child{
         margin-bottom: 0;
       }
    }
    .LeadDemandUnit{
      .el-row{
      margin-bottom: 4px;
      span{
        // margin-left: 10px;
      }
      }
    }
    .el-table{
      border: 1px solid #E9E9E9;
      border-bottom-style: hidden;
    }
    .body-con{
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
