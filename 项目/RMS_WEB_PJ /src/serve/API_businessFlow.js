import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
// 业务表单基础服务类----基本路径定义已具体到模块及版本号
const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project/groupProjectApprove/v1'
// 发起结项流程查询
const queryUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project'

const apiList = [
  { // 业务表单是否显示按钮
    name: 'isShowApproveButton',
    url: baseUrl + '/3/isShowApproveButton',
    method: 'get'
  },
  { // 业务表单发起前校验
    name: 'validateApprove',
    url: baseUrl + '/3/validateApprove',
    method: 'get'
  },
  { // 业务表单保存（新增/修改）
    name: 'saveApprove',
    url: baseUrl + '/0/saveApprove',
    method: 'post'
  },
  { // 业务表单提交
    name: 'submitApprove',
    url: baseUrl + '/0/submitApprove',
    method: 'post'
  },
  { // 业务表单重新提交
    name: 'resubmitApprove',
    url: baseUrl + '/2/resubmitApprove',
    method: 'post'
  },
  { // 预立项导入业务表单重新提交
    name: 'resubmitPreApprove',
    url: baseUrl + '/2/resubmitPreApprove',
    method: 'post'
  },
  { // 业务表单审批
    name: 'approve',
    url: baseUrl + '/2/approve',
    method: 'post'
  },
  { // 业务表单删除/作废
    name: 'deleteApprove',
    url: baseUrl + '/1/deleteApprove',
    method: 'post'
  },
  { // 业务表单列表
    name: 'getApproveList',
    url: baseUrl + '/3/getApproveList',
    method: 'get'
  },
  { // 业务表单详情
    name: 'queryApprove',
    url: baseUrl + '/3/queryApprove',
    method: 'get'
  },
  { // 系统对该委托函是否关联项目以及其关联项目是否已结项进行校验,'1'该委托函尚未关联项目,'2'该委托函所关联的项目尚未结项
    name: 'checkRelatedEntrustmentLetter',
    url: baseUrl + '/3/checkRelatedEntrustmentLetter',
    method: 'get'
  },
  {
    name: 'createUndertakeProject',
    url: baseUrl + '/groupProjectApprove/v1/1/createUndertakeProject',
    method: 'get'
  },
  { // 委托函表单完成填写完成情况
    name: 'saveEntrustLetterCompletion',
    url: baseUrl + '/0/saveEntrustLetterCompletion',
    method: 'post'
  },
  { // 委托函表单打分
    name: 'saveEntrustLetterEvaluate',
    url: baseUrl + '/0/saveEntrustLetterEvaluate',
    method: 'post'
  },
  { // 根据项目编码查询最新的流程单据详情
    name: 'queryApprovePre',
    url: baseUrl + '/3/queryApprovePre',
    method: 'get'
  },
  { // 业务表单（变更详情）
    name: 'queryChangeApproveProjectInfoComparison',
    url: baseUrl + '/3/queryChangeApproveProjectInfoComparison',
    method: 'get'
  },
  { // 统筹-结项流程-打分评价 - 结项流程打分评价查询
    name: 'queryFinishScore',
    url: baseUrl + '/3/queryFinishScore',
    method: 'get'
  },
  { // 统筹-结项流程-打分评价 - 结项流程审批打分评价查询
    name: 'queryApproveFinishScore',
    url: baseUrl + '/3/queryApproveFinishScore',
    method: 'get'
  },
  { // 统筹-结项流程-打分评价 - 结项流程打分评价
    name: 'addFinishScore',
    url: baseUrl + '/0/addFinishScore',
    method: 'post'
  },
  { // 统筹-结项流程-发起结项流程 - 有无未上传附件的成果
    name: 'isAchievementHaveFile',
    url: queryUrl + '/document/v1/3/isAchievementHaveFile',
    method: 'get'
  },
  { // 判断是否是作废数据并且有附件
    name: 'checkVoidAttachment',
    url: baseUrl + '/3/checkVoidAttachment',
    method: 'get'
  },
  { // 撤回流程
    name: 'rollBackProcessInstance',
    url: baseUrl + '/1/rallBackProcessInstance',
    method: 'get'
  }
]
export default Http.createHttpServe(apiList)
