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
            <div v-if="hasManager===true || hasManager===undefined"  class="row-item" style="border:none;">
              <el-select
                v-model="selManage"
                placeholder="请选择"
                multiple
                value-key="uid"
                :multiple-limit="1"
                class="filter-select"
                ref="manageSel"
                @change="changeFilterSel('manageSel')"
                @visible-change="optionsShow"
                @remove-tag="removeExpert('manage')"
                :disabled="hasManager===undefined">
                <template slot="prefix">
                  <el-scrollbar class="expert-scrollbar">
                    <el-tag
                      v-for="(item, index) in selManage"
                      :key="index"
                      closable
                      @close="deleteExpert(index,'manage')">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.uid"
                        placement="top-start"
                        size="small">
                        <span>{{item.chineseName}}</span>
                      </el-tooltip>
                    </el-tag>
                  </el-scrollbar>
                </template>
                <div class="el-search" style="padding : 0 5px 5px">
                  <el-input
                    ref="managerInput1"
                    placeholder="请输入"
                    @input="filterSelect('manager')"
                    v-model.trim="managerFilter">
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search"
                      style="cursor:pointer"
                      @click="filterSelect('manager')"></i>
                  </el-input>
                </div>
                <template slot="empty">
                  <div class="el-search" style="padding :6px 5px 0;">
                    <el-input
                      ref="managerInput2"
                      placeholder="请输入"
                      @input="filterSelect('manager')"
                      v-model.trim="managerFilter">
                      <i
                        slot="suffix"
                        class="el-input__icon el-icon-search"
                        style="cursor:pointer"
                        @click="filterSelect('manager')"></i>
                    </el-input>
                  </div>
                  <div style="padding:10px 5px;text-align:center;color:#999999;">暂无数据</div>
                </template>
                <el-option
                  v-for="item in showManagerCfgs"
                  :key="item.uid"
                  :label="item.chineseName"
                  :value="item">
                  <span style="float: left">{{ item.chineseName + " \\ " + item.orgName }}</span>
                </el-option>
              </el-select>
            </div>
            <div v-else class="row-item" :class="{'error':!manageValidSuc}">
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.manageList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.manageList"
                    :key="item.uid"
                    closable
                    @close="deletePerson(index,'manage')">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.uid"
                      placement="top-start"
                      size="small">
                      <span> {{ item.chineseName }}</span>
                    </el-tooltip>
                  </el-tag>
                </template>
                <span v-else class="placeholder">请选择</span>
              </div>
              <span class="add-icon svgfont-adduser" @click="addPerson('manage')"></span>
            </div>
            <span v-if="!manageValidSuc" class="error-tip">请选择项目经理</span>
          </el-form-item>
          <el-form-item label="项目成员:" prop="memberList">
            <div class="row-item" :class="{'error':!memberValidSuc}">
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.memberList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.memberList"
                    :key="item.uid"
                    closable
                    @close="deletePerson(index,'member')">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.uid"
                      placement="top-start"
                      size="small">
                      <span> {{ item.chineseName }}</span>
                    </el-tooltip>
                  </el-tag>
                </template>
                <span v-else class="placeholder">请选择</span>
              </div>
              <span class="add-icon svgfont-adduser" @click="addPerson('member')"></span>
            </div>
            <span v-if="!memberValidSuc" class="error-tip">请选择项目成员</span>
          </el-form-item>
          <el-form-item label="项目观察员:" prop="observerList">
            <div class="row-item">
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.observerList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.observerList"
                    :key="item.uid"
                    closable
                    @close="deletePerson(index,'observer')">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.uid"
                      placement="top-start"
                      size="small">
                      <span> {{ item.chineseName }}</span>
                    </el-tooltip>
                  </el-tag>
                </template>
                <span v-else class="placeholder">请选择</span>
              </div>
              <span class="add-icon svgfont-adduser" @click="addPerson('observer')"></span>
            </div>
          </el-form-item>
          <el-form-item label="专家:" class="select-item" prop="expertList">
            <div v-if="hasExpert===true || hasExpert===undefined">
              <el-select
                v-model="selExpert"
                placeholder="请选择"
                class="filter-select"
                multiple
                value-key="uid"
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
                        :content="item.uid"
                        placement="top-start"
                        size="small">
                        <span>{{item.chineseName}}</span>
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
                  :key="item.uid"
                  :label="item.chineseName"
                  :value="item">
                  <span style="float: left">{{ item.chineseName + " \\ " + item.orgName }}</span>
                </el-option>
              </el-select>
            </div>
            <div v-else class="row-item" >
              <div class="tag-wrapper">
                <template v-if="teamInfoForm.expertList.length">
                  <el-tag
                    v-for="(item,index) in teamInfoForm.expertList"
                    :key="item.uid"
                    closable
                    @close="deletePerson(index,'expert')">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.uid"
                      placement="top-start"
                      size="small">
                      <span> {{ item.chineseName }}</span>
                    </el-tooltip>
                  </el-tag>
                </template>
                <span v-else class="placeholder">请选择</span>
              </div>
              <span class="add-icon svgfont-adduser" @click="addPerson('expert')"></span>
            </div>
          </el-form-item>
        </el-form>
      </div>

    </project-panel>

    <person-select :show.sync="personDialogVisible" @selected="selectedPersions" ref="selectPerson"></person-select>

  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
