import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin } from '../utils/isAdmin';
import { getTelegramUser } from '../utils/telegram';
import { Loading } from './Loading';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const user = getTelegramUser();

  useEffect(() => {
    isAdmin().then(setAllowed);
  }, [user]);

  if (allowed === null) return <Loading />;
  if (!allowed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}