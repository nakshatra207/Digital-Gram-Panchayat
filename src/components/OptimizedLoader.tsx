
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedLoaderProps {
  variant?: 'minimal' | 'page' | 'inline';
  className?: string;
  message?: string;
}

export const OptimizedLoader: React.FC<OptimizedLoaderProps> = ({ 
  variant = 'minimal', 
  className,
  message 
}) => {
  const variants = {
    minimal: 'flex items-center justify-center p-4',
    page: 'min-h-screen flex items-center justify-center bg-gray-50',
    inline: 'flex items-center justify-center py-2'
  };

  return (
    <div className={cn(variants[variant], className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        {message && (
          <p className="text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};
