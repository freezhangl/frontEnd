<template>
  <div id="yyright__topbox">
    <div class="title__box">
      <img class="title__left" src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/titlt_left.png" alt="" />
      发电监测
      <img class="title__right" src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/title_right.png" alt="" />
    </div>
    <div class="tab__box">
      <div class="day__box" @click="changeTab('日')">
        <p :class="['tab__text', rightTopActiveName == '日' ? 'active' : '']">日</p>
        <p class="border" :style="{ opacity: rightTopActiveName == '日' ? 1 : 0 }"></p>
      </div>
      <div class="month__box" @click="changeTab('月')">
        <p :class="['tab__text', rightTopActiveName == '月' ? 'active' : '']">月</p>
        <p class="border" :style="{ opacity: rightTopActiveName == '月' ? 1 : 0 }"></p>
      </div>
      <!-- <div class="ji__box" @click="changeTab('季')">
        <p :class="['tab__text', rightTopActiveName == '季' ? 'active' : '']">季</p>
        <p class="border" :style="{ opacity: rightTopActiveName == '季' ? 1 : 0 }"></p>
      </div> -->
      <div class="year__box" @click="changeTab('年')">
        <p :class="['tab__text', rightTopActiveName == '年' ? 'active' : '']">年</p>
        <p class="border" :style="{ opacity: rightTopActiveName == '年' ? 1 : 0 }"></p>
      </div>
      <div class="year__box" @click="changeTab('累计')">
        <p :class="['tab__text', rightTopActiveName == '累计' ? 'active' : '']">累计</p>
        <p class="border" :style="{ opacity: rightTopActiveName == '累计' ? 1 : 0 }"></p>
      </div>
    </div>
    <div class="chart__box">
      <yyRightTopChart :rightTopInfo="rightTopInfo" />
    </div>
  </div>
</template>

<script>
import yyRightTopChart from './echart/yyRightTopChart'
export default {
  props: {
    rightTopActiveName: {
      type: String,
      default: ''
    },
    rightTopInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chartsType: 'gonglv'
    }
  },
  components: {
    yyRightTopChart
  },
  mounted() {},
  methods: {
    changeTab(val) {
      this.$emit('changeTab', val)
    }
  }
}
</script>

<style lang="less" scoped>
#yyright__topbox {
  width: 100%;
  height: 310px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(26, 102, 255, 1);
  box-shadow: inset 0 0 43px 0 rgba(2, 64, 255, 0.7);
  box-sizing: border-box;
  .tab__box {
    display: flex;
    justify-content: flex-start;
    padding-top: 10px;
    padding-left: 18px;

    // .month__box,
    // .ji__box,
    // .year__box {
    //   .border {
    //     opacity: 0;
    //   }
    // }

    div {
      cursor: pointer;

      .tab__text {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: normal;
        color: rgba(206, 212, 242, 1);
        line-height: 18px;

        &.active {
          color: rgba(0, 222, 255, 1);
        }
      }

      .border {
        width: 38px;
        height: 2px;
        background: linear-gradient(116.57deg, rgba(26, 217, 255, 1) 0%, rgba(26, 217, 255, 0) 100%);
        margin-top: 5px;
      }
    }
  }
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
  .chart__box {
    width: 100%;
    height: calc(100% - 101px);
  }
}
</style>
