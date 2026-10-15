import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

interface MongoCastError extends Error {
  name: string;
  path: string;
  value: unknown;
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'An unexpected error occurred. Please try again later.';
  let errors = undefined;

  // AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Mongoose CastError (invalid ObjectId)
  else if ((err as MongoCastError).name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${(err as MongoCastError).path}: ${(err as MongoCastError).value}`;
  }
  // MongoDB Duplicate Key (E11000)
  else if ((err as MongoDuplicateKeyError).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as MongoDuplicateKeyError).keyValue || {})[0] || 'field';
    message = `An account with that ${field} already exists.`;
  } else {
    // Unhandled error logging
    console.error('💥 Unhandled Server Error:', err);
  }

  // Hide internal messages on 500 in production
  if (statusCode === 500 && env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  });
};
