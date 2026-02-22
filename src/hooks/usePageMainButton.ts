import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageData } from '../types/page';

export function usePageMainButton(page?: PageData) {
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg || !page?.mainButton) {
      tg?.MainButton.hide();
      return;
    }

    tg.MainButton.setText(page.mainButton.text);
    tg.MainButton.show();

    const handler = () => {
      const action = page.mainButton!.action;
      if (action.type === 'link') {
        window.open(action.value, '_blank');
      } else {
        navigate(action.value);
      }
    };

    tg.MainButton.onClick(handler);

    return () => tg.MainButton.offClick(handler);
  }, [page, navigate]);
}