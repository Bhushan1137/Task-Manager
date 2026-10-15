import React from 'react';
import { Badge } from '../../../shared/components/ui/Badge';
import { TaskPriority } from '../types/task.types';
import { TASK_PRIORITY_LABELS } from '../constants/task.constants';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const variantMap: Record<TaskPriority, 'info' | 'warning' | 'danger'> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
  };

  return (
    <Badge variant={variantMap[priority]} size={size}>
      {TASK_PRIORITY_LABELS[priority]}
    </Badge>
  );
};
