import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Button } from '../../../shared/components/ui/Button';
import { taskFormSchema, TaskFormData } from '../schemas/task.schema';
import { Task } from '../types/task.types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  taskToEdit?: Task | null;
  isLoading?: boolean;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  isLoading = false,
}) => {
  const isEditing = Boolean(taskToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    },
  });

  // Reset or fill form when opened or taskToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        let formattedDate = '';
        if (taskToEdit.dueDate) {
          formattedDate = new Date(taskToEdit.dueDate).toISOString().split('T')[0] || '';
        }

        reset({
          title: taskToEdit.title,
          description: taskToEdit.description || '',
          status: taskToEdit.status,
          priority: taskToEdit.priority,
          dueDate: formattedDate,
        });
      } else {
        reset({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: '',
        });
      }
    }
  }, [isOpen, taskToEdit, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    // If dueDate is empty string, convert to undefined
    const cleanedData: TaskFormData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };
    onSubmit(cleanedData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      description={
        isEditing
          ? 'Update the details and status of this task'
          : 'Add a new task to your personal board'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
        {/* Title */}
        <Input
          label="Title *"
          placeholder="e.g. Complete quarterly report"
          error={errors.title?.message}
          {...register('title')}
          autoFocus
        />

        {/* Description */}
        <div className="w-full space-y-1.5">
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            placeholder="Add relevant notes, links or acceptance criteria..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
            {...register('description')}
          />
          {errors.description?.message && (
            <p className="text-xs font-medium text-rose-500">{errors.description.message}</p>
          )}
        </div>

        {/* Status & Priority Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </Select>

          <Select label="Priority" error={errors.priority?.message} {...register('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
