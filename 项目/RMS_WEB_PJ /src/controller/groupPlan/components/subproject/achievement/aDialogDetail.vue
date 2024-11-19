<template>
  <!-- 预期成果弹框详情 -->
  <el-dialog
    v-dialogDrag
    title="预期成果详情"
    :visible.sync="dialogVisible1"
    width="1148px"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <div class="addcon3">
      <projectPanel title="预期成果信息"  class="addcon" :show-expand='false'>
        <el-form
          :model="tableDataInForm"
          label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="任务名称:"
                prop="achievementName">
                {{tableDataInForm.achievementName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="成果类型:"
                prop="achievementTypeValue">
                {{tableDataInForm.achievementTypeValue}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                class="expectTime1"
                label="预期交付时间:"
                prop="deliveryTime">
                {{tableDataInForm.deliveryTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="需求单位:"
                prop="demandUnit">
                {{tableDataInForm.demandUnit}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="需求单位部门:"
                prop="demandUnitDept">
                {{tableDataInForm.demandUnitDept}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="成果需求人:"
                prop="demandUnitResponsibleName">
                {{tableDataInForm.demandUnitResponsibleName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="承担单位:"
                prop="undertakeUnit">
                {{tableDataInForm.undertakeUnit}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="承担单位部门:"
                prop="undertakeUnitDept">
                {{tableDataInForm.undertakeUnitDept}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="成果负责人:"
                prop="responsiblePerson">
                {{tableDataInForm.responsiblePerson}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </projectPanel>
    </div>
    <projectPanel title="预期成果预算"  class="addcon addcon2" :show-expand='false'>
      <div class="budget-body">
        <el-form
          ref="budgetForm"
          :model="budgetForm"
          :show-message="true">
          <el-table :data="budgetForm.tableData" style="width: 100%">
            <el-table-column
              minwidth="150"
              fixed
              align="center"
              prop="undertakeUnitDept"
              label="承担部门"
              width="140">
              <template slot-scope="scope">
                <p v-if="scope.row.type=='data'">{{scope.row.undertakeUnitDept}}</p>
                <p v-if="scope.row.type=='total'">合计</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="tableTitleItem+'年度'"
              v-for="(tableTitleItem,index) in yearRange"
              :key="index"
              align="center">
              <el-table-column label="合作开发费(万元)" align="center">
                <el-table-column
                  prop="budgetInsourcing"
                  align="center"
                  label="委内"
                  min-width="140">
                  <template slot-scope="scope">
                    <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].budgetInsourcing | numTransition}}</p>
                    <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].budgetInsourcing | numTransition}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="budgetOutsourcing"
                  align="center"
                  label="委外"
                  min-width="140">
                  <template slot-scope="scope">
                    <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].budgetOutsourcing | numTransition}}</p>
                    <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].budgetOutsourcing | numTransition}}</p>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                prop="staffTime"
                label="自有人工(人月)"
                min-width="140"
                align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].staffTime | numTransition}}</p>
                  <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].staffTime | numTransition}}</p>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop label min-width="2" >
              <el-table-column
                prop="totalAmount"
                label="合计(万元)"
                min-width="140"
                align="center">
                <template slot-scope="scope">
                  <p>{{scope.row.totalAmount | numTransition}}</p>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </projectPanel>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleCancle1">返回</el-button>
    </span>
  </el-dialog>
</template>
<script>

