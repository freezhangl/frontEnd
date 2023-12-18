<template>
  <div id="yycenter__bottombox">
    <div class="title__box">
      <img class="title__left" src="http://116.198.18.192/gfkj-files/imgs/jby/screen/titlt_left.png" alt="" />
      光伏功率
      <img class="title__right" src="http://116.198.18.192/gfkj-files/imgs/jby/screen/title_right.png" alt="" />
      <div class="right__text">
        <p><span class="bg__blue"></span>实发功率( {{ centerBottomInfo.unit }})</p>
        <!-- <p><span class="bg__lightblue"></span>光照强度(W/m³)</p> -->
      </div>
    </div>
    <div class="chart__box">
      <yyCenterBottomChart :centerBottomInfo="centerBottomInfo" />
    </div>
  </div>
</template>

<script>
import yyCenterBottomChart from './echart/yyCenterBottomChart'
export default {
  props: {
    centerBottomInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  components: {
    yyCenterBottomChart
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
#yycenter__bottombox {
  width: 100%;
  height: 310px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(26, 102, 255, 1);
  box-shadow: inset 0 0 43px 0 rgba(2, 64, 255, 0.7);
  // margin-top: 10px;
  .title__box {
    width: 100%;
    height: 42px;
    background: linear-gradient(270deg, rgba(26, 102, 255, 0) 0%, rgba(26, 102, 255, 0) 77%, rgba(0, 56, 255, 1) 100%);
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
    position: relative;
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
    .right__text {
      position: absolute;
      right: 30px;
      display: flex;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: normal;
      color: rgba(180, 211, 255, 1);
      line-height: 18px;
      text-shadow: none;
      p {
        display: flex;
        align-items: center;
        span {
          width: 13px;
          height: 13px;
          margin-right: 5px;
        }
        .bg__blue {
          background: rgba(25, 102, 255, 1);
        }
        .bg__lightblue {
          background: rgba(25, 217, 255, 1);
          margin-left: 26px;
        }
      }
    }
  }
  .chart__box {
    width: 100%;
    height: 268px;
  }
}
</style>
