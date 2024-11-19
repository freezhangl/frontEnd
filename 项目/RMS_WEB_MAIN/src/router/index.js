import Vue from 'vue'
import Router from 'vue-router'
import RouterMap from './map.config'
import store from '@/store'
import API from '@lib/login/serve'
import { Message } from 'element-ui'
import APILayout from '@lib/layout/serve'

Vue.use(Router)

const userHelper = {
  //判断本地是否有用户登录信息
  isLogin: () => {
    return !!store.getters['USERENTITY/userInfo'].token
  },
  //清空本地用户信息
  clearUserInfo: () => {
    store.commit('USERENTITY/clearUserInfo')
    // store.commit('ROLE/clearRoles')
  },
  setUserInfo: (data) => {
    store.commit('USERENTITY/setUserInfo', data)
  }
}

const router = new Router({
  routes: RouterMap
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  //如果跳转到登录页，首先移除userInfo信息
  if (to.name === 'login') {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    userHelper.clearUserInfo()
  }
  // console.log('before enter', to)
  //未登录时
  if (!userHelper.isLogin()) {
    if (to.name === 'login') {
      next()
    } else {
      let pathArr = to.fullPath.split('?')
      let sessionData = ''
      if (pathArr.length > 1) {
        let params = pathArr[1].split('&')
        params.forEach(val => {
          if (val.indexOf('SMAP_SESSION_DATA=') !== -1) {
            sessionData = val.split('SMAP_SESSION_DATA=')[1]
          }
        })
      }
      if (sessionData) {
        API.getSSOAuth({ SMAP_SESSION_DATA: sessionData })
          .then(res => {
            let userInfo = {
              token: res.access_token,
              refreshToken: res.refresh_token,
              tokenType: res.token_type,
              loginName: res.loginName
            }
            userHelper.setUserInfo(userInfo)
            APILayout.getUserAuth()
              .then(res => {
                store.commit('USERENTITY/setUserAuth', res)
                getPCMenus(res.menus)
                let params = getUrlParams(to.fullPath)
                params.sso = true
                next({ path: pathArr[0], query: params })
              })
              .catch((e) => {
                if (e.selfError) return
                Message({
                  message: (e.message + '，' || '获取用户信息失败！') + '请稍后刷新重试！',
                  showClose: true,
                  type: 'error'
                })
                next({ name: 'login' })
              })
          })
          .catch(e => {
            // console.log('获取单点登录token失败，' + e)
            if (e.selfError) return
            Message({
              message: '单点认证失败！',
              showClose: true,
              type: 'error'
            })
            next({ name: 'login' })
          })
      } else {
        next({ name: 'login' })
      }
    }
  } else {
    //动态改变页面的title
    // if (to.meta.title) {
    //   document.title = to.meta.title
    // }
    // next()
    // 刷新页面时重新获取用户权限的部分去掉了
    // if (from.path === '/') { //刷新页面，重新获取用户权限后再跳转到相应的理由
    //   APILayout.getUserAuth()
    //     .then(res => {
    //       //动态改变页面的title
    //       if (to.meta.title) {
    //         document.title = to.meta.title
    //       }
    //       console.log('REFRESH-getUserAuth')
    //       store.commit('USERENTITY/setUserAuth', res)
    //       getPCMenus(res.menus)
    //       nextRoute(to, from, next)
    //     })
    //     .catch((e) => {
    //       nextRoute(to, from, next)
    //       Message({
    //         message: (e.message + '，' || '获取用户信息失败！') + '请稍后刷新重试！',
    //         showClose: true,
    //         type: 'error'
    //       })
    //     })
    // } else {
    //   nextRoute(to, from, next)
    // }
    nextRoute(to, from, next)
  }
})

function getPCMenus (menuData) {
  let PCMenus = []
  if (menuData && menuData.length > 0) {
    let pcMenuRoot = menuData.filter(ele => ele.resScope === '1') //PC端资源根节点
    if (pcMenuRoot && pcMenuRoot.length > 0 && pcMenuRoot[0].child && pcMenuRoot[0].child.length > 0) {
      PCMenus = pcMenuRoot[0].child
    }
  }
  store.commit('MENU/setMenus', PCMenus)
}
function nextRoute (to, from, next) {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.path === '/home' || to.path === '/404' || to.path === '/refresh' || to.path === '/processTrace' || to.query.sso || to.meta.hasPermission) {
    next()
  } else {
    let menus = store.getters['USERENTITY/menus']
    // console.log('menus', menus)
    let hasPer = false
    if (menus && menus.length > 0) {
      console.log(menus, '我是menus', to.path)
      hasPer = hasPermission(menus[0], to.path)
    }
    if (hasPer) {
      next()
    } else {
      next({ path: '/404', replace: true })
    }
  }
}

function hasPermission (menu, path) {
  if (menu.accessPath === path) {
    return true
  } else if (menu.child.length > 0) {
    return menu.child.some(child => hasPermission(child, path))
  }
}

//获取url中携带的参数--单点登录，除去SMAP_SESSION_DATA
function getUrlParams (url) {
  let temp1 = url.split('?')
  let pram = temp1[1]
  let keyValue = pram.split('&')
  let obj = {}
  for (let i = 0; i < keyValue.length; i++) {
    let item = keyValue[i].split('=')
    let key = item[0]
    if (key !== 'SMAP_SESSION_DATA') {
      let value = item[1]
      obj[key] = value
    }
  }
  return obj
}

export default router
