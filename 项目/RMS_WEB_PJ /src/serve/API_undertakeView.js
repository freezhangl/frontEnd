import { getHttp } from '@/serve'
import { getStore } from '@/store'
const Http = getHttp()
// const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/api/rms/worktime'
const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project'
const basicUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/basic'

const apiList = [
  {//数据字典s
    name: 'dictValByCode',
    url: basicUrl + '/ext/dictionary/v1/3/v1/dictValByCode',
    method: 'get/params'
  },
  { // 最新已生效版本承担单位查询-非一般支撑包
    name: 'lastVerProjectCompanyList',
    url: baseUrl + '/sUndertakeView/v1/3/lastVerProjectCompany',
    method: 'get'
  },
  { // 项目预算及执行信息-非一般支撑包
    name: 'sProjectBudgetExecutionInforList',
    url: baseUrl + '/sUndertakeView/v1/3/projectBudgetExecutionInforList',
    method: 'get'
  },
  { // 实际成本拆分查询-非一般支撑包
    name: 'actualCostSplitList',
    url: baseUrl + '/sUndertakeView/v1/3/actualCostSplitList',
    method: 'get'
  },
  {//承担单位项目列表-非一般支撑包
    name: 'sUndertakeList',
    url: baseUrl + '/sUndertakeView/v1/3/undertakeList',
    method: 'get'
  },
  {//项目预算及执行信息-一般支撑包
    name: 'gProjectBudgetExecutionInforList',
    url: baseUrl + '/gUndertakeView/v1/3/projectBudgetExecutionInforList',
    method: 'get'
  },
  {//承担单位项目列表-一般支撑包
    name: 'gUndertakeList',
    url: baseUrl + '/gUndertakeView/v1/3/undertakeList',
    method: 'get'
  }
]
export default Http.createHttpServe(apiList)
