<template>
  <div class="team-info">
    <project-panel title="团队信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" @click="tempSave">保存本区块信息</el-button>
      </template>
      <div class="team-body">
        <el-form
          :model="teamInfoForm"
          :rules="teamRules"
          ref="teamInfoForm"
          label-width="130px"
          :show-message="false">
          <el-form-item label="项目经理:" prop="manageList">
            <div class="row-item" :class="{'error':!manageValidSuc}">
              <div :class="{'disabled':meberEditFlag}" v-if='meberEditFlag'></div>
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.manageList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.manageList"
                    :key="item.userAccount"
                    closable
                    @close="deletePerson(index,'manage')">
                    {{item.userName}}
                  </el-tag>
                </template>
                <span v-else class="placeholder">请选择</span>
              </div>
              <span class="add-icon svgfont-adduser"  @click="addPerson('manage')"></span>
            </div>
            <span v-if="!manageValidSuc" class="error-tip">请选择项目经理！</span>
          </el-form-item>
          <el-form-item label="项目成员:" prop="memberList">
            <div class="row-item" :class="{'error':!memberValidSuc}">
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.memberList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.memberList"
                    :key="item.userAccount"
                    closable
                    @close="deletePerson(index,'member')">
                    {{item.userName}}
                  </el-tag>
                </template>
                <span v-else class="placeholder">请选择</span>
              </div>
              <span class="add-icon svgfont-adduser" @click="addPerson('member')"></span>
            </div>
            <span v-if="!memberValidSuc" class="error-tip">请选择项目成员！</span>
          </el-form-item>
          <el-form-item label="项目观察员:" prop="observerList">
            <div class="row-item">
              <div :class="{'disabled':meberEditFlag}" v-if='meberEditFlag'></div>
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.observerList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.observerList"
                    :key="item.userAccount"
                    closable
                    @close="deletePerson(index,'observer')">
                    {{item.userName}}
                  </el-tag>
                </template>
                <span v-else class="placeholder">请选择</span>
              </div>
              <span class="add-icon svgfont-adduser" @click="addPerson('observer')"></span>
            </div>
          </el-form-item>
          <el-form-item label="专家:" prop="expertList" class="select-item">
            <div :class="{'disabled':meberEditFlag}" v-if='meberEditFlag'></div>
            <div v-if="hasExpert===true || hasExpert===undefined">
              <el-select
                v-model="selExpert"
                placeholder="请选择"
                class="filter-select"
                multiple
                value-key="userAccount"
                :multiple-limit="50"
                ref="expertSel"
                @change="changeFilterSel('expertSel')"
                @visible-change="optionsShow"
                @remove-tag="removeExpert('expert')"
                :disabled="hasExpert===undefined">
                <template slot="prefix">
                  <el-scrollbar class="expert-scrollbar">
                    <el-tag
                      :disable-transitions="true"
                      v-for="(item, index) in selExpert"
                      :key="index"
                      closable
                      @close="deleteExpert(index,'expert')">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.userAccount"
                        placement="top-start"
                        size="small">
                        <span>{{item.userName}}</span>
                      </el-tooltip>
                    </el-tag>
                  </el-scrollbar>
                </template>
                <div class="el-search" style="padding : 0 5px 5px">
                  <el-input
                    ref="expertInput1"
                    placeholder="请输入"
                    @input="filterSelect('expert')"
                    v-model.trim="expertFilter">
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      style="cursor:pointer"
                      @click="filterSelect('expert')"></i>
                  </el-input>
                </div>
                <template slot="empty">
                  <div class="el-search" style="padding :6px 5px 0;">
                    <el-input
                      ref="expertInput2"
                      placeholder="请输入"
                      @input="filterSelect('expert')"
                      v-model.trim="expertFilter">
                      <i
                        slot="suffix"
                        class="el-input__icon el-icon-search"
                        style="cursor:pointer"
                        @click="filterSelect('expert')"></i>
                    </el-input>
                  </div>
                  <div style="padding:10px 5px;text-align:center;color:#999999;">暂无数据</div>
                </template>
                <el-option
                  v-for="item in showExpertCfgs"
                  :key="item.userAccount"
                  :label="item.userName"
                  :value="item">
                  <span style="float: left">{{ item.userName + " \\ " + item.organizationName }}</span>
                </el-option>
              </el-select>
            </div>
            <div v-else class="row-item">
              <div :class="{'disabled':meberEditFlag}" v-if='meberEditFlag'></div>
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.expertList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.expertList"
                    :key="item.userAccount"
                    closable
                    @close="deletePerson(index,'expert')">
                    {{item.userName}}
                  </el-tag>
                </template>
                <span v-else class="placeholder">请选择</span>
              </div>
              <span class="add-icon svgfont-adduser" @click="addPerson('expert')"></span>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- <el-dialog
        v-if="personDialogVisible"
        title="选择人员"
        :visible.sync="personDialogVisible"
        width="925px"
        @closed="personDialogClosed">
        <person-select ref="personTable" :exclude-user="excludeUser"></person-select>
        <div class="dialog-footer" slot="footer">
          <el-button @click="personDialogClosed">取消</el-button>
          <el-button @click="confirmSelect" type="primary">确认</el-button>
        </div>
      </el-dialog> -->
      <person-select
        :show.sync="personDialogVisible"
        @selected="confirmSelect"
        :lead-department-code="leadDepartmentCode"
        :cooperate-department-code="cooperateDepartmentCode"
        :role-type="roleType"
        :all-person="[...teamInfoForm.manageList,...teamInfoForm.memberList]"
        ref="selectPerson"></person-select>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_groupPlanProject'
