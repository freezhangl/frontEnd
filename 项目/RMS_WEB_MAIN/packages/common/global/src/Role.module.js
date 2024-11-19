const localRoles = JSON.parse(sessionStorage.getItem('userRoles'))
const state = {
  roles: localRoles ? localRoles.roles : []
}

const getters = {
  //请求公共头
  roles: (state) => state.roles
}

/**
 * 使用commit调用 只能同步
 */
const mutations = {
  setRoles (state, payload) {
    sessionStorage.setItem('userRoles', JSON.stringify(payload))
    state.roles = payload
    return true
  },
  updataRoles (state, payload) {
    state.roles = payload
    return true
  },
  clearRoles (state) {
    state.roles = []
    sessionStorage.removeItem('userRoles')
    return true
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
