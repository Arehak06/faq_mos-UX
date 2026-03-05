import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getTelegramUser } from '../utils/telegram';
import { isAdmin } from '../utils/isAdmin';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = getTelegramUser();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}