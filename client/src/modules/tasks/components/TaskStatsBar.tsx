import React from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { TaskStats, TaskStatus } from '../types/task.types';

interface TaskStatsBarProps {
  stats?: TaskStats;
  isLoading: boolean;
  activeStatus: TaskStatus | 'all';
  onSelectStatus: (status: TaskStatus | 'all') => void;
}

export const TaskStatsBar: React.FC<TaskStatsBarProps> = ({
  stats,
  isLoading,
  activeStatus,
  onSelectStatus,
}) => {
  const cards = [
    {
      id: 'all' as const,
      label: 'Total Tasks',
      count: stats?.total ?? 0,
      icon: Layers,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-100 dark:border-indigo-900/40',
    },
    {
      id: 'todo' as const,
      label: 'To Do',
      count: stats?.todo ?? 0,
      icon: ListTodo,
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100/70 dark:bg-slate-800/40',
      borderColor: 'border-slate-200/80 dark:border-slate-800',
    },
    {
      id: 'in_progress' as const,
      label: 'In Progress',
      count: stats?.inProgress ?? 0,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50/70 dark:bg-amber-950/40',
      borderColor: 'border-amber-200/70 dark:border-amber-900/40',
    },
    {
      id: 'done' as const,
      label: 'Completed',
      count: stats?.done ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200/70 dark:border-emerald-900/40',
    },
    {
      id: 'overdue' as const,
      label: 'Overdue',
      count: stats?.overdue ?? 0,
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50/70 dark:bg-rose-950/40',
      borderColor: 'border-rose-200/70 dark:border-rose-900/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id === 'overdue' ? 'all' : card.id)}
            className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-150 select-none ${
              card.borderColor
            } ${card.bg} ${
              isSelected
                ? 'ring-2 ring-indigo-500 shadow-sm'
                : 'hover:shadow-sm hover:scale-[1.01]'
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {card.label}
              </span>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </div>

            <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isLoading ? (
                <div className="h-7 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                card.count
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
