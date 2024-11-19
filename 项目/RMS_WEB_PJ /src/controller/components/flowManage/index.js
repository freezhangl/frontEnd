import FlowManage from './src/main'

FlowManage.install = function (Vue) {
  Vue.component(FlowManage.name, FlowManage)
}

export default FlowManage
