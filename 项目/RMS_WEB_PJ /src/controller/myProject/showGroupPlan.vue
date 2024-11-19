<template>
  <div class="groupPlanContent">
    <div class="searchContent">
      <el-form
        :model="searchForm"
        ref="searchForm"
        :inline="true"
        label-width="120px"
        label-position="right">
        <el-form-item label="年份: " prop="projectYear">
          <el-date-picker
            v-model="searchForm.projectYear"
            format="yyyy"
            type="year"
            placeholder="全部年份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目状态: " class="formStatus" prop="projectDetailsStatus">
          <template>
            <div class="proStatus">
              <SpAdvancedSelect
                :data.sync="searchForm.projectDetailsStatus"
                :list="projectStatus"
                key-id="projectStatusContent"
                is-more-type="even"
                value-txt="value"
                label-txt="label"
                placeholder="全部"
                @changeEvent="currentValue"
              ></SpAdvancedSelect>
              <el-tooltip
                :content="'活动中项目包含：草稿、预立项审批中、预立项、立项审批中、立项、变更审批中、终止审批中、结项审批中项目'"
                placement="top"
                effect="dark">
                <i class="el-icon-info accountingNo"></i>
              </el-tooltip>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="项目名称: " prop="projectName">
          <el-input v-model.trim="searchForm.projectName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="search-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="groupPlanProjectList()">查询</el-button>
          <el-button
            class="normal-btn"
            icon="el-icon-refresh-left"
            @click="resetProjectList()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 集团统筹部分 -->
    <div class="group-plan">
      <template v-if="groupPlanProject&&groupPlanProject.length">
        <div v-for="listItem in groupPlanProject" :key="listItem.id" :class="{'demand-wrapper-expand':listItem.isExpand}">
          <!-- 承担单位项目 -->
          <div v-if="listItem.unitType==='PC-UNDERTAKE-UNIT'">
            <div class="group-plan-list">
              <!-- 承担单位 icon -->
              <i class="unit-icon svgfont-undertake-unit1"></i>
              <el-tooltip
                :content="listItem.projectName"
                placement="top"
                effect="dark"
                popper-class="project-name-popper"
                :disabled="!listItem.isShowTip">
                <span @click="openGroupDetailWindow(listItem, listItem.developPackage)" class="title outerTitle">{{listItem.projectName}}</span>
              </el-tooltip>
              <span class="itemName">{{listItem.projectDetailsStatus | projectStatusFilter}}</span>
              <span class="itemName">{{listItem.projectCode}}</span>
              <!-- <span class="itemName">{{listItem.projectClass | projectClassFilter}}</span> -->
              <span class="itemName"></span>
              <span class="itemName">{{listItem.projectClassValue}}</span>
            </div>
          </div>
          <!-- 需求单位项目无子项目且无创建权限 -->
          <div v-if="!listItem.createProjectButton&&listItem.unitType==='PC-DEMAND-UNIT'&&listItem.subProjectInfo.length===0">
            <div class="group-plan-list">
              <!-- 需求单位 icon -->
              <i class="unit-icon svgfont-demand-unit1"></i>
              <el-tooltip
                :content="listItem.projectName"
                placement="top"
                effect="dark"
                popper-class="project-name-popper"
                :disabled="!listItem.isShowTip">
                <span @click="openGroupDetailWindow(listItem, listItem.developPackage)" class="title outerTitle">{{listItem.projectName}}</span>
              </el-tooltip>
              <span class="itemName">{{listItem.projectDetailsStatus | projectStatusFilter}}</span>
              <span class="itemName">{{listItem.projectCode}}</span>
              <!-- <span class="itemName">{{listItem.projectClass | projectClassFilter}}</span> -->
              <div class="itemName">
                <span v-if="listItem.view">{{listItem.linkedAchievement}}/{{listItem.totalAchievement}}</span>
                <el-tooltip
                  :content="isShowTop(listItem.view)"
                  placement="top"
                  effect="dark"
                  :disabled="!listItem.view">
                  <i class="el-icon-info accountingNo" v-if="listItem.view"></i>
                </el-tooltip>
              </div>
              <span class="itemName">{{listItem.projectClassValue}}</span>
            </div>
          </div>
          <!-- 需求单位存在子项目但无创建权限 -->
          <div v-if="!listItem.createProjectButton&&listItem.unitType==='PC-DEMAND-UNIT'&&listItem.subProjectInfo.length!==0">
            <div
              class="listcon"
              :style="{'margin-bottom':listItem.isExpand?'20px':'0px','border-bottom': listItem.isExpand?'1px solid #D5D6D8':'none'}">
              <!-- 未展开 -->
              <div class="expand-no-permission">
                <!-- 需求单位 icon -->
                <i class="unit-icon svgfont-demand-unit1"></i>
                <el-tooltip
                  :content="listItem.projectName"
                  placement="top"
                  effect="dark"
                  popper-class="project-name-popper"
                  :disabled="!listItem.isShowTip">
                  <span @click="openGroupDetailWindow(listItem, listItem.developPackage)" class="title outerTitle">{{listItem.projectName}}</span>
                </el-tooltip>
                <span class="itemName">{{listItem.projectDetailsStatus | projectStatusFilter}}</span>
                <span class="itemName">{{listItem.projectCode}}</span>
                <!-- <span class="itemName">{{listItem.projectClass | projectClassFilter}}</span> -->
                <div class="itemName">
                  <span v-if="listItem.view">{{listItem.linkedAchievement}}/{{listItem.totalAchievement}}</span>
                  <el-tooltip
                    :content="isShowTop(listItem.view)"
                    placement="top"
                    effect="dark"
                    :disabled="!listItem.view">
                    <i class="el-icon-info accountingNo" v-if="listItem.view"></i>
                  </el-tooltip>
                </div>
                <span class="itemName">{{listItem.projectClassValue}}</span>
                <div class="expand" >
                  <el-button
                    class="normal-btn"
                    @click="changeExpand(listItem)"> {{listItem.isExpand ? '收起' : '展开'}}<i class= "el-icon--right" :class="{ 'el-icon-arrow-left' : listItem.isExpand , 'el-icon-arrow-down' : !listItem.isExpand}"></i></el-button>
                </div>
              </div>
              <!-- 展开 -->
              <div
                class="listSubexpand"
                v-show="listItem.isExpand&&listItem.subProjectInfo.length"
                style="padding-left:55px;padding-right:244px"
                v-for="listSubitem in listItem.subProjectInfo"
                :key="listSubitem.id">
                <!-- 承担单位 icon -->
                <i class="unit-icon svgfont-undertake-unit1"></i>
                <el-tooltip
                  :content="listSubitem.projectName"
                  placement="top"
                  effect="dark"
                  popper-class="project-name-popper"
                  :disabled="!listSubitem.isShowTip">
                  <span @click="openGroupDetailWindow(listSubitem, listItem.developPackage)" class="title">{{listSubitem.projectName}}</span>
                </el-tooltip>
                <span class="itemName">{{listSubitem.projectDetailsStatus | projectStatusFilter}}</span>
                <span class="itemName">{{listSubitem.projectCode}}</span>
                <!-- <span class="itemName">{{listSubitem.projectClass | projectClassFilter}}</span> -->
                <span class="itemName">{{listItem.projectClassValue}}</span>
              </div>
            </div>
          </div>
          <!-- 需求单位存在子项目并且有创建权限 -->
          <div v-if="listItem.createProjectButton&&listItem.unitType==='PC-DEMAND-UNIT'">
            <div
              class="listcon"
              :style="{'margin-bottom':listItem.isExpand?'20px':'0px','border-bottom': listItem.isExpand?'1px solid #D5D6D8':'none'}">
              <!-- 未展开 -->
              <div class="expand-has-permission">
                <!-- 需求单位 icon -->
                <i class="unit-icon svgfont-demand-unit1"></i>
                <el-tooltip
                  :content="listItem.projectName"
                  placement="top"
                  effect="dark"
                  popper-class="project-name-popper"
                  :disabled="!listItem.isShowTip">
                  <span @click="openGroupDetailWindow(listItem, listItem.developPackage)" class="title outerTitle">{{listItem.projectName}}</span>
                </el-tooltip>
                <span class="itemName">{{listItem.projectDetailsStatus | projectStatusFilter}}</span>
                <!-- <span class="itemName">{{listItem.projectDetailsStatus | projectStatusFilter}}</span> -->
                <span class="itemName">{{listItem.projectCode}}</span>
                <!-- <span class="itemName">{{listItem.projectClass | projectClassFilter}}</span> -->
                <div class="itemName">
                  <span v-if="listItem.view">{{listItem.linkedAchievement}}/{{listItem.totalAchievement}}</span>
                  <el-tooltip
                    :content="isShowTop(listItem.view)"
                    placement="top"
                    effect="dark"
                    :disabled="!listItem.view">
                    <i class="el-icon-info accountingNo" v-if="listItem.view"></i>
                  </el-tooltip>
                </div>
                <span class="itemName">{{listItem.projectClassValue}}</span>
                <div class="expand" >
                  <el-button
                    class="normal-btn"
                    @click="createUnitProject(listItem)">创建本单位项目</el-button>
                  <el-button
                    class="normal-btn"
                    @click="changeExpand(listItem)"> {{listItem.isExpand ? '收起' : '展开'}}<i class= "el-icon--right" :class="{ 'el-icon-arrow-left' : listItem.isExpand , 'el-icon-arrow-down' : !listItem.isExpand}"></i></el-button>
                </div>
              </div>
              <!-- 展开 -->
              <div
                class="listSubexpand"
                v-show="listItem.isExpand&&listItem.subProjectInfo.length"
                style="padding-left:55px;padding-right:244px"
                v-for="listSubitem in listItem.subProjectInfo"
                :key="listSubitem.id">
                <!-- 承担单位 icon -->
                <i class="unit-icon svgfont-undertake-unit1"></i>
                <el-tooltip
                  :content="listSubitem.projectName"
                  placement="top"
                  effect="dark"
                  popper-class="project-name-popper"
                  :disabled="!listSubitem.isShowTip">
                  <span @click="openGroupDetailWindow(listSubitem, listItem.developPackage)" class="title">{{listSubitem.projectName}}</span>
                </el-tooltip>
                <span class="itemName">{{listSubitem.projectDetailsStatus | projectStatusFilter}}</span>
                <!-- <span class="itemName">{{listSubitem.projectDetailsStatus | projectStatusFilter}}</span> -->
                <span class="itemName">{{listSubitem.projectCode}}</span>
                <!-- <span class="itemName">{{listSubitem.projectClass | projectClassFilter}}</span> -->
                <span class="itemName">{{listItem.projectClassValue}}</span>
              </div>
              <!-- 展开暂无数据 -->
              <div
                class="listSubexpand"
                v-show="listItem.isExpand&&!listItem.subProjectInfo.length"
                style="color:#6F6F6F;padding-left:55px;padding-right:244px;display:flex;justify-content: center;">
                <span>暂无数据</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else style="height:80px;txet-align:center">
        <span style="display:inline-block;line-height:80px;text-align:center;width:100%;color:#999999">暂无数据</span>
      </div>
    </div>
    <!-- 委托函弹框 -->
    <el-dialog
      v-dialogDrag
      title="选择委托函"
      :visible.sync="dialogVisible"
      width="925px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="dialogVisibleCancle"
      custom-class="chooseForm">
      <el-form
        ref="entrustSearchForm"
        :model="entrustSearchForm"
        :inline="true"
        label-width="100px">
        <div class='searchrow'>
          <el-form-item
            style="margin-right:20px"
            label="委托函主题:"
            prop="taskName"
          >
            <el-input
              @keyup.enter.native="getEntrustmentList"
              v-model.trim="entrustSearchForm.taskName"
              clearable
              style="width:220px"></el-input>
          </el-form-item>
          <el-form-item
            label="关联项目状态:"
            prop="relatedProjectState"
          >
            <el-select
              :popper-append-to-body="false"
              @keyup.enter.native="getEntrustmentList"
              v-model="entrustSearchForm.relatedProjectState"
              placeholder="请选择"
              style="width:220px"
              clearable>
              <el-option
                v-for="item in relateStateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="下达时间："
            prop="issueTime"
            style="margin-right:398px">
            <el-date-picker
              v-model="entrustSearchForm.issueTime"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-right:0;margin-bottom:10px">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getEntrustmentList">查询</el-button>
            <el-button
              class="normal-btn"
              icon="el-icon-refresh-left"
              @click="searchReset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        v-loading="loading"
        :data="tableDataIn"
        :header-cell-style="tableHeadStyle"
        max-height="276px"
        :is-pagination="false"
        @refresh="getEntrustmentList">
        <el-table-column label="" width="48">
          <template slot-scope="scope">
            <el-radio
              class="radio"
              :label="scope.row.letterCode"
              v-model="radio"
              :disabled="!scope.row.canCreateProject"
              @change.native="entrustmentSelect(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          class-name="padding-col"
          label="任务名称"
          prop="taskName"
          align="left"
          min-width="160px"
          :show-overflow-tooltip="true"
          :resizable="false"></el-table-column>
        <el-table-column
          class-name="padding-col"
          label="需求负责人"
          prop="demandResponsibleName"
          align="left"
          min-width="160px"
          :show-overflow-tooltip="true"
          :resizable="false"></el-table-column>
        <el-table-column
          class-name="padding-col"
          label="预算金额"
          prop="taskBudget"
          align="left"
          min-width="160px"
          :show-overflow-tooltip="true"
          :resizable="false"></el-table-column>
        <el-table-column
          class-name="padding-col"
          label="下达时间"
          prop="createdDate"
          align="left"
          min-width="160px"
          :show-overflow-tooltip="true"
          :resizable="false">
          <template slot-scope="scope">
            <span>{{formatDate1(tableDataIn[scope.$index].createdDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="padding-col"
          label="已关联项目"
          prop="relatedProjectList"
          width="100px"
          align="left"
          :show-overflow-tooltip="true"
          :resizable="false">
        </el-table-column>
      </el-table>
      <!-- <sp-table
        :table-data="tableDataIn.list"
        :table-cols="tableColsIn"
        max-height="276px"
        :is-selection='true'
        @select="entrustmentSelect"
        :is-pagination="false"
        @refresh="getEntrustmentList"
      ></sp-table> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCancle">取 消</el-button>
        <el-button type="primary" @click="createEntrustmentProject">创建项目</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/serve/API_project'

import { mapGetters } from 'vuex'
import { isShowToolTip } from '@/utils/common.js'
import APIGroupPlan from '@/serve/API_groupPlanProject'
import { deleteZero } from '@/utils/numberAdd'
export default {
  name: 'showGroupPlan',
  components: {
  },
  data () {
    return {
      relateStateOptions: [
        { label: '关联项目', value: 1 },
        { label: '未关联项目', value: 2 }
      ], //关联项目状态options
      entrustSearchForm: { //弹框搜索表单
        taskName: '', //委托函主题
        relatedProjectState: '', //关联项目状态
        issueTime: '' //下达时间
      },
      tableDataIn: [],
      tableHeadStyle: {
        background: '#F4F4F4',
        color: 'rgba(0,0,0,0.85)'
      },
      // projectStatus: [
      //   {
      //     value: '0',
      //     label: '草稿'
      //   },
      //   {
      //     value: '9',
      //     label: '计划调整审批中'
      //   },
      //   {
      //     value: '10',
      //     label: '预立项审批中'
      //   },
      //   {
      //     value: '11',
      //     label: '已预立项'
      //   },
      //   {
      //     value: '1',
      //     label: '立项审批中'
      //   },
      //   {
      //     value: '2',
      //     label: '已立项'
      //   },
      //   {
      //     value: '3',
      //     label: '变更审批中'
      //   },
      //   {
      //     value: '4',
      //     label: '终止审批中'
      //   },
      //   {
      //     value: '5',
      //     label: '结项审批中'
      //   },
      //   {
      //     value: '6',
      //     label: '已终止'
      //   },
      //   {
      //     value: '7',
      //     label: '已结项'
      //   },
      //   {
      //     value: '8',
      //     label: '已关闭'
      //   }
      // ],
      projectStatus: [
        {
          value: ['0', '9', '1', '2', '3', '4', '5', '10', '11'].toString(),
          label: '活动中项目'
        },
        {
          value: 6,
          label: '已终止'
        },
        {
          value: 7,
          label: '已结项'
        },
        {
          value: 8,
          label: '已关闭'
        }
      ],
      loading: false,
      radio: '',
      dialogVisible: false, //委托函弹框显隐
      dateLimit: { // 限制未来时间不可选
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      projectStatusContent: '',
      year: '', //传参的字段
      searchForm: {
        projectYear: null,
        projectName: '',
        projectDetailsStatus: [['0', '9', '1', '2', '3', '4', '5', '10', '11'].toString()],
        unitType: ''
      },
      //项目列表
      groupPlanProject: [], //统筹项目
      editUrl: '', //集团统筹项目创建时的url
      timer: [],
      typeOptions: [], //项目类型
      projectCode: '', //需求单位项目编码
      exsitSubroject: 1, //是否子项目编码
      letterCode: '', //当前选中的委托函编码
      projectNameWidth: 0 //项目名称列宽度
    }
  },
  filters: {
    projectStatusFilter: function (val) {
      switch (val) {
        case '0' :
          return '草稿'
        case '9' :
          return '计划调整审批中'
        case '1' :
          return '立项审批中'
        case '2' :
          return '已立项'
        case '3' :
          return '变更审批中'
        case '4' :
          return '终止审批中'
        case '5' :
          return '结项审批中'
        case '6' :
          return '已终止'
        case '7' :
          return '已结项'
        case '8' :
          return '已关闭'
        case '10' :
          return '预立项审批中'
        case '11' :
          return '已预立项'
        default:
          return ''
      }
    }
    // projectClassFilter: function (val) {
    //   switch (val) {
    //     case 'IC_A' :
    //       return '应用基础研究'
    //     case 'IC_B' :
    //       return '关键核心技术攻关'
    //     case 'IC_C' :
    //       return '总部项目-产品开发及现网支撑'
    //     case 'IC_D' :
    //       return '产品开发及现网支撑-自立项目'
    //     default:
    //       return ''
    //   }
    // }
  },
  computed: {

  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  created () {
    this.intercept()
    this.groupPlanProjectList()
  },
  methods: {
    handleResize () {
      this.getTitleSpanWidth()
      this.setToolTip()
    },
    // 日期格式化--年月日
    formatDate1 (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 日期格式化--年月日
    formatDate2 (val) {
      return this.$formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    },
    // 日期格式化--年
    formatDate (val) {
      return this.$formatDate(val, 'YYYY')
    },
    // 项目名称是否悬浮提示
    isShowTip (projectName) {
      return isShowToolTip(projectName, 150)
    },
    // 打开项目详情页面
    openGroupDetailWindow (listItem, developPackage) {
      let detailUrl = ''
      // developPackage:研发包   unitType:单位类别,判断类型
      detailUrl = '/groupPlan/projectDetail/'
      let unit = listItem.unitType === 'PC-DEMAND-UNIT' ? 'd' : 'u'
      let { href } = this.$router.resolve({
        path: detailUrl + listItem.projectCode,
        query: {
          developPackage: developPackage,
          projectCategory: unit
        }
      })
      // 打开新的窗口
      let $window = window.open(href, '_blank')

      if (this.timer[listItem.projectCode]) {
        window.clearInterval(this.timer[listItem.projectCode])
      }

      this.timer[listItem.projectCode] = setInterval(() => {
        if ($window && $window.closed) {
          if (this.timer[listItem.projectCode]) {
            window.clearInterval(this.timer[listItem.projectCode])
          }
          this.groupPlanProjectList()
        }
      }, 500)

      // 判断是否具有权限-->TODO 判断需求单位/承担单位-->判断一般/非一般支撑包
    },
    changeExpand (listItem) { //需求单位有子的展开收起
      this.groupPlanProject.some(item => {
        if (listItem.projectCode === item.projectCode) {
          item.isExpand = !item.isExpand
        }
      })
    },
    entrustmentSelect (index, row) { // 委托函弹框选择事件
      // this.tableDataIn.list.forEach(item => {
      //   item.selected = false
      //   e.forEach(item2 => {
      //     if (item2.achievementCode === item.achievementCode) {
      //       item.selected = true
      //     }
      //   })
      // })
      this.letterCode = row.letterCode
    },
    // 关闭委托函列表弹框
    dialogVisibleCancle () {
      this.radio = ''
      this.entrustSearchForm = { //弹框搜索表单
        taskName: '',
        relatedProjectState: '',
        issueTime: ''
      }
      this.dialogVisible = false
    },
    //弹框创建项目
    createEntrustmentProject () {
      // 委托函是否已选择，选择某一个后方可跳转编辑页面
      if (this.radio) {
        this.dialogVisibleCancle()
        let { href } = this.$router.resolve({
          path: this.editUrl,
          query: {
            developPackage: 'IS_RD_1',
            projectCategory: 'u',
            demandProjectCode: this.projectCode,
            needAch: '1',
            letterCode: this.letterCode
          }
        })
        // 打开新的窗口
        let $window = window.open(href, '_blank')
      } else {
        // 未选择委托函时给出提示
        this.$message({
          message: '请选择委托函！',
          type: 'info',
          showClose: true
        })
      }
    },
    // 委托函列表重置查询条件
    searchReset () {
      this.radio = ''
      this.entrustSearchForm = { //弹框搜索表单
        taskName: '',
        relatedProjectState: '',
        issueTime: ''
      }
      this.getEntrustmentList()
    },
    // 获取委托函列表
    getEntrustmentList () {
      let params = {
        projectCode: this.projectCode,
        taskName: this.entrustSearchForm.taskName,
        relatedProjectState: this.entrustSearchForm.relatedProjectState,
        // this.entrustSearchForm.issueTime[0].getTime() this.formatDate2(this.entrustSearchForm.issueTime[0], 'YYYY-MM-DD HH:mm:ss')
        createdDateFrom: this.entrustSearchForm.issueTime ? this.entrustSearchForm.issueTime[0].getTime() : '',
        createdDateEnd: this.entrustSearchForm.issueTime ? this.entrustSearchForm.issueTime[1].getTime() : ''
      }
      APIGroupPlan.queryEntrustLetterList(params)
        .then(res => {
          if (res) {
            res.forEach(item => {
              item.taskBudget = deleteZero(item.taskBudget) + '万'
              item.relatedProjectList = item.relatedProjectList.join('；')
            })
            this.tableDataIn = res
          }
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
    // 创建本单位项目
    async createUnitProject (listItem) {
      this.editUrl = '/groupPlan/projectEdit'
      // TODO 判断是否是一般支撑包,非一般支撑包项目：判断当前需求单位项目下是否存在当前登录人所属公司的项目
      if (listItem.developPackage === 'IS_RD_0') {
        // 判断当前需求单位项目下是否存在当前登录人所属公司的项目
        APIGroupPlan.checkCreateUndertakeSpecialProject(listItem.projectCode) //listItem.projectCode
          .then(
            res => {
              this.exsitSubroject = res
              if (this.exsitSubroject === 3) {
                // 如果不存在，弹出确认框“是否仅创建一个本单位项目”
                this.$confirm(' ', '是否创建本单位项目？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  showClose: false,
                  closeOnClickModal: false,
                  customClass: 'self-message-box-delete',
                  cancelButtonClass: 'self-message-box-delete-cancel',
                  confirmButtonClass: 'self-message-box-delete-confirm'
                })
                  .then(() => {
                    // 弹框选择“确认”，则打开新增页面并带出承担单位为当前登录人所属公司的所有成果
                    // let needSubprojectFlag = `?needSubprojectFlag=${this.exsitSubroject}`
                    // let { href } = this.$router.resolve({
                    //   path: this.editUrl,
                    //   query: {
                    //     developPackage: listItem.developPackage,
                    //     projectCategory: 'u',
                    //     demandProjectCode: listItem.projectCode,
                    //     needAch: '1'
                    //   }
                    // })
                    let { href } = this.$router.resolve({
                      path: this.editUrl,
                      query: {
                        developPackage: listItem.developPackage,
                        projectCategory: 'u',
                        demandProjectCode: listItem.projectCode
                      }
                    })
                    // 打开新的窗口
                    let $window = window.open(href, '_blank')
                  })
                  .catch(() => {
                  })
              } else if (this.exsitSubroject === 2) {
                // 存在未关联成果的项目则提示
                this.$message({
                  message: '你还存在未关联成果的项目，请先处理后再创建',
                  type: 'warning',
                  showClose: true
                })
              } else if (this.exsitSubroject === 1) {
                this.$confirm(' ', '是否创建本单位项目？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  showClose: false,
                  closeOnClickModal: false,
                  customClass: 'self-message-box-delete',
                  cancelButtonClass: 'self-message-box-delete-cancel',
                  confirmButtonClass: 'self-message-box-delete-confirm'
                })
                  .then(() => {
                    let { href } = this.$router.resolve({
                      path: this.editUrl,
                      query: {
                        developPackage: listItem.developPackage,
                        projectCategory: 'u',
                        demandProjectCode: listItem.projectCode
                      }
                    })
                    // 打开新的窗口
                    let $window = window.open(href, '_blank')
                  })
                  .catch(() => {
                  })
              }
            }
          )
          .catch(e => {
            this.loading = false
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '校验失败，请稍后重试！',
                type: 'error',
                showClose: true
              })
            }
          })
        // let exsitSubroject = false // TODO 根据接口反参处理
      } else { // 一般支撑包项目--选择委托函后再创建
        this.projectCode = listItem.projectCode //保存项目编码
        await this.getEntrustmentList()
        this.dialogVisible = true
        this.entrustSearchForm.taskName = '' //委托函主题
        this.entrustSearchForm.relatedProjectState = '' //关联项目状态
        this.entrustSearchForm.issueTime = '' //下达时间
      }
    },
    // 调整时间传参格式
    dateTransfer (date) {
      let y = date.getFullYear()
      return y
    },
    intercept () {
      this.projectStatusContent = ''
      this.searchForm.projectDetailsStatus.forEach(element => {
        this.projectStatus.map(item => {
          if (item.value === element) {
            this.projectStatusContent = this.projectStatusContent + item.label + ' '
          }
        })
      })
    },
    //统筹项目列表
    groupPlanProjectList () {
      let params = {
        projectName: this.searchForm.projectName,
        projectDetailsStatus: this.searchForm.projectDetailsStatus === null ? null : this.searchForm.projectDetailsStatus.toString(),
        projectYear: this.searchForm.projectYear === null ? null : this.formatDate(this.searchForm.projectYear)
      }
      APIGroupPlan.getProjectList(params)
        .then(res => {
          if (res) {
            res.forEach(item => {
              item.subProjectInfo = item.subProjectInfo || []
              if (item.createProjectButton || item.subProjectInfo.length !== 0) {
                item.isExpand = false
              }
            })
            this.groupPlanProject = res
          } else {
            this.groupPlanProject = []
          }
          this.setToolTip()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取项目列表失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 统筹项目列表查询条件项目状态当前值
    currentValue (val) {
      this.searchForm.projectDetailsStatus = val
      this.intercept()
    },
    // 重置集团统筹列表查询条件
    resetProjectList () {
      this.$refs.searchForm.resetFields()
      this.searchForm.projectDetailsStatus = [['0', '9', '1', '2', '3', '4', '5', '10', '11'].toString()]
      // this.searchForm.projectDetailsStatus = null
      // this.projectStatusContent = ''
      this.groupPlanProjectList()
    },
    isShowTop (view) {
      if (view === '2') {
        return '已关联成果/需求方项目中的本承担方成果数'
      } else {
        return '已关联成果/需求方项目中的本需求方成果数'
      }
    },
    //设置tooltip是否展示
    setToolTip () {
      this.$nextTick(() => {
        this.getTitleSpanWidth()
        let style = { fontSize: '16px', fontWeight: 'bold' }
        let subWidth = this.projectNameWidth - 22
        if (subWidth < 100) { //最小宽度为100
          subWidth = 100
        }
        this.groupPlanProject.forEach(item => {
          this.$set(item, 'isShowTip', isShowToolTip(item.projectName, this.projectNameWidth, style))
          item.subProjectInfo.forEach(sub => {
            this.$set(sub, 'isShowTip', isShowToolTip(sub.projectName, subWidth, style))
          })
        })
      })
    },
    //获取项目名称列宽度
    getTitleSpanWidth () {
      let nodeList = Array.from(document.querySelectorAll('.el-tooltip.outerTitle'))
      nodeList.forEach(ele => {
        let obj = ele.getBoundingClientRect()
        if (obj.width > 0) {
          this.projectNameWidth = obj.width
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.groupPlanContent{
  background: #F6F6F6;
  .searchContent{
    background: white;
    margin-bottom: 10px;
    /deep/.el-form{
      margin: 0 20px 10px 20px;
      padding: 10px 0;
    }
    /deep/ .el-form-item .el-input__inner{
      color: #999999;
      font-size: 14px;
    }
    .search-btn{
      width: 170px;
      height: 30px;
      float: right;
      margin-right: 5px;
      margin-bottom: 8px;
    }
    .proStatus{
      .accountingNo{
        @include color();
        position: relative;
        left: 220px;
        top: -40px;
      }
    }
  }
  .group-plan{
    background-color: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    padding: 10px 25px 20px;
    z-index: -100;
    /deep/ :focus {
      outline: #e8e8e8;
    }
    .unit-icon {
      display: inline-block;
      min-width: 30px;
      height: 30px;
      font-size: 30px;
      margin-right: 15px;
      @include color();
    }
    .expand-no-permission{
      height: 51px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      height: 50px;
      align-items: center;
      padding: 0 30px;
      .icon{
        width: 25px;
        height: 25px;
        margin-right: 10px;
      }
      .title{
        display: inline-block;
        flex: 1;
        min-width: 100px;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          @include color()
        }
      }
      .itemName{
        display: inline-block;
        color: #6F6F6F;
        text-align: left;
        &:nth-child(3){
          width: 100px;
        }
        &:nth-child(4){
          width: 120px;
        }
        &:nth-child(5){
          width: 80px;
        }
        &:nth-child(6){
          width: 240px;
          margin-right: 138px;
        }
        .accountingNo{
          @include color();
        }
      }
      .demandUnitChild{
        position: absolute;
        top: 0;
      }
    }
    .expand-has-permission{
      height: 51px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      height: 50px;
      align-items: center;
      padding: 0 30px;
      .expand{
        white-space: nowrap;
        display: flex;
      }
      .icon{
        width: 25px;
        height: 25px;
        margin-right: 10px;
      }
      .title{
        min-width: 100px;
        display: inline-block;
        flex: 1;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          @include color()
        }
      }
      .itemName{
        display: inline-block;
        color: #6F6F6F;
        text-align: left;
        &:nth-child(3){
          width: 100px;
        }
        &:nth-child(4){
          width: 120px;
        }
        &:nth-child(5){
          width: 80px;
        }
        &:nth-child(6){
          width: 240px;
        }
        .accountingNo{
          @include color();
        }
      }
      .demandUnitChild{
        position: absolute;
        top: 0;
      }
    }
    .listcon{
      border: 1px solid #D5D6D8;
    }
    .listSubexpand{
      height: 51px;
      border-top: 1px solid #D5D6D8;
      position: relative;
      box-sizing: border-box;
      display: flex;
      height: 50px;
      align-items: center;
      padding: 0 30px;
      .icon{
        width: 25px;
        height: 25px;
        margin-right: 10px;
      }
      .title{
        min-width: 100px;
        display: inline-block;
        flex: 1;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          @include color()
        }
      }
      .itemName{
        display: inline-block;
        color: #6F6F6F;
        text-align: left;
        &:nth-child(3){
          width: 100px;
        }
        &:nth-child(4){
          width: 200px;
        }
        &:nth-child(5){
          width: 240px;
        }
      }
      .demandUnitChild{
        position: absolute;
        top: 0;
      }
    }
    .group-plan-list{
      height: 51px;
      border: 1px solid #D5D6D8;
      border-style: hidden solid;
      border-top: none;
      &:nth-child(1){
        border-top: 1px solid #D5D6D8;
      }
      box-sizing: border-box;
      display: flex;
      height: 50px;
      align-items: center;
      padding: 0 30px;
      .icon{
        width: 25px;
        height: 25px;
        margin-right: 10px;
      }
      .title{
        min-width: 100px;
        display: inline-block;
        flex: 1;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          @include color()
        }
      }
      .itemName{
        display: inline-block;
        color: #6F6F6F;
        text-align: left;
        &:nth-child(3){
          width: 100px;
        }
        &:nth-child(4){
          width: 120px;
        }
        &:nth-child(5){
          width: 80px;
        }
        &:nth-child(6){
          width: 240px;
          margin-right: 217px;
        }
        .accountingNo{
          @include color();
        }
      }
    }
    & > div:last-child{
      border-bottom: 1px solid #D5D6D8!important;
      &.demand-wrapper-expand{
        border-bottom: none !important;
      }
    }
  }
  /deep/ .el-dialog{
    width: 760px;
    /deep/ .el-dialog__header{
      background: #F4F4F4;
      bottom: 0;
      .el-dialog__title{
        font-size: 14px;
        font-weight: 600;
        color: #333333;
      }
      .el-dialog__headerbtn{
        top: 12px;
      }
    }
    /deep/ .el-dialog__footer{
      text-align: right;
      .el-button{
        border-radius: 2px;
      }
    }
    .el-form-item {
      margin-top: 13px;
      /deep/.el-range-input{
        font-size: 12px;
      }
    }
    .el-form-item__error{
      padding-top: 0;
    }
    .el-input__inner{
      width: 220px;
      color: #999999;
      border-radius: 2px;
      background-color:white;
      &:focus{
        // border-color: #0B82FF;
        @include color();
      }
    }
    /deep/ .el-col{
      .el-input__inner{
        height: 28px !important;
      }
    }
    &.chooseForm{
      width: 930px;
      .el-dialog__body {
        padding: 10px 20px;
      }
      .el-table{
        margin-top: 15px;
        color: rgba(0,0,0,0.65);
        .opt-btn{
          font-size: 14px;
          margin: 0 8px;
          padding: 0;
          width: 30px;
        }
        .el-radio__label{
          display: none;
        }
        .el-table__row{
          height: 46px;
          td{
            &:nth-child(1){
              border-left: 1px solid #EBEEF5;
              padding-left: 20px;
            }
            &:nth-last-child(1){
              border-right: 1px solid #EBEEF5;
            }
          }
        }

        /deep/ .el-tooltip__popper{
          max-width: 100px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-tooltip__popper.project-name-popper{
  position: fixed !important;
}
</style>
