import Http from '@lib/common/http'
import store from '@/store'

const baseUrl = store.getters['CONFIG/baseUrl']

//接口地址
const apiPath = {
  getFunctionListUrl: baseUrl + '/rms/auth/ext/user/v1/3/v1/functionListByParentResCode2', //获取某个菜单下的常用功能（查询当前登录组织）
  getCommonFunctionUrl: baseUrl + '/rms/home/commonFunction/v1/3/commonFunction', //查询我的常用功能
  updateCommonFunctionUrl: baseUrl + '/rms/home/commonFunction/v1/2/commonFunction', //更新我的常用功能
  getDraftNumUrl: baseUrl + '/rms/home/draft/v1/3/draftNum', //获取草稿数量
  getDraftListUrl: baseUrl + '/rms/home/draft/v1/3/draftList', //获取草稿列表
  getNoticeNumUrl: baseUrl + '/rms/home/notice/v1/3/noticeNum', //获取重要通知数量
  getNoticeListUrl: baseUrl + '/rms/home/notice/v1/3/noticeList', //获取重要通知列表
  getUserAnnounceNumUrl: baseUrl + '/rms/home/announcement/v1/3/userAnnouncementNum', //获取用户公告数量
  getUserAnnounceListUrl: baseUrl + '/rms/home/announcement/v1/3/userAnnouncementList', //获取用户公告数量
  updateNoticeReadFlagUrl: baseUrl + '/rms/home/notice/v1/2/noticeReadFlag', //通知标记已读
  updateNoticeTopFlagUrl: baseUrl + '/rms/home/notice/v1/2/noticeTopFlag', //通知置顶标记
  getApplyingNumUrl: baseUrl + '/rms/flow/ext/businessProcessInst/v1/3/v1/getApplicationCount', // 查询申请数量
  getToBeReadNumUrl: baseUrl + '/rms/flow/ext/notification/v1/3/v1/unViewedTaskNotificationsCount', // 查询待阅数量
  getInHandNumUrl: baseUrl + '/rms/flow/ext/workItemQuery/v1/3/v1/workItemNum', // 查询待办数量
  getApplyingListUrl: baseUrl + '/rms/flow/ext/businessProcessInst/v1/3/v1/getApplications', // 查询我的申请列表
  getInHandListUrl: baseUrl + '/rms/flow/ext/workItemQuery/v1/3/v1/personWorkItemList', // 查询待办列表
  getToBeReadListUrl: baseUrl + '/rms/flow/ext/notification/v1/3/v1/unViewedTaskNotifications', // 查询待阅列表
  confirmNotificationUrl: baseUrl + '/rms/flow/ext/notification/v1/3/v1/confirmNotification', // 确认阅知
  getWorkItemUrlUrl: baseUrl + '/rms/flow/ext/workItemQuery/v1/3/v1/getWorkItemUrl', // 根据工作项id查询待办url
  getApplicationUrlUrl: baseUrl + '/rms/flow/ext/businessProcessInst/v1/3/v1/applicationUrl', // 查询申请url
  getPlanListUrl: baseUrl + '/rms/plan/ext/groupProject/v1/3/v1/pendingApprovalPlan',
  getBannerListUrl: baseUrl + '/rms/home/banner/v1/3/bannerList' // 获取banner列表
}

export default {
  getAllFunctionList (params) {
    return Http.get(apiPath.getFunctionListUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getCommonFunction (params) {
    return Http.get(apiPath.getCommonFunctionUrl, params, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  updateCommonFunction (params) {
    return Http.post(apiPath.updateCommonFunctionUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getDraftNum () {
    return Http.get(apiPath.getDraftNumUrl, null, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getDraftList (params) {
    return Http.get(apiPath.getDraftListUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getNoticeNum () {
    return Http.get(apiPath.getNoticeNumUrl)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getNoticeList (params) {
    return Http.get(apiPath.getNoticeListUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getUserAnnouncementNum (params) {
    return Http.get(apiPath.getUserAnnounceNumUrl + '/' + params, null, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getUserAnnouncement (params) {
    return Http.get(apiPath.getUserAnnounceListUrl, params, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  updatedNoticeReadFlag (params) {
    return Http.post(apiPath.updateNoticeReadFlagUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  updatedNoticeTopFlag (params) {
    return Http.post(apiPath.updateNoticeTopFlagUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getApplyingNum (params) {
    return Http.get(apiPath.getApplyingNumUrl, params, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getToBeReadNum () {
    return Http.get(apiPath.getToBeReadNumUrl, null, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getInHandNum () {
    return Http.get(apiPath.getInHandNumUrl, null, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getApplyingList (params) {
    return Http.get(apiPath.getApplyingListUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getInHandList (params) {
    return Http.get(apiPath.getInHandListUrl, params, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getToBeReadList (params) {
    return Http.get(apiPath.getToBeReadListUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getPlanList (params) {
    return Http.get(apiPath.getPlanListUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  confirmNotification (params) {
    return Http.post(apiPath.confirmNotificationUrl + '/' + params, null)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  getWorkItemUrl (params) {
    return Http.get(apiPath.getWorkItemUrlUrl + '/' + params, null)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  getApplicationUrl (params) {
    return Http.get(apiPath.getApplicationUrlUrl + '/' + params, null)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  getBannerList (param) {
    return Http.get(apiPath.getBannerListUrl, param, { loading: false })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}
