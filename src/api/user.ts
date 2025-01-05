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

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
} 