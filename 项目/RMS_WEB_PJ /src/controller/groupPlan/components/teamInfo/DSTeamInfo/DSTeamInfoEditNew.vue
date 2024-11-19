<template>
  <div class="DSTeamInfoEdit">
    <project-panel
      title="团队信息"
      :tips="true"
      :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" @click="tempSave">保存本区块信息</el-button>
      </template>
      <div class="body-con">
        <editTeamInfo
          ref="demandCompany"
          unit-type="demand"
          :lead-form="demandLeadForm"
          :lead-unit-options="leadDemandUnitOptions"
          :coop-unit-options="coopDemandUnitOptions"
          :coop-form="demandCoopForm"
          :subproject-info="subprojectInfo"
          @changeTeamInfo="changeValue"></editTeamInfo>
        <editTeamInfo
          ref="undertakeCompany"
          unit-type="undertaker"
          :lead-form="undertakeLeadForm"
          :lead-unit-options="leadUndertakeUnitOptions"
          :coop-unit-options="coopUndertakeUnitOptions"
          :coop-form="undertakeCoopForm"
          :subproject-info="subprojectInfo"
          @changeTeamInfo="changeValue"></editTeamInfo>
        <editTeamInfo
          ref="jointCompany"
          unit-type="joint"
          :coop-unit-options="jointUnitOptions"
          :coop-form="jointForm"
          :subproject-info="subprojectInfo"
          @changeTeamInfo="changeValue"></editTeamInfo>
      </div>
    </project-panel>
  </div>
</template>

