<template>
  <div id="bigscreen__map" ref="bigscreen__map">
    <dv-full-screen-container class="bg">
      <a-form-model-item label="" ref="addressRef" class="level__address" style="margin-bottom:0px">
        <a-cascader
          :options="addressOptions"
          :load-data="value => loadNextData(value)"
          change-on-select
          v-model="levelFouraddress"
          :fieldNames="{ label: 'name', value: 'areaCode', children: 'children' }"
          @change="onAddressChange"
          placeholder="请选择服务地址"
        />
      </a-form-model-item> 
      <baidu-map class="map" :center="mapCenter" :zoom="zoom" @ready="handlerLoad" @click="clickEvent">
        <bm-navigation type="BMAP_NAVIGATION_CONTROL_LARGE" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-map-type :map-types="['BMAP_HYBRID_MAP', 'BMAP_NORMAL_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
        <!-- <bm-map-type :map-types="['BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type> -->
        <!-- <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list> -->
        <!-- <bm-marker :position="markerPoint" :dragging="true" @click="infoWindowOpen">
          <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen">我爱北京天安门</bm-info-window>
        </bm-marker> -->
        <!-- <template v-for="(item, index) in markers">
          <bm-marker
            :key="index"
            :position="item.markerPoint"
            @click="look(item)"
            animation="BMAP_ANIMATTION_DROP"
          ></bm-marker>
        </template> -->
        <my-overlay :position="markPosition"> </my-overlay>
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
import { getListData } from '@/api/spare/index'
import { getListData1 } from '@/api/cwApi/index'
import screenfull from 'screenfull'
import { mapGetters } from 'vuex'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const isWidthMax = screenWidth / 1920 >= screenHeight / 1080
export default {
  name: 'TyBigScreen',
  data() {
    return {
      addressOptions: [],
      levelFouraddress: [],
      addressData: {},
      formData: {},
      rightTopInfo: {},
      rightCenterInfo: {},
      rightCenterInfoNew: {},
      markers: [],
      markPosition: {},
      form: {},
      position: {},
      mapObj: [
        { lng: 114.64, lat: 38.04 },
        { lng: 113.64, lat: 31.04 },
        { lng: 0, lat: 0 }
      ],
      mapCenter: { lng: 0, lat: 0 },
      zoom: 15,
      mapLocation: {
        address: '',
        coordinate: ''
      },
      origin:
        window.location.origin.indexOf('test') > 0 || window.location.origin.indexOf('localhost') > 0
          ? 'http://test-ty-gxf.jd.com'
          : window.location.origin,
      isFullscreen: false,
      loading: false,
      dataObject: {},
      timer: null,
      timeObj: {},
      scaleNum: 1,
      windowRatio: 100,
      screenScaleNum: 1,
      BMap: null,
      map: null,
      points: [114.64, 38.04]
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
  },
  computed: {
    ...mapGetters(['menusidebar'])
  },
  mounted() {
    this.loadNextData()
    this.windowRatio = this.getRatio()
    const timerOut = setTimeout(() => {
      const fullConmtentWidth = document.querySelector('.layout__content').offsetWidth
      this.scaleNum = fullConmtentWidth / 1920
      this.setscreenTyAttr(this.scaleNum, 'height', 1080 * this.scaleNum + 'px')
      // document.querySelector('#dv-full-screen-container').style.zoom = screenWidth / 1920
      clearTimeout(timerOut)
    })
    this.init()
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
  methods: {
    init(addressCode) {
      this.getRightTopData(addressCode)
      this.getrightCenterInfo(addressCode)
      this.getrightCenterInfoNew(addressCode)
    },
    getrightCenterInfoNew(addressCode = []) {
      // 最近7天
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : '',
        townCode: addressCode?.length ? addressCode[3] : ''
      }
      getListData('/power/mapScreen/lastSevenDaysEnergy', 'GET', {
        params
      }).then(res => {
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
          xList: res.data?.xaxis?.data,
          yList: res.data?.series[0]?.data
        }
      })
    },
    getrightCenterInfo(addressCode = []) {
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : '',
        townCode: addressCode?.length ? addressCode[3] : ''
      }
      getListData1('/power/opsDashboard/queryDayPower', 'POST', {
        params
      }).then(res => {
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
          xList: res.data?.xaxis?.data,
          yList: res.data?.series[0]?.data
        }
      })
    },
    getRightTopData(addressCode = []) {
      const params = {
        provinceCode: addressCode?.length ? addressCode[0] : '',
        cityCode: addressCode?.length ? addressCode[1] : '',
        countyCode: addressCode?.length ? addressCode[2] : '',
        townCode: addressCode?.length ? addressCode[3] : ''
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
    look(item) {
      this.form = item
      console.log(this.form, '我是表单')
      this.position = item.markerPoint
      this.show = true
    },
    clickEvent(e) {
      this.mapCenter = e.point
      this.markPosition = e.point
      const geocoder = new this.BMap.Geocoder()
      geocoder.getLocation(e.point, rs => {
        this.mapLocation.address = rs.address
        // console.log(rs.address, '我是具体的地址')
        // console.log(rs.addressComponents, '结构化的地址描述')
        console.log(rs.addressComponents.province, '哪个省')
        console.log(rs.addressComponents.city, '哪个市')
      })
    },
    handlerLoad({ BMap, map }) {
      console.log(BMap, map)
      this.BMap = BMap
      this.map = map
      this.map.enableScrollWheelZoom(true)
      this.mapCenter.lng = 116.404
      this.mapCenter.lat = 39.915
      this.zoom = 6
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
    left: 0;
    border-radius: 4px;
    position: absolute;
    left: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.5);
    top: 6%;
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
