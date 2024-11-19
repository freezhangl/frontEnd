import Http from '@lib/common/http'
import store from '@/store'

const baseUrl = store.getters['CONFIG/baseUrl']
const approvalRecord = '/rms/flow/ext/approvalRecord'
const processInstQuery = '/rms/flow/ext/processInstQuery'

const apiList = [
  // 查询流程跟踪url
  {
    name: 'getTraceUrl',
    url: baseUrl + processInstQuery + '/v1/3/v1/getProcessDiagramUrl',
    method: 'get',
    config: { loading: false }
  },
  // 获取流程审批记录列表
  {
    name: 'getApprovals',
    url: baseUrl + approvalRecord + '/v1/3/v1/businessApprovals',
    method: 'get',
    config: { loading: false }
  },
  // 获取当前处理环节
  {
    name: 'getBusinessProcessInst',
    url: baseUrl + '/rms/flow/ext/businessProcessInst/v1/3/v1/getBusinessProcessInst',
    method: 'get/params',
    config: { loading: false }
  }
]

export default Http.createHttpServe(apiList)
