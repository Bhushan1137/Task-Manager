import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { tasksApi } from '../api/tasks.api';
import { taskKeys } from './useTasks';
import { Task, PaginatedTasksResponse } from '../types/task.types';

interface UpdateTaskArgs {
  id: string;
  data: Partial<Task>;
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskArgs) => tasksApi.updateTask(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      // Snapshot previous lists
      const previousLists = queryClient.getQueriesData<PaginatedTasksResponse>({
        queryKey: taskKeys.lists(),
      });

      // Optimistically update list entries
      queryClient.setQueriesData<PaginatedTasksResponse>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              tasks: old.data.tasks.map((task) =>
                task.id === id ? { ...task, ...data } : task
              ),
            },
          };
        }
      );

      return { previousLists };
    },

    onError: (error: AxiosError<{ message?: string }>, _variables, context) => {
      // Rollback on failure
      if (context?.previousLists) {
        context.previousLists.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData);
        });
      }
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
    },

    onSettled: () => {
      // Refresh to ensure server sync
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
};
