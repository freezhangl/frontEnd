<template>
  <div id="bigscreen__map" ref="bigscreen__map">
    <dv-full-screen-container class="bg">
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
      <div class="level__address">
        <img class="address__img" src="https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/bianzu.png" alt="" />
        {{ addressStr }}
      </div>
      <baidu-map
        style="height: 100%"
        class="map"
        :center="mapCenter"
        :zoom="zoom"
        @ready="handlerLoad"
        @zoomend="zoomend"
        :scroll-wheel-zoom="true"
        :min-zoom="5"
        @click="clickEvent"
        @dragend="dragend"
        :max-zoom="18"
      >
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
        <template v-for="item in markers">
          <bm-marker :key="item.selfIndex" :position="item" @click="lookDetail(item)" animation="BMAP_ANIMATTION_DROP">
            <bm-info-window :show="item.show" @close="infoWindowClose(item)" @open="infoWindowOpen(item)">{{
              item.locationName
            }}</bm-info-window>
          </bm-marker>
        </template>
        <template v-for="item in overLayPosition">
          <my-overlay :position="item" :key="item.name"> </my-overlay>
        </template>
      </baidu-map>
      <RightContent
        :rightTopInfo="rightTopInfo"
        :rightCenterInfo="rightCenterInfo"
        :rightCenterInfoNew="rightCenterInfoNew"
      />
      <div class="content-right"></div>
    </dv-full-screen-container>
  </div>
</template>

