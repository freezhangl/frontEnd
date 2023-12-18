<template>
  <div id="monitoring__index" ref="monitoring__index">
    <dv-full-screen-container class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="title__row d-flex jc-between ">
          <div class="d-flex jc-center ai-center address">
            <img
              class="address__img"
              src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/bianzu.png"
              alt=""
            />
            <!-- 河北省保定市 -->
            <!-- <a-form-model-item label="" ref="addressRef" class="level__address" style="margin-bottom:0px">
              <a-cascader
                :options="addressOptions"
                :load-data="value => loadNextData(value)"
                change-on-select
                v-model="levelFouraddress"
                :fieldNames="{ label: 'name', value: 'areaCode', children: 'children' }"
                @change="onAddressChange"
                placeholder="请选择服务地址"
              />
            </a-form-model-item> -->
            {{ addressStr }}
            <img class="arrow__img" src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/lujing.png" alt="" />
          </div>
          <div class="d-flex jc-center ai-center weather__box">
            <p class="text__day">{{ moment(new Date()).format('YYYY年MM月DD日') }}</p>
            <p class="text__day">星期{{ weekList[moment(new Date()).day()] }}</p>
            <p class="text__time">{{ moment(new Date()).format('HH:mm:ss') }}</p>
            <!-- <p>{{ weatherData['text'] }}</p> -->
            <!-- <img src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/weather.png" alt="" /> -->
            <p class="text__temp">{{ weatherData['weatherInfo'] }}</p>
            <p class="text__temp">{{ weatherData['temperature'] }}°</p>
          </div>
        </div>
        <div class="body__box">
          <div class="content-left">
            <yyLeftTop :leftTopInfo="leftTopInfo" />
            <yyLeftBottom :leftBottomInfo="leftBottomInfo" />
          </div>
          <div class="content-center">
            <yyCenterTop
              :centerTopInfo="centerTopInfo"
              :regionGeoJson="regionGeoJson"
              @updateEchartsInfo="updateEchartsInfo"
            />
            <yyCenterBottom :centerBottomInfo="centerBottomInfo" />
          </div>
          <div class="content-right">
            <yyRightTop
              @changeTab="changeRightTopTab"
              :rightTopInfo="rightTopInfo"
              :rightTopActiveName="rightTopActiveName"
            />
            <yyRightCenter :rightCenterInfo="rightCenterInfo" />
            <yyRightBottom
              :rightBottomActiveName="rightBottomActiveName"
              :rightBottomInfo="rightBottomInfo"
              @changeTab="changeRightBottomTab"
            />
          </div>
        </div>
      </div>
    </dv-full-screen-container>
  </div>
</template>

