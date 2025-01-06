import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

const request = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    console.log('API响应数据:', {
      url: response.config.url,
      data: res
    })
    
    // 登录接口特殊处理
    if (response.config.url?.includes('/login')) {
      return res
    }
    
    // 用户信息接口特殊处理
    if (response.config.url?.includes('/user/info')) {
      return res
    }
    
    // 其他接口通用处理
    if (res) {
      return res
    }

    message.error(res.msg || '请求失败')
    return Promise.reject(new Error(res.msg || '请求失败'))
  },
  (error) => {
    console.error('请求错误:', error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          console.warn('权限不足:', error.config.url)
          break
        case 404:
          console.warn('请求的资源不存在:', error.config.url)
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(error.response.data?.msg || '请求失败')
      }
    }
    return Promise.reject(error)
  }
)

export default request 