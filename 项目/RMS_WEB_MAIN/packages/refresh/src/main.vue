<template>
  <div>

  </div>
</template>
<script>
export default {
  name: 'refresh',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log('refresh', to, from)
      // if (to.query.once) return
      vm.$router.replace(from.path)
    })
  },
  mounted () {
  }
}
</script>
