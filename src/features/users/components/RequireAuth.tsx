import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Button from '../../../components/Button';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading, error, refreshUser } = useAuth();

  if (isLoading) {
    return <p className="p-6">Checking your session..</p>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p role="alert">{error}</p>
        <Button
          type="button"
          variant="plain"
          onClick={() => void refreshUser()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
