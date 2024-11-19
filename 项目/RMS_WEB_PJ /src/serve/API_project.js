import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
// 基本路径定义已具体到模块及版本号
const baseUrl = getStore().getters['CONFIG/baseUrl']
const rmsBaseUrl = baseUrl + '/rms/project'
const projectInfoUrl = baseUrl + '/rms/project/projectInfo/v1' // 项目服务类
const projectBaseInfoUrl = baseUrl + '/rms/project/projectBaseInfo/v1' // 项目基本信息服务
const projectTeamUrl = baseUrl + '/rms/project/projectTeam/v1' // 项目团队服务类
const projectBaseUrl = baseUrl + '/rms/project/projectBase/v1' // 项目成员服务、项目成本服务类、项目立项流程服务类、项目文档服务类
const projectAchievementUrl = baseUrl + '/rms/project/projectAchievement/v1' // 项目成果服务类
const projectMilestoneUrl = baseUrl + '/rms/project/projectMilestone/v1' // 项目里程碑服务类
const costBudgetUrl = baseUrl + '/rms/project/costBudget/v1' //项目成本服务类
const basicUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/basic' //基础服务类
const projectApproveUrl = baseUrl + '/rms/project/projectApprove/v1'
const projectFinApprove = baseUrl + '/rms/project/projectFinApprove/v1'
const projectChangeUrl = baseUrl + '/rms/project/projectChange/v1' //变更流程服务
const projectVersionUrl = baseUrl + '/rms/project/projectVersion/v1' //变更流程服务
const projectPackageUrl = baseUrl + '/rms/project/projectApprovePackageTask/v1' //研发包任务申请服务
const dicUrl = baseUrl + '/rms/basic/ext/dictionary/v1' // 数据字典服务
const planCreate = baseUrl + '/rms/project/projectPlan/v1' // 集团批复计划创建
const fileDetailUrl = baseUrl + '/rms/file/ext/file/v1/3' // 通过fileCode查询sign

