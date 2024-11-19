<template>
  <div class="change-reason">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
    >
      <el-form-item style="font-size: 14px;color: #333333;line-height: 22px;" label="变更理由:" prop="changeReason">
        <el-input
          placeholder="请输入理由"
          v-model="ruleForm.changeReason"
          show-word-limit
          maxlength="300"
          type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      ruleForm: {
        changeReason: ''
      },
      rules: {
        changeReason: [{ required: true, message: '请输入理由', trigger: 'blur' }]
      }
    }
  },
  props: {
    receiveData: { type: String, default: '' }
  },
  watch: {
    receiveData: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.ruleForm.changeReason = val
        }
      }
    }
  },
  methods: {
    getChangeReason () {
      return this.ruleForm.changeReason
    },
    resetFields () {
      this.$refs['ruleForm'].resetFields()
    },
    clearValidate () {
      this.$refs['ruleForm'].clearValidate()
    },
    async validate () {
      return new Promise((resolve, reject) => {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            resolve(this.ruleForm.changeReason)
          } else {
            resolve(false)
            return false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .change-reason{
    background: #ffffff;
    padding: 20px 30px;
    margin-bottom: 30px;
    /deep/ .el-textarea__inner{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 22px;
      color: #333333;
      letter-spacing: 0;
      border-radius: 2px;
      height: 100px;
    }
    /deep/ .el-form-item__label{
      color:#333333;
    }
    /deep/ .el-input__count{
      right: 20px;
      line-height: 20px;
      background: transparent;
    }
    /deep/ .el-form-item__error{
      padding-top: 4px !important;
    }
  }
</style>
