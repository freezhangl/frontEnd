<template>
  <div class="main-warpper">
    <el-table :data="projectBaseInfo">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column
        label="项目名称"
        min-width="100px"
        align="left"
        property="projectName"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="handleClick(scope.row)" class="jump-detail">
            <span style="font-weight: bold">
              {{scope.row.projectName}}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目编码" property="projectCode" min-width="100px"></el-table-column>
      <el-table-column label="牵头承担部门" property="companyName" min-width="100px"></el-table-column>
      <el-table-column label="牵头承担单位项目经理" property="projectManager" min-width="140px"></el-table-column>
      <el-table-column
        label="项目类别"
        property="projectType"
        min-width="100px"
        :formatter="formatType"></el-table-column>
      <el-table-column
        label="计划立项时间"
        property="planApprovalTime"
        :formatter="formatDate"
        min-width="100px"></el-table-column>
      <el-table-column
        label="计划结项时间"
        property="planFinishTime"
        :formatter="formatDate"
        min-width="100px"></el-table-column>
      <el-table-column
        label="项目状态"
        property="projectStatus"
        show-overflow-tooltip
        min-width="100px">
        <template slot-scope="scope">
          <p v-if="scope.row.projectStatus==='0'"><span style="background:orange;"></span>待立项</p>
          <p v-if="scope.row.projectStatus==='1'"><span style="background:green;"></span>已立项</p>
          <p v-if="scope.row.projectStatus==='2'"><span style="background:red;"></span>已终止</p>
          <p v-if="scope.row.projectStatus==='3'"><span style="background:green;"></span>已结项</p>
          <p v-if="scope.row.projectStatus==='4'"><span style="background:gray;"></span>已关闭</p>
          <p v-if="scope.row.projectStatus==='5'"><span style="background:green;"></span>已预立项</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import API from '@/serve/API_undertakeView'
import ProjectAPI from '@/serve/API_groupPlan'
import { type } from 'os'
export default {
  data () {
    return {
      projectBaseInfo: [],
      typeOptions: [],
      showStatus: false
    }
  },
  props: {
    receiveData: {
      type: Array,
      default: () => []
    },
    info: {}
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo'
    })
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val.length > 0) {
          this.analyzeData()
        } else {
          this.projectBaseInfo = []
        }
      }
    }
  },
  methods: {
    // 日期格式化
    formatDate (row, column) {
      var date = row[column.property]
      if (date) {
        return this.$formatDate(date, 'YYYY-MM-DD')
      } else {
        return date
      }
    },
    analyzeData () {
      this.projectBaseInfo = JSON.parse(JSON.stringify(this.receiveData))
    },
    formatType (row, column) {
      var type = row[column.property]
      if (type && this.typeOptions[type]) {
        return this.typeOptions[type]
      } else {
        return type
      }
    },
    //项目类型
    getProjectType () {
      API.dictValByCode('ITEM_CATEGORY')
        .then(res => {
          this.typeOptions = {}
          res.forEach(item => {
            this.typeOptions[item.valueCode] = item.name
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    handleClick (row) { //点击项目名称进入项目详情
      // 判断是否具有权限
      ProjectAPI.authVerification({ projectCode: row.projectCode, permissionCode: '01' })
        .then(res => {
          if (res) {
            let { href } = this.$router.resolve({
              path: `/groupPlan/projectDetail/${row.projectCode}?developPackage=${this.$route.query.developPackage}&projectCategory=u`
            })
            // 打开新的窗口
            let $window = window.open(href, '_blank')
            // if (this.timer[row.projectCode]) {
            //   window.clearInterval(this.timer[row.projectCode])
            // }
            // this.timer[row.projectCode] = setInterval(() => {
            //   if ($window && $window.closed) {
            //     if (this.timer[row.projectCode]) {
            //       window.clearInterval(this.timer[row.projectCode])
            //     }
            //   }
            // }, 500)
          } else {
            this.$message({
              message: '无项目查询权限！',
              showClose: true,
              type: 'warning'
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '用户权限校验失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  },
  mounted () {
  },
  created () {
    this.getProjectType()
    switch (this.$route.query.projectCategory) {
      case 'd':
        switch (this.$route.query.developPackage) {
          case 'IS_RD_1': // 集团统筹需求单位一般支撑包项目
            this.showStatus = false
            break
          case 'IS_RD_0': // 集团统筹需求单位非一般支撑包项目
            this.showStatus = true
            break
        }
        break
    }
  },
  filters: {
  }
}
</script>
<style lang="scss" scoped>
.main-warpper {
  /deep/ .el-table {
    width: 1136px !important;
    border-right: 1px solid #E9E9E9 !important;
    border-left: 1px solid #E9E9E9 !important;
    .has-gutter {
      width: 1076px !important;
      background: #F4F4F4 !important;
    }
    .el-table__header-wrapper {background: #f4f4f4}
    table {
      // width: 1060px !important;
      thead {width: 1076px !important}
      width: 100%;
      tbody {
        tr {
          td:nth-child(9) {
            span {
              width:5px;
              height:5px;
              border-radius:50%;
              vertical-align:middle;
              display:inline-block;
              margin-right: 5px;
            }
          }
            .jump-detail {
              cursor: pointer;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              @include color()
            //   &:hover {
            //     @include color()
            // }
          }
          /deep/ .el-table__row{
                td{
                  &:nth-child(1){
                    cursor: pointer;
                    &:hover {
                      @include color()
                    }
                  }
                }
              }
        }
      }
    }
  }
}
.project-budget{

  .budget-body{
    overflow-x: auto;
    // overflow-y:visible;
    width: 100%;
  }
  // th:first-child{position: fixed;left: 5px}
  .budget-con{
    min-width: 100%;
    border-collapse: collapse;
    border: 1px solid #E8E8E8;
    // position: relative;
    tr {
      th,td{
        height: 45px;
        padding: 0 20px;
        border-left: none;
        border-right: none;
        // &:last-child{
          // border-collapse:collapse;
        // }
      }
      th,.col-title{
        background: #F4F4F4;
        font-weight: bold;
      }
      .col-title{
        border-right: 1px solid #E8E8E8;
        width: 126px;
        min-width: 126px;
        max-width: 126px;
      }
      .year-title {
        width: 220px;
        min-width: 220px;
        max-width: 220px;
      }
      .bg-title {
        background: #F4F4F4;
        font-weight: bold;
      }
      th:nth-child(1){
        border-right: 1px solid #E8E8E8;
      }
      .data-cell{
        text-align: center;
      }
      th.first{
        position: relative;
        span:nth-child(1){
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-100%, -150%);
        }
        span:nth-child(2){
          position: absolute;
          top: 0%;
          left: 50%;
          transform: translate(0%, 50%);
        }
        &::before{
          content: "";
          position: absolute;
          width: 1px;
          height:345px;/*这里需要自己调整，根据td的宽度和高度*/
          top:0;
          left:0;
          background-color: #E9E9E9;
          display: block;
          transform: rotate(-75deg);/*这里需要自己调整，根据线的位置*/
          transform-origin: top;
        }
      }
    }
    .none-border {
      border-right: none !important;
    }
    .sum-color {
      color: #20A0FF;
    }
    .jump-detail {
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        @include color()
      }
    }
  }
  margin-top: 20px;
}
</style>
