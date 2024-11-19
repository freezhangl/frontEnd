<template>
  <div class="basic-info">
    <project-panel title="基本信息" @changeExpand="changeExpand" :show-expand="showExpand">

      <div class="basic-body">
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="130px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编码:" prop="projectCode" :class="{'highlightStyle':highlightProps.projectCode}">
                {{ruleForm.projectCode}}
                <el-tooltip v-if="ruleForm.accountingNo" :content="'项目核算编码：'+ruleForm.accountingNo" placement="top">
                  <i class="el-icon-info accountingNo"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                v-if="ruleForm.accountingNo"
                label="项目核算编码:"
                prop="accountingNo"
                style="word-wrap:break-word"
                :class="{'highlightStyle':highlightProps.accountingNo}">
                {{ruleForm.accountingNo}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
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
              <el-form-item
                v-if="ruleForm.projectCategory === 'PC-DEMAND-UNIT'"
                label="期间归属:"
                prop="periodOwnership"
                :class="{'highlightStyle':highlightProps.periodOwnership}">
                {{ruleForm.periodOwnershipValue}}
              </el-form-item>
              <el-form-item
                v-if="ruleForm.projectCategory !== 'PC-DEMAND-UNIT'"
                label="费用类别:"
                prop="projectExpenditureType"
                :class="{'highlightStyle':highlightProps.projectExpenditureType}">
                {{ruleForm.projectExpenditureTypeValue}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="实际立项时间:" prop="actualApprovalTime" :class="{'highlightStyle':highlightProps.actualApprovalTime}">
                {{ruleForm.actualApprovalTime | date}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实际结项时间:" prop="actualFinishTime" :class="{'highlightStyle':highlightProps.actualFinishTime}">
                {{ruleForm.actualFinishTime | date}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目状态:" prop="projectDetailsStatus" :class="{'highlightStyle':highlightProps.projectDetailsStatus}">
                {{ruleForm.projectDetailsStatusValue}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="集团项目类别:" prop="projectClass" :class="{'highlightStyle':highlightProps.projectClass}">
                {{ruleForm.projectClassValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团项目级别:" prop="projectLevel" :class="{'highlightStyle':highlightProps.projectLevel}">
                {{ruleForm.projectLevelValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                v-if="ruleForm.projectCategory === 'PC-DEMAND-UNIT'"
                label="费用类别:"
                prop="projectExpenditureType"
                :class="{'highlightStyle':highlightProps.projectExpenditureType}">
                {{ruleForm.projectExpenditureTypeValue}}
              </el-form-item>
              <!-- <el-form-item
                v-if="ruleForm.projectCategory !== 'PC-DEMAND-UNIT'"
                label="项目分类:"
                prop="projectType"
                :class="{'highlightStyle':highlightProps.projectType}">
                {{ruleForm.projectTypeValue}}
              </el-form-item> -->
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
    owner: function (val) {
      switch (val) {
        case '1' :
          return '年度新立'
        case '2' :
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
        projectClass: '', //集团项目类别
        developProperty: '', //研发性质
        projectType: '', //项目类型
        projectLevel: '', //集团项目级别
        planApprovalTime: '', //计划立项时间
        planFinishTime: '', //计划结项时间
        actualApprovalTime: '', //实际立项时间
        actualFinishTime: '', //实际结项时间
        projectExpenditureType: '', //费用类别
        periodOwnership: '年度新立', //期间归属
        projectYear: new Date()
          .getFullYear(), //项目所属年份
        projectStatusValue: '未立项', //项目状态
        developPackage: '' //是否研发包
      },
      highlightProps: {} //高亮属性字段
    }
  },
  components: {
    projectPanel
  },
  computed: {},
  methods: {
    changeExpand (isExpand) {
      this.$emit('changeExpand', isExpand)
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
