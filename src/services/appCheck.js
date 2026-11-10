import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

/**
 * Initializes Firebase App Check with reCAPTCHA v3 or Enterprise provider.
 * Protects Firebase backend resources from scraping, replay attacks, and quota abuse.
 * 
 * @param {import('firebase/app').FirebaseApp} app - Initialized Firebase App instance
 * @param {string} [siteKey] - Optional reCAPTCHA v3 site key
 */
export function setupAppCheck(app, siteKey) {
  if (typeof window === 'undefined') return null;

  const key =
    siteKey ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RECAPTCHA_SITE_KEY);

  if (!key) {
    // In local development, enable Firebase App Check debug token if configured
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      if (typeof window !== 'undefined') {
        window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }
    }
    return null;
  }

  try {
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(key),
      isTokenAutoRefreshEnabled: true,
    });
    return appCheck;
  } catch (err) {
    console.warn('Firebase App Check initialization note:', err);
    return null;
  }
}
