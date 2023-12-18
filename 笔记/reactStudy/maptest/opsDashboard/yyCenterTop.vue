<template>
  <div id="yycenter__topbox">
    <div class="con__top">
      <div class="today__title">
        <img
          class="today__icon"
          src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/today_power.png"
          alt=""
        />
        <p>当日发电</p>
        <img
          class="today__border"
          src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/todar_border.png"
          alt=""
        />
      </div>
      <div class="today__num">
        <countTo :textNumber="centerTopInfo.dayEnergy" :unit="centerTopInfo.dayEnergyUnit" />
        <div class="statistics">
          <div class="statistics__inner">
            <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/year_all.png" alt="" />
            <p class="text__box">年发电量</p>
            <p class="text__num">
              {{ centerTopInfo.yearEnergy }}<span>{{ centerTopInfo.yearEnergyUnit }}</span>
            </p>
          </div>
          <div class="statistics__inner hour">
            <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/year_hour.png" alt="" />
            <p class="text__box">年发电小时数</p>
            <p class="text__num">
              {{ centerTopInfo.yearEnergyHours }}<span>h</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="con__bottom">
      <yyCenterTop :regionGeoJson="regionGeoJson" @updateEchartsInfo="updateEchartsInfo" />
    </div>
  </div>
</template>

<script>
import yyCenterTop from './echart/yyCenterTop'
import countTo from '@/components/countTo'
export default {
  props: {
    regionGeoJson: {
      type: Object,
      default: () => {}
    },
    centerTopInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      textNumber: 0,
      yearAll: 0,
      yearHour: 0
    }
  },
  components: {
    yyCenterTop,
    countTo
  },
  watch: {
    centerTopInfo: {
      handler: function(newval, oldval) {
        // if (newval) {
        //   this.textNumber = newval.dayEnergy
        //   this.yearAll = newval.yearEnergy
        //   this.yearHour = newval.yearEnergyHours
        // }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    updateEchartsInfo(params) {
      this.$emit('updateEchartsInfo', params)
    }
  }
}
</script>

<style lang="less" scoped>
#yycenter__topbox {
  flex: 1;
  display: flex;
  flex-direction: column;
  .con__top {
    padding-bottom: 10px;
    margin-left: 60px;
    // margin-top: 12px;
    // height: 100px;
    .today__title {
      display: flex;
      align-items: center;
      .today__icon {
        width: 24px;
        height: 24px;
      }
      p {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        text-shadow: 0 0 4px rgba(38, 217, 255, 1);
        line-height: 22px;
        color: rgba(38, 217, 255, 1);
        margin: 0 10px 0 14px;
      }
      .today__border {
        width: 681px;
        height: 14px;
      }
    }
    .today__num {
      margin-top: 13px;
      display: flex;
      .statistics {
        margin-left: 15px;
        .statistics__inner {
          width: 250px;
          height: 38px;
          background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/year_bg.png) 0 0 no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          &.hour {
            margin-top: 5px;
          }
          img {
            width: 24px;
            height: 24px;
            margin-left: 14px;
            margin-right: 7px;
          }
          .text__box {
            width: 93px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(180, 211, 255, 1);
            line-height: 38px;
          }
          .text__num {
            font-size: 28px;
            font-family: DINCond;
            font-weight: bold;
            line-height: 38px;
            background-image: -webkit-linear-gradient(bottom, rgba(0, 220, 255, 1), rgba(238, 238, 238, 1));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            span {
              font-size: 16px;
              font-family: DINCond;
              font-weight: bold;
              color: rgba(25, 217, 255, 1);
              margin-left: 5px;
              background-image: -webkit-linear-gradient(bottom, rgba(0, 220, 255, 1), rgba(238, 238, 238, 1));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }
      }
    }
  }
  .con__bottom {
    width: 741px;
    // height: calc(418px + 34px);
    flex: 1;
    margin: 0 auto;
    // margin-top: 35px;
    // transform: rotateX(-40deg) scale(1.4);
    // transform: scale(0.5);
  }
}
</style>
