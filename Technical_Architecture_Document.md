# Todo App Technical Architecture Document

## 1. Project Overview

This project is a modern todo management application that uses a front-end and back-end separation architecture, providing complete task management functionality.

### 1.1 Features
- Add, edit, delete todo items
- Mark task completion status
- Filter tasks by status (all, pending, completed)
- Batch clearing functionality (clear completed, clear all)
- Modern responsive UI design

### 1.2 Technology Stack
- **Frontend**: React 18+ + TypeScript
- **Backend**: FastAPI + Python 3.8+
- **Database**: SQLite
- **Styling**: CSS3 + Flexbox/Grid

## 2. Project Structure

```
TodoApp01/
├── backend/                 # Backend directory
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI application entry
│   │   ├── models.py       # Data models
│   │   ├── database.py     # Database configuration
│   │   ├── crud.py         # Database operations
│   │   └── schemas.py      # Pydantic models
│   ├── requirements.txt    # Python dependencies
│   └── database.db         # SQLite database file
└── frontend/                     # Frontend directory
    ├── public/
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API services
    │   ├── types/          # TypeScript type definitions
    │   ├── styles/         # CSS style files
    │   ├── App.tsx         # Main application component
    │   └── index.tsx       # Application entry
    ├── package.json        # Frontend dependencies
    └── tsconfig.json       # TypeScript configuration
```

## 3. Database Design

### 3.1 Table Structure Design

#### todos table
Stores core information for todo items

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Primary key, auto-increment ID |
| title | TEXT | NOT NULL | Task title |
| completed | BOOLEAN | NOT NULL DEFAULT FALSE | Completion status |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | Update time |

### 3.2 SQL Statements

#### Create Table
```sql
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
```

#### Trigger (Auto-update timestamp)
```sql
CREATE TRIGGER IF NOT EXISTS update_todos_timestamp 
AFTER UPDATE ON todos
FOR EACH ROW
BEGIN
    UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

## 4. API Interface Design

### 4.1 Basic Information
- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`
- **Response Format**: JSON

### 4.2 Interface List

#### 4.2.1 Get All Todo Items
```http
GET /todos
```

**Query Parameters**:
- `status` (optional): `all` | `completed` | `pending` - Filter status

**Response Example**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "title": "Learn React",
            "completed": false,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

#### 4.2.2 Create Todo Item
```http
POST /todos
```

**Request Body**:
```json
{
    "title": "New todo item"
}
```

**Response Example**:
```json
{
    "code": 201,
    "message": "Todo created successfully",
    "data": {
        "id": 2,
        "title": "New todo item",
        "completed": false,
        "created_at": "2024-01-15T11:00:00Z",
        "updated_at": "2024-01-15T11:00:00Z"
    }
}
```

#### 4.2.3 Update Todo Item
```http
PUT /todos/{todo_id}
```

**Request Body**:
```json
{
    "title": "Updated title",
    "completed": true
}
```

**Response Example**:
```json
{
    "code": 200,
    "message": "Todo updated successfully",
    "data": {
        "id": 1,
        "title": "Updated title",
        "completed": true,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T12:00:00Z"
    }
}
```

#### 4.2.4 Delete Todo Item
```http
DELETE /todos/{todo_id}
```

**Response Example**:
```json
{
    "code": 200,
    "message": "Todo deleted successfully"
}
```

#### 4.2.5 Batch Delete Completed Items
```http
DELETE /todos/completed
```

**Response Example**:
```json
{
    "code": 200,
    "message": "Completed todos deleted successfully",
    "data": {
        "deleted_count": 3
    }
}
```

#### 4.2.6 Batch Delete All Items
```http
DELETE /todos/all
```

**Response Example**:
```json
{
    "code": 200,
    "message": "All todos deleted successfully",
    "data": {
        "deleted_count": 10
    }
}
```

### 4.3 Error Response Format
```json
{
    "code": 400,
    "message": "Error description",
    "detail": "Detailed error information"
}
```

## 5. Frontend Technical Architecture

