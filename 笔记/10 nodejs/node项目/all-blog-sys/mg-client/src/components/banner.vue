<template>
  <div id="banner" :class="{'home-banner':isHome}">
    <Lantern v-if="websiteInfo.isNewYear"/>
    <div class="banner-img" :style="{'background-image': `url(${websiteInfo.wallpaper})`}">
      <template v-if="isHome">
        <!--博主信息-->
        <div class="focusinfo">
          <!-- 头像 -->
          <div class="header-tou">
            <router-link to="/"><img class="avator" :src="websiteInfo.avatar"></router-link>
          </div>
          <!-- 简介 -->
          <div class="header-info">
            <p>{{ websiteInfo.slogan }}</p>
          </div>
          <!-- 社交信息 -->
          <div class="top-social">
            <template v-for="(item,index) in socials">
              <div v-if="item.href" :title="item.title">
                <a :href="item.href" target="_blank" :style="{'color':item.color}"><i
                    class="iconfont" :class="item.icon"></i></a>
              </div>
              <el-popover
                  v-else
                  :key="item.id"
                  placement="bottom"
                  width="100"
                  trigger="click"
                  content="el-image">
                <el-image
                    v-if="item.img"
                    style="width: 100px; height: 100px;"
                    :src="item.img"
                    :preview-src-list="[item.img]"
                    fit="contain"
                ></el-image>
                <p v-if="item.text">{{ item.text }}</p>
                <div slot="reference" :title="item.title">
                <span :style="{'color':item.color}"><i
                    class="iconfont" :class="item.icon"></i></span>
                </div>
              </el-popover>
            </template>

          </div>
        </div>
        <!--左右倾斜-->
        <div class="slant-left"></div>
        <div class="slant-right"></div>
      </template>
    </div>
  </div>
</template>

<script>

import Lantern from "@/components/lantern";
export default {
  name: "banner",
  components: {Lantern},
  data() {
    return {
      flag: -1,
      websiteInfo: {
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy_130iiorSSjF1RWgNBX7qy3evKv2HKsH0g&usqp=CAU',
        slogan: 'Be encouraged in time, time waits for no one.',
        name: 'MG′blog',
        domain: 'https://www.zhouyi.run',
        notice: '及时当勉励，岁月不待人。',
        desc: '一个It技术的探索者',
        wallpaper:'https://s1.ax1x.com/2020/05/23/YxaLMq.jpg',
        isNewYear:false
      },
      socials: []
    }
  },
  props: {
    src: {
      type: String,
      // default: 'https://s1.ax1x.com/2020/05/23/YxaLMq.jpg'
      default: 'https://s1.ax1x.com/2023/01/11/pSnmCnI.png'
    },
    isHome: {
      type: [Boolean, String],
      default: false
    }
  },
  created() {
    this.getWebSiteInfo()
    this.getSocial()
  },
  methods: {
    getSocialItem(idx) {
      this.flag = idx
    },
    getSocial() {
      this.$store.dispatch('getSocials').then(data => {
        this.socials = data
      })
    },
    getWebSiteInfo() {
      this.$store.dispatch('getSiteInfo').then(data => {
        this.websiteInfo = data
      })
    }
  }
}
</script>

<style scoped lang="less">

#banner {
  position: relative;
  margin-top: 80px;
  width: 100%;
  height: 500px;
  overflow: hidden;

  .banner-img {
    width: inherit;
    height: inherit;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 0.2s linear;
    overflow: hidden;
    //background-image: url('../assets/img/bg.jpg');
    &:hover {
      transform: scale(1.1, 1.1);
      filter: contrast(130%);
    }
  }

  &.home-banner {
    height: 550px;

    .banner-img {
      //background-position: center center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: cover;
      background-position: 0 bottom;
      z-index: -1;
      transition: unset;

      &:hover {
        transform: unset;
        filter: unset;
      }
    }
    .slant-wara {
      position: absolute;
      left: 0;
      bottom: 0;
    }
    .slant-left {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 100px solid #FFF;
      border-right: 800px solid transparent;
      left: 0;
      bottom: 0;
    }

    .slant-right {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 100px solid #FFF;
      border-left: 800px solid transparent;
      right: 0;
      bottom: 0;
    }
  }
}

.focusinfo {
  position: relative;
  max-width: 800px;
  padding: 0 10px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  text-align: center;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .header-info {
    width: 60%;
    font-size: 14px;
    color: #EAEADF;
    background: rgba(0, 0, 0, 0.56);
    padding: 20px 30px;
    margin: 30px auto 0 auto;
    font-family: miranafont, "Hiragino Sans GB", STXihei, "Microsoft YaHei", SimSun, sans-serif;
    letter-spacing: 1px;
    line-height: 30px;
    border-radius: 3px;
  }

  .top-social {
    height: 32px;
    margin-top: 30px;
    margin-left: 10px;
    list-style: none;
    font-family: miranafont, "Hiragino Sans GB", STXihei, "Microsoft YaHei", SimSun, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      margin-right: 10px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      width: 32px;
      background: white;
      border-radius: 100%;
    }

    .social-tip {
      width: 100px;
      height: 100px;
      border-radius: 5px;
    }
  }
}

@media (max-width: 960px) {
  #banner {
    height: 400px;
  }
}

@media (max-width: 800px) {
  #banner {
    display: none;
  }
}
</style>
