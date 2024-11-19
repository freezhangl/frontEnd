<!--子流程审批组件 B0062-->
<template>
  <div class="countersign">
    <el-dialog
      v-dialogDrag
      class="signDialog"
      :visible.sync="dialogVisible"
      :show="show"
      title="审批流程"
      :before-close="beforeCloseDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        :model="countersignForm"
        ref="countersignForm"
        label-width="100px"
        :rules="countersignRules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审批结果：" prop="approvalState">
              <el-radio-group v-model="countersignForm.approvalState" @change="changeApprovalState">
                <el-radio
                  v-for="item in approveResultList"
                  :label="item.state"
                  :key="item.state">
                  {{item.name}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="下一环节：" prop="nextLink" class="nextLink">
              <el-radio-group v-model="countersignForm.nextLink">
                <el-radio
                  @change="changeNextLink(item)"
                  v-for="item in nextActivities"
                  :label="item.activityDefId"
                  :key="item.activityDefId">
                  {{item.activityDefName}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isPeople && !isMultiple ">
          <el-col :span="24">
            <el-form-item label="人员选择：" class="peopleChoosen" prop="peopleChoosen">
              <el-select
                collapse-tags
                placeholder="请选择"
                :popper-append-to-body="false"
                v-model="countersignForm.peopleChoosen"
                value-key="participantId">
                <el-option
                  v-for="item in participantList"
                  :label="item.participantNameEmail"
                  :value="item.participantId"
                  :key="item.participantId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isPeople && isMultiple">
          <el-col :span="24">
            <el-form-item label="人员选择：" class="peopleChoosen" prop="peopleChoosen">
              <SpAdvancedSelect
                :data.sync="countersignForm.peopleChoosen"
                :list="participantList"
                is-more-type="even"
                advanced-select-class="advance-dropdown-process"
                value-txt="participantId"
                label-txt="participantNameEmail"
                placeholder="请选择"
              ></SpAdvancedSelect>
            </el-form-item>
            <i v-if="listType==6" class="add-icon svgfont-adduser expert-icon"  @click="pendingApprove"><span class="global-family"></span></i>
          </el-col>
        </el-row>
        <el-row v-if="isPeopleOrg">
          <el-col :span="24">
            <el-form-item label="" prop="peopleOrg">
              <div class="org-tree missCheckbox" style="overflow:hidden;overflow-x:auto;overflow-y:auto;">
                <div class="title-wrapper" >
                  <span class="title">待选人员</span>
                </div>
                <div class="loadingWrap" v-if="treeShow">
                  <el-input
                    placeholder="搜索内容"
                    class="filter-input"
                    v-model.trim="filterTextOrg"
                    v-if="listType!=4 && listType!=5"
                    suffix-icon="el-icon-search"
                    @blur="peopleSearch"></el-input>
                  <div
                    class="scrollWrap"
                    :style="{
                      height: listType==4 || listType==5 ? '270px' : '227px'
                    }">
                    <el-scrollbar>
                      <el-tree
                        :data="treeDataOrg"
                        show-checkbox
                        ref="treeOrg"
                        node-key="id"
                        check-strictly
                        :lazy="peopleLazy"
                        :load="peopleLoad"
                        :default-checked-keys="peopleLazy ? defaultCheckedPeopleKeys : relevantDepartmentPeopleKeys"
                        :default-expanded-keys="relevantDepartmentPeopleKeys"
                        :props="peopleLazy ? treeLazyProps : defaultPropsOrg"
                        :filter-node-method="filterNodeOrg"
                        @check="nodeClick">
                      </el-tree>
                    </el-scrollbar>
                  </div>
                </div>
                <div class="search-people" v-loading="searchPeopleLoading" v-else>
                  <el-scrollbar v-if="userList.length">
                    <el-checkbox-group style="padding: 0 10px;line-height: 30px; width: 234px; height: 235px" v-model="peopleCheckList">
                      <el-checkbox
                        v-for="user in userList"
                        :key="user.id"
                        :label="user">{{`${user.chineseName} // ${user.orgName}`}}</el-checkbox>
                    </el-checkbox-group>
                  </el-scrollbar>
                  <div class="not-data" v-else>暂无数据</div>
                  <div class="searchConfirmBtn">
                    <el-button type="primary" v-if="userList.length" @click="confirmSelect">确定</el-button>
                    <el-button type="primary" @click="cancleSelect">取消</el-button>
                  </div>
                </div>
              </div>
              <div
                class="recycle"
                @click="getCheckedNodesOrg">
                <i class="el-icon-arrow-right"></i>
              </div>
              <div class="org-tree" style="overflow:hidden;overflow-x:auto;overflow-y:auto;">
                <div class="title-wrapper" >
                  <span class="title">已选人员</span>
                </div>
                <div class="loadingWrap">
                  <el-input
                    placeholder="搜索内容"
                    class="filter-input"
                    v-model.trim="searchTextOrg"
                    @input="rightInputOrg"
                    suffix-icon="el-icon-search"></el-input>
                  <div class="scrollWrap">
                    <el-scrollbar>
                      <div class="right-list">
                        <div
                          class="people-org-info"
                          v-for="item in selectShowPeople"
                          :key="item.id">
                          <el-tooltip
                            effect="dark"
                            :disabled="!showToolTip(item.name, 50)"
                            :content="item.name"
                            placement="top-start">
                            <span>{{item.name}}</span>
                          </el-tooltip>
                          <el-tooltip
                            effect="dark"
                            :disabled="!showToolTip(item.orgName, 140)"
                            :content="item.orgName"
                            placement="top-start">
                            <span>{{item.orgName}}</span>
                          </el-tooltip>
                          <i class="el-icon-close"  @click="delPeople(item.id)"></i>
                        </div>
                      </div>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isOrg">
          <el-col :span="24">
            <el-form-item label="" prop="organization">
              <div class="org-tree" style="overflow:hidden;overflow-x:auto;overflow-y:auto;">
                <div class="title-wrapper" >
                  <span class="title">待选部门</span>
                </div>
                <div class="loadingWrap">
                  <el-input
                    placeholder="搜索内容"
                    class="filter-input"
                    v-model.trim="filterText"
                    suffix-icon="el-icon-search"></el-input>
                  <div class="scrollWrap">
                    <el-scrollbar>
                      <el-tree
                        :data="treeData"
                        show-checkbox
                        ref="tree"
                        node-key="organizationCode"
                        :default-checked-keys="relevantDepartmentKeys"
                        :default-expanded-keys="relevantDepartmentKeys"
                        :props="defaultProps"
                        :filter-node-method="filterNode">
                      </el-tree>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
              <div
                class="recycle"
                @click="getCheckedNodes">
                <i class="el-icon-arrow-right"></i>
              </div>
              <div class="org-tree" style="overflow:hidden;overflow-x:auto;overflow-y:auto;">
                <div class="title-wrapper" >
                  <span class="title">已选部门</span>
                </div>
                <div class="loadingWrap">
                  <el-input
                    placeholder="搜索内容"
                    class="filter-input"
                    v-model.trim="searchText"
                    @input="rightInput"
                    suffix-icon="el-icon-search"></el-input>
                  <div class="scrollWrap">
                    <el-scrollbar>
                      <div class="right-list">
                        <div
                          class="people-info"
                          v-for="item in selectShowDepartment"
                          :key="item.organizationCode">
                          <el-tooltip
                            effect="dark"
                            :disabled="!showToolTip(item.organizationName, 180)"
                            :content="item.organizationName"
                            placement="top-start">
                            <span>{{item.organizationName}}</span>
                          </el-tooltip>
                          <i class="el-icon-close" @click="delDepartment(item.organizationCode)"></i>
                        </div>
                      </div>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="常用意见："
              prop="commonOpinion"
              class="commonOpinion">
              <el-select
                :popper-append-to-body="false"
                v-model="countersignForm.commonOpinion"
                placeholder="请选择常用意见"
                @change="changeCommonOpinion">
                <el-option
                  v-for="item in commonOpinionList"
                  :label="item.opinionContent"
                  :value="item.id"
                  :key="item.id">
                  <el-tooltip
                    effect="dark"
                    :disabled="!showToolTip(item.opinionContent, 500)"
                    :content="item.opinionContent"
                    placement="top-start">
                    <span style="float: left; with: 100%" @click="changeCommonOpinion(item.id)" >{{ item.opinionContent }}</span>
                  </el-tooltip>
                  <el-button style="float: right" type="text" @click.native.stop="deleteOpinion(item.id)">
                    <img src="@/assets/image/svg/icon-delete-dis.svg"/>
                  </el-button>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="审批意见：" prop="approvalOpinion">
              <el-input
                v-model.trim="countersignForm.approvalOpinion"
                type="textarea"
                maxlength="300"
                style="width: 555px"
                :rows="5"
                show-word-limit
                placeholder="请输入审批意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button @click="addOpinion" style="margin-left:100px">添加到常用意见</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="addTempRecord">保存意见</el-button>
        <el-button @click="closeCountersignForm">取消</el-button>
        <el-button type="primary" @click="countersignSubmit">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      class="confirmDialog"
      title="审批流程"
      :visible.sync="confirmDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="confirm" style="margin-bottom: 20px;">
        <span>下一环节：</span>
        <div>{{nextLinkShow}}</div>
      </div>
      <div class="confirm" style="margin-bottom: 20px;" v-if="isPeople || isOrg || isPeopleOrg">
        <span v-if="isPeople || isPeopleOrg">人员：</span>
        <span v-if="isOrg">部门：</span>
        <div v-if="isPeople">{{peopleChoosenShow}}</div>
        <div v-if="isOrg">{{orgChoosenShow}}</div>
        <div v-if="isPeopleOrg">{{peopleOrgChoosenShow}}</div>
      </div>
      <div class="confirm">
        <span>审批意见：</span>
        <div>{{countersignForm.approvalOpinion}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeConfirmDialog">取消</el-button>
        <el-button type="primary" @click="submitConfirmDialog">提交</el-button>
      </span>
    </el-dialog>
    <processExperts
      :show="isShowModal"
      :process-inst-id="processInstId"
      :expert-items="expertItems"
      @subSelectPeople="expertChoosen"
      @changeShowRead="closeProcessExperts"></processExperts>
  </div>
</template>

<script>
import API from '@lib/common/serve/API_processSubmit'
import API2 from '@lib/common/serve/API_toRead'
import processExperts from './processExperts'
import { isShowToolTip } from '@lib/common/util/common'
export default {
  name: 'countersignChild',
  props: {
    show: { type: Boolean, default: false },
    businessSerialNumber: { type: String, default: '' },
    processTemplateCode: { type: String, default: '' },
    processInstId: { type: Number, default: 0 },
    activityInstId: { type: Number, default: 0 },
    activityDefId: { type: String, default: '' }
  },
  components: {
    processExperts
  },
  data () {
    return {
      filterText: '',
      filterTextOrg: '',
      searchText: '',
      searchTextOrg: '',
      treeData: [],
      treeDataOrg: [],
      defaultProps: {
        children: 'children',
        label: 'organizationName'
      },
      defaultPropsOrg: {
        children: 'children',
        label: 'name'
      },
      treeLazyProps: { //角色树变量转换
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      dialogVisible: this.show,
      confirmDialogVisible: false,
      approveResultList: [],
      countersignForm: {
        approvalState: '', //审批结果
        nextLink: '', // 下一环节
        peopleChoosen: '', // 人员选择
        organization: '', // 组织
        commonOpinion: '', // 常用意见
        approvalOpinion: '', // 审批意见
        peopleOrg: '' //会签人员
      },
      nextActivities: [],
      participantList: [],
      commonOpinionList: [], //常用意见列表
      countersignRules: {
        approvalState: [
          { required: true, message: '请选择审批结果', trigger: 'change' }
        ],
        nextLink: [
          { required: true, message: ' ', trigger: 'change' }
        ],
        peopleChoosen: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ],
        approvalOpinion: [
          { required: true, message: '请输入审批意见', trigger: 'change' }
        ]
      },
      isPeople: false,
      isOrg: false,
      isPeopleOrg: false,
      isMultiple: false,
      nextLinkShow: '',
      peopleChoosenShow: '',
      peopleChoosenShowArr: [],
      approvalOpinionRecord: '',
      orgChoosenShow: '',
      peopleOrgChoosenShow: '',
      selectShowDepartment: [], // 右侧展示数据
      selectDepartment: [], //右侧所有数据
      selectShowPeople: [], // 右侧展示人员数据
      selectPeople: [], //右侧所有人员数据
      relevantDepartmentKeys: [], // 默认选中的部门（研发归口管理部门）
      tempApprovalOponions: {}, //保存临时意见后暂存，防止在切换审批结果状态的时候被清空
      peopleLazy: false, // 人员选择懒加载控制
      peopleCheckList: [], // 人员选择模糊搜索选中的人员列表
      orgCode: '', // 当前登录人的一级公司编码
      treeShow: true, // 人员+组织树显示
      userList: [], // 人员列表
      listType: '',
      searchPeopleLoading: false, // 人员模糊搜索加载状态
      relevantDepartmentPeopleKeys: [], // 默认选中的接口人
      finishFlag: null,
      isShowPeople: true, //是否可以显示人员
      isShowModal: false, //专家弹框
      expertItems: []//专家选中人员集合
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    filterTextOrg (val) {
      if (!this.peopleLazy) {
        this.$refs.treeOrg.filter(val)
      }
    },
    show (newVal, oldVal) {
      this.dialogVisible = newVal
      if (newVal === true) {
        this.getApproveResultList()
        this.getTempApprovals()
        this.getNextActivities()
        this.getOpinions()
      }
      this.$nextTick(() => {
        this.$refs['countersignForm'].clearValidate()
      })
    },
    'countersignForm.nextLink' (newVal, oldVal) {
      this.nextActivities.forEach(item => {
        if (item.activityDefId === newVal) {
          this.nextLinkShow = item.activityDefName
        }
      })
    },
    'countersignForm.peopleChoosen' (newVal, oldVal) {
      this.peopleChoosenShow = ''
      // 如果是多选-->数组
      if (Array.isArray(newVal)) {
        this.peopleChoosenShowArr = []
        this.participantList.forEach(item => {
          newVal.forEach(val => {
            if (item.participantId === val) {
              this.peopleChoosenShowArr.push(item.participantName)
            }
          })
        })
        this.peopleChoosenShowArr.forEach(element => {
          this.peopleChoosenShow = this.peopleChoosenShow + '、' + element
        })
        this.peopleChoosenShow = this.peopleChoosenShow.substr(1)
      } else {
        // 如果是单选-->字符串
        this.participantList.forEach(item => {
          if (item.participantId === newVal) {
            this.peopleChoosenShow = item.participantName
          }
        })
      }
    },
    selectShowDepartment (newVal, oldVal) {
      this.orgChoosenShow = ''
      newVal.forEach(element => {
        this.orgChoosenShow = this.orgChoosenShow + '、' + element.organizationName
      })
      this.orgChoosenShow = this.orgChoosenShow.substr(1)
    },
    selectShowPeople (newVal, oldVal) {
      this.peopleOrgChoosenShow = ''
      newVal.forEach(element => {
        this.peopleOrgChoosenShow = this.peopleOrgChoosenShow + '、' + element.name
      })
      this.peopleOrgChoosenShow = this.peopleOrgChoosenShow.substr(1)
    }
  },
  mounted () {

  },

  computed: {
    defaultCheckedPeopleKeys: {
      get () {
        let idList = []
        if (this.selectPeople.length) {
          this.selectPeople.forEach(people => {
            idList.push(people.id)
          })
        }
        return idList
      },
      set (val) {

      }
    }
  },

  methods: {
    //专家懒加载弹框打开
    pendingApprove () {
      this.isShowModal = true
      this.expertItems = []
      if (Array.isArray(this.countersignForm.peopleChoosen)) {
        this.participantList.forEach(item => {
          this.countersignForm.peopleChoosen.forEach(val => {
            if (item.participantId === val) {
              this.peopleChoosenShowArr.push(item.participantName)
              //专家两种选择人员合并
              item.id = item.participantId
              item.name = item.participantName
              item.orgName = item.organizationName
              this.expertItems.push(item)
            }
          })
        })
      }
    },
    closeProcessExperts (val) {
      this.isShowModal = val
    },
    //专家选择合并处理
    expertChoosen (val) {
      this.countersignForm.peopleChoosen = []
      if (val) {
        val.forEach(item => {
          if (!item.participantId) {
            item.participantId = item.id
            item.participantName = item.name
            item.organizationName = item.orgName
            if (item.email) {
              item.participantNameEmail =
                item.participantName + '(' + item.email + ')'
            } else {
              item.participantNameEmail = item.participantName
            }
            item.hidden = true
            let isHaved = this.participantList.some(Item => {
              return Item.participantId === item.participantId
            })
            if (!isHaved) {
              this.participantList.push(item)
            }
          }
          this.countersignForm.peopleChoosen.push(item.participantId)
        })
        this.countersignForm.peopleChoosen = [...new Set(this.countersignForm.peopleChoosen)]
      }
    },
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    // 右侧输入框input事件
    rightInput (val) {
      if (val !== '' && val !== ' ') {
        let arr = []
        this.selectDepartment.forEach(item => {
          if (item.organizationName.indexOf(val) !== -1) {
            arr.push(item)
          }
        })
        this.selectShowDepartment = arr
      } else {
        this.selectShowDepartment = this.selectDepartment
      }
    },
    // 右侧人员输入框input事件
    rightInputOrg (val) {
      if (val !== '' && val !== ' ') {
        let arr = []
        this.selectPeople.forEach(item => {
          if (item.name.indexOf(val) !== -1) {
            arr.push(item)
          }
        })
        this.selectShowPeople = arr
      } else {
        this.selectShowPeople = this.selectPeople
      }
    },
    // 将勾选的左侧数据放到右边
    getCheckedNodes () {
      // 获取勾选节点的数据
      let selection = this.$refs.tree.getCheckedNodes(true, false)
      this.selectDepartment = selection
      this.selectShowDepartment = this.selectDepartment
      this.selectShowDepartment.forEach(item => {
        item.disabled = true
      })
    },
    // 将勾选的左侧人员数据放到右边
    getCheckedNodesOrg () {
      // 获取勾选节点的数据
      if (!this.peopleLazy) {
        let selection = this.$refs.treeOrg.getCheckedNodes(true, false)
        this.selectPeople = selection
        this.selectShowPeople = this.selectPeople
        this.selectShowPeople.forEach(item => {
          item.disabled = true
        })
      }
    },
    // 删除右侧数据
    delDepartment (key) {
      if (this.relevantDepartmentKeys.some(k => k === key)) {
        this.$message({
          message: '研发归口管理部门不可删除！',
          type: 'warning',
          showClose: true
        })
        return
      }
      let selectDepartmentArr = []
      selectDepartmentArr = this.selectDepartment.filter(val => {
        return val.organizationCode !== key
      })
      this.selectShowDepartment = selectDepartmentArr
      this.selectDepartment.forEach(item => {
        if (item.organizationCode === key) {
          item.disabled = false
        }
      })
      this.$refs.tree.setChecked(key, false)
      let selection = this.$refs.tree.getCheckedNodes(true, false)
      this.selectDepartment = selection
    },
    // 删除右侧人员数据
    delPeople (key) {
      if (!this.peopleLazy) {
        let selectShowArr = []
        selectShowArr = this.selectPeople.filter(val => {
          return val.id !== key
        })
        this.selectShowPeople = selectShowArr
        this.selectPeople.forEach(item => {
          if (item.id === key) {
            item.disabled = false
          }
        })
        this.$refs.treeOrg.setChecked(key, false)
        let selection = this.$refs.treeOrg.getCheckedNodes(true, false)
        this.selectPeople = selection
      } else {
        this.selectPeople = this.selectPeople.filter(s => {
          return s.id !== key
        })
        this.searchTextOrg = ''
        this.selectShowPeople = this.selectPeople
        this.$refs.treeOrg.setChecked(key, false)
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    filterNodeOrg (value, data) {
      if (!value) return true
      //相关部门会签人员搜索公司下面人员不展示
      // console.log(data)
      if (!data.orgName && !data.orgCode) {
        return false
      }
      return data[this.defaultPropsOrg.label].indexOf(value) !== -1
    },
    // 切换审批结果
    changeApprovalState (val) {
      this.selectShowDepartment = []
      this.selectShowPeople = []
      this.searchText = ''
      this.searchTextOrg = ''
      this.filterText = ''
      this.filterTextOrg = ''
      this.selectDepartment = []
      this.selectPeople = []
      // 保存原来的审批意见内容字段值
      if (this.approvalOpinionRecord !== '') {
        this.countersignForm.approvalOpinion = this.approvalOpinionRecord
      }
      if (this.tempApprovalOponions[val]) {
        this.countersignForm.approvalOpinion = this.tempApprovalOponions[val]
      }
      this.$nextTick(() => {
        this.$refs['countersignForm'].clearValidate('approvalOpinion')
      })
      this.countersignForm.peopleChoosen = ''
      this.$nextTick(() => {
        this.$refs['countersignForm'].clearValidate('peopleChoosen')
      })
      if (val === '0' || val === '1') { //同意或不同意一样
        let approvalText = val === '0' ? '同意' : '不同意' //审批意见输入框显示文字
        this.countersignForm.approvalOpinion = approvalText
        this.isShowPeople = true
        this.isPeople = false
        this.isMultiple = false
        this.isOrg = false
        this.isPeopleOrg = false
        this.getNextActivities(0)
      } else { //其他
        if (this.approvalOpinionRecord === '') {
          this.countersignForm.approvalOpinion = ''
          this.isShowPeople = true
        }
        this.isMultiple = true
        this.isPeople = false
        this.isOrg = false
        this.isPeopleOrg = false
        this.getNextActivities('1,2')
      }
    },
    // 获取环节审批结果
    getApproveResultList () {
      let params = {
        processTemplateCode: this.processTemplateCode, //流程模板编码
        activityInstId: String(this.activityInstId), //活动实例ID
        processInstId: String(this.processInstId) //流程实例id
      }
      API.getApproveResultList(params)
        .then(res => {
          this.approveResultList = res
          // 将数组的第一个审批结果选中
          this.countersignForm.approvalState = this.approveResultList[0].state
          // 判断选中的第一个是什么审批结果
          this.changeApprovalState(this.approveResultList[0].state)
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取审批结果失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 获取下一环节列表
    getNextActivities () {
      let params = {
        processInstId: String(this.processInstId), //流程实例ID
        activityInstId: String(this.activityInstId) //当前活动环节ID
      }
      API.getNextActivities(params)
        .then(res => {
          this.nextActivities = res
          // 默认选中第一个值
          this.countersignForm.nextLink = ''
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取下一环节失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 下一环节改变
    changeNextLink (val) {
      this.selectShowDepartment = []
      this.selectShowPeople = []
      this.countersignForm.peopleChoosen = ''
      this.searchText = ''
      this.searchTextOrg = ''
      this.filterText = ''
      this.filterTextOrg = ''
      this.selectDepartment = []
      this.selectPeople = []
      // 保存原来的审批意见内容字段值
      if (this.approvalOpinionRecord !== '') {
        this.countersignForm.approvalOpinion = this.approvalOpinionRecord
      }
      this.$nextTick(() => {
        this.$refs['countersignForm'].clearValidate('approvalOpinion')
      })
      this.$nextTick(() => {
        this.$refs['countersignForm'].clearValidate('peopleChoosen')
      })
      // 如果是结束
      if (val.finishFlag === 0) {
        this.isPeople = false
        this.isOrg = false
        this.isPeopleOrg = false
      } else {
      // 获取人员
        this.getNextPeople(val.activityDefId)
      }
    },
    // 获取下一环节人员
    getNextPeople (activityDefId) {
      let params = {
        processTemplateCode: this.processTemplateCode, // 流程模板编码
        activityDefId: activityDefId, // 活动节点ID
        businessSerialNumber: this.businessSerialNumber //业务流水号
      }
      this.participantList = []
      API.getNextPeople(params)
        .then(res => {
          // 人员返回类型:listType
          // 0：人员列表，
          // 1：组织+人员
          // 2：组织树，
          // 3：组织+人员（懒加载）
          // 4:规则10(默认带出主负责人 懒加载)
          // 5:规则15 (懒加载)
          // 6:人员列表+ 弹框懒加载
          this.listType = res.listType
          if (res.listType === '0' || res.listType === '6') {
            this.isPeople = true
            this.isOrg = false
            this.isPeopleOrg = false
            if (res.listType === '6') {
              this.isMultiple = true
            }
            this.participantList = res.personListWithOrgs || []
            this.participantList.forEach(item => {
              if (item.participantEmail) {
                item.participantNameEmail =
                  item.participantName + '(' + item.participantEmail + ')'
              } else {
                item.participantNameEmail = item.participantName
              }
            })
            this.$nextTick(() => {
              this.$refs['countersignForm'].clearValidate('peopleChoosen')
            })
            // 是否多项任务 multiTaskFlag  0：否、1：是
            if (res.multiTaskFlag === 0) {
              this.isMultiple = false
            } else {
              this.isMultiple = true
            }
          } else if (res.listType === '1') {
            this.isPeople = false
            this.isOrg = false
            this.isPeopleOrg = true
            this.peopleLazy = false
            this.treeShow = true
            this.defaultCheckedPeopleKeys = []
            this.relevantDepartmentPeopleKeys = []
            if (res.personListWithOrgs && res.personListWithOrgs.id !== null) {
              if (res.personListWithOrgs.data) {
                if (res.personListWithOrgs.children) {
                  let children = res.personListWithOrgs.children.concat()
                  children.forEach((child, index) => {
                    if (!child.data.participantName || !child.data.participantId) {
                      res.personListWithOrgs.children.splice(index, 1)
                    }
                  })
                  let treeDataDepartment = this.analyzeTreeDataDepartment(res.personListWithOrgs)
                  this.treeDataOrg = [treeDataDepartment]
                  res.personListWithOrgs.children.forEach(p => {
                    if (p.data.isAttributeDepartment === '0') {
                      this.relevantDepartmentPeopleKeys.push(p.data.participantId + p.data.organizationName)
                    }
                  })
                  this.$nextTick(() => {
                    this.getCheckedNodesOrg()
                  })
                } else {
                  this.treeDataOrg = []
                }
              } else {
                let treeDataOrg = this.analyzeTreeDataOrg(res.personListWithOrgs)
                this.treeDataOrg = [treeDataOrg]
              }
            } else {
              this.treeDataOrg = []
            }
          } else if (res.listType === '2') {
            this.isPeople = false
            this.isOrg = true
            this.isPeopleOrg = false
            if (res.personListWithOrgs) {
              let treeData = this.analyzeTreeData(res.personListWithOrgs)
              this.treeData = [treeData]
              this.relevantDepartmentKeys = this.getRelevantDepartment(res.personListWithOrgs.children)
              this.$nextTick(() => {
                this.getCheckedNodes()
              })
            }
          } else if (res.listType === '4') { //（参与人规则10懒加载专用）
            this.isPeople = false
            this.isOrg = false
            this.isPeopleOrg = true
            this.peopleLazy = true
            this.treeShow = true
            this.defaultCheckedPeopleKeys = []
            this.relevantDepartmentPeopleKeys = []
            if (res.personListWithOrgs) {
              this.orgName = res.personListWithOrgs[0].orgName
              this.orgCode = res.personListWithOrgs[0].id
              let personListWithOrgs = res.personListWithOrgs[0]
              let departmentList = personListWithOrgs.departmentList
              let receiverList = departmentList.length ? departmentList[0].receiverList : []
              this.relevantDepartmentPeopleList = receiverList
            }
          } else {
            if (res.personListWithOrgs) {
              this.orgName = res.personListWithOrgs[0].organizationName
              this.orgCode = res.personListWithOrgs[0].organizationCode
            }
            this.isPeople = false
            this.isOrg = false
            this.isPeopleOrg = true
            this.peopleLazy = true
            this.treeShow = true
            this.defaultCheckedPeopleKeys = []
            this.relevantDepartmentPeopleKeys = []
          }
        })
        .catch(e => {
          this.participantList = []
          this.listType = ''
          this.isPeople = true
          this.isOrg = false
          this.isPeopleOrg = false
        })
    },
    // 获取研发归口管理部门
    getRelevantDepartment (data) {
      let keys = []
      data.forEach(item => {
        if (item.data.isAttributeDepartment === '0') {
          keys.push(item.data.organizationCode)
        }
        if (item.children) {
          keys.concat(this.getRelevantDepartment(item.children))
        }
      })
      return keys
    },
    // 人员选择懒加载方法
    async peopleLoad (node, resolve) {
      if (node.level === 0) {
        let treeData = []
        if (this.orgName && this.orgCode) {
          treeData = [{
            name: this.orgName,
            id: this.orgCode,
            disabled: true,
            isLeaf: false
          }]
        } else {
          treeData = await this.orgInfoByOrgCode()
        }
        treeData.forEach(data => {
          data = this.analyzeTreeDataOrg(data)
        })
        this.treeData = treeData
        return resolve(treeData)
      }
      if (this.listType === '4') { //接口人 人员懒加载
        if (node.level === 1) {
          let nodeData = await this.getOrgListByParentOrgCode(node.data.id)
          return resolve(nodeData)
        }
        if (node.level > 1) {
          let nodeData = await this.peopleListByOrgCode(node.data.id)
          if (!nodeData.length) return resolve(null)
          return resolve(nodeData)
        }
      } else { //listType为3时候部门会签人员懒加载
        if (node.level >= 1) {
          let nodeData = await this.treeByParentOrgCode(node.data.id)
          if (!nodeData.length) return resolve(null)
          return resolve(nodeData)
        }
      }
    },
    //解析数据（组织树）
    analyzeTreeData (data) {
      let newData = Object.assign({}, data.data)
      this.$set(newData, 'children', [])
      this.$set(newData, 'disabled', false)
      if (data.children) {
        data.children.forEach(ele => {
          newData.children.push(this.analyzeTreeData(ele))
        })
      }
      return newData
    },
    // 解析数据（部门+人员）
    analyzeTreeDataOrg (data) {
      this.$set(data, 'disabled', false)
      if (data.type === 0 && data.orgAbbr) {
        data.name = data.orgAbbr //组织树组织名称变为简称
      }
      if (data.children) {
        data.children.forEach(ele => {
          this.analyzeTreeDataOrg(ele)
        })
      }
      return data
    },
    // 解析数据（部门会签+人员）
    analyzeTreeDataDepartment (res) {
      this.$set(res, 'disabled', false)
      this.$set(res, 'id', res.data.organizationCode)
      //组织树组织名称变为简称
      this.$set(res, 'name', res.data.orgAbbr || res.data.organizationName)
      if (res.data.participantName && res.data.participantId) {
        let children = []
        if (res.children) {
          children = children.concat(res.children)
        }
        children.push({ // id为邮箱会导致key不唯一 造成选中取消失效
          id: res.data.participantId + res.data.organizationName,
          participantId: res.data.participantId,
          name: res.data.participantName,
          disabled: false,
          orgName: res.data.organizationName,
          orgCode: res.data.organizationCode
        })
        this.$set(res, 'children', children)
      }
      if (res.children) {
        res.children.forEach(ele => {
          if (ele.data) {
            this.analyzeTreeDataDepartment(ele)
          }
        })
      }
      return res
    },
    // 解析数据（人员懒加载）
    analyzeTreeDataLazy (data) {
      let newData = data
      newData.forEach(ele => {
        if (ele.type === 0 && ele.orgAbbr) {
          ele.name = ele.orgAbbr //组织树组织名称变为简称
        }
        this.$set(ele, 'isLeaf', ele.type === 1)
        this.$set(ele, 'participantId', ele.id)
        this.$set(ele, 'disabled', ele.type === 0)
      })
      return newData
    },
    // 解析数据（参与人规则10懒加载专用）
    analyzeTreeDataLazyTwoLevel (data) {
      let newData = data
      newData.forEach(ele => {
        if (ele.type !== 1 && ele.orgAbbr) {
          ele.name = ele.orgAbbr //组织树组织名称变为简称
        }
        this.$set(ele, 'isLeaf', ele.type === 1)
        this.$set(ele, 'participantId', ele.id)
      })
      return newData
    },
    //接口获取当前登录人所在公司 -- 根节点
    async orgInfoByOrgCode () {
      let newData = []
      try {
        newData = await API2.orgInfoByOrgCode(this.processInstId)
        // newData = await API.orgInfoByOrgCode(1380)
        newData.forEach(item => {
          item.disabled = item.type === 0
          this.orgCode = item.id
        })
      } catch (e) {
        if (e.selfError) return
      }
      return newData
    },
    //通过父级组织编码查询下级组织和人员
    async treeByParentOrgCode (orgCode) {
      let newData = []
      try {
        let res = await API2.treeByParentOrgCode(orgCode)
        newData = this.analyzeTreeDataLazy(res)
      } catch (e) {
        if (e.selfError) return
      }
      return newData
    },
    //根据组织编码查询组织的主负责人（参与人规则10懒加载专用）
    async peopleListByOrgCode (orgCode) {
      let newData = []
      try {
        let params = {
          orgCode: orgCode
        }
        let res = await API.peopleListByOrgCode(params)
        newData = this.analyzeTreeDataLazyTwoLevel(res)
      } catch (e) {
        if (e.selfError) return
      }
      return newData
    },
    //根据组织编码查询该组织下的直属下级组织（参与人规则10懒加载专用）
    async getOrgListByParentOrgCode (orgCode) {
      let newData = []
      try {
        let params = {
          orgCode: orgCode,
          businessSerialNumber: this.businessSerialNumber //业务流水号
        }
        let res = await API.getOrgListByParentOrgCode(params)
        newData = this.analyzeTreeDataLazyTwoLevel(res)
      } catch (e) {
        if (e.selfError) return
      }
      return newData
    },
    // 组织+人树节点点击事件
    nodeClick (data) {
      if (this.peopleLazy) {
        this.searchTextOrg = ''
        if (this.selectPeople.some(people => people.id === data.id)) {
          let index = 0
          this.selectPeople.forEach((item, i) => {
            if (data.id === item.id) {
              index = i
              this.selectPeople.splice(index, 1)
            }
          })
          this.selectShowPeople = this.selectPeople
        } else if (this.selectPeople.some(people => people.parentId === data.parentId)) {
          //处理各部门领导选人限制单选一个领导审批 (规则10和15)
          if (this.listType === '4' || this.listType === '5') {
            this.$refs.treeOrg.setChecked(data.id, false)
            this.$message({
              message: '会签环节各部门领导限制单选，请知悉',
              type: 'warning',
              showClose: true
            })
          }
        } else {
          this.selectPeople.push(data)
          this.selectShowPeople = this.selectPeople
        }
      }
    },
    // 选择常用意见
    changeCommonOpinion (val) {
      this.commonOpinionList.forEach(item => {
        if (item.id === val) {
          this.countersignForm.approvalOpinion = item.opinionContent
        }
      })
    },
    // 获取常用意见
    getOpinions () {
      API.getOpinions()
        .then(res => {
          this.commonOpinionList = res
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取常用意见失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 删除常用意见
    deleteOpinion (val) {
      let params = { id: val }
      API.deleteOpinion(params)
        .then(res => {
          if (res === 1) {
            this.$message({
              message: '删除常用意见成功！',
              type: 'success',
              showClose: true
            })
            this.countersignForm.commonOpinion = ''
            this.getOpinions()
          } else {
            this.$message({
              message: '删除常用意见失败！',
              type: 'error',
              showClose: true
            })
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '删除常用意见失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查询临时意见
    getTempApprovals () {
      let params = {
        businessSerialNumber: this.businessSerialNumber //业务流水号
      }
      API.getTempApprovals(params)
        .then(res => {
          if (res.length !== 0) {
            this.countersignForm.approvalOpinion = res[0].approvalOpinion
            this.approvalOpinionRecord = this.countersignForm.approvalOpinion
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '查询临时意见失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 添加到常用意见
    addOpinion () {
      this.$refs['countersignForm'].validateField('approvalOpinion', errorMessage => {
        if (!errorMessage) {
          let params = {
            'opinionContent': this.countersignForm.approvalOpinion
          }
          API.addOpinion(params)
            .then(res => {
              if (res === 1) {
                this.$message({
                  message: '添加到常用意见成功！',
                  type: 'success',
                  showClose: true
                })
                this.getOpinions()
              }
            })
            .catch(e => {
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '添加到常用意见失败！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        }
      })
    },
    // 保存到临时意见
    addTempRecord () {
      this.$refs['countersignForm'].validateField('approvalOpinion', errorMessage => {
        if (errorMessage) { return }
        let params = {
          businessSerialNumber: this.businessSerialNumber, //业务流水号
          processInstId: String(this.processInstId), //流程实例ID
          approvalState: 2,
          approvalOpinion: this.countersignForm.approvalOpinion, //审批意见
          activityNodeName: this.nextLinkShow, //活动节点名称
          activityDefId: this.countersignForm.nextLink, //活动节点id（当前节点id）
          activityInstId: String(this.activityInstId) //活动实例id
        }
        API.addTempRecord(params)
          .then(res => {
            if (res === 1) {
              this.$message({
                message: '保存临时意见成功！',
                type: 'success',
                showClose: true
              })
            }
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '保存临时意见失败！',
                type: 'error',
                showClose: true
              })
            }
          })
      })
    },
    beforeCloseDialog () {
      this.closeCountersignForm()
    },
    // 取消信息填写提交框
    closeCountersignForm () {
      this.$nextTick(() => {
        this.$refs['countersignForm'].resetFields()
      })
      this.dialogVisible = false
      this.isPeople = false
      this.isPeopleOrg = false
      this.participantList = []
      this.isOrg = false
      this.countersignForm.peopleChoosen = ''
      this.searchText = ''
      this.searchTextOrg = ''
      this.filterText = ''
      this.filterTextOrg = ''
      this.selectShowDepartment = []
      this.selectShowPeople = []
      this.selectDepartment = []
      this.selectPeople = []
      this.$emit('changeSignChild', this.dialogVisible)
    },
    // 校验组织树
    validTree () {
      if (this.selectShowDepartment.length === 0) {
        this.$message({
          message: '请选择部门！',
          type: 'warning',
          showClose: true
        })
        return false
      }
      return true
    },
    // 校验组织+人员
    validTreeOrg () {
      if (this.selectShowPeople.length === 0) {
        this.$message({
          message: '请选择人员！',
          type: 'warning',
          showClose: true
        })
        return false
      } else if (this.listType === '4' && this.relevantDepartmentPeopleList.length) {
        let isHaved = this.selectShowPeople.some((item) => {
          return this.relevantDepartmentPeopleList.some(Item => {
            return Item.userId === item.participantId
          })
        })
        if (!isHaved) {
          this.$message({
            message: '该流程必须经过本单位研发归口管理部门会签！',
            type: 'warning',
            showClose: true
          })
          return false
        }
      }
      return true
    },
    //校验审批意见最前几个字是否是同意或不同意
    validApprovalText (state) {
      let approvalText = state === '0' ? '同意' : state === '1' ? '不同意' : '' //审批意见输入框显示文字
      let temp = this.countersignForm.approvalOpinion.substring(0, approvalText.length)
      if (temp !== approvalText) {
        this.$message({
          message: '您的审批意见最前面必须为审批结果"同意。"！或您的审批意见最前面必须为审批结果"不同意。"！！',
          type: 'warning',
          showClose: true
        })
        return false
      }
      return true
    },
    // 提交
    countersignSubmit () {
      if (this.countersignForm.nextLink === '') {
        this.$message({
          message: '请选择下一环节！',
          type: 'warning',
          showClose: true
        })
        return false
      }
      this.$refs['countersignForm'].validate(valid => {
        if (valid) {
          let flag = true
          let validApproval = true //校验审批意见
          if (this.isOrg === true) {
            flag = this.validTree()
          } else if (this.isPeopleOrg === true) {
            flag = this.validTreeOrg()
          }
          validApproval = this.validApprovalText(this.countersignForm.approvalState)
          if (flag && validApproval) {
            this.confirmDialogVisible = true
          }
        }
      })
    },
    // 取消确认框
    closeConfirmDialog () {
      this.confirmDialogVisible = false
    },
    // 人员选择（懒加载）模糊查询
    peopleSearch () {
      if (this.peopleLazy) {
        if (this.filterTextOrg) {
          this.searchPeopleLoading = true
          this.treeShow = false
          const params = {
            orgCode: this.orgCode,
            pageSize: 50,
            pageNum: 1,
            inSub: '1',
            userNameLike: this.filterTextOrg
          }
          this.userList = []
          this.peopleCheckList = []
          API2.getAllUserListByorgCode(params)
            .then(res => {
              this.searchPeopleLoading = false
              res.records = res.records.filter(item => {
                return this.selectPeople.every(e => { return e.id !== item.uid })
              })
              this.userList = res.records || []
            })
            .catch(e => {
              this.searchPeopleLoading = false
              if (e.selfError) {
                this.$message({
                  message: e.message,
                  type: 'error',
                  showClose: true
                })
              }
            })
        } else {
          this.treeShow = true
        }
      }
    },
    // 选择人员模糊搜索确认
    confirmSelect () {
      /* if (this.approvalForm.approvalState === '0') {
        if (this.peopleCheckList.length) {
          if (this.selectPeople.length) {
            this.$message({
              message: '请先删除已选择的人员后再试！',
              type: 'warning',
              showClose: true
            })
            return
          } else if (this.peopleCheckList.length > 1) {
            this.$message({
              message: '最多选择只能选择一个人员！',
              type: 'warning',
              showClose: true
            })
            return
          }
        }
      }*/
      this.treeShow = true
      this.filterTextOrg = ''//清空查询条件返回组织树
      this.searchTextOrg = ''
      if (this.peopleCheckList.length) {
        let checkUserList = []
        this.peopleCheckList.forEach(item => {
          let userInfo = {
            id: item.uid,
            orgName: item.orgName,
            hasChildren: false,
            name: item.chineseName,
            parentId: item.orgCode,
            type: 1
          }
          checkUserList.push(userInfo)
        })
        this.selectPeople = this.selectPeople.concat(checkUserList)
        this.selectShowPeople = this.selectPeople
      }
    },
    // 选择人员模糊搜索取消
    cancleSelect () {
      this.treeShow = true
      this.filterTextOrg = ''//清空查询条件返回组织树
      this.peopleCheckList = []
    },
    // 提交确认框
    submitConfirmDialog () {
      let arr = []
      if (this.isOrg === true) {
        this.selectShowDepartment.forEach(ele => {
          arr.push({ 'name': ele.participantName, 'id': ele.participantId })
        })
      } else if (this.isPeopleOrg === true) {
        this.selectShowPeople.forEach(ele => {
          let isHasItem = arr.some(item => { //去重
            return item.id === ele.participantId ||
              item.id === ele.id
          })
          if (!isHasItem) {
            arr.push({ 'name': ele.name, 'id': ele.participantId || ele.id })
          }
        })
      } else {
        // 如果是多选-->数组
        if (Array.isArray(this.countersignForm.peopleChoosen)) {
          this.participantList.forEach(item => {
            this.countersignForm.peopleChoosen.forEach(val => {
              if (item.participantId === val) {
                arr.push({ 'name': item.participantName, 'id': item.participantId })
              }
            })
          })
        } else {
          // 如果是单选-->字符串
          this.participantList.forEach(item => {
            if (item.participantId === this.countersignForm.peopleChoosen) {
              arr.push({ 'name': item.participantName, 'id': item.participantId })
            }
          })
        }
      }
      let obj = {
        approvalState: '0',
        nextActivityDefId: this.countersignForm.nextLink,
        participants: arr,
        approvalOpinion: this.countersignForm.approvalOpinion
      }
      this.$emit('confirmSignChild', obj)
      this.closeConfirmDialog()
      this.closeCountersignForm()
    }
  }
}
</script>
<style lang="scss">
.countersign {
  .signDialog {
    .el-dialog {
      width:700px;
      .el-dialog__body {
        padding-bottom: 0;
        .el-form-item {
          margin-bottom: 15px;
          &.nextLink {
            .el-radio {
              margin-bottom: 10px;
            }
          }
          &.peopleChoosen{
            .el-input__inner {
              width: 380px;
            }
            .el-form-item__content{
              width: 380px;
              position: relative;
              .expert-icon {
                position: absolute;
                right: -30px;
                font-size: 20px;
                top: 1px;
                @include color();
                cursor: pointer;
              }
            }
            .tool-tip:focus {
              outline: none !important;
            }
          }
          &.commonOpinion {
            .el-input__inner {
              width: 555px;
            }
            .el-select-dropdown {
              max-width: 555px;
              .el-select-dropdown__item{
                span {
                  max-width: 500px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
          .el-textarea {
            margin-bottom: 5px;
            .el-textarea__inner {
              padding-bottom: 15px;
            }
            .el-input__count {
              line-height: 10px;
              margin-right: 10px;
              background: #fff !important;
            }
          }
          .recycle {
            width: 40px;
            height: 40px;
            margin: 0 20px;
            cursor: pointer;
            display: inline-block;
            text-align: center;
          }
          .org-tree {
            width: 234px;
            height: 315px;
            border: 1px solid #e5e5e5;
            border-radius: 2px;
            display: inline-block;
            vertical-align: middle;
            .title-wrapper{
              width: 100%;
              display: flex;
              height: 40px;
              border-bottom: 1px solid #e5e5e5;
              .title {
                display: inline-block;
                padding-left: 8.5px;
                line-height: 40px;
                box-sizing: border-box;
                color: #333333;
              }
            }
            .filter-input{
              padding: 3px 8px;
              box-sizing: border-box;
              .el-input__inner {
                width: 218px;
                height: 32px;
              }
              .el-input__suffix {
                right: 8px;
                height: 32px;
              }
              .el-input__suffix-inner{
                line-height: 38px;
                i{
                  cursor: pointer;
                }
              }
            }
            .scrollWrap{
              width: 234px;
              height: 228px;
              .el-scrollbar {
                width: 100%;
                height: 100%;
                .el-scrollbar__wrap{
                  overflow-x: hidden;
                }
                .right-list {
                  .people-info {
                    position: relative;
                    padding: 0 10px;
                    height: 40px;
                    span {
                      width:200px;
                      display: inline-block;
                      white-space:nowrap;
                      overflow:hidden;
                      text-overflow:ellipsis;
                    }
                    .el-icon-close {
                      cursor: pointer;
                      float: right;
                      position:absolute;
                      height: 40px;
                      line-height: 40px;
                    }
                  }
                  .people-org-info {
                    position: relative;
                    padding: 0 10px;
                    height: 40px;
                    line-height: 40px;
                    span {
                      display: inline-block;
                      white-space:nowrap;
                      overflow:hidden;
                      text-overflow:ellipsis;
                    }
                    span:first-child {
                      width: 50px;
                    }
                    span:nth-child(2) {
                      width: 136px;
                      margin-left: 10px;
                    }
                    .el-icon-close {
                      cursor: pointer;
                      float: right;
                      position:absolute;
                      height: 40px;
                      line-height: 40px;
                    }
                  }
                }
              }
            }
            .el-tree{
              >.el-tree-node{
                display:inline-block;
                min-width: 234px;
              }
              .el-tree-node__content {
                height: 32px;
              }
              &.disabled .el-tree-node__content{
                color: #666666;
              }
            }
            &.missCheckbox {
              overflow: hidden !important;
              .el-tree-node {
                .is-leaf + .el-checkbox .el-checkbox__inner {
                  display:inline-block;
                }
                .el-checkbox__input> .el-checkbox__inner {
                  display:none;
                }
              }
              .search-people {
                width: 236px;
                height: 276px;
                .not-data {
                  text-align: center;
                  height: 230px;
                }
                .searchConfirmBtn{
                  width: 100%;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
  .confirmDialog {
    .el-dialog {
      width:530px;
      .el-dialog__body {
        padding-bottom: 0;
        .confirm {
          display: flex;
          div {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
