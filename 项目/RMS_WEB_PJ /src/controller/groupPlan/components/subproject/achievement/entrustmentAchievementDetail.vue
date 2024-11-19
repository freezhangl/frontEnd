<template>
  <!-- 委托函专用的预期成果详情 -->
  <div class="achievement">
    <projectPanel title="预期成果"  class="addcon" :show-expand='false'>
      <self-table
        index-title='序号'
        :is-index='true'
        :table-data="tableDataOut.list"
        :table-cols="tableColsOut"
        max-height="276px"
        :is-pagination="false"
      ></self-table>
    </projectPanel>
    <!-- 预期成果弹框 -->
    <el-dialog
      v-dialogDrag
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="1148px"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="addcon1">
        <projectPanel title="预期成果信息"  class="addcon" :show-expand='false'>
          <el-form
            ref="tableDataInForm"
            :model="tableDataInForm"
            :inline="true"
            label-width="90px">
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
                  class="expectTime"
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
                  prop="demandDepartment">
                  {{tableDataInForm.demandDepartment}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="成果需求人"
                  prop="demandUnitResponsibleName">
                  {{tableDataInForm.demandUnitResponsibleName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="承担单位:"
                  prop="undertaker">
                  {{tableDataInForm.undertaker}}
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
            :inline="true"
            :show-message="true">
            <el-table :data="budgetForm.tableData" style="width: 100%">
              <el-table-column
                minwidth="150"
                fixed
                align="center"
                prop="undertakeUnitDept"
                label="承担部门"
                width="150">
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
                    minwidth="120">
                    <template slot-scope="scope">
                      <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].budgetInsourcing}}</p>
                      <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].budgetInsourcing}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="budgetOutsourcing"
                    align="center"
                    label="委外"
                    minwidth="120">
                    <template slot-scope="scope">
                      <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].budgetOutsourcing}}</p>
                      <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].budgetOutsourcing}}</p>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="staffTime"
                  label="自有人工(人月)"
                  minwidth="120"
                  align="center">
                  <template slot-scope="scope">
                    <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].staffTime}}</p>
                    <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].staffTime}}</p>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop label minwidth="160" >
                <el-table-column
                  prop="totalAmount"
                  label="合计(万元)"
                  minwidth="50"
                  align="center">
                  <template slot-scope="scope">
                    <p>{{scope.row.totalAmount}}</p>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </projectPanel>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCancle">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import selfTable from '../../../../../components/table/index'
