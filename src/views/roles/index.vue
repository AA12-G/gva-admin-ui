<template>
  <div class="roles-container">
    <a-card title="角色管理">
      <!-- 搜索和操作工具栏 -->
      <div class="table-operations">
        <a-space>
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入角色名称"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
          <a-select
            v-model:value="searchForm.status"
            placeholder="角色状态"
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
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <PlusOutlined />
          </template>
          新增角色
        </a-button>
      </div>

      <!-- 角色列表 -->
      <a-table
        :columns="columns"
        :data-source="roleList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <!-- 状态列 -->
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'error'">
              {{ record.status === 1 ? '正常' : '禁用' }}
            </a-tag>
          </template>
          
          <!-- 数据权限列 -->
          <template v-if="column.key === 'data_scope'">
            <a-tag color="blue">{{ record.data_scope }}</a-tag>
          </template>
          
          <!-- 创建时间列 -->
          <template v-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
          
          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" @click="handlePermissions(record)">权限设置</a-button>
              <a-switch
                :checked="record.status === 1"
                :loading="record.statusLoading"
                checked-children="启用"
                un-checked-children="禁用"
                @change="(checked) => handleStatusChange(record, checked)"
              />
              <a-popconfirm
                title="确定要删除此角色吗？"
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
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { getRoleList, updateRoleStatus, deleteRole, type RoleInfo } from '@/api/role'

const loading = ref(false)
const roleList = ref<RoleInfo[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
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
    title: '数据权限',
    dataIndex: 'data_scope',
    key: 'data_scope'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at'
  },
  {
    title: '操作',
    key: 'action',
    width: 300,
    fixed: 'right'
  }
]

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const data = await getRoleList()
    roleList.value = data
    pagination.total = data.length
  } catch (error) {
    console.error('获取角色列表失败:', error)
    message.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchRoleList()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = undefined
  pagination.current = 1
  fetchRoleList()
}

// 表格变化处理
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  fetchRoleList()
}

// 新增角色
const handleAdd = () => {
  message.info('新增角色功能开发中')
}

// 编辑角色
const handleEdit = (record: RoleInfo) => {
  message.info('编辑角色功能开发中')
}

// 权限设置
const handlePermissions = (record: RoleInfo) => {
  message.info('权限设置功能开发中')
}

// 状态变更
const handleStatusChange = async (record: RoleInfo, checked: boolean) => {
  try {
    await updateRoleStatus(record.id, checked ? 1 : 0)
    message.success('状态更新成功')
    fetchRoleList()
  } catch (error) {
    console.error('更新状态失败:', error)
    message.error('更新状态失败')
  }
}

// 删除角色
const handleDelete = async (record: RoleInfo) => {
  try {
    await deleteRole(record.id)
    message.success('删除成功')
    fetchRoleList()
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

// 初始化
fetchRoleList()
</script>

<style scoped lang="less">
.roles-container {
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

  :deep(.ant-table-cell) {
    .ant-tag {
      margin-right: 0;
    }
  }
}
</style> 