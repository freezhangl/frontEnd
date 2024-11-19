import Http from '@lib/common/http'
import store from '@/store'

const baseUrl = store.getters['CONFIG/baseUrl']
//接口地址
const apiPath = {
  login: baseUrl + '/rms/auth/uniauth/v1/login', //用户名密码校验接口
  imageCode: baseUrl + '/api-platform/common/verificationCode', //获取图片验证码
  phoneCode: baseUrl + '/rms/auth/uniauth/v1/dynamic/code', //获取手机短信验证码
  SSOAuthUrl: baseUrl + '/rms/auth/uniauth/v1/session'//获取单点登录token信息
}

export default {
  //登录
  login (params) {
    return Http.post(apiPath.login, params, { isLogin: true })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },

  //获取图片验证码
  getImageCode (params) {
    return Http.post(apiPath.imageCode, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },

  //获取手机短信验证码
  getPhoneCode (params) {
    return Http.get(apiPath.phoneCode, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },

  getSSOAuth (params) {
    return Http.get(apiPath.SSOAuthUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

}
