<template>
  <div id="projectLife" class="projectLife">
    <router-view></router-view>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.projectLife {
  /deep/ .el-form::after{
    display:block;
    clear:both;
    content:"";
    visibility: hidden;
    height:0;
  }
    /deep/ .el-form-item {
      display: inline-block;
      margin-bottom: 0px ;

      .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
      .el-input__icon {
        height: 28px;
        line-height: 28px;
      }
    }

}
</style>
