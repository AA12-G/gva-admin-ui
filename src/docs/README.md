# GVA Admin Pro 项目文档

## 项目概述

GVA Admin Pro 是一个基于 Vue 3 + TypeScript + Vite 构建的现代化后台管理系统框架。项目采用最新的前端技术栈，遵循最佳实践，提供了一套完整的中后台解决方案。

### 技术栈

- **核心框架：** Vue 3.5.x
- **开发语言：** TypeScript 5.x
- **构建工具：** Vite 6.x
- **UI 组件库：** Ant Design Vue 4.x
- **状态管理：** Pinia 2.x
- **路由管理：** Vue Router 4.x
- **HTTP 客户端：** Axios
- **图标库：** @ant-design/icons-vue

## 项目结构

```
src/
├── api/                # API 接口定义
├── assets/             # 静态资源
├── components/         # 公共组件
├── layout/            # 布局组件
├── router/            # 路由配置
├── stores/            # 状态管理
├── utils/             # 工具函数
├── views/             # 页面组件
└── App.vue            # 根组件
```

## 核心功能

### 1. 用户认证

- 登录/登出功能
- Token 基础认证
- 记住密码功能
- 自动登录
- 登录状态持久化

### 2. 权限管理

- 基于角色的访问控制（RBAC）
- 动态路由生成
- 菜单权限控制
- 按钮级别权限控制

### 3. 布局组件

- 响应式布局
- 可折叠侧边栏
- 面包屑导航
- 用户信息展示
- 动态主题配置

### 4. 仪表盘

- 数据统计展示
- 实时天气信息
- 系统状态监控
- 快捷操作入口

## API 接口规范

### 请求格式

```typescript
interface RequestConfig {
  url: string
  method: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
  headers?: Record<string, string>
}
```

### 响应格式

```typescript
interface ResponseData<T> {
  code: number
  data: T
  message: string
}
```

### 错误处理

系统统一处理了以下 HTTP 状态码：
- 401: 未授权，自动跳转登录页
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器错误

## 开发指南

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 开发环境设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码格式化
pnpm format
```

### 开发规范

1. **命名规范**
   - 组件名：PascalCase
   - 文件名：kebab-case
   - 变量名：camelCase
   - 常量名：UPPER_CASE

2. **代码风格**
   - 使用 TypeScript 强类型
   - 使用 Composition API
   - 遵循 ESLint 规则
   - 使用 Prettier 格式化

3. **提交规范**
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档修改
   - style: 代码格式修改
   - refactor: 代码重构
   - test: 测试用例修改
   - chore: 其他修改

## 部署指南

### 构建

```bash
pnpm build
```

构建产物将生成在 `dist` 目录下。

### 环境变量配置

- `.env`: 默认环境变量
- `.env.development`: 开发环境变量
- `.env.production`: 生产环境变量

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-backend-api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 更新日志

### v1.0.0 (2024-03-04)

- 初始版本发布
- 实现基础框架搭建
- 完成用户认证功能
- 实现仪表盘页面
- 添加实时天气功能

## 维护者

- 项目负责人：[Your Name]
- 技术支持：[Support Email]

## 许可证

[MIT License](LICENSE) 