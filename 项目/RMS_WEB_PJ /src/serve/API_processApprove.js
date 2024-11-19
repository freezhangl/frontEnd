import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/home'
const authUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/auth'
const flowUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/flow'

const apiList = [
  { // 获取待办列表
    name: 'getBackLogList',
    url: flowUrl + '/ext/workItemQuery/v1/3/v1/personWorkItemList',
    method: 'get',
    config: { loading: false }
  },
  { // 获取已办列表
    name: 'getHaveFinishedList',
    url: flowUrl + '/ext/workItemQuery/v1/3/v1/personFinishedWorkItemList',
    method: 'get',
    config: { loading: false }
  },
  { // 获取已阅列表
    name: 'getMyHaveReadList',
    url: flowUrl + '/ext/notification/v1/3/v1/viewedTaskNotifications',
    method: 'get',
    config: { loading: false }
  },
  { // 获取待阅列表
    name: 'getToBeReadList',
    url: flowUrl + '/ext/notification/v1/3/v1/unViewedTaskNotifications',
    method: 'get',
    config: { loading: false }
  },
  { // 根据组织编码查询用户列表
    name: 'getAllUserListByorgCode',
    url: authUrl + '/ext/user/v1/3/v1/allUserPageByorgCode',
    method: 'get',
    config: { loading: false }
  },
  { // 确认阅知
    name: 'confirmNotification',
    url: flowUrl + '/ext/notification/v1/3/v1/confirmNotification',
    method: 'get/params',
    config: { loading: true }
  },
  { // 获取待办url
    name: 'getWorkItemUrl',
    url: flowUrl + '/ext/workItemQuery/v1/3/v1/getWorkItemUrl',
    method: 'get/params',
    config: { loading: true }
  }
]

export default Http.createHttpServe(apiList)
