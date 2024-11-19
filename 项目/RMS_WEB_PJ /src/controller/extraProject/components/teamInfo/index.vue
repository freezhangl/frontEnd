<template>
  <div class="team-info">
    <project-panel title="团队信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" @click="tempSave">暂存</el-button>
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
              <span class="add-icon el-icon-plus" @click="addPerson('manage')"></span>
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
              <span class="add-icon el-icon-plus" @click="addPerson('member')"></span>
            </div>
            <span v-if="!memberValidSuc" class="error-tip">请选择项目成员！</span>
          </el-form-item>
          <el-form-item label="项目观察员:" prop="observerList">
            <div class="row-item">
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
              <span class="add-icon el-icon-plus" @click="addPerson('observer')"></span>
            </div>
          </el-form-item>
          <el-form-item label="专家:" prop="expertList">
            <div class="row-item">
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
              <span class="add-icon el-icon-plus" @click="addPerson('expert')"></span>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <el-dialog
        v-dialogDrag
        v-if="personDialogVisible"
        title="选择人员"
        :visible.sync="personDialogVisible"
        width="925px"
        @closed="personDialogClosed">
        <person-table ref="personTable" :exclude-user="excludeUser"></person-table>
        <div class="dialog-footer" slot="footer">
          <el-button @click="personDialogClosed">取消</el-button>
          <el-button @click="confirmSelect" type="primary">确认</el-button>
        </div>
      </el-dialog>

    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project'
import personTable from './personTable'
import { mapGetters } from 'vuex'
export default {
  components: { projectPanel, personTable },
  data () {
    return {
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
      language: '暂无基线信息'
      // manageValidSuc: true, //是否校验成功
      // memberValidSuc: true //是否校验成功
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
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    }),
    manageValidSuc () {
      if (!this.isChangeManage) return true
      return this.teamInfoForm.manageList && this.teamInfoForm.manageList.length
    },
    memberValidSuc () {
      if (!this.isChangeMember) return true
      return this.teamInfoForm.memberList && this.teamInfoForm.memberList.length
    }
  },
  methods: {
    addPerson (roleType) {
      this.roleType = roleType
      this.excludeUser = this.teamInfoForm[`${roleType}List`]
      if (this.judgeNum(this.excludeUser)) return
      this.personDialogVisible = true
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
          if ((isConfirm && list.length > 200) || (!isConfirm && list.length === 200)) {
            msg = '项目成员最多添加200人！'
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
      if (roleType === 'manage') this.isChangeManage = true
      if (roleType === 'member') this.isChangeMember = true
      if (index > -1) {
        this.teamInfoForm[`${roleType}List`].splice(index, 1)
      }
    },
    getSubmitData (role, list) {
      let valueCode = ''
      this.roleList.some(ele => {
        if (ele.selfName === role) {
          valueCode = ele.valueCode
        }
      })
      list.forEach(ele => {
        ele.projectCode = this.projectCode
        ele.projectRoleCode = valueCode
      })
      return list
    },
    tempSave () {
      if (!this.projectCode) {
        this.$message({
          message: '请先暂存基本信息！',
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
          .then(data => {
            if (data === 2) {
              this.$message({
                message: '项目经理同时担任里程碑负责人、成果负责人，请同步修改',
                type: 'warning',
                showClose: true
              })
            } else if (data === 3) {
              this.$message({
                message: '该项目成员同时担任成果负责人，请同步修改',
                type: 'warning',
                showClose: true
              })
            } else {
              this.$message({
                message: '暂存成功',
                type: 'success',
                showClose: true
              })
            }
            this.$emit('saveTeamInfo', true)
          })
          .catch(e => {
            if (e.selfError) return
            this.$message({
              message: e.message || '团队信息暂存失败！',
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
    }
  },
  mounted () {
    if (this.receiveData && this.receiveData.length) {
      //编辑
      this.analyzeData()
    } else {
      //新增
      this.teamInfoForm.manageList = [{
        userName: this.userInfo.userAuth.chineseName,
        employeeNum: this.userInfo.userAuth.employeeNum,
        userAccount: this.userInfo.userAuth.uid
      }]
    }
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
      color: #ff3f3b;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }
  }
}
</style>
