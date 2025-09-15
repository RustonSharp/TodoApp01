# 待办事项应用

一个现代化的待办事项管理应用，采用前后端分离架构，提供完整的任务管理功能。

## 功能特性

- ✅ 添加、编辑、删除待办事项
- ✅ 标记任务完成状态
- ✅ 按状态筛选任务（全部、未完成、已完成）
- ✅ 批量清除功能（清除已完成、清除全部）
- ✅ 现代化响应式UI设计
- ✅ 实时数据统计
- ✅ 双击编辑任务标题
- ✅ 操作确认机制

## 技术栈

### 前端
- **React 18** - 现代化前端框架
- **TypeScript** - 类型安全的JavaScript
- **CSS3** - 现代化样式设计
- **Fetch API** - HTTP请求处理

### 后端
- **FastAPI** - 高性能Python Web框架
- **SQLAlchemy** - Python SQL工具包和ORM
- **Pydantic** - 数据验证和设置管理
- **SQLite** - 轻量级数据库

## 项目结构

```
TodoApp01/
├── backend/                 # 后端目录
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI应用入口
│   │   ├── models.py       # 数据模型
│   │   ├── database.py     # 数据库配置
│   │   ├── crud.py         # 数据库操作
│   │   ├── schemas.py      # Pydantic模型
│   │   └── routers/
│   │       └── todos.py    # 待办事项路由
│   ├── tests/              # 测试文件
│   ├── requirements.txt    # Python依赖
│   └── database.db         # SQLite数据库文件
└── frontend/               # 前端目录
    ├── public/
    │   └── index.html      # HTML模板
    ├── src/
    │   ├── components/     # React组件
    │   │   ├── TodoForm.tsx
    │   │   ├── TodoList.tsx
    │   │   ├── TodoItem.tsx
    │   │   ├── FilterBar.tsx
    │   │   └── ActionBar.tsx
    │   ├── services/       # API服务
    │   │   └── todoApi.ts
    │   ├── types/          # TypeScript类型定义
    │   │   └── index.ts
    │   ├── styles/         # CSS样式文件
    │   ├── App.tsx         # 主应用组件
    │   └── index.tsx       # 应用入口
    ├── package.json        # 前端依赖
    └── tsconfig.json       # TypeScript配置
```

## 快速开始

### 环境要求

- Node.js 16+
- Python 3.8+
- npm 或 yarn

### 后端启动

1. 进入后端目录：
```bash
cd backend
```

2. 创建虚拟环境（推荐）：
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 启动后端服务：
```bash
uvicorn app.main:app --reload --port 8000
```

后端服务将在 http://localhost:8000 启动
API文档可在 http://localhost:8000/docs 查看

### 前端启动

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动前端服务：
```bash
npm start
```

前端应用将在 http://localhost:3000 启动

## API接口

### 基础信息
- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`

### 接口列表

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/todos` | 获取待办事项列表 |
| POST | `/todos` | 创建待办事项 |
| PUT | `/todos/{id}` | 更新待办事项 |
| DELETE | `/todos/{id}` | 删除待办事项 |
| DELETE | `/todos/completed` | 删除已完成事项 |
| DELETE | `/todos/all` | 删除所有事项 |

### 查询参数

- `status`: 筛选状态 (`all` | `completed` | `pending`)

### 请求示例

#### 创建待办事项
```bash
curl -X POST "http://localhost:8000/api/v1/todos" \
     -H "Content-Type: application/json" \
     -d '{"title": "学习React"}'
```

#### 更新待办事项
```bash
curl -X PUT "http://localhost:8000/api/v1/todos/1" \
     -H "Content-Type: application/json" \
     -d '{"completed": true}'
```

## 数据库设计

### todos表结构

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主键，自增ID |
| title | TEXT | NOT NULL | 任务标题 |
| completed | BOOLEAN | NOT NULL DEFAULT FALSE | 完成状态 |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 更新时间 |

## 组件说明

### 前端组件架构

```
App
├── Header (统计信息)
├── TodoForm (添加表单)
├── FilterBar (状态筛选)
├── TodoList (列表容器)
│   └── TodoItem (单个事项)
└── ActionBar (批量操作)
```

### 核心组件功能

- **App**: 应用根组件，管理全局状态和API调用
- **TodoForm**: 新增待办事项表单，支持输入验证
- **FilterBar**: 状态筛选器，显示各状态统计
- **TodoList**: 待办事项列表容器，处理加载和空状态
- **TodoItem**: 单个待办事项，支持编辑、切换状态、删除
- **ActionBar**: 批量操作按钮，支持确认机制

## 特色功能

### 1. 智能状态管理
- 使用React Hooks进行状态管理
- 实时统计和过滤
- 乐观更新机制

### 2. 用户体验优化
- 响应式设计，支持移动端
- 加载状态和错误处理
- 操作确认和撤销机制
- 双击编辑功能

### 3. 现代化UI设计
- 简洁的Material Design风格
- 流畅的动画效果
- 直观的视觉反馈
- 无障碍访问支持

## 测试

### 后端测试

```bash
cd backend
python -m pytest tests/ -v
```

### 前端测试

```bash
cd frontend
npm test
```

## 部署

### 后端部署

1. 使用Docker：
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. 使用Gunicorn：
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### 前端部署

1. 构建生产版本：
```bash
npm run build
```

2. 使用Nginx部署：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8000;
    }
}
```

## 开发指南

### 代码规范

- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier配置
- 组件使用函数式组件和Hooks
- API使用RESTful设计原则

### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 常见问题

### Q: 如何修改API端口？
A: 修改后端的启动命令中的`--port`参数，同时更新前端`todoApi.ts`中的`API_BASE_URL`。

### Q: 如何添加新的筛选条件？
A: 在`types/index.ts`中扩展`FilterStatus`类型，然后在`FilterBar`组件和API服务中添加相应逻辑。

### Q: 如何自定义样式主题？
A: 修改`styles/App.css`中的CSS变量，所有组件都会自动应用新的主题色彩。

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 更新日志

### v1.0.0 (2025-09-15)
- ✨ 初始版本发布
- ✨ 完整的CRUD功能
- ✨ 响应式UI设计
- ✨ TypeScript支持
- ✨ 完整的API文档