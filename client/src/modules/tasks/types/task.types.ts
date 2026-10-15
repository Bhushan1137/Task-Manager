export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}

export interface TaskFilterParams {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedTasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaskStatsResponse {
  success: boolean;
  data: {
    stats: TaskStats;
  };
}

export interface SingleTaskResponse {
  success: boolean;
  data: {
    task: Task;
  };
}
