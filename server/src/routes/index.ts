import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { taskRoutes } from '../modules/tasks/task.routes.js';

const router = Router();

// Health check endpoint for monitoring & deployment
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Manager API is healthy',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

export const apiRouter = router;
