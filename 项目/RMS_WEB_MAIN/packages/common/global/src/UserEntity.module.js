import { aes } from '../../util/encrypt'
import Vue from 'vue'

const localUserInfo = sessionStorage.getItem('userInfo') ? JSON.parse(aes.de(sessionStorage.getItem('userInfo'))) : null
const localMenuResCode = sessionStorage.getItem('menuResCode') ? aes.de(sessionStorage.getItem('menuResCode')) : ''
const state = {
  userInfo: {
    token: localUserInfo ? localUserInfo.token : '',
    refreshToken: localUserInfo ? localUserInfo.refreshToken : '',
    tokenType: localUserInfo ? localUserInfo.tokenType : '',
    loginName: localUserInfo ? localUserInfo.loginName : '',
    // organizations: localUserInfo ? localUserInfo.organizations : null,
    userAuth: localUserInfo ? localUserInfo.userAuth : null
  },
  menuResCode: localMenuResCode || '',
  outUserAuth: null
}

const getters = {
  //是否登录
  isLogin: (state) => !!state.userInfo.token,
  //请求头
  authHeaher: (state) => {
    let headerAuthObj = null
    if (state.userInfo.tokenType) {
      let headerAuth = state.userInfo.tokenType.charAt(0)
        .toUpperCase() + state.userInfo.tokenType.slice(1) + ' ' + state.userInfo.token
      headerAuthObj = {
        Authorization: headerAuth
      }
    }
    return headerAuthObj
  },
  //当前用户登录相关信息
  userInfo: (state) => {
    let loginInfo = state.userInfo
    // console.log('当前登录用户信息：', loginInfo)
    return loginInfo
  },
  //当前用户权限信息
  userAuth: (state) => {
    let userAuth = state.userInfo.userAuth
    // console.log('当前登录用户授权信息：', userAuth)
    return userAuth
  },
  //单独存放用户授权信息
  outUserAuth: (state) => {
    let userAuth = state.outUserAuth
    // console.log('当前登录权限信息：', userAuth)
    return userAuth
  },
  //当前用户授权标签
  authTags: (state) => {
    let authTags = []
    if (state.userInfo.userAuth) {
      authTags = state.userInfo.userAuth.authorizationTags
    }
    return authTags
  },
  //获取当前菜单
  menus: (state) => {
    let menus = state.userInfo.userAuth.menus
    return menus
  },
  //获取用户当前组织
  curUserOrg: (state) => {
    let userOrg = state.userInfo.userAuth.curUserOrg
    return userOrg
  },
  //获取当前打开菜单的资源编码resCode
  menuResCode: (state) => {
    let menuResCode = state.menuResCode
    return menuResCode
  },
  hasRole: (state) => (roleId, matchType = 'roleCode') => {
    let roles = state.userInfo.userAuth.roleDtos
    if (roles && roles.length > 0) {
      if (roleId instanceof Array) {
        let matched = false
        roleId.forEach(roleIdItem => {
          matched = matched || roles.some(item => {
            return item[matchType] === roleIdItem
          })
        })
        return matched
      } else {
        return roles.some(item => {
          return item[matchType] === roleId
        })
      }
    }
    return false
  },
  hasAuthTag: (state) => utag => {
    if (!state.userInfo.userAuth) return false
    let tags = state.userInfo.userAuth.authorizationTags
    if (tags && tags.length > 0) {
      if (utag instanceof Array) {
        let matched = false
        utag.forEach(tagItem => {
          matched = matched || tags.some(item => item === tagItem)
        })
        return matched
      } else {
        return tags.some(item => item === utag)
      }
    }
    return false
  }
}

/**
 * 使用commit调用 只能同步
 */
const mutations = {
  //设置用户信息
  setUserInfo (state, payload) {
    state.userInfo = payload
    sessionStorage.setItem('userInfo', aes.en(JSON.stringify(state.userInfo)))
    return true
  },
  //设置用户授权信息
  setUserAuth (state, payload) {
    payload.organizations.forEach(org => {
      if (org.orgCode === payload.orgCode) {
        payload.curUserOrg = org
      }
    })
    // state.userInfo.userAuth = payload
    Vue.set(state.userInfo, 'userAuth', payload)
    sessionStorage.setItem('userInfo', aes.en(JSON.stringify(state.userInfo)))
    Vue.set(state, 'outUserAuth', payload)
    // console.log('设置用户授权信息', Object.assign({}, payload))
    return true
  },
  //设置当前打开菜单的资源编码
  setMenuResCode (state, payload) {
    state.menuResCode = payload
    sessionStorage.setItem('menuResCode', aes.en(payload))
  },
  //清空用户信息
  clearUserInfo (state) {
    state.userInfo = {
      token: '',
      refreshToken: '',
      tokenType: '',
      loginName: '',
      // organizations: null,
      userAuth: null
    }
    state.menuResCode = ''
    state.outUserAuth = null
    sessionStorage.removeItem('userInfo')
    sessionStorage.removeItem('menuResCode')
    sessionStorage.removeItem('menus') //清除缓存的菜单
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
