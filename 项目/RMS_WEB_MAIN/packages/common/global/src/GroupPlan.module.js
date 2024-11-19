const state = {
  blockEditStatus: {
    'baseInfo': { edited: false, label: '基本信息' },
    'attributeEdit': { edited: false, label: '属性信息' },
    'attribute': { edited: false, label: '属性信息' },
    'attributeEditDefault': { edited: false, label: '属性信息' },
    'teamInfo': { edited: false, label: '团队信息' },
    'projectBudget': { edited: false, label: '项目预算' },
    'subproject': { edited: false, label: '子项目' },
    'milestone': { edited: false, label: '里程碑' },
    'productInfo': { edited: false, label: '产品信息' },
    'resourceInfo': { edited: false, label: '资源信息' }
  } //项目的区块是否被编辑
}

const getters = {
  blockCanEdit: (state) => (block) => {
    let keys = Object.keys(state.blockEditStatus)
    let flag = keys.some(key => {
      if (key !== block && state.blockEditStatus[key].edited) {
        //不是当前被编辑的区块 且 已被编辑但未暂存 -- 当前区块不可编辑
        return true
      }
    })
    // console.log('blockCanEdit', !flag)
    return !flag
  }
}

/**
   * 使用commit调用 只能同步
   */
const mutations = {
  setBlockEditStatus (state, payload) {
    state.blockEditStatus = payload
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
