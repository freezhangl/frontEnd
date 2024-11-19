<template>
  <div class="important-notice">
    <div class="notice-header">
      <el-form
        :inline="true"
        v-model="searchNoticeForm">
        <el-form-item
          label="通知标题:">
          <el-input
            placeholder="请输入"
            :clearable="true"
            v-model.trim="searchNoticeForm.noticeTitle"></el-input>
        </el-form-item>
        <el-form-item
          label="发送时间:">
          <el-tooltip
            :disabled="!searchNoticeForm.dateRange"
            :content="dateRangeTooltip"
            popper-class="dateRangePop"
            placement="top"
            effect="dark"
            :offset="-80">
            <el-date-picker
              class="date-picker"
              v-model.trim="searchNoticeForm.dateRange"
              type="datetimerange"
              placeholder="请选择"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00']"
              :clearable="true"
              value-format="timestamp"
              @keyup.enter.native="getResSearch">
            </el-date-picker>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="通知状态:">
          <el-select
            v-model="searchNoticeForm.status"
            placeholder="请选择"
            :clearable="true">
            <el-option label="未读" :value="0"></el-option>
            <el-option label="已读" :value="1"></el-option>
          </el-select>
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
    <div class="notice-main">
      <div class="main-header">
        <el-button icon="el-icon-check" class="normal-btn" @click="updateReadFlag(selectNoticeIdList)">标记已读</el-button>
      </div>
      <div class="main-list">
        <el-table
          :data="noticeList"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            width="55px">
          </el-table-column>
          <el-table-column
            label="ID"
            prop="id"
            width="150"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="通知标题"
            width="350"
            prop="noticeTitle"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="是否置顶"
            width="200"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.topFlag == 0 ? '否' : '是'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发送时间"
            width="200"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.sendDate | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="通知状态"
            align="center">
            <template slot-scope="scope">
              <span class="status" :class="scope.row.readFlag == 0 ? 'editing' : 'going'"></span>
              <span>{{scope.row.readFlag == 0 ? '未读' : '已读'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
            align="center">
            <template slot-scope="scope">
              <el-button @click="noticeDetail(scope.$index, scope.row)" type="text">详情</el-button>
              <el-button @click="noticeTopFlagChange(scope.$index, scope.row)" type="text">{{scope.row.topFlag === 0 ? '置顶' : '取消置顶'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="prev, pager, next, sizes, jumper"
          :total="total"
          background>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@lib/common/util/common'
import API from '../serve'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'importantNotice',
  data () {
    return {
      searchNoticeForm: {
        noticeTitle: '',
        dateRange: '',
        status: ''
      }, //查询表单配置
      noticeList: [], //通知列表
      pageSize: 10, //查询条数
      pageNum: 1, //查询页数
      total: 1, //通知数量
      selectNoticeIdList: [] //选中的通知id List
    }
  },

  computed: {
    //tooltip显示内容 时间戳转换
    dateRangeTooltip () {
      let val = ''
      if (this.searchNoticeForm.dateRange) {
        val = formatDate(this.searchNoticeForm.dateRange[0], 'YYYY-MM-DD HH:mm:ss') +
        '～' + formatDate(this.searchNoticeForm.dateRange[1], 'YYYY-MM-DD HH:mm:ss')
      }
      return val
    },
    ...mapGetters({
      noticeNum: 'HOME/noticeNum'
    })
  },

  methods: {
    ...mapMutations({
      setNoticeNum: 'HOME/setNoticeNum'
    }),
    //查询
    getResSearch () {
      this.pageNum = 1
      this.getNoticeList()
    },
    //重置
    searchReset () {
      this.searchNoticeForm = {
        noticeTitle: '',
        dateRange: '',
        status: ''
      }
      this.getNoticeList(this.pageSize, 1)
    },
    //详情
    noticeDetail (index, row) {
      let idList = [row.id]
      this.updateReadFlag(idList, true)
      let { href } = this.$router.resolve({
        path: '/home/importantNotice/importantNoticeDetail',
        query: {
          id: row.id
          // noticeTitle: row.noticeTitle,
          // sendDate: row.sendDate,
          // noticeContent: row.noticeContent
        }
      })
      window.open(href, '_blank')
    },
    //置顶/取消置顶
    noticeTopFlagChange (index, row) {
      let param = {
        id: row.id,
        topFlag: row.topFlag === 1 ? 0 : 1
      }
      API.updatedNoticeTopFlag(param)
        .then(res => {
          if (res) {
            if (row.topFlag === 0) {
              this.$message({
                message: '已成功置顶！',
                type: 'success',
                showClose: true
              })
              this.getNoticeList()
            } else {
              this.$message({
                message: '已取消置顶！',
                type: 'success',
                showClose: true
              })
              this.getNoticeList()
            }
          } else {
            this.$message({
              message: '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    //标记已读
    updateReadFlag (idList, fromDetail = false) {
      if (idList && idList.length > 0) {
        let param = idList
        API.updatedNoticeReadFlag(param)
          .then(res => {
            if (res !== null) {
              if (!fromDetail) {
                this.$message({
                  message: `已批量已读${res.readCount}条数据！`,
                  type: 'success',
                  showClose: true
                })
              }
              this.selectNoticeIdList = []
              // TODO: 每次触发已读后将剩余未读条数存放到Vuex中
              this.setNoticeNum(res.unreadCount)
              // console.log('this.noticeNum', this.noticeNum)
              this.getNoticeList()
            } else {
              this.$message({
                message: '服务器异常，请稍后再试！',
                type: 'error',
                showClose: true
              })
            }
          })
          .catch(err => {
            this.$message({
              message: err.message || '服务器异常，请稍后再试！',
              type: 'error'
            })
          })
      } else {
        this.$message({
          message: '请勾选数据后重试！',
          type: 'warning',
          showClose: true
        })
      }
    },
    //选择框改变事件
    handleSelectionChange (selection) {
      if (selection.length > 0) {
        let selectNoticeIdList = []
        selection.forEach(item => {
          selectNoticeIdList.push(item.id)
        })
        // console.log(selectNoticeIdList)
        this.selectNoticeIdList = selectNoticeIdList
      } else {
        this.selectNoticeIdList = []
      }
    },
    //获取通知列表
    getNoticeList (pageSize = this.pageSize, pageNum = this.pageNum) {
      this.pageSize = pageSize
      this.pageNum = pageNum
      let noticeStartDate = ''
      let noticeEndDate = ''
      if (this.searchNoticeForm.dateRange) {
        noticeStartDate = formatDate(this.searchNoticeForm.dateRange[0], 'YYYY-MM-DD HH:mm:ss')
        noticeEndDate = formatDate(this.searchNoticeForm.dateRange[1], 'YYYY-MM-DD HH:mm:ss')
      }
      let param = {
        noticeTitle: this.searchNoticeForm.noticeTitle,
        noticeStartDate: noticeStartDate,
        noticeEndDate: noticeEndDate,
        readFlag: this.searchNoticeForm.status,
        pageNum: pageNum,
        pageSize: pageSize
      }
      // console.log(param)
      API.getNoticeList(param)
        .then(res => {
          // console.log(res)
          if (res && res.records) {
            this.noticeList = res.records
            this.total = res.total
          } else {
            this.noticeList = []
          }
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '通知列表获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    //展示数量改变
    handleSizeChange (val) {
      this.pageNum = 1
      this.getNoticeList(val, this.pageNum)
    },
    //页码改变
    handleCurrentChange (val) {
      this.selectNoticeIdList = []
      this.getNoticeList(this.pageSize, val)
    }
  },

  mounted () {
    this.getNoticeList()
  }
}
</script>

<style lang="scss" scoped>
.important-notice {
  .notice-header {
    background: #FFFFFF;
    padding: 30px;
    margin-bottom: 10px;
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
    /deep/ .el-form:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }
  .notice-main {
    background: #FFFFFF;
    padding: 20px 30px;
    /*height: 435px;*/
    .main-header {
      margin-bottom: 20px;
    }
    .main-list {
      /deep/ .el-table__header {
        background: #F4F4F4;
      }
      /deep/ .el-table__body {
        border-left: 1px solid #E5E5E5;
        border-right: 1px solid #E5E5E5;
      }
      .status {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 5px;
        position: relative;
        bottom: 2.5px;
      }
      .going {
        background: #09b0f7;
      }
      .editing {
        background: #ffb717;
      }
    }
    .main-footer {
      /deep/ .el-pagination{
        font-size: 12px;
        text-align: center;
        margin-top: 15px;
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
            //background: #0B82FF;
            //border-color: #0B82FF;
            @include background-color();
            @include border();
            &:hover{
              color: #FFFFFF !important;
            }
          }
          &:hover{
            //color: #0B82FF;
            @include color();
          }
          &:disabled{
            color: #C0C4CC;
          }
        }
      }
    }
  }
}
</style>
