import { Types } from 'mongoose';
import { Task } from './task.model.js';
import { ITask, TaskStats } from './task.types.js';
import { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from './task.schema.js';
import { AppError } from '../../utils/AppError.js';

export interface PaginatedTasksResult {
  tasks: ITask[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class TaskService {
  /**
   * Creates a new task assigned to the authenticated user.
   */
  async createTask(userId: string, input: CreateTaskInput): Promise<ITask> {
    const isDone = input.status === 'done';

    const task = await Task.create({
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      completedAt: isDone ? new Date() : undefined,
      user: new Types.ObjectId(userId),
    });

    return task;
  }

  /**
   * Retrieves paginated, filtered, searched and sorted tasks strictly scoped to the user.
   */
  async getTasks(userId: string, query: ListTasksQuery): Promise<PaginatedTasksResult> {
    const filter: Record<string, unknown> = {
      user: new Types.ObjectId(userId),
    };

    if (query.status && query.status !== 'all') {
      filter['status'] = query.status;
    }

    if (query.priority && query.priority !== 'all') {
      filter['priority'] = query.priority;
    }

    if (query.search && query.search.trim() !== '') {
      // Escape special regex characters to prevent ReDoS and regex injection
      const sanitizedSearch = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter['title'] = { $regex: sanitizedSearch, $options: 'i' };
    }

    const sortDirection = query.order === 'asc' ? 1 : -1;
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };

    if (query.sortBy === 'dueDate') {
      sortOptions = { dueDate: sortDirection, createdAt: -1 };
    } else if (query.sortBy === 'priority') {
      sortOptions = { priority: sortDirection, createdAt: -1 };
    } else {
      sortOptions = { createdAt: sortDirection };
    }

    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOptions).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      tasks,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Retrieves a single task owned by the user.
   */
  async getTaskById(userId: string, taskId: string): Promise<ITask> {
    const task = await Task.findOne({
      _id: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  /**
   * Updates an existing task with partial fields and handles completedAt timestamp logic.
   */
  async updateTask(userId: string, taskId: string, input: UpdateTaskInput): Promise<ITask> {
    const task = await Task.findOne({
      _id: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (input.title !== undefined) {
      task.title = input.title;
    }

    if (input.description !== undefined) {
      task.description = input.description;
    }

    if (input.priority !== undefined) {
      task.priority = input.priority;
    }

    if (input.status !== undefined) {
      if (input.status === 'done' && task.status !== 'done') {
        task.completedAt = new Date();
      } else if (input.status !== 'done') {
        task.completedAt = undefined;
      }
      task.status = input.status;
    }

    if (input.dueDate !== undefined) {
      task.dueDate = input.dueDate ? new Date(input.dueDate) : undefined;
    }

    await task.save();
    return task;
  }

  /**
   * Deletes a task owned by the user.
   */
  async deleteTask(userId: string, taskId: string): Promise<void> {
    const result = await Task.findOneAndDelete({
      _id: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
    });

    if (!result) {
      throw new AppError('Task not found', 404);
    }
  }

  /**
   * Computes task counts for todo, in_progress, done and overdue tasks.
   */
  async getStats(userId: string): Promise<TaskStats> {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();

    const [todo, inProgress, done, overdue, total] = await Promise.all([
      Task.countDocuments({ user: userObjectId, status: 'todo' }),
      Task.countDocuments({ user: userObjectId, status: 'in_progress' }),
      Task.countDocuments({ user: userObjectId, status: 'done' }),
      Task.countDocuments({
        user: userObjectId,
        status: { $ne: 'done' },
        dueDate: { $lt: now },
      }),
      Task.countDocuments({ user: userObjectId }),
    ]);

    return {
      total,
      todo,
      inProgress,
      done,
      overdue,
    };
  }
}

export const taskService = new TaskService();
