import React, { memo } from 'react';
import { Calendar, Check, Edit2, Trash2, Clock } from 'lucide-react';
import { Task } from '../types/task.types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, getRelativeDueDate, isTaskOverdue } from '../../../shared/utils/date.utils';
import { cn } from '../../../shared/utils/cn';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = memo(
  ({ task, onEdit, onDelete, onToggleStatus }) => {
    const isDone = task.status === 'done';
    const overdue = isTaskOverdue(task.dueDate, task.status);
    const relativeDue = getRelativeDueDate(task.dueDate);

    return (
      <div
        className={cn(
          'group relative flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition-all duration-200',
          'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700',
          'dark:bg-slate-900',
          isDone
            ? 'border-slate-200/60 bg-slate-50/50 dark:border-slate-800/60 dark:bg-slate-900/40'
            : 'border-slate-200/80 dark:border-slate-800'
        )}
      >
        <div>
          {/* Header row: Checkbox, Title, Status & Priority */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Quick complete checkbox */}
              <button
                type="button"
                onClick={() => onToggleStatus(task)}
                aria-label={isDone ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-150',
                  isDone
                    ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                    : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/30'
                )}
              >
                {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </button>

              <div className="min-w-0 flex-1">
                <h3
                  className={cn(
                    'text-sm font-semibold tracking-tight transition-colors line-clamp-1',
                    isDone
                      ? 'text-slate-400 line-through dark:text-slate-500'
                      : 'text-slate-900 dark:text-slate-100'
                  )}
                  title={task.title}
                >
                  {task.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={cn(
                'mt-2.5 text-xs line-clamp-2 leading-relaxed',
                isDone
                  ? 'text-slate-400 dark:text-slate-600'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Footer: Due date, Status Badge & Actions */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <StatusBadge status={task.status} />

            {task.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors',
                  overdue
                    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-800'
                )}
                title={`Due: ${formatDate(task.dueDate)} (${relativeDue})`}
              >
                <Calendar className="h-3 w-3 shrink-0" />
                <span>{relativeDue || formatDate(task.dueDate)}</span>
              </span>
            )}

            {isDone && task.completedAt && (
              <span
                className="hidden xl:inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500"
                title={`Completed on ${formatDate(task.completedAt)}`}
              >
                <Clock className="h-3 w-3 shrink-0" />
                <span>Done {formatDate(task.completedAt)}</span>
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(task)}
              aria-label={`Edit task "${task.title}"`}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              aria-label={`Delete task "${task.title}"`}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';
