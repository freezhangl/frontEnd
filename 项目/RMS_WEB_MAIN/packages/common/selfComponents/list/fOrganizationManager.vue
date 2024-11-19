<!--
组织主辅负责人组件
<component
  :is="fOrganizationManager" // fOrganizationManager组织主辅负责人
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.validatorDto.min为最少选中项数
props.validatorDto.max为最多选中项数
JSON.parse(this.props.attrs).type === '1,2,3,4' //组织层级
//如 JSON.parse(this.props.attrs).type === '2' //显示二级组织对应的主副负责人。左侧树形显示的组织树为2级，一级组织不显示人员
-->
<template>
  <div class="wrapper" :class="props.isClass" v-if="props.isVisible.toString() !== '1'">
    <el-form-item
      :rules="[
        { validator: validator, trigger: 'change' }
      ]"
      :label="props.fieldTitle+':'"
      :class="props.isRequire === '1' && status !== 'result'?'is-required':''"
      :prop="`item${props.fieldKey}`"
      :ref="`item${props.fieldKey}`">
      <span slot="label" v-html="props.fieldTitle+':'" ref="con"></span>
      <div class="inp showBox" v-if="status !== 'result'">
        <div v-if="props.isReadonly.toString() === '1'" class="disabled"></div>
        <el-tooltip
          v-for="item of confirmTags"
          :key="item.id"
          class="item"
          effect="dark"
          :content="item.uid"
          placement="top">
          <el-tag
            size="small"
            closable
            @close="remove(item,'confirmTags')">{{item.chineseName || item}}</el-tag>
        </el-tooltip>
        <i class="el-input__icon el-icon-plus" @click="getPeopleOptionsOrgList({code:userInfo.userAuth.orgCode})"></i>
        <!-- 获取监听数据变化事件validator之用，隐藏input -->
        <el-input
          v-model="value"
          style="display:none"></el-input>
      </div>
      <span v-else>{{props.previewName}}</span>
      <el-tooltip v-if="status !== 'result' && props.msg" :content="props.msg" placement="top">
        <i class="el-icon-info fill-in-tips"></i>
      </el-tooltip>
    </el-form-item>
    <el-dialog
      v-dialogDrag
      title="选择人员"
      append-to-body
      :visible.sync="dialogVisible"
      :width="'1164px'"
      :top="'5vh'"
      @open="dynamicTags = JSON.parse(JSON.stringify(confirmTags))"
      :before-close="handleClose">
      <div class="org-list-wrapper">
        <div class="org-list-top">组织树</div>
        <div class="org-list">
          <el-tree
            :data="orgList"
            ref="tree"
            :props="defaultProps"
            :style="{'width':orgList.length?'min-content':'auto'}"
            highlight-current
            :check-on-click-node="true"
            :expand-on-click-node="false"
            node-key="orgCode"
            :load="loadNode"
            lazy
            @node-click="orgListHandleNodeClick">
          </el-tree>
        </div>
      </div>
      <div class="people-list-msg">
        <div class="people-list-wrapper">
          <div class="people-list-top">人员列表</div>
          <div class="people-list-content">
            <el-table
              :data="peopleData"
              style="width: 100%"
              height="353px">
              <el-table-column
                show-overflow-tooltip
                prop="chineseName"
                label="员工姓名">
              </el-table-column>
              <el-table-column
                prop="uid"
                label="用户账号">
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
                align="center">
                <template slot-scope="scope">
                  <el-button v-if="isSelect(scope.row)" @click="selectPeople(scope.row)" type="text">选中</el-button>
                  <el-button v-else type="text" disabled>已选中</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="option-people-list">
          <div class="option-list-top">已选人员</div>
          <div class="option-list-content">
            <el-scrollbar>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.uid"
                v-for="item of dynamicTags"
                :key="item.chineseName"
                placement="top-start">
                <el-tag
                  size="small"
                  closable
                  @close="remove(item,'dynamicTags')">{{item.chineseName}}</el-tag>
              </el-tooltip>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="selectFinish">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import API from '@lib/common/serve'
