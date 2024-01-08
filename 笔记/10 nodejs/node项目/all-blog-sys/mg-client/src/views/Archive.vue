<template>
  <div class="home" style=" padding-top: 80px;">
    <hr class="hr" style="margin-bottom: 0px">
    <div class="site-content animate">

      <div class="chart-box" style="width: 100%;overflow: auto">
        <common-chart :charData="charData" :key="count" :Max="Max"/>
      </div>
      <div class="month-box">
        <div class="month-item" v-for="item in monthData">
          <div class="month-left">{{ item.mouth }}月</div>
          <div class="month-right">{{ item.count }}篇</div>
        </div>
      </div>
      <!--文章列表-->
      <!--      <main class="site-main grid-line" style="margin-top: -50px" :class="{'search':hideSlogan}" v-loading="loading">-->
      <!--        <section-title class="st" v-if="!hideSlogan">文章归档</section-title>-->
      <!--        <el-timeline >-->
      <!--          <template v-for="(item,index) in postList">-->
      <!--            <el-timeline-item-->
      <!--                color="#ff8b89"-->
      <!--                type="success "-->
      <!--                :timestamp="item.createdAt | parseTimeFull" placement="top">-->
      <!--              <div style="padding-top: 15px;">-->
      <!--                <post :showLine="false" class="post-i" :style="{'animation-delay':0.2+'s'}" :post="item"-->
      <!--                      :key="item.id"></post>-->
      <!--                <hr class="post-hr">-->
      <!--              </div>-->
      <!--            </el-timeline-item>-->
      <!--          </template>-->
      <!--        </el-timeline>-->
      <!--      </main>-->
      <main class="site-main grid-line" style="margin-top: -50px" :class="{'search':hideSlogan}" v-loading="loading">
        <section-title class="st" v-if="!hideSlogan">
          <div style="display: flex;justify-content: flex-start;align-items: center">
            <span style="padding-top: 8px">文章归档</span>
            <small-ico/>
          </div>
        </section-title>
        <el-timeline>
          <el-timeline-item
            color="#ff8b89"
            type="success"
            :timestamp="monthDataCount" placement="top">
            <div style="padding-top: 15px;">
              <hr class="post-hr">
            </div>
          </el-timeline-item>
          <template v-for="(item,index) in monthData">
            <el-timeline-item
              color="#ff8b89"
              type="success"
              :timestamp="item.mouth+'('+ item.count + '篇)'" placement="top">
              <div style="padding-top: 15px;">
                <ul class="archive-list">
                  <li class="archive-list-item" v-for="(iitem,index) in item.list" :data-id="item.idList[index]">
                    <router-link :to="`/article/${item.idList[index]}`">
                      <div class="archive-list-item-info">
                        <span class="archive-list-item-text">· {{ iitem }}</span>
                        <span class="archive-list-item-time">📅 {{ item.timeList[index] }}</span>
                      </div>
                    </router-link>
                  </li>
                </ul>
                <hr class="post-hr">
              </div>
            </el-timeline-item>
          </template>
        </el-timeline>
      </main>
      <!--加载更多-->
      <!--      <div class="more" v-show="hasNextPage">-->
      <!--        <div class="more-btn" @click="loadMore">More</div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import Banner from '@/components/banner'
import Feature from '@/components/feature'
import sectionTitle from '@/components/section-title'
import Post from '@/components/post'
import SmallIco from '@/components/small-ico'
import Quote from '@/components/quote'
import {fetchFocus, fetchList} from '../api'
import {dirArticle, getArticleGroup} from "../api/article";
import CommonChart from "../components/mg-chart";

