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
      <taskCard
        @editAchievement='editAchievement'
        @delAchievement='delAchievement'
        @handleClick='handleClick'
        v-if="isListOrCard === 2"
        :table-data="tableDataOut.list"
        :meber-edit-flag='meberEditFlag'></taskCard>
    </projectPanel>
    <!-- 预期成果弹框编辑 -->
    <el-dialog
      v-dialogDrag
      v-if="dialogVisible"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="1148px"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="addcon5">
        <projectPanel
          title="预期成果信息"
          class="addcon"
          :show-expand='false'
          :tips="true"
          :tip-language="language">
          <el-form
            ref="tableDataInForm"
            :rules="rules"
            :model="tableDataInForm"
            label-width="110px">
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="任务名称:"
                  prop="achievementName">
                  <el-input
                    v-model.trim="tableDataInForm.achievementName"
                    clearable
                    style="width:220px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="成果类型:"
                  prop="achievementTypeValue">
                  <el-select
                    :popper-append-to-body="false"
                    v-model="tableDataInForm.achievementTypeValue"
                    placeholder="请选择"
                    style="width:220px"
                    clearable>
                    <el-option
                      v-for="item in achievementTypeValueOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <el-tooltip :content="item.label" :disabled="!showToolTip(item.label, 180)">
                        <span>{{item.label}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  class="expectTime1"
                  label="预期交付时间:"
                  prop="deliveryTime">
                  <el-date-picker
                    style="width:220px"
                    v-model="tableDataInForm.deliveryTime"
                    type="date"
                    :default-value="planRangeTime[0] > Date.now()?parseInt(planRangeTime[0]):Date.now()"
                    :picker-options="startTimeOptions"
                    value-format='timestamp'
                    placeholder="请选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="需求单位:"
                  prop="demandUnit">
                  <el-select
                    :popper-append-to-body="false"
                    @change="demandUnitChange"
                    value-key='value'
                    v-model="tableDataInForm.demandUnit"
                    placeholder="请选择"
                    style="width:220px"
                    :disabled="tableDataInForm.linkFlag=='1'?true:false"
                    clearable>
                    <el-option
                      v-for="item in demandUnitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    >
                      <el-tooltip :content="item.label" :disabled="!showToolTip(item.label, 180)">
                        <span>{{item.label}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="成果需求人:"
                  prop="demandUnitResponsibleName">
                  <el-select
                    :popper-append-to-body="false"
                    @change="demandUnitResponsibleNameChange"
                    value-key='value'
                    v-model="tableDataInForm.demandUnitResponsibleName"
                    placeholder="请选择"
                    style="width:220px"
                    @visible-change="serarchleadDemandManagerAdd(tableDataInForm.demandUnit,'',$event)"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="ruleForm2.addDemandUnitResponsibleName"
                        placeholder="请输入名称"
                        clearable
                        @keyup.enter.native="serarchleadDemandManagerAdd(tableDataInForm.demandUnit,ruleForm2.addDemandUnitResponsibleName)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchleadDemandManagerAdd(tableDataInForm.demandUnit,ruleForm2.addDemandUnitResponsibleName)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-for="item in demandUnitResponsibleNameOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                      v-show="!item.isHidden"
                    >
                      <el-tooltip :content="item.label" :disabled="!showToolTip(item.label, 180)">
                        <span>{{item.label}}</span>
                      </el-tooltip>
                    </el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="ruleForm2.addDemandUnitResponsibleName"
                          placeholder="请输入名称"
                          clearable
                          @keyup.enter.native="serarchleadDemandManagerAdd(tableDataInForm.demandUnit,ruleForm2.addDemandUnitResponsibleName)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchleadDemandManagerAdd(tableDataInForm.demandUnit,ruleForm2.addDemandUnitResponsibleName)"
                        >
                        </i>
                        </el-input>
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="需求单位部门:"
                  prop="demandUnitDept">
                  <el-select
                    :popper-append-to-body="false"
                    @change="demandUnitDeptChange"
                    value-key='value'
                    v-model="tableDataInForm.demandUnitDept"
                    placeholder="请选择"
                    style="width:220px"
                    :disabled="tableDataInForm.linkFlag=='1'?true:false"
                    clearable>
                    <el-option
                      v-for="item in demandUnitDeptOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    >
                      <el-tooltip :content="item.label" :disabled="!showToolTip(item.label, 180)">
                        <span>{{item.label}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="承担单位:"
                  prop="undertakeUnit">
                  <el-select
                    :popper-append-to-body="false"
                    @change="undertakeUnitChange"
                    value-key='value'
                    v-model="tableDataInForm.undertakeUnit"
                    placeholder="请选择"
                    style="width:220px"
                    :disabled="tableDataInForm.linkFlag=='1'?true:false"
                    clearable>
                    <el-option
                      v-for="item in undertakeUnitOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    >
                      <el-tooltip :content="item.label" :disabled="!showToolTip(item.label, 180)">
                        <span>{{item.label}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="成果负责人:"
                  prop="responsiblePerson">
                  <el-select
                    :popper-append-to-body="false"
                    @change="responsiblePersonChange"
                    value-key='value'
                    v-model="tableDataInForm.responsiblePerson"
                    placeholder="请选择"
                    style="width:220px"
                    @visible-change="serarchleadUndertakeManagerAdd(tableDataInForm.undertakeUnit,'',$event)"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="ruleForm2.addResponsiblePerson"
                        placeholder="请输入名称"
                        @keyup.enter.native="serarchleadUndertakeManagerAdd(tableDataInForm.undertakeUnit,ruleForm2.addResponsiblePerson)"
                        clearable
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchleadUndertakeManagerAdd(tableDataInForm.undertakeUnit,ruleForm2.addResponsiblePerson)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-for="item in responsiblePersonOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                      v-show="!item.isHidden"
                    >
                      <el-tooltip :content="item.label" :disabled="!showToolTip(item.label, 180)">
                        <span>{{item.label}}</span>
                      </el-tooltip>
                    </el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="ruleForm2.addResponsiblePerson"
                          placeholder="请输入名称"
                          clearable
                          @keyup.enter.native="serarchleadUndertakeManagerAdd(tableDataInForm.undertakeUnit,ruleForm2.addResponsiblePerson)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchleadUndertakeManagerAdd(tableDataInForm.undertakeUnit,ruleForm2.addResponsiblePerson)"
                        >
                        </i>
                        </el-input>
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="承担单位部门:"
                  prop="undertakeUnitDept">
                  <el-select
                    :popper-append-to-body="false"
                    @change="undertakeUnitDeptTopChange"
                    value-key='value'
                    v-model="tableDataInForm.undertakeUnitDept"
                    placeholder="请选择"
                    style="width:220px"
                    :disabled="tableDataInForm.linkFlag=='1'?true:false"
                    clearable>
                    <el-option
                      v-for="item in undertakeUnitDeptOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    >
                      <el-tooltip :content="item.label" :disabled="!showToolTip(item.label, 180)">
                        <span>{{item.label}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </projectPanel>
      </div>
      <projectPanel title="预期成果预算"  class="addcon addcon2" :show-expand='false'>
        <template v-slot:header>
          <el-button
            class="normal-btn"
            @click="addDepartment"
            icon="el-icon-circle-plus-outline">添加部门</el-button>
        </template>
        <div class="budget-body">
          <el-form
            ref="budgetForm"
            :model="budgetForm"
            :show-message="true">
            <el-table :data="budgetForm.tableData" style="width: 100%" :border="false">
              <el-table-column minwidth="220">
                <el-table-column
                  align="center"
                  prop="undertakeUnitDept"
                  label="承担部门"
                  width="140">
                  <template slot-scope="scope">
                    <p v-if="scope.row.type=='data'">{{scope.row.undertakeUnitDept}}</p>
                    <p v-if="scope.row.type=='total'">合计</p>
                    <el-form-item
                      :prop="'undertakeUnitDept'+scope.$index"
                      v-if="scope.row.type=='add'||scope.row.type=='edit'"
                      :rules="setRules('undertakeUnitDept',1,scope.$index)"
                      style="margin-right:0;margin-bottom:0">
                      <el-select
                        :disabled="undertakeUnitDeptDisabled(scope.row)"
                        @change='undertakeUnitDeptChange($event,scope.row)'
                        v-model="scope.row.undertakeUnitDeptCode"
                        placeholder="请选择"
                        clearable>
                        <el-option
                          :disabled="item.disabled"
                          v-for="item in undertakeUnitDeptOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                          <el-tooltip :content="item.label" :disabled="!showToolTip(item.label, 180)">
                            <span>{{item.label}}</span>
                          </el-tooltip>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                :label="tableTitleItem+'年度'"
                v-for="(tableTitleItem,index) in yearRange"
                :key="index"
                align="center">
                <el-table-column label="合作开发费(万元)" align="center">
                  <el-table-column
                    prop="budgetInsourcing"
                    align="center"
                    label="委内"
                    min-width="140">
                    <template slot-scope="scope">
                      <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].budgetInsourcing | numTransition}}</p>
                      <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].budgetInsourcing | numTransition}}</p>
                      <el-form-item
                        style="margin-right:0;margin-bottom:0"
                        :prop="'budgetInsourcing'+tableTitleItem+scope.$index"
                        v-if="scope.row.type=='add'||scope.row.type=='edit'"
                        :rules="[{ required:false}]">
                        <!-- :rules="parseInt(tableTitleItem) < curYear?[{ required:false}]:setRules('budgetInsourcing',index,scope.$index)"> -->
                        <el-input
                          v-model="scope.row.budgetList[index].budgetInsourcing"
                          placeholder="0.000000"
                          @input="inputHandler('budgetInsourcing',index,scope.row)"
                          @change="computeSum('budgetInsourcing',index,scope.row,tableTitleItem)"
                          @focus="focusHandler('budgetInsourcing',index,scope.row)"
                          @blur="blurHandler('budgetInsourcing',index,scope.row)"
                          :disabled="parseInt(tableTitleItem) < curYear"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="budgetOutsourcing"
                    align="center"
                    label="委外"
                    min-width="140">
                    <template slot-scope="scope">
                      <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].budgetOutsourcing | numTransition}}</p>
                      <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].budgetOutsourcing | numTransition}}</p>
                      <el-form-item
                        style="margin-right:0;margin-bottom:0"
                        v-if="scope.row.type=='add'||scope.row.type=='edit'"
                        :prop="'budgetOutsourcing'+tableTitleItem+scope.$index"
                        :rules="[{ required:false}]">
                        <!-- :rules="parseInt(tableTitleItem) < curYear?[{ required:false}]:setRules('budgetOutsourcing',index,scope.$index)"> -->
                        <el-input
                          v-model="scope.row.budgetList[index].budgetOutsourcing"
                          placeholder="0.000000"
                          @input="inputHandler('budgetOutsourcing',index,scope.row)"
                          @change="computeSum('budgetOutsourcing',index,scope.row)"
                          @focus="focusHandler('budgetOutsourcing',index,scope.row)"
                          @blur="blurHandler('budgetOutsourcing',index,scope.row)"
                          :disabled="parseInt(tableTitleItem) < curYear"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="staffTime"
                  label="自有人工(人月)"
                  min-width="140"
                  align="center">
                  <template slot-scope="scope">
                    <p v-if="scope.row.type=='total'">{{scope.row.budgetList[index].staffTime | numTransition}}</p>
                    <p v-if="scope.row.type=='data'">{{scope.row.budgetList[index].staffTime | numTransition}}</p>
                    <el-form-item
                      style="margin-right:0;margin-bottom:0"
                      v-if="scope.row.type=='add'||scope.row.type=='edit'"
                      :prop="'staffTime'+tableTitleItem+scope.$index"
                      :rules="[{ required:false}]">
                      <!-- :rules="parseInt(tableTitleItem) < curYear?[{ required:false}]:setRules('staffTime',index,scope.$index)"> -->
                      <el-input
                        v-model="scope.row.budgetList[index].staffTime"
                        placeholder="0.00"
                        @input="inputHandler('staffTime',index,scope.row)"
                        @change="computeSum('staffTime',index,scope.row)"
                        @focus="focusHandler('staffTime',index,scope.row)"
                        @blur="blurHandler('staffTime',index,scope.row)"
                        :disabled="parseInt(tableTitleItem) < curYear"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                min-width="140">
                <el-table-column
                  prop="totalAmount"
                  label="合计(万元)"
                  min-width="140"
                  align="center">
                  <template slot-scope="scope">
                    <p>{{scope.row.totalAmount | numTransition}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop label min-width="150">
                  <el-table-column
                    prop="name333"
                    label="操作"
                    min-width="150"
                    align="center">
                    <template slot-scope="scope">
                      <div v-if="scope.row.type=='data'">
                        <!-- 数据展示 -->
                        <el-button
                          class="normal-btn"
                          style="border: none;padding-left: 0!important;padding-right: 0 !important;background: 0 0;border-color: transparent;"
                          @click="click_edit(scope.row, scope.$index)">编辑</el-button>
                        <el-button
                          class="normal-btn"
                          style="border: none;padding-left: 10!important;padding-right: 0 !important;background: 0 0;border-color: transparent;"
                          @click="click_delete(scope.row, scope.$index,'edit')">删除</el-button>
                      </div>
                      <div v-if="scope.row.type=='edit'">
                        <!-- 编辑 -->
                        <el-button
                          class="normal-btn"
                          style="border: none;padding-left: 0!important;padding-right: 0 !important;background: 0 0;border-color: transparent;"
                          @click="click_save1(scope.row, scope.$index)">保存</el-button>
                        <el-button
                          class="normal-btn"
                          style="border: none;padding-left: 10!important;padding-right: 0 !important;background: 0 0;border-color: transparent;"
                          @click="click_delete(scope.row, scope.$index,'edit')">删除</el-button>
                      </div>
                      <div v-if="scope.row.type=='add'">
                        <!-- 新增 -->
                        <el-button
                          class="normal-btn"
                          style="border: none;padding-left: 0!important;padding-right: 0 !important;background: 0 0;border-color: transparent;"
                          @click="click_save(scope.row, scope.$index)">保存</el-button>
                        <el-button
                          class="normal-btn"
                          style="border: none;padding-left: 10!important;padding-right: 0 !important;background: 0 0;border-color: transparent;"
                          @click="click_delete(scope.row, scope.$index)">删除</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </projectPanel>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCancle">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleSave">保存</el-button>
      </span>
    </el-dialog>
    <aDialogDetail ref="aDialogDetail"></aDialogDetail>
  </div>
</template>
<script>

import selfTable from '../../../../../components/table/index'
import projectPanel from '../../../../components/projectPanel/index'
import APIGroupPlan from '@/serve/API_groupPlanProject'
import APIAchievement from './achievement.js'
import bus from '@/common/bus'
import aDialogDetail from './aDialogDetail'
import BigNumber from 'bignumber.js'
import taskCard from './taskCard'
import { isShowToolTip } from '@/utils/common.js'
export default {
  components: { projectPanel, selfTable, aDialogDetail, taskCard },
  props: {
    planRangeTime: { //任务预期交付时间
      type: Array,
      default: () => []
    },
    yearRangeProp: { //基础信息年份
      type: Array,
      default: () => []
    },
    leadDemandUnitOptions: {
      type: Array,
      default: () => []
    },
    leadUndertakeUnitOptions: {
      type: Array,
      default: () => []
    },
    parentCode: { //需求单位项目编码
      type: String,
      default: ''
    },
    subProjectCode: { //子项目编码
      type: String,
      default: ''
    },
    //传入的外层列表数据
    receiveData: {
      type: Array,
      default: () => []
    },
    projectAchievement: { //成果
      type: Object,
      default: () => {}
    }
  },
  data () {
    var validateDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择任务预期交付时间'))
      }
      // if (value < this.planRangeTime[0]) {
      //   callback(new Error('任务预期交付时间不能小于计划立项时间'))
      // }
      // if (value > this.planRangeTime[1]) {
      //   callback(new Error('任务预期交付时间不能大于计划结项时间'))
      // }
      // if (value < new Date()
      //   .getTime()) {
      //   callback(new Error('任务预期交付时间必须大于等于当前日期'))
      // }
      callback()
    }
    return {
      isListOrCard: 1,
      meberEditFlag: false,
      curYear: new Date()
        .getFullYear(), //当年年份
      yearRange: [],
      budgetForm: {
        tableData: []
      },
      startTimeOptions: {
        disabledDate: time => {
          // 大于等于当前日期 大于计划立项时间 小于计划结项时间
          if (new Date()
            .getTime() >= this.planRangeTime[0]) {
            return time.getTime() < new Date()
              .getTime() - 8.64e7 || time.getTime() >= this.planRangeTime[1] + 8.64e7
          }
          if (new Date()
            .getTime() < this.planRangeTime[0]) {
            return time.getTime() < this.planRangeTime[0] || time.getTime() >= this.planRangeTime[1] + 8.64e7
          }
        }
      },
      rules: { //预期成果信息rules
        achievementName: [
          { required: true, message: '请输入任务名称', trigger: ['change', 'blur'] },
          { max: 64, message: '长度在64个字符以内', trigger: ['change', 'blur'] }
        ],
        achievementTypeValue: [{ required: true, message: '请选择成果类型', trigger: ['change', 'blur'] }],
        demandUnit: [{ required: true, message: '请选择需求单位', trigger: ['change', 'blur'] }],
        undertakeUnit: [{ required: true, message: '请选择承担单位', trigger: ['change', 'blur'] }],
        demandUnitDept: [{ required: true, message: '请选择需求部门', trigger: ['change', 'blur'] }],
        undertakeUnitDept: [{ required: true, message: '请选择承担部门', trigger: ['change', 'blur'] }],
        demandUnitResponsibleName: [{ required: true, message: '请选择成果需求人', trigger: ['change', 'blur'] }],
        responsiblePerson: [{ required: true, message: '请选择成果负责人', trigger: ['change', 'blur'] }],
        deliveryTime: [{ required: true, validator: validateDate, trigger: ['change', 'blur'] }]
      },
      achievementTypeValueOptions: [], //成果类型options1
      demandUnitOptions: [], //需求单位options2
      undertakeUnitOptions: [], //承担单位options3
      demandUnitDeptOptions: [], //需求部门options4
      undertakeUnitDeptOptions: [], //承担部门options5
      demandUnitResponsibleNameOptions: [], //成果需求人options6
      responsiblePersonOptions: [], //成果负责人options6
      tableDataInForm: { //预期成果信息表单
        achievementName: '', //任务名称
        achievementTypeValue: '', //成果类型1
        deliveryTime: '', //任务预期交付时间
        demandUnit: '', //需求单位2
        demandUnitDept: '', //需求部门4
        demandUnitResponsibleName: '', //成果需求人6
        undertakeUnit: '', //承担单位3
        undertakeUnitDept: '', //承担部门5
        responsiblePerson: '' //成果负责人7
      },
      ruleForm2: {
        addDemandUnitResponsibleName: '',
        addResponsiblePerson: ''
      },
      dialogVisible: false,
      dialogTitle: '新增预期成果',
      tableDataOut: { //外层详情表格数据
        list: []
      },
      tableColsOut: [
        {
          label: '任务名称',
          prop: 'achievementName',
          type: 'link',
          align: 'left',
          minwidth: '120px',
          overflow: true,
          resizable: false,
          handleClick: this.handleClick,
          itemClass: this.itemClass
        }, {
          label: '需求单位',
          prop: 'demandUnit',
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
          label: '承担单位',
          prop: 'undertakeUnit',
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
          label: '状态',
          prop: 'linkFlag',
          align: 'left',
          overflow: true,
          minwidth: '70px',
          resizable: false,
          formatter: this.undertakeProjectCodeFormatter
        }, {
          label: '合作开发费(万元)',
          prop: 'togetherDevelopCost',
          minwidth: '120px',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.numTransition1
        }, {
          label: '自有人工(人月)',
          prop: 'staffTime',
          minwidth: '120px',
          align: 'left',
          overflow: true,
          resizable: false,
          formatter: this.numTransition1
        }, {
          label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          minwidth: '120px',
          btnList: [
            { type: 'text', label: '编辑', handle: this.editAchievement, isHidden: this.getmeberEditFlag },
            { type: 'text', label: '删除', handle: this.delAchievement, isHidden: this.getmeberEditFlag }
          ]
        }
      ],
      allKeys: ['budgetOutsourcing', 'budgetInsourcing', 'staffTime'],
      selfId: 0, //预算要给每一行数据加一个前端 selfId 用来寻找
      language: '预期成果信息中所有可编辑字段都是基线字段；',
      checkData: [
        {
          label: 'achievementName',
          value: '任务名称'
        }, {
          label: 'achievementType',
          value: '成果类型'
        }, {
          label: 'demandUnit',
          value: '需求单位'
        }, {
          label: 'demandUnitDept',
          value: '需求单位部门'
        }, {
          label: 'demandUnitResponsibleName',
          value: '成果需求人'
        }, {
          label: 'undertakeUnit',
          value: '承担单位'
        }, {
          label: 'undertakeUnitDept',
          value: '承担单位部门'
        }, {
          label: 'responsiblePerson',
          value: '成果负责人'
        }, {
          label: 'deliveryTime',
          value: '预期交付时间'
        }, {
          label: 'budgetOutsourcing',
          value: '合作开发费-委外'
        }, {
          label: 'budgetInsourcing',
          value: '合作开发费-委内'
        }, {
          label: 'staffTime',
          value: '自有人工（人月）'
        }, {
          label: 'totalAmount',
          value: '合计金额'
        }]
    }
  },
  watch: {
    projectAchievement: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val && val !== '{}') {
          let add = []
          this.checkData.forEach(item => {
            if (val[item.label]) {
              add.push(item.value)
            }
          })
          if (add.length) {
            if (add.length === Object.getOwnPropertyNames(val).length - 1) {
              this.language = '预期成果信息中所有可编辑字段都是基线字段；'
              return
            }
            this.language = `预期成果信息中的基线字段：${add.join('、')}；`
          } else {
            this.language = '预期成果信息中没有基线字段；'
          }
        }
      }
    },
    receiveData: { //成果列表
      deep: true,
      immediate: true,
      handler: function (val, oldVal) { //有数据接收后初始化数据
        this.tableDataOut.list = val || []
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
    },
    leadDemandUnitOptions: { //需求单位
      deep: true,
      immediate: true,
      handler: function (val, oldVal) { //有数据接收后初始化数据
        if (val && val.length > 0) {
          val.forEach(item => {
            item.label = item.organizationName
            // item.value = item.companyCode
            item.value = item.organizationCode
          })
          this.demandUnitOptions = val
        }
      }
    },
    leadUndertakeUnitOptions: { //承担单位
      deep: true,
      immediate: true,
      handler: function (val, oldVal) { //有数据接收后初始化数据
        if (val && val.length > 0) {
          val.forEach(item => {
            item.label = item.organizationName
            item.value = item.organizationCode
          })
          this.undertakeUnitOptions = val
        }
      }
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
  },
  filters: {
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
        // return '-'
        return '0'
      }
    }
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    cutCardOrList (val) {
      this.isListOrCard = val
    },
    getmeberEditFlag () {
      return !this.meberEditFlag
    },
    // 过滤小数位后0
    numTransition1 (val) {
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
    undertakeProjectCodeFormatter (val) {
      if (val === '1') {
        return '已关联'
      } else if (val === '0') {
        return '未关联'
      } else {
        return ''
      }
    },
    serarchleadUndertakeManagerAdd (undertakeUnit, userName, boole) {
      if (undertakeUnit.value) {
        if (boole) {
          this.ruleForm2.addResponsiblePerson = ''
          userName = ''
        }
        this.getAllUserPageByorgCode(undertakeUnit.value, 'u', userName, 'search')
      }
    },
    serarchleadDemandManagerAdd (demandUnit, userName, boole) {
      if (demandUnit.value) {
        if (boole) {
          this.ruleForm2.addDemandUnitResponsibleName = ''
          userName = ''
        }
        this.getAllUserPageByorgCode(demandUnit.value, 'd', userName, 'search')
      }
    },
    demandUnitChange (val) { //需求单位改变
      this.demandUnitDeptOptions = []
      this.demandUnitResponsibleNameOptions = []
      this.tableDataInForm.demandUnitDept = ''
      this.tableDataInForm.demandUnitResponsibleName = ''
      if (val) { //重新给需求部门赋值
        this.getOrgListByParentOrgCode(val.organizationCode, 'd')
        this.getAllUserPageByorgCode(val.organizationCode, 'd')
      }
    },
    undertakeUnitChange (val) { //承担单位改变此时承担部门下拉数据一定会改变,给表格数据置空
      this.undertakeUnitDeptOptions = []
      this.responsiblePersonOptions = []
      this.tableDataInForm.undertakeUnitDept = ''
      this.tableDataInForm.responsiblePerson = ''
      if (val) { //重新给承担部门赋值
        this.getOrgListByParentOrgCode(val.value, 'u')
        this.getAllUserPageByorgCode(val.organizationCode, 'u')
      }
      let list = []
      this.budgetForm.tableData.some(item => {
        if (item.type === 'total') {
          list.push(item)
        }
      })
      this.budgetForm.tableData = list
      this.computedAll()
    },
    demandUnitDeptChange (val) { //需求部门改变,
      this.demandUnitResponsibleNameOptions = []
      this.tableDataInForm.demandUnitResponsibleName = ''
      if (val) { //选择了部门获取成果需求人下拉数据
        this.getAllUserPageByorgCode(val.value, 'd')
      } else { //
        if (this.tableDataInForm.demandUnit) {
          this.getAllUserPageByorgCode(this.tableDataInForm.demandUnit.value, 'd') //成果需求人
        }
      }
    },
    undertakeUnitDeptTopChange (val) { //承担部门改变
      this.responsiblePersonOptions = []
      this.tableDataInForm.responsiblePerson = ''
      if (val) { //选择了承担部门执行更新成果负责人下拉数据
        this.getAllUserPageByorgCode(val.value, 'u')
      } else {
        if (this.tableDataInForm.undertakeUnit) {
          this.getAllUserPageByorgCode(this.tableDataInForm.undertakeUnit.value, 'u') //成果
        }
      }
    },
    demandUnitResponsibleNameChange (val) { //成果需求人改变,给需求部门赋值
      if (val) {
        let useOrganizationCode = ''
        if (val.companyCode === 'hq') {
          useOrganizationCode = val.organizationCode.slice(0, 12)
          this.demandUnitDeptOptions.some(item => {
            if (item.value.slice(0, 12) === useOrganizationCode) {
              this.tableDataInForm.demandUnitDept = { label: item.label, value: item.value }
            }
          })
        } else {
          useOrganizationCode = val.organizationCode.slice(0, 8)
          this.demandUnitDeptOptions.some(item => {
            if (item.value.slice(0, 8) === useOrganizationCode) {
              this.tableDataInForm.demandUnitDept = { label: item.label, value: item.value }
            }
          })
        }
      }
    },
    responsiblePersonChange (val) { //成果负责人改变,给承担部门赋值
      if (val) {
        let useOrganizationCode = ''
        if (val.companyCode === 'hq') {
          useOrganizationCode = val.organizationCode.slice(0, 12)
          this.undertakeUnitDeptOptions.some(item => {
            if (item.value.slice(0, 12) === useOrganizationCode) {
              this.tableDataInForm.undertakeUnitDept = { label: item.label, value: item.value }
            }
          })
        } else {
          useOrganizationCode = val.organizationCode.slice(0, 8)
          this.undertakeUnitDeptOptions.some(item => {
            if (item.value.slice(0, 8) === useOrganizationCode) {
              this.tableDataInForm.undertakeUnitDept = { label: item.label, value: item.value }
            }
          })
        }
      }
    },
    getOrgListByParentOrgCode (val, type) { //查询需求部门和承担部门
      APIAchievement.getOrgListByParentOrgCode({ parentOrgCode: val, recursion: false })
        .then(res => {
          res.forEach(item => {
            item.label = item.orgName
            item.value = item.orgCode
          })
          if (type === 'd') {
            this.demandUnitDeptOptions = res
          }
          if (type === 'u') {
            this.undertakeUnitDeptOptions = res
          }
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '部门获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    getAllUserPageByorgCode (val, type, userName, search) { //查询成果负责人和成果需求人
      // APIAchievement.getAllUserPageByorgCode({ orgCode: val, pageNum: 1, pageSize: 100000 })
      //   .then(res => {
      //     res.records.forEach(item => {
      //       item.label = item.chineseName
      //       item.value = item.uid
      //     })
      //     if (type === 'd') { //成果需求人和需求单位团队成员有关
      //       let member = []
      //       let demandUnitResponsibleNameOptions = []
      //       this.demandUnitOptions.forEach(item => {
      //         item.projectTeamList.forEach(item2 => {
      //           if (item2.projectRoleCode === 'PR-LEADER-DEMAND-MEMBER' || item2.projectRoleCode === 'PR-PARTNER-DEMAND-MEMBER') {
      //             member.push(item2)
      //           }
      //         })
      //       })
      //       member.forEach(item => {
      //         res.records.some(item2 => {
      //           if (item.userAccount === item2.value) {
      //             demandUnitResponsibleNameOptions.push(item2)
      //           }
      //         })
      //       })
      //       this.demandUnitResponsibleNameOptions = demandUnitResponsibleNameOptions
      //     }
      //     if (type === 'u') { //成果负责人和承担单位团队成员有关
      //       let member = []
      //       let responsiblePersonOptions = []
      //       this.undertakeUnitOptions.forEach(item => {
      //         item.projectTeamList.forEach(item2 => {
      //           if (item2.projectRoleCode === 'PR-LEADER-UNDERTAKER-MEMBER' || item2.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER') {
      //             member.push(item2)
      //           }
      //         })
      //       })
      //       member.forEach(item => {
      //         res.records.some(item2 => {
      //           if (item.userAccount === item2.value) {
      //             responsiblePersonOptions.push(item2)
      //           }
      //         })
      //       })
      //       this.responsiblePersonOptions = responsiblePersonOptions
      //     }
      //   })
      //   .catch(e => {
      //     if (e.selfError) return
      //     this.$message({
      //       message: e.message || '用户列表获取失败',
      //       type: 'error',
      //       showClose: true
      //     })
      //   })
      let sendData = {
        'projectCode': this.parentCode,
        'organizationCode': val
      }
      if (type === 'd') { //成果需求人和需求单位团队成员有关
        sendData.projectRoleCodes = ['PR-LEADER-DEMAND-MEMBER', 'PR-PARTNER-DEMAND-MEMBER', 'PR-LEADER-DEMAND-MANAGER', 'PR-PARTNER-DEMAND-MANAGER']
      }
      if (type === 'u') { //成果负责人和承担单位团队成员有关
        sendData.projectRoleCodes = ['PR-LEADER-UNDERTAKER-MEMBER', 'PR-PARTNER-UNDERTAKER-MEMBER', 'PR-LEADER-UNDERTAKER-MANAGER', 'PR-PARTNER-UNDERTAKER-MANAGER']
      }
      if (userName) {
        sendData.userName = userName
      }
      APIAchievement.queryProjectTeamList(sendData)
        .then(res => {
          res = res || []
          res.forEach(item => {
            item.label = item.userName
            item.value = item.userAccount
          })
          if (type === 'd') { //成果需求人和需求单位团队成员有关
            this.demandUnitResponsibleNameOptions = res
            if (this.tableDataInForm.demandUnitResponsibleName) {
              let hasSelectManager = this.demandUnitResponsibleNameOptions.some(item2 => {
                return item2.userAccount === this.tableDataInForm.demandUnitResponsibleName.value
              })
              if (!hasSelectManager) {
                this.tableDataInForm.demandUnitResponsibleName.isHidden = true
                this.demandUnitResponsibleNameOptions = this.demandUnitResponsibleNameOptions.concat(this.tableDataInForm.demandUnitResponsibleName)
              }
            }
          }
          if (type === 'u') { //成果负责人和承担单位团队成员有关
            this.responsiblePersonOptions = res
            if (this.tableDataInForm.responsiblePerson) {
              let hasSelectManager = this.responsiblePersonOptions.some(item2 => {
                return item2.userAccount === this.tableDataInForm.responsiblePerson.value
              })
              if (!hasSelectManager) {
                this.tableDataInForm.responsiblePerson.isHidden = true
                this.responsiblePersonOptions = this.responsiblePersonOptions.concat(this.tableDataInForm.responsiblePerson)
              }
            }
          }
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '用户列表获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    undertakeUnitDeptChange (val, row) { //表格承担单位选中的时候要给承担单位名称 code 赋值
      this.budgetForm.tableData.some(item => {
        if (item.selfId === row.selfId) {
          this.undertakeUnitDeptOptions.some(item2 => {
            if (val === item2.value) {
              item.undertakeUnitDept = item2.label
            }
            if (val === '') {
              item.undertakeUnitDept = ''
            }
          })
        }
      })
      this.undertakeUnitDeptOptions.forEach(item => {
        let flag = this.budgetForm.tableData.some(item2 => {
          return item2.undertakeUnitDeptCode === item.value
        })
        if (flag) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },
    undertakeUnitDeptDisabled (row) { //让承担单位部门不能修改
      let canEdit = false
      row.budgetList.forEach(item => {
        if (item.timeYear < this.curYear) {
          if ((item.budgetInsourcing !== '' && item.budgetInsourcing !== null && item.budgetInsourcing !== '-') || (item.budgetOutsourcing !== '' && item.budgetOutsourcing !== null && item.budgetOutsourcing !== '-') || (item.staffTime !== '' && item.staffTime !== null && item.staffTime !== '-')) {
            canEdit = true
          }
        }
      })
      return canEdit
    },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    // 日期格式化
    formatDate1 (val) {
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
      this.$refs.aDialogDetail.acceptData(row, 'd', 'edit', this.yearRange)
    },
    //对部分表单字段进行校验
    validateField (form, rowindex) {
      let result = true
      for (let item of this.$refs[form].fields) {
        if (item.prop.charAt(item.prop.length - 1) === rowindex.toString()) {
          this.$refs[form].validateField(item.prop, (error) => {
            if (error !== '') {
              result = false
            }
          })
        }
      }
      return result
    },
    // 设置表单必填校验
    setRules (prop, index, rowindex) {
      let temp = ''
      if (prop === 'undertakeUnitDept') {
        temp = this.budgetForm.tableData[rowindex].undertakeUnitDept
      } else {
        temp = this.budgetForm.tableData[rowindex].budgetList[index][prop]
      }
      let checkEmpty = (rule, value, callback) => {
        if (temp === '') {
          callback(new Error('该项不能为空'))
        } else {
          callback()
        }
      }
      let rules = [
        { validator: checkEmpty, required: true, message: '该项不能为空', trigger: ['blur', 'change'] }
      ]
      return rules
    },
    dialogVisibleSave () { //提交校验顶部表单和下面表单 2 个,判断是新增还是编辑
      let flagcount = 0
      this.$refs.tableDataInForm.validate(valid => {
        if (valid) {
          flagcount += 1
        }
      })
      this.$refs.budgetForm.validate(valid => {
        if (valid) {
          flagcount += 1
        }
      })
      if (this.budgetForm.tableData.length <= 1) {
        this.$message({
          message: '至少新增一条任务及成果预算！',
          type: 'warning',
          showClose: true
        })
        return
      }
      if (flagcount === 2) {
        let achievementBudgetList = []
        this.budgetForm.tableData.forEach(item => {
          if (item.type !== 'total') {
            item.budgetList.forEach(item2 => {
              item2.projectCode = this.parentCode
              item2.undertakeUnitDept = item.undertakeUnitDept
              item2.undertakeUnitDeptCode = item.undertakeUnitDeptCode
              item2.budgetInsourcing = item2.budgetInsourcing ? item2.budgetInsourcing : '0.000000'
              item2.budgetOutsourcing = item2.budgetOutsourcing ? item2.budgetOutsourcing : '0.000000'
              item2.staffTime = item2.staffTime ? item2.staffTime : '0.00'
              if (item2.budgetInsourcing === '-' || item2.budgetOutsourcing === '-' || item2.staffTime === '-') {

              } else {
                achievementBudgetList.push(item2)
              }
            })
          }
        })
        let sendData = {
          'subProjectCode': this.subProjectCode,
          'parentCode': this.parentCode,
          'projectAchievement': {
            'projectCode': this.parentCode,
            'achievementName': this.tableDataInForm.achievementName, //1任务名称
            'achievementType': this.tableDataInForm.achievementTypeValue, //2成果类型
            'deliveryTime': this.tableDataInForm.deliveryTime, //3任务预期交付时间
            'demandUnit': this.tableDataInForm.demandUnit.label, //4需求单位
            'demandUnitCode': this.tableDataInForm.demandUnit.value, //4需求单位
            'demandUnitDept': this.tableDataInForm.demandUnitDept.label, //5需求部门
            'demandUnitDeptCode': this.tableDataInForm.demandUnitDept.value, //5需求部门
            'demandUnitResponsibleName': this.tableDataInForm.demandUnitResponsibleName.label, //6成果需求人
            'demandUnitResponsibleAccount': this.tableDataInForm.demandUnitResponsibleName.value, //6成果需求人
            'undertakeUnit': this.tableDataInForm.undertakeUnit.label, //7承担单位
            'undertakeUnitCode': this.tableDataInForm.undertakeUnit.value, //7承担单位
            'undertakeUnitDept': this.tableDataInForm.undertakeUnitDept.label, //8承担部门
            'undertakeUnitDeptCode': this.tableDataInForm.undertakeUnitDept.value, //8承担部门
            'responsiblePerson': this.tableDataInForm.responsiblePerson.label, //9成果负责人
            'responsibleUid': this.tableDataInForm.responsiblePerson.value, //9成果负责人
            'undertakeProjectCode': this.tableDataInForm.undertakeProjectCode, // 承担单位项目编码
            'achievementBudgetList': achievementBudgetList
          }
        }
        if (this.dialogTitle === '编辑预期成果') { //编辑
          sendData.projectAchievement.id = this.editInfo.id
          sendData.projectAchievement.achievementCode = this.editInfo.achievementCode
          APIGroupPlan.editAchievementD(sendData)
            .then(res => {
              this.$message({
                message: '编辑成功',
                type: 'success',
                showClose: true
              })
              this.dialogVisible = false
              this.$emit('reflashAchieveMentList', this.subProjectCode)
              bus.$emit('planTimeChange')
              this.$emit('change')
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '编辑预期成果失败',
                  type: 'error',
                  showClose: true
                })
              }
            })
        } else { //新增
          APIGroupPlan.addAchievementD(sendData)
            .then(res => {
              this.$message({
                message: '新增成功',
                type: 'success',
                showClose: true
              })
              this.dialogVisible = false
              this.$emit('reflashAchieveMentList', this.subProjectCode)
              bus.$emit('planTimeChange')
              this.$emit('change')
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '新增预期成果失败',
                  type: 'error',
                  showClose: true
                })
              }
            })
        }
      }
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
      if (!this.parentCode) {
        this.$message({
          message: '请先保存基本信息！',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.tableDataInForm = {
        achievementName: '',
        achievementTypeValue: '',
        demandUnit: '',
        undertakeUnit: '',
        demandUnitDept: '',
        undertakeUnitDept: '',
        demandUnitResponsibleName: '',
        responsiblePerson: '',
        deliveryTime: ''
      }
      this.demandUnitDeptOptions = []
      this.undertakeUnitDeptOptions = []
      this.responsiblePersonOptions = []
      this.demandUnitResponsibleNameOptions = []
      this.dialogTitle = '新增预期成果'
      let budgetList = []
      this.yearRange.forEach(item => {
        let obj = { budgetInsourcing: '', budgetOutsourcing: '', staffTime: '' }
        obj.timeYear = item
        budgetList.push(obj)
      })
      this.budgetForm.tableData = [] //清空数据
      this.budgetForm.tableData.push({ type: 'total', undertakeUnitDept: '', undertakeUnitDeptCode: '', budgetList: budgetList, totalAmount: '' })
      this.getDictValByCode()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.tableDataInForm.clearValidate()
        this.$refs.budgetForm.clearValidate()
      })
    },
    editAchievement (row) {
      if (row.editFlag !== '1') {
        this.$message({
          type: 'warning',
          message: '此成果不可编辑!'
        })
        return
      }
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('subproject')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.tableDataInForm = {
        achievementName: row.achievementName,
        achievementTypeValue: row.achievementType,
        demandUnit: { label: row.demandUnit, value: row.demandUnitCode },
        undertakeUnit: { label: row.undertakeUnit, value: row.undertakeUnitCode },
        demandUnitDept: { label: row.demandUnitDept, value: row.demandUnitDeptCode },
        undertakeUnitDept: { label: row.undertakeUnitDept, value: row.undertakeUnitDeptCode },
        demandUnitResponsibleName: { label: row.demandUnitResponsibleName, value: row.demandUnitResponsibleAccount },
        responsiblePerson: { label: row.responsiblePerson, value: row.responsibleUid },
        deliveryTime: row.deliveryTime ? row.deliveryTime : '',
        undertakeProjectCode: row.undertakeProjectCode,
        linkFlag: row.linkFlag
      }
      this.getOrgListByParentOrgCode(this.tableDataInForm.demandUnit.value, 'd') //查询需求部门 options
      this.getOrgListByParentOrgCode(this.tableDataInForm.undertakeUnit.value, 'u') //查询承担部门 options
      // this.getAllUserPageByorgCode(this.tableDataInForm.demandUnitDept.value, 'd') //成果需求人
      // this.getAllUserPageByorgCode(this.tableDataInForm.undertakeUnitDept.value, 'u') //成果负责人
      this.getAllUserPageByorgCode(this.tableDataInForm.demandUnit.value, 'd') //成果需求人
      this.getAllUserPageByorgCode(this.tableDataInForm.undertakeUnit.value, 'u') //成果负责人
      this.dialogTitle = '编辑预期成果'
      this.editInfo = { id: row.id, achievementCode: row.achievementCode }
      let newAchievementBudgetList = JSON.parse(JSON.stringify(row.achievementBudgetList)) || []
      newAchievementBudgetList.forEach(item => {
        item.selfId = this.selfId++
        item.type = 'data'
        let budgetList = [] //item 里面的budgetList 每一行中 2020 年 2021 年数据
        this.yearRange.forEach(item2 => { //循环遍历每年,有的话填进去,没有加一行
          let hasYearData = false
          item.budgetList.some(item3 => {
            if (item2 === item3.timeYear) {
              item3.budgetInsourcing = item3.budgetInsourcing === null ? '0.000000' : item3.budgetInsourcing
              item3.budgetOutsourcing = item3.budgetOutsourcing === null ? '0.000000' : item3.budgetOutsourcing
              item3.staffTime = item3.staffTime === null ? '0.00' : item3.staffTime
              item3.budgetInsourcing = item3.budgetInsourcing === '0.000000' ? '' : item3.budgetInsourcing
              item3.budgetOutsourcing = item3.budgetOutsourcing === '0.000000' ? '' : item3.budgetOutsourcing
              item3.staffTime = item3.staffTime === '0.00' ? '' : item3.staffTime
              budgetList.push(item3)
              hasYearData = true
            }
          })
          if (hasYearData) {
          } else { //获取人力成本
            // budgetList.push({ timeYear: item2, budgetInsourcing: '-', budgetOutsourcing: '-', staffTime: '-', avgLaborCost: '0' })
            // budgetList.push({ timeYear: item2, budgetInsourcing: '0.000000', budgetOutsourcing: '0.000000', staffTime: '0.00', avgLaborCost: '0' })
            budgetList.push({ timeYear: item2, budgetInsourcing: '0.000000', budgetOutsourcing: '0.000000', staffTime: '0.00', avgLaborCost: '0' })
            // budgetList.push({ timeYear: item2, budgetInsourcing: '', budgetOutsourcing: '', staffTime: '' })
            // budgetList.push({ timeYear: item2, budgetInsourcing: '0', budgetOutsourcing: '0', staffTime: '0' })
          }
        })
        item.budgetList = budgetList
      })
      this.budgetForm.tableData = newAchievementBudgetList
      let budgetList = []
      this.yearRange.forEach(item => {
        let obj = { budgetInsourcing: '', budgetOutsourcing: '', staffTime: '' }
        obj.timeYear = item
        budgetList.push(obj)
      })
      this.budgetForm.tableData.push({ type: 'total', undertakeUnitDept: '', budgetList: budgetList, totalAmount: '' })
      this.initNumber(this.budgetForm.tableData) //编辑进来的是去掉后面多余的 0, 应该加上保持编辑页面后面有 0 统一,或者点击保存之后前端把不可编辑的行多余的0 去掉
      this.computedAll()
      this.getDictValByCode()
      this.dialogVisible = true
    },
    initNumber (tableData) { //初始化设置编辑的数据补 0
      tableData.forEach(item => {
        if (item.type === 'data') {
          item.budgetList.forEach(item2 => {
            item2.budgetInsourcing = item2.budgetInsourcing === '-' || item2.budgetInsourcing === '' ? item2.budgetInsourcing : this.getFixedNumNew(item2.budgetInsourcing, 6)
            item2.budgetOutsourcing = item2.budgetOutsourcing === '-' || item2.budgetOutsourcing === '' ? item2.budgetOutsourcing : this.getFixedNumNew(item2.budgetOutsourcing, 6)
            item2.staffTime = item2.staffTime === '-' || item2.staffTime === '' ? item2.staffTime : this.getFixedNumNew(item2.staffTime, 2)
          })
        }
      })
    },
    getDictValByCode () { //获取成果类型数据字典
      APIGroupPlan.getDictValByCode('EXPECTED-RESULT-TYPE')
        .then(res => {
          res.forEach(item => {
            item.label = item.name
            item.value = item.valueCode
          })
          this.achievementTypeValueOptions = res
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '研究领域数据字典获取失败',
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
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          APIGroupPlan.removeAchievementD({ achievementCode: listItem.achievementCode, projectCode: listItem.projectCode })
            .then(res => {
              this.$message({
                message: '删除成功',
                type: 'success',
                showClose: true
              })
              this.$emit('reflashAchieveMentList', this.subProjectCode)
              this.$emit('change')
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '提交失败',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    click_delete (row, rowindex, operateType = '') { //删除行部门
      let candel = true
      if (operateType === 'edit') {
        this.budgetForm.tableData.some((item, index) => {
          if (row.selfId === item.selfId) {
            row.budgetList.forEach(item => {
              if (item.timeYear < this.curYear) {
                if ((item.budgetInsourcing !== '' && item.budgetInsourcing !== null && item.budgetInsourcing !== '-') || (item.budgetOutsourcing !== '' && item.budgetOutsourcing !== null && item.budgetOutsourcing !== '-') || (item.staffTime !== '' && item.staffTime !== null && item.staffTime !== '-')) {
                  candel = false
                }
              }
            })
          }
        })
      }
      if (!candel) {
        this.$message({
          type: 'warning',
          message: '之前年度预算大于零,不可以删除!'
        })
        return
      }
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.budgetForm.tableData.some((item, index) => {
            if (row.selfId === item.selfId) {
              this.budgetForm.tableData.splice(index, 1)
              this.$refs.budgetForm.clearValidate()
              this.computedAll()
            }
          })
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    click_edit (row) { //编辑行
      // console.log(row)
      this.budgetForm.tableData.some(item => {
        if (item.selfId === row.selfId) {
          item.type = 'edit'
          item.budgetList.forEach(async item2 => {
            item2.budgetInsourcing = item2.budgetInsourcing.replace(/[^\d.]/g, '')
            item2.budgetOutsourcing = item2.budgetOutsourcing.replace(/[^\d.]/g, '')
            item2.staffTime = item2.staffTime.replace(/[^\d.]/g, '')
            if (item2.avgLaborCost === '0') {
              let res = await APIAchievement.queryAvgLaborCost({ projectCode: this.parentCode, undertakeUnitCode: this.tableDataInForm.undertakeUnit.value, timeYear: item2.timeYear })
              res = new BigNumber(res)
                .div('10000')
                .toFixed(8)
              item2.avgLaborCost = res
            }
          })
        }
      })
      this.undertakeUnitDeptOptions.forEach(item => {
        let flag = this.budgetForm.tableData.some(item2 => {
          return item2.undertakeUnitDeptCode === item.value
        })
        if (flag) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },
    click_save1 (row, rowindex) { //编辑保存
      if (!this.validateField('budgetForm', rowindex)) return
      this.budgetForm.tableData.some(item => {
        if (item.selfId === row.selfId) {
          item.type = 'data'
        }
      })
    },
    click_save (row, rowindex) { //保存行部门
      if (!this.validateField('budgetForm', rowindex)) return
      this.budgetForm.tableData.some(item => {
        if (item.selfId === row.selfId) {
          item.type = 'data'
        }
      })
    },
    addDepartment () { //添加弹框里面部门判断有几个年份
      let hasAddRow = this.budgetForm.tableData.some(item => {
        return item.type === 'add' || item.type === 'edit'
      })
      if (hasAddRow) {
        this.$message({
          type: 'warning',
          message: '请先保存当前页面行数据!',
          showClose: true
        })
        return
      }
      if (!this.tableDataInForm.undertakeUnit) {
        this.$message({
          type: 'warning',
          message: '请先选择承担单位!',
          showClose: true
        })
        return
      }
      let budgetList = []
      let budgetList2 = []
      let num = 0
      this.yearRange.forEach(async item => {
        let res = await APIAchievement.queryAvgLaborCost({ projectCode: this.parentCode, undertakeUnitCode: this.tableDataInForm.undertakeUnit.value, timeYear: item })
        res = new BigNumber(res)
          .div('10000')
          .toFixed(8)
        num++
        let obj = { budgetInsourcing: '', budgetOutsourcing: '', staffTime: '', avgLaborCost: res, timeYear: item }
        budgetList.push(obj)
        if (num === this.yearRange.length) {
          this.yearRange.forEach(item => {
            budgetList.some(item2 => {
              if (item2.timeYear === item) {
                budgetList2.push(item2)
              }
            })
          })
          this.budgetForm.tableData.splice(this.budgetForm.tableData.length - 1, 0, { selfId: this.selfId++, type: 'add', undertakeUnitDept: '', undertakeUnitDeptCode: '', budgetList: budgetList2, totalAmount: '' })
          this.undertakeUnitDeptOptions.forEach(item => {
            let flag = this.budgetForm.tableData.some(item2 => {
              return item2.undertakeUnitDeptCode === item.value
            })
            if (flag) {
              item.disabled = true
            } else {
              item.disabled = false
            }
          })
        }
      })
    },
    //输入时限制只能输入固定的小数位，超出位数则无法输入，直接删除掉多余的位数
    inputHandler (prop, index, row) {
      this.budgetForm.tableData.some((item, index1) => { //找到输入的这一项
        if (row.selfId === item.selfId) {
          let temp = item.budgetList[index][prop]
          if (!temp) return
          if (temp.indexOf('.') > -1) {
            let arr = temp.split('.')
            let integer = arr[0] || '0'
            // let integer = arr[0].replace(/,/g, '')
            let decimals = arr[arr.length - 1]
            let len = 6
            if (prop === 'staffTime') {
              len = 2
              integer = integer.length > 6 ? integer.slice(0, 6) : integer
            } else {
              integer = integer.length > 11 ? integer.slice(0, 11) : integer
            }
            decimals = decimals.length > len ? decimals.slice(0, len) : decimals
            temp = `${integer}.${decimals}`
          } else {
            if (prop === 'staffTime') {
              temp = temp.length > 6 ? temp.slice(0, 6) : temp
            } else {
              temp = temp.length > 11 ? temp.slice(0, 11) : temp
            }
          }
          temp = temp.replace(/[^\d.]/g, '')
          item.budgetList[index][prop] = temp
        }
      })
    },
    setNumber (prop, index, row) {
      this.budgetForm.tableData.some((item, index1) => {
        if (row.selfId === item.selfId) {
          let temp = item.budgetList[index][prop]
          if (temp === '.') {
            item.budgetList[index][prop] = ''
          }
          if (!temp) return
          item.budgetList[index][prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)
        }
      })
    },
    computedAll () {
      this.allKeys.forEach(key => {
        this.yearRange.forEach((y, index) => {
          this.computeSum(key, index, false)
        })
      })
    },
    getAvgLaborCostAndStaffTime (staffTime, avgLaborCost) { //计算自有人工乘上单位人力成本
      let x = new BigNumber(staffTime)
      let y = new BigNumber(avgLaborCost)
      //   .toFormat(8), '自有人工乘上单位人力成本')
      let res = x.times(y)
        .toFormat(6)
      res = this.delcommafy(res)
      return res
    },
    delcommafy (num) {
      num = num.replace(/,/gi, '')
      return num
    },
    computeSum (prop, index, row) { //先计算行合计再计算列合计
      this.budgetForm.tableData.pop()
      this.setNumber(prop, index, row)
      let list = [] //把costBudgetList合并数组
      let totalAmountLowerRight = '0' // 右下角合计
      let oneHasData = false
      this.budgetForm.tableData.forEach(item => { //行合计
        // let totalAmount = ''
        let totalAmount = '0.000000'
        list = list.concat(item.budgetList)
        item.budgetList.forEach(item2 => {
          totalAmount = item2.budgetInsourcing === '-' || item2.budgetInsourcing === '' ? totalAmount : this.sumFloat(totalAmount, item2.budgetInsourcing, '')
          totalAmount = item2.budgetOutsourcing === '-' || item2.budgetOutsourcing === '' ? totalAmount : this.sumFloat(totalAmount, item2.budgetOutsourcing, '')
          if (item2.staffTime !== '-' && item2.staffTime !== '') {
            let getAvgLaborCostAndStaffTime = this.getAvgLaborCostAndStaffTime(item2.staffTime, item2.avgLaborCost)
            totalAmount = this.sumFloat(totalAmount, getAvgLaborCostAndStaffTime, '')
          }
        })
        item.totalAmount = totalAmount
        if (totalAmount) { //如果有一个行合计
          oneHasData = true
          totalAmountLowerRight = this.sumFloat(totalAmountLowerRight, totalAmount)
        }
      })
      if (!oneHasData) {
        // totalAmountLowerRight = ''
        totalAmountLowerRight = '0.000000'
      }
      let budgetList = [] //列合计
      this.yearRange.forEach(item => {
        let budgetInsourcingNullCount = 0
        let budgetOutsourcingNullCount = 0
        let staffTimeNullCount = 0
        let obj = { budgetInsourcing: '0', budgetOutsourcing: '0', staffTime: '0', timeYear: item }
        list.forEach(item2 => {
          if (item === item2.timeYear) {
            if (item2.budgetInsourcing === '-' || item2.budgetInsourcing === '') {
              budgetInsourcingNullCount++
            }
            if (item2.budgetOutsourcing === '-' || item2.budgetOutsourcing === '') {
              budgetOutsourcingNullCount++
            }
            if (item2.staffTime === '-' || item2.staffTime === '') {
              staffTimeNullCount++
            }
            obj.budgetInsourcing = item2.budgetInsourcing === '-' || item2.budgetInsourcing === '' ? obj.budgetInsourcing : this.sumFloat(obj.budgetInsourcing, item2.budgetInsourcing, '')
            obj.budgetOutsourcing = item2.budgetOutsourcing === '-' || item2.budgetOutsourcing === '' ? obj.budgetOutsourcing : this.sumFloat(obj.budgetOutsourcing, item2.budgetOutsourcing, '')
            obj.staffTime = item2.staffTime === '-' || item2.staffTime === '' ? obj.staffTime : this.sumFloat(obj.staffTime, item2.staffTime, 'staffTime')
          }
        })
        if (budgetInsourcingNullCount === this.budgetForm.tableData.length) {
          obj.budgetInsourcing = '0.000000'
          // obj.budgetInsourcing = ''
        }
        if (budgetOutsourcingNullCount === this.budgetForm.tableData.length) {
          obj.budgetOutsourcing = '0.000000'
          // obj.budgetOutsourcing = ''
        }
        if (staffTimeNullCount === this.budgetForm.tableData.length) {
          obj.staffTime = '0.00'
          // obj.staffTime = ''
        }
        budgetList.push(obj)
      })
      // let totalAmount = '0' // 右下角合计
      // let oneHasData = false
      // budgetList.forEach(item => {
      //   totalAmount = this.sumFloat(totalAmount, item.budgetInsourcing, '')
      //   totalAmount = this.sumFloat(totalAmount, item.budgetOutsourcing, '')
      //   if (item.budgetInsourcing !== '' || item.budgetOutsourcing !== '') {
      //     oneHasData = true
      //   }
      //   // totalAmount = this.sumFloat(totalAmount, item.staffTime, '') //自有人工也不需要计算
      // })
      // if (!oneHasData) {
      //   totalAmount = ''
      // }
      this.budgetForm.tableData.push({ type: 'total', responsibleDepartment: '', budgetList: budgetList, totalAmount: totalAmountLowerRight })
    },
    //两位字符表示的浮点数相加求和，使用字符串是为了防止精度丢失，js大于15位的数使用parseFloat会丢失精度
    sumFloat (num1, num2, prop) {
      let int1 = num1.split('.')[0] || 0
      let int2 = num2.split('.')[0] || 0
      let decimal1 = num1.split('.')[1] || 0
      let decimal2 = num2.split('.')[1] || 0
      //如2.991000+5.999000
      //整数与整数相加，2+5=7
      let int = parseInt(int1) + parseInt(int2)
      let decimalLen = prop === 'staffTime' ? 2 : 6
      //小数位相加，再除以倍数，991+999=1990 1990/1000000=0.001990
      // let decimal = (parseInt(decimal1) + parseInt(decimal2)) / Math.pow(10, decimalLen)
      // let decimal = (parseFloat('0.' + decimal1) + parseFloat('0.' + decimal2))
      let decimal = (parseFloat('0.' + decimal1) * Math.pow(10, decimalLen) + parseFloat('0.' + decimal2) * Math.pow(10, decimalLen)) / Math.pow(10, decimalLen)
      //获取小数位相加之和补全位数，0.00199 --> 0.001990
      let newDecimal = this.getFixedNumNew(decimal + '', decimalLen)
      //整数位相加的结果再与小数位相加结果的整数位相加，小数与小数相加,7.001990，如：1+1.25 --> 2+0.25
      let sum = (int + parseInt(newDecimal.split('.')[0])) + '.' + newDecimal.split('.')[1]
      return sum
    },
    //补齐小数位,val --> string
    getFixedNumNew (val, len = 6) {
      let str = ''
      let splitArr = val.split('.')
      if (splitArr.length > 1 && splitArr[1] !== '') {
        str = parseInt(splitArr[0]) + '.'
        if (splitArr[1].length < len) {
          str = str + splitArr[1] + this.getDecimal(len - splitArr[1].length)
        } else {
          str += splitArr[1]
        }
      } else {
        //无小数位，补全
        str = parseInt(splitArr[0]) + '.' + this.getDecimal(len)
      }
      return str
    },
    //补位0
    getDecimal (len) {
      let decimal = ''
      for (let i = 0; i < len; i++) {
        decimal += '0'
      }
      return decimal
    },
    //有信息发生修改
    changeInfo (edited = true, msg = false) {
      let params = {
        curBlock: 'subproject',
        hasEdited: edited,
        onlyShowMsg: msg
      }
      bus.$emit('groupPlanProjectEdit', params)
    },
    //输入框获得焦点时，去除补位的0
    focusHandler (prop, index, row) {
      this.budgetForm.tableData.some((item, index1) => { //找到输入的这一项
        if (row.selfId === item.selfId) {
          let temp = item.budgetList[index][prop]
          if (temp === '') return true
          item.budgetList[index][prop] = this.numTransition(temp)
          return true
        }
      })
    },
    //输入框失去焦点时，补位0
    blurHandler (prop, index, row) {
      this.budgetForm.tableData.some((item, index1) => { //找到输入的这一项
        if (row.selfId === item.selfId) {
          let temp = item.budgetList[index][prop]
          if (temp === '') return true
          item.budgetList[index][prop] = prop === 'staffTime' ? this.getFixedNumNew(temp, 2) : this.getFixedNumNew(temp, 6)
          return true
        }
      })
    },
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
        // return '-'
        return '0'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.achievement{
  .inputw{
  /deep/ input{
    cursor: initial
  }
}
  .radio-box {
      // display: inline-block;
      // margin: auto 10px;
      // position: relative;
      // top: 10px;
      // height: 30px;
      .small-img {
        width: 30px;
        height: 30px;
      }
    }
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
  .addcon5{
    margin-bottom: 20px;
  }
  .addcon5 /deep/{
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

  /deep/ .el-select-dropdown__item span {
    display: inline-block;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

</style>
