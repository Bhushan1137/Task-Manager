import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { setAuthCookie, clearAuthCookie } from '../../utils/cookie.utils.js';
import { AppError } from '../../utils/AppError.js';

export class AuthController {
  register = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.register(req.body);
    setAuthCookie(res, result.token);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
      },
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.login(req.body);
    setAuthCookie(res, result.token);

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
      },
    });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    clearAuthCookie(res);

    res.status(200).json({
      success: true,
      data: {
        message: 'Successfully logged out',
      },
    });
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const user = await authService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  };
}

export const authController = new AuthController();
