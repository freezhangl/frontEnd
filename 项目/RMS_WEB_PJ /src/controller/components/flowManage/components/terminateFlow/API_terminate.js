import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
const baseUrl = getStore().getters['CONFIG/baseUrl']
const projectApproveUrl = baseUrl + '/rms/project/projectApprove/v1'
const terminateUrl = baseUrl + '/rms/project/projectStopApprove2/v1'
const attachmentUrl = baseUrl + '/rms/project/businessAttachment/v1'

const apiList = [
  { // 获取终止申请id
    name: 'getApproveId',
    url: projectApproveUrl + '/2/getApproveId',
    method: 'get'
  },
  { // 发起终止按钮展示
    name: 'isAvailable',
    url: terminateUrl + '/3/isAvailable',
    method: 'get'
  },
  { // 发起终止流程校验
    name: 'whetherStartable',
    url: terminateUrl + '/3/whetherStartable',
    method: 'get'
  },
  { // 终止表单保存
    name: 'saveTerminate',
    url: terminateUrl + '/0/saveProjectApprove',
    method: 'post'
  },
  { // 根据业务单据类型查找附件类型
    name: 'queryAttachmentType',
    url: attachmentUrl + '/3/queryAttachmentType',
    method: 'get'
  },
  { // 查询终止流程列表
    name: 'queryTermList',
    url: terminateUrl + '/3/queryApprove',
    method: 'get'
  },
  { // 查询终止流程表单详情
    name: 'queryTermDetail',
    url: terminateUrl + '/3/info',
    method: 'get'
  },
  { // 终止表单废弃
    name: 'deleteTerminate',
    url: terminateUrl + '/1/deleteApprove',
    method: 'get'
  },
  { // 终止表单提交
    name: 'submitTerminate',
    url: terminateUrl + '/0/submitProjectApprove',
    method: 'post'
  },
  { // 查询最新正式版本的项目信息
    name: 'latestProjectInfo',
    url: terminateUrl + '/3/latestProjectInfo',
    method: 'get'
  },
  { // 单据重新提交
    name: 'resubmitTerminate',
    url: terminateUrl + '/4/resubmitWithParticipant',
    method: 'post'
  }
]

export default Http.createHttpServe(apiList)
