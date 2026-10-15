import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
};
