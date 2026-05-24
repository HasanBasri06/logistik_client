<template>
  <div
    v-if="visible"
    class="fixed left-0 right-0 z-[190] flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur-sm"
    :style="{ top: bannerTop }"
    role="region"
    aria-label="Uygulamada aç"
  >
    <p class="text-sm text-slate-700">
      TaşıBul uygulamasında devam etmek ister misiniz?
    </p>
    <div class="flex shrink-0 items-center gap-2">
      <button
        type="button"
        class="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
        @click="dismiss"
      >
        Web’de kal
      </button>
      <button
        type="button"
        class="rounded-lg bg-[#39838C] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        @click="openApp"
      >
        Uygulamada aç
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  shouldShowOpenInAppBanner,
  openInNativeApp,
  markStayOnWeb,
} from '@/utils/open-native-app';

const visible = ref(false);
const bannerTop = ref('0px');

onMounted(() => {
  visible.value = shouldShowOpenInAppBanner();
  const bar = document.querySelector('[class*="z-[200]"]');
  if (bar) {
    bannerTop.value = `${bar.getBoundingClientRect().height}px`;
  }
});

function dismiss() {
  markStayOnWeb();
  visible.value = false;
}

function openApp() {
  openInNativeApp();
}
</script>
