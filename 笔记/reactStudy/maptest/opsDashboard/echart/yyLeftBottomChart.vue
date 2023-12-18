<template>
  <div id="yyleft__bottom">
    <ul class="con__list">
      <li class="con__inner" v-for="(item, index) in dataList" :key="index">
        <div class="inner__left">
          <img :src="item.imgUrl" alt="" v-if="index < 5" />
          <div v-else>{{ index + 1 }}</div>
        </div>
        <div class="inner__center">
          <div class="center__title">{{ item.name }}</div>
          <div class="center__range">
            <p
              class="range__color"
              :style="{
                width: `${(item.num / dataList[0].num) * 293}px`,
                background: `linear-gradient(${item.bg_linear})`
              }"
            ></p>
          </div>
        </div>
        <div class="inner__right">{{ item.num }}{{ item.unit }}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import cloneDeep from 'lodash.clonedeep'
export default {
  props: {
    leftBottomInfo: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    leftBottomInfo: {
      handler(val) {
        const newlist = cloneDeep(val)
        console.log(val, '我是获取的发电房')
        newlist.forEach((item, index) => {
          item.bg_linear = '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%'
          if (index === 0) {
            item.bg_linear = '270deg, rgba(255,254,0,1) 0%,rgba(255,160,0,1) 100%'
            item.imgUrl = 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/one.png'
          }
          if (index === 1) {
            item.bg_linear = '225deg, rgba(255,187,51,1) 0%,rgba(255,77,106,1) 100%'
            item.imgUrl = 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/two.png'
          }
          if (index === 2) {
            item.bg_linear = '90deg, rgba(242,48,210,1) 0%,rgba(255,192,154,1) 100%'
            item.imgUrl = 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/three.png'
          }
          if (index === 3) {
            item.bg_linear = '216.19deg, rgba(54,120,255,1) 0%,rgba(86,51,255,1) 100%'
            item.imgUrl = 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/four.png'
          }
          if (index === 4) {
            item.bg_linear = '270deg, rgba(187,255,153,1) 0%,rgba(26,217,255,1) 100%'
            item.imgUrl = 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/five.png'
          }
        })
        this.dataList = newlist
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      // dataList: [
      //   {
      //     name: '安国市',
      //     num: 139.45,
      //     bg_linear: '270deg, rgba(255,254,0,1) 0%,rgba(255,160,0,1) 100%',
      //     imgUrl: 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/one.png'
      //   },
      //   {
      //     name: '高阳县',
      //     num: 138.18,
      //     bg_linear: '225deg, rgba(255,187,51,1) 0%,rgba(255,77,106,1) 100%',
      //     imgUrl: 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/two.png'
      //   },
      //   {
      //     name: '徐水区',
      //     num: 137.12,
      //     bg_linear: '90deg, rgba(242,48,210,1) 0%,rgba(255,192,154,1) 100%',
      //     imgUrl: 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/three.png'
      //   },
      //   {
      //     name: '定州市',
      //     num: 136.09,
      //     bg_linear: '216.19deg, rgba(54,120,255,1) 0%,rgba(86,51,255,1) 100%',
      //     imgUrl: 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/four.png'
      //   },
      //   {
      //     name: '蠡县',
      //     num: 135.57,
      //     bg_linear: '270deg, rgba(187,255,153,1) 0%,rgba(26,217,255,1) 100%',
      //     imgUrl: 'https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/five.png'
      //   },
      //   { name: '博野县', num: 134.86, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' },
      //   { name: '曲阳县', num: 134.63, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' },
      //   { name: '望都县', num: 132.86, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' },
      //   { name: '唐县', num: 132.49, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' },
      //   { name: '涿州市', num: 132.02, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' },
      //   { name: '涞水县', num: 131.73, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' },
      //   { name: '顺平县', num: 131.66, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' }
      //   // { name: '清苑区', num: 1314.2, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' },
      //   // { name: '易县', num: 1284, bg_linear: '270deg, rgba(40,213,255,1) 0%,rgba(0,56,255,1) 100%' }
      // ]
      dataList: []
    }
  },
  mounted() {},
  methods: {},
  destroyed() {}
}
</script>

<style lang="less" scoped>
#yyleft__bottom {
  .con__list {
    padding-top: 6px;
    box-sizing: border-box;
    padding-left: 16px;

    .con__inner {
      margin-top: 10px;
      display: flex;

      .inner__left {
        width: 45px;
        height: 40px;

        img {
          width: 45px;
          height: 40px;
        }
        div {
          text-align: center;
          line-height: 40px;
          background: url(https://storage.360buyimg.com/gfkj-files/imgs/jby/screen/num_bg.png);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 32px 37px;
        }
      }

      .inner__center {
        margin: 0 9px 0 8px;

        .center__title {
          line-height: 20px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: normal;
          color: rgba(255, 255, 255, 0.8);
          margin: 5px 0 2px 0;
        }

        .center__range {
          width: 293px;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          position: relative;

          .range__color {
            width: 179px;
            max-width: 293px;
            height: 8px;
            background: linear-gradient(270deg, rgba(187, 255, 153, 1) 0%, rgba(26, 217, 255, 1) 100%);
            border-radius: 6px;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }

      .inner__right {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-end;
      }
    }
  }
}
</style>
