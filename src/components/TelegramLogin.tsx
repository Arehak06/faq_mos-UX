import { TelegramLoginButton, TelegramLoginWidgetData } from '@advanceddev/telegram-login-react';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  onAuth: (user: TelegramLoginWidgetData) => void;
  className?: string;
}


export function TelegramLogin({ onAuth, className }: Props) {
  return (
    <TelegramLoginButton
      botUsername="faq_mos_beta_bot"
      onAuthCallback={onAuth}
      size="large"
      lang="ru"
      radius={8}
      loadingComponent={<LoadingSpinner />} // 👈 добавили
    />
  );
}