<script>
// import Header from './header'
import MyOverlay from './echart/myOverlay'
import RightContent from './rightContent'
// import { getWeatherData, getListData } from '@/api/spare/index'
// import { getListData } from '@/api/spare/index'
import { getListData, getListData1 } from '@/api/cwApi/index'
import screenfull from 'screenfull'
import { mapGetters } from 'vuex'
import alljson from './alljson'
import debounce from 'lodash/debounce'
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const isWidthMax = screenWidth / 1920 >= screenHeight / 1080
export default {
  name: 'TyBigScreen',
  data() {
    this.getAddressList = debounce(this.getAddressList, 1000)
    return {
      origin: window.location.origin.indexOf('localhost') > 0 ? '' : window.location.origin + '/areas_v3/bound',
      addressStr: '全国',
      isFullscreen: false,
      zoom: 5,
      mapCenter: { lng: 0, lat: 0 },
      markers: [],
      scaleNum: 1,
      screenScaleNum: 1,
      BMap: null,
      map: null,
      points: [114.64, 38.04],
      overLayPosition: [], // 自定义标记
      addressOptions: [], // 省地址
      cityList: [], // 市级地址,
      districtList: [], // 区县地址
      townList: [], // 区县地址
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
      mapLocation: {
        address: '',
        coordinate: ''
      },
      alladcode: [],
      infoWindow: { info: {} },
      timer: '',
      levelFouraddress: [],
      addressData: {},
      rightTopInfo: {},
      rightCenterInfo: {},
      rightCenterInfoNew: {},
      markPosition: {},
      form: {},
      position: {},
      mapObj: [
        { lng: 114.64, lat: 38.04 },
        { lng: 113.64, lat: 31.04 },
        { lng: 0, lat: 0 }
      ],
      loading: false,
      dataObject: {},
      timeObj: {},
      windowRatio: 100
    }
  },
  components: {
    // Header,
    MyOverlay,
    RightContent
  },
  created() {
    // this.windowRatio = this.getRatio()
    // this.screenScaleNum = isWidthMax ? (screenHeight / 1080) : (screenWidth / 1920)
    // this.getAllData()
    // let url = ''
    // if (this.origin) {
    //   url = `${this.origin}/all.json`
    // } else {
    //   url = `${this.origin}/aliyun/all.json`
    // }
    // getListData(url, 'GET').then(res => {
    //   console.log(res, '我是琥珀uu')
    //   this.alladcode = res
    // })
    console.log(alljson, '我是地图数据啊')
    this.alladcode = alljson
  },
  computed: {
    ...mapGetters(['menusidebar'])
  },
  destoyed() {},
  watch: {
    isFullscreen: {
      handler(val) {
        if (val) {
          // this.screenScaleNum = isWidthMax ? (screenHeight / 1080) : (screenWidth / 1920)
          this.screenScaleNum = screenWidth / 1920
          this.setscreenTyAttr(
            this.screenScaleNum,
            isWidthMax ? 'width' : 'height',
            isWidthMax ? 1920 * this.screenScaleNum + 'px' : 1080 * this.screenScaleNum + 'px'
          )
          document.querySelector('#bigscreen__map').style.margin = '0 auto'
        } else {
          this.setscreenTyAttr(this.scaleNum, 'height', 1080 * this.scaleNum + 'px')
          document.querySelector('#bigscreen__map').style.margin = ''
          document.querySelector('#bigscreen__map').style.width = '100%'
        }
      }
    },
    menusidebar(val) {
      const fullConmtentWidth = val
        ? document.querySelector('.layout__content').offsetWidth - 150
        : document.querySelector('.layout__content').offsetWidth + 150
      this.scaleNum = fullConmtentWidth / 1920
      this.setscreenTyAttr(this.scaleNum, 'height', 1080 * this.scaleNum + 'px')
    }
  },
  mounted() {
    this.windowRatio = this.getRatio()
    const timerOut = setTimeout(() => {
      const fullConmtentWidth = document.querySelector('.layout__content').offsetWidth
      this.scaleNum = fullConmtentWidth / 1920
      this.setscreenTyAttr(this.scaleNum, 'height', 1080 * this.scaleNum + 'px')
      // document.querySelector('#dv-full-screen-container').style.zoom = screenWidth / 1920
      clearTimeout(timerOut)
    })
    this.loadNextData()
    this.getoverLayPosition()
    this.init()
  },
  methods: {
    infoWindowClose(item) {
      console.log(item, this.markers, '我是点击了详情1')
      const newList = []
      this.markers.forEach(item1 => {
        if (item1.locationName === item.locationName) {
          newList.push({ ...item1, show: false })
        } else {
          newList.push(item1)
        }
      })
      this.markers = newList
    },
    infoWindowOpen(item) {
      console.log(item, this.markers, '我是点击了详情2')
      const newList = []
      this.markers.forEach(item1 => {
        if (item1.locationName === item.locationName) {
          newList.push({ ...item1, show: true })
        } else {
          newList.push(item1)
        }
      })
      this.markers = newList
      // item.show = true;
    },
    lookDetail(item) {
      console.log(item, this.markers, '我是点击了详情3')
      const newList = []
      this.markers.forEach(item1 => {
        if (item1.locationName === item.locationName) {
          newList.push({ ...item1, show: true })
        } else {
          newList.push(item1)
        }
      })
      this.markers = newList
      // item.show = true;
      this.infoWindow.info = item
    },
    // 获取屏幕缩放比例  探针、测距、标签功能都需
    handlerLoad({ BMap, map }) {
      /* eslint-disable no-undef */
      map.setMapType(BMAP_HYBRID_MAP)
      console.log(BMap, map, 'fhafds割发代首')
      this.BMap = BMap
      this.map = map
      // this.map.enableScrollWheelZoom(true);
      this.map.enableScrollWheelZoom()
      this.mapCenter.lng = 116.404
      this.mapCenter.lat = 39.915
      // this.zoom = 5;
    },
    zoomend(val) {
      const zoom = this.map?.getZoom()
      const mapcenter = this.map?.getCenter()
      this.mapCenter = mapcenter
      if (zoom === this.zoom) {
        return
      }
      console.log(zoom, val, 'fdsjj富家大室', this.mapCenter)
      this.zoom = zoom
      const myGeo = new this.BMap.Geocoder()
      myGeo.getLocation(this.mapCenter, rs => {
        console.log('我是具体地址1', rs)
        this.getAddressList(rs)
      })
    },
    dragend(e) {
      console.log(e, '我是拖拽事件')
      // this.mapCenter = e.point
      const mapcenter = this.map?.getCenter()
      this.mapCenter = mapcenter
      const myGeo = new this.BMap.Geocoder()
      myGeo.getLocation(this.mapCenter, rs => {
        console.log('我是具体地址2', rs)
        this.getAddressList(rs)
      })
    },
    clickEvent(e) {
      // this.mapCenter = e.point
      // const myGeo = new this.BMap.Geocoder()
      // myGeo.getLocation(this.mapCenter, rs => {
      //   console.log('我是具体地址2', rs)
      //   this.getAddressList(rs)
      // })
    },
    getAddressList(rs) {
      console.log(
        `省:${rs.addressComponents.province},市:${rs.addressComponents.city},县:${rs.addressComponents.district}`,
        '我是执行的次数'
      )
      // 当前在省级,设置省级的code,获取所有市级数据的code
      if (!rs.addressComponents.province) {
        console.log('当前未获取到地址信息', rs.addressComponents.province)
        this.getoverLayPosition()
        return
      }
      if (this.zoom === 5) {
        let provinceObj = {}
        this.addressOptions.some(item => {
          if (item.name === rs.addressComponents.province) {
            provinceObj = item
            return true
          }
        })
        this.formData.provinceCode = provinceObj.code
        this.formData.provinceId = provinceObj.id
        this.formData.provinceName = provinceObj.name
        console.log(provinceObj, '我是点击的哪个省')
        getListData('/power/powerArea/queryCityList', 'GET', {
          params: {
            provinceId: this.formData.provinceId,
            provinceName: this.formData.provinceName
          }
        }).then(res => {
          if (res.code === 200) {
            const resList = []
            res.data.forEach(item => {
              item.areaCode = item.code
              resList.push({
                areaCode: item.areaCode,
                name: item.name,
                isLeaf: item.levelCode === 3,
                ...item
              })
            })
            this.cityList = resList
            this.getoverLayPosition()
          }
        })
      }
      // 当前在市级,设置市级的code,获取所有区县的code
      if (this.zoom > 5 && this.zoom <= 8) {
        // 当前在市级,获取点击市下的所有区县级数据
        let provinceObj = {}
        this.addressOptions.some(item => {
          if (item.name === rs.addressComponents.province) {
            provinceObj = item
            return true
          }
        })
        this.formData.provinceCode = provinceObj.code
        this.formData.provinceId = provinceObj.id
        this.formData.provinceName = provinceObj.name
        getListData('/power/powerArea/queryCityList', 'GET', {
          params: {
            provinceId: this.formData.provinceId,
            provinceName: this.formData.provinceName
          }
        }).then(res => {
          if (res.code === 200) {
            const resList = []
            res.data.forEach(item => {
              item.areaCode = item.code
              resList.push({
                areaCode: item.areaCode,
                name: item.name,
                isLeaf: item.levelCode === 3,
                ...item
              })
            })
            this.cityList = resList
            // 下一步
            let cityObj = {}
            this.cityList.some(item => {
              if (item.name === rs.addressComponents.city) {
                cityObj = item
                return true
              }
            })
            this.formData.cityCode = cityObj.code
            this.formData.cityId = cityObj.id
            this.formData.cityName = cityObj.name
            console.log(cityObj, '我是点击的哪个市')
            getListData('/power/powerArea/queryAreaList', 'GET', {
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
                  resList.push({
                    areaCode: item.areaCode,
                    name: item.name,
                    isLeaf: item.levelCode === 3,
                    ...item
                  })
                })
                this.districtList = resList
                this.getoverLayPosition()
              }
            })
          }
        })
      }
      // 当前在县级,设置县级的code,获取所有镇级的code
      if (this.zoom >= 9) {
        // 当前在区县级,获取点击区县下的所有镇级数据
        let provinceObj = {}
        this.addressOptions.some(item => {
          if (item.name === rs.addressComponents.province) {
            provinceObj = item
            return true
          }
        })
        this.formData.provinceCode = provinceObj.code
        this.formData.provinceId = provinceObj.id
        this.formData.provinceName = provinceObj.name
        getListData('/power/powerArea/queryCityList', 'GET', {
          params: {
            provinceId: this.formData.provinceId,
            provinceName: this.formData.provinceName
          }
        }).then(res => {
          if (res.code === 200) {
            const resList = []
            res.data.forEach(item => {
              item.areaCode = item.code
              resList.push({
                areaCode: item.areaCode,
                name: item.name,
                isLeaf: item.levelCode === 3,
                ...item
              })
            })
            this.cityList = resList
            // 下一步
            let cityObj = {}
            this.cityList.some(item => {
              if (item.name === rs.addressComponents.city) {
                cityObj = item
                return true
              }
            })
            this.formData.cityCode = cityObj.code
            this.formData.cityId = cityObj.id
            this.formData.cityName = cityObj.name
            console.log(cityObj, '我是点击的哪个市')
            getListData('/power/powerArea/queryAreaList', 'GET', {
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
                  resList.push({
                    areaCode: item.areaCode,
                    name: item.name,
                    isLeaf: item.levelCode === 3,
                    ...item
                  })
                })
                this.districtList = resList
                // 下一步
                let districtObj = {}
                this.districtList.some(item => {
                  if (item.name === rs.addressComponents.district) {
                    districtObj = item
                    return true
                  }
                })
                this.formData.districtCode = districtObj.code
                this.formData.districtId = districtObj.id
                this.formData.districtName = districtObj.name
                console.log(districtObj, '我是点击的哪个区县')
                getListData('/power/powerArea/queryAreaList', 'GET', {
                  params: {
                    provinceId: this.formData.provinceId,
                    provinceName: this.formData.provinceName,
                    cityId: this.formData.cityId,
                    cityName: this.formData.cityName,
                    areaId: this.formData.districtId,
                    areaName: this.formData.districtName
                  }
                }).then(res => {
                  if (res.code === 200) {
                    const resList = []
                    res.data.forEach(item => {
                      item.areaCode = item.code
                      resList.push({
                        areaCode: item.areaCode,
                        name: item.name,
                        isLeaf: item.levelCode === 3,
                        ...item
                      })
                    })
                    this.townList = resList
                    this.getoverLayPosition()
                  }
                })
              }
            })
          }
        })
      }
    },
    getoverLayPosition() {
      console.log(this.zoom, '我是初始值')
      // 获取所有省的标记点
      if (this.zoom === 5) {
        const params = {}
        this.addressStr = `全国`
        getListData1('/power/mapScreen/location', 'POST', params).then(res => {
          console.log(res, this.alladcode, '就法第三季')
          // res.data = [
          //   {
          //     locationCode: '',
          //     locationName: '安徽省',
          //     stationCount: 2565,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   },
          //   {
          //     locationCode: '',
          //     locationName: '江苏省',
          //     stationCount: 3441,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   }
          // ]
          const provinceInfoList = []
          this.alladcode.forEach(item => {
            if (item.level === 'province') {
              provinceInfoList.push(item)
            }
          })
          provinceInfoList.forEach(item => {
            let hasOne = false
            res.data.some(item1 => {
              if (item1.locationName === item.name) {
                hasOne = true
                item.hasOne = true
                item.stationCount = item1.stationCount
                return true
              }
            })
            if (!hasOne) {
              item.hasOne = false
              item.stationCount = 0
            }
          })
          this.overLayPosition = provinceInfoList.filter(item => item.hasOne)
          this.markers = []
          console.log(this.overLayPosition, '我是所有的省标记信息')
        })
      }
      // 获取所有市的标记点
      if (this.zoom > 5 && this.zoom <= 8) {
        if (!this.formData.provinceCode) return
        const params = {
          provinceCode: this.formData.provinceCode
        }
        this.addressStr = `${this.formData.provinceName}`
        getListData1('/power/mapScreen/location', 'POST', params).then(res => {
          console.log(res, '就法第三季')
          // res.data = [
          //   {
          //     locationCode: '',
          //     locationName: '阜阳市',
          //     stationCount: 180,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   },
          //   {
          //     locationCode: '',
          //     locationName: '合肥市',
          //     stationCount: 235,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   }
          // ]
          const cityInfoList = []
          this.alladcode.forEach(item => {
            if (item.level === 'city') {
              cityInfoList.push(item)
            }
          })
          cityInfoList.forEach(item => {
            let hasOne = false
            res.data.some(item1 => {
              if (item1.locationName === item.name) {
                hasOne = true
                item.hasOne = true
                item.stationCount = item1.stationCount
                return true
              }
            })
            if (!hasOne) {
              item.hasOne = false
              item.stationCount = 0
            }
          })
          this.overLayPosition = cityInfoList.filter(item => item.hasOne)
          this.markers = []
          console.log(this.overLayPosition, '我是所有的市标记信息')
        })
      }
      // 获取所有区县的标记
      if (this.zoom >= 9 && this.zoom <= 10) {
        if (!this.formData.cityCode) return

        const params = {
          // provinceCode: this.formData.provinceCode,
          cityCode: this.formData.cityCode
        }
        this.addressStr = `${this.formData.provinceName}${this.formData.cityName}`
        getListData1('/power/mapScreen/location', 'POST', params).then(res => {
          console.log(res, '就法第三季')
          // res.data = [
          //   {
          //     locationCode: '',
          //     locationName: '临泉县',
          //     stationCount: 25,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   },
          //   {
          //     locationCode: '',
          //     locationName: '界首市',
          //     stationCount: 44,
          //     longitude: 0.0,
          //     latitude: 0.0
          //   }
          // ]
          const districtInfoList = []
          this.alladcode.forEach(item => {
            if (item.level === 'district') {
              districtInfoList.push(item)
            }
          })
          districtInfoList.forEach(item => {
            let hasOne = false
            res.data.some(item1 => {
              if (item1.locationName === item.name) {
                hasOne = true
                item.hasOne = true
                item.stationCount = item1.stationCount
                return true
              }
            })
            if (!hasOne) {
              item.hasOne = false
              item.stationCount = 0
            }
          })
          this.overLayPosition = districtInfoList.filter(item => item.hasOne)
          this.markers = []
          console.log(this.overLayPosition, '我是所有的区县标记信息')
        })
      }
      // 获取具体的地址标记
      if (this.zoom >= 11) {
        if (!this.formData.districtCode) return
        const params = {
          // provinceCode: this.formData.provinceCode,
          // cityCode: this.formData.cityCode,
          countyCode: this.formData.districtCode
        }
        this.addressStr = `${this.formData.provinceName}${this.formData.cityName}${this.formData.districtName}`
        getListData1('/power/mapScreen/location', 'POST', params).then(res => {
          console.log(res, '就法第三季')
          // res.data = [
          //   {
          //     locationCode: '341282108000',
          //     locationName: '阜阳市界首市前进北街砖集第二小学',
          //     stationCount: 5,
          //     longitude: 115.315579,
          //     latitude: 33.115349
          //   },
          //   {
          //     locationCode: '341282106000',
          //     locationName: '阜阳市界首市人民路砖集派出所东侧约150米',
          //     stationCount: 44,
          //     longitude: 115.327507,
          //     latitude: 33.112325
          //   }
          // ]
          res.data.forEach((item, index) => {
            item.selfIndex = index + 1
            item.show = false
            item.lng = Number(item.longitude)
            item.lat = Number(item.latitude)
            // item.locationName = '你好啊吗' + Math.random()
          })
          this.overLayPosition = []
          this.markers = res.data
          this.townList = res.data
          console.log(this.markers, '我是所有的精确镇级标记信息')
        })
      }
    },
    init(addressCode) {
      this.getRightTopData(addressCode)
      this.getrightCenterInfo(addressCode)
      this.getrightCenterInfoNew(addressCode)
    },
    getrightCenterInfoNew(addressCode = []) {
      // 最近7天
      const params = {
        // provinceCode: addressCode?.length ? addressCode[0] : '',
        // cityCode: addressCode?.length ? addressCode[1] : '',
        // countyCode: addressCode?.length ? addressCode[2] : '',
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      getListData('/power/mapScreen/lastSevenDaysEnergy', 'GET', params).then(res => {
        // res.data = {
        //   series: [
        //     {
        //       type: '',
        //       name: '',
        //       unit: '',
        //       data: [1333, 652, 1, 300, 1, 1333, 652, 1, 300]
        //     }
        //   ],
        //   xAxis: {
        //     data: ['10-10', '10-11', '10-12', '10-13', '10-14', '10-15', '10-16']
        //   }
        // }
        this.rightCenterInfoNew = {
          name: res.data.series[0].name,
          type: res.data.series[0].type,
          unit: res.data.series[0].unit,
          xList: res.data?.xaxis?.data,
          yList: res.data?.series[0]?.data
        }
      })
    },
    getrightCenterInfo(addressCode = []) {
      const params = {
        // provinceCode: addressCode?.length ? addressCode[0] : '',
        // cityCode: addressCode?.length ? addressCode[1] : '',
        // countyCode: addressCode?.length ? addressCode[2] : '',
        // townCode: addressCode?.length ? addressCode[3] : ''
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
        //   xAxis: {
        //     data: [1, 2, 4, 6, 7]
        //   }
        // }
        this.rightCenterInfo = {
          name: res.data.series[0].name,
          type: res.data.series[0].type,
          unit: res.data.series[0].unit,
          xList: res.data?.xaxis?.data,
          yList: res.data?.series[0]?.data
        }
      })
    },
    getRightTopData(addressCode = []) {
      const params = {
        // provinceCode: addressCode?.length ? addressCode[0] : '',
        // cityCode: addressCode?.length ? addressCode[1] : '',
        // countyCode: addressCode?.length ? addressCode[2] : '',
        // townCode: addressCode?.length ? addressCode[3] : ''
      }
      getListData('/power/mapScreen/statistic', 'GET', { params }).then(res => {
        // res.data = {
        //   stationNum: 12,
        //   totalCapacity: 23.0,
        //   totalEnergy: 554.02,
        //   actualPower: 2.35,
        //   dayEnergy: 33.0,
        //   dayEnergyHours: 12.0,
        //   yearEnergy: 3.04,
        //   yearEnergyHours: 30.04,
        //   carbonReduction: 23.5,
        //   treePlant: 54.02
        // }
        this.rightTopInfo = res.data
      })
    },
    loadNextData(selectedOptions) {
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
        getListData('/power/powerArea/queryProvinceList', 'GET', {
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
      // this.init(addressCode)
    },
    // 获取屏幕缩放比例  探针、测距、标签功能都需要
    getRatio() {
      var ratio = 0
      var screen = window.screen
      var ua = navigator.userAgent.toLowerCase()
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio
      } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI
        }
      } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth
      }
      if (ratio) {
        ratio = Math.round(ratio * 100)
      }
      console.log(ratio)
      return ratio
    },
    setscreenTyAttr(scaleNum, type, height) {
      console.log(scaleNum)
      this.$refs.bigscreen__map.style.setProperty('--scaleNum', scaleNum)
      this.$refs.bigscreen__map.style.setProperty(type, height)
    },
    toQuotaList(pushRouterKey) {
      this.$router.push({ path: 'quotaProvider', query: { ...this.timeObj, indexType: pushRouterKey } })
    },
    toScreenFull() {
      const _this = this
      if (!screenfull.isEnabled) {
        this.$message.error('您的浏览器不支持全屏！')
        return false
      }
      screenfull.toggle(_this.$refs.bigscreen__map)
      // this.isFullscreen = screenfull.isFullscreen
      this.isFullscreen = !this.isFullscreen
    },
    getAllData(obj) {
      // 今日实时预警
      getListData('/spare/spareIndex/faultwarning/page', 'GET', { params: { ...obj, pageSize: 20, pageNo: 1 } }).then(
        res => {
          if (res.code === 200) {
            this.faultWarning = res.data.rows
          }
        }
      )
    }
  }
}
</script>
<style>
#bigscreen__map {
  --scaleNum: 1;
  width: 100%;
  height: auto;
  /* margin: 0 auto; */
}

#bigscreen__map #dv-full-screen-container {
  transform: scale(var(--scaleNum)) !important;
  width: 1920px !important;
  height: 1080px !important;
  position: static;
}
</style>
<style lang="less" scoped>
.bg {
  .level__address {
    border-radius: 4px;
    position: absolute;
    left: 10px;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.5);
    top: 6%;
    color: #fff;
    padding-right: 10px;
    /deep/ .ant-cascader-picker {
      background-color: transparent;
      .ant-input {
        border: none;
      }
      .ant-cascader-picker-label {
        color: #fff;
      }
    }
  }
  box-sizing: border-box;
  background-image: url('https://storage.360buyimg.com/gfkj-files/imgs/jby/tybigscreen/ty_bg.png');
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: relative;
  .map {
    width: 100%;
    height: 100%;
  }
  /deep/ .anchorBL {
    display: none !important;
  }
}
</style>
