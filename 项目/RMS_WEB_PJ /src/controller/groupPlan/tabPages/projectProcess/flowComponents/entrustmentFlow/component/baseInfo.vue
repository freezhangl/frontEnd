<template>
  <project-panel title="基本信息">
    <el-form
      :model="data"
      :inline="true"
      :rules="viewType === 'write'?rules:null"
      ref="form"
      v-if="data"
      label-width="130px" >
      <el-form-item label="项目名称：" prop="projectName" style="width:100%;">
        <span>{{data.projectName}}</span>
      </el-form-item>
      <el-form-item label="任务名称：" prop="taskName" style="width:66%;margin-right:0;">
        <el-input
          v-if="viewType === 'write'"
          v-model.trim="data.taskName"
          placeholder="请输入"
          maxlength="128"></el-input>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{data.taskName}}</span>
      </el-form-item>
      <el-form-item label="需求部门：" prop="demandOrgName" style="width:33%;margin-right:0;">
        <span>{{data.demandOrgName}}</span>
      </el-form-item>
      <el-form-item label="需求负责人：" prop="demandResponsibleName" style="width:33%;margin-right:0;">
        <span>{{data.demandResponsibleName}}</span>
      </el-form-item>
      <el-form-item label="联系方式：" prop="demandResponsibleConcat" style="width:33%;margin-right:0;">
        <span>{{data.demandResponsibleConcat}}</span>
      </el-form-item>
      <el-form-item label="计划开始时间：" prop="planStartTime" style="width:33%;margin-right:0;">
        <el-date-picker
          v-if="viewType === 'write'"
          v-model="data.planStartTime"
          :picker-options="pickerOptionsTimeStart"
          :default-value="projectInfo.projectBaseInfo.planApprovalTime > Date.now()?parseInt(projectInfo.projectBaseInfo.planApprovalTime):Date.now()"
          type="date"
          value-format="timestamp"
          placeholder="选择日期">
        </el-date-picker>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{formatterDate(data.planStartTime)}}</span>
      </el-form-item>
      <el-form-item label="承担方项目经理：" prop="undertakeManagerAccount" style="width:33%;margin-right:0;">
        <el-select
          v-if="viewType === 'write'"
          v-model="data.undertakeManagerAccount"
          @change="changeMange"
          clearable
          placeholder="请选择">
          <el-option
            v-for="item in undertakeProjetMangeOptions"
            :key="item.id"
            :label="item.userName"
            :value="item.userAccount">
          </el-option>
        </el-select>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{data.undertakeManagerName}}</span>
      </el-form-item>
      <el-form-item label="建议承担部门：" prop="adviceUndertakeOrgCode" style="width:33%;margin-right:0;">
        <el-select
          v-if="viewType === 'write'"
          @change="handler"
          v-model="data.adviceUndertakeOrgCode"
          clearable
          placeholder="请选择">
          <el-option
            v-for="item in undertakeOptions"
            :key="item.id"
            :label="item.orgName"
            :value="item.orgCode">
          </el-option>
        </el-select>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{data.adviceUndertakeOrgName}}</span>
      </el-form-item>
      <el-form-item label="计划完成时间：" prop="planFinishTime" style="width:33%;margin-right:0;">
        <el-date-picker
          v-if="viewType === 'write'"
          v-model="data.planFinishTime"
          :picker-options="pickerOptionsTimeEnd"
          type="date"
          :default-value="parseInt(data.planStartTime) || parseInt(projectInfo.projectBaseInfo.planFinishTime)"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="选择日期">
        </el-date-picker>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{formatterDate(data.planFinishTime)}}</span>
      </el-form-item>
      <el-form-item label="任务描述及要求：" prop="descriptionRequirement" style="width:100%;">
        <el-input
          :maxlength="300"
          show-word-limit
          type="textarea"
          v-model="data.descriptionRequirement"
          @input="data.descriptionRequirement=data.descriptionRequirement.replace(/ /g, '')"
          placeholder="请输入"
          v-if="viewType === 'write'"></el-input>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{data.descriptionRequirement}}</span>
      </el-form-item>
      <el-form-item label="需求风险提示：" prop="demandRiskTip" style="width:100%;">
        <el-input
          :maxlength="300"
          show-word-limit
          type="textarea"
          v-model="data.demandRiskTip"
          @input="data.demandRiskTip=data.demandRiskTip.replace(/ /g, '')"
          placeholder="请输入"
          v-if="viewType === 'write'"></el-input>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{data.demandRiskTip}}</span>
      </el-form-item>
      <el-form-item label="预期完成效果：" prop="expectedEffect" style="width:100%;">
        <el-input
          :maxlength="300"
          show-word-limit
          type="textarea"
          v-model="data.expectedEffect"
          @input="data.expectedEffect=data.expectedEffect.replace(/ /g, '')"
          placeholder="请输入"
          v-if="viewType === 'write'"></el-input>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{data.expectedEffect}}</span>
      </el-form-item>
      <el-form-item label="备注：" prop="remark" style="width:100%;">
        <el-input
          :maxlength="300"
          show-word-limit
          type="textarea"
          v-model="data.remark"
          @input="data.remark=data.remark.replace(/ /g, '')"
          placeholder="请输入"
          v-if="viewType === 'write'"></el-input>
        <span v-else-if="viewType === 'read' || viewType === 'preview'">{{data.remark}}</span>
      </el-form-item>
      <template v-if="viewType === 'preview'"> <!-- 查看 -->
        <el-form-item
          label="完成情况："
          prop="remark"
          style="width:100%;"
          v-if="data.completion && showFinish">
          <span>{{data.completion}}</span>
        </el-form-item>
        <el-form-item
          label="完成得分："
          prop="remark"
          style="width:100%;"
          v-if="data.entrustLetterEvaluate&&data.entrustLetterEvaluate.evaluateScore">
          <span v-if="data.entrustLetterEvaluate">{{data.entrustLetterEvaluate.evaluateScore}}</span>
        </el-form-item>
        <el-form-item
          label="完成评价："
          prop="remark"
          style="width:100%;"
          v-if="data.entrustLetterEvaluate&&data.entrustLetterEvaluate.evaluateContent">
          <span v-if="data.entrustLetterEvaluate">{{data.entrustLetterEvaluate.evaluateContent}}</span>
        </el-form-item>
      </template>
    </el-form>
  </project-panel>
