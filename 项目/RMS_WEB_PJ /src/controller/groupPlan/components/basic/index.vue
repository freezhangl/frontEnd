<template>
  <div class="basic-info">
    <project-panel title="基本信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" @click="saveBasicInfo" v-if='!meberEditFlag'>保存本区块信息</el-button>
      </template>

      <div class="basic-body">
        <el-form
          :model="ruleForm"
          :rules="projectCategory === 'u' ? rulesU : (developPackage === 'IS_RD_0' ? rulesDS : rulesDG)"
          ref="ruleForm"
          label-width="130px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编码:" prop="projectCode">
                <el-input
                  v-model="ruleForm.projectCode"
                  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目核算编码:" prop="accountingNo">
                <el-input
                  v-model="ruleForm.accountingNo"
                  disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="项目名称:" prop="projectName">
                <el-input
                  :disabled='meberEditFlag'
                  v-model="ruleForm.projectName"
                  placeholder="请输入项目名称"
                  @input="chageTitle"
                  @change="changeInfo"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="计划立项时间:" prop="planApprovalTime">
                <el-date-picker
                  v-model="ruleForm.planApprovalTime"
                  :picker-options="startTimeOptions"
                  type="date"
                  :default-value="new Date(ruleForm.planFinishTime).getFullYear()!==new Date().getFullYear()?Date.now():parseInt(ruleForm.planFinishTime)"
                  value-format="timestamp"
                  placeholder="选择日期"
                  @change="changeTime('start')"
                  :disabled="((developPackage==='IS_RD_1' && projectCategory === 'd') || (ruleForm.projectDetailsStatus !== '0' && ruleForm.projectDetailsStatus !== '11'))||meberEditFlag"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划结项时间:" prop="planFinishTime">
                <el-date-picker
                  v-model="ruleForm.planFinishTime"
                  :picker-options="endTimeOptions"
                  type="date"
                  :default-value="parseInt(ruleForm.planApprovalTime) || Date.now()"
                  value-format="timestamp"
                  placeholder="选择日期"
                  @change="changeTime('end')"
                  :disabled="(developPackage==='IS_RD_1' && projectCategory === 'd')||meberEditFlag"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="projectCategory === 'd'" label="期间归属:" prop="periodOwnership">
                <el-select
                  v-model="ruleForm.periodOwnership"
                  placeholder="请选择"
                  disabled
                  @change="changeInfo"
                >
                  <el-option
                    v-for="item in ownerList"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="projectCategory === 'u'" label="费用类别:" prop="projectExpenditureType">
                <el-select
                  v-model="ruleForm.projectExpenditureType"
                  placeholder="请选择"
                  :disabled="meberEditFlag"
                  @change="changeInfo"
                >
                  <el-option
                    v-for="item in costTypeList"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目状态:" prop="projectDetailsStatus">
                <el-select
                  v-model="ruleForm.projectDetailsStatus"
                  placeholder="请选择"
                  disabled
                  @change="changeInfo"
                >
                  <el-option
                    v-for="item in projectStatusList"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团项目类别:" prop="projectClass">
                <el-select
                  v-model="ruleForm.projectClass"
                  placeholder="请选择"
                  disabled
                  @change="changeInfo">
                  <el-option
                    v-for="item in cateList"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团项目级别:" prop="projectLevel">
                <el-select
                  v-model="ruleForm.projectLevel"
                  :disabled="projectCategory === 'd'||meberEditFlag"
                  placeholder="请选择"
                  @change="changeInfo">
                  <el-option
                    v-for="item in levelOptions"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item v-if="projectCategory === 'd'" label="费用类别:" prop="projectExpenditureType">
                <el-select
                  v-model="ruleForm.projectExpenditureType"
                  placeholder="请选择"
                  :disabled="ruleForm.projectDetailsStatus !== '0'||meberEditFlag"
                  @change="changeInfo"
                >
                  <el-option
                    v-for="item in costTypeList"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item v-if="projectCategory === 'u'" label="项目分类:" prop="projectType">
                <el-select
                  :disabled='meberEditFlag'
                  v-model="ruleForm.projectType"
                  placeholder="请选择"
                  @change="changeInfo"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
    </project-panel>
  </div>
