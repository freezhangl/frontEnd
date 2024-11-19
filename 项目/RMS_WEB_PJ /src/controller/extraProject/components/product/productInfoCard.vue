<template>
  <div class="productInfo-card" >
    <div v-if="tableData.length">
      <el-card
        v-for="(item, index) in tableData"
        :key="index"
        class="box-card"
        :class="{'highlight-border':item.highlightProp}">
        <div slot="header" class="clearfix">
          <el-tooltip
            :disabled="!showToolTip(item.productLineName)"
            :content="item.productLineName"
            placement="top">
            <span class="card-title" :class="{'highlightStyle':item.highlightProps && item.highlightProps.productLineName}">
              {{ item.productLineName }}
            </span>
          </el-tooltip>
          <span>
            <span
              v-if="!meberEditFlag"
              class="svgfont-btn-edit normal-icon"
              @click="editProductInfo(item)"
            ></span>
            <span
              v-if="!meberEditFlag"
              class="el-icon-delete delete-icon"
              @click="delProductInfo(item)"
            ></span>
          </span>
        </div>
        <div class="card">
          <el-scrollbar>
            <div>
              <div class="item">
                <span>产品树年份：</span>
                <span :class="{'highlightStyle':item.highlightProps && item.highlightProps.timeYear}">{{ item.timeYear }}</span>
              </div>
              <div class="item">
                <span>产品名称：</span>
                <span :class="{'highlightStyle':item.highlightProps && item.highlightProps.productName}">{{ item.productName }}</span>
              </div>
              <div class="item">
                <span>子产品名称：</span>
                <span :class="{'highlightStyle':item.highlightProps && item.highlightProps.subProductName}">{{ item.subProductName }}</span>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-card>
    </div>
    <div v-else style="text-align: center; color: #999;">暂无数据</div>
  </div>
</template>

<script>
import { isShowToolTip } from '@/common/common'
export default {
  data () {
    return {

    }
  },
  props: {
    tableData: { type: Array, default: () => [] },
    meberEditFlag: { type: Boolean, default: false }
  },
  methods: {
    // 是否溢出
    showToolTip (name) {
      return isShowToolTip(name, 200)
    },
    editProductInfo (row) {
      this.$emit('editProductInfo', row)
    },
    delProductInfo (row) {
      this.$emit('delProductInfo', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.productInfo-card{
  max-height: 600px;
  overflow-x: hidden;
  .box-card {
    display: inline-block;
    width: 300px;
    height: 175px;
    margin: 10px;
    /deep/ .el-card__header{
      padding: 10px 30px;
    }
    /deep/ .el-card__body{
      padding: 20px 30px;
    }
    .clearfix {
      display: flex;
      justify-content : space-between;
      .card-title {
        cursor: pointer;
        display: inline-block;
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .normal-icon {
        @include color();
        position: relative;
        top: 4px;
        cursor: pointer;
        margin-right: 10px;
      }
      .delete-icon {
        color: red;
        cursor: pointer;
      }
    }
    .card {
      cursor: pointer;
      height: 92px;
      .el-scrollbar {
        height: 100%;
        /deep/.el-scrollbar__wrap{
          overflow-x: hidden;
        }
        .item {
          margin-bottom: 10px;
        }
      }
    }
  }

  .highlightStyle{
    color: #FF3F3B;
  }
  .highlight-border{
    border-color: #FF3F3B;
  }
}
</style>
