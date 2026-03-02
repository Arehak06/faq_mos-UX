import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const configuration = {
  authority: 'https://oauth.telegram.org',
  client_id: import.meta.env.VITE_TELEGRAM_CLIENT_ID,
  redirect_uri: `${window.location.origin}/faq_mos-UX/callback`,
  response_type: 'code',
  scope: 'openid profile',
  loadUserInfo: false, // не загружаем пользователя на клиенте
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: false,
  metadata: {
    issuer: 'https://oauth.telegram.org',
    authorization_endpoint: 'https://oauth.telegram.org/auth',
    token_endpoint: 'https://oauth.telegram.org/token',
    jwks_uri: 'https://oauth.telegram.org/.well-known/jwks.json',
    // ... остальное
  },
};

export const userManager = new UserManager(configuration);
export const signIn = () => userManager.signinRedirect();