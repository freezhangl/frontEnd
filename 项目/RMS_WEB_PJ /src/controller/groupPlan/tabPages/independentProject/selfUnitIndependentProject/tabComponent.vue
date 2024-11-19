<template>
  <div class="unitProjectSearch-container">
    <div class="content">
      <div class="search-content">
        <el-form
          :inline="true"
          :model="searchForm"
          label-width="130px"
          ref="searchForm">
          <div>
            <el-form-item label="年份：" prop="projectYear" :label-width="searchMoreFlag=='0'?'130px':'130px'">
              <el-date-picker
                v-model="searchForm.projectYear"
                type="year"
                popper-class="dateClass"
                value-format="yyyy"
                placeholder="选择年份"
                :clearable="true"
                @keyup.enter.native="getResSearch"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
            <!--<el-form-item label="本单位项目分类：" prop="projectType" :label-width="searchMoreFlag=='0'?'130px':'130px'">
              <el-tooltip
                placement="top-start"
                :content="getTooltipName(searchForm.projectType,projectTypeOptions)"
                :disabled="!getTooltipName(searchForm.projectType,projectTypeOptions)">
                <el-select
                  clearable
                  placeholder="请选择"
                  v-model="searchForm.projectType"
                  @keyup.enter.native="getResSearch">
                  <el-option
                    v-for="item in projectTypeOptions"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode">
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      :content="item.name"
                      :disabled="!showToolTip(item.name, 180)">
                      <span>{{item.name}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>-->
            <el-form-item label="研发性质:" prop="developProperty" :label-width="searchMoreFlag=='0'?'130px':'130px'">
              <el-tooltip
                placement="top-start"
                :content="getTooltipName(searchForm.developProperty,developPropertyList)"
                :disabled="!getTooltipName(searchForm.developProperty,developPropertyList)">
                <el-select
                  clearable
                  v-model="searchForm.developProperty"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in developPropertyList"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode"
                  >
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      :content="item.name"
                      :disabled="!showToolTip(item.name, 180)">
                      <span>{{item.name}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="费用类别：" prop="projectExpenditureType" :label-width="searchMoreFlag=='0'?'130px':'130px'">
              <el-tooltip
                placement="top-start"
                :content="getTooltipName(searchForm.projectExpenditureType,projectExpenditureTypeOptions)"
                :disabled="!getTooltipName(searchForm.projectExpenditureType,projectExpenditureTypeOptions)">
                <el-select
                  clearable
                  placeholder="请选择"
                  v-model="searchForm.projectExpenditureType"
                  @keyup.enter.native="getResSearch">
                  <el-option
                    v-for="item in projectExpenditureTypeOptions"
                    :key="item.valueCode"
                    :label="item.name"
                    :value="item.valueCode">
                    <el-tooltip
                      effect="dark"
                      placement="bottom-start"
                      :content="item.name"
                      :disabled="!showToolTip(item.name, 180)">
                      <span>{{item.name}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="项目状态：" prop="projectStatus" :label-width="searchMoreFlag=='0'?'130px':'130px'">
              <SpAdvancedSelect
                :data.sync="searchForm.projectStatus"
                :list="projectStatusOptions"
                is-more-type="even"
                value-txt="value"
                label-txt="label"
                placeholder="全部"
              ></SpAdvancedSelect>
              <!-- <el-select
                :clearable="true"
                v-model="searchForm.projectStatus"
                placeholder="请选择"
                multiple
                collapse-tags>
                <el-option
                  v-for="item in projectStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="是否研发包项目:" prop="developPackage" v-if="searchMoreFlag==='1'">
              <el-select
                clearable
                v-model="searchForm.developPackage"
                placeholder="全部"
              >
                <el-option
                  v-for="item in developPackageList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划立项时间：" prop="planApprovalTime" v-if="searchMoreFlag==='1'">
              <el-tooltip
                v-if="searchForm.planApprovalTime"
                popper-class="dateRangePop"
                :content="dateRangeTooltip1"
                placement="top"
                effect="dark"
                :offset="-80">
                <el-date-picker
                  class="date-picker"
                  v-model.trim="searchForm.planApprovalTime"
                  type="daterange"
                  placeholder="请选择"
                  range-separator="～"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :clearable="true"
                  value-format="timestamp"
                  @keyup.enter.native="getResSearch">
                </el-date-picker>
              </el-tooltip>
              <el-date-picker
                v-else
                class="date-picker"
                v-model.trim="searchForm.planApprovalTime"
                type="daterange"
                placeholder="请选择"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :clearable="true"
                value-format="timestamp"
                @keyup.enter.native="getResSearch">
              </el-date-picker>
            </el-form-item>
            <el-form-item  label="计划结项时间：" prop="planFinishTime" v-if="searchMoreFlag==='1'">
              <el-tooltip
                v-if="searchForm.planFinishTime"
                popper-class="dateRangePop"
                :content="dateRangeTooltip2"
                placement="top"
                effect="dark"
                :offset="-80">
                <el-date-picker
                  class="date-picker"
                  v-model.trim="searchForm.planFinishTime"
                  type="daterange"
                  placeholder="请选择"
                  range-separator="～"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :clearable="true"
                  value-format="timestamp"
                  @keyup.enter.native="getResSearch">
                </el-date-picker>
              </el-tooltip>
              <el-date-picker
                v-else
                class="date-picker"
                v-model.trim="searchForm.planFinishTime"
                type="daterange"
                placeholder="请选择"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :clearable="true"
                value-format="timestamp"
                @keyup.enter.native="getResSearch">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="项目经理：" prop="projectManagerName" v-if="searchMoreFlag==='1'">
              <el-input
                v-model.trim="searchForm.projectManagerName"
                :clearable="true"
                placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="项目编码：" prop="projectCode"  v-if="searchMoreFlag==='1'">
              <el-input
                clearable
                v-model.trim="searchForm.projectCode"
                @keyup.enter.native="getResSearch"
                placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="项目名称：" prop="projectName" v-if="searchMoreFlag==='1'">
              <el-input
                v-model.trim="searchForm.projectName"
                :clearable="true"
                @keyup.enter.native="getResSearch"
                placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="承担部门:" prop="undertakeCompany"  v-if="searchMoreFlag==='1'">
              <el-tooltip
                class="item"
                effect="dark"
                :disabled="!(nameList && nameList.toString())"
                :content="nameList.toString()"
                placement="top-start">
                <div v-popover:popover1 class="showBox">
                  <p v-if="nameList.length <= 0" class="boxPlaceholder">请选择</p>
                  <div v-else>
                    <div v-if="nameList.length>1  " class="showNameBox" style="overflow: hidden">
                      <p v-for="(item,index) in nameList.slice(0,1)" :key="index">{{item}}</p>
                    </div>
                    <div v-else class="showNameBox">
                      <p v-for="(item,index) in nameList" :key="index">{{item}}</p>
                    </div>
                  </div>
                </div>
              </el-tooltip>
              <el-popover
                style="margin-top:20px !important;"
                :offset='15'
                popper-class="treePopnew"
                ref="popover1"
                placement="bottom"
                @show="show"
                trigger="click"
              >
                <el-input
                  placeholder="输入关键词进行过滤"
                  v-model="filterText">
                </el-input>
                <el-tree
                  class="trees"
                  :default-checked-keys="showData"
                  :check-on-click-node="true"
                  :expand-on-click-node="false"
                  ref="tree"
                  :props="defaultProps"
                  :data="fData"
                  show-checkbox
                  lazy
                  :check-strictly="true"
                  :load="nodeOpen"
                  @check-change="changeValue"
                  :filter-node-method="filterNode"
                  node-key="orgCode"
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <span>
                      <i
                        v-if="node.data.child"
                        :class="node.expanded?'el-icon-folder-opened':'el-icon-folder'"
                        class="iBg"></i>
                      <span>{{ node.label }}</span>
                    </span>
                  </span>
                </el-tree>
              </el-popover>
              <el-tooltip
                v-if="searchForm.orgType"
                class="item"
                effect="dark"
                :content="changeUndertakeCompanyType"
                placement="top-start">
                <el-select
                  style="margin-left: 10px;"
                  clearable
                  class="demandItemTwo"
                  placeholder="全部"
                  v-model="searchForm.orgType"
                  @change="changeInfo"
                >
                  <el-option
                    v-for="item in bearUnitTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-tooltip>
              <el-select
                v-else
                style="margin-left: 10px;"
                clearable
                class="demandItemTwo"
                placeholder="全部"
                v-model="searchForm.orgType"
                @change="changeInfo"
              >
                <el-option
                  v-for="item in bearUnitTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="form-button">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="getResSearch"
                class="primary-button">查 询</el-button>
              <el-button
                icon="el-icon-refresh-left"
                @click="resetSearchForm"
                class="normal-btn">重 置</el-button>
              <el-button
                icon="el-icon-download"
                @click="dialogVisible = true"
                class="normal-btn">导 出
              </el-button>
            </div>
            <span
              class="el-icon-arrow-down"
              :style="{'padding-top': '6px','text-align': 'center', 'float': 'right', 'box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-top': '5px','margin-right':searchMoreFlag==='0'?'5px':'10px'}"
              @click="tableDataInSearchMore"
              v-if="searchMoreFlag==='0'"/>
            <span
              class="el-icon-arrow-up"
              :style="{'padding-top': '6px','text-align': 'center', 'float': 'right', 'box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-top': '5px','margin-right':searchMoreFlag==='0'?'5px':'10px'}"
              @click="tableDataInSearchless"
              v-if="searchMoreFlag==='1'"/>
          </div>
        </el-form>
      </div>
      <div class="main-warpper">
        <div class="main-header">
          <!-- <el-button @click="exportData" class="normal-btn">导出</el-button> -->
        </div>
        <self-table
          ref="tableSortList"
          :table-data="tableDataOut.list"
          :table-cols="tableColsOut"
          :loading="loading"
          :is-border="true"
          :is-index="true"
          :empty-text="emptyText"
          index-title='序号'
          index-width='50px'
          :is-pagination="true"
          :pagination="{ pageSize: tableDataOut.body.pageSize, pageNum: tableDataOut.body.pageNum, total: tableDataOut.total }"
          @refresh="getList"
          @changeTableSort="changeTableSort"
        ></self-table>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      title="配置导出字段"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel">
      <div>
        <div class="underline">
          <p>项目区块选择</p>
        </div>
        <div>
          <el-checkbox-group v-model="checkList" class="checkbox-group1">
            <el-checkbox
              v-for="item in block"
              :label="item.label"
              :disabled="item.label==='projectBaseInfo'"
              :key="item.label"
              @change="checkbox">{{item.value}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="underline">
          <p>属性字段选择 (<span>必须先选择属性信息区块</span>)</p>
        </div>
        <div>
          <el-checkbox-group v-model="checkList1" class="checkbox-group1">
            <el-checkbox
              v-for="item in attribute"
              :label="item.fieldKey"
              :disabled="checkboxout"
              :key="item.fieldKey">{{item.fieldTitle}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="exportFile">导出</el-button>
      </span>
    </el-dialog>
    <div class='popContainer' v-if="popContainer">
      <el-progress
        type="circle"
        :percentage="percentage"
        :color = "colors"
        class="progress"></el-progress>
    </div>
  </div>
</template>
<script>
import SelfTable from '@/components/table'
import treeSelect from '@/components/treeSelect'
import { mapGetters } from 'vuex'
import { getStore } from '@/store'
import API from '@/serve/API_projectSearch'
import ProjectAPI from '@/serve/API_project'
import { isShowToolTip } from '@/utils/common.js'
import axios from 'axios'
export default {
  components: { SelfTable },
  data () {
    return {
      filterText: '', //搜索字段
      emptyText: '请输入查询条件', //初始空数据时文本
      searchForm: { //搜索表单
        projectYear: '', //1年份
        projectType: '', //2本单位项目分类1
        developProperty: '', //3研发性质1
        projectExpenditureType: '', //4费用类别1
        projectStatus: [], //5项目状态1
        developPackage: '', //6是否研发包1（新增）
        planApprovalTime: '', //7计划立项时间
        planFinishTime: '', //8计划结项时间
        projectManagerName: '', //9项目经理1
        projectCode: '', //10项目编码
        projectName: '', //11项目名称
        organizationCodes: [], //12承担部门1
        orgType: '', //13承担部门类型1
        field: '', //排序字段
        sortWay: '' //排序类型
      },
      undertakeCompany: [],
      undertakeCompanyTypeContent: '',
      bearUnitTypeOptions: [{ value: 1, label: '牵头' }, { value: 0, label: '配合' }], //承担单位类型 options
      nameList: [], //承担部门显示的名字
      showData: [], //回显
      fData: [],
      defaultProps: {
        children: 'child',
        label: 'orgAbbr',
        isLeaf: 'leaf'
      },
      projectManagerNameOptions: [], //项目经理 options
      periodOwnershipOptions: [], //期间归属 options
      // organizationCodeOptions: [{ label: '所属组织1', value: 1 }, { label: '所属组织2', value: 2 }], //所属组织options
      projectStatusOptions: [{ value: 0, label: '草稿' }, {
        value: '10',
        label: '预立项审批中'
      },
      {
        value: '11',
        label: '已预立项'
      }, { value: 1, label: '立项审批中' }, { value: 2, label: '已立项' }, { value: 3, label: '变更审批中' }, { value: 4, label: '终止审批中' }, { value: 5, label: '结项审批中' }, { value: 6, label: '已终止' }, { value: 7, label: '已结项' }, { value: 8, label: '已关闭' }], //项目状态options
      developPackageList: [{ value: 'IS_RD_1', label: '是' }, { value: 'IS_RD_0', label: '否' }], //是否研发包
      projectTypeOptions: [], //本单位项目分类options
      developPropertyList: [], //研发性质options
      projectExpenditureTypeOptions: [], //费用类别options
      loading: false,
      userInfo: getStore().getters['USERENTITY/userInfo'],
      isSearched: false, //是否已重置和初始页面
      tableDataOut: { //外层表格数据
        body: { pageSize: 10, pageNum: 1 },
        total: 0,
        list: []
      },
      tableColsOut: [
        {
          label: '项目名称',
          prop: 'projectName',
          sortable: true,
          align: 'left',
          overflow: true,
          minwidth: '350px',
          handleClick: this.handleClick,
          itemClass: this.itemClass
        },
        {
          label: '项目编码',
          prop: 'projectCode',
          align: 'left',
          overflow: true,
          sortable: true,
          minwidth: '110px',
          padding: true
        },
        {
          label: '项目核算编码',
          prop: 'accountingNo',
          align: 'left',
          overflow: true,
          sortable: true,
          minwidth: '130px',
          padding: true
        },
        {
          label: '项目经理',
          prop: 'projectManagerName',
          align: 'left',
          sortable: true,
          minwidth: '110px',
          overflow: true
        },
        {
          label: '计划立项时间',
          minwidth: '130px',
          prop: 'planApprovalTime',
          align: 'left',
          sortable: true,
          overflow: true,
          formatter: this.formatDate1
        },
        {
          label: '计划结项时间',
          minwidth: '130px',
          prop: 'planFinishTime',
          sortable: true,
          align: 'left',
          overflow: true,
          formatter: this.formatDate1
        },
        {
          label: '研发性质',
          prop: 'developProperty',
          minwidth: '110px',
          sortable: true,
          align: 'left',
          overflow: true,
          formatter: this.statusFormatter1
        },
        /* {
          label: '本单位项目分类',
          prop: 'projectType',
          minwidth: '160px',
          sortable: true,
          align: 'left',
          overflow: true,
          formatter: this.statusFormatter2
        },*/
        {
          label: '年份',
          prop: 'projectYear',
          minwidth: '90px',
          sortable: true,
          align: 'left',
          overflow: false
        },
        {
          label: '是否研发包',
          prop: 'developPackage',
          minwidth: '114px',
          sortable: true,
          align: 'left',
          overflow: true,
          formatter: this.statusFormatter4
        },
        { label: '状态',
          type: 'Status',
          prop: 'projectDetailsStatus',
          align: 'left',
          sortable: true,
          minwidth: '110px',
          overflow: true,
          resizable: false,
          formatter: this.statusFormatter,
          oneByone: [
            { key: '0', classValue: 'stop' },
            { key: '1', classValue: 'editing' },
            { key: '2', classValue: 'over' },
            { key: '3', classValue: 'editing' },
            { key: '4', classValue: 'fail' },
            { key: '5', classValue: 'editing' },
            { key: '6', classValue: 'fail' },
            { key: '7', classValue: 'stop' },
            { key: '8', classValue: 'stop' },
            { key: '10', classValue: 'editing' },
            { key: '11', classValue: 'over' }
          ]
        }
      ],
      block: [ // 到处模块数据
        {
          label: 'projectBaseInfo',
          value: '基本信息'
        }, {
          label: 'projectAttribute',
          value: '属性信息'
        }, {
          label: 'projectTeam',
          value: '团队信息'
        }, {
          label: 'costBudget',
          value: '项目预算'
        }, {
          label: 'projectAchievement',
          value: '预期成果'
        }, {
          label: 'milestoneInfoBase',
          value: '里程碑'
        }, {
          label: 'packageTask',
          value: '任务申请'
        }
      ],
      attribute: [],
      checkList: ['projectBaseInfo'],
      checkList1: [],
      colors: '#20a0ff',
      progressStatus: { normal: '#20a0ff', success: '#13ce66', exception: '#ff4949' },
      checkboxout: true,
      dialogVisible: false,
      popContainer: false,
      percentage: 0, //进度条
      searchMoreFlag: '1', //搜索更多 0隐藏 1 显示更多
      pageNum: 0,
      pageSize: 10,
      totalPages: 0,
      nextHandleVisble: false,
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      baseUrl: getStore().getters['CONFIG/baseUrl'],
      timer: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  props: {
    props: Object,
    data: String,
    status: String
  },
  computed: {
    dateRangeTooltip1 () {
      let val = ''
      if (this.searchForm.planApprovalTime) {
        val = this.$formatDate(this.searchForm.planApprovalTime[0], 'YYYY-MM-DD') +
          '～' + this.$formatDate(this.searchForm.planApprovalTime[1], 'YYYY-MM-DD')
      }
      return val
    },
    dateRangeTooltip2 () {
      let val = ''
      if (this.searchForm.planFinishTime) {
        val = this.$formatDate(this.searchForm.planFinishTime[0], 'YYYY-MM-DD') +
          '～' + this.$formatDate(this.searchForm.planFinishTime[1], 'YYYY-MM-DD')
      }
      return val
    },
    changeUndertakeCompanyType () {
      let val = ''
      if (this.searchForm.orgType) {
        this.bearUnitTypeOptions.forEach(item => {
          if (this.searchForm.orgType === item.value) {
            val = item.label
          }
        })
      }
      return val
    },
    dateRangeTooltip3 () {
      let val = ''
      if (this.searchForm.actualApprovalTime) {
        val = this.$formatDate(this.searchForm.actualApprovalTime[0], 'YYYY-MM-DD') +
          '～' + this.$formatDate(this.searchForm.actualApprovalTime[1], 'YYYY-MM-DD')
      }
      return val
    },
    ...mapGetters({
      menuResCode: 'USERENTITY/menuResCode',
      hasRole: 'USERENTITY/hasRole'
    })
  },
  mounted () {
    this.getSearchData()
    this.getCode()
    //this.nextProjectManagerNameOptions()
    //获取属性信息的字段
    this.getFieldByCompanyAndType()
    //this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    //输入框添加浮显
    getTooltipName (item, list) {
      let toolTipName = ''
      list.forEach((iitem) => {
        if (iitem.valueCode === item) {
          toolTipName = iitem.name
        }
      })
      return toolTipName
    },
    checkbox () {
      let add = this.checkList.some(item => {
        return item === 'projectAttribute'
      })
      if (add) {
        this.checkboxout = false
      } else {
        this.checkboxout = true
        this.checkList1 = []
      }
    },
    //数据导出进度条控制
    controlProgress () {
      let that = this
      let endPro = 95
      that.interval = setInterval(function () {
        if (that.percentage < endPro) {
          that.percentage++
        }
      }, 100)
    },
    cancel () {
      this.dialogVisible = false
      this.checkboxout = true
      this.checkList = ['projectBaseInfo']
      this.checkList1 = []
    },
    setQueryConfig (obj) {
      let str = ''
      for (let o in obj) {
        if (obj[o]) {
          str += o + '=' + obj[o] + '&'
        }
      }
      str = str.substring(0, str.length - 1)
      return str
    },
    exportFile () {
      let block = {
        projectBaseInfo: true,
        projectAttribute: false,
        projectTeam: false,
        costBudget: false,
        projectAchievement: false,
        milestoneInfoBase: false
      }
      let attribute = []
      this.checkList.forEach(item => {
        block[item] = true
      })
      if (!this.checkList1.length) {
        block.projectAttribute = false
      }
      this.checkList1.forEach(item => {
        this.attribute.forEach(ite => {
          if (item === ite.fieldKey) {
            attribute.push(ite)
          }
        })
      })
      let param = {
        projectCategory: 'PC-SELF-UNIT',
        resCode: this.menuResCode,
        projectYear: this.searchForm.projectYear,
        projectManagerName: this.searchForm.projectManagerName,
        projectName: this.searchForm.projectName,
        projectCode: this.searchForm.projectCode,
        planApprovalTime1: this.searchForm.planApprovalTime ? this.$formatDate(this.searchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        planApprovalTime2: this.searchForm.planApprovalTime ? this.$formatDate(this.searchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        projectType: this.searchForm.projectType,
        developProperty: this.searchForm.developProperty, //新增研发性质
        projectExpenditureType: this.searchForm.projectExpenditureType, //费用类别
        developPackage: this.searchForm.developPackage, //是否研发包
        planFinishTime1: this.searchForm.planFinishTime ? this.$formatDate(this.searchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        planFinishTime2: this.searchForm.planFinishTime ? this.$formatDate(this.searchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        organizationCodes: this.searchForm.undertakeCompany ? this.searchForm.undertakeCompany : [], //承担部门
        orgType: this.searchForm.orgType, //承担部门类型
        orderBy: this.searchForm.filed, //排序字段
        orderType: this.searchForm.sortWay//排序顺序
      }
      if (this.searchForm.projectStatus) {
        param.projectDetailsStatus = this.searchForm.projectStatus
      }
      Object.assign(param, block, { projectAttributeFields: attribute })
      /*
     let queryParamStr = this.setQueryConfig(param)
      let blockStr = this.setQueryConfig(block)
      let url = '?' + queryParamStr + '&' + blockStr +
        '&projectAttributeFields=' + encodeURI(JSON.stringify(attribute))
        */
      this.popContainer = true
      this.controlProgress()
      axios.post(this.baseUrl + '/rms/project/projectManagement/v1/5/exportItems', param,
        {
          headers: {
            'Authorization': this.Authorization,
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
          },
          responseType: 'arraybuffer' })
        .then((res) => {
          let t
          clearTimeout(t)
          let blob = new Blob([res.data])
          let exportFileName = decodeURI(res.headers['content-disposition'].split('=')[1])
          let fileName = exportFileName.replace('UTF-8\'\'', '')
          // 非IE下载
          if ('download' in document.createElement('a')) {
            let elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
          clearInterval(this.interval)
          this.percentage = 100
          this.colors = this.progressStatus.success
          t = setTimeout(() => {
            this.popContainer = false
            this.cancel()
            this.percentage = 0
            this.colors = this.progressStatus.normal
            this.$message({
              message: '数据导出成功！',
              type: 'success',
              showClose: true
            })
          }, 1000)
        })
        .catch(e => {
          clearInterval(this.interval)
          this.percentage = 50
          this.colors = this.progressStatus.exception
          // this.cancel()
          if (e.selfError) return
          if (e.message) {
            this.popContainer = false
            this.percentage = 0
            this.colors = this.progressStatus.normal
            this.$message({
              message: e.message || '数据导出失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    changeTableSort (column) {
      //获取字段名称和排序类型
      let fieldName = column.prop
      if (fieldName !== '' && fieldName !== null) {
        fieldName = fieldName.replace('projectBaseInfo.', '')
        this.searchForm.filed = fieldName
      }
      let sortWay = column.order
      if (sortWay !== '' && sortWay !== null) {
        sortWay = sortWay.replace('ending', '')
        this.searchForm.sortWay = sortWay
      } else {
        this.searchForm.filed = ''
        this.searchForm.sortWay = ''
      }
      if (this.isSearched) {
        this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
      }
    },
    doLongSearch () {
      // 模糊查询用户列表
      this.pageNum = 0
      this.projectManagerNameOptions = []
      this.loadingTip = '加载中...'
      this.nextProjectManagerNameOptions()
    },
    //有信息发生修改
    changeInfo (value) {
    },
    show () {
      this.$nextTick(() => {
        this.$refs.popover1.popperElm.style.top = `${Number(this.$refs.popover1.popperElm.style.top.substring(0, this.$refs.popover1.popperElm.style.top.length - 2)) + 15}px`
        var dis = Array.from(document.querySelectorAll('.el-tree-node__content .el-checkbox .is-disabled'))
      })
    },
    nodeOpen (data, resolve) {
      if (data.level === 0) {
        let treeData = this.fData
        return resolve(treeData)
      } else if (data.data.orgCode) {
        let params = {}
        params.userOrgCode = data.data.orgCode
        params.resCode = this.menuResCode
        API.getCustomOrgs(params)
          .then(res => {
            if (res && res.orgs) {
              res.orgs.forEach(item => {
                item.leaf = true
                item.disabled = !item.enable
              })
              resolve(res.orgs)
            }
          })
          .catch(e => {
            if (e.selfError) return
            resolve([]) //处理无权限问题
            //this.$message.error('组织节点加载失败!')
          })
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    //承担部门
    changeValue (data, checked, node) {
      if (!data.disabled) {
        if (checked === true) {
          // console.log(data)
          this.checkedId = data.orgCode
          let keys = this.$refs.tree.getCheckedKeys()
          if (!this.nameList.includes(data.orgName)) {
            this.nameList.push(data.orgName)
          }
          this.$emit('update:data', JSON.stringify({ orgCode: data.orgCode, companyName: data.companyName, orgName: data.orgName }))
          this.$emit('changeEvent', JSON.stringify({ orgCode: data.orgCode, companyName: data.companyName, orgName: data.orgName }))
          this.searchForm.undertakeCompany = keys
        } else {
          let keys = this.$refs.tree.getCheckedKeys()
          if (this.nameList.includes(data.orgName)) {
            let index = this.nameList.indexOf(data.orgName)
            this.nameList.splice(index, 1)
            this.searchForm.undertakeCompany = keys
          }
        }
      }
    },
    getCode (id) {
      let sendId = id || this.userInfo.userAuth.companyCode
      let params = { companyCode: sendId }
      API.getOrgInfoByCompanyCode(params) //
        .then(res => {
          this.fData = [res.org]
          if (this.fData[0] !== null && this.fData[0] !== undefined) {
            this.fData[0].disabled = true
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
    // 获取部门数据
    getChooseDepartment (code, resolve, data) {
      let param = {
        parentOrgCode: code,
        orgForm: 2,
        recursion: false,
        companyPartCode: this.userInfo.userAuth.curUserOrg.companyPartCode
      }
      API.getChooseDepartment(param)
        .then(res => {
          if (res.length) {
            if (resolve) {
              res.forEach((item) => {
                if (!item.hasChildren) {
                  item.leaf = true
                  item.disabled = !item.enable
                }
              })
              resolve(res)
              data.data.child = res
            } else {
              this.fData[0].child = res
              this.fData[0].disabled = true
            }
          } else if (resolve) {
            resolve([])
          }
          // console.log(this.fData)
        })
        .catch(e => {
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
    recursion (array, fData, { notDisabled }) {
      for (let i = 0; i < fData.length; i++) {
        if (!notDisabled) {
          // 达到最大值 禁用
          fData[i].disabled = true
        } else {
          fData[i].disabled = false // 所有不禁用
        }
        if (array.indexOf(fData[i].orgCode) !== -1 && !notDisabled) {
          fData[i].disabled = false
        }
        this.$forceUpdate()
        // 递归
        if (fData[i].child && fData[i].child.length) {
          return this.recursion(array, fData[i].child, { notDisabled })
        }
      }
    },
    nextProjectManagerNameOptions () { //项目经理加载下一页
      let params = {
        pageNum: this.pageNum + 1,
        pageSize: this.pageSize,
        chineseName: this.filterText,
        userStatusCode: '0', // 原来传userStatus: '正常'，现改成userStatusCode
        resCode: this.menuResCode
      }
      API.getUserList(params)
        .then(res => {
          if (res) {
            if (res.records) {
              res.records.forEach(item => {
                item.lable = item.chineseName + ' / ' + item.uid
              })
            }
            this.projectManagerNameOptions = this.projectManagerNameOptions.concat(res.records) || []
            this.pageNum = parseInt(res.current)
            this.totalUserNum = parseInt(res.total)
            this.totalPages = parseInt(res.pages)
            this.nextHandleVisble = this.pageNum < this.totalPages
            if (this.totalUserNum > 0) {
              this.loadingTip = '加载中...'
            } else {
              this.loadingTip = '暂无数据'
            }
          } else {
            this.loadingTip = '暂无数据'
          }
          // this.userIsloading = false
        })
        .catch(e => {
          if (e.selfError) return
          this.loadingTip = '暂无数据'
          if (e.code === '209014') {
            // 账号不存在
            // this.userList = []
            // this.totalUserNum = 0
          } else {
            this.$message({
              message: '用户信息查询失败，' + e.message,
              type: 'error',
              showClose: true
            })
          }
        })
    },
    loadNode (node, resolve) { //懒加载方法
      if (node.level === 0) {
        let params = {}
        params.resCode = this.menuResCode
        API.getCustomOrgs(params)
          .then(res => {
            if (res && res.orgs) {
              this.addLeaf(res.orgs)
              resolve(res.orgs)
            }
          })
          .catch(e => {
            if (e.selfError) return
            this.$message.error('组织节点加载失败!')
          })
      }
      if (node.level >= 1) {
        let params = {}
        params.userOrgCode = node.data.orgCode
        params.resCode = this.menuResCode
        API.getCustomOrgs(params)
          .then(res => {
            if (res && res.orgs) {
              this.addLeaf(res.orgs)
              resolve(res.orgs)
            }
          })
          .catch(e => {
            if (e.selfError) return
            this.$message.error('组织节点加载失败!')
          })
      }
    },
    addLeaf (arr) {
      if (arr && arr.length) {
        arr.forEach(item => {
          item.isLeaf = !item.hasChildren
          item.disabled = !item.enable
        })
      }
    },
    // 日期格式化
    formatDate1 (val) {
      if (!val) {
        return ''
      }
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    getSearchData () {
      //项目类型
      API.dictValByCode('PROJECT-TYPE')
        .then(res => {
          this.projectTypeOptions = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
      // 获取研发性质option
      API.dictValByCode('DEVELOP-PROPERTY')
        .then(res => {
          this.developPropertyList = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
      //费用类别
      API.dictValByCode('PROJECT-EXPENDITURE-TYPE')
        .then(res => {
          this.projectExpenditureTypeOptions = res
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    setAddCommitmentUnitName (val) { //设置所属组织 v-modle
      if (val === '') {
        this.searchForm.organizationCode = []
      } else {
        this.searchForm.organizationCode = val
      }
    },
    tableDataInSearchMore () {
      this.searchMoreFlag = '1'
    },
    tableDataInSearchless () {
      this.searchMoreFlag = '0'
    },
    itemClass (row) {
      return 'hover'
    },
    handleClick (row) { //点击项目名称进入项目详情
      // 判断是否具有权限
      ProjectAPI.verificationPermission({ projectCode: row.projectCode })
        .then(res => {
          let flag = false
          res.forEach(item => {
            if (item === '00' || item === '01') {
              flag = true
            }
          })
          if (flag) {
            let { href } = this.$router.resolve({
              path: '/projectInfo/projectInfo-detail/' + row.projectCode
            })
            // 打开新的窗口
            let $window = window.open(href, '_blank')
            if (this.timer[row.projectCode]) {
              window.clearInterval(this.timer[row.projectCode])
            }
            this.timer[row.projectCode] = setInterval(() => {
              if ($window && $window.closed) {
                if (this.timer[row.projectCode]) {
                  window.clearInterval(this.timer[row.projectCode])
                }
                this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
              }
            }, 500)
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
    },
    // 导出数据
    exportData () {
    },
    //获取属性信息字段
    getFieldByCompanyAndType () {
      let attrParam = {
        companyCode: this.userInfo.userAuth.companyCode,
        isAll: false,
        businessObject: 'BO_PROJECT'
      }
      API.findFieldByCompanyAndType(attrParam)
        .then(res => {
          res.forEach((item) => {
            item.fieldTitle = item.fieldTitle.replace('<br>', '')
            this.attribute.push(item)
          })
        })
        .catch(err => {
          this.$message.error(err.message || '属性信息字段获取失败')
        })
    },
    //查询
    getResSearch () {
      this.tableDataOut.body.pageNum = 1
      this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
    },
    // 获取外层列表
    getList (pageNum, pageSize) {
      this.tableDataOut.body.pageNum = pageNum
      this.tableDataOut.body.pageSize = pageSize
      this.loading = true
      let param = {
        projectCategory: 'PC-SELF-UNIT',
        resCode: this.menuResCode,
        pageNum: pageNum,
        pageSize: pageSize,
        projectYear: this.searchForm.projectYear,
        projectManagerName: this.searchForm.projectManagerName,
        projectName: this.searchForm.projectName,
        projectCode: this.searchForm.projectCode,
        planApprovalTime1: this.searchForm.planApprovalTime ? this.$formatDate(this.searchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        planApprovalTime2: this.searchForm.planApprovalTime ? this.$formatDate(this.searchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        projectType: this.searchForm.projectType,
        developProperty: this.searchForm.developProperty, //新增研发性质
        projectExpenditureType: this.searchForm.projectExpenditureType, //费用类别
        developPackage: this.searchForm.developPackage, //是否研发包
        planFinishTime1: this.searchForm.planFinishTime ? this.$formatDate(this.searchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        planFinishTime2: this.searchForm.planFinishTime ? this.$formatDate(this.searchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        actualApprovalTime1: this.searchForm.actualApprovalTime ? this.$formatDate(this.searchForm.actualApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        actualApprovalTime2: this.searchForm.actualApprovalTime ? this.$formatDate(this.searchForm.actualApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        organizationCodes: this.searchForm.undertakeCompany ? this.searchForm.undertakeCompany : '', //承担部门
        orgType: this.searchForm.orgType, //承担部门类型
        orderBy: this.searchForm.filed, //排序字段
        orderType: this.searchForm.sortWay//排序顺序
      }
      if (this.searchForm.projectStatus) {
        param.projectDetailsStatus = this.searchForm.projectStatus.join(',')
      }
      if (param.organizationCodes) {
        param.organizationCodes = param.organizationCodes.join(',')
      }
      API.getUnitProjectSearch(param)
        .then(res => {
          this.loading = false
          if (res && res.list && res.list.length) {
            this.tableDataOut.list = res.list
            this.isSearched = true
            this.tableDataOut.total = parseInt(res.total)
          } else {
            this.emptyText = '暂无数据'
            this.isSearched = false
            this.tableDataOut.list = []
            this.tableDataOut.total = 0
            if (param.pageNum !== 1) { //点击分页查询
              this.tableDataOut.body.pageNum = 1
              this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
            }
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '列表获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    // 重置搜索表单
    resetSearchForm () {
      this.$refs['searchForm'].resetFields()
      this.filterText = ''
      this.searchForm = { //搜索表单
        projectYear: '', //1年份
        projectType: '', //2本单位项目分类1
        developProperty: '', //3研发性质1
        projectExpenditureType: '', //4费用类别1
        projectStatus: [], //5项目状态1
        developPackage: '', //6是否研发包
        planApprovalTime: '', //7计划立项时间
        planFinishTime: '', //8计划结项时间
        projectManagerName: '', //9项目经理1
        projectCode: '', //10项目编码
        projectName: '', //11项目名称
        undertakeCompany: [], //12承担部门变量名
        organizationCodes: [], //12承担部门传参1
        orgType: '' //13承担部门类型1
      }
      this.nameList = []
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
      // 排序重置
      this.isSearched = false
      this.filterText = ''
      this.searchForm.field = ''
      this.searchForm.sortWay = ''
      this.$refs.tableSortList.$children[0].clearSort()
      this.emptyText = '请输入查询条件'
      this.tableDataOut.list = []
      this.tableDataOut.total = 0
      this.tableDataOut.body.pageNum = 1
      this.tableDataOut.body.pageSize = 10
    },
    statusFormatter1 (val) { //研发性质
      let status = ''
      this.developPropertyList.some(item => {
        if (val === item.valueCode) {
          status = item.name
        }
      })
      return status
    },
    statusFormatter2 (val) { //项目类型
      let status = ''
      this.projectTypeOptions.some(item => {
        if (val === item.valueCode) {
          status = item.name
        }
      })
      return status
    },
    statusFormatter3 (val) { //项目来源
      let status = ''
      this.projectSourceOptions.some(item => {
        if (val === item.valueCode) {
          status = item.name
        }
      })
      return status
    },
    statusFormatter4 (val) { //是否研发包
      let status = ''
      this.developPackageList.some(item => {
        if (val === item.value) {
          status = item.label
        }
      })
      return status
    },
    // 状态过滤
    statusFormatter (val) {
      let status = ''
      switch (val) {
        case '0':
          status = '草稿'
          break
        case '1':
          status = '立项审批中'
          break
        case '2':
          status = '已立项'
          break
        case '3':
          status = '变更审批中'
          break
        case '4':
          status = '终止审批中'
          break
        case '5':
          status = '结项审批中'
          break
        case '6':
          status = '已终止'
          break
        case '7':
          status = '已结项'
          break
        case '8':
          status = '已关闭'
          break
        case '10':
          status = '预立项审批中'
          break
        case '11':
          status = '已预立项'
          break
        default:
          status = ' '
      }
      return status
    }
  }
}
</script>
<style lang="scss" scoped>
.unitProjectSearch-container{
  /deep/ .el-table td, /deep/ .el-table th {
    position: inherit !important;
    border-bottom: 1px solid #e5e5e5 !important;
  }
  /deep/  .padding-col{
    padding-left: 5px!important;
  }
  .content{
    .search-content {
      background: #fff;
      padding: 20px 30px 10px 30px;
      margin-bottom: 10px;
      /deep/ .el-form-item .el-input__inner{
        width: 220px;
        max-width: 220px;
      }
      .form-button {
        float: right;
        padding-top: 5px;
        .primary-button {
          height: 30px;
        }
        .reset-button {
          height: 30px;
          color: #0B82FF;
          border: 1px solid rgba(11,130,255,0.50);
        }
      }
    }
    .showBox {
      -webkit-appearance: none;
      background-color: #FFFFFF;
      background-image: none;
      border-radius: 2px;
      border: 1px solid #E5E5E5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #666666;
      display: inline-block;
      font-size: inherit;
      height: 30px;
      line-height: 30px;
      outline: none;
      padding: 0 15px;
      -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      position: relative;
      cursor: pointer;
      width: 130px;
      vertical-align: middle;

      .boxPlaceholder {
        margin: 0px;
        color: #9397AA;
        font-size: 14px;
        line-height: 29px;
      }
    }

    .noClick {
      background-color: #F4F4F4;
      border-color: #E5E5E5;
      color: #999999;
      cursor: not-allowed;
    }

    .showNameBox {
      display: flex;
      align-items: center;

      p {
        background: #f0f0f0;
        color: #838383;
        border: 1px solid #e0e0e0;
        margin-top: 0;
        margin-bottom: 0;
        border-radius: 4px;
        padding: 0 10px;
        font-size: 13px;
        line-height: 26px;
        margin-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100px;

        &:last-child {
          margin: 0;
        }
      }
    }
    /deep/ .el-form-item .el-input__inner {
      width: 220px;
      max-width: 220px;
    }
    /deep/ .el-form-item .demandItemTwo {
     line-height: 26px;
      vertical-align: middle;
    }
    /deep/ .el-form-item .demandItemTwo .el-input__inner {
      width: 80px;
      max-width: 80px;
    }
    .iBg {
      color: #999;
      margin-right: 8px;
    }

    .treePop {
      min-width: 300px !important;
      height: 200px;
      overflow-y: auto;
    }
    .main-warpper{
      background: white;
      padding: 20px 30px 30px;
      .main-header{
        margin-bottom: 20px;
        overflow: hidden;
        float: right;
      }
      /deep/ .el-table--border {
        border: none !important;
      }
      /deep/ .sp-table .el-table--border th {
        border-right: 1px solid #ebeef5 !important;
      }

      /deep/ .sp-table .padding-col {
        padding-left: 0px;
      }
      /deep/ .hover{
        @include color();
        &:hover{
          // color: #0b82ff,
        }
        cursor: pointer
      }
    }
  }
  /deep/ .el-dialog__footer{
    text-align: right;
    .el-button{
      border-radius: 2px;
    }
  }
  /deep/ .el-dialog__body{
    padding: 0 20px;
  }
  /deep/ .el-checkbox__label{
    padding-left:5px;
  }
  .underline{
    font-size: 14px;
    color: #333333;
    border-bottom: 1px solid #E5E5E5;
    p{
      font-weight: 600;
      margin-left: 10px;
      span{
        color:#ff3f3b;
      }
    }
  }
  .checkbox-group1{
    margin-left: 20px;
    .el-checkbox{
      width: 180px;
      height:40px;
      line-height: 50px;
      margin-right: 0;
    }
  }
  .checkbox-group1{
    margin-left: 20px;
    .el-checkbox{
      width: 180px;
      height:40px;
      line-height: 50px;
      margin-right: 0;
    }
  }
  .popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index:100000;
  }
  .progress{
    position: absolute;;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    /deep/ .el-progress__text{
      color: #fff;
    }
  }
}
.red{
  color: red!important;
}
// 下拉超出省略号显示
.el-select-dropdown__item {
  /deep/ span {
    box-sizing: border-box;
    display: inline-block;
    max-width: 180px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
// /deep/ .el-checkbox__inner {
//   border-radius: 50% !important;
// }
</style>
<style  lang="scss">
.treePopnew {
  min-width: 300px !important;
  height: 230px;
  overflow-y: auto;
  .tree-con {
    height: 200px;
    .el-scrollbar {
      width: 100%;
      height: 100%;
      /deep/.el-scrollbar__wrap{
        overflow-x: hidden;
        height: 99%;
      }
    }
    /deep/ .el-tree{
      >.el-tree-node{
        display:inline-block;
        min-width: 300px;
      }
      .el-tree-node__content {
        height: 32px;
      }
    }
  }
}
</style>
