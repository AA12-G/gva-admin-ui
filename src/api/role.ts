import request from '@/utils/request'

// 角色信息接口
export interface RoleInfo {
  id: number
  ID?: number
  name: string
  code: string
  parent_id: number | null
  data_scope: string
  status: number
  sort: number
  description: string
  created_at: string
  updated_at: string
}

// 获取角色列表
export function getRoleList() {
  return request<RoleInfo[]>({
    url: '/roles',
    method: 'get'
  })
}

// 更新角色状态
export function updateRoleStatus(id: number, status: number) {
  return request({
    url: `/roles/${id}/status`,
    method: 'patch',
    data: { status }
  })
}

// 删除角色
export function deleteRole(id: number) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

// 根据ID获取指定角色信息
export const getRoleById = async (id: number) => {
  try {
    const response = await request({
      url: `/roles/${id}`,
      method: 'get'
    })
    console.log('获取到的角色详情:', response)
    return response.data || response
  } catch (error) {
    console.error('获取角色信息失败:', error)
    throw error
  }
}

// 更新角色信息
export function updateRole(id: number, data: Partial<RoleInfo>) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data
  })
}

// 获取角色权限
export const getRolePermissions = (id: number) => {
  return request({
    url: `/roles/${id}/permissions`,
    method: 'get'
  })
}

// 更新角色权限
export const updateRolePermissions = (roleId: number, permissionIds: number[]) => {
  return request({
    url: `/roles/${roleId}/permissions`,
    method: 'post',
    data: {
      permissionIds
    }
  })
} 