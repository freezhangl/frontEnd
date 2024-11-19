<!--
自然数组件
<component
  :is="fNaturalNumbers" // fNaturalNumbers自然数
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
      :label="props.fieldTitle+':'"
      :class="props.isRequire === '1' && status !== 'result'?'is-required':''"
      :prop="`item${props.fieldKey}`"
      :rules="[
        { validator: validator, trigger: 'blur' }
      ]"
    >
      <span slot="label" v-html="props.fieldTitle+':'" ref="con"></span>
      <el-input
        :maxlength="props.validatorDto.length ? props.validatorDto.length : props.validatorDto.length == 0 ? 0 : 99999"
        :placeholder="props.tip"
        :disabled="props.isReadonly === '1'"
        v-if="status !== 'result'"
        v-model="value"
        @change="update"
      >
      </el-input>
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
      value: this.data
    }
  },
  props: {
    props: Object,
    data: String,
    status: String
  },
  mounted () {
    this.getPreviewName(this.value)
  },
  watch: {
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
  methods: {
    validator (rule, value, callback) {
      var re = /^[0-9]+[0-9]*[0-9]*$/
      if (this.props.isRequire === '1' && !this.value) {
        callback(new Error(`请输入${this.props.fieldTitle.replace('<br>', '')}`))
      } else if (this.value && !re.test(this.value)) {
        callback(new Error(`请输入正确的${this.props.fieldTitle.replace('<br>', '')}`))
      } else if (this.props.validatorDto.min && parseFloat(this.value) < parseFloat(this.props.validatorDto.min)) {
        callback(new Error(`请输入正确的${this.props.fieldTitle.replace('<br>', '')}，数值应大于等于${this.props.validatorDto.min}`))
      } else if (this.props.validatorDto.max && parseFloat(this.value) > parseFloat(this.props.validatorDto.max)) {
        callback(new Error(`请输入正确的${this.props.fieldTitle.replace('<br>', '')}，数值应小于等于${this.props.validatorDto.max}`))
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
