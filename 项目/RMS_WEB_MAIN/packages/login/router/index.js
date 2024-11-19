// import main from '../src/main.vue'

const routerMap = {
  name: 'login',
  path: '/login',
  component: () => import('../src/main.vue'),
  meta: {
    title: '集中化研发项目管理系统-登录'
  }
}

export default routerMap
