<!--
公司选择组件
<component
  :is="fChooseUnit" // fChooseUnit公司选择
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.validatorDto.min为最少选中项数
props.validatorDto.max为最多选中项数
-->
<template>
  <div :class="props.isClass">
    <el-form-item
      :ref="`advancedSelect${props.id}`"
      :label="props.fieldTitle+':'"
      :class="props.isRequire === '1' && status !== 'result'?'is-required':''"
      :prop="`item${props.fieldKey}`"
      :rules="[
        { validator: validator, trigger: 'change' }
      ]"
    >
      <span slot="label" v-html="props.fieldTitle+':'" ref="con"></span>
      <el-tooltip
        class="tool-tip item"
        effect="dark"
        v-if="status !== 'result'"
        :disabled="value.length?false:true"
        :content="codeToName(value,options)"
        placement="top">
        <div>
          <i class="el-icon-arrow-left arrow arrow-left" :style="{color:arrowPath==='left'?'#ccc':'#666'}" @click="arrowLeftRight('left')"></i>
          <i class="el-icon-arrow-right arrow arrow-right" :style="{color:arrowPath==='right'?'#ccc':'#666'}" @click="arrowLeftRight('right')"></i>
          <el-select
            :ref="`select${props.id}`"
            class="select-switch"
            :disabled="props.isReadonly === '1'"
            @change="update"
            v-model="value"
            multiple
            :multiple-limit="props.validatorDto.min? (parseInt(props.validatorDto.max) || 0) : (parseInt(props.validatorDto.max) || 1) "
            style="width:100%;"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.companyName"
              :value="item.orgCode">
              <el-tooltip :content="item.companyName" :disabled="!showToolTip(item.companyName, selectWidth)">
                <span>{{item.companyName}}</span>
              </el-tooltip>
            </el-option>
          </el-select>
        </div>
      </el-tooltip>
      <!-- <span v-else>{{value.join('，')}}</span> -->
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
      value: this.data && this.data.substr(0, 1) === '[' && this.data.substr(this.data.length - 1, 1) === ']' ? JSON.parse(this.data) : [],
      options: [],
      arrowNum: 0,
      arrowPath: 'left',
      selectWidth: 180 // 设置下拉框的宽度
    }
  },
  props: {
    props: Object,
    data: [String, Array],
    status: String
  },
  watch: {
    data (value) {
      this.value = value && value.substr(0, 1) === '[' && value.substr(value.length - 1, 1) === ']' ? JSON.parse(value) : []
      // 预览字段
      let previewName = []
      this.options.forEach(item => {
        this.value.forEach(item1 => {
          if (item.orgCode === item1) {
            previewName.push(item.companyName)
          }
        })
      })
      this.props.previewName = previewName.join('，')
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
    if (this.status !== 'result') {
      API.getChooseUnit()
        .then(data => {
          this.options = data
          // 判断默认值是否在下拉框中，如果不在则清空
          if (this.data && this.data.substr(0, 1) === '[' && this.data.substr(this.data.length - 1, 1) === ']') {
            let dataA = JSON.parse(this.data) || []
            let isExistWrap = false
            dataA.forEach((item, index) => {
              let isExist = false
              this.options.forEach((item1, index1) => {
                if (item1.orgCode === item) {
                  isExist = true
                }
              })
              if (!isExist) {
                isExistWrap = true
              }
            })
            if (isExistWrap) {
              this.value = []
            }
          }
          this.getPreviewName(this.value)
          this.arrowChangeClass()
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
        })
        .catch(err => {
          this.$message.error(err.message || '失败')
        })
    }
  },
  computed: {
    codeToName () {
      return function (codeArr, objArr) {
        var arr = JSON.parse(JSON.stringify(codeArr))
        // 多选
        if (arr && objArr) {
          for (let i = 0; i < objArr.length; i++) {
            let num = codeArr.indexOf(objArr[i].orgCode)
            if (num !== -1) {
              arr.splice(num, 1, objArr[i].companyName)
            }
          }
          return arr.toString()
        } else {
          return null
        }
      }
    }
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    validator (rule, value, callback) {
      // debugger
      if (this.props.isRequire === '1' && (!this.value.length)) {
        callback(new Error('请选择' + this.props.fieldTitle.replace('<br>', '')))
      }
      if ((this.value.length > 0) && this.value.length < this.props.validatorDto.min) {
        callback(new Error('至少选择' + this.props.validatorDto.min + '家公司'))
      }
      callback()
    },
    update (v) {
      this.$emit('update:data', JSON.stringify(v))
      this.$emit('changeEvent', JSON.stringify(v))
      this.getPreviewName(v)
      this.arrowPath = ''
      // 多选
      this.arrowChangeClass()
    },
    getPreviewName (v) {
      let previewName = []
      this.options.forEach(item => {
        v.forEach(item1 => {
          if (item.orgCode === item1) {
            previewName.push(item.companyName)
          }
        })
      })
      this.props.previewName = previewName.join('，')
    },
    // 多选时如何渲染样式
    arrowChangeClass () {
      setTimeout(() => {
        let innerWidths = Array.from(this.$refs[`advancedSelect${this.props.id}`].$el.querySelectorAll('.el-select__tags .el-tag'))
        let outerWidth = this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags') ? this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags').offsetWidth - 30 : 200
        let innerWidth = 0
        innerWidths.forEach(item => {
          innerWidth = innerWidth + item.offsetWidth
        })
        if (innerWidth > outerWidth) {
          if (this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags')) {
            this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags').style.borderWidth = '0 46px 0 16px'
          }
          this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.arrow-left').style.display = 'block'
          this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.arrow-right').style.display = 'block'
          // 移除时缩进样式
          if (innerWidth - outerWidth + 32 < this.arrowNum) {
            this.arrowNum = innerWidth - outerWidth + 32
            this.arrowPath = 'right'
            if (this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags>span')) {
              this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags>span').style.transform = 'translateX(' + -this.arrowNum + 'px)'
            }
          }
        } else {
          this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.arrow-left').style.display = 'none'
          this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.arrow-right').style.display = 'none'
          this.arrowNum = 0
          if (this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags')) {
            this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags').style.borderWidth = '0'
            this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags>span').style.transform = 'translateX(' + 0 + 'px)'
          }
        }
        // 第一次从无箭头变成右箭头时，左箭头置灰
        if (this.arrowNum === 0) {
          this.arrowPath = 'left'
        }
      }, 100)
    },
    // 多选时左右滑动
    arrowLeftRight (type) {
      this.arrowPath = ''
      let innerWidths = Array.from(this.$refs[`advancedSelect${this.props.id}`].$el.querySelectorAll('.el-select__tags .el-tag'))
      let outerWidth = this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags').offsetWidth - 62
      let innerWidth = 0
      innerWidths.forEach(item => {
        innerWidth = innerWidth + item.offsetWidth
      })
      if (type === 'left') {
        this.arrowNum -= 20
        if (this.arrowNum <= 0) {
          this.arrowNum = 0
          this.arrowPath = 'left'
        }
      } else if (type === 'right') {
        this.arrowNum += 20
        if (innerWidth - this.arrowNum < outerWidth) {
          this.arrowNum = innerWidth - outerWidth
          this.arrowPath = 'right'
        }
      }
      this.$refs[`advancedSelect${this.props.id}`].$el.querySelector('.el-select__tags>span').style.transform = 'translateX(' + -this.arrowNum + 'px)'
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
// 多选时带左右箭头样式
.tool-tip {
  position: relative;
}
.select-switch {
  /deep/ .el-select__tags {
    width: 100% !important;
    max-width: none !important;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    border-width: 0;
    border-style: solid;
    border-color: transparent;
    >span {
      display: block;
      width: 6000px;
      transition: all .5s;
      .el-tag {
        @include color();
        background-color: transparent;
        border-color: transparent;
        border-radius: 0;
        padding: 0 2px 0 6px;
        margin-left: 0;
        .el-icon-close {
          color: #ccc;
          right: 0;
        }
      }
      .el-tag:hover {
        background-color: rgba($color: #0b82ff, $alpha: .1);
      }
    }
  }
}
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  width: 10px;
  cursor: pointer;
  display: none;
}
.arrow-left {
  left: 4px;
}
.arrow-right {
  right: 30px;
}
</style>
