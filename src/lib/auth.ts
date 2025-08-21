import GoTrue from 'gotrue-js';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const DEFAULT_IDENTITY_URL = 'https://agp-app.netlify.app/.netlify/identity';

export const IDENTITY_URL = isBrowser
  ? `${window.location.origin}/.netlify/identity`
  : DEFAULT_IDENTITY_URL;

let authClient: GoTrue | null = null;

export function getAuthClient() {
  if (!authClient) {
    authClient = new GoTrue({
      APIUrl: IDENTITY_URL,
      setCookie: true,
    });
  }
  return authClient!;
}

export async function login(email: string, password: string) {
  if (!isBrowser) {
    throw new Error('Authentication is only available in browser environment');
  }
  return getAuthClient().login(email, password, true);
}

export async function register(email: string, password: string) {
  if (!isBrowser) {
    throw new Error('Authentication is only available in browser environment');
  }
  return getAuthClient().signup(email, password);
}

export async function logout() {
  if (!isBrowser) {
    throw new Error('Authentication is only available in browser environment');
  }
  const user = getAuthClient().currentUser();
  if (user) await user.logout();
}

export function getCurrentUser() {
  if (!isBrowser) {
    return null;
  }
  return getAuthClient().currentUser();
}

export async function resetPassword(email: string) {
  if (!isBrowser) {
    throw new Error('Password reset is only available in browser environment');
  }
  return getAuthClient().requestPasswordRecovery(email);
}