<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    // ie router 无法直接跳转的问题
    if ('-ms-scroll-limit' in document.documentElement.style &&
        '-ms-ime-align' in document.documentElement.style) { // detect it's IE11
      window.addEventListener('hashchange', (event) => {
        let currentPath = window.location.hash.slice(1)
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath)
        }
      }, false)
    }
  },
  mounted () {
    let localThemeColor = localStorage.getItem('themeColor') || 'blue'
    document.body.className = 'custom-' + localThemeColor
    document.documentElement.setAttribute('data-theme', localThemeColor)
  }
}
</script>

<style lang="scss">
#app{
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
