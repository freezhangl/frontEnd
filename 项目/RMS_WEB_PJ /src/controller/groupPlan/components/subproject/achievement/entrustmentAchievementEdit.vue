<template>
  <!-- 预期成果需求单位非一般支撑包编辑 -->
  <div class="achievement">
    <projectPanel title="预期成果"  class="addcon" :show-expand='false'>
      <template v-slot:header>
        <el-button
          class="normal-btn"
          @click="addAchievement"
          icon="el-icon-circle-plus-outline">添加预期成果</el-button>
      </template>
      <self-table
        :table-data="tableDataOut.list"
        :table-cols="tableColsOut"
        max-height="276px"
        :is-pagination="false"
      ></self-table>
    </projectPanel>
    <!-- 预期成果弹框 关联成果弹框 -->
    <el-dialog
      v-dialogDrag
      title="关联预期成果"
      :visible.sync="dialogVisible"
      width="925px"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        label-width="120px"
        ref="searchForm"
        :model="tableDataInForm"
        :inline="true">
        <div class='searchrow'>
          <el-form-item
            label-position="right"
            label="需求单位子项目:"
            style="margin-right:20px;margin-bottom:10px">
            <el-select
              :popper-append-to-body="false"
              @keyup.enter.native="getResSearch"
              v-model="tableDataInForm.subProjectCode"
              placeholder="请选择"
              style="width:220px"
              clearable>
              <el-option
                v-for="item in subProjectCodeOptions"
                :key="item.subProjectCode"
                :label="item.projectName"
                :value="item.subProjectCode"
                style="max-width:320px">
                <el-tooltip
                  :content="item.projectName"
                  placement="top"
                  effect="dark"
                  :disabled="!isShowTip(item.projectName)">
                  <span class="title">{{item.projectName}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label-position="right"
            label="成果类型:"
            style="margin-right:10px;margin-bottom:10px">
            <el-select
              :popper-append-to-body="false"
              @keyup.enter.native="getResSearch"
              v-model="tableDataInForm.achievementType"
              placeholder="请选择"
              style="width:220px"
              clearable>
              <el-option
                v-for="item in achievementTypeOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class='searchrow'>
          <el-form-item
            label="任务名称:"
            prop="achievementName">
            <el-input
              v-model.trim="tableDataInForm.achievementName"
              clearable
              style="width:220px"></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="需求单位:"
            style="margin-right: 10px;margin-bottom:10px">
            <el-select
              :popper-append-to-body="false"
              @keyup.enter.native="getResSearch"
              v-model="tableDataInForm.demandUnitCode"
              placeholder="请选择"
              style="width:220px"
              clearable>
              <el-option
                v-for="item in demandUnitCodeOptions"
                :key="item.organizationCode"
                :label="item.organizationName"
                :value="item.organizationCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-right:0;margin-bottom:10px">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getResSearch">查询</el-button>
            <el-button
              class="normal-btn"
              icon="el-icon-refresh-left"
              @click="searchReset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
      <self-table
        :table-data="tableDataIn.list"
        :table-cols="tableColsIn"
        :loading="loading"
        max-height="276px"
        :is-selection='true'
        @select="tableInselect"
        :is-pagination="true"
        :pagination="{ pageSize: tableDataIn.body.pageSize, pageNum: tableDataIn.body.pageNum, total: tableDataIn.total }"
        @refresh="getChengGuoList"
        :handle-selectable="setSelectable"
      ></self-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCancle">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleSave">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详情弹框 -->
    <aDialogDetail ref="aDialogDetail"></aDialogDetail>
  </div>
</template>
<script>

import selfTable from '../../../../../components/table/index'
import projectPanel from '../../../../components/projectPanel/index'
import APIGroupPlan from '@/serve/API_groupPlanProject'
import API from '@/serve/API_groupPlan'
import APIAchievement from './achievement.js'
import aDialogDetail from './aDialogDetail'
import { addNum, deleteZero } from '@/utils/numberAdd'
import { isShowToolTip } from '@/utils/common.js'
export default {
  components: { projectPanel, selfTable, aDialogDetail },
  props: {
    parentCode: {
      type: String,
      default: ''
    },
    //传入的外层列表数据
    receiveData: {
      type: Array,
      default: () => []
    },
    type: { //判断是新增使用还是列表使用 add list
      type: String,
      default: ''
    },
    listItemId: {
      type: String,
      default: ''
    },
    addvisable: {
      type: Boolean,
      default: true
    },
    list: { //外层列表数据
      type: Array,
      default: () => []
    },
    ruleForm: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      demandUnitCodeOptions: [], //需求单位options
      achievementTypeOptions: [], //成果类型options
      subProjectCodeOptions: [], //需求单位子项目options
      tableDataIn: { //内层详情表格数据
        body: { pageSize: 10, pageNum: 1 },
        total: 0,
        list: []
      },
      tableColsIn: [
        { label: '需求单位子项目', prop: 'subProjectName', align: 'left', overflow: true, resizable: false },
        { label: '任务名称', prop: 'achievementName', align: 'left', overflow: true, resizable: false },
        { label: '成果类型', prop: 'achievementTypeValue', align: 'left', overflow: true, resizable: false },
        { label: '需求单位', prop: 'demandUnit', align: 'left', overflow: true, resizable: false },
        { label: '合作开发费-委外(万元)', prop: 'budgetOutsourcing', align: 'left', overflow: true, resizable: false },
        { label: '合作开发费-委内(万元)', prop: 'budgetInsourcing', align: 'left', overflow: true, resizable: false },
        { label: '自有人工预算(人月)', prop: 'staffTime', align: 'left', overflow: true, resizable: false }
      ],
      tableDataInForm: { //预期成果信息表单
        subProjectCode: '', //需求单位子项目
        demandUnitCode: '', //需求单位
        achievementType: '', //成果类型
        achievementName: ''
      },
      dialogVisible: false,
      tableDataOut: { //外层详情表格数据
        list: []
      },
      tableColsOut: [
        // { label: '任务名称', prop: 'achievementName', align: 'left', overflow: true, resizable: false, handleClick: this.handleClick, itemClass: this.itemClass },
        { label: '任务名称', prop: 'achievementName', align: 'left', overflow: true, resizable: false },
        { label: '成果类型', prop: 'achievementTypeValue', align: 'left', overflow: true, resizable: false },
        // { label: '需求单位', prop: 'demandUnit', align: 'left', overflow: true, resizable: false },
        { label: '需求部门', prop: 'demandUnitDept', align: 'left', overflow: true, resizable: false },
        { label: '成果需求人', prop: 'demandUnitResponsibleName', align: 'left', overflow: true, resizable: false },
        { label: '承担部门', prop: 'undertakeUnitDept', align: 'left', overflow: true, resizable: false },
        { label: '成果负责人', prop: 'responsiblePerson', align: 'left', overflow: true, resizable: false },
        { label: '操作', prop: 'operation', type: 'Button', align: 'center', minwidth: '120px', btnList: [{ type: 'text', label: '删除', handle: this.delAchievement }] }
      ]
    }
  },
  watch: {
    receiveData: { //成果列表
      deep: true,
      immediate: true,
      handler: function (val, oldVal) { //有数据接收后初始化数据
        this.tableDataOut.list = val
      }
    }
  },
  mounted () {
  },
  methods: {
    isShowTip (projectName) {
      return isShowToolTip(projectName, 320)
    },
    getChengGuoList (pageNum = this.tableDataIn.body.pageNum, pageSize = this.tableDataIn.body.pageSize) { //获取弹框成果信息列表
      this.tableDataIn.body.pageNum = pageNum
      this.tableDataIn.body.pageSize = pageSize
      let params = {
        pageNo: pageNum,
        pageSize: pageSize,
        projectCode: this.parentCode,
        letterCode: this.$route.query.letterCode,
        subProjectCode: this.tableDataInForm.subProjectCode,
        demandUnitCode: this.tableDataInForm.demandUnitCode,
        achievementType: this.tableDataInForm.achievementType,
        achievementName: this.tableDataInForm.achievementName
      }
      // if (this.$route.query.addEntrust === 'true') {
      API.queryLastUnlinkedProjectAchievement(params)
        .then(res => {
          if (res && res.records) {
            res.records.forEach(item => {
              if (item) {
                item.budgetOutsourcing = deleteZero(item.budgetOutsourcing)
                item.budgetInsourcing = deleteZero(item.budgetInsourcing)
                item.staffTime = deleteZero(item.staffTime)
              }
            })
            this.tableDataIn.list = res.records
            this.tableDataIn.total = parseInt(res.total)
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '成果列表获取失败',
            type: 'error',
            showClose: true
          })
        })
      // } else {
      //   APIAchievement.queryDemandProjectAchievementList(params)
      //     .then(res => {
      //       this.tableDataIn.list = res.records
      //       this.tableDataIn.total = parseInt(res.total)
      //     })
      //     .catch(e => {
      //       this.loading = false
      //       if (e.selfError) return
      //       this.$message({
      //         message: e.message || '成果列表获取失败',
      //         type: 'error',
      //         showClose: true
      //       })
      //     })
      // }
    },
    tableInselect (e) { //弹框选择成果信息数据改变选中状态
      this.tableDataIn.list.forEach(item => {
        item.selected = false
        e.forEach(item2 => {
          if (item2.achievementCode === item.achievementCode) {
            item.selected = true
          }
        })
      })
    },
    setSelectable (row, index) {
      let projectAchievementList = []
      /* this.receiveData.forEach(item => {
        projectAchievementList = this.receiveData.concat(item.projectAchievementList || [])
      }) */
      if (this.receiveData === null) {
        this.receiveData = []
      }
      // if (this.addvisable) {
      projectAchievementList = this.receiveData.concat(this.ruleForm.projectAchievementList || [])
      // }
      let flag = projectAchievementList.some(item => item.achievementCode === row.achievementCode) || row.relatedProject
      return !flag
    },
    searchReset () { //关联成果重置查询条件
      this.tableDataInForm = { //弹框搜索表单
        subProjectCode: '',
        demandUnitCode: '',
        achievementType: '',
        achievementName: ''
      }
      this.tableDataIn.body.pageNum = 1
      this.getChengGuoList()
    },
    //查询成果列表
    getResSearch () {
      this.tableDataIn.body.pageNum = 1
      this.getChengGuoList()
    },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    itemClass (row) {
      return 'hover'
    },
    handleClick (row) { //点击任务名称弹出研究任务及预期详情弹框
      this.$refs.aDialogDetail.acceptData(row)
    },
    dialogVisibleSave () { //关联成果弹框确定
      if (this.type === 'add') { //新增时用到,
        let selectList = this.ruleForm.projectAchievementList
        this.tableDataIn.list.forEach(item => {
          if (item.selected) {
            selectList.push(item)
          }
        })
        this.ruleForm.projectAchievementList = selectList
        this.dialogVisible = false
      }
      if (this.type === 'list') { //列表时用到
        let selectList = this.receiveData
        this.tableDataIn.list.forEach(item => {
          if (item.selected) {
            selectList.push(item)
          }
        })
        this.receiveData = selectList
        this.dialogVisible = false
      }
    },
    dialogVisibleCancle () { //弹框取消
      this.dialogVisible = false
    },
    addAchievement () {
      this.tableDataInForm = { //预期成果信息表单
        subProjectCode: '', //需求单位子项目
        demandUnitCode: '', //需求单位
        achievementType: '', //成果类型
        achievementName: ''
      }
      this.tableDataIn.body.pageNum = 1
      this.getChengGuoList()
      this.getDictValByCode()
      this.dialogVisible = true
    },
    getDictValByCode () {
      APIGroupPlan.getDictValByCode('EXPECTED-RESULT-TYPE') //获取成果类型数据字典
        .then(res => {
          this.achievementTypeOptions = res || []
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '研究领域数据字典获取失败',
            type: 'error',
            showClose: true
          })
        })
      APIAchievement.queryProjectDemandCompanyList({ projectCode: this.parentCode }) //获取需求单位项目的需求单位列表
        .then(res => {
          this.demandUnitCodeOptions = res || []
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '需求单位列表获取失败',
            type: 'error',
            showClose: true
          })
        })
      APIAchievement.querySubProjectList({ projectCode: this.parentCode, lastFormal: 1 }) //查询需求单位子项目列表
        .then(res => {
          this.subProjectCodeOptions = res || []
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '需求单位列表获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    delAchievement (listItem) { //删除预期成果
      this.$confirm('是否删除该成果？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm',
        type: 'warning'
      })
        .then(res => {
          if (this.type === 'add') { //新增时用到
            this.ruleForm.projectAchievementList.some((item, index) => {
              if (listItem.achievementCode === item.achievementCode) {
                this.ruleForm.projectAchievementList.splice(index, 1)
              }
            })
          }
          if (this.type === 'list') { //列表时用到
            this.receiveData.some((item, index) => {
              if (item.achievementCode === listItem.achievementCode) {
                this.receiveData.splice(index, 1)
                return true
              }
            })
            // this.$emit('delAchieveMentList', { listItemId: this.listItemId, listItem: listItem })
          }
        })
    }
  }
}
</script>
<style lang="scss">
.title{
  max-width:300px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.achievement{
  margin-bottom: 20px;
    /deep/ .el-table--border{
    border-top: 0;
    td {
      border: none;
    }
  }
  .expectTime{
    .el-form-item__label{
      line-height: 20px;
    }
  }
  .addcon1{
    margin-bottom: 20px;
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
        // color: #0b82ff;
        &:hover{
          @include color();
          // color: #0b82ff,
        }
        cursor: pointer
      }
}
.entrustConfirm .el-button.el-button--default:hover{
  background-color: transparent;
}
</style>
