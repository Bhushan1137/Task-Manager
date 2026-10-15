import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

export const createApp = (): Application => {
  const app = express();

  // Trust proxy for secure cookies behind reverse proxies (Render, AWS, Heroku)
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS configuration
  const allowedOrigins = [
    env.CLIENT_URL.replace(/\/+$/, ''),
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, '');
        const isAllowed =
          allowedOrigins.includes(normalized) ||
          normalized.endsWith('.vercel.app');

        if (isAllowed) {
          // Echo back the exact incoming origin to prevent trailing slash mismatch
          callback(null, origin);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // Logging in development/production
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  }

  // Root endpoint & Health checks for Render, load balancers and monitoring
  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'TaskFlow API is running',
    });
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'TaskFlow API is healthy',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API endpoints
  app.use('/api', apiRouter);

  // Handle 404 for undefined routes
  app.use(notFound);

  // Central error handling
  app.use(errorHandler);

  return app;
};
