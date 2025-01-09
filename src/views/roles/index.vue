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
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </a-space>
        <a-button type="primary" @click="() => showAddModal()">
          <template #icon><PlusOutlined /></template>
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
          
          <!-- 创建时间列 -->
          <template v-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
          
          <!-- 操作列 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button 
                type="primary" 
                ghost
                size="small"
                @click="handleEdit(record)"
              >
                <template #icon>
                  <EditOutlined />
                </template>
                编辑
              </a-button>
              <a-button 
                type="primary" 
                ghost
                size="small"
                @click="handlePermissions(record)"
              >
                <template #icon>
                  <SettingOutlined />
                </template>
                权限设置
              </a-button>
              <a-popconfirm
                title="确定要删除此角色吗？"
                @confirm="handleDelete(record)"
              >
                <a-button 
                  type="primary" 
                  danger 
                  ghost
                  size="small"
                >
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>

  <!-- 编辑角色对话框 -->
  <a-modal
    v-model:visible="editModalVisible"
    title="编辑角色"
    @ok="handleEditSubmit"
    @cancel="handleEditCancel"
    :confirmLoading="editLoading"
  >
    <a-form
      ref="editFormRef"
      :model="editForm"
      :rules="editRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="角色名称" name="name">
        <a-input v-model:value="editForm.name" placeholder="请输入角色名称" />
      </a-form-item>
      
      <a-form-item label="角色编码" name="code">
        <a-input v-model:value="editForm.code" placeholder="请输入角色编码" />
      </a-form-item>
      
      <a-form-item label="描述" name="description">
        <a-textarea 
          v-model:value="editForm.description" 
          placeholder="请输入角色描述"
          :rows="4" 
        />
      </a-form-item>
      
      <a-form-item label="状态" name="status">
        <a-select v-model:value="editForm.status" placeholder="请选择状态">
          <a-select-option :value="1">正常</a-select-option>
          <a-select-option :value="0">禁用</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined,
  DeleteOutlined,
  SettingOutlined 
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { getRoleList, deleteRole, getRoleById, updateRole } from '@/api/role'
import type { FormInstance } from 'ant-design-vue'

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
    key: 'name',
    width: 150
  },
  {
    title: '角色编码',
    dataIndex: 'code',
    key: 'code',
    width: 150
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 180
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

// 权限设置
const handlePermissions = (record: RoleInfo) => {
  message.info('权限设置功能开发中')
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

// 在 script setup 中添加以下代码
const editModalVisible = ref(false)
const editLoading = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  id: undefined as number | undefined,
  name: '',
  code: '',
  description: '',
  status: undefined as number | undefined
})

// 编辑表单校验规则
const editRules = {
  name: [
    { required: true, message: '请输入角色名称' },
    { min: 2, max: 32, message: '角色名称长度必须在2-32个字符之间' }
  ],
  code: [
    { required: true, message: '请输入角色编码' },
    { min: 2, max: 32, message: '角色编码长度必须在2-32个字符之间' }
  ]
}

// 编辑角色
const handleEdit = async (record: RoleInfo) => {
  try {
    editLoading.value = true
    
    console.log('当前编辑的角色记录:', record)
    
    // 调用接口获取角色详细信息
    const roleDetail = await getRoleById(record.ID)
    console.log('获取到的角色详情:', roleDetail)
    
    // 填充表单数据前检查数据
    if (!roleDetail) {
      throw new Error('未获取到角色详情数据')
    }
    
    // 填充表单数据
    editForm.id = roleDetail.id || record.ID
    editForm.name = roleDetail.name || record.name
    editForm.code = roleDetail.code || record.code
    editForm.description = roleDetail.description || record.description || ''
    editForm.status = roleDetail.status ?? record.status
    
    // 显示编辑弹窗
    editModalVisible.value = true
  } catch (error) {
    console.error('获取角色信息失败:', error)
    message.error('获取角色信息失败')
  } finally {
    editLoading.value = false
  }
}

// 提交编辑
const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate()
    
    if (!editForm.id) {
      message.error('角色ID不存在')
      return
    }

    editLoading.value = true
    
    // 调用更新接口
    await updateRole(editForm.id, {
      name: editForm.name,
      code: editForm.code,
      description: editForm.description,
      status: editForm.status
    })
    
    message.success('更新成功')
    editModalVisible.value = false
    await fetchRoleList() // 刷新列表
  } catch (error: any) {
    console.error('更新角色信息失败:', error)
    message.error(error.response?.data?.error || '更新失败')
  } finally {
    editLoading.value = false
  }
}

// 取消编辑
const handleEditCancel = () => {
  editFormRef.value?.resetFields()
  editModalVisible.value = false
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

// 操作按钮样式优化
:deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  .anticon {
    font-size: 14px;
  }
  
  &:not(:last-child) {
    margin-right: 8px;
  }
}

// 操作列按钮组样式
:deep(.ant-space) {
  .ant-btn {
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style> 