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

            <Content class="relative pb-2 px-4 overflow-hidden">
                <div class="mx-auto max-w-3xl rounded-2xl border border-emerald-200/80 bg-linear-to-r from-emerald-50 to-white px-5 py-4 shadow-sm">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div class="text-left">
                            <p class="text-xs font-semibold uppercase tracking-wider text-emerald-700/90">Başlangıç Avantajı</p>
                            <p class="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                                Tüm kullanıcılar için ilk <span class="text-emerald-700">30 gün ücretsiz deneme</span> sunulur.
                            </p>
                            <p class="mt-1 text-xs sm:text-sm text-gray-600">
                                Deneme süresi sonunda size en uygun planı seçerek kesintisiz devam edebilirsiniz.
                            </p>
                        </div>
                        <span class="inline-flex self-start sm:self-auto items-center rounded-full border border-emerald-200 bg-emerald-100/70 px-4 py-2 text-sm font-bold text-emerald-800 whitespace-nowrap">
                            30 Gün Ücretsiz
                        </span>
                    </div>
                </div>
            </Content>

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
                            <div class="mt-2 flex items-center gap-2 flex-wrap">
                                <p class="text-sm font-semibold text-primary whitespace-nowrap">Aylık maliyet: {{ plan.monthlyCost }}</p>
                                <span
                                    v-if="plan.showInstallments && plan.installmentOptions?.length"
                                    class="inline-flex items-center rounded-full border border-primary/20 bg-primary/7 px-2.5 py-1 text-[11px] font-semibold text-primary whitespace-nowrap"
                                >
                                    Taksit fırsatı ile
                                </span>
                            </div>
                            <div v-if="plan.showDiscount" class="mt-2 flex items-center gap-2">
                                <span class="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-xs md:text-sm font-bold whitespace-nowrap">
                                    Toplam İndirim {{ plan.discountAmount }}
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
import { usePricingPlansStore } from '@/stores/pricingPlans';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const pricingPlansStore = usePricingPlansStore();
const { plans } = storeToRefs(pricingPlansStore);
</script>
