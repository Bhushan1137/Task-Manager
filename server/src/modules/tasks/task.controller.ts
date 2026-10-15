import { Request, Response } from 'express';
import { taskService } from './task.service.js';
import { AppError } from '../../utils/AppError.js';
import { ListTasksQuery } from './task.schema.js';

export class TaskController {
  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const task = await taskService.createTask(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: {
        task,
      },
    });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const query = req.query as unknown as ListTasksQuery;
    const result = await taskService.getTasks(req.user.id, query);

    res.status(200).json({
      success: true,
      data: {
        tasks: result.tasks,
      },
      meta: result.meta,
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const task = await taskService.getTaskById(req.user.id, req.params.id as string);

    res.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const task = await taskService.updateTask(
      req.user.id,
      req.params.id as string,
      req.body
    );

    res.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    await taskService.deleteTask(req.user.id, req.params.id as string);

    res.status(200).json({
      success: true,
      data: {
        message: 'Task deleted successfully',
      },
    });
  };

  getStats = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const stats = await taskService.getStats(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        stats,
      },
    });
  };
}

export const taskController = new TaskController();
