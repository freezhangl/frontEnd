<template>
  <div class="achievement">
    <project-panel title="任务及预期成果">
      <template slot="header" v-if="type !== 'detail'">
        <!-- <el-button class="upload-btn" icon="el-icon-circle-plus-outline" @click="addDialog">新增成果</el-button> -->
        <span class="data-style-cut">
          <img @click="dataStyle = 'list'" :src="dataStyle === 'list' ? listIcon.checked : listIcon.notChecked">
          <img @click="dataStyle = 'card'" :src="dataStyle === 'card' ? cardIcon.checked : cardIcon.notChecked">
        </span>
      </template>
      <div class="achievement-body">
        <div class="achievement-list" v-show="dataStyle === 'list'">
          <!-- <self-table
            :table-data="receiveData || achievementList"
            :table-cols="type !== 'detail' ? tableCols : detailTableCols">
          </self-table> -->
          <self-table
            :table-data="taskList"
            :table-cols="detailTableCols">
          </self-table>
        </div>
        <div class="achievement-card" v-show="dataStyle === 'card'">
          <el-row v-if="achievementList.length > 0" :gutter="30">
            <el-col
              :span="6"
              v-for="item of achievementList"
              :key="item.id">
              <el-card shadow="never">
                <div slot="header" class="clearfix">
                  <el-tooltip
                    :disabled="item.achievementName && item.achievementName.length < 7"
                    :content="item.achievementName"
                    effect="dark"
                    placement="top">
                    <span class="results-name">{{item.achievementName}}</span>
                  </el-tooltip>
                  <!-- <div style="float: right;">
                    <el-button v-if="showEditBtn" type="text" @click="editDialog(item)">
                      <img src="@/assets/icons/编辑.svg">
                    </el-button>
                    <el-button type="text" @click="achievementDel(item)">
                      <img src="@/assets/icons/删除.svg">
                    </el-button>
                  </div> -->
                </div>
                <div class="card-body">
                  <div>成果类型：
                    <el-tooltip
                      :disabled="item.achievementTypeValue && item.achievementTypeValue.length < 6"
                      :content="item.achievementTypeValue"
                      effect="dark"
                      placement="top">
                      <span>{{item.achievementTypeValue}}</span>
                    </el-tooltip>
                  </div>
                  <div>预计交付时间：
                    <el-tooltip
                      :content="dateFilter(item.deliveryTime)"
                      effect="dark"
                      placement="top">
                      <span>{{dateFilter(item.deliveryTime)}}</span>
                    </el-tooltip>
                  </div>
                  <div>成果负责人：
                    <el-tooltip
                      :disabled="item.responsiblePerson && item.responsiblePerson.length < 5"
                      :content="item.responsiblePerson"
                      effect="dark"
                      placement="top">
                      <span>{{item.responsiblePerson}}</span>
                    </el-tooltip>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <div v-else style="text-align: center; color: #999;">暂无数据</div>
        </div>
      </div>
    </project-panel>
    <el-dialog
      v-dialogDrag
      :title="title + '任务及预期成果'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="cancelDialog"
      width="790px">
      <el-form
        v-loading="dialogFormLoading"
        :model="dialogForm"
        label-position="right"
        :inline="true"
        ref="dialogForm"
        :rules="dialogFormRules">
        <el-form-item
          label="任务名称："
          prop="achievementName"
          label-width="170px">
          <el-input
            class="task-name"
            v-model.trim="dialogForm.achievementName"
            placeholder="请输入">
          </el-input>
        </el-form-item>
        <el-form-item
          label="成果类型："
          prop="achievementTypeValue"
          label-width="170px">
          <el-select
            v-model="dialogForm.achievementTypeValue"
            placeholder="请选择">
            <el-option
              v-for="(type, index) in resultsTypeOptions"
              :key="index"
              :label="type"
              :value="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="预期交付时间："
          prop="deliveryTime"
          label-width="120px">
          <el-date-picker
            v-model.trim="dialogForm.deliveryTime"
            type="date"
            placeholder="请选择日期"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="成果负责人："
          prop="responsiblePerson"
          label-width="170px">
          <el-select
            v-model="dialogForm.responsiblePerson"
            :popper-append-to-body="false"
            placeholder="请选择"
            value-key="userAccount"
            filterable>
            <el-option
              v-for="(p, index) in principals"
              :key="index"
              :label="p.userName"
              :value="p">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="submitDialogForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import projectPanel from '@/controller/components/projectPanel'
