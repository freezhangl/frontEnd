<!--
单行文本组件
<component
  :is="fInput" // fInput单行文本
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.validatorDto.length //最大长度
props.validatorDto.type //正则表达式，手机号、邮箱、网址...
-->
<template>
  <div :class="props.isClass">
    <el-form-item
      :class="props.isRequire === '1' && status !== 'result'?'is-required':''"
      :prop="`item${props.fieldKey}`"
      :rules="[
        { validator: validator, trigger: 'change' }
      ]"
    >
      <span slot="label" v-html="props.fieldTitle+':'" ref="con"></span>
      <el-tooltip
        class="item"
        effect="dark"
        v-if="status !== 'result'"
        :disabled="value.toString().length < 11"
        :content="value"
        placement="top">
        <!-- :content="props.defaultValue" -->
        <el-input
          v-if="status !== 'result'"
          v-model="value"
          :maxlength="props.validatorDto.length ? props.validatorDto.length : props.validatorDto.length == 0 ? 0 : 99999"
          :placeholder="props.tip"
          :disabled="props.isReadonly === '1'"
          @change="update"
        >
        </el-input>
      </el-tooltip>
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
      value: this.data ? this.data : ''
    }
  },
  props: {
    props: Object,
    data: String,
    status: String
  },
  watch: {
    data (value) {
      this.value = value || ''
      this.getPreviewName(this.value)
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
  mounted () {
    this.getPreviewName(this.value)
  },
  methods: {
    validator (rule, value, callback) {
      if (this.props.isRequire === '1' && ((!this.value) || this.value.trim().length === 0)) {
        callback(new Error('请输入' + this.props.fieldTitle.replace('<br>', '')))
      } else if (this.props.validatorDto && this.props.validatorDto.constructor === Object) {
        let reg = this.props.validatorDto
        // eslint-disable-next-line no-eval
        let valid = (reg.type && reg.type !== 'other') ? new RegExp(reg.type) : null
        let length = reg.length
        if (length && length < this.value.length) {
          callback(new Error('长度不能超过' + length))
        } else if (this.value && valid !== null && !valid.test(this.value)) {
          if (reg.message) {
            callback(new Error(reg.message))
          } else {
            callback(new Error('请输入正确的值'))
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    update (v) {
      this.$emit('update:data', v)
      this.$emit('changeEvent', v)
      this.props.previewName = v
    },
    getPreviewName (name) {
      this.props.previewName = name
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item {
    margin-bottom: 5px;
}
.red .el-form-item__label {
  color: red;
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
