<!--树形下拉选择框组件 -->
<!--
    /**
     * 树形下拉选择组件，下拉框展示树形结构
     * @author linbiling
     * @date 2020-03-05
     * 使用示例：
     * <tree-select :height="200" // 下拉框中树形高度
     *              :width="200" // 下拉框中树形宽度
     *              size="small"  // 输入框的尺寸: medium/small/mini
     *              :data="data" // 树结构的数据
     *              :defaultProps="defaultProps" // 树结构的props
     *              multiple   // 多选
     *              clearable   // 可清空选择
     *              collapseTags   // 多选时将选中值按文字的形式展示
     *              checkStrictly // 多选时，严格遵循父子不互相关联
     *              :nodeKey="nodeKey"   // 绑定nodeKey，默认绑定'id'
     *              :checkedKeys="defaultCheckedKeys"  // 传递默认选中的节点key组成的数组
     *              @popoverHide="popoverHide" // 事件有两个参数：第一个是所有选中的节点ID，第二个是所有选中的节点数据
     *              :filter-clearable="filterClearable" // 节点过滤框是否可以清空
     *              :tree-lazy="lazy" //是否为懒加载
     *              :load-node="load" //懒加载-加载子树数据的方法
     *              :expand-all="expandAll" //是否展开所有节点
     *              :is-long-search="isLongSearch" //节点过滤是否为远程调用接口
     *              :default-checked="defaultChecked" //默认勾选节点
     *              :defaultExpanded="defaultExpanded" //默认展开的节点数组
     *></tree-select>
     */
