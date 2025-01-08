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
  page_size: number
  keyword?: string    // 搜索关键词
  status?: number     // 用户状态：0禁用，1正常，2待审核
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
  return request<{
    users: UserInfo[]
    total: number
    page: number
    size: number
  }>({
    url: '/users',
    method: 'get',
    params: {
      page: params.page,
      page_size: params.page_size,
      keyword: params.keyword,
      status: params.status
    }
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

// 更新用户信息
export function updateUserProfile(id: number, data: {
  username: string
  nickname?: string
  email?: string
  phone?: string
  role_id?: number
}) {
  return request({
    url: `/users/${id}/profile`,
    method: 'put',
    data
  })
}

// 获取指定用户信息
export function getUserProfile(id: number) {
  return request<{
    user: {
      username: string
      nickname: string
      email: string
      phone: string
      role_id: number
    }
  }>({
    url: `/users/${id}/profile`,
    method: 'get'
  })
}

// 创建用户参数接口
export interface CreateUserParams {
  username: string
  password?: string
  nickname?: string
  email?: string
  phone?: string
  role_id?: number
}

// 创建用户
export function createUser(data: CreateUserParams) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
} 