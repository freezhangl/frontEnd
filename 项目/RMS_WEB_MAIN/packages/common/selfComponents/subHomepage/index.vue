<template>
  <div class="sub-homepage">
    <h1 class="menu-contents">菜单目录</h1>
    <div v-for="(menu, resCode) in menuList" :key="resCode" class="menu-content">
      <p class="menu-first">
        <span :class="getImgClass(menu.icon)" alt="" class="menu-img"></span>
        <span class="menu-name">{{menu.resName}}</span>
      </p>
      <span
        v-for="(child, resCode) in menu.children"
        :key="resCode"
        class="menu-second"
        @click="clickMenu(child.accessPath)">{{child.resName}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SubHomepage',
  data () {
    return {
      menuList: []
    }
  },
  computed: {
    ...mapGetters({
      menus: 'USERENTITY/menus'
    })
  },
  methods: {
    // 获取子主页展示的菜单信息
    getMenuList () {
      if (this.menus && this.menus.length) {
        // 获取PC端所有频道
        let list = this.menus.find(item => item.resScope === '1').child
        if (list && list.length) {
          // 获取当前频道下所有菜单
          this.menuList = list.find(obj => obj.accessPath === this.$route.path).child
          if (this.menuList && this.menuList.length) {
            // 获取对应一级菜单的叶子节点
            this.menuList.forEach(temp => {
              let newArr = []
              newArr = this.getMenuLeaf(temp.child, newArr)
              temp.children = newArr
            })
          } else {
            this.menuList = []
          }
        }
      }
    },
    /**
     * 查找所有叶子节点
     * @param temp
     * @param newArr
     * @returns {*}
     */
    getMenuLeaf (temp, newArr) {
      if (temp && temp.length) {
        temp.forEach(item => {
          if (item.child && item.child.length) {
            this.getMenuLeaf(item.child, newArr)
          } else {
            newArr.push(item)
          }
        })
      }
      return newArr
    },
    /**
     * 获取字体图标样式
     * @param icon
     * @returns {string}
     */
    getImgClass (icon) {
      if (icon) {
        let index = icon.lastIndexOf('.')
        return 'svgfont-' + icon.substr(0, index)
      }
    },
    /**
     * 路由跳转
     * @param accessPath
     */
    clickMenu (accessPath) {
      this.$router.push({
        path: accessPath
      })
    }
  },
  mounted () {
    this.getMenuList()
  }
}
</script>

<style lang="scss" scoped>
  .sub-homepage {
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    box-shadow: 0 4px 8px 0 rgba(51,51,51,0.20);
    border-radius: 4px;
    .menu-contents {
      background: #F4F4F4;
      border-radius: 3px 3px 0 0;
      margin: 0;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
      padding: 10px 30px;
    }
    .menu-content {
      padding: 20px 30px;
      border-bottom: 1px solid #E5E5E5;
      &:last-child {
        border-bottom: none;
      }
      .menu-first {
        font-size: 16px;
        line-height: 22px;
        @include color();
        .menu-img {
          display: inline-block;
          vertical-align: middle;
          width: 14px;
        }
        .menu-name {
          display: inline-block;
          vertical-align: middle;
          padding-left: 10px;
        }
      }
      .menu-second {
        display: inline-block;
        margin: 20px 30px;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          @include color()
        }
      }
    }
  }
</style>
