import request from '@/utils/request'

interface WeatherData {
  city: string
  weather: string
  temperature: string
  humidity: string
  winddirection: string
  windpower: string
  reporttime: string
}

// 模拟天气数据
export async function getWeather(): Promise<WeatherData> {
  // 实际项目中这里应该调用真实的天气API
  return {
    city: '广州市',
    weather: '晴',
    temperature: '26',
    humidity: '65',
    winddirection: '东南',
    windpower: '3',
    reporttime: new Date().toISOString()
  }
} 