import { reactive } from 'vue';

/**
 * İlk kez üye olan yük sahibi için "ilk ilanını oluştur" rehber turu (mobildeki turun web karşılığı).
 *
 * Akış: panelde "İlanınızı oluşturun" kartı vurgulanır → karta tıklanınca tur `wizard` aşamasına geçer ve
 * ilan oluşturma modalında adım adım yönlendirme yapılır → ilan yayınlanınca ya da "Turu geç" ile biter.
 * Tamamlandı bilgisi kullanıcıya özel `localStorage`'da tutulur; tur bir daha gösterilmez.
 */
export const createPostTour = reactive({
  /** 'idle' | 'wizard' */
  stage: 'idle',
  /** "Anladım / Tamam" ile geçilen bilgi adımları */
  acked: {},
  /** Bu oturumda tamamlanan kullanıcılar (reaktif; localStorage'ın önünde) */
  done: {},
  /** Turla oluşturulan ilk ilan yayınlandı: tebrik penceresi (App.vue) */
  successOpen: false,
});

export function startCreatePostTourWizard() {
  createPostTour.acked = {};
  createPostTour.stage = 'wizard';
}

export function stopCreatePostTourWizard() {
  createPostTour.stage = 'idle';
  createPostTour.acked = {};
}

export function ackCreatePostTourStep(key) {
  createPostTour.acked = { ...createPostTour.acked, [key]: true };
}

function storageKey(userId) {
  return `create_post_tour_done_${userId ?? 'anon'}`;
}

export function isCreatePostTourDone(userId) {
  if (createPostTour.done[storageKey(userId)]) return true;
  try {
    return localStorage.getItem(storageKey(userId)) === '1';
  } catch {
    return false;
  }
}

/** İlan yayınlandı veya kullanıcı turu geçti */
export function markCreatePostTourDone(userId) {
  stopCreatePostTourWizard();
  createPostTour.done = { ...createPostTour.done, [storageKey(userId)]: true };
  try {
    localStorage.setItem(storageKey(userId), '1');
  } catch {
    /* saklanamazsa tur bir sonraki ziyarette tekrar görünebilir */
  }
}
