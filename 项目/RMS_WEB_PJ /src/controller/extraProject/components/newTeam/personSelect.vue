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
                label-position="left"
                onsubmit="return false;">
                <!-- <el-form-item class="search-in">
                  <el-input
                    v-model.trim="searchForm.name"
                    placeholder="请输入员工姓名/邮箱/用户账号"
                    @keyup.enter.native="searchPerson"
                    style="width:560px"></el-input>
                </el-form-item>
                <el-form-item class="search-btn">
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="searchPerson"
                    :disabled="searchForm.name == '' ? true: false">查询</el-button>
                  <el-button
                    class="normal-btn"
                    icon="el-icon-refresh-left"
                    @click="resetSearch">重置</el-button>
                </el-form-item> -->
                <div style="display: flex">
                  <div class="search-in" style="flex: 1">
                    <el-input
                      clearable
                      v-model.trim="searchForm.name"
                      placeholder="请输入员工姓名/邮箱/用户账号"
                      @keyup.enter.native="searchPerson"
                      @clear="clearName()"
                      style="width: 100%"></el-input>
                  </div>
                  <div style="margin-left: 10px">
                    <el-button
                      type="primary"
                      icon="el-icon-search"
                      @click="searchPerson"
                      :disabled="searchForm.name == '' ? true: false">查询</el-button>
                  </div>
                </div>
              </el-form>
              <el-table
                :data="tableData"
                width="100%"
                height="calc(100% - 113px)"
                max-height="calc(100% - 113px)"
                style="width: 100%;border:1px solid #e5e5e5;border-bottom:none">
                <el-table-column
                  prop="chineseName"
                  label="员工姓名"
                  :show-overflow-tooltip="true"
                  width="120"
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
                  width="100">
                  <template slot-scope="scope">
                    <el-button
                      v-if="checkPick(scope.row)"
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
                  <el-tooltip :content="item.uid" placement="top-start">
                    <el-tag
                      closable
                      effect="plain"
                      @close="handleClose(item)">
                      {{item.chineseName}}
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
        node: null
      },
      selectedPersons: [],
      tableData: [],
      treeData: [{
        orgName: '中国移动集团有限公司',
        orgCode: '00000000000000000000'
      }],
      defaultProps: {
        children: 'children',
        label: 'orgAbbr',
        isLeaf: 'isLeaf'
      }
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
        }
      }
    },
    treeData (val, oldVal) {
      this.$nextTick(() => {
        this.initSearch()
        this.$refs.tree.setCurrentKey(this.treeData[0].orgCode)
      })
    }
  },
  computed: {},
  methods: {
    handleClose (tag) {
      this.selectedPersons.splice(this.selectedPersons.indexOf(tag), 1)
    },
    checkPick (row) {
      return !this.selectedPersons.some(item => {
        return item.uid === row.uid
      })
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
    searchPerson () {
      this.searchForm.pageNum = 1
      this.searchForm.qName = this.searchForm.name
      this.getDptPerson()
    },
    resetSearch () {
      this.searchForm.name = ''
      this.searchPerson()
    },
    clearName () {
      this.initSearch()
      this.$refs.tree.setCurrentKey(this.treeData[0].orgCode)
    },
    initSearch () {
      this.searchForm.pageNum = 1
      this.searchForm.qName = this.searchForm.name
      this.searchForm.node = this.treeData[0]
      this.getDptPerson()
    },
    handleNodeClick (data) {
      this.searchForm.name = ''
      this.searchForm.qName = ''
      this.searchForm.node = data
      this.searchForm.pageNum = 1
      this.tableData = []
      this.getDptPerson()
    },
    personDialogClosed () {},
    confirmSelect () {
      if (this.selectedPersons.length === 0) {
        this.$message.error('请至少选择一个人员')
        return false
      }

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
        inSub: this.searchForm.qName === '' ? 0 : 1
      })
        .then(res => {
          this.searchForm.total = parseInt(res.total)
          this.tableData = res.records || []
        })
    },
    pageChange (page) {
      this.searchForm.pageNum = page
      this.getDptPerson()
    },
    refreshTree (params) {
      this.treeData = params.node
      this.roleType = params.roleType
      this.selectedPersons = JSON.parse(JSON.stringify(params.users || []))
      this.tableData = []
      this.maxNum = params.max || 500
    }
  },
  mounted () {},
  created () {
    // this.getTreeData('00000000000000000000', true)
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
            /deep/ .el-table__row {
              // height: 45px;
            }
          }
          .override-default-pagination{
            height: 32px;
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
