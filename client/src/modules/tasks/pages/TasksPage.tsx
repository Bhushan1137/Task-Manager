import React, { useState, useCallback, useEffect, useMemo, lazy, Suspense } from 'react';
import { Plus, LayoutGrid, Kanban, Sparkles } from 'lucide-react';
import { useTasks, useTaskStats } from '../hooks/useTasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useCreateTask } from '../hooks/useCreateTask';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { TaskStatsBar } from '../components/TaskStatsBar';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { TaskKanbanBoard } from '../components/TaskKanbanBoard';
import { TaskSkeleton } from '../components/TaskSkeleton';
import { TaskEmptyState } from '../components/TaskEmptyState';
import { Task, TaskStatus } from '../types/task.types';
import { TaskFormData } from '../schemas/task.schema';
import { Button } from '../../../shared/components/ui/Button';
import { PageContainer } from '../../../shared/components/layout/PageContainer';
import { cn } from '../../../shared/utils/cn';

// Component-level code splitting per Section 7
const TaskFormModal = lazy(() =>
  import('../components/TaskFormModal').then((mod) => ({ default: mod.TaskFormModal }))
);
const DeleteTaskDialog = lazy(() =>
  import('../components/DeleteTaskDialog').then((mod) => ({ default: mod.DeleteTaskDialog }))
);

