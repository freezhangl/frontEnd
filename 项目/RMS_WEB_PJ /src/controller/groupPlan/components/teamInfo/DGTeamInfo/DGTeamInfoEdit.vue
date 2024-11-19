<template>
  <div class="DGTeamInfoEdit">
    <project-panel title="团队信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" @click="tempSave">保存本区块信息</el-button>
      </template>
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-position='right'
        ref="ruleForm"
        label-width="90px">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="需求单位:"
              prop="demandUnit">
              <el-tooltip
                effect="dark"
                :content="ruleForm.demandUnit.organizationName"
                placement="top-start"
                size="small"
                :disabled="!ruleForm.demandUnit.organizationName">
                <el-select
                  v-model="ruleForm.demandUnit.organizationCode"
                  placeholder="请选择"
                  @change="changeDemandUnit"
                  :disabled="unitDisabled||meberEditFlag">
                  <el-option
                    v-for="item in demandUnitOptions"
                    :key="item.id"
                    :label="item.organizationName"
                    :value="item.organizationCode"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="项目经理:"
              prop="demandManager">
              <!-- <el-select
                v-model="ruleForm.demandManager"
                multiple
                value-key="userAccount"
                filterable
                remote
                :remote-method="userNameLike => {getUserList(ruleForm.demandUnit.organizationCode, 'demand', userNameLike)}"
                placeholder="请选择"
                clearable
                @clear="getUserList(ruleForm.demandUnit.organizationCode, 'demand')">
                <el-option
                  v-for="item in demandManagerOptions"
                  :key="item.userAccount"
                  :label="item.userName"
                  :value="item.userAccount"
                  :disabled="item.disabled"
                  clearable
                >
                  <span>{{ item.userName}}/{{item.userAccount }}</span>
                </el-option>
              </el-select> -->
              <div class="row-item" :class="{'error':demandManagerValidSuc}">
                <div :class="{'disabled':meberEditFlag}" v-if='meberEditFlag'></div>
                <div class="tag-wrapper">
                  <template v-if="ruleForm.demandManager.length">
                    <el-tag
                      v-for="(item,index) in ruleForm.demandManager"
                      :key="item.userAccount"
                      closable
                      @close="deletePerson(index,'demandManager')">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.userAccount"
                        placement="top-start"
                        size="small">
                        <span> {{ item.userName }}</span>
                      </el-tooltip>
                    </el-tag>
                  </template>
                  <span v-else class="placeholder">请选择</span>
                </div>
                <span class="add-icon svgfont-adduser" @click="addPerson('demandManager')"></span>
              </div>
              <!-- <SpAdvancedSelect
                :data.sync="ruleForm.demandManager"
                :list="demandManagerOptions"
                key-id="userAccount"
                is-more-type="even"
                value-txt="userAccount"
                label-txt="userName"
                placeholder="请选择"
                :clearable="true"
                filterable
                remote
                :remote-method="userNameLike => {getUserList(ruleForm.demandUnit.organizationCode, 'demand', userNameLike)}"
              ></SpAdvancedSelect> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="项目成员:"
              prop="demandMember">
              <div class="row-item" :class="{'error':dProjectMemberValidSuc}">
                <div class="tag-wrapper">
                  <template v-if="ruleForm.demandMember.length">
                    <el-tag
                      v-for="(item,index) in ruleForm.demandMember"
                      :key="item.userAccount"
                      closable
                      @close="deletePerson(index,'demandMember')">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.userAccount"
                        placement="top-start"
                        size="small">
                        <span> {{ item.userName }}</span>
                      </el-tooltip>
                    </el-tag>
                  </template>
                  <span v-else class="placeholder">请选择</span>
                </div>
                <span class="add-icon svgfont-adduser" @click="addPerson('demandMember')"></span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="承担单位:"
              prop="undertakerUnit">
              <el-tooltip
                effect="dark"
                :content="ruleForm.undertakerUnit.organizationName"
                placement="top-start"
                size="small"
                :disabled="!ruleForm.undertakerUnit.organizationName">
                <el-select
                  v-model="ruleForm.undertakerUnit.organizationCode"
                  placeholder="请选择"
                  @change="changeUndertakeUnit"
                  :disabled="unitDisabled||meberEditFlag">
                  <el-option
                    v-for="item in undertakerUnitOptions"
                    :key="item.id"
                    :label="item.organizationName"
                    :value="item.organizationCode"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="项目经理:"
              prop="undertakeManager">
              <!-- <el-select
                v-model="ruleForm.undertakeManager"
                multiple
                value-key="userAccount"
                filterable
                remote
                :remote-method="userNameLike => {getUserList(ruleForm.undertakerUnit.organizationCode, 'undertaker', userNameLike)}"
                placeholder="请选择"
                clearable
                @clear="getUserList(ruleForm.undertakerUnit.organizationCode, 'undertaker')">
                <el-option
                  v-for="item in undertakerManagerOptions"
                  :key="item.userAccount"
                  :label="item.userName"
                  :value="item.userAccount"
                  :disabled="item.disabled"
                >
                  <span>{{ item.userName}}/{{item.userAccount }}</span></el-option>
              </el-select> -->
              <div class="row-item" :class="{'error':undertakeManagerValidSuc}">
                <div :class="{'disabled':meberEditFlag}" v-if='meberEditFlag'></div>
                <div class="tag-wrapper">
                  <template v-if="ruleForm.undertakeManager.length">
                    <el-tag
                      v-for="(item,index) in ruleForm.undertakeManager"
                      :key="item.userAccount"
                      closable
                      @close="deletePerson(index,'undertakeManager')">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.userAccount"
                        placement="top-start"
                        size="small">
                        <span> {{ item.userName }}</span>
                      </el-tooltip>
                    </el-tag>
                  </template>
                  <span v-else class="placeholder">请选择</span>
                </div>
                <span class="add-icon svgfont-adduser" @click="addPerson('undertakeManager')"></span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="项目成员:"
              prop="undertakeMember">
              <div class="row-item" :class="{'error':undertakeMemberValidSuc}">
                <div class="tag-wrapper">
                  <template v-if="ruleForm.undertakeMember.length">
                    <el-tag
                      v-for="(item,index) in ruleForm.undertakeMember"
                      :key="item.userAccount"
                      closable
                      @close="deletePerson(index,'undertakeMember')">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.userAccount"
                        placement="top-start"
                        size="small">
                        <span> {{ item.userName }}</span>
                      </el-tooltip>
                    </el-tag>
                  </template>
                  <span v-else class="placeholder">请选择</span>
                </div>
                <span class="add-icon svgfont-adduser" @click="addPerson('undertakeMember')"></span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </project-panel>
    <person-select
      :show.sync="personDialogVisible"
      @selected="selectedPersions"
      @judgeMember="judgeMember"
      :judge="judge"
      ref="selectPerson"></person-select>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import personSelect from '../components/personSelect'
