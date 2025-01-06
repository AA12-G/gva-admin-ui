<template>
  <div class="profile-container">
    <a-card title="个人中心">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-card class="user-card">
            <div class="avatar-wrapper">
              <a-avatar :size="120" :src="userStore.userInfo?.avatar">
                {{ !userStore.userInfo?.avatar ? displayName.charAt(0).toUpperCase() : '' }}
              </a-avatar>
              <div class="upload-btn">
                <a-upload
                  name="avatar"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                >
                  <a-button type="primary">更换头像</a-button>
                </a-upload>
              </div>
            </div>
            <div class="user-info">
              <h2>{{ displayName }}</h2>
              <p>{{ userStore.userInfo?.role?.name || '暂无角色' }}</p>
            </div>
          </a-card>
        </a-col>
        <a-col :span="16">
          <a-tabs>
            <a-tab-pane key="basic" tab="基本信息">
              <a-form
                :model="formState"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 16 }"
              >
                <a-form-item label="用户名">
                  <a-input v-model:value="formState.username" disabled />
                </a-form-item>
                <a-form-item label="昵称">
                  <a-input v-model:value="formState.nickname" />
                </a-form-item>
                <a-form-item label="邮箱">
                  <a-input v-model:value="formState.email" />
                </a-form-item>
                <a-form-item label="手机号">
                  <a-input v-model:value="formState.phone" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 4 }">
                  <a-button type="primary" @click="handleSave">保存</a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="security" tab="安全设置">
              <a-form
                :model="passwordForm"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 16 }"
              >
                <a-form-item label="原密码">
                  <a-input-password v-model:value="passwordForm.oldPassword" />
                </a-form-item>
                <a-form-item label="新密码">
                  <a-input-password v-model:value="passwordForm.newPassword" />
                </a-form-item>
                <a-form-item label="确认密码">
                  <a-input-password v-model:value="passwordForm.confirmPassword" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 4 }">
                  <a-button type="primary" @click="handleChangePassword">修改密码</a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

const userStore = useUserStore()

const displayName = computed(() => {
  return userStore.userInfo?.nickname || userStore.userInfo?.username || '未知用户'
})

const formState = reactive({
  username: userStore.userInfo?.username || '',
  nickname: userStore.userInfo?.nickname || '',
  email: userStore.userInfo?.email || '',
  phone: userStore.userInfo?.phone || ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片！')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

const handleSave = () => {
  message.success('保存成功')
}

const handleChangePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  message.success('密码修改成功')
}
</script>

<style scoped>
.profile-container {
  min-height: 100%;
}

.user-card {
  text-align: center;
  padding: 20px;
}

.avatar-wrapper {
  margin-bottom: 24px;
}

:deep(.ant-avatar) {
  margin-bottom: 16px;
  background-color: #1677ff;
  font-size: 48px;
}

.user-info {
  h2 {
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }

  p {
    color: rgba(0, 0, 0, 0.45);
  }
}

.upload-btn {
  margin-top: 16px;
}
</style> 