const apiList = [
  // 根据数据字典类型代码与公司简码查询数据字典值
  {
    name: 'dictionaryValuesCompanyCode',
    url: dicUrl + '/3/v1/dictionaryValues/companyCode',
    method: 'get'
  },
  // 根据数据字典类型代码查询数据字典值批量查询
  {
    name: 'dictValByCodes',
    url: dicUrl + '/3/v1/dictValByCodes',
    method: 'get'
  },
  // 项目服务类
  { // 项目列表
    name: 'queryProjects',
    url: projectInfoUrl + '/3/queryProjects',
    method: 'get'
  },
  { // 项目信息保存/编辑【全量】
    name: 'saveProject',
    url: projectInfoUrl + '/0/saveProject',
    method: 'post'
  },
  { // 项目信息删除
    name: 'deleteProject',
    url: projectInfoUrl + '/2/deleteProject',
    method: 'get/params'
  },
  { // 查询项目信息详情【全部】
    name: 'queryEffectiveProjectInfo',
    url: projectInfoUrl + '/3/queryEffectiveProjectInfo',
    method: 'get/params'
  },
  { // 项目关闭
    name: 'closeProject',
    url: projectInfoUrl + '/1/closeProject',
    method: 'get'
  },
  {// 根据项目编号和版本号查询项目信息
    name: 'projectInfoByVersion',
    url: projectInfoUrl + '/3/projectInfo',
    method: 'get'
  },
  { // 总分/分总配置
    name: 'queryCostBudgetType',
    url: rmsBaseUrl + '/costBudget/v1/1/queryCostBudgetType',
    method: 'get'
  },
  {// 项目编辑和关闭按钮是否可见
    name: 'buttonIsVisiable',
    url: projectInfoUrl + '/3/buttonIsVisiable',
    method: 'get'
  },
  // 动态表单属性信息接口
  { // 根据内部需求单位项目编码获取详情
    name: 'queryEffectiveProjectBaseInfoUrl',
    url: rmsBaseUrl + '/projectAttribute/v1/3/queryEffectiveProjectBaseInfo',
    method: 'get'
  },
  { // 获取是否加计扣除
    name: 'hasAdditionalDeductionUrl',
    url: rmsBaseUrl + '/projectAttribute/v1/3/hasAdditionalDeduction',
    method: 'get'
  },
  { // 动态表单属性信息保存
    name: 'updateProjectAttributeUrl',
    url: rmsBaseUrl + '/projectAttribute/v1/1/updateProjectAttribute',
    method: 'POST'
  },
  { // 查询子项目列表
    name: 'getSubProjectInfo',
    url: rmsBaseUrl + '/projectBase/v1/3/lastSubProjectInfos',
    method: 'get'
  },
  { // 子项目新增
    name: 'addSubProjectInfo',
    url: rmsBaseUrl + '/projectBase/v1/0/subProjectInfo',
    method: 'POST'
  },
  { // 子项目编辑
    name: 'updateSubProjectInfo',
    url: rmsBaseUrl + '/projectBase/v1/2/subProjectInfo',
    method: 'POST'
  },
  { // 子项目详情
    name: 'subProjectDetailInfo',
    url: rmsBaseUrl + '/projectBase/v1/3/subProjectDetailInfo',
    method: 'get'
  },
  { // 子项目删除
    name: 'delSubProjectInfo',
    url: rmsBaseUrl + '/projectBase/v1/1/subProjectInfo',
    method: 'POST'
  },
  { // 子项目成果删除判断是否关联了附件
    name: 'hasAttachment',
    url: rmsBaseUrl + '/projectAchievement/v1/3/hasAttachment',
    method: 'get'
  },
  { // 判断单据是否作废过
    name: 'carryHistoryFile',
    url: rmsBaseUrl + '/projectApprove/v1/3/carryHistoryFile',
    method: 'get'
  },
  { // 项目产品信息新增
    name: 'addProjectProductInfo',
    url: rmsBaseUrl + '/projectProduct/v1/0/addProduct',
    method: 'post'
  },
  { // 项目产品信息编辑
    name: 'editProjectProductInfo',
    url: rmsBaseUrl + '/projectProduct/v1/2/editProduct',
    method: 'post'
  },
  { // 项目产品信息删除
    name: 'removeProjectProductInfo',
    url: rmsBaseUrl + '/projectProduct/v1/1/delProduct',
    method: 'post'
  },
  { // 是否显示产品信息
    name: 'showProduct',
    url: rmsBaseUrl + '/projectProduct/v1/3/showProduct',
    method: 'get'
  },
  { // 是否显示产品资源信息
    name: 'showResource',
    url: rmsBaseUrl + '/projectResource/v1/3/showResource',
    method: 'get'
  },
  { // 项目资源信息批量保存接口
    name: 'batchEditProjectResourceInfo',
    url: rmsBaseUrl + '/projectResource/v1/0/saveResource',
    method: 'post'
  },
  { // 动态表单属性信息获取新建表单
    name: 'getFormList',
    url: baseUrl + '/rms/form/ext/provide/v1/3/v1/getAddForm',
    method: 'post'
  },
  { // 获取动态表单属性信息获取编辑表单
    name: 'editFormList',
    url: baseUrl + '/rms/form/ext/provide/v1/3/v1/getEditForm',
    method: 'post'
  },
  // 项目基本信息服务
  { // 根据项目来源获取项目编号
    name: 'queryProjectCode',
    url: projectBaseInfoUrl + '/3/projectCode',
    method: 'get'
  },
  { // 项目基本信息暂存-新建
    name: 'saveProjectBaseInfo',
    url: projectBaseInfoUrl + '/0/saveProjectBaseInfo',
    method: 'post'
  },
  {
    name: 'isProjectDevelopPackage',
    url: projectBaseInfoUrl + '/3/isProjectDevelopPackage',
    method: 'get'
  },
  { // 校验项目基本信计划立项和结项时间
    name: 'checkTime',
    url: projectBaseInfoUrl + '/3/checkTime',
    method: 'get'
  },
  // 项目团队服务类
  { // 查询用户列表-人员选择（根据组织编码查询该组织对应的companyCode下的用户列表）
    name: 'queryUserList',
    url: projectTeamUrl + '/3/userList',
    method: 'get',
    config: { loading: false }
  },
  { // 项目成员暂存
    name: 'saveProjectMember',
    url: projectTeamUrl + '/0/saveProjectMember',
    method: 'post'
  },
  // 项目成员服务
  { // 项目成员编辑【不用】
    name: 'editProjectMember',
    url: projectBaseUrl + '/1/editProjectMember',
    method: 'post'
  },
  { // 项目成员删除【不用】
    name: 'deleteProjectMenber',
    url: projectBaseUrl + '/2/deleteProjectMenber',
    method: 'post'
  },
  { // 查询项目成员角色
    name: 'queryProjectMemberRole',
    url: projectBaseUrl + '/3/queryProjectMemberRole',
    method: 'get'
  },
  { // 判断专家清单规则
    name: 'judgeExpert',
    url: projectBaseUrl + '/3/isExpert',
    method: 'get'
  },
  { // 判断项目经理清单规则
    name: 'judgeManager',
    url: projectBaseUrl + '/3/isProjectManager',
    method: 'get'
  },
  // 项目成本服务类
  { // 项目成本预算信息暂存
    name: 'saveCostBudget',
    url: costBudgetUrl + '/1/saveCostBudget',
    method: 'post'
  },
  // 项目成果服务类
  { // 项目预期成果信息新增
    name: 'addProjectAchievement',
    url: projectAchievementUrl + '/0/addProjectAchievement',
    method: 'post'
  },
  { // 项目预期成果信息编辑
    name: 'updateProjectAchievement',
    url: projectAchievementUrl + '/1/updateProjectAchievement',
    method: 'post'
  },
  { // 项目预期成果信息删除(RMS-PROJECT-2009)
    name: 'deleteAchievement',
    url: projectAchievementUrl + '/2/deleteAchievement',
    method: 'post'
  },
  { // 查询项目成果（未分页）
    name: 'queryLastAchievement',
    url: projectAchievementUrl + '/3/queryLastAchievement',
    method: 'get'
  },
  { // 查询项目成果（分页）
    name: 'queryLastAchievementPage',
    url: projectAchievementUrl + '/3/queryLastAchievementPage',
    method: 'get'
  },
  { // 查询结项流程是否存在成果未上传附件
    name: 'queryIsResultInfo',
    url: projectAchievementUrl + '/3/allHasAttachment',
    method: 'get'
  },
  // 项目里程碑服务类
  { // 查询当前用户所在公司里程碑数量配置
    name: 'isShowMilestones',
    url: projectMilestoneUrl + '/3/isShowMilestones',
    method: 'get'
  },
  { // 项目里程碑信息编辑
    name: 'updateMileStoneBaseInfo',
    url: projectMilestoneUrl + '/1/updateMileStoneBaseInfo',
    method: 'post'
  },
  { // 项目里程碑信息删除
    name: 'deleteMileStoneBaseInfo',
    url: projectMilestoneUrl + '/2/deleteMileStoneBaseInfo',
    method: 'post'
  },
  {// 查询里程碑责任人和成果负责人
    name: 'queryProjectMembers',
    url: projectTeamUrl + '/3/queryProjectMemberRole',
    method: 'get'
  },
  { // 查询项目里程碑列表【新增】
    name: 'milestone',
    url: projectMilestoneUrl + '/3/milestone',
    method: 'get/params'
  },
  { // 编辑里程碑信息是否被修改
    name: 'isChange',
    url: projectMilestoneUrl + '/3/isChange',
    method: 'post'
  },
  { // 判断里程碑是否可以编辑
    name: 'judgeMilestoneCanEdit',
    url: projectMilestoneUrl + '/3/judge',
    method: 'get/params'
  },
  { // 里程碑发起流程按钮是否展示
    name: 'isShowMilestoneStart',
    url: projectMilestoneUrl + '/3/isShowMenus',
    method: 'get/params'
  },
  // 项目立项流程服务类
  { // 项目保存时来判断当前场景
    name: 'saveCanGuide',
    url: projectApproveUrl + '/3/saveCanGuide',
    method: 'get'
  },
  { // 查询立项流程列表(RMS-PROJECT-7006)
    name: 'queryProjectApprove',
    url: projectApproveUrl + '/3/queryProjectApprove',
    method: 'get'
  },
  { // 是否可以创建项目呢
    name: 'checkCreateProject',
    url: rmsBaseUrl + '/projectBaseInfo/v1/3/checkCreateProject',
    method: 'get'
  },
  { // 是否支持预立项
    name: 'checkEstablish',
    url: rmsBaseUrl + '/projectPreApprove/v1/3/isAvailable',
    method: 'get'
  },
  { // 是否支持预立项
    name: 'checkEstablishShow',
    url: rmsBaseUrl + '/projectPreApprove/v1/1/checkEstablish',
    method: 'get'
  },
  { // 发起预立项流程校验
    name: 'judgeBeforeLaunchApproval',
    url: rmsBaseUrl + '/projectPreApprove/v1/4/check',
    method: 'get'
  },
  { // 预立项保存
    name: 'saveProjectBeforApprove',
    url: rmsBaseUrl + '/projectPreApprove/v1/0/save',
    method: 'post'
  },
  { // 预立项提交
    name: 'submitProjectBeforApprove',
    url: rmsBaseUrl + '/projectPreApprove/v1/4/submit',
    method: 'post'
  },
  { // 预立项重新提交
    name: 'resubmitProjectBeforApprove',
    url: rmsBaseUrl + '/projectApprove/v1/4/resubmitWithParticipant',
    method: 'post'
  },
  { // 预立项删除
    name: 'delProjectBeforApprove',
    url: rmsBaseUrl + '/projectPreApprove/v1/1/withdraw',
    method: 'get'
  },
  { // 预立项详情接口-新增
    name: 'queryDocumentDetail',
    url: rmsBaseUrl + '/projectPreApprove/v1/3/queryDocumentDetails',
    method: 'get'
  },
  { // 预立项详情接口
    name: 'getProjectBeforInfo',
    url: rmsBaseUrl + '/projectPreApprove/v1/3/getTempInfo',
    method: 'get'
  },
  { // 是否显示发起流程按钮
    name: 'isLaunchAvailable',
    url: projectApproveUrl + '/3/isAvailable',
    method: 'get'
  },
  { // 发起立项流程校验
    name: 'judgeLaunchApproval',
    url: projectApproveUrl + '/3/judgeApproval',
    method: 'get'
  },
  { // 查询立项流程详情
    name: 'queryTemporaryInfo',
    url: projectBaseUrl + '/3/temporaryInfo',
    method: 'get'
  },
  { // 获取id
    name: 'getApproveId',
    url: projectApproveUrl + '/2/getApproveId',
    method: 'get'
  },
  { // 立项保存
    name: 'saveProjectApprove',
    url: projectApproveUrl + '/0/saveProjectApprove',
    method: 'post'
  },
  { // 立项提交
    name: 'submitProjectApprove',
    url: projectApproveUrl + '/0/submitProjectApprove',
    method: 'post'
  },
  { // 立项删除（新）
    name: 'deleteLaunchApprove',
    url: projectApproveUrl + '/1/approve',
    method: 'post'
  },
  { // 查询立项流程详情【代办/已办】
    name: 'getApproveTemInfo',
    url: projectApproveUrl + '/3/approve',
    method: 'get'
  },
  { // 立项表单审批通过
    name: 'approveProject',
    url: projectApproveUrl + '/2/approveProject',
    method: 'post'
  },
  { // 立项表单审批提交（总接口）
    name: 'submitApprove',
    url: projectApproveUrl + '/2/submitApprove',
    method: 'post'
  },
  { // 立项任务事项转办
    name: 'reassignWorkItem',
    url: projectApproveUrl + '/4/reassignWorkItem',
    method: 'post'
  },
  { // 重新提交：下一环节+处理人
    name: 'resubmitWithParticipant',
    url: projectApproveUrl + '/4/resubmitWithParticipant',
    method: 'post'
  },
  { // 立项表单审批退回后作废
    name: 'disapproveProject',
    url: projectApproveUrl + '/2/disapproveProject',
    method: 'post'
  },
  { // 查询结项流程列表
    name: 'queryFinalFlowList',
    url: projectFinApprove + '/3/queryApprove',
    method: 'get'
  },
  { // 查询结项详情信息
    name: 'queryFinalFlowDetail',
    url: projectFinApprove + '/3/info',
    method: 'get'
  },
  { // 查询结项版本信息
    name: 'queryLatestProjectInfo',
    url: projectFinApprove + '/3/latestProjectInfo',
    method: 'get'
  },
  { // 结项表单保存
    name: 'saveFinalApprove',
    url: projectFinApprove + '/0/saveProjectApprove',
    method: 'post'
  },
  { // 结项提交
    name: 'submitFinalProjectApprove',
    url: projectFinApprove + '/0/submitProjectApprove',
    method: 'post'
  },
  { // 结项重新提交：下一环节+处理人
    name: 'resFinalubmitWithParticipant',
    url: projectFinApprove + '/4/resubmitWithParticipant',
    method: 'post'
  },
  { //结项表单废弃
    name: 'deleteFinalApprove',
    url: projectFinApprove + '/1/deleteApprove',
    method: 'get'
  },
  { //发起结项按钮展示
    name: 'isFinAvailable',
    url: projectFinApprove + '/3/isAvailable',
    method: 'get'
  },
  { //发起结项流程校验
    name: 'whetherStartFin',
    url: projectFinApprove + '/3/whetherStartable',
    method: 'get'
  },
  // 项目文档服务类
  { // 项目权限  用户项目权限校验
    name: 'verificationPermission',
    url: baseUrl + '/rms/project/projectPermission/v1/3/getProjectPermissions',
    method: 'get'
  },
  { // 查询项目是否可发起立项流程
    name: 'whetherStartable',
    url: baseUrl + '/rms/project/projectTempVersion/v1/3/whetherStartable',
    method: 'get'
  },
  // 未给--项目文档
  {// 上传文件
    name: 'uploadFile',
    url: baseUrl + '/use/file/v1/4/uploadFile',
    method: 'post'
  },
  { // 下载文件
    name: 'downloadFile',
    url: baseUrl + '/use/file/v1/5/downloadFile',
    method: 'get'
  },
  { //根据项目大类查询已上传附件
    name: 'queryAttachmentList',
    url: baseUrl + '/use/file/v1/3/queryAttachmentList',
    method: 'get'
  },
  { //根据业务单据类型查找附件类型
    name: 'queryAttachmentType',
    url: baseUrl + '/rms/project/businessAttachment/v1/3/queryAttachmentType',
    method: 'get'
  },
  {//数据字典
    name: 'dictValByCode',
    url: basicUrl + '/ext/dictionary/v1/3/v1/dictValByCode',
    method: 'get/params'
  },
  {//查询项目经理列表
    name: 'projectManagersByOrgCode',
    url: basicUrl + '/ext/projectManager/v1/3/v1/projectManagersByOrgCode',
    method: 'get'
  },
  {//查询专家列表
    name: 'projectExpertByOrgCode',
    url: basicUrl + '/ext/expert/v1/3/v1/experts/orgCode',
    method: 'get'
  },
  { // 立项表单审批退回后作废
    name: 'disapproveProject',
    url: projectApproveUrl + '/2/disapproveProject',
    method: 'POST'
  },
  //----------------变更流程服务start----------------------//
  {//查询项目状态
    name: 'checkProjectState',
    url: projectChangeUrl + '/3/checkProjectState',
    method: 'get'
  },
  {//查询变更单据是否允许提交--查询项目临时版本状态--判断是否可点击发起变更按钮
    name: 'isCanChange',
    url: projectChangeUrl + '/3/isApproveCanSubmit',
    method: 'get'
  },
  {//查询变更单据是否允许提交（不会抛出异常）--查询项目临时版本状态--判断项目信息页面是否提示发起变更流程
    name: 'isShowChangeTip',
    url: projectChangeUrl + '/3/isApproveCanSubmitNoException',
    method: 'get'
  },
  {//查询单据列表
    name: 'getChangeApproveList',
    url: projectChangeUrl + '/3/listApprove',
    method: 'get'
  },
  {//查询单据详情
    name: 'queryChangeApprove',
    url: projectChangeUrl + '/3/queryApprove',
    method: 'get'
  },
  {//查询单据变更详情
    name: 'queryChangeApproveDetail',
    url: projectChangeUrl + '/3/queryApproveDetail',
    method: 'get'
  },
  {//单据保存
    name: 'saveChangeApprove',
    url: projectChangeUrl + '/0/saveApprove',
    method: 'post'
  },
  {//单据提交
    name: 'submitChangeApprove',
    url: projectChangeUrl + '/0/submitApprove',
    method: 'post'
  },
  {//单据删除
    name: 'deleteChangeApprove',
    url: projectChangeUrl + '/0/deleteApprove',
    method: 'post'
  },
  {//单据审批
    name: 'changeProjectApprove',
    url: projectChangeUrl + '/0/approve',
    method: 'post'
  },
  {//单据重新提交
    name: 'resubmitChangeApprove',
    url: projectChangeUrl + '/2/resubmitApprove/',
    method: 'post'
  },
  { // 获取项目最新临时版本下项目信息
    name: 'getProjectTempLatestInfo',
    url: baseUrl + '/rms/project/projectTempVersion/v1/3/getProjectTempLatestInfo',
    method: 'get',
    config: {
      filters: []
    }
  },
  //----------------变更流程服务end----------------------//
  //----------------终止流程服务start----------------------//
  { // 获取终止流程列表
    name: 'getTerminateFlowList',
    url: rmsBaseUrl + '/projectApprove/v1/3/queryProjectApprove',
    method: 'get'
  },
  { // 终止流程详情【代办/已办】
    name: 'getTerminateDetail',
    url: rmsBaseUrl + '/projectStopApprove/v1/3/approve',
    method: 'get'
  },
  { // 保存终止流程
    name: 'saveTerminateFlow',
    url: rmsBaseUrl + '/projectStopApprove/v1/0/saveProjectApprove',
    method: 'post'
  },
  { // 作废终止流程
    name: 'cancellationTerminateFlow',
    url: rmsBaseUrl + '/projectStopApprove/v1/1/approve',
    method: 'post'
  },
  { // 终止流程-项目文档
    name: 'getAttachmentTypeList',
    url: rmsBaseUrl + '/businessAttachment/v1/3/queryAttachmentTypeList',
    method: 'get'
  },
  { // 终止流程-项目文档-上传
    name: 'uploadFile',
    url: rmsBaseUrl + '/zuul/rms/file/ext/file/v1/4/file',
    method: 'post'
  },
  { // 终止流程-项目文档-删除
    name: 'removeFile',
    url: rmsBaseUrl + '/businessAttachment/v1/1/deleteBusinessAttachment',
    method: 'get'
  },
  { // 终止流程-获取项目文档类型
    name: 'getFileType',
    url: rmsBaseUrl + '/businessAttachment/v1/3/queryAttachmentTypeList',
    method: 'get'
  },
  { // 查询项目是否可以发起终止流程
    name: 'whetherStartStop',
    url: rmsBaseUrl + '/projectStopApprove/v1/3/whetherStartable',
    method: 'get'
  },
  //----------------终止流程服务end----------------------//
  //----------------项目版本切换类start----------------------//
  { // 查询项目版本列表
    name: 'getProjectVersion',
    url: projectVersionUrl + '/3/getProjectVersion',
    method: 'get'
  },
  { // 通过projectCode获取默认展示的版本信息
    name: 'getRightVersionByProCode',
    url: projectVersionUrl + '/3/getRightVersionByProCode',
    method: 'get'
  },
  //----------------项目版本切换类end----------------------//
  //----------------研发包任务申请----------------------//
  { // 是显示发起任务申请按钮
    name: 'isShowTaskBtn',
    url: projectPackageUrl + '/3/checkUserPermissionNoException',
    method: 'get'
  },
  { // 研发包申请表单列表
    name: 'queryTaskList',
    url: projectPackageUrl + '/3/queryApproveList',
    method: 'get'
  },
  { // 研发包申请表单详情
    name: 'queryTaskDetail',
    url: projectPackageUrl + '/3/queryApproveDetail',
    method: 'get'
  },
  { // 预查询项目信息（项目预算信息）
    name: 'queryProjectInfoPre',
    url: projectPackageUrl + '/3/queryProjectInfoPre',
    method: 'get'
  },
  { // 研发包申请表单保存
    name: 'saveTask',
    url: projectPackageUrl + '/0/saveApprove',
    method: 'post'
  },
  { // 研发包申请表单保存完成信息
    name: 'saveTaskCompletion',
    url: projectPackageUrl + '/0/saveApproveCompletion',
    method: 'post'
  },
  { // 研发包申请表单提交
    name: 'submitTaskApply',
    url: projectPackageUrl + '/0/submitApprove',
    method: 'post'
  },
  { // 研发包申请表单删除（包含退回作废）
    name: 'deleteTaskApply',
    url: projectPackageUrl + '/1/deleteApprove',
    method: 'post'
  },
  { // 研发包申请表单审批（审批通过/驳回）
    name: 'submitTaskApprove',
    url: projectPackageUrl + '/2/approve',
    method: 'post'
  },
  { // 研发包申请表单重新提交（任务状态：申请审批中/验收审批中）
    name: 'resubmitTaskApprove',
    url: projectPackageUrl + '/2/resubmitApprove',
    method: 'post'
  },
  { // 查询项目是否可以发起研发包任务申请与当前用户权限
    name: 'checkProjectStateAndUserPermission',
    url: projectPackageUrl + '/3/checkProjectStateAndUserPermission',
    method: 'get'
  },
  //................集团批复计划创建接口...............//
  { // 查询项目计划
    name: 'planInfo',
    url: planCreate + '/3/info',
    method: 'post'
  },
  //----------------外部接口start----------------------//
  {//根据父级组织查询列表，无权限
    name: 'orgListByParentOrgCodeNoAuth',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/getOrgListByParentOrgCodeNoAuth',
    method: 'get'
  },
  {//根据父级组织查询列表，有权限
    name: 'orgListByParentOrgCode',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/orgListByParentOrgCode',
    method: 'get'
  },
  {//组织编码查询用户列表
    name: 'allUserPageByorgCode',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/allUserPageByorgCode',
    method: 'get'
  },
  {//组织编码查询用户列表
    name: 'allUserPageByorgCode2',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/allUserPageByorgCode2',
    method: 'get'
  },
  { // 获取省端独立域简称列表，57家一级公司
    name: 'getProvinceAbbr',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/provinceAbbr',
    method: 'get'
  },
  { // 根据orgCode获取组织详情信息(组织信息详情查询)
    name: 'orgInfoByOrgCode',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/orgInfoByOrgCode',
    method: 'get/params'
  },
  { // 根据公司编码查询公司的组织编码
    name: 'getOrgCodeByCompanyCode',
    url: baseUrl + '/rms/auth/ext/user/v1/3/v1/getOrgCodeByCompanyCode',
    method: 'get'
  },
  // ----------------通过fileCode查询sign信息---------------------------//
  { // 通过fileCode查询sign信息
    name: 'fileDetail',
    url: fileDetailUrl + '/v1/file',
    method: 'get/params'
  }
  //----------------外部接口end----------------------//
]

export default Http.createHttpServe(apiList)
