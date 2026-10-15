import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth.api';
import { useAuth } from './useAuth';
import { RegisterFormData } from '../schemas/auth.schema';
import { ROUTES } from '../../../shared/constants/routes';

interface ErrorResponse {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const useRegister = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterFormData) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...registerData } = data;
      return authApi.register(registerData);
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.clear();
      toast.success(`Account created! Welcome, ${user.name}!`);
      navigate(ROUTES.TASKS, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });
};
