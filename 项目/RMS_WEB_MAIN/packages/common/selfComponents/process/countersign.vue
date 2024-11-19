<!--会签（多任务项） B0072-->
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
            <el-form-item label="下一环节：" prop="nextLink">
              <el-radio-group v-model="countersignForm.nextLink">
                <el-radio
                  v-for="item in nextActivities"
                  :label="item.activityDefId"
                  :key="item.activityDefId">
                  {{item.activityDefName}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员选择：" prop="peopleChoosen">
              <el-select placeholder="请选择" disabled v-model="countersignForm.peopleChoosen">
                <el-option
                  :multiple='isMultiple'
                  collapse-tags
                  v-for="item in participantList"
                  :label="item.name"
                  :value="item.id"
                  :key="item.id"></el-option>
              </el-select>
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
                    :disabled="!showToolTip(item.opinionContent, 330)"
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
                style="width: 388px"
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
      class="confirmDialog"
      title="审批流程"
      :visible.sync="confirmDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="confirm" style="margin-bottom: 20px;">
        <span>下一环节：</span>
        <div>{{nextLinkShow}}</div>
      </div>
      <div class="confirm" style="margin-bottom: 20px;">
        <span>人员：</span>
        <div>{{peopleChoosenShow}}</div>
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
  </div>
</template>

<script>
import API from '@lib/common/serve/API_processSubmit'
import { isShowToolTip } from '@lib/common/util/common'
export default {
  name: 'countersign',
  props: {
    show: { type: Boolean, default: false },
    businessSerialNumber: { type: String, default: '' },
    processInstId: { type: Number, default: 0 },
    activityInstId: { type: Number, default: 0 }
  },
  data () {
    return {
      dialogVisible: this.show,
      confirmDialogVisible: false,
      countersignForm: {
        nextLink: '', // 审批结果
        peopleChoosen: '', // 人员选择
        commonOpinion: '', // 常用意见
        approvalOpinion: '' // 审批意见
      },
      isMultiple: false,
      nextActivities: [],
      participantList: [],
      commonOpinionList: [], //常用意见列表
      countersignRules: {
        nextLink: [
          { required: true, message: '请选择下一环节', trigger: 'change' }
        ],
        peopleChoosen: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ],
        approvalOpinion: [
          { required: true, message: '请输入审批意见', trigger: 'change' }
        ]
      },
      nextLinkShow: '',
      peopleChoosenShow: ''
    }
  },
  watch: {
    show (newVal, oldVal) {
      this.dialogVisible = newVal
      if (newVal === true) {
        this.getTempApprovals()
        this.getNextActivities()
        this.getOpinions()
        this.getPrePeople()
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
            if (item.id === val) {
              this.peopleChoosenShowArr.push(item.name)
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
          if (item.id === newVal) {
            this.peopleChoosenShow = item.name
          }
        })
      }
    }
  },
  mounted () {

  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
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
          this.countersignForm.nextLink = res[0].activityDefId
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
    // 获取上一环节处理人员
    getPrePeople () {
      let params = {
        processInstId: String(this.processInstId), //流程实例ID
        activityInstId: String(this.activityInstId) //活动实例id
      }
      API.getPrePeople(params)
        .then(res => {
          this.participantList = res
          this.countersignForm.peopleChoosen = this.participantList[0].id
          // 是否多项任务 multiTaskFlag  0：否、1：是
          if (res.multiTaskFlag === 0) {
            this.isMultiple = false
          } else {
            this.isMultiple = true
          }
        })
        .catch(e => {
          this.participantList = []
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取人员失败！',
              type: 'error',
              showClose: true
            })
          }
        })
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
        if (!errorMessage) {
          let params = {
            businessSerialNumber: this.businessSerialNumber, //业务流水号
            processInstId: this.processInstId, //流程实例ID
            approvalState: 2,
            approvalOpinion: this.countersignForm.approvalOpinion, //审批意见
            activityNodeName: this.nextLinkShow, //活动节点名称
            activityDefId: this.countersignForm.nextLink, //活动节点id（当前节点id）
            activityInstId: this.activityInstId //活动实例id
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
        }
      })
    },
    beforeCloseDialog () {
      this.closeCountersignForm()
    },
    // 取消信息填写提交框
    closeCountersignForm () {
      this.$refs['countersignForm'].resetFields()
      this.dialogVisible = false
      this.participantList = []
      this.$emit('changeSign', this.dialogVisible)
    },
    //  提交
    countersignSubmit () {
      this.$refs['countersignForm'].validate(valid => {
        if (valid) {
          this.confirmDialogVisible = true
        }
      })
    },
    // 取消确认框
    closeConfirmDialog () {
      this.confirmDialogVisible = false
    },
    // 提交确认框
    submitConfirmDialog () {
      // 如果是多选-->数组
      let arr = []
      if (Array.isArray(this.countersignForm.peopleChoosen)) {
        this.participantList.forEach(item => {
          this.countersignForm.peopleChoosen.forEach(val => {
            if (item.id === val) {
              arr.push({ 'name': item.name, 'id': item.id })
            }
          })
        })
      } else {
        // 如果是单选-->字符串
        this.participantList.forEach(item => {
          if (item.id === this.countersignForm.peopleChoosen) {
            arr.push({ 'name': item.name, 'id': item.id })
          }
        })
      }
      let obj = {
        approvalState: '0',
        nextLink: this.countersignForm.nextLink,
        participants: arr,
        approvalOpinion: this.countersignForm.approvalOpinion
      }
      this.$emit('confirmSign', obj)
      this.closeConfirmDialog()
      this.closeCountersignForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.countersign {
  /deep/ .signDialog {
    .el-dialog {
      width:530px;
      .el-dialog__body {
        padding-bottom: 0;
        .el-form-item {
          margin-bottom: 15px;
          &.commonOpinion {
            .el-input__inner {
              width: 388px;
            }
            .el-select-dropdown {
              max-width: 388px;
              .el-select-dropdown__item{
                span {
                  max-width: 330px;
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
            }
          }
        }
      }
    }
  }
  /deep/ .confirmDialog {
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
