import React, { useState } from 'react';
import { Todo } from '../types';
import '../styles/TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updates: { title?: string; completed?: boolean }) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleEditSave = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      await onUpdate({ title: trimmedTitle });
      setIsEditing(false);
    } catch (error) {
      // 错误处理由父组件处理
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <button
          className="toggle-button"
          onClick={onToggle}
          title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? '✓' : '○'}
        </button>

        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              className="edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleEditSave}
              autoFocus
              maxLength={200}
              disabled={isUpdating}
            />
            <div className="edit-actions">
              <button
                className="save-button"
                onClick={handleEditSave}
                disabled={isUpdating || !editTitle.trim()}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                className="cancel-button"
                onClick={handleEditCancel}
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="todo-text" onDoubleClick={handleEditStart}>
            <span className="todo-title">{todo.title}</span>
            <div className="todo-meta">
              <span className="todo-date">
                Created at {formatDate(todo.created_at)}
              </span>
              {todo.updated_at !== todo.created_at && (
                <span className="todo-date">
                  Updated at {formatDate(todo.updated_at)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="todo-actions">
          <button
            className="edit-button"
            onClick={handleEditStart}
            title="编辑"
          >
            ✏️
          </button>
          <button
            className="delete-button"
            onClick={onDelete}
            title="删除"
          >
            🗑️
          </button>
        </div>
      )}
    </li>
  );
};

export default TodoItem;