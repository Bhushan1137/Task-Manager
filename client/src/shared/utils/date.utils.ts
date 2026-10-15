import {
  format,
  isBefore,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
  formatDistanceToNow,
  parseISO,
} from 'date-fns';

export const parseDate = (date: string | Date): Date => {
  return typeof date === 'string' ? parseISO(date) : date;
};

export const formatDate = (date: string | Date): string => {
  try {
    return format(parseDate(date), 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    return format(parseDate(date), 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
};

export const isTaskOverdue = (
  dueDate?: string | Date | null,
  status?: string
): boolean => {
  if (!dueDate || status === 'done') return false;
  const date = parseDate(dueDate);
  return isBefore(date, startOfDay(new Date()));
};

export const getRelativeDueDate = (dueDate?: string | Date | null): string => {
  if (!dueDate) return '';
  const date = parseDate(dueDate);

  if (isToday(date)) return 'Due today';
  if (isTomorrow(date)) return 'Due tomorrow';
  if (isYesterday(date)) return 'Overdue (yesterday)';

  const now = new Date();
  if (isBefore(date, now)) {
    return `${formatDistanceToNow(date)} overdue`;
  }

  return `Due in ${formatDistanceToNow(date)}`;
};
