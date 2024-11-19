import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
// import filter from '../../filters'
import ElementUI from 'element-ui'
// import echarts from 'echarts'
import '../../../packages/common/util/dialogDrag'
// import 'element-ui/lib/theme-chalk/index.css'
// import '@theme/index.css'
import '../../assets/customTheme/blue/index.css'
import '../../assets/customTheme/green/index.css'
import '../../assets/customTheme/red/index.css'
import '../../assets/customTheme/purple/index.css'
import '../../assets/scss/base.scss'
// import '../../assets/scss/variable.scss'

import '../../assets/svgFont/svgfont.css'

import http from '@lib/common/http' //http接口请求配置
import '@lib/common/selfComponents' //自定义组件库
import globalMethods from '@lib/common/util/globalMethods'//全局方法
// 引入模块包 -- 配置模块
import { init as initSF, install as installSF } from '@rms/rms-systemclient'
import { init as initPJ } from '@rms/rms-pjclient'
import { init as initPLAN } from '@rms/rms-plan'
import { init as initBS } from '@rms/rms-bsconfig'
import { init as initWT } from '@rms/rms-wktime'
import { init as initHome } from '@rms/rms-homeclient'
import { init as initForm } from '@rms/rms-formclient'

let echarts = require('echarts/lib/echarts')

// 引入折线图等组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')

// 引入提示框和title组件，图例等
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')
require('echarts/lib/component/dataZoom')

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Object.keys(globalMethods)
  .forEach(key => {
    Vue.prototype[`$${key}`] = globalMethods[key] //挂载全局方法到vue原型上
  })
// 这里对各个模块注入store和router实例 -- 配置模块
initSF(store, router, http) //系统功能模块
initPJ(store, router, http) //项目全生命周期
initPLAN(store, router, http) //研发计划
initBS(store, router, http) //项目基础模块
initWT(store, router, http) // 工时管理模块
initHome(store, router, http) //首页
initForm(store, router, http) //动态表单
Vue.use(installSF)
// Vue.use(installPL)

// Object.keys(selfComponents)
//   .forEach(key => {
//     Vue.use(selfComponents[key])
//   })

const app = new Vue({
  router,
  store,
  render: h => h(App)
})
app.$mount('#app')
