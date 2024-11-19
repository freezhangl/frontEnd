<template>
  <!-- 预期成果需求单位非一般支撑包编辑 -->
  <div class="achievement">
    <projectPanel title="预期成果"  class="addcon" :show-expand='false'>
      <template v-slot:header>
        <el-button
          class="normal-btn"
          @click="addAchievement"
          v-if='!meberEditFlag'
          style="margin-right:10px"
          icon="el-icon-circle-plus-outline">添加预期成果</el-button>
        <section class="radio-box">
          <img
            v-if="isListOrCard === 1"
            class="small-img"
            src="@/assets/icons/listChecked.svg"
          />
          <img
            v-else
            class="small-img"
            src="@/assets/icons/listNoChecked.svg"
            @click="cutCardOrList(1)"
          />
          <img
            v-if="isListOrCard === 2"
            class="small-img"
            src="@/assets/icons/cardChecked.svg"
          />
          <img
            v-else
            class="small-img"
            src="@/assets/icons/cardNoChecked.svg"
            @click="cutCardOrList(2)"
          />
        </section>
      </template>
      <self-table
        v-if="isListOrCard === 1"
        index-title='序号'
        :is-index='true'
        :table-data="tableDataOut.list"
        :table-cols="tableColsOut"
        max-height="276px"
        :is-pagination="false"
      ></self-table>
      <taskCardu
        @delAchievement='delAchievement'
        @handleClick='handleClick'
        v-if="isListOrCard === 2"
        :table-data="tableDataOut.list"
        :meber-edit-flag='meberEditFlag'></taskCardu>
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
            label-position="right"
            label="需求单位:"
            style="margin-right: 378px;margin-bottom:10px">
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
import APIAchievement from './achievement.js'
import aDialogDetail from './aDialogDetail'
import bus from '@/common/bus'
import { isShowToolTip } from '@/utils/common.js'
import taskCardu from './taskCardu'
export default {
  components: { projectPanel, selfTable, aDialogDetail, taskCardu },
  props: {
    parentCode: {
      type: String,
      default: ''
    },
    projectCode: {
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
    listItemSubProjectCode: {
      type: String,
      default: ''
    },
    addvisable: {
      type: Boolean,
      default: true
    },
    entry: {
      type: Number,
      default: 2
    },
    list: { //外层列表数据
      type: Array,
      default: () => []
    },
    ruleForm: {
      type: Object,
      default: () => {}
    },
    yearRangeProp: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isListOrCard: 1,
      meberEditFlag: false,
      yearRange: [],
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
        { label: '合作开发费-委外(万元)', prop: 'budgetOutsourcing', align: 'left', overflow: true, resizable: false, formatter: this.numTransition },
        { label: '合作开发费-委内(万元)', prop: 'budgetInsourcing', align: 'left', overflow: true, resizable: false, formatter: this.numTransition },
        { label: '自有人工预算(人月)', prop: 'staffTime', align: 'left', overflow: true, resizable: false, formatter: this.numTransition }
      ],
      tableDataInForm: { //预期成果信息表单
        subProjectCode: '', //需求单位子项目
        demandUnitCode: '', //需求单位
        achievementType: '' //成果类型
      },
      dialogVisible: false,
      tableDataOut: { //外层详情表格数据
        list: []
      },
      tableColsOut: [
        {
          label: '任务名称',
          prop: 'achievementName',
          type: 'link',
          align: 'left',
          overflow: true,
          resizable: false,
          handleClick: this.handleClick,
          itemClass: this.itemClass
        }, {
          label: '成果类型',
          prop: 'achievementTypeValue',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '需求单位',
          prop: 'demandUnit',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '需求部门',
          prop: 'demandUnitDept',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '成果需求人',
          prop: 'demandUnitResponsibleName',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '承担部门',
          prop: 'undertakeUnitDept',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '成果负责人',
          prop: 'responsiblePerson',
          align: 'left',
          overflow: true,
          resizable: false
        }, {
          label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          minwidth: '120px',
          btnList: [
            { type: 'text', label: '删除', handle: this.delAchievement, isHidden: this.getmeberEditFlag }
          ]
        }
      ],
      delflag: false //是否可以删除成果
    }
  },
  watch: {
    receiveData: { //成果列表
      deep: true,
      immediate: true,
      handler: function (val, oldVal) { //有数据接收后初始化数据
        this.tableDataOut.list = val
      }
    },
    yearRangeProp: { //基础信息年份
      deep: true,
      immediate: true,
      handler: function (val, oldVal) { //监听基础信息年份的变化
        if (val && val.length > 0) {
          let list = []
          val.forEach(item => {
            list.push(item.toString())
          })
          this.yearRange = list
        }
      }
    }
  },
  mounted () {
    this.acceptMilestoneInfo()
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
  },
  methods: {
    cutCardOrList (val) {
      this.isListOrCard = val
    },
    isShowTip (projectName) {
      return isShowToolTip(projectName, 320)
    },
    getmeberEditFlag () {
      return !this.meberEditFlag
    },
    acceptMilestoneInfo (e) { //实时监听里程碑传过来的是否可以删除成果
      bus.$on('splice', (e) => {
        this.delflag = e
      })
    },
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
        return val
      }
    },
    getChengGuoList (pageNum = this.tableDataIn.body.pageNum, pageSize = this.tableDataIn.body.pageSize) { //获取弹框成果信息列表
      this.tableDataIn.body.pageNum = pageNum
      this.tableDataIn.body.pageSize = pageSize
      let params = {
        pageNo: pageNum,
        pageSize: pageSize,
        projectCode: this.parentCode,
        undertakeProjectCode: this.projectCode,
        subProjectCode: this.tableDataInForm.subProjectCode,
        demandUnitCode: this.tableDataInForm.demandUnitCode,
        achievementType: this.tableDataInForm.achievementType,
        letterCode: this.$route.query.letterCode || ''
      }
      APIAchievement.queryDemandProjectAchievementList(params)
        .then(res => {
          this.tableDataIn.list = res.records
          this.tableDataIn.total = parseInt(res.total)
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
      this.list.forEach(item => {
        projectAchievementList = projectAchievementList.concat(item.projectAchievementList || [])
      })
      if (this.addvisable) {
        projectAchievementList = projectAchievementList.concat(this.ruleForm.projectAchievementList || [])
      }
      let flag = projectAchievementList.some(item => item.achievementCode === row.achievementCode) || row.relatedProject
      return !flag
    },
    searchReset () { //关联成果重置查询条件
      this.tableDataInForm = { //弹框搜索表单
        subProjectCode: '',
        demandUnitCode: '',
        achievementType: ''
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
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('subproject')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.$refs.aDialogDetail.acceptData(row, 'u', 'edit', this.yearRange)
    },
    dialogVisibleSave () { //关联成果弹框确定
      let codeList = []
      this.tableDataIn.list.forEach(item => {
        if (item.selected) {
          codeList.push(item.achievementCode)
        }
      })
      if (codeList.length <= 0) {
        this.$message({
          message: '请勾选关联预期成果！',
          type: 'error'
        })
      } else {
        let params = {
          projectCode: this.parentCode,
          subProjectAchievementCodeList: codeList
        }
        APIGroupPlan.checkUndertakeProjectLinkAchievement(params)
          .then(res => {
            if (res) {
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
            }
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '校验失败！',
                type: 'error',
                showClose: true
              })
            }
          })
      }
      this.$emit('updateAch')
    },
    dialogVisibleCancle () { //弹框取消
      this.dialogVisible = false
    },
    addAchievement () {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('subproject')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.tableDataInForm = { //预期成果信息表单
        subProjectCode: '', //需求单位子项目
        demandUnitCode: '', //需求单位
        achievementType: '' //成果类型
      }
      this.tableDataIn.body.pageNum = 1
      this.getChengGuoList()
      this.getDictValByCode()
      this.dialogVisible = true
      this.changeInfo()
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
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('subproject')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm',
        type: 'warning'
      })
        .then(() => {
          if (this.type === 'add') { //新增时用到
            this.ruleForm.projectAchievementList.some((item, index) => {
              if (listItem.achievementCode === item.achievementCode) {
                bus.$emit('childProjectDelAchievement', listItem.achievementCode)
                if (!this.delflag) {
                  this.$message({
                    type: 'warning',
                    message: '该成果已关联里程碑不能删除'
                  })
                  return
                }
                this.ruleForm.projectAchievementList.splice(index, 1)
              }
            })
          }
          if (this.type === 'list') { //列表时用到
            let isCanRemove = true
            this.list.some(item => {
              if (item.subProjectCode === this.listItemSubProjectCode) {
                item.projectAchievementList.some((item2, index) => {
                  if (item2.achievementCode === listItem.achievementCode) {
                    bus.$emit('childProjectDelAchievement', listItem.achievementCode)
                    if (!this.delflag) {
                      this.$message({
                        type: 'warning',
                        message: '该成果已关联里程碑不能删除'
                      })
                      isCanRemove = false
                      return
                    }
                    item.projectAchievementList.splice(index, 1)
                    return true
                  }
                })
              }
            })
            if (this.entry === 2) {
              if (isCanRemove) {
                let params = {
                  subProjectCode: this.listItemSubProjectCode,
                  projectCode: this.projectCode,
                  subProjectAchievementCode: listItem.achievementCode
                }
                APIGroupPlan.removeSubProjectAchievement(params)
                  .then(res => {
                    this.$message({
                      type: 'success',
                      message: '删除成功',
                      showClose: true
                    })
                  })
                  .catch(e => {
                    if (e.selfError) return
                    if (e.message) {
                      this.$message({
                        message: e.message || '删除失败！',
                        type: 'error',
                        showClose: true
                      })
                    }
                  })
              }
            } else {
              this.$message({
                type: 'success',
                message: '删除成功',
                showClose: true
              })
            }
          }
          this.$emit('updateAch')
          this.changeInfo()
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    //有信息发生修改
    changeInfo (edited = true, msg = false) {
      let params = {
        curBlock: 'subproject',
        hasEdited: edited,
        onlyShowMsg: msg
      }
      bus.$emit('groupPlanProjectEdit', params)
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
      padding: 10px 20px 10px 20px!important;
      height: auto;
      overflow: visible;
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
</style>
