<template>
  <span class="colorful__text" :style="{'color': config[record[slotName]]}">{{ record[slotName] }}</span>
</template>

<script>
export default {
  name: 'ColorFulText',
  props: {
    config: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    record: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    slotName: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>

<style scoped lang="less">
</style>
