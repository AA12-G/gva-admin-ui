<template>
  <div class="users-container">
    <a-card title="用户管理">
      <!-- 标题右侧的新增按钮 -->
      <template #extra>
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <PlusOutlined />
          </template>
          新增用户
        </a-button>
      </template>

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
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
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
            <a-space>
              <a-tag 
                v-if="record.role?.code === 'super_admin'"
                color="red"
              >
                超级管理员
              </a-tag>
              <a-tag 
                v-else-if="record.role?.code === 'admin'"
                color="blue"
              >
                管理员
              </a-tag>
              <a-tag 
                v-else
                color="green"
              >
                普通用户
              </a-tag>
            </a-space>
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

      <!-- 新增用户对话框 -->
      <a-modal
        v-model:visible="addModalVisible"
        title="新增用户"
        @ok="handleAddSubmit"
        @cancel="handleAddCancel"
        :confirmLoading="addLoading"
      >
        <a-form
          ref="addFormRef"
          :model="addForm"
          :rules="addRules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="用户名" name="username">
            <a-input v-model:value="addForm.username" placeholder="请输入用户名" />
          </a-form-item>
          
          <a-form-item label="密码" name="password">
            <a-input-password 
              v-model:value="addForm.password" 
              placeholder="请输入密码，不填则默认为123456" 
            />
          </a-form-item>
          
          <a-form-item label="昵称" name="nickname">
            <a-input v-model:value="addForm.nickname" placeholder="请输入昵称" />
          </a-form-item>
          
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="addForm.email" placeholder="请输入邮箱" />
          </a-form-item>
          
          <a-form-item label="手机号" name="phone">
            <a-input v-model:value="addForm.phone" placeholder="请输入手机号" />
          </a-form-item>
          
          <a-form-item label="角色" name="role_id">
            <a-select v-model:value="addForm.role_id" placeholder="请选择角色">
              <a-select-option :value="1">
                <a-tag color="volcano">超级管理员</a-tag>
              </a-select-option>
              <a-select-option :value="2">
                <a-tag color="blue">管理员</a-tag>
              </a-select-option>
              <a-select-option :value="3">
                <a-tag color="cyan">普通用户</a-tag>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import { getUserList, deleteUser, updateUserStatus, getUserProfile, updateUserProfile, createUser } from '@/api/user'
import type { UserInfo, CreateUserParams } from '@/api/user'
import type { FormInstance } from 'ant-design-vue'

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
    await deleteUser(record.ID)
    message.success('删除成功')
    fetchUserList()
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

// 编辑用户对话框
const editModalVisible = ref(false)
const editLoading = ref(false)
const editFormRef = ref<FormInstance>()

// 编辑表单数据
const editForm = reactive({
  id: undefined as number | undefined,
  username: '',
  nickname: '',
  email: '',
  phone: '',
  role_id: undefined as number | undefined
})

// 表单校验规则
const editRules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 2, max: 32, message: '用户名长度必须在2-32个字符之间' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
  ],
  role_id: [
    { required: true, message: '请选择角色' }
  ]
}

// 编辑用户
const handleEdit = async (record: UserInfo) => {
  try {
    editLoading.value = true
    
    // 打印调试信息
    console.log('获取用户信息:', record.ID)
    
    // 先获取用户详细信息
    const res = await getUserProfile(record.ID)
    
    // 填充表单数据
    editForm.id = record.ID
    editForm.username = res.user.username
    editForm.nickname = res.user.nickname
    editForm.email = res.user.email
    editForm.phone = res.user.phone
    editForm.role_id = res.user.role_id
    
    // 显示编辑弹窗
    editModalVisible.value = true
  } catch (error) {
    console.error('获取用户信息失败:', error)
    message.error('获取用户信息失败')
  } finally {
    editLoading.value = false
  }
}

// 提交编辑
const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate()
    
    if (!editForm.id) {
      message.error('用户ID不存在')
      return
    }

    editLoading.value = true
    
    // 打印调试信息
    console.log('正在更新用户信息:', {
      userId: editForm.id,
      formData: {
        username: editForm.username,
        nickname: editForm.nickname,
        email: editForm.email,
        phone: editForm.phone,
        role_id: editForm.role_id
      }
    })

    // 调用更新接口
    await updateUserProfile(editForm.id, {
      username: editForm.username,
      nickname: editForm.nickname || undefined,
      email: editForm.email || undefined,
      phone: editForm.phone || undefined,
      role_id: editForm.role_id
    })
    
    message.success('更新成功')
    editModalVisible.value = false
    await fetchUserList() // 刷新列表
  } catch (error: any) {
    console.error('更新用户信息失败:', error)
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

// 添加用户相关
const addModalVisible = ref(false)
const addLoading = ref(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive<CreateUserParams>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  role_id: undefined
})

// 添加表单校验规则
const addRules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 2, max: 32, message: '用户名长度必须在2-32个字符之间' }
  ],
  password: [
    { min: 6, max: 32, message: '密码长度必须在6-32个字符之间' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
  ],
  role_id: [
    { required: true, message: '请选择角色' }
  ]
}

// 打开添加用户对话框
const handleAdd = () => {
  addModalVisible.value = true
}

// 提交添加用户
const handleAddSubmit = async () => {
  try {
    await addFormRef.value?.validate()
    addLoading.value = true
    
    // 构造请求数据
    const data: CreateUserParams = {
      username: addForm.username,
      role_id: addForm.role_id
    }
    
    // 可选字段
    if (addForm.password) data.password = addForm.password
    if (addForm.nickname) data.nickname = addForm.nickname
    if (addForm.email) data.email = addForm.email
    if (addForm.phone) data.phone = addForm.phone

    // 调用创建用户接口
    await createUser(data)
    
    message.success('创建成功')
    addModalVisible.value = false
    addFormRef.value?.resetFields()
    await fetchUserList()
  } catch (error: any) {
    if (error.response?.status === 409) {
      message.error('用户名已存在')
    } else if (error.response?.status === 400) {
      message.error(error.response.data?.error || '参数错误')
    } else if (error.response?.status === 403) {
      message.error('权限不足')
    } else {
      message.error(error.response?.data?.error || '创建失败')
    }
    console.error('创建用户失败:', error)
  } finally {
    addLoading.value = false
  }
}

// 取消添加用户
const handleAddCancel = () => {
  addFormRef.value?.resetFields()
  addModalVisible.value = false
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

.ant-btn {
  padding: 0 8px;
  
  .anticon {
    font-size: 14px;
  }
}

:deep(.ant-select-item) {
  .ant-tag {
    margin-right: 0;
  }
}

.table-operations {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

/* 如果需要按钮靠右对齐，可以添加以下样式 */
.table-operations :deep(.ant-space) {
  width: 100%;
  justify-content: flex-start;
}
</style> 