<template>
  <div class="workInformation">
    <div class="title">
      项目成员已确认工时表
    </div>
    <div class="timeSheet">
      <div class="btn" v-if="timeInfoBtnShow!='0'">
        <el-button type="primary" @click="jumpFill">工时填报</el-button>
      </div>
      <el-form :inline="true" class="form">
        <el-form-item label="项目计划总工时:">
          <span>{{totalHours || 0}}</span>
        </el-form-item>
        <el-form-item label="已确认总工时:">
          <span>{{confirmedWorkTime || 0}}</span>
        </el-form-item>
        <el-form-item label="年月:">
          <el-date-picker
            v-model="date"
            @change="getProjectMemberWorkTimeInfo"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span style="float:right" class="renyue">(单位:人月)</span>
      <div class="timeSheet-table">
        <template>
          <el-table
            sum-text="合计:"
            :data="timeSheetData"
            style="width: 100%"
            :cell-class-name="firstColumn"
            :summary-method="getSummaries"
            show-summary>
            <el-table-column prop="date" label="序号" :width="'100px'">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="employeeNum" label="员工编号"></el-table-column>
            <el-table-column prop="employeeName" label="员工名称"></el-table-column>
            <el-table-column prop="projectRoleCode" label="项目角色"></el-table-column>
            <el-table-column prop="orgName" label="所属部门"></el-table-column>
            <el-table-column prop="totalWorkTimeNum" label="累计已确认工时"></el-table-column>
            <el-table-column prop="totalYearWorkTimeNum" label="本年度已确认工时"></el-table-column>
            <el-table-column prop="totalMonthWorkTimeNum" label="当月已确认工时"></el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import groupAPI from '@/serve/API_groupPlanProject'