### 5.1 Technology Stack Details
- **React 18**: Using functional components and Hooks
- **TypeScript**: Providing type safety
- **CSS3**: Modern styling with Flexbox and Grid support
- **Fetch API**: HTTP request handling

### 5.2 Component Design

#### 5.2.1 Component Hierarchy
```
App
├── Header
├── TodoForm
├── FilterBar
├── TodoList
│   └── TodoItem
└── ActionBar
```

#### 5.2.2 Core Component Descriptions

**App Component**
- Root application component
- Manages global state (todos list, current filter status)
- Handles API calls

**TodoForm Component**
- Form for adding new todo items
- Contains input field and add button
- Form validation and submission handling

**TodoList Component**
- Container for todo items list
- Displays todos based on filter criteria

**TodoItem Component**
- Individual todo item
- Contains complete button, delete button
- Supports completion status toggle

**FilterBar Component**
- Filter criteria selection (all, pending, completed)

**ActionBar Component**
- Batch operation buttons (clear completed, clear all)

### 5.3 State Management
Using React Hooks for state management:
- `useState`: Manage component local state
- `useEffect`: Handle side effects (API calls, DOM operations)
- `useCallback`: Optimize callback function performance
- `useMemo`: Cache computation results, optimize performance

#### 5.3.1 Global State Structure
```typescript
interface AppState {
  todos: Todo[];
  filter: 'all' | 'completed' | 'pending';
  loading: boolean;
  error: string | null;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

#### 5.3.2 Custom Hooks
```typescript
// useTodos Hook - Manage todo state
const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'pending':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return {
    todos,
    filteredTodos,
    filter,
    loading,
    error,
    setTodos,
    setFilter,
    setLoading,
    setError
  };
};
```

### 5.4 API Service Layer Design

#### 5.4.1 API Service Encapsulation
```typescript
// services/todoApi.ts
const API_BASE_URL = 'http://localhost:8000/api/v1';

class TodoAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getTodos(status?: string): Promise<ApiResponse<Todo[]>> {
    const query = status ? `?status=${status}` : '';
    return this.request(`/todos${query}`);
  }

  async createTodo(title: string): Promise<ApiResponse<Todo>> {
    return this.request('/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<ApiResponse<Todo>> {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTodo(id: number): Promise<ApiResponse<void>> {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteCompleted(): Promise<ApiResponse<{ deleted_count: number }>> {
    return this.request('/todos/completed', {
      method: 'DELETE',
    });
  }

  async deleteAll(): Promise<ApiResponse<{ deleted_count: number }>> {
    return this.request('/todos/all', {
      method: 'DELETE',
    });
  }
}

export const todoAPI = new TodoAPI();
```

### 5.5 Style Design Guidelines

#### 5.5.1 Design Principles
- Modern and clean design style
- Responsive layout, mobile-friendly
- Good user interaction feedback

#### 5.5.2 Style Guidelines
```css
/* Main container */
.app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Color theme */
:root {
    --primary-color: #007bff;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --light-gray: #f8f9fa;
    --border-color: #dee2e6;
}

/* Button styles */
.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

## 6. Backend Technical Architecture

### 6.1 FastAPI Application Structure

#### 6.1.1 Core Modules

**main.py** - Application Entry
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.routers import todos

