<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message, Modal } from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

// 获取所有图标组件
const icons = Icons

// 获取当前选中的菜单项
const selectedKey = computed(() => route.path)

// 过滤路由配置
const filteredRoutes = computed(() => {
  const mainRoute = router.options.routes.find(r => r.path === '/admin')
  const routes = mainRoute?.children || []
  return routes.filter(route => {
    if (route.meta?.hidden) return false
    if (route.meta?.code && !userStore.hasPermission(route.meta.code)) return false
    return true
  })
})

// 获取显示名称
const displayName = computed(() => userStore.userInfo?.username || '未知用户')

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
})

// 退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      localStorage.removeItem('token')
      userStore.clearUserInfo()
      message.success('退出登录成功')
      router.push('/login')
    }
  })
}
</script>

<template>
  <a-layout class="layout-container">
    <a-layout-sider
      v-model:collapsed="isCollapse"
      class="sidebar"
      :trigger="null"
      collapsible
    >
      <div class="logo">
        <h2>{{ isCollapse ? 'GVA' : 'GVA Admin' }}</h2>
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :selected-keys="[selectedKey]"
      >
        <a-menu-item 
          v-for="route in filteredRoutes" 
          :key="'/admin/' + route.path"
        >
          <template #icon>
            <component :is="icons[route.meta?.icon]" />
          </template>
          <router-link :to="'/admin/' + route.path">{{ route.meta?.title }}</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    
    <a-layout>
      <a-layout-header class="header">
        <div class="header-left">
          <a-button type="text" @click="isCollapse = !isCollapse">
            <component :is="isCollapse ? icons.MenuUnfoldOutlined : icons.MenuFoldOutlined" />
          </a-button>
        </div>
        <div class="header-right">
          <a-dropdown>
            <a class="user-dropdown" @click.prevent>
              <a-avatar :src="userStore.userInfo?.avatar">
                {{ !userStore.userInfo?.avatar ? displayName.charAt(0).toUpperCase() : '' }}
              </a-avatar>
              <span class="username">{{ displayName }}</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <template #icon>
                    <component :is="icons.UserOutlined" />
                  </template>
                  <span>个人信息</span>
                </a-menu-item>
                <a-menu-item @click="handleLogout">
                  <template #icon>
                    <component :is="icons.LogoutOutlined" />
                  </template>
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.layout-container {
  min-height: 100vh;
  
  .logo {
    height: 64px;
    padding: 16px;
    color: white;
    text-align: center;
    
    h2 {
      margin: 0;
      color: white;
      font-size: 20px;
    }
  }
  
  .header {
    background: #fff;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    
    .header-right {
      .user-dropdown {
        display: flex;
        align-items: center;
        padding: 0 12px;
        cursor: pointer;
        
        .username {
          margin-left: 8px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
  
  .content {
    margin: 24px;
    padding: 24px;
    background: #fff;
    min-height: 280px;
  }
}
</style> 