<script>
import yyLeftTop from './yyLeftTop'
// import yyLeftCenter from './yyLeftCenter'
import yyCenterTop from './yyCenterTop'
import yyCenterBottom from './yyCenterBottom'
import yyRightTop from './yyRightTop'
import yyLeftBottom from './yyLeftBottom'
import yyRightCenter from './yyRightCenter'
import yyRightBottom from './yyRightBottom'
import moment from 'moment'
import alljson from '../mapBigScreen/alljson'
import chinaJson from '../mapBigScreen/china'
// import { getWeatherData } from '@/api/spare/index'
import { getListData, getListData1 } from '@/api/cwApi/index'
import { getListDataNew } from '@/api/spare/index'
const weekList = ['日', '一', '二', '三', '四', '五', '六']
export default {
  name: 'BigMonitoringScreen',
  data() {
    return {
      origin: window.location.origin.indexOf('localhost') > 0 ? '' : window.location.origin + '/areas_v3/bound',
      leftTopInfo: {},
      leftBottomInfo: [],
      centerTopInfo: {},
      centerBottomInfo: {},
      rightTopInfo: {},
      rightCenterInfo: {},
      rightBottomInfo: [],
      rightTopActiveName: '日',
      rightBottomActiveName: '日',
      addressOptions: [], // 省地址
      cityList: [], // 市级地址,
      districtList: [], // 区县地址
      addressStr: '全国',
      levelFouraddress: [],
      addressData: {},
      weekList,
      loading: true,
      weatherData: {
        weatherInfo: '',
        temperature: 23
      },
      formData: {
        provinceId: '',
        provinceName: '',
        provinceCode: '',
        cityId: '',
        cityName: '',
        cityCode: '',
        districtId: '',
        districtCode: '',
        districtName: ''
      },
      dataObject: {},
      timer: null,
      currentDayTime: [],
      currentMonthTime: [],
      currentQuteTime: [],
      currentYearTime: [],
      alladcode: [],
      chinaJson: {},
      regionGeoJson: {}
    }
  },
  components: {
    yyLeftTop,
    // yyLeftCenter,
    yyRightTop,
    yyLeftBottom,
    yyCenterTop,
    yyCenterBottom,
    yyRightCenter,
    yyRightBottom
  },
  created() {
    this.getNowTime()
    // getWeatherData(
    //   'https://devapi.qweather.com/v7/weather/now?location=101010100&key=2f2bbd767c7144dab7d10f24fba0b4e9',
    //   'GET',
    //   { params: {} }
    // ).then(res => {
    //   this.weatherData = res.now
    // })
  },
  async mounted() {
    this.loadNextData()
    setTimeout(() => {
      const fullConmtentWidth = document.getElementById('screen__contentbox').offsetWidth
      const scaleNum = fullConmtentWidth / 1920
      this.$refs.monitoring__index.style.setProperty('--scaleNum', scaleNum)
      document.getElementById('monitoring__index').style.height = 1080 * scaleNum + 'px'
    })
    console.log(alljson, '我是地图数据啊')
    this.alladcode = alljson
    chinaJson.features.forEach(item => {
      item.properties.name = item.properties.fullname
    })
    this.chinaJson = chinaJson
    this.cancelLoading()
    this.init()
  },
  destoyed() {
    clearTimeout(this.timer)
  },
  methods: {
    init(addressCode = [], clickRegionCode) {
      // 默认获取全国的信息
      this.getLeftTopData(addressCode)
      this.getLeftBottomData(addressCode)
      this.getCenterTopData(addressCode)
      this.getCenterCenterData(addressCode, clickRegionCode)
      this.getCenterBottomData(addressCode)
      this.getRightTopData(addressCode)
      this.getrightCenterInfo(addressCode)
      this.getRightBottomData(addressCode)
      this.getWeatherData(addressCode)
      if (addressCode.length) {
        this.addressStr = `${this.formData.provinceName}${this.formData.cityName}`
      } else {
        this.addressStr = `全国`
      }
    },
    getWeatherData(addressCode = []) {
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : ''
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      if (addressCode.length === 0) {
        delete params.provinceCode
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 1) {
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 2) {
        delete params.provinceCode
        delete params.countyCode
      }
      if (addressCode.length === 3) {
        delete params.provinceCode
        delete params.cityCode
      }
      getListData1('/power/opsDashboard/weatherInfo', 'POST', params).then(res => {
        // res.data = {
        //   weatherInfo: '多云',
        //   temperature: 20.1
        // }
        this.weatherData = res.data
      })
    },
    getRightBottomData(addressCode = []) {
      // 右下角的信息
      let startTime = ''
      let endTime = ''
      if (this.rightBottomActiveName === '日') {
        startTime = this.currentDayTime[0]
        endTime = this.currentDayTime[1]
      }
      if (this.rightBottomActiveName === '月') {
        startTime = this.currentMonthTime[0]
        endTime = this.currentMonthTime[1]
      }
      if (this.rightBottomActiveName === '季') {
        startTime = this.currentQuteTime[0]
        endTime = this.currentQuteTime[1]
      }
      if (this.rightBottomActiveName === '年') {
        startTime = this.currentYearTime[0]
        endTime = this.currentYearTime[1]
      }
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : '',
        // townCode: addressCode?.length ? addressCode[3] : '',
        startTime: startTime,
        endTime: endTime
      }
      if (addressCode.length === 0) {
        delete params.provinceCode
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 1) {
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 2) {
        delete params.provinceCode
        delete params.countyCode
      }
      if (addressCode.length === 3) {
        delete params.provinceCode
        delete params.cityCode
      }
      getListData1('/power/opsDashboard/orderMonitor', 'POST', params).then(res => {
        // res.data = [
        //   {
        //     orderType: '',
        //     orderTypeName: '计划巡检',
        //     totalOrderNum: 0,
        //     finishOrderNum: 0,
        //     avgResponseHours: 0.0
        //   },
        //   {
        //     orderType: '',
        //     orderTypeName: '故障巡检',
        //     totalOrderNum: 0,
        //     finishOrderNum: 0,
        //     avgResponseHours: 0.0
        //   },
        //   {
        //     orderType: '',
        //     orderTypeName: '临时任务',
        //     totalOrderNum: 0,
        //     finishOrderNum: 0,
        //     avgResponseHours: 0.0
        //   }
        // ]
        res.data.forEach((item, index) => {
          item.text = item.orderTypeName
          if (item.text === '计划巡检') {
            item.iconUrl = 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/icon_xunjian.png'
          }
          if (item.text === '故障检修' || item.text === '故障巡检') {
            item.iconUrl = 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/icon_jianxiu.png'
          }
          if (item.text === '临时任务') {
            item.iconUrl = 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/icon_renwu.png'
          }
        })
        this.rightBottomInfo = res.data
      })
    },
    getrightCenterInfo(addressCode = []) {
      // 右中
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : ''
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      if (addressCode.length === 0) {
        delete params.provinceCode
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 1) {
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 2) {
        delete params.provinceCode
        delete params.countyCode
      }
      if (addressCode.length === 3) {
        delete params.provinceCode
        delete params.cityCode
      }
      getListData1('/power/opsDashboard/socialBenefits', 'POST', params).then(res => {
        // res.data = {
        //   carbonReduction: 4.0,
        //   saveStandardCoal: 3390.4,
        //   reduceDeforestation: 0.0,
        //   treePlant: 0.0
        // }
        this.rightCenterInfo = res.data
      })
    },
    getRightTopData(addressCode = []) {
      // 右上角信息
      let monitorType = ''
      if (this.rightTopActiveName === '日') {
        monitorType = 'day'
      }
      if (this.rightTopActiveName === '月') {
        monitorType = 'month'
      }
      if (this.rightTopActiveName === '年') {
        monitorType = 'year'
      }
      if (this.rightTopActiveName === '累计') {
        monitorType = 'total'
      }
      let startTime = ''
      let endTime = ''
      if (this.rightTopActiveName === '日') {
        startTime = this.currentDayTime[0]
        endTime = this.currentDayTime[1]
      }
      if (this.rightTopActiveName === '月') {
        startTime = this.currentMonthTime[0]
        endTime = this.currentMonthTime[1]
      }
      if (this.rightTopActiveName === '年') {
        startTime = this.currentYearTime[0]
        endTime = this.currentYearTime[1]
      }
      const params = {
        monitorType,
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : ''
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      if (startTime) {
        params.startTime = startTime
      }
      if (endTime) {
        params.endTime = endTime
      }
      if (addressCode.length === 0) {
        delete params.provinceCode
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 1) {
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 2) {
        delete params.provinceCode
        delete params.countyCode
      }
      if (addressCode.length === 3) {
        delete params.provinceCode
        delete params.cityCode
      }
      console.log(monitorType, '我是monitorType')
      getListData1('/power/opsDashboard/energyMonitor', 'POST', params).then(res => {
        // res.data = {
        //   series: [
        //     {
        //       type: '',
        //       name: '',
        //       unit: '',
        //       data: [133, 65, 1, 300, 1]
        //     }
        //   ],
        //   xaxis: {
        //     data: [1, 2, 4, 6, 7]
        //   }
        // }
        this.rightTopInfo = {
          name: res.data.series[0].name,
          type: res.data.series[0].type,
          unit: res.data.series[0].unit,
          xList: res.data?.xaxis?.data,
          yList: res.data?.series[0]?.data
        }
      })
    },
    getCenterBottomData(addressCode = []) {
      // 获取中下部折线图信息
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : ''
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      if (addressCode.length === 0) {
        delete params.provinceCode
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 1) {
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 2) {
        delete params.provinceCode
        delete params.countyCode
      }
      if (addressCode.length === 3) {
        delete params.provinceCode
        delete params.cityCode
      }
      getListData1('/power/opsDashboard/queryDayPower', 'POST', params).then(res => {
        // res.data = {
        //   series: [
        //     {
        //       type: '',
        //       name: '',
        //       unit: '',
        //       data: [1333, 65, 1, 300, 1]
        //     }
        //   ],
        //   xaxis: {
        //     data: [1, 2, 4, 6, 7]
        //   }
        // }
        this.centerBottomInfo = {
          name: res.data.series[0].name,
          type: res.data.series[0].type,
          unit: res.data.series[0].unit,
          xList: res.data.xaxis.data,
          yList: res.data.series[0].data
        }
      })
    },
    async updateEchartsInfo(params) {
      console.log(params, '我是父组件获取到了数据')
      const clickRegionCode = this.alladcode.filter(item => item.name === params.name)[0].adcode
      const clickLevel = this.alladcode.filter(item => item.name === params.name)[0].level
      // console.log(clickRegionCode + '.json', '我是请求的url')
      if (clickLevel === 'province') {
        // 点击的是省
        let provinceObj = {}
        this.addressOptions.some(item => {
          if (item.name === params.name) {
            provinceObj = item
            return true
          }
        })
        this.formData.provinceCode = provinceObj.code
        this.formData.provinceId = provinceObj.id
        this.formData.provinceName = provinceObj.name
        console.log(provinceObj, '我是点击的哪个省')
        await getListData('/power/powerArea/queryCityList', 'GET', {
          params: {
            provinceId: this.formData.provinceId,
            provinceName: this.formData.provinceName
          }
        }).then(res => {
          if (res.code === 200) {
            const resList = []
            res.data.forEach(item => {
              if (item.name === '那曲地区') {
                item.name = '那曲市'
              }
              item.areaCode = item.code
              this.addressData[item.areaCode] = item.name
              resList.push({ areaCode: item.areaCode, name: item.name, isLeaf: item.levelCode === 3, ...item })
            })
            this.cityList = resList
          }
        })
      }
      if (clickLevel === 'city') {
        // 点击的是市
        let cityObj = {}
        this.cityList.some(item => {
          if (item.name === params.name) {
            cityObj = item
            return true
          }
        })
        this.formData.cityCode = cityObj.code
        this.formData.cityId = cityObj.id
        this.formData.cityName = cityObj.name
        console.log(cityObj, '我是点击的哪个市')
        await getListData('/power/powerArea/queryAreaList', 'GET', {
          params: {
            provinceId: this.formData.provinceId,
            provinceName: this.formData.provinceName,
            cityId: this.formData.cityId,
            cityName: this.formData.cityName
          }
        }).then(res => {
          if (res.code === 200) {
            const resList = []
            res.data.forEach(item => {
              item.areaCode = item.code
              this.addressData[item.areaCode] = item.name
              resList.push({ areaCode: item.areaCode, name: item.name, isLeaf: item.levelCode === 3, ...item })
            })
            this.districtList = resList
          }
        })
      }
      if (clickLevel === 'district') {
        // 点击的是县或区 这个时候没有下一级应该去请求全国的数据
        console.log('我是点击了区县')
        this.formData.provinceId = ''
        this.formData.provinceCode = ''
        this.formData.provinceName = ''
        this.formData.cityId = ''
        this.formData.cityCode = ''
        this.formData.cityName = ''
      }
      // 重新渲染数据
      const addressCode = []
      if (this.formData.provinceCode) {
        addressCode.push(this.formData.provinceCode)
      }
      if (this.formData.cityCode) {
        addressCode.push(this.formData.cityCode)
      }
      this.init(addressCode, clickRegionCode)
    },
    async getCenterCenterData(addressCode = [], clickRegionCode) {
      // 获取中间地图信息,去请求当前所有省的离线数量,或者省下所有市的离线数量
      console.log(addressCode, '我是选择的地址')
      let lxList = []
      if (addressCode.length === 0) {
        // 去根据所有的省获取离线数量
        const params = {}
        // this.addressOptions.forEach(item => {
        //   params.push({
        //     provinceCode: item.code
        //   })
        // })
        await getListData1('/power/opsDashboard/queryStationCountByArea', 'POST', params).then(res => {
          console.log(res, '我是所有省的离线数量')
          // res.data = [
          //   {
          //     areaName: '安徽省',
          //     areaCode: '',
          //     areaStationCount: 100,
          //     offLineAreaStationCount: 46
          //   },
          //   {
          //     areaName: '江苏省',
          //     areaCode: '',
          //     areaStationCount: 24,
          //     offLineAreaStationCount: 2
          //   }
          // ]
          lxList = res.data
        })
      }
      if (addressCode.length === 1) {
        // 去根据所有的市获取离线数量
        const params = {
          provinceCode: this.formData.provinceCode
        }
        // this.cityList.forEach(item => {
        //   params.push({
        //     provinceCode: this.formData.provinceCode,
        //     cityCode: item.code
        //   })
        // })
        await getListData1('/power/opsDashboard/queryStationCountByArea', 'POST', params).then(res => {
          console.log(res, '我是所有市的离线数量')
          // res.data = [
          //   {
          //     areaName: '阜阳市',
          //     areaCode: '',
          //     areaStationCount: 100,
          //     offLineAreaStationCount: 25
          //   },
          //   {
          //     areaName: '合肥市',
          //     areaCode: '',
          //     areaStationCount: 24,
          //     offLineAreaStationCount: 21
          //   }
          // ]
          lxList = res.data
        })
      }
      if (addressCode.length === 2) {
        // 去根据所有的区县获取离线数量
        const params = {
          // provinceCode: this.formData.provinceCode,
          cityCode: this.formData.cityCode
        }
        // this.districtList.forEach(item => {
        //   params.push({
        //     provinceCode: this.formData.provinceCode,
        //     cityCode: this.formData.cityCode,
        //     countyCode: item.code
        //   })
        // })
        await getListData1('/power/opsDashboard/queryStationCountByArea', 'POST', params).then(res => {
          console.log(res, '我是所有市的离线数量')
          // res.data = [
          //   {
          //     areaName: '界首市',
          //     areaCode: '',
          //     areaStationCount: 1000,
          //     offLineAreaStationCount: 254
          //   },
          //   {
          //     areaName: '临泉县',
          //     areaCode: '',
          //     areaStationCount: 249,
          //     offLineAreaStationCount: 214
          //   }
          // ]
          lxList = res.data
        })
      }
      console.log(addressCode.length, '我是多少阿阿凡达')
      if (clickRegionCode && (addressCode.length === 1 || addressCode.length === 2)) {
        let url = ''
        if (this.origin) {
          url = `${this.origin}/${clickRegionCode}.json`
        } else {
          url = `${this.origin}/aliyun/${clickRegionCode}.json`
        }
        getListDataNew(url, 'GET')
          .then(res => {
            console.log(res, '我说放大')
            this.setRegionGeoJson(res, lxList)
          })
          .catch(err => {
            console.log(err, '我是错误')
            let url = ''
            if (this.origin) {
              url = `${this.origin}/100000.json`
            } else {
              url = `${this.origin}/aliyun/100000.json`
            }
            getListDataNew(url, 'GET').then(res => {
              console.log(res, '我说放大')
              res = this.chinaJson
              this.setRegionGeoJson(res, lxList, '1')
              // this.rightTopInfo = res.data
            })
          })
      } else {
        let url = ''
        if (this.origin) {
          url = `${this.origin}/100000.json`
        } else {
          url = `${this.origin}/aliyun/100000.json`
        }
        getListDataNew(url, 'GET').then(res => {
          console.log(res, '我说放大')
          res = this.chinaJson
          this.setRegionGeoJson(res, lxList, '1')
        })
      }
    },
    setRegionGeoJson(res, lxList, type) {
      console.log(res, lxList, '我是哈哈哈')
      res.features.forEach(item => {
        let hasOne = false
        lxList.some(item1 => {
          if (item.properties.name === item1.areaName) {
            hasOne = true
            item.hasOne = true
            item.areaCode = item1.areaCode
            item.areaStationCount = item1.areaStationCount
            item.offLineAreaStationCount = item1.offlineAreaStationCount
            return true
          }
        })
        if (!hasOne) {
          item.hasOne = false
          item.offLineAreaStationCount = 0
          item.areaStationCount = 0
        }
      })
      res.provinceName = this.formData.provinceName
      if (type === '1') {
        res.isChinaInfo = true
      } else {
        res.isChinaInfo = false
      }
      this.regionGeoJson = res
    },
    getCenterTopData(addressCode) {
      // 获取中上信息
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : ''
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      if (addressCode.length === 0) {
        delete params.provinceCode
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 1) {
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 2) {
        delete params.provinceCode
        delete params.countyCode
      }
      if (addressCode.length === 3) {
        delete params.provinceCode
        delete params.cityCode
      }
      getListData1('/power/opsDashboard/querySumEnergy', 'POST', params).then(res => {
        // res.data = {
        //   dayEnergy: 120.0,
        //   yearEnergy: '32',
        //   yearEnergyHours: 30.0
        // }
        this.centerTopInfo = res.data
      })
    },
    getLeftBottomData(addressCode) {
      // 获取左下角的信息
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : ''
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      if (addressCode.length === 0) {
        delete params.provinceCode
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 1) {
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 2) {
        delete params.provinceCode
        delete params.countyCode
      }
      if (addressCode.length === 3) {
        delete params.provinceCode
        delete params.cityCode
      }
      getListData1('/power/opsDashboard/queryEnergyRank', 'POST', params).then(res => {
        // res.data = [
        //   {
        //     name: '安国市',
        //     value: 330.0,
        //     unit: ''
        //   },
        //   {
        //     name: '高阳县',
        //     value: 20.0,
        //     unit: ''
        //   },
        //   {
        //     name: '徐水区',
        //     value: 50.0,
        //     unit: ''
        //   }
        // ]
        res.data.forEach(item => {
          item.num = item.value
        })
        this.leftBottomInfo = res.data
      })
    },
    getLeftTopData(addressCode) {
      // 获取左上角的信息
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : ''
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      if (addressCode.length === 0) {
        delete params.provinceCode
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 1) {
        delete params.cityCode
        delete params.countyCode
      }
      if (addressCode.length === 2) {
        delete params.provinceCode
        delete params.countyCode
      }
      if (addressCode.length === 3) {
        delete params.provinceCode
        delete params.cityCode
      }
      getListData1('/power/opsDashboard/queryProjectScope', 'POST', params).then(res => {
        // res.data = {
        //   capacity: 271.95,
        //   unit: '',
        //   countyCount: 11,
        //   villageCount: 44,
        //   houseCount: 34
        // }
        this.leftTopInfo = res.data
      })
    },
    async loadNextData(selectedOptions) {
      // 获取选择地址
      console.log(selectedOptions, '我是选择了数据')
      if (selectedOptions?.length) {
        // 初始化请求第一级
        if (selectedOptions?.length === 1) {
          // 去请求市级
          getListData('/power/powerArea/queryCityList', 'GET', {
            params: {
              provinceId: selectedOptions && selectedOptions.length ? selectedOptions[0].id : 0,
              provinceName: selectedOptions && selectedOptions.length ? selectedOptions[0].name : 0
            }
          }).then(res => {
            if (res.code === 200) {
              const resList = []
              res.data.forEach(item => {
                item.areaCode = item.code
                this.addressData[item.areaCode] = item.name
                resList.push({ areaCode: item.areaCode, name: item.name, isLeaf: item.levelCode === 3, ...item })
              })
              if (!selectedOptions) {
                this.addressOptions = resList
              } else {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.children = resList
                this.addressOptions = [...this.addressOptions]
              }
            }
          })
        }
        if (selectedOptions?.length === 2) {
          // 去请求区级
          getListData('/power/powerArea/queryAreaList', 'GET', {
            params: {
              provinceId: selectedOptions && selectedOptions.length ? selectedOptions[0].id : 0,
              provinceName: selectedOptions && selectedOptions.length ? selectedOptions[0].name : 0,
              cityId: selectedOptions && selectedOptions.length ? selectedOptions[1].id : 0,
              cityName: selectedOptions && selectedOptions.length ? selectedOptions[1].name : 0
            }
          }).then(res => {
            if (res.code === 200) {
              const resList = []
              res.data.forEach(item => {
                item.areaCode = item.code
                this.addressData[item.areaCode] = item.name
                resList.push({ areaCode: item.areaCode, name: item.name, isLeaf: item.levelCode === 3, ...item })
              })
              if (!selectedOptions) {
                this.addressOptions = resList
              } else {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.children = resList
                this.addressOptions = [...this.addressOptions]
              }
            }
          })
        }
        if (selectedOptions?.length === 3) {
          // 去请求镇级
          getListData('/power/powerArea/queryTownList', 'GET', {
            params: {
              provinceId: selectedOptions && selectedOptions.length ? selectedOptions[0].id : 0,
              provinceName: selectedOptions && selectedOptions.length ? selectedOptions[0].name : 0,
              cityId: selectedOptions && selectedOptions.length ? selectedOptions[1].id : 0,
              cityName: selectedOptions && selectedOptions.length ? selectedOptions[1].name : 0,
              areaId: selectedOptions && selectedOptions.length ? selectedOptions[2].id : 0,
              areaName: selectedOptions && selectedOptions.length ? selectedOptions[2].name : 0
            }
          }).then(res => {
            if (res.code === 200) {
              const resList = []
              res.data.forEach(item => {
                item.areaCode = item.code
                this.addressData[item.areaCode] = item.name
                resList.push({ areaCode: item.areaCode, name: item.name, isLeaf: true, ...item })
              })
              if (!selectedOptions) {
                this.addressOptions = resList
              } else {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.children = resList
                this.addressOptions = [...this.addressOptions]
              }
            }
          })
        }
      } else {
        // 初始化请求第一级
        await getListData('/power/powerArea/queryProvinceList', 'GET', {
          params: {
            parentCode:
              selectedOptions && selectedOptions.length ? selectedOptions[selectedOptions.length - 1].areaCode : 0
          }
        }).then(res => {
          if (res.code === 200) {
            const resList = []
            res.data.forEach(item => {
              item.areaCode = item.code
              this.addressData[item.areaCode] = item.name
              resList.push({ areaCode: item.areaCode, name: item.name, isLeaf: item.levelCode === 3, ...item })
            })
            if (!selectedOptions) {
              this.addressOptions = resList
            } else {
              const targetOption = selectedOptions[selectedOptions.length - 1]
              targetOption.children = resList
              this.addressOptions = [...this.addressOptions]
            }
          }
        })
      }
    },
    onAddressChange(addressCode) {
      // 获取地址改变后的code
      this.$refs.addressRef.onFieldChange()
      this.$set(this.formData, 'levelFouraddress', addressCode)
      console.log(addressCode, '改变后的地址的code')
      this.init(addressCode)
    },
    moment,
    changeRightBottomTab(val) {
      this.rightBottomActiveName = val
      const addressCode = []
      if (this.formData.provinceCode) {
        addressCode.push(this.formData.provinceCode)
      }
      if (this.formData.cityCode) {
        addressCode.push(this.formData.cityCode)
      }
      this.getRightBottomData(addressCode)
    },
    changeRightTopTab(val) {
      this.rightTopActiveName = val
      const addressCode = []
      if (this.formData.provinceCode) {
        addressCode.push(this.formData.provinceCode)
      }
      if (this.formData.cityCode) {
        addressCode.push(this.formData.cityCode)
      }
      this.getRightTopData(addressCode)
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false
      }, 1000)
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
      console.log(currentDayTime, currentMonthTime, currentQuteTime, currentYearTime, '当天月的开始时间和结束时间戳')
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
          startTime = moment(new Date(nowYear, (jd - 1) * 3, 1).getTime()).format('YYYY-MM-DD HH:mm:ss')
          endTime = moment(new Date(nowYear, jd * 3, 0).getTime()).format('YYYY-MM-DD HH:mm:ss')
          break
        case '本年':
          startTime = moment(new Date(nowYear, 0, 1).getTime()).format('YYYY-MM-DD HH:mm:ss')
          endTime = moment(new Date(nowYear + '-12' + '-31' + ' ' + '23:59:59').getTime()).format('YYYY-MM-DD HH:mm:ss')
          break
      }
      return [startTime, endTime]
      // 格式化日期：yyyy-MM-dd
      // console.log(formatDate(startTime), formatDate(endTime))
    }
  }
}
</script>
<style>
/* #monitoring__index {
  --scaleNum: 0.8;
}

#monitoring__index #dv-full-screen-container {
  transform: scale(var(--scaleNum)) !important;
  height: 1080px !important;
} */
#monitoring__index {
  --scaleNum: 1;
  width: 100%;
  height: auto;
  /* margin: 0 auto; */
}

