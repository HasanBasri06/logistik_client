<template>
  <!-- Giriş / kayıt / şifre ekranlarının ortak sayfa iskeleti: site navbar + ortada form + footer -->
  <div class="flex min-h-screen flex-col bg-white">
    <Header />

    <main class="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
      <div class="w-full max-w-md">
        <button
          v-if="back"
          type="button"
          class="-ml-2 -mt-2 mb-2 flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          aria-label="Geri"
          @click="$emit('back')"
        >
          <i class="pi pi-chevron-left" style="font-size: 16px;"></i>
        </button>

        <header class="mb-6 text-center">
          <h1 class="text-2xl sm:text-[28px] font-extrabold tracking-tight text-gray-900">{{ title }}</h1>
          <p v-if="description" class="mt-1.5 text-sm leading-relaxed text-gray-500">{{ description }}</p>
        </header>

        <slot />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  /** Sol üstte geri butonu */
  back: { type: Boolean, default: false },
});
defineEmits(['back']);
</script>
