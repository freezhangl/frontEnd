import Http from '@lib/common/http'
import store from '@/store'

const baseUrl = store.getters['CONFIG/baseUrl']
const processConfig = '/rms/flow/ext/processConfig'
const commonApprovalOpinion = '/rms/flow/ext/commonApprovalOpinion'
const approvalRecord = '/rms/flow/ext/approvalRecord'
const processInst = '/rms/flow/ext/processInst'

const apiList = [
  { // 获取环节审批结果
    name: 'getApproveResultList',
    url: baseUrl + processInst + '/v1/3/v1/approveResultList',
    method: 'get',
    config: { loading: false }
  },
  { // 获取环节审批结果 合并其他会签至同意选项中
    name: 'getApproveResults',
    url: baseUrl + processInst + '/v1/3/v1/approveResults',
    method: 'get',
    config: { loading: false }
  },
  { // 获取退回操作button列表
    name: 'getBackButton',
    url: baseUrl + processConfig + '/v1/3/v1/backProcessList',
    method: 'get',
    config: { loading: false }
  },
  { // 获取下一环节列表
    name: 'getNextActivities',
    url: baseUrl + processInst + '/v1/3/v1/nextActivities',
    method: 'get',
    config: { loading: false }
  },
  { // 获取下一环节列表 结束并送阅知节点
    name: 'getNextActivitiesAndNotification',
    url: baseUrl + processInst + '/v1/3/v1/nextActivitiesAndNotification',
    method: 'get',
    config: { loading: false }
  },
  { // 提交获取下一环节列表
    name: 'getNextActivitiesByNum',
    url: baseUrl + processInst + '/v1/3/v1/nextActivitiesByNum',
    method: 'get/params',
    config: { loading: false }
  },
  { // 获取人员列表
    name: 'getNextPeople',
    url: baseUrl + processConfig + '/v1/3/v1/participantList',
    method: 'get',
    config: { loading: false }
  },
  { // 获取转办人员
    name: 'getReassignPeople',
    url: baseUrl + processConfig + '/v1/3/v1/reassignPeopleList',
    method: 'get',
    config: { loading: false }
  },
  { // 获取上一环节人员
    name: 'getPrePeople',
    url: baseUrl + processConfig + '/v1/3/v1/nextNodeParticipants',
    method: 'get',
    config: { loading: false }
  },
  { // 获取常用意见列表
    name: 'getOpinions',
    url: baseUrl + commonApprovalOpinion + '/v1/3/v1/getOpinions',
    method: 'get',
    config: { loading: false }
  },
  { // 新增常用意见
    name: 'addOpinion',
    url: baseUrl + commonApprovalOpinion + '/v1/0/v1/addOpinion',
    method: 'post',
    config: { loading: false }
  },
  { // 删除常用意见
    name: 'deleteOpinion',
    url: baseUrl + commonApprovalOpinion + '/v1/1/v1/deleteOpinion',
    method: 'post',
    config: { loading: false }
  },
  { // 查询临时意见
    name: 'getTempApprovals',
    url: baseUrl + approvalRecord + '/v1/3/v1/getTempApprovals',
    method: 'get',
    config: { loading: false }
  },
  { // 保存临时意见
    name: 'addTempRecord',
    url: baseUrl + approvalRecord + '/v1/0/v1/addTempRecord',
    method: 'post',
    config: { loading: false }
  },
  // 获取业务审批意见组件
  {
    name: 'getBusinessOpinions',
    url: baseUrl + approvalRecord + '/v1/3/v1/getBusinessOpinions',
    method: 'get',
    config: { loading: false }
  },
  { //根据组织编码查询该组织下的直属下级组织（参与人规则10懒加载专用）
    name: 'getOrgListByParentOrgCode',
    url: baseUrl + processConfig + '/v1/3/v1/orgListByParentOrgCode',
    method: 'get',
    config: { loading: false }
  },
  { //根据组织编码查询组织的主负责人（参与人规则10懒加载专用）
    name: 'peopleListByOrgCode',
    url: baseUrl + processConfig + '/v1/3/v1/peopleListByOrgCode',
    method: 'get',
    config: { loading: false }
  },
  { //根据组织编码查询该组织下的直属下级组织（参与人规则15懒加载专用）
    name: 'getOrgListByOrgCode',
    url: baseUrl + processConfig + '/v1/3/v1/orgListByOrgCode',
    method: 'get',
    config: { loading: false }
  }
]

export default Http.createHttpServe(apiList)
