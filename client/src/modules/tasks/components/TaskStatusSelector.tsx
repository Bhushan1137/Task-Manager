import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { TaskStatus } from '../types/task.types';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../constants/task.constants';
import { cn } from '../../../shared/utils/cn';

interface TaskStatusSelectorProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
  className?: string;
  disabled?: boolean;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; bg: string; text: string; dot: string; hover: string }
> = {
  todo: {
    label: TASK_STATUS_LABELS.todo,
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400',
    hover: 'hover:bg-slate-200 dark:hover:bg-slate-700',
  },
  in_progress: {
    label: TASK_STATUS_LABELS.in_progress,
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/50',
  },
  done: {
    label: TASK_STATUS_LABELS.done,
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
  },
};

export const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({
  status,
  onChange,
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = statusConfig[status] || statusConfig.todo;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (newStatus: TaskStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (newStatus !== status) {
      onChange(newStatus);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Click to quickly change task status"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border border-transparent transition-all duration-150',
          current.bg,
          current.text,
          current.hover,
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', current.dot)} />
        <span>{current.label}</span>
        <ChevronDown className="h-3 w-3 shrink-0 opacity-60 transition-transform duration-150" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-1.5 z-30 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95"
        >
          {Object.entries(TASK_STATUS).map(([key, value]) => {
            const isSelected = value === status;
            const config = statusConfig[value as TaskStatus];

            return (
              <button
                key={key}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={(e) => handleSelect(value as TaskStatus, e)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                  isSelected
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', config.dot)} />
                  <span>{config.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
