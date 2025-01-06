<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message, Modal } from 'ant-design-vue'
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  FileOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)

const iconMap = {
  dashboard: DashboardOutlined,
  user: UserOutlined,
  setting: SettingOutlined,
  file: FileOutlined
}

const selectedKey = computed(() => {
  return route.path
})

const filteredRoutes = computed(() => {
  const mainRoute = router.options.routes.find(r => r.path === '/admin')
  const routes = mainRoute?.children || []
  return routes.filter(route => {
    // 过滤掉隐藏的菜单
    if (route.meta?.hidden) return false
    // 检查权限
    if (route.meta?.code && !userStore.hasPermission(route.meta.code)) return false
    return true
  })
})

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
})

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

const displayName = computed(() => {
  return userStore.userInfo?.username || '未知用户'
})
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
            <component :is="iconMap[route.meta?.icon]" />
          </template>
          <router-link :to="'/admin/' + route.path">{{ route.meta?.title }}</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    
    <a-layout>
      <a-layout-header class="header">
        <div class="header-left">
          <a-button type="text" @click="isCollapse = !isCollapse">
            <MenuFoldOutlined v-if="!isCollapse" />
            <MenuUnfoldOutlined v-else />
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
                    <UserOutlined />
                  </template>
                  <span>个人信息</span>
                </a-menu-item>
                <a-menu-item @click="handleLogout">
                  <template #icon>
                    <LogoutOutlined />
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

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
}

.logo {
  height: 64px;
  line-height: 64px;
  text-align: center;
  color: white;
  font-size: 16px;
  overflow: hidden;
  background: #001529;
}

.header {
  background: #fff;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.username {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.content {
  margin: 16px;
  padding: 16px;
  background: #fff;
  height: calc(100vh - 100px);
  overflow: auto;
}

:deep(.ant-avatar) {
  background-color: #1677ff;
  font-size: 14px;
}
</style> 