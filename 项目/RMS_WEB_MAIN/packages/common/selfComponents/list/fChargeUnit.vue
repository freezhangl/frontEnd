<!--
承担单位组件
<component
  :is="fChargeUnit" // fChargeUnit承担单位
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
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
      <el-tooltip
        class="item"
        effect="dark"
        v-if="status !== 'result'"
        :disabled="!showToolTip(value, selectWidth)"
        :content="value"
        placement="top">
        <el-select
          :ref="`select${props.id}`"
          @change="update"
          v-model="value"
          :placeholder="props.tip"
          :disabled="props.isReadonly === '1'"
          filterable
          clearable>
          <el-option
            v-for="item in list"
            :key="item.orgName"
            :label="item.orgName"
            :value="item.orgName">
            <el-tooltip :content="item.orgName" :disabled="!showToolTip(item.orgName, selectWidth)">
              <span>{{item.orgName}}</span>
            </el-tooltip>
          </el-option>
        </el-select>
      </el-tooltip>
      <span v-else>{{props.previewName}}</span>
      <el-tooltip v-if="status !== 'result' && props.msg" :content="props.msg" placement="top">
        <i class="el-icon-info fill-in-tips"></i>
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script>
import { isShowToolTip } from '@lib/common/util/common'
import API from '@lib/common/serve'
export default {
  data () {
    return {
      value: this.data,
      list: [],
      selectWidth: 180 // 设置下拉框的宽度
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
    API.getDemandChargeUnit({ orgType: 2 })
      .then(data => {
        // 数组去重
        var obj = {}
        data = data.reduce(function (item, next) {
          // eslint-disable-next-line no-unused-expressions
          obj[next.orgCode] ? '' : obj[next.orgCode] = true && item.push(next)
          return item
        }, [])
        this.list = data
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
            let list = selectEl.querySelectorAll('.el-select-dropdown__list')
            // 搜索空数据时，覆盖原有样式
            if (list) {
              list[0].setAttribute('style', 'min-height: ' + 0)
            }
            this.selectWidth = width
            spans.forEach(item => {
              item.setAttribute('style', 'max-width: ' + width + 'px !important')
            })
          })
        }
      })
      .catch(err => {
        this.$message.error(err.message || '失败')
      })
    this.getPreviewName(this.value)
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
