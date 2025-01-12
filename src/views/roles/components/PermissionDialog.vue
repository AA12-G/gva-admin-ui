<template>
  <a-modal
    :visible="modelValue"
    title="分配权限"
    @ok="handleSave"
    @cancel="handleCancel"
    :confirmLoading="loading"
    width="600px"
  >
    <a-spin :spinning="loading">
      <a-tree
        v-model:checkedKeys="checkedKeys"
        :tree-data="permissions"
        :fieldNames="{
          title: 'name',
          key: 'id',
          children: 'children'
        }"
        checkable
        :defaultExpandAll="true"
      />
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { getRolePermissions, updateRolePermissions } from '@/api/role'
import type { RoleInfo } from '@/api/role'

interface Props {
  modelValue: boolean
  role: RoleInfo | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const loading = ref(false)
const permissions = ref([])
const checkedKeys = ref([])

// 监听对话框显示状态，当显示时获取权限数据
watch(() => props.modelValue, async (newVal) => {
  if (newVal && props.role) {
    await loadPermissions()
  }
})

// 加载权限数据
const loadPermissions = async () => {
  if (!props.role) return
  
  try {
    loading.value = true
    const res = await getRolePermissions(props.role.id)
    console.log('获取到的权限数据:', res)
    permissions.value = res.permissions || []
    checkedKeys.value = res.permissions?.map(p => p.id) || []
  } catch (error) {
    console.error('获取权限列表失败:', error)
    message.error('获取权限列表失败')
  } finally {
    loading.value = false
  }
}

// 保存权限设置
const handleSave = async () => {
  if (!props.role) return
  
  try {
    loading.value = true
    await updateRolePermissions(props.role.id, checkedKeys.value)
    message.success('权限设置成功')
    emit('success')
    handleCancel()
  } catch (error) {
    console.error('保存权限失败:', error)
    message.error('保存权限失败')
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleCancel = () => {
  emit('update:modelValue', false)
  permissions.value = []
  checkedKeys.value = []
}
</script>

<style scoped>
.ant-tree {
  max-height: 400px;
  overflow-y: auto;
}
</style> 