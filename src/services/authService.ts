import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';

// Конфигурация для OpenID Connect Telegram
const configuration = {
  authority: 'https://oauth.telegram.org', // OIDC issuer
  client_id: import.meta.env.VITE_TELEGRAM_CLIENT_ID, // Client ID из BotFather
  redirect_uri: `${window.location.origin}/faq_mos-UX/callback`, // URL для обратного вызова (важно!)
  response_type: 'code', // Authorization Code Flow
  scope: 'openid profile phone', // Запрашиваемые данные
  loadUserInfo: true, // Загружать информацию пользователя (будет из ID token)
  userStore: new WebStorageStateStore({ store: window.localStorage }), // Храним состояние в localStorage
  automaticSilentRenew: true, // Автоматическое обновление токена
  includeIdTokenInSilentRenew: true,
};

export const userManager = new UserManager(configuration);

// Функция для начала входа (редирект на Telegram)
export const signIn = () => {
  return userManager.signinRedirect();
};

// Функция для обработки callback после редиректа
export const signInCallback = async (): Promise<User | null> => {
  const user = await userManager.signinRedirectCallback();
  return user;
};

// Функция для выхода
export const signOut = async () => {
  await userManager.removeUser();
};

// Функция для получения текущего пользователя
export const getUser = async (): Promise<User | null> => {
  const user = await userManager.getUser();
  return user;
};