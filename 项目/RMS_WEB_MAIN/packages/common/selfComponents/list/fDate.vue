<!--
日期组件
<component
  :is="fDate" // fDate日期
  :props="item" // 需要传入的值，为一个对象
  :ref="`item${item.fieldKey}`" // this.$refs中的唯一标识
  status="from" // "form"为新增或者编辑页，"result"为预览页
  :data.sync="item.defaultValue" // 传入的data值，使用this.$emit('update:data', value)同步更新数据
  @changeEvent="changeEvent($event, index, index1)" // 父组件获取到change事件
></component>
props.validatorDto.min最大值
props.validatorDto.max最小值
JSON.parse(props.attrs).type === 'date'  //日期yyyy-MM-dd  yyyy.MM.dd  yyyy/MM/dd
JSON.parse(props.attrs).type === 'time'  //时间HH:mm:ss
JSON.parse(props.attrs).type === 'dateTime'  //日期时间yyyy.MM.dd HH:mm:ss  yyyy-MM-dd HH:mm:ss    yyyy/MM/dd HH:mm:ss
JSON.parse(props.attrs).type === 'dateRange'  //日期范围yyyy-MM-dd  yyyy.MM.dd  yyyy/MM/dd
JSON.parse(props.attrs).type === 'dateTimeRange'  //日期时间范围yyyy.MM.dd HH:mm:sss  yyyy-MM-dd HH:mm:ss    yyyy/MM/dd HH:mm:ss
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
      <div v-if="status !== 'result'">
        <el-tooltip
          class="item"
          effect="dark"
          :disabled="!(value && value.toString())"
          :content="value?value.toString():''"
          placement="top-start">
          <el-date-picker
            :placeholder="props.tip"
            :disabled="props.isReadonly === '1'"
            v-if="JSON.parse(props.attrs).type === 'date'"
            v-model="value"
            @change="update"
            :picker-options="pickerOptions"
            :value-format="JSON.parse(props.attrs).format"
            :format="JSON.parse(props.attrs).format"
            type="date">
          </el-date-picker>
          <el-time-picker
            arrow-control
            :placeholder="props.tip"
            :disabled="props.isReadonly === '1'"
            v-if="JSON.parse(props.attrs).type === 'time'"
            v-model="value"
            :picker-options="pickerOptionsTime"
            @change="update"
            :value-format="JSON.parse(props.attrs).format"
            :format="JSON.parse(props.attrs).format">
          </el-time-picker>
          <el-time-picker
            is-range
            v-model="value"
            @change="update"
            v-if="JSON.parse(props.attrs).type === 'timeRange'"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :placeholder="props.tip"
            :picker-options="pickerOptions"
            value-format="HH:mm:ss"
            format="HH:mm:ss">
          </el-time-picker>
          <el-date-picker
            :placeholder="props.tip"
            :disabled="props.isReadonly === '1'"
            v-if="JSON.parse(props.attrs).type === 'dateTime'"
            v-model="value"
            @change="update"
            type="datetime"
            :picker-options="pickerOptions"
            :value-format="JSON.parse(props.attrs).format"
            :format="JSON.parse(props.attrs).format">
          </el-date-picker>
          <el-date-picker
            v-if="JSON.parse(props.attrs).type === 'dateRange' || JSON.parse(props.attrs).type === 'dateTimeRange'"
            v-model="value"
            :disabled="props.isReadonly === '1'"
            @change="update"
            :type="JSON.parse(props.attrs).type === 'dateRange'?'daterange':'datetimerange'"
            :value-format="JSON.parse(props.attrs).format"
            :format="JSON.parse(props.attrs).format"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-tooltip>
      </div>
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
    const that = this
    return {
      value: this.getValue(),
      pickerOptions: {
        disabledDate (time) {
          // 将2020.02.02格式转为2020/02/02，兼容IE浏览器
          let minT = that.props.validatorDto.min
          let maxT = that.props.validatorDto.max
          if (minT) {
            if (minT.substring(4, 5) === '.') {
              that.props.validatorDto.min = minT.replace(/\./g, '/')
            } else if (minT.substring(4, 5) === '-') {
              // eslint-disable-next-line no-useless-escape
              that.props.validatorDto.min = minT.replace(/\-/g, '/')
            }
          }
          if (maxT) {
            if (maxT.substring(4, 5) === '.') {
              that.props.validatorDto.max = maxT.replace(/\./g, '/')
            } else if (maxT.substring(4, 5) === '-') {
              // eslint-disable-next-line no-useless-escape
              that.props.validatorDto.max = maxT.replace(/\-/g, '/')
            }
          }
          if (that.props.validatorDto && that.props.validatorDto.min && that.props.validatorDto.min !== '') {
            // 获取最小值的时间戳
            let minGetTime = JSON.parse(that.props.attrs).type === 'dateTime' || JSON.parse(that.props.attrs).type === 'dateTimeRange' ? new Date(that.props.validatorDto.min)
              .getTime() - 1 * 24 * 3600 * 1000 : new Date(that.props.validatorDto.min)
              .getTime()
            // 获取最大值的时间戳
            let maxGetTime = JSON.parse(that.props.attrs).type === 'date' || JSON.parse(that.props.attrs).type === 'dateRange' ? new Date(that.props.validatorDto.max)
              .getTime() + 1 * 24 * 3600 * 1000 : new Date(that.props.validatorDto.max)
              .getTime()
            if (that.props.validatorDto.max && that.props.validatorDto.max !== '') {
              return time.getTime() >= maxGetTime || time.getTime() < minGetTime
            } else {
              return time.getTime() < minGetTime
            }
          }
          if (that.props.validatorDto && that.props.validatorDto.max && that.props.validatorDto.max !== '') {
            // 获取最大值的时间戳
            let maxGetTime = JSON.parse(that.props.attrs).type === 'date' ? new Date(that.props.validatorDto.max)
              .getTime() + 1 * 24 * 3600 * 1000 : new Date(that.props.validatorDto.max)
              .getTime()
            if (that.props.validatorDto.min && that.props.validatorDto.min !== '') {
              // 获取最小值的时间戳
              let minGetTime = JSON.parse(that.props.attrs).type === 'dateTime' || JSON.parse(that.props.attrs).type === 'dateTimeRange' || JSON.parse(that.props.attrs).type === 'dateRange' ? new Date(that.props.validatorDto.min)
                .getTime() - 1 * 24 * 3600 * 1000 : new Date(that.props.validatorDto.min)
                .getTime()
              return time.getTime() >= maxGetTime || time.getTime() < minGetTime
            } else {
              return time.getTime() >= maxGetTime
            }
          }
          return null
        }
        // selectableRange: this.selectableRange()
      },
      pickerOptionsTime: {
        selectableRange: this.selectableRangeTime()
      }
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
    // console.log(this.props, this.value, this.pickerOptions, this.selectableRange(), this.dateType())
  },
  methods: {
    getValue () {
      let v
      if (this.data && this.status === 'result') {
        v = this.data
      } else if (this.data && this.status !== 'result' && typeof this.data === 'object') {
        v = this.data
      } else if (this.data && this.status !== 'result' && this.data.substr(0, 1) === '[' && this.data.substr(this.data.length - 1, 1) === ']') {
        v = JSON.parse(this.data)
      } else {
        v = this.data
      }
      return v
      // this.data && this.status === 'result' ? this.data : this.data && this.status !== 'result' ? JSON.parse(this.data) : this.status !== 'result' && (JSON.parse(this.props.attrs).type === 'timeRange' || JSON.parse(this.props.attrs).type === 'date' || JSON.parse(this.props.attrs).type === 'dateTime') ? '' : this.status !== 'result' ? [] : ''
    },
    selectableRangeTime () {
      let timeMin = '00:00:00'
      let timeMax = '23:59:59'
      if (this.props.validatorDto && this.props.validatorDto.min && this.props.validatorDto.min !== '') {
        let minArr = this.props.validatorDto.min.split(' ')
        timeMin = minArr[minArr.length - 1]
      }
      if (this.props.validatorDto && this.props.validatorDto.max && this.props.validatorDto.max !== '') {
        let maxArr = this.props.validatorDto.max.split(' ')
        timeMax = maxArr[maxArr.length - 1]
      }
      return timeMin + ' - ' + timeMax
    },
    selectableRange () {
      var timeMin = ''
      var timeMax = ''
      if (this.props.validatorDto && this.props.validatorDto.min && this.props.validatorDto.min !== '') {
        if (this.props.validatorDto.max && this.props.validatorDto.max !== '') {
          let minArr = this.props.validatorDto.min.split(' ')
          let maxArr = this.props.validatorDto.max.split(' ')
          timeMin = minArr[minArr.length - 1]
          timeMax = maxArr[maxArr.length - 1]
          if (JSON.parse(this.props.attrs).type.indexOf('Range') !== -1) {
            return [timeMin + ' - ' + timeMax, timeMin + ' - ' + timeMax]
          } else {
            return timeMin + ' - ' + timeMax
          }
        } else {
          return null
        }
      } else {
        return null
      }
    },
    dateType () {
      // debugger
      const type = JSON.parse(this.props.attrs).type
      const format = JSON.parse(this.props.attrs).format
      if (type.toLowerCase()
        .indexOf('range') !== -1) {
        this.value = []
        if (type === 'timeRange') {
          this.value = this.props.defaultValue || null
        }
      } else {
        this.value = ''
      }
      if (type === 'date') {
        if (format === 'yyyy') {
          return 'year'
        } else if (format === 'yyyy-mm') {
          return 'month'
        } else {
          return 'date'
        }
      } else if (type === 'dateTime' || type === 'dateTimeRange') {
        if (format.replace(/\s*/g, '')
          .toLowerCase() === 'yyyy-mm-ddhh') {
          return 'yyyy-MM-dd HH'
        } else if (format.replace(/\s*/g, '')
          .toLowerCase() === 'yyyy-mm-ddhh:mm') {
          return 'yyyy-MM-dd HH:mm'
        } else {
          return 'yyyy-MM-dd HH:mm:ss'
        }
      } else if (type === 'time' || type === 'timeRange') {
        if (format.toLowerCase() === 'hh') {
          return 'HH'
        } else if (format.toLowerCase() === 'hh:mm') {
          return 'HH:mm'
        } else {
          return 'HH:mm:ss'
        }
      } else if (type === 'dateRange') {
        if (format === 'yyyy') {
          return 'yyyy'
        } else if (format === 'yyyy-mm') {
          return 'yyyy-MM'
        } else {
          return 'yyyy-MM-dd'
        }
      }
    },
    // 时间戳转化为时间
    timestampToTime (timestamp, format) {
      var YNnit, MNnit, DNnit, hNnit, mNnit, sNnit
      if (format === 'yyyy.MM.dd HH:mm:ss') {
        YNnit = '.'
        MNnit = '.'
        DNnit = ' '
        hNnit = ':'
        mNnit = ':'
        sNnit = ''
      } else if (format === 'yyyy/MM/dd HH:mm:ss') {
        YNnit = '/'
        MNnit = '/'
        DNnit = ' '
        hNnit = ':'
        mNnit = ':'
        sNnit = ''
      } else if (format === 'yyyy-MM-dd HH:mm:ss') {
        YNnit = '-'
        MNnit = '-'
        DNnit = ' '
        hNnit = ':'
        mNnit = ':'
        sNnit = ''
      } else if (format === 'yyyy年MM月dd日 HH时mm分ss秒') {
        YNnit = '年'
        MNnit = '月'
        DNnit = '日 '
        hNnit = '时'
        mNnit = '分'
        sNnit = '秒'
      }
      var date = new Date(timestamp)//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + YNnit
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + MNnit
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + DNnit
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + hNnit
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + mNnit
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + sNnit
      return Y + M + D + h + m + s
    },
    validator (rule, value, callback) {
      if (this.props.isRequire === '1' && this.value.length === 0) {
        callback(new Error('请选择' + this.props.fieldTitle.replace('<br>', '')))
      } else {
        callback()
      }
    },
    update (v) {
      // 日期时间，日期时间范围最小值 最大值赋值
      if (v && JSON.parse(this.props.attrs).type === 'dateTimeRange') {
        if (this.props.validatorDto.min && new Date(v[0]) < new Date(this.props.validatorDto.min)) {
          v[0] = this.timestampToTime(new Date(this.props.validatorDto.min), JSON.parse(this.props.attrs).format)
        }
        if (new Date(v[1]) < new Date(v[0])) {
          v[1] = v[0]
        }
        this.value = v
        this.$forceUpdate()
      } else if (v && JSON.parse(this.props.attrs).type === 'dateTime') {
        if (this.props.validatorDto.min && new Date(v) < new Date(this.props.validatorDto.min)) {
          v = this.timestampToTime(new Date(this.props.validatorDto.min), JSON.parse(this.props.attrs).format)
          this.value = v
          this.$forceUpdate()
        } else if (this.props.validatorDto.max && new Date(v) > new Date(this.props.validatorDto.max)) {
          v = this.timestampToTime(new Date(this.props.validatorDto.max), JSON.parse(this.props.attrs).format)
          this.value = v
          this.$forceUpdate()
        }
      }
      if (!v) {
        this.$emit('update:data', '')
        this.$emit('changeEvent', '')
        this.props.previewName = ''
      } else if (typeof v === 'string') {
        this.$emit('update:data', v)
        this.$emit('changeEvent', v)
        this.props.previewName = v
      } else {
        this.$emit('update:data', JSON.stringify(v))
        this.$emit('changeEvent', JSON.stringify(v))
        this.props.previewName = v.join(' - ')
      }
    },
    getPreviewName (name) {
      if (name && typeof name === 'object') {
        this.props.previewName = name.join(' - ')
      } else if (name && name.substr(0, 1) === '[' && name.substr(name.length - 1, 1) === ']') {
        this.props.previewName = JSON.parse(name)
          .join(' - ')
      } else {
        this.props.previewName = name
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
