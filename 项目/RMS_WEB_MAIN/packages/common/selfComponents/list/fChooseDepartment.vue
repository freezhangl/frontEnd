<!--
部门选择组件
<component
  :is="fChooseDepartment" // fChooseDepartment部门选择
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.validatorDto.min为最少选中项数
props.validatorDto.max为最多选中项数
props.validatorDto.departmentLevel为部门层级 值0 1时是1级
props.validatorDto.rootNode为根节点是否可选 1可选 0不可选
-->
<template>
  <div id="fChooseDepartment" :class="props.isClass">
    <el-form-item
      :label="props.fieldTitle+':'"
      :class="props.isRequire === '1' && status !== 'result'?'is-required':''"
      :prop="`item${props.fieldKey}`"
      :ref="`item${props.fieldKey}`"
      :rules="[
        { validator: validator, trigger: 'change' }
      ]"
    >
      <span slot="label" v-html="props.fieldTitle+':'" ref="con"></span>
      <div v-if="status !== 'result'" class="showDiv" style="line-height:normal;">
        <el-tooltip
          :ref="`tooltip${props.fieldKey}`"
          class="item"
          effect="dark"
          :disabled="!(nameList && nameList.toString())"
          :content="nameList.toString()"
          placement="top-start">
          <div class="showBox" :class="props.isReadonly === '1'?'noClick':''" >
            <i class="el-icon-arrow-left arrow arrow-left" :style="{color:arrowPath==='left'?'#ccc':'#666'}" @click="arrowLeftRight('left')"></i>
            <i class="el-icon-arrow-right arrow arrow-right" :style="{color:arrowPath==='right'?'#ccc':'#666'}" @click="arrowLeftRight('right')"></i>
            <p v-if="nameList.length <= 0" class="boxPlaceholder">请选择</p>
            <div v-else>
              <div v-if="nameList.length>1" class="select-switch">
                <div class="el-select__tags">
                  <span>
                    <el-tag
                      v-for="(item,index) in nameList"
                      :key="index"
                      size="medium"
                      :closable="props.isReadonly.toString()!=='1' && parseInt(props.validatorDto.max) !== 1"
                      @close="remove(item, index)">
                      <span class="el-tag-text">{{item}}</span>
                    </el-tag>
                  </span>
                </div>
              </div>
              <div v-else class="select-switch">
                <div class="el-select__tags">
                  <span>
                    <el-tag
                      v-for="(item,index) in nameList"
                      :key="index"
                      size="medium"
                      :closable="props.isReadonly.toString()!=='1' && parseInt(props.validatorDto.max) !== 1"
                      @close="remove(item, index)">
                      <span class="el-tag-text">{{item}}</span>
                    </el-tag>
                  </span>
                </div>
                <!-- <p v-for="(item,index) in nameList" :key="index">{{item}}222</p> -->
              </div>
            </div>
            <!-- 获取监听数据变化事件validator之用，隐藏input -->
            <el-input
              v-model="value"
              style="display:none"></el-input>

            <el-popover
              popper-class="department-popover"
              :disabled="props.isReadonly === '1'"
              :visible-arrow="false"
              :offset='popoverOffset'
              :popper-options="{ boundariesElement: '.duos', gpuAcceleration: true }"
              :ref="`popover1${props.fieldKey}`"
              :width="popoverWidth"
              @show="show"
              @hide="hide"
              trigger="click"
              v-model="visible"
            >
              <div class="search-input-wrap">
                <el-input
                  placeholder="输入关键词进行过滤"
                  class="search-input"
                  v-model.trim="filterText"
                  @keydown.enter.native="remoteSearch">
                </el-input>
                <i class="el-icon-search" @click="remoteSearch"></i>
              </div>
              <div class="scroll-wrap" v-show="showTree">
                <el-scrollbar>
                  <el-tree
                    :class="parseInt(props.validatorDto.max) === 1 ? 'custom-single-checkbox' : ''"
                    :default-checked-keys="showData"
                    ref="tree"
                    :props="defaultProps"
                    :data="fData"
                    show-checkbox
                    lazy
                    :check-strictly="true"
                    :check-on-click-node="true"
                    :expand-on-click-node="false"
                    :load="nodeOpen"
                    @check="templateClick"
                    @check-change="changeValue"
                    :filter-node-method="filterNode"
                    node-key="orgCode"
                  >
                    <span class="custom-tree-node" slot-scope="{ node }">
                      <span>
                        <i v-if="node.data.hasChildren && !node.data.leaf" :class="node.expanded?'el-icon-folder-opened':'el-icon-folder'" class="iBg"></i>
                        <el-tooltip
                          :open-delay="500"
                          effect="dark"
                          :content="node.label"
                          placement="left">
                          <span>{{ node.label }}</span>
                        </el-tooltip>
                      </span>
                    </span>
                  </el-tree>
                </el-scrollbar>
              </div>
              <div class="scroll-wrap" v-show="!showTree">
                <el-scrollbar>
                  <el-checkbox-group v-model="userListValue" :class="parseInt(props.validatorDto.max) === 1 ? 'el-tree custom-single-checkbox' : ''">
                    <el-checkbox
                      v-for="item in userList"
                      :label="item.orgCode"
                      :key="item.orgCode"
                      @change="userListChange(item, $event)">{{item.orgName}}</el-checkbox>
                  </el-checkbox-group>
                  <p v-if="userList.length === 0 || !userList.length" style="text-align:center;color:#666666;">暂无数据</p>
                </el-scrollbar>
                <div class="search-confirm-wrap">
                  <el-button type="primary" @click="remoteSearchConfirm" v-if="userList.length">确定</el-button>
                  <el-button type="primary" @click="remoteSearchCancle">取消</el-button>
                </div>
              </div>
              <i class="el-icon-plus" slot="reference"></i>
            </el-popover>
          </div>
        </el-tooltip>
      </div>
      <!-- <span v-else>{{getName(JSON.parse(value)).join('，')}}</span> -->
      <span v-else>{{props.previewName}}</span>
      <el-tooltip v-if="status !== 'result' && props.msg" :content="props.msg" placement="top">
        <i class="el-icon-info fill-in-tips"></i>
      </el-tooltip>
    </el-form-item>
    <div :class="visible?'drak':'drak-none'" @click="popovershow"></div>
  </div>
