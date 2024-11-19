<!--专家从全公司人员选择和 结束并送阅知择组件 -->
<template>
  <div class="processToRead">
    <el-dialog
      v-dialogDrag
      :title="modalTitle"
      :before-close="beforeCloseDialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="shuttle-box" v-if="dialogVisible">
        <div class="title-wrapper">
          <div class="transfer">
            <div class="group-edit-transfer-content">
              <div class="transfer-content-left">
                <div class="left-box">
                  <p class="left-box-title">待选人员</p>
                  <el-input
                    placeholder="搜索内容"
                    class="left-box-input"
                    v-model.trim="leftInputLabel"
                    @keydown.enter.native="remoteSearchUser">
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="remoteSearchUser"></i>
                  </el-input>
                  <div class="left-box-scrollbar" v-if="showTree">
                    <el-scrollbar>
                      <el-tree
                        :data="treeData"
                        show-checkbox
                        ref="tree"
                        node-key="id"
                        check-strictly
                        :props="treeProps"
                        :default-checked-keys="defaultCheckedKeys"
                        @check-change="treeCheckChange"
                        :lazy="true"
                        :load="loadNode">
                      </el-tree>
                    </el-scrollbar>
                  </div>
                  <div class="left-box-scrollbar list-wrapper" v-else>
                    <el-scrollbar>
                      <el-tree
                        v-loading="personnelLoading"
                        :data="userList"
                        show-checkbox
                        ref="tree2"
                        node-key="id"
                        :props="treeProps">
                      </el-tree>
                    </el-scrollbar>
                    <div class="searchConfirmBtn">
                      <el-button type="primary" v-if="treeData.length" @click="confirmSelect">确定</el-button>
                      <el-button type="primary" @click="cancleSelect">取消</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="transfer-content-center">
                <i class="el-icon-arrow-right el-icon--right"></i>
              </div>
              <div class="transfer-content-left">
                <div class="left-box">
                  <p class="left-box-title">已选人员</p>
                  <el-input
                    placeholder="搜索内容"
                    class="left-box-input"
                    v-model.trim="rightInputLabel"
                    @input="rightInput"
                    suffix-icon="el-icon-search"></el-input>
                  <div class="left-box-scrollbar">
                    <el-scrollbar>
                      <div class="right-list">
                        <div
                          class="people-info"
                          v-for="d in selectShowDepartment"
                          :key="d.id">
                          <el-tooltip :content="d.name" placement="top" :disabled="!d.isShowToolTip1">
                            <span>{{d.name}}</span>
                          </el-tooltip>
                          <el-tooltip :content="d.orgName" placement="top" :disabled="!d.isShowToolTip2">
                            <span>{{d.orgName}}</span>
                          </el-tooltip>
                          <i class="el-icon-close" @click="delDepartment(d.id)"></i>
                        </div>
                      </div>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeApproveForm">取消</el-button>
        <el-button type="primary" @click="submitApproveForm">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { isShowToolTip } from '@lib/common/util/common'
