export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

export const isNative = !isBrowser;

export const getOrigin = () => {
  if (isBrowser) {
    return window.location.origin;
  }
  // Fallback pour l'environnement natif
  return 'https://agp-app.netlify.app';
};