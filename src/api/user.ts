import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  message: string
  token: string
  user: {
    id: number
    username: string
    nickname: string
    email: string
    phone: string
    avatar: string
    status: number
    role: {
      id: number
      name: string
      code: string
    }
  }
}

export function login(data: LoginParams) {
  return request<LoginResult>({
    url: '/login',
    method: 'post',
    data
  })
}

// 用户信息接口
export interface UserInfo {
  ID: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: number
  role: {
    ID: number
    name: string
    code: string
  }
  statusLoading?: boolean
}

// 获取用户信息响应
export interface UserInfoResponse {
  user: UserInfo
}

// 获取用户信息
export function getUserInfo() {
  return request<UserInfoResponse>({
    url: '/user/info',
    method: 'get'
  })
}

// 用户列表查询参数
export interface UserListParams {
  page: number
  pageSize: number
  username?: string
  status?: number
}

// 用户列表响应
export interface UserListResult {
  code: number
  msg: string
  data: {
    total: number
    list: UserInfo[]
  }
}

// 获取用户列表
export function getUserList(params: UserListParams) {
  const serverParams = {
    pageNum: params.page,
    pageSize: params.pageSize,
    username: params.username || undefined,
    status: params.status
  }
  
  return request<UserListResult>({
    url: '/users',
    method: 'get',
    params: serverParams
  })
}

// 删除用户
export function deleteUser(id: number) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 更新用户状态
export function updateUserStatus(id: number, status: number) {
  return request({
    url: `/users/${id}/status`,
    method: 'put',
    data: { status }
  })
} 