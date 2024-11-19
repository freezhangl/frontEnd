<template>
  <div
    style="position:relative;"
    :ref="`advancedSelect${keyId}`">
    <el-tooltip
      effect="dark"
      class="tool-tip"
      :disabled="!(value && value.toString())"
      :content="codeToName(value,list,isMoreType)"
      placement="top-start">
      <div>
        <i class="el-icon-arrow-left arrow arrow-left" :style="{color:arrowPath==='left'?'#ccc':'#666'}" @click="arrowLeftRight('left')"></i>
        <i class="el-icon-arrow-right arrow arrow-right" :style="{color:arrowPath==='right'?'#ccc':'#666'}" @click="arrowLeftRight('right')"></i>
        <el-select
          :ref="`select${keyId}`"
          :popper-class="advancedSelectClass"
          class="select-switch"
          @change="update"
          v-model="value"
          :multiple="isMoreType === 'even'"
          :placeholder="placeholder"
          :clearable="clearable"
        >
          <el-option
            v-for="item in list"
            v-show="!item.hidden"
            :key="item[valueTxt]"
            :label="item[labelTxt]"
            :value="item[valueTxt]">
            <el-tooltip :content="item[labelTxt]" :disabled="!showToolTip(item[labelTxt], selectWidth)" placement="right">
              <span>{{item[labelTxt]}}</span>
            </el-tooltip>
          </el-option>
        </el-select>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import { isShowToolTip } from '@lib/common/util/common'
