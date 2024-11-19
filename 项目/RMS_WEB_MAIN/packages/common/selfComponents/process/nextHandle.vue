<!--流程发起组件 B002-->
<template>
  <div class="nextHandle">
    <el-dialog
      v-dialogDrag
      class="approvalDialog"
      title="审批流程"
      :before-close="beforeCloseDialog"
      :visible.sync="dialogVisible"
      :show="show"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        :model="approvalForm"
        :rules="approvalFormRule"
        ref="approvalForm"
        label-width="92px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="下一环节：" prop="nextLink">
              <el-radio-group v-model="approvalForm.nextLink">
                <el-radio
                  @change="changeNextLink(item)"
                  v-for="item in nextActivities"
                  :label="item.activityDefId"
                  :key="item.activityDefId">
                  {{item.activityDefName}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isPeople">
          <el-col :span="24">
            <el-form-item label="人员选择：" class="peopleChoosen" prop="peopleChoosen">
              <el-select
                :popper-append-to-body="false"
                v-model="approvalForm.peopleChoosen"
                placeholder="请选择审批环节人">
                <el-option
                  :popper-append-to-body="false"
                  v-for="item in participantList"
                  :label="item.participantNameEmail"
                  :value="item.participantId"
                  :key="item.participantId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isPeopleOrg">
          <el-col :span="24">
            <el-form-item label="" prop="peopleOrg">
              <div class="org-tree missCheckbox" style="overflow:hidden;overflow-x:auto;overflow-y:auto;">
                <div class="title-wrapper" >
                  <span class="title">待选人员</span>
                </div>
                <div class="loadingWrap" v-if="treeShow">
                  <el-input
                    placeholder="搜索内容"
                    class="filter-input"
                    v-model.trim="filterTextOrg"
                    v-if="listType!=4 && listType!=5"
                    suffix-icon="el-icon-search"
                    @blur="peopleSearch"></el-input>
                  <div
                    class="scrollWrap"
                    :style="{
                      height: listType==4 || listType==5 ? '270px' : '227px'
                    }">
                    <el-scrollbar>
                      <el-tree
                        :data="treeDataOrg"
                        show-checkbox
                        ref="treeOrg"
                        node-key="id"
                        check-strictly
                        :lazy="peopleLazy"
                        :load="peopleLoad"
                        :default-checked-keys="peopleLazy ? defaultCheckedPeopleKeys : relevantDepartmentPeopleKeys"
                        :default-expanded-keys="relevantDepartmentPeopleKeys"
                        :props="peopleLazy ? treeLazyProps : defaultPropsOrg"
                        :filter-node-method="filterNodeOrg"
                        @check="nodeClick">
                      </el-tree>
                    </el-scrollbar>
                  </div>
                </div>
                <div class="search-people" v-loading="searchPeopleLoading" v-else>
                  <el-scrollbar v-if="userList.length">
                    <el-checkbox-group style="padding: 0 10px;line-height: 30px; width: 234px; height: 235px" v-model="peopleCheckList">
                      <el-checkbox
                        v-for="user in userList"
                        :key="user.id"
                        :label="user">{{`${user.chineseName} // ${user.orgName}`}}</el-checkbox>
                    </el-checkbox-group>
                  </el-scrollbar>
                  <div class="not-data" v-else>暂无数据</div>
                  <div class="searchConfirmBtn">
                    <el-button type="primary" v-if="userList.length" @click="confirmSelect">确定</el-button>
                    <el-button type="primary" @click="cancleSelect">取消</el-button>
                  </div>
                </div>
              </div>
              <div
                class="recycle"
                @click="getCheckedNodesOrg">
                <i class="el-icon-arrow-right"></i>
              </div>
              <div class="org-tree" style="overflow:hidden;overflow-x:auto;overflow-y:auto;">
                <div class="title-wrapper" >
                  <span class="title">已选人员</span>
                </div>
                <div class="loadingWrap">
                  <el-input
                    placeholder="搜索内容"
                    class="filter-input"
                    v-model.trim="searchTextOrg"
                    @input="rightInputOrg"
                    suffix-icon="el-icon-search"></el-input>
                  <div class="scrollWrap">
                    <el-scrollbar>
                      <div class="right-list">
                        <div
                          class="people-org-info"
                          v-for="item in selectShowPeople"
                          :key="item.id">
                          <el-tooltip
                            effect="dark"
                            :disabled="!showToolTip(item.name, 50)"
                            :content="item.name"
                            placement="top-start">
                            <span>{{item.name}}</span>
                          </el-tooltip>
                          <el-tooltip
                            effect="dark"
                            :disabled="!showToolTip(item.orgName, 140)"
                            :content="item.orgName"
                            placement="top-start">
                            <span>{{item.orgName}}</span>
                          </el-tooltip>
                          <i class="el-icon-close" @click="delPeople(item.id)"></i>
                        </div>
                      </div>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeApproveForm">取消</el-button>
        <el-button type="primary" @click="submitApproveForm">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="confirmDialog"
      title="审批流程"
      :visible.sync="confirmDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="confirm" style="margin-bottom: 20px;">
        <span>下一环节：</span>
        <div>{{nextLinkShow}}</div>
      </div>
      <div class="confirm" style="margin-bottom: 20px;" v-if="isPeople || isPeopleOrg">
        <span>人员选择：</span>
        <div v-if="isPeople">{{peopleChoosenShow}}</div>
        <div v-if="isPeopleOrg">{{peopleOrgChoosenShow}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeConfirmDialog">取消</el-button>
        <el-button type="primary" @click="submitConfirmDialog">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import API from '@lib/common/serve/API_processSubmit'
import API2 from '@lib/common/serve/API_toRead'
import { isShowToolTip } from '@lib/common/util/common'
export default {
  name: 'nextHandle',
  props: {
    show: { type: Boolean, default: false },
    businessSerialNumber: { type: String, default: '' },
    processTemplateCode: { type: String, default: '' }
  },
  data () {
    return {
      filterTextOrg: '',
      searchText: '',
      searchTextOrg: '',
      treeData: [],
      treeDataOrg: [],
      defaultProps: {
        children: 'children',
        label: 'organizationName'
      },
      defaultPropsOrg: {
        children: 'children',
        label: 'name'
      },
      treeLazyProps: { //角色树变量转换
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      dialogVisible: this.show,
      confirmDialogVisible: false,
      approvalForm: {
        nextLink: '', //下一环节
        peopleChoosen: '' //人员选择
      },
      approvalFormRule: {
        nextLink: [
          { required: true, message: ' ', trigger: 'change' }
        ],
        peopleChoosen: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ]
      },
      nextActivities: [],
      participantList: [],
      isPeople: true,
      nextLinkShow: '',
      peopleChoosenShow: '',
      isPeopleOrg: false,
      isMultiple: false,
      approvalStateShow: '同意',
      peopleChoosenShowArr: [],
      orgChoosenShow: '',
      peopleOrgChoosenShow: '',
      selectShowDepartment: [], // 右侧展示数据
      selectDepartment: [], //右侧所有数据
      selectShowPeople: [], // 右侧展示人员数据
      selectPeople: [], //右侧所有人员数据
      relevantDepartmentKeys: [], // 默认选中的部门（研发归口管理部门）
      tempApprovalOponions: {}, //保存临时意见后暂存，防止在切换审批结果状态的时候被清空
      peopleLazy: false, // 人员选择懒加载控制
      peopleCheckList: [], // 人员选择模糊搜索选中的人员列表
      orgCode: '', // 当前登录人的一级公司编码
      treeShow: true, // 人员+组织树显示
      userList: [], // 人员列表
      listType: '',
      searchPeopleLoading: false, // 人员模糊搜索加载状态
      relevantDepartmentPeopleKeys: [], // 默认选中的接口人
      finishFlag: null,
      isFinishAndNotification: false, //当前下一环节是否为结束并送阅知节点
      isShowPeople: true, //是否可以显示人员
      lastOrgCode: ''
    }
  },
  watch: {
    show (newVal, oldVal) {
      this.dialogVisible = newVal
      if (newVal === true) {
        this.getNextActivitiesByNum(this.businessSerialNumber)
      }
      this.$nextTick(() => {
        this.$refs['approvalForm'].clearValidate()
      })
    },
    filterTextOrg (val) {
      if (!this.peopleLazy) {
        this.$refs.treeOrg.filter(val)
      }
    },
    selectShowPeople (newVal, oldVal) {
      this.peopleOrgChoosenShow = ''
      newVal.forEach(element => {
        this.peopleOrgChoosenShow = this.peopleOrgChoosenShow + '、' + element.name
      })
      this.peopleOrgChoosenShow = this.peopleOrgChoosenShow.substr(1)
    },
    'approvalForm.nextLink' (newVal, oldVal) {
      this.nextActivities.forEach(item => {
        if (item.activityDefId === newVal) {
          this.nextLinkShow = item.activityDefName
        }
      })
    },
    'approvalForm.peopleChoosen' (newVal, oldVal) {
      // 如果是多选-->数组
      if (Array.isArray(newVal)) {
        this.peopleChoosenShowArr = []
        this.participantList.forEach(item => {
          newVal.forEach(val => {
            if (item.participantId === val) {
              this.peopleChoosenShowArr.push(item.participantName)
            }
          })
        })
        this.peopleChoosenShowArr.forEach(element => {
          this.peopleChoosenShow = this.peopleChoosenShow + '、' + element
        })
        this.peopleChoosenShow = this.peopleChoosenShow.substr(1)
        console.log(this.peopleChoosenShow)
      } else {
        // 如果是单选-->字符串
        this.participantList.forEach(item => {
          if (item.participantId === newVal) {
            this.peopleChoosenShow = item.participantName
          }
        })
      }
    }
  },
  mounted () {

  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    // 右侧输入框input事件
    rightInput (val) {
      if (val !== '' && val !== ' ') {
        let arr = []
        this.selectDepartment.forEach(item => {
          if (item.organizationName.indexOf(val) !== -1) {
            arr.push(item)
          }
        })
        this.selectShowDepartment = arr
      } else {
        this.selectShowDepartment = this.selectDepartment
      }
    },
    // 右侧人员输入框input事件
    rightInputOrg (val) {
      if (val !== '' && val !== ' ') {
        let arr = []
        this.selectPeople.forEach(item => {
          if (item.name.indexOf(val) !== -1) {
            arr.push(item)
          }
        })
        this.selectShowPeople = arr
      } else {
        this.selectShowPeople = this.selectPeople
      }
    },
    // 将勾选的左侧数据放到右边
    getCheckedNodes () {
      // 获取勾选节点的数据
      let selection = this.$refs.tree.getCheckedNodes(true, false)
      this.selectDepartment = selection
      this.selectShowDepartment = this.selectDepartment
      this.selectShowDepartment.forEach(item => {
        item.disabled = true
      })
    },
    // 将勾选的左侧人员数据放到右边
    getCheckedNodesOrg () {
      // 获取勾选节点的数据
      if (!this.peopleLazy) {
        let selection = this.$refs.treeOrg.getCheckedNodes(true, false)
        this.selectPeople = selection
        this.selectShowPeople = this.selectPeople
        this.selectShowPeople.forEach(item => {
          item.disabled = true
        })
      }
    },
    // 删除右侧数据
    delDepartment (key) {
      if (this.relevantDepartmentKeys.some(k => k === key)) {
        this.$message({
          message: '研发归口管理部门不可删除！',
          type: 'warning',
          showClose: true
        })
        return
      }
      let selectDepartmentArr = []
      selectDepartmentArr = this.selectDepartment.filter(val => {
        return val.organizationCode !== key
      })
      this.selectShowDepartment = selectDepartmentArr
      this.selectDepartment.forEach(item => {
        if (item.organizationCode === key) {
          item.disabled = false
        }
      })
      this.$refs.tree.setChecked(key, false)
      let selection = this.$refs.tree.getCheckedNodes(true, false)
      this.selectDepartment = selection
    },
    // 删除右侧人员数据
    delPeople (key) {
      if (!this.peopleLazy) {
        let selectShowArr = []
        selectShowArr = this.selectPeople.filter(val => {
          return val.id !== key
        })
        this.selectShowPeople = selectShowArr
        this.selectPeople.forEach(item => {
          if (item.id === key) {
            item.disabled = false
          }
        })
        // console.log(this.selectPeople)
        this.$refs.treeOrg.setChecked(key, false)
        let selection = this.$refs.treeOrg.getCheckedNodes(true, false)
        this.selectPeople = selection
      } else {
        this.selectPeople = this.selectPeople.filter(s => {
          return s.id !== key
        })
        this.searchTextOrg = ''
        this.selectShowPeople = this.selectPeople
        this.$refs.treeOrg.setChecked(key, false)
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    filterNodeOrg (value, data) {
      if (!value) return true
      //相关部门会签人员搜索公司下面人员不展示
      // console.log(data)
      if (!data.orgName && !data.orgCode) {
        return false
      }
      return data[this.defaultPropsOrg.label].indexOf(value) !== -1
    },
    // 提交获取下一环节列表
    getNextActivitiesByNum (val) {
      //传入业务流水号
      API.getNextActivitiesByNum(val)
        .then(res => {
          this.nextActivities = res
          // 默认选中第一个
          this.approvalForm.nextLink = ''
          // this.approvalForm.nextLink = res[0].activityDefId
          // if (res[0].finishFlag === 0) {
          //   this.isPeople = false
          // } else {
          //   this.getNextPeople(res[0].activityDefId)
          // }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取下一环节失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 选择下一环节，获取对应的人员列表
    changeNextLink (val) {
      this.approvalForm.peopleChoosen = ''
      this.selectShowDepartment = []
      this.selectShowPeople = []
      this.searchText = ''
      this.searchTextOrg = ''
      this.filterText = ''
      this.filterTextOrg = ''
      this.selectDepartment = []
      this.selectPeople = []
      this.peopleLazy = false
      this.peopleCheckList = []
      this.$nextTick(() => {
        this.$refs['approvalForm'].clearValidate('peopleChoosen')
      })
      this.$nextTick(() => {
        this.$refs['approvalForm'].clearValidate('peopleChoosen')
      })
      // 如果是结束
      if (val.finishFlag === 0) {
        this.isPeople = false
        this.isPeopleOrg = false
      } else {
        this.getNextPeople(val.activityDefId)
      }
    },
    // 获取下一环节人员
    getNextPeople (activityDefId) {
      let params = {
        processTemplateCode: this.processTemplateCode, // 流程模板编码
        activityDefId: activityDefId, // 活动节点ID（活动定义ID）
        businessSerialNumber: this.businessSerialNumber //业务流水号
      }
      this.participantList = []
      API.getNextPeople(params)
        .then(res => {
          // 人员返回类型:listType
          // 0：人员列表，
          // 1：组织+人员
          // 2：组织树，
          // 3：组织+人员（懒加载）
          // 4:规则10(默认带出主负责人 懒加载)
          // 5:规则15 (懒加载)
          if (res.listType === '0') {
            this.isPeople = true
            this.isOrg = false
            this.isPeopleOrg = false
            this.participantList = res.personListWithOrgs || []
            this.participantList.forEach(item => {
              if (item.participantEmail) {
                item.participantNameEmail =
                  item.participantName + '(' + item.participantEmail + ')'
              } else {
                item.participantNameEmail = item.participantName
              }
            })
          } else if (res.listType === '1') {
            this.isPeople = false
            this.isOrg = false
            this.isPeopleOrg = true
            this.peopleLazy = false
            this.treeShow = true
            this.defaultCheckedPeopleKeys = []
            this.relevantDepartmentPeopleKeys = []
            if (res.personListWithOrgs && res.personListWithOrgs.id !== null) {
              if (res.personListWithOrgs.data) {
                if (res.personListWithOrgs.children) {
                  let children = res.personListWithOrgs.children.concat()
                  children.forEach((child, index) => {
                    if (!child.data.participantName || !child.data.participantId) {
                      res.personListWithOrgs.children.splice(index, 1)
                    }
                  })
                  let treeDataDepartment = this.analyzeTreeDataDepartment(res.personListWithOrgs)
                  this.treeDataOrg = [treeDataDepartment]
                  res.personListWithOrgs.children.forEach(p => {
                    if (p.data.isAttributeDepartment === '0') {
                      this.relevantDepartmentPeopleKeys.push(p.data.participantId + p.data.organizationName)
                    }
                  })
                  this.$nextTick(() => {
                    this.getCheckedNodesOrg()
                  })
                } else {
                  this.treeDataOrg = []
                }
              } else {
                let treeDataOrg = this.analyzeTreeDataOrg(res.personListWithOrgs)
                this.treeDataOrg = [treeDataOrg]
              }
            } else {
              this.treeDataOrg = []
            }
          } else {
            if (res.personListWithOrgs) {
              this.isPeople = false
              this.isOrg = false
              this.isPeopleOrg = true
              this.peopleLazy = true
              this.treeShow = true
              this.defaultCheckedPeopleKeys = []
              this.relevantDepartmentPeopleKeys = []
              if (res.listType === '4') {
                this.orgName = res.personListWithOrgs[0].orgName
                this.orgCode = res.personListWithOrgs[0].id
                let personListWithOrgs = res.personListWithOrgs[0]
                let departmentList = personListWithOrgs.departmentList
                let receiverList = departmentList.length ? departmentList[0].receiverList : []
                this.relevantDepartmentPeopleList = receiverList
              } else if (res.listType === '5') {
                this.orgName = res.personListWithOrgs[0].orgName
                this.orgCode = res.personListWithOrgs[0].id
                this.lastOrgCode = res.personListWithOrgs[0].lastOrgCode // 当参与规则为15的时候保存lastOrgCode
              } else {
                this.orgName = res.personListWithOrgs[0].organizationName
                this.orgCode = res.personListWithOrgs[0].organizationCode
              }
            }
          }
        })
        .catch(e => {
          this.participantList = []
          this.isPeople = true
          this.listType = ''
          this.isOrg = false
          this.isPeopleOrg = false
        })
    },
    // 提交表单
    submitApproveForm () {
      let flag = true
      if (this.approvalForm.nextLink === '') {
        this.$message({
          message: '请选择下一环节！',
          type: 'warning',
          showClose: true
        })
        return false
      }
      if (this.isPeopleOrg === true) {
        flag = this.validTreeOrg()
      }
      this.$refs['approvalForm'].validate(valid => {
        if (valid && flag) {
          this.confirmDialogVisible = true
        }
      })
    },
    beforeCloseDialog () {
      this.closeApproveForm()
    },
    // 取消信息填写提交框
    closeApproveForm () {
      this.$refs['approvalForm'].resetFields()
      this.dialogVisible = false
      this.participantList = []
      this.isPeople = true
      this.isPeopleOrg = false
      this.$emit('changeNextHandle', this.dialogVisible)
    },
    // 取消确认框
    closeConfirmDialog () {
      this.confirmDialogVisible = false
    },
    // 提交确认框
    submitConfirmDialog () {
      let obj = {
        nextLinkShow: this.approvalForm.nextLink
      }
      if (this.isPeople === true) {
        Object.assign(obj, { participants: [{ 'name': this.peopleChoosenShow, 'id': this.approvalForm.peopleChoosen }] })
      }
      if (this.isPeopleOrg === true) {
        let arr = []
        this.selectShowPeople.forEach(ele => {
          let isHasItem = arr.some(item => { //去重
            return item.id === ele.participantId ||
              item.id === ele.id
          })
          if (!isHasItem) {
            arr.push({ 'name': ele.name, 'id': ele.participantId || ele.id })
          }
        })
        Object.assign(obj, { participants: arr })
      }
      this.$emit('confirmNextHandle', obj)
      this.closeConfirmDialog()
      this.closeApproveForm()
    },
    // 获取研发归口管理部门
    getRelevantDepartment (data) {
      let keys = []
      data.forEach(item => {
        if (item.data.isAttributeDepartment === '0') {
          keys.push(item.data.organizationCode)
        }
        if (item.children) {
          keys.concat(this.getRelevantDepartment(item.children))
        }
      })
      return keys
    },
    //解析数据（组织树）
    analyzeTreeData (data) {
      let newData = Object.assign({}, data.data)
      this.$set(newData, 'children', [])
      this.$set(newData, 'disabled', false)
      if (data.children) {
        data.children.forEach(ele => {
          newData.children.push(this.analyzeTreeData(ele))
        })
      }
      return newData
    },
    // 解析数据（部门+人员）
    analyzeTreeDataOrg (data) {
      this.$set(data, 'disabled', false)
      if (data.type === 0 && data.orgAbbr) {
        data.name = data.orgAbbr //组织树组织名称变为简称
      }
      if (data.children) {
        data.children.forEach(ele => {
          this.analyzeTreeDataOrg(ele)
        })
      }
      return data
    },
    // 解析数据（部门会签+人员）
    analyzeTreeDataDepartment (res) {
      this.$set(res, 'disabled', false)
      this.$set(res, 'id', res.data.organizationCode)
      //组织树组织名称变为简称
      this.$set(res, 'name', res.data.orgAbbr || res.data.organizationName)
      if (res.data.participantName && res.data.participantId) {
        let children = []
        if (res.children) {
          children = children.concat(res.children)
        }
        children.push({ // id为邮箱会导致key不唯一 造成选中取消失效
          id: res.data.participantId + res.data.organizationName,
          participantId: res.data.participantId,
          name: res.data.participantName,
          disabled: false,
          orgName: res.data.organizationName,
          orgCode: res.data.organizationCode
        })
        this.$set(res, 'children', children)
      }
      if (res.children) {
        res.children.forEach(ele => {
          if (ele.data) {
            this.analyzeTreeDataDepartment(ele)
          }
        })
      }
      return res
    },
    // 解析数据（人员懒加载）
    analyzeTreeDataLazy (data) {
      let newData = data
      newData.forEach(ele => {
        if (ele.type === 0 && ele.orgAbbr) {
          ele.name = ele.orgAbbr //组织树组织名称变为简称
        }
        this.$set(ele, 'isLeaf', ele.type === 1)
        this.$set(ele, 'participantId', ele.id)
        this.$set(ele, 'disabled', ele.type === 0)
      })
      return newData
    },
    // 解析数据（参与人规则10懒加载专用）
    analyzeTreeDataLazyTwoLevel (data) {
      let newData = data
      newData.forEach(ele => {
        if (ele.type !== 1 && ele.orgAbbr) {
          ele.name = ele.orgAbbr //组织树组织名称变为简称
        }
        this.$set(ele, 'isLeaf', ele.type === 1)
        this.$set(ele, 'participantId', ele.id)
        this.$set(ele, 'id', ele.id + ele.parentId)
      })
      return newData
    },
    // 组织+人树节点点击事件
    nodeClick (data) {
      if (this.approvalForm.approvalState === '0') {
        if (this.selectPeople.length > 0 && !this.peopleLazy) {
          this.$message({
            message: '请先删除已选择的人员后再试！',
            type: 'warning',
            showClose: true
          })
          this.$refs.treeOrg.setCheckedNodes([this.selectPeople[0]])
        } else {
          this.$refs.treeOrg.setCheckedNodes([data])
        }
      }
      if (this.peopleLazy) {
        this.searchTextOrg = ''
        if (this.approvalForm.approvalState === '0') {
          this.selectPeople = this.$refs.treeOrg.getCheckedNodes()
          this.selectShowPeople = this.selectPeople
          return
        }
        if (this.selectPeople.some(people => people.id === data.id)) {
          let index = 0
          this.selectPeople.forEach((item, i) => {
            if (data.id === item.id) {
              index = i
              this.selectPeople.splice(index, 1)
            }
          })
          this.selectShowPeople = this.selectPeople
        } else if (this.selectPeople.some(people => people.parentId === data.parentId)) {
          //处理各部门领导选人限制单选一个领导审批 (规则10和15)
          if (this.listType === '4' || this.listType === '5') {
            this.$refs.treeOrg.setChecked(data.id, false)
            this.$message({
              message: '会签环节各部门领导限制单选，请知悉',
              type: 'warning',
              showClose: true
            })
          }
        } else {
          this.selectPeople.push(data)
          this.selectShowPeople = this.selectPeople
        }
      }
    },
    // 校验组织树
    validTree () {
      if (this.selectShowDepartment.length === 0) {
        this.$message({
          message: '请选择部门！',
          type: 'warning',
          showClose: true
        })
        return false
      }
      return true
    },
    // 校验组织+人员
    validTreeOrg () {
      if (this.selectShowPeople.length === 0) {
        this.$message({
          message: '请选择人员！',
          type: 'warning',
          showClose: true
        })
        return false
      } else if (this.listType === '4' && this.relevantDepartmentPeopleList.length) {
        let isHaved = this.selectShowPeople.some((item) => {
          return this.relevantDepartmentPeopleList.some(Item => {
            return Item.userId === item.participantId
          })
        })
        if (!isHaved) {
          this.$message({
            message: '该流程必须经过本单位研发归口管理部门会签！',
            type: 'warning',
            showClose: true
          })
          return false
        }
      }
      return true
    },
    // 人员选择懒加载方法
    async peopleLoad (node, resolve) {
      if (node.level === 0) {
        let treeData = []
        if (this.orgName && this.orgCode) {
          treeData = [{
            name: this.orgName,
            id: this.orgCode,
            disabled: true,
            isLeaf: false
          }]
        } else {
          treeData = await this.orgInfoByOrgCode()
        }
        treeData.forEach(data => {
          data = this.analyzeTreeDataOrg(data)
        })
        this.treeData = treeData
        return resolve(treeData)
      }
      if (this.listType === '4') { //接口人 人员懒加载
        if (node.level === 1) {
          let nodeData = await this.getOrgListByParentOrgCode(node.data.id)
          return resolve(nodeData)
        }
        if (node.level > 1) {
          let nodeData = await this.peopleListByOrgCode(node.data.participantId)
          if (!nodeData.length) return resolve(null)
          return resolve(nodeData)
        }
      } else if (this.listType === '5') { //接口人 人员懒加载,无默认选中
        if (node.level === 1) {
          let nodeData = await this.getOrgListByOrgCode(node.data.id, this.lastOrgCode)
          return resolve(nodeData)
        }
        if (node.level > 1) {
          let nodeData = await this.peopleListByOrgCode(node.data.participantId)
          if (!nodeData.length) return resolve(null)
          return resolve(nodeData)
        }
      } else { //listType为3时候部门会签人员懒加载
        if (node.level >= 1) {
          let nodeData = await this.treeByParentOrgCode(node.data.id)
          if (!nodeData.length) return resolve(null)
          return resolve(nodeData)
        }
      }
    },
    //接口获取当前登录人所在公司 -- 根节点
    async orgInfoByOrgCode () {
      let newData = []
      try {
        newData = await API2.orgInfoByOrgCode(this.processInstId)
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
        let res = await API2.treeByParentOrgCode(orgCode)
        // console.log('res:', res)
        newData = this.analyzeTreeDataLazy(res)
      } catch (e) {
        if (e.selfError) return
        // console.log('获取下级组织和人员失败', e)
      }
      return newData
    },
    //根据组织编码查询组织的主负责人（参与人规则10懒加载专用）
    async peopleListByOrgCode (orgCode) {
      let newData = []
      try {
        let params = {
          orgCode: orgCode
        }
        let res = await API.peopleListByOrgCode(params)
        // console.log('res:', res)
        newData = this.analyzeTreeDataLazyTwoLevel(res)
      } catch (e) {
        if (e.selfError) return
        // console.log('获取下级组织人员失败', e)
      }
      return newData
    },
    //根据组织编码查询该组织下的直属下级组织（参与人规则10懒加载专用）
    async getOrgListByParentOrgCode (orgCode) {
      let newData = []
      try {
        let params = {
          orgCode: orgCode,
          businessSerialNumber: this.businessSerialNumber //业务流水号
        }
        let res = await API.getOrgListByParentOrgCode(params)
        // console.log('res:', res)
        newData = this.analyzeTreeDataLazyTwoLevel(res)
      } catch (e) {
        if (e.selfError) return
        // console.log('获取下级组织失败', e)
      }
      return newData
    },
    //根据组织编码查询该组织下的直属下级组织（参与人规则15懒加载专用）
    async getOrgListByOrgCode (orgCode, lastOrgCode) {
      let newData = []
      try {
        let params = {
          orgCode: orgCode,
          lastOrgCode: lastOrgCode
        }
        let res = await API.getOrgListByOrgCode(params)
        newData = this.analyzeTreeDataLazyTwoLevel(res)
      } catch (e) {
        if (e.selfError) return
      }
      return newData
    },
    // 人员选择（懒加载）模糊查询
    peopleSearch () {
      if (this.peopleLazy) {
        if (this.filterTextOrg) {
          this.searchPeopleLoading = true
          this.treeShow = false
          const params = {
            orgCode: this.orgCode,
            pageSize: 50,
            pageNum: 1,
            inSub: '1',
            userNameLike: this.filterTextOrg
          }
          this.userList = []
          this.peopleCheckList = []
          API2.getAllUserListByorgCode(params)
            .then(res => {
              this.searchPeopleLoading = false
              res.records = res.records.filter(item => {
                return this.selectPeople.every(e => { return e.id !== item.uid })
              })
              this.userList = res.records || []
            })
            .catch(e => {
              this.searchPeopleLoading = false
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
        } else {
          this.treeShow = true
        }
      }
    },
    // 选择人员模糊搜索确认
    confirmSelect () {
      if (this.approvalForm.approvalState === '0') {
        if (this.peopleCheckList.length) {
          if (this.selectPeople.length) {
            this.$message({
              message: '请先删除已选择的人员后再试！',
              type: 'warning',
              showClose: true
            })
            return
          } else if (this.peopleCheckList.length > 1) {
            this.$message({
              message: '最多选择只能选择一个人员！',
              type: 'warning',
              showClose: true
            })
            return
          }
        }
      }
      this.treeShow = true
      this.filterTextOrg = ''//清空查询条件返回组织树
      this.searchTextOrg = ''
      if (this.peopleCheckList.length) {
        let checkUserList = []
        this.peopleCheckList.forEach(item => {
          let userInfo = {
            id: item.uid,
            orgName: item.orgName,
            hasChildren: false,
            name: item.chineseName,
            parentId: item.orgCode,
            type: 1
          }
          checkUserList.push(userInfo)
        })
        // console.log(checkUserList)
        this.selectPeople = this.selectPeople.concat(checkUserList)
        this.selectShowPeople = this.selectPeople
      }
    },
    // 选择人员模糊搜索取消
    cancleSelect () {
      this.treeShow = true
      this.filterTextOrg = ''//清空查询条件返回组织树
      this.peopleCheckList = []
    }
  }
}
</script>
<style lang="scss" scoped>
.nextHandle {
  /deep/ .approvalDialog {
    .el-dialog {
      width:700px;
      .el-dialog__body {
        padding-bottom: 0;
        .el-form-item {
          margin-bottom: 15px;
          &.peopleChoosen{
            .el-input__inner {
              width: 380px;
            }
            .el-form-item__content{
              width: 380px;
              position: relative;
              .expert-icon {
                position: absolute;
                right: -30px;
                font-size: 20px;
                top: 1px;
                @include color();
                cursor: pointer;
              }
            }
            .tool-tip:focus {
              outline: none !important;
            }
          }
          .el-textarea {
            margin-bottom: 5px;
            .el-textarea__inner {
              padding-bottom: 15px;
            }
            .el-input__count {
              line-height: 10px;
              margin-right: 10px;
            }
          }
          .recycle {
            width: 40px;
            height: 40px;
            margin: 0 20px;
            cursor: pointer;
            display: inline-block;
            text-align: center;
          }
          .org-tree {
            width: 234px;
            height: 315px;
            border: 1px solid #e5e5e5;
            border-radius: 2px;
            display: inline-block;
            vertical-align: middle;
            .title-wrapper{
              width: 100%;
              display: flex;
              height: 40px;
              border-bottom: 1px solid #e5e5e5;
              .title {
                display: inline-block;
                padding-left: 8.5px;
                line-height: 40px;
                box-sizing: border-box;
                color: #333333;
              }
            }
            .filter-input{
              padding: 3px 8px;
              box-sizing: border-box;
              .el-input__inner {
                width: 218px;
                height: 32px;
              }
              .el-input__suffix {
                right: 8px;
                height: 32px;
              }
              .el-input__suffix-inner{
                line-height: 40px;
                i{
                  cursor: pointer;
                }
              }
            }
            .scrollWrap{
              width: 234px;
              height: 228px;
              .el-scrollbar {
                width: 100%;
                height: 100%;
                .el-scrollbar__wrap{
                  overflow-x: hidden;
                }
                .right-list {
                  .people-info {
                    padding: 0 10px;
                    height: 40px;
                    span {
                      width:200px;
                      display: inline-block;
                      white-space:nowrap;
                      overflow:hidden;
                      text-overflow:ellipsis;
                    }
                    .el-icon-close {
                      cursor: pointer;
                      float: right;
                      height: 40px;
                      line-height: 40px;
                    }
                  }
                  .people-org-info {
                    position: relative;
                    padding: 0 10px;
                    height: 40px;
                    line-height: 40px;
                    span {
                      display: inline-block;
                      white-space:nowrap;
                      overflow:hidden;
                      text-overflow:ellipsis;
                    }
                    span:first-child {
                      width: 50px;
                    }
                    span:nth-child(2) {
                      width: 140px;
                      margin-left: 10px;
                    }
                    .el-icon-close {
                      cursor: pointer;
                      float: right;
                      position:absolute;
                      height: 40px;
                      line-height: 40px;
                    }
                  }
                }
              }
            }
            .el-tree{
              >.el-tree-node{
                display:inline-block;
                min-width: 234px;
              }
              .el-tree-node__content {
                height: 32px;
              }
              &.disabled .el-tree-node__content{
                color: #666666;
              }
            }
            &.missCheckbox {
              overflow: hidden !important;
              .el-tree-node {
                .is-leaf + .el-checkbox .el-checkbox__inner {
                  display:inline-block;
                }
                .el-checkbox__input> .el-checkbox__inner {
                  display:none;
                }
              }
              .search-people {
                width: 236px;
                height: 276px;
                .not-data {
                  text-align: center;
                  height: 230px;
                }
                .searchConfirmBtn{
                  width: 100%;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
  /deep/ .confirmDialog {
    .el-dialog {
      width:530px;
      .el-dialog__body {
        padding-bottom: 0;
        .confirm {
          display: flex;
          div {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
