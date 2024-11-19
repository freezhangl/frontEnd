<template>
  <div class="basic-info">
    <project-panel title="基本信息" @changeExpand="changeExpand" :show-expand="showExpand">

      <div class="basic-body">
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="130px"
          v-if="infoType == 'simple'"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编码:" prop="projectCode">
                {{ruleForm.projectCode}}
                <el-tooltip v-if="ruleForm.accountingNo" :content="'项目核算编码：'+ruleForm.accountingNo" placement="top">
                  <i class="el-icon-info accountingNo"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.accountingNo">
              <el-form-item label="项目核算编码：" style="word-wrap:break-word">
                {{ruleForm.accountingNo}}
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="ruleForm.accountingNo">
              <el-form-item label="项目名称:" prop="projectName" style="word-wrap:break-word">
                {{ruleForm.projectName}}
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="!ruleForm.accountingNo">
              <el-form-item label="项目名称:" prop="projectName" style="word-wrap:break-word">
                {{ruleForm.projectName}}
              </el-form-item>
            </el-col>
           <!-- <el-col :span="8">
              <el-form-item label="项目分类:" prop="projectType">
                {{ruleForm.projectTypeValue}}
              </el-form-item>
            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="计划立项时间:" prop="planApprovalTime">
                {{ruleForm.planApprovalTime | date}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划结项时间:" prop="planFinishTime">
                {{ruleForm.planFinishTime | date}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团项目级别:" prop="projectLevel">
                {{ruleForm.projectLevelValue}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否研发包:" prop="developPackage">
                <!-- {{ruleForm.developPackage == 1 ? '是' : '否'}} -->
                {{ruleForm.developPackage == 'IS_RD_1' ? '是' : '否'}}
                   &nbsp;&nbsp;
                <el-tooltip :content="'对于部分技术支撑、运维支撑、产品支撑、系统优化、功能迭代等日常工作中大任务下包含较多规模较小、任务不易细化明确的研发活动，按照研发包方式管理（简称：研发包项目）。项目执行中，按照实际研发任务需求，在该研发包下发起若干任务申请。每一项任务申请应完成需求审批、结果确认等闭环管理。'" placement="top">
                  <i class="el-icon-info accountingNo"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="130px"
          v-else
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编码:" prop="projectCode" :class="{'highlightStyle':highlightProps.projectCode}">
                {{ruleForm.projectCode}}
                <el-tooltip v-if="ruleForm.accountingNo" :content="'项目核算编码：'+ruleForm.accountingNo" placement="top">
                  <i class="el-icon-info accountingNo"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.accountingNo">
              <el-form-item label="项目核算编码：" style="word-wrap:break-word">
                {{ruleForm.accountingNo}}
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="ruleForm.accountingNo">
              <el-form-item
                label="项目名称:"
                prop="projectName"
                style="word-wrap:break-word"
                :class="{'highlightStyle':highlightProps.projectName}">
                {{ruleForm.projectName}}
              </el-form-item>
            </el-col>
            <el-col :span="16" v-if="!ruleForm.accountingNo">
              <el-form-item
                label="项目名称:"
                prop="projectName"
                style="word-wrap:break-word"
                :class="{'highlightStyle':highlightProps.projectName}">
                {{ruleForm.projectName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目来源:" prop="projectSource" :class="{'highlightStyle':highlightProps.projectSource}">
                {{ruleForm.projectSourceValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团项目类别:" prop="projectClass" :class="{'highlightStyle':highlightProps.projectClass}">
                {{ruleForm.projectClassValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="研发性质:" prop="developProperty" :class="{'highlightStyle':highlightProps.developProperty}">
                {{ruleForm.developPropertyValue}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
           <!-- <el-col :span="8">
              <el-form-item label="项目分类:" prop="projectType" :class="{'highlightStyle':highlightProps.projectType}">
                {{ruleForm.projectTypeValue}}
              </el-form-item>
            </el-col>-->
            <el-col :span="8">
              <el-form-item label="集团项目级别:" prop="projectLevel" :class="{'highlightStyle': highlightProps.projectLevel}">
                {{ruleForm.projectLevelValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="费用类别:" prop="projectExpenditureType" :class="{'highlightStyle':highlightProps.projectExpenditureType}">
                {{ruleForm.projectExpenditureTypeValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目状态:" prop="projectDetailsStatus" :class="{'highlightStyle':highlightProps.projectDetailsStatus}">
                {{ruleForm.projectDetailsStatus | status}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="计划立项时间:" prop="planApprovalTime" :class="{'highlightStyle':highlightProps.planApprovalTime}">
                {{ruleForm.planApprovalTime | date}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划结项时间:" prop="planFinishTime" :class="{'highlightStyle':highlightProps.planFinishTime}">
                {{ruleForm.planFinishTime | date}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期间归属:" prop="periodOwnership" :class="{'highlightStyle':highlightProps.periodOwnership}">
                {{ruleForm.periodOwnershipValue}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="实际立项时间:" prop="actualApprovalTime" :class="{'highlightStyle':highlightProps.actualApprovalTime}">
                {{ruleForm.actualApprovalTime | date}}
              </el-form-item>
            </el-col>
            <el-col v-if="ruleForm.projectDetailsStatus != 0 || ruleForm.associatePlan == 0" :span="8">
              <el-form-item label="实际结项时间:" prop="actualFinishTime" :class="{'highlightStyle':highlightProps.actualFinishTime}">
                {{ruleForm.actualFinishTime | date}}
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="项目所属年份:" prop="projectYear" :class="{'highlightStyle':highlightProps.projectYear}">
                {{ruleForm.projectYear}}
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="是否研发包项目:" prop="developPackage" :class="{'highlightStyle':highlightProps.developPackage}">
                {{ruleForm.developPackage == 'IS_RD_1' ? '是' : '否'}}
                  &nbsp;&nbsp;
                <el-tooltip :content="'对于部分技术支撑、运维支撑、产品支撑、系统优化、功能迭代等日常工作中大任务下包含较多规模较小、任务不易细化明确的研发活动，按照研发包方式管理（简称：研发包项目）。项目执行中，按照实际研发任务需求，在该研发包下发起若干任务申请。每一项任务申请应完成需求审批、结果确认等闭环管理。'" placement="top">
                  <i class="el-icon-info accountingNo"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </project-panel>
  </div>
</template>
<script>
import API from '@/serve/API_project'
import projectPanel from '@/controller/components/projectPanel'
import { getStore } from '@/store'
export default {
  props: {
    infoType: {
      type: String,
      default: 'all'
    },
    projectCode: {
      type: String,
      default: ''
    },
    receiveData: {
      type: Object,
      default: () => {}
    },
    diffProps: {
      type: Object,
      default: () => {}
    },
    showExpand: {
      type: Boolean,
      default: true
    }
  },
  filters: {
    date: function (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return Y + M + D
    },
    source: function (val) {
      switch (val) {
        case 'PS-COMPANY-DEVELOP' :
          return '公司研发'
        case 'PS-NATION-ALLOCATION' :
          return '国拨'
        case 'PS-EDUCATION-FUND':
          return '教育部基金'
      }
    },
    cate: function (val) {
      switch (val) {
        case 'IC_D' :
          return '自立项目-产品开发及现网支撑'
        case 2 :
          return ''
      }
    },
    develop: function (val) {
      switch (val) {
        case 'DP-TECHNOLOGY-RESEARCH' :
          return '技术研究'
        case 'DP-PRODUCT-DEVELOP-SUPPORT' :
          return '产品开发及现网运营支撑'
        case 'DP-OPERATION-SUPPORT':
          return '运营支撑'
      }
    },
    cost: function (val) {
      switch (val) {
        case 'PET-OPEX' :
          return '费用化'
        case 'PET-CAPEX' :
          return '资本化'
      }
    },
    status: function (val) {
      switch (parseInt(val)) {
        case 0 :
          return '草稿'
        case 1 :
          return '立项审批中'
        case 2 :
          return '已立项'
        case 3 :
          return '变更审批中'
        case 4 :
          return '终止审批中'
        case 5 :
          return '结项审批中'
        case 6 :
          return '已终止'
        case 7 :
          return '已结项'
        case 8 :
          return '已关闭'
        case 10 :
          return '预立项审批中'
        case 11 :
          return '已预立项'
        default:
          return ''
      }
    },
    owner: function (val) {
      switch (val) {
        case 'BE-1' :
          return '年度新立'
        case 'BE-2' :
          return '结转项目'
        default:
          return ''
      }
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          this.ruleForm = JSON.parse(JSON.stringify(val))
          // let param = {
          //   codes: 'PROJECT-SOURCE,DEVELOP-PROPERTY,PROJECT-EXPENDITURE-TYPE,ITEM_CATEGORY'
          // }
          // API.dictValByCodes(param)
          //   .then(res => {
          //     res.forEach(dicItem => {
          //       switch (dicItem.code) {
          //         case 'PROJECT-SOURCE':
          //           dicItem.dictionarys.some(item => {
          //             if (item.valueCode === this.ruleForm.projectSource) {
          //               // this.ruleForm.projectSourceValue = item.name
          //               this.$set(this.ruleForm, 'projectSourceValue', item.name)
          //               return true
          //             }
          //           })
          //           break
          //         case 'DEVELOP-PROPERTY':
          //           dicItem.dictionarys.some(item => {
          //             if (item.valueCode === this.ruleForm.developProperty) {
          //               // this.ruleForm.developPropertyValue = item.name
          //               this.$set(this.ruleForm, 'developPropertyValue', item.name)
          //               return true
          //             }
          //           })
          //           break
          //         case 'PROJECT-EXPENDITURE-TYPE':
          //           dicItem.dictionarys.filter(item => {
          //             if (item.valueCode === this.ruleForm.projectExpenditureType) {
          //               // this.ruleForm.projectExpenditureTypeValue = item.name
          //               this.$set(this.ruleForm, 'projectExpenditureTypeValue', item.name)
          //               return true
          //             }
          //           })
          //           break
          //         case 'ITEM_CATEGORY':
          //           dicItem.dictionarys.filter(item => {
          //             if (item.valueCode === (this.ruleForm.projectClass || 'IC_D')) {
          //               // this.ruleForm.projectExpenditureTypeValue = item.name
          //               this.$set(this.ruleForm, 'projectClassValue', item.name)
          //               return true
          //             }
          //           })
          //           break
          //       }
          //     })
          //   })
          //   .catch(err => {
          //     this.$message.error(err.message || '数据字典失败')
          //   })
          // // this.getDictionaryValuesByComponyCode('PROJECT-LEVEL')
          // this.getDictionaryValuesByComponyCode('PROJECT-TYPE')
          // this.getDictValByCode()
        }
      }
    },
    diffProps: {
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          this.highlightProps = JSON.parse(JSON.stringify(val))
        }
      }
    }
  },
  data () {
    return {
      startTimeOptions: {
        disabledDate: time => {
          if (this.ruleForm.planFinishTime) {
            return (
              time.getTime() >
              new Date(this.ruleForm.planFinishTime)
                .getTime()
            )
          }
        }
      },
      endTimeOptions: {
        disabledDate: time => {
          if (this.ruleForm.planApprovalTime) {
            return (
              time.getTime() <
              new Date(this.ruleForm.planApprovalTime)
                .getTime()
            )
          }
        }
      },
      ruleForm: {
        id: '', //主键
        projectCode: '', //项目编码
        projectName: '', //项目名称
        projectSource: '', //项目来源
        projectCategory: 'PC-SELF-UNIT', //项目类别
        developProperty: '', //研发性质
        projectType: '', //项目类型
        projectLevel: '', //项目级别
        planApprovalTime: '', //计划立项时间
        planFinishTime: '', //计划结项时间
        actualApprovalTime: '', //实际立项时间
        actualFinishTime: '', //实际结项时间
        projectExpenditureType: '', //费用类别
        periodOwnership: '年度新立', //期间归属
        projectYear: new Date()
          .getFullYear(), //项目所属年份
        projectDetailsStatus: '未立项', //项目状态
        developPackage: '' //是否研发包
      },
      sourceList: [
        {
          name: '公司研发',
          valueCode: 'PS-COMPANY-DEVELOP'
        },
        { name: '国拨', valueCode: 'PS-NATION-ALLOCATION' },
        { name: '教育部基金', valueCode: 'PS-EDUCATION-FUND' }
      ], //项目来源
      cateList: [
        {
          name: '单位自立',
          valueCode: 'PC-SELF-UNIT'
        },
        {
          name: '集团统筹-承担方',
          valueCode: 'PC-UNDERTAKE-UNIT'
        },
        {
          name: '集团统筹-需求方',
          valueCode: 'PC-DEMAND-UNIT'
        }
      ],
      developPropertyList: [
        {
          name: '技术研究',
          valueCode: 'DP-TECHNOLOGY-RESEARCH'
        },
        {
          name: '产品开发',
          valueCode: 'DP-PRODUCT-DEVELOP'
        },
        {
          name: '运营支撑',
          valueCode: 'DP-OPERATION-SUPPORT'
        }
      ], //研发性质
      typeOptions: [], //项目类型
      levelList: [], //项目级别
      costTypeList: [
        {
          name: '费用化',
          valueCode: 'PET-OPEX'
        },
        {
          name: '资本化',
          valueCode: 'PET-CAPEX'
        }
      ], //费用类别
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          {
            min: 1,
            max: 256,
            message: '长度在 1 到 256 个字符',
            trigger: 'blur'
          }
        ],
        projectSource: [
          { required: true, message: '请选择项目来源', trigger: 'change' }
        ],
        developProperty: [
          { required: true, message: '请选择研发性质', trigger: 'change' }
        ],
        projectType: [
          { required: true, message: '请选择项目分类', trigger: 'change' }
        ],
        projectLevel: [
          { required: true, message: '请选择项目级别', trigger: 'change' }
        ],
        projectExpenditureType: [
          { required: true, message: '请选择费用类别', trigger: 'change' }
        ],
        planApprovalTime: [
          { required: true, message: '请选择计划立项时间', trigger: 'blur' }
        ],
        planFinishTime: [
          { required: true, message: '请选择计划结项时间', trigger: 'blur' }
        ],
        developPackage: [
          { required: true, message: '请选择计划结项时间', trigger: 'change' }
        ]
      },
      highlightProps: {} //高亮属性字段
    }
  },
  components: {
    projectPanel
  },
  computed: {},
  methods: {
    changeSource (source) {
      API.queryProjectCode({
        projectSource: source,
        year: this.ruleForm.projectYear
      })
        .then(res => {
          this.ruleForm.projectCode = res
        })
        .catch(err => {
          this.$message.error(err.message || '获取项目编码失败')
        })
    },
    saveBasicInfo () {
      this.$refs['ruleForm'].validateField(['projectSource'])

      if (this.ruleForm.projectCode) {
        API.saveProjectBaseInfo(this.ruleForm)
          .then(data => {
            this.$message.success('暂存成功')
            this.ruleForm.id = data
            this.$emit('update', this.ruleForm.projectCode)
          })
          .catch(err => {
            this.$message.error(err.message || '暂存失败')
          })
      }
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
    changeTime () {
      if (
        this.ruleForm.planApprovalTime &&
        this.ruleForm.planFinishTime
      ) {
        let startYear = new Date(
          this.ruleForm.planApprovalTime
        )
          .getFullYear()
        let endYear = new Date(this.ruleForm.planFinishTime)
          .getFullYear()
        this.$emit('changeTime', [startYear, endYear])
      }
    },
    initBaseInfo (info) {
      this.ruleForm = JSON.parse(JSON.stringify(info))
    },
    changeExpand (isExpand) {
      this.$emit('changeExpand', isExpand)
    },
    getDictionaryValuesByComponyCode (typeCode) {
      API.dictionaryValuesCompanyCode({ typeCode, companyCode: getStore().getters['USERENTITY/userInfo'].userAuth.companyCode })
        .then(res => {
          if (res && res.length > 0) {
            if (typeCode === 'PROJECT-TYPE') {
              res.some(item => {
                if (item.valueCode === this.ruleForm.projectType) {
                  // this.ruleForm.projectTypeValue = item.name
                  this.$set(this.ruleForm, 'projectTypeValue', item.name)
                  return true
                }
              })
            } else {
              res.some(item => {
                if (item.valueCode === this.ruleForm.projectLevel) {
                  // this.ruleForm.projectLevelValue = item.name
                  this.$set(this.ruleForm, 'projectLevelValue', item.name)
                  return true
                }
              })
            }
          }
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    getDictValByCode () {
      API.dictValByCode('CO-PROJECT-LEVEL')
        .then(res => {
          res.some(item => {
            if (item.valueCode === this.ruleForm.projectLevel) {
              // this.ruleForm.projectLevelValue = item.name
              this.$set(this.ruleForm, 'projectLevelValue', item.name)
              return true
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    }
  },
  created () {
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
    .highlightStyle .el-form-item__content{
      color: #FF3F3B;
    }
    .accountingNo{
      margin-left: 5px;
      @include color();
    }
  }
}
/deep/ .el-select-dropdown.el-popper.is-multiple{
  /deep/ .el-scrollbar {
    display: block !important;
  }
}
</style>
