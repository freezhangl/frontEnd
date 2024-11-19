export default {
  // 格式化后台传过来的格式为[2020,5,18,15,20,53]的时间数据
  timestampToTime (cjsj) {
    let Y = cjsj[0] + '-'
    let M = cjsj[1] + '-'
    let D = cjsj[2]
    return Y + M + D
  },

  // 根据key 取 value
  valueByKey (key, list) {
    let result = ''
    if (key !== null && key !== '') {
      list.forEach(item => {
        if (item.value.toString() === key) {
          result = item.label
        }
      })
    }
    return result
  },

  //时间戳转为日期时间yyyy-MM-dd hh:mm:ss
  timestampToDateTime (cjsj) {
    let date = new Date(cjsj)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate() + ' '
    let h = date.getHours() + ':'
    let m = date.getMinutes() + ':'
    let s = date.getSeconds()
    return Y + M + D + h + m + s
  },

  //时间戳转为日期yyyy-MM-dd
  timestampToDate (cjsj) {
    let date = new Date(cjsj)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    return Y + M + D
  }

}
