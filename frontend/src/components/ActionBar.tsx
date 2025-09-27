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
          title={hasCompleted ? 'Clear completed todos' : 'No completed todos'}
        >
          {showConfirm === 'completed' ? (
            isDeleting ? 'Deleting...' : 'Confirm delete completed?'
          ) : (
            'Clear Completed'
          )}
        </button>

        <button
          className={`action-button delete-all ${
            showConfirm === 'all' ? 'confirm' : ''
          }`}
          onClick={handleDeleteAll}
          disabled={isDisabled}
          title="Clear all todos"
        >
          {showConfirm === 'all' ? (
            isDeleting ? 'Deleting...' : 'Confirm delete all?'
          ) : (
            'Clear All'
          )}
        </button>

        {showConfirm && (
          <button
            className="action-button cancel"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-message">
          <span className="warning-icon">⚠️</span>
          <span>
            {showConfirm === 'completed'
              ? 'This action will delete all completed todos and cannot be undone.'
              : 'This action will delete all todos and cannot be undone.'
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default ActionBar;