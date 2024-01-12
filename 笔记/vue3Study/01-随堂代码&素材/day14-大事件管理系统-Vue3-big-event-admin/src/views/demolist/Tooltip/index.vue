<template>
  <div>
    <a-tooltip v-if="record[slotName] && record[slotName].length > 20" style="background:#fff;">
      <template #title><p style="background: #fff;padding:6px 8px;margin: -6px -8px;color:#000;">{{ record[slotName] }}</p></template>
      {{ record[slotName].substring(0,20) }}...
    </a-tooltip>
    <p style="margin-bottom: 0;" v-else>{{ record[slotName] }}</p>
  </div>
</template>
<script>
export default {
  name: 'Tooltip',
  props: {
    record: {
      type: Object,
       default () {
        return {}
      }
    },
    slotName: {
      type: String,
      default: 'remark'
    }
  }
}
</script>
<style lang="less">
</style>
