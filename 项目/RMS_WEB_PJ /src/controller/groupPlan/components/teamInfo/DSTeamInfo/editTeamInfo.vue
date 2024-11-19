<template>
  <div>
    <project-panel
      :title="`${unitTypeName}单位`"
      :show-expand='false'
      class="addcon"
      :tip="coopName ? '' : '注：战略项目联合攻关单位不超过10个，重点项目联合攻关单位不超过5个'">
      <template v-slot:header>
        <el-button
          v-if='!meberEditFlag'
          class="normal-btn"
          @click="addCoopUnit"
          icon="el-icon-circle-plus-outline"
        >添加{{coopName}}{{unitTypeName}}单位</el-button>
      </template>
      <el-form
        v-if="coopName"
        :model="selfLeadForm"
        :rules="leadFormRules"
        label-position='right'
        ref="selfLeadForm"
        label-width="100px">
        <el-row>
          <el-col :span="7">
            <el-form-item
              label-width="110px"
              :label="`牵头${unitTypeName}单位:`"
              prop="organizationCode">
              <el-tooltip
                effect="dark"
                :content="selfLeadForm.organizationName"
                placement="top-start"
                size="small"
                :disabled="!selfLeadForm.organizationName">
                <el-select
                  v-model="selfLeadForm.organizationCode"
                  placeholder="请选择"
                  @change="changeLeadUnit"
                  :disabled="selfLeadForm.unitDisabled||meberEditFlag">
                  <el-option
                    v-for="item in leadUnitOptions"
                    :key="item.id"
                    :label="item.organizationName"
                    :value="item.organizationCode"
                    :disabled="item.disabled">
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      :content="item.organizationName"
                      :disabled="!showToolTip(item.organizationName, 180)">
                      <span>{{item.organizationName}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="项目经理:"
              prop="leadManager">
              <div class="row-item" :class="{'error':!leadManagerValidSuc}">
                <div :class="{'disabled':meberEditFlag}" v-if='meberEditFlag'></div>
                <div class="tag-wrapper">
                  <template v-if="selfLeadForm.leadManager.userAccount">
                    <el-tag
                      closable
                      @close="deletePerson(0,'leadManager')">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="selfLeadForm.leadManager.userAccount"
                        placement="top-start"
                        size="small">
                        <span> {{ selfLeadForm.leadManager.userName }}</span>
                      </el-tooltip>
                    </el-tag>
                  </template>
                  <span v-else class="placeholder">请选择</span>
                </div>
                <span class="add-icon svgfont-adduser" @click="addPerson('leadManager')"></span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label-width="110px"
              label="项目成员:"
              prop="leadMembers">
              <div class="row-item" :class="{'error':!leadMemberValidSuc}">
                <div class="tag-wrapper">
                  <template v-if="selfLeadForm.leadMembers.length">
                    <el-tag
                      v-for="(item,index) in selfLeadForm.leadMembers"
                      :key="item.userAccount"
                      closable
                      @close="deletePerson(index,'leadMembers')">
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
                <span class="add-icon svgfont-adduser" @click="addPerson('leadMembers')"></span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        class="tableForm"
        ref="selfCoopForm"
        :model="selfCoopForm"
        :inline="true">
        <el-table :data="selfCoopForm.tableData" style="width: 100%" :border="false">
          <el-table-column
            type="index"
            label="序号"
            align="left"
            width="60px"
            :index="setIndexMethod">
          </el-table-column>
          <el-table-column
            align="left"
            prop="coopOrgCode"
            minwidth="150">
            <template slot="header">
              <div class="required">
                <span v-if="coopName">{{coopName}}{{unitTypeName}}单位</span>
                <span v-else>单位名称</span>
              </div>
            </template>
            <template slot-scope="scope">
              <p v-if="scope.row.state==='detail'">{{scope.row.organizationName}}</p>
              <el-form-item
                :prop="'coopOrgCode'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0"
                :rules="setRules('organizationCode',scope.row.id)">
                <el-tooltip
                  effect="dark"
                  :content="scope.row.organizationName"
                  placement="top-start"
                  size="small"
                  :disabled="!scope.row.organizationName">
                  <el-select
                    v-model="scope.row.organizationCode"
                    placeholder="请选择"
                    clearable
                    @change="changeCoopUnit($event,scope.$index)"
                    :disabled="scope.row.unitDisabled||meberEditFlag">
                    <el-option
                      v-for="item in scope.row.unitOptions"
                      :key="item.id"
                      :label="item.organizationName"
                      :value="item.organizationCode"
                      :disabled="item.disabled">
                      <el-tooltip
                        effect="dark"
                        placement="bottom-start"
                        :content="item.organizationName"
                        :disabled="!showToolTip(item.organizationName, 180)">
                        <span>{{item.organizationName}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            v-if="coopName"
            align="left"
            prop="coopManager"
            min-width="150">
            <template slot="header">
              <div class="required">
                <span>项目经理</span>
              </div>
            </template>
            <template slot-scope="scope">
              <p v-if="scope.row.state==='detail'">
                <el-tooltip
                  effect="dark"
                  :content="scope.row.manager&&scope.row.manager.userAccount"
                  placement="top-start"
                  size="small"><span>{{scope.row.manager.userName}}</span></el-tooltip>
              </p>
              <el-form-item
                class="coop"
                :prop="'coopManager'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0"
                :rules="setRules('manager',scope.row.id)">
                <div class="row-item" :class="{'error':!scope.row.managerValidSuc}">
                  <div :class="{'disabled':meberEditFlag}" v-if='meberEditFlag'></div>
                  <div class="tag-wrapper">
                    <template v-if="scope.row.manager.userAccount">
                      <el-tag
                        closable
                        @close="deletePerson(0,'coopManager',scope.$index)">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="scope.row.manager.userAccount"
                          placement="top-start"
                          size="small">
                          <span> {{ scope.row.manager.userName }}</span>
                        </el-tooltip>
                      </el-tag>
                    </template>
                    <span v-else class="placeholder">请选择</span>
                  </div>
                  <span class="add-icon svgfont-adduser" @click="addPerson('coopManager',scope.$index,'coopDemandManager'+scope.$index)"></span>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="coopDemandMember"
            :class-name="coopName ? 'coopDemandMember':''"
            min-width="200">
            <template slot="header">
              <div class="required">
                <span v-if="coopName">项目成员</span>
                <span v-else>项目经理</span>
              </div>
            </template>
            <template slot-scope="scope">
              <p v-show="scope.row.state==='detail'">
                <span v-for="(user,index) in scope.row.memberList" :key="user.id">
                  <el-tooltip
                    effect="dark"
                    :content="user.userAccount"
                    placement="top-start"
                    size="small"><span>{{user.userName}}</span></el-tooltip>
                  <span v-if="index<scope.row.memberList.length-1">，</span>
                </span>
              </p>
              <el-form-item
                class="xmcy"
                :prop="'coopMembers'+scope.$index"
                v-if="scope.row.state==='edit'"
                style="margin-right:0;margin-bottom:0;width:100%"
                :rules="setRules('coopMembers',scope.row.id)">
                <div class="row-item" :class="{'error':!scope.row.memberValidSuc}">
                  <div class="tag-wrapper">
                    <template v-if="scope.row.memberList.length">
                      <el-tag
                        v-for="(item,index) in scope.row.memberList"
                        :key="item.userAccount"
                        closable
                        @close="deletePerson(index,'coopMembers',scope.$index)">
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
                  <span class="add-icon svgfont-adduser" @click="addPerson('coopMembers',scope.$index,'coopMembers'+scope.$index)"></span>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            min-width="100"
            align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.state==='edit'"
                class="normal-btn"
                style="border: none;padding-left: 0!important;padding-right: 0 !important;background: 0 0;border-color: transparent;"
                @click="coopUnitAdd(scope.row,scope.$index)">完成</el-button>
              <el-button
                v-if="(scope.row.state==='detail'&&((unitTypeName=='需求'||unitTypeName=='承担')&&meberEditFlag))||(!meberEditFlag&&scope.row.state==='detail')"
                class="normal-btn"
                style="border: none;padding-left: 0!important;padding-right: 0 !important;background: 0 0;border-color: transparent;"
                @click="coopUnitEdit(scope.row)">编辑</el-button>
              <el-button
                v-if="!meberEditFlag"
                class="normal-btn"
                style="border: none;padding-left: 10px!important;padding-right: 0!important ;background: 0 0;border-color: transparent;"
                @click="coopUnitDel(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </project-panel>

    <person-select
      :show.sync="personDialogVisible"
      @selected="selectedPersions"
      @judgeMember="judgeMember"
      ref="selectPerson"></person-select>

  </div>
</template>

<script>
import personSelect from '../components/personSelect'
import bus from '@/common/bus'
import { isShowToolTip } from '@/utils/common.js'
import API from '@/serve/API_groupPlanProject'
export default {
  components: { personSelect },
  data () {
    let validUserAccount = (rule, value, callback) => {
      if (value && JSON.stringify(value) !== '{}' && value.userAccount) {
        callback()
      } else {
        callback(new Error(`请选择牵头${this.unitTypeName}单位项目经理`))
      }
    }
    return {
      meberEditFlag: false,
      personDialogVisible: false,
      roleType: '', //当前被添加的角色
      rowindex: -1,
      selfLeadForm: {
        organizationCode: '', //牵头单位
        organizationName: '',
        companyCode: '',
        companyName: '',
        leadManager: { userAccount: '' }, //牵头单位项目经理
        leadMembers: [] //牵头单位项目成员
      },
      leadFormRules: {
        organizationCode: [{ required: true, message: '请选择牵头单位', trigger: ['change', 'blur'] }],
        leadManager: [{ validator: validUserAccount, required: true, message: '请选择牵头单位项目经理', trigger: ['change', 'blur'] }]
        // leadMembers: [{ required: true, message: '请选择牵头单位项目成员', trigger: ['change', 'blur'] }]
      },
      leadManagerValidSuc: true, //牵头项目经理是否校验成功，false成功，true失败
      leadMemberValidSuc: true, //牵头项目成员是否校验成功，false成功，true失败
      selfCoopForm: {
        tableData: [
          { organizationCode: '', organizationName: '', companyCode: '', companyName: '', manager: { userAccount: '' }, memberList: [], unitOptions: [], managerValidSuc: true, memberValidSuc: true }]
      },
      addTableRow: { id: 'addid', state: 'edit', organizationCode: '', organizationName: '', companyCode: '', companyName: '', manager: { userAccount: '' }, memberList: [], unitOptions: [], managerValidSuc: true, memberValidSuc: true },
      idCount: 0,
      unitTypeName: '', //需求、承担、联合攻关
      coopName: '', //需求和承担 - 配合，联合攻关 - 空
      msgMap: {
        leadDemandUnitList: '子项目牵头需求单位',
        leadDemandManagerList: '子项目牵头需求单位经理',
        leadUndertakeUnitList: '子项目牵头承担单位',
        leadUndertakeManagerList: '子项目牵头承担单位经理',
        achDemandUnitList: '成果需求单位',
        achUndertakeUnitList: '成果承担单位',
        achDemandResponsibleList: '成果需求人',
        achUndertakeResponsibleList: '成果负责人'
      }
    }
  },
  props: {
    unitType: { type: String, default: '' }, //单位类型
    leadForm: { type: Object, default: () => {} },
    coopForm: { type: Object, default: () => {} },
    leadUnitOptions: { type: Array, default: () => [] },
    coopUnitOptions: { type: Array, default: () => [] }, //配合单位下拉选项
    subprojectInfo: { type: Object, default: () => {} }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
  },
  watch: {
    leadForm: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.selfLeadForm = newValue
        }
      }
    },
    coopForm: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue && newValue.tableData) {
          this.selfCoopForm = newValue
        }
      }
    },
    unitType: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        switch (newValue) {
          case 'demand':
            this.unitTypeName = '需求'
            this.coopName = '配合'
            break
          case 'undertaker':
            this.unitTypeName = '承担'
            this.coopName = '配合'
            break
          case 'joint':
            this.unitTypeName = '联合攻关'
            this.coopName = ''
            break
        }
      }
    }
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    //添加人员
    addPerson (roleType, rowindex, prop) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.roleType = roleType
      this.rowindex = rowindex
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
        case 'leadManager':
          if (this.selfLeadForm.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: `请先选择牵头${this.unitTypeName}单位！`,
              showClose: true
            })
            return
          }
          let user = []
          if (this.selfLeadForm.leadManager.userAccount) {
            user = [this.selfLeadForm.leadManager]
          }
          params = {
            node: [this.getOrgNode('1')],
            users: user,
            disabledUser: this.selfLeadForm.leadMembers,
            max: 1
          }
          break
        case 'leadMembers':
          if (this.selfLeadForm.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: `请先选择牵头${this.unitTypeName}单位！`,
              showClose: true
            })
            return
          }
          params = {
            node: [this.getOrgNode('1')],
            users: this.selfLeadForm.leadMembers,
            disabledUser: this.selfLeadForm.leadManager
          }
          break
        case 'coopManager':
          if (this.selfCoopForm.tableData[rowindex].organizationCode === '') {
            this.$message({
              type: 'warning',
              message: `请先选择${this.coopName}${this.unitTypeName}单位！`,
              showClose: true
            })
            return true
          }
          params = {
            node: [this.getOrgNode('0', rowindex)],
            users: this.selfCoopForm.tableData[rowindex].manager.userAccount ? [this.selfCoopForm.tableData[rowindex].manager] : [],
            disabledUser: this.selfCoopForm.tableData[rowindex].memberList,
            max: 1
          }
          break
        case 'coopMembers':
          if (this.selfCoopForm.tableData[rowindex].organizationCode === '') {
            this.$message({
              type: 'warning',
              message: `请先选择${this.coopName}${this.unitTypeName}单位！`,
              showClose: true
            })
            return true
          }
          params = {
            node: [this.getOrgNode('0', rowindex)],
            users: this.selfCoopForm.tableData[rowindex].memberList,
            disabledUser: this.selfCoopForm.tableData[rowindex].manager
          }
          break
      }
      params.users.forEach(ele => {
        ele.uid = ele.userAccount
        ele.chineseName = ele.userName
      })
      params.unitType = this.unitType
      this.personDialogVisible = true
      this.$refs.selectPerson.refreshTree(params)
    },
    //获取人员选择组件根节点的信息
    getOrgNode (isLead, index) {
      let orgInfo = { orgCode: '', orgName: '' }
      if (isLead === '1') {
        orgInfo.orgCode = this.selfLeadForm.organizationCode
        this.leadUnitOptions.some(ele => {
          if (ele.organizationCode === orgInfo.orgCode) {
            orgInfo.orgName = ele.organizationName
            orgInfo.orgAbbr = ele.organizationName
            return true
          }
        })
      } else {
        orgInfo.orgCode = this.selfCoopForm.tableData[index].organizationCode
        this.selfCoopForm.tableData[index].unitOptions.some(ele => {
          if (ele.organizationCode === orgInfo.orgCode) {
            orgInfo.orgName = ele.organizationName
            orgInfo.orgAbbr = ele.organizationName
            return true
          }
        })
      }
      return orgInfo
    },
    //确定选择人员
    selectedPersions (persons) {
      let users = []
      let roleCode = ''
      let unitCode = this.unitType === 'joint' ? 'PR-UNITE-ASSAULT-MANAGER' : this.unitType.toUpperCase()
      switch (this.roleType) {
        case 'leadManager':
          roleCode = `PR-LEADER-${unitCode}-MANAGER`
          break
        case 'leadMembers':
          roleCode = `PR-LEADER-${unitCode}-MEMBER`
          break
        case 'coopManager':
          roleCode = `PR-PARTNER-${unitCode}-MANAGER`
          break
        case 'coopMembers':
          if (this.coopName) {
            roleCode = `PR-PARTNER-${unitCode}-MEMBER`
          } else {
            roleCode = unitCode
          }
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
      switch (this.roleType) {
        case 'leadManager':
          this.selfLeadForm.leadManager = users[0]
          this.validateLeadManager()
          break
        case 'leadMembers':
          this.selfLeadForm.leadMembers = users
          this.validateLeadMember()
          break
        case 'coopManager':
          this.selfCoopForm.tableData[this.rowindex].manager = users[0]
          this.validateRowManager(this.selfCoopForm.tableData[this.rowindex])
          break
        case 'coopMembers':
          this.selfCoopForm.tableData[this.rowindex].memberList = users
          this.validateRowMember(this.selfCoopForm.tableData[this.rowindex])
          break
      }
      if (this.unitType === 'joint') {
        this.changeInfo()//不和子项目联动
      } else {
        this.changeValue()
      }
    },
    //删除人员
    async deletePerson (index, roleType, rowIndex) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (index > -1) {
        let params = {
          projectCode: this.$route.params.projectCode,
          userAccount: '',
          type: this.unitType === 'demand' ? '1' : '2'
        }
        let isChanged = false
        switch (roleType) {
          case 'leadManager':
            params.userAccount = this.selfLeadForm.leadManager.userAccount
            try {
              if (this.unitType !== 'joint') { //非联合攻关单位需要校验成员
                let canDel = await API.canRemoveProjectTeam(params)
                if (!canDel) return
                isChanged = true
              }
              this.selfLeadForm.leadManager = {}
              this.validateLeadManager()
            } catch (e) {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            }
            break
          case 'leadMembers':
            params.userAccount = this.selfLeadForm.leadMembers[index].userAccount
            try {
              if (this.unitType !== 'joint') { //非联合攻关单位需要校验成员
                let canDel = await API.canRemoveProjectTeam(params)
                if (!canDel) return
                isChanged = true
              }
              this.selfLeadForm.leadMembers.splice(index, 1)
              this.validateLeadMember()
            } catch (e) {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            }
            break
          case 'coopManager':
            params.userAccount = this.selfCoopForm.tableData[rowIndex].manager.userAccount
            try {
              if (this.unitType !== 'joint') { //非联合攻关单位需要校验成员
                let canDel = await API.canRemoveProjectTeam(params)
                if (!canDel) return
                isChanged = true
              }
              this.selfCoopForm.tableData[rowIndex].manager = {}
              this.validateRowManager(this.selfCoopForm.tableData[rowIndex])
            } catch (e) {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            }
            break
          case 'coopMembers':
            params.userAccount = this.selfCoopForm.tableData[rowIndex].memberList[index].userAccount
            try {
              if (this.unitType !== 'joint') { //非联合攻关单位需要校验成员
                let canDel = await API.canRemoveProjectTeam(params)
                if (!canDel) return
                isChanged = true
              }
              this.selfCoopForm.tableData[rowIndex].memberList.splice(index, 1)
              this.validateRowMember(this.selfCoopForm.tableData[rowIndex])
            } catch (e) {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            }
            break
        }
        if (this.unitType === 'joint') {
          this.changeInfo() //不需要和子项目做联动
        } else if (isChanged) {
          this.changeValue()
        }
      }
    },
    judgeMember (userAccount) {
      let flag1 = false
      let flag2 = false
      let flag3 = false
      let flag4 = false
      flag1 = this.subprojectInfo.leadDemandManagerList.some(e => e === userAccount)
      flag2 = this.subprojectInfo.achDemandResponsibleList.some(e => e === userAccount)
      flag3 = this.subprojectInfo.leadUndertakeManagerList.some(e => e === userAccount)
      flag4 = this.subprojectInfo.achUndertakeResponsibleList.some(e => e === userAccount)
      if (flag1 && this.unitType === 'demand') {
        this.showMessage('leadDemandManagerList')
        return true
      }
      if (flag2 && this.unitType === 'demand') {
        this.showMessage('achDemandResponsibleList')
        return true
      }
      if (flag3 && this.unitType === 'undertaker') {
        this.showMessage('leadUndertakeManagerList')
        return true
      }
      if (flag4 && this.unitType === 'undertaker') {
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
    //设置表格索引
    setIndexMethod (index) {
      if (index < 9) {
        return '0' + (index + 1)
      }
      return index + 1
    },
    // 设置表单必填校验 - 配合单位
    setRules (prop, id) {
      if (prop === 'coopMembers') return
      let temp = null
      this.selfCoopForm.tableData.some(ele => {
        if (ele.id === id) {
          temp = ele[prop]
          return true
        }
      })
      if (prop === 'manager') {
        temp = temp.userAccount
      }
      let checkEmpty = (rule, value, callback) => {
        if (!temp) {
          callback(new Error('该项不能为空'))
        } else {
          callback()
        }
      }
      let rules = [
        { validator: checkEmpty, required: true, message: '该项不能为空', trigger: ['blur', 'change'] }
      ]
      return rules
    },
    //添加配合单位
    addCoopUnit () {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      let flag = this.selfCoopForm.tableData.some((item, index) => {
        return item.id === 'addid'
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '请保存当前的新增数据!',
          showClose: true
        })
      } else {
        let addRow = JSON.parse(JSON.stringify(this.addTableRow))
        addRow.unitOptions = this.coopUnitOptions
        // console.log('addRow', addRow)
        this.selfCoopForm.tableData.push(addRow)
      }
    },
    //牵头单位变化
    changeLeadUnit (val) {
      this.selfLeadForm.organizationName = ''
      this.selfLeadForm.leadManager = { userAccount: '' }
      this.selfLeadForm.leadMembers = []
      if (val) {
        this.leadUnitOptions.some(ele => {
          if (ele.organizationCode === val) {
            this.selfLeadForm.organizationName = ele.organizationName
            return true
          }
        })
      }
      this.validateLeadManager()
      this.validateLeadMember()
      this.setUnitDisabled()
      this.changeValue()
    },
    //配合单位变化
    changeCoopUnit (val, index) {
      let validManager = this.selfCoopForm.tableData[index].manager && this.selfCoopForm.tableData[index].manager.userAccount
      let validMember = this.selfCoopForm.tableData[index].memberList.length > 0
      this.selfCoopForm.tableData[index].organizationName = ''
      this.selfCoopForm.tableData[index].manager = { userAccount: '' }
      this.selfCoopForm.tableData[index].memberList = []
      if (val) {
        this.selfCoopForm.tableData[index].unitOptions.some(ele => {
          if (ele.organizationCode === val) {
            this.selfCoopForm.tableData[index].organizationName = ele.organizationName
            return true
          }
        })
      }
      //上次存在数据时校验，否则不校验
      if (validManager || validMember) {
        this.validateRowManager(this.selfCoopForm.tableData[index])
        this.validateRowMember(this.selfCoopForm.tableData[index])
      }
      this.setUnitDisabled()
      if (this.unitType === 'joint') {
        this.changeInfo()
      } else {
        this.changeValue()
      }
    },
    //设置单位下拉的禁用选项
    setUnitDisabled () {
      let options = []
      let orgs = []
      options = this.leadUnitOptions
      orgs.push(this.selfLeadForm.organizationCode)
      this.selfCoopForm.tableData.forEach(ele => {
        orgs.push(ele.organizationCode)
      })
      options.forEach(ele => {
        let flag = orgs.some(orgCode => orgCode === ele.organizationCode)
        ele.disabled = flag
      })
      this.selfCoopForm.tableData.forEach(ele => {
        ele.unitOptions.forEach(ele => {
          let flag = orgs.some(orgCode => orgCode === ele.organizationCode)
          ele.disabled = flag
        })
      })
      this.coopUnitOptions.forEach(ele => {
        let flag = orgs.some(orgCode => orgCode === ele.organizationCode)
        ele.disabled = flag
      })
    },
    //单独校验牵头单位项目经理
    validateLeadManager () {
      this.leadManagerValidSuc = this.selfLeadForm.leadManager && this.selfLeadForm.leadManager.userAccount
      return this.leadManagerValidSuc
    },
    //单独校验牵头单位项目成员 -- 非必填，不校验
    validateLeadMember () {
      // this.leadMemberValidSuc = this.selfLeadForm.leadMembers && this.selfLeadForm.leadMembers.length > 0
      // return this.leadMemberValidSuc
      return true
    },
    //单独校验配合单位项目经理
    validateRowManager (row) {
      row.managerValidSuc = row.manager && row.manager.userAccount
      return row.managerValidSuc
    },
    //单独校验配合单位项目成员 -- 需求和承担单位成员非必填，不校验；联合攻关单位项目经理必填校验
    validateRowMember (row) {
      if (this.coopName) return true
      row.memberValidSuc = row.memberList && row.memberList.length > 0
      return row.memberValidSuc
    },
    validateRowUser (row) {
      let validResult = true
      if (this.coopName) { //需求、承担
        let valid1 = this.validateRowManager(row)
        let valid2 = this.validateRowMember(row)
        validResult = valid1 && valid2
      } else {
        validResult = this.validateRowMember(row)
      }
      return validResult
    },
    //校验所有表单
    validate () {
      let validResult = true
      if (this.coopName) { //需求、承担
        let valid1 = this.validateLeadManager()
        let valid2 = this.validateLeadMember()
        if (!valid1 || !valid2) {
          validResult = false
        }
      }
      this.$refs.selfCoopForm.validate(valid => {
        if (!valid) {
          validResult = false
        }
      })
      this.selfCoopForm.tableData.some(ele => {
        this.validateRowUser(ele)
        if (!this.validateRowUser(ele)) {
          validResult = false
        }
      })
      return validResult
    },
    //完成-新增数据
    coopUnitAdd (row, rowIndex) {
      let validSuc = this.validateRowUser(row)
      this.$refs.selfCoopForm.validateField(`coopOrgCode${rowIndex}`, errorMessage => {
        if (errorMessage === '' && validSuc) {
          row.id = 'newRow' + this.idCount
          row.unitOptions.some(unit => {
            if (unit.organizationCode === row.organizationCode) {
              row.organizationName = unit.organizationName
              row.companyCode = unit.companyCode
              row.companyName = unit.companyName
              return true
            }
          })
          row.type = this.getType()
          row.leaderFlag = '0'
          row.state = 'detail'
          this.idCount++
        }
      })
    },
    //编辑
    coopUnitEdit (row) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      row.state = 'edit'
      row.unitOptions = this.coopUnitOptions
      this.changeInfo()
    },
    //删除
    coopUnitDel (row, index) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          // if (this.judgeUnit(this.selfCoopForm.tableData[index])) return
          if (row.unitDisabled && this.unitType !== 'joint') {
            this.$message({
              type: 'error',
              message: row.msg || '该单位不能删除!',
              showClose: true
            })
            return
          }
          this.selfCoopForm.tableData.splice(index, 1)
          this.setUnitDisabled()
          this.changeValue()
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    judgeUnit (org) {
      let flag1 = false
      let flag2 = false
      let flag3 = false
      let flag4 = false
      flag1 = this.subprojectInfo.leadDemandUnitList.some(e => e === org.organizationCode)
      flag2 = this.subprojectInfo.achDemandUnitList.some(e => e === org.organizationCode)
      flag3 = this.subprojectInfo.leadUndertakeUnitList.some(e => e === org.organizationCode)
      flag4 = this.subprojectInfo.achUndertakeUnitList.some(e => e === org.organizationCode)
      if (flag1 && this.unitType === 'demand') {
        this.showUnitMessage('leadDemandUnitList', org)
        return true
      }
      if (flag2 && this.unitType === 'demand') {
        this.showUnitMessage('achDemandUnitList', org)
        return true
      }
      if (flag3 && this.unitType === 'undertaker') {
        this.showUnitMessage('leadUndertakeUnitList', org)
        return true
      }
      if (flag4 && this.unitType === 'undertaker') {
        this.showUnitMessage('achUndertakeUnitList', org)
        return true
      }
      return false
    },
    showUnitMessage (role, org) {
      this.$message({
        message: `${org.organizationName}为${this.msgMap[role]}，不能删除！`,
        type: 'warning',
        showClose: true
      })
    },
    //获取组织和人员数据
    getCompanyList () {
      let type = this.getType()
      let leadCompany = null
      if (this.coopName) { //需求、承担
        leadCompany = {
          organizationCode: this.selfLeadForm.organizationCode,
          organizationName: this.selfLeadForm.organizationName,
          companyCode: this.selfLeadForm.companyCode,
          companyName: this.selfLeadForm.companyName,
          type: type, // 需求方1，承担方2，联合攻关单位3
          leaderFlag: '1', //牵头1，配合0
          projectTeamList: [this.selfLeadForm.leadManager, ...this.selfLeadForm.leadMembers] //人员
        }
      }
      let coopCompany = []
      this.selfCoopForm.tableData.forEach(comp => {
        comp.unitOptions.some(ele => {
          if (ele.organizationCode === comp.organizationCode) {
            comp.companyCode = ele.companyCode
            comp.companyName = ele.companyName
            return true
          }
        })
        let tempTeamList = []
        if (this.coopName) { //需求、承担
          tempTeamList = [comp.manager, ...comp.memberList]
        } else {
          tempTeamList = [...comp.memberList]
        }
        let tempComp = {
          organizationCode: comp.organizationCode,
          organizationName: comp.organizationName,
          companyCode: comp.companyCode,
          companyName: comp.companyName,
          type: type, // 需求方1，承担方2，联合攻关单位3
          leaderFlag: '0', //牵头1，配合0
          projectTeamList: tempTeamList //人员
        }
        coopCompany.push(tempComp)
      })
      let tempCompanyList = []
      if (this.coopName) {
        tempCompanyList = [leadCompany, ...coopCompany]
      } else {
        tempCompanyList = [...coopCompany]
      }
      return tempCompanyList
    },
    getType () {
      let type = ''
      switch (this.unitType) {
        case 'demand':
          type = '1'
          break
        case 'undertaker':
          type = '2'
          break
        case 'joint':
          type = '3'
          break
      }
      return type
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
        this.$emit('changeTeamInfo')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.coopDemandMember .required span::before{
  display: none;
}
// 下拉超出省略号显示
.el-select-dropdown__item {
  /deep/ span {
    box-sizing: border-box;
    display: inline-block;
    max-width: 180px!important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
