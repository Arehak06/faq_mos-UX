import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const configuration = {
  authority: 'https://oauth.telegram.org',
  client_id: import.meta.env.VITE_TELEGRAM_CLIENT_ID,
  redirect_uri: `${window.location.origin}/faq_mos-UX/callback`,
  response_type: 'code',
  scope: 'openid profile',
  loadUserInfo: false,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: false,
  disablePKCE: true, // обязательно!
  metadata: {
    issuer: 'https://oauth.telegram.org',
    authorization_endpoint: 'https://oauth.telegram.org/auth',
    token_endpoint: 'https://oauth.telegram.org/token',
    jwks_uri: 'https://oauth.telegram.org/.well-known/jwks.json',
    response_types_supported: ['code'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    token_endpoint_auth_methods_supported: ['client_secret_basic'],
    claims_supported: ['sub', 'name', 'preferred_username', 'picture'],
  },
};

export const userManager = new UserManager(configuration);
export const signIn = () => userManager.signinRedirect();
export const signOut = () => userManager.removeUser();