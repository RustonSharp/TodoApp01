# Todo Frontend

一个基于 React + TypeScript 构建的现代化待办事项管理应用前端。

## 🚀 技术栈

- **React 18** - 现代化的用户界面库
- **TypeScript** - 类型安全的 JavaScript 超集
- **CSS3** - 现代化样式设计
- **Fetch API** - 与后端 API 通信

## 📋 功能特性

### 核心功能
- ✅ 添加新的待办事项
- ✅ 标记待办事项为完成/未完成
- ✅ 编辑待办事项内容
- ✅ 删除单个待办事项
- ✅ 批量删除待办事项

### 高级功能
- 🔍 按状态筛选（全部/进行中/已完成）
- 📊 实时统计显示
- 🎨 现代化 UI 设计
- 📱 响应式布局

## 🛠️ 安装与运行

### 前置要求
- Node.js (版本 14 或更高)
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── ActionBar.tsx   # 操作栏组件
│   ├── FilterBar.tsx   # 筛选栏组件
│   ├── TodoForm.tsx    # 添加表单组件
│   ├── TodoItem.tsx    # 单个待办项组件
│   └── TodoList.tsx    # 待办列表组件
├── services/           # API 服务层
│   └── api.ts         # 后端 API 调用
├── styles/            # 样式文件
│   ├── App.css        # 主应用样式
│   ├── ActionBar.css  # 操作栏样式
│   ├── FilterBar.css  # 筛选栏样式
│   ├── TodoForm.css   # 表单样式
│   ├── TodoItem.css   # 待办项样式
│   └── TodoList.css   # 列表样式
├── types/             # TypeScript 类型定义
│   └── index.ts       # 通用类型定义
├── App.tsx            # 主应用组件
└── index.tsx          # 应用入口
```

## 🔌 API 集成

前端通过 RESTful API 与后端通信：

- `GET /todos` - 获取所有待办事项
- `POST /todos` - 创建新待办事项
- `PUT /todos/{id}` - 更新待办事项
- `DELETE /todos/{id}` - 删除待办事项
- `DELETE /todos/batch` - 批量删除待办事项

## 🎨 组件说明

### TodoForm
用于添加新待办事项的表单组件，包含输入验证和提交处理。

### TodoList
显示待办事项列表，支持加载状态和空状态显示。

### TodoItem
单个待办事项组件，支持编辑、删除、状态切换等操作。

### FilterBar
筛选控制组件，允许用户按状态筛选待办事项。

### ActionBar
批量操作组件，提供全选和批量删除功能。

## 🔧 开发说明

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 React Hooks 最佳实践
- 使用函数式组件
- CSS 模块化设计

### 状态管理
- 使用 React useState 进行本地状态管理
- 通过 props 进行组件间通信
- API 调用统一在 services 层处理

## 🐛 故障排除

### 常见问题

1. **TypeScript 模块找不到错误**
   - 重启 VS Code TypeScript 服务：`Ctrl+Shift+P` → "TypeScript: Restart TS Server"

2. **编译错误**
   - 检查 CSS 文件语法
   - 确保所有导入路径正确

3. **API 连接失败**
   - 确保后端服务在 http://localhost:8000 运行
   - 检查网络连接和 CORS 设置

## 📝 许可证

本项目仅供学习和演示使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

---

**注意**: 确保后端服务正在运行，前端才能正常工作。后端服务地址：http://localhost:8000