export default {
  name: 'Home',
  props: ['cate', 'words'],
  data() {
    return {
      count: 0,
      fresh: 0,
      monthData: [],
      charData: [],
      Max: 0,
      postList: [],
      currPage: 1,
      monthDataCount: '已更新0篇文章，继续努力!',
      loading: false,
      sectionTitle: '所有文章',
      hasNextPage: false,
      query: {
        //查询推荐并且按是否顶置查询
        params: {},
        limit: 20,//每页条数
        offset: 1,//当前页
        sort: {
          prop: 'createdAt',
          order: 'desc',
        },
        // group: 'id',
      },
    }
  },
  components: {
    CommonChart,
    Banner,
    Feature,
    sectionTitle,
    Post,
    SmallIco,
    Quote
  },

  computed: {
    searchWords() {
      return this.$route.params.words
    },
    category() {
      return this.$route.params.cate
    },
    hideSlogan() {
      return this.category || this.searchWords
    },
    notice() {
      return this.$store.getters.notice
    }
  },
  methods: {
    getDataList() {
      this.loading = true
      getArticleGroup(this.query).then(res => {
        let datas = res.data || []
        let tMonthData = res.monthData || []
        this.count = res.count
        for (const tMonthDataItem of tMonthData) {
          tMonthDataItem.list = tMonthDataItem.list.split(',')
          tMonthDataItem.idList = tMonthDataItem.idList.split(',')
          tMonthDataItem.timeList = tMonthDataItem.timeList.split(',')
        }
        this.monthData = tMonthData
        this.monthDataCount = '📢已更新 ' + this.monthData.reduce((c, R) => c + R.count, 0) + ' 篇文章，继续努力!'
        this.charData = res.dayData
        let max = 0
        for (const charData of this.charData) {
          if (charData[1] > max) {
            max = charData[1]
          }
        }
        this.Max = max
        for (const data of datas) {
          this.postList.push(data)
        }

        this.loading = false
        this.query.offset = res.current + 1
        this.hasNextPage = this.postList.length < res.count
      }).catch(err => {
        this.loading = false
      })
    },

    loadMore() {
      this.getDataList()
    },

  },
  mounted() {
    this.getDataList();
  }
}
</script>
<style scoped lang="less">
.archive-list {
  padding-bottom: 15px;

}

.archive-list-item {
  padding: 8px 0;
  transition: all .2s linear;

  &:hover {
    color: #ee642b;

    .archive-list-item-time {
      color: #ee642b;
    }
  }

  &-time {
    font-size: 12px;
    color: #b4b4b4;
    width: 165px;
  }


  &-text {
    width: calc(100% - 175px);
    display: inline-block;
    line-height: 22px;

  }

  &-info {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap

  }
}

.site-content {
  .notify {
    margin: 60px 0;
    border-radius: 3px;

    & > div {
      padding: 20px;
    }
  }

  .st {
    margin-bottom: 40px
  }

  .search-result {
    padding: 15px 20px;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    border: 1px dashed #ddd;
    color: #828282;
  }
}

.top-feature {
  width: 100%;
  height: auto;
  margin-top: 30px;

  .feature-content {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    position: relative;

    .feature-item {
      width: 32.9%;
    }
  }
}

.site-main {
  padding-top: 80px;

  &.search {
    padding-top: 0;
  }
}

.post-hr {
  margin: 0px;
  margin-top: -25px
}

.more {
  margin: 50px 0;

  .more-btn {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #ADADAD;
    border: 1px solid #ADADAD;
    border-radius: 20px;
    margin: 0 auto;
    cursor: pointer;

    &:hover {
      color: #8fd0cc;
      border: 1px dashed #8fd0cc;
    }
  }
}

/******/
@media (max-width: 800px) {
  .top-feature, .chart-box, .month-box, .hr {
    display: none;
  }

  .site-main {
    padding-top: 0px;

    .st {
      margin-bottom: 15px
    }
  }

  .archive-list-item-time {
    display: none;
  }

  .archive-list-item-text {
    width: 100%;
  }

  .site-content {
    .notify {
      margin: 30px 0 0 0;
    }

    .search-result {
      margin-bottom: 20px;
      font-size: 16px;
    }
  }
}

.post-hr {
  margin: 0px;
}

/******/
.post-i {
  animation: one-in 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

}

@keyframes one-in {
  from {
    padding-top: 100px;
    height: 0%;
  }
  to {
    padding-top: 0px;
    height: 100%;
  }
}
</style>
<style lang="less">
hr {
  margin: 40px 0;
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 109, 109, 0.75), rgba(0, 0, 0, 0));
}

.month-box {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  border-radius: 5px;
  border: 1px dotted #bdbbbb;

  .month-item {
    width: 140px;
    height: 30px;
    background-color: #efefef;
    border-radius: 3px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-content: center;
    line-height: 30px;
    text-align: center;
    box-sizing: border-box;
    margin: 8px 3px;

    .month-left {
      width: 80px;
      border-right: 1px solid #fff;

    }

    .month-right {
      width: 50px;
      background-color: #f3f2f2;
    }

  }
}
</style>
