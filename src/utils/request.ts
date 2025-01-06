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
    return response.data
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          message.error('没有权限')
          break
        case 404:
          // 不显示 404 错误提示，静默失败
          console.warn('请求的资源不存在:', error.config.url)
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(error.response.data.message || '未知错误')
      }
    } else if (error.code === 'ECONNABORTED') {
      message.error('请求超时，请稍后重试')
    } else {
      // 网络错误等静默失败
      console.warn('请求失败:', error)
    }
    return Promise.reject(error)
  }
)

export default request 