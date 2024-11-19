<template>
  <div class="person-sel-dialog">
    <el-dialog
      v-dialogDrag
      title="选择人员"
      :visible.sync="show"
      top="5vh"
      :lock-scroll="true"
      width="1164px"
      :before-close="beforeClose"
    >
      <div class="dialog-main">
        <div class="left-con">
          <div class="panel-header">组织树</div>
          <div class="tree-con">
            <el-scrollbar>
              <el-tree
                ref="tree"
                :data="treeData"
                :props="defaultProps"
                :load="loadNode"
                node-key="orgCode"
                lazy
                @node-click="handleNodeClick"
                :expand-on-click-node="false"
                :highlight-current="true"
                empty-text="暂无数据"
              ></el-tree>
            </el-scrollbar>
          </div>
        </div>
        <div class="right-con">
          <div class="person-list">
            <div class="panel-header">人员列表</div>
            <div class="list-con">
              <el-form
                :model="searchForm"
                ref="searchForm"
                class="search-form"
                :inline="true"
                label-width="80px"
                label-position="left">
                <div style="display: flex">
                  <div class="search-in" style="flex: 1">
                    <el-input
                      :input="changeData()"
                      v-model.trim="searchForm.name"
                      clearable
                      placeholder="请输入员工姓名/邮箱/用户账号"
                      @keyup.enter.native="searchPerson"
                      @clear="clearName()"
                      style="width:100%"></el-input>
                  </div>
                  <div style="margin-left: 10px">
                    <el-button
                      type="primary"
                      icon="el-icon-search"
                      :disabled="canSerach"
                      @click="searchPerson">查询</el-button>
                  </div>
                </div>
                <!-- <el-form-item label="" prop="name" class="search-in">
                  <el-input
                    :input="changeData()"
                    v-model.trim="searchForm.name"
                    clearable
                    placeholder="请输入员工姓名/邮箱/uid"
                    style="width:560px"></el-input>
                </el-form-item>
                <el-form-item class="search-btn">
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    :disabled="canSerach"
                    @click="searchPerson">查询</el-button>
                </el-form-item> -->
              </el-form>
              <el-table
                :data="tableData"
                width="100%"
                height="calc(100% - 113px)"
                max-height="calc(100% - 113px)"
                style="width: calc(100% - 2px);border:none;">
                <el-table-column
                  prop="chineseName"
                  label="员工姓名"
                  :show-overflow-tooltip="true"
                  width="120"
                  class-name="firstColumn"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="employeeNum"
                  label="员工编号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="uid"
                  label="用户账号"
                  :show-overflow-tooltip="true"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="orgName"
                  label="所属单位/部门"
                  :show-overflow-tooltip="true"
                  width="287">
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作"
                  class-name="lastColumn"
                  width="100">
                  <template slot-scope="scope">
                    <el-button
                      class="opt-btn"
                      v-if="checkPick(scope.row)"
                      :disabled="setPickDisable(scope.row)"
                      type="text"
                      @click="pickPersion(scope.row)"
                      style="cursor: pointer;padding:3px 0 !important">
                      选中
                    </el-button>
                    <div
                      v-if="!checkPick(scope.row)"
                      :class="!checkPick(scope.row) ? 'check-Persion' : ''">已选中</div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="override-default-pagination" v-if="searchForm.total > 0">
                <el-pagination
                  size="small"
                  background
                  layout="prev, pager, next"
                  @current-change="pageChange"
                  :page-size="searchForm.pageSize"
                  :current-page="searchForm.pageNum"
                  :total="searchForm.total">
                </el-pagination>
              </div>

            </div>
          </div>
          <div class="selected-con">
            <div class="panel-header">已选人员</div>
            <div class="person-con">
              <el-scrollbar>
                <span v-for="item in selectedPersons" :key="item.uid">
                  <el-tooltip :content="item.uid || item.userAccount" placement="top-start">
                    <el-tag
                      closable
                      effect="plain"
                      @close="handleClose(item)">
                      {{item.chineseName || item.userName}}
                    </el-tag>
                  </el-tooltip>
                </span>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button @click="cancleSelect">取消</el-button>
        <el-button @click="confirmSelect" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import APIGroup from '@/serve/API_groupPlanProject'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      roleType: '',
      maxNum: null,
      searchForm: {
        name: '',
        qName: '',
        pageSize: 5,
        pageNum: 1,
        total: 0,
        node: null,
        inSub: 0
      },
      selectedPersons: [],
      tableData: [],
      treeData: [{
        orgAbbr: '中国移动集团有限公司',
        orgCode: '00000000000000000000'
      }],
      orgCodeScope: '00000000000000000000',
      defaultProps: {
        children: 'children',
        label: 'orgAbbr',
        isLeaf: 'isLeaf'
      },
      disabledUser: null,
      canSerach: true,
      confirmName: '',
      disabledAllPerson: [],
      unitType: '' //组件类型 联合攻关单位->'joint'
    }
  },
  props: {
    projectCode: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    leadDepartmentCode: { // 牵头部门code
      type: String,
      default: ''
    },
    cooperateDepartmentCode: { // 承担部门code
      type: String,
      default: ''
    },
    allPerson: {
      type: Array,
      default: () => []
    },
    judge: {
      type: String,
      default: ''
    }
  },
  watch: {
    show: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.searchForm = {
            name: '',
            qName: '',
            pageSize: 5,
            pageNum: 1,
            total: 0,
            node: null
          }
          this.getDisabledPerson()
        }
      }
    },
    treeData (val, oldVal) {
      this.$nextTick(() => {
        this.initSearch()
        this.$refs.tree.setCurrentKey(this.treeData[0].orgCode)
      })
    }
    /* roleType (val, oldVal) {
      if (val === 'manage') {
        this.disabledAllPerson = this.allPerson.filter(ele => ele.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER')
      } else if (val === 'member') {
        this.disabledAllPerson = this.allPerson.filter(ele => ele.projectRoleCode === 'PR-LEADER-UNDERTAKER-MANAGER')
      } else {
        this.disabledAllPerson = this.allPerson
      }
    } */
  },
  computed: {},
  methods: {
    clearName () {
      this.initSearch()
      this.$refs.tree.setCurrentKey(this.treeData[0].orgCode)
    },
    changeData () {
      if (this.searchForm.name.replace(/(\s*$)/g, '')) {
        this.canSerach = false
      } else {
        this.canSerach = true
      }
    },
    async handleClose (tag) {
      let params = {
        projectCode: this.$route.params.projectCode,
        userAccount: tag.uid || tag.userAccount,
        type: this.unitType === 'demand' ? '1' : '2'
      }
      try {
        if (this.unitType !== 'joint' && this.unitType !== 'undertakeTeam') { //除需求项目联合攻关单位和承担项目团队信息外都需要校验成员
          let canDel = await APIGroup.canRemoveProjectTeam(params)
          if (!canDel) return
        }
        this.selectedPersons.splice(this.selectedPersons.indexOf(tag), 1)
      } catch (e) {
        if (e.selfError) return
        if (e.message) {
          this.$message({
            message: e.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        }
      }
      /* if (this.$listeners.judgeMember) {
        if (this.$listeners.judgeMember(tag.uid, this.judge)) return
        this.selectedPersons.splice(this.selectedPersons.indexOf(tag), 1)
      } else {
        this.selectedPersons.splice(this.selectedPersons.indexOf(tag), 1)
      } */
    },
    checkPick (row) {
      return ![...this.selectedPersons, ...this.disabledAllPerson].some(item => {
        return item.uid === row.uid || item.userAccount === row.uid
      })
    },
    getDisabledPerson () {
      this.disabledAllPerson = []
      /* if (this.roleType === 'manage') {
        this.disabledAllPerson = this.allPerson.filter(ele => ele.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER' || ele.projectRoleCode === 'PR-LEADER-UNDERTAKER-MEMBER')
      } else if (this.roleType === 'member') {
        this.disabledAllPerson = this.allPerson.filter(ele => ele.projectRoleCode === 'PR-LEADER-UNDERTAKER-MANAGER')
      } else {
        this.disabledAllPerson = []
      } */
    },
    pickPersion (row) {
      if (this.selectedPersons.length >= this.maxNum) {
        this.$message.error(`最多可选择${this.maxNum}人`)
        return false
      }
      this.selectedPersons.push(row)
    },
    cancleSelect () {
      this.$emit('update:show', false)
    },
    beforeClose (done) {
      this.cancleSelect()
    },
    initSearch () {
      this.searchForm.pageNum = 1
      this.searchForm.qName = this.searchForm.name
      this.searchForm.inSub = 0
      if (!this.searchForm.node) {
        this.searchForm.node = this.treeData[0]
      }
      this.getDptPerson()
    },
    searchPerson () {
      if (!this.searchForm.name) {
        return
      }
      this.confirmName = this.searchForm.name
      this.searchForm.pageNum = 1
      this.searchForm.qName = this.searchForm.name
      this.searchForm.inSub = 1
      if (!this.searchForm.node) {
        this.searchForm.node = this.treeData[0]
      }
      this.getDptPerson()
    },
    resetSearch () {
      this.searchForm.name = ''
      this.searchForm.inSub = 0
      this.searchPerson()
    },
    handleNodeClick (data) {
      this.searchForm.name = ''
      this.searchForm.qName = ''
      this.searchForm.node = data
      this.searchForm.pageNum = 1
      this.searchForm.inSub = 0
      this.tableData = []
      this.getDptPerson()
    },
    personDialogClosed () {},
    confirmSelect () {
      if (this.roleType === 'manage' || this.roleType === 'member') {
        if (this.selectedPersons.length === 0) {
          this.$message.error('请至少选择一个人员')
          return false
        }
      }
      // let selectedList = this.selectedPersons.map(item => {
      //       return {
      //         organizationCode: item.orgCode,
      //         companyCode: item.companyCode,
      //         userName: item.chineseName,
      //         employeeNum: item.employeeNum,
      //         userAccount: item.uid,
      //         uil: item.uid,
      //         selectedList: this.roleType
      //       }
      //     })
      this.selectedPersons.forEach(item => {
        item.organizationCode = item.orgCode || item.organizationCode
        item.userName = item.chineseName || item.userName
        item.selectedList = this.roleType
        item.userAccount = item.uid || item.userAccount
      })
      this.$emit('selected', { roleType: this.roleType, users: this.selectedPersons })
      this.$emit('update:show', false)
    },
    async loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData)
      }
      if (node.level >= 1) {
        return resolve(await this.getTreeData(node.data.orgCode))
      }
    },
    getTreeData (orgCode) {
      return new Promise((resolve, reject) => {
        API.orgListByParentOrgCodeNoAuth({
          parentOrgCode: orgCode,
          recursion: false
        })
          .then(res => {
            res.forEach(element => {
              element.isLeaf = !element.hasChildren
            })
            resolve(res)
          })
      })
    },
    getDptPerson (dep, reset) {
      API.allUserPageByorgCode2({
        orgCode: this.searchForm.node.orgCode,
        userNameLike: this.searchForm.qName,
        pageNum: this.searchForm.pageNum,
        pageSize: this.searchForm.pageSize,
        inSub: this.searchForm.inSub
      })
        .then(res => {
          this.searchForm.total = parseInt(res.total)
          this.tableData = res.records || []
        })
    },
    pageChange (page) {
      if (this.confirmName === this.searchForm.name) {
        this.searchForm.qName = this.searchForm.name
      } else {
        this.searchForm.qName = ''
      }
      this.searchForm.pageNum = page
      this.getDptPerson()
    },
    refreshTree (params) {
      this.roleType = params.roleType
      this.unitType = params.unitType
      this.selectedPersons = JSON.parse(JSON.stringify(params.users || []))
      this.tableData = []
      this.maxNum = params.max || 500
      if (params.disabledUser) {
        this.disabledUser = JSON.parse(JSON.stringify(params.disabledUser))
      }
      if (this.roleType === 'manage' || this.roleType === 'member') {
        this.orgCodeScope = params.orgCodeScope
        let orgCodeList = ''
        if (this.roleType === 'manage') {
          orgCodeList = this.orgCodeScope.leadDepartmentCode
        } else if (this.roleType === 'member') {
          orgCodeList = [this.orgCodeScope.leadDepartmentCode]
          if (this.orgCodeScope.cooperateDepartmentCode) {
            orgCodeList = [...JSON.parse(this.orgCodeScope.cooperateDepartmentCode), this.orgCodeScope.leadDepartmentCode]
          }
        }
        // debugger
        if (orgCodeList) {
          this.orgListByOrgCodeList(orgCodeList)
        }
      } else {
        this.treeData = params.node
      }
    },
    // 指定组织
    orgListByOrgCodeList (orgCodeList) {
      APIGroup.orgListByOrgCodeList({ orgCodeList: orgCodeList.toString() })
        .then(res => {
          if (res && res.length) {
            res.forEach(ele => {
              ele.orgAbbr = ele.orgName
            })
          }
          this.treeData = res
        })
    },
    setPickDisable (row) {
      // if (!this.disabledUser) return false
      // if (Array.isArray(this.disabledUser)) {
      //   return this.disabledUser.some(user => user.userAccount === row.uid)
      // } else {
      //   return this.disabledUser.userAccount === row.uid
      // }
      return false
    }
  },
  mounted () {},
  created () {
    /* if (this.orgCodeScope) {
      this.getTreeData(this.orgCodeScope, true)
    } */
  }
}
</script>
<style lang="scss" scoped>
.person-sel-dialog {
  .dialog-main {
    display: flex;

    /deep/ .el-tag{
      margin-right: 10px;
      border:none;
      background: none;

      &:hover{
        background-color: #e7f3ff;
        border-color: #cee6ff;
      }
    }

    .panel-header {
      line-height: 34px;
      color: #333;
      font-size: 14px;
      padding: 0 10px;
      border-bottom: 1px solid #e5e5e5;
    }

    .left-con {
      width: 235px;
      height: 595px;
      border: 1px solid #e5e5e5;
      margin-right: 16px;
      border-radius: 2px;

      .tree-con {
        height: 556px;
        .el-scrollbar {
          width: 100%;
          height: 100%;
          /deep/.el-scrollbar__wrap{
            overflow-x: hidden;
            height: 99%;
          }
        }
        /deep/ .el-tree{
          >.el-tree-node{
            display:inline-block;
            min-width: 234px;
          }
          .el-tree-node__content {
            height: 32px;
          }
        }
      }
    }

    .right-con {
      flex: 1;
      display: flex;
      flex-direction: column;

      .person-list {
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        height: 462px;

        .list-con {
          box-sizing: border-box;
          padding: 20px;
          height: calc(100% - 20px);
          display: flex;
          flex-direction: column;
          .search-form{
            height: 62px;
          }
          .el-table {
            // height: 289px;
            &::before{
              height:0;
            }
            /deep/ {
              tr{
                td.firstColumn,th.firstColumn{
                  border-left:1px solid rgb(229, 229, 229);
                }
                td.lastColumn,th.lastColumn{
                  border-right:1px solid rgb(229, 229, 229);
                }
              }
              .el-table__row {
                // height: 45px;
              }
            }
          }
          .override-default-pagination{
            height: 32px;
          }
          .opt-btn.is-disabled{
            border: none !important;
            background: none !important;
            cursor: not-allowed !important;
          }
        }
      }

      .selected-con {
        margin-top: 16px;
        border: 1px solid #e5e5e5;

        .person-con {
          height: 60px;
          margin: 10px;
          .el-scrollbar{
            height: 100%;
            /deep/.el-scrollbar__wrap{
              overflow-x: hidden;
              overflow-y: auto;
            }
          }
          .el-tag{
            background: none;
            border: none;
            font-size: 12px;
            @include color();
            height: 29px;
            margin-right: 12px;
            /deep/ .el-tag__close{
              color: #CECECE;
              &:hover{
                color: #ffffff;
              }
            }
            &:hover{
              @include background-color($color-blue,0.1);
              border-radius: 2px;
            }
          }
        }
      }

      /deep/ table{
        width:100% !important;
      }
    }
  }

  .override-default-pagination{
    text-align: center;
    padding:8px;
  }

  .search-in{
    /deep/ input{
      width : 100%
    }
  }

  .check-Persion {
    color: #ccc;
    cursor: not-allowed;
  }

}
</style>
