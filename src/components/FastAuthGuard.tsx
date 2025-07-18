
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/OptimizedAuthContext';
import { OptimizedLoader } from '@/components/OptimizedLoader';

interface FastAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const FastAuthGuard: React.FC<FastAuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    console.log('FastAuthGuard check:', { 
      user: !!user, 
      profile: !!profile, 
      isLoading, 
      requireAuth,
      currentPath: location.pathname 
    });
    
    if (isLoading) {
      setShouldRender(false);
      return;
    }

    if (requireAuth && !user) {
      console.log('Auth required but no user, redirecting to login');
      // Store the attempted location for redirect after login
      navigate(redirectTo, { 
        state: { from: location },
        replace: true 
      });
      return;
    }

    if (!requireAuth && user && (location.pathname === '/login' || location.pathname === '/register')) {
      console.log('User logged in but accessing auth page, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Additional check for demo mode users
    if (requireAuth && user && user.id === 'demo-user-id') {
      console.log('Demo user authenticated, allowing access');
      setShouldRender(true);
      return;
    }

    console.log('FastAuthGuard allowing render');
    setShouldRender(true);
  }, [user, profile, isLoading, requireAuth, navigate, redirectTo, location]);

  if (isLoading) {
    return <OptimizedLoader variant="page" message="Loading..." />;
  }

  if (!shouldRender) {
    return <OptimizedLoader variant="page" message="Redirecting..." />;
  }

  return <>{children}</>;
};