import API from '@lib/common/serve/API_toRead'
export default {
  name: 'processToRead',
  props: {
    show: { type: Boolean, default: false },
    modalTitle: { type: String, default: '人员选择' },
    isToRead: { type: Boolean, default: false },
    expertItems: { type: Array }, //列表的专家集合
    processInstId: { type: Number, default: 0 } // 流程实例ID
  },
  data () {
    return {
      dialogVisible: this.show,
      treeProps: { //角色树变量转换
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      treeData: [], // 树形结构数据
      leftInputLabel: '', // 左侧输入框输入内容
      rightInputLabel: '', // 右侧输入框输入内容
      selectShowDepartment: [], // 右侧展示数据
      selectDepartment: [], //右侧所有数据
      showTree: true,
      userList: [], //模糊查询人员列表
      orgCode: '', // 当前组织编码
      personnelLoading: false // 人员搜索loading
    }
  },

  watch: {
    show (newVal, oldVal) {
      this.dialogVisible = newVal
    },
    expertItems (val, oldVal) {
      if (val) {
        this.selectDepartment = val
        this.selectDepartment.forEach(item => {
          this.defaultCheckedKeys.push(item.id)
        })
        this.selectShowDepartment = this.selectDepartment
      }
    },
    selectShowDepartment: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          val.forEach(item => {
            item.isShowToolTip1 = isShowToolTip(item.name, 50)
            item.isShowToolTip2 = isShowToolTip(item.orgName, 140)
          })
        }
      }
    }
  },

  created () {
  },

  computed: {
    defaultCheckedKeys () {
      if (this.selectDepartment.length) {
        let uidList = []
        this.selectDepartment.forEach(item => {
          uidList.push(item.id)
        })
        return uidList
      } else {
        return []
      }
    }
  },

  methods: {
    // 提交表单
    submitApproveForm () {
      if (this.selectDepartment.length === 0) {
        this.$message({
          message: '请选择人员后再试！',
          type: 'warning',
          showClose: true
        })
        return
      }
      if (this.isToRead) { //送阅知人员选择
        this.$emit('subToReadPeople', this.selectShowDepartment)
      } else { //专家会签人员选择
        this.$emit('subSelectPeople', this.selectShowDepartment)
        this.closeApproveForm()
      }
    },
    beforeCloseDialog () {
      this.closeApproveForm()
    },
    // 取消信息填写提交框
    closeApproveForm () {
      this.dialogVisible = false
      this.leftInputLabel = ''
      this.rightInputLabel = ''
      this.selectShowDepartment = []
      this.cancleSelect()
      this.$emit('changeShowRead', this.dialogVisible)
    },
    // 右侧输入框input事件
    rightInput () {
      let val = this.rightInputLabel
      if (val) {
        let arr = []
        this.selectDepartment.forEach(item => {
          if (item.name.indexOf(val) !== -1) {
            arr.push(item)
          }
        })
        this.selectShowDepartment = arr
      } else {
        this.selectShowDepartment = this.selectDepartment
      }
    },
    // 左侧输入框blur 树形结构筛选事件
    remoteSearchUser () {
      if (!this.leftInputLabel) {
        this.showTree = true
        return
      }
      if (this.personnelLoading) { return }
      this.personnelLoading = true
      let params = {
        orgCode: this.orgCode,
        pageSize: 50,
        pageNum: 1,
        inSub: '1',
        userNameLike: this.leftInputLabel
      }
      this.showTree = false
      this.userList = []
      API.getAllUserListByorgCode(params)
        .then(res => {
          res.records = res.records.filter(item => {
            return this.selectDepartment.every(e => { return e.id !== item.uid })
          })
          res.records.forEach(item => {
            item.name = `${item.chineseName} // ${item.orgName}`
            item.children = null
            item.isLeaf = true
          })
          this.userList = res.records || []
          this.personnelLoading = false
        })
        .catch(e => {
          this.personnelLoading = false
          if (e.selfError) return
          // console.log('获取组织列表失败')
          if (e.message) {
            this.$message({
              message: e.message || '获取组织列表失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // tree组件选中事件
    treeCheckChange (node, checked) {
      this.rightInputLabel = ''
      if (checked) {
        this.selectDepartment.push(node)
        this.selectShowDepartment = this.selectDepartment
      } else {
        let index = 0
        this.selectDepartment.forEach((item, i) => {
          if (node.id === item.id) {
            index = i
            this.selectDepartment.splice(index, 1)
          }
        })
        this.selectShowDepartment = this.selectDepartment
      }
    },
    // 右侧移除事件
    delDepartment (key) {
      this.selectDepartment = this.selectDepartment.filter(s => {
        return s.id !== key
      })
      this.rightInputLabel = ''
      this.selectShowDepartment = this.selectDepartment
      this.$refs.tree.setChecked(key, false)
    },
    //加载树节点
    async loadNode (node, resolve) {
      this.currentNode = node
      // console.log(this.currentNode, node)
      if (node.level === 0) {
        let treeData = await this.orgInfoByOrgCode()
        this.treeData = treeData
        // console.log('treeData', treeData)
        return resolve(treeData)
      }
      if (node.level >= 1) {
        let nodeData = await this.treeByParentOrgCode(node.data.id)
        let org = null
        return resolve(nodeData)
      }
    },
    //递归所有子节点
    getOrgObj (obj, orgCode) {
      if (obj.id === orgCode) {
        return obj
      } else if (obj.children && obj.children.length > 0) {
        for (let i = 0; i < obj.children.length; i++) {
          let curOrg = null
          curOrg = this.getOrgObj(obj.children[i], orgCode)
          if (curOrg) return curOrg
        }
        return null
      }
    },
    //接口获取当前登录人所在公司 -- 根节点
    async orgInfoByOrgCode () {
      let newData = []
      try {
        newData = await API.orgInfoByOrgCode(this.processInstId)
        // newData = await API.orgInfoByOrgCode(1380)
        newData.forEach(item => {
          item.disabled = item.type === 0
          this.orgCode = item.id
        })
      } catch (e) {
        if (e.selfError) return
        // console.log('获取登录人公司失败', e)
      }
      return newData
    },
    //通过父级组织编码查询下级组织和人员
    async treeByParentOrgCode (orgCode) {
      let newData = []
      try {
        let res = await API.treeByParentOrgCode(orgCode)
        // console.log('res:', res)
        newData = this.analyzeTreeData(res)
      } catch (e) {
        if (e.selfError) return
        // console.log('获取下级组织和人员失败', e)
      }
      return newData
    },
    //解析数据
    analyzeTreeData (data) {
      let newData = data
      // this.$set(newData, 'isLeaf', data.type === 1)
      // this.$set(newData, 'disabled', data.type === 0)
      newData.forEach(ele => {
        this.$set(ele, 'isLeaf', ele.type === 1)
        this.$set(ele, 'disabled', ele.type === 0)
        if (ele.type === 0 && ele.orgAbbr) {
          ele.name = ele.orgAbbr
        }
      })
      // console.log('analyzeTreeData', newData)
      return newData
    },
    //确定保存模糊查询的勾选数据
    confirmSelect () {
      this.showTree = true
      this.leftInputLabel = ''//清空查询条件返回组织树
      this.rightInputLabel = ''
      let selection = this.$refs.tree2.getCheckedNodes()
      if (selection.length > 0) {
        let checkUserList = []
        selection.forEach(item => {
          let userInfo = {
            id: item.uid,
            orgName: item.orgName,
            hasChildren: false,
            name: item.chineseName,
            email: item.email,
            parentId: item.orgCode,
            type: 1
          }
          checkUserList.push(userInfo)
        })
        this.selectDepartment = this.selectDepartment.concat(checkUserList)
        this.selectShowDepartment = this.selectDepartment
      }
      this.$emit('confirmSearch', true)
    },
    //取消模糊查询
    cancleSelect () {
      this.showTree = true
      this.leftInputLabel = ''//清空查询条件返回组织树
      this.$emit('confirmSearch', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.processToRead {
  /deep/ .el-dialog__wrapper {
    .el-dialog {
      width: 695px;
      .el-dialog__body {
        padding-bottom: 0;
        padding: 30px 18px;
        word-break: break-all;
        .shuttle-box {
          border-radius: 2px;
          .title-wrapper {
            margin-bottom: 20px;
            padding: 0 20px;
          }
        }
      }
    }
  }
  .transfer {
    border-radius: 2px;
    margin: 0 17px;
    box-sizing: border-box;
    .group-edit-transfer-title {
      font-size: 14px;
      color: #333333;
      line-height: 38px;
      padding-left: 10px;
      border-bottom: 1px solid #E5E5E5;
      margin: 0;
    }
    .group-edit-transfer-content {
      display: inline-block;
      .transfer-content-left {
        display: inline-block;
        vertical-align: middle;
        .left-box {
          border: 1px solid #E5E5E5;
          border-radius: 2px;
          width: 260px;
          height: 352px;
          position: relative;
          .left-box-title {
            font-size: 14px;
            color: #333333;
            line-height: 38px;
            padding-left: 10px;
            border-bottom: 1px solid #E5E5E5;
            margin: 0;
          }
          .left-box-input {
            padding: 8px;
            box-sizing: border-box;
            /deep/ .el-input__inner {
              height: 32px;
            }
            /deep/ .el-input__suffix {
              right: 15px;
              top: 8px;
            }
          }
          .left-box-scrollbar {
            padding: 0 8px;
            height: 264px;
            .el-scrollbar{
              height: 100%;
              width: 100%;
              /deep/ .el-scrollbar__wrap{
                overflow-x: hidden;
              }
              /deep/ .el-tree-node__content {
                .el-checkbox:last-of-type {
                  top: 2px;
                  margin-left: -15px;
                  margin-right: 5px;
                }
                .el-checkbox.is-disabled {
                  display: none;
                }
              }
              .people-info {
                display: flex;
                span {
                  display: inline-block;
                  overflow: hidden;
                  white-space: nowrap;
                  -ms-text-overflow: ellipsis;
                  -o-text-overflow: ellipsis;
                  text-overflow: ellipsis;
                  height: 32px;
                  line-height: 32px;
                  font-size: 12px;
                }
                span:first-child {
                  width: 50px;
                  color: #333333;
                  letter-spacing: 0;
                }
                span:nth-child(2) {
                  width: 140px;
                  color: #999999;
                  letter-spacing: 0;
                  margin-left: 20px;
                  margin-right: 10px;
                }
                i {
                  color: #999999;
                  height: 32px;
                  line-height: 32px;
                  cursor: pointer;
                  margin-right: 10px;
                }
              }
              .left-box-check {
                margin: 0 8px;
                /deep/ .el-checkbox {
                  display: block;
                  margin-bottom: 10px;
                  font-size: 14px;
                  color: #333333;
                  height: 19px;
                  .el-checkbox__input{
                    top: -5px;
                  }
                  .el-checkbox__label{
                    max-width:180px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
            /deep/ .el-tree{
              >.el-tree-node{
                display:inline-block;
                min-width: 244px;
              }
              .el-tree-node__content {
                height: 32px;
              }
            }
            &.list-wrapper{
              height: 224px;
            }
            .searchConfirmBtn{
              width: 100%;
              text-align: center;
              position: absolute;
              bottom: 5px;
            }
          }
        }
        .left-page {
          text-align: center;
          margin-top: 6px;
        }
      }
      .transfer-content-center {
        display: inline-block;
        margin: 0 19px;
        vertical-align: middle;
        .transfer-content-button-recycle {
          display: block;
          width: 87px;
          height: 32px;
          margin: 8px 0;
          padding: 0 !important;
          &:hover {
            border: none;
            padding: 0 !important;
          }
        }
        .transfer-content-button-select {
          display: block;
          width: 87px;
          height: 32px;
          margin: 8px 0;
          padding: 0 !important;
        }
      }
    }
  }
}
</style>
