<template>
  <div class="roles-container">
    <a-card title="角色管理">
      <template #extra>
        <a-button type="primary">
          <template #icon>
            <PlusOutlined />
          </template>
          新增角色
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="roleList"
        :loading="loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" @click="handlePermission(record)">权限设置</a-button>
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
    title: '角色名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '角色编码',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: '操作',
    key: 'action',
    width: 280
  }
]

const roleList = ref([
  {
    id: 1,
    name: '管理员',
    code: 'admin',
    createdAt: '2024-03-04 12:00:00'
  }
])

const handleEdit = (record: any) => {
  message.info('编辑角色：' + record.name)
}

const handlePermission = (record: any) => {
  message.info('设置权限：' + record.name)
}

const handleDelete = (record: any) => {
  message.info('删除角色：' + record.name)
}
</script>

<style scoped>
.roles-container {
  min-height: 100%;
}
</style> 