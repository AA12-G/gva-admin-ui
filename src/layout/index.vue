<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue/lib/icons'

const router = useRouter()
const isCollapse = ref(false)

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
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
        <h2>{{ isCollapse ? '后台' : '后台管理系统' }}</h2>
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :selected-keys="[$route.path]"
      >
        <a-menu-item key="/dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          <router-link to="/dashboard">仪表盘</router-link>
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
              <a-avatar>User</a-avatar>
              <span class="username">Admin</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleLogout">
                  <LogoutOutlined />
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

.user-dropdown:hover {
  background: rgba(0,0,0,0.025);
}

.username {
  margin-left: 8px;
}

.content {
  margin: 16px;
  padding: 16px;
  background: #fff;
  height: calc(100vh - 100px);
  overflow: auto;
}
</style> 