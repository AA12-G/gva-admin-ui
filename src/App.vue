<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { theme } from 'ant-design-vue'

// 主题模式 - 默认使用亮色主题
const isDarkMode = ref(false)
localStorage.setItem('theme', 'light')

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', 'light')
  document.body.classList.remove('dark')
})

const { defaultAlgorithm } = theme
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        colorInfo: '#1677ff',
        colorTextBase: 'rgba(0, 0, 0, 0.85)',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBorder: '#f0f0f0',
        colorBgLayout: '#f5f5f5',
        borderRadius: 4,
        wireframe: true,
        colorBgMenu: '#ffffff',
        colorItemBg: '#ffffff',
        colorSubItemBg: '#ffffff',
        colorItemText: 'rgba(0, 0, 0, 0.85)',
        colorItemTextHover: '#1677ff',
        colorItemTextSelected: '#1677ff',
        colorItemBgSelected: '#e6f4ff',
        colorItemBgHover: '#f5f5f5'
      }
    }"
  >
    <div class="app-container">
      <router-view />
    </div>
  </a-config-provider>
</template>

<style>
:root {
  /* 统一使用亮色主题的变量 */
  --bg-color: #f5f5f5;
  --component-bg: #ffffff;
  --border-color: #f0f0f0;
  --primary-color: #1677ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --text-color: rgba(0, 0, 0, 0.85);
  --text-color-secondary: rgba(0, 0, 0, 0.45);
  --disabled-color: rgba(0, 0, 0, 0.25);
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  --hover-bg: rgba(0, 0, 0, 0.04);
}

/* 全局基础样式 */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-container {
  min-height: 100vh;
}

/* 布局相关 */
.ant-layout {
  background: var(--bg-color);
}

.ant-layout-header {
  background: var(--component-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.ant-layout-sider {
  background: var(--component-bg);
  border-right: 1px solid var(--border-color);
}

/* 卡片相关 */
.ant-card {
  background: var(--component-bg);
  border-color: var(--border-color);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

/* 表格相关 */
.ant-table {
  background: var(--component-bg);
  
  .ant-table-thead > tr > th {
    background: #fafafa;
    border-bottom: 1px solid var(--border-color);
  }
  
  .ant-table-tbody > tr:hover > td {
    background: #fafafa;
  }
}

/* 按钮相关 */
.ant-btn {
  &:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
  
  &-primary {
    background: var(--primary-color);
    
    &:hover {
      background: #4096ff;
    }
  }
}

/* 标签相关 */
.ant-tag {
  &-blue {
    color: var(--primary-color);
    background: #e6f4ff;
    border-color: #91caff;
  }
  
  &-green {
    color: var(--success-color);
    background: #f6ffed;
    border-color: #b7eb8f;
  }
  
  &-red {
    color: var(--error-color);
    background: #fff2f0;
    border-color: #ffccc7;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-radius: 4px;
  
  &:hover {
    background: #d9d9d9;
  }
}

/* 文本选中样式 */
::selection {
  background: var(--primary-color);
  color: #fff;
}

/* 过渡动画 */
* {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 菜单相关样式 */
.ant-menu {
  background: var(--component-bg);
  border-right: 1px solid var(--border-color);
}

.ant-menu-item {
  color: var(--text-color) !important;
  margin: 4px 8px !important;
  border-radius: 4px;

  &:hover {
    color: var(--primary-color) !important;
    background-color: #f5f5f5 !important;
  }

  &-selected {
    color: var(--primary-color) !important;
    background-color: #e6f4ff !important;

    &::after {
      display: none !important;
    }
  }
}

.ant-menu-inline {
  border-right: none !important;
}

/* 菜单图标样式 */
.ant-menu-item .anticon {
  color: var(--text-color-secondary);
}

.ant-menu-item:hover .anticon,
.ant-menu-item-selected .anticon {
  color: var(--primary-color);
}

/* 子菜单样式 */
.ant-menu-submenu {
  &-title {
    color: var(--text-color) !important;
    margin: 4px 8px !important;
    border-radius: 4px;

    &:hover {
      color: var(--primary-color) !important;
      background-color: #f5f5f5 !important;
    }
  }

  &-selected > .ant-menu-submenu-title {
    color: var(--primary-color) !important;
  }
}
</style>
