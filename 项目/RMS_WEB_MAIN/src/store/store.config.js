import GlobalStore from '@lib/common/global' //全局状态
import HomeStore from '@lib/home/store' //首页的store
import MENU from '@lib/layout/store'
const modulesMap = {
  ...GlobalStore,
  ...HomeStore,
  ...MENU
}

export default modulesMap
