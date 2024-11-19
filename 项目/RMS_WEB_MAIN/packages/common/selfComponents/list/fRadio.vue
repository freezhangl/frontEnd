<!--
单选组件
<component
  :is="fRadio" // fRadio单选
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.attrsDto.dictionaryDtoList单选选项，数据字典中查询
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
      <el-radio-group
        v-model="value"
        @change="update"
        :disabled="props.isReadonly === '1'"
        v-if="status !== 'result'">
        <el-radio :label="item.valueCode" v-for="(item, index) in props.attrsDto.dictionaryDtoList" :key="item.valueCode">
          {{item.name}}
          <el-tooltip v-if="props.msg && index + 1 === props.attrsDto.dictionaryDtoList.length" :content="props.msg" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </el-radio>
      </el-radio-group>
      <span v-else>{{props.previewName}}</span>
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
      if (this.props.isRequire === '1' && (!this.value)) {
        callback(new Error('请选择' + this.props.fieldTitle.replace('<br>', '')))
      } else {
        callback()
      }
    },
    update (v) {
      this.$emit('update:data', v)
      this.$emit('changeEvent', v)
      // 获取到label值
      this.getPreviewName(v)
    },
    getPreviewName (name) {
      if (this.props.attrsDto && this.props.attrsDto.dictionaryDtoList) {
        this.props.attrsDto.dictionaryDtoList.forEach((item, index) => {
          if (item.valueCode === name) {
            this.props.previewName = item.name
          }
        })
      }
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
.el-radio-group {
  width: 100%;
  .el-radio {
    white-space: normal;
    /deep/ .el-radio__label {
      padding-left: 3px;
      .el-tooltip {
        padding-left: 3px;
        @include color();
      }
    }
  }
  .el-radio:last-child {
    margin-right: 30px;
  }
}
</style>
