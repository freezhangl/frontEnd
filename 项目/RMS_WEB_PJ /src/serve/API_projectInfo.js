import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
// const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/system/calendar'
const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project'
const basicUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/basic'
const newBase = getStore().getters['CONFIG/baseUrl'] + '/rms/project'
const worktimeBase = getStore().getters['CONFIG/baseUrl'] + '/rms/worktime'
const worktime = getStore().getters['CONFIG/baseUrl'] + '/rms/project'
const groupPlanBase = getStore().getters['CONFIG/baseUrl'] + '/rms/project'
// const baseUrl = '/api/rms/project'
// const basicUrl = '/yd/rms/basic'
// const newBase = '/api/rms/project'
// // const worktimeBase = '/api/rms/worktime'
// const worktimeBase = '/yd/rms/worktime'
// const worktime = '/api/rms/project'

const apiList = [
  {//正式版本项目信息查询
    name: 'getLastestProjectByProjectCode',
    url: newBase + '/projectInfo/v1/3/queryEffectiveProjectInfo',
    method: 'get/params'
  },
  {
    //里程碑是否显示
    name: 'isShowMilestone',
    url: baseUrl + '/projectBase/v1/3/isShowMilestones',
    method: 'get'
  },
  {
    // 用户项目权限校验
    name: 'verificationPermission',
    url: baseUrl + '/projectBase/v1/3/verificationPermission',
    method: 'post'
  },
  {
    // 查询表单列表
    name: 'queryProjectApprove',
    url: baseUrl + '/projectBase/v1/3/queryProjectApprove',
    method: 'get'
  },
  {//编辑页面的保存
    name: 'saveProject',
    url: baseUrl + '/projectBase/v1/0/saveProject',
    method: 'post'
  },
  {//删除 项目
    name: 'deleteInfo',
    url: baseUrl + '/projectBase/v1/2/deleteProject',
    method: 'get/params'
    // method: 'post'
  },
  {//新增里程碑
    name: 'addMileStoneInfo',
    url: baseUrl + '/projectBase/v1/0/addMileStoneBaseInfo',
    method: 'post'
  },
  { // 编辑里程碑
    name: 'updateMileStoneInfo',
    url: baseUrl + '/projectBase/v1/1/updateMileStoneBaseInfo',
    method: 'post'
  },
  { //项目基本信息编辑
    name: 'updateBaseInfo',
    url: newBase + '/projectBaseInfo/v1/0/saveProjectBaseInfo',
    method: 'post'
  },
  {//成本编辑
    name: 'updateCostBudget',
    url: baseUrl + '/projectBase/v1/1/updateCostBudget',
    method: 'post'
  },
  //项目预期成果信息编辑
  {
    name: 'projectExpectResultInfoEdit',
    // eslint-disable-next-line no-irregular-whitespace
    url: baseUrl + '/projectAchievement/v1/1/updateProjectAchievement',
    // eslint-disable-next-line no-irregular-whitespace
    method: 'post'
  },
  //项目基本信息编辑
  {
    name: 'projectBasicInfoEdit',
    // eslint-disable-next-line no-irregular-whitespace
    url: baseUrl + '/projectBase/v1/1/updateProjectBaseInfo',
    method: 'post'
  },
  //项目人员信息编辑
  {
    name: 'projectTeamEdit',
    // eslint-disable-next-line no-irregular-whitespace
    url: baseUrl + '/projectBase/v1/0/addProjectMember',
    method: 'post'
  },
  {//新增成果
    name: 'addResult',
    url: baseUrl + '/projectAchievement/v1/0/addProjectAchievement',
    method: 'post'
  },
  {//项目预期成果删除
    name: 'deleteResult',
    url: baseUrl + '/projectBase/v1/2/deleteAchievement',
    method: 'post'
  },
  {//里程碑删除
    name: 'deleteMileStoneBaseInfo',
    url: baseUrl + '/projectBase/v1/2/deleteMileStoneBaseInfo',
    method: 'post'
  },
  {//初始化研究任务与预期成果table数据
    name: 'getTaskAndResultTabledata',
    url: baseUrl + '/projectQuery/v1/3/queryTemporaryProjectInfoByVersion',
    method: 'get'
  },
  {//项目列表
    name: 'myProjectList',
    url: baseUrl + '/projectQuery/v1/3/queryProjects',
    method: 'get'
  },
  {//创建项目
    name: 'addMyProject',
    url: baseUrl + '/projectBase/v1/0/addProject',
    method: 'post'
  },
  {//项目不同身份人员添加功能--蔡
    name: 'addProjectMembers',
    url: baseUrl + '/projectBase/v1/3/queryProjectMemberRole',
    method: 'get'
  },
  {//添加项目人员列表-吴
    name: 'getProjectMembers',
    // url: baseUrl + '/projectBase/v1/0/projectMemberList',
    url: baseUrl + '/use/v1/3/userList',
    method: 'get'
  },
  {//添加项目人员列表-吴
    name: 'queryProjectMembers',
    url: baseUrl + '/projectQuery/v1/3/queryProjectMembers',
    method: 'get'
  },
  {//获取最新成果
    name: 'queryLastAchievement',
    url: baseUrl + '/projectAchievement/v1/3/queryLastAchievementPage',
    method: 'get'
  },
  {//上传文件
    name: 'uploadFile',
    url: baseUrl + '/use/file/v1/4/uploadFile',
    method: 'post'
  },
  {//下载文件
    name: 'downloadFile',
    url: baseUrl + '/use/file/v1/5/downloadFile',
    method: 'get'
  },
  {//文件删除
    name: 'deleteAttachment',
    url: baseUrl + '/use/file/v1/2/deleteAttachment',
    method: 'get'
  },
  {//根据项目大类查询已上传附件
    name: 'queryAttachmentList',
    url: baseUrl + '/use/file/v1/3/queryAttachmentList',
    method: 'get'
  },
  {//根据业务单据类型查找附件类型
    name: 'queryAttachmentType',
    url: baseUrl + '/use/file/v1/3/queryAttachmentType',
    method: 'get'
  },
  {//立项保存
    name: 'saveProjectApprove',
    url: baseUrl + '/projectApprove/v1/0/saveProjectApprove',
    method: 'post'
  },
  {//立项作废
    name: 'deleteProjectApprove',
    url: baseUrl + '/projectApprove/v1/1/deleteProjectApprove',
    method: 'get/params'
  },
  {//获取id
    name: 'getApproveId',
    url: baseUrl + '/projectApprove/v1//2/getApproveId',
    method: 'get'
  },
  {//数据字典
    name: 'dictValByCode',
    url: basicUrl + '/ext/dictionary/v1/3/v1/dictValByCode',
    method: 'get/params'
  },
  {//获取项目编码
    name: 'getProjectCode',
    url: newBase + '/projectBaseInfo/v1/3/projectCode',
    method: 'get'
  },
  {//删除项目信息
    name: 'deleteProject',
    url: newBase + '/projectInfo/v1/2/deleteProject',
    method: 'get/params'
  },
  {//保存项目信息(全量)
    name: 'saveProject',
    url: newBase + '/projectInfo/v1/0/saveProject',
    method: 'post'
  },
  /*========================================迭代二=========================================*/
  {//基线信息-自立项目（获取选择项）
    name: 'baseLineGetOption',
    url: groupPlanBase + '/baseLine/v1/3/v1/selectBaseLine',
    method: 'get'
  },
  {//基线信息-自立项目（保存选择项）
    name: 'baseLineSaveOption',
    url: groupPlanBase + '/baseLine/v1/0/v1/saveBaseLine',
    method: 'post'
  },
  {//项目文档-可
    name: 'projectFileList',
    url: newBase + '/document/v1/3/v1/documentationList',
    method: 'get'
  },
  {//项目文档---成果文档-可
    name: 'resultFileList',
    url: newBase + '/projectAchievement/v1/3/v1/queryAchievementAttachmentList',
    method: 'get'
  },
  {//成果文档---上传-可
    name: 'resultUploadFile',
    url: newBase + '/projectAchievement/v1/4/v1/uploadAchievementAttachment',
    method: 'post'
  },
  {//成果文档---删除
    name: 'deleteFile',
    url: newBase + '/projectAchievement/v1/2/v1/deleteProjectAttachment',
    method: 'post'
  },
  {//任务进展
    name: 'taskProcessList',
    url: newBase + '/projectProgress/v1/3/v1/projectProgressList',
    method: 'get'
  },
  {//任务进展添加
    name: 'addTaskProcess',
    url: newBase + '/projectProgress/v1/0/v1/addProjectProgress',
    method: 'post'
  },
  {//同步成本信息
    name: 'syncCost',
    url: newBase + '/projectCost/v1/3/v1/generateCostDetail',
    method: 'get'
  },
  {//获取成本信息
    name: 'getCostMsg',
    url: newBase + '/projectCost/v1/3/v1/queryProjectCosts',
    method: 'get'
  },
  { // 根据项目编号查询已确认工时-001
    name: 'getConfirmedWorkTime',
    url: worktimeBase + '/ext/worktime/v1/3/v1/getConfirmedWorkTime',
    method: 'post'
  },
  { // 根据项目编号查询已确认工时-0010
    name: 'getConfirmedWorkTime1',
    url: baseUrl + '/group/projectTime/v1/3/getConfirmedWorkTime',
    method: 'post'
  },
  // { // 根据项目编号查询已确认工时-新修改
  //   name: 'getConfirmedWorkTimeByCodeAndYear',
  //   url: worktimeBase + '/ext/worktime/v1/3/v1/getConfirmedWorkTimeByCodeAndYear',
  //   method: 'post'
  // },
  { // 查询指定项目下项目人员的工时填报总计-002
    name: 'getProjectMemberWorkTimeInfo',
    url: worktimeBase + '/ext/worktime/v1/3/v1/getProjectMemberWorkTimeInfo',
    method: 'get'
  },
  { // 查询指定项目下项目人员的工时填报总计-0020
    name: 'getProjectMemberWorkTimeInfo1',
    url: baseUrl + '/group/projectTime/v1/3/getProjectMemberWorkTimeInfo',
    method: 'get'
  },
  { // 根据项目编号查询该项目下是否存在未确认工时-003
    name: 'existUnConfimedWorkTime',
    url: worktimeBase + '/ext/worktime/v1/3/v1/existUnConfimedWorkTime',
    method: 'get'
  },
  { // 根据项目编号查询该项目所属公司编码
    name: 'getProjectCompanyCode',
    url: worktime + '/costBudget/v1/3/getCompanyCode',
    method: 'get'
  },
  { // 根据项目编号查询计划总工时
    name: 'getPlanOverallManHour',
    url: worktime + '/costBudget/v1/3/getPlanOverallManHour',
    method: 'get'
  },
  {
    name: 'getFile',
    url: baseUrl + '/zuul/rms/file/ext/file/v1/4/v1/file',
    method: 'post'
  }
  /*========================================迭代二=========================================*/
]

export default Http.createHttpServe(apiList)
