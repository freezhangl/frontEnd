<template>
  <div class="change-reason">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="130px"
    >
      <el-form-item label="预立项说明:" prop="info">
        {{info}}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['info'],
  data () {
    return {
      ruleForm: {
        changeReason: ''
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.change-reason{
  background: #ffffff;
  padding: 20px 30px;
  margin-bottom: 30px;
  .el-form-item{
    margin-bottom: 0;
  }
  /deep/.el-form-item__content{
    line-height: 25px!important;
    color: #333;
  }
}
</style>
