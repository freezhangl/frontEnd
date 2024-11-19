<!--
数值组件
<component
  :is="fNumber" // fNumber数值
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.validatorDto.length //最大长度
props.validatorDto.min //最小值
props.validatorDto.max //最大值
props.validatorDto.numFormat //数值格式#  #.00   #,###.00  #.#
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
    update () {
      this.changeValue()
    },
    changeValue () {
      if (parseFloat(this.value)) {
        if (this.props.validatorDto && this.props.validatorDto.numFormat === '#') {
          this.value = Math.round(parseFloat(this.value))
        } else if (this.props.validatorDto && this.props.validatorDto.numFormat === '#.00') {
          this.value = parseFloat(this.value)
            .toFixed(2)
        } else if (this.props.validatorDto && this.props.validatorDto.numFormat === '#,###.00') {
          this.value = this.comdify(parseFloat(this.delcommafy(this.value)))
        } else if (this.props.validatorDto && this.props.validatorDto.numFormat === '#.#') {
          this.value = parseFloat(this.value)
        } else {
          this.value = parseFloat(this.value)
        }
      } else {
        // this.value = parseFloat(0)
      }
      this.$emit('update:data', this.value.toString())
      this.$emit('changeEvent', this.value.toString())
      this.props.previewName = this.value.toString()
    },
    getPreviewName (name) {
      this.props.previewName = name.toString()
    },
    // changeValue () {
    //   if (parseFloat(this.value)) {
    //     if (this.props.validatorDto && this.props.validatorDto.fdouble) {
    //       let arr = this.value.split('.')
    //       if (arr[1]) {
    //         this.value = Number(arr[0] + '.' + arr[1].substring(0, this.props.validatorDto.fdouble))
    //       } else {
    //         this.value = Number(arr[0] + '.' + '00')
    //           .toFixed(this.props.validatorDto.fdouble)
    //       }
    //     } else {
    //       this.value = Number(this.value)
    //     }
    //   } else {
    //     if (this.props.validatorDto && this.props.validatorDto.fdouble) {
    //       this.value = parseFloat(0)
    //         .toFixed(this.props.validatorDto.fdouble)
    //     } else {
    //       this.value = parseFloat(0)
    //     }
    //   }
    //   this.$emit('update:data', this.value.toString())
    //   this.$emit('changeEvent', this.value.toString())
    //   this.props.previewName = this.value.toString()
    // },
    // changeValue () {
    //   if (parseFloat(this.value)) {
    //     if (this.props.validatorDto && this.props.validatorDto.fdouble) {
    //       this.value = Number(this.value)
    //         .toFixed(this.props.validatorDto.fdouble)
    //     } else {
    //       this.value = Number(this.value)
    //     }
    //   } else {
    //     if (this.props.validatorDto && this.props.validatorDto.fdouble) {
    //       this.value = parseFloat(0)
    //         .toFixed(this.props.validatorDto.fdouble)
    //     } else {
    //       this.value = parseFloat(0)
    //     }
    //   }
    // },
    validator (rule, value, callback) {
      let num = /^[-+]?[0-9]+(\.[0-9]+)?$/
      if (this.props.isRequire === '1' && !this.value) {
        callback(new Error(`请输入${this.props.fieldTitle.replace('<br>', '')}`))
      } else if (this.props.validatorDto.min && parseFloat(this.delcommafy(this.value)) < parseFloat(this.props.validatorDto.min)) {
        callback(new Error(`请输入正确的${this.props.fieldTitle.replace('<br>', '')}，数值应大于等于${this.props.validatorDto.min}`))
      } else if (this.props.validatorDto.max && parseFloat(this.delcommafy(this.value)) > parseFloat(this.props.validatorDto.max)) {
        callback(new Error(`请输入正确的${this.props.fieldTitle.replace('<br>', '')}，数值应小于等于${this.props.validatorDto.max}`))
      } else if (this.value && !num.test(this.value)) {
        if (this.props.validatorDto && this.props.validatorDto.numFormat === '#,###.00') {
          if (this.value && !num.test(this.delcommafy(this.value))) {
            callback(new Error(`请输入正确${this.props.fieldTitle.replace('<br>', '')}`))
          } else {
            callback()
          }
        } else {
          callback(new Error(`请输入正确${this.props.fieldTitle.replace('<br>', '')}`))
        }
      } else {
        callback()
      }
    },
    // 转成千分位，保留两位
    comdify (n) {
      let num = Number(n)
      let re = /\d{1,3}(?=(\d{3})+$)/g
      let n1 = num.toFixed(2)
        .replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
          return s1.replace(re, '$&,') + s2
        })
      return n1
    },
    // 去除千分位中的‘，’
    delcommafy (num) {
      if (num && num !== 'undefined' && num !== 'null') {
        let numS = num
        numS = numS.toString()
        numS = numS.replace(/,/gi, '')
        return numS
      } else {
        return num
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
</style>
