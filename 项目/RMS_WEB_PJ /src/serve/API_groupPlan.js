import { getHttp } from '@/serve'
import { getStore } from '@/store'
const Http = getHttp()
const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project'
const basicUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/basic'
const projectInfoUrl = baseUrl + '/rms/project/projectInfo/v1' // 项目服务类
const authBaseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/auth' // 项目服务类
// const projectNonSupGeneral = baseUrl + '/group/projectTime' // 工时模块

const apiList = [
  {//用户项目权限校验
    name: 'authVerification',
    url: baseUrl + '/groupProject/v1/3/checkUserProjectPermission',
    method: 'get'
  },
  {//数据字典
    name: 'dictValByCode',
    url: basicUrl + '/ext/dictionary/v1/3/v1/dictValByCode',
    method: 'get/params'
  },
  { // 项目权限  用户项目权限校验
    name: 'verificationPermission',
    url: baseUrl + '/projectPermission/v1/3/getProjectPermissions',
    method: 'get'
  },
  { // 查询项目信息详情【全部】
    name: 'queryEffectiveProjectInfo',
    url: projectInfoUrl + '/3/queryEffectiveProjectInfo',
    method: 'get/params'
  },
  {//同步成本信息
    name: 'syncCost',
    url: baseUrl + '/projectCostGroup/v1/3/generateCostDetail',
    method: 'get'
  },
  {//是否可以同步成本信息
    name: 'canSyncProjectCost',
    url: baseUrl + '/projectCostGroup/v1/3/canSyncProjectCost',
    method: 'get'
  },
  {//基线信息-自立项目（获取选择项）
    name: 'baseLineGetOption',
    url: baseUrl + '/groupBaseLine/v1/3/v1/selectBaseLine',
    method: 'get'
  },
  {//基线信息-自立项目（保存选择项）
    name: 'baseLineSaveOption',
    url: baseUrl + '/groupBaseLine/v1/0/v1/saveBaseLine',
    method: 'post'
  },
  { // 最新已生效版本承担单位查询
    name: 'lastVerProjectCompanyList',
    url: baseUrl + '/groupDemandProjectCommon/v1/3/queryEffectiveProjectCompanyList',
    method: 'get'
  },
  { // 任务进展列表查询页面
    name: 'projectProgressList',
    url: baseUrl + '/groupProjectProgress/v1/3/queryProjectProgressList',
    method: 'get'
  },
  { // 添加任务进展
    name: 'addProjectProgress',
    url: baseUrl + '/groupProjectProgress/v1/0/addProjectProgress',
    method: 'post'
  },
  {//项目文档-可
    name: 'projectFileList',
    url: baseUrl + '/document/v1/3/documentationList',
    method: 'get'
  },
  {//项目文档---成果文档-可
    name: 'resultFileList',
    url: baseUrl + '/document/v1/3/queryAchievementAttachmentList',
    method: 'get'
  },
  {//成果文档---上传-可
    name: 'resultUploadFile',
    url: baseUrl + '/projectAchievement/v1/4/v1/uploadAchievementAttachment',
    method: 'post'
  },
  {//成果文档---删除
    name: 'deleteFile',
    url: baseUrl + '/document/v1/2/deleteProjectAttachment',
    method: 'post'
  },
  {//成本信息（需求单位非一般支撑包）
    name: 'getSProjectCostInfo',
    url: baseUrl + '/projectCostGroup/v1/3/getSProjectCostInfo',
    method: 'get'
  },
  {//成本信息（需求单位一般支撑包）
    name: 'getDGProjectCostInfo',
    url: baseUrl + '/projectCostGroup/v1/3/getGProjectCostInfo',
    method: 'get'
  },
  {//成本信息（承担单位一般支撑包）
    name: 'getUGProjectCostInfo',
    url: baseUrl + '/projectCostGroup/v1/3/getUGProjectCostInfo',
    method: 'get'
  },
  {//成本信息（承担单位承担单位一般支撑包）
    name: 'getUSProjectCostInfo',
    url: baseUrl + '/projectCostGroup/v1/3/getUSProjectCostInfo',
    method: 'get'
  },
  {//成本信息 获取拆分数据
    name: 'getSplitData',
    url: baseUrl + '/projectCostGroup/v1/3/getProjectCostDivi',
    method: 'get'
  },
  {//成本信息 保存拆分数据
    name: 'setSplitData',
    url: baseUrl + '/projectCostGroup/v1/3/saveProjectCostDivi',
    method: 'post'
  },
  {//委托函二级部门
    name: 'getOrgList',
    url: authBaseUrl + '/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth',
    method: 'get'
  },
  {//委托函二级部门
    name: 'queryLastUnlinkedProjectAchievement',
    url: baseUrl + '/groupDemandProjectCommon/v1/3/queryLastUnlinkedProjectAchievement',
    method: 'get'
  },
  {//委托函项目人员
    name: 'queryProjectTeamList',
    url: baseUrl + '/groupProject/v1/3/queryProjectTeamList',
    method: 'post'
  }
  // 父项目非一般支撑
  //   {
  //     name: 'nonSupGeneral',
  //     url: baseUrl + '/v1/3/demand/special',
  //     method: 'get/params'
  //   },
  // 父项目一般支撑包
  // {
  //       name: 'proGeneral',
  //       url: baseUrl + '/v1/3/demand/general',
  //       method: 'get'
  //     }
  // {
  //   name: 'confirmedWorkTime',
  //   url: '/yd' + '/rm/worktime' + '/v1/3/v1/getConfirmedWorkTime',
  //   method: 'get'
  // }

]
export default Http.createHttpServe(apiList)
