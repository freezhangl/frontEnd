import { getStore } from '@/store'
import flowAPI from '@/serve/API_businessFlow'
export const flowRollback = {
  data () {
    return {
      userId: getStore().getters['USERENTITY/userInfo'].userAuth.uid,
      userName: getStore().getters['USERENTITY/userInfo'].userAuth.chineseName,
      createdBy: ''
    }
  },
  created () {
  },
  methods: {
    // 撤销流程
    rollBackProcessInstance () {
      this.$confirm(' ', '是否撤回流程?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          let params = {
            projectCode: this.projectCode || this.$route.query.projectCode,
            approveNo: this.approveNo || this.$route.query.approveNo,
            businessType: this.businessType || this.$route.query.type || this.$route.query.businessType
          }
          // console.log(params)
          flowAPI.rollBackProcessInstance(params)
            .then(res => {
              this.$message({
                type: 'success',
                center: true,
                message: '撤回流程成功。'
              })
              setTimeout(() => { this.closeProcessInfo ? this.closeProcessInfo() : this.closeFlowApprove() }, 500)
            })
            .catch(e => {
              this.loading = false
              if (e.selfError) return
              if (e.message) {
                this.$message({
                  message: e.message || '撤销流程失败，请稍后重试！',
                  type: 'error',
                  showClose: true
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销流程'
          })
        })
    }
  }
}
