<template>
  <div class="statistic-card">
    <div class="card-header">
      <span class="title">{{ title }}</span>
      <a-tooltip title="指标说明">
        <InfoCircleOutlined />
      </a-tooltip>
    </div>
    <div class="card-content">
      <div class="value">
        <component :is="iconComponent" :style="{ color }" class="prefix-icon" />
        {{ prefix }}{{ formatValue(value) }}{{ suffix }}
      </div>
      <div class="footer">
        <slot name="footer">
          <span>
            同比
            <span :class="['increase', increase >= 0 ? 'up' : 'down']">
              {{ Math.abs(increase) }}{{ suffix }}
            </span>
          </span>
          <span class="trend">
            <component :is="increase >= 0 ? 'RiseOutlined' : 'FallOutlined'" 
              :class="increase >= 0 ? 'up' : 'down'" />
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  InfoCircleOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  AccountBookOutlined
} from '@ant-design/icons-vue'
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  precision: { type: Number, default: 0 },
  prefix: { type: String, default: '' },
  prefixIcon: { type: String, default: '' },
  increase: { type: Number, default: 0 },
  suffix: { type: String, default: '' },
  color: { type: String, default: '#1890ff' }
})

const iconMap = {
  'bar-chart': BarChartOutlined,
  'user': UserOutlined,
  'shopping': ShoppingOutlined,
  'account-book': AccountBookOutlined
}

const iconComponent = computed(() => iconMap[props.prefixIcon])

const formatValue = (val: number) => {
  return val.toFixed(props.precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<style scoped lang="less">
.statistic-card {
  padding: 8px 0;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    color: rgba(0, 0, 0, 0.45);

    .title {
      font-size: 14px;
    }
  }

  .card-content {
    .value {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      font-size: 24px;
      font-weight: 600;

      .prefix-icon {
        font-size: 32px;
        margin-right: 12px;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;

      .increase {
        margin: 0 4px;
        &.up { color: #52c41a; }
        &.down { color: #ff4d4f; }
      }

      .trend {
        .up { color: #52c41a; }
        .down { color: #ff4d4f; }
      }
    }
  }
}
</style> 