app = FastAPI(title="Todo API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(todos.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    create_tables()
```

**models.py** - Data Models
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Todo(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

**schemas.py** - Pydantic Models
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Task title")

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ApiResponse(BaseModel):
    code: int
    message: str
    data: Optional[any] = None

class ErrorResponse(BaseModel):
    code: int
    message: str
    detail: Optional[str] = None
```

**routers/todos.py** - Route Handling
```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import crud, schemas

router = APIRouter(tags=["todos"])

@router.get("/todos", response_model=schemas.ApiResponse)
async def get_todos(
    status: Optional[str] = Query(None, regex="^(all|completed|pending)$"),
    db: Session = Depends(get_db)
):
    try:
        todos = crud.get_todos(db, status=status)
        return schemas.ApiResponse(
            code=200,
            message="success",
            data=[schemas.TodoResponse.from_orm(todo) for todo in todos]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/todos", response_model=schemas.ApiResponse)
async def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db)
):
    try:
        db_todo = crud.create_todo(db, todo)
        return schemas.ApiResponse(
            code=201,
            message="Todo created successfully",
            data=schemas.TodoResponse.from_orm(db_todo)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/todos/{todo_id}", response_model=schemas.ApiResponse)
async def update_todo(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    db: Session = Depends(get_db)
):
    try:
        db_todo = crud.get_todo(db, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        updated_todo = crud.update_todo(db, todo_id, todo_update)
        return schemas.ApiResponse(
            code=200,
            message="Todo updated successfully",
            data=schemas.TodoResponse.from_orm(updated_todo)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/{todo_id}", response_model=schemas.ApiResponse)
async def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    try:
        db_todo = crud.get_todo(db, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        crud.delete_todo(db, todo_id)
        return schemas.ApiResponse(
            code=200,
            message="Todo deleted successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/completed", response_model=schemas.ApiResponse)
async def delete_completed_todos(db: Session = Depends(get_db)):
    try:
        deleted_count = crud.delete_completed_todos(db)
        return schemas.ApiResponse(
            code=200,
            message="Completed todos deleted successfully",
            data={"deleted_count": deleted_count}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/all", response_model=schemas.ApiResponse)
async def delete_all_todos(db: Session = Depends(get_db)):
    try:
        deleted_count = crud.delete_all_todos(db)
        return schemas.ApiResponse(
            code=200,
            message="All todos deleted successfully",
            data={"deleted_count": deleted_count}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**crud.py** - Database Operations
```python
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate
from typing import List, Optional

def get_todos(db: Session, status: Optional[str] = None) -> List[Todo]:
    query = db.query(Todo)
    
    if status == "completed":
        query = query.filter(Todo.completed == True)
    elif status == "pending":
        query = query.filter(Todo.completed == False)
    # When status is "all" or None, return all records
    
    return query.order_by(Todo.created_at.desc()).all()

def get_todo(db: Session, todo_id: int) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id).first()

def create_todo(db: Session, todo: TodoCreate) -> Todo:
    db_todo = Todo(title=todo.title)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo_update: TodoUpdate) -> Todo:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int) -> bool:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
        return True
    return False

def delete_completed_todos(db: Session) -> int:
    deleted_count = db.query(Todo).filter(Todo.completed == True).count()
    db.query(Todo).filter(Todo.completed == True).delete()
    db.commit()
    return deleted_count

def delete_all_todos(db: Session) -> int:
    deleted_count = db.query(Todo).count()
    db.query(Todo).delete()
    db.commit()
    return deleted_count
```

### 6.2 Dependency Management

**requirements.txt**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-multipart==0.0.6
python-dotenv==1.0.0
```

### 6.3 Database Configuration

**database.py**
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**config.py** - Configuration Management
```python
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    app_name: str = "Todo API"
    app_version: str = "1.0.0"
    database_url: str = "sqlite:///./database.db"
    cors_origins: list = ["http://localhost:3000"]
    debug: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()
```

**.env** - Environment Variable Configuration
```env
APP_NAME=Todo API
APP_VERSION=1.0.0
DATABASE_URL=sqlite:///./database.db
CORS_ORIGINS=["http://localhost:3000"]
DEBUG=true
```

## 7. Project Initialization

### 7.1 Project Creation Script

**init_project.py** - Project Initialization Script
```python
import os
import subprocess
import sys

def create_directory_structure():
    """Create project directory structure"""
    directories = [
        "backend/app",
        "frontend/src/components",
        "frontend/src/services",
        "frontend/src/types",
        "frontend/src/styles",
        "frontend/public"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

def create_backend_files():
    """Create backend basic files"""
    # Create __init__.py files
    init_files = [
        "backend/app/__init__.py",
        "backend/app/routers/__init__.py"
    ]
    
    for file_path in init_files:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.write("")
        print(f"Created file: {file_path}")

def create_frontend_package_json():
    """Create frontend package.json"""
    package_json = '''
{
  "name": "todo-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@types/node": "^16.18.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.0",
    "web-vitals": "^2.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
'''
    
    with open("frontend/package.json", 'w') as f:
        f.write(package_json)
    print("Created frontend/package.json")

def main():
    print("Initializing Todo App project...")
    create_directory_structure()
    create_backend_files()
    create_frontend_package_json()
    print("Project initialization completed!")
    print("\nNext steps:")
    print("1. cd backend && pip install -r requirements.txt")
    print("2. cd frontend && npm install")
    print("3. Start backend: cd backend && uvicorn app.main:app --reload")
    print("4. Start frontend: cd frontend && npm start")

if __name__ == "__main__":
    main()
```

