import { getHttp } from '@/serve'
import { getStore } from '@/store'

const Http = getHttp()
// 业务表单基础服务类----基本路径定义已具体到模块及版本号
const baseUrl = getStore().getters['CONFIG/baseUrl'] + '/rms/project'

const apiList = [
  { //获取列表
    name: 'queryProductInfoConfiguration',
    url: baseUrl + '/groupProductInfoConfiguration/v1/3/queryProductInfoConfiguration',
    method: 'get'
  },
  { //新增产品信息
    name: 'addProductInfoConfiguration',
    url: baseUrl + '/groupProductInfoConfiguration/v1/0/addProductInfoConfiguration',
    method: 'post'
  },
  { //启用或关闭产品信息
    name: 'onAndOffProductInfoConfiguration',
    url: baseUrl + '/groupProductInfoConfiguration/v1/2/onAndOffProductInfoConfiguration',
    method: 'post'
  },
  { //根据条件查询
    name: 'queryProductInfoByCondition',
    url: baseUrl + '/groupProductInfoConfiguration/v1/3/queryProductInfoByCondition',
    method: 'get'
  }
]
export default Http.createHttpServe(apiList)
