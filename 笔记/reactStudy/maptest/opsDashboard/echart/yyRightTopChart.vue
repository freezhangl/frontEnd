<template>
  <div id="yyright__top" style="width:100%;height:100%;"></div>
</template>

<script>
import { getListData } from '@/api/cwApi/index'
import moment from 'moment'
// const echarts = require('echarts')
export default {
  props: {
    rightTopInfo: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    rightTopInfo: {
      handler(val) {
        console.log(val, '我获取到了数据each')
        this.option.xAxis.data = val?.xList
        this.option.series[0].data = val?.yList
        this.option.series[0].type = val?.type || 'line'
        this.option.series[0].name = val?.name + '(' + val?.unit + ')'
        this.$nextTick(() => {
          if (this.myChartPieRight) {
            this.myChartPieRight.clear()
          }
          this.myChartPieRight.setOption(this.option)
        })
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      myChartPieRight: null,
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
          backgroundColor: 'rgba(255,255,255,0.1)',
          textStyle: {
            color: '#fff'
          },
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              backgroundColor: '#7B7DDC'
            }
          }
        },
        legend: {
          show: false,
          data: ['已贯通'],
          textStyle: {
            color: '#B4B4B4'
          },
          top: '0%'
        },
        grid: {
          x: '16%',
          width: '80%',
          y: '5%',
          height: '85%'
        },
        xAxis: {
          data: [],
          axisLine: {
            lineStyle: {
              color: '#B4B4B4'
            }
          },
          axisLabel: {
            interval: 'auto'
            // rotate: 50 // 设置倾斜角度，数值 可设置 正负 两种，
          },
          axisTick: {
            show: false
          }
        },
        yAxis: [
          {
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: '#B4B4B4'
              }
            },
            axisLabel: {
              formatter: '{value} '
            }
          },
          {
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: '#B4B4B4'
              }
            },
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: '光伏发点量',
            areaStyle: {
              opacity: 1,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(0,133,255,0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(0,116,189,0)'
                }
              ])
            },
            type: 'line',
            smooth: true,
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: 'rgba(0, 222, 255, 1)'
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted() {
    this.drawPie()
    // this.getData()
  },
  methods: {
    getData() {
      getListData(`${window.location.origin}/cwapi/comLine/getStAComRkLine.htm`, 'GET', {
        // getListData(`/cwapi/comLine/getStAComRkLine.htm`, 'GET', {
        params: {
          date: moment(new Date()).format('YYYY-MM-DD'),
          queryType: 1
        }
      }).then(res => {
        this.$set(this.option.xAxis, 'data', res.body.data.dtime)
        this.$set(this.option.series[0], 'data', res.body.data.real_kwh_chk)
        // this.$set(this.option.series[1], 'data', res.body.echarts_sun)
      })
      this.myChartPieRight.setOption(this.option)
    },
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      this.myChartPieRight = this.$echarts.init(document.getElementById('yyright__top'))
      // 响应式变化
      window.addEventListener('resize', () => this.myChartPieRight.resize(), false)
    }
  },
  destroyed() {
    window.onresize = null
  }
}
</script>

<style lang="less" scoped></style>
