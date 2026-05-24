import { MOBILE_APP } from '@/config/mobile-app';

const SESSION_TRY_KEY = 'tasibul_native_open_tried';
const SESSION_STAY_WEB_KEY = 'tasibul_stay_on_web';
const SESSION_APP_OPENED_KEY = 'tasibul_app_opened';

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

export function shouldShowOpenInAppBanner() {
  if (!isIOS()) return false;
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

/** Android: App Links intent — yüklüyse uygulama, değilse aynı web sayfası */
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

/** iOS: özel şema (yüklüyse uygulama açılır; yüklü değilse sayfa kalır) */
function tryOpenIOSApp() {
  const path = currentPath().replace(/^\//, '');
  const schemeUrl = path
    ? `${MOBILE_APP.customScheme}://${path}`
    : `${MOBILE_APP.customScheme}://`;

  const onHide = () => {
    if (document.hidden) {
      markAppOpened();
      document.removeEventListener('visibilitychange', onHide);
    }
  };
  document.addEventListener('visibilitychange', onHide);

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'display:none;width:0;height:0;border:0';
  iframe.src = schemeUrl;
  document.body.appendChild(iframe);
  window.setTimeout(() => {
    iframe.remove();
    document.removeEventListener('visibilitychange', onHide);
  }, 2500);
}

/**
 * Mobil cihazda native uygulamayı dene; yüklü değilse web’de kal.
 * Mağazaya yönlendirme yapılmaz.
 */
export function tryOpenNativeApp() {
  if (!isMobileWeb()) return;
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
