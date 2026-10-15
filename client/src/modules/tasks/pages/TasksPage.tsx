import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import { useTasks, useTaskStats } from '../hooks/useTasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useCreateTask } from '../hooks/useCreateTask';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { TaskStatsBar } from '../components/TaskStatsBar';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { TaskSkeleton } from '../components/TaskSkeleton';
import { TaskEmptyState } from '../components/TaskEmptyState';
import { Task } from '../types/task.types';
import { TaskFormData } from '../schemas/task.schema';
import { Button } from '../../../shared/components/ui/Button';
import { PageContainer } from '../../../shared/components/layout/PageContainer';

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

  const { data: tasksResponse, isLoading: isLoadingTasks, isFetching } = useTasks(filters);
  const { data: stats, isLoading: isLoadingStats } = useTaskStats();

  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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
        setIsFormModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormModalOpen, taskToDelete]);

  const handleOpenCreateModal = useCallback(() => {
    setTaskToEdit(null);
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

      {/* Stats Bar */}
      <TaskStatsBar
        stats={stats}
        isLoading={isLoadingStats}
        activeStatus={filters.status || 'all'}
        onSelectStatus={setStatus}
      />

      {/* Toolbar / Filters */}
      <TaskFilters
        filters={filters}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onSearchChange={setSearch}
        onSortChange={setSort}
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
      ) : (
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
