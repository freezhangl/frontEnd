
import { getHttp } from '@/serve'
import { getStore } from '@/store'
const Http = getHttp()

const baseUrl = getStore().getters['CONFIG/baseUrl']
const basePlanUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project2'
const groupProjectUrl = basePlanUrl + '/groupProject/v1' //项目公共信息
const demandProjectCommonUrl = basePlanUrl + '/groupDemandProjectCommon/v1' //需求单位-项目公共信息
const demandProjectUrl = basePlanUrl + '/groupDemandProject/v1' //需求单位-项目信息
const undertakeProjectUrl = basePlanUrl + '/groupUndertakeProject/v1' //承担单位-项目信息
const dicUrl = baseUrl + '/rms/basic/ext/dictionary/v1' // 数据字典服务
// api/rms/auth/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth
const apiList = [
  {// 根据父级组织查询列表
    name: 'getOrgListByParentOrgCode',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth',
    method: 'get'
  },
  {// 根据组织编码查询用户列表
    name: 'getAllUserPageByorgCode',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/allUserPageByorgCode',
    method: 'get'
  },
  { // 查询项目成果（分页）http://localhost:8080/api/groupUndertakeProject/v1/3/queryDemandProjectAchievementList?pageNo=1&pageSize=10
    name: 'queryDemandProjectAchievementList',
    url: baseUrl + '/rms/project/groupUndertakeProject/v1/3/queryDemandProjectAchievementList',
    method: 'get'
  },
  { //获取需求单位项目的需求单位列表 下拉数据
    name: 'queryProjectDemandCompanyList',
    url: baseUrl + '/rms/project/groupDemandProjectCommon/v1/3/queryProjectDemandCompanyList',
    method: 'get'
  },
  { //查询需求单位子项目列表 下拉数据
    name: 'querySubProjectList',
    url: baseUrl + '/rms/project/groupDemandProjectCommon/v1/3/querySubProjectList',
    method: 'get'
  },
  { //查询需求单位子项目查询子项目最新成果  http://10.154.4.13/rms/project/groupDemandProjectCommon/v1/3/queryLastSubProjectAchievement/{projectCode}/{subProjectCode}
    name: 'queryLastSubProjectAchievementList',
    url: baseUrl + '/rms/project/groupDemandProjectCommon/v1/3/queryLastSubProjectAchievementList',
    method: 'get'
  },
  { //查询成果详情  http://10.154.4.13/rms/project/groupDemandProjectCommon/v1/3/queryAchievementInfo/46456
    //http://localhost:8080/api/rms/project/groupDemandProjectCommon/v1/3/queryAchievementInfo/1300624598877798402
    name: 'queryAchievementInfo',
    url: baseUrl + '/rms/project/groupDemandProjectCommon/v1/3/queryProjectAchievementInfo',
    method: 'get/params'
  },
  { //查询成果中单位人工成本  /groupDemandProjectCommon/v1/3/queryAvgLaborCost?projectCode=R21100DQ&timeYear=2021&undertakeUnitCode=00550000000000000000
    name: 'queryAvgLaborCost',
    url: baseUrl + '/rms/project/groupDemandProjectCommon/v1/3/queryAvgLaborCost',
    method: 'get'
  },
  { //查询成果中成果负责人和需求人
    name: 'queryProjectTeamList',
    url: baseUrl + '/rms/project/groupProject/v1/3/queryProjectTeamList',
    method: 'post'
  }
]
export default Http.createHttpServe(apiList)
