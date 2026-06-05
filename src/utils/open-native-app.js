import { MOBILE_APP } from '@/config/mobile-app';

const SESSION_TRY_KEY = 'tasibul_native_open_tried';
const SESSION_STAY_WEB_KEY = 'tasibul_stay_on_web';
const SESSION_APP_OPENED_KEY = 'tasibul_app_opened';

/** Ödeme dönüşü vb. — uygulamaya atlamadan web’de kal */
const SKIP_PATH_PREFIXES = ['/basarili', '/basarisiz'];

export function isAndroid() {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

export function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream;
}

export function isMobileWeb() {
  return isAndroid() || isIOS();
}

export function markStayOnWeb() {
  try {
    sessionStorage.setItem(SESSION_STAY_WEB_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function wasNativeOpenAttempted() {
  try {
    return sessionStorage.getItem(SESSION_TRY_KEY) === '1';
  } catch {
    return false;
  }
}

function markNativeOpenAttempted() {
  try {
    sessionStorage.setItem(SESSION_TRY_KEY, '1');
  } catch {
    /* ignore */
  }
}

function markAppOpened() {
  try {
    sessionStorage.setItem(SESSION_APP_OPENED_KEY, '1');
  } catch {
    /* ignore */
  }
}

/** URL ?stay=web veya ?noapp=1 */
export function applyStayOnWebFromQuery() {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stay') === 'web' || params.get('noapp') === '1') {
      markStayOnWeb();
    }
  } catch {
    /* ignore */
  }
}

export function shouldSkipNativeOpen() {
  if (typeof window === 'undefined') return true;
  try {
    if (sessionStorage.getItem(SESSION_STAY_WEB_KEY) === '1') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('stay') === 'web' || params.get('noapp') === '1') return true;
  } catch {
    /* ignore */
  }
  const path = window.location.pathname || '';
  return SKIP_PATH_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Uygulama açılamadıysa banner (iOS + Android) */
export function shouldShowOpenInAppBanner() {
  if (!isMobileWeb()) return false;
  try {
    if (sessionStorage.getItem(SESSION_STAY_WEB_KEY) === '1') return false;
    if (sessionStorage.getItem(SESSION_APP_OPENED_KEY) === '1') return false;
    return sessionStorage.getItem(SESSION_TRY_KEY) === '1';
  } catch {
    return false;
  }
}

function currentPageUrl() {
  return window.location.href;
}

function currentPath() {
  return window.location.pathname + window.location.search + window.location.hash;
}

function attachAppOpenedListener() {
  const onHide = () => {
    if (document.hidden) {
      markAppOpened();
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('blur', onHide);
    }
  };
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', onHide);
  window.addEventListener('blur', onHide);
  return onHide;
}

function detachAppOpenedListener(onHide) {
  document.removeEventListener('visibilitychange', onHide);
  window.removeEventListener('pagehide', onHide);
  window.removeEventListener('blur', onHide);
}

/** Android App Links intent — yüklüyse uygulama, değilse aynı web sayfası */
function tryOpenAndroidApp() {
  const host = window.location.host;
  const path = currentPath();
  const fallback = encodeURIComponent(currentPageUrl());
  const intent =
    `intent://${host}${path}#Intent;` +
    `scheme=https;` +
    `package=${MOBILE_APP.androidPackage};` +
    `S.browser_fallback_url=${fallback};` +
    `end`;
  window.location.href = intent;
}

/** iOS: özel şema mobil:// — yüklüyse uygulama açılır */
function tryOpenIOSApp() {
  const rawPath = currentPath().replace(/^\//, '');
  const schemeUrl = rawPath
    ? `${MOBILE_APP.customScheme}://${rawPath}`
    : `${MOBILE_APP.customScheme}://`;

  const onHide = attachAppOpenedListener();

  window.location.href = schemeUrl;

  window.setTimeout(() => {
    detachAppOpenedListener(onHide);
  }, 2500);
}

/**
 * Mobil cihazda native uygulamayı dene; yüklü değilse web’de kal.
 * Oturum başına bir kez dener (banner ile tekrar açılabilir).
 */
export function tryOpenNativeApp() {
  if (!isMobileWeb()) return;
  if (shouldSkipNativeOpen()) return;

  try {
    if (sessionStorage.getItem(SESSION_STAY_WEB_KEY) === '1') return;
    if (sessionStorage.getItem(SESSION_TRY_KEY) === '1') return;
  } catch {
    /* ignore */
  }

  markNativeOpenAttempted();

  if (isAndroid()) {
    tryOpenAndroidApp();
    return;
  }

  if (isIOS()) {
    tryOpenIOSApp();
  }
}

/** Kullanıcı “Uygulamada aç”a bastığında */
export function openInNativeApp() {
  if (isAndroid()) {
    tryOpenAndroidApp();
    return;
  }
  if (isIOS()) {
    tryOpenIOSApp();
  }
}

/** Safari Smart App Banner — app-argument güncel sayfa */
export function appleItunesAppMetaContent() {
  if (!isIOS() || typeof window === 'undefined') return null;
  return `app-id=${MOBILE_APP.iosAppStoreId}, app-argument=${currentPageUrl()}`;
}
