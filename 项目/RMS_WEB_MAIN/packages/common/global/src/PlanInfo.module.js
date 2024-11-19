const state = {
  manage: {
    description: '欢迎进入此模块'
  },
  planInfoState: 1, // 计划详情状态 0：新增/编辑 1：查看
  projectCode: '',
  planInfoData: {}
}

const getters = {
  description: (state) => state.manage.description
}

/**
 * 使用commit调用 只能同步
 */
const mutations = {
  setPlanInfoState (state, data) {
    state.planInfoState = data
  },
  setProjectCode (state, data) {
    state.projectCode = data
  },
  setplanInfoData (state, data) {
    state.planInfoData = data
  }
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
