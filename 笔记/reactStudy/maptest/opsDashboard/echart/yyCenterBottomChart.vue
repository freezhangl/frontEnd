<template>
  <div id="yycenter__bottom" style="width:100%;height:100%;"></div>
</template>

<script>
// import { getListData } from '@/api/cwApi/index'
// import qs from 'qs'
// import moment from 'moment'
export default {
  props: {
    centerBottomInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      option: {
        title: {
          text: '',
          x: 'center',
          y: 0,
          textStyle: {
            color: '#B4B4B4',
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.3)',
          textStyle: {
            color: '#fff'
          },
          axisPointer: {
            show: false,
            type: 'shadow',
            label: {
              show: true,
              backgroundColor: '#7B7DDC'
            }
          }
        },
        legend: {
          show: true,
          // data: ['实发功率(kW)', '光照强度(W/m³)'],
          data: ['实发功率(kw.h)'],
          textStyle: {
            color: '#B4B4B4'
          },
          top: '0%',
          right: '-10%'
        },
        grid: {
          x: '6%',
          width: '88%',
          y: '8%',
          height: '80%'
        },
        xAxis: {
          data: [],
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            interval: 'auto'
            // rotate: 50 // 设置倾斜角度，数值 可设置 正负 两种，
          },
          axisTick: {
            show: true
          }
        },
        yAxis: [
          {
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                // color: '#B4B4B4'
                color: '#fff'
              }
            },
            axisLabel: {
              formatter: '{value} '
            }
          }
          // {
          //   type: 'value',
          //   name: '',
          //   formatter: '{value} %',
          //   show: true,
          //   nameTextStyle: {
          //     color: '#FFFFFF',
          //     fontSize: 10
          //   },
          //   splitLine: {
          //     show: false
          //   },
          //   axisLabel: {
          //     show: true,
          //     textStyle: {
          //       color: '#FFFFFF',
          //       fontSize: 10
          //     }
          //   },
          //   axisLine: {
          //     show: false
          //   },
          //   axisTick: {
          //     show: false
          //   }
          // }
        ],
        series: [
          {
            name: '实发功率',
            type: 'line',
            barWidth: 10,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(0,133,255,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(0,116,189,0)'
                }
              ])
            },
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: 'rgba(0,222,255,1)'
              }
            },
            smooth: true,
            data: []
          }
          // {
          //   name: '光照强度',
          //   type: 'line',
          //   yAxisIndex: 1,
          //   barWidth: 10,
          //   areaStyle: {
          //     opacity: 0.8,
          //     color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //       {
          //         offset: 0,
          //         color: 'rgba(47,248,163,1)'
          //       },
          //       {
          //         offset: 1,
          //         color: 'rgba(0,222,255,0)'
          //       }
          //     ])
          //   },
          //   smooth: true,
          //   itemStyle: {
          //     normal: {
          //       barBorderRadius: 5,
          //       color: 'rgba(47,248,163,1)'
          //     }
          //   },
          //   data: [3, 5, 6, 8, 9]
          // }
        ]
      }
    }
  },
  watch: {
    centerBottomInfo: {
      handler(val) {
        console.log(val, '我获取到了数据each')
        this.option.xAxis.data = val?.xList
        this.option.series[0].data = val?.yList
        this.option.series[0].type = val?.type || 'line'
        this.$nextTick(() => {
          if (this.myChartPieLeft) {
            this.myChartPieLeft.clear()
          }
          this.myChartPieLeft.setOption(this.option)
        })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.drawPie()
    // this.getData()
  },
  methods: {
    getData() {
      // getListData(`${window.location.origin}/cwapi/pv/monitorData/getPvRunAcpTimeList.htm`, 'GET', {
      // // getListData(`/cwapi/pv/monitorData/getPvRunAcpTimeList.htm`, 'GET', {
      //   params: {
      //     date: moment(new Date()).format('YYYY-MM-DD'),
      //     dataType: 2,
      //     dateType: 3,
      //     queryType: 1,
      //     stime: 0
      //   }
      // }).then(res => {
      //   this.$set(this.option.xAxis, 'data', res.body.echarts_xaTime)
      //   this.$set(this.option.series[0], 'data', res.body.echarts_shd_p)
      //   this.$set(this.option.series[1], 'data', res.body.echarts_sun)
      //   this.myChartPieLeft.setOption(this.option)
      // })
      this.myChartPieLeft.setOption(this.option)
    },
    drawPie() {
      this.myChartPieLeft = this.$echarts.init(document.getElementById('yycenter__bottom'))
      // 响应式变化
      window.addEventListener('resize', () => this.myChartPieLeft.resize(), false)
    }
  },
  destroyed() {
    window.onresize = null
  }
}
</script>

<style lang="less" scoped></style>
