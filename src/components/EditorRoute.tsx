import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isEditor } from '../utils/isAdmin';
import { Loading } from './Loading';

export default function EditorRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    isEditor().then(setAllowed);
  }, []);

  if (allowed === null) return <Loading />;
  if (!allowed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}