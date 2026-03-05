import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/isAdmin';
import { getTelegramUser } from '../utils/telegram';
import NotFound from './common/NotFound';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const user = getTelegramUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <NotFound />;
  }
  return <>{children}</>;
}