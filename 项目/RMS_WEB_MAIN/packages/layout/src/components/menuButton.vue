<template>
  <div class="menu-button-wrapper" :class="{'collapse':collapse}">
    <el-submenu
      v-if="data.child.length>0"
      :index="data.accessPath"
      :class="{['level' + level]: true}"
      class="menuBtn">
      <template slot="title">
        <!-- <img v-if="level==1" :src="getImgUrl(data.icon)" alt=""> -->
        <div v-if="level==1" class="menu-icon" :class="getImgUrl(data.icon)"></div>
        <span slot="title" :title="data.resName">{{data.resName}}</span>
      </template>
      <menu-button
        v-for="(item,index) in data.child"
        :key="index"
        :data="item"
        :collapse="collapse"
        :level="level+1"></menu-button>
    </el-submenu>
    <el-menu-item
      v-else
      :index="data.accessPath"
      class="menuBtn"
      :class="{'is-active': data.accessPath === $route.path}"
      :style="{ paddingLeft: computePadding(level) }"
      @click="goView(data)"
    >
      <!--:class="'level'+level"-->
      <template>
        <!-- <img v-if="level==1" :src="getImgUrl(data.icon)" alt=""> -->
        <div v-if="level==1" class="menu-icon" :class="getImgUrl(data.icon)"></div>
        <span slot="title" :title="data.resName">{{data.resName}}</span>
      </template>
    </el-menu-item>
  </div>
</template>

<script>
import menuButton from './menuButton'
import images from '@lib/layout/assets/imgPath'
import { isShowToolTip } from '@lib/common/util/common'
export default {
  name: 'menuButton',
  components: { menuButton },
  props: {
    data: { type: Object, default: () => {} }, //左侧菜单列表
    level: { type: Number, default: 0 }, //菜单层级
    collapse: { type: Boolean, default: false }, //是否折叠
    parentPath: { type: String, default: '' } //当前展开项的path
  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.$set(this.data, 'showToolTip', isShowToolTip(val.resName, 120))
        }
      }
    }
  },
  methods: {
    getImgUrl (icon) {
      if (icon) {
        let arr = icon.split('/')
        let img = images[arr[arr.length - 1]] || ''
        let imgName = icon.split('.svg')[0] || ''
        return 'svgfont-' + imgName
      }
    },
    // 点击最底层子级菜单
    goView (data) {
      let accessPath = data.accessPath
      let currentRoutePath = this.$route.path
      if (currentRoutePath !== accessPath) {
        this.$router.push({
          path: accessPath
        })
      }
    },
    computePadding (level) {
      if (level > 1) {
        return (level - 2) * 14 + 50 + 'px'
      } else {
        return ''
      }
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.menu-button-wrapper {
  img{
    width: 16px;
    margin-right: 13px;
  }
  .menu-icon{
    font-size: 18px;
    display: inline-block;
    width: 16px;
    margin-right: 13px;
  }
  /deep/ .el-menu-item, /deep/ .el-submenu__title{
    color: #333;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover{
      @include background-color($color-blue,0.8);
    }
  }
  .is-active.el-menu-item{
    @include background-color();
    color: #F5F6FA;
  }
  /*叶子节点*/
  /deep/ .el-menu-item{
    padding-right: 5px;
    &.level2{
      padding-left: 50px !important;
    }
    &.level3{
      padding-left: 64px !important;
    }
    &.level4{
      padding-left: 78px !important;
    }
  }
  /*父节点*/
  /deep/ .el-submenu{
    .el-submenu__title{
      padding-right: 30px;
      i{
        color: #333;
      }
    }
    &.level2 .el-submenu__title{
      padding-left: 50px !important;
    }
    &.level3 .el-submenu__title{
      padding-left: 64px !important;
    }
    &.level4 .el-submenu__title{
      padding-left: 78px !important;
    }
  }
  &.collapse{
    /deep/ .menu-button.level1, /deep/ .el-submenu.level1 .el-submenu__title{
      text-overflow: clip;
      span,i{
        display: none;
      }
    }
  }
}
</style>
