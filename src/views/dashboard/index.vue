<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <template #title>
            <span>总访问量</span>
          </template>
          <div class="card-content">
            <h2>1,128</h2>
            <div class="card-footer">
              <span>周同比12%</span>
              <a-tag color="success">增长</a-tag>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <span>用户数量</span>
          </template>
          <div class="card-content">
            <h2>802</h2>
            <div class="card-footer">
              <span>日同比5%</span>
              <a-tag color="warning">下降</a-tag>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <span>订单数量</span>
          </template>
          <div class="card-content">
            <h2>3,256</h2>
            <div class="card-footer">
              <span>月同比20%</span>
              <a-tag color="success">增长</a-tag>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <template #title>
            <span>销售额</span>
          </template>
          <div class="card-content">
            <h2>¥25,630</h2>
            <div class="card-footer">
              <span>年同比15%</span>
              <a-tag color="success">增长</a-tag>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.dashboard {
  height: 100%;
  overflow: auto;
}

.card-content {
  text-align: center;
}

.card-content h2 {
  font-size: 24px;
  margin: 16px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  color: rgba(0,0,0,.45);
}
</style> 