export const TasksPage: React.FC = () => {
  const { filters, setStatus, setPriority, setSearch, setSort, setPage, resetFilters } =
    useTaskFilters();

  const [viewMode, setViewMode] = useState<'grid' | 'board'>('grid');

  // In Board view, fetch all tasks across columns with higher limit so drag-and-drop always has full context
  const effectiveFilters = useMemo(() => {
    if (viewMode === 'board') {
      return {
        ...filters,
        status: 'all' as const,
        limit: 100,
        page: 1,
      };
    }
    return filters;
  }, [filters, viewMode]);

  const { data: tasksResponse, isLoading: isLoadingTasks, isFetching } = useTasks(effectiveFilters);
  const { data: stats, isLoading: isLoadingStats } = useTaskStats();

  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [initialModalStatus, setInitialModalStatus] = useState<TaskStatus>('todo');

  // Keyboard shortcut 'N' to open new task modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        !isFormModalOpen &&
        !taskToDelete
      ) {
        e.preventDefault();
        setTaskToEdit(null);
        setInitialModalStatus('todo');
        setIsFormModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormModalOpen, taskToDelete]);

  const handleOpenCreateModal = useCallback(() => {
    setTaskToEdit(null);
    setInitialModalStatus('todo');
    setIsFormModalOpen(true);
  }, []);

  const handleKanbanQuickAdd = useCallback((columnStatus: TaskStatus) => {
    setTaskToEdit(null);
    setInitialModalStatus(columnStatus);
    setIsFormModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((task: Task) => {
    setTaskToEdit(task);
    setIsFormModalOpen(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((task: Task) => {
    setTaskToDelete(task);
  }, []);

  const handleToggleTaskStatus = useCallback(
    (task: Task) => {
      const nextStatus = task.status === 'done' ? 'todo' : 'done';
      updateTask({
        id: task.id,
        data: { status: nextStatus },
      });
    },
    [updateTask]
  );

  const handleStatusChange = useCallback(
    (task: Task, newStatus: TaskStatus) => {
      updateTask({
        id: task.id,
        data: { status: newStatus },
      });
    },
    [updateTask]
  );

  const handleDropTask = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      updateTask({
        id: taskId,
        data: { status: newStatus },
      });
    },
    [updateTask]
  );

  const handleFormSubmit = useCallback(
    (formData: TaskFormData) => {
      const payload: Partial<Task> = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? formData.dueDate : undefined,
      };

      if (taskToEdit) {
        updateTask(
          { id: taskToEdit.id, data: payload },
          {
            onSuccess: () => {
              setIsFormModalOpen(false);
              setTaskToEdit(null);
            },
          }
        );
      } else {
        createTask(payload, {
          onSuccess: () => {
            setIsFormModalOpen(false);
          },
        });
      }
    },
    [taskToEdit, updateTask, createTask]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!taskToDelete) return;
    deleteTask(taskToDelete.id, {
      onSuccess: () => {
        setTaskToDelete(null);
      },
    });
  }, [taskToDelete, deleteTask]);

  const tasks = tasksResponse?.data?.tasks ?? [];
  const meta = tasksResponse?.meta ?? { page: 1, limit: 9, total: 0, totalPages: 1 };
  const hasActiveFilters = Boolean(
    (filters.status && filters.status !== 'all') ||
      (filters.priority && filters.priority !== 'all') ||
      (filters.search && filters.search.trim() !== '')
  );

  // Completion calculation
  const totalCount = stats?.total ?? 0;
  const doneCount = stats?.done ?? 0;
  const completionPercentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleViewModeChange = useCallback(
    (mode: 'grid' | 'board') => {
      setViewMode(mode);
      if (mode === 'board') {
        setStatus('all');
      }
    },
    [setStatus]
  );

  return (
    <PageContainer className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            My Tasks
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Keep track of your projects, priorities, and daily deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle: Grid ↔ Board */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => handleViewModeChange('grid')}
              aria-label="Switch to grid view"
              title="Grid View"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all',
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('board')}
              aria-label="Switch to board view"
              title="Kanban Board View"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all',
                viewMode === 'board'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              )}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            leftIcon={<Plus className="h-4 w-4" />}
            rightIcon={
              <kbd className="hidden sm:inline-flex items-center rounded bg-indigo-700/80 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-100">
                N
              </kbd>
            }
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <TaskStatsBar
        stats={stats}
        isLoading={isLoadingStats}
        activeStatus={viewMode === 'board' ? 'all' : filters.status || 'all'}
        onSelectStatus={(selectedStatus) => {
          if (viewMode === 'board') return;
          setStatus(selectedStatus);
        }}
      />

      {/* Dynamic Progress Indicator */}
      {totalCount > 0 && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Overall Progress
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {completionPercentage}% completed ({doneCount} of {totalCount} tasks)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Toolbar / Filters */}
      <TaskFilters
        filters={filters}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onSearchChange={setSearch}
        onSortChange={setSort}
        showStatusTabs={viewMode === 'grid'}
      />

      {/* Main Content Area */}
      {isLoadingTasks ? (
        <TaskSkeleton count={6} />
      ) : tasks.length === 0 ? (
        <TaskEmptyState
          isFiltering={hasActiveFilters}
          onActionClick={handleOpenCreateModal}
          onResetFilters={resetFilters}
        />
      ) : viewMode === 'board' ? (
        /* Board View: Remains firmly on board view on drag & drop or status change */
        <div className={isFetching ? 'opacity-80 transition-opacity' : 'transition-opacity'}>
          <TaskKanbanBoard
            tasks={tasks}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
            onToggleStatus={handleToggleTaskStatus}
            onChangeStatus={handleStatusChange}
            onDropTask={handleDropTask}
            onQuickAdd={handleKanbanQuickAdd}
          />
        </div>
      ) : (
        /* Grid / List View */
        <div className={isFetching ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
          <TaskList
            tasks={tasks}
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            onPageChange={setPage}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
            onToggleStatus={handleToggleTaskStatus}
            onChangeStatus={handleStatusChange}
          />
        </div>
      )}

      {/* Lazy Modals */}
      <Suspense fallback={null}>
        {isFormModalOpen && (
          <TaskFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSubmit={handleFormSubmit}
            taskToEdit={taskToEdit}
            initialStatus={initialModalStatus}
            isLoading={isCreating || isUpdating}
          />
        )}

        {Boolean(taskToDelete) && (
          <DeleteTaskDialog
            isOpen={Boolean(taskToDelete)}
            onClose={() => setTaskToDelete(null)}
            onConfirm={handleDeleteConfirm}
            task={taskToDelete}
            isLoading={isDeleting}
          />
        )}
      </Suspense>
    </PageContainer>
  );
};

export default TasksPage;
