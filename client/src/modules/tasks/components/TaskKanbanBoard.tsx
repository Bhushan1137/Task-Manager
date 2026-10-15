import React, { useState } from 'react';
import { Plus, ListTodo, Clock, CheckCircle2 } from 'lucide-react';
import { Task, TaskStatus } from '../types/task.types';
import { TaskCard } from './TaskCard';
import { cn } from '../../../shared/utils/cn';

interface TaskKanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  onChangeStatus: (task: Task, newStatus: TaskStatus) => void;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
  onQuickAdd: (status: TaskStatus) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  headerBg: string;
  badgeBg: string;
  borderColor: string;
  accentColor: string;
}

const columns: ColumnConfig[] = [
  {
    id: 'todo',
    title: 'To Do',
    icon: ListTodo,
    headerBg: 'bg-slate-100/90 dark:bg-slate-800/80',
    badgeBg: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    borderColor: 'border-slate-200/90 dark:border-slate-800',
    accentColor: 'text-slate-600 dark:text-slate-400',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: Clock,
    headerBg: 'bg-amber-50/90 dark:bg-amber-950/60',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    borderColor: 'border-amber-200/80 dark:border-amber-900/60',
    accentColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'done',
    title: 'Completed',
    icon: CheckCircle2,
    headerBg: 'bg-emerald-50/90 dark:bg-emerald-950/60',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    borderColor: 'border-emerald-200/80 dark:border-emerald-900/60',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangeStatus,
  onDropTask,
  onQuickAdd,
}) => {
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: task.id, status: task.status }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: TaskStatus) => {
    const related = e.relatedTarget as Node | null;
    if (e.currentTarget.contains(related)) return;
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const parsed = JSON.parse(dataStr);
      const taskId = typeof parsed === 'object' && parsed.id ? parsed.id : dataStr;
      const currentStatus = typeof parsed === 'object' ? parsed.status : undefined;

      if (taskId && currentStatus !== targetStatus) {
        onDropTask(taskId, targetStatus);
      }
    } catch {
      const rawId = e.dataTransfer.getData('text/plain');
      if (rawId) {
        onDropTask(rawId, targetStatus);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:gap-5 md:grid-cols-3 w-full">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;
        const isDragOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            className={cn(
              'flex flex-col rounded-2xl border bg-slate-100/70 dark:bg-slate-900/60 p-3.5 transition-all duration-200',
              'min-h-[500px] h-[calc(100vh-280px)]',
              column.borderColor,
              isDragOver &&
                'ring-2 ring-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 border-indigo-400 scale-[1.005]'
            )}
          >
            {/* Column Header */}
            <div
              className={cn(
                'flex items-center justify-between rounded-xl px-3.5 py-2.5 mb-3 shadow-xs shrink-0',
                column.headerBg
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn('h-4 w-4', column.accentColor)} />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {column.title}
                </h3>
                <span
                  className={cn(
                    'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold',
                    column.badgeBg
                  )}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onQuickAdd(column.id)}
                title={`Add task to ${column.title}`}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-all shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {/* Scrollable Column Cards Container */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {columnTasks.length === 0 ? (
                <div
                  className={cn(
                    'flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/80 p-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 transition-colors',
                    isDragOver &&
                      'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  )}
                >
                  {isDragOver ? 'Drop task to move here' : 'No tasks in this column'}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                    onChangeStatus={onChangeStatus}
                    isDraggable={true}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
