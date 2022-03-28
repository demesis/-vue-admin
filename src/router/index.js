import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/product',
    name: 'Product',
    component: Layout,
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/product/brand'),
        meta: { title: '品牌管理' }
      },
    {
      path: 'attr',
      name: 'Attr',
      component: () => import('@/views/product/attr'),
      meta: { title: '平台属性管理' }
    },
    {
      path: 'sku',
      name: 'Sku',
      component: () => import('@/views/product/sku'),
      meta: { title: 'Sku管理' }
    }
  ]
  },



  

  // 404
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // 切换路由回到顶部
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
