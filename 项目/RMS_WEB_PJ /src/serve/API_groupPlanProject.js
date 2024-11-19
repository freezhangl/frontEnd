
import { getHttp } from '@/serve'
import { getStore } from '@/store'
const Http = getHttp()

const baseUrl = getStore().getters['CONFIG/baseUrl']
const basePlanUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project'
const groupProjectUrl = basePlanUrl + '/groupProject/v1' //项目公共信息
const demandProjectCommonUrl = basePlanUrl + '/groupDemandProjectCommon/v1' //需求单位-项目公共信息
const demandProjectUrl = basePlanUrl + '/groupDemandProject/v1' //需求单位-项目信息
const undertakeProjectCommonUrl = basePlanUrl + '/groupUndertakeProjectCommon/v1' //承担单位-项目公共信息
const undertakeProjectUrl = basePlanUrl + '/groupUndertakeProject/v1' //承担单位-项目信息
const dicUrl = baseUrl + '/rms/basic/ext/dictionary/v1' // 数据字典服务
const productInfoUrl = baseUrl + '/rms/project/groupProductInfoConfiguration/v1' //项目产品信息配置

const apiList = [
  //----------项目公共信息start---------------------------------------//
  {//查询对应的项目信息
    name: 'queryProjectBaseInfo',
    url: groupProjectUrl + '/3/queryProjectBaseInfo',
    method: 'get/params'
  },
  {//查询项目版本列表
    name: 'getProjectVersionList',
    url: groupProjectUrl + '/3/getProjectVersionList',
    method: 'get/params'
  },
  {//项目关闭
    name: 'projectClose',
    url: groupProjectUrl + '/2/projectClose',
    method: 'get/params'
  },
  // {//查询最新的项目信息
  //   name: 'queryLatestProjectInfo',
  //   url: groupProjectUrl + '/3/queryEffectiveProjectInfo',
  //   method: 'get/params'
  // },
  { // 首页我的项目列表
    name: 'getProjectList',
    url: baseUrl + '/api-platform/common/verificationCode',
    method: 'post'
  },
  { // 动态表单属性信息保存 - 一般支撑包，非一般支撑包
    name: 'editProjectAttributeUrl',
    url: basePlanUrl + '/groupDemandProject/v1/2/editProjectAttribute',
    method: 'POST'
  },
  { // 动态表单属性信息保存 - 承担单位项目
    name: 'editGroupUnderProjectAttributeUrl',
    url: basePlanUrl + '/groupUndertakeProject/v1/2/editProjectAttribute',
    method: 'POST'
  },
  { // 首页我的项目列表,创建承担单位非一般支撑项目前校验
    name: 'checkCreateUndertakeSpecialProject',
    url: basePlanUrl + '/groupUndertakeSpecialProject/v1/3/checkCreateUndertakeSpecialProject',
    method: 'get/params'
  },
  { //创建承担单位一般支撑包-委托函列表
    name: 'queryEntrustLetterList',
    url: basePlanUrl + '/groupUndertakeGeneralProject/v1/3/queryEntrustLetterList',
    method: 'get'
  },
  { // 工时填报方式
    name: 'queryWorkTimeSubmitType',
    url: basePlanUrl + '/groupUndertakeProjectCommon/v1/3/queryWorkTimeSubmitType',
    method: 'get'
  },
  //----------项目公共信息end-------------------------------------------//

  //----------项目权限start----------//
  {//用户项目权限校验
    name: 'checkUserProjectPermission',
    url: groupProjectUrl + '/3/checkUserProjectPermission',
    method: 'get'
  },
  {//用户是否有全量查询数据权限
    name: 'checkUserFullDataPermission',
    url: groupProjectUrl + '/3/checkUserFullDataPermission',
    method: 'get'
  },
  {//查询当前用户所在公司里程碑数量配置
    name: 'queryProjectMilestoneNo',
    url: groupProjectUrl + '/3/queryProjectMilestoneNo',
    method: 'get'
  },
  {//校验单据是否可以提交 -- 变更提示
    name: 'isShowChangeTip',
    url: groupProjectUrl + '/3/isApproveCanSubmitNoException',
    method: 'get'
  },
  {//查询是否可以删除人员
    name: 'canRemoveProjectTeam',
    url: groupProjectUrl + '/3/canRemoveProjectTeam',
    method: 'get'
  },
  {//批量查询项目单位组织编码（子项目中）
    name: 'queryProjectOrganizationBatch',
    url: groupProjectUrl + '/3/queryProjectOrganizationBatch',
    method: 'get'
  },
  //----------项目权限end----------//

  //----------需求单位-项目公共信息start------------------------------------//
  {//查询最新的项目信息
    name: 'queryLatestProjectInfoD',
    url: demandProjectCommonUrl + '/3/queryLatestProjectInfo',
    method: 'get'
  },
  {//查询最新已生效的项目信息
    name: 'queryEffectiveProjectInfoD',
    url: demandProjectCommonUrl + '/3/queryEffectiveProjectInfo',
    method: 'get'
  },
  {//查询对应版本的项目信息
    name: 'queryProjectInfoByVersionD',
    url: demandProjectCommonUrl + '/3/queryProjectInfoByVersion',
    method: 'get'
  },
  {//查询对应版本的项目预算（需求单位项目）
    name: 'queryProjectBudgetByVersionD',
    url: demandProjectCommonUrl + '/3/queryProjectBudgetByVersion',
    method: 'get'
  },
  {//查询对应版本的项目预算（需求单位项目终止结项）
    name: 'queryProjectCostByVersion',
    url: demandProjectCommonUrl + '/3/queryProjectCostByVersion',
    method: 'get'
  },
  { // 查询项目里程碑列表【新增】
    name: 'milestone',
    // url: demandProjectCommonUrl + '/3/queryProjectMilestone',
    url: demandProjectCommonUrl + '/3/queryLastMilestone',
    method: 'get/params'
  },
  { //获取最新预期成果接口
    name: 'queryLatestProjectAchievement',
    url: demandProjectCommonUrl + '/3/queryLatestProjectAchievement',
    method: 'get/params'
  },
  { //获取需求单位项目的需求单位列表
    name: 'queryProjectDemandCompanyList',
    url: demandProjectCommonUrl + '/3/queryProjectDemandCompanyList',
    method: 'get'
  },
  { //获取需求单位子项目列表
    name: 'querySubProjectList',
    url: demandProjectCommonUrl + '/3/querySubProjectList',
    method: 'get'
  },
  { //需求单位分页查询最新成果信息
    name: 'queryLastSubProjectAchievementD',
    url: demandProjectCommonUrl + '/3/queryLastSubProjectAchievement',
    method: 'get'
  },
  { // 项目编辑
    name: 'checkProjectEdit',
    url: demandProjectCommonUrl + '/3/checkProjectEdit',
    method: 'get'
  },
  { //查询单个子项目详情
    name: 'querySubProjectDetailD',
    url: demandProjectCommonUrl + '/3/querySubProjectDetail',
    method: 'get'
  },
  //----------需求单位-项目公共信息end--------------------------------------//

  //----------需求单位-项目信息start------------------------------------//
  {//项目临时版本删除（草稿/已生效）
    name: 'removeProjectTemporaryVersionD',
    url: demandProjectUrl + '/1/removeProjectTemporaryVersion',
    method: 'get'
  },
  {//项目基本信息编辑暂存
    name: 'editProjectBaseInfoD',
    url: demandProjectUrl + '/2/editProjectBaseInfo',
    method: 'post'
  },
  {//项目属性信息编辑暂存
    name: 'editProjectAttributeD',
    url: demandProjectUrl + '/2/editProjectAttribute',
    method: 'post'
  },
  {//项目团队信息编辑暂存
    name: 'editProjectTeamD',
    url: demandProjectUrl + '/2/editProjectTeam',
    method: 'post'
  },
  {//需求单位子项目信息编辑暂存
    name: 'editSubProjectInfoD',
    url: demandProjectUrl + '/2/editSubProjectInfo',
    method: 'post'
  },
  {//需求单位子项目信息新增
    name: 'addSubProjectInfoD',
    url: demandProjectUrl + '/0/addSubProjectInfo',
    method: 'post'
  },
  {//需求单位子项目信息删除
    name: 'removeSubProjectInfoD',
    url: demandProjectUrl + '/1/removeSubProjectInfo',
    method: 'get'
  },
  {//查询最新版本子项目信息
    name: 'queryLastSubProjectInfo',
    url: basePlanUrl + '/groupDemandProjectCommon/v1/3/queryLastSubProjectInfo',
    method: 'get/params'
  },
  {//添加预期成果
    name: 'addAchievementD',
    url: demandProjectUrl + '/0/addAchievement',
    method: 'post'
  },
  {//编辑预期成果
    name: 'editAchievementD',
    url: demandProjectUrl + '/2/editAchievement',
    method: 'post'
  },
  {//删除预期成果
    name: 'removeAchievementD',
    url: demandProjectUrl + '/1/removeAchievement',
    method: 'get'
  },
  {//里程碑信息编辑暂存
    name: 'editProjectMilestoneD',
    url: demandProjectUrl + '/2/editProjectMilestone',
    method: 'post'
  },
  {//里程碑信息新增
    name: 'addProjectMilestoneD',
    url: demandProjectUrl + '/0/addProjectMilestone',
    method: 'post'
  },
  {//里程碑信息删除
    name: 'removeProjectMilestoneD',
    url: demandProjectUrl + '/1/removeProjectMilestone',
    method: 'post'
  },
  {//项目信息保存
    name: 'saveProjectInfoD',
    url: demandProjectUrl + '/0/saveProjectInfo',
    method: 'post'
  },
  //----------需求单位-项目信息end--------------------------------------//

  //----------承担单位-项目公共信息start--------------------------------------//
  {//项目临时版本删除（草稿/已生效）
    name: 'queryLatestProjectInfoU',
    url: undertakeProjectCommonUrl + '/3/queryLatestProjectInfo',
    method: 'get'
  },
  {//查询最新已生效的项目信息
    name: 'queryEffectiveProjectInfoU',
    url: undertakeProjectCommonUrl + '/3/queryEffectiveProjectInfo',
    method: 'get'
  },
  {//查询对应版本的项目信息
    name: 'queryProjectInfoByVersionU',
    url: undertakeProjectCommonUrl + '/3/queryProjectInfoByVersion',
    method: 'get'
  },
  {//查询承担单位项目预算
    name: 'queryUProjectBudget',
    url: undertakeProjectCommonUrl + '/3/queryProjectBudgetByVersion',
    method: 'get'
  },
  {//查询承担单位项目预算
    name: 'queryUProjectBudget2',
    url: undertakeProjectCommonUrl + '/3/queryProjectBudgetByVersion2',
    method: 'get'
  },
  {//查询预算填报模式
    name: 'queryCostBudgetType',
    url: undertakeProjectCommonUrl + '/3/queryCostBudgetType',
    method: 'get'
  },
  {//查询预算填报模式
    name: 'queryFinalProjectBudgetInfo',
    url: undertakeProjectCommonUrl + '/3/queryFinalProjectBudgetInfo',
    method: 'get'
  },
  { // 查询项目里程碑列表【新增】
    name: 'milestoneU',
    // url: demandProjectCommonUrl + '/3/queryProjectMilestone',
    url: undertakeProjectCommonUrl + '/3/queryLastMilestone',
    method: 'get/params'
  },
  { // 关联预期成果列表查询 承担单位
    name: 'queryLastSubProjectAchievement',
    url: undertakeProjectCommonUrl + '/3/queryLastSubProjectAchievement',
    method: 'get'
  },
  { // 是否显示产品信息
    name: 'showProjectProductInfo',
    url: undertakeProjectCommonUrl + '/3/showProjectProductInfo',
    method: 'get'
  },
  { // 是否显示项目资源信息
    name: 'showProjectResourceInfo',
    url: undertakeProjectCommonUrl + '/3/showProjectResourceInfo',
    method: 'get'
  },
  { //查询单个子项目详情
    name: 'querySubProjectDetailU',
    url: undertakeProjectCommonUrl + '/3/querySubProjectDetail',
    method: 'get'
  },
  //----------承担单位-项目公共信息end----------------------------------------//

  //----------承担单位-项目信息start------------------------------------//
  {//项目临时版本删除（草稿/已生效）
    name: 'removeProjectTemporaryVersionU',
    url: undertakeProjectUrl + '/1/removeProjectTemporaryVersion',
    method: 'get'
  },
  {//项目基本信息编辑暂存
    name: 'editProjectBaseInfoU',
    url: undertakeProjectUrl + '/2/editUnderTakeBaseInfo',
    method: 'post'
  },
  {//项目属性信息编辑暂存
    name: 'editProjectAttributeU',
    url: undertakeProjectUrl + '/2/editProjectAttribute',
    method: 'post'
  },
  {//项目团队信息编辑暂存
    name: 'editProjectTeamU',
    url: undertakeProjectUrl + '/2/editProjectTeam',
    method: 'post'
  },
  {//查询最新版本子项目信息承担单位
    name: 'queryLastSubProjectInfoU',
    url: basePlanUrl + '/groupUndertakeProjectCommon/v1/3/queryLastSubProjectInfo',
    method: 'get/params'
  },
  {//承担单位子项目信息编辑暂存
    name: 'editSubProjectInfoU',
    url: undertakeProjectUrl + '/2/editSubProjectInfo',
    method: 'post'
  },
  {//承担单位子项目信息新增
    name: 'addSubProjectInfoU',
    url: undertakeProjectUrl + '/0/addSubProjectInfo',
    method: 'post'
  },
  {//承担单位子项目信息删除
    name: 'removeSubProjectInfoU',
    url: undertakeProjectUrl + '/1/removeSubProjectInfo',
    method: 'get'
  },
  {//关联预期成果列表查询
    name: 'queryDemandProjectAchievementListU',
    url: undertakeProjectUrl + '/3/queryDemandProjectAchievementList',
    method: 'get'
  },
  {//项目预算编辑暂存
    name: 'editProjectBudget',
    url: undertakeProjectUrl + '/2/editProjectBudget',
    method: 'post',
    config: { filters: [] }
  },
  {//里程碑信息编辑暂存
    name: 'editProjectMilestoneU',
    url: undertakeProjectUrl + '/2/editProjectMilestone',
    method: 'post'
  },
  {//里程碑信息新增
    name: 'addProjectMilestoneU',
    url: undertakeProjectUrl + '/0/addProjectMilestone',
    method: 'post'
  },
  {//里程碑信息删除
    name: 'removeProjectMilestoneU',
    url: undertakeProjectUrl + '/1/removeProjectMilestone',
    method: 'post'
  },
  {//项目信息保存
    name: 'saveProjectInfoU',
    url: undertakeProjectUrl + '/0/saveUndertakeProjectInfo',
    method: 'post'
  },
  {//承担单位子项目移除成果
    name: 'removeSubProjectAchievement',
    url: undertakeProjectUrl + '/2/removeSubProjectAchievement',
    method: 'post'
  },
  {//承担单位子项目关联成果校验
    name: 'checkUndertakeProjectLinkAchievement',
    url: undertakeProjectUrl + '/3/checkUndertakeProjectLinkAchievement',
    method: 'post'
  },
  {//项目产品信息新增接口
    name: 'addProjectProductInfo',
    url: undertakeProjectUrl + '/0/addProjectProductInfo',
    method: 'post'
  },
  {//项目产品信息编辑接口
    name: 'editProjectProductInfo',
    url: undertakeProjectUrl + '/2/editProjectProductInfo',
    method: 'post'
  },
  {//项目产品信息删除接口
    name: 'removeProjectProductInfo',
    url: undertakeProjectUrl + '/1/removeProjectProductInfo',
    method: 'post'
  },
  {//项目资源信息批量保存接口
    name: 'batchEditProjectResourceInfo',
    url: undertakeProjectUrl + '/2/batchEditProjectResourceInfo',
    method: 'post'
  },
  { // 是否支持预立项
    name: 'supportProjectPreApprove',
    url: undertakeProjectCommonUrl + '/3/supportProjectPreApprove',
    method: 'get'
  },
  //----------承担单位-项目信息end------------------------------------//

  //----------项目产品信息配置start---------------------------------------------//
  {
    name: 'queryProductInfoByCondition',
    url: productInfoUrl + '/3/queryProductInfoByCondition',
    method: 'get'
  },
  //----------项目产品信息配置end---------------------------------------------//

  //----------外部接口start--------------------------------------------//
  {// 根据数据字典类型代码与公司简码查询数据字典值
    name: 'dictionaryValuesCompanyCode',
    url: dicUrl + '/3/v1/dictionaryValues/companyCode',
    method: 'get'
  },
  {//根据数据字典类型代码查询数据字典值
    name: 'getDictValByCode',
    url: dicUrl + '/3/v1/dictValByCode',
    method: 'get/params'
  },
  {// 根据数据字典类型代码查询数据字典值批量查询
    name: 'dictValByCodes',
    url: dicUrl + '/3/v1/dictValByCodes',
    method: 'get'
  },
  {// 根据组织类型查询有效需求方承担方
    name: 'getEmployerUndertaker',
    url: baseUrl + '/rms/basic/ext/employerUndertaker/v1/3/v1/employerUndertakersByOrgCode',
    method: 'get'
  },
  {// 根据组织编码查询用户列表
    name: 'allUserPageByorgCode',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/allUserPageByorgCode',
    method: 'get'
  },
  {// 获取省端独立域简称列表（57家一家单位）
    name: 'provinceAbbr',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/provinceAbbr',
    method: 'get'
  },
  {// 根据公司编码查询公司的组织编码
    name: 'getOrgCodeByCompanyCode',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/getOrgCodeByCompanyCode',
    method: 'get'
  },
  {// 根据父级组织查询列表（不带权限）
    name: 'getOrgListByParentOrgCodeNoAuth',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth',
    method: 'get'
  },
  { // 判断专家清单规则
    name: 'judgeExpert',
    url: baseUrl + '/rms/project/projectBase/v1/3/isExpert',
    method: 'get'
  },
  {//查询专家列表
    name: 'projectExpertByOrgCode',
    url: baseUrl + '/rms/basic/ext/expert/v1/3/v1/experts/orgCode',
    method: 'get'
  },
  //----------外部接口end---------------------------------------------//
  {
    name: 'orgListByOrgCodeList',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/orgListByOrgCodeList',
    method: 'get'
  }
]
export default Http.createHttpServe(apiList)
