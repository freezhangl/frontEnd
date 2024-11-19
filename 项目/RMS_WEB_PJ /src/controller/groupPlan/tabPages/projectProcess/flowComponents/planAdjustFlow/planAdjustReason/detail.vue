<template>
  <div class="change-reason">
    <el-form :model="ruleForm" ref="ruleForm" label-width="130px">
      <el-form-item style="font-size: 14px;color: #333333;line-height: 25px; " label="变更理由:" prop="info">
        <pre class="preInfo">{{ info }}</pre>
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
        changeReason:
          'xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由，xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请理由xxxx申请'
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.change-reason {
  background: #ffffff;
  padding: 20px 30px;
  margin-bottom: 30px;
  .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .preInfo {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 25px;
    color: #333333;
    letter-spacing: 0;
    border-radius: 2px;
    height: 100px;
  }
  pre{
    margin: 0px 0px;
    white-space:pre-wrap;
    white-space:-moz-pre-wrap;
    white-space:-o-pre-wrap;
    word-wrap:break-word;
  }
  /deep/ .el-form-item__label {
    color: #333333;
  }
  /deep/.el-form-item__content {
    line-height: 25px;
    color: #333;
    padding-top: 9px;
  }
}
</style>
