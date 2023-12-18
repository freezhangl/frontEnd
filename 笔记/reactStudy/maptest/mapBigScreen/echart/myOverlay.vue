<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ sample: true, active }"
    pane="labelPane"
    @draw="draw"
    @mouseover.native="active = true"
    @mouseleave.native="active = false"
    @click="customOverlayClick"
  >
    {{ position.stationCount }}
  </bm-overlay>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      active: false
    }
  },
  watch: {
    position: {
      handler(val) {
        console.log(val, '我是传进来的值')
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
    customOverlayClick(val) {
      console.log(val, '给付对价')
    },
    handleClick() {
      // global.alert('Well done.')
      console.log(123)
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x + 'px'
      el.style.top = pixel.y - 40 + 'px'
    }
  }
}
</script>

<style lang="less" scoped>
.sample {
  width: 40px;
  height: 40px;
  font-size: 12px;
  line-height: 40px;
  background: red;
  overflow: hidden;
  -webkit-box-shadow: 0 0 5px #000;
  box-shadow: 0 0 5px #000;
  color: #fff;
  word-wrap: break-word !important;
  text-align: center;
  border-radius: 50%;
  position: absolute;
}
.sample.active {
  background: rgba(0, 0, 0, 0.75);
  color: #ffffff;
}
</style>
