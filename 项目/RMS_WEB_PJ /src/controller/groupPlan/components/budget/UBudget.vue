<template>
  <!-- 子项目-预算组件-一般支撑包&&非一般支撑包 -->
  <div class="project-budget">
    <project-panel title="预算信息" :tips="tips" :tip-language="language">
      <template v-slot:header>
        <el-button
          class="normal-btn"
          v-if="isEdit&&!meberEditFlag"
          @click="save">保存本区块信息</el-button>
      </template>
      <div class="main">
        <div class="switch" v-if="tableListYear.length > 0">
          <div
            v-for="(item, i) in tableListYear"
            :key="item.key"
            @click="checkTh(item, i)"
            :class="parseInt(item.year) == parseInt(budgetForm.caption) ? 'tab-checked': ''">
            <span v-if="parseInt(item.year) === 1">全项目</span>
            <span :class="{'highlightStyle':item.highlightProps }" v-else>{{item.year}}年度</span>
          </div>
        </div>
        <div class="budget-body" v-if="projectYearBudgetObj[budgetForm.caption].length > 0">
          <el-form
            ref="budgetForm"
            :model="budgetForm"
            :inline="true"
            :show-message="false">
            <div class="caption">
              <span v-if="parseInt(budgetForm.caption) === 1">全项目成本信息</span>
              <span v-else>{{budgetForm.caption}}年度成本预算信息</span>
            </div>
            <div v-for="(item,index) in tableListYear" :key='index'>
              <uBudgetTable
                :ref="'yearBugdet'+item.year"
                v-show="parseInt(budgetForm.caption) === item.year"
                :is-edit="isEdit"
                :is-year="isYear"
                :data="projectYearBudgetObj[item.year]"
                :undertake-unit-dept-list="undertakeUnitDeptObj[item.year]"></uBudgetTable>
            </div>
          </el-form>
        </div>
        <div class="budget-body" v-if="projectYearBudgetObj[budgetForm.caption].length == 0">暂无数据</div>
      </div>
    </project-panel>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_groupPlanProject'
import bus from '@/common/bus'
import { addNum, deleteZero } from '@/utils/numberAdd'
import uBudgetTable from './uBudgetTable'

