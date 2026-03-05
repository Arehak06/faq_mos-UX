import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/isAdmin';

export default function AdminRoute({ children }: { children: ReactNode }) {
  return isAdmin() ? <>{children}</> : <Navigate to="/login" replace />;
}