<template>
  <div id="yyleft__center">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <div class="d-flex">
          <span class="fs-xxxl text mx-2">发电量</span>
          <dv-decoration-1 style="width:100px;height:20px; position:relative;top:-3px;" />
        </div>
      </div>
      <div class="text__box">
        <!-- <div class="text__line">
          <p>总装机量：</p>
          <dv-digital-flop :config="config1" style="width:100%;height:40px;" />
        </div> -->
        <div class="text__line">
          <p>年发电量：</p>
          <dv-digital-flop :config="config2" style="width:100%;height:40px;" />
        </div>
        <div class="text__line">
          <p>年发电小时数：</p>
          <dv-digital-flop :config="config3" style="width:100%;height:40px;" />
        </div>
        <div class="text__line count">
          <p>当日发电量：</p>
          <countTo :textNumber="textNumber" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from '@/components/countTo'
export default {
  props: {
    dataObject: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      textNumber: 0,
      // config1: {
      //   number: [272.51],
      //   content: '{nt}MW',
      //   toFixed: 2,
      //   textAlign: 'left',
      //   style: {
      //     fontSize: 30,
      //     fill: '#3de7c9'
      //   }
      // },
      config2: {
        number: [0],
        content: '{nt}万度',
        toFixed: 1,
        textAlign: 'left',
        style: {
          fontSize: 30,
          fill: '#3de7c9'
        }
      },
      config3: {
        number: [0],
        content: '{nt}h',
        toFixed: 1,
        textAlign: 'left',
        style: {
          fontSize: 30,
          fill: '#3de7c9'
        }
      }
    }
  },
  watch: {
    dataObject: {
      handler: function (newval, oldval) {
        if (newval && newval.day) {
          this.textNumber = newval.day.data.dwOrigin
          this.$set(this.config2.number, 0, newval.year.data.real_kwh_chk)
          this.$set(this.config3.number, 0, newval.year.data.real_hours)
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    countTo
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="less" scoped>
#yyleft__center {
  padding: 1rem;
  height: 100%;
  min-width: 300px;
  border-radius: 5px;
  .bg-color-black {
    height: 100%;
    border-radius: 10px;
      display: grid;
      grid-template-rows: 10% 90%;
    .text__box{
      width: 100%;
      margin-top: 30px;
      display: grid;
      grid-template-rows: 20% 20% 40%;
      .text__line{
        display: grid;
        grid-template-columns: 25% 75%;
        justify-items: end;
        align-items: center;
        &.count{
        justify-items: start;
        p{
          width:100%;
          text-align:right;
        }
        }
      }
    }
  }
  .text {
    color: #c3cbde;
  }
}
</style>
