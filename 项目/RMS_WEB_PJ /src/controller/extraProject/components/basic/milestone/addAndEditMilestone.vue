<template>
  <div class="addAndEditMilestone" v-if="maxAndMin.MAX>0">
    <projectPanel title="里程碑" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button
          class="normal-btn"
          @click="addMilestone"
          icon="el-icon-circle-plus-outline"
        >添加里程碑</el-button>
      </template>
      <div class="body-con">
        <!-- 新增框 -->
        <projectPanel :title="ruleForm.milestoneName"  class="addcon el-width-640" v-show="addvisable">
          <template v-slot:img>
            <div style="width: 16px;margin-right:10px">
              <img src="../../../../../assets/icons/里程碑.svg" alt="">
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
                    ref="milestoneName"
                    placeholder="请输入"
                    show-word-limit
                    v-model.trim="ruleForm.milestoneName"
                    @change="handleEditSomeMileStone('add')"
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
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    placeholder="请选择"
                    @change="handleEditSomeMileStone('add')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="里程碑责任人:"
                  prop="milestoneLeaderUid">
                  <el-select
                    @change='addMilestoneLeaderUidChange'
                    v-model="ruleForm.milestoneLeaderUid"
                    placeholder="请选择"
                    @visible-change ="projectManagershow($event, ruleForm, 'milestoneLeader')"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="ruleForm.addLeadDemandManager"
                        placeholder="请输入名称"
                        clearable
                        @clear="getmilestoneLeader1(ruleForm.milestoneLeaderUid)"
                        @keyup.enter.native="getmilestoneLeader1(ruleForm.milestoneLeaderUid,ruleForm.addLeadDemandManager)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="getmilestoneLeader1(ruleForm.milestoneLeaderUid,ruleForm.addLeadDemandManager)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-for="item in milestoneLeaderOptions"
                      :key="item.milestoneLeaderUid"
                      :label="item.milestoneLeader"
                      :value="item.milestoneLeaderUid"
                      v-show="!item.isHidden"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="ruleForm.addLeadDemandManager"
                          placeholder="请输入名称"
                          clearable
                          @clear="getmilestoneLeader1(ruleForm.milestoneLeaderUid)"
                          @keyup.enter.native="getmilestoneLeader1(ruleForm.milestoneLeaderUid,ruleForm.addLeadDemandManager)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="getmilestoneLeader1(ruleForm.milestoneLeaderUid,ruleForm.addLeadDemandManager)"
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
                    ref="milestoneDescription"
                    style="width:100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    v-model="ruleForm.milestoneDescription"
                    @change="handleEditSomeMileStone('add')">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  label="是否关联任务及预期成果:"
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
                  label="关联任务及预期成果信息:"
                  prop='resultInformationList'
                >
                  <el-input
                    v-model="ruleForm.resultInformationList"
                    v-if="false"
                    @change="handleEditSomeMileStone('add')"></el-input>
                  <div class="tabcon">
                    <div
                      class="item"
                      v-for="item in ruleForm.resultInformationList"
                      :key="item.id"
                      v-show='ruleForm.resultInformationList'>
                      <el-tooltip
                        :disabled='item.achievementName.length<8'
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
                    <span style="font-size:14px;color:#666;">关联任务及预期成果信息:</span>
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
                  label="任务及预期成果信息:"
                  prop="resultInformation"
                >
                  <el-input
                    ref="resultInformationList"
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    v-model="ruleForm.resultInformation"
                    @change="handleEditSomeMileStone('add')">
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
          v-for="listItem in list"
          :key="listItem.id">
          <template v-slot:img>
            <div style="width: 16px;margin-right:10px">
              <img src="../../../../../assets/icons/里程碑.svg" alt="" style="margin-right:10px">
            </div>
          </template>
          <template v-slot:header v-if="listItem.editable">
            <el-button  @click="saveListItem(listItem)"  class="normal-btn">保存本区块信息</el-button>
            <el-button
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
                    :ref="'milestoneName'+listItem.id"
                    v-if="listItem.editable"
                    placeholder="请输入"
                    show-word-limit
                    v-model.trim="listItem.milestoneName"
                    @change="changeInfo(false,listItem.id)"
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
                    v-if="listItem.editable"
                    style="width:100%"
                    v-model="listItem.planFinishTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    placeholder="请选择"
                    @change="changeInfo(false,listItem.id)"
                  ></el-date-picker>
                  <span v-else>{{listItem.planFinishTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="里程碑责任人:"
                  prop="milestoneLeaderUid">
                  <el-select
                    v-if="listItem.editable"
                    @change='editMilestoneLeaderUidChange($event,listItem)'
                    @visible-change ="projectManagershow($event, listItem, 'milestoneLeader')"
                    v-model="listItem.milestoneLeaderUid"
                    placeholder="请选择"
                    clearable>
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="listItem.addLeadDemandManager"
                        placeholder="请输入名称"
                        clearable
                        @keyup.enter.native="getmilestoneLeader1(listItem.milestoneLeaderUid,listItem.addLeadDemandManager)"
                        @clear="getmilestoneLeader1(listItem.milestoneLeaderUid)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="getmilestoneLeader1(listItem.milestoneLeaderUid,listItem.addLeadDemandManager)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-for="item in milestoneLeaderOptions"
                      :key="item.milestoneLeaderUid"
                      :label="item.milestoneLeader"
                      v-show="!item.isHidden"
                      :value="item.milestoneLeaderUid"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="listItem.addLeadDemandManager"
                          placeholder="请输入名称"
                          clearable
                          @keyup.enter.native="getmilestoneLeader1(listItem.milestoneLeaderUid,listItem.addLeadDemandManager)"
                          @clear="getmilestoneLeader1(listItem.milestoneLeaderUid)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="getmilestoneLeader1(listItem.milestoneLeaderUid,listItem.addLeadDemandManager)"
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
                    :ref="'milestoneDescription'+listItem.id"
                    v-if="listItem.editable"
                    style="width:100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    v-model="listItem.milestoneDescription"
                    @change="changeInfo(false,listItem.id)">
                  </el-input>
                  <span v-else>{{listItem.milestoneDescription}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label-width="180px"
                  label="是否关联任务及预期成果:"
                  prop="linkResultFlag"
                >
                  <el-radio-group v-if="listItem.editable"  v-model="listItem.linkResultFlag" @change='listRadioChange(listItem,listItem.linkResultFlag)'>
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
                  label="关联任务及预期成果信息:"
                  prop='resultInformationList'
                >
                  <el-input
                    v-model="listItem.resultInformationList"
                    v-if="false"
                    @change="changeInfo(false,listItem.id)"></el-input>
                  <div class="tabcon" v-if="listItem.editable">
                    <div
                      class="item"
                      v-for="(item, index) in listItem.resultInformationList"
                      :key="item.id || index"
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
                      v-for="(item, index) in listItem.resultList"
                      :key="item.id || index"
                      v-show='listItem.resultList'>
                      <span>{{item.achievementName}}</span>
                      <span>;</span>
                    </div>
                  </div>
                </el-form-item>
                <!-- <div style="display: flex;margin-bottom: 20px" v-if="listItem.linkResultFlag=='1'">
                  <div>
                    <span style="color:red;">&nbsp;*&nbsp;</span>
                    <span style="font-size:14px;color:#666;">关联任务及预期成果信息:</span>
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
                  label="任务及预期成果信息:"
                  prop="resultInformation"
                >
                  <el-input
                    :ref="'resultInformationList'+ listItem.id "
                    v-if="listItem.editable"
                    style="width: 100%"
                    :rows="2"
                    show-word-limit
                    maxlength="512"
                    type="textarea"
                    placeholder="请输入"
                    v-model="listItem.resultInformation"
                    @change="changeInfo(false,listItem.id)">
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
        title="关联成果"
        :visible.sync="dialogVisible"
        width="925px"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
          ref="searchForm"
          :model="tableDataInForm"
          :inline="true">
          <div class='searchrow'>
            <el-form-item
              label-position="right"
              label="任务名称:"
              prop="name"
              style="margin-right:10px;margin-bottom:10px"
            >
              <el-input
                @keyup.enter.native="getResSearch"
                v-model.trim="tableDataInForm.name"
                clearable
                style="width:220px"></el-input>
            </el-form-item>
            <!-- <i class="el-icon-d-arrow-left" :style="{border: '1px solid #E5E5E5',width:'30px',height:'30px','margin-top': '5px','margin-right':tableDataInSearchMoreFlag==='0'?'375px':'10px'}" v-if="tableDataInSearchMoreFlag==='0'"></i> -->
            <span
              class="el-icon-arrow-down"
              :style="{'padding-top': '6px','text-align': 'center','box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-top': '5px','margin-right':tableDataInSearchMoreFlag==='0'?'387px':'10px'}"
              src="../../../../../assets/icons/保存.svg"
              @click="tableDataInSearchMore"
              v-if="tableDataInSearchMoreFlag==='0'"/>
            <!-- <img
              :style="{width:'30px',height:'30px','margin-top': '5px','margin-right':tableDataInSearchMoreFlag==='0'?'375px':'10px'}"
              src="../../../../../assets/icons/保存.svg"
              @click="tableDataInSearchMore"
              v-if="tableDataInSearchMoreFlag==='0'"/> -->
            <!-- <img
              style='background:red;width:30px;height:30px;margin-top: 5px;margin-right:10px'
              src="../../../../../assets/icons/保存.svg"
              @click="tableDataInSearchless"
              v-if="tableDataInSearchMoreFlag==='1'"/> -->
            <span
              class="el-icon-arrow-up"
              :style="{'padding-top': '6px','text-align': 'center','box-sizing':'border-box','border': '1px solid #E5E5E5','border-radius': '2px',width:'30px',height:'30px','margin-top': '5px','margin-right':tableDataInSearchMoreFlag==='0'?'387px':'10px'}"
              src="../../../../../assets/icons/保存.svg"
              @click="tableDataInSearchless"
              v-if="tableDataInSearchMoreFlag==='1'"/>
            <el-form-item
              label-position="right"
              label="成果负责人:"
              prop="responsibleUid"
              style="margin-right:10px;margin-bottom:10px"
              v-if="tableDataInSearchMoreFlag==='1'"
            >
              <el-select
                :popper-append-to-body="false"
                @keyup.enter.native="getResSearch"
                v-model="tableDataInForm.responsibleUid"
                @visible-change ="projectManagershow($event, tableDataInForm)"
                placeholder="请选择"
                style="width:220px"
                clearable>
                <div style="padding:5px 20px">
                  <el-input
                    class="inputw"
                    v-model="tableDataInForm.addLeadDemandManager"
                    placeholder="请输入名称"
                    clearable
                    @clear="getcgfzr(tableDataInForm.responsibleUid)"
                    @keyup.enter.native="getcgfzr(tableDataInForm.responsibleUid,tableDataInForm.addLeadDemandManager)"
                  ><i
                    class="el-icon-search"
                    slot="suffix"
                    @click="getcgfzr(tableDataInForm.responsibleUid,tableDataInForm.addLeadDemandManager)"
                  >
                  </i>
                  </el-input>
                </div>
                <el-option
                  v-for="item in cgfzroptions"
                  :key="item.userAccount"
                  :label="item.userName"
                  v-show="!item.isHidden"
                  :value="item.userAccount"
                ></el-option>
                <template slot="empty">
                  <div style="padding:5px 20px">
                    <el-input
                      class="inputw"
                      v-model="tableDataInForm.addLeadDemandManager"
                      placeholder="请输入名称"
                      clearable
                      @clear="getcgfzr(tableDataInForm.responsibleUid)"
                      @keyup.enter.native="getcgfzr(tableDataInForm.responsibleUid,tableDataInForm.addLeadDemandManager)"
                    ><i
                      class="el-icon-search"
                      slot="suffix"
                      @click="getcgfzr(tableDataInForm.responsibleUid,tableDataInForm.addLeadDemandManager)"
                    >
                    </i>
                    </el-input>
                  </div>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-right:0;margin-bottom:10px" v-show="tableDataInSearchMoreFlag==='0'">
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
          <div class='searchrow'>
            <el-form-item
              label-position="right"
              label="成果类型:"
              v-show="tableDataInSearchMoreFlag==='1'"
              prop="resultType"
              style="margin-right: 427px;margin-bottom:10px"
            >
              <el-tooltip
                placement="top-start"
                :content="getTooltipName(tableDataInForm.resultType,rwtypeoptions)"
                :disabled="!getTooltipName(tableDataInForm.resultType,rwtypeoptions)">
                <el-select
                  @keyup.enter.native="getResSearch"
                  v-model="tableDataInForm.resultType"
                  placeholder="请选择"
                  style="width:220px"
                  clearable>
                  <el-option
                    v-for="item in rwtypeoptions"
                    :key="item.name"
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
            <el-form-item style="margin-right:0;margin-bottom:10px" v-show="tableDataInSearchMoreFlag==='1'">
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
import selfTable from '../../../../../components/table/index'
import projectPanel from '../../../../components/projectPanel/index'
import API from '../../../../../serve/API_project'

import bus from '../../../../../common/bus'
import { isShowToolTip } from '@/utils/common.js'
export default {
  props: {
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
    //当前区块是否已保存
    isSave: {
      type: Object,
      default: () => {}
    },
    //基本信息属性
    receiveData: {
      type: Object,
      default: () => {}
    },
    resultsTypeOption: {
      type: Array,
      default: () => []
    },
    tipLanguage: {
      type: Object,
      default: () => {}
    },
    saveProject: {
      type: Number,
      default: 0
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
    return {
      maxAndMin: { MAX: 0, MIN: 0 },
      list: [], //里程碑列表
      rwtypeoptions: [{ label: '标准化-立项', value: '标准化-立项' }], //任务类型/成果类型 options
      cgfzroptions: [{ label: 'cmss@1', value: 'cmss@1' }], //成果负责人 options
      milestoneLeaderOptions: [],
      projectManagerOptions: [],
      tableDataIn: { //内层详情表格数据
        body: { pageSize: 10, pageNum: 1 },
        total: 12,
        list: []
      },
      loading: false,
      tableColsIn: [
        { label: '任务名称', prop: 'achievementName', align: 'left', overflow: true, resizable: false },
        { label: '成果类型', prop: 'achievementTypeValue', align: 'left', overflow: true, resizable: false },
        { label: '预期交付时间', prop: 'deliveryTime', align: 'left', overflow: true, resizable: false, formatter: this.formatDate },
        { label: '成果负责人', prop: 'responsiblePerson', align: 'left', overflow: true, resizable: false }
      ],
      tableDataInSearchMoreFlag: '0', //弹框搜索更多 0隐藏 1 显示更多
      tableDataInForm: { //弹框搜索表单
        name: '',
        responsibleUid: '',
        resultType: '',
        addLeadDemandManager: '' //成果负责人模糊查询
      },
      dialogVisible: false,
      addvisable: false, //新增显隐
      planApprovalTime: '',
      planFinishTime: '',
      pickerOptions: {
        disabledDate: time => {
          if (this.planFinishTime && this.planApprovalTime) {
            return (
              time.getTime() < new Date(this.planApprovalTime)
                .getTime() || time.getTime() >
              new Date(this.planFinishTime)
                .getTime()
            )
          } else {
            return time.getTime() < Date.now() - 8.64e7 //禁用以前的日期，今天不禁用
            // return date.getTime() <= Date.now();    //禁用今天以及以前的日期
          }
        }
      },
      ruleForm: {
        addLeadDemandManager: '',
        milestoneName: '', //里程碑名称
        planFinishTime: '', //计划结束时间
        milestoneLeader: '', //里程碑责任人
        milestoneDescription: '', //里程碑描述
        linkResultFlag: '1', //是否关联成果
        resultInformationList: [], //关联的成果
        resultInformation: '', //关联成果输入框
        milestoneLeaderUid: '',
        projectCategory: 'PC-SELF-UNIT'
      },
      rules: {
        milestoneName: [
          { required: true, message: '请输入里程碑名称', trigger: ['change', 'blur'] },
          { max: 128, message: '长度在128个字符以内', trigger: ['change', 'blur'] },
          { validator: validSameName, trigger: ['change', 'blur'] }
        ],
        planFinishTime: [{ required: true, message: '请选择计划完成时间', trigger: ['change', 'blur'] }],
        milestoneLeaderUid: [{ required: true, message: '请选择里程碑责任人', trigger: ['change', 'blur'] }],
        linkResultFlag: [{ required: true, message: '请选择是否关联任务及预期成果', trigger: ['change', 'blur'] }],
        resultInformation: [{ required: true, message: '请输入任务及预期成果信息', trigger: ['change', 'blur'] }],
        resultInformationList: [{ required: true, message: '请选择关联任务及预期成果信息', trigger: ['change', 'blur'] }]
      },
      editLinkResultFlagId: '', //关联成果弹框打开的时候判断是新增的打开还是列表的打开
      isEditable: true,
      isTempSave: {},
      editMilestoneId: '', //标识当前哪个里程碑有字段被改动并且未保存
      resultsTypeOptions: [],
      language: '暂无基线信息',
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
          value: '任务及预期成果'
        }, {
          label: 'linkResultFlag',
          value: '是否关联任务及预期成果'
        }, {
          label: 'all',
          value: '全部'
        }, {
          label: 'no',
          value: '非全部'
        }]
    }
  },
  watch: {
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
    },
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.planApprovalTime = val ? val.planApprovalTime : ''
        this.planFinishTime = val ? val.planFinishTime : ''
      }
    },
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
            if (add.length === 1 && add[0] === '全部') {
              this.language = '里程碑中所有可编辑字段都是基线字段；'
              return
            }
            if (add.length === 1 && add[0] === '非全部') {
              this.language = '里程碑中没有基线字段；'
              return
            }
            this.language = `里程碑中的基线字段：${add.join('、')}；`
          } else {
            this.language = '里程碑中没有基线字段；'
          }
        }
      }
    },
    saveProject: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.getList()
          this.editMilestoneId = ''
          this.addvisable = false
        }
      }
    },
    resultsTypeOption: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.resultsTypeOptions = val
        }
      }
    }
  },
  mounted () {
    // this.getResultsType()
    this.isShowMilestone()
    this.acceptCode()
    this.acceptTeamInfoData() //监听项目经理变化
    this.acceptSubProjectData()
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
    editMilestoneLeaderUidChange (val, listItem) {
      if (val) {
        this.list.forEach(item => {
          if (item.id === listItem.id) {
            this.milestoneLeaderOptions.some(item2 => {
              if (val === item2.milestoneLeaderUid) {
                item.milestoneLeader = item2.milestoneLeader
              }
            })
          }
        })
      } else {
        this.list.forEach(item => {
          if (item.id === listItem.id) {
            listItem.milestoneLeader = ''
          }
        })
      }
      this.changeInfo(false, listItem.id)
    },
    addMilestoneLeaderUidChange (val) {
      if (val) {
        this.milestoneLeaderOptions.some(item => {
          if (val === item.milestoneLeaderUid) {
            this.ruleForm.milestoneLeader = item.milestoneLeader
          }
        })
      } else {
        this.ruleForm.milestoneLeader = ''
      }
      this.handleEditSomeMileStone('add')
    },
    acceptCode () {
      bus.$on('sendAchievementCode', (e) => {
        if (this.addvisable) { //如果有新增表单
          if (this.list.length) { //如果有 list
            this.list.forEach(item => {
              this.$set(item, 'addLeadDemandManager', '') //里程碑责任人模糊查询字段
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
              this.$set(item, 'addLeadDemandManager', '') //里程碑责任人模糊查询字段
              item.resultInformationList.forEach(item2 => {
                if (item2.achievementCode === e.achievementCode) {
                  item2.achievementName = e.achievementName
                }
              })
            })
          }
        }
      })
    },
    acceptTeamInfoData (e) { //实时监听团队信息传过来的数据,更新项目经理下拉数据
      bus.$on('changeManageList', (arr) => {
        this.getmilestoneLeader1()
      })
    },
    acceptSubProjectData () { //实时监听团队信息传过来的数据,更新项目经理下拉数据
      bus.$on('changeResultInfo', (arr) => {
        // console.log('子项目传来的信息')
        this.getList()
      })
    },
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
      this.handleEditSomeMileStone('add')
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
      this.changeInfo(false, listItem.id)
    },
    async validate () {
      let numMsg = false
      return new Promise((resolve, reject) => {
        let flag = true //默认表单都是有效,并且数组长度为最大值和最小值之间
        if (this.maxAndMin.MAX > 0) {
          this.list.forEach(listItem => {
            this.$refs['listItem' + listItem.id][0].validate((valid) => {
              if (!valid) {
                flag = false
                return false
              }
            })
          })
        }
        if (this.addvisable) { //有新增表单
          this.$refs.ruleForm.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          /* if (!(this.list.length + 1 <= this.maxAndMin.MAX && this.list.length + 1 >= this.maxAndMin.MIN)) {
            if (flag) numMsg = true //必填项校验成功时才校验数量
            flag = false
          } */
        } else { //没有新增表单
          /* if (!(this.list.length <= this.maxAndMin.MAX && this.list.length >= this.maxAndMin.MIN)) {
            if (flag) numMsg = true //必填项校验成功时才校验数量
            flag = false
          } */
        }
        if (flag) {
          if (this.list && this.list.length) {
            this.list.forEach(listItem => {
              listItem.projectCode = this.projectCode
              this.projectManagerOptions.forEach(item => {
                if (listItem.milestoneLeader === item.chineseName) {
                  listItem.milestoneLeaderUid = item.uid
                }
              })
            })
            // this.list = this.list.filter(item => item.editable)
          }
          if (this.addvisable) {
            let sendList = []
            sendList = sendList.concat(this.list, this.ruleForm)
            resolve(sendList)
          } else {
            if (this.maxAndMin.MAX > 0) {
              resolve(this.list)
            } else {
              resolve('MAX0')
            }
          }
        } else {
          if (numMsg) {
            let msg = ''
            if (this.maxAndMin.MIN === this.maxAndMin.MAX) {
              msg = `请添加${this.maxAndMin.MIN}个里程碑！`
            } else {
              msg = `请添加${this.maxAndMin.MIN}~${this.maxAndMin.MAX}个里程碑！`
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
      if (!this.isEditable) {
        this.focusIn()
        if (!this.isTempSave.milestone) {
          let keys = Object.keys(this.isTempSave)
          let only = true //只要当前区块未保存时
          keys.some(key => {
            if (!this.isTempSave[key] && key !== 'milestone') {
              only = false
              return true
            }
          })
          if (!only) return
        }
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
          API.deleteMileStoneBaseInfo(sendData)
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
    isShowMilestone () { //查询当前用户所在公司里程碑数量配置 如果最大值为 0 则不展示,大于 0 展示请求列表里程碑责任人 options
      API.isShowMilestones()
        .then(res => {
          // res = { MAX: 2, MIN: 1 }
          this.maxAndMin = res
          this.$emit('detailTableMilestoneShowOrHide', res.MAX > 0)
          if (res.MAX > 0) {
            if (this.projectCode && this.$route.params.projectCode) { //编辑页面进入
              this.getList()
            }
          }
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
    //里程碑负责人和成果负责人下拉收起清空模糊查询
    projectManagershow (event, curentItem, type) {
      if (!event) {
        curentItem.addLeadDemandManager = ''
        if (type === 'milestoneLeader') {
          this.getmilestoneLeader1()
        } else {
          this.getcgfzr()
        }
      }
    },
    getmilestoneLeader1 (uid, userName) { //获取里程碑责任人 options
      // uid 当前下拉框选中人员的id
      // options 当前下拉列表人员集合
      // userName 模糊搜索字符串
      let currentItem = []
      if (uid && this.milestoneLeaderOptions) {
        currentItem = this.milestoneLeaderOptions.filter(item => item.milestoneLeaderUid === uid)
      }
      let sendData = {
        projectCode: this.projectCode,
        projectRoleCodes: 'PR-MANAGER,PR-MEMBER',
        userName: userName || ''
      }
      API.queryProjectMembers(sendData)
        .then(res => {
          if (res.length > 0) {
            res.forEach(item => {
              item.milestoneLeader = item.userName
              item.milestoneLeaderUid = item.userAccount
            })
            this.milestoneLeaderOptions = res
            if (uid) {
              let hasSelectManager = this.milestoneLeaderOptions.some(item2 => {
                return item2.userAccount === uid
              })
              if (!hasSelectManager && currentItem[0]) {
                this.$set(currentItem[0], 'isHidden', true)
                this.milestoneLeaderOptions = this.milestoneLeaderOptions.concat(currentItem)
              }
            }
            if (this.list.length) {
              this.list.forEach(listItem => {
                let isHaveoption = this.milestoneLeaderOptions.some(iitem => {
                  return iitem.milestoneLeaderUid === listItem.milestoneLeaderUid
                })
                if (!isHaveoption) {
                  listItem.milestoneLeaderUid = listItem.milestoneLeader
                }
              })
            }
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询里程碑责任人失败',
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
      API.milestone(this.projectCode)
        .then(res => {
          res.forEach(item => {
            this.$set(item, 'editable', true)
            if (!item.projectCategory) {
              this.$set(item, 'projectCategory', 'PC-SELF-UNIT')
            }
            item.resultInformationList = []
            if (item.resultList && item.resultList.length > 0) {
              item.resultList.forEach(r => {
                item.resultInformationList.push(r)
              })
            }
            item.projectName = this.projectName
            item.resultInformationList.forEach(item2 => {
              item2.resultCode = item2.achievementCode
            })
          })
          this.list = res
          this.getmilestoneLeader1()
          this.list.forEach(item => {
            this.judgeMilestoneEdit(item)
          })
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
    saveListItem (listItem) { //列表编辑保存
      // let flag = true
      // if (this.addvisable) { //有新增表单
      //   if (this.list.length + 1 >= this.maxAndMin.MAX) {
      //     this.$message({
      //       message: `本单位里程碑个数上限为${this.maxAndMin.MAX}个,已添加${this.list.length + 1}个,如需继续添加,请联系本单位管理员修改里程碑个数限制`,
      //       type: 'warning',
      //       showClose: true
      //     })
      //     flag = false
      //   }
      // } else { //没有新增表单
      //   if (this.list.length >= this.maxAndMin.MAX) {
      //     this.$message({
      //       message: `本单位里程碑个数上限为${this.maxAndMin.MAX}个,已添加${this.list.length}个,如需继续添加,请联系本单位管理员修改里程碑个数限制`,
      //       type: 'warning',
      //       showClose: true
      //     })
      //     flag = false
      //   }
      // }
      // if (!flag) return
      // if (this.addvisable) {
      //   this.$message({
      //     message: `请先保存新增的里程碑`,
      //     type: 'warning',
      //     showClose: true
      //   })
      //   return
      // }
      this.$refs['milestoneName' + listItem.id][0].blur()
      this.$refs['milestoneDescription' + listItem.id][0].blur()
      if (this.$refs['resultInformationList' + listItem.id] && this.$refs['resultInformationList' + listItem.id].length) {
        this.$refs['resultInformationList' + listItem.id][0].blur()
      }
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
          this.projectManagerOptions.forEach(item => {
            if (listItem.milestoneLeader === item.chineseName) {
              listItem.milestoneLeaderUid = item.uid
            }
          })
          let saveParams = {
            id: listItem.id,
            milestoneCode: listItem.milestoneCode,
            projectCode: this.projectCode,
            projectName: this.projectName,
            projectCategory: 'PC-SELF-UNIT',
            milestoneName: listItem.milestoneName,
            planFinishTime: listItem.planFinishTime,
            milestoneLeader: listItem.milestoneLeader,
            milestoneDescription: listItem.milestoneDescription,
            linkResultFlag: listItem.linkResultFlag,
            milestoneLeaderUid: listItem.milestoneLeaderUid
          }
          if (listItem.status) {
            saveParams.status = listItem.status
          }
          if (listItem.milestoneLeaderUid) {
            let isHaveName = this.milestoneLeaderOptions.some(item => {
              return item.milestoneLeaderUid === listItem.milestoneLeaderUid
            })
            if (!isHaveName) {
              this.$message({
                message: '当前里程碑责任人选项中没有' + listItem.milestoneLeaderUid + ',请重新选择里程碑责任人！',
                type: 'error',
                showClose: true
              })
              return
            }
          }
          if (saveParams.linkResultFlag === '0') { //未关联成果
            saveParams.resultInformation = listItem.resultInformation
          } else { //关联成果
            saveParams.resultInformationList = listItem.resultInformationList
            saveParams.resultInformationList.forEach(item => {
              item.resultCode = item.achievementCode
            })
          }
          API.isChange(saveParams)
            .then(res => {
              if (res) {
                API.updateMileStoneBaseInfo(saveParams)
                  .then(res => {
                    this.$message({
                      message: '里程碑保存成功',
                      type: 'success'
                    })
                    this.loading = false
                    this.addvisable = false
                    this.getList()
                    this.$emit('saveBlock') //保存区块成功
                    this.editMilestoneId = '' //保存成功后清空
                  })
                  .catch(e => {
                    this.loading = false
                    if (e.selfError) return
                    if (e.message) {
                      this.$message({
                        message: e.message || '提交失败',
                        type: 'error',
                        showClose: true
                      })
                    }
                  })
              } else {
                this.$emit('saveBlock') //保存区块成功
                this.$message({
                  message: '里程碑保存成功',
                  type: 'success',
                  showClose: true
                })
              }
            })
            .catch(e => {
              if (!e.selfError) {
                this.$message({
                  message: e.message || '服务器异常，请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        }
      })
    },
    saveAdd () { //新增保存
      this.$refs.milestoneName.blur()
      this.$refs.milestoneDescription.blur()
      if (this.$refs.resultInformationList) {
        this.$refs.resultInformationList.blur()
      }
      if (this.projectCode) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let saveParams = {
              projectCode: this.projectCode,
              projectName: this.projectName,
              projectCategory: 'PC-SELF-UNIT',
              milestoneName: this.ruleForm.milestoneName,
              planFinishTime: this.ruleForm.planFinishTime,
              milestoneLeader: this.ruleForm.milestoneLeader,
              milestoneDescription: this.ruleForm.milestoneDescription,
              linkResultFlag: this.ruleForm.linkResultFlag,
              milestoneLeaderUid: this.ruleForm.milestoneLeaderUid
            }
            if (saveParams.linkResultFlag === '0') { //未关联成果
              saveParams.resultInformation = this.ruleForm.resultInformation
              this.ruleForm.resultInformationList = []
            } else { //关联成果
              saveParams.resultInformationList = this.ruleForm.resultInformationList
              saveParams.resultInformationList.forEach(item => {
                item.resultCode = item.achievementCode
              })
            }
            API.updateMileStoneBaseInfo(saveParams)
              .then(res => {
                this.$message({
                  message: '里程碑保存成功',
                  type: 'success'
                })
                this.loading = false
                this.addvisable = false
                this.getList()
                this.$emit('saveBlock') //保存区块成功
                this.editMilestoneId = '' //保存成功后清空
              })
              .catch(e => {
                this.loading = false
                if (e.selfError) return
                if (e.message) {
                  this.$message({
                    message: e.message || '提交失败',
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
          this.changeInfo(true) //新增里程碑删除-状态已保存
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
      if (!this.isEditable) {
        this.focusIn()
        if (!this.isTempSave.milestone) {
          let keys = Object.keys(this.isTempSave)
          let only = true //只要当前区块未保存时
          keys.some(key => {
            if (!this.isTempSave[key] && key !== 'milestone') {
              only = false
              return true
            }
          })
          if (!only) return
        }
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
      this.changeInfo(false, listItem.id) //删除里程碑关联的成果-状态未保存
    },
    deladdcg (e) { //新增删除成果
      if (!this.isEditable) {
        this.focusIn()
        if (!this.isTempSave.milestone) {
          let keys = Object.keys(this.isTempSave)
          let only = true //只要当前区块未保存时
          keys.some(key => {
            if (!this.isTempSave[key] && key !== 'milestone') {
              only = false
              return true
            }
          })
          if (!only) return
        }
      }
      let list = []
      this.ruleForm.resultInformationList.some(item => {
        if (e.achievementCode !== item.achievementCode) {
          list.push(item)
        }
      })
      this.ruleForm.resultInformationList = list
      this.handleEditSomeMileStone('add')
    },
    getChengGuoList (pageNum = this.tableDataIn.body.pageNum, pageSize = this.tableDataIn.body.pageSize) { //获取弹框成果信息列表
      this.tableDataIn.body.pageNum = pageNum
      this.tableDataIn.body.pageSize = pageSize
      let params = {
        pageNo: pageNum,
        pageSize: pageSize,
        projectCode: this.projectCode,
        name: this.tableDataInForm.name,
        responsibleUid: this.tableDataInForm.responsibleUid,
        resultType: this.tableDataInForm.resultType
      }
      API.queryLastAchievementPage(params)
        .then(res => {
          res.list.forEach(item => {
            item.resultCode = item.achievementCode
            item.id = null
            let type = ''
            this.resultsTypeOptions.forEach(iter => {
              if (iter.valueCode === item.achievementTypeValue) {
                type = iter.name
              }
            })
            if (type !== '') {
              item.achievementTypeValue = type
            }
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
    getResultsType () { //查询任务/成果类型
      API.dictValByCode('EXPECTED-RESULT-TYPE')
        .then(res => {
          if (res && res.length > 0) {
            this.resultsTypeOptions = res
          } else {
            this.resultsTypeOptions = []
          }
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
    dialogVisibleCancle () { //关联成果弹框取消
      this.dialogVisible = false
    },
    dialogVisibleSave () { //关联成果确定的时候
      if (this.editLinkResultFlagId) { //判断当前保存的是否是新增还是编辑 编辑
        this.changeInfo(false, this.editLinkResultFlagId) //确定编辑里程碑关联的成果-状态未保存
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
        if (!hasoneachievement) {
          /* this.$message({
            message: '1 个成果只能关联一个里程碑,已经为您过滤',
            type: 'warning',
            showClose: true
          }) */
        }
      } else { //新增弹框
        this.handleEditSomeMileStone('add')
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
      if (this.list.length >= this.maxAndMin.MAX) {
        this.$message({
          message: `本单位里程碑个数上限为${this.maxAndMin.MAX}个,已添加${this.list.length}个,如需继续添加,请联系本单位管理员修改里程碑个数限制`,
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
        if (!this.isEditable) {
          this.focusIn()
          if (!this.isTempSave.milestone) {
            let keys = Object.keys(this.isTempSave)
            let only = true //只要当前区块未保存时
            keys.some(key => {
              if (!this.isTempSave[key] && key !== 'milestone') {
                only = false
                return true
              }
            })
            if (!only) return
          }
        }
        this.ruleForm = {
          projectName: this.projectName,
          projectCode: this.projectCode,
          milestoneName: '', //里程碑名称
          planFinishTime: '', //计划结束时间
          milestoneLeader: '', //里程碑责任人
          milestoneDescription: '', //里程碑描述
          linkResultFlag: '1', //是否关联成果
          resultInformationList: [], //关联的成果
          resultInformation: '', //关联成果输入框
          projectCategory: 'PC-SELF-UNIT'
        }
        if (this.$route.params.projectCode) { //编辑
          this.getmilestoneLeader()
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
        responsibleUid: '',
        resultType: ''
      }
      this.tableDataIn.body.pageNum = 1
      this.getChengGuoList()
    },
    getmilestoneLeader () { //获取里程碑责任人 options
      let sendData = {
        projectCode: this.projectCode,
        projectRoleCodes: 'PR-MANAGER,PR-MEMBER'
      }
      API.queryProjectMembers(sendData)
        .then(res => {
          if (res.length > 0) {
            res.forEach(item => {
              item.milestoneLeader = item.userName
              item.milestoneLeaderUid = item.userAccount
            })
            // this.milestoneLeaderOptions = res
            this.addvisable = true
            this.$nextTick(() => {
              this.$refs.ruleForm.clearValidate()
            })
            this.changeInfo(false) //新增里程碑-状态未保存
          } else {
            this.$message({
              message: '请先保存基本信息和团队信息',
              type: 'warning',
              showClose: true
            })
          }
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message || '查询里程碑责任人失败',
            type: 'error',
            showClose: true
          })
        })
    },
    async getcgfzr (uid, userName) { //获取成果负责人 options
      let currentItem = []
      if (uid && this.cgfzroptions) {
        currentItem = this.cgfzroptions.filter(item => item.userAccount === uid)
      }
      let sendData = {
        projectCode: this.projectCode,
        // projectRoleCodes: 'PR-MANAGER，PR-MEMBER'
        projectRoleCodes: 'PR-MANAGER,PR-MEMBER',
        userName: userName || ''
      }
      await API.queryProjectMembers(sendData)
        .then(res => {
          this.cgfzroptions = res || []
          if (uid) {
            let hasSelectManager = this.cgfzroptions.some(item2 => {
              return item2.userAccount === uid
            })
            if (!hasSelectManager && currentItem[0]) {
              this.$set(currentItem[0], 'isHidden', true)
              this.cgfzroptions = this.cgfzroptions.concat(currentItem)
            }
          }
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
      API.dictValByCode('EXPECTED-RESULT-TYPE')
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
      if (!this.isEditable) {
        this.focusIn()
        if (!this.isTempSave.milestone) {
          let keys = Object.keys(this.isTempSave)
          let only = true //只要当前区块未保存时
          keys.some(key => {
            if (!this.isTempSave[key] && key !== 'milestone') {
              only = false
              return true
            }
          })
          if (!only) return
        }
      }
      if (this.projectCode) { //有关联成果编码
        this.tableDataInSearchMoreFlag = '0'
        this.tableDataInForm.name = ''
        this.tableDataInForm.responsibleUid = ''
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
    changeInfo (status = false, id = '') {
      this.$emit('changeValue', status)
      if (id) {
        this.handleEditSomeMileStone(id)
      }
    },
    //处理编辑的里程碑
    handleEditSomeMileStone (id) {
      if (this.editMilestoneId && this.editMilestoneId !== id) { //编辑的非当前里程碑
        this.$message({
          message: '请先保存当前编辑的里程碑信息',
          type: 'warning',
          showClose: true
        })
      } else {
        this.editMilestoneId = id
      }
    },
    //准备修改某字段
    focusIn () {
      this.$emit('focusFormItem')
    }
  }
}
</script>
<style lang="scss" scoped>
.is-error{
  .tabcon{
    border-color: #f56c6c!important;
  }
}
  .body-con /deep/{
    .el-input__count {
      margin-bottom: 2px;
    }
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
    .el-width-640 .panel-header .header-title{
      max-width: 640px!important;
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
