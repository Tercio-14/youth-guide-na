import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { isOffline, offlineUser } = useOffline();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // In offline mode, allow access if there's an offline user
  if (isOffline && offlineUser) {
    return children;
  }

  // In online mode, require Firebase user
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}