import projectPanel from '../../../../components/projectPanel/index'
export default {
  components: { projectPanel, selfTable },
  props: {
    receiveData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      curYear: new Date()
        .getFullYear(), //当年年份
      yearRange: ['2020'],
      budgetForm: {},
      tableDataInForm: { //预期成果信息表单
        achievementName: '', //任务名称
        achievementTypeValue: '', //成果类型1
        demandUnit: '', //需求单位2
        undertaker: '', //承担单位3
        demandDepartment: '', //需求部门4
        undertakeUnitDept: '', //承担部门5
        demandUnitResponsibleName: '', //成果需求人6
        responsiblePerson: '', //成果负责人7
        deliveryTime: '' //任务预期交付时间
      },
      dialogVisible: false,
      dialogTitle: '预期成果详情',
      tableDataOut: { //外层详情表格数据
        list: []
      },
      tableColsOut: [
        // { label: '任务名称', prop: 'achievementName', align: 'left', overflow: true, resizable: false, handleClick: this.handleClick, itemClass: this.itemClass },
        { label: '任务名称', prop: 'achievementName', align: 'left', overflow: true, resizable: false },
        { label: '成果类型', prop: 'achievementTypeValue', align: 'left', overflow: true, minwidth: '70px', resizable: false },
        { label: '需求部门', prop: 'demandUnitDept', align: 'left', overflow: true, resizable: false },
        { label: '承担单位', prop: 'undertakeUnitDept', align: 'left', overflow: true, resizable: false },
        { label: '成果需求人', prop: 'demandUnitResponsibleName', align: 'left', overflow: true, resizable: false },
        { label: '成果负责人', prop: 'responsiblePerson', align: 'left', overflow: true, resizable: false }
      ],
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime']
    }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) { //有数据接收后初始化数据
          this.tableDataOut.list = val
        }
      }
    }
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 日期格式化
    formatDate1 (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 状态过滤
    statusFormatter (val) {
      if (val) {
        return '已关联'
      } else {
        return '未关联'
      }
    },
    handleClick (row) { //点击任务名称进入研究任务及预期详情弹框
      this.tableDataInForm = {
        achievementName: row.achievementName,
        achievementTypeValue: row.achievementTypeValue,
        demandUnit: row.demandUnit,
        undertaker: row.undertakeUnit,
        demandDepartment: row.demandUnitDept,
        undertakeUnitDept: row.undertakeUnitDept,
        demandUnitResponsibleName: row.demandUnitResponsibleName,
        responsiblePerson: row.responsiblePerson,
        deliveryTime: this.formatDate(row.deliveryTime)
      }
      let list = []
      row.achievementBudgetList.forEach(item => {
        item.type = 'data'
        item.totalAmount = ''
        list.push(item)
      })
      this.budgetForm = {
        tableData: list
      }
      let budgetList = []
      this.yearRange.forEach(item => {
        let obj = { budgetInsourcing: '', budgetOutsourcing: '', staffTime: '' }
        obj.timeYear = item
        budgetList.push(obj)
      })
      this.budgetForm.tableData.push({ type: 'total', responsibleDepartment: '', budgetList: budgetList, totalAmount: '' })
      this.computedAll()
      this.dialogVisible = true
    },
    computedAll () {
      this.allKeys.forEach(key => {
        this.yearRange.forEach((y, index) => {
          this.computeSum(key, index, false)
        })
      })
    },
    computeSum (prop, index, row) { //先计算行合计再计算列合计
      this.budgetForm.tableData.pop()
      let list = [] //把costBudgetList合并数组
      this.budgetForm.tableData.forEach(item => { //行合计
        let totalAmount = ''
        list = list.concat(item.budgetList)
        item.budgetList.forEach(item2 => {
          totalAmount = this.sumFloat(totalAmount, item2.budgetInsourcing, '')
          totalAmount = this.sumFloat(totalAmount, item2.budgetOutsourcing, '')
          totalAmount = this.sumFloat(totalAmount, item2.staffTime, '')
        })
        item.totalAmount = totalAmount
      })
      let budgetList = [] //列合计
      let rowNullCount = 0
      this.yearRange.forEach(item => {
        let obj = { budgetInsourcing: '0', budgetOutsourcing: '0', staffTime: '0', timeYear: item }
        list.forEach(item2 => {
          if (item === item2.timeYear) {
            obj.budgetInsourcing = this.sumFloat(obj.budgetInsourcing, item2.budgetInsourcing, '')
            obj.budgetOutsourcing = this.sumFloat(obj.budgetOutsourcing, item2.budgetOutsourcing, '')
            obj.staffTime = this.sumFloat(obj.staffTime, item2.staffTime, 'staffTime')
          }
        })
        budgetList.push(obj)
      })
      let totalAmount = '0' //右下角合计
      budgetList.forEach(item => {
        totalAmount = this.sumFloat(totalAmount, item.budgetInsourcing, '')
        totalAmount = this.sumFloat(totalAmount, item.budgetOutsourcing, '')
        totalAmount = this.sumFloat(totalAmount, item.staffTime, '')
      })
      this.budgetForm.tableData.push({ type: 'total', responsibleDepartment: '', budgetList: budgetList, totalAmount: totalAmount })
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
    },
    itemClass (row) {
      return 'hover'
    },
    dialogVisibleCancle () { //弹框取消
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
.achievement{
  .addcon1{
    margin-bottom: 20px;
  }
  .expectTime{
    .el-form-item__label{
      line-height: 20px;
    }
  }
  .addcon1 /deep/{
    .project-panel .panel-body.is-expand {
      padding: 20px 30px 0px 0px!important;
      height: auto;
    }
    .project-panel .panel-body{
      margin-bottom: 0;
    }
  }
  .budget-body{
    overflow-x: auto;
    width: 100%;
    .tabIndex {
      font-size: 18px;
      text-align: center;
      padding-bottom: 16px;
      font-weight: bold;
    }
  }
  /deep/ .hover{
        @include color();
        &:hover{
          @include color();
        }
        cursor: pointer
      }
}

</style>
