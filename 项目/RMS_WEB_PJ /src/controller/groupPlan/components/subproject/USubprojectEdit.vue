<template>
  <div class="body-con">
    <!-- 承担单位非一般支撑包和一般支撑包编辑 -->
    <projectPanel title="子项目" :tips="true" :tip-language="language">
      <template v-slot:header>
        <el-button
          v-if='!meberEditFlag'
          class="normal-btn"
          @click="addChildProject"
          icon="el-icon-circle-plus-outline"
        >添加子项目</el-button>
      </template>
      <div>
        <!-- 新增框1 -->
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
            label-width="130px">
            <el-row>
              <el-col :span="16">
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
                  label="项目经理:"
                  prop="projectManager">
                  <el-select
                    value-key='userAccount'
                    v-model="ruleForm.projectManager"
                    placeholder="请选择"
                    clearable
                    @visible-change="serarchProjectManagerAdd('',$event)"
                    @change="changeValue('add','projectManager')">
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
                      v-for="item in projectManagerOptions"
                      :key="item.userAccount"
                      :label="item.userName"
                      :value="item"
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
            <achievementEdit
              :rule-form='ruleForm'
              :list='list'
              :addvisable='addvisable'
              :parent-code='parentCode'
              :project-code='projectCode'
              :receive-data='ruleForm.projectAchievementList'
              type='add'
              :year-range-prop="yearRangeProp"></achievementEdit>
          </el-form>
        </projectPanel>
        <!-- 列表 -->
        <projectPanel
          :title="listItem.projectName"
          class="addcon"
          v-for="(listItem) in list"
          :key="listItem.id"
          :expand-prop="listItem.isExpand"
          @changeExpand="changeExpand(listItem)">
          <template v-slot:header>
            <el-button  class="normal-btn" @click="saveEdit(listItem)" v-if='listItem.isCached&&!meberEditFlag||listItem.entry==1'>保存本区块信息</el-button>
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
            :ref="'listItem'+listItem.id"
            label-width="130px">
            <el-row>
              <el-col :span="16">
                <el-form-item
                  label="子项目名称:"
                  prop="projectName">
                  <el-input
                    :disabled='meberEditFlag'
                    placeholder="请输入"
                    show-word-limit
                    v-model.trim="listItem.projectName"
                    @change="changeValue(listItem.id)"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="项目经理:"
                  prop="projectManager">
                  <el-select
                    :disabled='meberEditFlag'
                    value-key='userAccount'
                    v-model="listItem.projectManager"
                    placeholder="请选择"
                    clearable
                    @visible-change="serarchProjectManagerEdit(listItem.id,'',$event)"
                    @change="changeValue(listItem.id,'projectManager')">
                    <div style="padding:5px 20px">
                      <el-input
                        class="inputw"
                        v-model="listItem.editProjectManager"
                        placeholder="请输入名称"
                        clearable
                        @input='judgeserarchProjectManagerEdit($event,listItem.id)'
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
                      v-show="!item.isHiden"
                      v-for="item in listItem.projectManagerOptions"
                      :key="item.userAccount"
                      :label="item.userName"
                      :value="item"
                    ></el-option>
                    <template slot="empty">
                      <div style="padding:5px 20px">
                        <el-input
                          class="inputw"
                          v-model="listItem.editProjectManager"
                          placeholder="请输入名称"
                          clearable
                          @input='judgeserarchProjectManagerEdit($event,listItem.id)'
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
                </el-form-item>
              </el-col>
            </el-row>
            <achievementEdit
              :entry='listItem.entry'
              :rule-form='ruleForm'
              :list='list'
              :addvisable='addvisable'
              :list-item-id='listItem.id'
              :list-item-sub-project-code='listItem.subProjectCode'
              :parent-code='parentCode'
              :project-code='projectCode'
              :receive-data='listItem.projectAchievementList'
              type='list'
              :year-range-prop="yearRangeProp"
              @updateAch="updateAch"></achievementEdit>
          </el-form>
        </projectPanel>
      </div>
    </projectPanel>
  </div>
