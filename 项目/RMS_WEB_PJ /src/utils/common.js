export function isShowToolTip (val, len = 280, styles = {}) {
  let con = document.getElementsByTagName('body')[0]
  let span = document.createElement('span')
  span.id = 'assistSpan'
  for (let key in styles) {
    span.style[key] = styles[key]
  }
  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  con.appendChild(span)
  span.innerText = val
  let showTip = document.getElementById('assistSpan').offsetWidth > len
  con.removeChild(span)
  return showTip
}

/**
 * 对象数组去重
 * @param {Array} arr 需要去重的对象数组
 * @param {String} key 去重的字段名
 * @return {Array}
 */
export function uniqueObjArr (arr, key) {
  let hash = {}
  let temp = arr.reduce((item, next) => {
    if (!hash[next[key]]) { // 根据 key 去重
      hash[next[key]] = true
      item.push(next)
    }
    return item
  }, [])
  return temp
}