</template>
<script>
import API from '@lib/common/serve'
export default {
  data () {
    return {
      sendDaTa: [], //提交的数据
      showData: [], //回显
      nameList: [], //显示的名字
      filterText: '',
      value: this.data,
      userInfo: this.$store.getters['USERENTITY/userInfo'],
      defaultProps: {
        children: 'child',
        label: 'orgAbbr',
        isLeaf: 'leaf'
      },
      signCode: '9999',
      fData: [],
      fDataFirst: '', //第一次请求时，把根节点数据储存起来
      visible: false,
      arrowNum: 0, //左右箭头切换
      arrowPath: 'left', //左右箭头切换
      showTree: true, //是否展示树级，默认展示。树级与下拉搜索来回切换
      userList: [], //模糊搜索的下拉选项
      userListValue: [], //模糊搜索勾选的值
      popoverOffset: 0, //popover弹框的偏移量，居中对齐
      popoverWidth: 0 //popover弹框的宽度
    }
  },
  watch: {
    // 获取监听dynamicTags数据变化validator之用
    sendDaTa (val) {
      this.value = val ? JSON.stringify(val) : '[]'
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
  props: {
    props: Object,
    data: String,
    status: String
  },
  mounted () {
    // 编辑时回显
    if (this.value && this.status !== 'result') {
      // 判断单选或者多选
      let getData = []
      if (this.value.substr(0, 1) === '[' && this.value.substr(this.value.length - 1, 1) === ']') {
        getData = JSON.parse(this.value)
      } else {
        getData = this.value.split(',')
      }
      let index = getData.indexOf(this.signCode)
      if (index !== -1) {
        getData = getData.slice(0, index)
      } else {
        // this.nameList = this.getName(getData, this.fData)
        this.nameList = this.props.previewName ? this.props.previewName.split('，') : []
      }
      this.showData = getData
    }
    if (this.status !== 'result') {
      this.getCode()
      this.arrowChangeClass()
      // popover弹框位置居中显示
      this.$nextTick(() => {
        let tooltipEl
        if (this.$refs[`tooltip${this.props.fieldKey}`].$el) {
          tooltipEl = this.$refs[`tooltip${this.props.fieldKey}`].$el
        } else {
          tooltipEl = this.$refs[`tooltip${this.props.fieldKey}`]
        }
        this.popoverOffset = -((tooltipEl.offsetWidth - 22) / 2)
        // popover弹框的宽度与输入框对齐
        if (tooltipEl.offsetWidth - 24 > 220) {
          this.popoverWidth = 244
        } else {
          this.popoverWidth = tooltipEl.offsetWidth - 24
        }
      })
    }
  },
  methods: {
    getCode (id) {
      let sendId = id || this.userInfo.userAuth.orgCode
      API.getCompanyOrgCodeByOrgCode({ orgCode: sendId })
        .then(res => {
          if (res.orgFormCode === '1') {
            // 根节点是否可选
            if (this.props.validatorDto.rootNode && this.props.validatorDto.rootNode === '0') {
              res.disabled = true
            }
            res.hasChildren = true
            this.fData = [res]
            this.fDataFirst = JSON.stringify(res)
            // this.getChooseDepartment(sendId)
          }
        })
        .catch(e => {
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
    // 获取部门数据
    getChooseDepartment (code, resolve, data) {
      let param = {
        parentOrgCode: code,
        recursion: false
      }
      API.getChooseDepartment(param)
        .then(res => {
          if (res.length) {
            if (resolve) {
              res.forEach((item) => {
                if (!item.hasChildren) {
                  item.leaf = true
                }
                // 判断部门层级
                if (this.props.validatorDto.departmentLevel && data.level >= parseInt(this.props.validatorDto.departmentLevel)) {
                  item.leaf = true
                }
                // 判断是否有需要禁用的值
                if (this.props.disabledList && JSON.parse(this.props.disabledList)
                  .includes(item.orgCode)) {
                  item.disabled = true
                }
              })
              resolve(res)
              data.data.child = res
            } else {
              this.fData[0].child = res
            }
          } else if (resolve) {
            resolve([])
          }
          // this.$forceUpdate()
        })
        .catch(e => {
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
    nodeOpen (data, resolve) {
      if (data.data.orgCode) {
        this.getChooseDepartment(data.data.orgCode, resolve, data)
      }
    },
    // 设置tree单选
    setSelectedNode (data) {
      this.$refs.tree.setCheckedNodes([data])
      const node = this.$refs.tree.getCheckedNodes()
      this.editArr = [node[0].orgCode]
    },
    getName (arr, data, name = []) {
      let c = data[0].child
      for (let i = 0; i < c.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] === c[i].orgCode) {
            name.push(c[i].orgName)
          }
        }
      }
      return name
    },
    show () {
      this.$nextTick(() => {
        this.$refs[`popover1${this.props.fieldKey}`].popperElm.style.top = `${Number(this.$refs[`popover1${this.props.fieldKey}`].popperElm.style.top.substring(0, this.$refs[`popover1${this.props.fieldKey}`].popperElm.style.top.length - 2)) + 15}px`
        var dis = Array.from(document.querySelectorAll('.el-tree-node__content .el-checkbox .is-disabled'))
        dis.forEach((item) => {
          item.style.display = 'none'
        })
      })
    },
    // 弹框隐藏时触发，初始化当前数据
    hide () {
      if (this.fDataFirst) {
        this.fData = [JSON.parse(this.fDataFirst)]
        this.remoteSearchReset()
      }
    },
    changeValue (data, checked, node) {

    },
    templateClick (data, node) {
      /**
       * data : 当前选择的节点
       * node : { checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes }
       *    checkedKeys : 选中的节点的 node-key 组成的数据 ['','']
       *    checkedNodes: 选中的节点组成的数组 [{},{}]
      */
      let orgCode = JSON.parse(JSON.stringify(node.checkedKeys))
      this.$refs.tree.setCheckedKeys([])
      this.$refs.tree.setCheckedKeys(orgCode)
      if (parseInt(this.props.validatorDto.max) === 1) { //单选
        this.$refs.tree.setCheckedKeys([data.orgCode])
        this.nameList = [data.orgName]
        this.sendDaTa = { orgCode: data.orgCode, companyName: data.companyName, orgName: data.orgName }
        this.$emit('update:data', JSON.stringify({ orgCode: data.orgCode, companyName: data.companyName, orgName: data.orgName }))
        this.$emit('changeEvent', JSON.stringify({ orgCode: data.orgCode, companyName: data.companyName, orgName: data.orgName }))
      } else { //多选
        this.sendDaTa = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
        this.$emit('update:data', JSON.stringify(this.sendDaTa))
        this.$emit('changeEvent', JSON.stringify(this.sendDaTa))
        this.nameList = this.getNameList(this.fData)
      }
      // 左右箭头切换
      this.arrowPath = ''
      // 多选
      this.arrowChangeClass()
      this.props.previewName = this.nameList.join('，')
    },
    // 递归获取nameList
    getNameList (child) {
      const result = []
      let getResult = (child) => {
        child.forEach(item => {
          if (this.sendDaTa.indexOf(item.orgCode) !== -1) {
            result.push(item.orgName)
          }
          if (item.child) {
            getResult(item.child)
          }
        })
      }
      getResult(child)
      return result
    },
    recursion (array, fData, { notDisabled }) {
      for (let i = 0; i < fData.length; i++) {
        if (!notDisabled) {
          // 达到最大值 禁用
          fData[i].disabled = true
        } else {
          fData[i].disabled = false // 所有不禁用
        }
        if (array.indexOf(fData[i].orgCode) !== -1 && !notDisabled) {
          fData[i].disabled = false
        }
        this.$forceUpdate()
        // 递归
        if (fData[i].child && fData[i].child.length) {
          return this.recursion(array, fData[i].child, { notDisabled })
        }
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    validator (rule, value, callback) {
      var showDiv = this.$refs[`item${this.props.fieldKey}`].$el.querySelectorAll('.showBox')
      if (this.props.isRequire === '1' && (this.nameList.length <= 0)) {
        showDiv[0].style.borderColor = '#FF3F3B'
        callback(new Error('请选择' + this.props.fieldTitle.replace('<br>', '')))
        return
      }
      if (this.nameList.length > 0 && this.props.validatorDto.min && this.props.validatorDto.min > this.nameList.length) {
        showDiv[0].style.borderColor = '#FF3F3B'
        callback(new Error('至少选择' + this.props.validatorDto.min + '个部门'))
        return
      }
      if (this.nameList.length > 0 && this.props.validatorDto.max && this.props.validatorDto.max < this.nameList.length) {
        showDiv[0].style.borderColor = '#FF3F3B'
        callback(new Error('最多选择' + this.props.validatorDto.max + '个部门'))
        return
      }
      showDiv[0].style.borderColor = '#dcdfe6'
      callback()
    },
    popovershow () {
      this.visible = !this.visible
    },
    // 搜索关键词
    remoteSearch () {
      if (!this.filterText) {
        return
      }
      let params = {
        orgName: this.filterText,
        orgStatus: 0,
        companyCode: this.userInfo.userAuth.companyCode
      }
      if (this.props.validatorDto.departmentLevel) {
        params.maxMdmLevel = parseInt(this.props.validatorDto.departmentLevel) + 1
      }
      API.getListByOrgName(params)
        .then(res => {
          this.showTree = false
          for (let i = res.length - 1; i >= 0; i--) {
            // 判断值是否已被勾选（判断单选还是多选），值是否为根节点，值是否已被禁用
            if (parseInt(this.props.validatorDto.max) === 1 && this.data) {
              if (this.data.substr(0, 1) === '{' && this.data.substr(this.value.length - 1, 1) === '}' && JSON.parse(this.data).orgCode === res[i].orgCode) {
                res.splice(i, 1)
              } else if (this.data === res[i].orgCode) {
                res.splice(i, 1)
              }
            } else if (parseInt(this.props.validatorDto.max) !== 1 && this.data && JSON.parse(this.data)
              .indexOf(res[i].orgCode) !== -1) {
              res.splice(i, 1)
            } else if (this.props.validatorDto.rootNode && this.props.validatorDto.rootNode === '0' && this.fData.length && this.fData[0].orgCode === res[i].orgCode) {
              res.splice(i, 1)
            } else if (this.props.disabledList && JSON.parse(this.props.disabledList)
              .includes(res[i].orgCode)) {
              res.splice(i, 1)
            }
          }
          this.userList = res
          if (this.fDataFirst) {
            this.fData = [JSON.parse(this.fDataFirst)]
          }
        })
        .catch(e => {
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
    // 搜索关键词-确认
    remoteSearchConfirm () {
      if (!this.userListValue.length) {
        return
      }
      // 判断单选还是多选
      if (parseInt(this.props.validatorDto.max) === 1) {
        let result = {}
        this.userList.forEach(item => {
          if (this.userListValue.indexOf(item.orgCode) !== -1) {
            result.orgCode = item.orgCode
            result.companyName = item.companyName
            result.orgName = item.orgName
          }
        })
        this.$refs.tree.setCheckedKeys([result.orgCode])
        this.nameList = [result.orgName]
        this.sendDaTa = result
        this.$emit('update:data', JSON.stringify(result))
        this.$emit('changeEvent', JSON.stringify(result))
      } else {
        // 判断是第一次进入还是勾选了tree之后
        if (this.sendDaTa.length > 0) {
          this.sendDaTa.push(...this.userListValue)
        } else {
          this.showData.push(...this.userListValue)
          this.sendDaTa = this.showData
        }
        this.$refs.tree.setCheckedKeys(this.sendDaTa)
        this.$emit('update:data', JSON.stringify(this.sendDaTa))
        this.$emit('changeEvent', JSON.stringify(this.sendDaTa))
        // 获取nameList
        let result = []
        this.userList.forEach(item => {
          if (this.userListValue.indexOf(item.orgCode) !== -1) {
            result.push(item.orgName)
          }
        })
        this.nameList.push(...result)
      }
      // 左右箭头切换
      this.arrowPath = ''
      // 多选
      this.arrowChangeClass()
      this.props.previewName = this.nameList.join('，')
      this.remoteSearchReset()
    },
    // 搜索关键词-取消
    remoteSearchCancle () {
      this.remoteSearchReset()
    },
    // 搜索关键词-重置
    remoteSearchReset () {
      this.showTree = true
      this.userList = []
      this.userListValue = []
      this.filterText = ''
    },
    // 模糊搜索复选框得到的值
    userListChange (item, event) {
      // 单选 - 只勾选一个
      if (parseInt(this.props.validatorDto.max) === 1 && event) {
        this.userListValue = [item.orgCode]
      }
    },
    remove (item, index) {
      // 判断编辑回显
      if (this.sendDaTa.length > 0) {
        this.sendDaTa.splice(index, 1)
        this.nameList.splice(index, 1)
        this.$refs.tree.setCheckedKeys(this.sendDaTa)
        this.$emit('update:data', JSON.stringify(this.sendDaTa))
        this.$emit('changeEvent', JSON.stringify(this.sendDaTa))
      } else {
        this.showData.splice(index, 1)
        this.nameList.splice(index, 1)
        this.sendDaTa = this.showData
        this.$refs.tree.setCheckedKeys(this.showData)
        this.$emit('update:data', JSON.stringify(this.showData))
        this.$emit('changeEvent', JSON.stringify(this.showData))
      }
      // 左右箭头切换
      this.arrowPath = ''
      // 多选
      this.arrowChangeClass()
      this.props.previewName = this.nameList.join('，')
    },
    // 多选时如何渲染样式
    arrowChangeClass () {
      let intervalChangeClass = setInterval(() => {
        if (!this.$refs[`item${this.props.fieldKey}`].$el) {
          clearInterval(intervalChangeClass)
          return
        }
        let innerWidths = Array.from(this.$refs[`item${this.props.fieldKey}`].$el.querySelectorAll('.el-select__tags .el-tag'))
        let outerWidth = this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags') ? this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags').offsetWidth - 30 : 200
        let innerWidth = 0
        innerWidths.forEach(item => {
          innerWidth = innerWidth + item.offsetWidth
        })
        if (innerWidths.length === this.nameList.length) {
          clearInterval(intervalChangeClass)
        }
        if (innerWidth > outerWidth) {
          if (this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags')) {
            this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags').style.borderWidth = '0 46px 0 16px'
          }
          this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.arrow-left').style.display = 'block'
          this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.arrow-right').style.display = 'block'
          // 移除时缩进样式
          if (innerWidth - outerWidth + 32 < this.arrowNum) {
            this.arrowNum = innerWidth - outerWidth + 32
            this.arrowPath = 'right'
            if (this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags>span')) {
              this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags>span').style.transform = 'translateX(' + -this.arrowNum + 'px)'
            }
          }
        } else {
          this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.arrow-left').style.display = 'none'
          this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.arrow-right').style.display = 'none'
          this.arrowNum = 0
          if (this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags')) {
            this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags').style.borderWidth = '0'
            this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags>span').style.transform = 'translateX(' + 0 + 'px)'
          }
        }
        // 第一次从无箭头变成右箭头时，左箭头置灰
        if (this.arrowNum === 0) {
          this.arrowPath = 'left'
        }
      }, 100)
    },
    // 多选时左右滑动
    arrowLeftRight (type) {
      this.arrowPath = ''
      let innerWidths = Array.from(this.$refs[`item${this.props.fieldKey}`].$el.querySelectorAll('.el-select__tags .el-tag'))
      let outerWidth = this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags').offsetWidth - 62
      let innerWidth = 0
      innerWidths.forEach(item => {
        innerWidth = innerWidth + item.offsetWidth
      })
      if (type === 'left') {
        this.arrowNum -= 20
        if (this.arrowNum <= 0) {
          this.arrowNum = 0
          this.arrowPath = 'left'
        }
      } else if (type === 'right') {
        this.arrowNum += 20
        if (innerWidth - this.arrowNum < outerWidth) {
          this.arrowNum = innerWidth - outerWidth
          this.arrowPath = 'right'
        }
      }
      this.$refs[`item${this.props.fieldKey}`].$el.querySelector('.el-select__tags>span').style.transform = 'translateX(' + -this.arrowNum + 'px)'
    }
  }
}
</script>
<style lang="scss">
.department-popover {
  min-width: 10px!important;
}
</style>
<style lang="scss" scoped>
/deep/.el-form-item {
    margin-bottom: 5px;
}
.iBg{
  color: #999;
  margin-right:8px;
}
.showDiv{
  box-sizing: border-box;
  padding-top: 4px;
  // text-align:center;
  vertical-align:middle;
}
.showBox{
    -webkit-appearance: none;
    background-color: #FFFFFF;
    background-image: none;
    border-radius: 2px;
    border: 1px solid #E5E5E5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #666666;
    display: inline-block;
    font-size: inherit;
    height: 30px;
    line-height: 30px;
    outline: none;
    // padding: 0 15px 0 0;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    position: relative;
    cursor:pointer;
    overflow: hidden;
    .boxPlaceholder{
      padding-left: 15px;
      margin:0px;
      color:#9397AA;
      font-size:14px;
      line-height:29px;
    }
    .el-icon-plus{
      position: absolute;
      top: 8px;
      right: 4px;
      z-index: 10;
    }
}
.noClick{
    background-color: #F4F4F4;
    border-color: #E5E5E5;
    color: #999999;
    cursor: not-allowed;
}
// 远程搜索框样式
.search-input-wrap {
  position: relative;
  padding-bottom: 10px;
  /deep/ .el-input__inner {
    padding-right: 30px;
  }
  .el-icon-search {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 30px;
    width: 30px;
    color: #ccc;
    text-align: center;
    cursor: pointer;
  }
}
// 滚动条样式
.scroll-wrap {
  /deep/ .el-scrollbar {
    width: 100%;
    height: 250px;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      .el-tree-node :nth-child(2) {
        padding: 1px;
        overflow: visible;
      }
      .el-checkbox {
        display: block;
        line-height: 30px;
      }
    }
  }
  .search-confirm-wrap {
    padding-top: 10px;
    width: 100%;
    text-align: center;
  }
}
// 多选时带左右箭头样式
.tool-tip {
  position: relative;
}
.select-switch {
  /deep/ .el-select__tags {
    width: 100% !important;
    max-width: none !important;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    border-width: 0;
    border-style: solid;
    border-color: transparent;
    >span {
      display: block;
      width: 6000px;
      transition: all .5s;
      .el-tag {
        @include color();
        background-color: transparent;
        border-color: transparent;
        border-radius: 0;
        padding: 0 2px 0 6px;
        margin-left: 0;
        .el-icon-close {
          color: #ccc;
          right: 0;
        }
        .el-icon-close:hover {
          background-color: transparent;
          color: #333;
        }
      }
      .el-tag:hover {
        background-color: rgba($color: #0b82ff, $alpha: .1);
      }
    }
  }
}
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  width: 10px;
  cursor: pointer;
  display: none;
}
.arrow-left {
  left: 4px;
}
.arrow-right {
  right: 30px;
}
// 溢出文字省略号
.el-tag-text {
  max-width:100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
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
.drak{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background:rgba(0,0,0,0);
  z-index: 1000;
  display: block;
}
.drak-none{
  display: none;
}
</style>
