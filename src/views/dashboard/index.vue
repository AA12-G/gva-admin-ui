<template>
  <div class="dashboard">
    <!-- 欢迎卡片和天气 -->
    <a-row :gutter="16" class="dashboard-welcome">
      <a-col :span="16">
        <a-card class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-text">
              <div class="greeting">
                <h2>{{ greetingMessage }}，{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</h2>
                <p>今天是 {{ currentDate }}，{{ weekday }}</p>
              </div>
              <div class="welcome-quote">
                <p>{{ dailyQuote }}</p>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="weather-card">
          <template #title>
            <div class="weather-title">
              <CloudOutlined style="color: #1890ff; font-size: 18px" />
              <span>今日天气</span>
            </div>
          </template>
          <div class="weather-content">
            <div class="weather-main">
              <div class="weather-icon">
                <CloudOutlined style="font-size: 56px; color: #1890ff" />
              </div>
              <div class="weather-info">
                <div class="temperature">{{ weather.temperature }}°</div>
                <div class="weather-text">{{ weather.weather }}</div>
                <div class="city">{{ weather.city }}</div>
              </div>
            </div>
            <div class="weather-details">
              <div class="detail-item">
                <span class="label">湿度</span>
                <span class="value">{{ weather.humidity }}%</span>
              </div>
              <div class="detail-item">
                <span class="label">风向</span>
                <span class="value">{{ weather.winddirection }}</span>
              </div>
              <div class="detail-item">
                <span class="label">风力</span>
                <span class="value">{{ weather.windpower }}级</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 统计卡片 -->
    <a-row :gutter="16" class="dashboard-stats">
      <a-col :span="6">
        <StatisticCard
          title="在线用户"
          :value="1234"
          prefix-icon="user"
          :increase="12"
          suffix="人"
          color="#1890ff"
        />
      </a-col>
      <a-col :span="6">
        <StatisticCard
          title="系统运行时间"
          :value="uptime.days"
          prefix="已运行"
          suffix="天"
          prefix-icon="dashboard"
          :precision="0"
          :increase="0"
          color="#52c41a"
        />
      </a-col>
      <a-col :span="6">
        <StatisticCard
          title="接口调用量"
          :value="apiCalls"
          prefix-icon="api"
          :increase="15"
          suffix="次"
          color="#722ed1"
        />
      </a-col>
      <a-col :span="6">
        <StatisticCard
          title="系统负载"
          :value="45"
          prefix-icon="dashboard"
          :increase="-5"
          suffix="%"
          color="#faad14"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { CloudOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { getSystemInfo } from '@/api/system'
import { getWeather } from '@/api/weather'
import StatisticCard from './components/StatisticCard.vue'

const userStore = useUserStore()

// 欢迎语相关
const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  return '晚上好'
})

const weekdayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const currentDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})
const weekday = computed(() => weekdayMap[new Date().getDay()])

const dailyQuote = ref('业精于勤，荒于嬉；行成于思，毁于随。')

// 系统运行时间
interface UptimeInfo {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const systemStartTime = ref('2024-03-01T00:00:00')
const uptime = ref<UptimeInfo>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

// API调用统计
const apiCalls = ref(12345)

// 天气信息
const weather = ref({
  temperature: '26',
  weather: '晴',
  city: '广州市',
  humidity: '65',
  winddirection: '东南',
  windpower: '3',
  reporttime: new Date().toISOString()
})

// 计算运行时间
const calculateUptime = () => {
  if (!systemStartTime.value) return
  
  const start = new Date(systemStartTime.value).getTime()
  const now = new Date().getTime()
  const diff = Math.floor((now - start) / 1000)
  
  uptime.value = {
    days: Math.floor(diff / (24 * 60 * 60)),
    hours: Math.floor((diff % (24 * 60 * 60)) / (60 * 60)),
    minutes: Math.floor((diff % (60 * 60)) / 60),
    seconds: diff % 60
  }
}

// 获取系统信息
const fetchSystemInfo = async () => {
  try {
    const res = await getSystemInfo()
    systemStartTime.value = res.startTime
    calculateUptime()
  } catch (error) {
    // 静默失败，使用默认值
    console.warn('获取系统信息失败，使用默认值')
    systemStartTime.value = '2024-03-01T00:00:00'
    calculateUptime()
  }
}

// 获取天气信息
const fetchWeather = async () => {
  try {
    const res = await getWeather()
    weather.value = res
  } catch (error) {
    // 静默失败，保持默认值
    console.warn('获取天气信息失败，使用默认值')
  }
}

let timer: NodeJS.Timer | null = null

onMounted(async () => {
  // 使用 Promise.allSettled 替代 Promise.all，避免某个请求失败影响其他请求
  await Promise.allSettled([
    fetchSystemInfo(),
    fetchWeather()
  ])
  
  timer = setInterval(() => {
    calculateUptime()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped lang="less">
.dashboard {
  padding: 24px;

  .dashboard-welcome {
    margin-bottom: 24px;

    .welcome-card {
      .welcome-content {
        .greeting {
          h2 {
            margin-bottom: 8px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 24px;
          }
          p {
            color: rgba(0, 0, 0, 0.45);
            margin-bottom: 16px;
          }
        }
        .welcome-quote {
          color: rgba(0, 0, 0, 0.65);
          font-style: italic;
        }
      }
    }

    .weather-card {
      .weather-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .weather-content {
        .weather-main {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px;
          background: rgba(24, 144, 255, 0.05);
          border-radius: 8px;

          .weather-icon {
            margin-right: 24px;
            padding: 16px;
            background: rgba(24, 144, 255, 0.1);
            border-radius: 12px;
          }

          .weather-info {
            .temperature {
              font-size: 36px;
              font-weight: 600;
              color: #1f2937;
              line-height: 1;
            }

            .weather-text {
              font-size: 18px;
              color: #4b5563;
              margin: 8px 0;
            }

            .city {
              font-size: 14px;
              color: #6b7280;
            }
          }
        }

        .weather-details {
          .detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            
            &:last-child {
              margin-bottom: 0;
            }

            .label {
              color: #6b7280;
            }

            .value {
              color: #1f2937;
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  .dashboard-stats {
    margin-bottom: 24px;
  }
}
</style> 