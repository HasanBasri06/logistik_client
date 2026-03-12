<template>
  <component :is="layout">
      <RouterView></RouterView>
  </component>
  <!-- Konum alınamadı modalı (tüm sayfalarda) -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-show="locationDeniedModalOpen"
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
              <p class="text-sm text-gray-500 mt-0.5">Konumunuza erişemiyoruz. Arama sonuçlarını iyileştirmek için konum izni verin.</p>
            </div>
          </div>
          <p v-if="locationError" class="text-sm text-gray-600 mb-4">{{ locationError }}</p>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              @click="closeLocationModal"
            >
              Daha sonra
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
              :disabled="locationRequesting"
              @click="requestUserLocation"
            >
              <span v-if="locationRequesting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {{ locationRequesting ? 'Alınıyor...' : 'Tekrar dene' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { MapPin } from 'lucide-vue-next';
import Layout from './Layout.vue';
import { useHead } from '@vueuse/head';
import { useLocationStore } from './stores/location';

const route = useRoute();
const locationStore = useLocationStore();
const { locationDeniedModalOpen, locationError, locationRequesting } = storeToRefs(locationStore);
const { requestUserLocation, closeLocationModal } = locationStore;

onMounted(() => {
  locationStore.requestUserLocation();
});

const layout = computed(() => route.meta.layout || Layout);

const pageTitle = computed(() =>
    route.meta?.title ? `${route.meta.title} | TaşıBul` : 'TaşıBul - Taşıt Bulma Platformu'
);

const metaDescription = 'TaşıBul - Lojistik Platformu';

useHead({
    title: pageTitle,
    meta: [
        { name: 'description', content: metaDescription },
        { name: 'keywords', content: 'TaşıBul, Lojistik, Platformu' },
        { name: 'author', content: 'TaşıBul' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: metaDescription },
        { property: 'og:image', content: 'https://tasibul.com/logo.png' },
        { property: 'og:url', content: 'https://tasibul.com' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: metaDescription },
        { name: 'twitter:image', content: 'https://tasibul.com/logo.png' },
        { name: 'twitter:url', content: 'https://tasibul.com' },
    ],
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