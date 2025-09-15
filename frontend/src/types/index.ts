// 待办事项接口
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// 创建待办事项请求
export interface TodoCreate {
  title: string;
}

// 更新待办事项请求
export interface TodoUpdate {
  title?: string;
  completed?: boolean;
}

// API响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 错误响应格式
export interface ErrorResponse {
  code: number;
  message: string;
  detail?: string;
}

// 筛选状态类型
export type FilterStatus = 'all' | 'completed' | 'pending';

// 应用状态接口
export interface AppState {
  todos: Todo[];
  filter: FilterStatus;
  loading: boolean;
  error: string | null;
}

// 批量删除响应
export interface DeleteResponse {
  deleted_count: number;
}