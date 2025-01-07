<template>
  <div class="users-container">
    <a-card title="用户管理">
      <!-- 搜索区域 -->
      <div class="table-operations">
        <a-space>
          <a-input
            v-model:value="searchForm.username"
            placeholder="请输入用户名"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
          <a-select
            v-model:value="searchForm.status"
            placeholder="用户状态"
            style="width: 120px"
            allowClear
          >
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
          <a-button type="primary" @click="handleSearch">
            <template #icon>
              <SearchOutlined />
            </template>
            搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon>
              <ReloadOutlined />
            </template>
            重置
          </a-button>
        </a-space>
      </div>

      <!-- 用户列表 -->
      <a-table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <!-- 状态列 -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          
          <!-- 角色列 -->
          <template v-if="column.key === 'role'">
            <a-tag color="blue">{{ record.role?.name || '超级管理员' }}</a-tag>
          </template>
          
          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-switch
                :checked="record.status === 1"
                :loading="record.statusLoading"
                checked-children="启用"
                un-checked-children="禁用"
                @change="(checked) => handleStatusChange(record, checked)"
              />
              <a-popconfirm
                title="确定要删除此用户吗？"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import { getUserList, deleteUser, updateUserStatus } from '@/api/user'
import type { UserInfo } from '@/api/user'

const loading = ref(false)
const userList = ref<UserInfo[]>([])

// 搜索表单
const searchForm = reactive({
  username: '',
  status: undefined as number | undefined
})

// 分页配置
const pagination = reactive<TablePaginationConfig>({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条记录`
})

// 表格列定义
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '角色',
    key: 'role'
  },
  {
    title: '操作',
    key: 'action',
    width: 250,
    fixed: 'right'
  }
]

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      username: searchForm.username || undefined,
      status: searchForm.status
    })

    console.log('用户列表响应:', res)
    userList.value = res.users
    pagination.total = res.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchUserList()
}

// 重置搜索
const handleReset = () => {
  searchForm.username = ''
  searchForm.status = undefined
  pagination.current = 1
  fetchUserList()
}

// 表格变化处理
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  fetchUserList()
}

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 1:
      return '正常'
    case 2:
      return '禁用'
    case 0:
      return '待审核'
    default:
      return '未知'
  }
}

// 获取状态标签颜色
const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return 'success'
    case 2:
      return 'error'
    case 0:
      return 'warning'
    default:
      return 'default'
  }
}

// 状态变更
const handleStatusChange = async (record: UserInfo, checked: boolean) => {
  console.log('当前用户信息:', record)

  const userId = record?.ID
  if (typeof userId !== 'number') {
    console.error('用户ID无效:', userId)
    message.error('无法获取用户ID')
    return
  }

  try {
    record.statusLoading = true
    
    console.log('正在更新用户状态:', {
      userId,
      oldStatus: record.status,
      newStatus: checked ? 1 : 2
    })
    
    await updateUserStatus(userId, checked ? 1 : 2)
    message.success(`${checked ? '启用' : '禁用'}成功`)
    await fetchUserList()
  } catch (error) {
    console.error('更新状态失败:', error)
    message.error('更新状态失败')
  } finally {
    record.statusLoading = false
  }
}

// 删除用户
const handleDelete = async (record: UserInfo) => {
  try {
    await deleteUser(record.id)
    message.success('删除成功')
    fetchUserList()
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

// 编辑用户
const handleEdit = (record: UserInfo) => {
  message.info('编辑用户：' + record.username)
}

onMounted(() => {
  fetchUserList()
})
</script>

<style scoped lang="less">
.users-container {
  min-height: 100%;
  padding: 24px;
  background-color: #f0f2f5;

  :deep(.ant-card) {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  }

  .table-operations {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }
}
</style> 