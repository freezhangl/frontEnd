<template>
  <div>
    <div class="to-be-read" v-if="showProject || showOther">
      <div class="header">
        <el-tabs v-model="businessCategoryCode" @tab-click="handleClick">
          <!-- <el-tab-pane label="计划" name="BC-PLAN"></el-tab-pane> -->
          <el-tab-pane label="项目" name="BC-PROJECT" v-if="showProject"></el-tab-pane>
          <!-- <el-tab-pane label="其他" name="BC-OTHER" v-if="showOther"></el-tab-pane> -->
        </el-tabs>
      </div>
      <div class="main">
        <div class="main-search">
          <el-form
            :model="toBeReadForm"
            :inline="true">
            <el-form-item
              label="发起人："
              prop="launch">
              <el-select
                v-model="toBeReadForm.launch"
                filterable
                remote
                placeholder="请输入"
                :remote-method="getUserList"
                :loading="selectLoading"
                clearable
                @clear="getUserList">
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="`${item.chineseName}/${item.uid}`"
                  :value="item.uid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="接收日期："
              prop="dateRange">
              <el-tooltip
                :disabled="!toBeReadForm.dateRange"
                popper-class="dateRangePop"
                :content="dateRangeTooltip"
                placement="top"
                effect="dark"
                :offset="-80">
                <el-date-picker
                  class="date-picker"
                  v-model.trim="toBeReadForm.dateRange"
                  type="datetimerange"
                  placeholder="请选择"
                  range-separator="～"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :default-time="['00:00:00']"
                  :clearable="true"
                  value-format="timestamp"
                  @keyup.enter.native="getToBeReadList">
                </el-date-picker>
              </el-tooltip>
            </el-form-item>
            <el-form-item  class="search-btn">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="getResSearch">查询</el-button>
              <el-button
                class="normal-btn"
                icon="el-icon-refresh-left"
                @click="searchReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="main-list">
          <selfTable
            :table-data="toBeReadList"
            :table-cols="tableCols"
            :is-pagination="true"
            :loading="loading"
            :height="'calc(100vh - 380px)'"
            :max-height="'calc(100vh - 380px)'"
            :pagination="{ pageSize: toBeReadForm.pageSize, pageNum: toBeReadForm.pageNum, total: total }"
            @refresh="getToBeReadList">
          </selfTable>
        </div>
      </div>
    </div>
    <div v-else style="color:red">请联系管理员开通此模块权限！</div>
  </div>
</template>

<script>

