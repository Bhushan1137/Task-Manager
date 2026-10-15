import React from 'react';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { Task } from '../types/task.types';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task?: Task | null;
  isLoading?: boolean;
}

export const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  task,
  isLoading = false,
}) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Task"
      description={`Are you sure you want to permanently delete "${
        task?.title || 'this task'
      }"? This action cannot be undone.`}
      confirmText="Delete Task"
      cancelText="Cancel"
      variant="danger"
      isLoading={isLoading}
    />
  );
};