import API_PJ from '@/serve/API_project'
import personSelect from '../components/personSelect'
import bus from '@/common/bus'
import { mapGetters } from 'vuex'
import { uniqueObjArr } from '@/utils/common'
export default {
  components: { projectPanel, personSelect },
  data () {
    return {
      meberEditFlag: false,
      currentChange: '', // 当前给谁添加人员 项目经理/项目成员
      saveFlag: '', // 暂存团队信息标志
      teamInfoForm: {
        manageList: [],
        memberList: [],
        observerList: [],
        expertList: []
      },
      teamRules: {
        manageList: [{ required: true, message: '请输入项目经理', trigger: 'blur' }],
        memberList: [{ required: true, message: '请输入项目成员', trigger: 'blur' }]
      },
      roleList: [
        { name: '项目经理', selfName: 'manage', valueCode: 'PR-LEADER-UNDERTAKER-MANAGER' },
        { name: '项目成员', selfName: 'member', valueCode: 'PR-PARTNER-UNDERTAKER-MEMBER' },
        { name: '项目观察员', selfName: 'observer', valueCode: 'PR-PROJECT-OBSERVER' },
        { name: '专家', selfName: 'expert', valueCode: 'PR-EXPERT' }
      ],
      manageName: '项目经理',
      memberName: '项目成员',
      personDialogVisible: false,
      roleType: '', //当前被添加的角色
      excludeUser: [], //被排除的已选用户
      isChangeManage: false, //是否进行过任何的操作
      isChangeMember: false, //是否进行过任何的操作
      // manageValidSuc: true, //是否校验成功
      // memberValidSuc: true //是否校验成功
      companyOrgCode: '',
      hasExpert: false, //是否配置了专家清单
      expertCfgs: [], //专家清单-所有的专家列表
      showExpertCfgs: [], //专家清单-筛选后的下拉列表
      expertFilter: '', //模糊查询字符
      selExpert: [], //专家清单-被选中的专家
      language: '团队信息中所有可编辑字段都是基线字段；',
      checkData: [
        {
          label: 'leaderUndertakeManager',
          value: '项目经理'
        }, {
          label: 'projectMember',
          value: '项目成员'
        }, {
          label: 'projectInspector',
          value: '项目观察员'
        }, {
          label: 'projectExpert',
          value: '专家'
        }]
    }
  },
  props: {
    //编辑 已有数据
    receiveData: {
      type: Array,
      default: () => []
    },
    projectCompanyList: {
      type: Array,
      default: () => []
    },
    projectTeamList: {
      type: Array,
      default: () => []
    },
    projectCode: {
      type: String,
      default: ''
    },
    leadDepartmentCode: { // 牵头部门code
      type: String,
      default: ''
    },
    cooperateDepartmentCode: { // 承担部门code
      type: String,
      default: ''
    },
    tipLanguage: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    tipLanguage: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val !== '{}') {
          let add = []
          this.checkData.forEach(item => {
            if (val[item.label]) {
              add.push(item.value)
            }
          })
          if (add.length) {
            if (add.length === Object.getOwnPropertyNames(val).length - 1) {
              this.language = '团队信息中所有可编辑字段都是基线字段；'
              return
            }
            this.language = `团队信息中的基线字段：${add.join('、')}；`
          } else {
            this.language = '团队信息中没有基线字段；'
          }
        }
      }
    },
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.analyzeData()
        }
      }
    },
    projectTeamList: { // 已选人员回显
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.teamInfoForm = { manageList: [], memberList: [], observerList: [], expertList: [] }
          this.selExpert = []
          val.forEach(item => {
            if (item.projectRoleCode === 'PR-MANAGER' || item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MANAGER') {
              this.teamInfoForm.manageList.push(item)
            }
            if (item.projectRoleCode === 'PR-MEMBER' || item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MEMBER' || item.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER') {
              this.teamInfoForm.memberList.push(item)
            }
            if (item.projectRoleCode === 'PR-PROJECT-OBSERVER') {
              this.teamInfoForm.observerList.push(item)
            }
            if (item.projectRoleCode === 'PR-EXPERT') {
              this.teamInfoForm.expertList.push(item)
              this.selExpert.push(item)
            }
          })
        }
        this.changeValue(true)
      }
    },
    leadDepartmentCode (val, oldVal) {
      // console.log(val, oldVal)
    },
    cooperateDepartmentCode (val, oldVal) {
      // console.log(val, oldVal, JSON.parse(val))
    }
  },
  computed: {
    ...mapGetters({ userInfo: 'USERENTITY/userInfo' }),
    manageValidSuc () {
      if (!this.isChangeManage) return true
      return this.teamInfoForm.manageList && this.teamInfoForm.manageList.length > 0
    },
    memberValidSuc () {
      if (!this.isChangeMember) return true
      return this.teamInfoForm.memberList && this.teamInfoForm.memberList.length > 0
    }
  },
  methods: {
    async addPerson (roleType) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.roleType = roleType
      this.excludeUser = this.teamInfoForm[`${roleType}List`]
      if (this.judgeNum(this.excludeUser)) return
      this.personDialogVisible = true

      if (roleType === 'manage' || roleType === 'member') {
        this.teamInfoForm[`${roleType}List`].forEach(ele => {
          ele.uid = ele.userAccount
          ele.chineseName = ele.userName
        })
        this.$refs.selectPerson.refreshTree({
          roleType,
          users: this.teamInfoForm[`${roleType}List`],
          orgCodeScope: {
            leadDepartmentCode: this.leadDepartmentCode,
            cooperateDepartmentCode: this.cooperateDepartmentCode
          },
          unitType: 'undertakeTeam'
        })
      } else {
        let params = null
        params = {
          node: [{
            orgAbbr: '中国移动集团有限公司',
            orgCode: '00000000000000000000'
          }],
          users: [],
          max: 200
        }
        switch (roleType) {
          case 'observer':
            params = {
              node: [{
                orgAbbr: '中国移动集团有限公司',
                orgCode: '00000000000000000000'
              }],
              users: this.teamInfoForm[`${roleType}List`],
              max: 200
            }
            break
          case 'expert':
            let node = []
            this.getOrgCodeByCompCode()
            node.push({
              orgAbbr: this.$store.getters['USERENTITY/userInfo'].userAuth.curUserOrg.companyName,
              orgCode: this.companyOrgCode
            })
            params = {
              node: node,
              users: this.teamInfoForm[`${roleType}List`],
              max: 50
            }
            break
        }
        params.roleType = roleType
        params.unitType = 'undertakeTeam'
        params.users.forEach(ele => {
          ele.uid = ele.userAccount
          ele.chineseName = ele.userName
        })
        this.personDialogVisible = true
        this.$refs.selectPerson.refreshTree(params)
      }
    },
    judgeNum (list, isConfirm) {
      let msg = ''
      switch (this.roleType) {
        case 'manage':
          if ((isConfirm && list.length > 1) || (!isConfirm && list.length === 1)) {
            msg = '项目经理最多添加1人！'
          }
          break
        case 'member':
          if ((isConfirm && list.length > 500) || (!isConfirm && list.length === 500)) {
            msg = '项目成员最多添加500人！'
          }
          break
        case 'observer':
          if ((isConfirm && list.length > 200) || (!isConfirm && list.length === 200)) {
            msg = '项目观察员最多添加200人！'
          }
          break
        case 'expert':
          if ((isConfirm && list.length > 50) || (!isConfirm && list.length === 50)) {
            msg = '专家最多添加50人！'
          }
          break
      }
      if (msg) {
        this.$message({
          type: 'warning',
          message: msg,
          showClose: true
        })
      }
      return msg
    },
    personDialogClosed () {
      this.personDialogVisible = false
    },
    confirmSelect ({ roleType, users }) {
      // let sected = this.$refs['personTable'].getSeclectedPerson()
      // let uidArr = this.teamInfoForm[`${this.roleType}List`].map(item => { return item.uid || item.userAccount })
      // users = users.filter(item => { let uid = item.uid || item.userAccount; if (uidArr.indexOf(uid) === -1) { return item } })
      // let newList = this.teamInfoForm[`${this.roleType}List`].concat(users)
      let newList = JSON.parse(JSON.stringify(users))
      if (!this.judgeNum(newList, true)) {
        this.teamInfoForm[`${this.roleType}List`] = newList
        if (this.roleType === 'manage') this.isChangeManage = true
        if (this.roleType === 'member') this.isChangeMember = true
        this.personDialogClosed()
      }
      this.getSubmitData(roleType, this.teamInfoForm[`${roleType}List`])
      if (this.roleType === 'manage' || this.roleType === 'member') {
        this.changeValue()
      } else {
        this.changeInfo()
      }
    },
    deletePerson (index, roleType) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (roleType === 'manage') this.isChangeManage = true
      if (roleType === 'member') this.isChangeMember = true
      if (index > -1) {
        this.teamInfoForm[`${roleType}List`].splice(index, 1)
      }
      if (roleType === 'manage' || roleType === 'member') {
        this.changeValue()
      } else {
        this.changeInfo()
      }
    },
    getSubmitData (role, list) {
      let listIn = JSON.parse(JSON.stringify(list))
      let valueCode = ''
      this.roleList.some(ele => {
        if (ele.selfName === role) {
          valueCode = ele.valueCode
        }
      })
      if (role === 'expert' && this.hasExpert) {
        this.selExpert.forEach(ele => {
          ele.projectCode = this.projectCode
          ele.projectRoleCode = valueCode
        })
        listIn = this.selExpert
      } else {
        listIn.forEach(ele => {
          ele.projectCode = this.projectCode
          ele.projectRoleCode = valueCode
        })
      }
      return listIn
    },
    tempSave () {
      if (!this.projectCode) {
        this.$message({
          message: '请先保存基本信息！',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.isChangeManage = true
      this.isChangeMember = true
      if (this.manageValidSuc && this.memberValidSuc) {
        let params = []
        params = params.concat(this.getSubmitData('manage', this.teamInfoForm.manageList))
        params = params.concat(this.getSubmitData('member', this.teamInfoForm.memberList))
        params = params.concat(this.getSubmitData('observer', this.teamInfoForm.observerList))
        params = params.concat(this.getSubmitData('expert', this.teamInfoForm.expertList))
        API.editProjectTeamU({ projectCode: this.projectCode, projectTeamList: params })
          .then(res => {
            this.$message({
              message: '团队信息保存成功',
              type: 'success',
              showClose: true
            })
            this.$emit('saveTeamInfo', true)
            this.changeInfo(false)
          })
          .catch(e => {
            if (e.selfError) return
            this.$message({
              message: e.message || '团队信息保存失败！',
              type: 'error',
              showClose: true
            })
          })
      }
    },
    analyzeData () {
      //清空默认
      this.teamInfoForm.manageList = []
      this.receiveData.forEach(item => {
        this.roleList.some(role => {
          if (role.valueCode === item.projectRoleCode) {
            this.teamInfoForm[`${role.selfName}List`].push(item)
            return true
          }
        })
      })
    },
    async validate () {
      // return new Promise((resolve, reject) => {
      this.isChangeManage = true
      this.isChangeMember = true
      if (this.manageValidSuc && this.memberValidSuc) {
        let params = []
        params = params.concat(this.getSubmitData('manage', this.teamInfoForm.manageList))
        params = params.concat(this.getSubmitData('member', this.teamInfoForm.memberList))
        params = params.concat(this.getSubmitData('observer', this.teamInfoForm.observerList))
        params = params.concat(this.getSubmitData('expert', this.teamInfoForm.expertList))
        return params
      } else {
        // return []
        return false
      }
      // })
    },
    async getOrgCodeByCompCode () {
      if (!this.companyOrgCode) {
        this.companyOrgCode = await API.getOrgCodeByCompanyCode({ companyCode: this.$store.getters['USERENTITY/userInfo'].userAuth.curUserOrg.companyCode })
      }
      return this.companyOrgCode
    },
    //获取专家清单
    getExpertList () {
      this.getOrgCodeByCompCode()
      API.judgeExpert()
        .then(hasExpert => {
          if (hasExpert) {
            this.hasExpert = true
            API.projectExpertByOrgCode({
              orgCode: this.companyOrgCode
            })
              .then(res => {
                if (res && res.length) {
                  res.forEach(ele => {
                    ele.userAccount = ele.uid
                    ele.userName = ele.chineseName
                    ele.organizationCode = ele.orgCode
                    ele.organizationName = ele.orgName
                  })
                  this.hasExpert = true
                  this.expertCfgs = res
                  this.showExpertCfgs = this.expertCfgs
                } else {
                  this.expertCfgs = []
                  this.showExpertCfgs = []
                }
              })
              .catch(e => {
                this.$message({
                  message: e.message || '获取专家配置失败',
                  type: 'error',
                  showClose: true
                })
              })
          } else {
            this.hasExpert = false
            this.expertCfgs = []
            this.showExpertCfgs = []
          }
        })
        .catch(e => {
          this.hasExpert = undefined
          if (e.selfError) return
          this.$message({
            message: e.message || '获取专家配置失败',
            type: 'error',
            showClose: true
          })
        })
    },
    //下拉选项选中和删除
    changeFilterSel (target) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (target === 'expertSel') {
        setTimeout(() => {
          let _el = this.$refs[target].$el
          let _in = _el.querySelector('.el-input__inner')
          _el.querySelector('.el-input').style.height = _in.style.height || '30px'
        }, 300)
      }
      this.changeInfo()
    },
    //筛选下拉列表
    filterSelect (type) {
      if (type === 'expert') {
        if (this.expertFilter) {
          this.showExpertCfgs = this.expertCfgs.filter(item => {
            return item.userName.indexOf(this.expertFilter) !== -1
          })
          if (this.showExpertCfgs.length === 0) { this.inputFocus('expertInput2') }
        } else {
          this.showExpertCfgs = this.expertCfgs
          this.inputFocus('expertInput1')
        }
      }
    },
    // 移除专家/项目经理
    deleteExpert (i, tag) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (tag === 'expert') {
        this.selExpert.splice(i, 1)
      }
      this.removeExpert(tag)
    },
    //输入框获取焦点
    inputFocus (node) {
      this.$nextTick(() => {
        this.$refs[`${node}`].focus()
      })
    },
    //显示下拉选项
    optionsShow (visible) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (!visible) {
        this.expertFilter = ''
        this.filterSelect('expert')
      }
    },
    //移除专家
    removeExpert (tag) {
      this.changeInfo()
    },
    //有信息发生修改
    changeInfo (edited = true, msg = false) {
      let params = {
        curBlock: 'teamInfo',
        hasEdited: edited,
        onlyShowMsg: msg
      }
      bus.$emit('groupPlanProjectEdit', params)
    },
    //传给子项目做联动
    changeValue (isInit = false) {
      if (!isInit) { //不是初始化时才执行
        this.changeInfo()
      }
      this.$nextTick(() => {
        this.teamInfoForm.manageList = this.getSubmitData('manage', this.teamInfoForm.manageList)
        this.teamInfoForm.memberList = this.getSubmitData('member', this.teamInfoForm.memberList)
        let data = uniqueObjArr([...this.teamInfoForm.manageList, ...this.teamInfoForm.memberList], 'userAccount')
        bus.$emit('changeTeamInfo', JSON.parse(JSON.stringify(data)))
      })
    }
  },
  async mounted () {
    await this.getExpertList()
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
    if (this.receiveData && this.receiveData.length) {
      //编辑
      this.analyzeData()
    } else {
      //新增
      this.teamInfoForm.manageList = [{
        organizationCode: this.userInfo.userAuth.organizationCode || this.userInfo.userAuth.orgCode,
        companyCode: this.userInfo.userAuth.companyCode,
        userName: this.userInfo.userAuth.chineseName,
        projectRoleCode: 'PR-LEADER-UNDERTAKER-MANAGER',
        projectCode: this.projectCode,
        employeeNum: this.userInfo.userAuth.employeeNum,
        userAccount: this.userInfo.userAuth.uid,
        uid: this.userInfo.userAuth.uid
      }]
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
.project-panel /deep/ .panel-body{
  margin-bottom: 0;
}
.team-info{
   .project-panel{
    margin-bottom: 0px;
  }
  // margin-top: 20px;
  .team-body{
    /deep/ .el-form-item__label{
      height: 32px;
      line-height: 32px;
    }
    .row-item{
      min-height: 30px;
      line-height: 30px;
      border: 1px solid #E5E5E5;
      border-radius: 2px;
      display: flex;
      position: relative;
      justify-content: space-between;
      &.error{
        border: 1px solid red;
      }
      .disabled{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba($color: #f0f0f0, $alpha: 0.8);
      }
      .el-tag{
        background: none;
        border: none;
        font-size: 12px;
        color: #333;
        height: 29px;
        /deep/ .el-tag__close{
          color: #999;
          &:hover{
            color: #ffffff;
          }
        }
      }
      .add-icon{
        flex-shrink: 0;
        text-align: center;
        width: 30px;
        margin: auto 0;
        @include color();
        cursor: pointer;
      }
      .placeholder{
        color: #999;
        padding-left: 10px;
      }
    }
    .error-tip{
      display: none;
  background: #fff;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: -32px;
  border: 1px solid #f56c6c;
  right: 1px;
  z-index: 999999999;
  padding: 4px !important;
  left: auto;
  white-space: nowrap;
    }
  }
/deep/ .el-form-item__content:hover{
  .error-tip{
    display: inline-block;
  }
}

/deep/ .error-tip:before{
content: ”;
position: absolute;
top: 18px;
left: 12px;
width: 4px;
height: 4px;
border: 1px solid #f56c6c;
background: #fff;
border-top-color: transparent;
border-left-color: transparent;
content: " ";
transform: rotate(
45deg
);
}

  .select-item {
    /deep/ .el-form-item__content{
      line-height: 30px;
    }
    .disabled{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      background-color: rgba($color: #f0f0f0, $alpha: 0.8);
    }
  }

  .filter-select  {
    width: 100%;

    /deep/ .el-input__prefix {
      left: 0;
    }

    /deep/ .el-input__suffix-inner{
      top: 50%;
      position: absolute;
      right: 0;
      transform: translateY(-50%);

      i{
        @include color()
      }
    }

    /deep/ .el-tag{
      background: #fff;
      border-color: #fff;
      margin-left: 2px;

      .el-select__tags-text{
        color : #333;
      }
    }

    /deep/ .el-tag--info {
      display: none;
    }

    /deep/ .el-input{
      border: 1px solid #e5e5e5;
      transition: height .3s linear;
    }

    /deep/ .el-input__inner{
      width: 100%;
      border:none;
      outline: none;
      padding-left: 10px;

      &:focus{
        box-shadow: none;
        border: none;
      }
    }

    &:hover{
      /deep/ .el-input__inner{
        border:none;
      }
    }

  }

  .expert-scrollbar {
    height: 35px;
    /deep/ .el-scrollbar__wrap {
      // white-space: nowrap;
      overflow-x: hidden;
      max-width: 670px;
      height: 40px;
      .el-tag{
        background: none;
        border: none;
        font-size: 12px;
        color: #333;
        height: 29px;
        margin: 0;
        /deep/ .el-tag__close{
          color: #999;
          &:hover{
            background: none !important;
          }
        }
      }
    }
  }
}
</style>
