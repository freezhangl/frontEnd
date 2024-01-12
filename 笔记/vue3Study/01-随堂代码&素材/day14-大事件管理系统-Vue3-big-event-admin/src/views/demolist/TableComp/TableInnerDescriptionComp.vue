<template>
  <a-descriptions v-bind="descriptionProps" class="table__description--comp">
    <a-descriptions-item v-for="(item, index) in formatData" :key="index" :label="item.label" v-bind="columnProps" :colon="item.label">
      {{ item.value || '-' }}
    </a-descriptions-item>
  </a-descriptions>
</template>
<script>
export default {
  name: 'TableInnerDescriptionComp',
  props: {
    descriptionProps: {
      type: Object,
      default () {
        return {}
      }
    },
    columnProps: {
      type: Object,
      default () {
        return {}
      }
    },
    replaceFileds: {
      type: Object,
      required: true,
      default () {
        return {
        }
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
  },
  methods: {
    handleData (array = []) {
      return array.map(item => {
        // const newObject = {}
        // for (const key in item) {
        //   newObject.label = key
        //   newObject.value = item[key]
        // }
        return {
          label: item[this.replaceFileds['label']],
          value: item[this.replaceFileds['value']]
        }
      })
    }
  },
  computed: {
    formatData () {
      return this.handleData(this.record[this.slotName])
    }
  }
}
</script>
<style lang="less" scoped>
.table__description--comp{
  /deep/ .ant-descriptions-item{
    text-align: center;
  }
  /deep/ .ant-descriptions-item-label, /deep/.ant-descriptions-item-content {
    padding: 3px 5px!important;
  }
}
</style>
