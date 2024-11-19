import TASKMANAGE from './modules/taskManage.module' //任务管理VUEX

export default {
  TASKMANAGE
}

let store = null
// 这里传出的来自root仓库的store的实例
export function getStore () {
  if (!store) {
    return null
  }
  return store
}

export function setStore (storeIns) {
  store = storeIns
}
