const routerMap = {
  name: '404',
  path: '/404',
  component: () => import('../src/main.vue'),
  meta: {
    title: '页面不存在'
  }
}

export default routerMap
