<!--
下拉选择组件
<component
  :is="fSelect" // fSelect下拉选择
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.attrsDto.dictionaryDtoList下拉选项，数据字典中获取
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
      <el-tooltip :content="contentTips" :disabled="!showToolTip(contentTips, selectWidth)">
        <el-select
          :ref="`select${props.id}`"
          clearable
          @change="update"
          v-model="value"
          collapse-tags
          :placeholder="props.tip"
          :disabled="props.isReadonly === '1'"
          v-if="status !== 'result'">
          <el-option
            v-for="item in props.attrsDto.dictionaryDtoList"
            :key="item.valueCode"
            :label="item.name"
            :value="item.valueCode">
            <el-tooltip :content="item.name" :disabled="!showToolTip(item.name, selectWidth)">
              <span>{{item.name}}</span>
            </el-tooltip>
          </el-option>
        </el-select>
        <span v-else>{{props.previewName}}</span>
      </el-tooltip>
      <el-tooltip v-if="status !== 'result' && props.msg" :content="props.msg" placement="top">
        <i class="el-icon-info fill-in-tips"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script>
import { isShowToolTip } from '@lib/common/util/common'
export default {
  data () {
    // 判断默认值是否在下拉框中，如果不在则清空
    if (this.status !== 'result' && this.data && this.props.attrsDto.dictionaryDtoList.length) {
      let isExist = false
      this.props.attrsDto.dictionaryDtoList.forEach((item, index) => {
        if (item.valueCode === this.data) {
          isExist = true
        }
      })
      if (isExist) {
        return {
          value: this.data || '',
          contentTips: '',
          contentTipsOption: '',
          selectWidth: 180 // 设置下拉框的宽度
        }
      } else {
        return {
          value: '',
          contentTips: '',
          contentTipsOption: '',
          selectWidth: 180 // 设置下拉框的宽度
        }
      }
    } else {
      return {
        value: '',
        contentTips: '',
        contentTipsOption: '',
        selectWidth: 180 // 设置下拉框的宽度
      }
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
    // 下拉选择溢出设置宽度
    if (this.status !== 'result') {
      this.$nextTick(() => {
        let selectEl
        if (this.$refs[`select${this.props.id}`].$el) {
          selectEl = this.$refs[`select${this.props.id}`].$el
        } else {
          selectEl = this.$refs[`select${this.props.id}`]
        }
        let width = selectEl.offsetWidth - 40
        let spans = Array.from(selectEl.querySelectorAll('.el-select-dropdown__item span'))
        this.selectWidth = width
        spans.forEach(item => {
          item.setAttribute('style', 'max-width: ' + width + 'px !important')
        })
      })
    }
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
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
      this.getPreviewName(v)
      this.props.attrsDto.dictionaryDtoList.forEach(item => {
        if (item.valueCode === this.value) {
          this.contentTips = item.name
        }
      })
    },
    getPreviewName (name) {
      if (this.props.attrsDto && this.props.attrsDto.dictionaryDtoList) {
        this.props.attrsDto.dictionaryDtoList.forEach((item, index) => {
          if (item.valueCode === name) {
            this.props.previewName = item.name
            this.contentTips = item.name
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
.el-select-dropdown__item {
  /deep/ span {
    box-sizing: border-box;
    display: inline-block;
    max-width: 180px;
    padding-right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
