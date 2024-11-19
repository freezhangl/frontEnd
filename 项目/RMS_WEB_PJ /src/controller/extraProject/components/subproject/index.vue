<template>
  <div class="subproject">
    <projectPanel title="子项目" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button
          class="normal-btn"
          icon="el-icon-circle-plus-outline"
          @click="addSubProjet"
        >添加子项目</el-button
        >
      </template>
      <div v-loading="!isAddDom">
        <div v-if="isAddDom">
          <!-- :expand-prop="i === 0 && isAddStatus" -->
          <div
            class="body"
            v-for="(item, i) in subProjectList"
            :key='item.id'>
            <projectPanel
              :title="item.projectName"
              class="addcon el-width-640"
              :expand-prop="i===0?true:false"
              @changeExpand="clickPanel(i)"
            >
              <template v-slot:header>
                <el-button
                  class="normal-btn"
                  v-if="item.projectAchievementList && item.projectAchievementList.length > 0 || item.isUpdate || item.isAdd || (isAddSave && i === 0)"
                  @click="saveSubProject(i)">保存本区块信息</el-button>
                <el-button
                  style="color: #ff3f3b;border: 1px solid rgba(255, 63, 59, 0.5);"
                  icon="el-icon-delete"
                  @click="delSubProject(i)"
                >删除</el-button
                >
              </template>
              <el-form
                :model="item"
                :rules="rules"
                label-position="right"
                label-width="120px"
                ref="ruleForm"
              >
                <el-row>
                  <el-col :span="16">
                    <el-form-item
                      label="子项目名称:"
                      prop="projectName"
                    >
                      <el-input
                        placeholder="请输入"
                        show-word-limit
                        ref="projectName"
                        v-model.trim="item.projectName"
                        @change="changeSubProject(i)"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      label="项目经理:"
                      prop="projectManager"
                    >
                      <el-select
                        v-model="item.projectManager"
                        @change="changeSubProject(i, true)"
                        @visible-change ="projectManagershow($event, item)"
                        placeholder="请选择"
                        clearable
                      >
                        <div style="padding:5px 20px">
                          <el-input
                            class="inputw"
                            v-model="item.addLeadDemandManager"
                            placeholder="请输入名称"
                            clearable
                            @keyup.enter.native="getmilestoneLeader1(item)"
                            @clear="getmilestoneLeader1(item)"
                          ><i
                            class="el-icon-search"
                            slot="suffix"
                            @click="getmilestoneLeader1(item)"
                          >
                          </i>
                          </el-input>
                        </div>
                        <el-option
                          v-for="item in (item.projectManagerOptions) "
                          :key="item.projectManagerUid"
                          :label="item.chineseName"
                          v-show="!item.isHidden"
                          :value="item.uid"
                        ></el-option>
                        <template slot="empty">
                          <div style="padding:5px 20px">
                            <el-input
                              class="inputw"
                              v-model="item.addLeadDemandManager"
                              placeholder="请输入名称"
                              clearable
                              @keyup.enter.native="getmilestoneLeader1(item)"
                              @clear="getmilestoneLeader1(item)"
                            ><i
                              class="el-icon-search"
                              slot="suffix"
                              @click="getmilestoneLeader1(item)"
                            >
                            </i>
                            </el-input>
                          </div>
                        </template>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <!-- table列表 -->
              <div class="achievement-list" v-if="!item.isAdd">
                <div class="header">
                  <div class="box">
                    <div class="title">预期成果</div>
                    <div style="display: flex;justify-content: center;">
                      <el-button
                        class="upload-btn"
                        icon="el-icon-circle-plus-outline"
                        @click="addDialog(i)"
                      >添加预期成果</el-button
                      >
                      <div style="padding-top:2px;margin-left:8px;">
                        <img @click="dataStyle('list', i)" :src="item.style === 'list' ? listIcon.checked : listIcon.notChecked">
                        <img @click="dataStyle('card', i)" :src="item.style === 'card' ? cardIcon.checked : cardIcon.notChecked">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="table" v-show="item.style === 'list'">
                  <self-table
                    v-if="item.projectAchievementList && item.projectAchievementList.length > 0"
                    :table-data="item.projectAchievementList"
                    :table-cols="tableCols"
                  >
                  </self-table>
                  <div
                    v-else
                    class="no-data">
                    暂无数据
                  </div>
                </div>
                <!-- 卡片样式 -->
                <div style="padding: 0px 16px 16px 16px;" v-show="item.style === 'card'">
                  <el-row v-if="item.projectAchievementList && item.projectAchievementList.length > 0">
                    <el-col
                      :span="8"
                      v-for="itemCard of item.projectAchievementList"
                      :key="itemCard.id">
                      <el-card shadow="never">
                        <div slot="header" class="clearfix">
                          <el-tooltip
                            :disabled="itemCard.achievementName && itemCard.achievementName.length < 7"
                            :content="itemCard.achievementName"
                            effect="dark"
                            placement="top">
                            <span class="results-name">{{itemCard.achievementName}}</span>
                          </el-tooltip>
                          <div style="float: right;">
                            <span class="svgfont-btn-edit normal-icon" @click="editDialog(itemCard)"></span>
                            <span class="el-icon-delete delete-icon" @click="achievementDel(itemCard)"></span>
                          </div>
                        </div>
                        <div class="card-body">
                          <div>
                            <el-tooltip
                              :disabled="itemCard.achievementType && itemCard.achievementType.length < 6"
                              :content="itemCard.achievementTypeValue"
                              effect="dark"
                              placement="top">
                              <div style="display: flex;">
                                <span>成果类型：</span>
                                <span style="flex:1;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">{{itemCard.achievementTypeValue}}</span>
                              </div>
                            </el-tooltip>
                          </div>
                          <div>预期交付时间：
                            <el-tooltip
                              :content="dateFilter(itemCard.deliveryTime)"
                              effect="dark"
                              placement="top">
                              <span>{{dateFilter(itemCard.deliveryTime)}}</span>
                            </el-tooltip>
                          </div>
                          <div>成果负责人：
                            <el-tooltip
                              :disabled="itemCard.responsiblePerson && itemCard.responsiblePerson.length < 5"
                              :content="itemCard.responsiblePerson"
                              effect="dark"
                              placement="top">
                              <span>{{itemCard.responsiblePerson}}</span>
                            </el-tooltip>
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                  <div v-else style="text-align: center;padding-top: 16px;color: #999">暂无数据</div>
                </div>
              </div>
            </projectPanel>
          </div>
        </div>
      </div>

      <el-dialog
        v-dialogDrag
        :title="'预期成果'"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :before-close="cancelDialog"
        width="790px">
        <el-form
          v-loading="dialogFormLoading"
          :model="dialogForm"
          :inline="true"
          ref="dialogForm"
          :rules="dialogFormRules">
          <div>
            <el-form-item
              label="子项目名称："
              prop="achievementName"
              label-width="120px">
              <el-input
                class="dialog-name"
                v-model.trim="dialogForm.achievementName"
                placeholder="请输入">
              </el-input>
            </el-form-item>
          </div>
          <el-form-item
            label="成果类型："
            prop="achievementType"
            label-width="120px">
            <el-tooltip
              placement="top-start"
              :content="getTooltipName(dialogForm.achievementType,resultsTypeOptions)"
              :disabled="!getTooltipName(dialogForm.achievementType,resultsTypeOptions)">
              <el-select
                v-model="dialogForm.achievementType"
                placeholder="请选择">
                <el-option
                  v-for="type in resultsTypeOptions"
                  :key="type.valueCode"
                  :label="type.name"
                  :value="type.valueCode">
                  <el-tooltip
                    effect="dark"
                    placement="bottom-start"
                    :content="type.name"
                    :disabled="!showToolTip(type.name, 180)">
                    <span>{{type.name}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            label="预期交付时间："
            prop="deliveryTime"
            label-width="120px">
            <el-date-picker
              v-model.trim="dialogForm.deliveryTime"
              type="date"
              placeholder="请选择日期"
              :picker-options="pickerOptions"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="成果负责人："
            prop="responsiblePerson"
            label-width="120px">
            <el-select
              v-model="dialogForm.responsiblePerson"
              @change="changeResultPeople()"
              @visible-change ="projectManagershow($event, dialogForm, 'responsiblePerson')"
              placeholder="请选择"
              clearable
            >
              <div style="padding:5px 20px">
                <el-input
                  class="inputw"
                  v-model="dialogForm.addLeadDemandManager"
                  placeholder="请输入名称"
                  clearable
                  @keyup.enter.native="getmilestoneLeader1(dialogForm, 'responsiblePerson')"
                  @clear="getmilestoneLeader1(dialogForm,'responsiblePerson')"
                ><i
                  class="el-icon-search"
                  slot="suffix"
                  @click="getmilestoneLeader1(dialogForm, 'responsiblePerson')"
                >
                </i>
                </el-input>
              </div>
              <el-option
                v-for="(item, index) in principals"
                :key="index"
                v-show="!item.isHidden"
                :label="item.chineseName"
                :value="item.chineseName"
              ></el-option>
              <template slot="empty">
                <div style="padding:5px 20px">
                  <el-input
                    class="inputw"
                    v-model="dialogForm.addLeadDemandManager"
                    placeholder="请输入名称"
                    clearable
                    @keyup.enter.native="getmilestoneLeader1(dialogForm,'responsiblePerson')"
                    @clear="getmilestoneLeader1(dialogForm,'responsiblePerson')"
                  ><i
                    class="el-icon-search"
                    slot="suffix"
                    @click="getmilestoneLeader1(dialogForm,'responsiblePerson')"
                  >
                  </i>
                  </el-input>
                </div>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button plain @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="addResult">确认</el-button>
        </div>
      </el-dialog>
    </projectPanel>
  </div>
</template>

<script>
import projectPanel from '../../../components/projectPanel/index'
import selfTable from '@/components/table'
import API from '@/serve/API_project'
import bus from '@/common/bus'
import costSplitDetailVue from '../../../groupPlan/components/undertakeView/USView/costSplitDetail.vue'
import { isShowToolTip } from '@/utils/common.js'

export default {
  data () {
    return {
      rules: {
        projectName: [
          {
            required: true,
            message: '请输入子项目名称',
            trigger: ['change', 'blur']
          },
          {
            max: 128,
            message: '长度在128个字符以内',
            trigger: ['change', 'blur']
          }
        ],
        projectManager: [
          {
            required: true,
            message: '请选择项目经理',
            trigger: ['change', 'blur']
          }
        ]
      },
      projectManagerOptions: [], // 项目经理options
      projectManagerName: '', // 项目经理名称
      subProjectList: [], // 子项目列表
      isEditIngList: [], // 未保存的子项目对应的索引集合
      listIcon: {
        checked: require('@/assets/icons/列表选中.svg'),
        notChecked: require('@/assets/icons/列表未选中.svg')
      }, // 选择列表样式图标
      cardIcon: {
        checked: require('@/assets/icons/卡片选中.svg'),
        notChecked: require('@/assets/icons/卡片未选中.svg')
      }, // 选择卡片样式图标
      tableCols: [
        {
          label: '子项目名称',
          prop: 'achievementName',
          align: 'left',
          minwidth: '200px',
          overflow: true,
          resizable: false,
          padding: true
        },
        {
          label: '成果类型',
          prop: 'achievementTypeValue',
          align: 'left',
          minwidth: '150px',
          overflow: true,
          resizable: false
        },
        {
          label: '成果负责人',
          prop: 'responsiblePerson',
          align: 'center',
          minwidth: '150px',
          overflow: true,
          resizable: false
        },
        {
          label: '预期交付时间',
          prop: 'deliveryTime',
          align: 'center',
          minwidth: '150px',
          overflow: true,
          resizable: false,
          formatter: this.dateFilter
        },
        {
          label: '操作',
          prop: 'operation',
          type: 'Button',
          align: 'center',
          minwidth: '120px',
          btnList: [
            {
              id: 1,
              type: 'text',
              label: '编辑',
              handle: this.editDialog
            },
            {
              id: 2,
              type: 'text',
              label: '删除',
              handle: this.achievementDel
            }
          ]
        }
      ], // 表格配置
      dialogVisible: false, // 弹框显示隐藏
      dialogFormLoading: false, // 成果负责人加载
      dialogForm: {
        id: '',
        achievementCode: '',
        researchTask: '',
        achievementName: '',
        achievementType: '',
        deliveryTime: '',
        responsiblePerson: '',
        responsibleUid: '',
        addLeadDemandManager: ''
      }, // 对话框表单
      dialogFormRules: {
        achievementName: [
          { required: true, message: '请输入子项目名称', trigger: 'blur' },
          { max: 128, message: '子项目名称长度在128个字符以内', trigger: 'blur' }
        ],
        achievementType: [
          { required: true, message: '请选择成果类型', trigger: ['change', 'blur'] }
        ],
        deliveryTime: [
          { required: true, message: '请选择预期交付时间', trigger: 'blur' }
        ],
        responsiblePerson: [
          { required: true, message: '请选择成果负责人', trigger: ['change', 'blur'] }
        ]
      }, // 弹框表单校验
      resultsTypeOptions: [], // 成果类型下拉列表
      principals: [], // 成果负责人列表
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
          }
        }
      },
      resultIndex: '', // 当前成果弹框对应的子项目的索引
      isAddResult: true, // 是否是新增成果，默认true
      isAddDom: true,
      language: '暂无基线信息',
      checkData: [
        {
          label: 'projectName',
          value: '子项目名称'
        }, {
          label: 'projectManager',
          value: '项目经理'
        }, {
          label: 'subProjectAchievementList',
          value: '成果'
        }, {
          label: 'all',
          value: '全部'
        }, {
          label: 'no',
          value: '非全部'
        }],
      isAddSave: false,
      isAddStatus: false
    }
  },
  props: ['projectCode', 'receiveDate', 'saveFlag', 'tipLanguage', 'subprojectInfo', 'saveProject', 'resultsTypeOption'],
  components: {
    projectPanel,
    selfTable
  },
  watch: {
    receiveDate: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.planApprovalTime = val ? val.planApprovalTime : ''
        this.planFinishTime = val ? val.planFinishTime : ''
      }
    },
    subprojectInfo: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          val.forEach((item, index) => {
            item.style = 'list'
            if (!item.projectAchievementList) {
              item.projectAchievementList = []
            } else { // 将父级的索引添加到成果列表中方便删除的时候本地操作
              item.projectAchievementList.forEach((ite, i) => {
                ite.subProjectInfoIndex = index
                // ite.resultIndex = i
              })
            }
          })
          this.subProjectList = JSON.parse(JSON.stringify(val))
          if (this.subProjectList && this.subProjectList.length > 0) {
            this.clickPanel(0)
          }
          this.changeOptions()
        }
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
              this.language = '子项目中所有可编辑字段都是基线字段；'
              return
            }
            if (add.length === 1 && add[0] === '非全部') {
              this.language = '子项目中没有基线字段；'
              return
            }
            this.language = `子项目中的基线字段：${add.join('、')}；`
          } else {
            this.language = '子项目中没有基线字段；'
          }
        }
      }
    },
    saveProject: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          if (this.subProjectList && this.subProjectList.length > 0) {
            this.getSuProjectList(false, false, true)
          }
          this.isEditIngList = []
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
    this.acceptTeamInfoData()
    // this.getResultsType()
  },
  methods: {
    clickPanel (i, isResult = false) {
      if ((this.subProjectList[i].isUpdate && !isResult) || this.subProjectList[i].isAdd) {
        return false
      }
      let param = {
        projectCode: this.subProjectList[i].parentCode,
        subProjectCode: this.subProjectList[i].subProjectCode
      }
      API.subProjectDetailInfo(param)
        .then(res => {
          this.subProjectList[i].projectAchievementList = res.projectAchievementList
          if (this.subProjectList[i].projectAchievementList && this.subProjectList[i].projectAchievementList.length > 0) {
            this.subProjectList[i].projectAchievementList.forEach(item => {
              item.subProjectInfoIndex = i
            })
          }
          this.subProjectList[i].isUpdate = true
        })
        .catch(e => {
          this.loading = false
          if (e.selfError) return
          this.$message({
            message: e.message,
            type: 'error',
            showClose: true
          })
        })
    },
    dataStyle (style, i) {
      this.subProjectList[i].style = style
    },
    //项目经理和成果负责人下拉收起清空模糊查询
    projectManagershow (event, curentItem, type) {
      if (event) {
        curentItem.addLeadDemandManager = ''
        this.getmilestoneLeader1(curentItem, type)
      }
    },
    //获取人员500
    getmilestoneLeader1 (item, type) { //获取里程碑责任人 options
      let currentItem = []
      if (item.projectManager && item.projectManagerOptions) {
        currentItem = item.projectManagerOptions.filter(iitem => iitem.uid === item.projectManager)
      } else if (item.responsiblePerson && this.principals) {
        currentItem = this.principals.filter(iitem => iitem.uid === item.responsiblePerson)
      }
      let sendData = {
        projectCode: this.projectCode,
        projectRoleCodes: 'PR-MANAGER,PR-MEMBER',
        userName: item.addLeadDemandManager || ''
      }
      API.queryProjectMembers(sendData)
        .then(res => {
          if (res.length > 0) {
            res.forEach(item => {
              item.chineseName = item.userName
              item.uid = item.userAccount
            })
          }
          if (item.projectManager || item.responsiblePerson) {
            let hasSelectManager = res.some(item2 => {
              return item2.uid === item.projectManager ||
                item2.uid === item.responsiblePerson
            })
            if (!hasSelectManager && currentItem[0]) {
              this.$set(currentItem[0], 'isHidden', true)
              res = res.concat(currentItem)
            }
          }
          if (type === 'responsiblePerson') {
            this.principals = res || []
          } else {
            item.projectManagerOptions = res || []
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
    acceptTeamInfoData (e) { //实时监听团队信息传过来的数据,更新项目经理下拉数据
      bus.$on('changeTeamInfo', (arr) => {
        this.projectManagerOptions = arr
        this.principals = arr
        // 如果删除了当前选中的项目经理则将当前项目经理对应的id替换成中文
        if (this.subProjectList && this.subProjectList.length > 0) {
          this.changeOptions()
        }
      })
    },
    // 去重项目经理选项&&将id替换成中文展示
    changeOptions () {
      this.subProjectList.forEach((item, index) => {
        // projectManager
        let isHaveUid = false
        this.$set(item, 'projectManagerOptions', this.projectManagerOptions)
        this.$set(item, 'addLeadDemandManager', '') // 设置项目经理模糊查询默认字段
        this.projectManagerOptions.forEach(ite => {
          if (item.projectManager === ite.chineseName) {
            item.projectManager = ite.uid
          }
          if (item.projectManager === ite.uid) {
            isHaveUid = true
          }
        })
        if (!isHaveUid) {
          item.projectManager = item.projectManagerName
        }
      })
      // 去重
      for (var i = 0; i < this.projectManagerOptions.length - 1; i++) {
        for (var j = 1; j < this.projectManagerOptions.length; j++) {
          if (i !== j) {
            if (this.projectManagerOptions[i].chineseName === this.projectManagerOptions[j].chineseName && this.projectManagerOptions[i].uid === this.projectManagerOptions[j].uid) {
              this.projectManagerOptions.splice(j, 1)
            }
          }
        }
      }
    },
    // 时间戳过滤
    dateFilter (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return Y + M + D
    },
    // 添加子项目
    addSubProjet () {
      if (!this.$route.params.projectCode) {
        if (!this.projectCode || !this.saveFlag) {
          this.$message({
            message: '请先保存基本信息和团队信息！',
            type: 'warning',
            showClose: true
          })
          return
        }
      }
      if (!this.judeEditIng()) return
      this.isAddDom = false
      let obj = {
        projectName: '',
        projectManager: '',
        parentCode: this.projectCode,
        isEditIng: true,
        isAdd: true,
        projectAchievementList: [] // 成果列表
      }
      this.subProjectList.unshift(obj)
      setTimeout(() => {
        this.isAddDom = true
        this.isAddStatus = true
        this.changeOptions()
      }, 100)
      this.changeInfo()
      // setTimeout(() => {
      //   this.$refs.ruleForm[0].resetFields()
      // }, 100)
    },
    // 判断当前是否有正在编辑中的子项目
    judeEditIng () {
      this.subProjectList.forEach((item, index) => {
        if (item.isEditIng === true) {
          if (this.isEditIngList && this.isEditIngList.length > 0) {
            this.isEditIngList.forEach((ite) => {
              if (ite !== index) {
                this.isEditIngList.push(index)
              }
            })
          } else {
            this.isEditIngList.push(index)
          }
        }
      })
      // 去重
      this.isEditIngList = Array.from(new Set(this.isEditIngList))
      if (this.isEditIngList && this.isEditIngList.length > 0) {
        let i = this.isEditIngList[0] + 1
        this.$message({
          message: '请先保存第' + i + '个子项目！',
          type: 'error',
          showClose: true
        })
        return false
      } else {
        return true
      }
    },
    // 编辑子项目将标识追加到对应索引的字段中
    changeSubProject (i, isProjectManager = false) {
      // 如果是项目经理发生了变更则取到当前选中项目经理的中文名称
      if (isProjectManager) {
        this.projectManagerOptions.forEach(item => {
          if (item.uid === this.subProjectList[i].projectManager) {
            this.projectManagerName = item.chineseName
          }
        })
      }
      // console.log(i, '信息发生了变动')
      this.changeInfo()
      this.isEditIngList = Array.from(new Set(this.isEditIngList))
      this.subProjectList[i].isEditIng = true
      this.projectManagerOptions.forEach(item => {
        if (item.uid === this.subProjectList[i].projectManager) {
          this.subProjectList[i].projectManagerName = item.chineseName
        }
      })
      // this.subProjectList[i].projectManagerName = this.projectManagerName
      // 保证索引只能追加一次-去重
      this.isEditIngList.push(i)
      this.isEditIngList = Array.from(new Set(this.isEditIngList))
      // console.log(this.isEditIngList, '信息变更-未保存子项目的集合')
    },
    // 删除子项目
    delSubProject (i) {
      let param = {
        parentCode: this.projectCode,
        subProjectCode: this.subProjectList[i].subProjectCode
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
          // 如果存在子项目编码则数据库删除
          if (this.subProjectList[i] && this.subProjectList[i].subProjectCode) {
            API.delSubProjectInfo(param)
              .then(res => {
                if (res) {
                  this.$message({
                    message: '删除成功！',
                    type: 'success',
                    showClose: true
                  })
                  // 刷新列表所有的状态清空
                  this.getSuProjectList(false, false, true)
                  this.isEditIngList = []
                  this.$emit('saveBlock')
                } else {
                  this.$message({
                    message: '删除失败！',
                    type: 'error',
                    showClose: true
                  })
                }
              })
              .catch(e => {
                if (!e.selfError) {
                  this.$message({
                    message: e.message || '服务器异常,请稍后再试！',
                    type: 'error',
                    showClose: true
                  })
                }
              })
          } else { // 不存在则本地数据删除
            this.subProjectList.splice(i, 1)
            // 删除对应为保存的索引
            if (this.isEditIngList && this.isEditIngList.length > 0) {
              this.isEditIngList.forEach((item, index) => {
                if (item === i) {
                  this.isEditIngList.splice(index, 1)
                }
              })
            }
            this.$message({
              message: '删除成功！',
              type: 'success',
              showClose: true
            })
            setTimeout(() => {
              if (i === 0 && this.subProjectList && this.subProjectList.length > 1) {
                this.clickPanel(0)
              }
            }, 500)
            // 如果子项目列表的length大于1，则新增子项目再删除视为保存成功，里程碑新增的时候不提示保存子项目
            if (this.subProjectList) {
              this.$emit('saveBlock') //保存区块成功
            }
          }
        })
        .catch(e => {
          this.$message({
            type: 'info',
            message: '已取消删除！',
            showClose: true
          })
        })
    },
    // 保存子项目
    saveSubProject (i) {
      this.$refs.projectName[i].blur()
      this.$refs.ruleForm[i].validate((valid) => {
        if (valid) {
          if (this.isEditIngList[0] !== i) {
            if (!this.judeEditIng()) return
          }
          // 第一次新增子项目时不添加成果信息
          // if (this.subProjectList[i].projectAchievementList && this.subProjectList[i].projectAchievementList.length === 0 && !this.subProjectList[i].isAdd) {
          //   this.$message({
          //     message: '请为当前子项目关联一条成果！',
          //     type: 'error',
          //     showClose: true
          //   })
          //   return
          // }
          if (this.subProjectList && this.subProjectList.length > 0) {
            let isHaveName = false
            this.projectManagerOptions.forEach(item => {
              if (this.subProjectList[i].projectManager === item.uid) {
                isHaveName = true
              }
            })
            if (!isHaveName) {
              // 当前项目经理的选项中没有' + this.subProjectList[i].projectManager + ',请重新选择项目经理！
              this.$message({
                message: '子项目经理与项目经理/项目成员不符，请修改后再保存！',
                type: 'error',
                showClose: true
              })
              return
            }
          }
          // 子项目第一次保存-调用对应的保存接口
          if (this.subProjectList[i].isAdd) {
            // console.log('第一次保存')
            // 第一次保存不显示成果列表
            let param = {
              parentCode: this.projectCode,
              projectName: this.subProjectList[i].projectName,
              projectManager: this.subProjectList[i].projectManager,
              projectManagerName: this.projectManagerName || this.subProjectList[i].projectManagerName
            }
            this.addSubProjectInfo(param, i)
          } else { // 子项目编辑后保存调用对应的接口
            let param = {
              parentCode: this.projectCode,
              subProjectCode: this.subProjectList[i].subProjectCode,
              projectName: this.subProjectList[i].projectName,
              projectManager: this.subProjectList[i].projectManager,
              projectManagerName: this.projectManagerName || this.subProjectList[i].projectManagerName,
              projectAchievementList: this.subProjectList[i].projectAchievementList
            }
            this.updateSubProjectInfo(param, i)
          }
        } else {
          this.$message({
            message: '请填写子项目信息！',
            type: 'error',
            showClose: true
          })
        }
      })
    },
    // 校验子项目列表中是否存在未保存的子项目
    async validate () {
      return new Promise((resolve, reject) => {
        let isFull = []
        if (this.subProjectList && this.subProjectList.length > 0) {
          this.subProjectList.forEach((item, i) => {
            this.$refs.ruleForm[i].validate((valid) => {
              isFull.push(valid)
            })
          })
        }
        if (isFull.some(item => item === false)) {
          resolve(false)
          this.$message({
            message: '请填写子项目信息！',
            type: 'error',
            showClose: true
          })
          return false
        } else {
          resolve(this.subProjectList)
        }
      })
    },
    // 打开新增成果弹框
    addDialog (i) {
      this.resultIndex = i
      this.isAddResult = true // 当前时新增成果
      this.dialogForm.id = null
      this.dialogForm.achievementCode = null
      this.dialogForm.achievementType = null
      this.dialogForm.deliveryTime = null
      this.dialogForm.achievementName = null
      this.dialogForm.responsiblePerson = null
      this.dialogForm.resultsPrincipal = null
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.dialogForm.resetFields()
        this.dialogForm.id = null
        this.dialogForm.achievementCode = null
        this.dialogForm.achievementType = null
        this.dialogForm.deliveryTime = null
        this.dialogForm.achievementName = null
        this.dialogForm.responsiblePerson = null
        this.dialogForm.resultsPrincipal = null
      })
    },
    // 新增成果
    addResult () {
      this.$refs.dialogForm.validate(validate => {
        if (validate) {
          this.addAchievement()
        } else {
          return false
        }
      })
    },
    // 编辑成果
    editDialog (row) {
      this.dialogVisible = true
      this.isAddResult = false // 当前时编辑成果
      this.dialogForm.id = row.id
      this.resultIndex = row.subProjectInfoIndex
      this.dialogForm.achievementCode = row.achievementCode
      this.dialogForm.achievementName = row.achievementName
      this.dialogForm.achievementType = row.achievementType
      this.dialogForm.deliveryTime = row.deliveryTime
      this.dialogForm.responsiblePerson = row.responsiblePerson
      this.dialogForm.responsibleUid = row.responsibleUid
    },
    changeResultPeople () {
      this.principals.forEach(item => {
        if (this.dialogForm.responsiblePerson === item.chineseName) {
          this.dialogForm.responsibleUid = item.uid
        }
      })
    },
    // 成果新增的接口
    addAchievement () {
      // console.log(this.resultIndex, '当前子项目的索引')
      let param = {}
      if (!this.isAddResult) {
        param.id = this.dialogForm.id
        param.achievementCode = this.dialogForm.achievementCode
      }
      param.deliveryTime = this.dialogForm.deliveryTime
      param.achievementType = this.dialogForm.achievementType
      param.projectCode = this.projectCode
      param.responsiblePerson = this.dialogForm.responsiblePerson
      param.responsibleUid = this.dialogForm.responsibleUid
      param.achievementName = this.dialogForm.achievementName
      param.subProjectCode = this.subProjectList[this.resultIndex].subProjectCode
      if (this.isAddResult) {
        // 当前是新增成果
        API.addProjectAchievement(param)
          .then(res => {
            if (res) {
              this.$message({
                message: '新增成功！',
                type: 'success',
                showClose: true
              })
              bus.$emit('changeResultInfo', true)
              this.getSuProjectList(this.resultIndex, false, false, true)
              // this.clickPanel(this.resultIndex, true)
              this.changeSubProject(this.resultIndex)
            } else {
              this.$message({
                message: '新增失败！',
                type: 'error',
                showClose: true
              })
            }
            this.cancelDialog()
          })
          .catch(e => {
            if (!e.selfError) {
              this.$message({
                message: e.message || '服务器异常,请稍后再试！',
                type: 'error',
                showClose: true
              })
            }
            this.cancelDialog()
          })
      } else {
        // 当前是编辑成果
        API.updateProjectAchievement(param)
          .then(res => {
            if (res) {
              if (res.updatedFlag === '0') {
                this.$message({
                  type: 'warning',
                  message: '当前没有信息发生变更。',
                  showClose: true
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '编辑成功！',
                  showClose: true
                })
                bus.$emit('changeResultInfo', true)
                this.getSuProjectList(this.resultIndex, false, false, true)
                // this.clickPanel(this.resultIndex, true)
                this.changeSubProject(this.resultIndex)
              }
            } else {
              this.$message({
                message: '编辑失败！',
                type: 'error',
                showClose: true
              })
            }
            this.cancelDialog()
          })
          .catch(e => {
            if (!e.selfError) {
              this.$message({
                message: e.message || '服务器异常,请稍后再试！',
                type: 'error',
                showClose: true
              })
            }
            this.cancelDialog()
          })
      }
    },
    // 关闭对话框
    cancelDialog () {
      this.dialogVisible = false
      this.$refs.dialogForm.resetFields()
      this.dialogForm.id = ''
      this.dialogForm.achievementCode = ''
      this.dialogForm.achievementType = ''
      this.dialogForm.deliveryTime = ''
      this.dialogForm.achievementName = ''
      this.dialogForm.resultsPrincipal = ''
      this.dialogForm.addLeadDemandManager = ''
    },
    // 删除成果
    async achievementDel (row) {
      // console.log(row, '当前行信息')
      let isHasAttachment = await this.hasAttachment(row.achievementCode)
      let info = isHasAttachment ? '当前成果关联了附件信息，是否确认删除？' : '一旦确定删除，结果将无法撤回，请谨慎考虑。'
      row.subProjectCode = this.subProjectList[row.subProjectInfoIndex].subProjectCode
      this.$confirm(info, '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          API.deleteAchievement(row)
            .then(res => {
              if (res) {
                this.$message({
                  message: '删除成功！',
                  type: 'success',
                  showClose: true
                })
                // this.getSuProjectList(row.subProjectInfoIndex, true)
                this.clickPanel(row.subProjectInfoIndex, true)
                this.changeSubProject(row.subProjectInfoIndex)
              } else {
                this.$message({
                  message: '删除失败！',
                  type: 'error',
                  showClose: true
                })
              }
            })
            .catch(e => {
              if (!e.selfError) {
                this.$message({
                  message: e.message || '服务器异常,请稍后再试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch(e => {
          this.$message({
            type: 'info',
            message: '已取消删除！',
            showClose: true
          })
        })
    },
    // 查询成果是否关联有附件
    hasAttachment (code) {
      let param = {
        achievementCode: code
      }
      return API.hasAttachment(param)
        .then(res => {
          return res
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常,请稍后再试！',
              type: 'error',
              showClose: true
            })
            return false
          }
        })
    },
    // 查询子项目列表
    async getSuProjectList (isResultIndex = false, isDel, isUpdate = false, isGetDetail = false) {
      let param = {
        projectCode: this.projectCode
      }
      return API.getSubProjectInfo(param)
        .then(res => {
          if (res) {
            res.forEach((item, index) => {
              item.style = 'list'
              if (!item.projectAchievementList) {
                item.projectAchievementList = []
              } else { // 将父级的索引添加到成果列表中方便删除的时候本地操作
                item.projectAchievementList.forEach((ite, i) => {
                  ite.subProjectInfoIndex = index
                  // ite.resultIndex = i
                })
              }
              if (isDel && isResultIndex === index) {
                item.isUpdate = true
              }
            })
            if (isResultIndex || isResultIndex === 0) {
              this.subProjectList[isResultIndex].projectAchievementList = res[isResultIndex].projectAchievementList
            } else {
              this.subProjectList = res
              this.changeOptions()
            }
            if (isUpdate && this.subProjectList && this.subProjectList.length > 0) {
              this.clickPanel(0)
            }
            if (isGetDetail) {
              this.clickPanel(isResultIndex, true)
            }
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常,请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 子项目第一次保存接口
    addSubProjectInfo (param, i) {
      API.addSubProjectInfo(param)
        .then(res => {
          if (res) {
            this.$message({
              message: '子项目保存成功！',
              type: 'success',
              showClose: true
            })
            this.getSuProjectList()
            this.isAddSave = true
            this.$emit('saveBlock') //保存区块成功
            // 保存成功之后将标识还原
            this.subProjectList[i].isEditIng = false
            this.subProjectList[i].isAdd = false
            this.isEditIngList.forEach((item, index) => {
              if (item === i) {
                this.isEditIngList.splice(index, 1)
              }
            })
          } else {
            this.$message({
              message: '子项目保存失败！',
              type: 'error',
              showClose: true
            })
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常,请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 子项目编辑保存接口
    updateSubProjectInfo (param, i) {
      API.updateSubProjectInfo(param)
        .then(res => {
          if (res) {
            this.$message({
              message: '子项目保存成功！',
              type: 'success',
              showClose: true
            })
            this.getSuProjectList(i, true, false, true)
            // this.clickPanel(i, true)
            this.$emit('saveBlock') //保存区块成功
            // 保存成功之后将标识还原
            this.subProjectList[i].isEditIng = false
            this.isEditIngList.forEach((item, index) => {
              if (item === i) {
                this.isEditIngList.splice(index, 1)
              }
            })
          } else {
            this.$message({
              message: '子项目保存失败！',
              type: 'error',
              showClose: true
            })
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常,请稍后再试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    getResultsType () { //查询子项目/成果类型
      return API.dictValByCode('EXPECTED-RESULT-TYPE')
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
    // 有信息发生变更
    changeInfo () {
      this.$emit('changeValue', status)
    }
  }
}
</script>

<style lang="scss" scoped>
.subproject {
    width: 100%;
    height: 100%;
    .body {
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        margin-bottom: 12px;
        /deep/ .el-form-item .el-input__inner {
            width: 100%;
        }
        /deep/ .project-panel {
          margin-bottom: 0 !important;
        }
        .achievement-list {
            width: 100%;
            margin-top: 12px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            margin-bottom: 30px;
            .header {
                width: 100%;
                padding: 12px 0;
                border-bottom: 1px solid #e5e5e5;
                .box {
                    display: flex;
                    justify-content: space-between;
                    padding: 0 16px;
                    .title {
                        color: #333;
                        font-size: 16px;
                        font-weight: 700;
                    }
                }
            }
            .table {
                padding: 16px;

                .no-data {
                  text-align: center;
                  color: #999
                }
            }
        }
    }
    .body:nth-last-child(1) {
      margin-bottom: 0;
    }
}
.dialog-name {
  width: 570px;
   /deep/ .el-input__inner {
     width: 100%;
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
// 卡片样式
.clearfix {
  height: 35px;
  line-height: 35px;
  &:before,
  &:after {
    display: table;
    content: "";
  }
  &:after {
    clear: both
  }
  .results-name {
    display: inline-block;
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
/deep/ .el-col {
  margin-top: 16px !important;
}
/deep/ .el-card__header {
  padding: 0px 20px !important;
}
.normal-icon {
  @include color();
  position: relative;
  top: 4px;
  cursor: pointer;
  margin-right: 10px;
}
.delete-icon {
  color: red;
  cursor: pointer;
}
</style>