import APIAchievement from './achievement.js'
import BigNumber from 'bignumber.js'
export default {
  data () {
    return {
      yearRange: [],
      dialogVisible1: false,
      tableDataInForm: { //预期成果信息表单
        achievementName: '', //任务名称
        achievementTypeValue: '', //成果类型1
        deliveryTime: '', //任务预期交付时间
        demandUnit: '', //需求单位2
        demandUnitDept: '', //需求部门4
        demandUnitResponsibleName: '', //成果需求人6
        undertakeUnit: '', //承担单位3
        undertakeUnitDept: '', //承担部门5
        responsiblePerson: '' //成果负责人7
      },
      budgetForm: {
        tableData: []
      },
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime'],
      selfId: 0
    }
  },
  filters: {
    // 过滤小数位后0
    numTransition (val) {
      if (val) {
        if (val.indexOf('.') !== -1) {
          let splitArr = val.split('.')
          let reverseArr = splitArr[1].split('')
            .reverse()
          let reverseArr2 = []
          reverseArr.forEach(item => {
            reverseArr2.push(item)
          })
          reverseArr.some((item, index) => {
            if (!parseInt(item)) {
              reverseArr2.shift()
            } else {
              return true
            }
          })
          reverseArr2 = reverseArr2.reverse()
            .join('')
          if (reverseArr2 && reverseArr2.length > 0) {
            return splitArr[0] + '.' + reverseArr2
          } else {
            return splitArr[0]
          }
        } else {
          return val
        }
      } else {
        return '-'
      }
    }
  },
  methods: {
    // 日期格式化
    formatDate1 (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    acceptData (row, type, editOrdetail, yearRange) { //接受数据
      this.yearRange = yearRange
      if (type === 'd') { //需求单位不需要请求接口
        let res = row
        this.tableDataInForm = {
          achievementName: res.achievementName,
          achievementTypeValue: res.achievementTypeValue,
          demandUnit: res.demandUnit,
          undertakeUnit: res.undertakeUnit,
          demandUnitDept: res.demandUnitDept,
          undertakeUnitDept: res.undertakeUnitDept,
          demandUnitResponsibleName: res.demandUnitResponsibleName,
          responsiblePerson: res.responsiblePerson,
          deliveryTime: res.deliveryTime ? this.formatDate1(res.deliveryTime) : ''
        }
        let newAchievementBudgetList = JSON.parse(JSON.stringify(row.achievementBudgetList)) || []
        if (newAchievementBudgetList) {
          newAchievementBudgetList.forEach(item => {
            item.selfId = this.selfId++
            item.type = 'data'
            let budgetList = [] //item 里面的budgetList 每一行中 2020 年 2021 年数据
            this.yearRange.forEach(item2 => { //循环遍历每年,有的话填进去,没有加一行
              let hasYearData = false
              item.budgetList.some(item3 => {
                if (item2 === item3.timeYear) {
                  item3.budgetInsourcing = item3.budgetInsourcing === null ? '-' : item3.budgetInsourcing
                  item3.budgetOutsourcing = item3.budgetOutsourcing === null ? '-' : item3.budgetOutsourcing
                  item3.staffTime = item3.staffTime === null ? '-' : item3.staffTime
                  budgetList.push(item3)
                  hasYearData = true
                }
              })
              if (hasYearData) {
              } else {
                budgetList.push({ timeYear: item2, budgetInsourcing: '-', budgetOutsourcing: '-', staffTime: '-' })
              }
            })
            item.budgetList = budgetList
          })
        }
        this.budgetForm.tableData = newAchievementBudgetList
        let budgetList = []
        this.yearRange.forEach(item => {
          let obj = { budgetInsourcing: '', budgetOutsourcing: '', staffTime: '' }
          obj.timeYear = item
          budgetList.push(obj)
        })
        this.budgetForm.tableData.push({ type: 'total', undertakeUnitDept: '', undertakeUnitDeptCode: '', budgetList: budgetList, totalAmount: '' })
        this.computedAll()
        this.dialogVisible1 = true
      } else { //承担单位
        APIAchievement.queryAchievementInfo(row.achievementCode)
          .then(res => {
            this.tableDataInForm = {
              achievementName: res.achievementName,
              achievementTypeValue: res.achievementTypeValue,
              demandUnit: res.demandUnit,
              undertakeUnit: res.undertakeUnit,
              demandUnitDept: res.demandUnitDept,
              undertakeUnitDept: res.undertakeUnitDept,
              demandUnitResponsibleName: res.demandUnitResponsibleName,
              responsiblePerson: res.responsiblePerson,
              deliveryTime: res.deliveryTime ? this.formatDate1(res.deliveryTime) : ''
            }
            if (res.achievementBudgetList) {
              this.yearRange = []
              res.achievementBudgetList[0].budgetList.forEach(item => {
                this.yearRange.push(item.timeYear)
              })
            }
            let newAchievementBudgetList = JSON.parse(JSON.stringify(res.achievementBudgetList)) || []
            if (newAchievementBudgetList) {
              newAchievementBudgetList.forEach(item => {
                item.selfId = this.selfId++
                item.type = 'data'
                let budgetList = [] //item 里面的budgetList 每一行中 2020 年 2021 年数据
                this.yearRange.forEach(item2 => { //循环遍历每年,有的话填进去,没有加一行
                  let hasYearData = false
                  item.budgetList.some(item3 => {
                    if (item2 === item3.timeYear) {
                      item3.budgetInsourcing = item3.budgetInsourcing === null ? '-' : item3.budgetInsourcing
                      item3.budgetOutsourcing = item3.budgetOutsourcing === null ? '-' : item3.budgetOutsourcing
                      item3.staffTime = item3.staffTime === null ? '-' : item3.staffTime
                      budgetList.push(item3)
                      hasYearData = true
                    }
                  })
                  if (hasYearData) {
                  } else {
                    budgetList.push({ timeYear: item2, budgetInsourcing: '-', budgetOutsourcing: '-', staffTime: '-' })
                  }
                })
                item.budgetList = budgetList
              })
            }
            this.budgetForm.tableData = newAchievementBudgetList
            let budgetList = []
            this.yearRange.forEach(item => {
              let obj = { budgetInsourcing: '', budgetOutsourcing: '', staffTime: '' }
              obj.timeYear = item
              budgetList.push(obj)
            })
            this.budgetForm.tableData.push({ type: 'total', undertakeUnitDept: '', undertakeUnitDeptCode: '', budgetList: budgetList, totalAmount: '' })
            this.computedAll()
            this.dialogVisible1 = true
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '获取成果详情失败',
                type: 'error',
                showClose: true
              })
            }
          })
      }
    },
    dialogVisibleCancle1 () { //详情弹框取消
      this.dialogVisible1 = false
    },
    computedAll () {
      this.allKeys.forEach(key => {
        this.yearRange.forEach((y, index) => {
          this.computeSum(key, index, false)
        })
      })
    },
    getAvgLaborCostAndStaffTime (staffTime, avgLaborCost) { //计算自有人工乘上单位人力成本
      let x = new BigNumber(staffTime)
      let y = new BigNumber(avgLaborCost)
      //   .toFormat(8), '自有人工乘上单位人力成本')
      let res = x.times(y)
        .toFormat(6)
      res = this.delcommafy(res)
      return res
    },
    delcommafy (num) {
      num = num.replace(/,/gi, '')
      return num
    },
    computeSum (prop, index, row) { //先计算行合计再计算列合计
      this.budgetForm.tableData.pop()
      let list = [] //把costBudgetList合并数组
      let totalAmountLowerRight = '0' // 右下角合计
      let oneHasData = false
      this.budgetForm.tableData.forEach(item => { //行合计
        let totalAmount = ''
        list = list.concat(item.budgetList)
        item.budgetList.forEach(item2 => {
          totalAmount = item2.budgetInsourcing === '-' || item2.budgetInsourcing === '' ? totalAmount : this.sumFloat(totalAmount, item2.budgetInsourcing, '')
          totalAmount = item2.budgetOutsourcing === '-' || item2.budgetOutsourcing === '' ? totalAmount : this.sumFloat(totalAmount, item2.budgetOutsourcing, '')
          if (item2.staffTime !== '-' && item2.staffTime !== '') {
            let getAvgLaborCostAndStaffTime = this.getAvgLaborCostAndStaffTime(item2.staffTime, item2.avgLaborCost)
            totalAmount = this.sumFloat(totalAmount, getAvgLaborCostAndStaffTime, '')
          }
        })
        item.totalAmount = totalAmount
        if (totalAmount) { //如果有一个行合计
          oneHasData = true
          totalAmountLowerRight = this.sumFloat(totalAmountLowerRight, totalAmount)
        }
      })
      if (!oneHasData) {
        totalAmountLowerRight = ''
      }
      let budgetList = [] //列合计
      this.yearRange.forEach(item => {
        let budgetInsourcingNullCount = 0
        let budgetOutsourcingNullCount = 0
        let staffTimeNullCount = 0
        let obj = { budgetInsourcing: '0', budgetOutsourcing: '0', staffTime: '0', timeYear: item }
        list.forEach(item2 => {
          if (item === item2.timeYear) {
            if (item2.budgetInsourcing === '-' || item2.budgetInsourcing === '') {
              budgetInsourcingNullCount++
            }
            if (item2.budgetOutsourcing === '-' || item2.budgetOutsourcing === '') {
              budgetOutsourcingNullCount++
            }
            if (item2.staffTime === '-' || item2.staffTime === '') {
              staffTimeNullCount++
            }
            obj.budgetInsourcing = item2.budgetInsourcing === '-' || item2.budgetInsourcing === '' ? obj.budgetInsourcing : this.sumFloat(obj.budgetInsourcing, item2.budgetInsourcing, '')
            obj.budgetOutsourcing = item2.budgetOutsourcing === '-' || item2.budgetOutsourcing === '' ? obj.budgetOutsourcing : this.sumFloat(obj.budgetOutsourcing, item2.budgetOutsourcing, '')
            obj.staffTime = item2.staffTime === '-' || item2.staffTime === '' ? obj.staffTime : this.sumFloat(obj.staffTime, item2.staffTime, 'staffTime')
          }
        })
        if (budgetInsourcingNullCount === this.budgetForm.tableData.length) {
          obj.budgetInsourcing = ''
        }
        if (budgetOutsourcingNullCount === this.budgetForm.tableData.length) {
          obj.budgetOutsourcing = ''
        }
        if (staffTimeNullCount === this.budgetForm.tableData.length) {
          obj.staffTime = ''
        }
        budgetList.push(obj)
      })
      this.budgetForm.tableData.push({ type: 'total', responsibleDepartment: '', budgetList: budgetList, totalAmount: totalAmountLowerRight })
    },
    //两位字符表示的浮点数相加求和，使用字符串是为了防止精度丢失，js大于15位的数使用parseFloat会丢失精度
    sumFloat (num1, num2, prop) {
      let int1 = num1.split('.')[0] || 0
      let int2 = num2.split('.')[0] || 0
      let decimal1 = num1.split('.')[1] || 0
      let decimal2 = num2.split('.')[1] || 0
      //如2.991000+5.999000
      //整数与整数相加，2+5=7
      let int = parseInt(int1) + parseInt(int2)
      let decimalLen = prop === 'staffTime' ? 2 : 6
      //小数位相加，再除以倍数，991+999=1990 1990/1000000=0.001990
      // let decimal = (parseInt(decimal1) + parseInt(decimal2)) / Math.pow(10, decimalLen)
      // let decimal = (parseFloat('0.' + decimal1) + parseFloat('0.' + decimal2))
      let decimal = (parseFloat('0.' + decimal1) * Math.pow(10, decimalLen) + parseFloat('0.' + decimal2) * Math.pow(10, decimalLen)) / Math.pow(10, decimalLen)
      //获取小数位相加之和补全位数，0.00199 --> 0.001990
      let newDecimal = this.getFixedNumNew(decimal + '', decimalLen)
      //整数位相加的结果再与小数位相加结果的整数位相加，小数与小数相加,7.001990，如：1+1.25 --> 2+0.25
      let sum = (int + parseInt(newDecimal.split('.')[0])) + '.' + newDecimal.split('.')[1]
      return sum
    },
    //补齐小数位,val --> string
    getFixedNumNew (val, len = 6) {
      let str = ''
      let splitArr = val.split('.')
      if (splitArr.length > 1 && splitArr[1] !== '') {
        str = parseInt(splitArr[0]) + '.'
        if (splitArr[1].length < len) {
          str = str + splitArr[1] + this.getDecimal(len - splitArr[1].length)
        } else {
          str += splitArr[1]
        }
      } else {
        //无小数位，补全
        str = parseInt(splitArr[0]) + '.' + this.getDecimal(len)
      }
      return str
    },
    //补位0
    getDecimal (len) {
      let decimal = ''
      for (let i = 0; i < len; i++) {
        decimal += '0'
      }
      return decimal
    }
  }
}
</script>
<style lang="scss" scoped>
  .addcon3 /deep/{
    margin-bottom: 20px;
    .project-panel .panel-body.is-expand {
      padding: 10px 20px 10px 2px!important;
      height: auto;
    }
    .project-panel .panel-body{
      margin-bottom: 0;
    }
  }
</style>