export default {
  data () {
    return {
      value: this.data,
      arrowNum: 0,
      arrowPath: 'left',
      selectWidth: 180
    }
  },
  props: {
    clearable: {
      type: Boolean,
      default: false
    },
    advancedSelectClass: {
      type: String,
      default: 'advance-select-dropdown'
    },
    data: [String, Array], //默认数据 ''  []
    list: {
      type: Array,
      default () {
        return []
      }
    }, //下拉选择数据
    keyId: {
      type: String,
      default: ''
    }, //唯一标识
    isMoreType: {
      type: String,
      default: 'odd'
    }, //单选odd 多选even
    valueTxt: {
      type: String,
      default: 'value'
    }, //value的key值
    labelTxt: {
      type: String,
      default: 'label'
    }, //label的key值
    //占位提示文字
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  watch: {
    data (newValue, oldValue) {
      this.value = newValue
      if (this.isMoreType === 'even') {
        this.arrowChangeClass()
      }
    }
  },
  mounted () {
    // 多选
    if (this.isMoreType === 'even') {
      this.arrowChangeClass()
    }
    // 下拉选择溢出设置宽度
    this.$nextTick(() => {
      let selectEl
      if (!(this.$refs && this.$refs[`select${this.keyId}`])) return
      if (this.$refs[`select${this.keyId}`].$el) {
        selectEl = this.$refs[`select${this.keyId}`].$el
      } else {
        selectEl = this.$refs[`select${this.keyId}`]
      }
      let width = selectEl.offsetWidth - 40
      let spans = selectEl.querySelectorAll('.el-select-dropdown__item span')
      this.selectWidth = width
      //IE NodeList.forEach 不兼容
      /* spans.forEach(item => {
        item.setAttribute('style', 'max-width: ' + width + 'px !important')
      }) */
      //IE es5兼容写法
      Array.prototype.forEach.call(spans, item => {
        item.setAttribute('style', 'max-width: ' + width + 'px !important')
      })
    })
  },
  methods: {
    // 是否溢出
    showToolTip (name, width) {
      return isShowToolTip(name, width)
    },
    codeToName (codeArr, objArr, isMore) {
      var arr = JSON.parse(JSON.stringify(codeArr))
      // 单选
      if (isMore === 'odd' && codeArr) {
        let tips = null
        for (let i = 0; i < objArr.length; i++) {
          if (objArr[i][this.valueTxt] === codeArr) {
            tips = objArr[i][this.labelTxt]
          }
        }
        return tips
      }
      // 多选
      if (arr && objArr) {
        for (let i = 0; i < objArr.length; i++) {
          let num = codeArr.indexOf(objArr[i][this.valueTxt])
          if (num !== -1) {
            arr.splice(num, 1, objArr[i][this.labelTxt])
          }
        }
        return arr.toString()
      } else {
        return null
      }
    },
    update (v) {
      this.$emit('update:data', v)
      this.$emit('changeEvent', v)
      this.arrowPath = ''
      // 多选
      if (this.isMoreType === 'even') {
        this.arrowChangeClass()
      }
    },
    // 多选时如何渲染样式
    arrowChangeClass () {
      setTimeout(() => {
        // 获取refs的dom结构
        let advancedSelectEl
        if (!(this.$refs && this.$refs[`select${this.keyId}`])) return
        if (this.$refs[`advancedSelect${this.keyId}`].$el) {
          advancedSelectEl = this.$refs[`advancedSelect${this.keyId}`].$el
        } else {
          advancedSelectEl = this.$refs[`advancedSelect${this.keyId}`]
        }
        let innerWidths = advancedSelectEl.querySelectorAll('.el-select__tags .el-tag')
        let outerWidth = advancedSelectEl.querySelector('.el-select__tags') ? advancedSelectEl.querySelector('.el-select__tags').offsetWidth - 30 : 200
        let innerWidth = 0
        //IE NodeList.forEach 不兼容
        /* innerWidths.forEach(item => {
          innerWidth = innerWidth + item.offsetWidth
        }) */
        //IE es5兼容写法
        Array.prototype.forEach.call(innerWidths, item => {
          innerWidth = innerWidth + item.offsetWidth
        })
        if (innerWidth > outerWidth) {
          if (advancedSelectEl.querySelector('.el-select__tags')) {
            advancedSelectEl.querySelector('.el-select__tags').style.borderWidth = '0 46px 0 16px'
          }
          advancedSelectEl.querySelector('.arrow-left').style.display = 'block'
          advancedSelectEl.querySelector('.arrow-right').style.display = 'block'
          // 移除时缩进样式
          if (innerWidth - outerWidth + 32 < this.arrowNum) {
            this.arrowNum = innerWidth - outerWidth + 32
            this.arrowPath = 'right'
            if (advancedSelectEl.querySelector('.el-select__tags>span')) {
              advancedSelectEl.querySelector('.el-select__tags>span').style.transform = 'translateX(' + -this.arrowNum + 'px)'
            }
          }
        } else {
          advancedSelectEl.querySelector('.arrow-left').style.display = 'none'
          advancedSelectEl.querySelector('.arrow-right').style.display = 'none'
          this.arrowNum = 0
          if (advancedSelectEl.querySelector('.el-select__tags')) {
            advancedSelectEl.querySelector('.el-select__tags').style.borderWidth = '0'
            advancedSelectEl.querySelector('.el-select__tags>span').style.transform = 'translateX(' + 0 + 'px)'
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
      // 获取refs的dom结构
      let advancedSelectEl
      if (!(this.$refs && this.$refs[`select${this.keyId}`])) return
      if (this.$refs[`advancedSelect${this.keyId}`].$el) {
        advancedSelectEl = this.$refs[`advancedSelect${this.keyId}`].$el
      } else {
        advancedSelectEl = this.$refs[`advancedSelect${this.keyId}`]
      }
      let innerWidths = advancedSelectEl.querySelectorAll('.el-select__tags .el-tag')
      let outerWidth = advancedSelectEl.querySelector('.el-select__tags').offsetWidth - 62
      let innerWidth = 0
      //IE NodeList.forEach 不兼容
      /* innerWidths.forEach(item => {
        innerWidth = innerWidth + item.offsetWidth
      }) */
      //IE es5兼容写法
      Array.prototype.forEach.call(innerWidths, item => {
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
      advancedSelectEl.querySelector('.el-select__tags>span').style.transform = 'translateX(' + -this.arrowNum + 'px)'
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-tip {
  position: relative;
}
.el-select{
  /deep/{
    .el-select__tags{
      span.el-select__tags-text{
        max-width:100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}
// 多选时带左右箭头样式
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
      width: 60000px;
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
.el-select-dropdown__item {
  /deep/ span {
    display: inline-block;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
/deep/ .el-form-item__label {
  word-break: break-all;
}
</style>
<style lang="scss">
// 覆盖公共样式
.advance-select-dropdown {
  .el-scrollbar__wrap {
    overflow: scroll;
  }
}
</style>
