
const layoutMain = {
  name: 'layoutMain',
  path: '/',
  component: () => import('../src/main'),
  redirect: '/home',
  meta: {
    description: '主布局'
  },
  children: []
}

//空白主路由，用于打开新页面时使用
const layoutBlank = {
  name: 'layoutBlank',
  path: '',
  component: () => import('../src/blank'),
  meta: {
    description: '空白布局'
  },
  children: []
}

export default { layoutMain, layoutBlank }
