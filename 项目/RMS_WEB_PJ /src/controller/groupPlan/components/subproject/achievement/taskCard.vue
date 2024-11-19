<template>
  <div class="card-box">
    <el-card v-for="(item, index) in tableData" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <el-tooltip
          :disabled="!showToolTip(item.taskName)"
          :content="item.achievementName"
          placement="top">
          <span class="card-title" @click="handleClick(item)">
            {{ item.achievementName }}
          </span>
        </el-tooltip>
        <span>
          <span class="status" >{{undertakeProjectCodeFormatter(item.linkFlag) }}</span>
          <span>
            <span
              v-if="getmeberEditFlag()"
              class="svgfont-btn-edit normal-icon"
              @click="editAchievement(item)"
            ></span>
            <span
              v-if="getmeberEditFlag()"
              class="el-icon-delete delete-icon"
              @click="delAchievement(item)"
            ></span>
          </span>
        </span>
      </div>
      <div class="card">
        <el-scrollbar>
          <div @click="handleClick(item)">
            <div class="item">
              <span> 需求单位：</span>
              <span>{{ item.demandUnit }}</span>
            </div>
            <div class="item">
              <span>成果需求人：</span>
              <span>{{ item.demandUnitResponsibleName }}</span>
            </div>
            <div class="item">
              <span>承担单位：</span>
              <span>{{ item.undertakeUnit }}</span>
            </div>
            <div class="item">
              <span>成果负责人：</span>
              <span>{{ item.responsiblePerson }}</span>
            </div>
            <div class="item">
              <span>合作开发费(万元)：</span>
              <span>{{ item.togetherDevelopCost }}</span>
            </div>
            <div class="item">
              <span>自有人工(人月)：</span>
              <span>{{ item.staffTime }}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>
<script>
import { isShowToolTip } from '@/common/common'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    meberEditFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getmeberEditFlag () {
      return !this.meberEditFlag
    },
    undertakeProjectCodeFormatter (val) {
      if (val === '1') {
        return '已关联'
      } else if (val === '0') {
        return '未关联'
      } else {
        return ''
      }
    },
    // 是否溢出
    showToolTip (name) {
      return isShowToolTip(name, 150)
    },
    handleClick (row) {
      this.$emit('handleClick', row)
    },
    editAchievement (row) {
      this.$emit('editAchievement', row)
    },
    delAchievement (row) {
      this.$emit('delAchievement', row)
    }
  }
}
</script>
<style lang="scss" scoped>
.card-box {
  max-height: 600px;
  overflow-x: hidden;
  .box-card {
    display: inline-block;
    // width: 320px;
    width: 300px;
    height: 275px;
    margin: 10px;
    .clearfix {
      display: flex;
      justify-content : space-between;
      .card-title {
        cursor: pointer;
        display: inline-block;
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        @include color()
      }
      /deep/ .status {
        margin-right: 20px;
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
      height: 200px;
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
}
</style>
