const projectManageMap = {
  name: 'projectManageHome',
  path: '/projectManage',
  component: () => import('../src/main.vue'),
  meta: {
    title: '项目管理首页',
    breadTitle: '项目管理',
    isChannelHome: true
  }
}

export { projectManageMap }
