<template>
  <div class="tabs-view" id="tabs-view">
    <scroll-pane ref="scrollPane">
      <div class="tabs-view-wrapper">
        <router-link
          v-for="tab in unFoldTabs"
          ref="tab"
          :key="tab.path"
          :class="isActive(tab)?'active':''"
          :to="{ path: tab.path, query: tab.query, fullPath: tab.fullPath }"
          tag="span"
          class="tabs-view-item">
          {{ tab.title }}
          <span v-if="!tab.meta.isChannelHome" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tab)"/>
        </router-link>
      </div>
    </scroll-pane>
    <el-dropdown v-if="showMore">
      <span class="self-dropdown">更多<i class="el-icon-arrow-down" style="padding-top: 3px"></i></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in foldTabs" :key="item.path">
          <router-link
            class="self-dropdown-item"
            :to="{ path: item.path, query: item.query, fullPath: item.fullPath }"
            :class="isActive(item)?'active':''"
            tag="span">
            <span class="self-dropdown-item-title">{{item.title}}</span>
            <i class="el-icon-close self-dropdown-item-icon" @click.prevent.stop="closeSelectedTag(item)"></i>
          </router-link>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import { mapGetters } from 'vuex'

export default {
  name: 'tabsView',
  data () {
    return {
      unFoldTabs: [],
      foldTabs: [],
      showMore: false
    }
  },

  watch: {
    $route (to, from) {
      //首页不添加tab页签，无breadTitle的也不需要添加
      if (this.$route.path !== '/home' && this.$route.meta.breadTitle) {
        console.log(this.$route, '我执行了12', from)
        this.addTags(from)
        // this.moveToCurrentTag()
      } else {
        this.$store.commit('TABSVIEW/DEL_ALL_VISITED_VIEW')
      }
    },
    visitedViews: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.$nextTick(() => {
          // console.log(this.$refs.scrollPane.$el.offsetWidth, val)
          if (val && val.length) {
            let tabLength = 0
            this.unFoldTabs = []
            this.foldTabs = []
            val.forEach(item => {
              tabLength = tabLength + (item.title.length + 1) * 15 + 22
              if ((this.showMore && tabLength < this.$refs.scrollPane.$el.offsetWidth) || (!this.showMore && tabLength < this.$refs.scrollPane.$el.offsetWidth - 50)) {
                this.unFoldTabs.push(item)
              } else {
                this.foldTabs.push(item)
              }
            })
            this.showMore = !!this.foldTabs.length
          }
          // console.log(this.unFoldTabs, this.foldTabs)
        })
      }
    }
  },

  components: {
    ScrollPane
  },

  computed: {

    ...mapGetters({
      visitedViews: 'TABSVIEW/getVisitedViews' // 获取打开的页面
    })

  },

  methods: {
    isActive (route) {
      return route.path === this.$route.path
    },

    closeSelectedTag (view) {
      this.$store.commit('TABSVIEW/DEL_VISITED_VIEW', view)
      this.$nextTick(() => {
        if (this.isActive(view)) {
          this.toLastView(this.visitedViews, view)
        }
      })
    },

    toLastView (visitedViews, view) {
      let latestView = visitedViews.slice(-1)[0]
      // let latestView = visitedViews[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        if (view.name === 'Home') {
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },

    addTags (from) {
      const { name, meta } = this.$route // 获取this.$route中的name字段
      if (name) {
        let obj = {
          newRoute: this.$route,
          oldRoute: from
        }
        this.$store.commit('TABSVIEW/ADD_VISITED_VIEW', obj)
      }
      return false
    },

    moveToCurrentTag () {
      const tabs = this.$refs.tab
      this.$nextTick(() => {
        if (tabs) {
          for (const tab of tabs) {
            if (tab.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tab)
              if (tab.to.fullPath !== this.$route.fullPath) {
                this.$store.commit('TABSVIEW/UPDATE_VISITED_VIEW', this.$route)
              }
              break
            }
          }
        }
      })
    },

    getBarWidth () {
      let outDiv = document.createElement('div')
      outDiv.style.width = '100px'
      outDiv.style.position = 'absolute'
      outDiv.style.top = '-9999px'
      document.body.appendChild(outDiv)
      let widthnobar = outDiv.offsetWidth

      outDiv.style.overflow = 'scroll'

      let innerDiv = document.createElement('div')
      innerDiv.style.width = '100%'
      outDiv.appendChild(innerDiv)
      let widthbar = innerDiv.offsetWidth

      document.body.removeChild(outDiv)

      return widthnobar - widthbar
    }

  },

  mounted () {
    if (this.$route.path !== '/home' && this.$route.meta.breadTitle) {
      this.addTags()
    }
  },

  created () {
  }
}
</script>

<style lang="scss" scoped>
  .tabs-view {
    width: calc(100% - 60px);
    padding: 8px 30px 0 30px;
    position: relative;
    bottom: -1px;
    display: flex;
    .tabs-view-wrapper {
      width: 100%;
      height: 32px !important;
      .tabs-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        border: 1px solid #e5e5e5;
        color: #495060;
        background: #fff;
        font-size: 14px;
        margin-right: 2px;
        padding: 0 10px;
        border-radius: 2px;
        border-bottom-color: #f6f6f6 !important;
        box-sizing: border-box;
        &.active {
          background-color: #F4F4F4;
          @include color();
        }
        .el-icon-close{
          color: #999;
        }
      }
    }
    .self-dropdown {
      width: 50px;
      display: flex;
      padding-top: 6.5px;
      @include color();
      cursor: pointer;
    }
  }
</style>
<style lang="scss">
.self-dropdown-item {
  //display: flex;
  &.active {
    @include color();
  }
  .self-dropdown-item-title {
    //flex: 1;
  }
  .self-dropdown-item-icon {
    //width: 10px;
    line-height: 36px;
    padding-left: 5px;
  }
}
</style>
