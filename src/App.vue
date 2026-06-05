<template>
  <div class="min-h-full">
    <!-- İnternet durumu barı: diğer tüm içeriğin üstünde, boşluk bırakmadan overlay -->
    <div
      v-show="showConnectionBar"
      class="fixed top-0 left-0 right-0 z-[200] py-1.5 px-3 text-center text-xs font-medium transition-colors"
      :class="isOnline ? 'bg-emerald-500/95 text-white' : 'bg-red-500/95 text-white'"
    >
      {{ isOnline ? 'Şu anda internete bağlısınız' : 'İnternete bağlı değilsiniz' }}
    </div>
    <component :is="layout">
      <RouterView></RouterView>
    </component>
  </div>
  <!-- Konum alınamadı modalı (sadece giriş yapmış kullanıcı için) -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-show="authStore.isAuthenticated && locationDeniedModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 shrink-0">
              <MapPin class="w-6 h-6" />
            </span>
            <div>
              <h2 id="location-modal-title" class="text-lg font-semibold text-gray-900">Konum bilgisi gerekli</h2>
              <p class="text-sm text-gray-500 mt-0.5">Konumunuza erişemiyoruz. Arama sonuçlarını iyileştirmek için tarayıcıdan konum izni verin.</p>
            </div>
          </div>
          <p v-if="locationError" class="text-sm text-gray-600 mb-3">{{ locationError }}</p>
          <template v-if="locationErrorCode === 1 && locationPermissionPlatform === 'android'">
            <p class="text-sm font-medium text-gray-700 mb-2">Android için konum izni adımları:</p>
            <ol class="text-sm text-gray-600 list-decimal list-inside space-y-1 mb-3">
              <li>Tarayıcıda adres çubuğu yanındaki <strong>kilit</strong> simgesine dokunun.</li>
              <li><strong>Site ayarları</strong> veya <strong>İzinler</strong> bölümünü açın.</li>
              <li><strong>Konum</strong> iznini <strong>İzin ver</strong> olarak değiştirin.</li>
              <li>Gerekirse Android Ayarlar &gt; Uygulamalar &gt; Tarayıcı &gt; İzinler kısmında Konum'u açın.</li>
            </ol>
          </template>
          <template v-else-if="locationErrorCode === 1 && locationPermissionPlatform === 'ios'">
            <p class="text-sm font-medium text-gray-700 mb-2">iOS için konum izni adımları:</p>
            <ol class="text-sm text-gray-600 list-decimal list-inside space-y-1 mb-3">
              <li>Safari'de adres çubuğundaki <strong>aA</strong> simgesine dokunun.</li>
              <li><strong>Web Sitesi Ayarları</strong> bölümüne girin.</li>
              <li><strong>Konum</strong> için <strong>İzin Ver</strong> seçin.</li>
              <li>Gerekirse iOS Ayarlar &gt; Safari &gt; Konum bölümünde izinleri aktif edin.</li>
            </ol>
          </template>
          <template v-else-if="locationErrorCode === 1 && locationPermissionPlatform === 'web'">
            <p class="text-sm font-medium text-gray-700 mb-2">Web tarayıcı için konum izni adımları:</p>
            <ol class="text-sm text-gray-600 list-decimal list-inside space-y-1 mb-3">
              <li>Adres çubuğundaki <strong>kilit</strong> (veya bilgi) simgesine tıklayın.</li>
              <li>Açılan pencerede <strong>Konum</strong> satırını bulun.</li>
              <li>Konum erişimini <strong>İzin ver</strong> veya <strong>Açık</strong> yapın.</li>
            </ol>
          </template>
          <div class="flex justify-end">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              @click="closeLocationModal"
            >
              Daha sonra
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  <!-- Premium'a geç modalı (payment_confirm === 0 iken ilan oluşturmaya tıklanınca) -->
  <PremiumModal />
  <OpenInAppBanner />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { MapPin } from 'lucide-vue-next';
import Layout from './Layout.vue';
import PremiumModal from './components/PremiumModal.vue';
import OpenInAppBanner from './components/OpenInAppBanner.vue';
import {
  applyStayOnWebFromQuery,
  appleItunesAppMetaContent,
  tryOpenNativeApp,
} from './utils/open-native-app';
import { useHead } from '@vueuse/head';
import { useLocationStore } from './stores/location';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const { locationDeniedModalOpen, locationError, locationErrorCode, locationRequesting } = storeToRefs(locationStore);
const { requestUserLocation, closeLocationModal } = locationStore;
const locationPermissionPlatform = computed(() => {
  if (typeof navigator === 'undefined') return 'web';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  return 'web';
});

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);
// Sadece çevrimdışıyken veya çevrimdışıyken bağlanınca bar göster; ilk yüklemede çevrimiçiysen gösterme
const showConnectionBar = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false);
let onlineHideTimeout = null;

const setOnline = () => {
  isOnline.value = true;
  showConnectionBar.value = true;
  if (onlineHideTimeout) clearTimeout(onlineHideTimeout);
  onlineHideTimeout = setTimeout(() => {
    showConnectionBar.value = false;
    onlineHideTimeout = null;
  }, 3000);
};
const setOffline = () => {
  isOnline.value = false;
  showConnectionBar.value = true;
  if (onlineHideTimeout) {
    clearTimeout(onlineHideTimeout);
    onlineHideTimeout = null;
  }
};

onMounted(() => {
  window.addEventListener('online', setOnline);
  window.addEventListener('offline', setOffline);
  applyStayOnWebFromQuery();
  tryOpenNativeApp();
});

watch(
  () => route.fullPath,
  () => {
    tryOpenNativeApp();
  }
);
onBeforeUnmount(() => {
  if (onlineHideTimeout) clearTimeout(onlineHideTimeout);
  window.removeEventListener('online', setOnline);
  window.removeEventListener('offline', setOffline);
});

// Konum isteği sadece panel sayfasında (Home.vue) yapılıyor; modal sadece reddedildiğinde açılır, yenilemede tekrar açılmaz.

const layout = computed(() => route.meta.layout || Layout);

const pageTitle = computed(() =>
    route.meta?.title ? `${route.meta.title} | TaşıBul` : 'TaşıBul - Taşıt Bulma Platformu'
);

const metaDescription = 'TaşıBul - Lojistik Platformu';

const appleAppBanner = computed(() => appleItunesAppMetaContent());

useHead({
    title: pageTitle,
    meta: computed(() => [
        ...(appleAppBanner.value
            ? [{ name: 'apple-itunes-app', content: appleAppBanner.value }]
            : []),
        { name: 'description', content: metaDescription },
        { name: 'keywords', content: 'TaşıBul, Lojistik, Platformu' },
        { name: 'author', content: 'TaşıBul' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        { property: 'og:title', content: pageTitle.value },
        { property: 'og:description', content: metaDescription },
        { property: 'og:image', content: 'https://tasibul.com/logo.png' },
        { property: 'og:url', content: 'https://tasibul.com' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle.value },
        { name: 'twitter:description', content: metaDescription },
        { name: 'twitter:image', content: 'https://tasibul.com/logo.png' },
        { name: 'twitter:url', content: 'https://tasibul.com' },
    ]),
    link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://tasibul.com' },
    ],
});
</script>

<style scoped>
</style>
<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>