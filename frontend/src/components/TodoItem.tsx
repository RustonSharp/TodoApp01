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
    return date.toLocaleString('zh-CN', {
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
          title={todo.completed ? '标记为未完成' : '标记为已完成'}
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
                {isUpdating ? '保存中...' : '保存'}
              </button>
              <button
                className="cancel-button"
                onClick={handleEditCancel}
                disabled={isUpdating}
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="todo-text" onDoubleClick={handleEditStart}>
            <span className="todo-title">{todo.title}</span>
            <div className="todo-meta">
              <span className="todo-date">
                创建于 {formatDate(todo.created_at)}
              </span>
              {todo.updated_at !== todo.created_at && (
                <span className="todo-date">
                  更新于 {formatDate(todo.updated_at)}
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