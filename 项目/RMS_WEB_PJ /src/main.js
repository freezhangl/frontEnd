// 这里需要手动配置一下webpack的publicPath，因为library模式下不会构建中的不会起作用
// import 'core-js'
import './config/publicPath'
import projectLifeMap, { setRouter } from './router'
import projectLifeStore from './store'
import { setStore } from '@/store'
import { setHttp } from '@/serve'

//这里导出得是初始化得配置项，并不是实例
export const router = projectLifeMap
export const store = projectLifeStore
const packageJSon = require('../package.json')

//这里初始函数，由主工程注入初始化好得实例.
export function init (storeInst, routerInst, httpInst) {
  setStore(storeInst)
  setRouter(routerInst)
  setHttp(httpInst)
  console.log(`load module:${packageJSon.name}@${packageJSon.version}`)
}
