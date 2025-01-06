import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user'
import type { LoginResult } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<LoginResult['user'] | null>(null)
  // 临时添加所有权限，实际项目中应该从后端获取
  const permissions = ref<string[]>([
    'system:dashboard',
    'system:user',
    'system:role',
    'system:permission',
    'system:log',
    'system:setting'
  ])
  
  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      userInfo.value = res.user
    } catch (error) {
      console.error('获取用户信息失败:', error)
      userInfo.value = null
      throw error
    }
  }

  function hasPermission(code: string): boolean {
    return permissions.value.includes(code)
  }

  function setUserInfo(user: LoginResult['user']) {
    userInfo.value = user
  }

  function clearUserInfo() {
    userInfo.value = null
  }

  return {
    userInfo,
    permissions,
    setUserInfo,
    fetchUserInfo,
    clearUserInfo,
    hasPermission
  }
}) 