import API from '@/serve/API_groupPlanProject'
import bus from '@/common/bus'
export default {
  components: { projectPanel, personSelect },
  data () {
    let validDemandUnit = (rule, value, callback) => {
      if (value && JSON.stringify(value) !== '{}' && value.organizationCode) {
        callback()
      } else {
        callback(new Error('请选择需求单位'))
      }
    }
    let validUndertakerUnit = (rule, value, callback) => {
      if (value && JSON.stringify(value) !== '{}' && value.organizationCode) {
        callback()
      } else {
        callback(new Error('请选择承担单位'))
      }
    }
    return {
      meberEditFlag: false,
      judge: '',
      ruleForm: {
        demandUnit: { organizationCode: '', organizationName: '' }, //需求单位
        demandManager: [], //需求单位项目经理
        demandMember: [], //需求单位项目成员
        undertakerUnit: { organizationCode: '', organizationName: '' }, //承担单位
        undertakeManager: [], //承担单位项目经理
        undertakeMember: [] //承担单位项目成员
      },
      rules: {
        demandUnit: [{ validator: validDemandUnit, required: true, message: '请选择需求单位', trigger: ['change', 'blur'] }],
        demandManager: [{ required: true, message: '请选择需求单位项目经理', trigger: ['change', 'blur'] }],
        // demandMember: [{ required: true, message: '请选择需求单位项目成员', trigger: ['change', 'blur'] }],
        undertakerUnit: [{ validator: validUndertakerUnit, required: true, message: '请选择承担单位', trigger: ['change', 'blur'] }],
        undertakeManager: [{ required: true, message: '请选择承担单位项目经理', trigger: ['change', 'blur'] }]
        // undertakeMember: [{ required: true, message: '请选择承担单位项目成员', trigger: ['change', 'blur'] }]
      },
      demandUnitOptions: [], //需求单位 options
      demandManagerOptions: [], //需求单位项目经理 options
      undertakerUnitOptions: [], //承担单位 options
      undertakerManagerOptions: [], //承担单位项目经理 options
      personDialogVisible: false,
      dProjectMemberValidSuc: false,
      undertakeMemberValidSuc: false,
      demandManagerValidSuc: false,
      undertakeManagerValidSuc: false,
      unitDisabled: false, //是否可以修改需求单位或承担单位
      subprojectInfo: {
        leadDemandUnitList: [], //牵头需求单位
        leadDemandManagerList: [], //牵头需求单位项目经理
        leadUndertakeUnitList: [], //牵头承担单位
        leadUndertakeManagerList: [], //牵头承担单位项目经理
        achDemandUnitList: [], //需求单位
        achUndertakeUnitList: [], //承担单位
        achDemandResponsibleList: [], //成果需求人
        achUndertakeResponsibleList: [] //成果负责人
      }, //子项目信息
      msgMap: {
        leadDemandUnitList: '子项目牵头需求单位',
        leadDemandManagerList: '子项目牵头需求单位经理',
        leadUndertakeUnitList: '子项目牵头承担单位',
        leadUndertakeManagerList: '子项目牵头承担单位经理',
        achDemandUnitList: '成果需求单位',
        achUndertakeUnitList: '成果承担单位',
        achDemandResponsibleList: '成果需求人',
        achUndertakeResponsibleList: '成果负责人'
      },
      language: '团队信息中所有可编辑字段都是基线字段；',
      checkData: [
        {
          label: 'leaderDemandUnit',
          value: '需求单位'
        }, {
          label: 'leaderDemandManager',
          value: '需求单位项目经理'
        }, {
          label: 'leaderDemandMember',
          value: '需求单位项目成员'
        }, {
          label: 'leaderUndertakeUnit',
          value: '承担单位'
        }, {
          label: 'leaderUndertakeManager',
          value: '承担单位项目经理'
        }, {
          label: 'leaderUndertakeMember',
          value: '承担单位项目成员'
        }],
      allSubProUnit: [] //所有子项目和成果中关联的单位
    }
  },
  props: {
    projectCompanyList: {
      type: Array,
      default: () => []
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
    projectCompanyList (newValue, oldValue) {
      if (newValue && newValue.length) {
        let tempList = JSON.parse(JSON.stringify(newValue))
        tempList.forEach(element => {
          // element.type 需求方1，承担方2，联合攻关单位3
          if (element.type === '1') { //需求单位
            this.ruleForm.demandUnit = element
            element.projectTeamList.forEach(item => {
              if (item.projectRoleCode === 'PR-LEADER-DEMAND-MANAGER') { //牵头-需求-项目经理
                this.ruleForm.demandManager.push(item)
              } else if (item.projectRoleCode === 'PR-LEADER-DEMAND-MEMBER') { //牵头-需求-项目成员
                this.ruleForm.demandMember.push(item)
              }
            })
          } else if (element.type === '2') { //承担单位
            this.ruleForm.undertakerUnit = element
            element.projectTeamList.forEach(item => {
              if (item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MANAGER') { //牵头-承担-项目经理
                this.ruleForm.undertakeManager.push(item)
              } else if (item.projectRoleCode === 'PR-LEADER-UNDERTAKER-MEMBER') { //牵头-承担-项目成员
                this.ruleForm.undertakeMember.push(item)
              }
            })
          }
        })
        this.changeValue(true)
      }
    }
  },
  created () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
    this.getEmployerUndertaker('1')//需求方单位清单
    this.getEmployerUndertaker('2')//承担方单位清单
    this.addEventListener()
  },
  methods: {
    async addPerson (roleType) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      let params = {}
      params = {
        node: [{
          orgName: '中国移动集团有限公司',
          orgCode: '00000000000000000000',
          orgAbbr: '中国移动集团有限公司'
        }],
        users: [],
        max: 500
      }
      switch (roleType) {
        case 'demandManager'://需求单位项目经理
          if (this.ruleForm.demandUnit.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择需求单位！',
              showClose: true
            })
            return
          }
          this.judge = 'demand'
          params = {
            node: [this.getOrgNode('demand')],
            users: this.ruleForm.demandManager,
            disabledUser: this.ruleForm.demandMember,
            max: 1
          }
          break
        case 'demandMember'://需求单位项目成员
          if (this.ruleForm.demandUnit.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择需求单位！',
              showClose: true
            })
            return
          }
          this.judge = 'demand'
          params = {
            node: [this.getOrgNode('demand')],
            users: this.ruleForm.demandMember,
            disabledUser: this.ruleForm.demandManager
          }
          break
        case 'undertakeManager'://需求单位项目经理
          if (this.ruleForm.undertakerUnit.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择承担单位！',
              showClose: true
            })
            return
          }
          this.judge = 'undertake'
          params = {
            node: [this.getOrgNode('undertaker')],
            users: this.ruleForm.undertakeManager,
            disabledUser: this.ruleForm.undertakeMember,
            max: 1
          }
          break
        case 'undertakeMember': //承担单位项目成员
          if (this.ruleForm.undertakerUnit.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择承担单位！',
              showClose: true
            })
            return
          }
          this.judge = 'undertake'
          params = {
            node: [this.getOrgNode('undertaker')],
            users: this.ruleForm.undertakeMember,
            disabledUser: this.ruleForm.undertakeManager
          }
          break
      }
      params.roleType = roleType
      params.users.forEach(ele => {
        ele.uid = ele.userAccount
        ele.chineseName = ele.userName
      })
      this.personDialogVisible = true
      this.$refs.selectPerson.refreshTree(params)
    },
    //获取人员选择组件根节点的信息
    getOrgNode (unitType) {
      let orgInfo = { orgCode: '', orgName: '' }
      let options = []
      if (unitType === 'demand') {
        orgInfo.orgCode = this.ruleForm.demandUnit.organizationCode
        options = this.demandUnitOptions
      } else {
        orgInfo.orgCode = this.ruleForm.undertakerUnit.organizationCode
        options = this.undertakerUnitOptions
      }
      options.some(ele => {
        if (ele.organizationCode === orgInfo.orgCode) {
          orgInfo.orgName = ele.organizationName
          orgInfo.orgAbbr = ele.organizationName
          return true
        }
      })
      return orgInfo
    },
    async deletePerson (index, roleType) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (index > -1) {
        let params = {
          projectCode: this.$route.params.projectCode,
          userAccount: ''
        }
        let isChanged = false
        switch (roleType) {
          case 'demandManager': //需求单位项目经理
            params.userAccount = this.ruleForm.demandManager[index].userAccount
            params.type = '1'
            try {
              let canDel = await API.canRemoveProjectTeam(params)
              if (!canDel) return
              isChanged = true
              this.ruleForm.demandManager.splice(index, 1)
              this.validateDemandManager()
            } catch (error) {
              if (error.selfError) return
              if (error.message) {
                this.$message({
                  message: error.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            }
            break
          case 'demandMember': //需求单位项目成员
            params.userAccount = this.ruleForm.demandMember[index].userAccount
            params.type = '1'
            try {
              let canDel = await API.canRemoveProjectTeam(params)
              if (!canDel) return
              isChanged = true
              this.ruleForm.demandMember.splice(index, 1)
              this.validateDemandMember()
            } catch (error) {
              if (error.selfError) return
              if (error.message) {
                this.$message({
                  message: error.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            }
            break
          case 'undertakeManager': //承担单位项目经理
            params.userAccount = this.ruleForm.undertakeManager[index].userAccount
            params.type = '2'
            try {
              let canDel = await API.canRemoveProjectTeam(params)
              if (!canDel) return
              isChanged = true
              this.ruleForm.undertakeManager.splice(index, 1)
              this.validateUndertakeManager()
            } catch (error) {
              if (error.selfError) return
              if (error.message) {
                this.$message({
                  message: error.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            }
            break
          case 'undertakeMember': //承担单位项目成员
            params.userAccount = this.ruleForm.undertakeMember[index].userAccount
            params.type = '2'
            try {
              let canDel = await API.canRemoveProjectTeam(params)
              if (!canDel) return
              isChanged = true
              this.ruleForm.undertakeMember.splice(index, 1)
              this.validateUndertakeMember()
            } catch (error) {
              if (error.selfError) return
              if (error.message) {
                this.$message({
                  message: error.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            }
            break
        }
        this.changeValue(!isChanged)
      }
    },
    judgeMember (userAccount, unitType) {
      let flag1 = false
      let flag2 = false
      let flag3 = false
      let flag4 = false
      flag1 = this.subprojectInfo.leadDemandManagerList.some(e => e === userAccount)
      flag2 = this.subprojectInfo.achDemandResponsibleList.some(e => e === userAccount)
      flag3 = this.subprojectInfo.leadUndertakeManagerList.some(e => e === userAccount)
      flag4 = this.subprojectInfo.achUndertakeResponsibleList.some(e => e === userAccount)
      if (flag1 && unitType === 'demand') {
        this.showMessage('leadDemandManagerList')
        return true
      }
      if (flag2 && unitType === 'demand') {
        this.showMessage('achDemandResponsibleList')
        return true
      }
      if (flag3 && unitType === 'undertake') {
        this.showMessage('leadUndertakeManagerList')
        return true
      }
      if (flag4 && unitType === 'undertake') {
        this.showMessage('achUndertakeResponsibleList')
        return true
      }
      return false
    },
    showMessage (role) {
      this.$message({
        message: `该成员为${this.msgMap[role]}，不能删除！`,
        type: 'warning',
        showClose: true
      })
    },
    selectedPersions (persons) {
      let users = []
      let roleCode = ''
      switch (persons.roleType) {
        case 'demandManager':
          roleCode = 'PR-LEADER-DEMAND-MANAGER'
          break
        case 'demandMember':
          roleCode = 'PR-LEADER-DEMAND-MEMBER'
          break
        case 'undertakeManager':
          roleCode = 'PR-LEADER-UNDERTAKER-MANAGER'
          break
        case 'undertakeMember':
          roleCode = 'PR-LEADER-UNDERTAKER-MEMBER'
          break
      }
      persons.users.forEach(user => {
        users.push({
          uid: user.uid,
          chineseName: user.chineseName,
          organizationCode: user.orgCode || user.organizationCode,
          companyCode: user.companyCode,
          userName: user.chineseName,
          employeeNum: user.employeeNum,
          userAccount: user.uid,
          projectRoleCode: roleCode
        })
      })
      switch (persons.roleType) {
        case 'demandManager':
          this.ruleForm.demandManager = users
          this.validateDemandManager()
          break
        case 'demandMember':
          this.ruleForm.demandMember = users
          this.validateDemandMember()
          break
        case 'undertakeManager':
          this.ruleForm.undertakeManager = users
          this.validateUndertakeManager()
          break
        case 'undertakeMember':
          this.ruleForm.undertakeMember = users
          this.validateUndertakeMember()
          break
      }
      this.changeValue()
    },
    tempSave () { //暂存
      this.validateDemandManager()
      this.validateDemandMember()
      this.validateUndertakeManager()
      this.validateUndertakeMember()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = this.getSubmitData()
          API.editProjectTeamD(params)
            .then(res => {
              this.$message({
                type: 'success',
                message: '团队信息保存成功',
                showClose: true
              })
              this.changeInfo(false)
              this.$emit('saveTeamInfo', true)
              this.changeValue(true)//暂存团队信息之后传给子项目更新项目经理列表
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '团队信息保存失败！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        }
      })
    },
    getSubmitData () {
      let params = {
        projectCode: this.$route.params.projectCode,
        projectCompanyList: []
      }
      let demand = {
        organizationCode: this.ruleForm.demandUnit.organizationCode,
        organizationName: this.ruleForm.demandUnit.organizationName,
        companyCode: this.ruleForm.demandUnit.companyCode,
        companyName: this.ruleForm.demandUnit.companyName,
        type: '1', // 需求方1，承担方2，联合攻关单位3
        leaderFlag: '1', //牵头1，配合0
        projectTeamList: [...this.ruleForm.demandManager, ...this.ruleForm.demandMember] //人员
      }
      let undertake = {
        organizationCode: this.ruleForm.undertakerUnit.organizationCode,
        organizationName: this.ruleForm.undertakerUnit.organizationName,
        companyCode: this.ruleForm.undertakerUnit.companyCode,
        companyName: this.ruleForm.undertakerUnit.companyName,
        type: '2', // 需求方1，承担方2，联合攻关单位3
        leaderFlag: '1', //牵头1，配合0
        projectTeamList: [...this.ruleForm.undertakeManager, ...this.ruleForm.undertakeMember] //人员
      }
      params.projectCompanyList = [demand, undertake]
      return params
    },
    async validate () {
      return new Promise((resolve, reject) => {
        this.validateDemandManager()
        this.validateDemandMember()
        this.validateUndertakeManager()
        this.validateUndertakeMember()
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = this.getSubmitData()
            resolve(params)
          } else {
            resolve(false)
            return false
          }
        })
      })
    },
    validateUndertakeManager () { //校验承担单位项目经理
      this.$refs.ruleForm.validateField('undertakeManager', (error) => {
        if (error !== '') {
          this.undertakeManagerValidSuc = true
        } else {
          this.undertakeManagerValidSuc = false
        }
      })
    },
    validateUndertakeMember () { //单独校验承担单位项目成员 -- 非必填，不校验
      /* this.$refs.ruleForm.validateField('undertakeMember', (error) => {
        if (error !== '') {
          this.undertakeMemberValidSuc = true
        } else {
          this.undertakeMemberValidSuc = false
        }
      }) */
    },
    validateDemandManager () { //校验需求单位项目经理
      this.$refs.ruleForm.validateField('demandManager', (error) => {
        if (error !== '') {
          this.demandManagerValidSuc = true
        } else {
          this.demandManagerValidSuc = false
        }
      })
    },
    validateDemandMember () { //单独校验需求单位项目成员 -- 非必填，不校验
      /* this.$refs.ruleForm.validateField('demandMember', (error) => {
        if (error !== '') {
          this.dProjectMemberValidSuc = true
        } else {
          this.dProjectMemberValidSuc = false
        }
      }) */
    },
    //获取需求方和承担方清单
    getEmployerUndertaker (orgType) {
      API.getEmployerUndertaker({ orgType: orgType })
        .then(res => {
          if (res) {
            let companyList = []
            res.forEach(ele => {
              let company = {
                id: ele.id,
                organizationCode: ele.orgCode,
                organizationName: ele.orgName,
                companyCode: ele.companyCode,
                companyName: ele.companyName,
                disabled: false
              }
              companyList.push(company)
            })
            if (orgType === '1') { //需求方
              this.demandUnitOptions = JSON.parse(JSON.stringify(companyList))
            } else if (orgType === '2') { //承担方
              this.undertakerUnitOptions = JSON.parse(JSON.stringify(companyList))
            }
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取需求方承担方清单失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //需求单位变化
    changeDemandUnit (val) {
      this.ruleForm.demandManager = []
      this.ruleForm.demandMember = []
      this.validateDemandManager()
      this.validateDemandMember()
      if (val) {
        this.demandUnitOptions.some(ele => {
          if (ele.organizationCode === val) {
            this.ruleForm.demandUnit.organizationName = ele.organizationName
            this.ruleForm.demandUnit.companyCode = ele.companyCode
            this.ruleForm.demandUnit.companyName = ele.companyName
            return true
          }
        })
      }
      this.changeValue()
    },
    //承担单位变化
    changeUndertakeUnit (val) {
      this.ruleForm.undertakeManager = []
      this.ruleForm.undertakeMember = []
      this.validateUndertakeManager()
      this.validateUndertakeMember()
      if (val) {
        this.undertakerUnitOptions.some(ele => {
          if (ele.organizationCode === val) {
            this.ruleForm.undertakerUnit.organizationName = ele.organizationName
            this.ruleForm.undertakerUnit.companyCode = ele.companyCode
            this.ruleForm.undertakerUnit.companyName = ele.companyName
            return true
          }
        })
      }
      this.changeValue()
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
        let data = this.getSubmitData()
        bus.$emit('changeTeamInfo', data)
      })
    },
    addEventListener () {
      bus.$on('updateSubprojectNum', data => {
        //只有在没有子项目的时候才可以修改需求单位或者承担单位
        this.unitDisabled = data > 0
      })
      /* bus.$on('updateSubprojectInfo', data => {
        this.subprojectInfo = data
      }) */
    }
  }
}
</script>
<style lang="scss" scoped>
.DGTeamInfoEdit /deep/{
  .project-panel{
    margin-bottom: 0;
  }
  .project-panel .panel-body{
    margin-bottom: 0;
  }
    .row-item{
     box-sizing: border-box;
     margin-top: 3px;
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
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
}
</style>
