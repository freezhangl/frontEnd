<template>
  <div class="title__row">
    <div class="title__row-time">
      <!-- <p @click="handleChange(item)" v-for="item in cycleList" :key="item.key" :class="{'act':item.key === actKey}">{{ item.text }}</p> -->
      <a-select
        show-search
        :show-arrow="true"
        @search="handleSearch"
        allowClear
        placeholder="点击选择服务商"
        style="width: 150px"
        :disabled="ownerServiceProviderId"
        :default-active-first-option="false"
        v-model="searchObject.serviceProviderId"
        :filter-option="false"
        @change="(value) => { handleChange(value, 'serviceProviderId') }">
        <a-select-option
          :value="item.serviceProviderId"
          v-for="item in serviceProviderNameList"
          :key="item.serviceProviderId">
          {{ item.serviceProviderName }}
        </a-select-option>
      </a-select>
      <a-range-picker
        @change="(data, value) => { handleChange(value, 'datapicker') }"
        class="datapicker"
        style="width: 250px;margin-left: 10px;" />
      <span class="btn" @click="handleGetData">确定</span>
    </div>
    <div class="title__text">
      <img
        src="https://storage.360buyimg.com/gfkj-files/imgs/jby/tybigscreen/ME1693289418056.png"
        width="299"
        height="39"
        alt="">
    </div>
    <div class="title__row-weather">
      <p class="day">{{ moment(nowDateTime).format('YYYY年MM月DD日 dddd') }}</p>
      <p class="clock">{{ moment(nowDateTime).format('HH:mm:ss') }}</p>
      <div class="weather">
        <!-- <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/weather.png" width="24" height="24" alt="å"> -->
        <!-- <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/weather.png" width="24" height="24" alt="å"> -->
        <p style="margin-right:10px">{{ weatherText }}</p>
        <p>{{ tempText }}℃</p>
      </div>
      <p class="zhibiao" @click="toZhibiaoPage"><a-icon type="question-circle" /></p>
      <p @click="toScreenFull" class="screen__btn day">{{ !isFullscreen ? '全屏' : '退出全屏' }}</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getListData } from '@/api/cwApi/index'
