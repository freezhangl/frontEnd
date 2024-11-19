<template>
  <div class="content">
    <tab-component></tab-component>
  </div>
</template>

<script>
import tabComponent from './tabComponent'
export default {
  name: 'groupDemandUnitProject',
  components: { tabComponent }
}
</script>

<style lang="scss" scoped>
  .content{
    .search-content {
      background: #fff;
      padding: 20px 30px 10px 30px;
      margin-bottom: 10px;
      /deep/ .el-form-item .el-input__inner{
      width: 220px;
      max-width: 220px;
      }
      .form-button {
        float: right;
        padding-top: 5px;
        .primary-button {
          height: 30px;
        }
        .reset-button {
          height: 30px;
          color: #0B82FF;
          border: 1px solid rgba(11,130,255,0.50);
        }
      }
    }
    .main-warpper{
      background: white;
      padding: 20px 30px 30px;
      .main-header{
        margin-bottom: 20px;
        overflow: hidden;
        float: right;
      }
      /deep/ .hover{
      &:hover{
         color: #0b82ff
       }
      cursor: pointer
      }
    }
  }
</style>
