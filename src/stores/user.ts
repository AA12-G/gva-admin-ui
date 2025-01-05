import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user'
import type { LoginResult } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<LoginResult['user'] | null>(null)
  
  async function fetchUserInfo() {
    try {
      const res = await getUserInfo()
      userInfo.value = res.user
    } catch (error) {
      userInfo.value = null
    }
  }

  function clearUserInfo() {
    userInfo.value = null
  }

  return {
    userInfo,
    fetchUserInfo,
    clearUserInfo
  }
}) 