import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, FilterStatus } from './types';
import { todoAPI } from './services/todoApi';
import TodoForm from './components/TodoForm';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import ActionBar from './components/ActionBar';
import './styles/App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 过滤后的待办事项
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

  // 统计信息
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [todos]);

  // 加载待办事项
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoAPI.getTodos();
      setTodos(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载待办事项失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加待办事项
  const handleAddTodo = useCallback(async (title: string) => {
    try {
      setError(null);
      const response = await todoAPI.createTodo({ title });
      if (response.data) {
        setTodos(prev => [response.data!, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加待办事项失败');
    }
  }, []);

  // 更新待办事项
  const handleUpdateTodo = useCallback(async (id: number, updates: { title?: string; completed?: boolean }) => {
    try {
      setError(null);
      const response = await todoAPI.updateTodo(id, updates);
      if (response.data) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? response.data! : todo
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新待办事项失败');
    }
  }, []);

  // 删除待办事项
  const handleDeleteTodo = useCallback(async (id: number) => {
    try {
      setError(null);
      await todoAPI.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除待办事项失败');
    }
  }, []);

  // 切换完成状态
  const handleToggleTodo = useCallback(async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await handleUpdateTodo(id, { completed: !todo.completed });
    }
  }, [todos, handleUpdateTodo]);

  // 删除已完成的待办事项
  const handleDeleteCompleted = useCallback(async () => {
    try {
      setError(null);
      await todoAPI.deleteCompleted();
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除已完成事项失败');
    }
  }, []);

  // 删除所有待办事项
  const handleDeleteAll = useCallback(async () => {
    try {
      setError(null);
      await todoAPI.deleteAll();
      setTodos([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除所有事项失败');
    }
  }, []);

  // 组件挂载时加载数据
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>待办事项</h1>
        <div className="stats">
          <span>总计: {stats.total}</span>
          <span>已完成: {stats.completed}</span>
          <span>未完成: {stats.pending}</span>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}

        <TodoForm onAddTodo={handleAddTodo} disabled={loading} />
        
        <FilterBar 
          currentFilter={filter} 
          onFilterChange={setFilter}
          stats={stats}
        />
        
        <TodoList 
          todos={filteredTodos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodo={handleUpdateTodo}
          loading={loading}
        />
        
        <ActionBar 
          onDeleteCompleted={handleDeleteCompleted}
          onDeleteAll={handleDeleteAll}
          hasCompleted={stats.completed > 0}
          hasAny={stats.total > 0}
          disabled={loading}
        />
      </main>
    </div>
  );
}

export default App;