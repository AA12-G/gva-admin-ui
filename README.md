<div align="center">
  <h1>GVA Admin Pro</h1>
  <p>
    <strong>企业级 Vue 3 中后台前端解决方案</strong>
  </p>
  <p>
    基于 Vue 3、TypeScript、Vite、Ant Design Vue 和 Pinia 构建的现代化后台管理系统框架
  </p>
  <p>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5.x-brightgreen.svg" alt="Vue"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.x-646cff.svg" alt="Vite"></a>
    <a href="https://antdv.com/"><img src="https://img.shields.io/badge/Ant%20Design%20Vue-4.x-1677ff.svg" alt="Ant Design Vue"></a>
    <a href="https://pinia.vuejs.org/"><img src="https://img.shields.io/badge/Pinia-2.x-yellow.svg" alt="Pinia"></a>
    <a href="https://github.com/AA12-G/gva-admin-pro/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  </p>
</div>

## 📋 项目介绍

GVA Admin Pro 是一个开箱即用的中后台前端解决方案，基于最新的前端技术栈，内置了大量的常用功能和最佳实践。项目采用模块化设计，代码组织清晰，易于维护和扩展。无论是个人项目还是企业应用，都能满足您的开发需求。

### 🎯 设计目标

- **高效开发**：内置大量开箱即用的组件和功能，提升开发效率
- **安全可靠**：完善的权限管理和安全机制，保障系统安全
- **灵活扩展**：模块化设计，支持业务组件的灵活扩展
- **优秀体验**：基于 Ant Design Vue，提供优秀的用户体验
- **最佳实践**：编码规范、Git 规范、文档规范等最佳实践

### 💡 功能特点

- **用户体验**
  - 响应式布局，支持多端适配
  - 主题定制，支持明暗模式切换
  - 内置动画和过渡效果
  - 统一的错误处理和反馈机制

- **开发体验**
  - TypeScript 全面支持
  - 完善的类型定义和代码提示
  - 规范的代码风格和提交规范
  - 详细的文档和使用示例

- **系统功能**
  - 完整的用户认证流程
  - 细粒度的权限控制
  - 动态路由和菜单
  - 实时数据展示
  - 多样化的图表组件
  - 丰富的表单组件
  - 高性能表格组件
  - 文件上传下载
  - 国际化支持

- **工程化实践**
  - Vite 构建和优化
  - 自动化测试支持
  - 持续集成/持续部署
  - 代码质量监控
  - 性能监控和优化

## ✨ 特性

- 🎯 **技术栈**：采用 Vue 3 + TypeScript + Vite 等最新技术栈
- 🎨 **主题**：可配置的主题和布局，支持暗黑模式
- 🔒 **权限**：完善的权限管理和动态路由
- 📦 **组件**：基于 Ant Design Vue 的高质量组件
- 🔧 **工具**：内置常用工具和最佳实践
- 📱 **响应式**：支持多端适配

## 🚀 快速开始

### 环境准备

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/AA12-G/gva-admin-pro.git

# 进入项目目录
cd gva-admin-ui

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📚 项目结构

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

## 🎯 核心功能

### 🔐 用户认证
- 登录/登出
- Token 认证
- 记住密码
- 自动登录
- 状态持久化

### 🔑 权限管理
- RBAC 权限控制
- 动态路由
- 菜单权限
- 按钮权限

### 📊 数据展示
- 多种图表
- 数据统计
- 实时天气
- 系统监控

### 💡 其他特性
- 响应式设计
- 主题定制
- 国际化
- 错误处理

## 🛠️ 开发指南

### 命名规范
```
Components: PascalCase
Files: kebab-case
Variables: camelCase
Constants: UPPER_CASE
```

### 代码风格
- TypeScript 强类型
- Vue 3 Composition API
- ESLint
- Git Commit 规范

## 📦 构建部署

### 构建命令
```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

### 环境配置
```bash
.env                # 基础配置
.env.development    # 开发环境
.env.production     # 生产环境
```

## 📋 更新日志

### v1.0.0 (2024-03-04)
- ✨ 初始版本发布
- 🎉 基础框架搭建
- 🔒 用户认证功能
- 📊 仪表盘页面
- 🌤️ 实时天气功能

## 👥 维护者

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/AA12-G">
        <sub><b>AA12-G</b></sub>
      </a>
    </td>
  </tr>
</table>

## 📄 许可证

[MIT License](LICENSE) © 2024 AA12-G

## 🤝 贡献指南

欢迎提交 issue 和 PR，让我们一起完善这个项目！

1. Fork 本仓库
2. 创建特性分支
3. 提交代码
4. 创建 Pull Request

## 📮 联系我们

- Email: leiguang721@gmail.com
- GitHub: [AA12-G](https://github.com/AA12-G)

---

<div align="center">

**GVA Admin Pro** © 2024 AA12-G. Released under the [MIT License](./LICENSE).

Authored and maintained by AA12-G.

</div>