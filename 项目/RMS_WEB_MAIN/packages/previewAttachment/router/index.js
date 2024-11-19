const routerMap = {
  name: 'previewDoc',
  path: '/previewDoc',
  component: () => import('../src/main.vue'),
  meta: {
    title: '附件预览',
    hasPermission: true
  }
}

export default routerMap
