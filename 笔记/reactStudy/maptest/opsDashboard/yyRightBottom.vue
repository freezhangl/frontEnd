<template>
  <div id="yyright__bottom">
    <div class="title__box">
      <img class="title__left" src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/titlt_left.png" alt="" />
      工单监测
      <img class="title__right" src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/title_right.png" alt="" />
    </div>
    <div class="tab__box">
      <div class="day__box" @click="changeTab('日')">
        <p :class="['tab__text', rightBottomActiveName == '日' ? 'active' : '']">日</p>
        <p class="border" :style="{ opacity: rightBottomActiveName == '日' ? 1 : 0 }"></p>
      </div>
      <div class="month__box" @click="changeTab('月')">
        <p :class="['tab__text', rightBottomActiveName == '月' ? 'active' : '']">月</p>
        <p class="border" :style="{ opacity: rightBottomActiveName == '月' ? 1 : 0 }"></p>
      </div>
      <div class="ji__box" @click="changeTab('季')">
        <p :class="['tab__text', rightBottomActiveName == '季' ? 'active' : '']">季</p>
        <p class="border" :style="{ opacity: rightBottomActiveName == '季' ? 1 : 0 }"></p>
      </div>
      <div class="year__box" @click="changeTab('年')">
        <p :class="['tab__text', rightBottomActiveName == '年' ? 'active' : '']">年</p>
        <p class="border" :style="{ opacity: rightBottomActiveName == '年' ? 1 : 0 }"></p>
      </div>
    </div>
    <ul class="con__box">
      <li class="con__list" v-for="(item, index) in dataList" :key="index">
        <div class="icon__box">
          <img :src="item.iconUrl" alt="" />
          <p>{{ item.text }}</p>
        </div>
        <p class="border"></p>
        <div class="num__box">
          <div class="all__box">
            <p class="num">{{ item.totalOrderNum }}<span>个</span></p>
            <p class="dec">总工单</p>
          </div>
          <div class="incomplete__box">
            <p class="num">{{ item.finishOrderNum }}<span>个</span></p>
            <p class="dec">已完成</p>
          </div>
          <div class="time__box">
            <p class="num">{{ item.avgResponseHours }}<span>小时</span></p>
            <p class="dec">平均响应时效</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    rightBottomActiveName: {
      type: String,
      default: ''
    },
    rightBottomInfo: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    rightBottomInfo: {
      handler(val) {
        this.dataList = val
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      dataList: [],
      // dataList: [
      //   {
      //     iconUrl: 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/icon_xunjian.png',
      //     text: '计划巡检',
      //     all: 100,
      //     incomplete: 10,
      //     time: 6.5
      //   },
      //   {
      //     iconUrl: 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/icon_jianxiu.png',
      //     text: '故障检修',
      //     all: 67,
      //     incomplete: 26,
      //     time: 6.5
      //   },
      //   {
      //     iconUrl: 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/icon_renwu.png',
      //     text: '临时任务',
      //     all: 24,
      //     incomplete: 3,
      //     time: 6.5
      //   }
      // ],
      currentDayTime: [],
      currentMonthTime: [],
      currentQuteTime: [],
      currentYearTime: []
    }
  },
  components: {},
  mounted() {
    // this.getNowTime()
  },
  methods: {
    changeTab(val) {
      this.$emit('changeTab', val)
    },
    getNowTime() {
      const currentDayTime = [
        moment(new Date(new Date().setHours(0, 0, 0, 0)).getTime()).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date(new Date().setHours(23, 59, 59, 999)).getTime()).format('YYYY-MM-DD HH:mm:ss')
      ]
      const currentMonthTime = [
        moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).getTime()).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      ]
      const currentQuteTime = this.HXtimeSlotChange('本季度')
      const currentYearTime = this.HXtimeSlotChange('本年')
      // console.log(currentDayTime, currentMonthTime, currentQuteTime, currentYearTime, '当天月的开始时间和结束时间戳')
      this.currentDayTime = currentDayTime
      this.currentMonthTime = currentMonthTime
      this.currentQuteTime = currentQuteTime
      this.currentYearTime = currentYearTime
    },
    HXtimeSlotChange(val) {
      let startTime, endTime
      const now = new Date() // 当前日期
      var nowDayOfWeek = now.getDay() // 今天本周的第几天
      var nowDay = now.getDate() // 当前日
      const nowMonth = now.getMonth() // 当前月
      const nowYear = now.getFullYear() // 当前年
      const jd = Math.ceil((nowMonth + 1) / 3)
      switch (val) {
        case '本周':
          startTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
          endTime = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
          break
        case '本月':
          startTime = new Date(nowYear, nowMonth, 1).getTime()
          endTime = new Date(nowYear, nowMonth + 1, 0).getTime()
          break
        case '本季度':
          startTime = new Date(nowYear, (jd - 1) * 3, 1).getTime()
          endTime = new Date(nowYear, jd * 3, 0).getTime()
          break
        case '本年':
          startTime = moment(new Date(nowYear, 0, 1).getTime()).format('YYYY-MM-DD HH:mm:ss')
          endTime = moment(new Date(nowYear + '-12' + '-31' + ' ' + '23:59:59').getTime()).format('YYYY-MM-DD HH:mm:ss')
          break
      }
      return [startTime, endTime]
      // 格式化日期：yyyy-MM-dd
      // console.log(formatDate(startTime), formatDate(endTime))
    },
    formatDate(date) {
      var myyear = date.getFullYear()
      var mymonth = date.getMonth() + 1
      var myweekday = date.getDate()
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      return myyear + '-' + mymonth + '-' + myweekday
    }
  }
}
</script>

<style lang="less" scoped>
#yyright__bottom {
  width: 100%;
  height: 380px;
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

  .con__box {
    width: 460px;
    margin: 0 auto;
    margin-top: 16px;

    .con__list {
      width: 100%;
      height: 84px;
      background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/gongdan_bg.png) 0 0 no-repeat;
      background-size: 100% 100%;
      margin-top: 9px;
      display: flex;
      align-items: center;
      padding-left: 26px;
      box-sizing: border-box;

      .icon__box {
        text-align: center;

        img {
          width: 44px;
          height: 44px;
        }

        p {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: normal;
          color: rgba(104, 163, 246, 1);
          line-height: 16px;
        }
      }

      .border {
        width: 1px;
        height: 63px;
        background-color: rgba(63, 99, 141, 1);
        margin: 0 39px 0 27px;
      }

      .num__box {
        display: flex;
        justify-self: space-around;
        flex: 1;

        .all__box,
        .incomplete__box,
        .time__box {
          flex: 1;

          .num {
            font-size: 32px;
            font-family: DINCond;
            font-weight: bold;
            color: rgba(25, 217, 255, 1);
            line-height: 46px;

            span {
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: normal;
              color: rgba(0, 220, 255, 1);
              line-height: 18px;
            }
          }

          .dec {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: normal;
            color: rgba(180, 211, 255, 1);
            line-height: 18px;
          }
        }

        .incomplete__box {
          .num {
            color: rgba(230, 175, 74, 1);

            span {
              color: rgba(230, 175, 74, 1);
            }
          }
        }
        .time__box {
          min-width: 84px;
        }
      }
    }
  }
}
</style>
