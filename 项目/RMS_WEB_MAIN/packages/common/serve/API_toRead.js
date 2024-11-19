import Http from '@lib/common/http'
import store from '@/store'

const baseUrl = store.getters['CONFIG/baseUrl']

const baseAuthUrl = baseUrl + '/rms/auth'
const flowUrl = baseUrl + '/rms/flow'

const apiList = [
  { //查询整颗组织树，无权限控制
    name: 'getOrgTree',
    url: baseAuthUrl + '/ext/user/v1/3/v1/orgTree',
    method: 'get',
    config: { loading: false }
  },
  { //组织信息列表查询（分页）
    name: 'getOrgList',
    url: baseAuthUrl + '/ext/user/v1/3/v1/orgList',
    method: 'get',
    config: { loading: false }
  },
  { //查询当前登录人所在公司
    name: 'orgInfoByOrgCode',
    url: flowUrl + '/ext/processConfig/v1/3/v1/orgInfoByOrgCode',
    method: 'get/params',
    config: { loading: false }
  },
  { //根据组织编码查询该组织下的直属下级组织和人员列表返回成树
    name: 'treeByParentOrgCode',
    url: flowUrl + '/ext/processConfig/v1/3/v1/orgAndPeopleListByParentOrgCode',
    method: 'get/params',
    config: { loading: false }
  },
  { // 任务事项送阅
    name: 'sendTaskNotificationToPerson',
    url: baseUrl + '/rms/flow/ext/notification/v1/4/v1/sendTaskNotificationToPerson',
    method: 'post',
    config: { loading: true }
  },
  { // 根据组织编码查询用户列表
    name: 'getAllUserListByorgCode',
    url: baseAuthUrl + '/ext/user/v1/3/v1/allUserPageByorgCode',
    method: 'get',
    config: { loading: false }
  }
]

export default Http.createHttpServe(apiList)