### 7.2 Backend Initialization Script

**init_backend.py** - Backend Initialization Script
```python
import os
import subprocess
import sys

def create_backend_requirements():
    """Create backend requirements.txt"""
    requirements = '''
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-multipart==0.0.6
python-dotenv==1.0.0
'''
    
    with open("backend/requirements.txt", 'w') as f:
        f.write(requirements)
    print("Created backend/requirements.txt")

def create_backend_main_files():
    """Create backend main files"""
    # main.py
    main_py = '''
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.routers import todos

app = FastAPI(title="Todo API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(todos.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    create_tables()
'''
    
    with open("backend/app/main.py", 'w') as f:
        f.write(main_py)
    print("Created backend/app/main.py")
    
    # models.py
    models_py = '''
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Todo(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
'''
    
    with open("backend/app/models.py", 'w') as f:
        f.write(models_py)
    print("Created backend/app/models.py")
    
    # database.py
    database_py = '''
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
'''
    
    with open("backend/app/database.py", 'w') as f:
        f.write(database_py)
    print("Created backend/app/database.py")
    
    # schemas.py
    schemas_py = '''
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Task title")

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ApiResponse(BaseModel):
    code: int
    message: str
    data: Optional[any] = None

class ErrorResponse(BaseModel):
    code: int
    message: str
    detail: Optional[str] = None
'''
    
    with open("backend/app/schemas.py", 'w') as f:
        f.write(schemas_py)
    print("Created backend/app/schemas.py")
    
    # crud.py
    crud_py = '''
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate
from typing import List, Optional

def get_todos(db: Session, status: Optional[str] = None) -> List[Todo]:
    query = db.query(Todo)
    
    if status == "completed":
        query = query.filter(Todo.completed == True)
    elif status == "pending":
        query = query.filter(Todo.completed == False)
    # When status is "all" or None, return all records
    
    return query.order_by(Todo.created_at.desc()).all()

def get_todo(db: Session, todo_id: int) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id).first()

def create_todo(db: Session, todo: TodoCreate) -> Todo:
    db_todo = Todo(title=todo.title)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo_update: TodoUpdate) -> Todo:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int) -> bool:
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
        return True
    return False

def delete_completed_todos(db: Session) -> int:
    deleted_count = db.query(Todo).filter(Todo.completed == True).count()
    db.query(Todo).filter(Todo.completed == True).delete()
    db.commit()
    return deleted_count

def delete_all_todos(db: Session) -> int:
    deleted_count = db.query(Todo).count()
    db.query(Todo).delete()
    db.commit()
    return deleted_count
'''
    
    with open("backend/app/crud.py", 'w') as f:
        f.write(crud_py)
    print("Created backend/app/crud.py")
    
    # Create routers directory and todos.py
    os.makedirs("backend/app/routers", exist_ok=True)
    
    routers_todos_py = '''
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import crud, schemas

router = APIRouter(tags=["todos"])

@router.get("/todos", response_model=schemas.ApiResponse)
async def get_todos(
    status: Optional[str] = Query(None, regex="^(all|completed|pending)$"),
    db: Session = Depends(get_db)
):
    try:
        todos = crud.get_todos(db, status=status)
        return schemas.ApiResponse(
            code=200,
            message="success",
            data=[schemas.TodoResponse.from_orm(todo) for todo in todos]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/todos", response_model=schemas.ApiResponse)
async def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db)
):
    try:
        db_todo = crud.create_todo(db, todo)
        return schemas.ApiResponse(
            code=201,
            message="Todo created successfully",
            data=schemas.TodoResponse.from_orm(db_todo)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/todos/{todo_id}", response_model=schemas.ApiResponse)
async def update_todo(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    db: Session = Depends(get_db)
):
    try:
        db_todo = crud.get_todo(db, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        updated_todo = crud.update_todo(db, todo_id, todo_update)
        return schemas.ApiResponse(
            code=200,
            message="Todo updated successfully",
            data=schemas.TodoResponse.from_orm(updated_todo)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/{todo_id}", response_model=schemas.ApiResponse)
async def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    try:
        db_todo = crud.get_todo(db, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        crud.delete_todo(db, todo_id)
        return schemas.ApiResponse(
            code=200,
            message="Todo deleted successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/completed", response_model=schemas.ApiResponse)
async def delete_completed_todos(db: Session = Depends(get_db)):
    try:
        deleted_count = crud.delete_completed_todos(db)
        return schemas.ApiResponse(
            code=200,
            message="Completed todos deleted successfully",
            data={"deleted_count": deleted_count}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/todos/all", response_model=schemas.ApiResponse)
async def delete_all_todos(db: Session = Depends(get_db)):
    try:
        deleted_count = crud.delete_all_todos(db)
        return schemas.ApiResponse(
            code=200,
            message="All todos deleted successfully",
            data={"deleted_count": deleted_count}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
'''
    
    with open("backend/app/routers/todos.py", 'w') as f:
        f.write(routers_todos_py)
    print("Created backend/app/routers/todos.py")
    
    # Create .env file
    env_content = '''
APP_NAME=Todo API
APP_VERSION=1.0.0
DATABASE_URL=sqlite:///./database.db
CORS_ORIGINS=["http://localhost:3000"]
DEBUG=true
'''
    
    with open("backend/.env", 'w') as f:
        f.write(env_content)
    print("Created backend/.env")

def main():
    print("Initializing backend...")
    create_backend_requirements()
    create_backend_main_files()
    print("Backend initialization completed!")
    print("\nNext steps:")
    print("1. cd backend")
    print("2. pip install -r requirements.txt")
    print("3. uvicorn app.main:app --reload")

if __name__ == "__main__":
    main()
```

