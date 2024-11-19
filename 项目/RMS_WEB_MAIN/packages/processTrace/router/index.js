const routerMap = {
  name: 'processTrace',
  path: '/processTrace',
  component: () => import('../src/main.vue'),
  meta: {
    title: '流程跟踪'
  }
}

export default routerMap
