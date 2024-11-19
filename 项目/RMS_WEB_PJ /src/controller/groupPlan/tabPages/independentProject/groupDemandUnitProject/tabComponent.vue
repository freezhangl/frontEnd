<template>
  <div class="content">
    <div class="search-content">
      <el-form
        :model="demandSearchForm"
        label-width="130px"
        ref="demandSearchForm">
        <div>
          <el-form-item label="年份:" prop="projectYear" :label-width="searchMoreFlag=='0'?'55px':'130px'">
            <el-date-picker
              v-model="demandSearchForm.projectYear"
              type="year"
              popper-class="dateClass"
              value-format="yyyy"
              placeholder="选择年份"
              :clearable="true"
              :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="需求单位:" prop="demandCompany" :label-width="searchMoreFlag=='0'?'90px':'130px'">
            <el-tooltip
              v-if="demandSearchForm.demandCompany"
              class="item"
              effect="dark"
              :content="changeDemandCompany"
              placement="top-start">
              <el-select
                :disabled="demandDisable"
                class="demandItemOne"
                clearable
                @clear="remove()"
                filterable
                placeholder="请选择"
                v-model="demandSearchForm.demandCompany"
                @change="changeInfo">
                <el-option
                  v-for="item in demandUnitOptions"
                  :key="item.orgCode"
                  :label="item.orgName"
                  :value="item.orgCode"
                  :disabled="item.disabled">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.orgName"
                    :disabled="!showToolTip(item.orgName, 80)">
                    <span class="showToolTipSpanOne">{{item.orgName}}</span>
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
              v-model="demandSearchForm.demandCompany"
              @change="changeInfo">
              <el-option
                v-for="item in demandUnitOptions"
                :key="item.orgCode"
                :label="item.orgName"
                :value="item.orgCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.orgName"
                  :disabled="!showToolTip(item.orgName, 80)">
                  <span class="showToolTipSpanOne">{{item.orgName}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
            <el-tooltip
              v-if="demandSearchForm.demandCompanyType"
              class="item"
              effect="dark"
              :content="changeDemandCompanyType"
              placement="top-start">
              <el-select
                style="margin-left: 10px;"
                class="demandItemTwo"
                placeholder="全部"
                clearable
                v-model="demandSearchForm.demandCompanyType"
                @change="changeInfo">
                <el-option
                  v-for="item in demandUnitTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              clearable
              style="margin-left: 10px;"
              class="demandItemTwo"
              placeholder="全部"
              v-model="demandSearchForm.demandCompanyType"
              @change="changeInfo">
              <el-option
                v-for="item in demandUnitTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="承担单位:" prop="undertakeCompany" :label-width="searchMoreFlag=='0'?'90px':'130px'">
            <el-tooltip
              v-if="demandSearchForm.undertakeCompany"
              class="item"
              effect="dark"
              :content="changeUndertakeCompany"
              placement="top-start">
              <el-select
                :disabled="isAble"
                class="demandItemOne"
                clearable
                @clear="removeUndertakeCompany()"
                filterable
                placeholder="请选择"
                v-model="demandSearchForm.undertakeCompany"
                @change="changeInfo">
                <el-option
                  v-for="item in demandBearUnitOptions"
                  :key="item.orgCode"
                  :label="item.orgName"
                  :value="item.orgCode"
                  :disabled="item.disabled">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.orgName"
                    :disabled="!showToolTip(item.orgName, 80)">
                    <span class="showToolTipSpanOne">{{item.orgName}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              :disabled="isAble"
              class="demandItemOne"
              clearable
              filterable
              placeholder="请选择"
              v-model="demandSearchForm.undertakeCompany"
              @change="changeInfo">
              <el-option
                v-for="item in demandBearUnitOptions"
                :key="item.orgCode"
                :label="item.orgName"
                :value="item.orgCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.orgName"
                  :disabled="!showToolTip(item.orgName, 80)">
                  <span class="showToolTipSpanOne">{{item.orgName}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
            <el-tooltip
              v-if="demandSearchForm.undertakeCompanyType"
              class="item"
              effect="dark"
              :content="changeUndertakeCompanyType"
              placement="top-start">
              <el-select
                clearable
                style="margin-left: 10px;"
                class="demandItemTwo"
                placeholder="全部"
                v-model="demandSearchForm.undertakeCompanyType"
                @change="changeInfo">
                <el-option
                  v-for="item in demandBearUnitTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              clearable
              style="margin-left: 10px;"
              class="demandItemTwo"
              placeholder="全部"
              v-model="demandSearchForm.undertakeCompanyType"
              @change="changeInfo">
              <el-option
                v-for="item in demandBearUnitTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集团项目类别:" prop="projectClass" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="demandSearchForm.projectClass"
              class="item"
              effect="dark"
              :content="changeProjectClass"
              placement="top-start">
              <el-select
                clearable
                v-model="demandSearchForm.projectClass"
                placeholder="请选择"
                @change="changeInfo">
                <el-option
                  v-for="item in demandProjectCategoryOptions"
                  :key="item.valueCode"
                  :label="item.name"
                  :value="item.valueCode"
                  :disabled="item.disabled">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="item.name"
                    :disabled="!showToolTip(item.name, 180)">
                    <span class="showToolTipSpan">{{item.name}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              clearable
              v-else
              v-model="demandSearchForm.projectClass"
              placeholder="请选择"
              @change="changeInfo">
              <el-option
                v-for="item in demandProjectCategoryOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode"
                :disabled="item.disabled">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  :content="item.name"
                  :disabled="!showToolTip(item.name, 180)">
                  <span class="showToolTipSpan">{{item.name}}</span>
                </el-tooltip>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集团项目级别:" prop="projectLevel" v-if="searchMoreFlag==='1'">
            <el-select
              v-model="demandSearchForm.projectLevel"
              clearable
              placeholder="请选择"
              @change="changeInfo">
              <el-option
                v-for="item in demandProjectLevelOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用类别:" prop="projectExpenditureType" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="demandSearchForm.projectExpenditureType"
              class="item"
              effect="dark"
              :content="changeProjectExpenditureType"
              placement="top-start">
              <el-select
                clearable
                v-model="demandSearchForm.projectExpenditureType"
                placeholder="请选择"
                @change="changeInfo">
                <el-option
                  v-for="item in demandFeeCategoryOptions"
                  :key="item.valueCode"
                  :label="item.name"
                  :value="item.valueCode">
                </el-option>
              </el-select>
            </el-tooltip>
            <el-select
              v-else
              clearable
              v-model="demandSearchForm.projectExpenditureType"
              placeholder="请选择"
              @change="changeInfo">
              <el-option
                v-for="item in demandFeeCategoryOptions"
                :key="item.valueCode"
                :label="item.name"
                :value="item.valueCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划立项时间:" v-if="searchMoreFlag==='1'">
            <el-tooltip
              v-if="demandSearchForm.planApprovalTime"
              popper-class="dateRangePop"
              :content="dateRangeTooltip1"
              placement="top"
              effect="dark"
              :offset="-80">
              <el-date-picker
                class="date-picker"
                v-model.trim="demandSearchForm.planApprovalTime"
                type="datetimerange"
                placeholder="请选择"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00']"
                :clearable="true"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-tooltip>
            <el-date-picker
              v-else
              class="date-picker"
              v-model.trim="demandSearchForm.planApprovalTime"
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
              v-if="demandSearchForm.planFinishTime"
              popper-class="dateRangePop"
              :content="dateRangeTooltip2"
              placement="top"
              effect="dark"
              :offset="-80">
              <el-date-picker
                class="date-picker"
                v-model.trim="demandSearchForm.planFinishTime"
                type="datetimerange"
                placeholder="请选择"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00']"
                :clearable="true"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-tooltip>
            <el-date-picker
              v-else
              class="date-picker"
              v-model.trim="demandSearchForm.planFinishTime"
              type="datetimerange"
              placeholder="请选择"
              range-separator="～"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00']"
              :clearable="true"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目状态:" v-if="searchMoreFlag==='1'">
            <template>
              <SpAdvancedSelect
                :data.sync="demandSearchForm.projectStatus"
                :list="demandProjectStatusOptions"
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
            <el-input
              v-model.trim="demandSearchForm.projectCode"
              :clearable="true"
              placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="项目名称:" v-if="searchMoreFlag==='1'">
            <el-input
              v-model.trim="demandSearchForm.projectName"
              :clearable="true"
              placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="项目经理:" v-if="searchMoreFlag==='1'">
            <el-input
              v-model.trim="demandSearchForm.projectManagerName"
              :clearable="true"
              placeholder="请输入">
            </el-input>
          </el-form-item>
          <div class="form-button">
            <span
              class="el-icon-arrow-down"
              :style="{'padding-top': '6px','text-align': 'center','box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-right':'10px'}"
              @click="tableDataInSearchMore"
              v-if="searchMoreFlag==='0'"/>
            <span
              class="el-icon-arrow-up"
              :style="{'padding-top': '6px','text-align': 'center','box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-top': '5px','margin-left': '5px','margin-right':searchMoreFlag==='0'?'387px':'10px'}"
              @click="tableDataInSearchLess"
              v-if="searchMoreFlag==='1'"/>
            <el-button
              :disabled="loading"
              type="primary"
              icon="el-icon-search"
              @click="search"
              class="primary-button">查 询
            </el-button>
            <el-button
              icon="el-icon-refresh-left"
              @click="resetTable"
              class="normal-btn">重 置
            </el-button>
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
      <div class="main-header">
      </div>
      <el-table
        v-loading="loading"
        :data="tableDataOut.list"
        :empty-text="emptyText"
        ref="tableSortList"
        border
        style="overflow: auto;"
        @sort-change="changeTableSort">
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
          label="牵头需求单位"
          property="projectBaseInfo.demandCompany"
          :show-overflow-tooltip="true"
          sortable="custom"
          min-width="130px">
        </el-table-column>
        <el-table-column
          label="牵头承担单位"
          property="projectBaseInfo.undertakeCompany"
          :show-overflow-tooltip="true"
          sortable="custom"
          min-width="130px">
        </el-table-column>
        <el-table-column
          label="集团项目类别"
          property="projectBaseInfo.projectClass"
          :show-overflow-tooltip="true"
          :formatter="categoryFormatter"
          sortable="custom"
          min-width="130px">
        </el-table-column>
        <el-table-column
          label="集团项目级别"
          property="projectBaseInfo.projectLevel"
          :formatter="statusFormatter"
          :show-overflow-tooltip="true"
          sortable="custom"
          min-width="130px">
        </el-table-column>
        <el-table-column
          label="费用类型"
          property="projectBaseInfo.projectExpenditureType"
          :show-overflow-tooltip="true"
          :formatter="typeFormatter"
          sortable="custom"
          min-width="110px">
        </el-table-column>
        <el-table-column
          label="计划立项时间"
          property="projectBaseInfo.planApprovalTime"
          :show-overflow-tooltip="true"
          sortable="custom"
          min-width="130px">
        </el-table-column>
        <el-table-column
          label="计划结项时间"
          property="projectBaseInfo.planFinishTime"
          :show-overflow-tooltip="true"
          sortable="custom"
          min-width="130px">
        </el-table-column>
        <el-table-column
          label="牵头承担单位项目经理"
          property="projectBaseInfo.projectManagerName"
          :show-overflow-tooltip="true"
          sortable="custom"
          min-width="188px">
        </el-table-column>
        <el-table-column
          :resizable="false"
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
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        v-if="tableDataOut.total>0"
        style="text-align: center;margin-top: 15px;"
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
        }, {
          label: 'entrustLetter',
          value: '委托函'
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
      currentPage: 1,
      isAble: false, //判断承担单位是否被禁用
      demandDisable: false, //判断需求单位是否被禁用
      flag: null, //标识作用
      isChange: '1', //传值给后端用户权限一判断
      compareCode: '', //用于对标权限的记录orgCode
      searchMoreFlag: '1', //搜索更多 0隐藏 1 显示更多
      emptyText: '请输入查询条件',
      demandSearchForm: {
        field: '', //排序字段
        sortWay: '', //排序类型
        projectYear: '', //年份
        demandCompany: '', //需求单位
        demandCompanyType: '', //需求单位类型 牵头or配合
        undertakeCompany: '', //承担单位
        undertakeCompanyType: '', //承担单位类型 牵头or配合
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
      orgName: '', //用户保存权限判断的所属公司名称
      demandCompanyCode: '', //保存需求单位的code
      undertakeCompanyCode: '', //全局变量 用于储存权限一的时候 承担单位的code
      loading: false,
      companyCode: '', //用户登录默认不是集团公司的话 这个就是当前登录的公司编码
      projectStatusContent: '',
      projectExpenditureTypeContent: '', //费用类别选中时候显示的内容
      projectClassContent: '',
      demandCompanyTypeContent: '',
      undertakeCompanyTypeContent: '',
      demandUnitOptions: [], //需求单位 options
      demandUnitTypeOptions: [{ value: 1, label: '牵头' }, { value: 0, label: '配合' }], //需求单位类型 options
      demandBearUnitOptions: [], //承担单位 options
      demandBearUnitTypeOptions: [{ value: 1, label: '牵头' }, { value: 0, label: '配合' }], //承担单位类型 options
      demandProjectCategoryOptions: [], //集团项目类别 options
      demandProjectLevelOptions: [], //集团项目级别 options
      demandFeeCategoryOptions: [], //费用类别 options
      demandProjectStatusOptions: [{ value: '0', label: '草稿' }, { value: '9', label: '计划调整审批中' },
        { value: '1', label: '立项审批中' }, {
          value: '2',
          label: '已立项'
        }, { value: '3', label: '变更审批中' }, { value: '4', label: '终止审批中' }, { value: '5', label: '结项审批中' }, {
          value: '6',
          label: '已终止'
        }, { value: '7', label: '已结项' }, { value: '8', label: '已关闭' }], //项目状态options
      tableDataOut: { //需求单位外层表格数据
        body: { pageSize: 10, pageNum: 1 },
        total: 0,
        list: []
      },
      Authorization: getStore().getters['USERENTITY/authHeaher'].Authorization,
      userInfo: getStore().getters['USERENTITY/userInfo'],
      isSearched: false, //是否已重置和初始页面
      baseUrl: getStore().getters['CONFIG/baseUrl']
    }
  },
  computed: {
    dateRangeTooltip1 () {
      let val = ''
      if (this.demandSearchForm.planApprovalTime) {
        val = formatDate(this.demandSearchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') +
          '～' + formatDate(this.demandSearchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss')
      }
      return val
    },
    dateRangeTooltip2 () {
      let val = ''
      if (this.demandSearchForm.planFinishTime) {
        val = formatDate(this.demandSearchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') +
          '～' + formatDate(this.demandSearchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss')
      }
      return val
    },
    changeProjectExpenditureType () {
      let val = ''
      if (this.demandSearchForm.projectExpenditureType) {
        this.demandFeeCategoryOptions.forEach(item => {
          if (this.demandSearchForm.projectExpenditureType === item.valueCode) {
            val = item.name
          }
        })
      }
      return val
    },
    changeProjectStatus () {
      let val = ''
      if (this.demandSearchForm.projectStatus) {
        this.demandSearchForm.projectStatus.forEach(element => {
          this.demandProjectStatusOptions.map(item => {
            if (item.value === element) {
              val = val + item.label + ' '
            }
          })
        })
      }
      return val
    },
    changeDemandCompany () {
      let val = ''
      let that = this
      if (this.demandSearchForm.demandCompany) {
        this.demandUnitOptions.forEach(item => {
          if (this.demandSearchForm.demandCompany === item.orgCode) {
            val = item.orgName
            if (this.flag === 1) {
              that.demandSearchForm.demandCompany = item.orgName
              that.demandSearchForm.undertakeCompany = this.orgName
              that.demandCompanyCode = item.orgCode
              that.undertakeCompanyCode = this.companyCode
              that.isChange = 1
            } else {
              val = item.orgName
              that.demandSearchForm.demandCompany = item.orgName
              that.undertakeCompanyCode = item.orgCode
              that.demandCompanyCode = item.orgCode
            }
          } else {
            val = this.demandSearchForm.demandCompany
          }
        })
      }
      return val
    },
    changeUndertakeCompany () {
      let val = ''
      let that = this
      if (this.demandSearchForm.undertakeCompany) {
        this.demandBearUnitOptions.forEach(item => {
          if (this.demandSearchForm.undertakeCompany === item.orgCode) {
            val = item.orgName
            if (this.flag === 1) {
              that.demandSearchForm.undertakeCompany = item.orgName
              that.demandSearchForm.demandCompany = this.orgName
              that.demandCompanyCode = this.companyCode
              that.undertakeCompanyCode = item.orgCode
              that.isChange = 2
            } else {
              val = item.orgName
              that.demandSearchForm.undertakeCompany = item.orgName
              that.undertakeCompanyCode = item.orgCode
            }
          } else {
            val = this.demandSearchForm.undertakeCompany
          }
        })
      }
      return val
    },
    changeDemandCompanyType () {
      let val = ''
      if (this.demandSearchForm.demandCompanyType) {
        this.demandUnitTypeOptions.forEach(item => {
          if (this.demandSearchForm.demandCompanyType === item.value) {
            val = item.label
          }
        })
      }
      return val
    },
    changeUndertakeCompanyType () {
      let val = ''
      if (this.demandSearchForm.undertakeCompanyType) {
        this.demandBearUnitTypeOptions.forEach(item => {
          if (this.demandSearchForm.undertakeCompanyType === item.value) {
            val = item.label
          }
        })
      }
      return val
    },
    changeProjectClass () {
      let val = ''
      if (this.demandSearchForm.projectClass) {
        this.demandProjectCategoryOptions.forEach(item => {
          if (this.demandSearchForm.projectClass === item.valueCode) {
            val = item.name
          }
        })
      }
      return val
    }
  },
  created () {
    this.getSearchData()
    this.intercept()
  },
  mounted () {
  },
  methods: {
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    changeTableSort (column) {
      //获取字段名称和排序类型
      let fieldName = column.prop
      let sortWay = column.order
      if (fieldName !== '' && fieldName !== null) {
        fieldName = fieldName.replace('projectBaseInfo.', '')
        this.demandSearchForm.field = fieldName
      }
      if (sortWay !== '' && sortWay !== null) {
        sortWay = sortWay.replace('ending', '')
        this.demandSearchForm.sortWay = sortWay
      } else {
        this.demandSearchForm.field = ''
        this.demandSearchForm.sortWay = ''
      }
      if (this.isSearched) {
        this.getList(this.tableDataOut.body.pageNum, this.tableDataOut.body.pageSize)
      }
    },
    //数据导出判断属性信息字段是否禁用
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
    //数据导出隐藏弹框
    cancel () {
      this.dialogVisible = false
      this.checkboxout = true
      this.checkList = ['projectBaseInfo']
      this.checkList1 = []
    },
    //数据导出
    exportFile () {
      let block = {
        projectBaseInfo: true,
        projectAttribute: false,
        projectTeam: false,
        costBudget: false,
        projectAchievement: false,
        milestoneInfoBase: false,
        entrustLetter: false
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
        projectYear: this.demandSearchForm.projectYear,
        demandCompany: this.demandSearchForm.demandCompany,
        demandCompanyType: this.demandSearchForm.demandCompanyType,
        undertakeCompany: this.demandSearchForm.undertakeCompany,
        undertakeCompanyType: this.demandSearchForm.undertakeCompanyType,
        projectClass: this.demandSearchForm.projectClass,
        projectLevel: this.demandSearchForm.projectLevel,
        projectExpenditureType: this.demandSearchForm.projectExpenditureType,
        beginPlanApprovalTime: this.demandSearchForm.planApprovalTime ? formatDate(this.demandSearchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanApprovalTime: this.demandSearchForm.planApprovalTime ? formatDate(this.demandSearchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        beginPlanFinishTime: this.demandSearchForm.planFinishTime ? formatDate(this.demandSearchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanFinishTime: this.demandSearchForm.planFinishTime ? formatDate(this.demandSearchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        projectCode: this.demandSearchForm.projectCode,
        projectName: this.demandSearchForm.projectName,
        field: this.demandSearchForm.field,
        sortWay: this.demandSearchForm.sortWay,
        projectManagerName: this.demandSearchForm.projectManagerName,
        isFlag: this.flag,
        isChange: this.isChange
      }
      //判断查询当前登录人所在公司是需求或承担
      if (!param.demandCompany) {
        param.isChange = '1'
      } else if (!param.undertakeCompany) {
        param.isChange = '2'
      }
      //权限一的情况 默认需求单位/承担单位都包含当前登录人
      if (this.flag === 1 && this.companyCode !== '') {
        if (this.demandSearchForm.demandCompany !== '' && this.demandCompanyCode === '') {
          param.demandCompany = this.companyCode
        } else if (this.demandSearchForm.demandCompany !== '' && this.demandCompanyCode !== '') {
          param.demandCompany = this.demandCompanyCode
        }
        if (this.undertakeCompanyCode !== null && this.undertakeCompanyCode !== undefined) {
          param.undertakeCompany = this.undertakeCompanyCode
        }
      } else if (this.flag === 2 && this.companyCode !== '') { // 权限二 需求单位包含当前登录人组织 承担单位不包含
        param.demandCompany = this.companyCode
        if (this.undertakeCompanyCode !== null && this.undertakeCompanyCode !== undefined) {
          param.undertakeCompany = this.undertakeCompanyCode
        }
      } else if (this.flag === 3 && this.companyCode !== '') { // 权限二 需求单位不包含当前登录人组织 承担单位包含
        param.undertakeCompany = this.companyCode
        if (this.undertakeCompanyCode !== null && this.undertakeCompanyCode !== undefined) {
          param.demandCompany = this.undertakeCompanyCode
        }
      }
      if (this.demandSearchForm.projectStatus) {
        param.projectStatus = this.demandSearchForm.projectStatus.join(',')
      }
      if (param.demandCompany === '' && param.undertakeCompany === '') {
        this.$message({
          message: '需求单位和承担单位至少选择一个',
          type: 'error',
          showClose: true
        })
        this.popContainer = false
        this.percentage = 0
      } else {
        let url = '?request=unit&projectYear=' + param.projectYear + '&isFlag=' + param.isFlag + '&isChange=' + param.isChange + '&demandCompany=' + param.demandCompany + '&demandCompanyType=' + param.demandCompanyType +
          '&undertakeCompany=' + param.undertakeCompany + '&projectClass=' + param.projectClass + '&undertakeCompanyType=' + param.undertakeCompanyType +
          '&field=' + param.field + '&sortWay=' + param.sortWay +
          '&projectLevel=' + param.projectLevel + '&projectExpenditureType=' + param.projectExpenditureType + '&beginPlanApprovalTime=' + param.beginPlanApprovalTime +
          '&endPlanApprovalTime=' + param.endPlanApprovalTime + '&beginPlanFinishTime=' + param.beginPlanFinishTime + '&endPlanFinishTime=' + param.endPlanFinishTime +
          '&projectStatus=' + param.projectStatus +
          '&projectCode=' + param.projectCode + '&projectName=' + param.projectName + '&projectManagerName=' + param.projectManagerName + '&projectBaseInfo=' + block.projectBaseInfo +
          '&projectAttribute=' + block.projectAttribute + '&projectTeam=' + block.projectTeam + '&costBudget=' + block.costBudget + '&projectAchievement=' + block.projectAchievement +
          '&milestoneInfoBase=' + block.milestoneInfoBase + '&entrustLetter=' + block.entrustLetter + '&acthon=' + attribute.substr(0, attribute.length - 1)
        this.popContainer = true
        this.controlProgress()
        axios.request({
          url: this.baseUrl + '/rms/project/export/v1/exportDemandProjectQuery' + encodeURI(url),
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
      }
    },
    remove (val) {
      if (val === undefined && this.flag === 1) {
        this.demandSearchForm.demandCompany = ''
        this.demandSearchForm.undertakeCompany = this.orgName
        this.undertakeCompanyCode = this.companyCode
        this.isChange = 1
      } else {
        this.undertakeCompanyCode = ''
      }
    },
    removeUndertakeCompany (val) {
      if (val === undefined && this.flag === 1) {
        this.demandSearchForm.demandCompany = this.orgName
        this.demandCompanyCode = this.companyCode
        this.undertakeCompanyCode = ''
        this.isChange = 2
      } else {
        this.undertakeCompanyCode = ''
      }
    },
    deleteSelect (event) {
      event.stopPropagation()
      const value = this.multiple ? [] : ''
      this.$emit('input', value)
      this.emitChange(value)
      this.visible = false
      this.$emit('clear')
    },
    intercept () {
      this.projectStatusContent = ''
      this.demandSearchForm.projectStatus.forEach(element => {
        this.demandProjectStatusOptions.map(item => {
          if (item.value === element) {
            this.projectStatusContent = this.projectStatusContent + item.label + ' '
          }
        })
      })
    },
    currentValue (val) {
      this.demandSearchForm.projectStatus = val
      this.intercept()
    },
    handleClick (row) { //点击项目名称进入项目详情
      // 判断是否具有权限
      projectAPI.checkUserProjectPermission({ projectCode: row.projectBaseInfo.projectCode, permissionCode: '01' })
        .then(res => {
          if (res) {
            row.projectBaseInfo.projectCategory = row.projectBaseInfo.projectCategory === 'PC-DEMAND-UNIT' || row.projectBaseInfo.projectCategory === 'd' ? 'd' : 'u'
            let { href } = this.$router.resolve({
              path: '/groupPlan/projectDetail/' + row.projectBaseInfo.projectCode + '?developPackage=' + row.projectBaseInfo.developPackage + '&projectCategory=' + row.projectBaseInfo.projectCategory
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
    getSearchData () {
      //获取属性信息的字段
      let data = { companyCode: this.userInfo.userAuth.companyCode, isAll: false, projectCategory: 'PC-DEMAND-UNIT', businessObject: 'BO-OVERALL' }
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
                this.demandProjectCategoryOptions = dicItem.dictionarys.filter(dic => dic.valueCode !== 'IC_D')
                break
              case 'CO-PROJECT-LEVEL':
                this.demandProjectLevelOptions = dicItem.dictionarys
                break
              case 'PROJECT-EXPENDITURE-TYPE':
                this.demandFeeCategoryOptions = dicItem.dictionarys
                break
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
      axios.request({
        url: this.baseUrl + '/rms/basic/ext/employerUndertaker/v1/3/v1/employerUndertakersByOrgCode?orgType=1',
        headers: {
          'Authorization': this.Authorization,
          'pragma': 'no-cache',
          'cache-control': 'no-cache'
        }
      })
        .then((res) => {
          this.demandUnitOptions = res.data.body

          axios.request({
            url: this.baseUrl + '/rms/basic/ext/employerUndertaker/v1/3/v1/employerUndertakersByOrgCode?orgType=2',
            headers: {
              'Authorization': this.Authorization,
              'pragma': 'no-cache',
              'cache-control': 'no-cache'
            }
          })
            .then((res) => {
              this.demandBearUnitOptions = res.data.body
              const orgCode = this.userInfo.userAuth.curUserOrg.orgCode
              axios.request({
                url: this.baseUrl + '/rms/auth//ext/user/v1/3/v1/getCompanyOrgCodeByOrgCode?orgCode=' + orgCode,
                headers: {
                  'Authorization': this.Authorization,
                  'pragma': 'no-cache',
                  'cache-control': 'no-cache'
                }
              })
                .then((res) => {
                  if (res.data.body !== null) {
                    let code = res.data.body.orgCode
                    let flagOne = -1
                    let flagTwo = -1
                    if (this.demandUnitOptions !== null) {
                      this.demandUnitOptions.forEach(item => {
                        if (code === item.orgCode) {
                          flagOne = 1
                          this.orgName = item.orgName
                        }
                      })
                    }
                    if (this.demandBearUnitOptions !== null) {
                      this.demandBearUnitOptions.forEach(item => {
                        if (code === item.orgCode) {
                          flagTwo = 1
                        }
                      })
                    }
                    if (flagOne > 0 && flagTwo > 0) {
                      if (this.demandUnitOptions.indexOf(this.compareCode) < 0) {
                        this.demandSearchForm.demandCompany = this.orgName
                        this.companyCode = code
                        this.flag = 1
                      }
                    } else if (flagOne > 0 && flagTwo < 0) { //权限二
                      this.demandSearchForm.demandCompany = this.orgName
                      this.companyCode = code
                      this.flag = 2
                      this.demandDisable = true
                    } else if (flagOne < 0 && flagTwo > 0) { //权限三
                      this.demandSearchForm.undertakeCompany = res.data.body.orgName
                      this.companyCode = code
                      this.flag = 3
                      this.isAble = true
                    } else if (flagOne < 0 && flagTwo < 0) {
                      axios.request({
                        url: this.baseUrl + '/rms/auth/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth?parentOrgCode=' + code + '&recursion=false',
                        headers: {
                          'Authorization': this.Authorization,
                          'pragma': 'no-cache',
                          'cache-control': 'no-cache'
                        }
                      })
                        .then((res) => {
                          let beginCode = orgCode.slice(0, 8)
                          if (res.data.body !== null) {
                            res.data.body.forEach(item => {
                              let codes = item.orgCode.slice(0, 8)
                              if (codes === beginCode) {
                                let compareCodes = item.orgCode
                                let one = -1
                                let two = -1
                                if (this.demandUnitOptions !== null) {
                                  this.demandUnitOptions.forEach(item => {
                                    if (compareCodes === item.orgCode) {
                                      one = 1
                                      this.orgName = item.orgName
                                    }
                                  })
                                }
                                if (this.demandBearUnitOptions !== null) {
                                  this.demandBearUnitOptions.forEach(item => {
                                    if (compareCodes === item.orgCode) {
                                      two = 1
                                      this.orgName = item.orgName
                                    }
                                  })
                                }
                                //权限一 当前登录人所属公司或者所属公司的下一级组织（当前登录人所属组织或者所属组织的上级组织）存在于需求单位清单 compareCode用于判断上级组织
                                if (one > 0 && two > 0) {
                                  this.demandSearchForm.demandCompany = this.orgName
                                  this.companyCode = compareCodes
                                  this.flag = 1
                                } else if (one > 0 && two < 0) { //权限二
                                  this.demandSearchForm.demandCompany = this.orgName
                                  this.companyCode = compareCodes
                                  this.flag = 2
                                  this.demandDisable = true
                                } else if (one < 0 && two > 0) { //权限三
                                  this.demandSearchForm.undertakeCompany = res.data.body.orgName
                                  this.companyCode = compareCodes
                                  this.flag = 3
                                  this.isAble = true
                                } else if (one < 0 && two < 0) {
                                  this.demandUnitOptions = []
                                  this.demandBearUnitOptions = []
                                }
                              }
                            })
                          }
                        })
                    }
                  }
                })
            })
            .catch(err => {
              this.$message.error(err.message || '数据字典失败')
            })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    itemClass (row) {
      return 'hover'
    },
    tableDataInSearchMore () {
      this.searchMoreFlag = '1'
    },
    tableDataInSearchLess () {
      this.searchMoreFlag = '0'
    },
    statusFormatter (val) { //集团项目级别
      let status = ''
      this.demandProjectLevelOptions.some(item => {
        if (val.projectBaseInfo.projectLevel === item.valueCode) {
          status = item.name
        }
      })
      return status
    },
    categoryFormatter (val) { //集团项目类别
      let status = ''
      this.demandProjectCategoryOptions.some(item => {
        if (val.projectBaseInfo.projectClass === item.valueCode) {
          status = item.name
        }
      })
      return status
    },
    typeFormatter (val) { //费用类别
      let status = ''
      this.demandFeeCategoryOptions.some(item => {
        if (val.projectBaseInfo.projectExpenditureType === item.valueCode) {
          status = item.name
        }
      })
      return status
    },
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
    resetTable () {
      this.demandSearchForm.projectYear = ''
      this.demandSearchForm.demandCompanyType = ''
      this.demandSearchForm.undertakeCompanyType = ''
      this.demandSearchForm.projectClass = ''
      this.demandSearchForm.projectLevel = ''
      this.demandSearchForm.projectExpenditureType = ''
      this.demandSearchForm.planApprovalTime = ''
      this.demandSearchForm.planFinishTime = ''
      this.demandSearchForm.projectStatus = []
      this.demandSearchForm.projectCode = ''
      this.demandSearchForm.projectName = ''
      this.demandSearchForm.projectManagerName = ''
      this.demandSearchForm.field = ''
      this.demandSearchForm.sortWay = ''
      this.emptyText = '请输入查询条件'
      this.isChange = ''
      this.$refs.tableSortList.clearSort()
      this.isSearched = false // 排序重置
      this.tableDataOut.list = []
      this.tableDataOut.total = 0
      if (!this.isAble && this.flag !== 1) {
        this.demandSearchForm.undertakeCompany = ''
        this.isAble = false
      }
      if (!this.demandDisable && this.flag !== 1) {
        this.demandSearchForm.demandCompany = ''
        this.demandDisable = false
      }
      if (this.flag === 1) {
        this.demandSearchForm.demandCompany = this.orgName
        this.demandSearchForm.undertakeCompany = ''
        this.demandCompanyCode = this.companyCode
        this.isChange = 1
      }
      this.undertakeCompanyCode = ''
    },
    //有信息发生修改
    changeInfo (value) {
      this.$emit('changeValue')
    },
    // 获取外层列表
    getList (pageNum, pageSize) {
      this.tableDataOut.body.pageNum = pageNum
      this.tableDataOut.body.pageSize = pageSize
      this.loading = true
      this.currentPage = pageNum
      let param = {
        pageNum: pageNum,
        pageSize: pageSize,
        projectYear: this.demandSearchForm.projectYear,
        demandCompany: this.demandSearchForm.demandCompany,
        demandCompanyType: this.demandSearchForm.demandCompanyType,
        undertakeCompany: this.demandSearchForm.undertakeCompany,
        undertakeCompanyType: this.demandSearchForm.undertakeCompanyType,
        projectClass: this.demandSearchForm.projectClass,
        projectLevel: this.demandSearchForm.projectLevel,
        projectExpenditureType: this.demandSearchForm.projectExpenditureType,
        beginPlanApprovalTime: this.demandSearchForm.planApprovalTime ? formatDate(this.demandSearchForm.planApprovalTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanApprovalTime: this.demandSearchForm.planApprovalTime ? formatDate(this.demandSearchForm.planApprovalTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        beginPlanFinishTime: this.demandSearchForm.planFinishTime ? formatDate(this.demandSearchForm.planFinishTime[0], 'YYYY-MM-DD HH:mm:ss') : '',
        endPlanFinishTime: this.demandSearchForm.planFinishTime ? formatDate(this.demandSearchForm.planFinishTime[1], 'YYYY-MM-DD HH:mm:ss') : '',
        projectCode: this.demandSearchForm.projectCode,
        projectName: this.demandSearchForm.projectName,
        field: this.demandSearchForm.field,
        sortWay: this.demandSearchForm.sortWay,
        isFlag: this.flag,
        isChange: this.isChange,
        projectManagerName: this.demandSearchForm.projectManagerName
      }
      if (!param.demandCompany) {
        param.isChange = '1'
      } else if (!param.undertakeCompany) {
        param.isChange = '2'
      }
      //权限一的情况 默认需求单位/承担单位都包含当前登录人
      if (this.flag === 1 && this.companyCode !== '') {
        if (this.demandSearchForm.demandCompany !== '' && this.demandCompanyCode === '') {
          param.demandCompany = this.companyCode
        } else if (this.demandSearchForm.demandCompany !== '' && this.demandCompanyCode !== '') {
          param.demandCompany = this.demandCompanyCode
        }
        if (this.undertakeCompanyCode !== null && this.undertakeCompanyCode !== undefined) {
          param.undertakeCompany = this.undertakeCompanyCode
        }
      } else if (this.flag === 2 && this.companyCode !== '') { // 权限二 需求单位包含当前登录人组织 承担单位不包含
        param.demandCompany = this.companyCode
        if (this.undertakeCompanyCode !== null && this.undertakeCompanyCode !== undefined) {
          param.undertakeCompany = this.undertakeCompanyCode
        }
      } else if (this.flag === 3 && this.companyCode !== '') { // 权限二 需求单位不包含当前登录人组织 承担单位包含
        param.undertakeCompany = this.companyCode
        if (this.undertakeCompanyCode !== null && this.undertakeCompanyCode !== undefined) {
          param.demandCompany = this.undertakeCompanyCode
        }
      }
      if (this.demandSearchForm.projectStatus) {
        param.projectStatus = this.demandSearchForm.projectStatus.join(',')
      }
      if (param.demandCompany === '' && param.undertakeCompany === '') {
        this.$message({
          message: '需求单位和承担单位至少选择一个',
          type: 'error',
          showClose: true
        })
        this.loading = false
      } else {
        API.getIndependentDemandSearch(param)
          .then(res => {
            this.loading = false
            if (res.total > 0) {
              this.tableDataOut.list = res.projectInfos
              for (let i = 0; i < res.projectInfos.length; i++) {
                this.tableDataOut.list[i].projectBaseInfo.planApprovalTime = formatDate(this.tableDataOut.list[i].projectBaseInfo.planApprovalTime, 'YYYY-MM-DD')

                this.tableDataOut.list[i].projectBaseInfo.planFinishTime = formatDate(this.tableDataOut.list[i].projectBaseInfo.planFinishTime, 'YYYY-MM-DD')

                if (this.tableDataOut.list[i].demandProjectCompanyInfo !== null) {
                  this.tableDataOut.list[i].projectBaseInfo.demandCompany = this.tableDataOut.list[i].demandProjectCompanyInfo.companyName
                }
                if (this.tableDataOut.list[i].undertakeProjectCompanyInfo !== null) {
                  this.tableDataOut.list[i].projectBaseInfo.undertakeCompany = this.tableDataOut.list[i].undertakeProjectCompanyInfo.companyName
                }
                if (this.tableDataOut.list[i].projectTeam !== null) {
                  this.tableDataOut.list[i].projectBaseInfo.projectManagerName = this.tableDataOut.list[i].projectTeam.userName
                } else {
                  this.tableDataOut.list[i].projectBaseInfo.projectManagerName = null
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
            param.demandCompany = ''
            param.undertakeCompany = ''
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
}
</script>

<style lang="scss" scoped>
  .content {
    .search-content {
      background: #fff;
      font-size: 14px;
      margin-top: -10px;

      .el-form {
        margin: 10px 20px;
        padding: 10px 0;
      }

      /deep/ .el-form-item .el-input__inner {
        width: 220px;
      }

      /deep/ .el-form-item .demandItemOne .el-input__inner {
        width: 130px;
      }

      /deep/ .el-form-item .demandItemTwo .el-input__inner {
        width: 80px;
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
          border: 1px solid rgba(11, 130, 255, 0.50);
        }
      }

      /deep/ .el-tabs__nav {
        margin-left: 25px;
      }

    }

    .main-warpper {
      background: #fff;
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

      /deep/ .el-table__row {
        height: 47px;
        line-height: 47px;

        td {
          padding: 0;

          div {
            line-height: 1;
          }
        }
      }

      /deep/ .sp-table .padding-col {
        padding-left: 0px;
      }

      /deep/ .el-table__body-wrapper.is-scrolling-none {
        height: calc(100% - 130px);
        overflow: auto;
      }

      /deep/ .el-table__body-wrapper {
        overflow: auto;
      }

      /deep/ .el-table:before {
        height: 0px;
      }

      /deep/ .el-table--group:after {
        height: 0px;
      }

      /deep/ .el-table--group {
        border: 0px;
      }

      /deep/ .hover {
        &:hover {
          color: #0b82ff;
        }

        cursor: pointer;
      }

      /deep/ .hover {
        @include color();
        cursor: pointer;
      }
    }

    .project-list {
      background-color: #fff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 2px;
      padding: 10px 25px 20px;
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
    position: fixed;
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
  .showToolTipSpanOne {
    box-sizing: border-box;
    display: inline-block;
    max-width: 80px!important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.el-select-dropdown__item {
  .showToolTipSpan {
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
