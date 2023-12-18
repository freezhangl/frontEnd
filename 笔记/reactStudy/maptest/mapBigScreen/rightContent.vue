<template>
  <div class="mapscreen__rignt">
    <div class="mapscreen__rignt-one">
      <div class="con__title">
        <p class="border border1"></p>
        <p>电站统计</p>
      </div>
      <div class="content__box">
        <div class="text__station">
          <p>
            总电站数<span class="num">{{ rightTopInfo.stationNum }} </span>个
          </p>
          <p>
            电站总容量<span class="num">{{ rightTopInfo.totalCapacity }}</span
            >WMp
          </p>
        </div>
        <div class="text__power">
          累计发电量<span class="num">{{ rightTopInfo.totalEnergy }}</span
          ><span class="unit">万度</span>
        </div>
        <div class="power__imgbox">
          <div class="info__box">
            <div class="info info1">
              <p>{{ rightTopInfo.actualPower }} MW</p>
              <p></p>
              <!-- <p>{{ rightTopInfo.sfp }}%</p> -->
            </div>
            <div class="title">实发功率</div>
          </div>
          <div class="info__box">
            <div class="info info2">
              <p>{{ rightTopInfo.dayEnergy }} 万度</p>
              <p>{{ rightTopInfo.dayEnergyHours }}h</p>
            </div>
            <div class="title">今日发电</div>
          </div>
          <div class="info__box">
            <div class="info info3">
              <p>{{ rightTopInfo.yearEnergy }} 万度</p>
              <p>{{ rightTopInfo.yearEnergyHours }}h</p>
            </div>
            <div class="title">本年度发电</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mapscreen__rignt-two">
      <div class="con__title" style="margin-right: 10px;">
        <p class="border border2"></p>
        <p>电站统计</p>
      </div>
      <div class="content__box">
        <p class="sf"><span class="bg__blue"></span>实发功率({{ rightCenterInfo.unit }})</p>
        <RigntThree :rightCenterInfo="rightCenterInfo" />
      </div>
    </div>
    <div class="mapscreen__rignt-three">
      <div class="con__title">
        <p class="border border3"></p>
        <p>电站统计</p>
      </div>
      <div class="content__box">
        <p class="sf"><span class="bg__blue"></span>最近7天发电量({{ rightCenterInfoNew.unit }})</p>
        <rightThreeNew :rightCenterInfoNew="rightCenterInfoNew" />
      </div>
    </div>
    <div class="mapscreen__rignt-four">
      <div class="reduction">
        <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screenmap/co2.png" alt="" />
        <div class="info">
          <p class="desc">累计减排CO₂</p>
          <p>
            <span class="num">{{ rightTopInfo.reduceCarbon }}</span
            ><span class="unit">吨</span>
          </p>
        </div>
      </div>
      <div class="tree__planting">
        <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screenmap/tree.png" alt="" />
        <div class="info">
          <p class="desc">减少森林砍伐</p>
          <p>
            <span class="num">{{ rightTopInfo.reduceCut }}</span
            ><span class="unit">亩</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RigntThree from './echart/rightThree'
import rightThreeNew from './echart/rightThreeNew'
export default {
  props: {
    rightCenterInfoNew: {
      type: Object,
      default: () => {}
    },
    rightCenterInfo: {
      type: Object,
      default: () => {}
    },
    rightTopInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    RigntThree,
    rightThreeNew
  },
  data() {
    return {}
  }
}
</script>
<style lang="less" scoped>
.mapscreen__rignt {
  height: 90%;
  width: 540px;
  background: transparent;
  position: absolute;
  right: 0;
  top: 6%;

  .mapscreen__rignt-one,
  .mapscreen__rignt-two,
  .mapscreen__rignt-three,
  .mapscreen__rignt-four {
    margin-top: 20px;
    padding: 20px 40px 20px 8px;
    box-sizing: border-box;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border-radius: 4px;
    display: flex;

    .con__title {
      width: 20px;
      text-align: center;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;

      .border {
        width: 20px;
        height: 4px;
        background: rgba(14, 213, 125, 1);
        margin-bottom: 8px;
      }
      .border1 {
        background: rgba(14, 213, 125, 1);
      }
      .border2 {
        background: rgba(25, 217, 255, 1);
      }
      .border3 {
        background: rgba(255, 156, 0, 1);
      }
    }

    .content__box {
      flex: 1;
      .sf {
        display: flex;
        align-items: center;
        display: flex;
        justify-content: flex-end;
        span {
          width: 18px;
          height: 6px;
          margin-right: 5px;
        }
        .bg__blue {
          background: rgba(25, 217, 255, 1);
        }
        .bg__lightblue {
          background: rgba(25, 217, 255, 1);
          margin-left: 26px;
        }
      }
    }
  }

  .mapscreen__rignt-one {
    .text__station {
      display: flex;
      justify-content: center;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);

      & p:first-child {
        margin-right: 21px;
      }

      .num {
        font-size: 30px;
        font-family: DINCond;
        font-weight: bold;
        margin: 0 8px;
      }
    }

    .text__power {
      text-align: center;
      margin-top: 28px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);

      .num {
        color: rgba(25, 217, 255, 1);
        font-size: 38px;
        font-family: DINCond;
        font-weight: bold;
        margin: 0 8px;
      }

      .unit {
        color: rgba(25, 217, 255, 1);
        font-family: PingFang SC;
      }
    }

    .power__imgbox {
      display: flex;
      justify-content: space-around;
      margin-top: 24px;

      .info__box {
        color: #fff;
        text-align: center;

        .info {
          width: 120px;
          height: 120px;
          padding: 40px 0;

          &.info1 {
            background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/screenmap/bg1.png) 0 0 no-repeat;
            background-size: 100% 100%;
          }

          &.info2 {
            background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/screenmap/bg2.png) 0 0 no-repeat;
            background-size: 100% 100%;
          }

          &.info3 {
            background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/screenmap/bg3.png) 0 0 no-repeat;
            background-size: 100% 100%;
          }
        }

        .title {
          margin-top: 15px;
        }
      }
    }
  }

  .mapscreen__rignt-two,
  .mapscreen__rignt-three {
    height: 250px;
  }

  .mapscreen__rignt-four {
    display: flex;
    justify-content: space-around;
    .tree__planting {
      .info {
        .num {
          color: rgba(14, 213, 125, 1) !important;
        }
        .unit {
          color: rgba(14, 213, 125, 1) !important;
        }
      }
    }
    .reduction,
    .tree__planting {
      display: flex;

      img {
        width: 87px;
        height: 72px;
      }

      .info {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        margin-left: 16px;
        .desc {
          height: 40px;
        }
        .num {
          color: rgba(25, 217, 255, 1);
          font-size: 42px;
          font-family: DINCond;
          font-weight: bold;
        }
        .unit {
          color: rgba(25, 217, 255, 1);
        }
      }
    }
  }
}
</style>
