import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '../shared/lib/queryClient';
import { ThemeProvider, useTheme } from '../shared/hooks/useTheme';
import { AuthProvider } from '../modules/auth/hooks/useAuth';

const ThemedToaster: React.FC = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-right"
      theme={theme}
      richColors
      closeButton
      duration={3500}
    />
  );
};

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
