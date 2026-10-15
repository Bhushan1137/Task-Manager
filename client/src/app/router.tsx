import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/components/layout/AppLayout';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { PublicOnlyRoute } from './guards/PublicOnlyRoute';
import { Spinner } from '../shared/components/ui/Spinner';
import { ROUTES } from '../shared/constants/routes';

// Lazy-loaded routes per Section 7
const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../modules/auth/pages/RegisterPage'));
const TasksPage = lazy(() => import('../modules/tasks/pages/TasksPage'));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Spinner size="lg" />
  </div>
);

export const router = createBrowserRouter([
  // Public-only authentication routes
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },

  // Protected routes inside main AppLayout
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.TASKS,
            element: (
              <Suspense fallback={<PageLoader />}>
                <TasksPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.HOME,
            element: <Navigate to={ROUTES.TASKS} replace />,
          },
        ],
      },
    ],
  },

  // Catch-all route
  {
    path: '*',
    element: <Navigate to={ROUTES.TASKS} replace />,
  },
]);