-->
<template>
  <div class="tree-container">
    <div class="content" v-show="isShowSelect" @click="isShowSelect = !isShowSelect"></div>
    <el-popover
      class="dropdown-content"
      placement="bottom-start"
      :width="width"
      trigger="manual"
      v-model="isShowSelect"
      popper-class="tree-select-pop"
      @hide="popoverHide"
      @show="popoverShow">
      <el-input
        v-if="showFilter"
        class="filter"
        placeholder="请输入"
        :clearable="filterClearable"
        v-model.trim="filterText"
        @blur="doLongSearch">
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="isLongSearch ? doLongSearch : filterNodeFun"></i>
      </el-input>
      <div :style="scrollStyle" class="tree-con">
        <el-scrollbar class="scrollWrap">
          <el-tree
            class="common-tree"
            :style="style"
            ref="tree"
            :data="data"
            :props="defaultProps"
            :show-checkbox="multiple"
            :node-key="nodeKey"
            :check-strictly="checkStrictly"
            :default-expand-all="expandAll"
            :expand-on-click-node="false"
            :check-on-click-node="multiple"
            :highlight-current="true"
            @node-click="handleNodeClick"
            :filter-node-method="filterNodeFun"
            @check-change="handleCheckChange"
            :lazy="treeLazy"
            :load="treeLazy ? loadNode : null"
            :default-checked-keys="defaultChecked"
            :default-expanded-keys="defaultExpanded">
            <span class="custom-tree-node" :class="{disabled:scope.node.disabled}" slot-scope="scope">
              <span>{{ scope.node.label }}</span>
            <!-- <el-tooltip
              v-if="scope.node.label && scope.node.label.length > 10"
              class="item"
              effect="dark"
              :content="scope.node.label"
              :offset="-80"
              placement="top">
              <span>{{ scope.node.label.substring(0, 10) }}...</span>
            </el-tooltip>
            <span v-else>{{ scope.node.label }}</span> -->
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <el-select
        :style="selectStyle"
        slot="reference"
        ref="select"
        :size="size"
        v-model="selectedData"
        :multiple="multiple"
        :clearable="clearable"
        :collapse-tags="collapseTags"
        @click.native="!treeDisabled ? (isShowSelect = !isShowSelect) : false"
        @remove-tag="removeSelectedNodes"
        @clear="removeSelectedNode"
        @change="changeSelectedNodes"
        :disabled="treeDisabled"
        class="tree-select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"></el-option>
      </el-select>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'tree-select',
  props: {
    // 树形结构绑定的数据
    data: {
      type: Array,
      default () {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default () {
        return {}
      }
    },
    // 配置是否可多选
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 配置是否可清空选择
    clearable: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 配置多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 绑定nodeKey，默认绑定'id'
    nodeKey: {
      type: String,
      default () {
        return 'id'
      }
    },
    // 显示复选框情况下，是否严格遵循父子不互相关联
    checkStrictly: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 默认选中的节点key数组
    checkedKeys: {
      type: Array,
      default () {
        return []
      }
    },
    size: {
      type: String,
      default () {
        return 'small'
      }
    },
    width: {
      type: Number,
      default () {
        return 220
      }
    },
    height: {
      type: Number,
      default () {
        return 200
      }
    },
    filterClearable: {
      type: Boolean,
      default () {
        return false
      }
    },
    treeLazy: {
      type: Boolean,
      default () {
        return false
      }
    },
    loadNode: {
      type: Function,
      default () {
        return () => { }
      }
    },
    expandAll: {
      type: Boolean,
      default () {
        return true
      }
    },
    isLongSearch: {
      type: Boolean,
      default () {
        return false
      }
    },
    defaultChecked: {
      type: Array,
      default () {
        return []
      }
    },
    defaultExpanded: {
      type: Array,
      default () {
        return []
      }
    },
    //是否显示搜索框
    showFilter: {
      type: Boolean,
      default () {
        return true
      }
    },
    //绑定的值，用于懒加载且单选的情况下，展示默认值
    bindData: {
      type: String,
      default: ''
    },
    //禁用
    treeDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filterText: '',
      isShowSelect: false, // 是否显示树状选择器
      options: [],
      selectedData: [], // 选中的节点
      style: 'width:' + this.width + 'px;', // + 'height:' + this.height + 'px;',
      selectStyle: 'width:' + (this.width + 20) + 'px;',
      checkedIds: [],
      checkedData: [],
      scrollStyle: 'height:' + this.height + 'px;width:' + this.width + 'px'
    }
  },
  mounted () {
    this.initCheckedData()
  },
  methods: {
    // 树形选择内容过滤
    filterNodeFun (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // 触发远程模糊查询方法
    doLongSearch () {
      this.$emit('filterNode', this.filterText)
    },
    // 单选时点击tree节点，设置select选项
    setSelectOption (node) {
      let tmpMap = {}
      tmpMap.value = node.key
      tmpMap.label = node.label
      this.options = []
      this.options.push(tmpMap)
      this.selectedData = node.key
    },
    // 单选，选中传进来的节点
    checkSelectedNode (checkedKeys) {
      var item = checkedKeys[0]
      this.$refs.tree.setCurrentKey(item)
      var node = this.$refs.tree.getNode(item)
      if (node) {
        this.setSelectOption(node)
      } else if (item) {
        this.selectedData = this.bindData
      }
    },
    // 多选，勾选上传进来的节点
    checkSelectedNodes (checkedKeys) {
      this.$refs.tree.setCheckedKeys(checkedKeys)
    },
    // 单选，清空选中
    clearSelectedNode () {
      this.selectedData = ''
      this.$refs.tree.setCurrentKey(null)
    },
    // 多选，清空所有勾选
    clearSelectedNodes () {
      var checkedKeys = this.$refs.tree.getCheckedKeys() // 所有被选中的节点的 key 所组成的数组数据
      for (let i = 0; i < checkedKeys.length; i++) {
        this.$refs.tree.setChecked(checkedKeys[i], false)
      }
    },
    initCheckedData () {
      if (this.multiple) {
        // 多选
        if (this.checkedKeys.length > 0) {
          this.checkSelectedNodes(this.checkedKeys)
        } else {
          this.clearSelectedNodes()
        }
      } else {
        // 单选
        if (this.checkedKeys.length > 0) {
          this.checkSelectedNode(this.checkedKeys)
        } else {
          this.clearSelectedNode()
        }
      }
    },
    popoverHide () {
      if (this.multiple) {
        // 所有被选中的节点的 key 所组成的数组数据
        this.checkedIds = this.$refs.tree.getCheckedKeys()
        // 所有被选中的节点所组成的数组数据
        this.checkedData = this.$refs.tree.getCheckedNodes()
      } else {
        this.checkedIds = this.$refs.tree.getCurrentKey()
        this.checkedData = this.$refs.tree.getCurrentNode()
      }
      this.filterText = ''
      this.$emit('popoverHide', this.checkedIds, this.checkedData)
    },
    popoverShow () {
      this.$emit('popoverShow')
    },
    // 单选，节点被点击时的回调,返回被点击的节点数据
    handleNodeClick (data, node, nodeDom) {
      if (data.disabled) {
        return
      }
      if (!this.multiple) {
        this.setSelectOption(node)
        this.isShowSelect = !this.isShowSelect
        this.$emit('change', this.selectedData, data)
      }
    },
    // 多选，节点勾选状态发生变化时的回调
    handleCheckChange () {
      // 所有被选中的节点的 key 所组成的数组数据
      var checkedKeys = this.$refs.tree.getCheckedKeys()
      this.options = checkedKeys.map((item) => {
        // 所有被选中的节点对应的node
        var node = this.$refs.tree.getNode(item)
        let tmpMap = {}
        tmpMap.value = node.key
        tmpMap.label = node.label
        return tmpMap
      })
      this.selectedData = this.options.map((item) => {
        return item.value
      })
      this.$emit('change', this.selectedData)
    },
    // 多选,删除任一select选项的回调
    removeSelectedNodes (val) {
      this.$refs.tree.setChecked(val, false)
      var node = this.$refs.tree.getNode(val)
      if (!this.checkStrictly && node.childNodes.length > 0) {
        this.treeToList(node)
          .map(item => {
            if (item.childNodes.length <= 0) {
              this.$refs.tree.setChecked(item, false)
            }
          })
        this.handleCheckChange()
      }
      this.$emit('change', this.selectedData)
    },
    treeToList (tree) {
      var queen = []
      var out = []
      queen = queen.concat(tree)
      while (queen.length) {
        var first = queen.shift()
        if (first.childNodes) {
          queen = queen.concat(first.childNodes)
        }
        out.push(first)
      }
      return out
    },
    // 单选,清空select输入框的回调
    removeSelectedNode () {
      this.clearSelectedNode()
      this.$emit('change', this.selectedData)
    },
    // 选中的select选项改变的回调
    changeSelectedNodes (selectedData) {
      // 多选,清空select输入框时，清除树勾选
      if (this.multiple && selectedData.length <= 0) {
        this.clearSelectedNodes()
      }
      this.$emit('change', this.selectedData)
    }
  },
  watch: {
    // 过滤树形选择内容
    filterText (val) {
      if (!this.isLongSearch) {
        this.$refs.tree.filter(val)
      }
    },
    isShowSelect (val) {
      // 隐藏select自带的下拉框
      this.$refs.select.blur()
    },
    checkedKeys (val) {
      if (!val) return
      this.checkedKeys = val
      this.initCheckedData()
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-container{
  .content{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 11;
  }
  // 多选框文本溢出隐藏
  /deep/ .el-tag.el-tag--info{
    overflow: hidden !important;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 75%;
  }
  /deep/ .el-select__tags > span .el-tag {
    padding: 2px 2px 0 6px !important;
  }
}
.tree-select-pop{
  .filter{
    margin-bottom: 12px;
    /deep/ .el-input__validateIcon{
      display: none !important;
    }
    /deep/ .el-icon-search{
      cursor: pointer;
    }
  }
  .common-tree{
    .custom-tree-node{
      display: inline-block;
      // min-width: 100%;
      height: 32px;
      line-height: 32px;
      &.disabled{
        color: #999999;
        cursor: not-allowed;
      }
    }
  }
  .tree-select{
    z-index: 111;
  }
  .tree-con {
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
 /*.scrollWrap /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
    &.is-vertical{
      width:100px;
    }
    .el-scrollbar__wrap::-webkit-scrollbar{
      width: 6px;
    }
    .el-scrollbar__wrap::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #E5E5E5;
    }
  } */
}
</style>
