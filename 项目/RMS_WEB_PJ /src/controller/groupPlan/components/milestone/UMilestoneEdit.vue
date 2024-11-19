<template>
  <!-- 承担单位一般支撑包和非一般支撑包编辑 -->
  <div class="addAndEditMilestone" v-if="detailTableMilestoneShowOrHide">
    <projectPanel title="里程碑" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button
          v-if='!meberEditFlag'
          class="normal-btn"
          @click="addMilestone"
          icon="el-icon-circle-plus-outline"
        >添加里程碑</el-button>
      </template>
      <div class="body-con">
        <!-- 新增框 -->
        <projectPanel :title="ruleForm.milestoneName"  class="addcon" v-show="addvisable">
          <template v-slot:img>
            <div style="width:16px;margin-right:10px">
              <img src="@/assets/icons/里程碑.svg" alt="" style="margin-right:10px">
            </div>
          </template>
          <template v-slot:header>
            <el-button  class="normal-btn" @click="saveAdd">保存本区块信息</el-button>
            <el-button
              style="color: #ff3f3b;border: 1px solid rgba(255, 63, 59, 0.5);"
              icon="el-icon-delete"
              @click="saveDel">删除</el-button>
          </template>
          <el-form
            :model="ruleForm"
            :rules="rules"
            label-position='right'
            ref="ruleForm"
            label-width="120px">
            <el-row style="padding-left:60px">
              <el-col :span="8">
                <el-form-item
                  label="里程碑名称:"
                  prop="milestoneName"
                >
                  <el-input
                    placeholder="请输入"
                    show-word-limit
                    v-model.trim="ruleForm.milestoneName"
                    @change="changeValue('add')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="计划完成时间:"
                  prop="planFinishTime"
                >
                  <el-date-picker
                    style="width:100%"
                    v-model="ruleForm.planFinishTime"
                    type="date"
                    :default-value="Date.now()"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    placeholder="请选择"
                    @change="changeValue('add')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="里程碑责任人:"
                  prop="milestoneLeader">
                  <el-select
                    @visible-change="serarchProjectManagerAdd('',$event)"
                    @change='addMilestoneLeaderUidChange'
                    v-model="ruleForm.milestoneLeaderUid"
                    placeholder="请选择"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="ruleForm2.addProjectManager"
                        placeholder="请输入名称"
                        clearable
                        @input="judgeserarchProjectManagerAdd"
                        @keyup.enter.native="serarchProjectManagerAdd(ruleForm2.addProjectManager)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchProjectManagerAdd(ruleForm2.addProjectManager)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-show='!item.isHiden'
                      v-for="item in milestoneLeaderOptions"
                      :key="item.milestoneLeaderUid"
                      :label="item.milestoneLeader"
                      :value="item.milestoneLeaderUid"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="ruleForm2.addProjectManager"
                          placeholder="请输入名称"
                          clearable
                          @input="judgeserarchProjectManagerAdd"
                          @keyup.enter.native="serarchProjectManagerAdd(ruleForm2.addProjectManager)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchProjectManagerAdd(ruleForm2.addProjectManager)"
                        >
                        </i>
                        </el-input>
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  label-position="right"
                  label="里程碑描述:"
                  prop="milestoneDescription"
                >
                  <el-input
                    style="width:100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    v-model="ruleForm.milestoneDescription"
                    @change="changeValue('add')">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  label="是否关联预期成果:"
                  prop="linkResultFlag"
                >
                  <el-radio-group  v-model="ruleForm.linkResultFlag" @change='addRadioChange(ruleForm.linkResultFlag)'>
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  v-if="ruleForm.linkResultFlag=='1'"
                  label-position="right"
                  label="关联预期成果信息:"
                  prop='resultInformationList'
                >
                  <div class="tabcon">
                    <div
                      class="item"
                      v-for="item in ruleForm.resultInformationList"
                      :key="item.id"
                      v-show='ruleForm.resultInformationList'>
                      <el-tooltip
                        :disabled='item.achievementName && item.achievementName.length<8'
                        :content="item.achievementName"
                        effect="dark"
                        placement="top">
                        <span class="tooltip-span">{{item.achievementName}}</span>
                      </el-tooltip>
                      <span class="close" @click="deladdcg(item)">x</span>
                    </div>
                    <span class="butt" @click="addLinkResults" style="cursor: pointer;">
                      <i  style="border: none;" class="normal-btn el-icon-circle-plus-outline"></i>
                    </span>
                    <div v-show='!ruleForm.resultInformationList' style="color: #979BA1;font-size: 14px;">请选择</div>
                  </div>
                </el-form-item>
                <!-- <div style="display: flex;margin-bottom: 20px" v-if="ruleForm.linkResultFlag=='1'">
                  <div>
                    <span style="color:red;">&nbsp;*&nbsp;</span>
                    <span style="font-size:14px;color:#666;">关联预期成果信息:</span>
                  </div>
                  <div style="flex:1;">
                    <div style="position: relative;margin-left:8px;padding: 8px 10px 0 15px;border:1px solid #E5E5E5;width:100%;min-height:40px;box-sizing:border-box;border-radius:4px;">
                      <span
                        style="position: relative;margin-right:16px"
                        v-for="item in ruleForm.resultInformationList"
                        :key="item.id">
                        {{item.achievementName}}
                        <span @click="deladdcg(item)" style="color:red;position: absolute;right:-10px;top:-6px;cursor:pointer;z-index:99;">x</span>
                        <span v-show='!ruleForm.resultInformationList' style="color: #979BA1;font-size: 14px;">请选择</span>
                      </span>
                      <span @click="addLinkResults" style="position: absolute;right:10px;top:8px;z-index:99;cursor:pointer"><i class="el-icon-circle-plus-outline" style="color:#0b82ff"></i></span>
                    </div>
                  </div>
                </div> -->
                <el-form-item
                  label-width="180px"
                  v-if="ruleForm.linkResultFlag=='0'"
                  label-position="right"
                  label="预期成果信息:"
                  prop="resultInformation"
                >
                  <el-input
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    v-model="ruleForm.resultInformation"
                    @change="changeValue('add')">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </projectPanel>
        <!-- 列表 -->
        <projectPanel
          :title="listItem.milestoneName"
          :tip-icon="!listItem.editable"
          :tip="listItem.editable ? '' :'里程碑完成申请流程存在在途或者已完成的单据时，不可编辑里程碑信息。'"
          class="addcon"
          v-for="(listItem,index) in list"
          :key="listItem.id"
          :expand-prop="index===0? true:false">
          <template v-slot:img>
            <div style="width:16px;margin-right:10px">
              <img src="@/assets/icons/里程碑.svg" alt="" style="margin-right:10px">
            </div>
          </template>
          <template v-slot:header v-if="listItem.editable">
            <el-button  @click="saveListItem(listItem)"  class="normal-btn" v-if='!meberEditFlag'>保存本区块信息</el-button>
            <el-button
              v-if='!meberEditFlag'
              style="color: #ff3f3b;border: 1px solid rgba(255, 63, 59, 0.5);"
              icon="el-icon-delete"
              @click="listItemDel(listItem)">删除</el-button>
          </template>
          <el-form
            :model="listItem"
            :rules="rules"
            label-position='right'
            :ref="'listItem'+listItem.id"
            label-width="120px">
            <el-row style="padding-left:60px">
              <el-col :span="8">
                <el-form-item
                  label="里程碑名称:"
                  prop="milestoneName"
                >
                  <el-input
                    :disabled='meberEditFlag'
                    v-if="listItem.editable"
                    placeholder="请输入"
                    show-word-limit
                    v-model.trim="listItem.milestoneName"
                    @change="changeValue(listItem.id)"
                  ></el-input>
                  <span v-else>{{listItem.milestoneName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="计划完成时间:"
                  prop="planFinishTime"
                >
                  <el-date-picker
                    :disabled='meberEditFlag'
                    v-if="listItem.editable"
                    style="width:100%"
                    v-model="listItem.planFinishTime"
                    type="date"
                    :default-value="Date.now()"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    placeholder="请选择"
                    @change="changeValue(listItem.id)"
                  ></el-date-picker>
                  <span v-else>{{listItem.planFinishTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="里程碑责任人:"
                  prop="milestoneLeader">
                  <el-select
                    :disabled='meberEditFlag'
                    v-if="listItem.editable"
                    @visible-change="serarchProjectManagerEdit(listItem.id,'',$event)"
                    @change='editMilestoneLeaderUidChange($event,listItem)'
                    v-model="listItem.milestoneLeaderUid"
                    placeholder="请选择"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="listItem.editProjectManager"
                        placeholder="请输入名称"
                        clearable
                        @input="judgeserarchProjectManagerEdit($event,listItem.id)"
                        @keyup.enter.native="serarchProjectManagerEdit(listItem.id,listItem.editProjectManager)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchProjectManagerEdit(listItem.id,listItem.editProjectManager)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-show='!item.isHiden'
                      v-for="item in listItem.milestoneLeaderOptions"
                      :key="item.milestoneLeaderUid"
                      :label="item.milestoneLeader"
                      :value="item.milestoneLeaderUid"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="listItem.editProjectManager"
                          placeholder="请输入名称"
                          clearable
                          @input="judgeserarchProjectManagerEdit($event,listItem.id)"
                          @keyup.enter.native="serarchProjectManagerEdit(listItem.id,listItem.editProjectManager)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchProjectManagerEdit(listItem.id,listItem.editProjectManager)"
                        >
                        </i>
                        </el-input>
                      </div>
                    </template>
                  </el-select>
                  <span v-else>{{listItem.milestoneLeader}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  label-position="right"
                  label="里程碑描述:"
                  prop="milestoneDescription"
                >
                  <el-input
                    :disabled='meberEditFlag'
                    v-if="listItem.editable"
                    style="width:100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    v-model="listItem.milestoneDescription"
                    @change="changeValue(listItem.id)">
                  </el-input>
                  <span v-else>{{listItem.milestoneDescription}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  label="是否关联预期成果:"
                  prop="linkResultFlag"
                >
                  <el-radio-group
                    :disabled='meberEditFlag'
                    v-if="listItem.editable"
                    v-model="listItem.linkResultFlag"
                    @change='listRadioChange(listItem,listItem.linkResultFlag)'>
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                  <span v-else>{{listItem.linkResultFlag==='1'?'是':'否'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  v-if="listItem.linkResultFlag=='1'"
                  label-position="right"
                  label="关联预期成果信息:"
                  prop='resultInformationList'
                >
                  <div class="tabcon" v-if="listItem.editable">
                    <div :class="{'disabled':meberEditFlag}"></div>
                    <div
                      class="item"
                      v-for="item in listItem.resultInformationList"
                      :key="item.id"
                      v-show='listItem.resultInformationList'>
                      <el-tooltip
                        :disabled='item.achievementName && item.achievementName.length<8'
                        :content="item.achievementName"
                        effect="dark"
                        placement="top">
                        <span class="tooltip-span">{{item.achievementName}}</span>
                      </el-tooltip>
                      <span class="close" @click="deleditcg(listItem,item)">x</span>
                    </div>
                    <span class="butt" @click="addLinkResults(listItem)" style="cursor: pointer;">
                      <i  style="border: none;" class="normal-btn el-icon-circle-plus-outline"></i>
                    </span>
                    <div v-show='!listItem.resultInformationList' style="color: #979BA1;font-size: 14px;">请选择</div>
                  </div>
                  <div class="tabcon1" v-else>
                    <div
                      class="item"
                      v-for="(item,i) in listItem.resultList"
                      :key="item.id"
                      v-show='listItem.resultList'>
                      <span>{{item.achievementName}}</span>
                      <span v-if="i+1!=listItem.resultList.length">;</span>
                    </div>
                  </div>
                </el-form-item>
                <!-- <div style="display: flex;margin-bottom: 20px" v-if="listItem.linkResultFlag=='1'">
                  <div>
                    <span style="color:red;">&nbsp;*&nbsp;</span>
                    <span style="font-size:14px;color:#666;">关联预期成果信息:</span>
                  </div>
                  <div style="flex:1;" v-if="listItem.editable">
                    <div style="position: relative;margin-left:8px;padding: 8px 10px 0 15px;border:1px solid #E5E5E5;width:100%;min-height:40px;box-sizing:border-box;border-radius:4px;">
                      <span
                        style="position: relative;margin-right:16px"
                        v-for="item in listItem.resultInformationList"
                        :key="item.id">
                        {{item.achievementName}}
                        <span style="color:red;position: absolute;right:-10px;top:-6px;cursor:pointer;z-index:99;" @click="deleditcg(listItem,item)">x</span>
                        <span v-show='!listItem.resultInformationList'>请选择</span>
                      </span>
                      <span style="position: absolute;right:10px;top:8px;z-index:99;cursor:pointer" @click="addLinkResults(listItem)"><i class="el-icon-circle-plus-outline" style="color:#0b82ff"></i></span>
                    </div>
                  </div>
                  <div class="tabcon1" v-else>
                    <div
                      class="item"
                      v-for="item in listItem.resultList"
                      :key="item.id"
                      v-show='listItem.resultList'>
                      <span>{{item.achievementName}}</span>
                      <span>;</span>
                    </div>
                  </div>
                </div> -->
                <el-form-item
                  label-width="180px"
                  v-if="listItem.linkResultFlag=='0'"
                  label-position="right"
                  label="预期成果信息:"
                  prop="resultInformation"
                >
                  <el-input
                    :disabled='meberEditFlag'
                    v-if="listItem.editable"
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    v-model="listItem.resultInformation"
                    @change="changeValue(listItem.id)">
                  </el-input>
                  <span v-else class="wrap">{{listItem.resultInformation}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </projectPanel>
      </div>
      <!-- 关联成果弹框 -->
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
              label="子项目名称:"
              prop="name"
              style="margin-right:20px;margin-bottom:10px"
            >
              <el-select
                :popper-append-to-body="false"
                @keyup.enter.native="getResSearch"
                v-model="tableDataInForm.name"
                placeholder="请选择"
                style="width:220px"
                clearable>
                <el-option
                  v-for="item in getSubProjectOptions"
                  :key="item.id"
                  :label="item.projectName ? item.projectName:' '"
                  :value="item.subProjectCode"
                  style="max-width:320px">
                  <el-tooltip
                    :content="item.projectName ? item.projectName:' '"
                    placement="top"
                    effect="dark"
                    :disabled="!isShowTip(item.projectName ? item.projectName:' ')">
                    <span class="title">{{item.projectName ? item.projectName:' '}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-position="right"
              label="成果类型:"
              prop="resultType"
              style="margin-right:10px;margin-bottom:10px">
              <el-select
                :popper-append-to-body="false"
                @keyup.enter.native="getResSearch"
                v-model="tableDataInForm.resultType"
                placeholder="请选择"
                style="width:220px"
                clearable>
                <el-option
                  v-for="item in rwtypeoptions"
                  :key="item.id"
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
              prop="demandUnit"
              style="margin-right: 378px;margin-bottom:10px"
            >
              <el-select
                :popper-append-to-body="false"
                @keyup.enter.native="getResSearch"
                v-model="tableDataInForm.demandUnit"
                placeholder="请选择"
                style="width:220px"
                clearable>
                <el-option
                  v-for="item in getDemendUnitOptions"
                  :key="item.id"
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
    </projectPanel>
  </div>
</template>
<script>
import APIGroupPlan from '@/serve/API_groupPlanProject'
import selfTable from '@/components/table/index'
import projectPanel from '@/controller/components/projectPanel'
import API from '@/serve/API_project.js'
import bus from '@/common/bus'
import APIAchievement from './achievement.js'
import { addNum, deleteZero } from '@/utils/numberAdd'
import { isShowToolTip } from '@/utils/common.js'
export default {
  props: {
    receiveData: {
      type: Object,
      default: () => {}
    },
    parentCode: {
      type: String,
      default: ''
    },
    projectCode: {
      type: String,
      default: ''
    },
    projectName: {
      type: String,
      default: ''
    },
    saveFlag: {
      type: Boolean,
      default: false
    },
    //是否可编辑
    canEdit: {
      type: Boolean,
      default: true
    },
    //当前区块是否已暂存
    isSave: {
      type: Object,
      default: () => {}
    },
    tipLanguage: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    projectPanel, selfTable
  },
  data () {
    let validSameName = (rule, value, callback) => {
      let flag = false
      let allList = JSON.parse(JSON.stringify(this.list))
      if (this.addvisable) {
        allList = allList.concat(this.ruleForm)
      }
      let count = 0 //对比新增里程碑和list
      allList.forEach(item => {
        if (item.milestoneName === value) {
          count++
        }
      })
      flag = count > 1
      if (flag) {
        callback(new Error('里程碑名称不可重复'))
      } else {
        callback()
      }
    }
    const that = this
    return {
      meberEditFlag: false,
      maxAndMin: { max: 0, min: 0 },
      list: [], //里程碑列表
      rwtypeoptions: [{ label: '标准化-立项', value: '标准化-立项' }], //任务类型/成果类型 options
      cgfzroptions: [{ label: 'cmss@1', value: 'cmss@1' }], //成果负责人 options
      getDemendUnitOptions: [], //弹框需求单位列表 options
      getSubProjectOptions: [], //弹框需求单位子项目 options
      milestoneLeaderOptions: [],
      tableDataIn: { //内层详情表格数据
        body: { pageSize: 10, pageNum: 1 },
        total: 12,
        list: []
      },
      loading: false,
      tableColsIn: [
        { label: '子项目名称', prop: 'subProjectName', align: 'left', overflow: true, resizable: false },
        { label: '任务名称', prop: 'achievementName', align: 'left', overflow: true, resizable: false },
        { label: '成果类型', prop: 'achievementTypeValue', align: 'left', overflow: true, resizable: false },
        { label: '需求单位', prop: 'demandUnit', align: 'left', overflow: true, resizable: false },
        { label: '合作开发费-委外(万元)', prop: 'budgetOutsourcing', align: 'left', overflow: true, resizable: false },
        { label: '合作开发费-委内(万元)', prop: 'budgetInsourcing', align: 'left', overflow: true, resizable: false },
        { label: '自有人工预算(人月)', prop: 'staffTime', align: 'left', overflow: true, resizable: false }
      ],
      tableDataInSearchMoreFlag: '0', //弹框搜索更多 0隐藏 1 显示更多
      tableDataInForm: { //弹框搜索表单
        // subProjectName: '',
        demandUnit: '',
        name: '',
        // responsibleUid: '',
        resultType: ''
      },
      dialogVisible: false,
      addvisable: false, //新增显隐
      pickerOptions: {
        disabledDate (time) {
          return (time.getTime() < Date.now() - 8.64e7 || //禁用以前的日期，今天不禁用
          time.getTime() > that.$props.receiveData.planFinishTime) // 里程碑计划完成时间-不能大于项目计划结项时间
          // return date.getTime() <= Date.now();    //禁用今天以及以前的日期
        }
      },
      ruleForm2: {
        addProjectManager: ''
      },
      ruleForm: {
        milestoneName: '', //里程碑名称
        planFinishTime: '', //计划结束时间
        milestoneLeader: '', //里程碑责任人
        milestoneDescription: '', //里程碑描述
        linkResultFlag: '1', //是否关联成果
        resultInformationList: [], //关联的成果
        resultInformation: '', //关联成果输入框
        milestoneLeaderUid: ''
      },
      rules: {
        milestoneName: [
          { required: true, message: '请输入里程碑名称', trigger: ['change', 'blur'] },
          { max: 128, message: '长度在128个字符以内', trigger: ['change', 'blur'] },
          { validator: validSameName, trigger: ['change', 'blur'] }
        ],
        planFinishTime: [{ required: true, message: '请选择计划完成时间', trigger: ['change', 'blur'] }],
        milestoneLeader: [{ required: true, message: '请选择里程碑责任人', trigger: ['change', 'blur'] }],
        linkResultFlag: [{ required: true, message: '请选择是否关联预期成果', trigger: ['change', 'blur'] }],
        resultInformation: [{ required: true, message: '请输入预期成果信息', trigger: ['change', 'blur'] }],
        resultInformationList: [{ required: true, message: '请选择关联预期成果信息', trigger: ['change', 'blur'] }]
      },
      editLinkResultFlagId: '', //关联成果弹框打开的时候判断是新增的打开还是列表的打开
      isEditable: true,
      isTempSave: {},
      editMilestoneId: '', //标识当前哪个里程碑有字段被改动并且未暂存
      projectCategory: '',
      addvisableForm: [],
      detailTableMilestoneShowOrHide: true,
      language: '里程碑中所有可编辑字段都是基线字段；',
      checkData: [
        {
          label: 'milestoneName',
          value: '里程碑名称'
        }, {
          label: 'milestoneDescription',
          value: '里程碑描述'
        }, {
          label: 'planFinishTime',
          value: '计划完成时间'
        }, {
          label: 'milestoneLeader',
          value: '里程碑责任人'
        }, {
          label: 'resultInformationList',
          value: '预期成果'
        }, {
          label: 'linkResultFlag',
          value: '是否关联预期成果'
        }],
      cachedTeamInfo: [] //当前页面展示的项目经理和项目成员
    }
  },
  watch: {
    tipLanguage: {
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
              this.language = '里程碑中所有可编辑字段都是基线字段；'
              return
            }
            this.language = `里程碑中的基线字段：${add.join('、')}；`
          } else {
            this.language = '里程碑中没有基线字段；'
          }
        }
      }
    },
    canEdit: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.isEditable = val
      }
    },
    isSave: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.isTempSave = val
      }
    }
  },
  created () {
    this.projectCategory = this.$route.query.projectCategory
    if (this.projectCategory === 'd') {
      this.projectCategory = 'PC-DEMAND-UNIT'
    } else {
      this.projectCategory = 'PC-UNDERTAKE-UNIT'
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
    this.isShowMilestone()
    this.acceptCode()
  },
  methods: {
    judgeserarchProjectManagerAdd (val) {
      if (!val) {
        this.serarchProjectManagerAdd('')
      }
    },
    async serarchProjectManagerAdd (userName, boole) {
      if (boole) {
        this.ruleForm2.addProjectManager = ''
        userName = ''
      }
      let res = await this.getmanageerOptions(userName)
      res.forEach(item2 => {
        item2.milestoneLeader = item2.userName
        item2.milestoneLeaderUid = item2.userAccount
      })
      let options = []
      if (this.ruleForm.milestoneLeaderUid) {
        this.milestoneLeaderOptions.some(item2 => {
          if (item2.milestoneLeaderUid === this.ruleForm.milestoneLeaderUid) {
            options = item2
          }
        })
      }
      this.milestoneLeaderOptions = res
      if (this.ruleForm.milestoneLeaderUid) {
        let hasSelectManager = this.milestoneLeaderOptions.some(item2 => {
          return item2.milestoneLeaderUid === this.ruleForm.milestoneLeaderUid
        })
        if (!hasSelectManager) {
          options.isHiden = true
          this.milestoneLeaderOptions = this.milestoneLeaderOptions.concat(options)
        }
      }
    },
    judgeserarchProjectManagerEdit (val, listItemId) {
      if (!val) {
        this.serarchProjectManagerEdit(listItemId, '')
      }
    },
    serarchProjectManagerEdit (listItemId, userName, boole) {
      this.list.some(async item => {
        if (item.id === listItemId) {
          if (boole) {
            item.editProjectManager = ''
            userName = ''
          }
          let res = await this.getmanageerOptions(userName)
          res.forEach(item2 => {
            item2.milestoneLeader = item2.userName
            item2.milestoneLeaderUid = item2.userAccount
          })
          let options = []
          if (item.milestoneLeaderUid) {
            item.milestoneLeaderOptions.some(item2 => {
              if (item2.milestoneLeaderUid === item.milestoneLeaderUid) {
                options = item2
              }
            })
          }
          item.milestoneLeaderOptions = res
          if (item.milestoneLeaderUid) {
            let hasSelectManager = item.milestoneLeaderOptions.some(item2 => {
              return item2.milestoneLeaderUid === item.milestoneLeaderUid
            })
            if (!hasSelectManager) {
              options.isHiden = true
              item.milestoneLeaderOptions = item.milestoneLeaderOptions.concat(options)
            }
          }
          return true
        }
      })
    },
    async getmanageerOptions (userName) { //更新获取项目经理数据
      let sendData = {
        'projectCode': this.projectCode
      }
      sendData.projectRoleCodes = ['PR-LEADER-UNDERTAKER-MANAGER', 'PR-LEADER-UNDERTAKER-MEMBER', 'PR-PARTNER-UNDERTAKER-MEMBER']
      sendData.userName = userName
      try {
        // 这里处理
        let res = await APIAchievement.queryProjectTeamList(sendData) || []
        let res1 = []
        res.forEach(item => { //去重
          let hasone = res1.some(item2 => {
            return item2.userAccount === item.userAccount
          })
          if (!hasone) {
            res1.push(item)
          }
        })
        return res1
      } catch (e) {
        if (e.selfError) return
        if (e.message) {
          this.$message({
            message: e.message || '用户列表获取失败，请稍后重试！',
            type: 'error',
            showClose: true
          })
        }
      }
    },
    isShowTip (projectName) {
      return isShowToolTip(projectName, 320)
    },
    editMilestoneLeaderUidChange (val, listItem) {
      if (val) {
        this.list.forEach(item => {
          if (item.id === listItem.id) {
            item.milestoneLeaderOptions.some(item2 => {
              if (val === item2.milestoneLeaderUid) {
                item.milestoneLeader = item2.milestoneLeader
                item.milestoneLeaderUid = item2.milestoneLeaderUid
              }
            })
          }
        })
      } else {
        this.list.forEach(item => {
          if (item.id === listItem.id) {
            listItem.milestoneLeader = ''
            listItem.milestoneLeaderUid = ''
          }
        })
      }
      this.changeValue(listItem.id)
    },
    addMilestoneLeaderUidChange (val) {
      if (val) {
        this.milestoneLeaderOptions.some(item => {
          if (val === item.milestoneLeaderUid) {
            this.ruleForm.milestoneLeader = item.milestoneLeader
            this.ruleForm.milestoneLeaderUid = item.milestoneLeaderUid
          }
        })
      } else {
        this.ruleForm.milestoneLeader = ''
      }
      this.changeValue('add')
    },
    acceptCode () {
      bus.$on('sendAchievementCode', (e) => {
        if (this.addvisable) { //如果有新增表单
          if (this.list.length) { //如果有 list
            this.list.forEach(item => {
              item.resultInformationList.forEach(item2 => {
                if (item2.achievementCode === e.achievementCode) {
                  item2.achievementName = e.achievementName
                }
              })
            })
            this.ruleForm.resultInformationList.forEach(item => {
              if (item.achievementCode === e.achievementCode) {
                item.achievementName = e.achievementName
              }
            })
          } else {
            this.ruleForm.resultInformationList.forEach(item => {
              if (item.achievementCode === e.achievementCode) {
                item.achievementName = e.achievementName
              }
            })
          }
        } else {
          if (this.list.length) {
            this.list.forEach(item => {
              item.resultInformationList.forEach(item2 => {
                if (item2.achievementCode === e.achievementCode) {
                  item2.achievementName = e.achievementName
                }
              })
            })
          }
        }
      })
      bus.$on('changeTeamInfo', (data) => {
        this.cachedTeamInfo = JSON.parse(JSON.stringify(data))
        let undertakerOptions = []
        data.forEach(ele => {
          if (ele.projectRoleCode === 'PR-LEADER-UNDERTAKER-MANAGER' || ele.projectRoleCode === 'PR-MANAGER' || ele.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER') {
            ele.milestoneLeader = ele.userName
            ele.milestoneLeaderUid = ele.userAccount
            undertakerOptions.push(ele)
          }
        })
        this.milestoneLeaderOptions = undertakerOptions
        if (this.addvisable) {
          let hasUser = false
          undertakerOptions.some(item => {
            if (this.ruleForm.milestoneLeaderUid) {
              if (this.ruleForm.milestoneLeaderUid === item.milestoneLeaderUid) {
                hasUser = true
                return true
              }
            }
          })
          if (!hasUser) {
            this.$refs.ruleForm.validate(valid => {})
            this.ruleForm.milestoneLeaderUid = ''
            this.ruleForm.milestoneLeader = ''
          }
        }
        this.list.forEach(item => {
          let hasUser = false
          item.milestoneLeaderOptions = undertakerOptions
          undertakerOptions.some(item2 => {
            if (item.milestoneLeaderUid && item2) {
              if (item.milestoneLeaderUid === item2.milestoneLeaderUid) {
                hasUser = true
              }
            }
          })
          if (!hasUser) {
            if (item.editable) {
              this.$refs['listItem' + item.id][0].validate((valid) => {})
              item.milestoneLeaderUid = ''
              item.milestoneLeader = ''
            }
          }
        })
        // this.getmilestoneLeader1(undertakerOptions)
      })
      bus.$on('childProjectDelAchievement', achievementCode => {
        let results = []
        this.list.forEach(item => {
          results = results.concat(item.resultInformationList)
        })
        if (this.addvisable) {
          results = results.concat(this.ruleForm.resultInformationList)
        }
        let flag = results.some(item => item.resultCode === achievementCode)
        bus.$emit('splice', !flag)
      })
    },
    // getmilestoneLeader1 (undertakerCompany) { //获取里程碑责任人 options
    //   if (undertakerCompany.length !== 0) {
    //     undertakerCompany.forEach(item => {
    //       this.getAllUserPageByorgCode(item.organizationCode, 'u')
    //     })
    //   }
    // },
    // getAllUserPageByorgCode (val, type) { //查询成果负责人和成果需求人
    //   let sendData = {
    //     'projectCode': this.projectCode,
    //     'organizationCode': val
    //   }
    //   if (type === 'd') { //成果需求人和需求单位团队成员有关
    //     sendData.projectRoleCodes = ['PR-LEADER-DEMAND-MANAGER', 'PR-PARTNER-DEMAND-MANAGER']
    //   }
    //   if (type === 'u') { //成果负责人和承担单位团队成员有关
    //     sendData.projectRoleCodes = ['PR-LEADER-UNDERTAKER-MANAGER', 'PR-PARTNER-UNDERTAKER-MANAGER']
    //   }
    //   APIAchievement.queryProjectTeamList(sendData)
    //     .then(res => {
    //       res = res || []
    //       res.forEach(item => {
    //         item.milestoneLeader = item.userName
    //         item.milestoneLeaderUid = item.userAccount
    //       })
    //       this.milestoneLeaderOptions = res
    //     })
    //     .catch(e => {
    //       if (e.selfError) return
    //       this.$message({
    //         message: e.message || '查询里程碑责任人失败',
    //         type: 'error',
    //         showClose: true
    //       })
    //     })
    // },
    // 日期格式化
    formatDate (val) {
      return this.$formatDate(val, 'YYYY-MM-DD')
    },
    addRadioChange (linkResultFlag) { //新增单选框改变事件
      if (linkResultFlag === '1') {
        this.ruleForm.resultInformationList = []
        this.$refs.ruleForm.clearValidate('resultInformationList')
      } else {
        this.$refs.ruleForm.clearValidate('resultInformation')
      }
      this.changeValue('add')
    },
    listRadioChange (listItem, linkResultFlag) { //列表单选框改变事件
      if (linkResultFlag === '1') {
        this.list.some(item => {
          if (listItem.id === item.id) {
            item.resultInformationList = []
            if (item.resultList && item.resultList.length > 0) {
              item.resultList.forEach(r => {
                item.resultInformationList.push(r)
              })
            }
            this.$refs['listItem' + listItem.id][0].clearValidate('resultInformationList')
          }
        })
      } else {
        this.$refs['listItem' + listItem.id][0].clearValidate('resultInformation')
      }
      this.changeValue(listItem.id)
    },
    async validate () {
      let numMsg = false
      return new Promise((resolve, reject) => {
        let flag = true //默认表单都是有效,并且数组长度为最大值和最小值之间
        this.list.forEach(listItem => {
          this.$refs['listItem' + listItem.id][0].validate((valid) => {
            if (!valid) {
              flag = false
              return false
            }
          })
        })
        if (this.addvisable) { //有新增表单
          this.$refs.ruleForm.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          /* if (!(this.list.length + 1 <= this.maxAndMin.max && this.list.length + 1 >= this.maxAndMin.min)) {
            if (flag) numMsg = true //必填项校验成功时才校验数量
            flag = false
          } */
        } else { //没有新增表单
          /* if (!(this.list.length <= this.maxAndMin.max && this.list.length >= this.maxAndMin.min)) {
            if (flag) numMsg = true //必填项校验成功时才校验数量
            flag = false
          } */
        }
        if (flag) {
          if (this.list && this.list.length) {
            this.list.forEach(item => {
              item.projectCode = this.projectCode
            })
            // this.list = this.list.filter(item => item.editable)
          }
          if (this.addvisable) {
            let sendList = []
            // sendList = sendList.concat(this.list, this.ruleForm)
            this.addvisableForm = []
            this.list.forEach(item => {
              // item.linkResultInfo = item.resultInformation
              if (item.linkResultFlag === '0') { //未关联成果
                // saveParams.resultInformation = listItem.resultInformation
                item.linkResultInfo = item.resultInformation
                item.resultInformationList = []
              } else { //关联成果
                // item.resultInformationList = item.resultInformationList
                item.resultInformationList.forEach(item => {
                  item.resultCode = item.achievementCode
                })
              }
            })
            this.addvisableForm.push(this.sentSaveParams())
            sendList = sendList.concat(this.list, this.addvisableForm)
            let validTeam = sendList.some(item => {
              if (!this.validTeamInfo(item)) {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: '里程碑责任人不在团队信息的项目经理/项目成员内！'
                })
                return true
              }
            })
            if (validTeam) {
              resolve('hasTip')
            } else {
              resolve(sendList)
            }
            this.editMilestoneId = ''
          } else {
            this.list.forEach(item => {
              // item.linkResultInfo = item.resultInformation
              if (item.linkResultFlag === '0') { //未关联成果
                // saveParams.resultInformation = listItem.resultInformation
                item.linkResultInfo = item.resultInformation
                item.resultInformationList = []
              } else { //关联成果
                // item.resultInformationList = item.resultInformationList
                item.resultInformationList.forEach(item => {
                  item.resultCode = item.achievementCode
                })
              }
            })
            let validTeam = this.list.some(item => {
              if (!this.validTeamInfo(item)) {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: '里程碑责任人不在团队信息的项目经理/项目成员内！'
                })
                return true
              }
            })
            if (validTeam) {
              resolve('hasTip')
            } else {
              resolve(this.list)
            }
            this.editMilestoneId = ''
          }
        } else {
          if (numMsg) {
            let msg = ''
            if (this.maxAndMin.min === this.maxAndMin.max) {
              msg = `请添加${this.maxAndMin.min}个里程碑！`
            } else {
              msg = `请添加${this.maxAndMin.min}~${this.maxAndMin.max}个里程碑！`
            }
            this.$message({
              type: 'error',
              message: msg,
              showClose: true
            })
            resolve('false')
          } else {
            resolve(false)
          }
          return false
        }
      })
    },
    listItemDel (listItem) { //里程碑列表删除
      if (this.editMilestoneId && this.editMilestoneId !== listItem.id) { //编辑的非当前里程碑
        this.$message({
          message: '请先保存当前编辑的里程碑信息',
          type: 'warning',
          showClose: true
        })
        return
      }
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('milestone')) {
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
          let sendData = {
            'milestoneCode': listItem.milestoneCode,
            'projectCode': this.projectCode
          }
          // API.deleteMileStoneBaseInfo(sendData)
          APIGroupPlan.removeProjectMilestoneU(sendData)
            .then(res => {
              this.$message({
                message: '删除成功！',
                type: 'success',
                showClose: true
              })
              this.editMilestoneId = ''
              this.getList() //刷新当前页列表
            })
            .catch(e => {
              if (!e.selfError) {
                this.$message({
                  type: 'error',
                  message: e.message || '服务器异常,请稍后再试!',
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
    isShowMilestone () { //查询当前用户所在公司里程碑数量配置 如果最大值为 0 则不展示,大于 0 展示请求列表里程碑责任人 option
      APIGroupPlan.queryProjectMilestoneNo({ projectCategory: this.projectCategory, projectCode: this.projectCode })
        .then(res => {
          // res = { max: 2, min: 1 }
          this.maxAndMin = res
          // this.$emit('detailTableMilestoneShowOrHide', res.max > 0)
          // if (res.max > 0) {
          if (this.projectCode) { //编辑页面进入
            this.getList()
            // this.getmilestoneLeader1()
          }
          // }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询当前用户所在公司里程碑数量配置失败',
            type: 'error',
            showClose: true
          })
        })
    },
    upDataList () { //大保存之后刷新列表
      if (this.$route.params.projectCode) { //编辑页面
        this.getList()
        this.addvisable = false
      } else { //新增//保存了基本信息和团队信息
        if (this.projectCode && this.saveFlag) {
          this.getList()
          this.addvisable = false
        }
      }
    },
    getList () { //查询里程碑列表
      // API.milestone(this.projectCode)
      APIGroupPlan.milestoneU(this.projectCode)
        .then(res => {
          let mileStoneTimeList = []
          res.forEach(item => {
            this.$set(item, 'editable', true)
            item.resultInformationList = []
            if (item.resultList && item.resultList.length > 0) {
              item.resultList.forEach(r => {
                item.resultInformationList.push(r)
              })
            }
            mileStoneTimeList.push(new Date(item.planFinishTime + ' 00:00:00')
              .getTime())
            // item.projectName = this.projectName
            if (item.resultInformationList && item.resultInformationList.length > 0) {
              item.resultInformationList.forEach(item2 => {
                item2.resultCode = item2.achievementCode
              })
            }
            item.milestoneLeaderOptions = this.milestoneLeaderOptions || []
            item.editProjectManager = ''
            // item.linkResultInfo = item.resultInformation
          })
          this.list = res
          this.list.forEach(item => {
            this.judgeMilestoneEdit(item)
          })
          if (mileStoneTimeList.length) {
            bus.$emit('acceptMilestoneTime', [Math.max(...mileStoneTimeList) || null, Math.min(...mileStoneTimeList) || null])
          } else {
            bus.$emit('acceptMilestoneTime', [null, null])
          }
          this.$emit('detailTableMilestoneShowOrHide', this.maxAndMin.max > 0 || this.list.length > 0)
          this.detailTableMilestoneShowOrHide = this.maxAndMin.max > 0 || this.list.length > 0
          this.validateAllForm()
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '里程碑列表获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    sentSaveParams () {
      let saveParams = {
        projectCode: this.projectCode,
        projectName: this.projectName,
        milestoneName: this.ruleForm.milestoneName,
        planFinishTime: this.ruleForm.planFinishTime,
        milestoneLeader: this.ruleForm.milestoneLeader,
        milestoneDescription: this.ruleForm.milestoneDescription,
        linkResultFlag: this.ruleForm.linkResultFlag,
        milestoneLeaderUid: this.ruleForm.milestoneLeaderUid
      }
      if (saveParams.linkResultFlag === '0') { //未关联成果
        // saveParams.resultInformation = this.ruleForm.resultInformation
        saveParams.linkResultInfo = this.ruleForm.resultInformation
        this.ruleForm.resultInformationList = []
      } else { //关联成果
        saveParams.resultInformationList = this.ruleForm.resultInformationList
        saveParams.resultInformationList.forEach(item => {
          item.resultCode = item.achievementCode
        })
      }
      return saveParams
    },
    saveListItem (listItem) { //列表编辑暂存
      if (this.editMilestoneId && this.editMilestoneId !== listItem.id) { //编辑的非当前里程碑
        this.$message({
          message: '请先保存当前编辑的里程碑信息',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.$refs['listItem' + listItem.id][0].validate((valid) => {
        if (valid) {
          if (!this.validTeamInfo(listItem)) {
            this.$message({
              type: 'error',
              showClose: true,
              message: '里程碑责任人不在团队信息的项目经理/项目成员内！'
            })
            return false
          }
          let saveParams = {
            id: listItem.id,
            milestoneCode: listItem.milestoneCode,
            projectCode: this.projectCode,
            projectName: this.projectName,
            milestoneName: listItem.milestoneName,
            planFinishTime: listItem.planFinishTime,
            milestoneLeader: listItem.milestoneLeader,
            milestoneDescription: listItem.milestoneDescription,
            linkResultFlag: listItem.linkResultFlag,
            milestoneLeaderUid: listItem.milestoneLeaderUid
          }
          if (saveParams.linkResultFlag === '0') { //未关联成果
            // saveParams.resultInformation = listItem.resultInformation
            saveParams.linkResultInfo = listItem.resultInformation
            listItem.resultInformationList = []
          } else { //关联成果
            saveParams.resultInformationList = listItem.resultInformationList
            saveParams.resultInformationList.forEach(item => {
              item.resultCode = item.achievementCode
            })
          }
          // API.isChange(saveParams)
          //   .then(res => {
          //     if (res) {
          // API.updateMileStoneBaseInfo(saveParams)
          APIGroupPlan.editProjectMilestoneU(saveParams)
            .then(res => {
              this.$message({
                message: '里程碑保存成功',
                type: 'success'
              })
              this.loading = false
              this.addvisable = false
              this.getList()
              this.$emit('saveMilestone')
              this.changeInfo(false)
              this.editMilestoneId = '' //暂存成功后清空
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '里程碑保存失败',
                  type: 'error',
                  showClose: true
                })
              }
            })
            //   } else {
            //     this.$emit('saveBlock') //暂存区块成功
            //     this.$message({
            //       message: '当前没有信息发生变更。',
            //       type: 'info',
            //       showClose: true
            //     })
            //   }
            // })
            // .catch(e => {
            //   if (!e.selfError) {
            //     this.$message({
            //       message: e.message || '服务器异常，请稍后再试！',
            //       type: 'error',
            //       showClose: true
            //     })
            //   }
            // })
        }
      })
    },
    saveAdd () { //新增暂存
      if (this.projectCode) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let saveParams = this.sentSaveParams()
            if (!this.validTeamInfo(saveParams)) {
              this.$message({
                type: 'error',
                showClose: true,
                message: '里程碑责任人不在团队信息的项目经理/项目成员内！'
              })
              return false
            }
            // API.updateMileStoneBaseInfo(saveParams)
            APIGroupPlan.addProjectMilestoneU(saveParams)
              .then(res => {
                this.$message({
                  message: '里程碑保存成功',
                  type: 'success'
                })
                this.loading = false
                this.addvisable = false
                this.getList()
                this.$emit('saveMilestone')
                this.changeInfo(false)
                this.editMilestoneId = '' //暂存成功后清空
              })
              .catch(e => {
                this.loading = false
                if (e.selfError) return
                if (e.message) {
                  this.$message({
                    message: e.message || '里程碑保存失败',
                    type: 'error',
                    showClose: true
                  })
                }
                // this.addvisable = false
              })
          }
        })
      } else {
        this.$message({
          message: '请先保存基本信息',
          type: 'warning',
          showClose: true
        })
      }
    },
    //校验里程碑是否可以编辑和删除 --- 里程碑流程是草稿，已完成，审批驳回，审批中
    judgeMilestoneEdit (milestone) {
      API.judgeMilestoneCanEdit(milestone.milestoneCode)
        .then(res => {
          this.$set(milestone, 'editable', res)
          if (this.milestoneLeaderOptions.length) {
            let hasUser = false
            this.milestoneLeaderOptions.some(item2 => {
              if (milestone.milestoneLeaderUid && item2) {
                if (milestone.milestoneLeaderUid === item2.milestoneLeaderUid) {
                  hasUser = true
                }
              }
            })
            if (!hasUser) {
              if (milestone.editable) {
                this.$refs['listItem' + milestone.id][0].validate((valid) => {})
                milestone.milestoneLeaderUid = ''
                milestone.milestoneLeader = ''
              }
            }
            return milestone
          }
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '里程碑可编辑状态获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    //清空校验信息
    validateAllForm () {
      this.$nextTick(() => {
        this.list.forEach(listItem => {
          this.$refs['listItem' + listItem.id][0].clearValidate('milestoneName')
        })
      })
    },
    saveDel () { //新增删除里程碑
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
          this.addvisable = false
          this.$message({
            message: '删除成功！',
            type: 'success',
            showClose: true
          })
          this.changeInfo(false) //新增里程碑删除-状态已保存true??
          if (this.editMilestoneId === 'add') {
            this.editMilestoneId = ''
          }
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    deleditcg (listItem, e) { //删除列表的成果
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('milestone')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.list.some(item => {
        if (listItem.id === item.id) {
          let a = []
          item.resultInformationList.some(item2 => {
            if (e.achievementCode !== item2.achievementCode) {
              a.push(item2)
            }
          })
          item.resultInformationList = a
        }
      })
      this.changeValue(listItem.id) //删除里程碑关联的成果-状态未保存
    },
    deladdcg (e) { //新增删除成果
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('milestone')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      let list = []
      this.ruleForm.resultInformationList.some(item => {
        if (e.achievementCode !== item.achievementCode) {
          list.push(item)
        }
      })
      this.ruleForm.resultInformationList = list
      this.changeValue('add')
    },
    getChengGuoList (pageNum = this.tableDataIn.body.pageNum, pageSize = this.tableDataIn.body.pageSize) { //获取弹框成果信息列表
      this.tableDataIn.body.pageNum = pageNum
      this.tableDataIn.body.pageSize = pageSize
      let params = {
        pageNo: pageNum,
        pageSize: pageSize,
        projectCode: this.projectCode,
        // projectCode: 'R212004B',
        // name: this.tableDataInForm.name,
        // responsibleUid: this.tableDataInForm.responsibleUid,
        subProjectCode: this.tableDataInForm.name,
        achievementType: this.tableDataInForm.resultType,
        demandUnitCode: this.tableDataInForm.demandUnit
      }
      // API.queryLastAchievementPage(params)
      APIGroupPlan.queryLastSubProjectAchievement(params)
      // APIGroupPlan.queryLatestProjectAchievement(this.projectCode)
        .then(res => {
          res.list = res.records
          res.list.forEach(item => {
            // item.resultCode = item.achievementCode
            item.budgetInsourcing = deleteZero(item.budgetInsourcing)
            item.budgetOutsourcing = deleteZero(item.budgetOutsourcing)
            item.staffTime = deleteZero(item.staffTime)
            item.resultCode = item.achievementCode
            item.id = null
          })
          this.tableDataIn.list = res.list
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
    dialogVisibleCancle () { //关联成果弹框取消
      this.dialogVisible = false
    },
    dialogVisibleSave () { //关联成果确定的时候
      if (this.editLinkResultFlagId) { //判断当前保存的是否是新增还是编辑 编辑
        this.changeValue(this.editLinkResultFlagId) //确定编辑里程碑关联的成果-状态未保存
        let hasoneachievement = true //默认没有相同的关联成果
        this.tableDataIn.list.forEach(item => {
          if (item.selected) {
            let flag = true //默认没有相同的成果编码当前的表单中和列表数据中
            this.list.forEach(item3 => {
              if (item3.linkResultFlag === '1') { //判断关联成果为是
                item3.resultInformationList.forEach(item4 => {
                  if (item4.achievementCode === item.achievementCode) {
                    flag = false
                  }
                })
              }
            })
            if (this.addvisable) { //有新增表单
              if (this.ruleForm.linkResultFlag === '1') {
                this.ruleForm.resultInformationList.forEach(item5 => {
                  if (item5.achievementCode === item.achievementCode) {
                    flag = false
                  }
                })
              }
            }
            if (flag) {
              item.selected = false
              this.list.some(item4 => {
                if (item4.id === this.editLinkResultFlagId) {
                  item4.resultInformationList.push(item)
                }
              })
            } else {
              hasoneachievement = false
            }
            this.dialogVisible = false
          } else { //未选泽数据
            this.dialogVisible = false
          }
        })
        this.dialogVisible = false
        this.$nextTick(() => {
          this.list.forEach(listItem => {
            this.$refs['listItem' + listItem.id][0].clearValidate('resultInformationList')
          })
        })
        if (!hasoneachievement) {
          /* this.$message({
            message: '1 个成果只能关联一个里程碑,已经为您过滤',
            type: 'warning',
            showClose: true
          }) */
        }
      } else { //新增弹框
        this.changeValue('add')
        let hasoneachievement = true //默认没有相同的关联成果
        this.tableDataIn.list.forEach(item => {
          if (item.selected) { //此条数据被选中
            let flag = true //默认没有相同的成果编码当前的表单中和列表数据中
            this.ruleForm.resultInformationList.forEach(item2 => {
              if (item.achievementCode === item2.achievementCode) {
                flag = false
              }
            })
            this.list.forEach(item3 => {
              if (item3.linkResultFlag === '1') { //判断关联成果为是
                item3.resultInformationList.forEach(item4 => {
                  if (item4.achievementCode === item.achievementCode) {
                    flag = false
                  }
                })
              }
            })
            if (flag) {
              item.selected = false
              this.ruleForm.resultInformationList.push(item)
            } else {
              hasoneachievement = false
            }
            this.dialogVisible = false
          } else { //未选泽数据
            this.dialogVisible = false
          }
        })
        this.dialogVisible = false
        this.$nextTick(() => {
          // this.list.forEach(listItem => {
          this.$refs['ruleForm'].clearValidate('resultInformationList')
          // })
        })
        if (!hasoneachievement) {
          /* this.$message({
            message: '1 个成果只能关联一个里程碑,已经为您过滤',
            type: 'warning',
            showClose: true
          }) */
        }
      }
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
    //查询成果列表
    getResSearch () {
      this.tableDataIn.body.pageNum = 1
      this.getChengGuoList()
    },
    defaultSelections (row, index) { //设置默认选中行
    },
    tableDataInSearchMore () {
      this.tableDataInSearchMoreFlag = '1'
      // this.tableDataInForm.responsibleUid = ''
      // this.tableDataInForm.resultType = ''
    },
    tableDataInSearchless () {
      this.tableDataInSearchMoreFlag = '0'
      // this.tableDataInForm.responsibleUid = ''
      // this.tableDataInForm.resultType = ''
    },
    addMilestone () { //新增里程碑打开隐藏新增框
      if (this.editMilestoneId) {
        this.$message({
          message: '请先保存当前编辑的里程碑信息',
          type: 'warning',
          showClose: true
        })
        return
      }
      if (this.list.length >= this.maxAndMin.max) {
        this.$message({
          message: `本单位里程碑个数上限为${this.maxAndMin.max}个,已添加${this.list.length}个,如需继续添加,请联系本单位管理员修改里程碑个数限制`,
          type: 'warning',
          showClose: true
        })
      } else {
        if (this.addvisable) {
          this.$message({
            message: `请先保存当前新增里程碑`,
            type: 'warning',
            showClose: true
          })
          return
        }
        if (!this.$store.getters['GROUPPLAN/blockCanEdit']('milestone')) {
        //不能编辑不弹框，给提示
          this.changeInfo(true, true)
          return
        }
        this.ruleForm = {
          projectCode: this.projectCode,
          milestoneName: '', //里程碑名称
          planFinishTime: '', //计划结束时间
          milestoneLeader: '', //里程碑责任人
          milestoneDescription: '', //里程碑描述
          linkResultFlag: '1', //是否关联成果
          resultInformationList: [], //关联的成果
          resultInformation: ''//关联成果输入框
        }
        if (this.$route.params.projectCode) { //编辑
          this.getmilestoneLeader()
        } else { //新增
          if (!this.projectCode || !this.saveFlag) { //有关联成果编码
            if (!this.projectCode && !this.saveFlag) {
              return this.$message({
                message: '请先保存基本信息和团队信息',
                type: 'warning',
                showClose: true
              })
            }
            if (!this.projectCode) {
              return this.$message({
                message: '请先保存基本信息',
                type: 'warning',
                showClose: true
              })
            }
            if (!this.saveFlag) {
              return this.$message({
                message: '请先保存团队信息',
                type: 'warning',
                showClose: true
              })
            }
          } else {
            this.getmilestoneLeader()
          }
        }
      }
    },
    searchReset () { //关联成果重置查询条件
      this.tableDataInForm = { //弹框搜索表单
        name: '',
        // responsibleUid: '',
        resultType: '',
        demandUnit: ''
      }
      this.tableDataIn.body.pageNum = 1
      this.getChengGuoList()
    },
    getmilestoneLeader () {
      this.addvisable = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
      this.changeValue() //新增里程碑-状态未保存
    },
    getDemendUnit () { //获取需求单位 options
      let sendData = {
        projectCode: this.parentCode
        // projectCode: 'R212004B'
      }
      APIGroupPlan.queryProjectDemandCompanyList(sendData)
        .then(res => {
          this.getDemendUnitOptions = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询成果负责人失败',
            type: 'error',
            showClose: true
          })
        })
    },
    getSubProject () { //获取需求单位子项目列表
      let sendData = {
        projectCode: this.projectCode
      }
      APIGroupPlan.querySubProjectList(sendData)
        .then(res => {
          this.getSubProjectOptions = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询成果负责人失败',
            type: 'error',
            showClose: true
          })
        })
    },
    getcgfzr () { //获取成果负责人 options
      let sendData = {
        projectCode: this.projectCode,
        // projectRoleCodes: 'PR-MANAGER，PR-MEMBER'
        projectRoleCodes: 'PR-MANAGER,PR-MEMBER'
      }
      API.queryProjectMembers(sendData)
        .then(res => {
          this.cgfzroptions = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询成果负责人失败',
            type: 'error',
            showClose: true
          })
        })
    },
    getrwtype () { //查询任务/成果类型
      // API.dictValByCode('EXPECTED-RESULT-TYPE')
      APIGroupPlan.getDictValByCode('EXPECTED-RESULT-TYPE')
        .then(res => {
          this.rwtypeoptions = res
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询成果类型失败',
            type: 'error',
            showClose: true
          })
        })
    },
    addLinkResults (listItem) { //关联成果弹框打开
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('milestone')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (this.projectCode) { //有关联成果编码
        this.tableDataInSearchMoreFlag = '0'
        this.tableDataInForm.name = ''
        // this.tableDataInForm.responsibleUid = ''
        this.tableDataInForm.demandUnit = ''
        this.tableDataInForm.resultType = ''
        this.tableDataIn.body.pageNum = 1
        this.getChengGuoList()
      } else {
        this.$message({
          message: '请先保存基本信息和团队信息',
          type: 'warning',
          showClose: true
        })
        return
      }
      if (listItem) {
        this.editLinkResultFlagId = listItem.id
      } else {
        this.editLinkResultFlagId = ''
      }
      this.getSubProject()
      this.getDemendUnit()
      this.getcgfzr()
      this.getrwtype()
      this.dialogVisible = true
    },
    //设置行是否可选
    setSelectable (row, index) {
      let results = []
      this.list.forEach(item => {
        results = results.concat(item.resultInformationList)
      })
      if (this.addvisable) {
        results = results.concat(this.ruleForm.resultInformationList)
      }
      let flag = results.some(item => item.resultCode === row.resultCode)
      return !flag
    },
    //有信息发生修改
    changeInfo (edited = true, msg = false) {
      let params = {
        curBlock: 'milestone',
        hasEdited: edited,
        onlyShowMsg: msg
      }
      bus.$emit('groupPlanProjectEdit', params)
    },
    changeValue (id) {
      this.changeInfo()
      if (this.editMilestoneId && this.editMilestoneId !== id) { //编辑的非当前里程碑
        setTimeout(() => {
          this.$message({
            message: '请先保存当前编辑的里程碑信息',
            type: 'warning',
            showClose: true
          })
        })
      } else {
        this.editMilestoneId = id
      }
    },
    /**
     * 校验里程碑责任人是否在当前页面的团队信息中
     * @return {Boolean} true:在-校验成功，false:不在-校验失败
     */
    validTeamInfo (manager) {
      return this.cachedTeamInfo.some(user => user.userAccount === manager.milestoneLeaderUid)
    }
  }
}
</script>
<style lang="scss" scoped>
.title{
  max-width:300px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.is-error{
  .tabcon{
    border-color: #f56c6c!important;
  }
}
.addAndEditMilestone{
   .project-panel{
    margin-bottom: 0px;
  }
    /deep/.project-panel .panel-body {
      margin-bottom: 0px !important;
    }
   .body-con /deep/{
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
    .el-date-editor{
      width:100%;
    }
    .panel-body .is-expand {
      margin-bottom: 0px !important;
    }
    .project-panel .panel-body.is-expand {
      padding: 20px 30px 0px 15px;
      height: auto;
    }
    .addcon{
       border: 1px solid #E9E9E9;
       margin-bottom: 20px;
       &:last-child{
         margin-bottom: 0;
       }
    }
    .el-textarea .el-input__count{
      height: 22px;
      line-height: 22px;
      bottom: 1px;
      right: 22px;
    }
    .tabcon{
      position: relative;
        padding: 0px 15px;
        border: 1px solid #E5E5E5;
        float: left;
        width: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 14px;
        .disabled{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba($color: #f0f0f0, $alpha: 0.8);
      }
      .butt{
        float: right;
        height: 100%;
        i{
          // color: #0b82ff;
        }
      }
      .item{
        display: flex;
        float: left;
        margin-right: 10px;
        max-width: 100px;
        .tooltip-span{
          display: inline-block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .close{
        cursor: pointer;
        font-size: 16px;
        color: #6666;
        margin-left: 3px;
      }
    }
    .tabcon1 /deep/{
        padding: 0px 15px;
        // border: 1px solid #E5E5E5;
        float: left;
        width: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 14px;
      .item{
        float: left;
        margin-right: 10px;
      }
    }
    .wrap{
      word-wrap:break-word
    }
    .header-tip .el-tooltip.tooltip-span{
      color: #ff3f3b;
    }
  }
}
</style>
