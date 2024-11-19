<template>
  <div class="project-panel" :class="{'is-expand' : isExpand}">
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
        <el-tooltip
          :content="tipLanguage"
          placement="right"
          v-if="tips"
          popper-class="prompt-box1">
          <i class="el-icon-info accountingNo"></i>
        </el-tooltip>
      </div>
      <div class="header-tip">
        <el-tooltip
          :disabled='tip.length+title.length<40'
          :content="tip"
          effect="dark"
          placement="top">
          <span class="tooltip-span"><i v-if="tipIcon" class="el-icon-info"></i> {{tip}}</span>
        </el-tooltip>
      </div>
      <div style="display:flex">
        <slot name="header"></slot>
      </div>
      <div class="expand" v-if="showExpand">
        <el-button class="normal-btn" @click="changeExpand"> {{isExpand ? '收起' : '展开'}}<i class= "el-icon--right" :class="{ 'el-icon-arrow-left' : isExpand , 'el-icon-arrow-down' : !isExpand}"></i></el-button>
      </div>
    </header>
    <div class="panel-body" :class="{'is-expand' : isExpand}" v-show="isExpand">
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
    tipLanguage: {
      type: String,
      default: ''
    },
    tips: {
      type: Boolean,
      default: false
    },
    showExpand: {
      type: Boolean,
      default: true
    },
    expandProp: {
      type: Boolean,
      default: true
    },
    //是否显示提示前的图标
    tipIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isExpand: true
    }
  },
  watch: {
    expandProp: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.isExpand = val
      }
    }
  },
  components: {},
  computed: {},
  methods: {
    changeExpand () {
      this.isExpand = !this.isExpand
      this.$emit('changeExpand', this.isExpand)
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style  lang="scss" scoped>
.project-panel{
  background: #fff;
  margin-bottom: 30px;
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
      max-width: 640px;
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
    // overflow: hidden;
    overflow: inherit;
    height: 0;

    &.is-expand{
      // padding : 20px 30px;
      padding : 10px 20px;
      height: auto;
    }
  }
  .accountingNo{
    margin-left: 5px;
    margin-top: 4px;
    @include color();
  }
}
</style>
<style lang="css"> .prompt-box1{ max-width:55% } </style>
