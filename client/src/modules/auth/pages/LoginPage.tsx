import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { ROUTES } from '../../../shared/constants/routes';
import { ThemeToggle } from '../../../shared/components/ui/ThemeToggle';

export const LoginPage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50/60 via-slate-50 to-indigo-100/40 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 sm:px-6 lg:px-8">
      {/* Theme toggle in top right */}
      <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage and organize your tasks seamlessly
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none sm:p-8">
          <LoginForm />

          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
