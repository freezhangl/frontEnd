<template>
  <div class="body-con">
    <!-- 需求单位非一般支撑包和一般支撑包编辑 -->
    <projectPanel title="子项目" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button
          class="normal-btn"
          @click="addChildProject"
          icon="el-icon-circle-plus-outline"
          v-if='!meberEditFlag'
        >添加子项目</el-button>
      </template>
      <div>
        <!-- 新增框 -->
        <projectPanel :title="ruleForm.projectName"  class="addcon" v-show="addvisable">
          <template v-slot:header>
            <el-button  class="normal-btn" @click="saveAdd">保存本区块信息</el-button>
            <el-button
              style="color: #ff3f3b;border: 1px solid rgba(255, 63, 59, 0.5);"
              icon="el-icon-delete"
              @click="saveDelAdd">删除</el-button>
          </template>
          <el-form
            :model="ruleForm"
            :rules="rules"
            label-position='right'
            ref="ruleForm"
            label-width="190px">
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="子项目名称:"
                  prop="projectName">
                  <el-input
                    placeholder="请输入"
                    show-word-limit
                    v-model.trim="ruleForm.projectName"
                    @change="changeValue('add')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="研究领域:"
                  prop="researchField">
                  <el-select
                    v-model="ruleForm.researchField"
                    placeholder="请选择"
                    clearable
                    @change="changeValue('add')">
                    <el-option
                      v-for="item in researchFieldOptions"
                      :key="item.valueCode"
                      :label="item.name"
                      :value="item.valueCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="所属市场业务:"
                  prop="marketBusiness">
                  <el-select
                    v-model="ruleForm.marketBusiness"
                    placeholder="请选择"
                    clearable
                    @change="changeValue('add')">
                    <el-option
                      v-for="item in marketBusinessOptions"
                      :key="item.valueCode"
                      :label="item.name"
                      :value="item.valueCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="子项目牵头需求单位:"
                  prop="leadDemandUnit">
                  <el-select
                    @change="addLeadDemandUnitChange"
                    value-key='organizationCode'
                    v-model="ruleForm.leadDemandUnit"
                    placeholder="请选择"
                    clearable>
                    <el-option
                      v-for="item in leadDemandUnitOptions"
                      :key="item.organizationCode"
                      :label="item.organizationName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="子项目牵头需求单位经理:"
                  prop="leadDemandManager">
                  <el-select
                    value-key='userAccount'
                    v-model="ruleForm.leadDemandManager"
                    placeholder="请选择"
                    clearable
                    @visible-change="serarchleadDemandManagerAdd(ruleForm.leadDemandUnit,'',$event)"
                    @change="changeValue('add','leadDemandManager')">
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="ruleForm2.addLeadDemandManager"
                        placeholder="请输入名称"
                        clearable
                        @input='judgeserarchleadDemandManagerAdd($event,ruleForm.leadDemandUnit)'
                        @keyup.enter.native="serarchleadDemandManagerAdd(ruleForm.leadDemandUnit,ruleForm2.addLeadDemandManager)"
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchleadDemandManagerAdd(ruleForm.leadDemandUnit,ruleForm2.addLeadDemandManager)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-show='!item.isHiden'
                      v-for="item in leadDemandManagerOptions"
                      :key="item.userAccount"
                      :label="item.userName"
                      :value="item"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="ruleForm2.addLeadDemandManager"
                          placeholder="请输入名称"
                          clearable
                          @input='judgeserarchleadDemandManagerAdd($event,ruleForm.leadDemandUnit)'
                          @keyup.enter.native="serarchleadDemandManagerAdd(ruleForm.leadDemandUnit,ruleForm2.addLeadDemandManager)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchleadDemandManagerAdd(ruleForm.leadDemandUnit,ruleForm2.addLeadDemandManager)"
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
                  class="developmentMode"
                  label="承担方开展模式:"
                  prop="developmentMode">
                  <el-checkbox-group v-model="ruleForm.developmentMode" @change="changeValue('add')">
                    <el-checkbox label="DM_A">自研</el-checkbox>
                    <el-checkbox label="DM_B">委托研发</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="子项目牵头承担单位:"
                  prop="leadUndertakeUnit">
                  <el-select
                    @change="addLeadUndertakeUnit"
                    value-key='organizationCode'
                    v-model="ruleForm.leadUndertakeUnit"
                    placeholder="请选择"
                    clearable>
                    <el-option
                      v-for="item in leadUndertakeUnitOptions"
                      :key="item.organizationCode"
                      :label="item.organizationName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="子项目牵头承担单位经理:"
                  prop="leadUndertakeManager">
                  <el-select
                    value-key='userAccount'
                    v-model="ruleForm.leadUndertakeManager"
                    placeholder="请选择"
                    clearable
                    @visible-change="serarchleadUndertakeManagerAdd(ruleForm.leadUndertakeUnit,'',$event)"
                    @change="changeValue('add','leadUndertakeManager')">
                    <div style="padding:5px 20px">
                      <el-input
                        @input="judgeserarchleadUndertakeManagerAdd($event,ruleForm.leadUndertakeUnit)"
                        @keyup.enter.native="serarchleadUndertakeManagerAdd(ruleForm.leadUndertakeUnit,ruleForm2.addLeadUndertakeManager)"
                        class="inputw"
                        v-model="ruleForm2.addLeadUndertakeManager"
                        placeholder="请输入名称"
                        clearable
                      ><i
                        class="el-icon-search"
                        slot="suffix"
                        @click="serarchleadUndertakeManagerAdd(ruleForm.leadUndertakeUnit,ruleForm2.addLeadUndertakeManager)"
                      >
                      </i>
                      </el-input>
                    </div>
                    <el-option
                      v-show='!item.isHiden'
                      v-for="item in leadUndertakeManagerOptions"
                      :key="item.userAccount"
                      :label="item.userName"
                      :value="item"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          @input="judgeserarchleadUndertakeManagerAdd($event,ruleForm.leadUndertakeUnit)"
                          @keyup.enter.native="serarchleadUndertakeManagerAdd(ruleForm.leadUndertakeUnit,ruleForm2.addLeadUndertakeManager)"
                          class="inputw"
                          v-model="ruleForm2.addLeadUndertakeManager"
                          placeholder="请输入名称"
                          clearable
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchleadUndertakeManagerAdd(ruleForm.leadUndertakeUnit,ruleForm2.addLeadUndertakeManager)"
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
              <el-col :span="24" v-if="ruleForm.developmentMode.toString()!=='DM_B' && ruleForm.developmentMode.toString()!==''">
                <el-form-item
                  label="自研内容:"
                  prop="researchContent">
                  <el-input
                    style="width:100%"
                    :rows="2"
                    show-word-limit
                    maxlength="2000"
                    type="textarea"
                    placeholder="请输入"
                    v-model="ruleForm.researchContent"
                    @change="changeValue('add')">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" v-if="ruleForm.developmentMode.toString()!=='DM_A' && ruleForm.developmentMode.toString()!==''">
                <el-form-item
                  label="委托方研发内容:"
                  prop="demandContent"
                >
                  <el-input
                    style="width:100%"
                    :rows="2"
                    show-word-limit
                    maxlength="2000"
                    type="textarea"
                    placeholder="请输入"
                    v-model="ruleForm.demandContent"
                    @change="changeValue('add')">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <achievementEdit
              unit-type='D'
              :receive-data='[]'
              project-code='201'
              :year-range-prop="['2020','2021']"></achievementEdit> -->
          </el-form>
        </projectPanel>
        <!-- 列表框 -->
        <projectPanel
          :title="listItem.projectName"
          class="addcon"
          v-for="(listItem,index) in list"
          :key="listItem.subProjectCode"
          :expand-prop="listItem.isExpand"
          @changeExpand="changeExpand(listItem)">
          <template v-slot:header>
            <el-button
              class="normal-btn"
              @click="saveEdit(listItem)"
              v-if='listItem.isCached&&!meberEditFlag'>保存本区块信息</el-button>
            <el-button
              style="color: #ff3f3b;border: 1px solid rgba(255, 63, 59, 0.5);"
              icon="el-icon-delete"
              @click="saveDelEdit(listItem)"
              v-if='!meberEditFlag'>删除</el-button>
          </template>
          <el-form
            :model="listItem"
            :rules="rules"
            label-position='right'
            :ref="'listItem'+listItem.subProjectCode"
            label-width="190px">
            <div v-if="listItem.isExpand">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="子项目名称:"
                    prop="projectName">
                    <el-input
                      :disabled='meberEditFlag'
                      placeholder="请输入"
                      show-word-limit
                      v-model.trim="listItem.projectName"
                      @change="changeValue(listItem.subProjectCode)"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="研究领域:"
                    prop="researchField">
                    <el-select
                      :disabled='meberEditFlag'
                      v-model="listItem.researchField"
                      placeholder="请选择"
                      clearable
                      @change="changeValue(listItem.subProjectCode)">
                      <el-option
                        v-for="item in researchFieldOptions"
                        :key="item.valueCode"
                        :label="item.name"
                        :value="item.valueCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="所属市场业务:"
                    prop="marketBusiness">
                    <el-select
                      :disabled='meberEditFlag'
                      v-model="listItem.marketBusiness"
                      placeholder="请选择"
                      clearable
                      @change="changeValue(listItem.subProjectCode)">
                      <el-option
                        v-for="item in marketBusinessOptions"
                        :key="item.valueCode"
                        :label="item.name"
                        :value="item.valueCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="子项目牵头需求单位:"
                    prop="leadDemandUnit">
                    <el-select
                      :disabled='meberEditFlag'
                      @change="listLeadDemandUnitChange($event,index,subProjectCode)"
                      value-key='organizationCode'
                      v-model="listItem.leadDemandUnit"
                      placeholder="请选择"
                      clearable>
                      <el-option
                        v-for="item in leadDemandUnitOptions"
                        :key="item.organizationCode"
                        :label="item.organizationName"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="子项目牵头需求单位经理:"
                    prop="leadDemandManager">
                    <el-select
                      :disabled='meberEditFlag'
                      value-key='userAccount'
                      v-model="listItem.leadDemandManager"
                      placeholder="请选择"
                      clearable
                      @visible-change="serarchleadDemandManagerEdit(listItem.leadDemandUnit,index,'',$event)"
                      @change="changeValue(listItem.subProjectCode,'leadDemandManager')">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="listItem.editLeadDemandManager"
                          placeholder="请输入名称"
                          clearable
                          @input="judgeserarchleadDemandManagerEdit($event,listItem.leadDemandUnit,index)"
                          @keyup.enter.native="serarchleadDemandManagerEdit(listItem.leadDemandUnit,index,listItem.editLeadDemandManager)"
                        ><i
                          class="el-input__icon el-icon-search"
                          slot="suffix"
                          @click="serarchleadDemandManagerEdit(listItem.leadDemandUnit,index,listItem.editLeadDemandManager)"
                        >
                        </i>
                        </el-input>
                      </div>
                      <el-option
                        v-show='!item.isHiden'
                        v-for="item in listItem.leadDemandManagerOptions"
                        :key="item.userAccount"
                        :label="item.userName"
                        :value="item"
                      >
                      </el-option>
                      <template slot="empty">
                        <div style="padding:5px 20px">
                          <el-input
                            class="inputw"
                            v-model="listItem.editLeadDemandManager"
                            placeholder="请输入名称"
                            clearable
                            @input="judgeserarchleadDemandManagerEdit($event,listItem.leadDemandUnit,index)"
                            @keyup.enter.native="serarchleadDemandManagerEdit(listItem.leadDemandUnit,index,listItem.editLeadDemandManager)"
                          ><i
                            class="el-icon-search"
                            slot="suffix"
                            @click="serarchleadDemandManagerEdit(listItem.leadDemandUnit,index,listItem.editLeadDemandManager)"
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
                    class="developmentMode"
                    label="承担方开展模式:"
                    prop="developmentMode">
                    <el-checkbox-group :disabled='meberEditFlag' v-model="listItem.developmentMode" @change="changeValue(listItem.subProjectCode)">
                      <el-checkbox label="DM_A">自研</el-checkbox>
                      <el-checkbox label="DM_B">委托研发</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="子项目牵头承担单位:"
                    prop="leadUndertakeUnit">
                    <el-select
                      :disabled='meberEditFlag'
                      @change="listLeadUndertakeUnitChange($event,index,listItem.subProjectCode)"
                      value-key='organizationCode'
                      v-model="listItem.leadUndertakeUnit"
                      placeholder="请选择"
                      clearable>
                      <el-option
                        v-for="item in leadUndertakeUnitOptions"
                        :key="item.organizationCode"
                        :label="item.organizationName"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="子项目牵头承担单位经理:"
                    prop="leadUndertakeManager">
                    <el-select
                      :disabled='meberEditFlag'
                      value-key='userAccount'
                      v-model="listItem.leadUndertakeManager"
                      placeholder="请选择"
                      clearable
                      @visible-change="serarchleadUndertakeManagerEdit(listItem.leadUndertakeUnit,index,'',$event)"
                      @change="changeValue(listItem.subProjectCode,'leadUndertakeManager')">
                      <div style="padding:5px 20px">
                        <el-input
                          @keyup.enter.native='serarchleadUndertakeManagerEdit(listItem.leadUndertakeUnit,index,listItem.editLeadUndertakeManager)'
                          class="inputw"
                          v-model="listItem.editLeadUndertakeManager"
                          placeholder="请输入名称"
                          clearable
                          @input="judgeserarchleadUndertakeManagerEdit(val,listItem.leadUndertakeUnit,index)"
                        ><i
                          class="el-icon-search"
                          slot="suffix"
                          @click="serarchleadUndertakeManagerEdit(listItem.leadUndertakeUnit,index,listItem.editLeadUndertakeManager)"
                        >
                        </i>
                        </el-input>
                      </div>
                      <el-option
                        v-show='!item.isHiden'
                        v-for="item in listItem.leadUndertakeManagerOptions"
                        :key="item.userAccount"
                        :label="item.userName"
                        :value="item"
                      ></el-option>
                      <template slot="empty">
                        <div style="padding:5px 20px">
                          <el-input
                            class="inputw"
                            v-model="listItem.editLeadUndertakeManager"
                            placeholder="请输入名称"
                            clearable
                            @input="judgeserarchleadUndertakeManagerEdit(val,listItem.leadUndertakeUnit,index)"
                            @keyup.enter.native='serarchleadUndertakeManagerEdit(listItem.leadUndertakeUnit,index,listItem.editLeadUndertakeManager)'
                          ><i
                            class="el-icon-search"
                            slot="suffix"
                            @click="serarchleadUndertakeManagerEdit(listItem.leadUndertakeUnit,index,listItem.editLeadUndertakeManager)"
                          >
                          </i>
                          </el-input>
                        </div>
                      </template>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="listItem.developmentMode.toString()!=='DM_B' && listItem.developmentMode.toString()!==''">
                <el-col :span="24">
                  <el-form-item
                    label="自研内容:"
                    prop="researchContent"
                  >
                    <el-input
                      :disabled='meberEditFlag'
                      style="width:100%"
                      :rows="2"
                      show-word-limit
                      maxlength="2000"
                      type="textarea"
                      placeholder="请输入"
                      v-model="listItem.researchContent"
                      @change="changeValue(listItem.subProjectCode)">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="listItem.developmentMode.toString()!=='DM_A' && listItem.developmentMode.toString()!==''">
                <el-col :span="24">
                  <el-form-item
                    label="委托方研发内容:"
                    prop="demandContent"
                  >
                    <el-input
                      :disabled='meberEditFlag'
                      style="width:100%"
                      :rows="2"
                      show-word-limit
                      maxlength="2000"
                      type="textarea"
                      placeholder="请输入"
                      v-model="listItem.demandContent"
                      @change="changeValue(listItem.subProjectCode)">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <achievementEdit
                @reflashAchieveMentList='reflashAchieveMentList'
                :project-achievement="projectAchievement"
                :sub-project-code='listItem.subProjectCode'
                unit-type='D'
                :lead-demand-unit-options='leadDemandUnitOptions'
                :lead-undertake-unit-options='leadUndertakeUnitOptions'
                :parent-code='parentCode'
                :receive-data='listItem.projectAchievementList||[]'
                :year-range-prop="yearRangeProp"
                :plan-range-time='planRangeTime'
                @change="emitGetNewUnit"></achievementEdit>
            </div>
          </el-form>

        </projectPanel>
      </div>
    </projectPanel>
  </div>
