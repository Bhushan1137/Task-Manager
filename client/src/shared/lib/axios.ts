import axios, { AxiosError } from 'axios';
import { ROUTES } from '../constants/routes';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // If receiving 401 on non-auth paths (or when not on login/register page), redirect to login
    if (error.response?.status === 401) {
      const pathname = window.location.pathname;
      const isAuthPage = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;
      const isAuthCheckRequest = error.config?.url?.includes('/auth/me');

      if (!isAuthPage && !isAuthCheckRequest) {
        window.location.href = ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  }
);
