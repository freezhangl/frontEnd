import axios from 'axios'
import { Message } from 'element-ui'
import loading from './loading'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: '/',
  // 超时
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  loading.show()
  const token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : null

  config.headers.token = token
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?'
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName]
      var part = encodeURIComponent(propName) + '='
      if (value !== null && typeof (value) !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            url += subPart + encodeURIComponent(value[key]) + '&'
          }
        } else {
          url += part + encodeURIComponent(value) + '&'
        }
      }
    }
    url = url.slice(0, -1)

    config.params = {}
    config.url = url
  }
  return config
}, error => {
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  loading.hide()
  // 未设置状态码则默认成功状态
  const code = res.data.code
  if (code === 403) {
    let errMsg = judgeMessage()
    let str = '登录信息已过期，请重新登录!'
    // '您没有权限访问!'
    if (errMsg === 0) {
      Message({
        message: str,
        showClose: true,
        type: 'error',
        duration: 10000
      })
      location.href = '/home'
    }
    res.data.message = ''
    return Promise.reject(res.data)
  } else if (code === '200') {
    if (res.config.url === "/abc/login" || res.config.url === 'http://22.188.14.123:8061/login') {
      return Promise.resolve(res)
    } else {
      return Promise.resolve(res.data)
    }
  } else {
    return Promise.reject(res.data)
  }
},
error => {
  loading.hide()
  error.selfError = 'selfError'
  let { message } = error
  if (message === 'Network Error') {
    message = '后端接口连接异常'
  } else if (message.includes('timeout')) {
    message = '系统接口请求超时'
  } else if (message.includes('Request failed with status code')) {
    message = '系统接口' + message.substr(message.length - 3) + '异常'
  }
  Message({
    message: message,
    type: 'error',
    duration: 10000
  })
  return Promise.reject(error)
}
)
function judgeMessage () {
  let mesList = Array.from(document.getElementsByClassName('el-message'))
  let num = 0
  let mesArr = ['您没有权限访问!', '登录信息已过期，请重新登录!']
  mesList.forEach(element => {
    let msg = element.innerText
    if (mesArr.indexOf(msg) > -1) {
      num++
    }
  })
  return num
}

export default service