import selfTable from '@/components/table'
import { mapGetters } from 'vuex'
import API from '@/serve/API_processApprove'
import confirmNotificationAPI from './confirmNotification'
export default {
  name: 'myToBeRead',
  components: { selfTable },
  data () {
    return {
      loading: false,
      businessCategoryCode: 'BC-PROJECT',
      showProject: false,
      showOther: false,
      toBeReadForm: { //表单数据
        launch: '', //发起人
        dateRange: '', //接收日期
        total: 1, //数据总数
        pageSize: 10, //每页显示数量
        pageNum: 1 //页码
      },
      toBeReadList: [], //数据列表
      total: 0, //通知数量
      userOptions: [], // 发起人下拉列表
      selectLoading: false, // 下拉框加载
      tableCols: [ //表格配置
        {
          label: '任务标题',
          prop: 'title',
          align: 'left',
          padding: true,
          overflow: true,
          resizable: false
        },
        {
          label: '发起人',
          prop: 'launch',
          align: 'center',
          overflow: true,
          resizable: false
        },
        {
          label: '接收日期',
          prop: 'sendDate',
          align: 'left',
          overflow: true,
          resizable: false
        },
        {
          label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          btnList: [
            {
              id: 1,
              type: 'text',
              label: '详情',
              handle: this.toBeReadDetail
            }
          ]
        }
      ]
    }
  },
  computed: {
    dateRangeTooltip () {
      let val = ''
      if (this.toBeReadForm.dateRange) {
        val = this.$formatDate(this.toBeReadForm.dateRange[0], 'YYYY-MM-DD HH:mm:ss') +
        '～' + this.$formatDate(this.toBeReadForm.dateRange[1], 'YYYY-MM-DD HH:mm:ss')
      }
      return val
    },
    ...mapGetters({
      hasAuthTag: 'USERENTITY/hasAuthTag'
    })
  },
  methods: {
    //查询
    getResSearch () {
      this.toBeReadForm.pageNum = 1
      this.getToBeReadList()
    },
    //重置
    searchReset () {
      this.toBeReadForm = {
        launch: '', //发起人
        dateRange: '', //接收日期
        total: 1,
        pageNum: 1,
        pageSize: 10
      }
      this.getResSearch()
      this.getUserList(null)
    },
    //详情
    toBeReadDetail (row) {
      confirmNotificationAPI.confirmNotification(row.notificationid)
        .then(res => {
          if (res) {
            // let { href } = this.$router.resolve({
            //   path: row.actionurl
            // })
            // window.open(href, '_blank')
            let url1 = window.location.href
            url1 = url1.substring(0, url1.indexOf('#'))
            let url2 = url1 + row.actionurl.substring(row.actionurl.indexOf('#'), row.actionurl.length)
            window.open(url2 + '&isFromRMS=1', '_blank')
            this.getToBeReadList()
          } else {
            this.$message({
              message: '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    //获取待阅列表
    getToBeReadList (pageNum = this.toBeReadForm.pageNum, pageSize = this.toBeReadForm.pageSize) {
      this.loading = true
      this.toBeReadForm.pageNum = pageNum
      this.toBeReadForm.pageSize = pageSize
      let searchData = this.toBeReadForm
      if (searchData.dateRange) {
        searchData.dateRange[0] = this.$formatDate(searchData.dateRange[0], 'YYYY-MM-DD HH:mm:ss')
        searchData.dateRange[1] = this.$formatDate(searchData.dateRange[1], 'YYYY-MM-DD HH:mm:ss')
      }
      let params = {
        businessCategoryCode: this.businessCategoryCode,
        // businessCategoryCode: 'BC-PROJECT',
        createdBy: searchData.launch,
        beginTime: searchData.dateRange ? searchData.dateRange[0] : '',
        endTime: searchData.dateRange ? searchData.dateRange[1] : '',
        pageNum,
        pageSize
      }
      // this.toBeReadList = toBeReadData.toBeReadList.records
      // this.total = toBeReadData.toBeReadList.total
      API.getToBeReadList(params)
        .then(res => {
          this.loading = false
          res.records.forEach((item) => {
            item.sendDate = this.$formatDate(item.createtime, 'YYYY-MM-DD HH:mm:ss')
            item.launch = item.bizObject.createdName
          })
          this.toBeReadList = res.records
          this.total = res.total
        })
        .catch(err => {
          this.loading = false
          // this.applyForList = draftData.draftList.records
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    //tab切换
    handleClick (tab) {
      this.businessCategoryCode = tab.name
      this.toBeReadList = []
      this.searchReset()
    },
    // 根据组织编码获取用户列表
    getUserList (val) {
      if (!val) {
        this.userOptions = []
        return
      }
      this.selectLoading = true
      const params = {}
      params.orgCode = '00000000000000000000'
      params.userNameLike = val
      params.inSub = '1'
      params.pageNum = 1
      params.pageSize = 50
      API.getAllUserListByorgCode(params)
        .then(res => {
          this.selectLoading = false
          if (res) {
            this.userOptions = res.records
          } else {
            this.userOptions = []
          }
        })
        .catch(e => {
          this.selectLoading = false
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常,请稍后再试!',
              type: 'error',
              showClose: true
            })
          }
        })
    }
  },

  mounted () {
    this.showProject = this.hasAuthTag('work:toBeRead:pro')
    this.showOther = this.hasAuthTag('work:toBeRead:oth')
    if (this.showProject) {
      this.businessCategoryCode = 'BC-PROJECT'
    } else if (this.showOther) {
      this.businessCategoryCode = 'BC-OTHER'
    } else {
      this.businessCategoryCode = ''
    }
    if (this.$route.params.businessCategoryCode) {
      this.businessCategoryCode = this.$route.params.businessCategoryCode
    }
    this.getToBeReadList()
    // this.getUserList()
  }
}
</script>

<style lang="scss" scoped>
.to-be-read {
  background: #FFFFFF;
  .header {
    /deep/ .el-tabs__nav-wrap {
      padding: 0 30px;
    }
  }
  .main-search {
    background: white;
    padding: 19px 30px;
    margin-bottom: 10px;
    /deep/ .el-form-item__label {

      font-size: 14px;
      color: rgba(0,0,0,0.85);
      text-align: right;
      padding: 0;
    }
    .el-input {
      width: 220px;
    }
    .el-date-editor {
      width: 220px;
    }
    .search-btn{
      width: 180px;
      float: right;
      margin-right: 0;
    }
  }
  .main-list {
    padding: 0 30px 30px;
  }
  .main-footer {
    /deep/ .el-pagination{
      font-size: 12px;
      text-align: center;
      padding-bottom: 30px;
      /deep/ .el-select .el-input .el-input__inner{
        height: 28px;
        line-height: 28px;
        font-size: 12px;
      }
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 28px;
        font-size: 12px;
        background: #FFFFFF;
        border: 1px solid #E5E5E5;
        border-radius: 4px;
      }
      /deep/ .el-select .el-input .el-input__icon {
        line-height: 15px;
      }
      /deep/ .el-pagination__jump{
        margin-left: 0;
        height: 28px;
        font-size: 12px;
      }
      /deep/ .el-pager li, /deep/ .btn-prev, /deep/ .btn-next{
        min-width: 28px;
        height: 28px;
        padding: 0;
        background: #FFFFFF;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        margin: 0 4px;
        font-size: 12px;
        color: #12171F;
        font-weight: normal;
        text-align: center;
        line-height: 28px;
        &.active{
          color: #FFFFFF;
          background: #0B82FF;
          border-color: #0B82FF;
          &:hover{
            color: #FFFFFF;
          }
        }
        &:hover{
          color: #0B82FF;
        }
        &:disabled{
          color: #C0C4CC;
        }
      }
    }
  }
}
</style>
