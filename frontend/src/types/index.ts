// Todo interface
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Create todo request
export interface TodoCreate {
  title: string;
}

// Update todo request
export interface TodoUpdate {
  title?: string;
  completed?: boolean;
}

// API response format
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// Error response format
export interface ErrorResponse {
  code: number;
  message: string;
  detail?: string;
}

// Filter status type
export type FilterStatus = 'all' | 'completed' | 'pending';

// App state interface
export interface AppState {
  todos: Todo[];
  filter: FilterStatus;
  loading: boolean;
  error: string | null;
}

// Batch delete response
export interface DeleteResponse {
  deleted_count: number;
}