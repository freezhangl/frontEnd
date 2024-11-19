
/**
 * assign  用后面的属性去覆盖前面的属性
 * merge   用后面的属性去合并前面的属性
 */
import { assign, toLower, merge, keys, includes, isArray } from 'lodash'

export default function (userConfig) {
  // 优先使用 MOCK_ENV 变量, 如果该变量没有设置, 则使用 NODE_ENV
  let mockEnv = process.env.MOCK_ENV || process.env.NODE_ENV || 'production'
  let config = merge(
    {
      /**
       * 当前访问的host地址，不配置时，默认使用部署环境的host地址
       * @type {string}
       */
      host: null,
      /**
       * 当前接口访问的port端口，不配置时，默认使用部署环境的port地址
       * @type {Number}
       */
      port: null,
      /**
       * 当前接口访问的http协议 false:不使用https协议; true:使用https协议; auto:根据环境动态调整
       * @type {true|false|'auto'}
       */
      https: 'auto',
      /**
       * 设置到axios的baseUrl属性
       * 在下方的axios配置项中的baseUrl配置会被该配置覆盖
       * 在访问后台的接口中，规范的接口总会包含一些统一的接口前缀，例如，接口版本号等
       * 那么在所有的接口前，都会包含一些固定的路径，例如：/console/v1
       * 访问接口的api将基于：http[s]://host:port/console/v1
       * 不设置该参数，默认使用 '/'，http[s]://host:port/
       */
      baseURL: '/',
      /**
       * 对请求的参数中，包含以下值的数据进行过滤
       * @type {Array}
       */
      filters: ['', null, 'null', undefined, 'undefined', NaN, 'NaN'],
      /**
       * 在请求接口时，是否默认展示一个loading图, 默认不展示
       * @type {Boolean}
       */
      loading: false,
      /**
       * 在显示loading图时，展示的文字提示
       * 如果设置为假值，则不显示文字提示
       * @type {String|Boolean}
       */
      loadingText: false,
      /**
       * 默认的loading服务
       * @type {Object}
       */
      modules: {
        loading: require('./loading.js').default
      },
      /**
       * axios的请求头
       * @type {Object}
       */
      headers: {},
      /**
       * axios的返回数据
       * @type {String}
       */
      responseType: 'json',
      /**
       * axios默认配置，该配置会设置到默认的封装的axios对象中
       * @type {Object}
       */
      axios: {
        responseType: 'json'
      },
      /**
       * response返回的属性
       */
      responseProp: ['data'],
      /**
       * 该参数的优先级高于上面所有配置项，应用时，会用该处的配置覆盖上面的配置信息
       * @type {Object}
       */
      env: {}
    },
    userConfig
  )
  config = assign(config, config['env'][mockEnv] ? config['env'][mockEnv] : {})
  /**
   * 当前的环境变量
   */
  config.env = mockEnv
  /**
   * 默认的请求头
   * @type {Object}
   */
  config.headers = assign({
    'Content-Type': 'application/json;charset=UTF-8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Authorization': 'Basic cm1zLWNsaWVudC1hdXRoOnJtcy1jbGllbnQtYXV0aC1zZWNyZXQ='
  }, config.headers)
  /**
   * 设置接口请求协议
   */
  if (toLower(config.https) === 'auto') {
    config.protocol = window.location.protocol
  } else {
    config.protocol = config.https ? 'https:' : 'http:'
  }

  /**
   * 设置请求host
   */
  if (!config.host) {
    config.host = window.location.hostname
  }

  if (!config.port) {
    config.port = window.location.port
  }

  config.baseURL = config.protocol + '//' + config.host + ':' + config.port + config.baseURL

  /**
   * 请求字段过滤
   * 是否对请求的字段进行过滤操作
   * @type {[type]}
   */
  config.filtersArray = config.filters
  config.filters = !!config.filters.length

  /**
 * 过滤对象/数组中的属性
 * @param  {Object} params      对象
 * @param  {Array}  filters     需要过滤的值
 * @return {Object} 过滤后的对象
 */
  config.handleFilter = function (
    params = {},
    filters = ['', null, 'null', 'undefined', undefined, NaN, 'NaN']
  ) {
    // console.log('无效参数已过滤,过滤范围：', filters)
    let _params
    // 过滤对象
    if (Object.prototype.toString.call(params) === '[object Object]') {
      _params = {}
      keys(params)
        .forEach(key => {
          // 如果当前值不在过滤内容中，则保留
          if (!includes(filters, params[key])) {
            _params[key] = params[key]
          }
        })
      return _params
    // 过滤数组
    } else if (isArray(params)) {
      _params = []
      params.forEach(item => {
        if (!includes(filters, item)) {
          _params.push(item)
        }
      })
      return _params
    }
    return params
  }
  /**
   * axios相关配置
   * @type {Object}
   */
  config.axios.baseURL = config.baseURL
  config.axios.timeout = config.axios.timeout ? config.axios.timeout : 0
  config.axios.responseType = config.responseType ? config.responseType : config.axios.responseType
  config.axios.withCredentials = config.axios.withCredentials ? config.axios.withCredentials : true
  config.axios.headers = assign(config.axios.headers, config.headers)
  return config
}
