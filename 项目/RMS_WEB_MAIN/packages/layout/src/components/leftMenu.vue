<template>
  <div class="left-wrapper">
    <el-menu
      ref="leftMenu"
      :collapse="!unfold"
      :default-active="$route.meta.replaceTab ? $route.meta.parentPath : $route.path"
      :collapse-transition="false"
      :unique-opened="true"
      :default-openeds="openeds">
      <div v-for="(item,index) in menu" :key="index">
        <menu-button
          :data="item"
          :level="1"
          :collapse="!unfold"></menu-button>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menuButton from './menuButton'
export default {
  name: 'leftMenu',
  components: { menuButton },
  props: {
    menu: { type: Array, default: () => [] }, //左侧菜单列表
    level: { type: Number, default: 0 }, //菜单层级
    unfold: { type: Boolean, default: true }, //是否展开左侧菜单
    openeds: { type: Array, default: () => [] }
  },
  data () {
    return {
      parentPath: ''
    }
  },
  watch: {

  },
  computed: {
  },
  methods: {

  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.left-wrapper {
  height: 100%;
  background: #f6f6f6;
  position: relative;
  color: #333333;

  /deep/ .el-menu{
    border: none;
    background: #f6f6f6;
  }
}
</style>
