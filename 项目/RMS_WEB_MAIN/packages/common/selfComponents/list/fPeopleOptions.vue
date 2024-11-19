<!--
人员选择组件
<component
  :is="fPeopleOptions" // fPeopleOptions人员选择
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.validatorDto.min为最少选中项数
props.validatorDto.max为最多选中项数
JSON.parse(this.props.attrs).type === 'allIn' //全集团
JSON.parse(this.props.attrs).type === 'userPower' //当前用户权限控制
JSON.parse(this.props.attrs).type === 'userOrg' //当前用户所在组织
JSON.parse(this.props.attrs).type === 'userCompany' //当前用户所在公司（不能夸OU）
JSON.parse(this.props.attrs).type === 'orgScope' //组织范围，需要传orgScopeCode
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
            <!-- <span slot-scope="{ node, data }">
              @node-expand="nodeOpen"
              {{data.orgName}}
            </span> -->
          </el-tree>
        </div>
      </div>
      <div class="people-list-msg">
        <div class="people-list-wrapper">
          <div class="people-list-top">人员列表</div>
          <div class="people-list-content">
            <div class="content-top">
              <!-- <div style="width:80px;line-height:30px;">员工姓名：</div> -->
              <el-input
                v-model.lazy="searchName"
                placeholder="请输入员工姓名/邮箱/用户账号"
                @keyup.enter.native="searchPeopleEnter"
                clearable>
              </el-input>
              <el-button
                icon="el-icon-search"
                @click="searchPeople"
                :disabled="!(searchName.length > 0)"
                class="search">查询</el-button>
              <!-- <el-button icon="el-icon-refresh" class="refresh" @click="reset">重置</el-button> -->
            </div>
            <div class="people-list">
              <el-table
                :data="peopleData"
                style="width: 100%">
                <el-table-column
                  show-overflow-tooltip
                  prop="chineseName"
                  label="员工姓名"
                  width="101">
                </el-table-column>
                <el-table-column
                  prop="employeeNum"
                  label="员工编号"
                  width="119">
                </el-table-column>
                <el-table-column
                  prop="uid"
                  label="用户账号"
                  width="200">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="orgName"
                  label="所属单位/部门">
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="103">
                  <template slot-scope="scope">
                    <el-button v-if="isSelect(scope.row)" @click="selectPeople(scope.row)" type="text">选中</el-button>
                    <el-button v-else type="text" disabled>已选中</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                @current-change="paginationEvent"
                @prev-click="paginationEvent"
                @next-click="paginationEvent"
                :page-size="pageSize"
                :current-page="pageNum"
                :total="peopleListTotal">
              </el-pagination>
            </div>
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
// import orgList from '@/mock/orgData'
// import peopleData from '@/mock/peopleData'
/**
 * 功能接口需求：
 *    获取组织树 -> 暂无
 *    获取人员列表
 *    人员查询接口
 *    重置接口 -> 待确定
 *    选中接口
 *    确定提交接口
 *    分页接口
 */
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
        if (JSON.parse(this.props.attrs).type === 'orgScope') {
          if (this.orgScopeCode === JSON.parse(newVal).orgScopeCode) { return }
          this.orgScopeCode = JSON.parse(newVal).orgScopeCode
          if ((newVal && oldVal) && this.oldOrgScopeCode && JSON.parse(newVal).orgScopeCode !== this.oldOrgScopeCode) {
            this.dynamicTags = []
            this.confirmTags = []
            this.peopleData = []
            // this.getPeopleOptionsOrgList({})
          }
          this.oldOrgScopeCode = JSON.parse(newVal).orgScopeCode
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
      // if (oldVal.length === 0 && val.length !== 0) {
      //   this.defaultKeys = val[0].orgCode
      //   this.$nextTick(() => {
      //     this.orgListHandleNodeClick({ orgCode: this.defaultKeys })
      //     // this.$refs.tree.setCurrentKey(this.defaultKeys)
      //   })
      // }
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: val[0].orgCode })
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
  computed: {
    codeToName () {
      return function (confirmTags) {
        let confirmTagsIn = JSON.parse(JSON.stringify(confirmTags))
        let arr = []
        confirmTagsIn.forEach(item => {
          arr.push(item.uid)
        })
        if (arr && arr.length > 0) {
          return arr.join(',')
        } else {
          return null
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
        label: 'orgAbbr'
      },
      pageFlag: false,
      userInfo: this.$store.getters['USERENTITY/userInfo'],
      userAuth: this.$store.getters['USERENTITY/userAuth'],
      dynamicTags: [], // 已选人员列表
      confirmTags: [], // 回显人员列表
      searchName: '', // 搜索inp
      dialogVisible: false, // dialog 显示隐藏
      pageNum: 1,
      pageSize: 5,
      defaultKeys: '',
      inSub: null, // 是否包含子节点
      peopleListTotal: 0,
      currentOrgCode: null, // 当前选中组织的组织编码
      resCode: '',
      userOrgCode: '',
      orgScopeCode: undefined,
      oldOrgScopeCode: null
    }
  },
  mounted () {
    let defaultValue = this.data || '[]'
    this.confirmTags = JSON.parse(defaultValue)
    this.dynamicTags = JSON.parse(JSON.stringify(this.confirmTags))
    if (JSON.parse(this.props.attrs).type === 'userPower') {
      this.recursion(this.userAuth.menus[0].child)
    }
  },
  methods: {
    recursion (routerArr) {
      // 递归查找当前路由 resCode
      if (this.resCode) return
      if (routerArr && routerArr.length) {
        routerArr.forEach(item => {
          if (this.$route.path === item.accessPath) {
            this.resCode = item.resCode
          } else if (item.child && item.child.length) {
            return this.recursion(item.child)
          }
        })
      }
    },
    isSelect (row) {
      for (let i = 0; i < this.dynamicTags.length; i++) {
        if (row.userOrganizationId === this.dynamicTags[i].userOrganizationId) {
          return false
        }
      }
      return true
    },
    // nodeOpen (data, node, val) {
    //   const that = this
    //   if (JSON.parse(this.props.attrs).type === 'userPower') {
    //     return this.getUserDataPower({ code: data.orgCode, data })
    //   }
    //   if (data.child[0].orgName === '加载中...') {
    //     this.getPeopleOptionsOrgList({ code: data.orgCode, type: 2, data })
    //   }
    //   // if (JSON.parse(this.props.attrs).type === 'userPower') {
    //   // } else {
    //   //   this.orgList.forEach((item, index) => {
    //   //     if (data.orgCode.toString() === item.orgCode.toString()) {
    //   //       debugger
    //   //       if (!this.orgList[index].child[0].orgForm) {
    //   //         that.getPeopleOptionsOrgList({ code: item.orgCode, type: 2, index, data })
    //   //       }
    //   //     }
    //   //   })
    //   // }
    // },
    //懒加载
    async loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.orgList)
      }
      if (node.level >= 1) {
        var data = node.data
        const that = this
        if (JSON.parse(this.props.attrs).type === 'userPower') {
          return resolve(await this.getUserDataPower({ code: data.orgCode, data }))
        }
        if (!data.child) { return resolve([]) }
        if (data.child[0].orgName === '加载中...') {
          return resolve(await this.getPeopleOptionsOrgList({ code: data.orgCode, type: 2, data }))
        }
      }
    },
    // 获取组织列表(带权限)
    getPeopleOptionsOrgListPower (param, type, index, data) {
      API.getPeopleOptionsOrgListPower(param)
        .then(res => {
          if (type) {
            if (res.length) {
              res.forEach(item => {
                if (item.hasChildren) {
                  item.child = [{ orgName: '加载中...' }]
                }
              })
              data.child = res
              this.$set(data, 0, data.child)
            } else {
              data.child = null
              this.$set(data, 0, null)
            }
          } else {
            this.orgList = res
            this.orgList.forEach((item) => {
              if (item.hasChildren) {
                item.child = [{ orgName: '加载中...' }]
              }
            })
          }
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
    // 获取组织列表(不带权限)
    /**
     * 权限配置 (组织树) ：
     *    1.全集团
     *    2.由当前用户权限控制
     *    3.当前用户所在组织
     *    4.当前用户所在公司（不能跨OU）
     *    5.组织范围
    */
    getPeopleOptionsOrgList ({ code, type, index, data, first }, operation) {
      /*
        code : 组织编码 parentOrgCode
        type : 组织形态 orgForm
        index : 点击的树节点下标
        data : 点击的树节点对象
        operation : 进行的操作 (执行对应的方法)
       */
      this.dialogVisible = true
      if (!type && JSON.parse(this.props.attrs).type !== 'orgScope') {
        if (this.orgList.length) {
          return
        }
      }
      let param = {
        parentOrgCode: code, // 父级组织编码 20个0查根组织
        // orgForm: type || 1, // 组织形态 [1--公司；2--部门]  非必填
        // companyPartCode: '', // 公司段编码 非必填
        recursion: false // 是否递归
      }
      let dataType = JSON.parse(this.props.attrs).type
      if (!type && this.props.attrs) {
        if (dataType === 'allIn') { // 全集团
          param.parentOrgCode = '00000000000000000000'
        } else if (dataType === 'userPower') { // 当前用户权限控制
          if (operation && operation.userPower) {
            param.orgForm = null
          } else {
            return this.getUserDataPower()
          }
        } else if (dataType === 'userOrg') { // 当前用户所在组织
          if (operation && operation.userOrg) {
            param.orgForm = null
          } else {
            return this.getCode(null, 'userOrg')
          }
        } else if (dataType === 'userCompany') { // 当前用户所在公司（不能夸OU）
          if (operation && operation.userCompany) {
            param.orgForm = null
          } else {
            // return this.getCode(null, 'userCompany')
            return this.getCompanyOrgCodeByOrgCode()
          }
        } else if (dataType === 'orgScope') { // 组织范围
          let isOrgList = false // 是多个组织
          if (JSON.parse(this.props.attrs).orgScopeCode) {
            try {
              param.parentOrgCode = JSON.parse(JSON.parse(this.props.attrs).orgScopeCode)
                .toString()
              isOrgList = true
            } catch (error) {
              param.parentOrgCode = JSON.parse(this.props.attrs).orgScopeCode.toString()
            }
            param.orgForm = null
          } else {
            param.parentOrgCode = '00000000000000000000'
          }
          if (param.parentOrgCode.length) {
            return this.getOrgListByOrgCodeList({ dataType, strcode: param.parentOrgCode, type, index, data, first }, operation)
          } else {
            param.parentOrgCode = '00000000000000000000'
          }
        }
        if (param.parentOrgCode === '00000000000000000000') {
        /* 全集团-写死一个根节点 */
          type = 1
          this.orgList = [{
            children: [],
            child: [{ orgName: '加载中...' }],
            enable: null,
            hasChildren: true,
            mdmLevel: null,
            nodes: '00000000000000000000,00550000000000000000,00550007000000000000',
            orgCode: '00000000000000000000',
            orgName: '中国移动集团有限公司',
            orgAbbr: '中国移动集团有限公司',
            parentOrgCode: '',
            sort: '1'
          }]
          return
        }
      }
      // if (this.userOrgCode) {
      //   return this.getPeopleOptionsOrgListPower(param, type, index, data)
      // }
      return new Promise((resolve, reject) => {
        API.getChooseDepartment(param)
          .then(res => {
            res.forEach((item) => {
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
            if (dataType === 'userOrg' && first && !this.orgList.length) {
              this.orgList = data || []
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
    // 组织范围多公司
    getOrgListByOrgCodeList ({ dataType, strcode, type, index, data, first }, operation) {
      let param = {
        orgCodeList: strcode //组织编码集合
      }
      API.getOrgListByOrgCodeList(param)
        .then(res => {
          res.map((item) => item.hasChildren ? item.hasChildren : (item.hasChildren = 'yes'))//默认添加hasChildren字段
          // console.log(res)
          res.forEach((item) => {
            if (item.hasChildren) {
              item.child = [{ orgName: '加载中...' }]
            }
            // console.log(res)
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
          if (dataType === 'userOrg' && first && !this.orgList.length) {
            this.orgList = data || []
          }
          this.dialogVisible = true
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
    // 不夸OU 获取节点
    getCompanyOrgCodeByOrgCode () {
      API.getCompanyOrgCodeByOrgCode({ orgCode: this.userInfo.userAuth.orgCode })
        .then(res => {
          res.child = [{ orgName: '加载中...' }]
          this.orgList = [res]
          // this.getPeopleOptionsOrgList({ code: res.org.orgCode }, { userCompany: true })
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
    getCode (id, type) {
      let sendId = id || this.userInfo.userAuth.orgCode
      API.getOrgCodeByCompanyCode(sendId)
        .then(res => {
          if (type === 'userOrg' || type === 'orgScope') { // 用户所在组织
            // this.getPeopleOptionsOrgList({ code: res.org.orgCode, data: [res.org], first: true }, { userOrg: true })
            res.org.child = [{ orgName: '加载中...' }]
            this.orgList = [res.org]
          } else if (type === 'userCompany') {
            if (res.org.orgFormCode === '1') { // 不夸OU
              this.getPeopleOptionsOrgList({ code: res.org.orgCode }, { userCompany: true })
            } else {
              this.getCode(res.org.parentOrgCode, type)
            }
          }
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
      /* if (this.props.validatorDto.min && (this[type].length <= this.props.validatorDto.min)) {
        this.$message.error(`最少选择${this.props.validatorDto.min}个`)
        return
      } */
      for (let i = 0; i < this[type].length; i++) {
        if (item.id === this[type][i].id) {
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
      this.searchName = ''
      this.peopleData = []
      this.peopleListTotal = 0
      // console.log(this.$refs.tree.store._getAllNodes())
      // console.log(this.orgList)
      // this.$refs.tree.$children[0].expanded = false
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: this.orgList[0].orgCode })
        this.$refs.tree.setCurrentKey(this.orgList[0].orgCode)
      })
    },
    // 组织列表点击回调
    orgListHandleNodeClick (data, data1, data2) {
      // if (!(data.child && data.child.length)) {
      // debugger
      this.searchName = ''
      this.pageNum = 1
      this.currentOrgCode = data.orgCode
      this.inSub = null
      this.getOrgMemberList()
      // }
    },
    // 选中操作
    selectPeople (row) {
      if (this.props.validatorDto.max && (this.dynamicTags.length >= this.props.validatorDto.max)) {
        this.$message.error(`最多选择${this.props.validatorDto.max}个`)
        return
      }
      this.dynamicTags.push(row)
    },
    paginationEvent (currentPage) {
      this.pageFlag = true
      this.pageNum = currentPage
      // this.searchName = ''
      this.getOrgMemberList()
    },
    searchPeopleEnter () {
      if (this.searchName.length > 0) {
        this.searchPeople()
      }
    },
    searchPeople () {
      this.pageFlag = true
      this.pageNum = 1
      this.inSub = '1'
      this.getOrgMemberList()
    },
    // 分页
    // 获取组织对应人员列表
    getOrgMemberList () {
      if (!this.currentOrgCode) return this.$message({ type: 'warning', message: '请选择组织节点' })
      let param = {
        orgCode: this.currentOrgCode, // 组织编码
        // userNameLike: this.searchName, // 用户名称模糊搜索
        excludeUidList: '', // 排除用户UID集合
        inSub: this.inSub, // 是否包含子组织下用户（默认为0，1代表是）
        mdms: '', // MDM组织层级list
        pageNum: this.pageNum, // 页数（默认1）
        pageSize: this.pageSize //每页条数（默认10）
      }
      if (this.pageFlag) {
        param.userNameLike = this.searchName
      }
      API.getOrgMemberList(param)
        .then(res => {
          this.pageFlag = false
          this.peopleData = res.records
          this.peopleListTotal = parseInt(res.total)
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          this.peopleData = []
          this.peopleListTotal = 0
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
    // 获取用户权限
    getUserDataPower (arg) {
      var argument = arg || {}
      let param = {
        resCode: this.resCode, // 菜单资源下的rescode
        userOrgCode: argument.code || this.userOrgCode
      }
      if (!param.resCode && this.$route.query.menuResCode) {
        param.resCode = this.$route.query.menuResCode
      }
      return new Promise((resolve, reject) => {
        API.getUserDataPower(param)
          .then(res => {
            if (res && res.orgs && res.orgs.length) {
            // if (!argument.code) {
            //   this.getPeopleOptionsOrgList({ code: res.orgs[0].orgCode }, { userPower: true })
            // } else {
            // this.userOrgCode = res.orgs[0].orgCode
              res.orgs.forEach((item) => {
                if (item.hasChildren) {
                  item.child = [{ orgName: '加载中...' }]
                }
              })
              if (argument && argument.code && argument.data) {
                argument.data.child = res.orgs
              } else {
                this.orgList = res.orgs
              }
              this.dialogVisible = true
            // }
            }
            resolve(res.orgs)
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
      this.searchName = ''
      this.peopleData = []
      this.peopleListTotal = 0
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: this.orgList[0].orgCode })
        this.$refs.tree.setCurrentKey(this.orgList[0].orgCode)
      })
    },
    cancel () {
      this.dialogVisible = false
      this.dynamicTags = JSON.parse(JSON.stringify(this.confirmTags))
      this.searchName = ''
      this.peopleData = []
      this.peopleListTotal = 0
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: this.orgList[0].orgCode })
        this.$refs.tree.setCurrentKey(this.orgList[0].orgCode)
      })
    },
    treefold () {
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false
        }
        this.orgListHandleNodeClick({ orgCode: this.orgList[0].orgCode })
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
            padding: 10px 30px;
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
              .el-button{
                width: 80px;
                height: 30px;
                border-radius: 2px;
                box-sizing: border-box;
                font-family: PingFangSC-Medium;
                font-size: 12px;
                &.search{
                  @include background-color();
                  color: white;
                  margin-left: 20px;
                }
                &.refresh{
                  @include border();
                  @include color();
                }
              }
            }
          }
          .el-pagination {
            text-align: center;
            padding: 0;
            height: 30px;
            /deep/{
              li{
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #000000;
                margin: 0 5px;
                text-align: center;
                border-radius: 2px;
                min-width: 30px;
                background-color: #fff;
                border: 1px solid #eee;
                &.active{
                  @include background-color();
                  border-radius: 2px;
                  @include border();
                  color: white;
                }
              }
              button
              .el-pager li, span:not([class*=suffix]), button{
                height: 30px;
                line-height: 30px;
                background: #fff;
                border: 1px solid #eee;
              }
              .el-pager li.disabled {
                background-color: #ccc;   // 进行修改背景和字体
              }
            }
          }
          .el-table{
            margin-top: 20px;
            margin-bottom: 15px;
            border: 1px solid #E8E8E8;
            border-bottom: none;
            .el-table_1_column_1{
              text-align: center;
            }
            .el-table_1_column_5{
              text-align: center;
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
