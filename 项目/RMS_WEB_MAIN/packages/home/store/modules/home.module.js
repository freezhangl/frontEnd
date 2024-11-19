const state = {
  home: {
    description: '欢迎进入集中化研发项目管理系统！'
  },
  noticeNum: 0,
  bannerImageFile: []
}

const getters = {
  description: (state) => state.home.description,
  noticeNum: (state) => state.noticeNum,
  bannerImageFile: (state) => state.bannerImageFile
}

/**
 * 使用commit调用 只能同步
 */
const mutations = {
  // 设置未读通知条数
  setNoticeNum (state, payload) {
    state.noticeNum = payload
  },
  setBannerImageFile (state, payload) {
    state.bannerImageFile = payload
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
