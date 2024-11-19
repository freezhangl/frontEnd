const HomeMap = {
  name: 'home',
  path: '/home',
  component: () => import('../src/main.vue'),
  meta: {
    title: '集中化研发项目管理系统-首页',
    isChannelHome: true
  }
}

const FuncRouterMap = [
  {
    name: 'allCommonFunc',
    path: '/home/allCommonFunc',
    component: () => import('../src/allCommonFunc.vue'),
    meta: {
      title: '我的全部常用功能',
      hasPermission: true
    }
  },
  {
    name: 'importantNotice',
    path: '/home/importantNotice',
    component: () => import('../src/importantNotice.vue'),
    meta: {
      title: '系统通知',
      hasPermission: true,
      breadTitle: '系统通知' //需要展示通知的tab页签
    }
  }
]

export { HomeMap, FuncRouterMap }
