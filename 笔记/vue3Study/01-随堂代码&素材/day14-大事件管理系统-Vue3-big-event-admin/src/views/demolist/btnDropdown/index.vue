<template>
  <div class="btn__dropdown--bix">
    <a-divider type="vertical" />
    <a-dropdown>
      <a class="ant-dropdown-link">
        更多
        <a-icon type="down" />
      </a>
      <a-menu slot="overlay" class="btn__dropdown">
        <a-menu-item
          v-for="(btn,index) in innerComp"
          :key="index"
        >
          <a-Button
            v-bind="btn.props"
            type="link"
            v-permission="btn.permission"
            :disabled="btn.disabled?btn.disabled(record):false"
            @click="btn.event(record, dataIndex)">{{ btn.transform ? btn.transform(record) : btn.text }}</a-Button>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>
<script>
export default {
  props: {
    innerComp: {
      type: Array,
      default: () => {
        return []
      }
    },
    record: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dataIndex: {
      type: Number,
      default: -1
    }
  }
}
</script>
<style lang="less" scoped>
.btn__dropdown--bix{
  display: inline-block;
  /deep/ .ant-divider.ant-divider-vertical{
    margin-left: -2px;
  }
}
</style>
