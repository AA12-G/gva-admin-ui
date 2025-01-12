<template>
  <a-modal
    v-model:visible="visible"
    title="权限设置"
    width="800px"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <div class="permission-container">
        <div class="role-info">
          <h3>{{ currentRole?.name }}</h3>
          <p class="role-description">{{ currentRole?.description || '暂无描述' }}</p>
        </div>
        
        <a-divider />
        
        <a-tree
          v-model:checkedKeys="checkedKeys"
          :treeData="permissionTree"
          checkable
          :defaultExpandAll="true"
        >
          <template #title="{ title, type }">
            <span>
              <menu-outlined v-if="type === 'menu'" />
              <appstore-outlined v-else-if="type === 'button'" />
              <file-outlined v-else />
              {{ title }}
            </span>
          </template>
        </a-tree>
        
        <div class="footer-btns">
          <a-space>
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" :loading="saveLoading" @click="handleSave">
              保存
            </a-button>
          </a-space>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { MenuOutlined, AppstoreOutlined, FileOutlined } from '@ant-design/icons-vue'
import { getRolePermissions } from '@/api/role'
import type { RoleInfo } from '@/api/role'

const props = defineProps<{
  visible: boolean
  role?: RoleInfo
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'success'): void
}>()

const visible = ref(false)
const loading = ref(false)
const saveLoading = ref(false)
const currentRole = ref<RoleInfo>()
const checkedKeys = ref<string[]>([])
const permissionTree = ref<any[]>([])

// 监听visible变化
watch(
  () => props.visible,
  (val) => {
    visible.value = val
    if (val && props.role) {
      currentRole.value = props.role
      fetchRolePermissions()
    }
  }
)

// 获取角色权限
const fetchRolePermissions = async () => {
  if (!currentRole.value?.id) return
  
  loading.value = true
  try {
    const data = await getRolePermissions(currentRole.value.id)
    console.log('角色权限数据:', data)
    
    // 处理权限树数据
    permissionTree.value = formatPermissionTree(data.permissions)
    // 设置已选中的权限
    checkedKeys.value = data.checkedKeys || []
  } catch (error) {
    console.error('获取角色权限失败:', error)
    message.error('获取角色权限失败')
  } finally {
    loading.value = false
  }
}

// 格式化权限树
const formatPermissionTree = (permissions: any[]) => {
  // 这里根据实际的后端数据结构来处理
  return permissions.map(item => ({
    key: item.id,
    title: item.name,
    type: item.type,
    children: item.children ? formatPermissionTree(item.children) : undefined
  }))
}

// 取消
const handleCancel = () => {
  emit('update:visible', false)
  checkedKeys.value = []
  currentRole.value = undefined
}

// 保存
const handleSave = async () => {
  if (!currentRole.value?.id) return
  
  saveLoading.value = true
  try {
    // 这里添加保存权限的接口调用
    message.success('保存成功')
    emit('success')
    handleCancel()
  } catch (error) {
    console.error('保存权限失败:', error)
    message.error('保存权限失败')
  } finally {
    saveLoading.value = false
  }
}
</script>

<style scoped lang="less">
.permission-container {
  padding: 0 20px;
  
  .role-info {
    text-align: center;
    margin-bottom: 20px;
    
    h3 {
      margin-bottom: 8px;
      color: #1890ff;
    }
    
    .role-description {
      color: #666;
      font-size: 14px;
    }
  }
  
  .footer-btns {
    margin-top: 24px;
    text-align: right;
  }
}

:deep(.ant-tree) {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  
  .ant-tree-node-content-wrapper {
    display: flex;
    align-items: center;
    
    .anticon {
      margin-right: 8px;
    }
  }
}
</style> 