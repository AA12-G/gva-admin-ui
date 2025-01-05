import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue')
    },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/index.vue'),
          meta: {
            title: '仪表盘',
            icon: 'dashboard'
          }
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../views/users/index.vue'),
          meta: {
            title: '用户管理',
            icon: 'user'
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/settings/index.vue'),
          meta: {
            title: '系统设置',
            icon: 'setting'
          }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    next()
  } else {
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
