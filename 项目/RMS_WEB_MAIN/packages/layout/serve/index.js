import Http from '@lib/common/http'
import store from '@/store'

const baseUrl = store.getters['CONFIG/baseUrl']

//接口地址
const apiPath = {
  menuList: baseUrl + '/rms/auth/uniauth/v1/menu/current', //获取登录人的菜单列表
  getRoleByUserId: baseUrl + '/rms/auth/uniauth/v1/role/3/getRoleByUserId', //根据userId获取用户角色
  getNoticeTypeAllUrl: baseUrl + '/rms/system/dictionary/v1/3/dicNamesBydicCode', //获取所有公告类型列表
  getUserAuthUrl: baseUrl + '/rms/auth/user/v1/3/getUserAuth', //获取用户权限
  getSecUserAuthUrl: baseUrl + '/rms/auth/user/v1/3/getSecUserAuth', //获取用户权限
  logoutUrl: baseUrl + '/rms/auth/uniauth/v1/logout', //退出登录
  setSecUserAuthUrl: baseUrl + '/rms/auth/user/v1/2/setSecUserAuth', //切换组织
  getNoticeNumUrl: baseUrl + '/rms/home/notice/v1/3/noticeNum', //获取系统通知数量
  modPasswordOutsideUser: baseUrl + '/rms/auth/outsideUser/v1/2/modPassword', //外部用户修改密码
  modPasswordEcoUser: baseUrl + '/rms/auth/ecoUser/v1/2/modPassword', //外部用户修改密码
  loginUserMoreInfo: baseUrl + '/rms/auth/user/v1/3/user/loginUserMoreInfo112' // 获取登陆用户类型
}

export default {
  getMenuList (params) {
    return Http.get(apiPath.menuList, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getRoleByUserId (userId) {
    return Http.get(apiPath.getRoleByUserId + '/' + userId)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getNoticeTypeAll (param) {
    return Http.get(apiPath.getNoticeTypeAllUrl, param, { loading: false })
      .then(res => {
        // console.log('获取所有的公告类型', res)
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getUserAuth (param) {
    // return Http.get(apiPath.getUserAuthUrl + '/' + param, null, { loading: false })
    return Http.get(apiPath.getSecUserAuthUrl, null, { loading: true })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  logout (param) {
    return Http.post(apiPath.logoutUrl, param, { loading: true })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  setSecUserAuth (param) {
    return Http.get(apiPath.setSecUserAuthUrl + '/' + param, null, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getNoticeNum () {
    return Http.get(apiPath.getNoticeNumUrl, null, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  modPasswordOutsideUser (param) {
    return Http.post(apiPath.modPasswordOutsideUser, param, { loading: true })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  modPasswordEcoUser (param) {
    return Http.post(apiPath.modPasswordEcoUser, param, { loading: true })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  loginUserMoreInfo () {
    return Http.get(apiPath.loginUserMoreInfo, null, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}
