<template>
  <div class="dashboard">
    <!-- 顶部卡片 -->
    <a-row :gutter="16" class="dashboard-header">
      <a-col :span="6">
        <a-card>
          <div class="stat-card">
            <div class="icon">
              <UserOutlined style="color: #1890ff" />
            </div>
            <div class="content">
              <div class="title">在线用户</div>
              <div class="value">1,234</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <div class="stat-card">
            <div class="icon">
              <ClockCircleOutlined style="color: #52c41a" />
            </div>
            <div class="content">
              <div class="title">系统运行时间</div>
              <div class="value">99.9%</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <div class="stat-card">
            <div class="icon">
              <ApiOutlined style="color: #722ed1" />
            </div>
            <div class="content">
              <div class="title">接口调用</div>
              <div class="value">12,345</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <div class="stat-card">
            <div class="icon">
              <SafetyOutlined style="color: #faad14" />
            </div>
            <div class="content">
              <div class="title">系统状态</div>
              <div class="value">正常</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 欢迎信息和天气 -->
    <a-row :gutter="16" class="dashboard-content">
      <a-col :span="16">
        <a-card class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-text">
              <div class="greeting">
                <h2>{{ greetingMessage }}，{{ username }}</h2>
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

    <!-- 快捷操作 -->
    <a-card title="快捷操作" class="shortcut-card">
      <a-row :gutter="16">
        <a-col :span="6" v-for="action in quickActions" :key="action.title">
          <div class="shortcut-item" @click="action.onClick">
            <component :is="action.icon" />
            <span>{{ action.title }}</span>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  UserOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  FileOutlined,
  KeyOutlined,
  CloudOutlined
} from '@ant-design/icons-vue'
import { getWeather } from '@/api/weather'

const userStore = useUserStore()
const weather = ref({
  city: '广州市',
  weather: '晴',
  temperature: '26',
  humidity: '65',
  winddirection: '东南',
  windpower: '3',
  reporttime: new Date().toISOString()
})

const username = computed(() => {
  return userStore.userInfo?.username || '管理员'
})

const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
})

const weekday = computed(() => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return days[new Date().getDay()]
})

const dailyQuote = ref('生活中最美好的事情就是坚持不懈地追求梦想。')

// 获取天气信息
const fetchWeather = async () => {
  try {
    const data = await getWeather()
    weather.value = data
  } catch (error) {
    console.error('获取天气信息失败:', error)
  }
}

onMounted(() => {
  fetchWeather()
})

const quickActions = [
  { title: '用户管理', icon: TeamOutlined, onClick: () => console.log('用户管理') },
  { title: '系统设置', icon: SettingOutlined, onClick: () => console.log('系统设置') },
  { title: '修改密码', icon: KeyOutlined, onClick: () => console.log('修改密码') },
  { title: '系统文档', icon: FileOutlined, onClick: () => console.log('系统文档') }
]
</script>

<style scoped lang="less">
.dashboard {
  .dashboard-header {
    margin-bottom: 24px;
  }

  .stat-card {
    display: flex;
    align-items: center;

    .icon {
      font-size: 48px;
      margin-right: 16px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 8px;
    }

    .content {
      .title {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 4px;
      }
      .value {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }

  .welcome-card {
    margin-bottom: 24px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);

    .welcome-content {
      .welcome-text {
        .greeting {
          h2 {
            font-size: 28px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }

          p {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 24px;
          }
        }

        .welcome-quote {
          padding: 16px;
          background: rgba(24, 144, 255, 0.05);
          border-left: 4px solid #1890ff;
          border-radius: 0 4px 4px 0;

          p {
            color: #4b5563;
            font-size: 15px;
            font-style: italic;
            margin: 0;
          }
        }
      }
    }
  }

  .shortcut-card {
    .shortcut-item {
      text-align: center;
      padding: 24px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.02);
      }

      .anticon {
        font-size: 32px;
        margin-bottom: 8px;
        display: block;
        color: #1890ff;
      }

      span {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }

  .weather-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);

    .weather-title {
      display: flex;
      align-items: center;
      gap: 8px;
      
      span {
        font-size: 16px;
        font-weight: 500;
        color: #1f2937;
      }
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
        padding: 16px;
        background: #f9fafb;
        border-radius: 8px;

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          
          &:last-child {
            margin-bottom: 0;
          }

          .label {
            color: #6b7280;
            font-size: 14px;
          }

          .value {
            color: #1f2937;
            font-weight: 500;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style> 