import selfTable from '@/components/table'
import API from '@/serve/API_project'
import delAPI from './delAPI'
import bus from '../../../../common/bus'
export default {
  name: 'achievement',
  components: { projectPanel, selfTable },
  props: [ 'receiveData', 'projectCode', 'type' ],
  data () {
    return {
      listIcon: {
        checked: require('@/assets/icons/列表选中.svg'),
        notChecked: require('@/assets/icons/列表未选中.svg')
      }, // 选择列表样式图标
      cardIcon: {
        checked: require('@/assets/icons/卡片选中.svg'),
        notChecked: require('@/assets/icons/卡片未选中.svg')
      }, // 选择卡片样式图标
      dataStyle: 'list', // 数据展示类型
      showEditBtn: true, // 是否展示编辑按钮
      taskList: [], // 任务列表
      achievementList: [], // 预期成果列表
      tableCols: [
        {
          label: '任务名称',
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
            { id: 1, type: 'text', label: '编辑', handle: this.editDialog },
            { id: 2, type: 'text', label: '删除', handle: this.achievementDel }
          ]
        }
      ], // 表格配置
      detailTableCols: [
        {
          label: '任务名称',
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
        }
      ], // 详情表格配置
      title: '', // 对话框标题
      dialogVisible: false, // 对话框显示隐藏
      dialogFormLoading: false, // 成果负责人加载
      dialogForm: {
        id: '',
        achievementsCode: '',
        researchTask: '',
        achievementName: '',
        achievementTypeValue: '',
        deliveryTime: '',
        responsiblePerson: ''
      }, // 对话框表单
      resultsTypeOptions: [
        '企标规范',
        '集采/选型测试',
        '验收测试',
        '入网测试',
        '补丁测试',
        '技术验证测试',
        '报告方案-技术研究类',
        '报告方案-市场/咨询类',
        '产品-原型',
        '产品-商用/准商用',
        '标准化-文稿',
        '标准化-立项',
        '标准化-标准',
        '标准化-白皮书',
        '标准化-研究报告',
        '支撑集团公司领导报告',
        '支撑院领导对外报告',
        '论文',
        '书籍',
        '培训材料',
        '专利',
        '其他'
      ], // 成果类型下拉列表
      principals: [], // 成果负责人列表
      dialogFormRules: {
        achievementName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { max: 128, message: '任务名称长度在128个字符以内', trigger: 'blur' }
        ],
        achievementTypeValue: [
          { required: true, message: '请选择成果类型', trigger: ['change', 'blur'] }
        ],
        deliveryTime: [
          { required: true, message: '请选择预期交付时间', trigger: 'blur' }
        ],
        responsiblePerson: [
          { required: true, message: '请选择成果负责人', trigger: ['change', 'blur'] }
        ]
      } // 表单校验
    }
  },

  mounted () {
    this.getTaskList()
    this.getAchievementList()
    // if (this.projectCode && !this.receiveData) {
    //   this.getAchievementList()
    //   this.verificationPermission()
    // }
  },

  methods: {
    // 获取用户权限
    verificationPermission () {
      const param = {
        projectCode: this.projectCode
      }
      API.verificationPermission(param)
        .then(res => {
          if (res.indexOf('00') > -1 || res.indexOf('02') > -1) {
            this.showEditBtn = true
          } else {
            this.showEditBtn = false
          }
          if (!this.showEditBtn) {
            this.tableCols[4].btnList = []
          }
        })
        .catch(e => {
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常，请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    // 查询任务列表
    getTaskList () {
      this.taskList = [
        {
          achievementName: '测试',
          achievementTypeValue: '2',
          deliveryTime: '2010-09-12',
          responsiblePerson: 'nice'
        },
        {
          achievementName: '测试1',
          achievementTypeValue: '2',
          deliveryTime: '2010-09-12',
          responsiblePerson: 'nice'
        },
        {
          achievementName: '测试2',
          achievementTypeValue: '2',
          deliveryTime: '2010-09-12',
          responsiblePerson: 'nice'
        },
        {
          achievementName: '测试4',
          achievementTypeValue: '2',
          deliveryTime: '2010-09-12',
          responsiblePerson: 'nice'
        }
      ]
    },
    // 查询预期成果列表
    getAchievementList () {
      this.achievementList = [
        {
          achievementName: '测试',
          achievementTypeValue: '2',
          deliveryTime: '2010-09-12',
          responsiblePerson: 'nice'
        },
        {
          achievementName: '测试1',
          achievementTypeValue: '2',
          deliveryTime: '2010-09-12',
          responsiblePerson: 'nice'
        },
        {
          achievementName: '测试2',
          achievementTypeValue: '2',
          deliveryTime: '2010-09-12',
          responsiblePerson: 'nice'
        },
        {
          achievementName: '测试4',
          achievementTypeValue: '2',
          deliveryTime: '2010-09-12',
          responsiblePerson: 'nice'
        }
      ]
    //   let param = {}
    //   param.projectCode = this.projectCode
    //   API.queryLastAchievement(param)
    //     .then(res => {
    //       this.achievementList = res
    //     })
    //     .catch(e => {
    //       if (!e.selfError) {
    //         this.$message({
    //           message: e.message || '服务器异常，请稍后重试！',
    //           type: 'error',
    //           showClose: true
    //         })
    //       }
    //     })
    },
    // 新增成果
    addDialog () {
      if (!this.projectCode) {
        this.$message({
          message: '请先保存基本信息！',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.title = '新增'
      this.dialogVisible = true
      this.getPrincipals()
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
    // 编辑
    editDialog (row) {
      this.title = '编辑'
      this.dialogVisible = true
      this.dialogForm.id = row.id
      this.dialogForm.achievementsCode = row.achievementsCode
      this.dialogForm.achievementName = row.achievementName
      this.dialogForm.achievementTypeValue = row.achievementTypeValue
      this.dialogForm.deliveryTime = row.deliveryTime
      this.dialogForm.responsiblePerson = {
        userName: row.responsiblePerson,
        userAccount: row.responsibleUid
      }
      this.getPrincipals()
    },
    // 删除
    achievementDel (row) {
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
          delAPI.deleteAchievement(row.id)
            .then(res => {
              if (res) {
                // this.achievementList = this.achievementList.filter(item => {
                //   return item.id !== row.id
                // })
                this.getAchievementList()
                this.$message({
                  message: '删除成功！',
                  type: 'success',
                  showClose: true
                })
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
    // 关闭对话框
    cancelDialog () {
      this.dialogVisible = false
      this.$refs.dialogForm.resetFields()
      this.dialogForm.id = ''
      this.dialogForm.achievementsCode = ''
      this.dialogForm.achievementTypeValue = ''
      this.dialogForm.deliveryTime = ''
      this.dialogForm.achievementName = ''
      this.dialogForm.resultsPrincipal = ''
    },
    // 提交表单
    submitDialogForm () {
      this.$refs.dialogForm.validate(validate => {
        if (validate) {
          switch (this.title) {
            case '新增':
              this.addAchievement()
              break
            case '编辑':
              this.editAchievement()
              break
            default:
              this.cancelDialog()
          }
        } else {
          return false
        }
      })
    },
    // 新增
    addAchievement () {
      let param = {}
      param.deliveryTime = this.dialogForm.deliveryTime
      param.achievementTypeValue = this.dialogForm.achievementTypeValue
      param.projectCode = this.projectCode
      param.responsiblePerson = this.dialogForm.responsiblePerson.userName
      param.responsibleUid = this.dialogForm.responsiblePerson.userAccount
      param.achievementName = this.dialogForm.achievementName
      API.addProjectAchievement(param)
        .then(res => {
          if (res) {
            // this.achievementList.push(res)
            this.getAchievementList()
            this.$message({
              message: '新增成功！',
              type: 'success',
              showClose: true
            })
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
    },
    // 编辑
    editAchievement () {
      let param = {}
      param.id = this.dialogForm.id
      param.achievementsCode = this.dialogForm.achievementsCode
      param.deliveryTime = this.dialogForm.deliveryTime
      param.achievementTypeValue = this.dialogForm.achievementTypeValue
      param.projectCode = this.projectCode
      param.responsiblePerson = this.dialogForm.responsiblePerson.userName
      param.responsibleUid = this.dialogForm.responsiblePerson.userAccount
      param.achievementName = this.dialogForm.achievementName
      API.updateProjectAchievement(param)
        .then(res => {
          if (res) {
            // this.achievementList = this.achievementList.map(item => {
            //   if (item.id === res.id) {
            //     item = res
            //   }
            // })
            this.getAchievementList()
            this.$message({
              message: '编辑成功！',
              type: 'success',
              showClose: true
            })
            bus.$emit('sendAchievementCode', res)
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
    },
    // 获取成果负责人列表
    getPrincipals () {
      if (!this.projectCode) { return }
      this.dialogFormLoading = true
      let param = {}
      param.projectCode = this.projectCode
      param.projectRoleCodes = 'PR-MANAGER,PR-MEMBER'
      API.queryProjectMembers(param)
        .then(res => {
          this.dialogFormLoading = false
          if (res) {
            this.principals = res
            if (this.dialogForm.responsiblePerson && !this.principals.some(p => p.userAccount === this.dialogForm.responsiblePerson.userAccount)) {
              this.principals.push({ userName: this.dialogForm.responsiblePerson.userName, userAccount: this.dialogForm.responsiblePerson.userAccount })
            }
          } else {
            this.principals = []
          }
        })
        .catch(e => {
          this.dialogFormLoading = false
          if (!e.selfError) {
            this.$message({
              message: e.message || '服务器异常,请稍后重试！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    async validate () {
      return new Promise((resolve, reject) => {
        if (this.achievementList.length > 0) {
          resolve(this.achievementList)
        } else {
          resolve(false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.achievement {
  .data-style-cut {
    display: inline-block;
    margin-left: 10px;
    vertical-align: bottom;
    img {
      vertical-align: bottom;
      cursor: pointer;
    }
  }
  .achievement-body {
    .el-col {
      margin-bottom: 20px;
      font-size: 14px;
      color: #333333;
      /deep/ .el-card__header {
        padding: 0 10px 0 20px;
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
      }
      /deep/ .el-card__body {
        .card-body {
          div {
            height: 32px;
            line-height: 32px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
.task-name {
  width: 570px;
  /deep/ .el-input__inner {
    width: 100%;
  }
}
</style>
