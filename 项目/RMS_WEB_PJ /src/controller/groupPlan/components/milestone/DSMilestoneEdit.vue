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
              <el-col :span="15">
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
              <el-col :span="9">
                <el-form-item
                  label="计划完成时间:"
                  prop="planFinishTime"
                >
                  <el-date-picker
                    style="width:100%"
                    v-model="ruleForm.planFinishTime"
                    type="date"
                    value-format="timestamp"
                    :default-value="Date.now()"
                    :picker-options="pickerOptions"
                    placeholder="请选择"
                    @change="changeValue('add')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding-left:60px" class="selectrowbody">
              <el-col :span="15">
                <el-form-item
                  label="需求单位:"
                  prop="demandUnit">
                  <el-tooltip
                    v-if="ruleForm.demandUnit.length>0"
                    class="item"
                    effect="dark"
                    :content="changeDemandUnit"
                    placement="top-start">
                    <el-select
                      :popper-append-to-body="false"
                      v-model="ruleForm.demandUnit"
                      placeholder="请选择"
                      multiple
                      collapse-tags
                      @change="ChooseMilestoneReviewer($event,{id:'add'})"
                      clearable>
                      <el-option
                        v-for="item in demandUnitOptions"
                        :key="item.demandUnitName"
                        :label="item.demandUnitName"
                        :value="item.demandUnitCode"
                      ></el-option>
                    </el-select>
                  </el-tooltip>
                  <el-select
                    v-else
                    :popper-append-to-body="false"
                    v-model="ruleForm.demandUnit"
                    placeholder="请选择"
                    multiple
                    collapse-tags
                    @change="ChooseMilestoneReviewer($event,{id:'add'})"
                    clearable>
                    <el-option
                      v-for="item in demandUnitOptions"
                      :key="item.demandUnitName"
                      :label="item.demandUnitName"
                      :value="item.demandUnitCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="里程碑评审人:"
                  prop="milestoneReviewer">
                  <el-select
                    v-model="ruleForm.milestoneReviewer"
                    @change='addMilestoneReviewerUidChange'
                    @visible-change ='milestoneReviewershow'
                    placeholder="请选择"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="ruleForm2.addMilestoneReviewer"
                        placeholder="请输入名称"
                        clearable
                        @input="judgeserarchMilestoneReviewerAdd($event,ruleForm.demandUnit)"
                        @keyup.enter.native="serarchMilestoneReviewerAdd(ruleForm.demandUnit,ruleForm2.addMilestoneReviewer)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchMilestoneReviewerAdd(ruleForm.demandUnit,ruleForm2.addMilestoneReviewer)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-show='!item.isHiden'
                      v-for="item in milestoneReviewerOptions"
                      :key="item.id"
                      :label="item.userName"
                      :value="item.userName"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="ruleForm2.addMilestoneReviewer"
                          placeholder="请输入名称"
                          clearable
                          @input="judgeserarchMilestoneReviewerAdd($event,ruleForm.demandUnit)"
                          @keyup.enter.native="serarchMilestoneReviewerAdd(ruleForm.demandUnit,ruleForm2.addMilestoneReviewer)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchMilestoneReviewerAdd(ruleForm.demandUnit,ruleForm2.addMilestoneReviewer)"
                        >
                        </i>
                        </el-input>
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding-left:60px" class="selectrowbody">
              <el-col :span="15">
                <el-form-item
                  label="承担单位:"
                  prop="undertaker">
                  <el-tooltip
                    v-if="ruleForm.undertaker.length>0"
                    class="item"
                    effect="dark"
                    :content="changeUnder"
                    placement="top-start">
                    <el-select
                      :popper-append-to-body="false"
                      v-model="ruleForm.undertaker"
                      placeholder="请选择"
                      @change="ChooseMilestoneLeader($event,{id:'add'})"
                      multiple
                      collapse-tags
                      clearable>
                      <el-option
                        v-for="item in undertakerOptions"
                        :key="item.commitmentUnitName"
                        :label="item.commitmentUnitName"
                        :value="item.commitmentUnitCode"
                      ></el-option>
                    </el-select>
                  </el-tooltip>
                  <el-select
                    v-else
                    :popper-append-to-body="false"
                    v-model="ruleForm.undertaker"
                    placeholder="请选择"
                    @change="ChooseMilestoneLeader($event,{id:'add'})"
                    multiple
                    collapse-tags
                    clearable>
                    <el-option
                      v-for="item in undertakerOptions"
                      :key="item.commitmentUnitName"
                      :label="item.commitmentUnitName"
                      :value="item.commitmentUnitCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="里程碑责任人:"
                  prop="milestoneLeader">
                  <el-select
                    @change='addMilestoneLeaderUidChange'
                    v-model="ruleForm.milestoneLeader"
                    @visible-change ='milestoneLeadershow'
                    placeholder="请选择"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="ruleForm2.addMilestoneLeader"
                        placeholder="请输入名称"
                        clearable
                        @input="judgeserarchMilestoneLeaderAdd($event,ruleForm.undertaker)"
                        @keyup.enter.native="serarchMilestoneLeaderAdd(ruleForm.undertaker,ruleForm2.addMilestoneLeader)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchMilestoneLeaderAdd(ruleForm.undertaker,ruleForm2.addMilestoneLeader)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-show='!item.isHiden'
                      v-for="item in milestoneLeaderOptions"
                      :key="item.id"
                      :label="item.userName"
                      :value="item.userName"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="ruleForm2.addMilestoneLeader"
                          placeholder="请输入名称"
                          clearable
                          @input="judgeserarchMilestoneLeaderAdd($event,ruleForm.undertaker)"
                          @keyup.enter.native="serarchMilestoneLeaderAdd(ruleForm.undertaker,ruleForm2.addMilestoneLeader)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchMilestoneLeaderAdd(ruleForm.undertaker,ruleForm2.addMilestoneLeader)"
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
              style="color: #ff3f3b;border: 1px solid rgba(255, 63, 59, 0.5);"
              icon="el-icon-delete"
              @click="listItemDel(listItem)"
              v-if='!meberEditFlag'>删除</el-button>
          </template>
          <el-form
            :model="listItem"
            :rules="rules"
            label-position='right'
            :ref="'listItem'+listItem.id"
            label-width="120px">
            <el-row style="padding-left:60px">
              <el-col :span="15">
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
              <el-col :span="9">
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
                    value-format="timestamp"
                    :default-value="Date.now()"
                    :picker-options="pickerOptions"
                    placeholder="请选择"
                    @change="changeValue(listItem.id)"
                  ></el-date-picker>
                  <span v-else>{{listItem.planFinishTime1}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding-left:60px" class="selectrowbody">
              <el-col :span="15">
                <el-form-item
                  label="需求单位:"
                  prop="demandUnit1">
                  <el-tooltip
                    v-if="listItem.demandUnitNames"
                    class="item"
                    effect="dark"
                    :content="listItem.demandUnitNames"
                    placement="top-start">
                    <el-select
                      :disabled='meberEditFlag'
                      :popper-append-to-body="false"
                      v-if="listItem.editable"
                      v-model="listItem.demandUnit1"
                      placeholder="请选择"
                      @change='ChooseMilestoneReviewer($event,listItem)'
                      multiple
                      collapse-tags
                      clearable>
                      <el-option
                        v-for="item in demandUnitOptions"
                        :key="item.demandUnitName"
                        :label="item.demandUnitName"
                        :value="item.demandUnitCode"
                      ></el-option>
                    </el-select>
                    <span v-else>{{getdemandUnit1Name(listItem.demandUnit1)}}</span>
                  </el-tooltip>
                  <div v-else>
                    <el-select
                      v-if="listItem.editable"
                      :popper-append-to-body="false"
                      v-model="listItem.demandUnit1"
                      placeholder="请选择"
                      @change='ChooseMilestoneReviewer($event,listItem)'
                      multiple
                      collapse-tags
                      clearable>
                      <el-option
                        v-for="item in demandUnitOptions"
                        :key="item.demandUnitName"
                        :label="item.demandUnitName"
                        :value="item.demandUnitCode"
                      ></el-option>
                    </el-select>
                    <span v-else>{{getdemandUnit1Name(listItem.demandUnit1)}}</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="里程碑评审人:"
                  prop="milestoneReviewer">
                  <el-select
                    :disabled='meberEditFlag'
                    v-if="listItem.editable"
                    v-model="listItem.milestoneReviewer"
                    @visible-change ='milestoneReviewershow($event,listItem)'
                    @change='editMilestoneReviewerUidChange($event,listItem)'
                    placeholder="请选择"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="listItem.editMilestoneReviewer"
                        placeholder="请输入名称"
                        clearable
                        @input="judgeserarchMilestoneReviewerEdit($event,listItem.demandUnit1,listItem)"
                        @keyup.enter.native="serarchMilestoneReviewerEdit(listItem.demandUnit1,listItem,listItem.editMilestoneReviewer)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchMilestoneReviewerEdit(listItem.demandUnit1,listItem,listItem.editMilestoneReviewer)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-show='!item.isHiden'
                      v-for="item in listItem.milestoneReviewerOptions"
                      :key="item.id"
                      :label="item.userName"
                      :value="item.userName"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="listItem.editMilestoneReviewer"
                          placeholder="请输入名称"
                          clearable
                          @input="judgeserarchMilestoneReviewerEdit($event,listItem.demandUnit1,listItem)"
                          @keyup.enter.native="serarchMilestoneReviewerEdit(listItem.demandUnit1,listItem,listItem.editMilestoneReviewer)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchMilestoneReviewerEdit(listItem.demandUnit1,listItem,listItem.editMilestoneReviewer)"
                        >
                        </i>
                        </el-input>
                      </div>
                    </template>
                  </el-select>
                  <span v-else>{{listItem.milestoneReviewer}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding-left:60px" class="selectrowbody">
              <el-col :span="15">
                <el-form-item
                  label="承担单位:"
                  prop="undertaker">
                  <el-tooltip
                    v-if="listItem.undertakerNames"
                    class="item"
                    effect="dark"
                    :content="listItem.undertakerNames"
                    placement="top-start">
                    <el-select
                      :disabled='meberEditFlag'
                      :popper-append-to-body="false"
                      v-if="listItem.editable"
                      v-model="listItem.undertaker"
                      placeholder="请选择"
                      @change='ChooseMilestoneLeader($event,listItem)'
                      multiple
                      collapse-tags
                      clearable>
                      <el-option
                        v-for="item in undertakerOptions"
                        :key="item.commitmentUnitName"
                        :label="item.commitmentUnitName"
                        :value="item.commitmentUnitCode"
                      ></el-option>
                    </el-select>
                    <span v-else>{{getundertakerName(listItem.undertaker)}}</span>
                  </el-tooltip>
                  <div v-else>
                    <el-select
                      v-if="listItem.editable"
                      :popper-append-to-body="false"
                      v-model="listItem.undertaker"
                      placeholder="请选择"
                      @change='ChooseMilestoneLeader($event,listItem)'
                      multiple
                      collapse-tags
                      clearable>
                      <el-option
                        v-for="item in undertakerOptions"
                        :key="item.commitmentUnitName"
                        :label="item.commitmentUnitName"
                        :value="item.commitmentUnitCode"
                      ></el-option>
                    </el-select>
                    <span v-else>{{getundertakerName(listItem.undertaker)}}</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="里程碑责任人:"
                  prop="milestoneLeader">
                  <el-select
                    :disabled='meberEditFlag'
                    v-if="listItem.editable"
                    @change='editMilestoneLeaderUidChange($event,listItem)'
                    v-model="listItem.milestoneLeader"
                    @visible-change ='milestoneLeadershow($event,listItem)'
                    placeholder="请选择"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="listItem.editMilestoneLeader"
                        placeholder="请输入名称"
                        clearable
                        @input="judgeserarchMilestoneLeaderEdit($event,listItem.undertaker,listItem)"
                        @keyup.enter.native="serarchMilestoneLeaderEdit(listItem.undertaker,listItem,listItem.editMilestoneLeader)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchMilestoneLeaderEdit(listItem.undertaker,listItem,listItem.editMilestoneLeader)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-show='!item.isHiden'
                      v-for="item in listItem.milestoneLeaderOptions"
                      :key="item.id"
                      :label="item.userName"
                      :value="item.userName"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="listItem.editMilestoneLeader"
                          placeholder="请输入名称"
                          clearable
                          @input="judgeserarchMilestoneLeaderEdit($event,listItem.undertaker,listItem)"
                          @keyup.enter.native="serarchMilestoneLeaderEdit(listItem.undertaker,listItem,listItem.editMilestoneLeader)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchMilestoneLeaderEdit(listItem.undertaker,listItem,listItem.editMilestoneLeader)"
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
                  label-position="right"
                  label="关联预期成果信息:"
                  prop='resultInformationList'
                >
                  <div class="tabcon" v-if="listItem.editable">
                    <div :class="{'disabled':meberEditFlag}" v-if="meberEditFlag"></div>
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
              label="需求单位子项目:"
              prop="name"
              style="margin-right:20px;margin-bottom:10px"
            >
              <el-select
                @keyup.enter.native="getResSearch"
                v-model="tableDataInForm.name"
                :popper-append-to-body="false"
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
                @keyup.enter.native="getResSearch"
                :popper-append-to-body="false"
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
                @keyup.enter.native="getResSearch"
                :popper-append-to-body="false"
                v-model="tableDataInForm.demandUnit"
                placeholder="请选择"
                style="width:220px"
                collapse-tags
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
      rwtypeoptions: [{ label: '标准化-立项', value: '标准化-立项' }], //弹框需求单位 options
      cgfzroptions: [{ label: 'cmss@1', value: 'cmss@1' }], //弹框成果类型 options
      getDemendUnitOptions: [], //弹框需求单位列表 options
      getSubProjectOptions: [], //弹框需求单位子项目 options
      milestoneLeaderOptions: [], //里程碑负责人 options
      demandUnitOptions: [],
      undertakerOptions: [],
      demandUnitNames: '',
      undertakerNames: '',
      // demandUnitOptions: [{ demandUnitCode: '113', demandUnitName: '需求单位名称1' }, { demandUnitCode: '114', demandUnitName: '需求单位名称2' }], //需求单位 options
      // undertakerOptions: [{
      //   // milestoneCode: listItem.milestoneCode, //里程碑编码
      //   commitmentUnitCode: '112', //承担单位编码
      //   commitmentUnitBranchCode: '111123', //承担单位一级部门编码
      //   commitmentUnitName: '承担单位名称1',
      //   commitmentUnitBranchName: '承担单位一级部门名称'
      // }, {
      //   // milestoneCode: listItem.milestoneCode, //里程碑编码
      //   commitmentUnitCode: '113', //承担单位编码
      //   commitmentUnitBranchCode: '111124', //承担单位一级部门编码
      //   commitmentUnitName: '承担单位名称2',
      //   commitmentUnitBranchName: '承担单位一级部门名称'
      // }], //承担单位 options
      milestoneReviewerOptions: [], //里程碑评审人 options
      tableDataIn: { //内层详情表格数据
        body: { pageSize: 10, pageNum: 1 },
        total: 12,
        list: []
      },
      loading: false,
      tableColsIn: [
        { label: '需求单位子项目', prop: 'subProjectName', align: 'left', overflow: true, resizable: false },
        { label: '任务名称', prop: 'achievementName', align: 'left', overflow: true, resizable: false },
        { label: '成果类型', prop: 'achievementTypeValue', align: 'left', overflow: true, resizable: false },
        { label: '需求单位', prop: 'demandUnit', align: 'left', overflow: true, resizable: false },
        { label: '合作开发费-委外(万元)', prop: 'budgetOutsourcing', align: 'left', overflow: true, resizable: false },
        { label: '合作开发费-委内(万元)', prop: 'budgetInsourcing', align: 'left', overflow: true, resizable: false },
        { label: '自有人工预算(人月)', prop: 'staffTime', align: 'left', overflow: true, resizable: false }
      ],
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
        addMilestoneLeader: '', //里程碑责任人搜索字段
        addMilestoneReviewer: ''//里程碑评审人搜索字段
      },
      ruleForm: {
        milestoneName: '', //里程碑名称
        planFinishTime: '', //计划结束时间
        demandUnit: [], //需求单位
        milestoneLeader: '', //里程碑责任人
        undertaker: [], //承担单位
        milestoneReviewer: '', //里程碑评审人
        milestoneDescription: '', //里程碑描述
        resultInformationList: [], //关联的成果
        resultInformation: '', //关联成果输入框
        milestoneLeaderUid: '', //里程碑责任人ID
        milestoneReviewerUid: '', //里程碑评审人id
        acceptanceStandard: '' //验收标准
      },
      rules: {
        milestoneName: [
          { required: true, message: '请输入里程碑名称', trigger: ['change', 'blur'] },
          { max: 128, message: '长度在128个字符以内', trigger: ['change', 'blur'] },
          { validator: validSameName, trigger: ['change', 'blur'] }
        ],
        planFinishTime: [{ required: true, message: '请选择计划完成时间', trigger: ['change', 'blur'] }],
        demandUnit: [{ required: true, message: '请选择需求单位', trigger: ['change', 'blur'] }],
        demandUnit1: [{ required: true, message: '请选择需求单位', trigger: ['change', 'blur'] }],
        // milestoneLeaderUid: [{ required: true, message: '请选择里程碑责任人', trigger: ['change', 'blur'] }],
        milestoneLeader: [{ required: true, message: '请选择里程碑责任人', trigger: ['change', 'blur'] }],
        undertaker: [{ required: true, message: '请选择承担单位', trigger: ['change', 'blur'] }],
        milestoneReviewer: [{ required: true, message: '请选择里程碑评审人', trigger: ['change', 'blur'] }],
        resultInformation: [{ required: true, message: '请输入预期成果信息', trigger: ['change', 'blur'] }],
        resultInformationList: [{ required: true, message: '请选择关联预期成果信息', trigger: ['change', 'blur'] }]
      },
      editLinkResultFlagId: '', //关联成果弹框打开的时候判断是新增的打开还是列表的打开
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
          label: 'demandUnitList',
          value: '需求单位'
        }, {
          label: 'milestoneReviewer',
          value: '里程碑评审人'
        }, {
          label: 'commitmentUnitList',
          value: '承担单位'
        }, {
          label: 'milestoneLeader',
          value: '里程碑责任人'
        }, {
          label: 'resultInformationList',
          value: '预期成果'
        }]
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
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
    this.isShowMilestone()
    this.acceptCode()
  },
  computed: {
    changeDemandUnit () {
      let val = ''
      let that = this
      this.ruleForm.demandUnit.forEach(element => {
        this.demandUnitOptions.map(item => {
          if (item.value === element) {
            val = val + item.label + ' '
          }
        })
      })
      that.demandUnitNames = val
      return val
    },
    changeUnder () {
      let val = ''
      let that = this
      this.ruleForm.undertaker.forEach(element => {
        this.undertakerOptions.map(item => {
          if (item.value === element) {
            val = val + item.label + ' '
          }
        })
      })
      that.undertakerNames = val
      return val
    }
  },
  methods: {
    getdemandUnit1Name (demandUnit1) {
      let str = ''
      this.demandUnitOptions.forEach(item => {
        demandUnit1.forEach(item2 => {
          if (item.demandUnitCode === item2) {
            str = str + item.demandUnitName + '、'
          }
        })
      })
      return str.slice(0, -1)
    },
    getundertakerName (undertaker) {
      let str = ''
      this.undertakerOptions.forEach(item => {
        undertaker.forEach(item2 => {
          if (item.commitmentUnitCode === item2) {
            str += item.commitmentUnitName + '、'
          }
        })
      })
      return str.slice(0, -1)
    },
    isShowTip (projectName) {
      return isShowToolTip(projectName, 320)
    },
    editMilestoneLeaderUidChange (val, listItem) {
      if (val) {
        this.list.forEach(item => {
          if (item.id === listItem.id) {
            listItem.milestoneLeaderOptions.some(item2 => {
              if (val === item2.userName) {
                item.milestoneLeaderUid = item2.userAccount
                item.milestoneLeader = item2.userName
              }
            })
          }
        })
      }
      this.changeValue(listItem.id)
    },
    editMilestoneReviewerUidChange (val, listItem) {
      if (val) {
        this.list.forEach(item => {
          if (item.id === listItem.id) {
            listItem.milestoneReviewerOptions.some(item2 => {
              if (val === item2.userName) {
                item.milestoneReviewerUid = item2.userAccount
                item.milestoneReviewer = item2.userName
                listItem.milestoneReviewerUid = item2.userAccount
              }
            })
          }
        })
      }
      this.changeValue(listItem.id)
    },
    async ChooseMilestoneReviewer (val, listItem) {
      if (listItem.id !== 'add') {
        listItem.demandUnitNames = ''
        if (listItem.demandUnit1) {
          listItem.demandUnit1.forEach(item => {
            this.demandUnitOptions.forEach(ele => {
              if (item === ele.demandUnitCode) {
                listItem.demandUnitNames += ' ' + ele.demandUnitName
              }
            })
          })
        }
        listItem.milestoneReviewerOptions = []
        listItem.milestoneReviewer = ''
        if (val) {
          listItem.milestoneReviewerOptions = await this.getAllUserPageByorgCode(val, 'd')
        }
      } else {
        this.milestoneReviewerOptions = []
        this.ruleForm.milestoneReviewer = ''
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate('milestoneReviewer')
        })
        if (val) {
          this.milestoneReviewerOptions = await this.getAllUserPageByorgCode(val, 'd')
        }
      }
      if (listItem) {
        this.changeValue(listItem.id)
      }
    },
    judgeserarchMilestoneReviewerEdit (val1, val, listItem) {
      if (!val1) {
        this.serarchMilestoneReviewerEdit(val, listItem)
      }
    },
    async serarchMilestoneReviewerEdit (val, listItem, userName) {
      if (val) {
        let options = []
        if (listItem.milestoneReviewer) {
          listItem.milestoneReviewerOptions.some(item2 => {
            if (item2.value === listItem.milestoneReviewerUid) {
              options = item2
            }
          })
        }
        listItem.milestoneReviewerOptions = await this.getAllUserPageByorgCode(val, 'd', userName)
        if (listItem.milestoneReviewer) {
          let hasSelectManager = listItem.milestoneReviewerOptions.some(item2 => {
            return item2.value === listItem.milestoneReviewerUid
          })
          if (!hasSelectManager) {
            options.isHiden = true
            listItem.milestoneReviewerOptions = listItem.milestoneReviewerOptions.concat(options)
          }
        }
      }
    },
    judgeserarchMilestoneLeaderEdit (val1, val, listItem) {
      if (!val1) {
        this.serarchMilestoneLeaderEdit(val, listItem)
      }
    },
    async serarchMilestoneLeaderEdit (val, listItem, userName) {
      if (val) {
        let options = []
        if (listItem.milestoneLeader) {
          listItem.milestoneLeaderOptions.some(item2 => {
            if (item2.value === listItem.milestoneLeaderUid) {
              options = item2
            }
          })
        }
        listItem.milestoneLeaderOptions = await this.getAllUserPageByorgCode(val, 'u', userName)
        if (listItem.milestoneLeader) {
          let hasSelectManager = listItem.milestoneLeaderOptions.some(item2 => {
            return item2.value === listItem.milestoneLeaderUid
          })
          if (!hasSelectManager) {
            options.isHiden = true
            listItem.milestoneLeaderOptions = listItem.milestoneLeaderOptions.concat(options)
          }
        }
      }
    },
    judgeserarchMilestoneLeaderAdd (val1, val) {
      if (!val1) {
        this.serarchMilestoneLeaderAdd(val, '')
      }
    },
    async serarchMilestoneLeaderAdd (val, userName) {
      if (val) {
        let options = []
        if (this.ruleForm.milestoneLeader) {
          this.milestoneLeaderOptions.some(item2 => {
            if (item2.value === this.ruleForm.milestoneLeaderUid) {
              options = item2
            }
          })
        }
        this.milestoneLeaderOptions = await this.getAllUserPageByorgCode(val, 'u', userName)
        if (this.ruleForm.milestoneLeader) {
          let hasSelectManager = this.milestoneLeaderOptions.some(item2 => {
            return item2.value === this.ruleForm.milestoneLeaderUid
          })
          if (!hasSelectManager) {
            options.isHiden = true
            this.milestoneLeaderOptions = this.milestoneLeaderOptions.concat(options)
          }
        }
      }
    },
    judgeserarchMilestoneReviewerAdd  (val1, val) {
      if (!val1) {
        this.serarchMilestoneReviewerAdd(val, '')
      }
    },
    async serarchMilestoneReviewerAdd (val, userName) {
      // this.$nextTick(() => {
      //   this.$refs['ruleForm'].clearValidate('milestoneReviewer')
      // })
      if (val) {
        let options = []
        if (this.ruleForm.milestoneReviewer) {
          this.milestoneReviewerOptions.some(item2 => {
            if (item2.value === this.ruleForm.milestoneReviewerUid) {
              options = item2
            }
          })
        }
        this.milestoneReviewerOptions = await this.getAllUserPageByorgCode(val, 'd', userName)
        if (this.ruleForm.milestoneReviewer) {
          let hasSelectManager = this.milestoneReviewerOptions.some(item2 => {
            return item2.value === this.ruleForm.milestoneReviewerUid
          })
          if (!hasSelectManager) {
            options.isHiden = true
            this.milestoneReviewerOptions = this.milestoneReviewerOptions.concat(options)
          }
        }
      }
    },
    async ChooseMilestoneLeader (val, listItem) {
      if (listItem.id !== 'add') {
        listItem.undertakerNames = ''
        if (listItem.undertaker) {
          listItem.undertaker.forEach(item => {
            this.undertakerOptions.forEach(ele => {
              if (item === ele.commitmentUnitCode) {
                listItem.undertakerNames += ' ' + ele.commitmentUnitName
              }
            })
          })
        }
        listItem.milestoneLeaderOptions = []
        listItem.milestoneLeader = ''
        if (val) {
          listItem.milestoneLeaderOptions = await this.getAllUserPageByorgCode(val, 'u')
        }
      } else {
        this.milestoneLeaderOptions = []
        this.ruleForm.milestoneLeader = ''
        if (val) {
          this.milestoneLeaderOptions = await this.getAllUserPageByorgCode(val, 'u')
        }
      }
      if (listItem) {
        this.changeValue(listItem.id)
      }
    },
    async milestoneLeadershow (val, listItem) {
      if (!val) {
        if (listItem) {
          if (listItem.milestoneLeaderOptions.length === 0) {
            this.$message({
              showClose: true,
              message: '请先选择承担单位'
            })
          }
        } else {
          if (this.milestoneLeaderOptions.length === 0) {
            this.$message({
              showClose: true,
              message: '请先选择承担单位'
            })
          }
        }
      }
      if (val) {
        if (listItem) {
          listItem.editMilestoneLeader = ''
          listItem.milestoneLeaderOptions = await this.getAllUserPageByorgCode(listItem.undertaker, 'u')
        } else {
          this.ruleForm2.addMilestoneLeader = ''
          this.milestoneLeaderOptions = await this.getAllUserPageByorgCode(this.ruleForm.undertaker, 'u')
        }
      }
    },
    async milestoneReviewershow (val, listItem) {
      if (!val) {
        if (listItem) {
          if (listItem.milestoneReviewerOptions.length === 0) {
            this.$message({
              showClose: true,
              message: '请先选择需求单位'
            })
          }
        } else {
          if (this.milestoneReviewerOptions.length === 0) {
            this.$message({
              showClose: true,
              message: '请先选择需求单位'
            })
          }
        }
      }
      if (val) {
        if (listItem) {
          listItem.editMilestoneReviewer = ''
          listItem.milestoneReviewerOptions = await this.getAllUserPageByorgCode(listItem.demandUnit1, 'd')
        } else {
          this.ruleForm2.addMilestoneReviewer = ''
          this.milestoneReviewerOptions = await this.getAllUserPageByorgCode(this.ruleForm.demandUnit, 'd')
        }
      }
    },
    addMilestoneLeaderUidChange (val) {
      if (val) {
        this.milestoneLeaderOptions.some(item => {
          if (val === item.userName) {
            this.ruleForm.milestoneLeader = item.userName
            this.ruleForm.milestoneLeaderUid = item.userAccount
          }
        })
      } else {
        this.ruleForm.milestoneLeader = ''
      }
      this.changeValue('add')
    },
    addMilestoneReviewerUidChange (val) {
      if (val) {
        this.milestoneReviewerOptions.some(item => {
          if (val === item.userName) {
            this.ruleForm.milestoneReviewer = item.userName
            this.ruleForm.milestoneReviewerUid = item.userAccount
          }
        })
        this.$forceUpdate()
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate('milestoneReviewer')
        })
      } else {
        this.$forceUpdate()
        this.ruleForm.milestoneReviewer = ''
      }
      this.changeValue('add')
    },
    updatedManageOptions () {
      this.list.forEach(async item => {
        item.milestoneReviewerOptions = await this.getAllUserPageByorgCode(item.demandUnit1, 'd')
        item.milestoneLeaderOptions = await this.getAllUserPageByorgCode(item.undertaker, 'u')
      })
    },
    async getAllUserPageByorgCode (val, type, userName) { //查询成果负责人和成果需求人
      let sendData = {
        'projectCode': this.projectCode,
        'organizationCodeList': val
      }
      if (type === 'd') { //成果需求人和需求单位团队成员有关
        sendData.projectRoleCodes = ['PR-LEADER-DEMAND-MANAGER', 'PR-PARTNER-DEMAND-MANAGER']
      }
      if (type === 'u') { //成果负责人和承担单位团队成员有关
        sendData.projectRoleCodes = ['PR-LEADER-UNDERTAKER-MANAGER', 'PR-PARTNER-UNDERTAKER-MANAGER']
      }
      if (userName) {
        sendData.userName = userName
      }
      try {
        // 这里处理
        let res = await APIAchievement.queryProjectTeamList(sendData) || []
        res = val.length === 0 ? [] : res
        let res1 = []
        res.forEach(item => { //去重
          item.label = item.userName
          item.value = item.userAccount
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
    acceptCode () {
      bus.$on('groupPlanSendAchievementCode', (e) => {
        if (this.addvisable) { //如果有新增表单
          if (this.list.length) { //如果有 list
            this.list.forEach(item => {
              item.resultInformationList.forEach(item2 => {
                e.forEach(item3 => {
                  if (item2.achievementCode === item3.achievementCode) {
                    item2.achievementName = item3.achievementName
                  }
                })
              })
            })
            this.ruleForm.resultInformationList.forEach(item => {
              e.forEach(item2 => {
                if (item.achievementCode === item2.achievementCode) {
                  item.achievementName = item2.achievementName
                }
              })
            })
          } else {
            this.ruleForm.resultInformationList.forEach(item => {
              e.forEach(item2 => {
                if (item.achievementCode === item2.achievementCode) {
                  item.achievementName = item2.achievementName
                }
              })
            })
          }
        } else {
          if (this.list.length) {
            this.list.forEach(item => {
              item.resultInformationList.forEach(item2 => {
                e.forEach(item3 => {
                  if (item2.achievementCode === item3.achievementCode) {
                    item2.achievementName = item3.achievementName
                  }
                })
              })
            })
          }
        }
      })
      bus.$on('changeTeamInfo', (data) => {
        this.milestoneReviewerOptions = []
        this.demandUnitOptions = []
        this.milestoneLeaderOptions = []
        this.undertakerOptions = []
        data.projectCompanyList.forEach(item => {
          if (item.type === '1') {
            item.demandUnitCode = item.organizationCode
            item.demandUnitName = item.organizationName
            this.demandUnitOptions.push(item)
          } else if (item.type === '2') {
            item.commitmentUnitCode = item.organizationCode
            item.commitmentUnitName = item.organizationName
            this.undertakerOptions.push(item)
          }
        })
        this.list.forEach(item => {
          if (item.demandUnit1) {
            let demandUnit = []
            item.demandUnitNames = ''
            item.demandUnit1.forEach(ite => {
              this.demandUnitOptions.forEach(it => {
                if (ite === it.demandUnitCode) {
                  demandUnit.push(ite)
                  item.demandUnitNames += ' ' + it.demandUnitName
                }
              })
            })
            item.demandUnit1 = demandUnit
          }
          if (item.undertaker) {
            let demandUnit = []
            item.undertakerNames = ''
            item.undertaker.forEach(ite => {
              this.undertakerOptions.forEach(it => {
                if (ite === it.commitmentUnitCode) {
                  demandUnit.push(ite)
                  item.undertakerNames += ' ' + it.commitmentUnitName
                }
              })
            })
            item.undertaker = demandUnit
          }
        })
      })
    },
    async validate () {
      let numMsg = false
      return new Promise((resolve, reject) => {
        let flag = true //默认表单都是有效,并且数组长度为最大值和最小值之间
        this.list.forEach(listItem => {
          if (listItem.editable) {
            this.$refs['listItem' + listItem.id][0].validate((valid) => {
              if (!valid) {
                flag = false
                return false
              }
            })
          }
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
            this.addvisableForm.push(this.sentSaveParams())
            sendList = sendList.concat(this.list, this.addvisableForm)
            resolve(sendList)
          } else {
            resolve(this.list)
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
            milestoneCode: listItem.milestoneCode,
            projectCode: this.projectCode
            // milestoneCode: listItem.milestoneCode,
            // projectCode: 'R20201TN'
          }
          APIGroupPlan.removeProjectMilestoneD(sendData)
            .then(res => {
              this.$message({
                message: '删除成功！',
                type: 'success',
                showClose: true
              })
              this.emitGetNewUnit()
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
    isShowMilestone () { //查询当前用户所在公司里程碑数量配置 如果最大值为 0 则不展示,大于 0 展示请求列表里程碑责任人 options
      // this.getList()
      // this.getmilestoneLeader1()
      APIGroupPlan.queryProjectMilestoneNo({ projectCategory: this.projectCategory, projectCode: this.projectCode })
      // API.isShowMilestones()
        .then(res => {
          // res = { max: 2, min: 1 }
          this.maxAndMin = res
          // this.$emit('detailTableMilestoneShowOrHide', res.max > 0)
          // if (res.max > 0) {
          // if (this.projectCode && this.$route.params.projectCode) { //编辑页面进入
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
    // getmilestoneLeader1 () { //获取里程碑责任人 options
    //   let res = [{
    //     userAccount: 'qianyi@js.cmcc',
    //     userName: '钱易' }]
    //   if (res.length > 0) {
    //     res.forEach(item => {
    //       item.milestoneLeader = item.userName
    //       item.milestoneLeaderUid = item.userAccount
    //     })
    //     this.milestoneLeaderOptions = res
    //     this.$nextTick(() => {
    //       this.$refs.ruleForm.clearValidate()
    //     })
    //   }
    // },
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
    sentSaveParams () {
      let saveParams = {
        projectCode: this.projectCode,
        acceptanceStandard: this.ruleForm.acceptanceStandard,
        projectCategory: this.projectCategory,
        projectName: this.ruleForm.projectName,
        milestoneName: this.ruleForm.milestoneName,
        planFinishTime: this.ruleForm.planFinishTime,
        milestoneLeader: this.ruleForm.milestoneLeader,
        milestoneDescription: this.ruleForm.milestoneDescription,
        //测试加得
        milestoneLeaderUid: this.ruleForm.milestoneLeaderUid,
        milestoneReviewerUid: this.ruleForm.milestoneReviewerUid,
        milestoneReviewer: this.ruleForm.milestoneReviewer, //里程碑评审人
        //测试加得
        linkResultFlag: '1', //是否关联成果
        commitmentUnitList: [], //承担单位
        demandUnitList: [], //需求单位
        // resultInformationList: [{
        //   // milestoneCode: this.milestoneCode //里程碑编码
        // }] //获取成果编码，要调成果接口，获取成果编码
        resultInformationList: this.ruleForm.resultInformationList
      }
      this.demandUnitOptions.forEach(item => {
        if (Array.isArray(this.ruleForm.demandUnit)) {
          this.ruleForm.demandUnit.forEach(item2 => {
            if (item.demandUnitCode === item2) {
              saveParams.demandUnitList.push(item)
            }
          })
        } else {
          if (item.demandUnitCode === this.ruleForm.demandUnit) {
            saveParams.demandUnitList.push(item)
          }
        }
      })
      this.undertakerOptions.forEach(item => {
        if (Array.isArray(this.ruleForm.undertaker)) {
          this.ruleForm.undertaker.forEach(item2 => {
            if (item.commitmentUnitCode === item2) {
              saveParams.commitmentUnitList.push(item)
            }
          })
        } else {
          if (item.commitmentUnitCode === this.ruleForm.undertaker) {
            saveParams.commitmentUnitList.push(item)
          }
        }
      })
      if (this.ruleForm.resultInformationList && this.ruleForm.resultInformationList.length > 0) {
        // this.ruleForm.resultInformationList.forEach(item => {
        // item.resultCode = item.achievementCode
        saveParams.resultInformationList.forEach(item2 => {
          item2.resultCode = item2.achievementCode
        })
        // })
      }
      return saveParams
    },
    getList () { //查询里程碑列表
      APIGroupPlan.milestone(this.projectCode) //有问题
        .then(res => {
          //result
          let mileStoneTimeList = []
          res.forEach(item => {
            this.$set(item, 'editable', true)
            item.demandUnitNames = ''
            item.undertakerNames = ''
            item.demandUnit1 = []
            item.undertaker = []
            item.milestoneReviewerOptions = []
            item.milestoneLeaderOptions = []
            if (item.commitmentUnit && item.commitmentUnit.length > 0) {
              item.commitmentUnit.forEach(item1 => {
                item.undertaker.push(item1.commitmentUnitCode)
                item.undertakerNames += ' ' + item1.commitmentUnitName
              })
            }
            if (item.demandUnit && item.demandUnit.length > 0) {
              item.demandUnit.forEach(item2 => {
                item.demandUnit1.push(item2.demandUnitCode)
                item.demandUnitNames += ' ' + item2.demandUnitName
              })
            }
            item.resultInformationList = []
            // item.resultInformationList = item.resultList
            if (item.resultList && item.resultList.length > 0) {
              item.resultList.forEach(r => {
                item.resultInformationList.push(r)
              })
            }
            item.planFinishTime1 = item.planFinishTime
            let dateStr = item.planFinishTime + ' 00:00:00'
            // item.planFinishTime = new Date(item.planFinishTime + ' 00:00:00')
            //   .getTime()
            item.planFinishTime = Date.parse(dateStr.replace(/-/g, '/'))
            mileStoneTimeList.push(item.planFinishTime)
            // item.projectName = this.projectName
            if (item.resultInformationList && item.resultInformationList.length > 0) {
              item.resultInformationList.forEach(item2 => {
                item2.resultCode = item2.achievementCode
              })
            }
            item.commitmentUnitList = item.commitmentUnit
            item.demandUnitList = item.demandUnit
            item.editMilestoneReviewer = ''
            item.editMilestoneLeader = ''
          })
          //result
          this.list = res
          this.updatedManageOptions()
          this.list.forEach(item => {
            this.judgeMilestoneEdit(item)
          })
          bus.$emit('acceptMilestoneTime', [Math.max(...mileStoneTimeList) || null, Math.min(...mileStoneTimeList) || null])
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
    saveListItem (listItem) { //列表编辑暂存
      // let flag = true
      // if (this.addvisable) { //有新增表单
      //   if (this.list.length + 1 >= this.maxAndMin.max) {
      //     this.$message({
      //       message: `本单位里程碑个数上限为${this.maxAndMin.max}个,已添加${this.list.length + 1}个,如需继续添加,请联系本单位管理员修改里程碑个数限制`,
      //       type: 'warning',
      //       showClose: true
      //     })
      //     flag = false
      //   }
      // } else { //没有新增表单
      //   if (this.list.length >= this.maxAndMin.max) {
      //     this.$message({
      //       message: `本单位里程碑个数上限为${this.maxAndMin.max}个,已添加${this.list.length}个,如需继续添加,请联系本单位管理员修改里程碑个数限制`,
      //       type: 'warning',
      //       showClose: true
      //     })
      //     flag = false
      //   }
      // }
      // if (!flag) return
      // if (this.addvisable) {
      //   this.$message({
      //     message: `请先暂存新增的里程碑`,
      //     type: 'warning',
      //     showClose: true
      //   })
      //   return
      // }
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
          let saveParams = {
            id: listItem.id,
            acceptanceStandard: listItem.acceptanceStandard,
            milestoneCode: listItem.milestoneCode,
            projectCode: this.projectCode,
            projectName: this.projectName,
            milestoneName: listItem.milestoneName,
            projectCompanyCode: listItem.projectCompanyCode,
            projectCompanyName: listItem.projectCompanyName,
            milestoneCompany: listItem.milestoneCompany,
            planFinishTime: listItem.planFinishTime,
            milestoneLeader: listItem.milestoneLeader,
            milestoneDescription: listItem.milestoneDescription,
            milestoneReviewer: listItem.milestoneReviewer, //里程碑评审人
            milestoneLeaderUid: listItem.milestoneLeaderUid,
            milestoneReviewerUid: listItem.milestoneReviewerUid,
            linkResultFlag: listItem.linkResultFlag,
            linkVersion: listItem.linkVersion,
            linkResultInfo: listItem.resultInformation,
            commitmentUnitList: [
              // {
              //   milestoneCode: listItem.milestoneCode, //里程碑编码
              //   commitmentUnitCode: '112', //承担单位编码
              //   commitmentUnitBranchCode: '111123', //承担单位一级部门编码
              //   commitmentUnitName: '承担单位名称1',
              //   commitmentUnitBranchName: '承担单位一级部门名臣'
              // }
            ], //承担单位
            demandUnitList: [
              // {
              //   milestoneCode: listItem.milestoneCode, //里程碑编码
              //   demandUnitCode: '113', //需求单位编码
              //   demandUnitName: '需求单位名称'
              // }
            ], //需求单位
            resultInformationList: listItem.resultInformationList
            // resultInformationList: [{
            //   milestoneCode: listItem.milestoneCode //里程碑编码
            // }]
          }
          this.demandUnitOptions.forEach(item => {
            listItem.demandUnit1.forEach(item2 => {
              if (item.demandUnitCode === item2) {
                item.milestoneCode = listItem.milestoneCode //里程碑编码
                saveParams.demandUnitList.push(item)
              }
            })
          })
          this.undertakerOptions.forEach(item => {
            listItem.undertaker.forEach(item2 => {
              if (item.commitmentUnitCode === item2) {
                item.milestoneCode = listItem.milestoneCode //里程碑编码
                saveParams.commitmentUnitList.push(item)
              }
            })
          })
          if (listItem.resultInformationList && listItem.resultInformationList.length > 0) {
            // listItem.resultInformationList.forEach(item => {
            // item.resultCode = item.achievementCode
            saveParams.resultInformationList.forEach(item2 => {
              item2.resultCode = item2.achievementCode
            })
            // })
          }
          // APIGroupPlan.editProjectMilestoneD(saveParams)
          // API.isChange(saveParams)
          //   .then(res => {
          //     if (res) {
          APIGroupPlan.editProjectMilestoneD(saveParams)
            .then(res => {
              this.$message({
                message: '里程碑保存成功',
                type: 'success'
              })
              this.emitGetNewUnit()
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
    saveAdd () { //todo新增暂存改字段
      if (this.projectCode) {
        this.$forceUpdate() //强制刷新
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let saveParams = this.sentSaveParams()
            APIGroupPlan.addProjectMilestoneD(saveParams)
              .then(res => {
                this.$message({
                  message: '里程碑保存成功',
                  type: 'success'
                })
                this.emitGetNewUnit()
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
    judgeMilestoneEdit (milestone) { //有问题
      API.judgeMilestoneCanEdit(milestone.milestoneCode)
        .then(res => {
          this.$set(milestone, 'editable', res)
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
          this.emitGetNewUnit()
          this.changeInfo(false)
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
        // projectCode: 'R201234562R1',
        // name: this.tableDataInForm.name,
        subProjectCode: this.tableDataInForm.name,
        // responsibleUid: this.tableDataInForm.responsibleUid,
        achievementType: this.tableDataInForm.resultType,
        demandUnitCode: this.tableDataInForm.demandUnit
      }
      // API.queryLastAchievementPage(params) // 有问题，缺少接口
      // APIGroupPlan.queryLatestProjectAchievement(this.projectCode)
      APIGroupPlan.queryLastSubProjectAchievementD(params)
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
            this.list.forEach(item3 => { //todo判断关联成果为是这里不用判断
              item3.resultInformationList.forEach(item4 => {
                if (item4.achievementCode === item.achievementCode) {
                  flag = false
                }
              })
            })
            if (this.addvisable) { //有新增表单//todo判断关联成果为是这里不用判断
              this.ruleForm.resultInformationList.forEach(item5 => {
                if (item5.achievementCode === item.achievementCode) {
                  flag = false
                }
              })
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
        // this.validateAllForm()
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
            this.list.forEach(item3 => { //todo判断关联成果为是这里不用判断
              item3.resultInformationList.forEach(item4 => {
                if (item4.achievementCode === item.achievementCode) {
                  flag = false
                }
              })
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
          milestoneName: '', //里程碑名称
          planFinishTime: '', //计划结束时间
          demandUnit: [], //需求单位
          milestoneLeader: '', //里程碑责任人
          undertaker: [], //承担单位
          milestoneReviewer: '', //里程碑评审人
          milestoneDescription: '', //里程碑描述
          resultInformationList: [], //关联的成果
          resultInformation: '', //关联成果输入框
          milestoneLeaderUid: '', //里程碑责任人ID
          milestoneReviewerUid: '', //里程碑评审人id
          acceptanceStandard: '' //验收标准
        }
        if (this.$route.params.projectCode) { //编辑
          this.getmilestoneLeader()
          this.milestoneReviewerOptions = []
          this.milestoneLeaderOptions = []
        } else { //新增
          if (!this.projectCode || !this.saveFlag) { //有关联成果编码
            this.$message({
              message: '请先保存基本信息和团队信息',
              type: 'warning',
              showClose: true
            })
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
        demandUnit: '',
        resultType: ''
      }
      this.tableDataIn.body.pageNum = 1
      this.getChengGuoList()
    },
    getmilestoneLeader () { //todo获取里程碑责任人 options 从页面动态获取
      // let res = [{
      //   userAccount: 'qianyi@js.cmcc',
      //   userName: '钱易' }]
      // if (res.length > 0) {
      // res.forEach(item => {
      //   item.milestoneLeader = item.userName
      //   item.milestoneLeaderUid = item.userAccount
      // })
      // this.milestoneLeaderOptions.concat(res)
      this.addvisable = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
      this.changeValue() //新增里程碑-状态未保存
      // } else {
      //   this.$message({
      //     message: '请先保存基本信息和团队信息',
      //     type: 'warning',
      //     showClose: true
      //   })
      // }
      // let sendData = {
      //   projectCode: this.projectCode,
      //   projectRoleCodes: 'PR-MANAGER'
      // }
      // API.queryProjectMembers(sendData)
      //   .then(res => {
      //     if (res.length > 0) {
      //       res.forEach(item => {
      //         item.milestoneLeader = item.userName
      //         item.milestoneLeaderUid = item.userAccount
      //       })
      //       this.milestoneLeaderOptions = res
      //       this.addvisable = true
      //       this.$nextTick(() => {
      //         this.$refs.ruleForm.clearValidate()
      //       })
      //       this.changeInfo(false) //新增里程碑-状态未保存
      //     } else {
      //       this.$message({
      //         message: '请先保存基本信息和团队信息',
      //         type: 'warning',
      //         showClose: true
      //       })
      //     }
      //   })
      //   .catch(e => {
      //     this.loading = false
      //     if (e.selfError) return
      //     this.$message({
      //       message: e.message || '查询里程碑责任人失败',
      //       type: 'error',
      //       showClose: true
      //     })
      //   })
    },
    getDemendUnit () { //获取需求单位 options
      let sendData = {
        projectCode: this.projectCode
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
    getrwtype () { //查询任务/成果类型  有问题
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
    //设置行是否可选 //最后返回的有问题
    setSelectable (row, index) {
      // let results = []
      // this.list.forEach(item => {
      //   results = results.concat(item.resultInformationList)
      // })
      // results = results.concat(this.ruleForm.resultInformationList)
      // // let flag = results.some(item => item.resultCode === row.resultCode)
      // let flag = results.some(item => {
      //   if (item && item.resultCode) {
      //     return item.resultCode === row.resultCode
      //   } else {
      //     return false
      //   }
      // })
      // return !flag
      // 3.26变更-问题修复
      let results = []
      this.list.forEach(item => {
        results = results.concat(item.resultInformationList)
      })
      if (this.addvisable) {
        results = results.concat(this.ruleForm.resultInformationList)
      }
      let flag = results.some(item => item.resultCode === row.resultCode)
      return !flag
      //如果里程碑列表的成果编码和预期成果弹框中选择的那一行的数据的成果编码相同那么就不可选
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
     * 传到团队信息重新获取单位
     */
    emitGetNewUnit () {
      bus.$emit('updateSubprojectInfo')
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
  beforeDestroy () {
    // bus.$off('changeTeamInfo')
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
  /deep/ .el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
    overflow: scroll!important;
    height: 160px;
  }
  .project-panel{
    margin-bottom: 0px;
  }
  /deep/.project-panel .panel-body {
    margin-bottom: 0px !important;
  }
  .project-panel .panel-body{
    margin-bottom: 0;
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
        padding: 0px 15px;
        border: 1px solid #E5E5E5;
        float: left;
        width: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 14px;
      .butt{
        float: right;
        height: 100%;
        i{
          // color: #0b82ff;
        }
      }
      .disabled{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba($color: #f0f0f0, $alpha: 0.8);
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
    .selectrowbody {
      /deep/ .el-select-dropdown  {
        z-index: 10 !important;
      }
    }
  }
}
</style>
