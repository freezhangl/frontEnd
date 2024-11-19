import axios from 'axios'
import {
  isObject,
  isArray,
  isString,
  assign
} from 'lodash'
import env from './env'
import { aes } from '../../util/encrypt'

/**
 * HTTP对象
 * @param {Object} config 用户提供的配置参数
 */
function Http (config) {
  if (!(this instanceof Http)) {
    throw new SyntaxError(
      '[Http] Http is a constructor and should be called with the `new` keyword'
    )
  }
  if (Object.prototype.toString.call(config) !== '[object Object]') {
    throw new TypeError(
      '[Http] The configuration parameter of the new Http must be an object.'
    )
  }
  let self = this
  // 初始化配置信息
  self.config = env(config)
  self.name = 'http'
  // 请求baseUrl
  self.baseURL = self.config.baseURL
  // 请求loading服务
  self.loadingModule = self.config.modules.loading
  // 请求头
  self.headers = self.config.headers
  //响应体类型
  self.responseType = self.config.responseType
  //响应体包含的属性
  self.responseProp = self.config.responseProp
  //对请求的参数中，包含以下值的数据进行过滤
  self.filters = self.config.filtersArray
  //是否过滤参数
  self.isfilter = !!self.filters.length

  // 封装该HTTP请求
  let HTTP = axios.create(self.config.axios)

  /**
   * 请求拦截器 - 参数过滤
   * 请求参数进行数据过滤，过滤不会对数据进行递归过滤
   */
  if (self.config.filters) {
    HTTP.interceptors.request.use(function (config) {
      let filtersArr = self.filters
      if (self.isfilter) {
        if (config.params) {
          config.params = self.config.handleFilter(config.params, filtersArr)
        }
        if (config.data) {
          config.data = self.config.handleFilter(config.data, filtersArr)
        }
      }
      return config
    })
  }

  /**
   * 请求拦截器 - 为get请求和delete请求添加时间戳
   */
  if (self.timeStamp) {
    HTTP.interceptors.request.use(function (config) {
      if (isString(self.config.timeStamp)) {
        // 仅为get请求和delete请求添加时间戳
        if (config.params && isObject(config.params)) {
          config.params[self.config.timeStamp] = new Date()
            .getTime()
        }
      }
      return config
    })
  }

  /**
   * 响应拦截器 - 初始化响应体数据
   *
   * 针对正常请求返回的数据，返回response.data中的内容
   * 针对请求返回状态码非200的情况，将错误信息格式化接口返回的数据格式，方便在catch中统一处理
   */
  HTTP.interceptors.response.use(
    function (response) {
      let returnResponse = {
        responseType: response.config.responseType,
        responseProp: self.responseProp
      }
      let propItems = self.responseProp
      propItems.forEach(item => {
        returnResponse[item] = response[item]
      })
      // console.log(returnResponse)
      return returnResponse
    },
    function (error) {
      // console.error('[http] Request ERROR', error)
      if (error.response) {
        if (error.response.data) {
          return Promise.reject(error.response.data)
          // 否则，将错误码和错误状态码作为错误信息抛出
        } else {
          let errorModel = {
            code: -1,
            message: `${error.response.statusText}(${error.response.status})`,
            data: null
          }
          return Promise.reject(errorModel)
        }
      }
      // 请求如果没有返回响应体，直接抛出异常
      throw error
    }
  )

  /**
   * 暴露过滤器配置对象
   * 通过该对象自定义过滤器
   */
  self.interceptors = HTTP.interceptors

  /**
   * 获取请求头 TODO: 当前无用户，无请求头
   */
  self.requestAuthorization = function () {
    var localInfo = ''
    if (sessionStorage.getItem('userInfo')) {
      localInfo = JSON.parse(aes.de(sessionStorage.getItem('userInfo')))
    }
    var tokenInfo = {
      token: localInfo ? localInfo.token : '',
      tokenType: localInfo ? localInfo.tokenType : ''
    }
    var requestHeader = null
    if (tokenInfo.token) {
      let headerAuth = tokenInfo.tokenType.charAt(0)
        .toUpperCase() + tokenInfo.tokenType.slice(1) + ' ' + tokenInfo.token
      requestHeader = {
        Authorization: headerAuth
      }
    }
    return requestHeader
  }

  /**
   * 发起一个ajax请求
   * @param  {object} config 请求参数
   * @return {Promise}        请求结果
   */
  self.request = function (config) {
    self.responseProp = config.responseProp !== undefined ? config.responseProp : self.config.responseProp
    self.filters = config.filters !== undefined ? config.filters : self.config.filtersArray
    self.isfilter = config.isfilter !== undefined ? config.isfilter : self.config.filters

    let isShowLoading = config.loading !== undefined ? config.loading : self.config.loading
    let loadingText = config.loadingText !== undefined ? config.loadingText : self.config.loadingText

    config.responseType = config.responseType !== undefined ? config.responseType : self.config.responseType
    if (config.url === 'undefined') {
      // console.warn('[http] This ajax request config is: ', config)
      throw new Error('The ajax request config.url is required')
    }
    if (self.requestAuthorization() && !config.isLogin) {
      config.headers = assign(config.headers, self.requestAuthorization())
    }
    // loading图
    isShowLoading && self.loadingModule.show(loadingText)
    // 请求
    // console.log(config)
    return HTTP.request(config)
      .then(response => {
        // loading
        isShowLoading && self.loadingModule.hide()
        return Promise.resolve(response)
      })
      .catch(error => {
        // loading
        isShowLoading && self.loadingModule.hide()
        return Promise.reject(error)
      })
  }

  /**
   * 发送一个get请求
   * @param   {string}    请求地址
   * @param   {object}    请求参数
   * @config  {object}    请求其他配置信息
   */
  self.get = function (url, params = {}, config = {}) {
    config.url = self._encodeURI(url)
    config.method = 'GET'
    config.params = params
    return self.request(config)
  }
  /**
   * 发送一个post请求
   */
  self.post = function (url, data = {}, config = {}) {
    config.url = self._encodeURI(url)
    config.method = 'POST'
    config.data = data
    return self.request(config)
  }
  /**
   * 发送一个delete请求
   */
  self.delete = function (url, params = {}, config = {}) {
    config.url = self._encodeURI(url)
    config.method = 'DELETE'
    config.params = params
    return self.request(config)
  }
  /**
   * 发送一个put请求
   */
  self.put = function (url, data = {}, config = {}) {
    config.url = self._encodeURI(url)
    config.method = 'PUT'
    config.data = data
    return self.request(config)
  }
  /**
   * 内部方法，转码URL地址
   * @param {string} url
   * @returns {string}
   */
  self._encodeURI = function (url) {
    return encodeURI(url)
  }
}

export default Http
