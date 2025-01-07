<template>
  <div class="permissions-container">
    <a-card title="权限管理">
      <template #extra>
        <a-button type="primary">
          <template #icon>
            <PlusOutlined />
          </template>
          新增权限
        </a-button>
      </template>

      <!-- 权限列表 -->
      <a-table
        :columns="columns"
        :data-source="permissionList"
        :loading="loading"
        :pagination="{
          total: total,
          current: current,
          pageSize: 5,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个权限`,
          pageSizeOptions: ['5', '10', '20'],
          size: 'default',
          hideOnSinglePage: false,
          showLessItems: true
        }"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <!-- 类型列 -->
          <template v-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ record.type }}
            </a-tag>
          </template>

          <!-- 状态列 -->
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'error'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>

          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import request from '@/utils/request'
import type { TablePaginationConfig } from 'ant-design-vue'

interface Permission {
  id: number
  name: string
  code: string
  type: string
  parent_id: number | null
  path: string
  component: string
  redirect: string
  icon: string
  sort: number
  hidden: boolean
  status: number
  description: string
}

const loading = ref(false)
const permissionList = ref<Permission[]>([])
const total = ref(0)
const current = ref(1)

// 表格列定义
const columns = [
  {
    title: '权限名称',
    dataIndex: 'name',
    key: 'name',
    width: 180
  },
  {
    title: '权限标识',
    dataIndex: 'code',
    key: 'code',
    width: 200
  },
  {
    title: '权限类型',
    dataIndex: 'type',
    key: 'type',
    width: 120
  },
  {
    title: '权限状态',
    dataIndex: 'status',
    key: 'status',
    width: 120
  },
  {
    title: '权限描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

// 获取权限类型标签颜色
const getTypeColor = (type: string) => {
  switch (type) {
    case 'menu':
      return 'blue'
    case 'button':
      return 'green'
    case 'data':
      return 'purple'
    default:
      return 'default'
  }
}

// 获取权限列表
const fetchPermissionList = async (page = 1) => {
  loading.value = true
  try {
    const res = await request<{ permissions: Permission[], total: number }>({
      url: '/permissions',
      method: 'get',
      params: {
        page,
        pageSize: 5
      }
    })
    permissionList.value = res.permissions
    total.value = res.total || res.permissions.length
  } catch (error) {
    console.error('获取权限列表失败:', error)
    message.error('获取权限列表失败')
  } finally {
    loading.value = false
  }
}

// 处理表格变化
const handleTableChange = (pagination: TablePaginationConfig) => {
  current.value = pagination.current || 1
  fetchPermissionList(current.value)
}

// 编辑权限
const handleEdit = (record: Permission) => {
  message.info('编辑权限：' + record.name)
}

// 删除权限
const handleDelete = (record: Permission) => {
  message.info('删除权限：' + record.name)
}

// 初始化
onMounted(() => {
  fetchPermissionList()
})
</script>

<style scoped>
.permissions-container {
  min-height: 100%;
  padding: 24px;
  background-color: #f0f2f5;
}

:deep(.ant-pagination-item) {
  display: none;
}

:deep(.ant-pagination-item-active) {
  display: inline-block;
}
</style> 