</template>
<script>

import projectPanel from '../../../components/projectPanel/index'
import achievementEdit from './achievement/uAchievementEdit'
import bus from '@/common/bus'
import APIGroupPlan from '@/serve/API_groupPlanProject'
import APIAchievement from './achievement/achievement'
export default {
  props: {
    receiveData: { //项目编辑页项目信息里接收子项目列表（只有名称和编码）
      type: Array,
      default: () => []
    },
    parentCode: { //需求单位项目编码
      type: String,
      default: ''
    },
    projectCode: { //基础信息编码
      type: String,
      default: ''
    },
    yearRangeProp: { //基础信息年份
      type: Array,
      default: () => []
    },
    saveFlag: { //是否保存
      type: Boolean,
      default: false
    },
    tipLanguage: {
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
      id: 1, //前端自定义 ID
      meberEditFlag: false,
      addvisable: false, //新增弹框显隐
      projectManagerOptions: [], //项目经理 options
      ruleForm2: {
        addProjectManager: ''
      },
      ruleForm: {
        projectName: '', //项目名称
        projectManager: {}, //项目经理
        projectAchievementList: [] // 成果列表
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: ['change', 'blur'] },
          { max: 64, message: '长度在64个字符以内', trigger: ['change', 'blur'] },
          { validator: validSameName, trigger: ['change', 'blur'] }
        ],
        projectManager: [{ required: true, message: '请选择项目经理', trigger: ['change', 'blur'] }]
      },
      list: [],
      curEditSubProjectId: '', //标识当前哪个子项目有字段被改动并且未暂存
      language: '子项目中所有可编辑字段都是基线字段；',
      checkData: [
        {
          label: 'projectName',
          value: '子项目名称'
        }, {
          label: 'projectManager',
          value: '项目经理'
        }, {
          label: 'subProjectAchievementList',
          value: '预期成果'
        }],
      timer: null,
      cachedTeamInfo: [] //当前页面展示的项目经理和项目成员
    }
  },
  components: { projectPanel, achievementEdit },
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
      handler: async function (val, oldVal) {
        if (val) {
          this.list = []
          this.projectManagerOptions = await this.getmanageerOptions('')
          let listTemp = JSON.parse(JSON.stringify(val)) || []
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
                item.editProjectManager = ''
                item.projectManagerOptions = this.projectManagerOptions || []
                item.projectManager = ''
                item.projectAchievementList = []
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
        }
      }
    }
  },
  mounted () {
    this.init() //初始化函数
    this.acceptTeamInfoData() //接受团队信息数据
    this.meberEditFlag = this.$route.query.meberEditFlag === 'true'
  },
  beforeDestroy () { //清空定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    /**
     * 展开/收起 子项目
     */
    changeExpand (item) {
      if (!item.isExpand && !item.isCached) { //未展开且未缓存数据时调接口
        if (!this.projectCode) return
        let params = {
          projectCode: this.projectCode,
          subProjectCode: item.subProjectCode
          // versionNo: this.$route.query.versionNo
        }
        APIGroupPlan.querySubProjectDetailU(params) //获取单个子项目信息
          .then(res => {
            if (res) {
              //是否已缓存
              item.isCached = true
              //是否展开
              item.isExpand = true
              // 设置搜索项目经理名字为空
              res.editProjectManager = ''
              // 设置项目经理下拉框
              res.projectManagerOptions = this.projectManagerOptions || []
              if (!this.projectManagerOptions.some(u => u.userAccount === res.leadUndertakeManager.userAccount)) {
                res.projectManager = ''
              } else {
                res.projectManager = res.leadUndertakeManager
              }
              // if (!res.projectAchievementList) {
              //   item.projectAchievementList = []
              // }
              Object.assign(item, res)
              item.projectAchievementList = res.projectAchievementList || []
              // this.$refs['listItem' + item.id][0].validate((valid) => {})
            }
            this.validateAllForm()
            this.emitNowList()
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
      }
    },
    // 新增项目经理下拉搜索清空
    judgeserarchProjectManagerAdd   (val) {
      if (!val) {
        this.serarchProjectManagerAdd('')
      }
    },
    // 新增项目经理下拉搜索
    async serarchProjectManagerAdd (userName, boole) {
      if (boole) {
        this.ruleForm2.addProjectManager = ''
        userName = ''
      }
      this.projectManagerOptions = await this.getmanageerOptions(userName)
      if (this.ruleForm.projectManager) {
        let hasSelectManager = this.projectManagerOptions.some(item2 => {
          return item2.userAccount === this.ruleForm.projectManager.userAccount
        })
        if (!hasSelectManager) {
          this.ruleForm.projectManager.isHiden = true
          this.projectManagerOptions = this.projectManagerOptions.concat(this.ruleForm.projectManager)
        }
      }
    },
    // 更新下拉数据
    judgeserarchProjectManagerEdit  (val, listItemId) {
      if (!val) {
        this.serarchProjectManagerEdit(listItemId, '')
      }
    },
    //项目经理搜索更新下拉数据
    serarchProjectManagerEdit (listItemId, userName, boole) {
      // 列表循环
      this.list.some(async item => {
        if (item.id === listItemId) {
          if (boole) {
            item.editProjectManager = ''
            userName = ''
          }
          item.projectManagerOptions = await this.getmanageerOptions(userName)
          if (item.projectManager) {
            let hasSelectManager = item.projectManagerOptions.some(item2 => {
              return item2.userAccount === item.projectManager.userAccount
            })
            if (!hasSelectManager) {
              item.projectManager.isHiden = true
              item.projectManagerOptions = item.projectManagerOptions.concat(item.projectManager)
            }
          }
          if (item.projectManagerOptions.length) {
            this.projectManagerOptions = this.projectManagerOptions.length === 0 ? item.projectManagerOptions : this.projectManagerOptions
          }
          return true
        }
      })
    },
    //更新获取项目经理数据
    async getmanageerOptions (userName) {
      if (!this.projectCode) return
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
    upDataList () { //大保存之后刷新列表
      if (this.$route.params.projectCode) { //编辑页面
        this.getList()
      } else { //新增//保存了基本信息和团队信息
        if (this.projectCode && this.saveFlag) {
          this.getList()
        }
      }
    },
    validate () { //保存时候校验
      return new Promise((resolve, reject) => {
        let flag = true //默认表单都是有效
        if (this.addvisable && this.list.length === 0) { //只要有新增表单就存在
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
          if (this.ruleForm.projectAchievementList.length === 0) {
            flag = false
            this.$message({
              type: 'warning',
              message: `新增子项目${this.ruleForm.projectName}最少关联一个成果`,
              showClose: true
            })
            return
          }
        }
        if (this.list.length === 0 && !this.addvisable) { //此时只要一个新增的框,没有成果
          this.$message({
            type: 'warning',
            message: '请最少添加一个子项目',
            showClose: true
          })
          flag = false
          resolve(false)
          return true
        } else {
          let hasOneProjectAchievementList = true //每条记录至少有一个成果
          let childProjectName = ''
          this.list.forEach(listItem => {
            if (!listItem.isCached) return
            this.$refs['listItem' + listItem.id][0].validate((valid) => {
              if (!valid) {
                flag = false
              }
            })
            if (!listItem.projectAchievementList || listItem.projectAchievementList.length === 0) {
              hasOneProjectAchievementList = false
              // flag = false
              childProjectName += listItem.projectName + ','
            }
            if (!listItem.projectManager.userName) {
              flag = false
            }
          })
          if (this.addvisable) {
            this.$refs.ruleForm.validate(valid => {
              if (!valid) {
                flag = false
              }
            })
          }
          if (this.addvisable && this.ruleForm.projectAchievementList.length === 0) {
            childProjectName += '新增子项目' + this.ruleForm.projectName + ','
            hasOneProjectAchievementList = false
            // flag = false
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
          // let sendList = JSON.parse(JSON.stringify(this.list))
          let sendList = JSON.parse(JSON.stringify(this.list.filter(ele => ele.isCached)))
          sendList.forEach(listItem => {
            if (listItem.entry === 1) {
              // listItem.parentCode = this.projectCode
              listItem.subProjectCode = ''
            }
            listItem.parentCode = this.projectCode
            listItem.subProjectAchievementCodeList = []
            listItem.projectAchievementList.forEach(item => {
              listItem.subProjectAchievementCodeList.push(item.achievementCode)
            })
          })
          if (this.addvisable) {
            let ruleForm = this.ruleForm
            ruleForm.parentCode = this.projectCode
            ruleForm.subProjectAchievementCodeList = []
            ruleForm.projectAchievementList.forEach(item => {
              ruleForm.subProjectAchievementCodeList.push(item.achievementCode)
            })
            sendList.push(ruleForm)
          }
          let validTeam = sendList.some(item => {
            if (!this.validTeamInfo(item.projectManager)) {
              this.$message({
                type: 'error',
                showClose: true,
                message: '子项目项目经理不在团队信息的项目经理/项目成员内！'
              })
              return true
            }
          })
          if (validTeam) {
            resolve(false)
          } else {
            resolve(sendList)
          }
        } else {
          resolve(false)
        }
      })
    },
    //初始化数据
    init () {
      if (this.$route.params.projectCode) { //编辑页面
        // this.getList()
      } else { //新增页面
        if (this.$route.query.needAch === '1') {
          this.getAchievementList()
        }
      }
    },
    //清空校验信息
    validateAllForm () {
      // 获取到最新的 dom 信息
      this.$nextTick(() => {
        this.list.forEach(listItem => {
          this.$refs['listItem' + listItem.id][0].clearValidate('projectName')
        })
      })
    },
    // 获取数据列表
    getList () {
      APIGroupPlan.queryLastSubProjectInfoU(this.projectCode)
        .then(res => {
          if (res) {
            res.forEach(item => {
              item.projectManager = item.leadUndertakeManager
              if (!item.projectAchievementList) {
                item.projectAchievementList = []
              }
              item.projectManagerOptions = this.projectManagerOptions || []
              item.editProjectManager = ''
            })
          }
          this.list = res || []
          let deliveryTimeList = []
          this.list.forEach(item => {
            item.projectAchievementList.forEach(item2 => {
              deliveryTimeList.push(item2.deliveryTime)
            })
          })
          if (deliveryTimeList.length) {
            bus.$emit('acceptAchievementTime', [Math.max(...deliveryTimeList) || null, Math.min(...deliveryTimeList) || null])
          } else {
            bus.$emit('acceptAchievementTime', [null, null])
          }
          if (this.addvisable) {
            this.addvisable = false
          }
          this.validateAllForm()
          this.emitNowList()
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
    // 接受团队信息数据
    acceptTeamInfoData (e) { //实时监听团队信息传过来的数据,更新项目经理下拉数据
      bus.$on('changeTeamInfo', (e) => {
        // console.log(e)
        this.cachedTeamInfo = JSON.parse(JSON.stringify(e))
        // let projectManagerOptions = []
        // e.projectCompanyList.forEach(item => {
        //   if (item.type === '2') { //承担单位
        //     item.projectTeamList.forEach(item2 => {
        //       projectManagerOptions.push(item2)
        //     })
        //   }
        // })
        // this.projectManagerOptions = projectManagerOptions
        this.projectManagerOptions = e
        if (this.addvisable) {
          let hasUser = false
          e.some(item => {
            if (this.ruleForm.projectManager) {
              if (this.ruleForm.projectManager.userAccount === item.userAccount) {
                hasUser = true
              }
            }
          })
          if (!hasUser) {
            this.$refs.ruleForm.validate(valid => {})
            this.ruleForm.projectManager = ''
          }
        }
        this.list.forEach(item => {
          let hasUser = false
          item.projectManagerOptions = e
          e.some(item2 => {
            if (item.projectManager && item2) {
              if (item.projectManager.userAccount === item2.userAccount) {
                hasUser = true
              }
            }
          })
          if (!hasUser) {
            this.$refs['listItem' + item.id][0].validate((valid) => {})
            item.projectManager = ''
          }
        })
      })
    },
    // 设置项目经理
    setManageOptions (val) {
      this.projectManagerOptions = JSON.parse(JSON.stringify(val))
    },
    saveEdit (listItem) { //编辑暂存
      if (this.curEditSubProjectId && this.curEditSubProjectId !== listItem.id) { //编辑的非当前子项目
        this.$message({
          message: '请先保存当前编辑的子项目',
          type: 'warning',
          showClose: true
        })
        return
      }
      // if (!listItem.projectManager.userName) {
      //   this.$message({
      //     type: 'warning',
      //     message: `请检查子项目信息`,
      //     showClose: true
      //   })
      //   return
      // }
      this.$refs['listItem' + listItem.id][0].validate((valid) => {
        if (valid) {
          if (!this.validTeamInfo(listItem.projectManager)) {
            this.$message({
              type: 'error',
              showClose: true,
              message: '子项目项目经理不在团队信息的项目经理/项目成员内！'
            })
            return false
          }
          let sendSubProjectAchievementCode = []
          listItem.projectAchievementList.forEach(item => {
            sendSubProjectAchievementCode.push(item.achievementCode)
          })
          if (listItem.projectAchievementList.length) {
            if (listItem.entry === 1) { //带入
              if (!this.projectCode) {
                this.$message({
                  message: '请先保存基本信息',
                  type: 'warning',
                  showClose: true
                })
                return
              }
              let params = {
                parentCode: this.projectCode,
                projectName: listItem.projectName,
                projectManager: listItem.projectManager,
                subProjectAchievementCodeList: sendSubProjectAchievementCode
              }
              let leftList = []
              // let allHasProjectAchievementList = true
              this.list.forEach(item => {
                if (listItem.subProjectCode !== item.subProjectCode) {
                  let sendSubProjectAchievementCode = []
                  item.projectAchievementList.forEach(item2 => {
                    sendSubProjectAchievementCode.push(item2.achievementCode)
                  })
                  item.subProjectAchievementCodeList = sendSubProjectAchievementCode
                  // if (item.subProjectAchievementCodeList.length === 0) {
                  //   allHasProjectAchievementList = false
                  // }
                  item.parentCode = this.projectCode
                  item.projectManager = listItem.projectManager
                  // this.$refs['listItem' + listItem.id][0].validate((valid) => {})
                  leftList.push({ parentCode: item.parentCode, projectName: item.projectName, projectManager: item.projectManager, subProjectAchievementCodeList: item.subProjectAchievementCodeList })
                }
              })
              // if (!allHasProjectAchievementList) {
              //   this.$message({
              //     type: 'warning',
              //     message: `请检查子项目信息`,
              //     showClose: true
              //   })
              //   return
              // }
              let allList = [params, ...leftList]
              let num = 0
              allList.forEach(async (item, index) => {
                await APIGroupPlan.addSubProjectInfoU(item)
                  .then(res => {
                    num++
                    if (num === allList.length) {
                      this.$message({
                        message: '子项目保存成功',
                        type: 'success'
                      })
                      // this.getList()
                      this.$emit('saveSubProject')
                      this.changeInfo(false)
                      this.curEditSubProjectId = '' //暂存成功后清空
                    }
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
              })
            } else {
              let params = {
                subProjectCode: listItem.subProjectCode,
                id: listItem.id,
                // parentCode: this.parentCode,
                parentCode: this.projectCode,
                projectName: listItem.projectName,
                projectManager: listItem.projectManager,
                subProjectAchievementCodeList: sendSubProjectAchievementCode
              }
              APIGroupPlan.editSubProjectInfoU(params)
                .then(res => {
                  this.$message({
                    message: '子项目保存成功',
                    type: 'success'
                  })
                  // this.getList()
                  this.$emit('saveSubProject')
                  this.changeInfo(false)
                  this.curEditSubProjectId = '' //暂存成功后清空
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
          } else {
            this.$message({
              type: 'warning',
              message: '请最少关联一条成果',
              showClose: true
            })
          }
        }
      })
    },
    saveAdd () { //新增暂存
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.validTeamInfo(this.ruleForm.projectManager)) {
            this.$message({
              type: 'error',
              showClose: true,
              message: '子项目项目经理不在团队信息的项目经理/项目成员内！'
            })
            return false
          }
          let sendSubProjectAchievementCode = []
          this.ruleForm.projectAchievementList.forEach(item => {
            sendSubProjectAchievementCode.push(item.achievementCode)
          })
          if (this.ruleForm.projectAchievementList.length) {
            let sendData = {
              // parentCode: this.parentCode,
              parentCode: this.projectCode,
              projectName: this.ruleForm.projectName,
              projectManager: this.ruleForm.projectManager,
              subProjectAchievementCodeList: sendSubProjectAchievementCode
            }
            APIGroupPlan.addSubProjectInfoU(sendData)
              .then(res => {
                this.$message({
                  message: '子项目保存成功',
                  type: 'success'
                })
                // this.getList()
                this.ruleForm.isExpand = true
                this.ruleForm.isCached = true
                this.ruleForm.subProjectCode = res
                this.ruleForm.id = res
                this.ruleForm.editProjectManager = ''
                this.ruleForm.projectManagerOptions = this.projectManagerOptions || []
                this.list.unshift(this.ruleForm)
                this.addvisable = false
                this.$emit('saveSubProject')
                this.changeInfo(false)
                this.curEditSubProjectId = '' //暂存成功后清空
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
          } else {
            this.$message({
              type: 'warning',
              message: '请最少关联一条成果',
              showClose: true
            })
          }
        }
      })
    },
    saveDelEdit (listItem) { //编辑删除
      if (this.curEditSubProjectId && this.curEditSubProjectId !== listItem.id) { //编辑的非当前子项目
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
          if (listItem.entry === 1) { //带入
            this.list.some((item, index) => {
              if (item.subProjectCode === listItem.subProjectCode) {
                this.list.splice(index, 1)
                this.changeInfo(false)
                this.curEditSubProjectId = '' //删除后清空
                return true
              }
            })
          } else {
            APIGroupPlan.removeSubProjectInfoU({ parentCode: this.projectCode, subProjectCode: listItem.subProjectCode })
              .then(res => {
                this.$message({
                  message: '删除子项目成功',
                  type: 'success'
                })
                this.list.some((item, index) => {
                  if (item.subProjectCode === listItem.subProjectCode) {
                    this.list.splice(index, 1)
                    this.changeInfo(false)
                    this.curEditSubProjectId = '' //删除后清空
                    return true
                  }
                })
                // this.getList()
              })
              .catch(e => {
                this.loading = false
                if (e.selfError) return
                this.$message({
                  message: e.message || '子项目删除失败',
                  type: 'error',
                  showClose: true
                })
              })
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
          this.$message({
            message: '删除子项目成功',
            type: 'success'
          })
          this.addvisable = false
          if (this.curEditSubProjectId === 'add') {
            this.curEditSubProjectId = ''
          }
          this.emitNowList()
          this.changeInfo(false)
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
      if (this.curEditSubProjectId) {
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
      if (this.$route.params.projectCode) { //编辑页面

      } else { //新增页面
        // if (!this.projectCode || !this.saveFlag) {
        if (!this.projectCode) {
          this.$message({
            message: '请先保存基本信息',
            type: 'warning',
            showClose: true
          })
          return
        }
      }
      this.ruleForm = {
        projectName: '', //项目名称
        projectManager: '', //项目经理
        projectAchievementList: []
      }
      this.addvisable = true
      // 清空校验信息
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    // 获取成果列表
    getAchievementList () {
      let params = {
        projectCode: this.$route.query.demandProjectCode || '',
        letterCode: this.$route.query.letterCode || '',
        pageNo: 1,
        pageSize: 10000
      }
      APIGroupPlan.queryDemandProjectAchievementListU(params)
        .then(res => {
          let subProjectInfoList = []
          if (res.records) {
            res.records.forEach(ach => {
              let subPrj = null
              subProjectInfoList.some(ele => {
                if (ele.subProjectCode === ach.subProjectCode) {
                  subPrj = ele
                  return true
                }
              })
              let temp = {
                id: (this.id++).toString(),
                projectManager: '',
                subProjectCode: ach.subProjectCode,
                projectName: ach.subProjectName,
                leadUndertakeManager: '',
                projectAchievementList: ach.achievementDetail.linkFlag === '0' ? [ach.achievementDetail] : [],
                entry: 1
              }
              if (subPrj) {
                subPrj.projectAchievementList = subPrj.projectAchievementList.concat(temp.projectAchievementList)
              } else {
                subProjectInfoList.push(temp)
              }
            })
          }
          let subProjectInfoList1 = []
          subProjectInfoList.forEach(item => {
            if (item.projectAchievementList.length > 0) {
              subProjectInfoList1.push(item)
            }
          })
          this.list = subProjectInfoList1
          this.emitNowList()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取成果失败，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
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
    // 有值发生改变时
    changeValue (id, prop = '') {
      this.changeInfo()
      if (prop) {
        this.emitNowList()
      }
      if (this.curEditSubProjectId && this.curEditSubProjectId !== id) { //编辑的非当前子项目
        setTimeout(() => {
          this.$message({
            message: '请先保存当前编辑的子项目',
            type: 'warning',
            showClose: true
          })
        })
      } else {
        this.curEditSubProjectId = id
      }
    },
    updateAch () {
      this.emitNowList()
    },
    //关联成果的部门不可删除，如果删除成果的关联时部门不会联动删除
    //成果负责人反显到成果所属承担部门的项目成员中不可删除
    emitNowList () {
      let sendList = JSON.parse(JSON.stringify(this.list))
      if (this.addvisable) {
        sendList.push(JSON.parse(JSON.stringify(this.ruleForm)))
      }
      let subProjectList = []
      let achList = []
      sendList.forEach(ele => {
        if (ele.projectManager && ele.projectManager.userAccount) {
          subProjectList.push(ele.projectManager.userAccount)
        }
        if (ele.projectAchievementList) {
          ele.projectAchievementList.forEach(ach => {
            let obj = {
              undertakeUnitDeptCode: ach.undertakeUnitDeptCode, //成果的承担部门 -> 团队信息的配合承担部门
              undertakeUnitDept: ach.undertakeUnitDept,
              undertakeUnit: ach.undertakeUnit,
              undertakeUnitCode: ach.undertakeUnitCode,
              responsibleUid: ach.responsibleUid, //成果负责人
              responsiblePerson: ach.responsiblePerson
            }
            achList.push(obj)
          })
        }
      })
      let params = {
        managerList: subProjectList,
        achList: achList
      }
      // 去触发更新子项目
      bus.$emit('updateSubprojectInfo', params)
    },
    /**
     * 校验项目经理是否在当前页面的团队信息中
     * @return {Boolean} true:在-校验成功，false:不在-校验失败
     */
    validTeamInfo (manager) {
      return this.cachedTeamInfo.some(user => user.userAccount === manager.userAccount)
    }
  }
}
</script>
<style lang="scss" scoped>
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
     .project-panel{
    margin-bottom: 0px;
  }
    .project-panel .panel-body.is-expand {
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
       &:last-child{
        //  margin-bottom: 0;
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
