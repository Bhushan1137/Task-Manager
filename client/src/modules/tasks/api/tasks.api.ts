import { apiClient } from '../../../shared/lib/axios';
import {
  Task,
  TaskFilterParams,
  PaginatedTasksResponse,
  TaskStatsResponse,
  SingleTaskResponse,
  TaskStats,
} from '../types/task.types';

export const tasksApi = {
  async getTasks(params?: TaskFilterParams): Promise<PaginatedTasksResponse> {
    const response = await apiClient.get<PaginatedTasksResponse>('/tasks', {
      params,
    });
    return response.data;
  },

  async getStats(): Promise<TaskStats> {
    const response = await apiClient.get<TaskStatsResponse>('/tasks/stats');
    return response.data.data.stats;
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    const response = await apiClient.post<SingleTaskResponse>('/tasks', data);
    return response.data.data.task;
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get<SingleTaskResponse>(`/tasks/${id}`);
    return response.data.data.task;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const response = await apiClient.patch<SingleTaskResponse>(`/tasks/${id}`, data);
    return response.data.data.task;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};
