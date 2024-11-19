import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
const baseUrl = getStore().getters['CONFIG/baseUrl']
const milestoneFinishApplication = '/rms/milestone/milestoneFinishApplication/v1'
const milestoneInfoBase = '/rms/milestone/milestoneInfoBase/v1'
const milestoneLinkFile = '/rms/milestone/milestoneLinkFile/v1'

const apiList = [
  { // 获取里程碑完成流程列表
    name: 'getMilestoneList',
    url: baseUrl + milestoneFinishApplication + '/3/flowList',
    method: 'get'
  },
  { // 获取里程碑完成流程 zhang发起流程进入获取的详情
    name: 'getMilestoneCodeGet',
    url: baseUrl + milestoneInfoBase + '/3/milestoneCodeGet',
    method: 'get'
  },
  {
    // 里程碑基础和完成流程详情查询（新,发起流程查看详情时使用） zhang编辑进入获取的详情
    name: 'getUnionSearch',
    url: baseUrl + milestoneFinishApplication + '/3/unionSearch',
    method: 'get'
  },
  {
    // 里程碑完成成流程详情查询（新）zhang详情页面进入获取详情
    name: 'getMilestoneDetail',
    url: baseUrl + milestoneFinishApplication + '/3/flowDetail',
    method: 'get'
  },
  {
    // 里程碑流程详情查询-已办/待阅/已阅详情查询
    name: 'getMilesDetailByApprove',
    url: baseUrl + milestoneFinishApplication + '/3/finishInfo',
    method: 'get/params'
  },
  {
    // 里程碑完成-作废流程
    name: 'withdrawMilestoneProgress',
    url: baseUrl + milestoneFinishApplication + '/2/withdraw',
    method: 'post'
  },
  {
    // 里程碑完成申请代办提交（总接口）
    name: 'submitApprove',
    url: baseUrl + '/rms/milestone' + '/milestoneFlow/v1/2/submitApprove',
    method: 'post'
  },
  {
    // 重新提交
    name: 'resubmitWithParticipant',
    url: baseUrl + '/rms/milestone' + '/milestoneFlow/v1/4/resubmitWithParticipant',
    method: 'post'
  },
  {
    // 里程碑完成暂存-新增
    name: 'tempSaveMilestone',
    url: baseUrl + milestoneFinishApplication + '/0/tempSave',
    method: 'post'
  },
  {
    // 里程碑完成暂存-修改
    name: 'saveMilestone',
    url: baseUrl + milestoneFinishApplication + '/0/tempUpdate',
    method: 'post'
  },
  {
    // 里程碑暂存-修改
    name: 'tempUpdateMilestone',
    url: baseUrl + milestoneFinishApplication + '/2/tempUpdate',
    method: 'post'
  },
  {
    // 里程碑提交-修改
    name: 'updateMilestone',
    url: baseUrl + milestoneFinishApplication + '/2/update',
    method: 'post'
  },
  {
    // 里程碑查看流程详情
    name: 'getMilestoneFlowDetail',
    url: baseUrl + milestoneFinishApplication + '/3/flowDetail',
    method: 'get'
  },
  { // 获取关键里程碑列表
    name: 'getKeyMilestoneList',
    url: baseUrl + milestoneInfoBase + '/3/milestoneInfoLinkProject',
    method: 'get/params'
  },
  { // 删除关键里程碑附件
    name: 'delFile',
    url: baseUrl + milestoneLinkFile + '/1/file',
    method: 'post'
  },
  { // 提交新增或删除的附件
    name: 'submitFile',
    url: baseUrl + milestoneLinkFile + '/0/file',
    method: 'post'
  },
  { // 查询数据迁移附件
    name: 'flowFile',
    url: baseUrl + milestoneLinkFile + '/3/flowFile',
    method: 'get'
  },
  { //里程碑撤回
    name: 'rollBackProcessInstance',
    url: baseUrl + '/rms/milestone/milestoneFlow/v1/3/rallBackProcessInstance',
    method: 'get'
  }
]

export default Http.createHttpServe(apiList)
