import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
// 基本路径定义已具体到模块及版本号
const baseUrl = getStore().getters['CONFIG/baseUrl']
const projectImportUrl = baseUrl + '/rms/project/groupPreProjectApproveController/v1' //项目导入查询

const apiList = [
  // 预立项项目导入列表
  {
    name: 'preProjectApproveList',
    url: projectImportUrl + '/3/queryProjectPreApproveImportList',
    method: 'get'
  },
  // 导入预立项项目
  {
    name: 'importPreProjectApprove',
    url: projectImportUrl + '/0/importPreProjectApprove',
    method: 'get'
  },
  // 预立项导入审批通过
  {
    name: 'preApprove',
    url: projectImportUrl + '/2/preApprove',
    method: 'get'
  },
  // 预立项导入表单审批退回后作废
  {
    name: 'deleteApprove',
    url: projectImportUrl + '/1/deleteProjectPreApproveImport',
    method: 'post'
  },
  // 批量导入详情
  {
    name: 'queryProjectPreApproveImportDetails',
    url: projectImportUrl + '/3/queryProjectPreApproveImportDetails',
    method: 'get'
  },
  // 批量导入审批保存
  {
    name: 'savePreProjectApprove',
    url: projectImportUrl + '/0/savePreProjectApprove',
    method: 'post'
  }]
export default Http.createHttpServe(apiList)
