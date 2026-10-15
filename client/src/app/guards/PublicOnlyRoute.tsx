import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { Spinner } from '../../shared/components/ui/Spinner';
import { ROUTES } from '../../shared/constants/routes';

export const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.TASKS} replace />;
  }

  return <Outlet />;
};
