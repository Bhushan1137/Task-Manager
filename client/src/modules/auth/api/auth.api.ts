import { apiClient } from '../../../shared/lib/axios';
import { AuthResponse, User } from '../types/auth.types';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export const authApi = {
  async register(data: Omit<RegisterFormData, 'confirmPassword'>): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data.data.user;
  },

  async login(data: LoginFormData): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<AuthResponse>('/auth/me');
    return response.data.data.user;
  },
};