import API_PJ from '@/serve/API_project'
import API from '@/serve/API_projectInfo'
import simulationData from './data'
import { loadavg } from 'os'
import { mapGetters } from 'vuex'
export default {
  computed: { ...mapGetters([{ userInfo: 'USERENTITY/userInfo' }]) },
  data () {
    return {
      date: this.getNowTime(),
      timeSheetData: [],
      confirmedWorkTime: null,
      totalHours: '',
      projectCode: this.$route.params.projectCode,
      projectpCompanyCode: null,
      roleList: [],
      projectBaseInfo: {},
      timeInfoBtnShow: '0'
    }
  },
  created () {
    this.queryWorkTimeSubmitType()
    this.getProjectInfo()
    this.getProjectCompanyCode()
    this.getPlanOverallManHour()
  },
  methods: {
    queryWorkTimeSubmitType () {
      let param = {
        projectCode: this.projectCode
      }
      groupAPI.queryWorkTimeSubmitType(param)
        .then(res => {
          this.timeInfoBtnShow = res
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常,请稍后再试!',
            type: 'error',
            showClose: true
          })
        })
    },
    // 跳转至工时填报页面
    jumpFill () {
      let path = ''
      let text = ''
      switch (this.timeInfoBtnShow) {
        case 1:
          path = '/timeSheet/timeCalendarSubmit'
          text = '是否跳转到工时填报页面?'
          break
        case 2:
          path = '/timeSheet/monthTimeSubmit'
          text = '是否跳转到工时填报页面?'
          break
        case 3:
          path = '/timeSheet/timeConfirm'
          text = '是否跳转到工时导入页面?'
          break
        case 4:
          path = '/timeSheet/timeConfirm'
          text = '是否跳转到工时导入页面?'
          break
      }
      this.$confirm(' ', text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.$router.push({
            path: path
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getProjectInfo () {
      API_PJ.queryEffectiveProjectInfo(this.projectCode)
        .then(res => {
          if (res.projectBaseInfo.projectDetailsStatus && res.projectBaseInfo.projectDetailsStatus.toString() === '8') {
          // 项目状态 -> 已关闭
            this.date = this.getNowTime(res.projectBaseInfo.actualFinishTime)
          }
          this.getProjectCompanyCode()
          this.getPlanOverallManHour()
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 根据项目编号查询该项目所属公司编码
    getProjectCompanyCode () {
      API.getProjectCompanyCode({ projectCode: this.projectCode })
        .then(res => {
          this.projectpCompanyCode = res || this.$store.getters['USERENTITY/userInfo'].userAuth.companyCode
          this.getConfirmedWorkTime(res)
          this.getProjectMemberWorkTimeInfo(res)
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 根据项目编号查询计划总工时
    getPlanOverallManHour () {
      API.getPlanOverallManHour({ projectCode: this.projectCode })
        .then(res => {
          this.totalHours = res
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取项目已确认工时
    getConfirmedWorkTime (projectpCompanyCode) {
      let param = [{
        projectCode: this.projectCode, // 项目编号
        projectCompanyCode: this.projectpCompanyCode // 项目所属公司编码
        // timeYear: this.date // 查询年份(非必填)  YYYY
      }]
      API.getConfirmedWorkTime(param)
        .then(res => {
          if (res && res.length) {
            this.confirmedWorkTime = res[0].confirmedWorkTime
          }
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查询指定项目下项目人员的工时填报总计
    getProjectMemberWorkTimeInfo (projectpCompanyCode) {
      if (!this.date) return
      let param = {
        projectCode: this.projectCode, // 项目编号
        projectCompanyCode: this.projectpCompanyCode, // 项目所属公司编码
        timeMonth: this.date // 查询年份(非必填)  YYYY
      }
      API.getProjectMemberWorkTimeInfo(param)
        .then(res => {
          if (res && res.length) {
            this.timeSheetData = res
            this.getProjectRole()
          }
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 数据字典 获取角色信息
    getProjectRole () {
      API.dictValByCode('PROJECT-ROLE')
        .then(res => {
          this.roleList = res
          for (let i = 0; i < this.roleList.length; i++) {
            this.roleCodeChinese(this.roleList[i])
          }
        })
        .catch(e => {
          this.isEdit = false
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '...失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 角色code中文转换
    roleCodeChinese (roleItem) {
      for (let i = 0; i < this.timeSheetData.length; i++) {
        if (this.timeSheetData[i] && this.timeSheetData[i].projectRoleCode) {
          let arr = this.timeSheetData[i].projectRoleCode.split(',')
          if (arr.indexOf(roleItem.valueCode) !== -1) {
            arr.splice(arr.indexOf(roleItem.valueCode), 1, roleItem.name)
          }
          this.timeSheetData[i].projectRoleCode = arr.join()
        }
      }
    },
    //获取时间
    getNowTime (timestamp) {
      let now = timestamp ? new Date(timestamp) : new Date()
      let year = now
        .getFullYear()
      let month = now
        .getMonth()
      month = month + 1
      month = month
        .toString()
        .padStart(2, '0')
      let defaultDate = `${year}-${month}`
      return defaultDate
    },
    firstColumn (row) {
      if (row.columnIndex === 0) {
        return 'firstColumn'
      }
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计:'
          return true
        } else if (index === 1) {
          sums[index] = ''
          return true
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              let num = addNum(prev, curr)
              // let num = (prev * 10) + (curr * 10)
              return num
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
function addNum (num1, num2) {
  if (num1 === null || num1 === undefined || num1 === '') return num2
  if (num2 === null || num2 === undefined || num2 === '') return num1
  var numArr1 = num1.toString()
    .split('.')
  var numArr2 = num2.toString()
    .split('.')
  if (!(numArr1[1] && numArr1[1].length)) {
    numArr1[1] = ''
  }
  if (!(numArr2[1] && numArr2[1].length)) {
    numArr2[1] = ''
  }
  var longFloat = numArr1[1].length > numArr2[1].length ? numArr1[1].length : numArr2[1].length
  var longInt = numArr1[0].length > numArr2[0].length ? numArr1[0].length : numArr2[0].length
  var differenceFloat = Math.abs(numArr1[1].length - numArr2[1].length)
  for (let i = 0; i < differenceFloat; i++) {
    if (numArr1[1].length > numArr2[1].length) {
      numArr2.push('0')
    } else {
      numArr1.push('0')
    }
  }
  var newNum1 = numArr1.join('')
  var newNum2 = numArr2.join('')
  var total = (parseInt(newNum1) + parseInt(newNum2)).toString()
  if (total.length < (longFloat + longInt)) {
    for (let i = total.length; i < (longFloat + longInt); i++) {
      total = '0' + total
    }
  }
  var totalNumArr = total.split('')
  totalNumArr.splice(total.length - longFloat, 0, '.')
  return parseFloat(totalNumArr.join(''))
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1365px) and (max-width: 1450px){
  .timeSheet{
    width: 1000px !important;
  }
}

@media screen and (max-width: 1364px){
  .timeSheet{
    width: 960px !important;
  }
}
.workInformation {
  background: #f6f6f6;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  .head-navigation {
    height: 50px;
    line-height: 50px;
    width: 100%;
    background: #fff;
    text-align: center;
  }
  .title {
    text-align: center;
    font-size: 26px;
    font-weight: 600;
    color: #333333;
    text-align: center;
    line-height: 26px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .timeSheet {
    position: relative;
    padding-left: 30px;
    padding-right: 47px;
    padding-bottom: 40px;
    background: #fff;
    width: 1180px;
    margin: 0 auto;
    box-sizing: border-box;
    .btn {
      position: absolute;
      right: 10px;
      top: -42px;
    }
    .renyue {
      font-size: 12px;
      color: #595959;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 10px;
    }
    .form {
      padding-top: 34px;
      padding-bottom: 10px;
      height: 32px;
      /deep/.el-form-item {
        line-height: 32px;
        width: 33.3%;
        margin-right: 0px;
        &:first-child {
          .el-form-item__label {
            font-size: 14px;
            color: rgba(0,0,0,0.85);
            text-align: right;
            line-height: 32px;
            height: 32px;
          }
          .el-form-item__content {
            margin-left: 8px;
            line-height: 32px;
            span {
              // width: 204px;
              height: 32px;
              display: inline-block;
            }
          }
        }
        &:nth-child(2) {
          // margin-left: 30px;
          .el-form-item__label {
            font-size: 14px;
            color: rgba(0,0,0,0.85);
            text-align: right;
            line-height: 32px;
            width: 108px;
            height: 32px;
          }
          .el-form-item__content {
            margin-left: 8px;
            line-height: 32px;
            span {
              // width: 204px;
              height: 32px;
              display: inline-block;
            }
          }
        }
        &:nth-child(3) {
          // margin-left: 28px;
          .el-form-item__label {
            font-size: 14px;
            color: rgba(0,0,0,0.85);
            text-align: right;
            line-height: 32px;
            width: 52px;
            height: 32px;
          }
          // .el-form-item__content {
            // margin-left: 8px;
          // }
        }
      }
    }
    /deep/.el-table {
      .el-table__header {
        thead.has-gutter {
          th {text-align: center;}
        }
      }
      .el-table__body {
        tr {
          overflow: hidden;
          td {text-align: center;}
        }
      }
      .el-table__footer {
        .has-gutter {
          tr {
            text-align: center !important;
            td {background: #fff !important;text-align: center;}
          }
          .el-table_1_column_1 {
            text-align: left;
            padding-left: 30px
          }

        }
      }
      &::before {
        width: 0px !important;
        height: 0px !important;
        // display: none !important;
      }
    }
  }
}
.el-table{
  /deep/{
    th{
      text-align: center;
    }
    th.gutter{
      display: initial !important;
      width: 0px !important;
      overflow: hidden;
    }
    .el-table__body-wrapper,.el-table__header-wrapper{
      tr td,tr th{
        &:first-child{
          border-left:1px solid #E5E5E5;
        }
        &:last-child{
          border-right:1px solid #E5E5E5;
        }
      }
      &::before {
        width: 0px !important;
        height: 0px !important;
        // display: none !important;
      }
    }
  }
}
.el-table{
  /deep/{
    th{
      text-align: center;
    }
    th.gutter{
      display: initial !important;
      width: 0px !important;
      overflow: hidden;
    }
    .el-table__body-wrapper,.el-table__header-wrapper{
      tr td,tr th{
        &:first-child{
          border-left:1px solid #E5E5E5;
        }
        &:last-child{
          border-right:1px solid #E5E5E5;
        }
      }
    }
    .el-table__footer-wrapper td{
      border-bottom:none;
    }
    .el-table__footer-wrapper td{
      border-bottom:none;
    }
  }
}
/deep/ .self-message-box-delete {
    width: 340px!important;
    padding-top: 20px !important;
}
</style>
