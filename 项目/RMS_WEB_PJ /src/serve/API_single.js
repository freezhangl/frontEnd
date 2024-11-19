import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()

const baseUrl = getStore().getters['CONFIG/baseUrl']
const projectChangeUrl = baseUrl + '/rms/project/projectChange/v1' //变更流程服务
const projectPackageUrl = baseUrl + '/rms/project/projectApprovePackageTask/v1' //变更流程服务
const planCreate = baseUrl + '/rms/project/projectPlan/v1' // 集团批复计划创建
const projectAchievementUrl = baseUrl + '/rms/project/businessAttachment/v1' // 项目成果服务类

// 按计划创建
const savePath = {
  url: planCreate + '/0/info' //边锋流程单据删除
}

//接口地址
const apiPath = {
  deleteChangeApproveUrl: projectChangeUrl + '/1/deleteApprove' //边锋流程单据删除
}

// 申请删除
const delPath = {
  deleteChangeApproveUrl: projectPackageUrl + '/1/deleteApprove' //边锋流程单据删除
}

export default {
  deleteChangeApprove (params) {
    return Http.post(apiPath.deleteChangeApproveUrl + '/' + params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  deletePackageTask (params) {
    return Http.post(delPath.deleteChangeApproveUrl + '/' + params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  savePlan (params) {
    return Http.post(savePath.url + '/' + params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  // 带出作废附件的情况下，不保存单据直接关闭表单时删除带出的附件
  deleteBusinessAttachment (params) {
    return Http.post(projectAchievementUrl + '/1/deleteBusinessAttachmentByApproveNo/' + params)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}
