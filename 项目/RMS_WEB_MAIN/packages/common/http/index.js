import Http from './src/main'
import { Message } from 'element-ui'

//定当前系统的http请求环境，用户的配置config
const thisEnv = {
  loading: true
}

//创建一个实例
let http = new Http(thisEnv)

//响应拦截器
http.interceptors.response.use(
  response => {
    if (response.responseType === 'json') { //返回普通json
      if (response.responseProp.indexOf('headers') > -1) {
        let res = {
          data: response.data,
          headers: response.headers
        }
        if (res.data.code === 0) {
          return Promise.resolve(res) //请求成功
        } else {
          return Promise.reject(response.data) //请求失败
        }
      } else {
        let res = response.data ? response.data : { code: 2, data: {}, message: '我的错误' }
        if (res.code === 0) {
          return Promise.resolve(res.data)
        } else {
          return Promise.reject(res)
        }
      }
    }
    if (response.responseType === 'blob') { //返回二进制大对象（下载文件）
      if (response.responseProp.indexOf('headers') > -1) {
        let res = {
          data: response.data,
          headers: response.headers
        }
        return Promise.resolve(res)
      } else {
        return Promise.resolve(response.data)
      }
    }
  },
  err => {
    let errorStatus = err.error
    err.selfError = 'selfError'
    let errMsg = judgeMessage()
    switch (errorStatus) {
      case 'invalid_grant':
        Message.error('无效的权限！')
        break
      case 'Unauthorized':
        if (errMsg === 0) {
          Message.error('未授权的访问，请登录拥有该权限的账户！')
          sessionStorage.removeItem('userInfo') //TODO:
          window.location.href = '#/login'
        }
        break
      case 'invalid_token':
        if (errMsg === 0) {
          Message.error('登录时效过期，请重新登录！')
          sessionStorage.removeItem('userInfo') //TODO:
          window.location.href = '#/login'
        }
        break
      case 'Internal Server Error':
        Message.error('系统服务出错，请联系管理员！')
        break
      case 'Not Found':
        Message.error('请求地址出错！')
        break
      default:
        Message.error('系统服务出错，请联系管理员！')
    }
    return Promise.reject(err)
  })

function judgeMessage () {
  let mesList = Array.from(document.getElementsByClassName('el-message'))
  let num = 0
  let mesArr = ['未授权的访问，请登录拥有该权限的账户！', '登录时效过期，请重新登录！']
  mesList.forEach(element => {
    let msg = element.innerText
    if (mesArr.indexOf(msg) > -1 ||
    msg.indexOf('用户状态不正常') > -1 ||
    msg.indexOf('账号被锁定') > -1 ||
    msg.indexOf('账号未启用') > -1 ||
    msg.indexOf('账号注销') > -1) {
      num++
    }
    // console.log('judgeMessage00', num)
  })
  return num
}
//提供全局的注册服务
const install = function (Vue) {
  // 注册http组件
  Vue.prototype.$api = http
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

//根据配置信息动态的生成HTTP服务
const createHttpServe = function (apiConfigList) {
  let serve = {}
  if (apiConfigList && apiConfigList.length > 0) {
    apiConfigList.forEach(row => {
      const method = row.method.toLowerCase()
      switch (method) {
        case 'get':
          serve[row.name] = function (params) {
            return http.get(row.url, params, row.config)
              .then(res => {
                return Promise.resolve(res)
              })
              .catch(err => {
                return Promise.reject(err)
              })
          }
          break
        case 'get/params':
          serve[row.name] = function (params) {
            return http.get(row.url + '/' + params, null, row.config)
              .then(res => {
                return Promise.resolve(res)
              })
              .catch(err => {
                return Promise.reject(err)
              })
          }
          break
        case 'post':
          serve[row.name] = function (params) {
            return http.post(row.url, params, row.config)
              .then(res => {
                return Promise.resolve(res)
              })
              .catch(err => {
                return Promise.reject(err)
              })
          }
          break
        default:
          // console.warn('[createHttpServe] ' + row.method + '方法不支持创建')
      }
    })
  } else {
    // console.warn('[createHttpServe] This apiConfigList : ', apiConfigList)
    throw new Error('接口配置信息不能为空')
  }
  return serve
}

export default {
  ...http,
  filter: Http.filter,
  install,
  createHttpServe
}
