import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user'
import type { LoginResult } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<LoginResult['user'] | null>(null)
  
  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      console.log('获取到的用户信息:', res)
      userInfo.value = res.user
    } catch (error) {
      console.error('获取用户信息失败:', error)
      userInfo.value = null
    }
  }

  function setUserInfo(user: LoginResult['user']) {
    userInfo.value = user
  }

  function clearUserInfo() {
    userInfo.value = null
  }

  return {
    userInfo,
    setUserInfo,
    fetchUserInfo,
    clearUserInfo
  }
}) 