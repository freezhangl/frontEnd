const localTabs = sessionStorage.getItem('tabs') ? JSON.parse(sessionStorage.getItem('tabs')) : []
const state = {
  visitedViews: localTabs || [] //存放打开的页面
}

const getters = {
  getVisitedViews: (state) => state.visitedViews
}

/**
   * 使用commit调用 只能同步
   */
const mutations = {

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
    sessionStorage.setItem('tabs', JSON.stringify(state.visitedViews))
  },

  // 删除所有页签
  DEL_ALL_VISITED_VIEW: state => {
    state.visitedViews = []
    sessionStorage.setItem('tabs', JSON.stringify(state.visitedViews))
  },

  ADD_VISITED_VIEW: (state, payload) => {
    let view = payload.newRoute
    let oldView = payload.oldRoute
    let viewA = {}
    for (let key in view) {
      if (key !== 'matched') {
        viewA[key] = view[key]
      }
    }
    if (state.visitedViews.some(v => v.path === view.path)) return // 如果已访问列表中存在该路径，不执行任何操作
    viewA.title = viewA.meta.breadTitle || '无标题'
    // if (state.visitedViews.length === 10) {
    //   //频道首页常驻 - 如果是频道首页，则删除第二个tab页签
    //   if (state.visitedViews[0].meta.isChannelHome) {
    //     state.visitedViews.splice(1, 1)
    //   } else {
    //     state.visitedViews.splice(0, 1)
    //   }
    // }
    //不新增新标签页，替换标签
    if (viewA.meta.replaceTab || (oldView && oldView.meta.replaceTab)) {
      let i = -1
      //父进入子，替换父标签页
      if (viewA.meta.replaceTab) {
        state.visitedViews.some((ele, index) => {
          if (ele.path === viewA.meta.parentPath) {
            i = index
            return true
          }
        })
      } else {
        //子返回父，替换子标签页
        state.visitedViews.some((ele, index) => {
          if (ele.path === oldView.path) {
            i = index
            return true
          }
        })
      }
      if (i > -1) {
        state.visitedViews.splice(i, 1, viewA)
      }
    } else {
      state.visitedViews.push(viewA)
      // state.visitedViews.unshift(viewA)
    }
    sessionStorage.setItem('tabs', JSON.stringify(state.visitedViews))
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
    sessionStorage.setItem('tabs', JSON.stringify(state.visitedViews))
  }

}
/**
   * 使用dispatch调用 可异步,
   */
const actions = {

  delVisitedView ({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  }

}

export default {
  namespaced: true, //store分模块管理，解决不同模块命名冲突的问题
  state,
  getters,
  mutations,
  actions
}
