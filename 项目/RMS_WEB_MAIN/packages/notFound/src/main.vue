<template>
  <div class="container">
    <div class="pageCenter">
      <h2>404</h2>
      <h3>Sorry，页面找不到或没有相应的权限</h3>
      <h3>{{timeout}}秒后跳转回<a class="homeBtn" href="#/home">首页</a></h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page404',
  data () {
    return {
      timeout: 10,
      timer: null
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      if (this.timeout-- <= 1) {
        clearInterval(this.timer)
        location.href = '#/home'
      }
    }, 1000)
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pageCenter {
  margin-top: 200px;
  text-align: center;
}
.pageCenter h2 {
  color: red;
  font-size: 10em;
}
.homeBtn{
  color: #0B82FF;
}
</style>
