<template>
  <div class="settings-container">
    <a-card title="系统设置">
      <a-form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="系统名称">
          <a-input v-model:value="formState.systemName" />
        </a-form-item>

        <a-form-item label="系统描述">
          <a-textarea v-model:value="formState.description" :rows="4" />
        </a-form-item>

        <a-form-item label="版本号">
          <a-input v-model:value="formState.version" disabled />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4 }">
          <a-button type="primary" @click="handleSave">保存设置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'

const formState = reactive({
  systemName: 'GVA Admin Pro',
  description: '一个专业的后台管理系统解决方案',
  version: 'v1.0.0'
})

const handleSave = () => {
  message.success('设置保存成功')
}
</script>

<style scoped>
.settings-container {
  min-height: 100%;
}
</style> 