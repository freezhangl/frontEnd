import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
const baseUrl = getStore().getters['CONFIG/baseUrl']
const baseUrl1 = getStore().getters['CONFIG/baseUrl'] + '/rms/auth'
const apiPath = {
  postAutoAuthorizeUrl1: baseUrl1 + '/ext/user/v1/3/v1/getCustomOrgs', //获取组织
  getOrgsListNoAuthUrl: baseUrl1 + '/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth', //获取组织，不带权限
  postAutoAuthorizeUrl2: baseUrl1 + '/user/v1/3/getUserList', //获取项目经理
  postAutoAuthorizeUrl: baseUrl1 + '/ext/user/v1/3/v1/getUserList', //获取项目经理,不带权限最新
  postAutoAuthorizeUrl3: baseUrl + '/rms/basic/ext/dictionary/v1/3/v1/dictValByCode/', //获取项目经理
  postAutoAuthorizeUrl4: baseUrl1 + '/ext/user/v1/3/v1/allUserPageByorgCode', //获取项目经理 不带权限
  getAutoAuthorizeListUrl: baseUrl + '/rms/project/projectManagement/v1/3/queryItems', //项目查询本单位
  getAutoAuthorizeListUrl1: baseUrl + '/rms/project/projectManagement/v1/3/queryGroupItems', //项目查询全集团
  getIndependentDemandSearch: baseUrl + '/rms/project/groupDemandProjectQuery/v1/3/queryUnitDemandProjectList', //本单位项目 集团统筹需求单位项目查询
  getIndependentUndertakeSearch: baseUrl + '/rms/project/groupUndertakeProjectQuery/v1/3/queryUnitDemandProjectList', //本单位项目 集团统筹承担单位项目查询
  getGroupDemandSearch: baseUrl + '/rms/project/groupDemandProjectQuery/v1/3/queryGroupDemandProjectList', //全集团项目 集团统筹需求单位项目查询
  getGroupUndertakeSearch: baseUrl + '/rms/project/groupUndertakeProjectQuery/v1/3/queryGroupDemandProjectList', //全集团项目 集团统筹承担单位项目查询
  getChooseDepartment: baseUrl + '/rms/auth/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth', // 部门选择 -> 获取部门
  getWorkSearch: baseUrl + '/rms/project/group/projectTime/v1/3/demand/special',
  getProGeneral: baseUrl + '/rms/project/group/projectTime/v1/3/demand/general',
  getConfirmedTime: baseUrl + '/rms/worktime/ext/worktime/v1/3/v1/getConfirmedWorkTime',
  getConfirmedWorkTimeByCodeAndYear: baseUrl + '/rms/worktime/ext/worktime/v1/3/v1/getConfirmedWorkTimeByCodeAndYear',
  getOrgCodeByCompanyCode: baseUrl + '/rms/auth/ext/user/v1/3/v1/orgInfoByOrgCode', // 根据公司编码查询公司
  getOrgInfoByCompanyCode: baseUrl + '/rms/project/use/v1/3/getOrgInfoByCompanyCode', // 根据公司编码查询公司信息
  getProvinceAbbr: baseUrl + '/rms/auth/ext/user/v1/3/v1/provinceAbbr', // 获取省端独立域简称列表，57家一级公司
  queryFinishScoreUndertake: baseUrl + '/rms/project/groupDemandProjectQuery/v1/3/queryFinishScoreUndertake', // 全集团项目管理 项目承担单位评分
  queryFinishScoreUniteAssault: baseUrl + '/rms/project/groupDemandProjectQuery/v1/3/queryFinishScoreUniteAssault', // 全集团项目管理 项目联合攻关单位评分
  findFieldByCompanyAndType: baseUrl + '/rms/form/ext/provide/v1/3/v1/findFieldByCompanyAndType', //获取属性信息的字段
  queryUnitDemandMilesToneList: baseUrl + '/rms/milestone/milestoneQuery/v1/3/queryUnitDemandMilesToneList', // 本单位查询-统筹需求方项目里程碑查询（父项目）
  queryUnitUndertakeMilesToneList: baseUrl + '/rms/milestone/milestoneQuery/v1/3/queryUnitUndertakeMilesToneList', // 本单位查询-统筹承担方项目里程碑查询（子项目）
  queryUnitSelfMilesToneList: baseUrl + '/rms/milestone/milestoneQuery/v1/3/queryUnitSelfMilesToneList', // 本单位查询-统筹自立项目里程碑查询
  queryDemandMilesToneList: baseUrl + '/rms/milestone/milestoneQuery/v1/3/queryDemandMilesToneList', // 全集团查询-统筹需求方项目里程碑查询（父项目）
  remindMilesTone: baseUrl + '/rms/milestone/milestoneQuery/v1/3/remindMilesTone', // 里程碑提醒
  dictValByCodesUrl: baseUrl + '/rms/basic/ext/dictionary/v1/3/v1/dictValByCodes', // 批量查询数据字典
  queryBaseInfoByCode: baseUrl + 'rms/project/projectQuery/v1/3/queryBaseInfoByCode' // 查询基本信息接口
}

