import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.js';
import { AUTH_COOKIE_NAME } from '../utils/cookie.utils.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../modules/users/user.model.js';
import { SafeUser } from '../modules/users/user.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw new AppError('Session expired or invalid. Please log in again.', 401);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found or account has been removed.', 401);
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (error) {
    next(error);
  }
};