### 7.3 Frontend Initialization Script

**init_frontend.py** - Frontend Initialization Script
```python
import os
import subprocess
import sys

def create_frontend_files():
    """Create frontend main files"""
    # App.tsx
    app_tsx = '''
import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import ActionBar from './components/ActionBar';
import Header from './components/Header';
import { Todo } from './types/todo';
import { todoAPI } from './services/todoApi';
import './styles/App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true; // 'all'
  });

  // Fetch todos from API
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await todoAPI.getTodos();
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (title: string) => {
    try {
      const response = await todoAPI.createTodo(title);
      setTodos([...todos, response.data]);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  // Update a todo
  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      const response = await todoAPI.updateTodo(id, updates);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  // Delete completed todos
  const deleteCompleted = async () => {
    try {
      await todoAPI.deleteCompleted();
      setTodos(todos.filter(todo => !todo.completed));
    } catch (err) {
      setError('Failed to delete completed todos');
      console.error(err);
    }
  };

  // Delete all todos
  const deleteAll = async () => {
    try {
      await todoAPI.deleteAll();
      setTodos([]);
    } catch (err) {
      setError('Failed to delete all todos');
      console.error(err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="container">
        <TodoForm onAdd={addTodo} />
        <FilterBar filter={filter} onFilterChange={setFilter} />
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        <TodoList 
          todos={filteredTodos} 
          onUpdate={updateTodo} 
          onDelete={deleteTodo} 
        />
        <ActionBar 
          onDeleteCompleted={deleteCompleted}
          onDeleteAll={deleteAll}
          hasCompleted={todos.some(todo => todo.completed)}
          hasTodos={todos.length > 0}
        />
      </div>
    </div>
  );
}

export default App;
'''
    
    with open("frontend/src/App.tsx", 'w') as f:
        f.write(app_tsx)
    print("Created frontend/src/App.tsx")
    
    # index.tsx
    index_tsx = '''
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'''
    
    with open("frontend/src/index.tsx", 'w') as f:
        f.write(index_tsx)
    print("Created frontend/src/index.tsx")
    
    # Create types directory and todo.ts
    os.makedirs("frontend/src/types", exist_ok=True)
    
    todo_ts = '''
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}
'''
    
    with open("frontend/src/types/todo.ts", 'w') as f:
        f.write(todo_ts)
    print("Created frontend/src/types/todo.ts")
    
    # Create services directory and todoApi.ts
    os.makedirs("frontend/src/services", exist_ok=True)
    
    todo_api_ts = '''
import { Todo, ApiResponse } from '../types/todo';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class TodoAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getTodos(status?: string): Promise<ApiResponse<Todo[]>> {
    const query = status ? `?status=${status}` : '';
    return this.request(`/todos${query}`);
  }

  async createTodo(title: string): Promise<ApiResponse<Todo>> {
    return this.request('/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<ApiResponse<Todo>> {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTodo(id: number): Promise<ApiResponse<void>> {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteCompleted(): Promise<ApiResponse<{ deleted_count: number }>> {
    return this.request('/todos/completed', {
      method: 'DELETE',
    });
  }

  async deleteAll(): Promise<ApiResponse<{ deleted_count: number }>> {
    return this.request('/todos/all', {
      method: 'DELETE',
    });
  }
}

export const todoAPI = new TodoAPI();
'''
    
    with open("frontend/src/services/todoApi.ts", 'w') as f:
        f.write(todo_api_ts)
    print("Created frontend/src/services/todoApi.ts")
    
    # Create styles directory and App.css
    os.makedirs("frontend/src/styles", exist_ok=True)
    
    app_css = '''
/* Main container */
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Container */
.container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

/* Color theme */
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --light-gray: #f8f9fa;
  --border-color: #dee2e6;
}

/* Button styles */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-success {
  background-color: var(--success-color);
  color: white;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-warning {
  background-color: var(--warning-color);
  color: black;
}

/* Form styles */
.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Todo list styles */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item.completed {
  background-color: var(--light-gray);
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #6c757d;
}

.todo-text {
  flex-grow: 1;
  margin: 0 15px;
}

.todo-actions {
  display: flex;
  gap: 8px;
}

/* Filter bar styles */
.filter-bar {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Action bar styles */
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.todo-count {
  color: #6c757d;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

/* Header styles */
.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  color: var(--primary-color);
  margin-bottom: 5px;
}

.header p {
  color: #6c757d;
}

/* Error message */
.error {
  color: var(--danger-color);
  text-align: center;
  margin: 10px 0;
}

/* Loading message */
.loading {
  text-align: center;
  margin: 10px 0;
  color: #6c757d;
}
'''
    
    with open("frontend/src/styles/App.css", 'w') as f:
        f.write(app_css)
    print("Created frontend/src/styles/App.css")
    
    # Create components directory and component files
    os.makedirs("frontend/src/components", exist_ok=True)
    
    # Header.tsx
    header_tsx = '''
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="header">
      <h1>Todo App</h1>
      <p>A simple todo application built with React and FastAPI</p>
    </div>
  );
};

export default Header;
'''
    
    with open("frontend/src/components/Header.tsx", 'w') as f:
        f.write(header_tsx)
    print("Created frontend/src/components/Header.tsx")
    
    # TodoForm.tsx
    todo_form_tsx = '''
import React, { useState } from 'react';

interface TodoFormProps {
  onAdd: (title: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
};

export default TodoForm;
'''
    
    with open("frontend/src/components/TodoForm.tsx", 'w') as f:
        f.write(todo_form_tsx)
    print("Created frontend/src/components/TodoForm.tsx")
    
    # TodoList.tsx
    todo_list_tsx = '''
import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onUpdate, onDelete }) => {
  if (todos.length === 0) {
    return <p className="empty-list">No todos found</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
'''
    
    with open("frontend/src/components/TodoList.tsx", 'w') as f:
        f.write(todo_list_tsx)
    print("Created frontend/src/components/TodoList.tsx")
    
    # TodoItem.tsx
    todo_item_tsx = '''
import React from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const toggleCompleted = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleCompleted}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.title}</span>
      <div className="todo-actions">
        <button
          onClick={() => onDelete(todo.id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
'''
    
    with open("frontend/src/components/TodoItem.tsx", 'w') as f:
        f.write(todo_item_tsx)
    print("Created frontend/src/components/TodoItem.tsx")
    
    # FilterBar.tsx
    filter_bar_tsx = '''
import React from 'react';

interface FilterBarProps {
  filter: 'all' | 'completed' | 'pending';
  onFilterChange: (filter: 'all' | 'completed' | 'pending') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="filter-bar">
      <button
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button
        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
        onClick={() => onFilterChange('pending')}
      >
        Active
      </button>
      <button
        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </button>
    </div>
  );
};

export default FilterBar;
'''
    
    with open("frontend/src/components/FilterBar.tsx", 'w') as f:
        f.write(filter_bar_tsx)
    print("Created frontend/src/components/FilterBar.tsx")
    
    # ActionBar.tsx
    action_bar_tsx = '''
import React from 'react';

interface ActionBarProps {
  onDeleteCompleted: () => void;
  onDeleteAll: () => void;
  hasCompleted: boolean;
  hasTodos: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onDeleteCompleted,
  onDeleteAll,
  hasCompleted,
  hasTodos
}) => {
  return (
    <div className="action-bar">
      <div className="todo-count">
        {/* Todo count could be added here */}
      </div>
      <div className="action-buttons">
        {hasCompleted && (
          <button
            onClick={onDeleteCompleted}
            className="btn btn-warning"
          >
            Clear Completed
          </button>
        )}
        {hasTodos && (
          <button
            onClick={onDeleteAll}
            className="btn btn-danger"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
'''
    
    with open("frontend/src/components/ActionBar.tsx", 'w') as f:
        f.write(action_bar_tsx)
    print("Created frontend/src/components/ActionBar.tsx")

def main():
    print("Initializing frontend...")
    create_frontend_files()
    print("Frontend initialization completed!")
    print("\nNext steps:")
    print("1. cd frontend")
    print("2. npm install")
    print("3. npm start")

if __name__ == "__main__":
    main()
```

