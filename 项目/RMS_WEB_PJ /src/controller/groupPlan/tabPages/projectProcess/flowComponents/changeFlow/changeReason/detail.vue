<template>
  <div class="change-reason">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="130px"
    >
      <!-- <el-form-item label="变更理由:" prop="changeReason">
        {{ruleForm.changeReason}}
      </el-form-item> -->
      <el-form-item label="变更理由:" prop="info">
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
        changeReason: 'xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请'
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
    line-height: 22px;
    color: #333;
  }
}
</style>
