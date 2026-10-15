import React from 'react';
import { CheckCircle2, SearchX, Plus, RotateCcw } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';

interface TaskEmptyStateProps {
  isFiltering: boolean;
  onActionClick: () => void;
  onResetFilters?: () => void;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({
  isFiltering,
  onActionClick,
  onResetFilters,
}) => {
  if (isFiltering) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
          No matching tasks found
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          No tasks match your current search and filter criteria. Try adjusting your query or filters.
        </p>
        {onResetFilters && (
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset all filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
        No tasks yet
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Get started by creating your very first task. Stay organized and boost your daily productivity.
      </p>
      <div className="mt-6">
        <Button
          variant="primary"
          onClick={onActionClick}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Create your first task
        </Button>
      </div>
    </div>
  );
};
