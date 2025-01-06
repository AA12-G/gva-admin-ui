import request from '@/utils/request'

// 角色信息
export interface RoleItem {
  id: number
  name: string        // 角色名称
  code: string        // 角色标识
  sort: number        // 排序号
  status: number      // 状态：0-禁用，1-启用
  remark: string      // 备注
  created_at: string  // 创建时间
  updated_at: string  // 更新时间
}

// 角色列表响应
export interface RoleListResult {
  total: number
  list: RoleItem[]
}

// 获取角色列表
export function getRoleList(params: { page: number; pageSize: number }) {
  // 转换参数名称以匹配服务端
  const serverParams = {
    pageNum: params.page,      // 如果服务端使用 pageNum
    pageSize: params.pageSize
  }
  return request<RoleListResult>({
    url: '/roles',
    method: 'get',
    params: serverParams
  })
}

// 新增角色
export function createRole(data: Omit<RoleItem, 'id' | 'created_at' | 'updated_at'>) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(id: number, data: Partial<RoleItem>) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(id: number) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

// 获取角色的权限ID列表
export function getRolePermissions(roleId: number) {
  return request<number[]>({
    url: `/roles/${roleId}/permissions`,
    method: 'get'
  })
}

// 更新角色权限
export function updateRolePermissions(roleId: number, permissionIds: number[]) {
  return request({
    url: `/roles/${roleId}/permissions`,
    method: 'put',
    data: { permissionIds }
  })
} 