const config = {
  loading: false
}

export default {
  // { //用户数据权限赋权时获取组织树
  //   name: 'getCustomOrgs',
  //   url: baseUrl + '/org/v1/3/getCustomOrgs',
  //   method: 'post',
  //   config: { loading: true }
  // }
  // { // 获取组织下所有用户
  //   name: 'getUserList',
  //   url: authUrl + '/ext/v1/userList',
  //   method: 'get',
  //   config: { loading: false }
  // },
  //  {//数据字典
  //   name: 'dictValByCode',
  //   url: basicUrl + '/ext/dictionary/v1/3/v1/dictValByCode',
  //   method: 'get/params'
  // },
  dictValByCode (param) { //查询数据字典
    return Http.get(apiPath.postAutoAuthorizeUrl3 + param)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getUserList (param) { //查询项目经理不带权限
    return Http.get(apiPath.postAutoAuthorizeUrl, param)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getAllUserList (param) { //查询项目经理 不带权限
    return Http.get(apiPath.postAutoAuthorizeUrl4, param)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getCustomOrgs (param) { //获取组织树
    return Http.get(apiPath.postAutoAuthorizeUrl1, param, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getOrgsListNoAuth (params) { //获取所有组织，不带权限
    return Http.get(apiPath.getOrgsListNoAuthUrl, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getUnitProjectSearch (params) { //项目查询本单位
    return Http.get(apiPath.getAutoAuthorizeListUrl, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  findFieldByCompanyAndType (params) { //获取属性信息的字段
    return Http.get(apiPath.findFieldByCompanyAndType, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getGroupProjectSearch (params) { //项目查询全集团
    return Http.get(apiPath.getAutoAuthorizeListUrl1, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getIndependentDemandSearch (params) { //本单位项目 集团统筹需求单位项目查询
    return Http.get(apiPath.getIndependentDemandSearch, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getIndependentUndertakeSearch (params) { //本单位项目 集团统筹需求单位项目查询
    return Http.get(apiPath.getIndependentUndertakeSearch, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },

  queryFinishScoreUndertake (params) { //本单位项目 项目承担单位评分
    return Http.get(apiPath.queryFinishScoreUndertake, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  queryFinishScoreUniteAssault (params) { //本单位项目 项目联合攻关单位评分
    return Http.get(apiPath.queryFinishScoreUniteAssault, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getProvinceAbbr (params) { // 获取省端独立域简称列表，57家一级公司
    return Http.get(apiPath.getProvinceAbbr, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getGroupDemandSearch (params) { //全集团项目 集团统筹需求单位项目查询
    return Http.get(apiPath.getGroupDemandSearch, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getGroupUndertakeSearch (params) { //全集团项目 集团统筹承担单位项目查询
    return Http.get(apiPath.getGroupUndertakeSearch, params, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 部门选择 获取部门
  getChooseDepartment (params) {
    return Http.get(apiPath.getChooseDepartment, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 根据公司编码查询公司的编码
  getOrgInfoByCompanyCode (params) {
    return Http.get(apiPath.getOrgInfoByCompanyCode, params)
  },
  // 根据公司编码查询公司的信息
  getOrgCodeByCompanyCode (params) {
    return Http.get(`${apiPath.getOrgCodeByCompanyCode}/${params}`)
  },
  getWorkInfo (params) {
    return Http.get(apiPath.getWorkSearch, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  //一般支撑工时
  proGeneral (params) {
    return Http.get(apiPath.getProGeneral, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  firmedWorkTimeByCodeAndYear (params) {
    return Http.get(apiPath.getConfirmedWorkTimeByCodeAndYear, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  onfirmedTime (param) { //获取组织树
    return Http.post(apiPath.getConfirmedTime, param, config)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  queryUnitDemandMilesToneList (params) { // 本单位查询-统筹需求方项目里程碑查询（父项目）
    return Http.get(apiPath.queryUnitDemandMilesToneList, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  queryUnitUndertakeMilesToneList (params) { // 本单位查询-统筹承担方项目里程碑查询（子项目）
    return Http.get(apiPath.queryUnitUndertakeMilesToneList, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  queryUnitSelfMilesToneList (params) { // 本单位查询-统筹自立项目里程碑查询
    return Http.get(apiPath.queryUnitSelfMilesToneList, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  queryDemandMilesToneList (params) { // 全集团查询-统筹需求方项目里程碑查询（父项目）
    return Http.get(apiPath.queryDemandMilesToneList, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  remindMilesTone (params) { // 里程碑提醒
    return Http.post(apiPath.remindMilesTone, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  queryBaseInfoByCode (params) { // 查询基本信息接口
    return Http.get(apiPath.queryBaseInfoByCode, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  dictValByCodes (params) { //批量查询数据字典
    return Http.get(apiPath.dictValByCodesUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}
