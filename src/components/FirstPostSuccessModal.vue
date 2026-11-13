<template>
  <Teleport to="body">
    <Transition name="first-post-success" appear>
      <div
        v-if="createPostTour.successOpen"
        class="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-post-success-title"
        @click.self="close"
      >
        <div class="success-card w-full max-w-sm rounded-3xl bg-white shadow-2xl px-6 pt-4 pb-6 text-center">
          <img :src="successGifUrl" alt="" class="mx-auto w-40 h-40 object-contain" />
          <h2 id="first-post-success-title" class="text-xl font-extrabold text-gray-900">
            Tebrikler, ilk ilanınız yayında!
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-gray-500">
            İlanınız taşıyıcılara gösteriliyor. Teklif ve aramalar geldiğinde size bildirim göndereceğiz.
          </p>
          <button
            ref="primaryRef"
            type="button"
            class="mt-6 w-full h-12 rounded-xl bg-primary text-white text-base font-bold hover:brightness-105 transition cursor-pointer"
            @click="close"
          >
            İlanımı Gör
          </button>
          <button
            type="button"
            class="mt-3 text-sm font-semibold text-gray-500 hover:text-gray-700 cursor-pointer"
            @click="goPanel"
          >
            Panele Dön
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { createPostTour } from '@/lib/create-post-tour';

const successGifUrl = new URL('../assets/gifs/loading_gif.gif', import.meta.url).href;
const router = useRouter();
const primaryRef = ref(null);

/** Yayınlanınca zaten ilan sayfasına geçiliyor; "İlanımı Gör" pencereyi kapatır */
function close() {
  createPostTour.successOpen = false;
}

function goPanel() {
  close();
  router.push('/panel');
}

watch(
  () => createPostTour.successOpen,
  async (open) => {
    if (!open) return;
    await nextTick();
    primaryRef.value?.focus();
  }
);
</script>

<style scoped>
.first-post-success-enter-active,
.first-post-success-leave-active {
  transition: opacity 0.2s ease;
}
.first-post-success-enter-active .success-card,
.first-post-success-leave-active .success-card {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.first-post-success-enter-from,
.first-post-success-leave-to {
  opacity: 0;
}
.first-post-success-enter-from .success-card,
.first-post-success-leave-to .success-card {
  transform: scale(0.92);
}
</style>
