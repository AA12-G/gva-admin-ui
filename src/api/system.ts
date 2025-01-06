import request from '@/utils/request'

interface SystemInfo {
  startTime: string      // 系统启动时间
  uptime: number        // 运行时长（秒）
  version: string       // 系统版本
  environment: string   // 运行环境
}

// 获取系统信息
export function getSystemInfo() {
  return request<SystemInfo>({
    url: '/system/info',
    method: 'get'
  })
} 