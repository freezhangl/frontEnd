<template>
  <div class="project-panel">
    <header class="panel-header">
      <slot name="img"></slot>
      <div class="header-title">
        <el-tooltip
          :disabled='title.length<30'
          :content="title"
          effect="dark"
          placement="top">
          <span class="tooltip-span">{{title}}</span>
        </el-tooltip>
      </div>
      <div class="header-tip">
        <el-tooltip
          :disabled='tip.length+title.length<40'
          :content="tip"
          effect="dark"
          placement="top">
          <span class="tooltip-span">{{tip}}</span>
        </el-tooltip>
      </div>
      <div style="display:flex">
        <slot name="header"></slot>
      </div>
      <div class="expand" v-if="showExpand">
        <el-button class="normal-btn" @click="isExpand = !isExpand"> {{isExpand ? '收起' : '展开'}}<i class= "el-icon--right" :class="{ 'el-icon-arrow-left' : isExpand , 'el-icon-arrow-down' : !isExpand}"></i></el-button>
      </div>
    </header>
    <div class="panel-body" :class="{'is-expand' : isExpand}">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    tip: {
      type: String,
      default: ''
    },
    showExpand: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isExpand: true
    }
  },
  components: {},
  computed: {},
  methods: {
  },
  created () {
  }
}
</script>
<style  lang="scss" scoped>
.project-panel{
  background: #fff;

  .panel-header{
    box-sizing: border-box;
    display: flex;
    height: 50px;
    align-items: center;
    padding: 0 30px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: 1px solid #f6f6f6;

    .header-title{

      font-size: 16px;
      color: #333333;
      text-align: left;
      font-weight: bold;
      display: flex;
      overflow: hidden;
      .tooltip-span{
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .header-tip{
      margin-left: 20px;
      flex : auto;

      font-size: 14px;
      color: #333333;
      text-align: left;
      display: flex;
      overflow: hidden;
      .tooltip-span{
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-button{
      margin-left: 10px;
    }
  }

  .panel-body{
    box-sizing: border-box;
    overflow: hidden;
    height: 0;
    margin-bottom: 30px;

    &.is-expand{
      padding : 20px 30px;
      height: auto;
    }
  }
}
</style>
