import Http from '@lib/common/http'
import store from '@/store'

const baseUrl = store.getters['CONFIG/baseUrl']

//接口地址
const apiPath = {
  getDemandChargeUnitUrl: baseUrl + '/rms/basic/ext/employerUndertaker/v1/3/v1/employerUndertakersByOrgCode', //需求单位，承担单位
  getActivityListUrl: baseUrl + '/rms/basic/ext/devActivity/v1/3/v1/devActivityList', //研发活动清单
  getProjectManageUrl: baseUrl + '/rms/basic/ext/projectManager/v1/3/v1/projectManagersByOrgCode', //项目经理
  getChooseUnitUrl: baseUrl + '/rms/auth/ext/user/v1/3/v1/provinceAbbr', //公司选择
  // updateCommonFunctionUrl: baseUrl + '/rms/home/commonFunction/v1/2/commonFunction' //post请求demo
  // 获取人员选择组织列表（带权限）
  getPeopleOptionsOrgListPower: baseUrl + '/rms/auth/ext/user/v1/3/v1/orgListByParentOrgCode',
  // 部门选择 -> 获取部门
  getChooseDepartment: baseUrl + '/rms/auth/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth',
  //组织信息列表批量查询
  getOrgListByOrgCodeList: baseUrl + '/rms/auth/ext/user/v1/3/v1/orgListByOrgCodeList',
  getCompanyOrgCodeByOrgCode: baseUrl + '/rms/auth/ext/user/v1/3/v1/getCompanyOrgCodeByOrgCode',
  // 组织信息列表查询（不分页、不带权限）
  getListByOrgName: baseUrl + '/rms/auth/ext/user/v1/3/v1/getListByOrgName',
  // 获取组织下成员列表
  // getOrgMemberList: baseUrl + '/rms/auth/ext/user/v1/3/v1/allUserPageByorgCode',
  // 获取组织下成员列表 （包含 父组织下子组织的成员）
  getOrgMemberList: baseUrl + '/rms/auth/ext/user/v1/3/v1/allUserPageByorgCode2',
  //
  // 查询用户的数据权限
  getUserDataPower: baseUrl + '/rms/auth/ext/user/v1/3/v1/getCustomOrgs',
  // 根据公司编码查询公司的组织编码
  getOrgCodeByCompanyCode: baseUrl + '/rms/auth/ext/user/v1/3/v1/orgInfoByOrgCode',
  // 获取动态表单时，所用到的接口
  // projectInfoUrl: '/form' + '/rms/form/ext/provide/v1'
  projectInfoUrl: baseUrl + '/rms/form/ext/provide/v1',
  //根据组织编码查询项目总监
  getProjectDirectorsUrl: baseUrl + '/rms/basic/ext/projectDirector/v1/3/v1/projectDirectorsByOrgCode'
}

export default {
  getDemandChargeUnit (params) {
    return Http.get(apiPath.getDemandChargeUnitUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getActivityList (params) {
    return Http.get(apiPath.getActivityListUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 根据公司编码查询公司的组织编码
  getOrgCodeByCompanyCode (params) {
    return Http.get(`${apiPath.getOrgCodeByCompanyCode}/${params}`)
  },
  // 获取组织列表
  getPeopleOptionsOrgListPower (params) {
    return Http.get(apiPath.getPeopleOptionsOrgListPower, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getProjectManage (params) {
    return Http.get(apiPath.getProjectManageUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 获取组织子列表
  getOrgChildren (params) {
    return Http.get(apiPath.getOrgChildList, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 获取组织对应人员列表
  getOrgMemberList (params) {
    return Http.get(apiPath.getOrgMemberList, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 搜索人员
  getSearchOrgMenber () {},
  getChooseUnit (params) {
    return Http.get(apiPath.getChooseUnitUrl, params)
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
  //组织信息列表批量查询
  getOrgListByOrgCodeList (params) {
    return Http.get(apiPath.getOrgListByOrgCodeList, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getCompanyOrgCodeByOrgCode (params) {
    return Http.get(apiPath.getCompanyOrgCodeByOrgCode, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 组织信息列表查询（不分页、不带权限）
  getListByOrgName (params) {
    return Http.get(apiPath.getListByOrgName, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 查询用户的数据权限
  getUserDataPower (params) {
    return Http.get(apiPath.getUserDataPower, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // updateCommonFunction (params) {
  //   return Http.post(apiPath.updateCommonFunctionUrl, params)
  //     .then(res => {
  //       return Promise.resolve(res)
  //     })
  //     .catch(err => {
  //       return Promise.reject(err)
  //     })
  // }
  // 动态表单
  // 获取新建表单
  getFormList (params) {
    return Http.post(apiPath.projectInfoUrl + '/3/v1/getAddForm', params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 提交新建表单
  submitFormList (params) {
    return Http.post(apiPath.projectInfoUrl + '/0/v1/save', params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 获取查看表单
  checkFormList (params) {
    return Http.post(apiPath.projectInfoUrl + '/3/v1/getCheckForm', params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 获取编辑表单
  editFormList (params) {
    return Http.post(apiPath.projectInfoUrl + '/3/v1/getEditForm', params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 获取审批表单
  approveFormList (params) {
    return Http.post(apiPath.projectInfoUrl + '/3/v1/getApproveForm', params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  getProjectDirectors (params) {
    return Http.get(apiPath.getProjectDirectorsUrl, params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}
