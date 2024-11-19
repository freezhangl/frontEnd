
const localThemeColor = localStorage.getItem('themeColor')
const state = {
  config: {
    baseUrl: process.env.NODE_ENV === 'development' ? '/api' : '',
    themeColor: localThemeColor || 'blue'
  }
}

const getters = {
  //请求公共头
  baseUrl: (state) => state.config.baseUrl,
  //主题色
  themeColor: (state) => {
    // console.log('themeColor', state.config.themeColor)
    return state.config.themeColor
  }
}

/**
 * 使用commit调用 只能同步
 */
const mutations = {
  setThemeColor (state, payload) {
    state.config.themeColor = payload
    localStorage.setItem('themeColor', payload)
  }
}
/**
 * 使用dispatch调用 可异步,
 */
const actions = {}

export default {
  namespaced: true, //store分模块管理，解决不同模块命名冲突的问题
  state,
  getters,
  mutations,
  actions
}
