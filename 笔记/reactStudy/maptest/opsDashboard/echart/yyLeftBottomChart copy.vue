<template>
  <div id="yyleft__bottom" style="width:100%;height:100%;"></div>
</template>

<script>
// const echarts = require('echarts')
export default {
  data() {
    return {}
  },
  mounted() {
    this.drawPie()
  },
  methods: {
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      const myChartPieLeft = this.$echarts.init(
        document.getElementById('yyleft__bottom')
      )
      //  ----------------------------------------------------------------
      const category = [
      '曲阳县', '唐县', '安国市', '顺平县', '涿州市', '徐水区', '清苑区', '高阳县', '蠡县', '易县', '望都县', '定州市', '涞水县', '顺平县', '博野县'
      ]
      const barData = [1346.3, 1324.9, 1394.5, 1316.6, 1320.2, 1371.2, 1314.2, 1381.8, 1355.7, 1284, 1328.6, 1360.9, 1317.3, 1348.6]
      const option = {
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
          x: '15%',
          width: '80%',
          y: '4%'
        },
        xAxis: {
          data: category,
          axisLabel: {
            interval: 'auto',
            rotate: 50 // 设置倾斜角度，数值 可设置 正负 两种，
          },
          axisLine: {
            lineStyle: {
              color: '#B4B4B4'
            }
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
            name: '发电小时数',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#956FD4' },
                  { offset: 1, color: '#3EACE5' }
                ])
              }
            },
            data: barData
          }
        ]
      }
      myChartPieLeft.setOption(option)
      // -----------------------------------------------------------------
      // 响应式变化
      window.addEventListener('resize', () => myChartPieLeft.resize(), false)
    }
  },
  destroyed() {
    window.onresize = null
  }
}
</script>

<style lang="less" scoped>
</style>
