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

      <a-table
        :columns="columns"
        :data-source="permissionList"
        :loading="loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
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
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const loading = ref(false)

const columns = [
  {
    title: '权限名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '权限编码',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '权限类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: '操作',
    key: 'action',
    width: 200
  }
]

const permissionList = ref([
  {
    id: 1,
    name: '用户管理',
    code: 'system:user',
    type: '菜单',
    createdAt: '2024-03-04 12:00:00'
  }
])

const handleEdit = (record: any) => {
  message.info('编辑权限：' + record.name)
}

const handleDelete = (record: any) => {
  message.info('删除权限：' + record.name)
}
</script>

<style scoped>
.permissions-container {
  min-height: 100%;
}
</style> 