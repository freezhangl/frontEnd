import dayjs from 'dayjs'

export function formatDate (val, formater = 'YYYY-MM-DD HH:mm:ss') {
  if (!val) return ''
  return dayjs(val)
    .format(formater)
}

export function isShowToolTip (val, len = 280) {
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
export const diffTime = (startTime, endTime) => {
  // 将时间字符串变成 毫秒时间戳
  const format = time => dayjs(time) - 0;
  const startTimestamp = dayjs(format(startTime));
  const endTimestamp = dayjs(format(endTime));
  const deltaMs = Math.abs(endTimestamp - startTimestamp);
  // 计算出相差天数
  const days = Math.floor(deltaMs / (24 * 3600 * 1000));
  // 计算天数后剩余的毫秒数
  const leave1 = deltaMs % (24 * 3600 * 1000);
  // 计算出小时数
  const hours = Math.floor(leave1 / (3600 * 1000));
  // 计算小时数后剩余的毫秒数
  const leave2 = leave1 % (3600 * 1000);
  // 计算相差分钟数
  const minutes = Math.floor(leave2 / (60 * 1000));
  // 计算分钟数后剩余的毫秒数
  const leave3 = leave2 % (60 * 1000);
  // 计算相差秒数
  const seconds = Math.round(leave3 / 1000);
  return {
    days,
    hours,
    minutes,
    seconds
  };
};
//  diffTime((new Date(), "2021-09-25 00:00:00"));
