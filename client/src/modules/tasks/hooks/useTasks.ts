import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { TaskFilterParams } from '../types/task.types';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilterParams) => [...taskKeys.lists(), filters] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
};

export const useTasks = (filters: TaskFilterParams) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => tasksApi.getTasks(filters),
    placeholderData: keepPreviousData,
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: () => tasksApi.getStats(),
  });
};
