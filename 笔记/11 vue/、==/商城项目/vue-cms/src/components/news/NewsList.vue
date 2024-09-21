<template>
  <div>
    
    <ul class="mui-table-view">
      <li class="mui-table-view-cell mui-media">
        <router-link to="/home/newsinfo/4">
          <img class="mui-media-object mui-pull-left" src="https://assets.gitlab-static.net/uploads/-/system/user/avatar/3530422/avatar.png?width=23">
          <div class="mui-media-body">
            <h1>幸福</h1>
            <p class='mui-ellipsis'>
              <span>发表时间：{{ add_time | dateFormat}}</span>
              <span>点击：4次</span>
            </p>
          </div>
        </router-link>
      </li>
    </ul>

  </div>
</template>
<script>
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      newslist: [], // 新闻列表
      add_time:new Date()
    };
  },
  created() {
    // this.getNewsList();
  },
  methods: {
    // getNewsList() {
    //   // 获取新闻列表
    //   this.$http.get("api/getnewslist").then(result => {
    //     if (result.body.status === 0) {
    //       // 如果没有失败，应该把数据保存到 data 上
    //       this.newslist = result.body.message;
    //     } else {
    //       Toast("获取新闻列表失败！");
    //     }
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
.mui-table-view {
  li {
    h1 {
      font-size: 14px;
    }
    .mui-ellipsis {
      font-size: 12px;
      color: #226aff;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
