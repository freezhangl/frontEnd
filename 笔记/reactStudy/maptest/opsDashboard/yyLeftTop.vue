<template>
  <div id="yyleft__top">
    <div class="title__box">
      <img class="title__left" src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/titlt_left.png" alt="" />
      项目范围
      <img class="title__right" src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/title_right.png" alt="" />
    </div>
    <div class="info__text">
      <div class="mw__box">
        <p>{{ leftTopInfo.capacity }}</p>
        <p>总装机量(MW)</p>
      </div>
      <div class="county__box">
        <div class="topInfo">
          <div class="con">
            <!-- <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/qu_img.png" alt="" /> -->
            <div class="info">
              <p class="num">{{ leftTopInfo.provinceCount }}</p>
              <p class="num__des">省</p>
            </div>
          </div>
          <div class="con">
            <!-- <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/qu_img.png" alt="" /> -->
            <div class="info">
              <p class="num">{{ leftTopInfo.cityCount }}</p>
              <p class="num__des">市</p>
            </div>
          </div>
          <div class="con">
            <!-- <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/qu_img.png" alt="" /> -->
            <div class="info">
              <p class="num">{{ leftTopInfo.countyCount }}</p>
              <p class="num__des">区县</p>
            </div>
          </div>
        </div>
        <div class="bottominfo">
          <div class="con">
            <!-- <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/cun_img.png" alt="" /> -->
            <div class="info">
              <p class="num">{{ leftTopInfo.townCount }}</p>
              <p class="num__des">乡镇</p>
            </div>
          </div>
          <div class="con">
            <!-- <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/hu_img.png" alt="" /> -->
            <div class="info">
              <p class="num">{{ leftTopInfo.houseCount }}</p>
              <p class="num__des">户</p>
            </div>
          </div>
          <div class="con"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leftTopInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      config: {
        number: [15],
        content: '{nt}',
        style: {
          fontSize: 23,
          fill: '#3de7c9'
        }
      },
      config1: {
        number: [272.51],
        content: '{nt}MW',
        toFixed: 2,
        style: {
          fontSize: 23,
          fill: '#3de7c9'
        }
      },
      config2: {
        number: [],
        content: '{nt}',
        style: {
          fontSize: 23,
          fill: '#3de7c9'
        }
      },
      config3: {
        number: [8582],
        content: '{nt}',
        style: {
          fontSize: 23,
          fill: '#3de7c9'
        }
      }
    }
  },
  watch: {
    leftTopInfo: {
      handler(val) {
        console.log(val, '我是左上角的数据')
      },
      immediate: true,
      deep: true
    }
  },
  components: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
#yyleft__top {
  width: 100%;
  height: 310px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(26, 102, 255, 1);
  box-shadow: inset 0 0 43px 0 rgba(2, 64, 255, 0.7);
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
  .info__text {
    display: flex;
    margin-top: 22px;
    padding-left: 15px;
    box-sizing: border-box;
    .mw__box {
      width: 220px;
      height: 220px;
      background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/mw_bg.png) 0 0 no-repeat;
      background-size: 100% 100%;
      text-align: center;
      & p:nth-child(1) {
        font-size: 40px;
        font-family: DINCond;
        font-weight: bold;
        color: rgba(25, 217, 255, 1);
        line-height: 46px;
        margin-top: 72px;
      }
      & p:nth-child(2) {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: normal;
        color: rgba(180, 211, 255, 1);
        line-height: 18px;
      }
    }
    .county__box {
      flex: 1;
      padding: 20px;
      padding-right: 10px;
      box-sizing: border-box;
      img {
        width: 62px;
        height: 67px;
        margin-right: 22px;
      }
      .topInfo {
        justify-content: space-between;
        // align-items: space-between;
        display: flex;
        margin-bottom: 5px;
      }
      .bottominfo {
        justify-content: space-between;

        // align-items: flex-start;
        display: flex;
      }
      .con {
        flex:1;
        display: flex;
        margin-bottom: 8px;
        // flex-wrap: wrap;
        .info {
          .num {
            height: 46px;
            line-height: 46px;
            font-size: 36px;
            font-family: DINCond;
            font-weight: bold;
            color: rgba(25, 217, 255, 1);
          }
          .num__des {
            line-height: 20px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: normal;
            color: rgba(180, 211, 255, 1);
          }
        }
      }
    }
  }
}
</style>
