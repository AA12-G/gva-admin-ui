<template>
  <div class="users-container">
    <a-card title="用户管理">
      <template #extra>
        <a-button type="primary">
          <template #icon>
            <PlusOutlined />
          </template>
          新增用户
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="userList"
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
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
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

const userList = ref([
  {
    id: 1,
    username: 'admin',
    createdAt: '2024-03-04 12:00:00'
  }
])

const handleEdit = (record: any) => {
  message.info('编辑用户：' + record.username)
}

const handleDelete = (record: any) => {
  message.info('删除用户：' + record.username)
}
</script>

<style scoped>
.users-container {
  min-height: 100%;
}
</style> 