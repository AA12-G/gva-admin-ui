import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Layout from '@/layout/index.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          icon: 'DashboardOutlined'
        }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/users/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'UserOutlined'
        }
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('../views/roles/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'TeamOutlined'
        }
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: () => import('../views/permissions/index.vue'),
        meta: {
          title: '权限管理',
          icon: 'SafetyCertificateOutlined'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore()
  
  // 如果是访问登录页且已登录，重定向到仪表盘
  if (to.path === '/login' && token) {
    next('/admin/dashboard')
    return
  }
  
  // 如果不是登录页且未登录，重定向到登录页
  if (to.path !== '/login' && !token) {
    next('/login')
    return
  }
  
  // 如果已登录但没有用户信息，获取用户信息
  if (token && !userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.warn('获取用户信息失败')
      localStorage.removeItem('token')
      next('/login')
      return
    }
  }
  
  // 开发阶段直接放行，不检查权限
  next()
})

export default router
