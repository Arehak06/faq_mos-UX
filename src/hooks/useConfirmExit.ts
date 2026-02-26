import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

export function useConfirmExit(shouldBlock: boolean, message: string) {
  // Блокировка навигации внутри приложения
  useBlocker(({ currentLocation, nextLocation }) => {
    if (shouldBlock && currentLocation.pathname !== nextLocation.pathname) {
      return !window.confirm(message);
    }
    return false;
  });

  // Блокировка закрытия вкладки / перезагрузки
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