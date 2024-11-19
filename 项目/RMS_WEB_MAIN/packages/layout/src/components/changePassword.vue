<template>
  <div class="change-password">
    <el-dialog
      title="修改密码"
      :visible.sync="visible"
      :lock-scroll="true"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      width="456px">
      <div class="dialog-main">
        <el-form
          :model="passwordForm"
          ref="passwordForm"
          label-width="104px"
          label-suffix="："
          :rules="rules">
          <!--status-icon-->
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              type="password"
              v-model="passwordForm.oldPassword"
              autocomplete="off"
              show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              type="password"
              v-model="passwordForm.newPassword"
              autocomplete="off"
              show-password></el-input>
          </el-form-item>
          <el-form-item label="重复新密码" prop="renewPassword">
            <el-input
              type="password"
              v-model="passwordForm.renewPassword"
              autocomplete="off"
              show-password></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button plain @click="cancelPasswordForm('passwordForm')">取消</el-button>
        <el-button type="primary" @click="submitPasswordForm('passwordForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '../../serve/index'
import { mapGetters, mapMutations } from 'vuex'
import { aes } from '@lib/common/util/encrypt'
export default {
  name: 'changePassword',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editMode: {
      type: String,
      default: 'active'
    },
    userType: {
      type: String,
      default: ''
    }
  },
  data () {
    // 密码校验，大小写/数字/特殊字符/8-16位
    const pwdRegex = /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Z0-9\W]+$)([A-Za-z_0-9\W]){8,16}$/
    // const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,16}')
    // 密码校验，至少包括一个大写字母/小写字母/特殊字符，6-16位
    // const pwdRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,16}$')
    let validateOldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    let validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!pwdRegex.test(value)) {
        callback(new Error('输入的密码不满足"8-16位，大小写、数字、特殊字符每种至少一位"的要求'))
      } else {
        callback()
      }
    }
    let validateRenewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入重复新密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else if (!pwdRegex.test(value)) {
        callback(new Error('输入的密码不满足"8-16位，大小写、数字、特殊字符每种至少一位"的要求'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        renewPassword: ''
      },
      rules: {
        oldPassword: [{ validator: validateOldPassword, trigger: 'blur' }],
        newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
        renewPassword: [{ validator: validateRenewPassword, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'USERENTITY/userInfo',
      userAuth: 'USERENTITY/userAuth'
    })
  },
  methods: {
    // 清楚用户信息
    ...mapMutations({
      clearUserInfo: 'USERENTITY/clearUserInfo'
    }),
    // 关闭dialog时
    beforeClose () {
      this.cancelPasswordForm('passwordForm')
    },
    cancelEdit (formName) {
      this.$refs[formName].resetFields()
      this.$emit('update:visible', false)
    },
    //取消
    cancelPasswordForm (formName) {
      if (this.editMode === 'active') {
        this.cancelEdit(formName)
      } else {
        API.logout({ refreshToken: this.userInfo.refreshToken })
          .then(res => {
            this.cancelEdit(formName) // 关闭弹窗
            this.clearUserInfo() // 清楚用户信息
            this.$router.push({
              name: 'login'
            })
          })
          .catch(e => {
            if (e.selfError) return
            this.$message({
              type: 'error',
              message: e.message || '服务器异常，退出登录失败！',
              showClose: true
            })
          })
      }
    },
    // 确认
    submitPasswordForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: this.userAuth.id,
            password: aes.en(this.passwordForm.oldPassword),
            newPassword1: aes.en(this.passwordForm.newPassword),
            newPassword2: aes.en(this.passwordForm.renewPassword)
          }
          if (this.userType === '3') {
            API.modPasswordOutsideUser(params)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '密码修改成功，请重新登陆！',
                  showClose: true
                })
                this.cancelEdit(formName) // 关闭弹窗
                this.clearUserInfo() // 清楚用户信息
                this.$router.push({
                  name: 'login'
                })
              })
              .catch(e => {
                if (e.selfError) return
                this.$message({
                  type: 'error',
                  message: e.message || '服务器异常，密码修改失败！',
                  showClose: true
                })
              })
          } else {
            API.modPasswordEcoUser(params)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '密码修改成功，请重新登陆！',
                  showClose: true
                })
                this.cancelEdit(formName) // 关闭弹窗
                this.clearUserInfo() // 清楚用户信息
                this.$router.push({
                  name: 'login'
                })
              })
              .catch(e => {
                if (e.selfError) return
                this.$message({
                  type: 'error',
                  message: e.message || '服务器异常，密码修改失败！',
                  showClose: true
                })
              })
          }
        } else {
          return false
        }
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  .change-password {
    /deep/ .el-input__inner {
      width: 300px;
    }
    /deep/ .el-input__suffix {
      right: 15px;
    }
  }
</style>
