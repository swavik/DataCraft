import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure auth state is properly initialized
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    console.log('ProtectedRoute: Loading or checking auth state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('ProtectedRoute: Auth check - user:', !!user, 'loading:', loading, 'isChecking:', isChecking);

  // If no user is authenticated, redirect to auth page
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to auth page');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: User authenticated, rendering protected content');
  // User is authenticated, render the protected content
  return <>{children}</>;
};