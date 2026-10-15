import React from 'react';
import { Badge } from '../../../shared/components/ui/Badge';
import { TaskStatus } from '../types/task.types';
import { TASK_STATUS_LABELS } from '../constants/task.constants';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const variantMap: Record<TaskStatus, 'neutral' | 'warning' | 'success'> = {
    todo: 'neutral',
    in_progress: 'warning',
    done: 'success',
  };

  return (
    <Badge variant={variantMap[status]} size={size} dot>
      {TASK_STATUS_LABELS[status]}
    </Badge>
  );
};