</template>
<script>
import API from '@/serve/API_groupPlanProject'
import { getStore } from '@/store'
import projectPanel from '@/controller/components/projectPanel'
import bus from '@/common/bus'
export default {
  props: {
    projectCode: {
      type: String,
      default: ''
    },
    receiveData: {
      type: Object,
      default: () => {}
    },
    tipLanguage: {
      type: Object,
      default: () => {}
    },
    planRangeTime: {
      type: Array,
      default: () => []
    },
    achievementLimitMinTime: null,
    achievementLimitMaxTime: null,
    mileStoneLimitMinTime: null,
    mileStoneLimitMaxTime: null
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          document.title = val.projectName
          this.ruleForm = JSON.parse(JSON.stringify(val))
          this.timer = setInterval(() => {
            if (this.isLoadedDic) {
              if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
              }
            }
            if (this.projectCategory === 'u') {
            // IC_A - 应用基础研究
            // IC_B - 关键核心技术攻关
            // IC_C - 产品开发及现网支撑-总部项目
            // IC_D - 产品开发及现网支撑-自立项目
            // IC_E - 关键核心技术攻关-智慧中台及关键能力
            // IC_F - 关键核心技术攻关-CHBN关键平台及终端
            // IC_G - 关键核心技术攻关-新基建
              let tempLevel = []
              if (this.ruleForm.projectClass === 'IC_C') { // 重点级、一般级
                if (this.developPackage === 'IS_RD_0') { //非一般支撑包
                  tempLevel = this.levelList.filter(item => item.valueCode === 'PL-KEY-PJ' || item.valueCode === 'PL-GENERAL-PJ')
                } else { //一般支撑包
                  tempLevel = this.levelList.filter(item => item.valueCode === 'PL-GENERAL-PJ')
                }
              } else { // 战略级、重点级
                tempLevel = this.levelList.filter(item => item.valueCode === 'PL-STRATEGY-PJ' || item.valueCode === 'PL-KEY-PJ')
              }
              if (!tempLevel.some(ele => ele.valueCode === this.ruleForm.projectLevel)) {
                this.ruleForm.projectLevel = ''
                this.ruleForm.projectLevelValue = ''
              }
              setTimeout(() => {
                this.rulesU.projectLevel[0].trigger = 'change'
              }, 0)
              this.levelOptions = tempLevel
            } else {
              this.levelOptions = this.levelList
            }
          }, 500)
        }
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
            if (add.length === Object.getOwnPropertyNames(val).length - 1) {
              this.language = '基本信息中所有可编辑字段都是基线字段；'
              return
            }
            this.language = `基本信息中的基线字段：${add.join('、')}；`
          } else {
            this.language = '基本信息中没有基线字段；'
          }
        }
      }
    }
  },
  data () {
    var validateDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择计划结项时间'))
      }
      //对比零点时间戳
      let approvalTime = new Date(new Date(this.ruleForm.planApprovalTime)
        .toLocaleDateString())
        .getTime()
      let valueTime = new Date(new Date(value)
        .toLocaleDateString())
        .getTime()
      if (approvalTime && valueTime < approvalTime) {
        callback(new Error('计划结项时间不能早于计划立项时间'))
      }
      callback()
    }
    var validateStart = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择计划立项时间'))
      }
      if (this.ruleForm.projectStatus !== '1') {
        if (new Date(value)
          .getFullYear() !== new Date()
          .getFullYear()) {
          callback(new Error('计划立项时间只能是当前年份'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      language: '基本信息中所有可编辑字段都是基线字段；',
      checkData: [
        {
          label: 'projectName',
          value: '项目名称'
        }, {
          label: 'projectLevel',
          value: '集团项目级别'
        }, {
          label: 'planApprovalTime',
          value: '计划立项时间'
        }, {
          label: 'planFinishTime',
          value: '计划结项时间'
        }, {
          label: 'projectExpenditureType',
          value: '费用类别'
        }],
      meberEditFlag: false,
      startTimeOptions: {
        disabledDate: time => {
          if (this.ruleForm.planFinishTime) {
            return (
              time.getTime() >
              new Date(this.ruleForm.planFinishTime)
                .getTime() ||
              time.getFullYear() !==
              new Date()
                .getFullYear()
            )
          }
          return (
            time.getFullYear() !==
            new Date()
              .getFullYear()
          )
        }
      },
      endTimeOptions: {
        disabledDate: time => {
          if (this.ruleForm.planApprovalTime) {
            return (
              time.getTime() <
              new Date(this.ruleForm.planApprovalTime)
                .getTime() ||
            time.getFullYear() <
            new Date()
              .getFullYear()
            )
          }
          return (
            time.getFullYear() <
            new Date()
              .getFullYear()
          )
        }
      },
      ruleForm: {
        id: '', //主键
        projectCode: '', //项目编码
        parentCode: this.$route.query.demandProjectCode, //需求单位项目编码
        projectName: '', //项目名称
        projectClass: '', //集团项目类别
        projectLevel: '', //集团项目级别
        planApprovalTime: '', //计划立项时间
        planFinishTime: '', //计划结项时间
        projectExpenditureType: '', //费用类别
        periodOwnership: 'BE-1', //期间归属
        projectYear: new Date()
          .getFullYear(), //项目所属年份
        projectDetailsStatus: '0' //项目状态
        // projectType: '' //项目分类
      },
      cateList: [],
      projectStatusList: [
        { name: '草稿', valueCode: '0' },
        { name: '计划调整审批中', valueCode: '9' },
        { name: '立项审批中', valueCode: '1' },
        { name: '已立项', valueCode: '2' },
        { name: '变更审批中', valueCode: '3' },
        { name: '终止审批中', valueCode: '4' },
        { name: '结项审批中', valueCode: '5' },
        { name: '已终止', valueCode: '6' },
        { name: '已结项', valueCode: '7' },
        { name: '已关闭', valueCode: '8' },
        {
          valueCode: '10',
          name: '预立项审批中'
        },
        {
          valueCode: '11',
          name: '已预立项'
        }
      ], //项目状态
      ownerList: [], //期间归属
      typeOptions: [], //项目类型
      levelList: [], //集团项目级别
      costTypeList: [], //费用类别
      rulesDG: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      rulesDS: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        planApprovalTime: [
          { required: true, validator: validateStart, trigger: ['change', 'blur'] }
        ],
        planFinishTime: [
          { required: true, validator: validateDate, trigger: ['change', 'blur'] }
        ]
      },
      rulesU: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        planApprovalTime: [
          { required: true, validator: validateStart, trigger: ['blur', 'change'] }
        ],
        planFinishTime: [
          { required: true, validator: validateDate, trigger: ['blur', 'change'] }
        ],
        projectExpenditureType: [
          { required: true, message: '请选择费用类别', trigger: 'change' }
        ],
        projectLevel: [
          { required: true, message: '请选择集团项目级别', trigger: 'blur' }
        ]
        // projectType: [
        //   { required: true, message: '请选择项目分类', trigger: 'change' }
        // ]
      },
      projectCategory: '', //需求d 承担u
      developPackage: 'IS_RD_0', //是否研发包
      levelOptions: [], //集团项目级别
      isLoadedDic: false, //是否已调用数据字典
      timer: null
    }
  },
  components: {
    projectPanel
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate('planApprovalTime')
        this.$refs.ruleForm.clearValidate('planFinishTime')
      }, 1000)
    })
  },
  methods: {
    chageTitle (val) {
      document.title = this.ruleForm.projectName
    },
    changeSource (source) {
      API.queryProjectCode({
        year: this.ruleForm.projectYear
      })
        .then(res => {
          this.ruleForm.projectCode = res
          //this.$emit('update', this.ruleForm.projectCode)
        })
        .catch(err => {
          this.$message.error(err.message || '获取项目编码失败')
        })
    },
    saveBasicInfo () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          // if (!this.validate1()) return
          let projectCode = this.ruleForm.projectCode ? this.ruleForm.projectCode : '{}'
          this.ruleForm.businessFormUrl = `/groupPlan/projectEdit/${projectCode}?developPackage=${this.developPackage}&projectCategory=${this.projectCategory}`
          let interFaceName = ''
          if (this.projectCategory === 'd') {
            interFaceName = 'editProjectBaseInfoD'
          } else {
            interFaceName = 'editProjectBaseInfoU'
            if (this.$route.query.letterCode) {
              this.ruleForm.letterCode = this.$route.query.letterCode
            }
          }
          if (interFaceName) {
            API[interFaceName](this.ruleForm)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: '基本信息保存成功',
                  showClose: true
                })
                this.ruleForm = data
                this.ruleForm.id = data.id
                this.ruleForm.projectCode = data.projectCode
                this.ruleForm.projectCategory = data.projectCategory
                this.ruleForm.developPackage = data.developPackage
                this.$emit('update', this.ruleForm)
                bus.$emit('planTimeChange')
                this.changeInfo(false)
              })
              .catch(err => {
                this.$message.error(err.message || '基本信息保存失败')
              })
          }
        } else {
          return false
        }
      })
    },
    async validate () {
      return new Promise((resolve, reject) => {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            resolve(this.ruleForm)
          } else {
            resolve(false)
            return false
          }
        })
      })
    },
    validate1 () {
      //转化成零点时间戳进行对比
      let startTime = this.planRangeTime[0] ? new Date(new Date(this.planRangeTime[0])
        .toLocaleDateString())
        .getTime() : ''
      let endTime = this.planRangeTime[1] ? new Date(new Date(this.planRangeTime[1])
        .toLocaleDateString())
        .getTime() : ''
      let achMinTime = this.achievementLimitMinTime ? new Date(new Date(this.achievementLimitMinTime)
        .toLocaleDateString())
        .getTime() : ''
      let achMaxTime = this.achievementLimitMaxTime ? new Date(new Date(this.achievementLimitMaxTime)
        .toLocaleDateString())
        .getTime() : ''
      let mileMinTime = this.mileStoneLimitMinTime ? new Date(new Date(this.mileStoneLimitMinTime)
        .toLocaleDateString())
        .getTime() : ''
      let mileMaxTime = this.mileStoneLimitMaxTime ? new Date(new Date(this.mileStoneLimitMaxTime)
        .toLocaleDateString())
        .getTime() : ''
      // 添加计划立项结项时间限制 begin
      let msg = ''
      let msgArr = []
      if (achMinTime && startTime > achMinTime) {
        msgArr.push('计划立项时间不可大于任何成果的预期交付时间！')
      }
      if (mileMinTime && startTime > mileMinTime) {
        msgArr.push('计划立项时间不可大于任何里程碑的计划完成时间！')
      }
      if (achMaxTime && endTime < achMaxTime) {
        msgArr.push('计划结项时间不可小于任何成果的预期交付时间！')
      }
      if (mileMaxTime && endTime < mileMaxTime) {
        msgArr.push('计划结项时间不可小于任何里程碑的计划完成时间！')
      }
      msgArr.forEach((ele, index) => {
        if (index === 0) {
          msg += ele
        } else {
          msg = msg + '<br/>' + ele
        }
      })
      if (msg) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: msg,
          type: 'warning',
          showClose: true
        })
        return false
      } else {
        return true
      }
      // 添加计划立项结项时间限制 end
    },
    getProjectName () {
      return this.ruleForm.projectName
    },
    changeTime (type) {
      if (
        this.ruleForm.planApprovalTime &&
        this.ruleForm.planFinishTime
      ) {
        let startYear = this.ruleForm.planApprovalTime
        let endYear = this.ruleForm.planFinishTime
        this.$emit('changeTime', [startYear, endYear], type)
        this.changeInfo()
      }
    },
    initBaseInfo (info) {
      this.ruleForm = JSON.parse(JSON.stringify(info))
    },
    setPlanTime (data, type) {
      if (type === 'start') {
        this.ruleForm.planApprovalTime = data
      } else {
        this.ruleForm.planFinishTime = data
      }
    },
    //有信息发生修改
    changeInfo (edited = true) {
      let params = {
        curBlock: 'baseInfo',
        hasEdited: edited
      }
      bus.$emit('groupPlanProjectEdit', params)
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  created () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
    this.projectCategory = this.$route.query.projectCategory || ''
    this.developPackage = this.$route.query.developPackage || ''
    document.title = '新增项目'
    // 批量获取集团项目级别、费用类别、项目状态、集团项目类别
    let param = {
      codes: 'CO-PROJECT-LEVEL,PROJECT-EXPENDITURE-TYPE,PR-SUB-STATE,ITEM_CATEGORY,BELONG'
    }
    API.dictValByCodes(param)
      .then(res => {
        res.forEach(dicItem => {
          switch (dicItem.code) {
            case 'CO-PROJECT-LEVEL':
              this.levelList = dicItem.dictionarys
              break
            case 'PROJECT-EXPENDITURE-TYPE':
              this.costTypeList = dicItem.dictionarys
              break
            case 'PR-SUB-STATE':
              // this.projectStatusList = dicItem.dictionarys
              break
            case 'ITEM_CATEGORY':
              this.cateList = dicItem.dictionarys
              break
            case 'BELONG':
              this.ownerList = dicItem.dictionarys
              break
          }
        })
        this.isLoadedDic = true
      })
      .catch(err => {
        this.isLoadedDic = true
        this.$message.error(err.message || '数据字典失败')
      })
    // 项目类型
    API.dictionaryValuesCompanyCode({ typeCode: 'PROJECT-TYPE', companyCode: getStore().getters['USERENTITY/userInfo'].userAuth.companyCode })
      .then(res => {
        this.typeOptions = res
      })
      .catch(err => {
        this.$message.error(err.message || '数据字典失败')
      })
  }
}
</script>
<style lang="scss" scoped>
.basic-info {
  .basic-body /deep/ {
    .el-form-item .el-input__inner {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
