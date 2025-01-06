import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue')
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
            icon: 'dashboard',
            code: 'system:dashboard'
          }
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../views/users/index.vue'),
          meta: {
            title: '用户管理',
            icon: 'user',
            code: 'system:user'
          }
        },
        {
          path: 'roles',
          name: 'roles',
          component: () => import('../views/roles/index.vue'),
          meta: {
            title: '角色管理',
            icon: 'team',
            code: 'system:role'
          }
        },
        {
          path: 'permissions',
          name: 'permissions',
          component: () => import('../views/permissions/index.vue'),
          meta: {
            title: '权限管理',
            icon: 'safety',
            code: 'system:permission'
          }
        },
        {
          path: 'logs',
          name: 'logs',
          component: () => import('../views/logs/index.vue'),
          meta: {
            title: '操作日志',
            icon: 'file',
            code: 'system:log'
          }
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/profile/index.vue'),
          meta: {
            title: '个人中心',
            icon: 'user',
            hidden: true
          }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/settings/index.vue'),
          meta: {
            title: '系统设置',
            icon: 'setting',
            code: 'system:setting'
          }
        }
      ]
    }
  ]
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
      message.error('获取用户信息失败')
      localStorage.removeItem('token')
      next('/login')
      return
    }
  }
  
  // 检查权限（除了个人中心页面）
  const requiredCode = to.meta?.code
  if (requiredCode && !userStore.hasPermission(requiredCode)) {
    message.error('没有访问权限')
    next('/admin/dashboard')
    return
  }
  
  next()
})

export default router
