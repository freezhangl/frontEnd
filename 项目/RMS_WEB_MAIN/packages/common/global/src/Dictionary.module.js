const localDic = JSON.parse(sessionStorage.getItem('dictionary'))
const state = {
  notice: (localDic && localDic.notice) ? localDic.notice : null
}

const getters = {
  getNotice (state) {
    return state.notice
  }
}

/**
   * 使用commit调用 只能同步
   */
const mutations = {
  setNotice (state, payload) {
    state.notice = payload
    sessionStorage.setItem('dictionary', JSON.stringify(state))
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
