<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, LoadingOutlined, CheckCircleOutlined, GithubOutlined, WechatOutlined, DingdingOutlined } from '@ant-design/icons-vue'
import { login } from '@/api/user'
import type { LoginParams } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { encrypt, decrypt } from '@/utils/crypto'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const rememberPassword = ref(false)

const loginForm = reactive<LoginParams>({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ]
}

const formRef = ref()

const getRememberedPassword = (username: string) => {
  const rememberedPasswords = JSON.parse(localStorage.getItem('rememberedPasswords') || '{}')
  const encryptedPassword = rememberedPasswords[username]
  return encryptedPassword ? decrypt(encryptedPassword) : ''
}

const savePassword = (username: string, password: string) => {
  const rememberedPasswords = JSON.parse(localStorage.getItem('rememberedPasswords') || '{}')
  rememberedPasswords[username] = encrypt(password)
  localStorage.setItem('rememberedPasswords', JSON.stringify(rememberedPasswords))
}

const removePassword = (username: string) => {
  const rememberedPasswords = JSON.parse(localStorage.getItem('rememberedPasswords') || '{}')
  delete rememberedPasswords[username]
  localStorage.setItem('rememberedPasswords', JSON.stringify(rememberedPasswords))
}

const handleUsernameChange = (username: string) => {
  if (username) {
    const rememberedPassword = getRememberedPassword(username)
    if (rememberedPassword) {
      loginForm.password = rememberedPassword
      rememberPassword.value = true
    } else {
      loginForm.password = ''
      rememberPassword.value = false
    }
  }
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    const res = await login(loginForm)
    localStorage.setItem('token', res.token)
    userStore.setUserInfo(res.user)
    
    if (rememberPassword.value) {
      savePassword(loginForm.username, loginForm.password)
    } else {
      removePassword(loginForm.username)
    }
    
    message.success('登录成功')
    router.push('/admin/dashboard')
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-banner">
        <div class="banner-content">
          <div class="brand">
            <div class="text-logo">G</div>
            <h2>GVA Admin Pro</h2>
          </div>
          <p class="slogan">新一代企业级中后台系统</p>
          <div class="banner-features">
            <div class="feature-item">
              <CheckCircleOutlined />
              <span>基于 Vue3 + TypeScript + Vite 技术栈</span>
            </div>
            <div class="feature-item">
              <CheckCircleOutlined />
              <span>Ant Design Vue 企业级组件库</span>
            </div>
            <div class="feature-item">
              <CheckCircleOutlined />
              <span>Pinia + Vue Router 最佳实践</span>
            </div>
            <div class="feature-item">
              <CheckCircleOutlined />
              <span>内置权限管理与数据加密</span>
            </div>
          </div>
        </div>
        <div class="banner-footer">
          <div class="footer-links">
            <a href="#" target="_blank">帮助文档</a>
            <a href="#" target="_blank">隐私政策</a>
            <a href="#" target="_blank">条款说明</a>
          </div>
          <p>Copyright © 2024 GVA Admin Pro All Rights Reserved.</p>
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-box">
        <div class="login-header">
          <h1>欢迎回来</h1>
          <p class="subtitle">使用您的账号密码登录系统</p>
        </div>

        <a-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          layout="vertical"
          @keypress="handleKeyPress"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              :disabled="loading"
              @change="(e) => handleUsernameChange(e.target.value)"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item name="password">
            <a-input-password
              v-model:value="loginForm.password"
              placeholder="请输入密码"
              size="large"
              :disabled="loading"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          
          <div class="login-options">
            <a-checkbox v-model:checked="rememberPassword">记住密码</a-checkbox>
            <a href="javascript:;">忘记密码？</a>
          </div>
          
          <a-form-item>
            <a-button
              type="primary"
              size="large"
              block
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登录' }}
            </a-button>
          </a-form-item>
        </a-form>

        <div class="other-login">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="social-login">
            <a-tooltip title="Github 登录" placement="top">
              <a-button shape="circle">
                <GithubOutlined />
              </a-button>
            </a-tooltip>
            <a-tooltip title="微信登录" placement="top">
              <a-button shape="circle">
                <WechatOutlined />
              </a-button>
            </a-tooltip>
            <a-tooltip title="钉钉登录" placement="top">
              <a-button shape="circle">
                <DingdingOutlined />
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
}

.login-left {
  position: relative;
  width: 45%;
  min-width: 600px;
  background: linear-gradient(135deg, #1890ff 0%, #1664ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('@/assets/login-bg.svg') center/cover no-repeat;
    opacity: 0.1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
  }
}

.login-banner {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  
  .brand {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;

    .text-logo {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: bold;
      color: white;
    }

    h2 {
      font-size: 36px;
      font-weight: 600;
      margin: 0;
      letter-spacing: 1px;
    }
  }

  .slogan {
    font-size: 24px;
    margin-bottom: 64px;
    opacity: 0.9;
    font-weight: 300;
  }
}

.banner-features {
  .feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    font-size: 16px;
    opacity: 0.9;
    
    .anticon {
      margin-right: 12px;
      font-size: 20px;
      background: rgba(255, 255, 255, 0.1);
      padding: 8px;
      border-radius: 50%;
    }

    &:hover {
      opacity: 1;
      transform: translateX(4px);
      transition: all 0.3s ease;
    }
  }
}

.banner-footer {
  .footer-links {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;

    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 14px;

      &:hover {
        color: white;
      }
    }
  }

  p {
    opacity: 0.6;
    font-size: 14px;
  }
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
  backdrop-filter: blur(10px);
}

.login-box {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 28px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 8px;
  }
  
  .subtitle {
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
  }
}

:deep(.ant-input-affix-wrapper) {
  height: 44px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
  
  &:hover, &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24,144,255,0.1);
  }
  
  .ant-input {
    font-size: 14px;
  }
  
  .anticon {
    color: rgba(0, 0, 0, 0.45);
  }
}

:deep(.ant-btn) {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  
  &.ant-btn-primary {
    background: linear-gradient(135deg, #1890ff, #1664ff);
    border: none;
    box-shadow: 0 2px 8px rgba(24,144,255,0.3);
    
    &:hover {
      background: linear-gradient(135deg, #40a9ff, #1890ff);
      box-shadow: 0 4px 12px rgba(24,144,255,0.4);
    }
  }
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 24px;
  
  :deep(.ant-btn) {
    width: 44px;
    height: 44px;
    padding: 0;
    border: 1px solid #e8e8e8;
    
    .anticon {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.45);
    }
    
    &:hover {
      border-color: #1890ff;
      color: #1890ff;
      
      .anticon {
        color: #1890ff;
      }
    }
  }
}

// 响应式优化
@media (max-width: 1400px) {
  .login-left {
    width: 40%;
    min-width: 500px;
  }
}

@media (max-width: 1200px) {
  .login-left {
    display: none;
  }
  
  .login-right {
    padding: 20px;
  }
}

@media (max-width: 576px) {
  .login-box {
    padding: 24px;
  }
  
  .login-header {
    h1 {
      font-size: 24px;
    }
  }
}
</style> 