<!--
多行文本组件
<component
  :is="fTextarea" // fTextarea多行文本
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.validatorDto.length //最大长度
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
        :maxlength="props.validatorDto.length ? props.validatorDto.length : 9999"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8}"
        show-word-limit
        :placeholder="props.tip"
        :disabled="props.isReadonly === '1'"
        v-if="status !== 'result'"
        v-model="value"
        @change="update"
      >
      </el-input>
      <span class="preview-html" v-else v-html="props.previewName?props.previewName.replace(/\n/g, '<br>'):''"></span>
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
        let length = reg.length
        if (length && length < this.value.length) {
          callback(new Error('长度不能超过' + length))
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
/deep/ .el-input__count {
  line-height: 1;
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
.preview-html {
  word-break: break-all;
}
.el-textarea {
  /deep/ textarea {
    padding-bottom: 14px;
  }
}
</style>
