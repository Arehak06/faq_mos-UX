import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin } from '../utils/isAdmin';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!isAdmin()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}