import { mapGetters } from 'vuex'
import personSelect from './personSelect'
import bus from '@/common/bus'
export default {
  components: { projectPanel, personSelect },
  data () {
    return {
      saveFlag: '', // 保存团队信息标志
      hasManager: false, //是否配置项目经理
      managerCfgs: [], //配置的项目经理列表
      showManagerCfgs: [],
      selManage: [],
      hasExpert: false,
      expertCfgs: [],
      showExpertCfgs: [],
      selExpert: [],
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
        { name: '项目经理', selfName: 'manage', valueCode: 'PR-MANAGER' },
        { name: '项目成员', selfName: 'member', valueCode: 'PR-MEMBER' },
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
      managerFilter: '', //项目经理下拉搜索
      expertFilter: '', //专家下拉搜索
      isEditable: true, //是否可编辑
      isTempSave: {},
      language: '暂无基线信息',
      checkData: [
        {
          label: 'managerName',
          value: '项目经理'
        }, {
          label: 'memberName',
          value: '项目成员'
        }, {
          label: 'inspector',
          value: '项目观察员'
        }, {
          label: 'expert',
          value: '专家'
        }, {
          label: 'all',
          value: '全部'
        }]
    }
  },
  props: {
    projectCode: {
      type: String,
      default: ''
    },
    //编辑 已有数据
    receiveData: {
      type: Array,
      default: () => []
    },
    //牵头承担部
    leadResponsibleDept: {
      type: String,
      default: ''
    },
    //配合承担部
    cooperateResponsibleDept: {
      type: Array,
      default: () => []
    },
    //是否可编辑
    canEdit: {
      type: Boolean,
      default: true
    },
    //当前区块是否已保存
    isSave: {
      type: Object,
      default: () => {}
    },
    tipLanguage: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.analyzeData()
        }
      }
    },
    leadResponsibleDept: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
        }
      }
    },
    cooperateResponsibleDept: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
        }
      }
    },
    canEdit: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.isEditable = val
      }
    },
    isSave: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.isTempSave = val
      }
    },
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
            if (add[0] === '全部' && add.length === 1) {
              this.language = '团队信息中所有可编辑字段都是基线字段；'
              return
            }
            if (add.length === 4) {
              this.language = '团队信息中所有可编辑字段都是基线字段；'
              return
            }
            this.language = `团队信息中的基线字段：${add.join('、')}；`
          } else {
            this.language = '团队信息中没有基线字段；'
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    }),
    manageValidSuc () {
      if (!this.isChangeManage) return true
      if (this.hasManager) {
        return this.selManage && this.selManage.length
      } else {
        return this.teamInfoForm.manageList && this.teamInfoForm.manageList.length
      }
    },
    memberValidSuc () {
      if (!this.isChangeMember) return true
      return this.teamInfoForm.memberList && this.teamInfoForm.memberList.length
    }
  },
  methods: {
    selectedPersions (persons) {
      this.teamInfoForm[`${persons.roleType}List`] = persons.users
      if (this.roleType === 'manage') this.isChangeManage = true
      if (this.roleType === 'member') this.isChangeMember = true
      this.changeInfo()
      this.changeValue()
    },
    changeFilterSel (target) {
      this.changeInfo()
      if (target === 'expertSel') {
        setTimeout(() => {
          let _el = this.$refs[target].$el
          let _in = _el.querySelector('.el-input__inner')
          _el.querySelector('.el-input').style.height = _in.style.height || '30px'
        }, 300)
      }
    },
    filterSelect (type) {
      if (type === 'expert') {
        if (this.expertFilter) {
          this.showExpertCfgs = this.expertCfgs.filter(item => {
            return item.chineseName.indexOf(this.expertFilter) !== -1
          })
          if (this.showExpertCfgs.length === 0) { this.inputFocus('expertInput2') }
        } else {
          this.showExpertCfgs = this.expertCfgs
          this.inputFocus('expertInput1')
        }
      } else {
        if (this.managerFilter) {
          this.showManagerCfgs = this.managerCfgs.filter(item => {
            return item.chineseName.indexOf(this.managerFilter) !== -1
          })
          if (this.showManagerCfgs.length === 0) { this.inputFocus('managerInput2') }
        } else {
          this.showManagerCfgs = this.managerCfgs
          this.inputFocus('managerInput1')
        }
      }
    },
    // 移除专家/项目经理
    deleteExpert (i, tag) {
      if (tag === 'expert' && this.hasExpert === undefined) return
      if (tag === 'manage' && this.hasManager === undefined) return
      this.changeInfo()
      this.removeExpert(tag)
      if (tag === 'expert') {
        this.selExpert.splice(i, 1)
      } else {
        this.selManage.splice(i, 1)
      }
    },
    //输入框获取焦点
    inputFocus (node) {
      this.$nextTick(() => {
        this.$refs[`${node}`].focus()
      })
    },
    //显示下拉选项
    optionsShow (visable) {
      if (visable && !this.isEditable) {
        this.focusIn()
      } else if (!visable) {
        this.managerFilter = ''
        this.expertFilter = ''
        this.filterSelect('managerFilter')
        this.filterSelect('expert')
      }
    },
    //移除专家
    removeExpert (tag) {
      if (!this.isEditable) {
        this.focusIn()
      }
      if (tag === 'manage') {
        this.isChangeManage = true
      }
    },
    async addPerson (roleType) {
      if (!this.isEditable) {
        this.focusIn()
        if (!this.isTempSave.teamInfo) {
          let keys = Object.keys(this.isTempSave)
          let only = true //只要当前区块未保存时
          keys.some(key => {
            if (!this.isTempSave[key] && key !== 'teamInfo') {
              only = false
              return true
            }
          })
          if (!only) return
        }
      }
      this.roleType = roleType
      let params = {}

      if (roleType === 'manage') {
        //没有则从牵头承担部所的所有人员中选择
        if (this.leadResponsibleDept === '') {
          this.$message({
            type: 'warning',
            message: '请先选择牵头承担部门并及时保存属性信息的修改！',
            showClose: true
          })
          return
        }
        let orgDetail = await API.orgInfoByOrgCode(this.leadResponsibleDept)
        params = {
          node: [{
            orgAbbr: orgDetail.org.orgName,
            orgCode: orgDetail.org.orgCode
          }],
          max: 1
        }
        /* params = {
          node: [{
            orgName: '中国移动集团有限公司',
            orgCode: '00000000000000000000'
          }],
          max: 1
        } */
      } else if (roleType === 'member') {
        //可添加多个，本单位项目成员必填，仅能从从牵头、配合承担部所中选择选择，500人上限
        if (this.leadResponsibleDept === '') {
          this.$message({
            type: 'warning',
            message: '请先选择牵头承担部门和配合承担部门并及时保存属性信息的修改！',
            showClose: true
          })
          return
        }
        let arr = []
        if (this.cooperateResponsibleDept && this.cooperateResponsibleDept.length > 0) {
          arr = [this.leadResponsibleDept, ...this.cooperateResponsibleDept]
        } else {
          arr = [this.leadResponsibleDept]
        }
        let orgList = [...new Set(arr)]
        let node = []
        let orgsDetail = []
        let len = 0
        orgList.forEach(async org => {
          let orgDetail = await API.orgInfoByOrgCode(org)
          orgsDetail.push({
            orgAbbr: orgDetail.org.orgName,
            orgCode: orgDetail.org.orgCode,
            mdmLevel: orgDetail.org.mdmLevel
          })
          /* node.push({
            orgName: orgDetail.org.orgName,
            orgCode: orgDetail.org.orgCode
          }) */
          len++
          if (len === orgList.length) {
            let tempNode = this.getNodes(orgsDetail)
            params = {
              node: tempNode,
              max: 500
            }
            this.personDialogVisible = true
            params.roleType = roleType
            params.users = this.teamInfoForm[`${this.roleType}List`]
            this.$refs.selectPerson.refreshTree(params)
          }
        })
        /* params = {
          node: [{
            orgName: '中国移动集团有限公司',
            orgCode: '00000000000000000000'
          }],
          max: 500
        } */
      } else if (roleType === 'observer') {
        //从全集团选择，200人上限
        params = {
          node: [{
            orgName: '中国移动集团有限公司',
            orgAbbr: '中国移动集团有限公司',
            orgCode: '00000000000000000000'
          }],
          max: 200
        }
      } else if (roleType === 'expert') {
        if (this.leadResponsibleDept === '') {
          this.$message({
            type: 'warning',
            message: '请先选择牵头承担部门并及时保存属性信息的修改！',
            showClose: true
          })
          return
        }
        //从公司内（57家一级单位）选择
        let node = []
        let orgDetail = await API.orgInfoByOrgCode(this.leadResponsibleDept)
        let companyOrgCode = await API.getOrgCodeByCompanyCode({ companyCode: orgDetail.org.companyCode })
        node.push({
          orgName: orgDetail.org.companyName,
          orgAbbr: orgDetail.org.companyName,
          orgCode: companyOrgCode
        })
        params = {
          node: node,
          max: 50
        }
      }
      if (roleType !== 'member') {
        this.personDialogVisible = true
        params.roleType = roleType
        params.users = this.teamInfoForm[`${this.roleType}List`]
        this.$refs.selectPerson.refreshTree(params)
      }
    },
    //找出父与子组织的关系，去除子组织
    getNodes (receiveOrgs) {
      let orgs = JSON.parse(JSON.stringify(receiveOrgs))
      let levels = []
      let nodes = []
      orgs.forEach(org => {
        if (levels.indexOf(org.mdmLevel) === -1) {
          levels.push(org.mdmLevel)
        }
      })
      let hasRoot = levels.some(l => l === '0')
      if (hasRoot) {
        let mdmOrgs = orgs.filter(o => o.mdmLevel === '0')
        nodes = JSON.parse(JSON.stringify(mdmOrgs))
      } else {
        for (let i = 1; i < 6; i++) {
          let hasLevel = levels.some(l => parseInt(l) === i)
          if (hasLevel) {
            let curLevel = i + ''
            let mdmOrgs = orgs.filter(o => o.mdmLevel === curLevel)
            let other = orgs.filter(o => o.mdmLevel !== curLevel) //其他mdm级别组织
            let len = parseInt(curLevel) * 4
            let delOrgs = []
            other.forEach((item, index) => {
              let code = item.orgCode.slice(0, len) //对比组织编码前面的几位mdmLevel*4
              mdmOrgs.forEach(item1 => {
                if (item1.orgCode.slice(0, len) === code) {
                  delOrgs.push(item) //找出与当前前几位相同的组织
                }
              })
            })
            //通过组织编码找出对应删除项的索引
            let delIndexs = []
            delOrgs.forEach((ele, index) => {
              orgs.some((ele1, index) => {
                if (ele1.orgCode === ele.orgCode) {
                  delIndexs.push(index)
                  return true
                }
              })
            })
            //倒序删除
            for (let i = delIndexs.length - 1; i >= 0; i--) {
              orgs.splice(delIndexs[i], 1)
            }
          }
        }
        nodes = JSON.parse(JSON.stringify(orgs))
      }
      return nodes
    },
    getParentOrgByMdm (level) {
      let l = parseInt(level)
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
    confirmSelect () {
      let sected = this.$refs['personTable'].getSeclectedPerson()
      let newList = this.teamInfoForm[`${this.roleType}List`].concat(sected)
      if (!this.judgeNum(newList, true)) {
        this.teamInfoForm[`${this.roleType}List`] = newList
        if (this.roleType === 'manage') this.isChangeManage = true
        if (this.roleType === 'member') this.isChangeMember = true
      }
      this.personDialogClosed()
    },
    deletePerson (index, roleType) {
      if (!this.isEditable) {
        this.focusIn()
        if (!this.isTempSave.teamInfo) {
          let keys = Object.keys(this.isTempSave)
          let only = true //只要当前区块未保存时
          keys.some(key => {
            if (!this.isTempSave[key] && key !== 'teamInfo') {
              only = false
              return true
            }
          })
          if (!only) return
        }
      }
      if (roleType === 'manage') this.isChangeManage = true
      if (roleType === 'member') this.isChangeMember = true
      if (index > -1) {
        this.teamInfoForm[`${roleType}List`].splice(index, 1)
        this.changeInfo()
      }
      this.changeValue()
    },
    getSubmitData (role, list) {
      let valueCode = ''
      this.roleList.some(ele => {
        if (ele.selfName === role) {
          valueCode = ele.valueCode
        }
      })
      let arr = []
      if (role === 'manage' && this.hasManager) {
        this.selManage.forEach(mm => {
          let tmp = {}
          tmp.projectCode = this.projectCode
          tmp.projectRoleCode = valueCode
          let flag = false
          flag = this.managerCfgs.some(m => {
            if (mm.uid === m.uid) {
              tmp.employeeNum = m.employeeCode
              tmp.userAccount = m.uid
              tmp.userName = m.chineseName
              tmp.organizationCode = m.orgCode
              tmp.companyCode = m.companyCode
              arr.push(tmp)
              return true
            }
          })
          if (!flag) {
            tmp.employeeNum = this.userInfo.userAuth.employeeNum
            tmp.userAccount = this.userInfo.userAuth.uid
            tmp.userName = this.userInfo.userAuth.chineseName
            tmp.organizationCode = this.userInfo.userAuth.orgCode
            tmp.companyCode = this.userInfo.userAuth.companyCode
            arr.push(tmp)
          }
        })
      } else if (role === 'expert' && this.hasExpert) {
        this.selExpert.forEach(mm => {
          let tmp = {}
          tmp.projectCode = this.projectCode
          tmp.projectRoleCode = valueCode

          this.expertCfgs.some(m => {
            if (mm.uid === m.uid) {
              tmp.employeeNum = m.employeeCode
              tmp.userAccount = m.uid
              tmp.userName = m.chineseName
              tmp.organizationCode = m.orgCode
              tmp.companyCode = m.companyCode
              arr.push(tmp)
            }
          })
        })
      } else {
        list.forEach(ele => {
          let tmp = {}
          tmp.projectCode = this.projectCode
          tmp.projectRoleCode = valueCode
          tmp.employeeNum = ele.employeeNum
          tmp.userAccount = ele.userAccount || ele.uid
          tmp.userName = ele.userName || ele.chineseName
          tmp.organizationCode = ele.orgCode
          tmp.companyCode = ele.companyCode
          arr.push(tmp)
        })
      }
      return arr
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
        API.saveProjectMember(params)
          .then(res => {
            if (res === 0) {
              this.$message({
                type: 'success',
                message: '团队信息保存成功',
                showClose: true
              })
            } else if (res === 2) {
              this.$message({
                message: '项目经理同时担任里程碑负责人、成果负责人，请同步修改',
                type: 'warning',
                showClose: true
              })
            } else if (res === 3) {
              this.$message({
                message: '该项目成员同时担任成果负责人，请同步修改',
                type: 'warning',
                showClose: true
              })
            } else {
              this.$message({
                type: 'success',
                message: '团队信息保存成功',
                showClose: true
              })
            }
            bus.$emit('changeManageList', true)
            this.$emit('saveTeamInfo', true)
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
    async analyzeData () {
      await this.getExpertList()
      await this.getManagerList()
      //清空默认
      this.teamInfoForm.manageList = []
      this.selManage = []
      this.receiveData.forEach(item => {
        this.roleList.some(role => {
          if (role.valueCode === item.projectRoleCode) {
            let tmp = {}
            tmp.employeeNum = item.employeeNum
            tmp.uid = item.uid || item.userAccount
            tmp.chineseName = item.chineseName || item.userName
            tmp.companyCode = item.companyCode
            tmp.orgCode = item.organizationCode || item.orgCode
            this.teamInfoForm[`${role.selfName}List`].push(tmp)

            if (role.valueCode === 'PR-MANAGER') {
              let inList = this.managerCfgs.some(user => user.uid === tmp.uid)
              // if (inList) {
              //   this.selManage.push(tmp.uid)
              // } else {
              //   this.selManage.push(tmp.chineseName)
              // }
              if (!inList) {
                this.selManage.push(tmp)
              }
            } else if (role.valueCode === 'PR-EXPERT') {
              this.selExpert.push(tmp)
            }
            return true
          }
        })
      })
      this.changeValue()
    },
    async validate () {
      return new Promise((resolve, reject) => {
        this.isChangeManage = true
        this.isChangeMember = true
        if (this.manageValidSuc && this.memberValidSuc) {
          let params = []
          params = params.concat(this.getSubmitData('manage', this.teamInfoForm.manageList))
          params = params.concat(this.getSubmitData('member', this.teamInfoForm.memberList))
          params = params.concat(this.getSubmitData('observer', this.teamInfoForm.observerList))
          params = params.concat(this.getSubmitData('expert', this.teamInfoForm.expertList))
          resolve(params)
        } else {
          resolve(false)
          return false
        }
      })
    },
    //清空
    clearSelected (key) {
      //配合承担部改变 -- 涉及 项目成员，清空
      if (key === 'cooperateResponsibleDept') {
        this.teamInfoForm.memberList = []
      }
      //牵头承担部改变 -- 涉及 项目经理、项目成员，清空
      if (key === 'leadResponsibleDept') {
        this.teamInfoForm.memberList = []
        this.teamInfoForm.expertList = []
        //新增页面并且项目经理尚未被删掉，不可以删除
        /* if (this.isAddPage && !this.isAddDelManage) {
          return
        } */
        this.teamInfoForm.manageList = []
      }
    },
    //获取项目经理清单
    getManagerList () {
      API.judgeManager()
        .then(hasManager => {
          if (hasManager) {
            this.hasManager = true
            API.projectManagersByOrgCode({
              orgCode: this.leadResponsibleDept
            })
              .then(res => {
                if (res && res.length) {
                  this.hasManager = true
                  res.forEach(item => {
                    item.uid = item.userId
                  })
                  this.managerCfgs = res
                  this.showManagerCfgs = this.managerCfgs
                } else {
                  this.managerCfgs = []
                  this.showManagerCfgs = []
                }
              })
              .catch(e => {
                if (e.selfError) return
                this.$message({
                  message: e.message || '获取项目经理配置失败',
                  type: 'error',
                  showClose: true
                })
              })
          } else {
            this.hasManager = false
            this.managerCfgs = []
            this.showManagerCfgs = []
          }
        })
        .catch(e => {
          this.hasManager = undefined
          if (e.selfError) return
          this.$message({
            message: e.message || '获取项目经理配置失败',
            type: 'error',
            showClose: true
          })
        })
    },
    //获取专家清单
    async getExpertList () {
      API.judgeExpert()
        .then(async hasExpert => {
          if (hasExpert) {
            this.hasExpert = true
            let orgDetail = await API.orgInfoByOrgCode(this.leadResponsibleDept)
            let companyOrgCode = await API.getOrgCodeByCompanyCode({ companyCode: orgDetail.org.companyCode })
            API.projectExpertByOrgCode({
              orgCode: companyOrgCode
            })
              .then(res => {
                if (res && res.length) {
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
    //有信息发生修改
    changeInfo () {
      this.$emit('changeValue')
    },
    //传给子项目做联动
    changeValue () {
      // console.log('人员发生了变更')
      this.$nextTick(() => {
        let data = [...this.teamInfoForm.manageList, ...this.teamInfoForm.memberList]
        data = this.changeOptions(data)
        // let dataMilestone = [...this.teamInfoForm.manageList]
        bus.$emit('changeTeamInfo', JSON.parse(JSON.stringify(data)))
        bus.$emit('changeTeamInfoMilestone', JSON.parse(JSON.stringify(data)))
      })
    },
    // 去重
    changeOptions (arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 1; j < arr.length; j++) {
          if (i !== j) {
            if (arr[i].chineseName === arr[j].chineseName && arr[i].uid === arr[j].uid) {
              arr.splice(j, 1)
            }
          }
        }
      }
      return arr
    },
    //准备修改某字段
    focusIn () {
      this.$emit('focusFormItem')
    },
    setDefaultManage () {
      this.selManage = [{
        chineseName: this.userInfo.userAuth.chineseName,
        employeeNum: this.userInfo.userAuth.employeeNum,
        uid: this.userInfo.userAuth.uid
      }]
      this.teamInfoForm.manageList = [{
        chineseName: this.userInfo.userAuth.chineseName,
        employeeNum: this.userInfo.userAuth.employeeNum,
        uid: this.userInfo.userAuth.uid
      }]
    }
  },
  mounted () {
    this.teamInfoForm.manageList = [{
      chineseName: this.userInfo.userAuth.chineseName,
      employeeNum: this.userInfo.userAuth.employeeNum,
      uid: this.userInfo.userAuth.uid,
      companyCode: this.userInfo.userAuth.companyCode,
      orgCode: this.userInfo.userAuth.orgCode
    }]
    this.selManage = [{
      chineseName: this.userInfo.userAuth.chineseName,
      employeeNum: this.userInfo.userAuth.employeeNum,
      uid: this.userInfo.userAuth.uid,
      companyCode: this.userInfo.userAuth.companyCode,
      orgCode: this.userInfo.userAuth.orgCode
    }]
  },
  created () {
    API.dictValByCode('PROJECT-ROLE')
      .then(res => {
        this.roleList.forEach(ele => {
          res.some(item => {
            if (item.name === ele.name) {
              ele.valueCode = item.valueCode
              ele.id = item.id
              return true
            }
          })
        })
      })
      .catch(e => {
        if (e.selfError) return
        if (e.message) {
          this.$message({
            message: e.message || '数据字典获取失败！',
            type: 'error',
            showClose: true
          })
        }
      })
  }
}
</script>
<style lang="scss" scoped>
.team-info{
  margin-top: 20px;
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
      justify-content: space-between;
      align-items: center;
      &.error{
        border: 1px solid red;
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
            background: none !important;
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

  .manager-select{
    width: 100%;

    /deep/ .el-input__inner{
      width: 100%;
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
