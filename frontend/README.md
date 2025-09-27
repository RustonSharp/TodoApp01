# Todo Frontend

A modern todo management application frontend built with React + TypeScript.

## 🚀 Tech Stack

- **React 18** - Modern user interface library
- **TypeScript** - Type-safe JavaScript superset
- **CSS3** - Modern styling design
- **Fetch API** - Communication with backend API

## 📋 Features

### Core Features
- ✅ Add new todos
- ✅ Mark todos as completed/incomplete
- ✅ Edit todo content
- ✅ Delete individual todos
- ✅ Batch delete todos

### Advanced Features
- 🔍 Filter by status (All/In Progress/Completed)
- 📊 Real-time statistics display
- 🎨 Modern UI design
- 📱 Responsive layout

## 🛠️ Installation & Running

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

The application will start at http://localhost:3000

### Build Production Version
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ActionBar.tsx   # Action bar component
│   ├── FilterBar.tsx   # Filter bar component
│   ├── TodoForm.tsx    # Add form component
│   ├── TodoItem.tsx    # Individual todo item component
│   └── TodoList.tsx    # Todo list component
├── services/           # API service layer
│   └── api.ts         # Backend API calls
├── styles/            # Style files
│   ├── App.css        # Main app styles
│   ├── ActionBar.css  # Action bar styles
│   ├── FilterBar.css  # Filter bar styles
│   ├── TodoForm.css   # Form styles
│   ├── TodoItem.css   # Todo item styles
│   └── TodoList.css   # List styles
├── types/             # TypeScript type definitions
│   └── index.ts       # Common type definitions
├── App.tsx            # Main app component
└── index.tsx          # App entry point
```

## 🔌 API Integration

The frontend communicates with the backend through RESTful API:

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo
- `DELETE /todos/batch` - Batch delete todos

## 🎨 Component Description

### TodoForm
Form component for adding new todos, including input validation and submission handling.

### TodoList
Displays the todo list, supporting loading state and empty state display.

### TodoItem
Individual todo component supporting edit, delete, status toggle operations.

### FilterBar
Filter control component that allows users to filter todos by status.

### ActionBar
Batch operation component providing select all and batch delete functionality.

## 🔧 Development Notes

### Code Standards
- Use TypeScript for type checking
- Follow React Hooks best practices
- Use functional components
- Modular CSS design

### State Management
- Use React useState for local state management
- Component communication through props
- API calls handled uniformly in the services layer

## 🐛 Troubleshooting

### Common Issues

1. **TypeScript module not found error**
   - Restart VS Code TypeScript service: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

2. **Compilation errors**
   - Check CSS file syntax
   - Ensure all import paths are correct

3. **API connection failure**
   - Ensure backend service is running at http://localhost:8000
   - Check network connection and CORS settings

## 📝 License

This project is for learning and demonstration purposes only.

## 🤝 Contributing

Issues and Pull Requests are welcome to improve the project.

---

**Note**: Make sure the backend service is running for the frontend to work properly. Backend service address: http://localhost:8000