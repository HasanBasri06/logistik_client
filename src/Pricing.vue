<template>
    <div class="flex flex-col">
        <img :src="Pattern" alt="Pattern" class="absolute inset-0 w-full h-full object-cover opacity-5" />
        <Header />
        <main class="flex-1">
            <!-- Hero -->
            <section class="relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-primary)_0%,transparent_50%)] opacity-[0.06]" />
                <Content class="relative py-14 md:py-18 flex flex-col items-center gap-5 text-center">
                    <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        Fiyat planları
                    </span>
                    <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl max-w-2xl">
                        Sizin için en uygun paketi seçin
                    </h1>
                    <p class="max-w-xl text-base leading-relaxed text-gray-500">
                        TaşıBul ile ihtiyacınıza göre plan seçin. Ücretsiz başlayın, büyüdükçe ölçeklendirin.
                    </p>
                </Content>
            </section>

            <!-- Carousel -->
            <Content class="relative py-12 px-4 overflow-hidden">
                <Carousel
                    v-model="activeSlide"
                    :items-to-show="1"
                    :items-to-scroll="1"
                    :wrap-around="true"
                    :transition="400"
                    :mouse-drag="true"
                    :touch-drag="true"
                    :gap="20"
                    snap-align="start"
                    :breakpoints="carouselBreakpoints"
                    class="pricing-carousel"
                >
                    <Slide v-for="plan in plans" :key="plan.id">
                        <div
                            class="group h-full w-[340px] mx-auto rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-xl hover:ring-primary/20 hover:-translate-y-1"
                            :class="plan.badge ? 'border-primary/30 ring-primary/10' : 'border-gray-200'"
                        >
                            <div v-if="plan.badge" class="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                                {{ plan.badge }}
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900">{{ plan.name }}</h3>
                            <p class="mt-1.5 text-sm text-gray-500 leading-snug">{{ plan.description }}</p>
                            <div class="mt-6 flex flex-wrap items-baseline gap-1">
                                <span class="text-3xl font-bold tracking-tight text-gray-900">{{ plan.price }}</span>
                                <span class="text-sm text-gray-500">{{ plan.period }}</span>
                            </div>
                            <ul class="mt-6 space-y-3 text-sm text-gray-600">
                                <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3">
                                    <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                                    </span>
                                    {{ feature }}
                                </li>
                            </ul>
                            <button
                                type="button"
                                @click="authStore.openLoginModal()"
                                class="mt-8 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
                            >
                                {{ plan.ctaText }}
                            </button>
                        </div>
                    </Slide>
                    <template #addons>
                        <CarouselPagination />
                    </template>
                </Carousel>
            </Content>
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';
import { Carousel, Slide, Pagination as CarouselPagination } from 'vue3-carousel';
import 'vue3-carousel/carousel.css';
import { ref } from 'vue';
import Pattern from '@/assets/images/pattern.jpg';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const activeSlide = ref(0);

const carouselBreakpoints = {
    0:   { itemsToShow: 1, itemsToScroll: 1, snapAlign: 'center' },
    768: { itemsToShow: 2, itemsToScroll: 1, snapAlign: 'start' },
};

const plans = [
    {
        id: 'starter',
        name: 'Başlangıç',
        description: 'Ara sıra taşıma ihtiyacı olanlar için',
        price: '₺0',
        period: '/ ilan',
        badge: 'Popüler',
        features: ['Ayda 3 ilana kadar ücretsiz', 'Temel destek', 'Fiyat hesaplama'],
        ctaText: 'Ücretsiz Başla',
        ctaLink: '/panel',
    },
    {
        id: 'pro',
        name: 'Profesyonel',
        description: 'Düzenli taşıma yapan işletmeler için',
        price: '₺299',
        period: '/ ay',
        badge: null,
        features: ['Sınırsız ilan', 'Öncelikli destek', 'Detaylı raporlama', 'Özel fiyat teklifleri'],
        ctaText: 'Deneyin',
        ctaLink: '/panel',
    },
    {
        id: 'enterprise',
        name: 'Kurumsal',
        description: 'Yüksek hacimli taşımacılık',
        price: 'Özel',
        period: '',
        badge: null,
        features: ['Kurumsal sözleşme', 'Özel entegrasyon', 'Dedicated hesap yöneticisi', 'API erişimi'],
        ctaText: 'İletişime Geçin',
        ctaLink: '/panel',
    },
];
</script>

<style scoped>
.pricing-carousel :deep(.carousel__viewport) {
    overflow: visible;
}
.pricing-carousel :deep(.carousel__track) {
    align-items: stretch;
}
.pricing-carousel :deep(.carousel__slide) {
    padding: 0.25rem;
}
.pricing-carousel :deep(.carousel__prev),
.pricing-carousel :deep(.carousel__next) {
    border-radius: 9999px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: var(--color-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.pricing-carousel :deep(.carousel__prev:hover),
.pricing-carousel :deep(.carousel__next:hover) {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: white;
    box-shadow: 0 4px 12px rgba(57, 131, 140, 0.25);
}
.pricing-carousel :deep(.carousel__pagination) {
    padding: 1.75rem 0 0 0;
    gap: 0.50rem;
}
.pricing-carousel :deep(.carousel__pagination-button) {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d1d5db;
    border: none;
    padding: 0;
    margin: 0;
    transition: background 0.2s, transform 0.2s;
}
.pricing-carousel :deep(.carousel__pagination-button:hover) {
    background: #9ca3af;
}
.pricing-carousel :deep(.carousel__pagination-button--active) {
    background: var(--color-primary);
    transform: scale(1.2);
}
</style>
