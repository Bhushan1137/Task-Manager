import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError, ValidationErrorItem } from '../utils/AppError.js';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed && typeof parsed === 'object') {
        if ('body' in parsed && parsed.body !== undefined) {
          req.body = parsed.body;
        }
        if ('query' in parsed && parsed.query !== undefined) {
          req.query = parsed.query;
        }
        if ('params' in parsed && parsed.params !== undefined) {
          req.params = parsed.params;
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationErrorItem[] = error.errors.map((err) => {
          const pathSegments = err.path.filter(
            (segment) => segment !== 'body' && segment !== 'query' && segment !== 'params'
          );
          return {
            field: pathSegments.length > 0 ? pathSegments.join('.') : err.path.join('.'),
            message: err.message,
          };
        });
        next(new AppError('Validation failed', 400, errors));
      } else {
        next(error);
      }
    }
  };
};
