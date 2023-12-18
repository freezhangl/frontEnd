<template>
  <div id="yyleft__top">
    <div class="title__box">
      <img class="title__left" src="http://116.198.18.192/gfkj-files/imgs/jby/screen/titlt_left.png" alt="" />
      社会效益
      <img class="title__right" src="http://116.198.18.192/gfkj-files/imgs/jby/screen/title_right.png" alt="" />
    </div>
    <div class="num__box">
      <div class="co__two">
        <!-- <span class="num">210,000</span> -->
        <span class="num">{{ tousandWithNumber(rightCenterInfo.reduceCarbon) }}</span>
        <span class="text">tCO₂e</span>
      </div>
      <div class="tec">
        <span class="num">{{ tousandWithNumber(rightCenterInfo.saveCoal) }}</span>
        <span class="text">tce</span>
      </div>
      <div class="mu">
        <span class="num">{{ tousandWithNumber(rightCenterInfo.reduceCut) }}</span>
        <span class="text">亩</span>
      </div>
    </div>
    <div class="text__box">
      <p>碳减排量</p>
      <p>节约标煤</p>
      <p>减少森林砍伐</p>
    </div>
    <img class="icon__bg" src="http://116.198.18.192/gfkj-files/imgs/jby/screen/ME1680747450458.png" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    rightCenterInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      config: {
        number: [331445],
        content: '{nt}t',
        style: {
          fontSize: 23,
          fill: '#3de7c9'
        }
      },
      config1: {
        number: [106381],
        content: '{nt}t',
        style: {
          fontSize: 23,
          fill: '#3de7c9'
        }
      },
      config2: {
        number: [10000],
        content: '{nt}亩',
        style: {
          fontSize: 23,
          fill: '#3de7c9'
        }
      }
    }
  },
  components: {},
  mounted() {},
  methods: {
    tousandWithNumber(num) {
      let str = num
      if (str == null || str === undefined) {
        str = ''
      }
      if (/^(\\-|\+)?\d+(\.\d+)?$/.test(str)) {
        str = str.toString()
        const strList = str.split('.')
        if (strList.length === 2) {
          let str1 = Number(strList[0])
          str1 = str1.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
          str = str1 + '.' + strList[1]
        } else {
          str = Number(num)
          str = str.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
        }
      } else {
        str = num
      }
      return str
    }
  }
}
</script>

<style lang="less" scoped>
#yyleft__top {
  width: 100%;
  height: 270px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(26, 102, 255, 1);
  box-shadow: inset 0 0 43px 0 rgba(2, 64, 255, 0.7);
  margin-top: 10px;
  text-align: center;
  box-sizing: border-box;

  .title__box {
    width: 211px;
    height: 42px;
    background: linear-gradient(270deg, rgba(26, 102, 255, 0) 0%, rgba(0, 56, 255, 1) 100%);
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

  .num__box {
    display: flex;
    margin: 20px 0 0 0px;

    .co__two,
    .tec,
    .mu {
      flex: 1;
      text-align: center;
      width: 33.3%;
      padding: 0 5px;
      .num {
        font-size: 34px;
        font-family: DINCond;
        font-weight: bold;
        color: rgba(25, 217, 255, 1);
        line-height: 46px;
        word-wrap: break-word !important;
        word-break: normal !important;
        white-space: pre-wrap !important;
      }
      .text {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: normal;
        color: rgba(0, 220, 255, 1);
        line-height: 18px;
        margin-left: 4px;
      }
    }
  }
  .tec {
    // margin: 0 40px 0 20px;
  }
  .text__box {
    display: flex;
    // margin-left: 40px;
    p {
      text-align: center;
      flex: 1;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: normal;
      color: rgba(180, 211, 255, 1);
      line-height: 18px;
    }
  }
  .icon__bg {
    margin-top: 20px;
  }
}
</style>
