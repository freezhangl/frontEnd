<!-- 转办组件 B004-->
<template>
  <div class="processTransfer">
    <el-dialog
      v-dialogDrag
      title="转办"
      :before-close="beforeCloseDialog"
      :visible.sync="dialogVisible"
      :show="show"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form
        :model="approvalForm"
        :rules="approvalFormRule"
        ref="approvalForm"
        label-width="92px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="转办人员：" prop="transferPeople">
              <el-select
                :popper-append-to-body="false"
                v-model="approvalForm.transferPeople"
                placeholder="请选择">
                <el-option
                  v-for="item in participantList"
                  :label="item.participantNameEmail"
                  :value="item.participantId"
                  :key="item.participantId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="审批意见：" prop="approvalOpinion">
              <el-input
                type="textarea"
                style="width: 388px"
                :rows="5"
                maxlength="300"
                show-word-limit
                placeholder="请输入审批意见"
                v-model.trim="approvalForm.approvalOpinion"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeApproveForm">取消</el-button>
        <el-button type="primary" @click="submitApproveForm">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import API from '@lib/common/serve/API_processSubmit'
export default {
  name: 'processTransfer',
  props: {
    show: { type: Boolean, default: false },
    activityDefId: { type: String, default: '' },
    processTemplateCode: { type: String, default: '' },
    businessSerialNumber: { type: String, default: '' }
  },
  data () {
    return {
      dialogVisible: this.show,
      approvalForm: {
        transferPeople: '', //人员选择
        approvalOpinion: '' //审批意见
      },
      approvalFormRule: {
        transferPeople: [
          { required: true, message: '请选择转办人员', trigger: 'change' }
        ]
      },
      participantList: []
    }
  },
  watch: {
    show (newVal, oldVal) {
      this.dialogVisible = newVal
      if (newVal === true) {
        this.getReassignPeople()
      }
      this.$nextTick(() => {
        this.$refs['approvalForm'].clearValidate()
      })
    }
  },
  mounted () {

  },
  methods: {
    // 获取转办人员
    getReassignPeople () {
      let params = {
        processTemplateCode: this.processTemplateCode, // 流程模板编码
        activityDefId: this.activityDefId, // 活动节点ID
        businessSerialNumber: this.businessSerialNumber //业务流水号
      }
      API.getReassignPeople(params)
        .then(res => {
          this.participantList = res.personListWithOrgs || []
          this.participantList.forEach(item => {
            if (item.participantEmail) {
              item.participantNameEmail =
                item.participantName + '(' + item.participantEmail + ')'
            } else {
              item.participantNameEmail = item.participantName
            }
          })
        })
        .catch(e => {
          this.participantList = []
        })
    },
    // 提交表单
    submitApproveForm () {
      this.$refs['approvalForm'].validate(valid => {
        if (valid) {
          let name = ''
          this.participantList.forEach(item => {
            if (item.participantId === this.approvalForm.transferPeople) {
              name = item.participantName
            }
          })
          let obj = {
            participants: [{ 'name': name, 'id': this.approvalForm.transferPeople }], //人员选择
            approvalOpinion: this.approvalForm.approvalOpinion //审批意见
          }
          this.$emit('confirmTransfer', obj)
          this.closeApproveForm()
        }
      })
    },
    beforeCloseDialog () {
      this.closeApproveForm()
    },
    // 取消信息填写提交框
    closeApproveForm () {
      this.$refs['approvalForm'].resetFields()
      this.dialogVisible = false
      this.$emit('changeShowTransfer', this.dialogVisible)
    }
  }
}
</script>
<style lang="scss" scoped>
.processTransfer {
  /deep/ .el-dialog__wrapper {
    .el-dialog {
      width:530px;
      .el-dialog__body {
        padding-bottom: 0;
        .el-form-item {
         .el-input__inner {
            width: 340px;
          }
          margin-bottom: 15px;
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
        }
      }
    }
  }

}
</style>
