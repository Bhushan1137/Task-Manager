import { z } from 'zod';

export const taskStatusEnum = z.enum(['todo', 'in_progress', 'done']);
export const taskPriorityEnum = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(1, 'Title must not be empty')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string()
      .trim()
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional()
      .or(z.literal('')),
    status: taskStatusEnum.default('todo'),
    priority: taskPriorityEnum.default('medium'),
    dueDate: z
      .string()
      .datetime({ message: 'Due date must be a valid ISO date string' })
      .optional()
      .nullable(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format'),
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, 'Title must not be empty')
        .max(100, 'Title cannot exceed 100 characters')
        .optional(),
      description: z
        .string()
        .trim()
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional()
        .or(z.literal('')),
      status: taskStatusEnum.optional(),
      priority: taskPriorityEnum.optional(),
      dueDate: z
        .string()
        .datetime({ message: 'Due date must be a valid ISO date string' })
        .optional()
        .nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const getTaskParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format'),
  }),
});

export const listTasksQuerySchema = z.object({
  query: z.object({
    status: z.enum(['all', 'todo', 'in_progress', 'done']).default('all'),
    priority: z.enum(['all', 'low', 'medium', 'high']).default('all'),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>['query'];
