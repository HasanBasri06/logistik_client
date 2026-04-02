<script setup>
import Content from './Content.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const ornekIlanlar = [
    { from: 'Ankara / Çankaya', to: 'İzmir / Konak', time: '08:00', price: '₺20.000' },
    { from: 'İstanbul / Kadıköy', to: 'Bursa / Osmangazi', time: '07:30', price: '₺12.000' },
    { from: 'İzmir / Bornova', to: 'Antalya / Muratpaşa', time: '06:00', price: '₺22.000' }
];
</script>

<template>
    <Content class="mt-8">
        <div class="flex flex-col items-center gap-4 text-center max-w-xl mb-8 mx-auto">
                <span class="text-sm font-semibold text-primary tracking-wide uppercase">Örnek</span>
                <h2 class="text-2xl md:text-4xl font-bold tracking-tight">Örnek İlanlar</h2>
                <p class="text-gray-500 text-base leading-relaxed">
                    Platformumuzda aktif olan ilanları görebilirsiniz.
                </p>
            </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
                v-for="(ilan, i) in ornekIlanlar"
                :key="i"
                class="group relative flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
                <!-- Üst ince çizgi -->
                <div class="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/80 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div class="flex flex-1 flex-col gap-3">
                    <div class="flex items-center gap-2">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <i class="pi pi-map-marker text-xs"></i>
                        </span>
                        <p class="min-w-0 truncate text-sm font-semibold text-gray-800" :title="ilan.from">{{ ilan.from }}</p>
                    </div>
                    <div class="flex justify-center">
                        <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <i class="pi pi-arrow-down text-[10px] -rotate-90"></i>
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <i class="pi pi-map-marker text-xs"></i>
                        </span>
                        <p class="min-w-0 truncate text-sm font-semibold text-gray-800" :title="ilan.to">{{ ilan.to }}</p>
                    </div>
                </div>

                <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div class="flex items-center gap-2">
                        <span class="inline-flex items-center gap-1 text-xs text-gray-500">
                            <i class="pi pi-clock text-[10px] text-gray-400"></i>
                            {{ ilan.time }}
                        </span>
                        <span class="text-sm font-bold text-primary">{{ ilan.price }}</span>
                    </div>
                    <button
                        type="button"
                        class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                        @click="authStore.openLoginModal()"
                    >
                        Hemen Al
                    </button>
                </div>
            </div>
        </div>
    </Content>
</template>
