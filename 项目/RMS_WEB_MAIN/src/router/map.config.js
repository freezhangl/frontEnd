//按需引入需要的模块
import { concat } from 'lodash'//合并数组
import LoginMap from '@lib/login/router' //登录
import LayoutMap from '@lib/layout/router' //布局
import { HomeMap, FuncRouterMap } from '@lib/home/router' //首页
import { developPlanMap } from '@lib/developPlanHome/router' //研发计划首页
import { projectManageMap } from '@lib/projectManageHome/router' //项目管理首页
import NotFound from '@lib/notFound/router' //404页面
import Refresh from '@lib/refresh/router' //辅助刷新页面
import ProcessTrace from '@lib/processTrace/router' //流程跟踪
import PreviewAttachment from '@lib/previewAttachment/router' //附件预览页面
// 这里从业务包中取出业务包的路由进行配置 -- 配置模块
import * as systemFunction from '@rms/rms-systemclient'
import * as projectLife from '@rms/rms-pjclient'
import * as plan from '@rms/rms-plan'
import * as basicConfig from '@rms/rms-bsconfig'
import * as workTime from '@rms/rms-wktime'
import * as home from '@rms/rms-homeclient'
import * as form from '@rms/rms-formclient'
//挂载到主布局上的路由 -- 配置模块
// console.log(systemFunction)
// console.log(projectLife)
LayoutMap.layoutMain.children = concat(
  HomeMap,
  FuncRouterMap,
  developPlanMap,
  projectManageMap,
  systemFunction.router.inRouterMap,
  projectLife.router.inRouterMap,
  plan.router.inRouterMap,
  basicConfig.router.inRouterMap,
  workTime.router.inRouterMap,
  home.router.inRouterMap,
  form.router.inRouterMap)
//  挂载到空白布局上的路由 -- 配置模块
LayoutMap.layoutBlank.children = concat(
  systemFunction.router.outRouterMap,
  projectLife.router.outRouterMap,
  plan.router.outRouterMap,
  basicConfig.router.outRouterMap,
  workTime.router.outRouterMap,
  home.router.outRouterMap,
  form.router.outRouterMap)
//路由定义
const routerMap = [
  LoginMap,
  LayoutMap.layoutMain,
  LayoutMap.layoutBlank,
  NotFound,
  Refresh,
  ProcessTrace,
  PreviewAttachment,
  {
    path: '*',
    redirect: {
      path: '/404'
    }
  }
]
console.log(routerMap, '就法第三季')
export default routerMap
