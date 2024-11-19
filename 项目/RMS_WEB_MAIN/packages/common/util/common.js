import dayjs from 'dayjs'

export function formatDate (val, formater = 'YYYY-MM-DD HH:mm:ss') {
  if (!val) return ''
  return dayjs(val)
    .format(formater)
}

export function roleStateTest (val) {
  return val + 'test'
}

export function isShowToolTip (val, len = 280) {
  // let con = document.getElementById('user-auth-main-right')
  let con = document.getElementsByTagName('body')[0]
  let span = document.createElement('span')
  span.id = 'assistSpan'
  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  con.appendChild(span)
  span.innerText = val
  let showTip = document.getElementById('assistSpan').offsetWidth > len
  con.removeChild(span)
  return showTip
}
