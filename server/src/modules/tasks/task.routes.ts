import { Router } from 'express';
import { taskController } from './task.controller.js';
import {
  createTaskSchema,
  updateTaskSchema,
  getTaskParamsSchema,
  listTasksQuerySchema,
} from './task.schema.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// Specific paths must precede parameterized :id paths
router.get('/stats', asyncHandler(taskController.getStats));

router.get(
  '/',
  validate(listTasksQuerySchema),
  asyncHandler(taskController.list)
);

router.post(
  '/',
  validate(createTaskSchema),
  asyncHandler(taskController.create)
);

router.get(
  '/:id',
  validate(getTaskParamsSchema),
  asyncHandler(taskController.getById)
);

router.patch(
  '/:id',
  validate(updateTaskSchema),
  asyncHandler(taskController.update)
);

router.delete(
  '/:id',
  validate(getTaskParamsSchema),
  asyncHandler(taskController.delete)
);

export const taskRoutes = router;
