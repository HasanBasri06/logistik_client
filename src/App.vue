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
  <!-- Konum izni reddedildi — alttan sheet, izin verilene kadar kapatılamaz -->
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-show="authStore.isAuthenticated && locationDeniedModalOpen && locationErrorCode === 1"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        <div class="w-full max-w-lg bg-white rounded-t-2xl shadow-xl px-5 pt-3 pb-8 min-h-[58vh] max-h-[88vh] flex flex-col">
          <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 shrink-0" />
          <div class="flex-1 overflow-y-auto text-center">
            <span class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MapPin class="w-8 h-8" />
            </span>
            <h2 id="location-modal-title" class="text-lg font-bold text-gray-900">Konum izni gerekli</h2>
            <p class="text-sm text-gray-500 mt-2 px-1 leading-relaxed">
              TaşıBul’da konum bilgisi; size en yakın ilanları göstermek, aramayı hızlandırmak ve doğru eşleşmeyi
              bulmanızı sağlamak için kullanılır.
            </p>

            <ul class="mt-5 space-y-3 text-left">
              <li
                v-for="item in locationReasons"
                :key="item.title"
                class="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3"
              >
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <component :is="item.icon" class="w-5 h-5" />
                </span>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{{ item.title }}</p>
                  <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ item.text }}</p>
                </div>
              </li>
            </ul>

            <div class="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left">
              <Info class="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
              <p class="text-xs text-amber-900 leading-relaxed">
                Konum izni şu an kapalı. Devam etmek için tarayıcı veya cihaz ayarlarından konum erişimini açmanız
                gerekiyor.
              </p>
            </div>
          </div>

          <button
            type="button"
            class="mt-4 w-full h-12 shrink-0 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            @click="onLocationSettingsPress"
          >
            <Settings class="w-4 h-4" />
            Konum ayarlarına git
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
  <!-- Premium'a geç modalı (payment_confirm === 0 iken ilan oluşturmaya tıklanınca) -->
  <PremiumModal />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { GitCompare, Info, MapPin, Navigation, Settings, ShieldCheck } from 'lucide-vue-next';
import Layout from './Layout.vue';
import PremiumModal from './components/PremiumModal.vue';
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
const { locationDeniedModalOpen, locationErrorCode } = storeToRefs(locationStore);
const { retryLocationAfterSettings } = locationStore;

const locationReasons = [
  {
    icon: Navigation,
    title: 'Yakınınızdaki ilanlar',
    text: 'Bulunduğunuz bölgeye yakın yük ve araç ilanlarını önce gösteririz.',
  },
  {
    icon: GitCompare,
    title: 'Size uygun eşleşme',
    text: 'Araç tipiniz ve konumunuza uygun ilanları listenin üstünde önceliklendiririz.',
  },
  {
    icon: ShieldCheck,
    title: 'Gizlilik',
    text: 'Konum yalnızca uygulama kullanılırken işlenir; izin vermezseniz temel özellikler çalışmaya devam eder.',
  },
];

function onLocationSettingsPress() {
  retryLocationAfterSettings();
}

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
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active > div:last-child,
.sheet-leave-active > div:last-child {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from > div:last-child,
.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>