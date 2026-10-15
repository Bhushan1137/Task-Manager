import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth.api';
import { useAuth } from './useAuth';
import { LoginFormData } from '../schemas/auth.schema';
import { ROUTES } from '../../../shared/constants/routes';

interface ErrorResponse {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const useLogin = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (user) => {
      setUser(user);
      queryClient.clear();
      toast.success(`Welcome back, ${user.name}!`);
      navigate(ROUTES.TASKS, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || 'Failed to log in. Please check your credentials.';
      toast.error(message);
    },
  });
};