export default {
  components: { projectPanel, uBudgetTable },
  data () {
    return {
      meberEditFlag: false,
      projectCode: '', // 项目编码
      versionNo: '', // 版本号
      isYear: false, // 判断当前年份是否可编辑
      isEdit: false, // 项目是否可进行编辑-默认不可编辑
      budgetForm: {
        caption: '1',
        costBudgetList: []
      },
      projectYearBudgetObj: {
        '1': []
      },
      undertakeUnitDeptObj: {
        '1': []//全项目
      }, //所有年份承担部门对象
      countKeys: ['budgetOutsourcing', 'budgetInsourcing', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'], // 用来计算列合计
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime', 'laborCosts', 'travelExpenses',
        'conferenceExpenses', 'assetDepreciation', 'otherCosts'],
      budgetOutsourcingSum: '', //委外行合计
      budgetInsourcingSum: '', //委内行合计
      staffTimeSum: '', //自有人工(人月)行合计
      laborCostsSum: '', //自有人工成本(万元)行合计
      travelExpensesSum: '', //差旅费(万元)行合计
      conferenceExpensesSum: '', //会议费(万元)行合计
      assetDepreciationSum: '', //资产折旧/摊销(万元)行合计
      otherCostsSum: '', // 其他成本(万元)行合计
      allSum: '', //总合计
      undertakeUnitDeptList: [],
      tableListYear: [], // 用来判断当前选中年份是否可编辑
      isBeyond: false, // 合计是否超出总金额
      isBeyondList: [], // 合计超出key的集合
      isRowError: { // 控制行输入框的error样式
        'budgetOutsourcing': false,
        'budgetInsourcing': false,
        'staffTime': false,
        'laborCosts': false,
        'travelExpenses': false,
        'conferenceExpenses': false,
        'assetDepreciation': false,
        'otherCosts': false
      },
      allYearBugetList: [], //所有年份数据集合
      uBudgetInfo: null,
      pfTotalAmount: '',
      language: '预算信息中所有可编辑字段都是基线字段',
      cacheBudgetData: [], //缓存传给后端的预算数据
      validateSuc: true //保存时各年份页签是否校验成功
    }
  },
  props: {
    budgetInfo: {},
    undertakeBudgetInfo: {},
    yearRange: { type: Array, default: () => [] },
    tipLanguage: {
      type: Boolean,
      default: false
    },
    tips: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    tipLanguage: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.language = '预算信息中所有可编辑字段都是基线字段；'
        } else {
          this.language = '预算信息中没有基线字段；'
        }
      }
    },
    budgetInfo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.isEdit = this.budgetInfo.isEdit
          this.projectCode = this.budgetInfo.projectCode
          this.versionNo = this.budgetInfo.versionNo
          this.budgetForm.caption = '1'
          this.getBudgetAllYear() //获取所有年份的预算信息
        }
      }
    },
    undertakeBudgetInfo: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.uBudgetInfo = JSON.parse(JSON.stringify(newValue))
          this.budgetForm.caption = '1'
          this.analyzeBudget()
        }
      }
    }
  },
  methods: {
    // 选择当前年度
    checkTh (val, i) {
      this.budgetForm.caption = val.year
      this.judgeYear(this.tableListYear[i])
      if (parseInt(val.year) === 1) {
        this.computeAllyearBudget()
      }
    },
    // 判断当前年份是否可编辑
    judgeYear (params) {
      let year = params.year
      let nowDate = new Date()
      let nowYear = nowDate.getFullYear()
      if (year === 1) {
        // 全项目不可编辑
        this.isYear = false
      } else {
        if (nowYear <= year) {
          // 当前选中的年份大于当前年份-可编辑
          this.isYear = true
        } else {
          // 当前选中的年份小于当前年份-不可编辑
          this.isYear = false
        }
      }
    },
    //计算全项目合计预算--实时更新
    async computeAllyearBudget () {
      // await this.validate()
      //获取所有页签数据
      let allData = []
      this.tableListYear.forEach((yearItem, i) => {
        if (parseInt(yearItem.year) === 1) {
          return
        }
        let yearTable = this.$refs[`yearBugdet${yearItem.year}`][0] //refs竟然是个数组
        let yearData = yearTable.getAllData()
        yearData.forEach(item => {
          item.timeYear = yearItem.year
        })
        allData = allData.concat(yearData)
      })
      //计算所有年份各列和
      this.projectYearBudgetObj['1'].forEach(depBudget => {
        if (depBudget.undertakeUnitDept === '合计' || depBudget.undertakeUnitDept === '集团批复预算') return
        this.allKeys.forEach(key => {
          depBudget[key] = '0'
        })
        allData.forEach(ele => {
          if (ele.undertakeUnitDept === depBudget.undertakeUnitDept) {
            this.allKeys.forEach(key => {
              depBudget[key] = addNum(depBudget[key], ele[key])
            })
          }
        })
      })
    },
    // 获取年份集合
    getYearList (val, valOne) {
      this.tableListYear = []
      if (val && val.length > 0) {
        let value = {}
        value.year = 1
        value.highlightProps = false
        this.tableListYear.push(value)
        val.forEach(item => {
          let dat = {}
          dat.year = item
          dat.highlightProps = false
          this.tableListYear.push(dat)
        })
        val.unshift('1')
      }
    },
    // 获取预算信息
    getCostBudgetList () {
      this.getBudgetAllYear() //获取所有年份的预算信息
      this.changeInfo(false)
    },
    //保存前校验并获取数据
    async validate (isTempSave = true) {
      this.validateSuc = true
      this.cacheBudgetData = []
      return new Promise((resolve, reject) => {
        let validateFailYear = []
        let hasDoNum = 0
        this.tableListYear.forEach(async (yearItem, i) => {
          if (parseInt(yearItem.year) === 1) {
            hasDoNum++
            return
          }
          let yearTable = this.$refs[`yearBugdet${yearItem.year}`][0] //refs竟然是个数组
          let yearData = await yearTable.validate()
          if (!yearData) {
            this.validateSuc = false
            validateFailYear.push(yearItem.year)
          } else {
            yearData.forEach(item => {
              item.timeYear = yearItem.year
            })
            this.cacheBudgetData = this.cacheBudgetData.concat(yearData)
          }
          hasDoNum++
          if (hasDoNum === this.tableListYear.length) {
            if (!isTempSave) {
              let data = this.validateSuc ? this.cacheBudgetData : false
              resolve(data)
            }
          }
        })
        if (isTempSave) {
          resolve(validateFailYear)
        } else {
          if (this.tableListYear.length === 0) {
            resolve(false)
          }
        }
      })
    },
    // 暂存
    async save () {
      let failYears = await this.validate()
      if (!this.validateSuc && failYears.length) {
        this.tableListYear.some((yearItem, index) => {
          if (yearItem.year === failYears[0]) {
            this.checkTh(yearItem, index)
            return true
          }
        })
        return false
      }
      let params = {
        projectCode: this.projectCode,
        projectBudgetList: this.cacheBudgetData
      }
      API.editProjectBudget(params)
        .then(res => {
          this.$message({
            message: '预算信息保存成功！',
            type: 'success',
            showClose: true
          })
          this.getBudgetAllYear()
          this.$emit('saveBudget')
          this.changeInfo(false)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '预算信息保存失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //有信息发生修改
    changeInfo (edited = true) {
      let params = {
        curBlock: 'projectBudget',
        hasEdited: edited
      }
      bus.$emit('groupPlanProjectEdit', params)
    },
    //编辑详情页面-接口一次获取所有年份数据
    getBudgetAllYear () {
      if (!this.projectCode) return
      let params = {
        projectCode: this.projectCode,
        versionNo: this.versionNo // 查询指定版本的时候需要传的参数
      }
      API.queryUProjectBudget(params)
        .then(res => {
          this.getYearList(res.yearList)
          if (res && res.projectYearBudgetList) {
            this.tableListYear.forEach(yearItem => {
              let year = yearItem.year
              if (parseInt(year) === 1) {
                this.projectYearBudgetObj[year] = res.projectYearBudgetList['全项目'] || []
              } else {
                this.projectYearBudgetObj[year] = res.projectYearBudgetList[year] || []
              }
              this.undertakeUnitDeptObj[year] = []
              this.projectYearBudgetObj[year].forEach(item => {
                this.undertakeUnitDeptObj[year].push(item.undertakeUnitDept)
              })
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '项目预算获取失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //对比页面-传过来的所有年份数据
    analyzeBudget () {
      this.getYearList(this.uBudgetInfo.yearList)
      if (this.uBudgetInfo && this.uBudgetInfo.projectYearBudgetList) {
        let addYears = this.uBudgetInfo.projectYearBudgetList['highlightProps'] || null
        this.tableListYear.forEach(yearItem => {
          let year = yearItem.year
          if (parseInt(year) === 1) {
            this.projectYearBudgetObj[year] = this.uBudgetInfo.projectYearBudgetList['全项目'] || []
          } else {
            this.projectYearBudgetObj[year] = this.uBudgetInfo.projectYearBudgetList[year] || []
          }
          this.undertakeUnitDeptObj[year] = []
          this.projectYearBudgetObj[year].forEach(item => {
            this.undertakeUnitDeptObj[year].push(item.undertakeUnitDept)
          })
          if (addYears) {
            let highYear = Object.keys(addYears)
            if (parseInt(highYear) === parseInt(year)) {
              yearItem.highlightProps = true
              this.projectYearBudgetObj[year].forEach(item => {
                item.highlightProps = {}
                item.highlightProps.assetDepreciation = true
                item.highlightProps.budgetInsourcing = true
                item.highlightProps.budgetOutsourcing = true
                item.highlightProps.conferenceExpenses = true
                item.highlightProps.laborCosts = true
                item.highlightProps.otherCosts = true
                item.highlightProps.staffTime = true
                item.highlightProps.totalAmount = true
                item.highlightProps.travelExpenses = true
                item.highlightProps.undertakeUnitDept = true
              })
            }
          }
        })
      }
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
  }
}
</script>
<style lang="scss" scoped>
  .project-budget {
    .main {
      border: 1px solid #E8E8E8;

      .switch {
        display: flex;
        border-bottom: 1px solid #E8E8E8;
        user-select: none;

        div {
          width: 72px;
          padding: 12px 0;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          margin-right: 10px;
          cursor: pointer;
        }

        .tab-checked {
          color: #0b82ff;
          border-bottom: 2px solid #0b82ff;
        }
      }
    }

    .budget-body {
      margin: 24px;
      // overflow-x: auto;
      // width: 100%;

      .caption {
        font-size: 18px;
        text-align: center;
        padding-bottom: 16px;
        font-weight: bold;
      }
    }

    .budget-body /deep/ {
      .el-form-item .el-input__inner {
        width: 100%;
      }
    }

    margin-top: 20px;

    .el-form-item {
      margin: 8px 0 !important;
    }

    .highlightStyle {
      color: #FF3F3B !important;
    }
  }
</style>
