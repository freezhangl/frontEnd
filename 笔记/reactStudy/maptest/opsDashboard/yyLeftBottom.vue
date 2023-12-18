<template>
  <div id="yyleft__bottombox">
    <div class="title__box">
      <img class="title__left" src="http://116.198.18.192/gfkj-files/imgs/jby/screen/titlt_left.png" alt="" />
      年度发电小时数排名（2023）
      <img class="title__right" src="http://116.198.18.192/gfkj-files/imgs/jby/screen/title_right.png" alt="" />
    </div>
    <yyLeftBottomChart :leftBottomInfo="leftBottomInfo" />
  </div>
</template>

<script>
import yyLeftBottomChart from './echart/yyLeftBottomChart'
export default {
  props: {
    leftBottomInfo: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      year: ''
    }
  },
  components: {
    yyLeftBottomChart
  },
  mounted() {
    this.year = new Date().getFullYear()
  },
  methods: {}
}
</script>

<style lang="less" scoped>
#yyleft__bottombox {
  width: 100%;
  height: 658px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(26, 102, 255, 1);
  box-shadow: inset 0 0 43px 0 rgba(2, 64, 255, 0.7);
  margin-top: 10px;
  .title__box {
    width: 100%;
    height: 42px;
    background: linear-gradient(270deg, rgba(26, 102, 255, 0) 0%, rgba(26, 102, 255, 0) 56%, rgba(0, 56, 255, 1) 100%);
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    text-shadow: 0 0 4px rgba(38, 217, 255, 1);
    line-height: 42px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    box-sizing: border-box;
    img {
      width: 18px;
      height: 8px;
      &.title__left {
        margin-top: 6px;
        margin-right: 6px;
      }
      &.title__right {
        margin-bottom: 6px;
        margin-left: 6px;
      }
    }
  }
}
</style>
