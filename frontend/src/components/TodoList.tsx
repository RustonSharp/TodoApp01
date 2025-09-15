import React from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import '../styles/TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, updates: { title?: string; completed?: boolean }) => void;
  loading?: boolean;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="todo-list">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list">
        <div className="empty-message">
          <div className="empty-icon">📝</div>
          <p>暂无待办事项</p>
          <p className="empty-hint">添加一个新的待办事项开始吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <ul className="todo-items">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => onToggleTodo(todo.id)}
            onDelete={() => onDeleteTodo(todo.id)}
            onUpdate={(updates) => onUpdateTodo(todo.id, updates)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;