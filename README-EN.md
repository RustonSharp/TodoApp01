# Todo Application

A modern todo management application with a frontend-backend separation architecture, providing complete task management functionality.

## Features

- ✅ Add, edit, and delete todos
- ✅ Mark tasks as completed
- ✅ Filter tasks by status (all, pending, completed)
- ✅ Bulk clearing functionality (clear completed, clear all)
- ✅ Modern responsive UI design
- ✅ Real-time data statistics
- ✅ Double-click to edit task titles
- ✅ Operation confirmation mechanism

## Tech Stack

### Frontend
- **React 18** - Modern frontend framework
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Modern styling design
- **Fetch API** - HTTP request handling

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Pydantic** - Data validation and settings management
- **SQLite** - Lightweight database

## Project Structure

```
TodoApp01/
├── backend/                 # Backend directory
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI application entry
│   │   ├── models.py       # Data models
│   │   ├── database.py     # Database configuration
│   │   ├── crud.py         # Database operations
│   │   ├── schemas.py      # Pydantic models
│   │   └── routers/
│   │       └── todos.py    # Todo routes
│   ├── tests/              # Test files
│   ├── requirements.txt    # Python dependencies
│   └── database.db         # SQLite database file
└── frontend/               # Frontend directory
    ├── public/
    │   └── index.html      # HTML template
    ├── src/
    │   ├── components/     # React components
    │   │   ├── TodoForm.tsx
    │   │   ├── TodoList.tsx
    │   │   ├── TodoItem.tsx
    │   │   ├── FilterBar.tsx
    │   │   └── ActionBar.tsx
    │   ├── services/       # API services
    │   │   └── todoApi.ts
    │   ├── types/          # TypeScript type definitions
    │   │   └── index.ts
    │   ├── styles/         # CSS style files
    │   ├── App.tsx         # Main application component
    │   └── index.tsx       # Application entry
    ├── package.json        # Frontend dependencies
    └── tsconfig.json       # TypeScript configuration
```

## Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend service:
```bash
uvicorn app.main:app --reload --port 8000
```

The backend service will start at http://localhost:8000
API documentation is available at http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend service:
```bash
npm start
```

The frontend application will start at http://localhost:3000

## API Endpoints

### Basic Information
- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`

### Endpoint List

| Method | Path | Description |
|------|------|------|
| GET | `/todos` | Get todo list |
| POST | `/todos` | Create a todo |
| PUT | `/todos/{id}` | Update a todo |
| DELETE | `/todos/{id}` | Delete a todo |
| DELETE | `/todos/completed` | Delete completed todos |
| DELETE | `/todos/all` | Delete all todos |

### Query Parameters

- `status`: Filter status (`all` | `completed` | `pending`)

### Request Examples

#### Create a Todo
```bash
curl -X POST "http://localhost:8000/api/v1/todos" \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn React"}'
```

#### Update a Todo
```bash
curl -X PUT "http://localhost:8000/api/v1/todos/1" \
     -H "Content-Type: application/json" \
     -d '{"completed": true}'
```

## Database Design

### todos Table Structure

| Field Name | Type | Constraint | Description |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Primary key, auto-increment ID |
| title | TEXT | NOT NULL | Task title |
| completed | BOOLEAN | NOT NULL DEFAULT FALSE | Completion status |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | Update time |

## Component Description

### Frontend Component Architecture

```
App
├── Header (Statistics)
├── TodoForm (Add Form)
├── FilterBar (Status Filter)
├── TodoList (List Container)
│   └── TodoItem (Single Item)
└── ActionBar (Bulk Actions)
```

### Core Component Functions

- **App**: Root application component, manages global state and API calls
- **TodoForm**: Add todo form with input validation
- **FilterBar**: Status filter showing statistics for each status
- **TodoList**: Todo list container handling loading and empty states
- **TodoItem**: Individual todo item supporting edit, toggle status, and delete
- **ActionBar**: Bulk action buttons with confirmation mechanism

## Special Features

### 1. Smart State Management
- Using React Hooks for state management
- Real-time statistics and filtering
- Optimistic update mechanism

### 2. User Experience Optimization
- Responsive design supporting mobile devices
- Loading states and error handling
- Operation confirmation and undo mechanism
- Double-click to edit functionality

### 3. Modern UI Design
- Clean Material Design style
- Smooth animation effects
- Intuitive visual feedback
- Accessibility support

## Testing

### Backend Testing

```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Testing

```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment

1. Using Docker:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. Using Gunicorn:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment

1. Build production version:
```bash
npm run build
```

2. Deploy with Nginx:
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

## Development Guide

### Code Standards

- Use TypeScript for type checking
- Follow ESLint and Prettier configurations
- Use functional components and Hooks
- Follow RESTful design principles for APIs

### Commit Convention

```
feat: New feature
fix: Bug fix
docs: Documentation update
style: Code formatting
refactor: Code refactoring
test: Testing related
chore: Build process or auxiliary tool changes
```

## FAQ

### Q: How to change the API port?
A: Modify the `--port` parameter in the backend startup command, and update the `API_BASE_URL` in the frontend `todoApi.ts`.

### Q: How to add new filter conditions?
A: Extend the `FilterStatus` type in `types/index.ts`, then add corresponding logic in the `FilterBar` component and API service.

### Q: How to customize the style theme?
A: Modify the CSS variables in `styles/App.css`, and all components will automatically apply the new theme colors.

## License

MIT License

## Contributing

Issues and Pull Requests are welcome to improve this project!

## Changelog

### v1.0.0 (2025-09-15)
- ✨ Initial release
- ✨ Complete CRUD functionality
- ✨ Responsive UI design
- ✨ TypeScript support
- ✨ Complete API documentation