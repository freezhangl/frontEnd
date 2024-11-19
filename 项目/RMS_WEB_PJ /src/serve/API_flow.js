import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
// 基本路径定义已具体到模块及版本号
const baseUrl = getStore().getters['CONFIG/baseUrl']
const buttonListUrl = baseUrl + '/rms/flow/ext/processConfig/v1'
const processInstUrl = baseUrl + '/rms/flow/ext/processInstQuery/v1'
const processInstUrl1 = baseUrl + '/rms/flow/ext/processInst/v1'
const turntoUrl = baseUrl + '/rms/flow/ext/workItem/v1'
const getBusInfoUrl = baseUrl + '/rms/flow/ext/businessProcessInst/v1'
const getWorkItemUrl = baseUrl + '/rms/flow/ext/workItemQuery/v1'

const apiList = [
  { // 获取流程指定节点按钮配置
    name: 'getButtonList',
    url: buttonListUrl + '/3/v1/buttonList',
    method: 'get'
  },
  { // 查询主流程实例信息(根据processInstId查询)
    name: 'getProcessInstDetailById',
    url: processInstUrl + '/3/v1/getProcessInstDetailById',
    method: 'get/params'
  },
  { // 任务事项转办
    name: 'reassignWorkItem',
    url: turntoUrl + '/4/v1/reassignWorkItem',
    method: 'post'
  },
  { // 根据业务流水号查询业务流程实例信息
    name: 'getBusinessProcessInst',
    url: getBusInfoUrl + '/3/v1/getBusinessProcessInst',
    method: 'get/params'
  },
  { // 查询用户工作项详情
    name: 'getWorkItemDetail',
    url: getWorkItemUrl + '/3/v1/getWorkItemDetail',
    method: 'get/params'
  }
]
export default Http.createHttpServe(apiList)
