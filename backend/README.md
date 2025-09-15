# Todo API Backend

一个基于 FastAPI 构建的现代化待办事项管理 API。

## 功能特性

- ✅ 完整的 CRUD 操作（创建、读取、更新、删除）
- 🔍 按状态筛选待办事项（全部、已完成、未完成）
- 🗑️ 批量删除功能（删除已完成、删除全部）
- 📝 数据验证和错误处理
- 🧪 完整的测试覆盖
- 📚 自动生成的 API 文档
- 🔄 CORS 支持

## 技术栈

- **框架**: FastAPI 0.104.1
- **数据库**: SQLite (可轻松切换到 PostgreSQL/MySQL)
- **ORM**: SQLAlchemy 2.0.23
- **数据验证**: Pydantic 2.5.0
- **测试**: pytest + httpx
- **服务器**: Uvicorn

## 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 应用入口
│   ├── config.py            # 配置管理
│   ├── database.py          # 数据库配置
│   ├── models.py            # SQLAlchemy 模型
│   ├── schemas.py           # Pydantic 模式
│   ├── crud.py              # 数据库操作
│   └── routers/
│       ├── __init__.py
│       └── todos.py         # 待办事项路由
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # 测试配置
│   └── test_todos.py        # API 测试
├── .env                     # 环境变量
├── requirements.txt         # Python 依赖
└── README.md               # 项目文档
```

## 快速开始

### 1. 环境要求

- Python 3.8+
- pip

### 2. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 3. 环境配置

项目根目录已包含 `.env` 文件，默认配置如下：

```env
APP_NAME=Todo API
APP_VERSION=1.0.0
DATABASE_URL=sqlite:///./database.db
CORS_ORIGINS=["http://localhost:3000"]
DEBUG=true
```

### 4. 启动服务

```bash
# 开发模式启动
uvicorn app.main:app --reload --port 8000

# 或者指定主机和端口
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. 访问 API

- **API 基础地址**: http://localhost:8000
- **API 文档 (Swagger)**: http://localhost:8000/docs
- **API 文档 (ReDoc)**: http://localhost:8000/redoc
- **健康检查**: http://localhost:8000/health

## API 接口文档

### 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`

### 接口列表

#### 1. 获取所有待办事项

```http
GET /api/v1/todos?status={all|completed|pending}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "title": "学习 FastAPI",
            "completed": false,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

#### 2. 创建待办事项

```http
POST /api/v1/todos
```

**请求体**:
```json
{
    "title": "新的待办事项"
}
```

#### 3. 更新待办事项

```http
PUT /api/v1/todos/{todo_id}
```

**请求体**:
```json
{
    "title": "更新的标题",
    "completed": true
}
```

#### 4. 删除待办事项

```http
DELETE /api/v1/todos/{todo_id}
```

#### 5. 批量删除已完成事项

```http
DELETE /api/v1/todos/completed
```

#### 6. 批量删除所有事项

```http
DELETE /api/v1/todos/all
```

## 运行测试

### 安装测试依赖

测试依赖已包含在 `requirements.txt` 中。

### 运行所有测试

```bash
# 在 backend 目录下运行
pytest

# 显示详细输出
pytest -v

# 显示测试覆盖率
pytest --cov=app

# 生成 HTML 覆盖率报告
pytest --cov=app --cov-report=html
```

### 运行特定测试

```bash
# 运行特定测试文件
pytest tests/test_todos.py

# 运行特定测试函数
pytest tests/test_todos.py::test_create_todo
```

## 数据库

### 数据库模型

**Todo 模型**:
- `id`: 主键，自增整数
- `title`: 任务标题，字符串，必填
- `completed`: 完成状态，布尔值，默认 False
- `created_at`: 创建时间，自动生成
- `updated_at`: 更新时间，自动更新

### 数据库迁移

当前使用 SQLite，数据库表会在应用启动时自动创建。如需切换到其他数据库：

1. 修改 `.env` 文件中的 `DATABASE_URL`
2. 安装相应的数据库驱动
3. 重启应用

**PostgreSQL 示例**:
```env
DATABASE_URL=postgresql://user:password@localhost/todoapp
```

**MySQL 示例**:
```env
DATABASE_URL=mysql+pymysql://user:password@localhost/todoapp
```

## 部署

### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

构建和运行：

```bash
docker build -t todo-api .
docker run -p 8000:8000 todo-api
```

### 生产环境部署

```bash
# 使用 gunicorn + uvicorn workers
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 开发指南

### 添加新的 API 端点

1. 在 `app/schemas.py` 中定义 Pydantic 模式
2. 在 `app/crud.py` 中添加数据库操作函数
3. 在 `app/routers/` 中创建或更新路由文件
4. 在 `app/main.py` 中注册新路由
5. 编写相应的测试用例

### 代码风格

- 使用 Python 类型提示
- 遵循 PEP 8 代码规范
- 为所有函数添加文档字符串
- 保持函数简洁，单一职责

### 错误处理

所有 API 端点都包含适当的错误处理：

- 400: 请求参数错误
- 404: 资源不存在
- 422: 数据验证失败
- 500: 服务器内部错误

## 性能优化

- 使用数据库索引优化查询
- 实现 API 响应缓存
- 使用连接池管理数据库连接
- 考虑使用异步数据库驱动

## 安全考虑

- 输入验证通过 Pydantic 自动处理
- CORS 配置限制允许的源域名
- 生产环境建议添加认证和授权
- 使用 HTTPS 加密传输

## 监控和日志

建议在生产环境中添加：

- 结构化日志记录
- 性能监控
- 错误追踪
- 健康检查端点（已实现）

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 运行测试确保通过
5. 提交 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。