## 8. Development and Deployment

### 8.1 Development Environment Setup

#### 8.1.1 Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows
venv\\Scripts\\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn app.main:app --reload
```

#### 8.1.2 Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 8.2 Production Deployment

#### 8.2.1 Backend Production Deployment
```bash
# Install production dependencies
pip install gunicorn

# Start production server
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

#### 8.2.2 Frontend Production Build
```bash
# Build for production
npm run build

# The build output will be in the 'build' directory
```

### 8.3 Docker Deployment

#### 8.3.1 Dockerfile for Backend
```dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 8.3.2 Dockerfile for Frontend
```dockerfile
FROM node:16 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 8.3.3 Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./database.db
    volumes:
      - ./backend:/app
      - ./backend/database.db:/app/database.db

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

## 9. Testing

### 9.1 Backend Testing

#### 9.1.1 Test Setup
```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import get_db, Base
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    return TestClient(app)
```

#### 9.1.2 Todo Tests
```python
# tests/test_todos.py
import pytest
from fastapi.testclient import TestClient

def test_create_todo(client: TestClient):
    response = client.post(
        "/api/v1/todos",
        json={"title": "Test Todo"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Todo created successfully"
    assert data["data"]["title"] == "Test Todo"
    assert data["data"]["completed"] is False

def test_get_todos(client: TestClient):
    # First create a todo
    client.post(
        "/api/v1/todos",
        json={"title": "Test Todo"}
    )
    
    # Then get all todos
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["title"] == "Test Todo"

def test_update_todo(client: TestClient):
    # First create a todo
    create_response = client.post(
        "/api/v1/todos",
        json={"title": "Test Todo"}
    )
    todo_id = create_response.json()["data"]["id"]
    
    # Then update it
    response = client.put(
        f"/api/v1/todos/{todo_id}",
        json={"title": "Updated Todo", "completed": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["title"] == "Updated Todo"
    assert data["data"]["completed"] is True

def test_delete_todo(client: TestClient):
    # First create a todo
    create_response = client.post(
        "/api/v1/todos",
        json={"title": "Test Todo"}
    )
    todo_id = create_response.json()["data"]["id"]
    
    # Then delete it
    response = client.delete(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200
    
    # Verify it's deleted
    get_response = client.get("/api/v1/todos")
    assert len(get_response.json()["data"]) == 0

def test_delete_completed_todos(client: TestClient):
    # Create two todos, one completed
    client.post(
        "/api/v1/todos",
        json={"title": "Active Todo"}
    )
    completed_response = client.post(
        "/api/v1/todos",
        json={"title": "Completed Todo"}
    )
    completed_id = completed_response.json()["data"]["id"]
    
    # Mark one as completed
    client.put(
        f"/api/v1/todos/{completed_id}",
        json={"completed": True}
    )
    
    # Delete completed todos
    response = client.delete("/api/v1/todos/completed")
    assert response.status_code == 200
    assert response.json()["data"]["deleted_count"] == 1
    
    # Verify only active todo remains
    get_response = client.get("/api/v1/todos")
    data = get_response.json()
    assert len(data["data"]) == 1
    assert data["data"][0]["title"] == "Active Todo"

def test_delete_all_todos(client: TestClient):
    # Create multiple todos
    client.post("/api/v1/todos", json={"title": "Todo 1"})
    client.post("/api/v1/todos", json={"title": "Todo 2"})
    
    # Delete all todos
    response = client.delete("/api/v1/todos/all")
    assert response.status_code == 200
    assert response.json()["data"]["deleted_count"] == 2
    
    # Verify all todos are deleted
    get_response = client.get("/api/v1/todos")
    assert len(get_response.json()["data"]) == 0
```

