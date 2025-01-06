import request from '@/utils/request'

// 权限信息
export interface PermissionItem {
  id: number
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  parent_id: number
  path: string
  component: string
  redirect: string
  icon: string
  sort: number
  status: number
  created_at: string
  updated_at: string
}

// 权限列表响应
export interface PermissionListResult {
  total: number
  list: PermissionItem[]
}

// 获取权限列表
export function getPermissionList() {
  return request<PermissionListResult>({
    url: '/permissions',
    method: 'get'
  })
} 