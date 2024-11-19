<template>
  <div class="basic-info">
    <project-panel title="基本信息" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button class="normal-btn" @click="saveBasicInfo">保存本区块信息</el-button>
      </template>

      <div class="basic-body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编码:" prop="projectCode">
                <div class="progect-code">
                  <el-input
                    v-model="ruleForm.projectCode"
                    disabled
                    @change="changeInfo"></el-input>
                  <span class="sapn">
                    <el-tooltip v-if="ruleForm.accountingNo" :content="'项目核算编码：'+ ruleForm.accountingNo" placement="top">
                      <i class="el-icon-info accountingNo"></i>
                    </el-tooltip>
                  </span>
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.accountingNo">
              <el-form-item label="项目核算编码:" prop="accountingNo">
                <el-input
                  v-model="ruleForm.accountingNo"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16" v-if="!ruleForm.accountingNo">
              <el-form-item label="项目名称:" prop="projectName">
                <el-input
                  ref="projectName"
                  v-model="ruleForm.projectName"
                  placeholder="请输入项目名称"
                  @input="chageTitle"
                  @change="changeInfo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16" v-if="ruleForm.accountingNo">
              <el-form-item label="项目名称:" prop="projectName">
                <el-input
                  ref="projectName"
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
              <el-form-item label="项目来源:" prop="projectSource">
                <el-tooltip
                  placement="top"
                  :content="getTooltipName(ruleForm.projectSource,sourceList)"
                  :disabled="!getTooltipName(ruleForm.projectSource,sourceList)">
                  <el-select
                    ref="projectSource"
                    v-model="ruleForm.projectSource"
                    placeholder="请选择"
                    :disabled="!!ruleForm.id"
                    @change="changeInfo"
                  >
                    <el-option
                      :style="{ maxWidth: selectWidth +'px'} "
                      v-for="item in sourceList"
                      :key="item.valueCode"
                      :label="item.name"
                      :value="item.valueCode"
                    >
                      <el-tooltip
                        effect="dark"
                        placement="bottom-start"
                        :content="item.name"
                        :disabled="!showToolTip(item.name, selectWidth-40)">
                        <span>{{item.name}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团项目类别:" prop="projectClass">
                <el-tooltip
                  placement="top"
                  :content="getTooltipName(ruleForm.projectClass,cateList)"
                  :disabled="!getTooltipName(ruleForm.projectClass,cateList)">
                  <el-select
                    v-model="ruleForm.projectClass"
                    placeholder="请选择"
                    disabled
                    @change="changeInfo"
                  >
                    <el-option
                      v-for="item in cateList"
                      :key="item.valueCode"
                      :label="item.name"
                      :value="item.valueCode"
                    >
                    </el-option>
                  </el-select>
                </el-tooltip>
                <!-- <el-input v-model="ruleForm.projectCategory" disabled></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="研发性质:" prop="developProperty">
                <el-tooltip
                  placement="top"
                  :content="getTooltipName(ruleForm.developProperty,developPropertyList)"
                  :disabled="!getTooltipName(ruleForm.developProperty,developPropertyList)">
                  <el-select
                    :disabled="(ruleForm.associatePlan == 1 || ruleForm.projectDetailsStatus != 0) && !(ruleForm.projectDetailsStatus == '11')"
                    v-model="ruleForm.developProperty"
                    placeholder="请选择"
                    @change="changeInfo"
                  >
                    <el-option
                      :style="{ maxWidth: selectWidth +'px'} "
                      v-for="item in developPropertyList"
                      :key="item.valueCode"
                      :label="item.name"
                      :value="item.valueCode"
                    >
                      <el-tooltip
                        effect="dark"
                        placement="bottom-start"
                        :content="item.name"
                        :disabled="!showToolTip(item.name, selectWidth-40)">
                        <span>{{item.name}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item label="项目分类:" prop="projectType">
                <el-tooltip
                  placement="top-start"
                  :content="getTooltipName(ruleForm.projectType,typeOptions)"
                  :disabled="!getTooltipName(ruleForm.projectType,typeOptions)">
                  <el-select
                    v-model="ruleForm.projectType"
                    placeholder="请选择"
                    @change="changeInfo">
                    <el-option
                      :style="{ maxWidth: selectWidth +'px'} "
                      v-for="item in typeOptions"
                      :key="item.valueCode"
                      :label="item.name"
                      :value="item.valueCode"
                    >
                      <el-tooltip
                        effect="dark"
                        placement="bottom-start"
                        :content="item.name"
                        :disabled="!showToolTip(item.name, selectWidth-40)">
                        <span>{{item.name}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-col>-->
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
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团项目级别:" prop="projectLevel">
                <el-tooltip
                  placement="top-start"
                  :content="getTooltipName(ruleForm.projectLevel,levelOptions)"
                  :disabled="!getTooltipName(ruleForm.projectLevel,levelOptions)">
                  <el-select
                    v-model="ruleForm.projectLevel"
                    placeholder="请选择"
                    @change="changeInfo">
                    <el-option
                      :style="{ maxWidth: selectWidth +'px'}"
                      v-for="item in levelOptions"
                      :key="item.valueCode"
                      :label="item.name"
                      :value="item.valueCode"
                    >
                      <el-tooltip
                        effect="dark"
                        placement="bottom-start"
                        :content="item.name"
                        :disabled="!showToolTip(item.name, selectWidth-40)">
                        <span>{{item.name}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="费用类别:" prop="projectExpenditureType">
                <el-tooltip
                  placement="top-start"
                  :content="getTooltipName(ruleForm.projectExpenditureType,costTypeList)"
                  :disabled="!getTooltipName(ruleForm.projectExpenditureType,costTypeList)">
                  <el-select
                    v-model="ruleForm.projectExpenditureType"
                    placeholder="请选择"
                    :disabled="!!ruleForm.id"
                    @change="changeInfo"
                  >
                    <el-option
                      :style="{ maxWidth: selectWidth +'px'} "
                      v-for="item in costTypeList"
                      :key="item.valueCode"
                      :label="item.name"
                      :value="item.valueCode"
                    >
                      <el-tooltip
                        effect="dark"
                        placement="bottom-start"
                        :content="item.name"
                        :disabled="!showToolTip(item.name, selectWidth-40)">
                        <span>{{item.name}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-tooltip>
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
                  value-format="timestamp"
                  placeholder="选择日期"
                  @change="changeTime('start')"
                  :disabled="ruleForm.projectStatus == '1'"
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
                  value-format="timestamp"
                  placeholder="选择日期"
                  @change="changeTime('end')"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期间归属:" prop="periodOwnership">
                <el-select
                  v-model="ruleForm.periodOwnership"
                  placeholder="请选择"
                  disabled
                  @change="changeInfo"
                >
                  <el-option
                    v-for="item in ownerList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item label="项目所属年份:" prop="projectYear">
                <el-input
                  v-model="ruleForm.projectYear"
                  disabled
                  @change="changeInfo"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="是否研发包项目:" prop="developPackage">
                <el-radio-group
                  v-model="ruleForm.developPackage"
                  :disabled="!!ruleForm.id"
                  @change="changeInfo">
                  <!-- <el-radio label="1">是</el-radio> -->
                  <el-radio label="IS_RD_1">是</el-radio>
                  <!-- <el-radio label="0">否</el-radio> -->
                  <el-radio label="IS_RD_0">否</el-radio>
                </el-radio-group>
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
import { getStore } from '@/store'
import { isShowToolTip } from '@/utils/common.js'
import projectPanel from '@/controller/components/projectPanel'
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
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && JSON.stringify(val) !== '{}') {
          // val.periodOwnership = parseInt(val.periodOwnership)
          val.projectDetailsStatus = parseInt(val.projectDetailsStatus)
          document.title = val.projectName
          // 防止返回的null触发校验
          if (val.projectType === null) {
            val.projectType = ''
          }
          if (val.projectLevel === null) {
            val.projectLevel = ''
          }
          if (val.developProperty === null) {
            val.developProperty = ''
          }
          if (this.numWatch) {
            this.checkProjectSource(val.projectSource, val.projectSourceValue)
            this.checkProjectClass(val.projectClass, val.projectClassValue)
            this.checkProjectExpenditureType(val.projectExpenditureType, val.projectExpenditureTypeValue)
            this.checkPeriodOwnership(val.periodOwnership, val.periodOwnershipValue)
            this.checkDevelopProperty(val.developProperty, val.developPropertyValue)
            this.checkProjectType(val.projectType, val.projectTypeValue)
            this.checkProjectLevel(val.projectLevel, val.projectLevelValue)
            this.numWatch = false
          }
          this.ruleForm = JSON.parse(JSON.stringify(val))
          if (this.ruleForm.projectClass === null) {
            this.ruleForm.projectClass = 'IC_D'
          }
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
            if (add[0] === '全部' && add.length === 1) {
              this.language = '基本信息中所有可编辑字段都是基线字段；'
              return
            }
            if (add.length === 9) {
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

      if (this.ruleForm.planApprovalTime && value < this.ruleForm.planApprovalTime) {
        callback(new Error('计划结项时间不能早于计划立项时间'))
      }
      if (this.projectCode) {
        //编辑计划结项时间不能早于里程碑计划完成时间，
        //任务申请完成时间，成果计划交付时间，实际立项时间1
        let params = {
          type: 1,
          projectCode: this.projectCode,
          checkTime: new Date(value)
            .getTime()
        }
        API.checkTime(params)
          .then((res) => {
            callback()
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              let message = e.message
              callback(new Error(message))
            }
          })
      } else {
        callback()
      }
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
        if (this.projectCode) {
          //编辑计划结项时间不能早于里程碑，任务申请完成时间，成果计划交付时间，实际立项时间
          let params = {
            type: 0,
            projectCode: this.projectCode,
            checkTime: new Date(value)
              .getTime()
          }
          API.checkTime(params)
            .then((res) => {
              callback()
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                let message = e.message
                callback(new Error(message))
              }
            })
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      selectWidth: 170, // 设置下拉框选项的最大宽度
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
          } else {
            let lastYear = new Date()
              .getFullYear() - 1
            let nextYear = new Date()
              .getFullYear() + 1
            return (
              !(time.getFullYear() > lastYear && time.getFullYear() < nextYear)
            )
          }
          // return (
          //   time.getFullYear() !==
          //   new Date()
          //     .getFullYear()
          // )
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
        projectName: '新增项目', //项目名称
        projectSource: '', //项目来源
        projectClass: '', //集团项目类别
        projectCategory: 'PC-SELF-UNIT',
        developProperty: '', //研发性质
        projectType: '', //项目类型
        projectLevel: '', //集团项目级别
        planApprovalTime: '', //计划立项时间
        planFinishTime: '', //计划结项时间
        actualApprovalTime: '', //实际立项时间
        actualFinishTime: '', //实际结项时间
        projectExpenditureType: '', //费用类别
        periodOwnership: 'BE-1', //期间归属
        projectYear: new Date()
          .getFullYear(), //项目所属年份
        projectDetailsStatus: 0, //项目状态
        developPackage: '' //是否研发包
      },
      sourceList: [], //项目来源
      cateList: [],
      developPropertyList: [], //研发性质
      projectStatusList: [
        {
          value: 0,
          label: '草稿'
        },
        {
          value: 1,
          label: '立项审批中'
        },
        {
          value: 2,
          label: '已立项'
        },
        {
          value: 3,
          label: '变更审批中'
        },
        {
          value: 4,
          label: '终止审批中'
        },
        {
          value: 5,
          label: '结项审批中'
        },
        {
          value: 6,
          label: '已终止'
        },
        {
          value: 7,
          label: '已结项'
        },
        {
          value: 8,
          label: '已关闭'
        },
        {
          value: 10,
          label: '预立项审批中'
        },
        {
          value: 11,
          label: '已预立项'
        }
      ], //项目状态
      ownerList: [
        {
          value: 'BE-1',
          label: '年度新立'
        },
        {
          value: 'BE-2',
          label: '结转项目'
        }
      ],
      typeOptions: [], //项目类型
      levelList: [], //集团项目级别
      costTypeList: [], //费用类别
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        projectSource: [
          { required: true, message: '请选择项目来源', trigger: 'change' }
        ],
        developProperty: [
          { required: true, message: '请选择研发性质', trigger: 'change' }
        ],
        /* projectType: [
          { required: true, message: '请选择项目分类', trigger: 'change' }
        ],*/
        projectLevel: [
          { required: true, message: '请选择集团项目级别', trigger: 'change' }
        ],
        projectExpenditureType: [
          { required: true, message: '请选择费用类别', trigger: 'change' }
        ],
        planApprovalTime: [
          { required: true, validator: validateStart, trigger: ['blur', 'change'] }
        ],
        planFinishTime: [
          { required: true, validator: validateDate, trigger: ['blur', 'change'] }
        ],
        developPackage: [
          { required: true, message: '请选择是否研发包项目', trigger: 'change' }
        ]
      },
      checkList: {
        projectSource: false,
        projectClass: false,
        projectExpenditureType: false,
        periodOwnership: false,
        developProperty: false,
        projectType: false,
        projectLevel: false
      },
      language: '暂无基线信息',
      checkData: [
        {
          label: 'projectName',
          value: '项目名称'
        }, {
          label: 'projectSource',
          value: '项目来源'
        }, {
          label: 'projectCategory',
          value: '集团项目类别'
        },
        {
          label: 'projectLevel',
          value: '集团项目级别'
        },
        {
          label: 'developProperty',
          value: '研发性质'
        }, {
          label: 'projectType',
          value: '项目分类'
        }, {
          label: 'planApprovalTime',
          value: '计划立项时间'
        }, {
          label: 'planFinishTime',
          value: '计划结项时间'
        }, {
          label: 'projectExpenditureType',
          value: '费用类别'
        }, {
          label: 'all',
          value: '全部'
        }],
      numWatch: true // 让侦听器中的逻辑只执行一次
    }
  },
  components: {
    projectPanel
  },
  computed: {
    levelOptions () {
      return this.levelList.filter(item => item.valueCode === 'PL-KEY-PJ' || item.valueCode === 'PL-GENERAL-PJ')
    }
  },
  mounted () {
    // 下拉选择溢出设置宽度
    this.selectWidth = this.$refs['projectSource'].$el.offsetWidth
    //窗口大小改变时设置宽度
    window.onresize = () => {
      this.selectWidth = this.$refs['projectSource'].$el.offsetWidth
    }
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate('planApprovalTime')
        this.$refs.ruleForm.clearValidate('planFinishTime')
      }, 1000)
    })
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    chageTitle (val) {
      document.title = this.ruleForm.projectName
    },
    changeSource (source) {
      API.queryProjectCode({
        projectSource: source,
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
    //输入框添加浮显
    getTooltipName (item, list) {
      let toolTipName = ''
      list.forEach((iitem) => {
        if (iitem.valueCode === item) {
          toolTipName = iitem.name
        }
      })
      return toolTipName
    },
    saveBasicInfo () {
      this.$refs['projectName'].blur()
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.ruleForm.businessFormUrl = '/projectInfo/projectInfo-edit/' + this.ruleForm.projectCode
          API.saveProjectBaseInfo(this.ruleForm)
            .then(data => {
              if (data.updatedFlag === '0') {
                this.$message({
                  type: 'success',
                  message: '基本信息保存成功',
                  showClose: true
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '基本信息保存成功',
                  showClose: true
                })
              }
              this.ruleForm.id = data.id
              this.ruleForm.projectCode = data.projectCode
              this.$emit('update', this.ruleForm)
              this.$emit('saveBlock') //保存区块成功
            })
            .catch(err => {
              this.$message.error(err.message || '基本信息保存失败')
            })
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
    getProjectName () {
      return this.ruleForm.projectName
    },
    changeTime (type) {
      if (
        this.ruleForm.planApprovalTime &&
        this.ruleForm.planFinishTime
      ) {
        let startYear = new Date(this.ruleForm.planApprovalTime)
        let endYear = new Date(this.ruleForm.planFinishTime)
        this.$emit('changeTime', [startYear, endYear], type)
        // this.changeInfo()
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
    changeInfo (value) {
      this.$emit('changeValue')
    },
    // 获取项目来源option
    getProjectSourceOption () {
      return API.dictValByCode('PROJECT-SOURCE')
        .then(res => {
          this.sourceList = res
          this.checkList.projectSource = true
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 检查项目来源编码是否已失效，保证方法只能执行一次
    async checkProjectSource (code, name) {
      if (this.checkList.projectSource) return
      await this.getProjectSourceOption()
      let isSure = false
      if (this.sourceList && this.sourceList.length > 0) {
        this.sourceList.forEach(item => {
          if (item.valueCode === code) {
            isSure = true
          }
        })
        if (!isSure) {
          let obj = {
            name: name,
            valueCode: code
          }
          this.sourceList.push(obj)
        }
      }
    },
    // 获取集团项目类别option
    getProjectClassOption () {
      return API.dictValByCode('ITEM_CATEGORY')
        .then(res => {
          this.cateList = res
          this.checkList.projectClass = true
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 检查集团项目类别编码是否已失效，保证方法只能执行一次
    async checkProjectClass (code, name) {
      if (this.checkList.projectClass) return
      await this.getProjectClassOption()
      let isSure = false
      if (this.cateList && this.cateList.length > 0) {
        this.cateList.forEach(item => {
          if (item.valueCode === code) {
            isSure = true
          }
        })
        if (!isSure) {
          let obj = {
            name: name,
            valueCode: code
          }
          this.cateList.push(obj)
        }
      }
    },
    // 获取费用类别option
    getProjectExpenditureTypeOption () {
      return API.dictValByCode('PROJECT-EXPENDITURE-TYPE')
        .then(res => {
          this.costTypeList = res
          this.checkList.projectExpenditureType = true
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 检查费用类别编码是否已失效，保证方法只能执行一次
    async checkProjectExpenditureType (code, name) {
      if (this.checkList.projectExpenditureType) return
      await this.getProjectExpenditureTypeOption()
      let isSure = false
      if (this.costTypeList && this.costTypeList.length > 0) {
        this.costTypeList.forEach(item => {
          if (item.valueCode === code) {
            isSure = true
          }
        })
        if (!isSure) {
          let obj = {
            name: name,
            valueCode: code
          }
          this.costTypeList.push(obj)
        }
      }
    },
    // 检查期间归属编码是否已失效，保证方法只能执行一次
    checkPeriodOwnership (code, name) {
      if (this.checkList.periodOwnership) return
      let isSure = false
      if (this.ownerList && this.ownerList.length > 0) {
        this.ownerList.forEach(item => {
          if (item.value === code) {
            isSure = true
          }
        })
        if (!isSure) {
          let obj = {
            label: name,
            value: code
          }
          this.ownerList.push(obj)
          this.checkList.periodOwnership = true
        }
      }
    },
    // 获取研发性质option
    getDevelopPropertyOption () {
      return API.dictValByCode('DEVELOP-PROPERTY')
        .then(res => {
          this.developPropertyList = res
          this.checkList.developProperty = true
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 检查研发性质编码是否已失效，保证方法只能执行一次
    async checkDevelopProperty (code, name) {
      if (this.checkList.developProperty || !code) return
      await this.getDevelopPropertyOption()
      let isSure = false
      if (this.developPropertyList && this.developPropertyList.length > 0) {
        this.developPropertyList.forEach(item => {
          if (item.valueCode === code) {
            isSure = true
          }
        })
        if (!isSure) {
          let obj = {
            name: name,
            valueCode: code
          }
          this.developPropertyList.push(obj)
        }
      }
    },
    // 获取项目分类option
    async getProjectTypeOption () {
      return API.dictionaryValuesCompanyCode({ typeCode: 'PROJECT-TYPE', companyCode: getStore().getters['USERENTITY/userInfo'].userAuth.companyCode })
        .then(res => {
          this.typeOptions = res
          this.checkList.projectType = true
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 检查项目分类编码是否已失效，保证方法只能执行一次
    async checkProjectType (code, name) {
      if (this.checkList.projectType) return
      await this.getProjectTypeOption()
      if (code === '') return
      let isSure = false
      if (this.typeOptions && this.typeOptions.length > 0) {
        this.typeOptions.forEach(item => {
          if (item.valueCode === code) {
            isSure = true
          }
        })
        if (!isSure) {
          let obj = {
            name: name,
            valueCode: code
          }
          this.typeOptions.push(obj)
        }
      }
    },
    // 获取集团项目级别option
    async getProjectLevelOption () {
      return API.dictValByCode('CO-PROJECT-LEVEL')
        .then(res => {
          this.levelList = res
          this.checkList.projectLevel = true
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 检查集团项目级别编码是否已失效，保证方法只能执行一次
    async checkProjectLevel (code, name) {
      if (this.checkList.projectLevel) return
      await this.getProjectLevelOption()
      if (code === '') return
      let isSure = false
      if (this.levelList && this.levelList.length > 0) {
        this.levelList.forEach(item => {
          if (item.valueCode === code) {
            isSure = true
          }
        })
        if (!isSure) {
          let obj = {
            name: name,
            valueCode: code
          }
          this.levelList.push(obj)
        }
      }
    }
  },
  created () {
    document.title = '新增项目'
    // 批量获取项目来源、研发性质、费用类别
    let param = {
      codes: 'PROJECT-SOURCE,DEVELOP-PROPERTY,PROJECT-EXPENDITURE-TYPE,ITEM_CATEGORY,CO-PROJECT-LEVEL'
    }
    API.dictValByCodes(param)
      .then(res => {
        res.forEach(dicItem => {
          switch (dicItem.code) {
            case 'PROJECT-SOURCE':
              this.sourceList = dicItem.dictionarys
              break
            case 'DEVELOP-PROPERTY':
              this.developPropertyList = dicItem.dictionarys
              break
            case 'PROJECT-EXPENDITURE-TYPE':
              this.costTypeList = dicItem.dictionarys
              break
            case 'CO-PROJECT-LEVEL':
              this.levelList = dicItem.dictionarys
              break
            case 'ITEM_CATEGORY':
              this.cateList = dicItem.dictionarys
              if (this.ruleForm && !this.ruleForm.projectClass) {
                this.$set(this.ruleForm, 'projectClass', 'IC_D')
              }
              break
          }
        })
      })
      .catch(err => {
        this.$message.error(err.message || '数据字典失败')
      })
    // 新增的时候调用
    if (this.$route.query.menuResCode) {
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
    .progect-code {
      position: relative;
      .sapn {
        position: absolute;
        right: -24px;
      }
    }
    .accountingNo{
      margin-left: 5px;
      @include color();
    }
  }
}
// 下拉超出省略号显示
.el-select-dropdown__item {
  /deep/ span {
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
