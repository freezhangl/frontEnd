<template>
  <div>
    <!-- 顶部滑动条区域 -->
    <div id="slider" class="mui-slider">
      <div id="sliderSegmentedControl" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <div class="mui-scroll">
          <a class="mui-control-item mui-active">推荐</a>
          <a class="mui-control-item">推荐</a>
          <a class="mui-control-item">推荐</a>
          <a class="mui-control-item">推荐</a>
          <a class="mui-control-item">热点</a>
          <a class="mui-control-item">北京</a>
          <a class="mui-control-item">社会</a>
          <a class="mui-control-item">娱乐</a>

          <!-- <a :class="['mui-control-item', item.id == 0 ? 'mui-active' : '']" v-for="item in cates" :key="item.id" @tap="getPhotoListByCateId(item.id)">
            {{ item.title }}
          </a>-->
        </div>
      </div>
    </div>

    <!-- 图片列表区域 -->
    <ul class="photo-list">
      <router-link v-for="item in list" :key="item.id" :to="'/home/photoinfo/' + item.id" tag="li">
        <img v-lazy="item.img_url">
        <div class="info">
          <h1 class="info-title">{{ item.title }}</h1>
          <div class="info-body">{{ item.zhaiyao }}</div>
        </div>
      </router-link>
    </ul>

   <vue-preview :slides="slide1" @close="handleClose"></vue-preview>

  </div>
</template>

<script>
// 1. 导入 mui 的js文件
import mui from "../../lib/mui/js/mui.min.js";

export default {
  data() {
    return {
      cates: [], // 所有分类的列表数组
      list: [], // 图片列表的数组
      slide1: [
          {
            src: 'https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_b.jpg',
            msrc: 'https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg',
            alt: 'picture1',
            title: 'Image Caption 1',
            w: 100,
            h: 100
          },
          {
            src: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_b.jpg',
            msrc: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg',
            alt: 'picture2',
            title: 'Image Caption 2',
            w: 1200,
            h: 900
          }
        ]
    };
  },
  created() {
    // this.getAllCategory();
    // 默认进入页面，就主动请求 所有图片列表的数据
    // this.getPhotoListByCateId(0);
  },
  mounted() {
    // 当 组件中的DOM结构被渲染好并放到页面中后，会执行这个 钩子函数
    // 如果要操作元素了，最好在 mounted 里面，因为，这里时候的 DOM 元素 是最新的
    // 2. 初始化滑动控件
    mui(".mui-scroll-wrapper").scroll({
      deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
  },
  methods: {
    handleClose () {
        console.log('close event')
      }
    
    // getAllCategory() {
    //   // 获取所有的图片分类
    //   this.$http.get("api/getimgcategory").then(result => {
    //     if (result.body.status === 0) {
    //       // 手动拼接出一个最完整的 分类列表
    //       result.body.message.unshift({ title: "全部", id: 0 });
    //       this.cates = result.body.message;
    //     }
    //   });
    // },
    // getPhotoListByCateId(cateId) {
    //   // 根据 分类Id，获取图片列表
    //   this.$http.get("api/getimages/" + cateId).then(result => {
    //     if (result.body.status === 0) {
    //       this.list = result.body.message;
    //     }
    //   });
    // }
  }
};
</script>


<style lang="scss" scoped>
* {
  touch-action: pan-y;
}

.photo-list {
  list-style: none;
  margin: 0;
  padding: 10px;
  padding-bottom: 0;
  li {
    background-color: #ccc;
    text-align: center;
    margin-bottom: 10px;
    box-shadow: 0 0 9px #999;
    position: relative;
    img {
      width: 100%;
      vertical-align: middle;
    }
    img[lazy="loading"] {
      width: 40px;
      height: 300px;
      margin: auto;
    }

    .info {
      color: white;
      text-align: left;
      position: absolute;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      max-height: 84px;
      .info-title {
        font-size: 14px;
      }
      .info-body {
        font-size: 13px;
      }
    }
  }
}
</style>
