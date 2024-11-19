<template>
  <div class="task-list">
    <div class="main-content">
      <div class="head-btn">
        <span style="float: right;" v-if="isShowBtn">
          <el-button
            class="normal-btn"
            icon="el-icon-circle-plus-outline"
            @click="judgeTaskApply">新建</el-button>
        </span>
      </div>
      <sp-table
        :table-data="entrustmentData.entrustmentList"
        :table-cols="taskCols"
        :loading="loading"
        :is-pagination="false"
        :is-index="true"
        :index-title="'序号'"></sp-table>
    </div>
  </div>
</template>
<script>
import API from '@/serve/API_businessFlow'
import { getStore } from '@/store'

import { deleteZero } from '@/utils/numberAdd'
export default {
  name: 'entrustmentFlow',
  data () {
    return {
      developPackage: this.$route.query.developPackage, //是否研发包项目,IS_RD_0否，IS_RD_1是
      projectCategory: this.$route.query.projectCategory, //需求方项目d还是承担方项目u
      // businessType: 'BT-ENTRUST-LETTER',
      businessType: 'BT-DEMAND-ENTRUST-LETTER',
      isShowBtn: false, // 是否显示发起委托函按钮
      currentUserName: getStore().getters['USERENTITY/userInfo'].userAuth.chineseName, // 当前登录用户姓名
      loading: false,
      entrustmentData: { // 委托函数据
        entrustmentList: [], // 委托函列表
        body: {
          'taskName': null, // 任务名称
          'creatorName': null, // 发起人
          'initiatedDate': null, // 发起日期
          'approveState': null, // 状态
          'comment': null, // 评价
          'applicationBudget': null // 任务预算(万元)
        }
      },
      taskCols: [ // 委托函列表表头
        {
          label: '任务名称',
          prop: 'taskName',
          align: 'left',
          overflow: true,
          resizable: false,
          type: 'link',
          handleClick: this.showEntrustmentDetail
        },
        {
          label: '发起人',
          prop: 'creatorName',
          align: 'center',
          overflow: true,
          resizable: false
        },
        {
          label: '发起日期',
          prop: 'initiatedDate',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.formatDate
        },
        {
          label: '状态',
          prop: 'letterStateValue',
          align: 'center',
          overflow: true,
          resizable: false
        },
        {
          label: '评价',
          prop: 'evaluateContent',
          align: 'center',
          overflow: true,
          resizable: false
        },
        {
          label: '任务预算(万元)',
          prop: 'applicationBudget',
          align: 'left',
          overflow: true,
          resizable: false
        },
        { label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          width: '100px',
          btnList: [
            { id: 1, type: 'text', label: '查看', handle: this.showEntrustmentDetail },
            { id: 2, type: 'text', label: '编辑', isHidden: this.showEditBtn, handle: this.editEntrustment }
          ]
        }
      ]
    }
  },
  props: {
  },
  created () {
    this.isShowEntrustmentBtn()
    this.getEntrustmentList()
  },
  methods: {
    // 日期格式化
    formatDate (val) {
      if (val) {
        return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    // 将金额转化为万元
    transformNum (str) {
      return deleteZero(str) + ''
    },
    // 判断发起任务申请按钮是否展示
    isShowEntrustmentBtn () {
      const params = {
        projectCode: this.$route.params.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.isShowApproveButton(params)
        .then(res => {
          this.isShowBtn = res // 需要根据接口反参处理
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '新建委托函按钮权限判断失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },

    // 获取委托函列表
    getEntrustmentList () {
      let params = {
        projectCode: this.$route.params.projectCode,
        businessType: this.businessType // 单据业务类型编码
      }
      API.getApproveList(params)
        .then(res => {
          this.loading = false
          let arr = res.map(item => {
            item = { ...item.entrustLetterInfo, ...item.projectApproveInfo }
            item.applicationBudget = item.taskBudget ? this.transformNum(item.taskBudget) : '-'
            return item
          })
          arr.forEach(element => {
            switch (Number(element.taskState)) {
              case 'PR-ENTRUST-LETTER-STATE-DRAFT':
                element.taskState = '草稿'
                break
              case 'PR-ENTRUST-LETTER-STATE-APPLYING':
                element.taskState = '申请审批中'
                break
              case 'PR-ENTRUST-LETTER-STATE-EXECUTING':
                element.taskState = '执行中'
                break
              case 'PR-ENTRUST-LETTER-STATE-CHECKING':
                element.taskState = '验收审批中'
                break
              case 'PR-ENTRUST-LETTER-STATE-FINISH':
                element.taskState = '已完成'
                break
            }
          })
          this.entrustmentData.entrustmentList = arr
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取委托函列表失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 新增委托函
    judgeTaskApply () {
      let params = {
        businessType: this.businessType, // 立项单据业务类型编码
        projectCode: this.$route.params.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res) {
            this.$router.push({
              // TODO 根据router配置进行定义
              name: 'GroupEntrustmentFlowEdit',
              // path: 'planAdjustFlowEdit',
              query: {
                addEntrust: 'true', //新增
                businessType: this.businessType,
                projectCode: this.$route.params.projectCode,
                developPackage: this.developPackage,
                projectCategory: this.projectCategory
              }
            })
          } else {
            this.$message({
              message: res.message || '新增委托函失败，请稍后重试！',
              type: 'warning',
              showClose: true
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查看委托函详情
    showEntrustmentDetail (row) {
      this.$router.push({
        path: '/groupPlan/entrustmentFlow/entrustmentFlowDetail',
        query: {
          projectCode: this.$route.params.projectCode,
          approveNo: row.approveNo,
          letterCode: row.letterCode,
          approveState: row.approveState,
          developPackage: this.developPackage,
          projectCategory: this.projectCategory
        }
      })
    },
    // 编辑委托函
    editEntrustment (row) {
      let params = {
        businessType: this.businessType, // 立项单据业务类型编码
        projectCode: this.$route.params.projectCode
      }
      API.validateApprove(params)
        .then(res => {
          if (res) {
            this.$router.push({
              // TODO 根据router配置进行定义
              name: 'GroupEntrustmentFlowEdit',
              // path: '/groupPlan/entrustmentFlow/entrustmentFlowEdit',
              query: {
                addEntrust: 'false', //编辑
                businessType: this.businessType,
                letterCode: row.letterCode,
                projectCode: this.$route.params.projectCode,
                developPackage: this.developPackage,
                projectCategory: this.projectCategory,
                approveNo: row.approveNo
              }
            })
          } else {
            this.$message({
              message: res.message || '编辑委托函失败，请稍后重试！',
              type: 'warning',
              showClose: true
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '服务器异常，请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 是否展示编辑按钮--为草稿状态且是任务发起人是可编辑
    showEditBtn (row) {
      return row.approveState === '1' && row.creatorName === this.currentUserName
      // return true
    }
  }
}
</script>
<style lang="scss" scoped>
.task-list{
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
    .sp-table {
      /deep/ .el-table .cell{
        padding: 0px 5px;
        // line-height: 24px;
        white-space: nowrap;
      }
    }
}
</style>
