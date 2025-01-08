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

// 主题切换相关
const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

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
        :selected-keys="[selectedKey]"
        mode="inline"
        theme="light"
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
          <a-space>
            <a-button type="text" @click="isCollapse = !isCollapse">
              <component :is="isCollapse ? Icons.MenuUnfoldOutlined : Icons.MenuFoldOutlined" />
            </a-button>
            <a-button type="text" @click="toggleTheme">
              <component :is="isDarkMode ? Icons.BulbFilled : Icons.BulbOutlined" />
            </a-button>
          </a-space>
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
    text-align: center;
    background: #f5f5f5;
    border-bottom: 1px solid #f0f0f0;
    
    h2 {
      margin: 0;
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
    }
  }
  
  .sidebar {
    background: #f5f5f5 !important;
    border-right: 1px solid #f0f0f0;
    
    :deep(.ant-menu) {
      background: #f5f5f5;
      border-right: none;

      .ant-menu-item {
        margin: 4px 8px !important;
        border-radius: 4px;

        &:hover {
          background-color: #e8e8e8 !important;
        }

        &-selected {
          background-color: #e6f4ff !important;
        }
      }
    }
  }
  
  .header {
    background: var(--component-bg);
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    
    .header-right {
      .user-dropdown {
        display: flex;
        align-items: center;
        padding: 0 12px;
        cursor: pointer;
        
        .username {
          margin-left: 8px;
          color: var(--text-color);
        }
      }
    }
  }
  
  .content {
    margin: 24px;
    padding: 24px;
    background: var(--component-bg);
    min-height: 280px;
  }
}

.header-left {
  .ant-btn {
    padding: 0 12px;
    font-size: 16px;
    
    &:hover {
      color: var(--ant-primary-color);
      background: rgba(0, 0, 0, 0.04);
    }
  }
}

/* 暗黑模式样式 */
:deep([data-theme='dark']) {
  .header-left {
    .ant-btn {
      color: rgba(255, 255, 255, 0.85);
      
      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  }
}
</style> 