</template>
<script>

import projectPanel from '../../../components/projectPanel/index'
import achievementEdit from './achievement/dAchievementEdit'
import APIGroupPlan from '@/serve/API_groupPlanProject'
import APIAchievement from './achievement/achievement'
import bus from '@/common/bus'
export default {
  props: {
    receiveData: { //项目编辑页项目信息里接收子项目列表（只有名称和编码）
      type: Array,
      default: () => []
    },
    parentCode: {
      type: String,
      default: ''
    },
    yearRangeProp: {
      type: Array,
      default: () => []
    },
    planRangeTime: {
      type: Array,
      default: () => []
    },
    tipLanguage: {
      type: Object,
      default: () => {}
    },
    projectAchievement: {
      type: Object,
      default: () => {}
    }
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
        if (item.projectName === value) {
          count++
        }
      })
      flag = count > 1
      if (flag) {
        callback(new Error('子项目名称不可重复'))
      } else {
        callback()
      }
    }
    return {
      meberEditFlag: false,
      addvisable: false, //新增弹框显隐
      researchFieldOptions: [], //研究领域 options
      marketBusinessOptions: [], //所属市场业务 options
      leadDemandUnitOptions: [], //牵头需求单位 options
      leadUndertakeUnitOptions: [], //牵头承担单位 options
      leadDemandManagerOptions: [], //牵头需求单位项目经理options 只给新增框使用
      leadUndertakeManagerOptions: [], //牵头承担单位项目经理 options 只给新增框使用
      ruleForm2: {
        addLeadDemandManager: '',
        addLeadUndertakeManager: ''
      },
      ruleForm: {
        projectName: '', //项目名称
        researchField: '', //研究领域
        marketBusiness: '', //所属市场业务
        leadDemandUnit: '', //牵头需求单位
        leadDemandManager: '', //牵头需求单位项目经理
        developmentMode: [], //承担方开展模式
        leadUndertakeUnit: '', //牵头承担单位
        leadUndertakeManager: '', //牵头承担单位项目经理
        researchContent: '', //自研内容
        demandContent: '' //委托内容
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: ['change', 'blur'] },
          { max: 64, message: '长度在64个字符以内', trigger: ['change', 'blur'] },
          { validator: validSameName, trigger: ['change', 'blur'] }
        ],
        researchField: [{ required: true, message: '请选择研究领域', trigger: ['change', 'blur'] }],
        marketBusiness: [{ required: true, message: '请选择所属市场业务', trigger: ['change', 'blur'] }],
        leadDemandUnit: [{ required: true, message: '请选择牵头需求单位', trigger: ['change', 'blur'] }],
        leadDemandManager: [{ required: true, message: '请输入牵头需求单位项目经理', trigger: ['change', 'blur'] }],
        developmentMode: [{ required: true, message: '请选择承担方开展模式', trigger: ['change', 'blur'] }],
        leadUndertakeUnit: [{ required: true, message: '请选择牵头承担单位', trigger: ['change', 'blur'] }],
        leadUndertakeManager: [{ required: true, message: '请选择牵头承担单位项目经理', trigger: ['change', 'blur'] }],
        researchContent: [{ required: true, message: '请输入自研内容', trigger: ['change', 'blur'] }],
        demandContent: [{ required: true, message: '请输入委托内容', trigger: ['change', 'blur'] }]
      },
      list: [],
      curEditSubProjectCode: '', //标识当前哪个子项目有字段被改动并且未暂存
      language: '子项目中所有可编辑字段都是基线字段；',
      checkData: [
        {
          label: 'projectName',
          value: '子项目名称'
        }, {
          label: 'leaderDemandUnit',
          value: '子项目牵头需求单位'
        }, {
          label: 'leaderDemandManager',
          value: '子项目牵头需求单位经理'
        }, {
          label: 'leaderUndertakeUnit',
          value: '子项目牵头承担单位'
        }, {
          label: 'leaderUndertakeManager',
          value: '子项目牵头承担单位经理'
        }, {
          label: 'researchField',
          value: '研究领域'
        }, {
          label: 'marketBusiness',
          value: '所属市场业务'
        }, {
          label: 'developmentMode',
          value: '承担方开展模式'
        }, {
          label: 'researchContent',
          value: '自研内容'
        }, {
          label: 'demandContent',
          value: '委托方研发内容'
        }],
      demandUnitTeamList: {}, //需求单位经理 `${organizationCode}`:[]
      undertakeUnitTeamList: {}, //承担单位经理 `${organizationCode}`:[]
      timer: null
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
              this.language = '子项目中所有可编辑字段都是基线字段；'
              return
            }
            this.language = `子项目中的基线字段：${add.join('、')}；`
          } else {
            this.language = '子项目中没有基线字段；'
          }
        }
      }
    },
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.list = []
          let listTemp = JSON.parse(JSON.stringify(val)) || []
          bus.$emit('updateSubprojectNum', listTemp.length)
          let step = 5
          let num = Math.ceil(listTemp.length / step)
          let index = 0
          this.timer = setInterval(() => {
            if (num > 0) {
              let tempArr = listTemp.filter((l, i) => i >= index && i < index + step)
              index += step
              tempArr.forEach(item => {
                item.isExpand = false //是否展开
                item.isCached = false //是否已缓存
              })
              this.list = this.list.concat(tempArr)
              num--
            } else {
              if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
              }
            }
          }, 10)
          if (listTemp.length > 0) {
            this.changeExpand(listTemp[0]) //第一个默认展开
          }
          /* this.list = JSON.parse(JSON.stringify(val)) || []
          this.list.forEach((item, index) => {
            item.isExpand = false //是否展开
            item.isCached = false //是否已缓存
          }) */
          /* val.forEach((item, index) => {
            this.list.push({
              isExpand: false,
              isCached: false,
              projectName: item.projectName,
              subProjectCode: item.subProjectCode,
              id: item.id
            })
          }) */
          // if (this.list.length > 0) {
          //   this.changeExpand(this.list[0]) //第一个默认展开
          // }
        }
      }
    }
  },
  mounted () {
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
    // this.init()
    this.getDictValByCode() //获取数据字典
    // 获取团队信息数据
    this.acceptTeamInfoData()
  },
  components: { projectPanel, achievementEdit },
  beforeDestroy () {
    if (this.timer) {
      //清空定时器
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    reflashAchieveMentList (subProjectCode) { //单独更新成果列表
      APIAchievement.queryLastSubProjectAchievementList({ projectCode: this.parentCode, subProjectCode: subProjectCode })
        .then(res => {
          this.list.some(item => {
            if (item.subProjectCode === subProjectCode) {
              item.projectAchievementList = res
            }
          })
          this.updateDom()
          bus.$emit('groupPlanSendAchievementCode', res || [])
          let deliveryTimeList = []
          this.list.forEach(item => {
            if (item.isCached) {
              item.projectAchievementList.forEach(item2 => {
                deliveryTimeList.push(item2.deliveryTime)
              })
            }
          })
          bus.$emit('acceptAchievementTime', [Math.max(...deliveryTimeList) || null, Math.min(...deliveryTimeList) || null])
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '预期成果列表获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    upDataList () { //大保存之后刷新列表
      if (this.$route.params.projectCode) { //编辑页面
        this.getList()
      } else { //新增//保存了基本信息和团队信息
        if (this.projectCode && this.saveFlag) {
          this.getList()
        }
      }
    },
    validate () { //大保存校验函数
      return new Promise((resolve, reject) => {
        let flag = true //默认表单都是有效
        if (this.addvisable && this.list.length === 0) { //只有新增表单时
          this.$refs.ruleForm.validate(valid => {
            if (!valid) {
              flag = false
              this.$message({
                type: 'warning',
                message: `请检查子项目信息`,
                showClose: true
              })
            }
          })
          if (!flag) return
          this.$message({
            type: 'warning',
            message: `新增子项目${this.ruleForm.projectName}最少关联一个成果`,
            showClose: true
          })
          return
        }
        if (this.list.length === 0 && !this.addvisable) { //一个数据没有时
          this.$message({
            type: 'warning',
            message: '请最少添加一个子项目',
            showClose: true
          })
          flag = false
          resolve(false)
          return true
        } else { //有list
          let hasOneProjectAchievementList = true
          let childProjectName = ''
          this.list.forEach(listItem => {
            if (!listItem.isCached) return
            this.$refs['listItem' + listItem.subProjectCode][0].validate((valid) => {
              if (!valid) {
                flag = false
              }
            /* if (listItem.projectAchievementList.length === 0) {
                hasOneProjectAchievementList = false
                childProjectName += listItem.projectName + ','
              } */
            })
          })
          if (this.addvisable) { //有新增
            this.$refs.ruleForm.validate(valid => {
              if (!valid) {
                flag = false
              }
            })
            childProjectName += '新增子项目' + this.ruleForm.projectName
            hasOneProjectAchievementList = false
          }
          if (!flag) {
            this.$message({
              type: 'warning',
              message: `请检查子项目信息`,
              showClose: true
            })
            return
          }
          if (!hasOneProjectAchievementList) {
            this.$message({
              type: 'warning',
              message: `${childProjectName}最少关联一个成果`,
              showClose: true
            })
            return
          }
        }
        if (flag) {
          let sendList = JSON.parse(JSON.stringify(this.list.filter(ele => ele.isCached)))
          sendList.forEach(listItem => {
            listItem.developmentMode = listItem.developmentMode.join('&')
          })
          resolve(sendList)
        } else {
          resolve(false)
        }
      })
    },
    async listLeadUndertakeUnitChange (val, index, subProjectCode) { //列表牵头承担单位选择信息改变
      let item = this.list[index]
      if (item === null || item === undefined) return
      if (val) {
        item.leadUndertakeManagerOptions = await this.getmanageerOptions('u', val.organizationCode)
        item.leadUndertakeManager = ''
      } else {
        item.leadUndertakeManagerOptions = []
        item.leadUndertakeManager = ''
      }
      this.changeValue(subProjectCode, 'leadUndertakeUnit')
    },
    async addLeadUndertakeUnit (val) { //新增牵头承担单位选择信息改变
      this.ruleForm.leadUndertakeManager = ''
      if (val) {
        // this.leadUndertakeManagerOptions = val.projectTeamList
        this.leadUndertakeManagerOptions = await this.getmanageerOptions('u', val.organizationCode)
      } else {
        this.leadUndertakeManagerOptions = []
      }
      this.changeValue('add', 'leadUndertakeUnit')
    },
    async addLeadDemandUnitChange (val) { //新增需求单位选择信息改变
      this.ruleForm.leadDemandManager = ''
      if (val) {
        // this.leadDemandManagerOptions = val.projectTeamList
        this.leadDemandManagerOptions = await this.getmanageerOptions('d', val.organizationCode)
      } else {
        this.leadDemandManagerOptions = []
      }
      this.changeValue('add', 'leadDemandUnit')
    },
    async listLeadDemandUnitChange (val, index, subProjectCode) { //列表牵头需求单位选择信息改变
      let item = this.list[index]
      if (item === null || item === undefined) return
      if (val) {
        item.leadDemandManagerOptions = await this.getmanageerOptions('d', val.organizationCode)
        item.leadDemandManager = ''
      } else {
        item.leadDemandManagerOptions = []
        item.leadDemandManager = ''
      }
      this.changeValue(subProjectCode, 'leadDemandUnit')
    },
    acceptTeamInfoData (e) { //实时监听团队信息传过来的数据,给新增框列表框牵头需求单位 承担单位下拉数据重新赋值,列表重新遍历给每个经理下拉框数据赋值,判断是否有新增框,有的话牵头单位是否有数据
      bus.$on('changeTeamInfo', (e, isInit) => {
        let leadDemandUnitOptions = []
        let leadUndertakeUnitOptions = []
        e.projectCompanyList.forEach(item => {
          if (item.type === '1') { //需求单位
            leadDemandUnitOptions.push(item)
          }
          if (item.type === '2') { //承担单位
            leadUndertakeUnitOptions.push(item)
          }
        })
        this.leadDemandUnitOptions = leadDemandUnitOptions
        this.leadUndertakeUnitOptions = leadUndertakeUnitOptions
        this.list.forEach(item => {
          //该组织不存在了，需要清空单位和项目经理
          if (item.leadDemandUnit && !this.leadDemandUnitOptions.some(o => o.organizationCode === item.leadDemandUnit.organizationCode)) {
            item.leadDemandUnit = null
            item.leadDemandManager = null
          }
          if (item.leadUndertakeUnit && !this.leadUndertakeUnitOptions.some(o => o.organizationCode === item.leadUndertakeUnit.organizationCode)) {
            item.leadUndertakeUnit = null
            item.leadUndertakeManager = null
          }
        })
        if (!isInit) { //团队信息初始化时只同步下拉框，暂存时需要同时更新项目经理
          // this.updatedManageOptions()
        }
      })
    },
    validator () {
      this.list.forEach(item => {
        let hasleadDemandUnit = this.leadDemandUnitOptions.some(item2 => {
          return item.leadDemandUnit.organizationCode === item2.organizationCode
        })
        let hasleadUndertakeUnit = this.leadUndertakeUnitOptions.some(item2 => {
          return item.leadUndertakeUnit.organizationCode === item2.organizationCode
        })
        if (!hasleadDemandUnit) {
          item.leadDemandUnit = ''
        }
        if (!hasleadUndertakeUnit) {
          item.leadUndertakeUnit = ''
        }
      })
    },
    async updatedManageOptions () { //更新列表项目经理下拉数据
      //用来保存已经调过获取成员接口的组织，防止同一个组织多次调用
      //键值对，键：`${组织类型}${组织编码}，值：组织编码以及获取到的组织的成员
      let demandUnitObj = {}
      let undertakeUnitObj = {}
      this.list.forEach(item => {
        if (item.leadDemandUnit) {
          let dkey = 'd' + item.leadDemandUnit.organizationCode //key值存储为`${组织类型}${组织编码}`
          if (!demandUnitObj[dkey]) {
            demandUnitObj[dkey] = {
              organizationCode: item.leadDemandUnit.organizationCode,
              teamList: []
            }
          }
        }
        if (item.leadUndertakeUnit) {
          let ukey = 'u' + item.leadUndertakeUnit.organizationCode //key值存储为`${组织类型}${组织编码}`
          if (!undertakeUnitObj[ukey]) {
            undertakeUnitObj[ukey] = {
              organizationCode: item.leadUndertakeUnit.organizationCode,
              teamList: []
            }
          }
        }
      })
      await this.getOrgTeamList(demandUnitObj, undertakeUnitObj) //获取团队成员
      this.list.forEach(item => {
        if (item.leadDemandUnit) {
          item.leadDemandManagerOptions = demandUnitObj[`d${item.leadDemandUnit.organizationCode}`].teamList
        }
        if (item.leadUndertakeUnit) {
          item.leadUndertakeManagerOptions = undertakeUnitObj[`u${item.leadUndertakeUnit.organizationCode}`].teamList
        }
      })
    },
    //异步获取需求单位和承担单位的项目经理和项目成员
    async getOrgTeamList (demandUnitObj, undertakeUnitOrg) {
      let dPromises = {}
      let uPromises = {}
      for (let dkey in demandUnitObj) {
        dPromises[dkey] = this.getmanageerOptions('d', demandUnitObj[dkey].organizationCode)
      }
      for (let dkey in undertakeUnitOrg) {
        uPromises[dkey] = this.getmanageerOptions('u', undertakeUnitOrg[dkey].organizationCode)
      }
      // 异步等待
      for (let p in dPromises) {
        demandUnitObj[p].teamList = await dPromises[p]
      }
      for (let p in uPromises) {
        undertakeUnitOrg[p].teamList = await uPromises[p]
      }
    },
    judgeserarchleadUndertakeManagerAdd (val1, val) {
      if (!val1) {
        this.serarchleadUndertakeManagerAdd(val, '')
      }
    },
    async serarchleadUndertakeManagerAdd (val, userName, boole) {
      if (val) {
        if (boole) {
          this.ruleForm2.addLeadUndertakeManager = ''
          userName = ''
        }
        this.leadUndertakeManagerOptions = await this.getmanageerOptions('u', val.organizationCode, userName)
        if (this.ruleForm.leadUndertakeManager) {
          let hasSelectManager = this.leadUndertakeManagerOptions.some(item2 => {
            return item2.userAccount === this.ruleForm.leadUndertakeManager.userAccount
          })
          if (!hasSelectManager) {
            this.ruleForm.leadUndertakeManager.isHiden = true
            this.leadUndertakeManagerOptions = this.leadUndertakeManagerOptions.concat(this.ruleForm.leadUndertakeManager)
          }
        }
      }
    },
    judgeserarchleadDemandManagerAdd  (val1, val) {
      if (!val1) {
        this.serarchleadDemandManagerAdd(val, '')
      }
    },
    async serarchleadDemandManagerAdd (val, userName, boole) {
      if (val) {
        if (boole) {
          this.ruleForm2.addLeadDemandManager = ''
          userName = ''
        }
        this.leadDemandManagerOptions = await this.getmanageerOptions('d', val.organizationCode, userName)
        if (this.ruleForm.leadDemandManager) {
          let hasSelectManager = this.leadDemandManagerOptions.some(item2 => {
            return item2.userAccount === this.ruleForm.leadDemandManager.userAccount
          })
          if (!hasSelectManager) {
            this.ruleForm.leadDemandManager.isHiden = true
            this.leadDemandManagerOptions = this.leadDemandManagerOptions.concat(this.ruleForm.leadDemandManager)
          }
        }
      }
    },
    // 获取项目经理下拉数据
    judgeserarchleadUndertakeManagerEdit (val1, val, index) {
      if (!val1) {
        this.serarchleadUndertakeManagerEdit(val, index, '')
      }
      this.updateDom()
    },
    async serarchleadUndertakeManagerEdit (val, index, userName, boole) {
      let item = this.list[index]
      if (item === null || item === undefined) return
      if (val) {
        if (boole) {
          item.editLeadUndertakeManager = ''
          userName = ''
          this.updateDom()
        }
        item.leadUndertakeManagerOptions = await this.getmanageerOptions('u', val.organizationCode, userName)
        if (item.leadUndertakeManager) {
          let hasSelectManager = item.leadUndertakeManagerOptions.some(item2 => {
            return item2.userAccount === item.leadUndertakeManager.userAccount
          })
          if (!hasSelectManager) {
            item.leadUndertakeManager.isHiden = true
            item.leadUndertakeManagerOptions = item.leadUndertakeManagerOptions.concat(item.leadUndertakeManager)
          }
        }
        this.updateDom()
      }
    },
    // 获取项目经理下拉数据
    judgeserarchleadDemandManagerEdit (val1, val, index) {
      if (!val1) {
        this.serarchleadDemandManagerEdit(val, index, '')
      }
      this.updateDom()
    },
    async serarchleadDemandManagerEdit (val, index, userName, boole) { //列表子项目牵头需求单位经理搜索
      let item = this.list[index]
      if (item === null || item === undefined) return
      if (val) {
        if (boole) {
          item.editLeadDemandManager = ''
          userName = ''
          this.updateDom()
        }
        item.leadDemandManagerOptions = await this.getmanageerOptions('d', val.organizationCode, userName)
        if (item.leadDemandManager) {
          let hasSelectManager = item.leadDemandManagerOptions.some(item2 => {
            return item2.userAccount === item.leadDemandManager.userAccount
          })
          if (!hasSelectManager) {
            item.leadDemandManager.isHiden = true
            item.leadDemandManagerOptions = item.leadDemandManagerOptions.concat(item.leadDemandManager)
          }
        }
        this.updateDom()
      }
    },
    async getmanageerOptions (type, val, userName) { //更新获取项目经理数据
      let sendData = {
        'projectCode': this.parentCode,
        'organizationCode': val
      }
      if (type === 'd') { //成果需求人和需求单位团队成员项目经理有关
        sendData.projectRoleCodes = ['PR-LEADER-DEMAND-MEMBER', 'PR-PARTNER-DEMAND-MEMBER', 'PR-LEADER-DEMAND-MANAGER', 'PR-PARTNER-DEMAND-MANAGER']
      }
      if (type === 'u') { //成果负责人和承担单位团队成员项目经理有关
        sendData.projectRoleCodes = ['PR-LEADER-UNDERTAKER-MEMBER', 'PR-PARTNER-UNDERTAKER-MEMBER', 'PR-LEADER-UNDERTAKER-MANAGER', 'PR-PARTNER-UNDERTAKER-MANAGER']
      }
      if (userName) {
        sendData.userName = userName
      }
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
    async init () { //页面初始化
      if (this.parentCode) { //编辑页面先获取数据字典
        await this.getDictValByCode()
        this.getList()
      } else {

      }
    },
    //批量获取数据字典
    getDictValByCode () {
      //批量获取 研究领域、所属市场业务 数据字典
      APIGroupPlan.dictValByCodes({ codes: 'RESEARCH_DOMAIN,MARKET_BUSINESS_RANGE' })
        .then(res => {
          res.forEach(dicItem => {
            switch (dicItem.code) {
              case 'RESEARCH_DOMAIN':
                this.researchFieldOptions = dicItem.dictionarys
                break
              case 'MARKET_BUSINESS_RANGE':
                this.marketBusinessOptions = dicItem.dictionarys
                break
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message || '数据字典失败')
        })
    },
    getList () { //获取子项目列表
      APIGroupPlan.queryLastSubProjectInfo(this.parentCode)
        .then(res => {
          res.forEach(item => { //TODO 根据选中的牵头需求单位牵头承担单位 给每个子项目添加不同的牵头需求单位牵头承担单位项目经理 options
            item.projectName = item.projectName || ''
            item.developmentMode = item.developmentMode ? item.developmentMode.split('&') : ''
            item.leadDemandManagerOptions = []
            item.leadUndertakeManagerOptions = []
            item.projectAchievementList = item.projectAchievementList || []
            item.editLeadDemandManager = ''
            item.editLeadUndertakeManager = ''
          })
          this.list = res || []
          if (this.addvisable) {
            this.addvisable = false
          }
          this.updatedManageOptions()
          this.validator()
          this.validateAllForm()
          bus.$emit('updateSubprojectNum', this.list.length)
          // this.emitNowList()
        })
        .catch(e => {
          if (e.selfError) return
          this.$message({
            message: e.message || '子项目列表获取失败',
            type: 'error',
            showClose: true
          })
        })
    },
    //清空校验信息
    validateAllForm () {
      this.$nextTick(() => {
        this.list.forEach(listItem => {
          this.$refs['listItem' + listItem.subProjectCode][0].validate((valid) => {})
          this.$refs['listItem' + listItem.subProjectCode][0].clearValidate('projectName')
        })
      })
    },
    saveAdd () { //新增暂存
      if (!this.parentCode) { //todo判断已经保存了基础信息和团队信息
        this.$message({
          message: '请先保存基本信息和团队信息',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            parentCode: this.parentCode,
            projectName: this.ruleForm.projectName,
            researchField: this.ruleForm.researchField,
            marketBusiness: this.ruleForm.marketBusiness,
            developmentMode: this.ruleForm.developmentMode.join('&'),
            researchContent: this.ruleForm.researchContent,
            demandContent: this.ruleForm.demandContent,
            leadDemandUnit: this.ruleForm.leadDemandUnit,
            leadUndertakeUnit: this.ruleForm.leadUndertakeUnit,
            leadDemandManager: this.ruleForm.leadDemandManager,
            leadUndertakeManager: this.ruleForm.leadUndertakeManager
          }
          APIGroupPlan.addSubProjectInfoD(params)
            .then(async res => {
              this.$message({
                message: '子项目保存成功',
                type: 'success'
              })
              this.ruleForm.subProjectCode = res
              this.ruleForm.isExpand = true
              this.ruleForm.isCached = true
              this.ruleForm.parentCode = this.parentCode
              this.ruleForm.leadDemandManagerOptions = []
              this.ruleForm.leadUndertakeManagerOptions = []
              this.ruleForm.projectAchievementList = res.projectAchievementList || []
              this.ruleForm.editLeadDemandManager = ''
              this.ruleForm.editLeadUndertakeManager = ''
              if (this.ruleForm.leadDemandUnit) {
                await this.getUnitTeamList(this.ruleForm, 'd', this.ruleForm.leadDemandUnit.organizationCode)
              }
              if (this.ruleForm.leadUndertakeUnit) {
                await this.getUnitTeamList(this.ruleForm, 'u', this.ruleForm.leadUndertakeUnit.organizationCode)
              }
              this.judgeUnitInOptions(this.ruleForm)
              this.list.unshift(this.ruleForm)
              this.addvisable = false
              this.emitGetNewUnit()
              this.$emit('saveSubProject')
              this.changeInfo(false)
              this.curEditSubProjectCode = '' //暂存成功后清空
              bus.$emit('updateSubprojectNum', this.list.length)
            })
            .catch(e => {
              if (e.selfError) return
              this.$message({
                message: e.message || '子项目保存失败',
                type: 'error',
                showClose: true
              })
            })
        }
      })
    },
    saveEdit (listItem) { //编辑暂存
      if (this.curEditSubProjectCode && this.curEditSubProjectCode !== listItem.subProjectCode) { //编辑的非当前子项目
        this.$message({
          message: '请先保存当前编辑的子项目',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.$refs['listItem' + listItem.subProjectCode][0].validate((valid) => {
        if (valid) {
          let params = {
            id: listItem.id,
            subProjectCode: listItem.subProjectCode,
            parentCode: listItem.parentCode,
            projectName: listItem.projectName,
            researchField: listItem.researchField,
            marketBusiness: listItem.marketBusiness,
            developmentMode: listItem.developmentMode.join('&'),
            researchContent: listItem.researchContent,
            demandContent: listItem.demandContent,
            leadDemandUnit: listItem.leadDemandUnit,
            leadUndertakeUnit: listItem.leadUndertakeUnit,
            leadDemandManager: listItem.leadDemandManager,
            leadUndertakeManager: listItem.leadUndertakeManager
          }
          APIGroupPlan.editSubProjectInfoD(params)
            .then(res => {
              this.$message({
                message: '子项目保存成功',
                type: 'success'
              })
              this.emitGetNewUnit()
              this.$emit('saveSubProject')
              this.changeInfo(false)
              this.curEditSubProjectCode = '' //暂存成功后清空
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              this.$message({
                message: e.message || '子项目保存失败',
                type: 'error',
                showClose: true
              })
            })
        }
      })
    },
    saveDelEdit (listItem) { //编辑删除
      if (this.curEditSubProjectCode && this.curEditSubProjectCode !== listItem.subProjectCode) { //编辑的非当前子项目
        this.$message({
          message: '请先保存当前编辑的子项目',
          type: 'warning',
          showClose: true
        })
        return
      }
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
          APIGroupPlan.removeSubProjectInfoD({
            parentCode: listItem.parentCode,
            subProjectCode: listItem.subProjectCode
          })
            .then(res => {
              this.addvisable = false
              this.curEditSubProjectCode = ''
              this.emitGetNewUnit()
              let index = -1
              this.list.some((ele, i) => {
                if (ele.subProjectCode === listItem.subProjectCode) {
                  index = i
                  return true
                }
              })
              if (index > -1) {
                this.list.splice(index, 1)
              }
              bus.$emit('updateSubprojectNum', this.list.length)
              this.$message({
                type: 'success',
                message: '删除子项目成功!',
                showClose: true
              })
            })
            .catch(e => {
              if (e.selfError) return
              this.$message({
                message: e.message || '项目编辑删除失败',
                type: 'error',
                showClose: true
              })
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
    saveDelAdd () { //新增删除
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
          if (this.curEditSubProjectCode === 'add') {
            this.curEditSubProjectCode = ''
          }
          this.$message({
            type: 'success',
            message: '删除子项目成功!',
            showClose: true
          })
          this.emitGetNewUnit()
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    addChildProject () { //新增子项目
      if (this.curEditSubProjectCode) {
        this.$message({
          message: '请先保存当前编辑的子项目',
          type: 'warning',
          showClose: true
        })
        return
      }
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('subproject')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (this.addvisable) {
        this.$message({
          message: `请先保存当前子项目`,
          type: 'warning',
          showClose: true
        })
        return
      }
      this.ruleForm = {
        projectName: '', //项目名称
        researchField: '', //研究领域
        marketBusiness: '', //所属市场业务
        leadDemandUnit: '', //牵头需求单位
        leadDemandManager: '', //牵头需求单位项目经理
        developmentMode: [], //承担方开展模式
        leadUndertakeUnit: '', //牵头承担单位
        leadUndertakeManager: '', //牵头承担单位项目经理
        researchContent: '', //自研内容
        demandContent: '' //委托内容
      }
      this.addvisable = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
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
    },
    changeValue (subProjectCode, prop = '') {
      this.$forceUpdate()
      this.changeInfo()
      if (prop) {
        // this.emitNowList()
      }
      if (this.curEditSubProjectCode && this.curEditSubProjectCode !== subProjectCode) { //编辑的非当前子项目
        setTimeout(() => {
          this.$message({
            message: '请先保存当前编辑的子项目',
            type: 'warning',
            showClose: true
          })
        })
      } else {
        this.curEditSubProjectCode = subProjectCode
      }
    },
    //成果需求人/负责人或者子项目的项目经理 成果或者子项目的需求/承担单位
    emitNowList () {
      let sendList = JSON.parse(JSON.stringify(this.list))
      if (this.addvisable) {
        sendList.push(JSON.parse(JSON.stringify(this.ruleForm)))
      }
      let params = {
        leadDemandUnitList: [], //牵头需求单位
        leadDemandManagerList: [], //牵头需求单位项目经理
        leadUndertakeUnitList: [], //牵头承担单位
        leadUndertakeManagerList: [], //牵头承担单位项目经理
        achDemandUnitList: [], //需求单位
        achUndertakeUnitList: [], //承担单位
        achDemandResponsibleList: [], //成果需求人
        achUndertakeResponsibleList: [] //成果负责人
      }
      sendList.forEach(ele => {
        if (ele.leadDemandUnit && !params.leadDemandUnitList.some(l => l === ele.leadDemandUnit.organizationCode)) {
          params.leadDemandUnitList.push(ele.leadDemandUnit.organizationCode)
        }
        if (ele.leadDemandManager && !params.leadDemandManagerList.some(l => l === ele.leadDemandManager.userAccount)) {
          params.leadDemandManagerList.push(ele.leadDemandManager.userAccount)
        }
        if (ele.leadUndertakeUnit && !params.leadUndertakeUnitList.some(l => l === ele.leadUndertakeUnit.organizationCode)) {
          params.leadUndertakeUnitList.push(ele.leadUndertakeUnit.organizationCode)
        }
        if (ele.leadUndertakeManager && !params.leadUndertakeManagerList.some(l => l === ele.leadUndertakeManager.userAccount)) {
          params.leadUndertakeManagerList.push(ele.leadUndertakeManager.userAccount)
        }
        if (ele.projectAchievementList) {
          ele.projectAchievementList.forEach(ach => {
            if (ach.demandUnitCode && !params.achDemandUnitList.some(a => a === ach.demandUnitCode)) {
              params.achDemandUnitList.push(ach.demandUnitCode)
            }
            if (ach.undertakeUnitCode && !params.achUndertakeUnitList.some(a => a === ach.undertakeUnitCode)) {
              params.achUndertakeUnitList.push(ach.undertakeUnitCode)
            }
            if (ach.demandUnitResponsibleAccount && !params.achDemandResponsibleList.some(a => a === ach.demandUnitResponsibleAccount)) {
              params.achDemandResponsibleList.push(ach.demandUnitResponsibleAccount)
            }
            if (ach.responsibleUid && !params.achUndertakeResponsibleList.some(a => a === ach.responsibleUid)) {
              params.achUndertakeResponsibleList.push(ach.responsibleUid)
            }
          })
        }
      })
      this.$nextTick(function () {
        bus.$emit('updateSubprojectInfo', params)
      })
    },
    /**
     * 展开/收起 子项目
     */
    changeExpand (item) {
      if (!item.isExpand && !item.isCached) { //未展开且未缓存数据时调接口
        let params = {
          projectCode: this.parentCode,
          subProjectCode: item.subProjectCode
          // versionNo: this.$route.query.versionNo
        }
        APIGroupPlan.querySubProjectDetailD(params)
          .then(async res => {
            if (res) {
              item.isCached = true
              item.isExpand = true
              res.developmentMode = res.developmentMode ? res.developmentMode.split('&') : []
              res.leadDemandManagerOptions = []
              res.leadUndertakeManagerOptions = []
              res.projectAchievementList = res.projectAchievementList || []
              res.editLeadDemandManager = ''
              res.editLeadUndertakeManager = ''
              Object.assign(item, res)
              if (item.leadDemandUnit) {
                await this.getUnitTeamList(item, 'd', item.leadDemandUnit.organizationCode)
              }
              if (item.leadUndertakeUnit) {
                await this.getUnitTeamList(item, 'u', item.leadUndertakeUnit.organizationCode)
              }
              this.judgeUnitInOptions(item)
            }
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '子项目详情获取失败',
                type: 'error',
                showClose: true
              })
            }
          })
      } else {
        item.isExpand = !item.isExpand
        this.updateDom()
      }
    },
    /**
     * 获取 需求单位经理/承担单位经理
     */
    async getUnitTeamList (subPro, orgType, orgCode) {
      if (orgType === 'd' && this.demandUnitTeamList[orgCode]) { //已有此需求单位的成员列表则直接使用
        subPro.leadDemandManagerOptions = this.demandUnitTeamList[orgCode]
      } else if (orgType === 'u' && this.undertakeUnitTeamList[orgCode]) { //已有此承担单位的成员列表则直接使用
        subPro.leadUndertakeManagerOptions = this.undertakeUnitTeamList[orgCode]
      }
      let teamList = await this.getmanageerOptions(orgType, orgCode)
      if (orgType === 'd' && teamList) {
        this.demandUnitTeamList[orgCode] = teamList
        subPro.leadDemandManagerOptions = teamList
      } else if (orgType === 'u' && teamList) {
        this.undertakeUnitTeamList[orgCode] = teamList
        subPro.leadUndertakeManagerOptions = teamList
      }
      this.$forceUpdate()
    },
    /**
     * 判断牵头需求单位和牵头承担单位是否在对应的下拉选项中，不在则清空单位
     */
    judgeUnitInOptions (item) {
      let hasleadDemandUnit = this.leadDemandUnitOptions.some(item2 => {
        return item.leadDemandUnit.organizationCode === item2.organizationCode
      })
      let hasleadUndertakeUnit = this.leadUndertakeUnitOptions.some(item2 => {
        return item.leadUndertakeUnit.organizationCode === item2.organizationCode
      })
      if (!hasleadDemandUnit) {
        item.leadDemandUnit = ''
      }
      if (!hasleadUndertakeUnit) {
        item.leadUndertakeUnit = ''
      }
    },
    /**
     * 强制渲染页面
     */
    updateDom () {
      this.$forceUpdate()
    },
    /**
     * 传到团队信息重新获取单位
     */
    emitGetNewUnit () {
      bus.$emit('updateSubprojectInfo')
    }
  }
}
</script>
<style lang="scss" scoped>
.developmentMode {
    /deep/ .el-form-item__content {
      // line-height: 15px!important;
  }
}
.inputw{
  /deep/ .el-input__suffix{
    display: flex;
    align-items: center;
  }
}
// .inputw{ /deep/ .el-icon-circle-check{
//   display: none;
// }}
//  .inputw{ /deep/ .el-icon-circle-close{
//   display: none;
// }}
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
    .project-panel {
      margin-bottom:0px;
    }
    .project-panel .panel-body{
      margin-bottom: 0;
    }
    .project-panel .panel-body.is-expand {
      // padding: 20px 30px 20px 30px;
      padding: 10px 20px 10px 20px;
      height: auto;
      margin-bottom: 0;
    }
    .project-panel .panel-body {
      margin-bottom: 0;
    }
    .addcon{
       border: 1px solid #E9E9E9;
       margin-bottom: 20px;
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
  }
</style>