export default {
  props: {
    props: Object,
    data: String,
    status: String
  },
  watch: {
    'props.attrs': {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal && JSON.parse(this.props.attrs).type) {
          this.orgLevels = JSON.parse(this.props.attrs).type.split(',')
          let newLevels = this.orgLevels.map(l => parseInt(l))
            .sort()
          this.maxLevel = newLevels[newLevels.length - 1]
        }
      }
    },
    // 获取监听dynamicTags数据变化validator之用
    dynamicTags: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        this.value = newVal ? JSON.stringify(newVal) : ''
      }
    },
    orgList (val, oldVal) {
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: val[0].orgCode, mdmLevel: this.orgList[0].mdmLevel })
        this.$refs.tree.setCurrentKey(val[0].orgCode)
      })
    },
    'props.fieldTitle': {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.$nextTick(() => {
            let con = this.$refs.con
            if (con.offsetHeight > 16) {
              con.parentElement.style.lineHeight = '20px'
            }
          })
        }
      }
    }
  },
  data () {
    return {
      value: this.data,
      orgList: [], // 组织列表
      peopleData: [], // 人员列表
      defaultProps: { // 树节点props
        children: 'child',
        label: 'orgAbbr',
        isLeaf: 'isLeaf'
      },
      userInfo: this.$store.getters['USERENTITY/userInfo'],
      userAuth: this.$store.getters['USERENTITY/userAuth'],
      dynamicTags: [], // 已选人员列表
      confirmTags: [], // 回显人员列表
      dialogVisible: false, // dialog 显示隐藏
      currentOrgCode: null, // 当前选中组织的组织编码
      orgLevels: ['1', '2', '3', '4'], //组织层级范围
      maxLevel: 4
    }
  },
  mounted () {
    let defaultValue = this.data || '[]'
    this.confirmTags = JSON.parse(defaultValue)
    this.dynamicTags = JSON.parse(JSON.stringify(this.confirmTags))
  },
  methods: {
    isSelect (row) {
      for (let i = 0; i < this.dynamicTags.length; i++) {
        if (row.uid === this.dynamicTags[i].uid) {
          return false
        }
      }
      return true
    },
    //懒加载
    async loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.orgList)
      }
      if (node.level >= 1) {
        var data = node.data
        if (!data.child) { return resolve([]) }
        if (data.child[0].orgName === '加载中...') {
          return resolve(await this.getPeopleOptionsOrgList({ code: data.orgCode, type: 2, data }))
        }
      }
    },
    // 获取组织列表(不带权限)
    getPeopleOptionsOrgList ({ code, type, index, data, first }, operation) {
      /*
        code : 组织编码 parentOrgCode
        type : 组织形态 orgForm
        index : 点击的树节点下标
        data : 点击的树节点对象
        operation : 进行的操作 (执行对应的方法)
       */
      this.dialogVisible = true
      let param = {
        parentOrgCode: code, // 父级组织编码 20个0查根组织
        recursion: false // 是否递归
      }
      if (!type) {
        return this.getCompanyOrgCodeByOrgCode()
      }
      return new Promise((resolve, reject) => {
        API.getChooseDepartment(param)
          .then(res => {
            res.forEach((item) => {
              item.isLeaf = parseInt(item.mdmLevel) >= this.maxLevel
              if (item.hasChildren) {
                item.child = [{ orgName: '加载中...' }]
              }
            })
            if (type) {
              if (res.length) {
                data.child = res
              } else {
                data.child = null
              }
            } else {
              this.orgList = res
            }
            this.dialogVisible = true
            resolve(res)
          })
          .catch(e => {
            this.isEdit = false
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '...失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
      })
    },
    // 不夸OU 获取节点
    getCompanyOrgCodeByOrgCode () {
      API.getCompanyOrgCodeByOrgCode({ orgCode: this.userInfo.userAuth.orgCode })
        .then(res => {
          res.child = [{ orgName: '加载中...' }]
          res.isLeaf = parseInt(res.mdmLevel) >= this.maxLevel
          this.orgList = [res]
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 删除已选人员
    remove (item, type) {
      for (let i = 0; i < this[type].length; i++) {
        if (item.uid === this[type][i].uid) {
          this[type].splice(i, 1)
        }
      }
      if (type === 'confirmTags') {
        this.dynamicTags = this.confirmTags
        this.$emit('update:data', JSON.stringify(this[type]))
        this.$emit('changeEvent', JSON.stringify(this[type]))
        let nameArr = []
        if (this[type].length) {
          this[type].forEach(item => {
            nameArr.push(item.chineseName)
          })
        }
        this.props.previewName = nameArr.toString()
      }
    },
    // 对话框关闭之前回调
    handleClose () {
      this.dialogVisible = false
      this.peopleData = []
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: this.orgList[0].orgCode, mdmLevel: this.orgList[0].mdmLevel })
        this.$refs.tree.setCurrentKey(this.orgList[0].orgCode)
      })
    },
    // 组织列表点击回调
    orgListHandleNodeClick (data, data1, data2) {
      this.currentOrgCode = data.orgCode

      //清空人员列表数据
      this.peopleData = []

      //组织层级在范围内才获取用户
      if (this.orgLevels.indexOf(data.mdmLevel) > -1) {
        this.getOrgMemberList()
      }
    },
    // 选中操作
    selectPeople (row) {
      if (this.props.validatorDto.max && (this.dynamicTags.length >= this.props.validatorDto.max)) {
        this.$message.error(`最多选择${this.props.validatorDto.max}个`)
        return
      }
      this.dynamicTags.push(row)
    },
    // 获取组织对应人员列表
    getOrgMemberList () {
      if (!this.currentOrgCode) return this.$message({ type: 'warning', message: '请选择组织节点' })
      API.getOrgCodeByCompanyCode(this.currentOrgCode)
        .then(res => {
          this.peopleData = res.supervisors || []
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          this.peopleData = []
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 确定
    selectFinish () {
      if (this.props.validatorDto.min && (this.dynamicTags.length < this.props.validatorDto.min)) {
        this.$message.error(`最少选择${this.props.validatorDto.min}个`)
        return
      }
      this.dialogVisible = false
      this.confirmTags = JSON.parse(JSON.stringify(this.dynamicTags))
      // if (this.dynamicTags.length) {
      this.$emit('update:data', JSON.stringify(this.confirmTags))
      this.$emit('changeEvent', JSON.stringify(this.confirmTags))
      let nameArr = []
      if (this.confirmTags.length) {
        this.confirmTags.forEach(item => {
          nameArr.push(item.chineseName)
        })
      }
      this.props.previewName = nameArr.toString()
      this.peopleData = []
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: this.orgList[0].orgCode, mdmLevel: this.orgList[0].mdmLevel })
        this.$refs.tree.setCurrentKey(this.orgList[0].orgCode)
      })
    },
    cancel () {
      this.dialogVisible = false
      this.dynamicTags = JSON.parse(JSON.stringify(this.confirmTags))
      this.peopleData = []
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: this.orgList[0].orgCode, mdmLevel: this.orgList[0].mdmLevel })
        this.$refs.tree.setCurrentKey(this.orgList[0].orgCode)
      })
    },
    // 验证规则
    validator (rule, value, callback) {
      var showDiv = this.$refs[`item${this.props.fieldKey}`].$el.querySelectorAll('.showBox')
      if (this.props.isRequire.toString() === '1') {
        if (this.dynamicTags.length <= 0) {
          showDiv[0].style.borderColor = '#FF3F3B'
          callback(new Error(`请选择${this.props.fieldTitle.replace('<br>', '')}`))
        } else {
          showDiv[0].style.borderColor = '#dcdfe6'
          callback()
        }
      } else {
        callback()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-form-item {
    margin-bottom: 5px;
}
.wrapper{
  div.el-form-item{
    display:block;
  }
  .inp{
    position: relative;
    border: 1px solid #E5E5E5;
    border-radius: 2px;
    height: 30px;
    padding: 2px 0;
    padding-right: 25px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    overflow: auto;
    height: auto;
    min-height: 30px;
    box-sizing:border-box;
    overflow:hidden;
    &.rule-error{
      border-color:#FF3F3B;
    }
    & > .disabled{
      position: absolute;
      left:0;top:0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.1);
      cursor: not-allowed;
      z-index: 10;
      border: 1px solid #E5E5E5;
    }
    .el-tag{
      background-color: transparent;
      border: 1px solid #E5E5E5;
      margin-left: 5px;
      color: #333;
      /deep/ .el-tag__close{
        color: #333;
      }
      /deep/ .el-tag__close:hover{
        background-color: #999;
      }
    }
    .el-icon-plus{
      position: absolute;
      right: 0;
      top: 0;
      &:hover{
        cursor: pointer;
      }
    }
  }
}

.el-dialog__wrapper {
  .el-tree{
    width: min-content;
    min-width: 100%;
    /deep/{
      .el-tree-node > .el-tree-node__children{
        overflow: visible;
      }
    }
  }
  /deep/ {
    .el-dialog{
      max-height: 730px;
      display: flex;
      flex-direction: column;
    }
    .el-dialog__body{
      display: flex;
      height: 580px;
      padding: 20px 30px;
      margin-bottom: 0;
      flex-grow: 1;
      overflow: hidden;
    }
    .el-table .cell{
      white-space:nowrap;
    }
    td,th{
      padding:10px 0;
    }
    *[class*=-list-top]{
      border-bottom: 1px solid #e5e5e5;
      padding-left: 10px;
      line-height: 39px;
      color: #333333;
      height: 39px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      letter-spacing: 0;
      box-sizing: border-box;
      width: 100%;
    }
    .org-list-wrapper{
        width: 235px;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        box-sizing: border-box;
        display:flex;
        flex-direction: column;
        .org-list{
          padding: 8px 5px;
          overflow: auto;
          max-height: 520px;
          min-height: calc(100% - 54px);
        }
      }
      .people-list-msg{
        width: calc(100% - 235px);
        box-sizing: border-box;
        padding-left: 30px;
        .people-list-wrapper,.option-people-list{
          border: 1px solid #E5E5E5;
          display: flex;
          flex-direction: column;
          *[class*=-content]{
            flex-grow: 1;
            // padding: 10px 30px;
            padding: 30px;
          }
        }
        .people-list-wrapper{
          margin-bottom:20px;
          height: 451px;
          .people-list-content {
            .content-top {
              display: flex;
              .el-input {
                width: auto;
                flex: 1;
              }
            }
          }
          .el-table{
            // margin-top: 20px;
            // margin-bottom: 15px;
            border: 1px solid #E8E8E8;
            border-bottom: none;
            tr th:nth-child(1),tr td:nth-child(1){
              padding-left: 30px;
            }
            /deep/ th,td{
              max-height: 47px;
              padding: 9px 0;
              font-size: 14px;
              color: #333333;
            }
          }
        }
        .option-people-list{
          border: 1px solid #E5E5E5;
          height: 105px;
          .option-list-content {
            height: 46px;
            padding: 10px;
            .el-scrollbar{
              height: 100%;
              /deep/.el-scrollbar__wrap{
                overflow-x: hidden;
                overflow-y: auto;
              }
            }
          }
          .el-tag{
            border: none;
            background: none;
            &:hover{
              @include background-color($color-blue,$opacity: 0);
              border-radius: 2px;
            }
          }
        }
      }
  }
}
.el-button.is-disabled.el-button--text{
    background-color: transparent !important;
    border: none !important;
}
.el-button.el-button--text{
    border: none !important;
}
.el-tag{
  margin-left: 10px;
  &:nth-child(1){
    margin:0;
  }
}
/deep/ .el-form-item__label {
  word-break: break-all;
}
// 填报说明提示
.fill-in-tips {
  position: absolute;
  top: 14px;
  right: -18px;
  @include color();
}
</style>
