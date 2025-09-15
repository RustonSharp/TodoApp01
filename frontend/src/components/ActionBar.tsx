import React, { useState } from 'react';
import '../styles/ActionBar.css';

interface ActionBarProps {
  onDeleteCompleted: () => void;
  onDeleteAll: () => void;
  hasCompleted: boolean;
  hasAny: boolean;
  disabled?: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onDeleteCompleted,
  onDeleteAll,
  hasCompleted,
  hasAny,
  disabled = false
}) => {
  const [showConfirm, setShowConfirm] = useState<'completed' | 'all' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCompleted = async () => {
    if (showConfirm !== 'completed') {
      setShowConfirm('completed');
      return;
    }

    try {
      setIsDeleting(true);
      await onDeleteCompleted();
      setShowConfirm(null);
    } catch (error) {
      // 错误处理由父组件处理
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (showConfirm !== 'all') {
      setShowConfirm('all');
      return;
    }

    try {
      setIsDeleting(true);
      await onDeleteAll();
      setShowConfirm(null);
    } catch (error) {
      // 错误处理由父组件处理
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(null);
  };

  if (!hasAny) {
    return null;
  }

  const isDisabled = disabled || isDeleting;

  return (
    <div className="action-bar">
      <div className="action-buttons">
        <button
          className={`action-button delete-completed ${
            showConfirm === 'completed' ? 'confirm' : ''
          }`}
          onClick={handleDeleteCompleted}
          disabled={isDisabled || !hasCompleted}
          title={hasCompleted ? '清除已完成的待办事项' : '没有已完成的待办事项'}
        >
          {showConfirm === 'completed' ? (
            isDeleting ? '删除中...' : '确认删除已完成？'
          ) : (
            '清除已完成'
          )}
        </button>

        <button
          className={`action-button delete-all ${
            showConfirm === 'all' ? 'confirm' : ''
          }`}
          onClick={handleDeleteAll}
          disabled={isDisabled}
          title="清除所有待办事项"
        >
          {showConfirm === 'all' ? (
            isDeleting ? '删除中...' : '确认删除全部？'
          ) : (
            '清除全部'
          )}
        </button>

        {showConfirm && (
          <button
            className="action-button cancel"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            取消
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-message">
          <span className="warning-icon">⚠️</span>
          <span>
            {showConfirm === 'completed'
              ? '此操作将删除所有已完成的待办事项，无法撤销。'
              : '此操作将删除所有待办事项，无法撤销。'
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default ActionBar;