<script>
import projectPanel from '@/controller/components/projectPanel'
import editTeamInfo from './editTeamInfo'
import API from '@/serve/API_groupPlanProject'
import bus from '@/common/bus'
export default {
  data () {
    return {
      //需求单位
      demandLeadForm: { //需求单位 form
        organizationCode: '', //牵头需求单位
        organizationName: '',
        companyCode: '',
        companyName: '',
        leadManager: { userAccount: '' }, //牵头需求单位项目经理
        leadMembers: [] //牵头需求单位项目成员
      },
      leadDemandUnitOptions: [], //牵头需求单位下拉选项值集
      demandCoopForm: { //配合需求单位表格
        tableData: []
      },
      coopDemandUnitOptions: [], //配合需求单位下拉选项值集
      //承担单位
      undertakeLeadForm: { //承担单位 form
        organizationCode: '', //牵头需求单位
        organizationName: '',
        companyCode: '',
        companyName: '',
        leadManager: { userAccount: '' }, //牵头需求单位项目经理
        leadMembers: [] //牵头需求单位项目成员
      },
      leadUndertakeUnitOptions: [], //牵头承担单位下拉选项值集
      undertakeCoopForm: { //配合承担单位表格
        tableData: []
      },
      coopUndertakeUnitOptions: [], //配合承担单位下拉选项值集
      //联合攻关单位
      jointForm: { //联合攻关单位表格
        tableData: []
      },
      jointUnitOptions: [], //联合攻关单位下拉选项值集
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
      language: '团队信息中所有可编辑字段都是基线字段；',
      checkData: [
        {
          label: 'leaderDemandUnit',
          value: '牵头需求单位'
        }, {
          label: 'leaderDemandManager',
          value: '牵头需求单位项目经理'
        }, {
          label: 'leaderDemandMember',
          value: '牵头需求单位项目成员'
        }, {
          label: 'partnerDemandUnit',
          value: '配合需求单位'
        }, {
          label: 'partnerDemandManager',
          value: '配合需求单位项目经理（按部门拆分）'
        }, {
          label: 'partnerDemandMember',
          value: '配合需求单位项目成员（按部门拆分）'
        }, {
          label: 'leaderUndertakeUnit',
          value: '牵头承担单位'
        }, {
          label: 'leaderUndertakeManager',
          value: '牵头承担单位项目经理'
        }, {
          label: 'leaderUndertakeMember',
          value: '牵头承担单位项目成员'
        }, {
          label: 'partnerUndertakeUnit',
          value: '配合承担单位'
        }, {
          label: 'partnerUndertakeManager',
          value: '配合承担单位项目经理（按部门拆分）'
        }, {
          label: 'partnerUndertakeMember',
          value: '配合承担单位项目成员（按部门拆分）'
        }, {
          label: 'uniteAssaultUnit',
          value: '联合攻关单位'
        }, {
          label: 'uniteAssaultManager',
          value: '联合攻关单位项目经理（按单位拆分）'
        }],
      allSubProUnit: [], //所有子项目和成果中关联的单位
      hasInitedProUnit: false, //是否已初始化过allSubProUnit
      timer: null
    }
  },
  components: { editTeamInfo, projectPanel },
  props: {
    projectCompanyList: { type: Array, default: () => [] },
    //需求非一般支撑包 - 项目类别=关键核心技术攻关IC_B时显示为“项目执行经理”
    projectClass: { type: String, default: '' },
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
        tempList.forEach(comp => {
          // element.type 需求方1，承担方2，联合攻关单位3
          if (comp.type === '1') { //需求
            this.setData(comp, 'demand')
          } else if (comp.type === '2') {
            this.setData(comp, 'undertake')
          } else if (comp.type === '3') {
            let tempList = []
            if (comp.projectTeamList) {
              comp.projectTeamList.forEach(user => {
                if (user.projectRoleCode === `PR-UNITE-ASSAULT-MANAGER`) { //项目经理
                  tempList.push(user)
                }
              })
            }
            comp.projectTeamList = tempList
            comp.memberList = tempList
            comp.unitOptions = []
            comp.memberValidSuc = true
            comp.state = 'detail'
            this.jointForm.tableData.push(comp)
          }
        })
        this.timer = setInterval(() => {
          if (this.hasInitedProUnit) {
            if (this.timer) {
              clearInterval(this.timer)
            }
            this.timer = null
            this.setSubProUnitDisabled(this.allSubProUnit)
          }
        }, 200)
        Promise.all([this.getEmployerUndertaker('1'), this.getEmployerUndertaker('2'), this.getJointUnitList()])
          .then(res => {
            this.initUnitOptions()
          })
          .catch(e => {

          })
        // this.renderNum++
        // if (this.renderNum === 4) { //父组件数据处理完，接口获取成功
        //   this.initAllOptions()
        // }
        // this.initManageOptions()
        this.changeValue(true)
      }
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    setData (compData, type = 'demand') {
      let upperType = type === 'demand' ? 'DEMAND' : 'UNDERTAKER'
      if (compData.leaderFlag === '1') { //牵头
        this[`${type}LeadForm`] = compData
        this.$set(this[`${type}LeadForm`], 'leadManager', { userAccount: '' })
        this.$set(this[`${type}LeadForm`], `leadMembers`, [])
        if (compData.projectTeamList) {
          compData.projectTeamList.forEach(user => {
            if (user.projectRoleCode === `PR-LEADER-${upperType}-MANAGER`) { //项目经理
              this[`${type}LeadForm`].leadManager = user
            } else if (user.projectRoleCode === `PR-LEADER-${upperType}-MEMBER`) { //项目成员
              this[`${type}LeadForm`][`leadMembers`].push(user)
            }
          })
        }
      } else { //配合
        let tempList = []
        let manager = null
        if (compData.projectTeamList) {
          compData.projectTeamList.forEach(user => {
            if (user.projectRoleCode === `PR-PARTNER-${upperType}-MEMBER`) { //项目经理、项目成员
              tempList.push(user)
            }
            if (user.projectRoleCode === `PR-PARTNER-${upperType}-MANAGER`) {
              manager = user
            }
          })
          // tempList = tempList.concat(manager) //最后放入项目经理，为了计算项目成员的逗号展示
        }
        // compData.projectTeamList = tempList
        compData.manager = manager
        compData.memberList = tempList
        compData.unitOptions = []
        compData.managerOptions = []
        compData.managerValidSuc = true
        compData.memberValidSuc = true
        compData.state = 'detail'
        this[`${type}CoopForm`].tableData.push(compData)
      }
    },
    //暂存
    async tempSave () {
      let params = await this.validate()
      if (params) {
        API.editProjectTeamD(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '团队信息保存成功',
              showClose: true
            })
            this.$emit('saveTeamInfo', true)
            bus.$emit('demandLeadForm', JSON.parse(JSON.stringify(this.demandLeadForm)))
            // bus.$emit('demandLeadFormManager', JSON.parse(JSON.stringify(this.demandLeadForm.leadManager)))
            bus.$emit('demandCoopForm', JSON.parse(JSON.stringify(this.demandCoopForm.tableData)))
            bus.$emit('undertakeLeadForm', JSON.parse(JSON.stringify(this.undertakeLeadForm)))
            bus.$emit('cooUndertakeLeadForm', JSON.parse(JSON.stringify(this.undertakeCoopForm.tableData)))
            this.changeValue(false, true)
            this.changeInfo(false)
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
    },
    async validate () {
      return new Promise((resolve, reject) => {
        let flag = true //默认可以保存
        let validD = this.$refs.demandCompany.validate()
        let validU = this.$refs.undertakeCompany.validate()
        let validJ = this.$refs.jointCompany.validate()
        // console.log('validate', validD, validU, validJ)
        if (!validD || !validU || !validJ) {
          flag = false
        }
        if (flag) {
          let params = this.getSubmitData()
          resolve(params)
        } else {
          resolve(false)
          return false
        }
      })
    },
    getSubmitData () {
      let params = {
        projectCode: this.$route.params.projectCode,
        projectCompanyList: []
      }
      let demand = this.$refs.demandCompany.getCompanyList()
      let undertake = this.$refs.undertakeCompany.getCompanyList()
      let joint = this.$refs.jointCompany.getCompanyList()
      params.projectCompanyList = [...demand, ...undertake, ...joint]
      // console.log('demand', demand)
      // console.log('undertake', undertake)
      // console.log('joint', joint)
      return params
    },
    //获取需求方和承担方清单
    getEmployerUndertaker (orgType) {
      return API.getEmployerUndertaker({ orgType: orgType })
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
              this.leadDemandUnitOptions = JSON.parse(JSON.stringify(companyList))
              this.coopDemandUnitOptions = JSON.parse(JSON.stringify(companyList))
            } else if (orgType === '2') { //承担方
              this.leadUndertakeUnitOptions = JSON.parse(JSON.stringify(companyList))
              this.coopUndertakeUnitOptions = JSON.parse(JSON.stringify(companyList))
            }
            // this.renderNum++
            // if (this.renderNum === 4) { //父组件数据处理完，接口获取成功
            //   this.initAllOptions()
            // }
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
    //联合攻关单位列表，57家一级单位
    getJointUnitList () {
      return API.provinceAbbr()
        .then(res => {
          if (res) {
            let companyList = []
            res.forEach(ele => {
              let company = {
                id: ele.id,
                organizationCode: ele.orgCode,
                organizationName: ele.orgName,
                companyCode: ele.abbr,
                companyName: ele.companyName,
                disabled: false
              }
              companyList.push(company)
            })
            this.jointUnitOptions = companyList
            // this.renderNum++
            // if (this.renderNum === 4) { //父组件数据处理完，接口获取成功
            //   this.initAllOptions()
            // }
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取省端独立域列表失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //设置单位的下拉禁用选项
    initUnitOptions () {
      this.setUnitOptionDisabled('leadDeamndUnit')
      this.setUnitOptionDisabled('coopDeamndUnit')
      this.setUnitOptionDisabled('leadUndertakeUnit')
      this.setUnitOptionDisabled('coopUndertakeUnit')
      this.setUnitOptionDisabled('jointUnit')
      this.coopDemandUnitOptions.table.forEach(ele => {
        ele.unitOptions = this.coopDemandUnitOptions
      })
      this.coopUndertakeUnitOptions.table.forEach(ele => {
        ele.unitOptions = this.coopUndertakeUnitOptions
      })
    },
    //设置单位的下拉禁用选项
    setUnitOptionDisabled (type) {
      let options = []
      let orgs = []
      switch (type) {
        case 'coopDeamndUnit':
          options = this.coopDemandUnitOptions
          orgs.push(this.demandLeadForm.organizationCode)
          this.demandCoopForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
        case 'leadDeamndUnit':
          options = this.leadDemandUnitOptions
          orgs.push(this.demandLeadForm.organizationCode)
          this.demandCoopForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
        case 'coopUndertakeUnit':
          options = this.coopUndertakeUnitOptions
          orgs.push(this.undertakeLeadForm.organizationCode)
          this.undertakeCoopForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
        case 'leadUndertakeUnit':
          options = this.leadUndertakeUnitOptions
          orgs.push(this.undertakeLeadForm.organizationCode)
          this.undertakeCoopForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
        case 'jointUnit':
          options = this.jointUnitOptions
          this.jointForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
      }
      options.forEach(ele => {
        let flag = orgs.some(orgCode => orgCode === ele.organizationCode)
        ele.disabled = flag
      })
    },
    addEventListener () {
      bus.$on('updateSubprojectInfo', data => {
        this.getAllSubProUnit(true)
      })
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
    changeValue (isInit = false, isSave = false) {
      if (!isInit) { //不是初始化时才执行
        this.changeInfo()
      }
      if (isInit) { //初始化时
        this.$nextTick(() => {
          let data = this.getSubmitData()
          bus.$emit('changeTeamInfo', data, isInit)
        })
      } else if (isSave) { //保存时
        this.$nextTick(() => {
          let data = this.getSubmitData()
          bus.$emit('changeTeamInfo', data, isInit)
        })
      }
    },
    /**
     * 获取所有子项目中关联的单位
     * @param {Boolean} isSetUnitDisable 是否需要设置单位是否可编辑样式
     */
    getAllSubProUnit (isSetUnitDisable) {
      API.queryProjectOrganizationBatch({ projectCode: this.$route.params.projectCode })
        .then(res => {
          this.allSubProUnit = res || []
          this.hasInitedProUnit = true
          if (isSetUnitDisable) {
            this.setSubProUnitDisabled(this.allSubProUnit)
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
    /**
     * 将子项目中关联单位设为只读，不可编辑
     */
    setSubProUnitDisabled (allSubProUnit) {
      let deamndUnitFlag = this.judgeIn(allSubProUnit, this.demandLeadForm.organizationCode, '1')
      let undertakeUnitFlag = this.judgeIn(allSubProUnit, this.undertakeLeadForm.organizationCode, '2')

      this.$set(this.demandLeadForm, 'unitDisabled', deamndUnitFlag !== '')
      this.$set(this.demandLeadForm, 'msg', deamndUnitFlag)
      this.$set(this.undertakeLeadForm, 'unitDisabled', undertakeUnitFlag !== '')
      this.$set(this.undertakeLeadForm, 'msg', undertakeUnitFlag)
      this.demandCoopForm.tableData.forEach(ele => {
        let flag = this.judgeIn(allSubProUnit, ele.organizationCode, '1')
        this.$set(ele, 'unitDisabled', ele.organizationCode && flag !== '')
        this.$set(ele, 'msg', flag)
      })
      this.undertakeCoopForm.tableData.forEach(ele => {
        let flag = this.judgeIn(allSubProUnit, ele.organizationCode, '2')
        this.$set(ele, 'unitDisabled', ele.organizationCode && flag !== '')
        this.$set(ele, 'msg', flag)
      })
    },
    /**
     * 判断单位是否已被子项目关联不可删除
     * @param {Array} 子项目关联单位对象数组
     * @param {value} 对比的组织编码
     * @param {type} 组织类型：1需求单位，2承担单位
     */
    judgeIn (arr, value, type) {
      let msg = ''
      arr.some(item => {
        if (item.organizationCode === value && type === item.type) {
          msg = item.message
          return true
        }
      })
      return msg
    }
  },
  created () {
    this.addEventListener()
    this.getAllSubProUnit()
  }
}
</script>

<style lang="scss" scoped>
.project-panel .panel-body {
  margin-bottom: 0;
}
.DSTeamInfoEdit /deep/{
  .project-panel .panel-body{
    margin-bottom: 0;
  }
  .project-panel {
    margin-bottom: 0;
  }
  .xmcy .el-form-item__content {
    display: inline-block;
    vertical-align: top;
     width: 100%;
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
      .disabled{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba($color: #f0f0f0, $alpha: 0.8);
      }
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
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
     .addcon{
       border: 1px solid #E9E9E9;
       margin-bottom: 20px;
       &:last-child{
         margin-bottom: 0;
       }
    }
    .required span{
      position: relative;
        &::before{
          // font-size: 20px;
          color: red;
          content: '*';
          position: absolute;
          left: -10px;
          top: 0px;
      }
    }
    .tableForm{
      border: 1px solid #E9E9E9;
      border-bottom: none;
    }
    .el-form-item.coop{
      width:100%;
      /deep/{
      .el-form-item__content{
        width:100%;
        .row-item{
        width:100%;
        }
        }
      }
    }
}
</style>
