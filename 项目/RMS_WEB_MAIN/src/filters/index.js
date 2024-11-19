import Vue from 'vue'

//时间戳转换成时间格式
Vue.filter('dateFormatTransition', function (val) {
  val = new Date(val)
  var year = val.getFullYear() //取得4位数的年份
  var month = val.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
  var date = val.getDate() //返回日期月份中的天数（1到31）
  var hour = val.getHours() //返回日期中的小时数（0到23）
  var minute = val.getMinutes() //返回日期中的分钟数（0到59）
  var second = val.getSeconds() //返回日期中的秒数（0到59）
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
})
