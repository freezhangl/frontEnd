<template>
  <div class="content">
    <div class="search-content">
      <el-form :model="bearSearchForm" label-width="130px" ref="bearSearchForm">
        <div>
          <el-form-item
            label="年份:"
            prop="projectYear"
            :label-width="searchMoreFlag=='0'?'55px':'130px'"
          >
            <el-date-picker
              v-model="bearSearchForm.projectYear"
              type="year"
              popper-class="dateClass"
              value-format="yyyy"
              placeholder="选择年份"
              :clearable="true"
              :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="需求单位:" prop="demandCompany" :label-width="searchMoreFlag=='0'?'83px':'130px'">
            <el-tooltip
              v-if="bearSearchForm.demandCompany"
              class="item"
              effect="dark"
              :content="changeDemandCompany"
              placement="top-start">
              <el-select
                clearable
                filterable
                placeholder="请选择"
                v-model="bearSearchForm.demandCompany"
                @change="changeInfo"
              >
                <el-option
                  v-for="item in bearUnitOptions"
                  :key="item.orgCode"
                  :label="item.orgName"
                  :value="item.orgCode"
                  :disabled="item.disabled">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.orgName"
                    :disabled="!showToolTip(item.orgName, 180)">
                    <span>{{item.orgName}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              clearable
              filterable
              placeholder="请选择"
              v-model="bearSearchForm.demandCompany"
              @change="changeInfo"
            >
              <el-option
                v-for="item in bearUnitOptions"
                :key="item.orgCode"
                :label="item.orgName"
                :value="item.orgCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.orgName"
                  :disabled="!showToolTip(item.orgName, 180)">
                  <span>{{item.orgName}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="承担单位:" prop="undertakeCompany" :label-width="searchMoreFlag=='0'?'83px':'130px'">
            <el-tooltip
              v-if="bearSearchForm.undertakeCompany"
              class="item"
              effect="dark"
              :content="changeUndertakeCompany"
              placement="top-start">
              <el-select
                class="demandItemOne"
                clearable
                filterable
                placeholder="请选择"
                v-model="bearSearchForm.undertakeCompany"
                @change="changeInfo">
                <el-option
                  v-for="item in bearBearUnitOptions"
                  :key="item.orgCode"
                  :label="item.orgName"
                  :value="item.orgCode"
                  :disabled="item.disabled">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.orgName"
                    :disabled="!showToolTip(item.orgName, 180)">
                    <span>{{item.orgName}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              class="demandItemOne"
              clearable
              filterable
              placeholder="请选择"
              v-model="bearSearchForm.undertakeCompany"
              @change="changeInfo">
              <el-option
                v-for="item in bearBearUnitOptions"
                :key="item.orgCode"
                :label="item.orgName"
                :value="item.orgCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.orgName"
                  :disabled="!showToolTip(item.orgName, 180)">
                  <span>{{item.orgName}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集团项目类别:" prop="projectClass" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="bearSearchForm.projectClass"
              class="item"
              effect="dark"
              :content="changeProjectClass"
              placement="top-start">
              <el-select
                v-model="bearSearchForm.projectClass"
                placeholder="请选择"
                @change="changeInfo"
                clearable>
                <el-option
                  v-for="item in bearProjectCategoryOptions"
                  :key="item.valueCode"
                  :label="item.name"
                  :value="item.valueCode"
                  :disabled="item.disabled">
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
            <el-select
              v-else
              clearable
              v-model="bearSearchForm.projectClass"
              placeholder="请选择"
              @change="changeInfo">
              <el-option
                v-for="item in bearProjectCategoryOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.name"
                  :disabled="!showToolTip(item.name, 180)">
                  <span>{{item.name}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集团项目级别:" prop="projectLevel" v-if="searchMoreFlag==='1'">
            <el-select
              v-model="bearSearchForm.projectLevel"
              placeholder="请选择"
              @change="changeInfo"
              clearable>
              <el-option
                v-for="item in bearProjectLevelOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用类别:" prop="projectExpenditureType" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="bearSearchForm.projectExpenditureType"
              class="item"
              effect="dark"
              :content="changeProjectExpenditureType"
              placement="top-start">
              <el-select
                clearable
                v-model="bearSearchForm.projectExpenditureType"
                placeholder="请选择"
                @change="changeInfo">
                <el-option
                  v-for="item in bearFeeCategoryOptions"
                  :key="item.valueCode"
                  :label="item.name"
                  :value="item.valueCode">
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              clearable
              v-model="bearSearchForm.projectExpenditureType"
              placeholder="请选择"
              @change="changeInfo">
              <el-option
                v-for="item in bearFeeCategoryOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划立项时间:" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="bearSearchForm.planApprovalTime"
              popper-class="dateRangePop"
              :content="dateRangeTooltip1"
              placement="top"
              effect="dark"
              :offset="-80"
            >
              <el-date-picker
                class="date-picker"
                v-model.trim="bearSearchForm.planApprovalTime"
                type="datetimerange"
                placeholder="请选择"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00']"
                :clearable="true"
                value-format="timestamp">
              </el-date-picker>
            </el-tooltip>
            <el-date-picker
              v-else
              class="date-picker"
              v-model.trim="bearSearchForm.planApprovalTime"
              type="datetimerange"
              placeholder="请选择"
              range-separator="～"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00']"
              :clearable="true"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划结项时间:" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="bearSearchForm.planFinishTime"
              popper-class="dateRangePop"
              :content="dateRangeTooltip2"
              placement="top"
              effect="dark"
              :offset="-80"
            >
              <el-date-picker
                class="date-picker"
                v-model.trim="bearSearchForm.planFinishTime"
                type="datetimerange"
                placeholder="请选择"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00']"
                :clearable="true"
                value-format="timestamp">
              </el-date-picker>
            </el-tooltip>
            <el-date-picker
              v-else
              class="date-picker"
              v-model.trim="bearSearchForm.planFinishTime"
              type="datetimerange"
              placeholder="请选择"
              range-separator="～"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00']"
              :clearable="true"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目状态:" v-if="searchMoreFlag==='1'">
            <template>
              <SpAdvancedSelect
                :data.sync="bearSearchForm.projectStatus"
                :list="bearProjectStatusOptions"
                key-id="projectStatusContent"
                is-more-type="even"
                value-txt="value"
                label-txt="label"
                placeholder="全部"
                @changeEvent="currentValue">
              </SpAdvancedSelect>
            </template>
          </el-form-item>
          <el-form-item label="项目编码:" v-if="searchMoreFlag==='1'">
            <el-input v-model.trim="bearSearchForm.projectCode" :clearable="true" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="项目名称:" v-if="searchMoreFlag==='1'">
            <el-input v-model.trim="bearSearchForm.projectName" :clearable="true" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="项目经理:" v-if="searchMoreFlag==='1'">
            <el-input
              v-model.trim="bearSearchForm.projectManagerName"
              :clearable="true"
              placeholder="请输入">
            </el-input>
          </el-form-item>
          <div class="form-button">
            <span
              class="el-icon-arrow-down"
              :style="{'padding-top': '6px','text-align': 'center','box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-right':'10px'}"
              @click="tableDataInSearchMore"
              v-if="searchMoreFlag==='0'"
            />
            <span
              class="el-icon-arrow-up"
              :style="{'padding-top': '6px','text-align': 'center','box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-top': '5px','margin-left': '5px','margin-right':searchMoreFlag==='0'?'387px':'10px'}"
              @click="tableDataInSearchLess"
              v-if="searchMoreFlag==='1'"
            />
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search"
              class="primary-button"
              :disabled="loading"
            >查 询</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset" class="normal-btn">重 置</el-button>
            <el-button
              icon="el-icon-download"
              @click="dialogVisible = true"
              class="normal-btn">导 出
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
    <div class="main-warpper">
      <div class="main-head">
      </div>
      <el-table
        v-loading="loading"
        :empty-text="emptyText"
        :data="tableDataOut.list"
        border
        style="overflow: auto;"
        ref="tableSortList"
        @sort-change="changeTableSort">
        <el-table-column label="承担单位项目" align="center">
          <el-table-column type="index" label="序号" width="50px">
          </el-table-column>
          <el-table-column
            label="项目名称"
            min-width="350px"
            property="projectBaseInfo.projectName"
            :show-overflow-tooltip="true"
            sortable="custom"
            class="itemClass">
            <template slot-scope="scope">
              <span style="font-weight: bold" @click="handleClick(scope.row)" class="jump-detail">
                {{scope.row.projectBaseInfo.projectName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="项目编码"
            property="projectBaseInfo.projectCode"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="110px">
          </el-table-column>
          <el-table-column
            label="项目核算编码"
            property="projectBaseInfo.accountingNo"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="130px">
          </el-table-column>
          <el-table-column
            label="牵头承担部门"
            property="projectBaseInfo.undertakeCompany"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="134px">
          </el-table-column>
          <el-table-column
            label="牵头承担单位项目经理"
            property="projectBaseInfo.projectManagerName"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="188px">
          </el-table-column>
          <el-table-column
            label="集团项目级别"
            property="projectBaseInfo.projectLevel"
            :formatter="statusFormatter"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="134px">
          </el-table-column>
          <el-table-column
            label="计划立项时间"
            property="projectBaseInfo.planApprovalTime"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="134px">
          </el-table-column>
          <el-table-column
            label="计划结项时间"
            property="projectBaseInfo.planFinishTime"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="134px">
          </el-table-column>
          <el-table-column
            label="项目状态"
            property="projectBaseInfo.projectDetailsStatus"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="110px">
            <template slot-scope="scope">
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='0'"><ul style="float: left;"><li style="color: gray"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">草稿</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='9'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">计划调整审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='1'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;" >立项审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='2'"><ul style="float: left;"><li style="color: green"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已立项</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='3'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">变更审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='4'"><ul style="float: left;"><li style="color: red"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">终止审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='5'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">结项审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='6'"><ul style="float: left;"><li style="color: red"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已终止</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='7'"><ul style="float: left;"><li style="color: green"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已结项</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='8'"><ul style="float: left;"><li style="color: gray"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已关闭</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='10'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;" >预立项审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.projectDetailsStatus==='11'"><ul style="float: left;"><li style="color: green"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已预立项</span></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="需求单位项目" align="center">
          <el-table-column
            label="项目名称"
            min-width="350px"
            property="projectBaseInfo.demandProjectName"
            sortable="custom"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span style="font-weight: bold" @click="handleClick2(scope.row)" class="jump-detail">
                {{scope.row.projectBaseInfo.demandProjectName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="项目编码"
            property="projectBaseInfo.demandProjectCode"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="110px">
          </el-table-column>
          <el-table-column
            :resizable="false"
            label="项目状态"
            property="projectBaseInfo.demandProjectStatus"
            :show-overflow-tooltip="true"
            sortable="custom"
            min-width="110px">
            <template slot-scope="scope">
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='0'"><ul style="float: left;"><li style="color: gray"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">草稿</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='9'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">计划调整审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='1'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;" >立项审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='2'"><ul style="float: left;"><li style="color: green"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已立项</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='3'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">变更审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='4'"><ul style="float: left;"><li style="color: red"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">终止审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='5'"><ul style="float: left;"><li style="color: orange"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">结项审批中</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='6'"><ul style="float: left;"><li style="color: red"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已终止</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='7'"><ul style="float: left;"><li style="color: green"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已结项</span></span>
              <span v-if="scope.row.projectBaseInfo.demandProjectStatus==='8'"><ul style="float: left;"><li style="color: gray"></li></ul><span style="color:black;margin-left: -5px;line-height:45px;">已关闭</span></span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="tableDataOut.total>0"
        style="text-align: center;margin-top:15px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="tableDataOut.body.pageSize"
        layout="prev, pager, next,sizes, jumper"
        :total="tableDataOut.total">
      </el-pagination>
    </div>
    <el-dialog
      v-dialogDrag
      title="配置导出字段"
      :visible.sync="dialogVisible"
      width="690px"
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
        class="progress">
      </el-progress>
    </div>
  </div>
</template>

<script>
import API from '../../../../../serve/API_projectSearch'
import projectAPI from '@/serve/API_groupPlanProject'
import { formatDate } from '../../../../../common/common'
import { getStore } from '@/store'
import axios from 'axios'

import { isShowToolTip } from '@/utils/common.js'

export default {
  name: 'tabComponent',
  data () {
    return {
      block: [
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
      percentage: 0,
      searchMoreFlag: '1', //搜索更多 0隐藏 1 显示更多
      emptyText: '请选择查询条件',
      currentPage: 1,
      filterText: '',
      bearSearchForm: {
        field: '', //排序字段
        sortWay: '', //排序类型
        projectYear: '', //年份
        demandCompany: '', //需求单位
        undertakeCompany: '', //承担单位
        projectClass: '', //集团项目类别
        projectLevel: '', //集团项目级别
        projectExpenditureType: '', //费用类别
        planApprovalTime: '', //计划立项时间
        planFinishTime: '', //计划结项时间
        projectStatus: [], //项目状态
        projectCode: '', //项目编码
        projectName: '', //项目名称
        projectManagerName: '' //项目经理
      },
      loading: false,
      projectStatusContent: '',
      projectExpenditureTypeContent: '', //费用类别选中时候显示的内容
      projectClassContent: '',
      demandCompanyContent: '', //需求单位下拉菜单选中显示内容
      bearUnitOptions: [], //需求单位 options
      bearBearUnitOptions: [], //承担单位 options
      bearProjectCategoryOptions: [], //集团项目类别 options
      bearProjectLevelOptions: [], //集团项目级别 options
      bearFeeCategoryOptions: [], //费用类别 options
      bearProjectStatusOptions: [{ value: '0', label: '草稿' },
        {
          value: '10',
          label: '预立项审批中'
        },
        {
          value: '11',
          label: '已预立项'
        },
        { value: '1', label: '立项审批中' }, {
          value: '2',
          label: '已立项'
        }, { value: '3', label: '变更审批中' }, { value: '4', label: '终止审批中' }, { value: '5', label: '结项审批中' }, {
          value: '6',
          label: '已终止'
        }, { value: '7', label: '已结项' }, { value: '8', label: '已关闭' }], //项目状态options
      tableDataOut: { //承担单位外层表格数据
        body: { pageSize: 10, pageNum: 1 },
        total: 0,
        list: []
      },
      showData: [], //回显
      defaultProps: {
        children: 'child',
        label: 'orgName',
        isLeaf: 'leaf'
      },
      baseUrl: getStore().getters['CONFIG/baseUrl'],
      fData: [],
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      userInfo: getStore().getters['USERENTITY/userInfo'],
      isSearched: false //是否已重置和初始页面
    }
  },
  computed: {
    dateRangeTooltip1 () {
      let val = ''
      if (this.bearSearchForm.planApprovalTime) {
        val = formatDate(this.bearSearchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') +
          '～' + formatDate(this.bearSearchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss')
      }
      return val
    },
    dateRangeTooltip2 () {
      let val = ''
      if (this.bearSearchForm.planFinishTime) {
        val = formatDate(this.bearSearchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') +
          '～' + formatDate(this.bearSearchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss')
      }
      return val
    },
    changeProjectExpenditureType () {
      let val = ''
      if (this.bearSearchForm.projectExpenditureType) {
        this.bearFeeCategoryOptions.forEach(item => {
          if (this.bearSearchForm.projectExpenditureType === item.valueCode) {
            val = item.name
          }
        })
      }
      return val
    },
    changeDemandCompany () {
      let val = ''
      if (this.bearSearchForm.demandCompany) {
        this.bearUnitOptions.forEach(item => {
          if (this.bearSearchForm.demandCompany === item.orgCode) {
            val = item.orgName
          }
        })
      }
      return val
    },
    changeUndertakeCompany () {
      let val = ''
      if (this.bearSearchForm.undertakeCompany) {
        this.bearBearUnitOptions.forEach(item => {
          if (this.bearSearchForm.undertakeCompany === item.orgCode) {
            val = item.orgName
          }
        })
      }
      return val
    },
    changeProjectClass () {
      let val = ''
      if (this.bearSearchForm.projectClass) {
        this.bearProjectCategoryOptions.forEach(item => {
          if (this.bearSearchForm.projectClass === item.valueCode) {
            val = item.name
          }
        })
      }
      return val
    },
    changeProjectStatus () {
      let val = ''
      if (this.bearSearchForm.projectStatus) {
        this.bearSearchForm.projectStatus.forEach(element => {
          this.bearProjectStatusOptions.map(item => {
            if (item.value === element) {
              val = val + item.label + ' '
            }
          })
        })
      }
      return val
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.getSearchData()
    this.getCode()
    this.intercept()
  },
  methods: {
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    // 字段排序
    changeTableSort (column) {
      //获取字段名称和排序类型
      let fieldName = column.prop
      if (fieldName !== '' && fieldName !== null) {
        fieldName = fieldName.replace('projectBaseInfo.', '')
        this.bearSearchForm.field = fieldName
      }
      let sortWay = column.order
      if (sortWay !== '' && sortWay !== null) {
        sortWay = sortWay.replace('ending', '')
        this.bearSearchForm.sortWay = sortWay
      } else {
        this.bearSearchForm.field = ''
        this.bearSearchForm.sortWay = ''
      }
      if (this.isSearched) {
        this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
      }
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
    exportFile () {
      let block = {
        projectBaseInfo: true,
        projectAttribute: false,
        projectTeam: false,
        costBudget: false,
        projectAchievement: false,
        milestoneInfoBase: false
      }
      let attribute = ''
      this.checkList.forEach(item => {
        block[item] = true
      })
      if (!this.checkList1.length) {
        block.projectAttribute = false
      }
      this.checkList1.forEach(item => {
        this.attribute.forEach(ite => {
          if (item === ite.fieldKey) {
            attribute += ite.fieldKey + '-' + ite.fieldTitle + ','
          }
        })
      })
      let param = {
        projectYear: this.bearSearchForm.projectYear,
        demandCompany: this.bearSearchForm.demandCompany,
        undertakeCompany: this.bearSearchForm.undertakeCompany,
        projectClass: this.bearSearchForm.projectClass,
        projectLevel: this.bearSearchForm.projectLevel,
        projectExpenditureType: this.bearSearchForm.projectExpenditureType,
        beginPlanApprovalTime: this.bearSearchForm.planApprovalTime ? formatDate(this.bearSearchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanApprovalTime: this.bearSearchForm.planApprovalTime ? formatDate(this.bearSearchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        beginPlanFinishTime: this.bearSearchForm.planFinishTime ? formatDate(this.bearSearchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanFinishTime: this.bearSearchForm.planFinishTime ? formatDate(this.bearSearchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        projectCode: this.bearSearchForm.projectCode,
        projectName: this.bearSearchForm.projectName,
        projectManagerName: this.bearSearchForm.projectManagerName
      }
      if (this.bearSearchForm.projectStatus) {
        param.projectStatus = this.bearSearchForm.projectStatus.join(',')
      }
      let url = '?request=group&projectYear=' + param.projectYear + '&demandCompany=' + param.demandCompany +
          '&undertakeCompany=' + param.undertakeCompany + '&projectClass=' + param.projectClass +
          '&projectLevel=' + param.projectLevel + '&projectExpenditureType=' + param.projectExpenditureType + '&beginPlanApprovalTime=' + param.beginPlanApprovalTime +
          '&endPlanApprovalTime=' + param.endPlanApprovalTime + '&beginPlanFinishTime=' + param.beginPlanFinishTime + '&endPlanFinishTime=' + param.endPlanFinishTime +
          '&projectStatus=' + param.projectStatus +
          '&projectCode=' + param.projectCode + '&projectName=' + param.projectName + '&projectManagerName=' + param.projectManagerName + '&projectBaseInfo=' + block.projectBaseInfo +
          '&projectAttribute=' + block.projectAttribute + '&projectTeam=' + block.projectTeam + '&costBudget=' + block.costBudget + '&projectAchievement=' + block.projectAchievement +
          '&milestoneInfoBase=' + block.milestoneInfoBase + '&acthon=' + attribute.substr(0, attribute.length - 1)
      this.popContainer = true
      this.controlProgress()
      axios.request({
        url: this.baseUrl + '/rms/project/export/v1/exportUndertakeProjectQuery' + encodeURI(url),
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        },
        responseType: 'blob'
      })
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
    intercept () {
      this.projectStatusContent = ''
      this.bearSearchForm.projectStatus.forEach(element => {
        this.bearProjectStatusOptions.map(item => {
          if (item.value === element) {
            this.projectStatusContent = this.projectStatusContent + item.label + ' '
          }
        })
      })
    },
    currentValue (val) {
      this.bearSearchForm.projectStatus = val
      this.intercept()
    },
    statusFormatter (val) { //集团项目级别
      let status = ''
      this.bearProjectLevelOptions.some(item => {
        if (val.projectBaseInfo.projectLevel === item.valueCode) {
          status = item.name
        }
      })
      return status
    },
    itemClass (row) {
      return 'hover'
    },
    handleClick (row) { //点击项目名称进入项目详情
      // 判断是否具有权限
      projectAPI.checkUserProjectPermission({ projectCode: row.projectBaseInfo.projectCode, permissionCode: '01' })
        .then(res => {
          if (res) {
            let { href } = this.$router.resolve({
              path: '/groupPlan/projectDetail/' + row.projectBaseInfo.projectCode + '?developPackage=' + row.projectBaseInfo.developPackage + '&projectCategory=u'
            })
            // 打开新的窗口
            let $window = window.open(href, '_blank')
            // if (this.timer[row.projectBaseInfo.projectCode]) {
            //   window.clearInterval(this.timer[row.projectBaseInfo.projectCode])
            // }
            // this.timer[row.projectBaseInfo.projectCode] = setInterval(() => {
            //   if ($window && $window.closed) {
            //     if (this.timer[row.projectBaseInfo.projectCode]) {
            //       window.clearInterval(this.timer[row.projectBaseInfo.projectCode])
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
    },
    handleClick2 (row) { //点击项目名称进入项目详情
      // 判断是否具有权限
      projectAPI.checkUserProjectPermission({ projectCode: row.projectBaseInfo.demandProjectCode, permissionCode: '01' })
        .then(res => {
          if (res) {
            let { href } = this.$router.resolve({
              path: '/groupPlan/projectDetail/' + row.projectBaseInfo.demandProjectCode + '?developPackage=' + row.projectBaseInfo.developPackage + '&projectCategory=d'
            })
            // 打开新的窗口
            let $window = window.open(href, '_blank')
            // if (this.timer[row.projectBaseInfo.demandProjectCode]) {
            //   window.clearInterval(this.timer[row.projectBaseInfo.demandProjectCode])
            // }
            // this.timer[row.projectBaseInfo.demandProjectCode] = setInterval(() => {
            //   if ($window && $window.closed) {
            //     if (this.timer[row.projectBaseInfo.demandProjectCode]) {
            //       window.clearInterval(this.timer[row.projectBaseInfo.demandProjectCode])
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
    },
    show () {
      this.$nextTick(() => {
        this.$refs.popover1.popperElm.style.top = `${Number(this.$refs.popover1.popperElm.style.top.substring(0, this.$refs.popover1.popperElm.style.top.length - 2)) + 15}px`
        var dis = Array.from(document.querySelectorAll('.el-tree-node__content .el-checkbox .is-disabled'))
        dis.forEach((item) => {
          item.style.display = 'none'
        })
      })
    },
    nodeOpen (data, resolve) {
      if (data.data.orgCode) {
        this.getChooseDepartment(data.data.orgCode, resolve, data)
      }
    },
    templateClick (data, checked, node) {
      this.checkedId = data.orgCode
      this.$refs.tree.setCheckedKeys([data.orgCode])
    },
    getCode (id) {
      let sendId = id || this.userInfo.userAuth.orgCode
      API.getOrgCodeByCompanyCode(sendId)
        .then(res => {
          if (res.org.orgFormCode === '1') {
            this.fData = [res.org]
            this.getChooseDepartment(sendId)
          } else {
            this.getCode(res.org.parentOrgCode)
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
                }
              })
              resolve(res)
              data.data.child = res
            } else {
              this.fData[0].child = res
            }
          } else if (resolve) {
            resolve([])
          }
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
    tableDataInSearchMore () {
      this.searchMoreFlag = '1'
    },
    tableDataInSearchLess () {
      this.searchMoreFlag = '0'
    },
    filterNode (value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    // 查询数据字典
    getSearchData () {
      //获取属性信息的字段
      let data = { companyCode: this.userInfo.userAuth.companyCode, isAll: true, projectCategory: 'PC-UNDERTAKE-UNIT', businessObject: 'BO-OVERALL' }
      API.findFieldByCompanyAndType(data)
        .then(res => {
          res.forEach((item) => {
            if (item.fieldTitle !== '所属关键核心技术攻关方向') {
              if (item.fieldKey === 'keyResearchField') {
                this.attribute.push({
                  fieldKey: 'keyResearchField',
                  fieldTitle: '所属关键技术攻关领域'
                })
              } else {
                item.fieldTitle = item.fieldTitle.replace('<br>', '')
                this.attribute.push(item)
                /* if (item.fieldKey === 'externalProjectUnitRdManager') {
                  this.attribute.push({
                    fieldKey: 'externalProjectUnitRdManager',
                    fieldTitle: '外部委托研发单位负责人'
                  })
                } else {
                  this.attribute.push(item)
                } */
              }
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '属性信息字段获取失败')
        })
        // 批量获取集团项目类别、集团项目级别、费用类别
      let params = {
        codes: 'ITEM_CATEGORY,CO-PROJECT-LEVEL,PROJECT-EXPENDITURE-TYPE'
      }
      API.dictValByCodes(params)
        .then(res => {
          res.forEach(dicItem => {
            switch (dicItem.code) {
              case 'ITEM_CATEGORY':
                this.bearProjectCategoryOptions = dicItem.dictionarys.filter(dic => dic.valueCode !== 'IC_D')
                break
              case 'CO-PROJECT-LEVEL':
                this.bearProjectLevelOptions = dicItem.dictionarys
                break
              case 'PROJECT-EXPENDITURE-TYPE':
                this.bearFeeCategoryOptions = dicItem.dictionarys
                break
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
      // 需求单位
      axios.request({
        url: this.baseUrl + '/rms/basic/ext/employerUndertaker/v1/3/v1/employerUndertakersByOrgCode?orgType=1',
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      })
        .then((res) => {
          this.bearUnitOptions = res.data.body
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
      // 承担单位
      axios.request({
        url: this.baseUrl + '/rms/basic/ext/employerUndertaker/v1/3/v1/employerUndertakersByOrgCode?orgType=2',
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      })
        .then((res) => {
          this.bearBearUnitOptions = res.data.body
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    // 获取部门数据
    //查询
    search () {
      this.tableDataOut.body.pageNum = 1
      this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
    },
    // 修改当前显示多少条数据
    handleSizeChange (val) {
      this.tableDataOut.body.pageSize = val
      this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
    },
    // 修改显示第几页
    handleCurrentChange (val) {
      this.tableDataOut.body.pageNum = val
      this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
    },
    reset () {
      this.bearSearchForm.projectYear = ''
      this.bearSearchForm.demandCompany = ''
      this.bearSearchForm.undertakeCompany = ''
      this.bearSearchForm.projectClass = ''
      this.bearSearchForm.projectLevel = ''
      this.bearSearchForm.projectExpenditureType = ''
      this.bearSearchForm.planApprovalTime = ''
      this.bearSearchForm.planFinishTime = ''
      this.bearSearchForm.projectStatus = []
      this.bearSearchForm.projectCode = ''
      this.bearSearchForm.projectName = ''
      this.bearSearchForm.projectManagerName = ''
      // 排序重置
      this.bearSearchForm.field = ''
      this.bearSearchForm.sortWay = ''
      this.$refs.tableSortList.clearSort()
      this.isSearched = false // 排序重置
      this.emptyText = '请输入查询条件'
      this.tableDataOut.list = []
      this.tableDataOut.total = 0
      this.tableDataOut.body.pageNum = 1
      this.tableDataOut.body.pageSize = 10
    },
    //有信息发生修改
    changeInfo (value) {
      this.$emit('changeValue')
    },
    getList (pageNum, pageSize) {
      this.tableDataOut.body.pageNum = pageNum
      this.tableDataOut.body.pageSize = pageSize
      this.loading = true
      this.currentPage = pageNum
      let param = {
        pageNum: pageNum,
        pageSize: pageSize,
        projectYear: this.bearSearchForm.projectYear,
        demandCompany: this.bearSearchForm.demandCompany,
        undertakeCompany: this.bearSearchForm.undertakeCompany,
        projectClass: this.bearSearchForm.projectClass,
        projectLevel: this.bearSearchForm.projectLevel,
        projectExpenditureType: this.bearSearchForm.projectExpenditureType,
        beginPlanApprovalTime: this.bearSearchForm.planApprovalTime ? formatDate(this.bearSearchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanApprovalTime: this.bearSearchForm.planApprovalTime ? formatDate(this.bearSearchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        beginPlanFinishTime: this.bearSearchForm.planFinishTime ? formatDate(this.bearSearchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanFinishTime: this.bearSearchForm.planFinishTime ? formatDate(this.bearSearchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        projectCode: this.bearSearchForm.projectCode,
        projectName: this.bearSearchForm.projectName,
        field: this.bearSearchForm.field,
        sortWay: this.bearSearchForm.sortWay,
        projectManagerName: this.bearSearchForm.projectManagerName
      }
      if (this.bearSearchForm.projectStatus) {
        param.projectStatus = this.bearSearchForm.projectStatus.join(',')
      }
      API.getGroupUndertakeSearch(param)
        .then(res => {
          this.loading = false
          if (res.total > 0) {
            this.tableDataOut.list = res.projectInfos
            for (let i = 0; i < res.projectInfos.length; i++) {
              if (this.tableDataOut.list[i].undertakeProjectCompanyInfo !== null) {
                this.tableDataOut.list[i].projectBaseInfo.undertakeCompany = this.tableDataOut.list[i].undertakeProjectCompanyInfo.companyName
              }
              this.tableDataOut.list[i].projectBaseInfo.planApprovalTime = formatDate(this.tableDataOut.list[i].projectBaseInfo.planApprovalTime, 'YYYY-MM-DD')

              this.tableDataOut.list[i].projectBaseInfo.planFinishTime = formatDate(this.tableDataOut.list[i].projectBaseInfo.planFinishTime, 'YYYY-MM-DD')

              if (this.tableDataOut.list[i].projectTeam !== null) {
                this.tableDataOut.list[i].projectBaseInfo.projectManagerName = this.tableDataOut.list[i].projectTeam.userName
              } else {
                this.tableDataOut.list[i].projectBaseInfo.projectManagerName = null
              }
              if (this.tableDataOut.list[i].demandProjectBaseInfo !== null) {
                this.tableDataOut.list[i].projectBaseInfo.demandProjectName = this.tableDataOut.list[i].demandProjectBaseInfo.projectName
                this.tableDataOut.list[i].projectBaseInfo.demandProjectCode = this.tableDataOut.list[i].demandProjectBaseInfo.projectCode
                this.tableDataOut.list[i].projectBaseInfo.demandProjectStatus = this.tableDataOut.list[i].demandProjectBaseInfo.projectDetailsStatus
              }
            }
            this.tableDataOut.total = parseInt(res.total)
            this.isSearched = true
          } else if (res.projectInfos.length === 0) {
            this.tableDataOut.list = []
            this.tableDataOut.total = 0
            this.emptyText = '暂无数据'
            this.isSearched = false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .search-content {
    background: #fff;
    margin-top: -10px;
    font-size: 14px;

    .el-form {
      margin: 10px 20px;
      padding: 10px 0;
    }

    /deep/ .el-form-item .el-input__inner {
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
        color: #0b82ff;
        border: 1px solid rgba(11, 130, 255, 0.5);
      }
    }

    .showBox {
      -webkit-appearance: none;
      background-color: #ffffff;
      background-image: none;
      border-radius: 2px;
      border: 1px solid #e5e5e5;
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

      .boxPlaceholder {
        margin: 0px;
        color: #9397aa;
        font-size: 14px;
        line-height: 29px;
      }
    }

    .noClick {
      background-color: #f4f4f4;
      border-color: #e5e5e5;
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

    .iBg {
      color: #999;
      margin-right: 8px;
    }

    .treePop {
      min-width: 300px !important;
      height: 200px;
      overflow-y: auto;
    }

    /deep/ .el-form-item__label {
      word-break: break-all;
    }

    .trees {
      width: 140px;
      max-width: 140px;
      display: inline-block;
      height: 30px;

      /deep/ .el-tree__empty-block {
        height: 30px;
        min-height: 30px;
        text-align: left;
      }

      /deep/ .el-tree__empty-text {
        position: inherit;
        left: 0;
        top: 0;
        text-align: left;
      }
    }
  }
  /deep/ .el-table th>.cell {
    overflow: visible;
  }
  // /deep/ .el-table th {
  //   border-right: 0px;
  // }

  // /deep/ .el-table td {
  //   border-right: 0px;
  // }

  .main-warpper {
    background: white;
    padding: 20px 30px 30px;

    .main-header {
      margin-bottom: 20px;
      overflow: hidden;
      float: right;
    }

    .jump-detail {
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      @include color();
    }

    /deep/ .el-table__row{
      height: 47px;
      line-height: 47px;
      td{
        padding: 0;
        div{
          line-height: 1;
        }
      }
    }

    /deep/ .sp-table .padding-col {
      padding-left: 0px;
    }
    /deep/ .el-table__body-wrapper.is-scrolling-none{
      height: calc(100% - 130px);
      overflow: auto;
    }
    /deep/ .el-table__body-wrapper{
      overflow: auto;
    }
    // /deep/ .el-table--border td{
    //   border-right: 0px;
    // }
    // /deep/ .el-table--border th{
    //   border-right: 0px;
    // }

    /deep/ .el-table:before {
      height: 0px;
    }
    /deep/ .el-table--group:after{
      height: 0px;
    }
    // /deep/ .el-table--group {
    //   border: 0px;
    // }

    /deep/ .hover {
      &:hover {
        color: #0b82ff;
      }

      cursor: pointer;
    }
  }

  .project-list {
    background-color: #fff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    padding: 10px 25px 20px;
    height:calc(100vh - 400px);
    max-height:calc(100vh - 400px);
    z-index: -100;
    button {
      font-size: 14px;
      border-radius: 2px;
      width: 85px;
      height: 30px;
    }

    .table-head {
      padding: 15px 0px;
      line-height: 40px;
      margin-bottom: 15px;

      .el-button {
        width: 98px;
        height: 30px;
        border-radius: 2px;
      }
    }
  }
  li {
    list-style: inherit;
  }
  ul {
    padding-inline-start: 12px;
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
      width: 210px;
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
// 下拉超出省略号显示
.el-select-dropdown__item {
  /deep/ span {
    box-sizing: border-box;
    display: inline-block;
    max-width: 180px!important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style lang="scss">
  .dateClass {
    width: 220px !important;
    .el-picker-panel__content {
      width: 220px !important;
    }
  }
</style>
