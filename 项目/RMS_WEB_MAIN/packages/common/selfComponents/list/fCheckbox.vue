<!--
多选组件
<component
  :is="fCheckbox" // fCheckbox多选
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.attrsDto.dictionaryDtoList为下拉的选项，数据字典配置
props.validatorDto.min为最少选中项数
props.validatorDto.max为最多选中项数
-->
<template>
  <div :class="props.isClass">
    <el-form-item
      :label="props.fieldTitle+':'"
      :class="props.isRequire === '1' && status !== 'result'?'is-required':''"
      :prop="`item${props.fieldKey}`"
      :rules="[
        { validator: validator, trigger: 'change' }
      ]"
    >
      <span slot="label" v-html="props.fieldTitle+':'" ref="con"></span>
      <el-checkbox-group
        class="checkbox-group"
        v-model="value"
        @change="update"
        :disabled="props.isReadonly === '1'"
        v-if="status !== 'result'">
        <el-checkbox
          :label="item.valueCode"
          v-for="item in props.attrsDto.dictionaryDtoList"
          :key="item.valueCode">{{item.name}}</el-checkbox>
      </el-checkbox-group>
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
    if (this.data && (typeof this.data === 'string') && this.data.constructor === String && this.data.substr(0, 1) === '[' && this.data.substr(this.data.length - 1, 1) === ']') {
      return { value: JSON.parse(this.data) }
    } else if (this.data && this.data instanceof Array) {
      return { value: this.data }
    } else {
      return { value: [] }
    }
  },
  props: {
    props: Object,
    data: [String, Array],
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
      if (this.props.isRequire === '1' && this.value && this.value.length === 0) {
        callback(new Error(`请选择${this.props.fieldTitle.replace('<br>', '')}`))
        if (this.props.validatorDto.min && parseFloat(this.value.length) < parseFloat(this.props.validatorDto.min)) {
          callback(new Error(`选择数量应大于${this.props.validatorDto.min}`))
        }
      }
      if (this.value.length > 0 && this.props.validatorDto.min && this.props.validatorDto.min > this.value.length) {
        callback(new Error('至少选择' + this.props.validatorDto.min + '个'))
      }
      if (this.value.length > 0 && this.props.validatorDto.max && this.props.validatorDto.max < this.value.length) {
        callback(new Error('最多选择' + this.props.validatorDto.max + '个'))
      }
      callback()
    },
    update (v) {
      this.$emit('update:data', JSON.stringify(v))
      this.$emit('changeEvent', JSON.stringify(v))
      this.getPreviewName(v)
    },
    getPreviewName (name) {
      // 获取到label值
      let arr = []
      this.props.attrsDto.dictionaryDtoList.forEach((item, index) => {
        name.forEach((item1, index1) => {
          if (item.valueCode === item1) {
            arr.push(item.name)
          }
        })
      })
      this.props.previewName = arr.join('，')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item {
    margin-bottom: 5px;
}
.checkbox-group {
  height: auto;
}
.checkbox-group >>> .el-checkbox {
  font-size: 0;
}
.checkbox-group >>> .el-checkbox__label {
  vertical-align: middle
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
.el-checkbox-group {
  width: 100%;
  .el-checkbox {
    white-space: normal;
    /deep/ .el-checkbox__label {
      display: inline;
    }
  }
  .el-checkbox:last-child {
    margin-right: 30px;
  }
}
.el-checkbox-group {
  width: 100%;
  .el-checkbox {
    white-space: normal;
    /deep/ .el-checkbox__label {
      display: inline;
    }
  }
  .el-checkbox:last-child {
    margin-right: 30px;
  }
}
</style>
