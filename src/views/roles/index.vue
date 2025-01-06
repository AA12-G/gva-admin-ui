<template>
  <div class="roles-container">
    <a-card title="角色管理">
      <template #extra>
        <a-button type="primary" @click="handleAdd">
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
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'error'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" @click="handlePermission(record)">权限设置</a-button>
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

    <!-- 角色表单弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="角色名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色标识" name="code">
          <a-input v-model:value="formState.code" placeholder="请输入角色标识" />
        </a-form-item>
        <a-form-item label="排序号" name="sort">
          <a-input-number
            v-model:value="formState.sort"
            :min="0"
            :max="999"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-switch
            v-model:checked="formState.status"
            :checkedValue="1"
            :unCheckedValue="0"
            checked-children="启用"
            un-checked-children="禁用"
          />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formState.remark" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import { getRoleList } from '@/api/role'
import type { RoleItem } from '@/api/role'

const loading = ref(false)
const roleList = ref<RoleItem[]>([])
const modalVisible = ref(false)
const modalTitle = ref('新增角色')
const currentId = ref<number | null>(null)

// 表单状态
const formState = reactive({
  name: '',
  code: '',
  sort: 0,
  status: 1,
  remark: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '只能包含大写字母和下划线', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' }
  ]
}

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
    title: '角色标识',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '排序号',
    dataIndex: 'sort',
    key: 'sort',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 180
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    width: 250,
    fixed: 'right'
  }
]

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const res = await getRoleList({
      page: pagination.current,
      pageSize: pagination.pageSize
    })
    // 响应拦截器已经处理了 code 和 msg，这里直接使用数据
    roleList.value = res.list
    pagination.total = res.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 表格变化处理
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  fetchRoleList()
}

// 新增角色
const handleAdd = () => {
  modalTitle.value = '新增角色'
  currentId.value = null
  formState.name = ''
  formState.code = ''
  formState.sort = 0
  formState.status = 1
  formState.remark = ''
  modalVisible.value = true
}

// 编辑角色
const handleEdit = (record: RoleItem) => {
  modalTitle.value = '编辑角色'
  currentId.value = record.id
  formState.name = record.name
  formState.code = record.code
  formState.sort = record.sort
  formState.status = record.status
  formState.remark = record.remark || ''
  modalVisible.value = true
}

// 删除角色
const handleDelete = async (record: RoleItem) => {
  try {
    await deleteRole(record.id)
    message.success('删除成功')
    fetchRoleList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 权限设置
const handlePermission = (record: RoleItem) => {
  message.info('权限设置功能开发中')
}

// 弹窗确认
const handleModalOk = async () => {
  try {
    if (currentId.value) {
      // 编辑
      await updateRole(currentId.value, {
        name: formState.name,
        code: formState.code,
        sort: formState.sort,
        status: formState.status,
        remark: formState.remark
      })
      message.success('更新成功')
    } else {
      // 新增
      await createRole({
        name: formState.name,
        code: formState.code,
        sort: formState.sort,
        status: formState.status,
        remark: formState.remark
      })
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchRoleList()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
}

onMounted(() => {
  fetchRoleList()
})
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
    justify-content: flex-end;
  }
}
</style> 