#monitoring__index #dv-full-screen-container {
  transform: scale(var(--scaleNum)) !important;
  width: 1920px !important;
  height: 1080px !important;
  position: static;
}
</style>
<style lang="less" scoped>
#monitoring__index {
  * {
    color: #d3d6dd;
  }
  .level__address {
    /deep/ .ant-cascader-picker {
      background-color: transparent;
      .ant-input {
        border: none;
      }
    }
  }
  background-color: #000000;
  width: 100%;

  .bg {
    // padding: 0.8125rem;
    box-sizing: border-box;
    background-image: url('https://storage.360buyimg.com/gfkj-files/imgs/jby/screen_bg.png');
  }

  #dv-full-screen-container {
    position: static;
    // width: 100% !important;
    // transform: scale(@scaleNum) !important;
  }

  .host-body {
    width: 100%;
    height: 100%;

    .title__row {
      height: 78px;
      width: 100%;
      background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/screen_title.png) 0 0 no-repeat;
      background-size: 100% 100%;

      .address {
        font-size: 16px;
        font-family: PingFang SC;
        color: rgba(255, 255, 255, 1);
        margin: 42px 0 0 23px;
        line-height: 22px;
        .address__img {
          width: 22px;
          height: 22px;
          margin-right: 3px;
        }
        .arrow__img {
          width: 8px;
          height: 5px;
        }
      }

      .weather__box {
        margin: 39px 8px 0 0;
        p {
          margin-right: 10px;
          line-height: 22px;
        }
        .text__day {
          font-size: 16px;
          font-family: PingFang SC;
          color: rgba(255, 255, 255, 1);
        }

        .text__time {
          font-size: 24px;
          font-family: DINCond;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
        }
        img {
          width: 24px;
          height: 24px;
        }
        .text__temp {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          margin-left: 10px;
        }
      }
    }

    .body__box {
      display: flex;
      width: 100%;
      height: 1002px;
      padding: 9px 16px 16px;
      box-sizing: border-box;
      .content-left {
        width: 480px;
        height: 100%;
      }

      .content-center {
        flex: 1;
        height: 100%;
        padding: 0 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }

      .content-right {
        width: 480px;
        height: 100%;
        // display: grid;
        // grid-template-rows: repeat(3, 40% 25% 35%);
      }
    }
  }
}
</style>
