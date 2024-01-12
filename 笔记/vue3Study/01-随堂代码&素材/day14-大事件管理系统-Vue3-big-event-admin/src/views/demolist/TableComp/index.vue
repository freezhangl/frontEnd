<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :rowKey="rowKey"
    v-bind="extraProps"
    v-on="events"
    class="table__comp">
    <template
      v-if="isNeedIndex"
      slot="index"
      slot-scope="text, record,index">
      {{ index + 1 }}
    </template>
    <template
      v-for="(item) in slots"
      :slot="item.slotName"
      slot-scope="text, record, index">
      <component
        v-for="(comp, idx) in item.slotContent"
        :key="idx"
        :is="comp.component"
        :innerComp="comp.children"
        :record="record"
        :style="`${comp.style ? comp.style : '' }margin-right: 10px;${([null, undefined, ''].includes(record[item.slotName]) && !['action', 'operation', 'opration'].includes(item.slotName) && (!comp.props || comp.props && !comp.props.isNullShow)) ? 'display:none;' : ''}`"
        :slot-name="item.slotName"
        :permission="comp.permission"
        :data-index="index"
        v-bind="mergeProps(comp, record, index)"
        v-permission="comp.permission"
        @click.native="comp.clickHandler && comp.clickHandler(record, index, $event)"
        v-model="record[item.slotName]"
      >
        <!-- 一些组件是不需要子节点的，如果设置子节点会有一些非预期的行为，例如 a-badge 组件 -->
        <span v-if="!comp.noChildren" v-html="comp.transform ? comp.transform(record): (comp.text ? comp.text : record[item.slotName])"></span>
        <component
          v-if="comp.subComponent"
          :is="comp.subComponent.component"
          :slot-name="item.slotName"
          :record="record"
          :permission="item.permission"
          v-bind="comp.subComponent.props">{{ comp.subComponent.transform ? comp.subComponent.transform(record) : comp.subComponent.content }}</component>
      </component>
    </template>
  </a-table>
</template>
<script>
import BtnDropdown from '@/components/btnDropdown'
import CheckEyesComp from '@/components/CheckEyesComp'
import Tooltip from '@/components/Tooltip'
import TableInnerDescriptionComp from './TableInnerDescriptionComp'
import ColorFulText from './colorText'
import Thumbnail from './thumbnail'
export default {
  name: 'TableComp',
  components: { BtnDropdown, Tooltip, CheckEyesComp, TableInnerDescriptionComp, ColorFulText, Thumbnail },
  props: {
    columns: {
      required: true,
      type: Array,
      default () {
        return []
      }
    },
    dataSource: {
      required: true,
      type: Array,
      default () {
        return []
      }
    },
    rowKey: {
      type: Function,
      default () {
        return (record, index) => index
      }
    },
    slots: {
      type: Array,
      default () {
        return []
      }
    },
    extraProps: {
      type: Object,
      default () {
        return {}
      }
    },
    isNeedIndex: {
      type: Boolean,
      default: true
    },
    events: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    mergeProps (comp, record, index) {
      const finalProps = { ...comp.props }

      // 计算需要根据 record 值动态设置的属性值
      if (comp.dynamicProps) {
        Object.entries(comp.dynamicProps).forEach(([key, value]) => {
          finalProps[key] = value(record, index)
        })
      }

      return finalProps
    }
  }
}
</script>

<style lang="less" scoped>
.table__comp {
  .ant-btn.ant-btn-link {
    padding: 0 5px;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;

    &[disabled] {
      color: #aaa !important;
    }
  }
  /deep/ td, /deep/ th {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }
  p {
    margin-bottom: 0;
  }
}
.ant-dropdown .ant-dropdown-menu-item a{
  padding: 0 5px;
}
</style>
