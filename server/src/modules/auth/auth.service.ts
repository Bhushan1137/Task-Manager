import bcrypt from 'bcryptjs';
import { User } from '../users/user.model.js';
import { SafeUser } from '../users/user.types.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { AppError } from '../../utils/AppError.js';
import { signToken } from '../../utils/jwt.utils.js';

export interface AuthResult {
  user: SafeUser;
  token: string;
}

export class AuthService {
  /**
   * Registers a new user, hashes password, and creates JWT.
   */
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new AppError('An account with this email already exists', 409);
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const newUser = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const user: SafeUser = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    const token = signToken({ userId: user.id });

    return { user, token };
  }

  /**
   * Logs in a user with email and password.
   */
  async login(input: LoginInput): Promise<AuthResult> {
    const userDoc = await User.findOne({ email: input.email }).select('+passwordHash');
    if (!userDoc) {
      // Generic message prevents email enumeration
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, userDoc.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const user: SafeUser = {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };

    const token = signToken({ userId: user.id });

    return { user, token };
  }

  /**
   * Retrieves user profile by ID.
   */
  async getMe(userId: string): Promise<SafeUser> {
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      throw new AppError('User not found', 404);
    }

    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }
}

export const authService = new AuthService();
