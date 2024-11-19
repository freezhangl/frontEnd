// const localstatus = sessionStorage.getItem('LeftMenuStatus')
// const localMenu = sessionStorage.getItem('menus')
const localMenu = sessionStorage.getItem('menus') ? JSON.parse(sessionStorage.getItem('menus')) : null

const state = {
  // leftMenuStatus: localstatus || 'open',
  leftMenuVisible: true,
  menus: localMenu || []
}

const getters = {
  /* leftMenuStatus: (state) => state.leftMenuStatus, */
  leftMenuVisible: (state) => state.leftMenuVisible,
  menus: (state) => state.menus
}

/**
   * 使用commit调用 只能同步
   */
const mutations = {
  /*  setLeftMenuStatus: (state, status) => {
    state.leftMenuStatus = status
    sessionStorage.setItem('LeftMenuStatus', status)
  }, */
  setLeftMenuVisible: (state, visible) => {
    state.leftMenuVisible = visible
  },
  setMenus: (state, menus) => {
    sessionStorage.setItem('menus', JSON.stringify(menus))
    state.menus = menus
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