export default {
  name: 'Header',
  props: {
    isFullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      origin: (window.location.origin.indexOf('test') > 0 || window.location.origin.indexOf('localhost') > 0) ? 'http://test-ty-gxf.jd.com' : window.location.origin,
      serviceProviderNameList: [],
      tempText: '',
      weatherText: '',
      nowDateTime: '',
      actKey: 'today',
      ownerServiceProviderId: false,
      searchObject: {
        indexQueryTimeStart: '',
        indexQueryTimeEnd: '',
        serviceProviderId: undefined
      },
      cycleList: [
        { text: '今日', key: 'today' },
        { text: '本周', key: 'week' },
        { text: '本月', key: 'month' },
        { text: '本年', key: 'year' }
      ]
    }
  },
  mounted () {
    this.getNewTime()
    this.getWeather()
    this.handleGetUserInfo()
  },
  destoyed () {
    clearTimeout(this.timer)
  },
  methods: {
    moment,
    toZhibiaoPage() {
      this.$router.push({ path: '/zhibiao_ty' })
    },
    getNewTime () {
      this.nowDateTime = new Date()
      setTimeout(() => {
        this.getNewTime()
      }, 1000)
    },
    getWeather () {
      getListData('https://devapi.qweather.com/v7/weather/now?location=101010100&key=2f2bbd767c7144dab7d10f24fba0b4e9', 'GET').then(res => {
        this.tempText = res.now.temp
        this.weatherText = res.now.text
      })
    },
    handleSearch (value) {
      getListData(`${this.origin}/admin/erp/serviceOrder/index/fuzzyQueryProvider`, 'GET', { params: { serviceProviderName: value } }).then(res => {
        if (res.code === '0000') {
          this.serviceProviderNameList = res.data
        } else {
          this.serviceProviderNameList = res.data
        }
      })
    },
    handleGetUserInfo () {
      getListData(`${this.origin}/admin/erp/user/getUserInfo`, 'GET', { params: {} }).then(res => {
        if (res.code === '0000') {
          if (res.data.serviceProviderId) {
            this.serviceProviderNameList = [{ serviceProviderId: res.data.serviceProviderId, serviceProviderName: res.data.serviceProviderName }]
            this.ownerServiceProviderId = true
            this.$set(this.searchObject, 'serviceProviderId', res.data.serviceProviderId)
          } else {
            this.$set(this.searchObject, 'serviceProviderId', undefined)
            this.handleSearch()
          }
        } else {
          this.handleSearch()
        }
        this.$emit('getData', this.searchObject)
      }).catch(() => {
        this.$emit('getData', this.searchObject)
      })
    },
    handleChange (value, key) {
      if (key === 'serviceProviderId') {
        this.searchObject[key] = value
      } else {
        if (Array.isArray(value) && value.length) {
          this.searchObject['indexQueryTimeStart'] = value[0] ? value[0] + ' 00:00:00' : ''
          this.searchObject['indexQueryTimeEnd'] = value[1] ? value[1] + ' 23:59:59' : ''
        }
      }
    },
    handleGetData () {
      this.$emit('getData', this.searchObject)
    },
    toScreenFull () {
      this.$emit('toScreenFull')
    }
  }
}
</script>
<style lang="less" scoped>
.title__row {
  height: 76px;
  width: 100%;
  background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/tybigscreen/ty_title_bg.png) 0 0 no-repeat;
  background-size: 100% 100%;
  display: flex;
  // align-items: center;
  justify-content: center;

  .title__text {
    text-align: center;
    height: 100%;
    padding-top: 15px;
    box-sizing: border-box;
    flex: 1;
  }

  .title__row-time {
    display: flex;
    justify-content: flex-start;
    padding-top: 0.5rem;
    padding-left:0.5rem;
    box-sizing: border-box;
    height: 40px;
    width: 550px;

    /deep/ .ant-select .ant-select-selection {
      background: linear-gradient(180deg, rgba(10, 42, 82, 1) 0%, rgba(53, 134, 238, 0) 100%);
      border-color: #0D3969;
      color: #fff;
    }

    .datapicker {
      background: transparent;

      /deep/ .ant-calendar-picker-input {
        background: linear-gradient(180deg, rgba(10, 42, 82, 1) 0%, rgba(53, 134, 238, 0) 100%);
        border-color: #0D3969;
        color: #fff;
      }
    }

    .btn {
      display: inline-block;
      line-height: 32px;
      cursor: pointer;
      margin-left: 10px;
    }

    p {
      width: 124px;
      height: 40px;
      background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/tybigscreen/ty_btn_bg.png) 0 0 no-repeat;
      background-size: 100% 100%;
      margin-right: -30px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: normal;
      color: rgba(180, 211, 255, 1);
      line-height: 32px;
      text-align: center;
      cursor: pointer;

      &.act {
        background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/tybigscreen/ty_btn_bg_act.png) 0 0 no-repeat;
      }
    }
  }

  .title__row-weather {
    height: 100%;
    width: 550px;
    display: flex;
    justify-content: flex-end;
    padding-right: 8px;
    box-sizing: border-box;
    padding-top: 13px;

    .day {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: normal;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;
    }
    .zhibiao{
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: normal;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;
      margin-left: 10px;
      cursor: pointer;
    }

    .clock {
      font-size: 24px;
      font-family: DINCond;
      font-weight: bold;
      color: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(180, 180, 180, 1) 60.04320169203593%, rgba(255, 255, 255, 1) 60.141693457255705%, rgba(220, 220, 220, 1) 100%);
      line-height: 22px;
      margin-left: 10px;
      margin-right: 30px;
    }

    .weather {
      display: flex;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;

      img {
        margin-right: 5px;
      }
    }

    .screen__btn {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
