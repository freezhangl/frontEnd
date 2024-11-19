const state = {
  manage: {
    description: '欢迎进入此模块'
  }
}

const getters = {
  description: (state) => state.manage.description
}

/**
 * 使用commit调用 只能同步
 */
const mutations = {
}
/**
 * 使用dispatch调用 可异步,
 */
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
