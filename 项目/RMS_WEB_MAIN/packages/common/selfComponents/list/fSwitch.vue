<!--
开关组件
<component
  :is="fSwitch" // fSwitch开关
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
false关
true开
-->
<template>
  <div :class="props.isClass">
    <el-form-item
      :label="props.fieldTitle+':'"
    >
      <span slot="label" v-html="props.fieldTitle+':'" ref="con"></span>
      <el-switch
        @change="update"
        :disabled="props.isReadonly === '1'"
        v-if="status !== 'result'"
        v-model="value">
      </el-switch>
      <!-- <span v-else>{{value | onFilter}}</span> -->
      <span v-else>{{props.previewName}}</span>
      <el-tooltip v-if="status !== 'result' && props.msg" :content="props.msg" placement="top">
        <i class="el-icon-info fill-in-tips"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: this.data ? JSON.parse(this.data) : false
    }
  },
  props: {
    props: Object,
    data: String,
    status: String
  },
  watch: {
    data (value) {
      this.value = JSON.parse(value) ? JSON.parse(value) : false
    },
    'props.fieldTitle': {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (val) {
          this.$nextTick(() => {
            let con = this.$refs.con
            if (con.offsetHeight > 16) {
              con.parentElement.style.lineHeight = '20px'
            }
          })
        }
      }
    }
  },
  filters: {
    onFilter: function (val) {
      if (val) {
        return '开'
      } else {
        return '关'
      }
    }
  },
  mounted () {
  },
  methods: {
    update (v) {
      this.$emit('update:data', JSON.stringify(v))
      this.$emit('changeEvent', JSON.stringify(v))
      this.props.previewName = v ? '开' : '关'
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item {
    margin-bottom: 5px;
}
/deep/ .el-form-item__label {
  word-break: break-all;
}
// 填报说明提示
.fill-in-tips {
  position: absolute;
  top: 14px;
  right: -18px;
  @include color();
}
</style>