</template>

<script>
/*
建议承担部门列表获取
承担单位编码 -> projectInfo.projectCompanyList type == 2
根据承担单位编码，去调用人员选择获取自己部门的接口，获取二级部门
承担方项目经理列表获取
project.projectTeamList
PR-LEADER-UNDERTAKER-MANAGER -> 承担单位项目经理编码
需要根据当前选择承担部门去筛选项目经理列表
 */
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_groupPlan'
import obj from '@/utils/DateTimeUtils.js'
export default {
  props: {
    data: {},
    viewType: {},
    projectInfo: {},
    showFinish: { default: true }
  },
  // props: [ 'data', 'viewType', 'projectInfo', 'showFinish' ],
  components: { projectPanel },
  data () {
    const that = this
    // 获取零点时间戳
    let timestamp = new Date(new Date(Date.now())
      .toLocaleDateString())
      .getTime()
    return {
      undertakeOptions: [], // 承担部门下拉列表
      undertakeProjetMangeOptions: [], // 承担项目经理列表
      pickerOptionsTimeStart: {
        disabledDate (time) {
          if (!that.$props.data.planFinishTime) {
            that.$props.data.planFinishTime = undefined
          }
          return (time.getTime() < timestamp || // 小于当前时间
                  time.getTime() > that.$props.data.planFinishTime || // 小于计划完成时间
                  time.getTime() < that.$props.projectInfo.projectBaseInfo.planApprovalTime || // 大于计划立项时间
                  time.getTime() > that.$props.projectInfo.projectBaseInfo.planFinishTime) // 小于计划结项时间
        }
      },
      pickerOptionsTimeEnd: {
        disabledDate (time) {
          return (time.getTime() < that.$props.data.planStartTime || // 大于计划开始时间
                  time.getTime() < that.$props.projectInfo.projectBaseInfo.planApprovalTime || // 大于计划立项时间
                  time.getTime() > that.$props.projectInfo.projectBaseInfo.planFinishTime) // 小于计划结项时间
        }
      },
      rules: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        planStartTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        adviceUndertakeOrgCode: [{ required: true, message: '请选择建议承担部门', trigger: 'change' }],
        planFinishTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        undertakeManagerAccount: [{ required: true, message: '请选择承担方项目经理', trigger: 'change' }],
        descriptionRequirement: [{ required: true, message: '请输入任务描述及要求', trigger: 'blur' }],
        demandRiskTip: [{ required: true, message: '请输入需求风险提示', trigger: 'blur' }],
        expectedEffect: [{ required: true, message: '请输入预期完成效果', trigger: 'blur' }],
        remark: [{ required: false, message: '请输入备注', trigger: 'blur' }]
      },
      code: null,
      projectCompanyList: '',
      projectTeamList: '',
      orgName: this.data.adviceUndertakeOrgName,
      orgCode: this.data.adviceUndertakeOrgCode,
      userName: this.data.undertakeManagerName,
      userAccount: this.data.undertakeManagerAccount,
      routePath: this.$route.path
    }
  },
  filters: {
    initTime () {}
  },
  computed: {},
  watch: {},
  methods: {
    // 承担方部门
    changeOrg (val) {
      this.data.undertakeManagerAccount = null
      for (let i = 0; i < this.undertakeOptions.length; i++) {
        let orgName
        if (val === this.undertakeOptions[i].orgCode) {
          orgName = this.undertakeOptions[i].orgName
          this.data.adviceUndertakeOrgName = orgName
        }
        if (val === this.undertakeOptions[i].mdmOrgCode) {
          this.data.adviceUndertakeOrgName = this.undertakeOptions[i].mdmOrgName
        }
      }
    },
    // 承担方项目经理改变
    changeMange (val) {
      if (!this.data.adviceUndertakeOrgCode) {
        var currentManager = this.undertakeProjetMangeOptions.filter(item => {
          if (item.userAccount === val) return item
        })[0]
        var currentOrg = null
        currentOrg = this.undertakeOptions.filter(item => {
          if (item.orgCode === currentManager.organizationCode) return item
        })[0]
        if (!currentOrg) {
          // 如果上面的遍历没有匹配到对应的部门，则重新匹配orgCode的前8位
          currentOrg = this.undertakeOptions.filter(item => {
            if (item.orgCode.substr(0, 8) === currentManager.organizationCode.substr(0, 8)) return item
          })[0]
        }
        this.data.adviceUndertakeOrgCode = currentOrg.orgCode
        this.data.adviceUndertakeOrgName = currentOrg.orgName
      }
      for (let i = 0; i < this.undertakeProjetMangeOptions.length; i++) {
        if (val === this.undertakeProjetMangeOptions[i].userAccount) {
          this.data.undertakeManagerName = this.undertakeProjetMangeOptions[i].userName
        }
      }
    },
    formatterDate (val) {
      return obj.timestampToDate(val)
    },
    getVal () {
      return this.$props.data
    },
    submitForm () {
      let value
      this.$refs['form'].validate((valid) => {
        value = valid
      })
      return value
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 获取团队信息成员列表
    handler (val) {
      let param = {
        organizationCode: val || this.code,
        projectCode: this.data.projectCode,
        projectRoleCodes: ['PR-LEADER-UNDERTAKER-MANAGER', 'PR-LEADER-UNDERTAKER-MEMBER'],
        latest: '1'
      }
      API.queryProjectTeamList(param)
        .then(res => {
          if (res.length) {
            this.undertakeProjetMangeOptions = res
          } else {
            if (val === this.orgCode && this.orgCode) {
              this.undertakeProjetMangeOptions = []
              let res = {
                id: 0,
                userName: this.userName,
                userAccount: this.userAccount
              }
              this.undertakeProjetMangeOptions.push(res)
            } else {
              this.undertakeProjetMangeOptions = res
            }
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
      this.changeOrg(val)
    },
    getOrgList (code) {
      let param = {
        parentOrgCode: code, // 父级组织编码 20个0查根组织
        // orgForm: type || 1, // 组织形态 [1--公司；2--部门]  非必填
        // companyPartCode: '', // 公司段编码 非必填
        recursion: false // 是否递归
      }
      API.getOrgList(param)
        .then(res => {
          this.undertakeOptions = res
          if (this.orgCode) {
            let arr = this.undertakeOptions.some(item => {
              return item.orgCode === this.data.adviceUndertakeOrgCode
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    initData () {
      if (this.viewType === 'write' && this.projectInfo) {
        this.projectCompanyList = this.projectInfo.projectCompanyList || []
        this.projectTeamList = this.projectInfo.projectTeamList || []
        // 承担单位部门列表
        let code = ''
        for (let i = 0; i < this.projectCompanyList.length; i++) {
          if (this.projectCompanyList[i].type.toString() === '2') {
            code = this.projectCompanyList[i].organizationCode
            break
          }
        }
        this.code = code
        this.getOrgList(code)
        let manager = this.data.undertakeManagerAccount
        this.handler(code)
        this.data.undertakeManagerAccount = manager
      }
    }
  },
  created () {
    this.initData()
  },
  mounted () {
    // if (this.viewType !== 'write') {
    //   this.rules = {}
    // }
  },
  beforeCreate () {},
  beforeMount () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {},
  activated () {}
}
</script>
<style lang='scss' scoped>
/deep/ .el-form-item{
   margin-bottom: 2px;
  }
  /deep/ .el-form-item__label{
    line-height: 25px;
  }
  /deep/ .el-form-item__content{
    line-height: 25px;
  }
//@import url(); 引入公共css类
.el-form{
  display: flex;
  flex-wrap: wrap;
  .el-form-item{
    display: flex;
    span{
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
.el-date-editor.el-input{
  width: 100%;
}
.el-form /deep/{
  .el-form-item__label{
    white-space: nowrap;
    min-width: 130px;
  }
  .el-form-item__content{
    flex-grow: 1;
  }
  .el-form-item .el-input__inner,.el-form-item .el-date-editor.el-input{
    width: 100%;
  }
}
</style>
