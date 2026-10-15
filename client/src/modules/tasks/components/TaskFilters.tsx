import React from 'react';
import { ArrowDownUp } from 'lucide-react';
import { TaskFilterParams, TaskStatus, TaskPriority } from '../types/task.types';
import { TaskSearchInput } from './TaskSearchInput';

interface TaskFiltersProps {
  filters: TaskFilterParams;
  onStatusChange: (status: TaskStatus | 'all') => void;
  onPriorityChange: (priority: TaskPriority | 'all') => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sortBy: 'createdAt' | 'dueDate' | 'priority', order: 'asc' | 'desc') => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
  onSortChange,
}) => {
  const statusTabs: Array<{ id: TaskStatus | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ];

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(
      e.target.value as 'createdAt' | 'dueDate' | 'priority',
      filters.order || 'desc'
    );
  };

  const toggleSortOrder = () => {
    const nextOrder = filters.order === 'asc' ? 'desc' : 'asc';
    onSortChange(filters.sortBy || 'createdAt', nextOrder);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-4">
      {/* Top row: Status Tabs & Search */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Segmented Status Tabs */}
        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80 overflow-x-auto"
        >
          {statusTabs.map((tab) => {
            const isActive = (filters.status || 'all') === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <TaskSearchInput
          initialValue={filters.search}
          onSearch={onSearchChange}
        />
      </div>

      {/* Bottom row: Priority & Sort Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Priority:
            </span>
            <select
              value={filters.priority || 'all'}
              onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
              aria-label="Filter by priority"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none transition-colors focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Sort by:
            </span>
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={handleSortFieldChange}
              aria-label="Sort tasks by"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none transition-colors focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            <button
              type="button"
              onClick={toggleSortOrder}
              aria-label={`Sort order: ${filters.order === 'asc' ? 'ascending' : 'descending'}. Click to toggle.`}
              title={`Sort ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowDownUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
