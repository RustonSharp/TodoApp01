import { Todo, TodoCreate, TodoUpdate, ApiResponse, DeleteResponse, FilterStatus } from '../types';

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
      const errorData = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status}`,
        detail: response.statusText
      }));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // 获取待办事项列表
  async getTodos(status?: FilterStatus): Promise<ApiResponse<Todo[]>> {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return this.request(`/todos${query}`);
  }

  // 创建待办事项
  async createTodo(todoData: TodoCreate): Promise<ApiResponse<Todo>> {
    return this.request('/todos', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  }

  // 更新待办事项
  async updateTodo(id: number, updates: TodoUpdate): Promise<ApiResponse<Todo>> {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // 删除单个待办事项
  async deleteTodo(id: number): Promise<ApiResponse<void>> {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // 删除已完成的待办事项
  async deleteCompleted(): Promise<ApiResponse<DeleteResponse>> {
    return this.request('/todos/completed', {
      method: 'DELETE',
    });
  }

  // 删除所有待办事项
  async deleteAll(): Promise<ApiResponse<DeleteResponse>> {
    return this.request('/todos/all', {
      method: 'DELETE',
    });
  }
}

export const todoAPI = new TodoAPI();