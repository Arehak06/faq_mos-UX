import { useEffect } from 'react';

export function useConfirmExitSimple(shouldBlock: boolean, message: string) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (shouldBlock) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [shouldBlock]);
}