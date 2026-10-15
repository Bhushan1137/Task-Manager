import React from 'react';

export const TaskSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 w-full">
              <div className="h-5 w-5 rounded bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-6 w-14 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
