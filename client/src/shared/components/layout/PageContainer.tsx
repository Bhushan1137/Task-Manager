import React from 'react';
import { cn } from '../../utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8', className)}>
      {children}
    </div>
  );
};
