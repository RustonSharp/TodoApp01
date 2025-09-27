# Todo API Backend

A modern todo management API built with FastAPI.

## Features

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- 🔍 Filter todos by status (all, completed, pending)
- 🗑️ Batch deletion features (delete completed, delete all)
- 📝 Data validation and error handling
- 🧪 Complete test coverage
- 📚 Auto-generated API documentation
- 🔄 CORS support

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: SQLite (easily switchable to PostgreSQL/MySQL)
- **ORM**: SQLAlchemy 2.0.23
- **Data Validation**: Pydantic 2.5.0
- **Testing**: pytest + httpx
- **Server**: Uvicorn

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   └── routers/
│       ├── __init__.py
│       └── todos.py         # Todo routes
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test configuration
│   └── test_todos.py        # API tests
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
└── README.md               # Project documentation
```

## Quick Start

### 1. Requirements

- Python 3.8+
- pip

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Configuration

The project root already includes a `.env` file with default configuration:

```env
APP_NAME=Todo API
APP_VERSION=1.0.0
DATABASE_URL=sqlite:///./database.db
CORS_ORIGINS=["http://localhost:3000"]
DEBUG=true
```

### 4. Start the Server

```bash
# Start in development mode
uvicorn app.main:app --reload --port 8000

# Or specify host and port
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Access the API

- **API Base URL**: http://localhost:8000
- **API Documentation (Swagger)**: http://localhost:8000/docs
- **API Documentation (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Documentation

### Basic Information

- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`

### API Endpoints

#### 1. Get All Todos

```http
GET /api/v1/todos?status={all|completed|pending}
```

**Response Example**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "title": "Learn FastAPI",
            "completed": false,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

#### 2. Create Todo

```http
POST /api/v1/todos
```

**Request Body**:
```json
{
    "title": "New todo item"
}
```

#### 3. Update Todo

```http
PUT /api/v1/todos/{todo_id}
```

**Request Body**:
```json
{
    "title": "Updated title",
    "completed": true
}
```

#### 4. Delete Todo

```http
DELETE /api/v1/todos/{todo_id}
```

#### 5. Batch Delete Completed Todos

```http
DELETE /api/v1/todos/completed
```

#### 6. Batch Delete All Todos

```http
DELETE /api/v1/todos/all
```

## Running Tests

### Install Test Dependencies

Test dependencies are already included in `requirements.txt`.

### Run All Tests

```bash
# Run from the backend directory
pytest

# Show verbose output
pytest -v

# Show test coverage
pytest --cov=app

# Generate HTML coverage report
pytest --cov=app --cov-report=html
```

### Run Specific Tests

```bash
# Run specific test file
pytest tests/test_todos.py

# Run specific test function
pytest tests/test_todos.py::test_create_todo
```

## Database

### Database Models

**Todo Model**:
- `id`: Primary key, auto-incrementing integer
- `title`: Task title, string, required
- `completed`: Completion status, boolean, default False
- `created_at`: Creation time, auto-generated
- `updated_at`: Update time, auto-updated

### Database Migration

Currently using SQLite, database tables are automatically created when the application starts. To switch to another database:

1. Modify `DATABASE_URL` in the `.env` file
2. Install the appropriate database driver
3. Restart the application

**PostgreSQL Example**:
```env
DATABASE_URL=postgresql://user:password@localhost/todoapp
```

**MySQL Example**:
```env
DATABASE_URL=mysql+pymysql://user:password@localhost/todoapp
```

## Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t todo-api .
docker run -p 8000:8000 todo-api
```

### Production Deployment

```bash
# Use gunicorn with uvicorn workers
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Development Guide

### Adding New API Endpoints

1. Define Pydantic schemas in `app/schemas.py`
2. Add database operation functions in `app/crud.py`
3. Create or update route files in `app/routers/`
4. Register new routes in `app/main.py`
5. Write corresponding test cases

### Code Style

- Use Python type hints
- Follow PEP 8 code standards
- Add docstrings to all functions
- Keep functions concise with single responsibility

### Error Handling

All API endpoints include appropriate error handling:

- 400: Request parameter errors
- 404: Resource not found
- 422: Data validation failure
- 500: Server internal error

## Performance Optimization

- Use database indexes to optimize queries
- Implement API response caching
- Use connection pooling for database connections
- Consider using async database drivers

## Security Considerations

- Input validation is automatically handled by Pydantic
- CORS configuration restricts allowed origin domains
- Authentication and authorization recommended for production
- Use HTTPS for encrypted transmission

## Monitoring and Logging

Recommended for production environments:

- Structured logging
- Performance monitoring
- Error tracking
- Health check endpoints (already implemented)

## Contributing Guide

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Run tests to ensure they pass
5. Submit a Pull Request

## License

MIT License

## Contact

For questions or suggestions, please submit an Issue or Pull Request.