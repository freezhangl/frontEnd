<template>
  <div class="task-list">
    <div class="main-content">
      <div class="head-btn">
        <span style="float: right;" v-if="isShowBtn">
          <el-button
            class="normal-btn"
            icon="el-icon-circle-plus-outline"
            @click="judgeTaskApply">新增任务申请</el-button>
        </span>
      </div>
      <div class="main-table">
        <self-table
          :table-data="taskData.taskList"
          :table-cols="taskCols"
          :loading="loading"
          :is-pagination="false"
          :is-index="true"
          :index-title="'序号'"
          :index-method="setIndexMethod"></self-table>
      </div>
    </div>
  </div>
</template>
<script>

import selfTable from '@/components/table'
import API from '@/serve/API_project'
import { getStore } from '@/store'
export default {
  name: 'changeFlow',
  components: { selfTable },
  data () {
    return {
      isShowBtn: false, // 是否显示发起任务申请按钮
      currentUserName: getStore().getters['USERENTITY/userInfo'].userAuth.chineseName, // 当前登录用户姓名
      loading: false,
      taskData: { // 任务申请数据
        taskList: [], // 任务申请列表
        body: {
          'taskName': null, // 任务名称
          'creatorName': null, // 发起人
          'initiatedDate': null, // 发起日期
          'approveState': null, // 状态
          'applicationBudget': null // 任务预算(万元)
        }
      },
      taskCols: [ // 任务申请列表表头
        {
          label: '任务名称',
          prop: 'name',
          align: 'left',
          overflow: true,
          resizable: false,
          type: 'link',
          minwidth: '300px',
          handleClick: this.showTaskDetail
        },
        {
          label: '发起人',
          prop: 'creatorName',
          align: 'left',
          overflow: true,
          minwidth: '200px',
          resizable: false
        },
        {
          label: '发起日期',
          prop: 'initiatedDate',
          align: 'left',
          overflow: true,
          resizable: false,
          minwidth: '200px',
          formatter: this.formatDate
        },
        {
          label: '状态',
          prop: 'taskState',
          align: 'left',
          overflow: true,
          minwidth: '200px',
          resizable: false
        },
        {
          label: '任务预算(万元)',
          prop: 'applicationBudget',
          align: 'left',
          overflow: true,
          minwidth: '200px',
          resizable: false
        },
        { label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          minwidth: '100px',
          btnList: [
            { id: 1, type: 'text', label: '查看', handle: this.showTaskDetail },
            { id: 2, type: 'text', label: '编辑', isHidden: this.showEditBtn, handle: this.editTask }
          ]
        }
      ]
    }
  },
  props: {
  },
  created () {
    this.isShowTaskBtn()
  },
  methods: {
    //设置表格索引
    setIndexMethod (index) {
      if (index < 9) {
        return '0' + (index + 1)
      }
      return index + 1
    },
    // 日期格式化
    formatDate (val) {
      if (val) {
        return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    // 将金额转化为万元
    transformNum (str) {
      return Number(str) + '万'
    },
    // 判断发起任务申请按钮是否展示--项目经理且项目明细为草稿
    isShowTaskBtn () {
      const param = {
        projectCode: this.$route.params.projectCode
      }
      API.isShowTaskBtn(param)
        .then(res => {
          this.isShowBtn = res
          this.getTaskList()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '发起任务申请按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },

    // 获取任务申请列表
    getTaskList () {
      let params = {
        projectCode: this.$route.params.projectCode
      }
      API.queryTaskList(params)
        .then(res => {
          this.loading = false
          res.forEach(element => {
            switch (Number(element.taskState)) {
              case 1:
                element.taskState = '草稿'
                break
              case 2:
                element.taskState = '申请审批中'
                break
              case 3:
                element.taskState = '执行中'
                break
              case 4:
                element.taskState = '验收审批中'
                break
              case 5:
                element.taskState = '已完成'
                break
            }
          })
          res.forEach(item => {
            item.applicationBudget = this.transformNum(item.applicationBudget)
          })
          this.taskData.taskList = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取任务申请列表失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 新增任务申请
    judgeTaskApply () {
      API.checkProjectStateAndUserPermission({ projectCode: this.$route.params.projectCode })
        .then(res => {
          if (res) {
            this.$router.push({
              path: '/task/taskEdit',
              query: {
                operate: '01', //新增
                projectCode: this.$route.params.projectCode
              }
            })
          } else {
            this.$message({
              message: res.message || '新增任务申请失败，请稍后重试！',
              type: 'warning',
              showClose: true
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '新增任务申请失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查看任务申请详情
    showTaskDetail (row) {
      this.$router.push({
        path: '/task/taskDetail',
        query: {
          projectCode: this.$route.params.projectCode,
          approveNo: row.approveNo,
          approveState: row.approveState
        }
      })
    },
    // 编辑任务申请
    editTask (row) {
      this.$router.push({
        path: '/task/taskEdit',
        query: {
          operate: '02', //编辑
          projectCode: this.$route.params.projectCode,
          approveNo: row.approveNo
        }
      })
    },
    // 是否展示编辑按钮--任务申请为草稿状态且是任务发起人是可编辑
    showEditBtn (row) {
      return row.approveState === '1' && row.creatorName === this.currentUserName
      // return true
    }
  }
}
</script>
<style lang="scss" scoped>
.task-list{
  /deep/ .el-table .cell.el-tooltip {
    white-space: nowrap;
    min-width: 50px;
  }
  .main-content{
    margin-top: 15px;
    background-color: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    padding: 10px 25px 20px;
    z-index: -100;
    button{
      font-size: 14px;
      border-radius: 2px;
      height: 30px;
    }
    .head-btn {
      padding: 15px 0px;
      line-height: 40px;
      margin-bottom: 30px;
      .el-button {
        height: 30px;
        border-radius: 2px;
      }
    }
  }
}
</style>
