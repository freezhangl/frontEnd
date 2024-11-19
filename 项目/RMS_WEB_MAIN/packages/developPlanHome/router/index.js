const developPlanMap = {
  name: 'developPlanHome',
  path: '/developPlan',
  component: () => import('../src/main.vue'),
  meta: {
    title: '研发计划首页',
    breadTitle: '研发计划',
    isChannelHome: true
  }
}

export { developPlanMap }
