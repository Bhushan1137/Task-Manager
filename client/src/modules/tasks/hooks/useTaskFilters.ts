import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { TaskStatus, TaskPriority, TaskFilterParams } from '../types/task.types';

export const useTaskFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TaskFilterParams = useMemo(() => {
    const status = (searchParams.get('status') as TaskStatus | 'all') || 'all';
    const priority = (searchParams.get('priority') as TaskPriority | 'all') || 'all';
    const search = searchParams.get('search') || '';
    const sortBy = (searchParams.get('sortBy') as 'createdAt' | 'dueDate' | 'priority') || 'createdAt';
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);

    return {
      status,
      priority,
      search,
      sortBy,
      order,
      page,
      limit: 9,
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (newParams: Partial<Record<string, string | number | undefined>>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === '' || value === 'all') {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setStatus = useCallback(
    (status: TaskStatus | 'all') => {
      updateFilters({ status, page: 1 });
    },
    [updateFilters]
  );

  const setPriority = useCallback(
    (priority: TaskPriority | 'all') => {
      updateFilters({ priority, page: 1 });
    },
    [updateFilters]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateFilters({ search: search.trim() ? search : undefined, page: 1 });
    },
    [updateFilters]
  );

  const setSort = useCallback(
    (sortBy: 'createdAt' | 'dueDate' | 'priority', order: 'asc' | 'desc') => {
      updateFilters({ sortBy, order, page: 1 });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    setStatus,
    setPriority,
    setSearch,
    setSort,
    setPage,
    resetFilters,
  };
};
