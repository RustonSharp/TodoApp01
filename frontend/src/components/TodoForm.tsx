import React, { useState, FormEvent } from 'react';
import '../styles/TodoForm.css';

interface TodoFormProps {
  onAddTodo: (title: string) => void;
  disabled?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, disabled = false }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddTodo(trimmedTitle);
      setTitle(''); // 清空输入框
    } catch (error) {
      // 错误处理由父组件处理
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const isDisabled = disabled || isSubmitting;

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="todo-input"
          placeholder="Enter a new todo..."
          value={title}
          onChange={handleInputChange}
          disabled={isDisabled}
          maxLength={200}
          autoFocus
        />
        <button 
          type="submit" 
          className="add-button"
          disabled={isDisabled || !title.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
      {title.length > 180 && (
        <div className="char-count">
          {title.length}/200
        </div>
      )}
    </form>
  );
};

export default TodoForm;