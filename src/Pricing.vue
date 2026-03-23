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

            <!-- 4'lü Grid -->
            <Content class="relative py-12 px-4 overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div
                        v-for="plan in plans"
                        :key="plan.id"
                        class="group relative h-full rounded-3xl border bg-white/95 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                        :class="plan.badge ? 'border-primary/30 shadow-primary/10' : 'border-gray-200/90'"
                    >
                        <div
                            v-if="plan.badge"
                            class="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm"
                            :class="plan.badge === 'Popüler'
                                ? 'border border-red-200 bg-red-50 text-red-600'
                                : 'border border-blue-200 bg-blue-50 text-blue-700'"
                        >
                            <i v-if="plan.badge === 'Önerilen'" class="pi pi-bolt text-[10px] text-blue-600"></i>
                            <span v-else-if="plan.badge === 'Popüler'" class="text-red-500 text-xs leading-none">🔥</span>
                            {{ plan.badge }}
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900">{{ plan.name }}</h3>
                        <div class="mt-5 rounded-2xl border border-gray-100 bg-linear-to-b from-gray-50 to-white p-4">
                            <div class="flex items-end justify-between gap-3">
                                <span class="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 whitespace-nowrap leading-none">{{ plan.totalPrice }}</span>
                                <span class="text-xs md:text-sm text-gray-500 whitespace-nowrap pb-0.5">/ {{ plan.durationLabel }}</span>
                            </div>
                            <p class="mt-2 text-sm font-semibold text-primary whitespace-nowrap">Aylık maliyet: {{ plan.monthlyCost }}</p>
                            <div v-if="plan.showDiscount" class="mt-2 flex items-center gap-2">
                                <span class="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-xs md:text-sm font-bold whitespace-nowrap">
                                    İndirim {{ plan.discountAmount }}
                                </span>
                                <span class="inline-flex rounded-full bg-primary/10 text-primary border border-primary/15 px-2.5 py-1 text-xs font-semibold whitespace-nowrap">
                                    {{ plan.discountRate }}
                                </span>
                            </div>
                        </div>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600 min-h-[42px]">{{ plan.description }}</p>
                        <div class="mt-5 h-px w-full bg-gray-100"></div>
                        <button
                            type="button"
                            @click="authStore.openLoginModal()"
                            class="mt-auto flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.99]"
                        >
                            {{ plan.ctaText }}
                        </button>
                    </div>
                </div>
            </Content>
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';
import Pattern from '@/assets/images/pattern.jpg';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const plans = [
    {
        id: 'monthly',
        name: '1 Aylık',
        description: 'Kısa süreli kullanım için ideal başlangıç paketi.',
        durationLabel: '1 Ay',
        totalPrice: '349 TL',
        normalPrice: '349 × 1 = 349 TL',
        monthlyCost: '349 TL / ay',
        discountAmount: '0 TL',
        discountRate: '%0',
        badge: null,
        showDiscount: false,
        features: ['Sınırsız ilan', 'Temel destek', 'Panel erişimi'],
        ctaText: 'Paketi Seç',
        ctaLink: '/panel',
    },
    {
        id: 'quarterly',
        name: '3 Aylık',
        description: 'Düzenli kullanım için dengeli fiyat ve süre avantajı.',
        durationLabel: '3 Ay',
        totalPrice: '999 TL',
        normalPrice: '349 × 3 = 1.047 TL',
        monthlyCost: '333 TL / ay',
        discountAmount: '48 TL',
        discountRate: '%4,59',
        badge: 'Önerilen',
        showDiscount: true,
        features: ['Sınırsız ilan', 'Öncelikli destek', 'Panel erişimi'],
        ctaText: 'Paketi Seç',
        ctaLink: '/panel',
    },
    {
        id: 'semiannual',
        name: '6 Aylık',
        description: 'Orta vadeli planlama yapanlar için ekonomik seçenek.',
        durationLabel: '6 Ay',
        totalPrice: '1.779 TL',
        normalPrice: '349 × 6 = 2.094 TL',
        monthlyCost: '296,5 TL / ay',
        discountAmount: '315 TL',
        discountRate: '%15,04',
        badge: null,
        showDiscount: true,
        features: ['Sınırsız ilan', 'Öncelikli destek', 'Raporlama erişimi'],
        ctaText: 'Paketi Seç',
        ctaLink: '/panel',
    },
    {
        id: 'annual',
        name: '12 Aylık',
        description: 'Uzun vadede en düşük aylık maliyet sağlayan paket.',
        durationLabel: '12 Ay',
        totalPrice: '2.999 TL',
        normalPrice: '349 × 12 = 4.188 TL',
        monthlyCost: '249,9 TL / ay',
        discountAmount: '1.189 TL',
        discountRate: '%28,39',
        badge: 'Popüler',
        showDiscount: true,
        features: ['Sınırsız ilan', 'Öncelikli destek', 'Detaylı raporlama', 'Özel kampanyalar'],
        ctaText: 'Paketi Seç',
        ctaLink: '/panel',
    },
];
</script>
