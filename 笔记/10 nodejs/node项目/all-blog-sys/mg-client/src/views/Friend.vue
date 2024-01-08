<template>
  <div class="friend">
    <div class="site-content">
      <section-title>
        <div class="friend-header">
          <div class="title">友链</div>
          <div class="apply">
            <router-link to="/about#Guestbook">+ 加入</router-link>
          </div>
        </div>
      </section-title>
      <!---说明--->
      <div class="statement">
        <p style="margin-bottom: 10px">首先将需要接入本博客站点，然后给我
          <router-link to="/about#Guestbook">私信/留言</router-link>
          提供您站点的如下信息：
        </p>
        <quote>
          <p>站点名称：{{ websiteInfo.name }}</p>
          <p>站点链接：{{ websiteInfo.domain }}</p>
          <p>简短描述：{{ websiteInfo.desc }}</p>
        </quote>
        <p style="margin-top: 10px">接入成功后将会以邮件的方式通知。</p>
      </div>
      <!----->
      <hr/>
      <div class="friend-list animate">
        <div class="friend-item" v-for="item in list" :key="item.id">
          <a target="_blank" :href="item.path">
            <div class="site-name">🌍{{ item.siteName }}</div>
            <div class="site-detail" :title="item.desc">{{ item.desc }}</div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sectionTitle from '@/components/section-title'
import Quote from "@/components/quote";
import {fetchFriend} from '../api'
import {dirFriendsList} from "../api/friends";

export default {
  name: "Friend",
  data() {
    return {
      websiteInfo: {},
      list: [],
      query: {}
    }
  },
  components: {
    Quote,
    sectionTitle
  },
  methods: {
    fetchFriend() {
      dirFriendsList(this.query).then(res => {
        this.list = res.data || []
      }).catch(err => {
        console.log(err)
      })
    },
    getWebSiteInfo() {
      this.$store.dispatch('getSiteInfo').then(data => {
        this.websiteInfo = data
      })
    }
  },
  mounted() {
    this.getWebSiteInfo();
    this.fetchFriend();
  }
}
</script>

<style scoped lang="less">
.friend {
  padding-top: 40px;
}

.friend-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 80px;
  font-weight: 400;

  .title {
    font-size: 20px;
  }

  .apply:hover {
    color: #ff6d6d;
  }
}

.statement {
  margin: 60px 0 20px 0;
  font-size: 15px;

  a {
    color: #ff6d6d;
  }

  p {
    line-height: 2rem;
  }
}

hr {
  margin: 40px 0;
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 109, 109, 0.75), rgba(0, 0, 0, 0));
}

.friend-list {
  width: 100%;

  .friend-item {
    display: inline-block;
    width: 30%;
    /*height: 100px;*/
    margin: 0 5% 20px 0;
    padding: 10px 30px;
    border: 1px solid #cecece;
    border-radius: 3px;
    position: relative;
    background-color: #fff;


    &:nth-of-type(3n) {
      margin-right: 0;
    }

    &:before {
      content: '';
      background: linear-gradient(to right, rgba(0, 0, 0, 0), #8fd0cc, #8fd0cc);
      padding: 2px;
      width: 100%;
      border-radius: 3px;
      top: -6px;
      right: -6px;
      position: absolute;
      z-index: -1;
      bottom: 4px;
      -ms-transform: rotate(3deg);
      -webkit-transform: rotate(3deg);
      transform: rotate(3deg);
      transition: all .3s linear;
    }

    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      &:before {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
    }

    .site-name, .site-detail {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-bottom: 10px;
      line-height: 1.5rem;
    }

    .site-name {
      color: #8fd0cc;
      border-bottom: 1px dotted #ECECEC;
    }

    .site-detail {
      font-size: 13px;
      padding-top: 10px;
    }
  }
}

/*******/
@media (max-width: 800px) {
  .friend-header {
    margin-top: 0;
  }

  .friend-list {
    .friend-item {
      width: 45%;

      &:nth-of-type(2n) {
        margin-right: 0;
      }

      &:nth-of-type(3n) {
        margin-right: 5%;
      }
    }
  }
}

@media (max-width: 600px) {
  .friend-list {
    .friend-item {
      display: block;
      width: 90%;
      margin: 0 auto 20px auto;

      &:nth-of-type(2n) {
        margin-right: auto;
      }

      &:nth-of-type(3n) {
        margin-right: auto;
      }
    }
  }
}
</style>