#### 9.1.3 Running Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### 9.2 Frontend Testing

#### 9.2.1 Test Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest
```

#### 9.2.2 Component Tests
```typescript
// src/components/__tests__/TodoForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../TodoForm';

test('allows user to add a new todo', () => {
  const mockOnAdd = jest.fn();
  render(<TodoForm onAdd={mockOnAdd} />);
  
  const input = screen.getByPlaceholderText('Add a new todo...');
  const button = screen.getByText('Add');
  
  fireEvent.change(input, { target: { value: 'New Todo' } });
  fireEvent.click(button);
  
  expect(mockOnAdd).toHaveBeenCalledWith('New Todo');
  expect(input).toHaveValue('');
});

test('does not allow empty todos', () => {
  const mockOnAdd = jest.fn();
  render(<TodoForm onAdd={mockOnAdd} />);
  
  const input = screen.getByPlaceholderText('Add a new todo...');
  const button = screen.getByText('Add');
  
  fireEvent.change(input, { target: { value: '   ' } });
  fireEvent.click(button);
  
  expect(mockOnAdd).not.toHaveBeenCalled();
});
```

```typescript
// src/components/__tests__/TodoItem.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../TodoItem';
import { Todo } from '../../types/todo';

const mockTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  completed: false,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z'
};

test('renders todo item correctly', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  
  render(
    <TodoItem 
      todo={mockTodo} 
      onUpdate={mockOnUpdate} 
      onDelete={mockOnDelete} 
    />
  );
  
  expect(screen.getByText('Test Todo')).toBeInTheDocument();
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});

test('calls onUpdate when checkbox is clicked', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  
  render(
    <TodoItem 
      todo={mockTodo} 
      onUpdate={mockOnUpdate} 
      onDelete={mockOnDelete} 
    />
  );
  
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  
  expect(mockOnUpdate).toHaveBeenCalledWith(1, { completed: true });
});

test('calls onDelete when delete button is clicked', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  
  render(
    <TodoItem 
      todo={mockTodo} 
      onUpdate={mockOnUpdate} 
      onDelete={mockOnDelete} 
    />
  );
  
  const deleteButton = screen.getByText('Delete');
  fireEvent.click(deleteButton);
  
  expect(mockOnDelete).toHaveBeenCalledWith(1);
});
```

#### 9.2.3 Running Tests
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```
