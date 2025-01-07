import request from '@/utils/request'

// 角色信息接口
export interface RoleInfo {
  id: number
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